"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { replyInChat, type ChatFile } from "@/lib/ai/chat";
import { MissingAiConfigurationError } from "@/lib/ai/client";
import { deriveTitle, validateTitle } from "@/lib/conversations/title";
import { MAX_FILES } from "@/lib/files/ingest";
import { CHAT_RATE_LIMIT, rateLimit } from "@/lib/rate-limit";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";

const FILE_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Mutations de conversation — Server Actions.
 *
 * ## Pourquoi des Server Actions plutôt que des routes API
 *
 * Chaque mutation part d'un formulaire de l'interface, jamais d'un client
 * tiers. Une Server Action porte déjà les cookies de session, donc le client
 * Supabase créé ici est **celui de l'utilisateur** : la RLS s'applique sans
 * qu'aucune ligne ne vérifie la propriété. Une route API aurait exigé le même
 * client, plus une couche de sérialisation, pour la même garantie.
 *
 * ## Ce qui n'est jamais fait ici
 *
 * Aucune de ces fonctions n'utilise `service_role`. Le contournement de RLS
 * imposerait de refaire le filtre de propriété à la main dans chaque action,
 * et il suffirait d'un oubli pour ouvrir un IDOR. La base reste l'autorité.
 *
 * Les identifiants sont passés tels quels à `eq("id", …)` : PostgREST les
 * transmet en paramètre lié, et un identifiant qui n'appartient pas à
 * l'appelant ne touche simplement aucune ligne.
 */

type ActionResult = { ok: true } | { ok: false; message: string };

/** Message unique côté écran — le code exact reste dans les journaux (§21). */
const GENERIC_FAILURE = "Something went wrong. Try again.";

async function loadPromptContext(
  supabase: SupabaseClient,
  conversationId: string,
): Promise<{ idea: string | null; generatedPrompt: string | null }> {
  const { data: linked } = await supabase
    .from("messages")
    .select("generation_id")
    .eq("conversation_id", conversationId)
    .not("generation_id", "is", null)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (!linked?.generation_id) return { idea: null, generatedPrompt: null };

  const { data: generation } = await supabase
    .from("generations")
    .select("idea, output")
    .eq("id", linked.generation_id)
    .maybeSingle();

  return {
    idea: generation?.idea ?? null,
    generatedPrompt: generation?.output ?? null,
  };
}

async function loadHistory(
  supabase: SupabaseClient,
  conversationId: string,
): Promise<{ role: "user" | "assistant"; content: string }[]> {
  const { data } = await supabase
    .from("messages")
    .select("role, content")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  return (data ?? [])
    .filter(
      (row): row is { role: "user" | "assistant"; content: string } =>
        (row.role === "user" || row.role === "assistant") &&
        typeof row.content === "string",
    )
    .map((row) => ({ role: row.role, content: row.content }));
}

async function loadChatFiles(
  supabase: SupabaseClient,
  fileIds: string[] | undefined,
): Promise<{ files: ChatFile[] } | { error: string }> {
  if (!fileIds || fileIds.length === 0) return { files: [] };

  const ids = [...new Set(fileIds)];
  if (ids.length > MAX_FILES || ids.some((id) => !FILE_ID.test(id))) {
    return { error: "One of your files is no longer available." };
  }

  const { data: rows, error } = await supabase
    .from("generation_files")
    .select("filename, mime_type, extracted_text, truncated")
    .in("id", ids)
    .order("created_at", { ascending: true });

  if (error) {
    console.error(
      `[conversations] pièces jointes illisibles — ${error.code ?? "sans code"} : ${error.message}`,
    );
    return { error: "Your files could not be read. Try again." };
  }

  if ((rows?.length ?? 0) !== ids.length) {
    return { error: "One of your files is no longer available." };
  }

  return {
    files: (rows ?? []).map((row) => ({
      filename: row.filename,
      mimeType: row.mime_type,
      text: row.extracted_text,
      truncated: row.truncated,
    })),
  };
}

function storedUserContent(content: string, files: ChatFile[]): string {
  if (files.length === 0) return content;
  return `${content}\n\nAttached: ${files.map((file) => file.filename).join(", ")}`;
}

async function writeAssistantReply(
  supabase: SupabaseClient,
  conversationId: string,
  userId: string,
  userMessage: string,
  files: ChatFile[] = [],
): Promise<ActionResult> {
  const limit = rateLimit(`chat:${userId}`, CHAT_RATE_LIMIT);
  if (!limit.allowed) {
    return {
      ok: false,
      message: "Too many messages in a row. Try again in a moment.",
    };
  }

  try {
    const [context, history] = await Promise.all([
      loadPromptContext(supabase, conversationId),
      loadHistory(supabase, conversationId),
    ]);

    const reply = await replyInChat({
      userMessage,
      history,
      idea: context.idea,
      generatedPrompt: context.generatedPrompt,
      files,
    });

    if (!reply.text) {
      return { ok: false, message: GENERIC_FAILURE };
    }

    const { error } = await supabase.from("messages").insert({
      conversation_id: conversationId,
      user_id: userId,
      role: "assistant",
      content: reply.text,
    });

    if (error) {
      console.error(
        `[conversations] réponse IA non écrite — ${error.code ?? "sans code"} : ${error.message}`,
      );
      return { ok: false, message: GENERIC_FAILURE };
    }

    return { ok: true };
  } catch (error) {
    if (error instanceof MissingAiConfigurationError) {
      console.error(
        "[conversations] configuration IA incomplète",
        error.missing.join(", "),
      );
      return { ok: false, message: "The assistant is unavailable right now." };
    }
    console.error("[conversations] réponse IA impossible", error);
    return { ok: false, message: GENERIC_FAILURE };
  }
}

/**
 * Crée une conversation et y bascule.
 *
 * Le titre vient du premier message quand il y en a un. Le §16 met en garde
 * contre la multiplication de conversations vides : la création est donc
 * **toujours portée par un premier message**, jamais par un bouton seul. Le
 * bouton « New conversation » de l'interface vide le composeur et ne persiste
 * rien tant que rien n'a été écrit.
 */
export async function createConversationAction(
  firstMessage: string,
  fileIds?: string[],
): Promise<ActionResult> {
  const content = firstMessage.trim();
  if (!content) return { ok: false, message: "Write something first." };

  const supabase = await createSupabaseServerClient();
  if (!supabase) return { ok: false, message: GENERIC_FAILURE };

  const { data: user } = await supabase.auth.getUser();
  const userId = user.user?.id;
  if (!userId) return { ok: false, message: GENERIC_FAILURE };

  const attached = await loadChatFiles(supabase, fileIds);
  if ("error" in attached) return { ok: false, message: attached.error };

  const stored = storedUserContent(content, attached.files);

  const { data: conversation, error } = await supabase
    .from("conversations")
    .insert({ user_id: userId, title: deriveTitle(content) })
    .select("id")
    .single();

  if (error || !conversation) {
    console.error(
      `[conversations] création impossible — ${error?.code ?? "sans code"} : ${error?.message}`,
    );
    return { ok: false, message: GENERIC_FAILURE };
  }

  const { error: messageError } = await supabase.from("messages").insert({
    conversation_id: conversation.id,
    user_id: userId,
    role: "user",
    content: stored,
  });

  if (messageError) {
    /*
     * Le message n'a pas pu être écrit : la conversation vide qui vient d'être
     * créée n'a plus de raison d'être. La supprimer évite exactement ce que le
     * §16 interdit — une accumulation d'entrées sans contenu.
     */
    await supabase.from("conversations").delete().eq("id", conversation.id);
    console.error(
      `[conversations] premier message impossible — ${messageError.code ?? "sans code"} : ${messageError.message}`,
    );
    return { ok: false, message: GENERIC_FAILURE };
  }

  const reply = await writeAssistantReply(
    supabase,
    conversation.id,
    userId,
    content,
    attached.files,
  );
  if (!reply.ok) {
    await supabase.from("conversations").delete().eq("id", conversation.id);
    return reply;
  }

  revalidatePath("/chat", "layout");
  redirect(`/chat/${conversation.id}`);
}

/** Renomme. La validation est la même que celle de la contrainte SQL. */
export async function renameConversationAction(
  id: string,
  rawTitle: string,
): Promise<ActionResult> {
  const validation = validateTitle(rawTitle);
  if (!validation.ok) {
    return {
      ok: false,
      message:
        validation.reason === "empty"
          ? "A conversation needs a title."
          : "That title is too long.",
    };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) return { ok: false, message: GENERIC_FAILURE };

  /*
   * `select("id")` après l'update : PostgREST rend zéro ligne quand la RLS a
   * filtré. C'est ainsi qu'un renommage sur la conversation d'autrui se
   * distingue d'un succès — sans jamais dire laquelle des deux causes s'est
   * produite.
   */
  const { data, error } = await supabase
    .from("conversations")
    .update({ title: validation.title })
    .eq("id", id)
    .select("id");

  if (error) {
    console.error(
      `[conversations] renommage impossible — ${error.code ?? "sans code"} : ${error.message}`,
    );
    return { ok: false, message: GENERIC_FAILURE };
  }
  if ((data?.length ?? 0) === 0) {
    return { ok: false, message: "That conversation is no longer available." };
  }

  revalidatePath("/chat", "layout");
  return { ok: true };
}

/**
 * Supprime une conversation. Les messages suivent par cascade en base.
 *
 * Aucune suppression manuelle des messages : la contrainte `on delete cascade`
 * s'exécute dans la même transaction que la suppression de la conversation, ce
 * qu'une suppression en deux requêtes ne garantirait pas.
 */
export async function deleteConversationAction(
  id: string,
): Promise<ActionResult> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { ok: false, message: GENERIC_FAILURE };

  const { data, error } = await supabase
    .from("conversations")
    .delete()
    .eq("id", id)
    .select("id");

  if (error) {
    console.error(
      `[conversations] suppression impossible — ${error.code ?? "sans code"} : ${error.message}`,
    );
    return { ok: false, message: GENERIC_FAILURE };
  }
  if ((data?.length ?? 0) === 0) {
    return { ok: false, message: "That conversation is no longer available." };
  }

  revalidatePath("/chat", "layout");
  return { ok: true };
}

/** Ajoute un message à une conversation existante. */
export async function sendMessageAction(
  conversationId: string,
  rawContent: string,
  fileIds?: string[],
): Promise<ActionResult> {
  const content = rawContent.trim();
  if (!content) return { ok: false, message: "Write something first." };

  const supabase = await createSupabaseServerClient();
  if (!supabase) return { ok: false, message: GENERIC_FAILURE };

  const { data: user } = await supabase.auth.getUser();
  const userId = user.user?.id;
  if (!userId) return { ok: false, message: GENERIC_FAILURE };

  const attached = await loadChatFiles(supabase, fileIds);
  if ("error" in attached) return { ok: false, message: attached.error };

  const stored = storedUserContent(content, attached.files);

  /*
   * `user_id` est posé mais le trigger le réécrit avec le propriétaire réel de
   * la conversation. La policy d'insertion vérifie de son côté que cette
   * conversation appartient bien à l'appelant : écrire chez autrui est refusé
   * par la base, pas par une comparaison ici.
   */
  const { error } = await supabase.from("messages").insert({
    conversation_id: conversationId,
    user_id: userId,
    role: "user",
    content: stored,
  });

  if (error) {
    console.error(
      `[conversations] message refusé — ${error.code ?? "sans code"} : ${error.message}`,
    );
    return { ok: false, message: GENERIC_FAILURE };
  }

  const reply = await writeAssistantReply(
    supabase,
    conversationId,
    userId,
    content,
    attached.files,
  );
  if (!reply.ok) return reply;

  revalidatePath("/chat", "layout");
  return { ok: true };
}
