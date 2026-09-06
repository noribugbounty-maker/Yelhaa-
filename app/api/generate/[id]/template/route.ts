import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import {
  createCompletionClient,
  MissingAiConfigurationError,
  readAiModels,
} from "@/lib/ai/client";
import { GenerationError, runInjection } from "@/lib/ai/engine";
import { MAX_RESELECTS_PER_GENERATION } from "@/lib/config";
import { GENERATE_RATE_LIMIT, rateLimit } from "@/lib/rate-limit";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/supabase/server";
import { extractPalette } from "@/lib/templates/palette";
import {
  ASSET_PATHS,
  DOMAINS,
  type AssetPath,
  type Domain,
} from "@/lib/templates/parse";

export const runtime = "nodejs";

const requestSchema = z.object({ template_id: z.string().uuid() });

/**
 * Re-sélections autorisées par génération — renouveau §7.2.
 *
 * La re-sélection ne consomme **pas** de génération : cette règle métier est
 * intacte. Ce budget est une borne distincte, portée par la ligne de
 * génération elle-même, qui empêche l'appel au modèle d'injection de tourner
 * sans fin sur un plan à trois générations par mois.
 *
 * Cinq essais : assez pour parcourir vraiment le catalogue et revenir sur son
 * choix, trop peu pour que l'endpoint devienne une génération gratuite.
 *
 * La valeur vit dans `lib/config.ts` — la page tarifaire l'annonce, cet
 * endpoint l'applique, et une seule constante les tient d'accord.
 */

/**
 * `POST /api/generate/[id]/template` — renouveau §7.2.
 *
 * Rejoue l'injection sur une génération existante avec un template choisi par
 * l'utilisateur. **Ne consomme aucun quota** : c'est la même génération, pas
 * une nouvelle — l'utilisateur corrige un choix que l'IA a fait pour lui.
 *
 * Il n'y a **ni reclassification, ni second appel #1** : les `extracted_vars`
 * persistées à la génération d'origine sont réutilisées telles quelles. Refaire
 * l'analyse coûterait un appel, produirait potentiellement d'autres vars, et
 * changerait le résultat au-delà de ce que l'utilisateur a demandé.
 *
 * La limitation de débit reste en place. Sans quota pour la borner, cette route
 * serait sinon le seul appel payant du produit sans plafond.
 */
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 },
    );
  }

  const limit = rateLimit(`reselect:${user.id}`, GENERATE_RATE_LIMIT);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many changes in a row. Try again in a moment." },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfterSeconds) },
      },
    );
  }

  const parsed = requestSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Pick a template from the library." },
      { status: 400 },
    );
  }

  const admin = createSupabaseAdminClient();
  if (!admin) {
    return NextResponse.json(
      { error: "Generation service unavailable." },
      { status: 503 },
    );
  }

  // Le filtre sur `user_id` est explicite : le client admin contourne les RLS,
  // donc l'appartenance de la génération se vérifie ici, à la main.
  const { data: generation } = await admin
    .from("generations")
    .select("id, idea, domain, extracted_vars, asset_path")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!generation) {
    return NextResponse.json(
      { error: "That generation was not found." },
      { status: 404 },
    );
  }

  const { data: template } = await admin
    .from("prompt_templates")
    .select("id, slug, title, art_direction, summary, body, domain")
    .eq("id", parsed.data.template_id)
    .eq("is_active", true)
    .maybeSingle();

  if (!template) {
    return NextResponse.json(
      { error: "That template is no longer available." },
      { status: 404 },
    );
  }

  /*
   * Consommation du budget **avant** l'appel au modèle, et non après.
   *
   * L'ordre est le point de la protection : la fonction SQL incrémente et
   * vérifie la borne dans une seule instruction, donc deux requêtes
   * concurrentes — ou un rejeu de la même requête — ne peuvent pas passer
   * ensemble entre la lecture et l'écriture. Décompter après l'injection
   * laisserait une fenêtre où N appels payants partent en parallèle sur un
   * budget de 1.
   *
   * Conséquence assumée : une injection qui échoue a consommé un essai. C'est
   * l'inverse du quota de génération (§4 étape 9), et c'est voulu — ici le
   * compteur existe pour borner le coût, pas pour facturer un résultat.
   *
   * Le `p_user_id` est passé à la fonction, qui le met dans son `where` : la
   * propriété de la génération est revérifiée par l'instruction qui consomme,
   * pas seulement par le `select` plus haut.
   */
  const { data: consumed, error: consumeError } = await admin.rpc(
    "consume_template_reselect",
    {
      p_generation_id: generation.id,
      p_user_id: user.id,
      p_max: MAX_RESELECTS_PER_GENERATION,
    },
  );

  if (consumeError) {
    /*
     * Échec en **fermeture**, jamais en ouverture.
     *
     * Le cas le plus probable est une migration non appliquée. Laisser passer
     * la re-sélection « puisque le compteur est indisponible » rouvrirait
     * exactement la dépense illimitée que ce budget existe pour fermer. Le
     * message serveur nomme la migration pour que la cause soit lisible sans
     * rejouer la requête.
     */
    console.error(
      `[reselect] budget indisponible — ${consumeError.message}. ` +
        "Vérifier que supabase/migrations/20260811090000_reselect_budget.sql " +
        "est appliquée à la base (colonne generations.template_reselects et " +
        "fonction consume_template_reselect).",
    );
    return NextResponse.json(
      { error: "Changing the art direction is temporarily unavailable." },
      { status: 503 },
    );
  }

  if (consumed === null) {
    return NextResponse.json(
      {
        error:
          "You have changed the art direction as many times as this generation allows. Run a new generation to start over.",
        reselects: { limit: MAX_RESELECTS_PER_GENERATION, remaining: 0 },
      },
      { status: 429 },
    );
  }

  const storedVars = (generation.extracted_vars ?? {}) as {
    vars?: Record<string, unknown>;
    domain_vars?: Record<string, unknown>;
  };
  const vars = {
    ...(storedVars.vars ?? {}),
    ...(storedVars.domain_vars ?? {}),
  };

  // Le domaine et le chemin d'assets viennent de la génération d'origine ; à
  // défaut, du template retenu. Rien n'est déduit une seconde fois.
  const domain = (DOMAINS as readonly string[]).includes(
    generation.domain ?? "",
  )
    ? (generation.domain as Domain)
    : (template.domain as Domain);
  const assetPath = (ASSET_PATHS as readonly string[]).includes(
    generation.asset_path ?? "",
  )
    ? (generation.asset_path as AssetPath)
    : "standard";

  try {
    const injection = await runInjection({
      templateBody: template.body,
      vars,
      assetPath,
      domain,
      idea: generation.idea,
      client: createCompletionClient(),
      injectModel: readAiModels().inject,
    });

    const { error: updateError } = await admin
      .from("generations")
      .update({
        template_id: template.id,
        output: injection.output,
        tokens_in: injection.tokensIn,
        tokens_out: injection.tokensOut,
      })
      .eq("id", generation.id)
      .eq("user_id", user.id);

    if (updateError) {
      console.error("[reselect] persistance impossible", updateError.message);
      return NextResponse.json(
        { error: "The result could not be saved. Try again." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      id: generation.id,
      output: injection.output,
      template: {
        id: template.id,
        slug: template.slug,
        title: template.title,
        art_direction: template.art_direction,
        summary: template.summary,
        palette: extractPalette(template.body),
        can_change: consumed < MAX_RESELECTS_PER_GENERATION,
      },
      reselects: {
        limit: MAX_RESELECTS_PER_GENERATION,
        remaining: Math.max(0, MAX_RESELECTS_PER_GENERATION - consumed),
      },
    });
  } catch (error) {
    if (error instanceof MissingAiConfigurationError) {
      console.error(
        "[reselect] configuration IA incomplète",
        error.missing.join(", "),
      );
      return NextResponse.json(
        { error: "Generation service unavailable." },
        { status: 503 },
      );
    }

    if (error instanceof GenerationError) {
      // Aucun quota n'est touché ici, dans aucun cas : il n'y en a jamais eu.
      console.error("[reselect] échec", error.code);
      return NextResponse.json(
        {
          error:
            "That template did not come out clean. Your prompt is unchanged.",
        },
        { status: 502 },
      );
    }

    console.error("[reselect] erreur inattendue", error);
    return NextResponse.json(
      { error: "The change did not go through." },
      { status: 500 },
    );
  }
}
