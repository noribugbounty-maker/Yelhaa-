import "server-only";

import type {
  Conversation,
  ConversationMessage,
  ConversationWithMessages,
  MessageRole,
} from "@/lib/conversations/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Accès aux conversations — **toujours par le client de session**.
 *
 * Aucune fonction de ce module n'utilise le client `service_role`. C'est
 * délibéré : le service contourne RLS, donc toute requête qui passerait par lui
 * devrait refaire à la main le filtre de propriété, et une seule oubliée
 * ouvrirait une fuite. En restant sur le client de session, **la base est la
 * seule autorité** — un identifiant étranger ne rend rien, sans qu'aucune
 * ligne de TypeScript n'ait à le vérifier.
 *
 * Conséquence directe sur le §27 du cahier des charges : il n'existe nulle part
 * de « lire tout puis filtrer côté React », parce qu'il n'existe pas de lecture
 * globale.
 */

/**
 * Codes signifiant « rien pour vous », pas « le service est en panne ».
 *
 * `42501` est le refus de privilège Postgres — c'est ce que reçoit une requête
 * **sans session**, puisque `anon` n'a aucun GRANT sur ces tables. `PGRST301`
 * est son équivalent PostgREST quand le jeton manque ou a expiré.
 *
 * Les traiter comme une indisponibilité rendait `503` à un visiteur anonyme :
 * sémantiquement faux — le service va très bien — et légèrement bavard, parce
 * qu'un `503` se distingue du `404` que reçoit un identifiant inexistant. Les
 * deux rendent désormais la même chose.
 */
const NO_ACCESS_CODES = new Set(["42501", "PGRST301"]);

/**
 * Identifiant qui ne peut désigner aucune ligne.
 *
 * `22P02` est levé par Postgres quand une chaîne ne se convertit pas en `uuid` :
 * c'est ce que produit `/chat/not-a-uuid`. Une saisie invalide est une erreur
 * du client, pas une panne du service — la rendre en `503` accusait le serveur
 * à la place de la requête, et distinguait un identifiant malformé d'un
 * identifiant simplement absent.
 */
const MALFORMED_ID_CODE = "22P02";

const meansNothingFound = (code: string | undefined): boolean =>
  NO_ACCESS_CODES.has(code ?? "") || code === MALFORMED_ID_CODE;

/**
 * Journalise une erreur PostgREST **sans déverser la réponse entière**.
 *
 * Constaté en test : une URL contenant `drop table` est interceptée par le WAF
 * de Supabase, qui répond une page HTML Cloudflare à la place du JSON attendu.
 * Le client la remonte alors comme un message d'erreur de plusieurs milliers de
 * caractères, et la ligne de journal devenait illisible.
 *
 * Le comportement du service, lui, est correct : la requête est refusée en
 * amont, aucune donnée ne circule, et l'appelant reçoit un `503` — l'échec vient
 * bien d'une dépendance, pas d'un identifiant introuvable.
 */
function logQueryFailure(
  scope: string,
  error: { code?: string | null; message?: string },
): void {
  const message = (error.message ?? "").replace(/\s+/g, " ").slice(0, 200);
  console.error(
    `[conversations] ${scope} — ${error.code ?? "sans code"} : ${message}`,
  );
}

/** Ce que la barre latérale a besoin de connaître, et rien de plus. */
const CONVERSATION_COLUMNS = "id, title, created_at, updated_at";
const MESSAGE_COLUMNS = "id, role, content, created_at, generation_id";

type ConversationRow = {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
};

type MessageRow = {
  id: string;
  role: string;
  content: string;
  created_at: string;
  generation_id: string | null;
};

const toConversation = (row: ConversationRow): Conversation => ({
  id: row.id,
  title: row.title,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const toMessage = (row: MessageRow): ConversationMessage => ({
  id: row.id,
  role: row.role as MessageRole,
  content: row.content,
  createdAt: row.created_at,
  generationId: row.generation_id,
});

/**
 * Résultat en trois états, jamais confondus.
 *
 * C'est le correctif que la FAQ a déjà exigé : une liste vide n'est pas une
 * panne. Rendre « impossible de charger » sur une base simplement vide envoie
 * l'utilisateur chercher un problème qui n'existe pas.
 */
export type ConversationsResult =
  { status: "ok"; conversations: Conversation[] } | { status: "unavailable" };

export async function listConversations(): Promise<ConversationsResult> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { status: "unavailable" };

  const { data, error } = await supabase
    .from("conversations")
    .select(CONVERSATION_COLUMNS)
    .order("updated_at", { ascending: false });

  if (error) {
    // Sans session, la liste est vide — ce n'est pas une panne.
    if (NO_ACCESS_CODES.has(error.code ?? "")) {
      return { status: "ok", conversations: [] };
    }
    // Le code reste dans les journaux, jamais à l'écran (§21).
    logQueryFailure("liste impossible", error);
    return { status: "unavailable" };
  }

  return {
    status: "ok",
    conversations: (data ?? []).map((row) => toConversation(row)),
  };
}

export type ConversationResult =
  | { status: "ok"; conversation: ConversationWithMessages }
  /** Inexistante **ou** appartenant à quelqu'un d'autre — indistinguable. */
  | { status: "not-found" }
  | { status: "unavailable" };

/**
 * Une conversation et ses messages.
 *
 * **« Introuvable » et « pas à vous » rendent la même chose.** Distinguer les
 * deux dirait à un attaquant qu'un identifiant existe, ce qui est déjà une
 * information. La RLS rend zéro ligne dans les deux cas : le code n'a donc même
 * pas de quoi les distinguer, ce qui rend la fuite structurellement impossible.
 */
export async function getConversation(id: string): Promise<ConversationResult> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { status: "unavailable" };

  const { data, error } = await supabase
    .from("conversations")
    .select(CONVERSATION_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    if (meansNothingFound(error.code)) return { status: "not-found" };
    logQueryFailure("lecture impossible", error);
    return { status: "unavailable" };
  }
  if (!data) return { status: "not-found" };

  const { data: messages, error: messagesError } = await supabase
    .from("messages")
    .select(MESSAGE_COLUMNS)
    .eq("conversation_id", id)
    .order("created_at", { ascending: true });

  if (messagesError) {
    if (meansNothingFound(messagesError.code)) {
      return { status: "not-found" };
    }
    logQueryFailure("messages illisibles", messagesError);
    return { status: "unavailable" };
  }

  return {
    status: "ok",
    conversation: {
      ...toConversation(data),
      messages: (messages ?? []).map((row) => toMessage(row)),
    },
  };
}

/** Conversation liée à une génération — pour « continuer dans le chat ». */
export async function conversationIdForGeneration(
  generationId: string,
): Promise<string | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const { data } = await supabase
    .from("messages")
    .select("conversation_id")
    .eq("generation_id", generationId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  return data?.conversation_id ?? null;
}

/** Identifiant de la conversation la plus récente, pour la redirection. */
export async function latestConversationId(): Promise<string | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const { data } = await supabase
    .from("conversations")
    .select("id")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return data?.id ?? null;
}
