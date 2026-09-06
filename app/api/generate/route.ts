import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { MissingAiConfigurationError } from "@/lib/ai/client";
import {
  GenerationError,
  IDEA_MAX_LENGTH,
  IDEA_MIN_LENGTH,
  runGeneration,
} from "@/lib/ai/engine";
import type { SelectableTemplate } from "@/lib/ai/select-template";
import { isAdminUser } from "@/lib/auth/admin";
import { ensureProfile } from "@/lib/auth/profile";
import { GENERATE_RATE_LIMIT, rateLimit } from "@/lib/rate-limit";
import {
  readQuotaState,
  reserveGeneration,
  unmeteredReservation,
} from "@/lib/quota";
import { deriveTitle } from "@/lib/conversations/title";
import { MAX_FILES } from "@/lib/files/ingest";
import {
  createSupabaseAdminClient,
  type SupabaseAdminClient,
} from "@/lib/supabase/admin";
import {
  createSupabaseServerClient,
  getCurrentUser,
} from "@/lib/supabase/server";
import {
  conversationIdForClient,
  readNonEmptyOutput,
} from "@/lib/generate/contract";
import { logGenerate } from "@/lib/generate/observe";
import { loadSelectableCatalog } from "@/lib/templates/catalog";
import { extractPalette } from "@/lib/templates/palette";
import { DOMAINS } from "@/lib/templates/parse";

export const runtime = "nodejs";

const requestSchema = z.object({
  idea: z.string().min(IDEA_MIN_LENGTH).max(IDEA_MAX_LENGTH),
  projectType: z.enum(DOMAINS).nullish(),
  /*
   * Identifiants de pièces jointes déjà envoyées et validées. Le client
   * n'envoie **jamais** de contenu ici : il n'envoie que des références, et
   * c'est le serveur qui relit le texte. Une référence qui appartient à
   * quelqu'un d'autre ne remonte simplement aucune ligne — la RLS filtre, sans
   * qu'aucune comparaison ne soit écrite ici.
   */
  fileIds: z.array(z.string().uuid()).max(MAX_FILES).optional(),
});

/**
 * `POST /api/generate` — build prompt §4.
 *
 * Exécution serveur uniquement. L'ordre des étapes est celui du §4 et il
 * compte : le quota est vérifié avant tout appel payant, et décompté seulement
 * après une validation de sortie réussie.
 */
export async function POST(request: NextRequest) {
  logGenerate("api", "request received");

  // 1. Authentification
  const user = await getCurrentUser();
  if (!user) {
    logGenerate("api", "auth resolved", { authenticated: false });
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 },
    );
  }
  logGenerate("api", "auth resolved", { authenticated: true });

  // 2. Limitation de débit
  const limit = rateLimit(`generate:${user.id}`, GENERATE_RATE_LIMIT);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many generations in a row. Try again in a moment." },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfterSeconds) },
      },
    );
  }

  /*
   * Deux clients, deux rôles. `admin` sert au catalogue et au compteur, que
   * l'utilisateur ne doit pas pouvoir lire ni écrire directement. `session`
   * sert à tout ce qui lui appartient — sa conversation, ses messages — pour
   * que la RLS reste l'autorité plutôt qu'une vérification écrite ici.
   */
  const session = await createSupabaseServerClient();
  const admin = createSupabaseAdminClient();
  if (!admin) {
    return NextResponse.json(
      { error: "Generation service unavailable." },
      { status: 503 },
    );
  }

  // 4. Validation de l'entrée (avant le quota : une idée invalide ne coûte rien)
  const parsed = requestSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: `Your idea must be between ${IDEA_MIN_LENGTH} and ${IDEA_MAX_LENGTH} characters.`,
      },
      { status: 400 },
    );
  }

  /*
   * 3. Quota — **réservation atomique, avant tout appel payant.**
   *
   * L'incrément et le contrôle de la limite tiennent dans une seule
   * instruction SQL. Un refus se produit donc ici, avant `runGeneration`, et
   * aucune requête refusée n'atteint le modèle. Chaque chemin d'échec en dessous
   * appelle `quota.refund()`, dont le règlement est à usage unique.
   */
  /*
   * Un compte administrateur ne réserve rien. Le contournement porte sur
   * l'appel lui-même, pas sur une limite gonflée : `reserve_generation` n'est
   * jamais exécutée, donc `usage_counters` n'est pas touchée et il n'y a
   * ensuite rien à rembourser sur les chemins d'échec.
   *
   * Le rôle vient de `isAdminUser(user)`, où `user` est celui rendu par
   * `getCurrentUser()` — donc validé auprès de Supabase. Aucun champ de la
   * requête n'entre dans cette décision.
   */
  /*
   * `generations.user_id` référence `public.profiles(id)`. L'UUID Auth est
   * le bon identifiant — encore faut-il que la ligne profil existe. On la
   * crée ici, avant toute réservation et avant tout appel payant, pour ne
   * pas découvrir la FK après 50 s de modèle.
   */
  const profile = await ensureProfile(admin, user);
  if (!profile.ok) {
    console.error("[generate] profil impossible à garantir", profile.error);
    logGenerate("api", "profile ensured", { ok: false });
    return NextResponse.json(
      { error: "Generation service unavailable." },
      { status: 503 },
    );
  }
  logGenerate("api", "profile ensured", { ok: true });

  const isAdmin = isAdminUser(user);
  const quota = isAdmin
    ? unmeteredReservation((await readQuotaState(session ?? admin, profile.id))?.plan ?? "free")
    : await reserveGeneration(admin, profile.id);

  if (!quota.allowed) {
    logGenerate("api", "quota reserved", {
      allowed: false,
      reason: quota.reason,
    });
    // Une panne de réservation n'est pas un quota atteint : annoncer « limite
    // atteinte » à quelqu'un qui n'a rien consommé l'enverrait acheter un plan
    // pour un problème qui n'est pas le sien.
    if (quota.reason === "unavailable") {
      return NextResponse.json(
        { error: "Generation service unavailable." },
        { status: 503 },
      );
    }

    return NextResponse.json(
      {
        error: "Generation quota reached.",
        quota: {
          plan: quota.state.plan,
          limit: quota.state.limit,
          used: quota.state.used,
          remaining: 0,
          resets_at: quota.state.resetsAt,
        },
      },
      { status: 402 },
    );
  }
  logGenerate("api", "quota reserved", { allowed: true });

  // 5 à 9. Moteur — le RAG lit `content/templates`. Les identifiants
  // Supabase sont recollés par slug pour la persistance, sans changer le classement.
  const loadTemplates = async (
    domain: (typeof DOMAINS)[number],
  ): Promise<SelectableTemplate[]> => {
    const fromFiles = loadSelectableCatalog(domain);
    if (fromFiles.length === 0) return [];

    const { data, error } = await admin
      .from("prompt_templates")
      .select("id, slug")
      .eq("domain", domain)
      .eq("is_active", true);

    if (error)
      throw new Error(`Lecture du catalogue impossible : ${error.message}`);

    const ids = new Map((data ?? []).map((row) => [row.slug, row.id]));
    return fromFiles.map((template) => ({
      ...template,
      id: ids.get(template.slug) ?? template.id,
    }));
  };

  /*
   * Relecture des pièces jointes. Le texte vient de la base, jamais du corps
   * de la requête : c'est ce qui rend impossible d'injecter un contexte que le
   * serveur n'a pas inspecté à l'envoi.
   *
   * La lecture passe par le client de session, donc un identifiant volé ne
   * remonte rien. Le tri est fixé pour que deux générations sur les mêmes
   * fichiers produisent le même contexte.
   */
  let files: {
    id: string;
    filename: string;
    mimeType: string;
    text: string;
    truncated: boolean;
  }[] = [];

  if (session && parsed.data.fileIds && parsed.data.fileIds.length > 0) {
    const { data: rows, error: filesError } = await session
      .from("generation_files")
      .select("id, filename, mime_type, extracted_text, truncated")
      .in("id", parsed.data.fileIds)
      .order("created_at", { ascending: true });

    if (filesError) {
      console.error(
        `[generate] pièces jointes illisibles — ${filesError.code ?? "sans code"} : ${filesError.message}`,
      );
      await quota.refund();
      return NextResponse.json(
        { error: "Your files could not be read. Try again." },
        { status: 503 },
      );
    }

    files = (rows ?? []).map((row) => ({
      id: row.id,
      filename: row.filename,
      mimeType: row.mime_type,
      text: row.extracted_text,
      truncated: row.truncated,
    }));

    /*
     * Un identifiant demandé qui ne remonte pas est soit inexistant, soit
     * celui d'un autre utilisateur. Générer quand même produirait un résultat
     * sans le contexte que l'utilisateur croit avoir fourni — mieux vaut le
     * dire, et rendre l'unité réservée.
     */
    if (files.length !== parsed.data.fileIds.length) {
      await quota.refund();
      return NextResponse.json(
        { error: "One of your files is no longer available." },
        { status: 404 },
      );
    }
  }

  try {
    logGenerate("api", "generation started");
    const result = await runGeneration({
      idea: parsed.data.idea,
      projectType: parsed.data.projectType ?? null,
      loadTemplates,
      files,
    });

    const output = readNonEmptyOutput(result.output);
    if (!output) {
      logGenerate("api", "generation completed", { empty: true });
      await quota.refund();
      return NextResponse.json(
        { error: "The generation did not complete. Try again." },
        { status: 502 },
      );
    }
    logGenerate("api", "generation completed", { outputLength: output.length });

    // 10. Persistance. Le quota est déjà réservé ; il n'y a plus rien à
    // décompter, seulement à rendre si quelque chose échoue.
    const { data: inserted, error: insertError } = await admin
      .from("generations")
      .insert({
        user_id: profile.id,
        idea: parsed.data.idea.trim(),
        template_id: /^[0-9a-f-]{36}$/i.test(result.selection.template.id)
          ? result.selection.template.id
          : null,
        domain: result.domain,
        extracted_vars: JSON.parse(JSON.stringify(result.classification)),
        asset_path: result.assetPath,
        output,
        tokens_in: result.tokensIn,
        tokens_out: result.tokensOut,
        project_type_source: result.projectTypeSource,
      })
      .select("id")
      .single();

    if (insertError || !inserted) {
      console.error("[generate] persistance impossible", insertError?.message);
      await quota.refund();
      return NextResponse.json(
        { error: "The result could not be saved. Try again." },
        { status: 500 },
      );
    }

    /*
     * 10bis. Conversation. La table `conversations` et la colonne
     * `messages.generation_id` existaient depuis `20260812090000`, mais rien
     * ne les remplissait : une génération réussie ne laissait aucune trace
     * dans l'historique de discussion, et `/chat` restait vide quoi qu'on
     * génère. Le lien était prévu par le schéma, pas par le code.
     *
     * Écrit avec le **client de session**, pas `service_role` : les policies
     * d'insertion vérifient la propriété, donc aucun filtre n'est réécrit ici.
     * Le trigger `messages_set_owner` réimpose de toute façon le propriétaire
     * réel, ce qui rend un `user_id` falsifié sans effet.
     *
     * **Un échec ici ne fait pas échouer la génération.** Elle est déjà
     * produite, payée et persistée ; `/prompt/[id]` et `/workspace/[id]` la
     * servent sans conversation. Rembourser ou renvoyer 500 détruirait un
     * résultat valide pour un défaut d'agrément.
     */
    /*
     * Rattachement des pièces jointes. `generation_id` est la seule colonne
     * que le client peut écrire — le GRANT est borné à elle — donc cette
     * requête ne peut pas être détournée pour réécrire un contexte.
     */
    if (session && files.length > 0) {
      const { error: attachError } = await session
        .from("generation_files")
        .update({ generation_id: inserted.id })
        .in(
          "id",
          files.map((file) => file.id),
        );
      if (attachError) {
        console.error(
          `[generate] rattachement des fichiers impossible — ${attachError.code ?? "sans code"} : ${attachError.message}`,
        );
      }
    }

    const persistChat = async (
      client: SupabaseAdminClient | NonNullable<typeof session>,
    ): Promise<{ messagesWritten: boolean; conversationId: string | null }> => {
      const { data: conversation, error: conversationError } = await client
        .from("conversations")
        .insert({
          user_id: profile.id,
          title: deriveTitle(parsed.data.idea),
        })
        .select("id")
        .single();

      if (conversationError || !conversation) {
        console.error(
          `[generate] conversation non créée — ${conversationError?.code ?? "sans code"} : ${conversationError?.message ?? "inconnue"}`,
        );
        return { messagesWritten: false, conversationId: null };
      }

      const { error: messagesError } = await client.from("messages").insert([
        {
          conversation_id: conversation.id,
          user_id: profile.id,
          role: "user",
          content: parsed.data.idea.trim(),
        },
        {
          conversation_id: conversation.id,
          user_id: profile.id,
          role: "assistant",
          content: output,
          generation_id: inserted.id,
        },
      ]);

      if (messagesError) {
        console.error(
          `[generate] messages non écrits — ${messagesError.code ?? "sans code"} : ${messagesError.message}`,
        );
        await client.from("conversations").delete().eq("id", conversation.id);
        return { messagesWritten: false, conversationId: null };
      }

      return { messagesWritten: true, conversationId: conversation.id };
    };

    let messagesWritten = false;
    let rawConversationId: string | null = null;

    if (session) {
      const first = await persistChat(session);
      messagesWritten = first.messagesWritten;
      rawConversationId = first.conversationId;
    }

    if (!messagesWritten) {
      const fallback = await persistChat(admin);
      messagesWritten = fallback.messagesWritten;
      rawConversationId = fallback.conversationId;
    }

    const conversationId = conversationIdForClient(
      rawConversationId,
      messagesWritten,
    );
    logGenerate("api", "persistence completed", {
      generation: true,
      messagesWritten,
      conversation: Boolean(conversationId),
    });

    // 11. Réponse
    logGenerate("api", "response sent", { status: 200 });
    return NextResponse.json({
      id: inserted.id,
      /*
       * `null` quand les messages n'ont pas été écrits : le client doit
       * ouvrir `/prompt/[id]`, jamais un chat vide.
       */
      conversation_id: conversationId,
      output,
      /*
       * Renouveau §7.1 — la sélection est exposée pour alimenter le panneau et
       * le sélecteur du §5.5 : identifiant, slug, résumé, palette lue dans le
       * corps du template, et le booléen qui dit que le choix est modifiable.
       * Aucune nouvelle table, aucun champ inventé — uniquement des colonnes
       * qui existent déjà dans `prompt_templates`.
       */
      template: {
        id: result.selection.template.id,
        slug: result.selection.template.slug,
        title: result.selection.template.title,
        art_direction: result.selection.template.art_direction,
        summary: result.selection.template.summary,
        palette: extractPalette(result.selection.template.body),
        can_change: true,
      },
      quota_remaining: quota.state.remaining,
      meta: {
        domain: result.domain,
        project_type_source: result.projectTypeSource,
        asset_path: result.assetPath,
        selection_score: result.selection.score,
        selection_breakdown: result.selection.breakdown,
        regenerated: result.regenerated,
        missing: result.classification.missing,
        tokens_in: result.tokensIn,
        tokens_out: result.tokensOut,
        durations_ms: result.durations,
      },
    });
  } catch (error) {
    /*
     * Tout chemin d'erreur rend l'unité réservée : « une génération échouée ne
     * consomme jamais de quota » (§7).
     *
     * Le résultat est **conservé**, pas supposé. `refund()` renvoie le
     * compteur après remboursement, ou `null` si rien n'a été rendu (échec
     * base). Annoncer un quota restauré qui ne l'a pas été enverrait
     * l'utilisateur relancer une génération qui sera refusée.
     */
    const refundedUsed = await quota.refund();
    const remainingAfterRefund =
      refundedUsed === null
        ? null
        : Math.max(quota.state.limit - refundedUsed, 0);

    if (error instanceof MissingAiConfigurationError) {
      console.error(
        "[generate] configuration IA incomplète",
        error.missing.join(", "),
      );
      return NextResponse.json(
        { error: "Generation service unavailable." },
        { status: 503 },
      );
    }

    if (error instanceof GenerationError) {
      console.error(
        "[generate] échec",
        error.code,
        JSON.stringify(error.attempts),
      );
      const status = error.code.startsWith("idea-") ? 400 : 502;
      return NextResponse.json(
        {
          error:
            error.code === "validation-failed"
              ? "The generation did not complete. Your idea is safe — run it again whenever you want."
              : "The generation did not complete. Try again.",
          /*
           * Omis quand le remboursement a échoué : le serveur ne connaît alors
           * pas l'état réel du compteur, et une valeur inventée vaut moins que
           * pas de valeur du tout.
           */
          ...(remainingAfterRefund === null
            ? {}
            : { quota_remaining: remainingAfterRefund }),
        },
        { status },
      );
    }

    console.error("[generate] erreur inattendue", error);
    return NextResponse.json(
      { error: "The generation did not complete. Try again." },
      { status: 500 },
    );
  }
}
