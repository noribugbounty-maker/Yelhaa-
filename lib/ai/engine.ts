import "server-only";

import { z } from "zod";

import { resolveAssetPath } from "@/lib/ai/asset-path";
import {
  createCompletionClient,
  maxInjectOutputTokens,
  maxOutputTokens,
  readAiModels,
  type CompletionClient,
} from "@/lib/ai/client";
import {
  CLASSIFY_SYSTEM_PROMPT,
  FILE_CONTEXT_SYSTEM_ADDENDUM,
  INJECT_SYSTEM_PROMPT,
  buildFileContextBlock,
  buildInjectUserMessage,
  domainOverrideAddendum,
} from "@/lib/ai/prompts";
import { prepareTemplateBody } from "@/lib/ai/prepare-template";
import {
  retrieveTemplates,
  type RetrievedTemplate,
} from "@/lib/ai/rag";
import type { SelectableTemplate } from "@/lib/ai/select-template";
import { validateOutput, type ValidationResult } from "@/lib/ai/validate";
import { IDEA_MAX_LENGTH, IDEA_MIN_LENGTH } from "@/lib/config";
import { DOMAINS, type AssetPath, type Domain } from "@/lib/templates/parse";

export { IDEA_MAX_LENGTH, IDEA_MIN_LENGTH };

const classificationSchema = z.object({
  domain: z.enum(DOMAINS),
  sub_type: z.string().nullish(),
  art_direction_hints: z.array(z.string()).default([]),
  confidence: z.number().nullish(),
  vars: z
    .object({
      BRAND_NAME: z.string().nullish(),
      VERTICAL: z.string().nullish(),
      TAGLINE: z.string().nullish(),
      HERO_HEADLINE: z.string().nullish(),
      VALUE_PROP: z.string().nullish(),
      PRIMARY_CTA: z.string().nullish(),
      SECONDARY_CTA: z.string().nullish(),
      ITEM: z.array(z.string()).default([]),
      DETAIL: z.array(z.string()).default([]),
      ACCENT_HEX: z.string().nullish(),
      CONTACT_EMAIL: z.string().nullish(),
      HERO_ASSET: z.string().nullish(),
      SCREEN: z.array(z.string()).nullish(),
    })
    .passthrough(),
  domain_vars: z.record(z.string(), z.unknown()).default({}),
  missing: z.array(z.string()).default([]),
});

export type Classification = z.infer<typeof classificationSchema>;

export type GenerationAttempt = {
  attempt: number;
  validation: ValidationResult;
  durationMs: number;
  tokensIn: number;
  tokensOut: number;
};

export type GenerationSuccess = {
  output: string;
  classification: Classification;
  domain: Domain;
  projectTypeSource: "user" | "classifier";
  assetPath: AssetPath;
  selection: RetrievedTemplate;
  runnerUp: RetrievedTemplate | null;
  attempts: GenerationAttempt[];
  regenerated: boolean;
  tokensIn: number;
  tokensOut: number;
  durations: { classify: number; inject: number; total: number };
};

export type GenerationErrorCode =
  | "idea-too-short"
  | "idea-too-long"
  | "classification-unreadable"
  | "no-template"
  | "validation-failed";

export class GenerationError extends Error {
  readonly code: GenerationErrorCode;
  readonly attempts: GenerationAttempt[];

  constructor(
    message: string,
    code: GenerationErrorCode,
    attempts: GenerationAttempt[] = [],
  ) {
    super(message);
    this.name = "GenerationError";
    this.code = code;
    this.attempts = attempts;
  }
}

/** Le catalogue est injecté : Supabase en production, fichiers en banc d'essai. */
export type TemplateLoader = (domain: Domain) => Promise<SelectableTemplate[]>;

/**
 * Fichier joint, déjà validé, extrait et borné par `lib/files/ingest.ts`.
 *
 * Le moteur ne lit jamais un fichier : il reçoit du texte que le serveur a
 * inspecté. C'est ce qui permet de garantir le budget et de refuser un binaire
 * avant qu'il approche d'un appel payant.
 */
export type GenerationFileContext = {
  filename: string;
  mimeType: string;
  text: string;
  truncated: boolean;
};

export type InjectionInput = {
  /** Corps du template retenu, avec ses `{{VARIABLES}}`. */
  templateBody: string;
  /** Vars extraites à l'appel #1, déjà fusionnées avec `domain_vars`. */
  vars: Record<string, unknown>;
  assetPath: AssetPath;
  domain: Domain;
  /** Idée d'origine — source de vérité des chiffres autorisés à la validation. */
  idea: string;
  client: CompletionClient;
  injectModel: string;
  /** Fichiers joints. Vide ou absent : l'appel est celui d'avant, à l'octet près. */
  files?: readonly GenerationFileContext[];
};

export type InjectionResult = {
  output: string;
  attempts: GenerationAttempt[];
  regenerated: boolean;
  tokensIn: number;
  tokensOut: number;
  durationMs: number;
};

function recoverableScaffoldingIssues(
  validation: ValidationResult,
): Array<"placeholder" | "fallback"> {
  return validation.issues
    .map((issue) => issue.reason)
    .filter(
      (reason): reason is "placeholder" | "fallback" =>
        reason === "placeholder" || reason === "fallback",
    );
}

/**
 * Appel #2 — injection, validation, jusqu'à deux régénérations.
 *
 * Tentatives 1–2 toujours. Tentative 3 seulement si l'essai 2 a échoué
 * sur un artefact récupérable (placeholder / fallback), pas sur une
 * sortie vide ni un chiffre finance inventé.
 *
 * Extrait de `runGeneration` pour être **réutilisé par la re-sélection de
 * template** (renouveau §7.2) : changer de direction artistique rejoue
 * exactement ce travail-là, sur les `extracted_vars` déjà persistées. Aucune
 * reclassification, aucun second appel #1, et donc aucun quota supplémentaire —
 * c'est la même génération, pas une nouvelle.
 */
export async function runInjection({
  templateBody,
  vars,
  assetPath,
  domain,
  idea,
  client,
  injectModel,
  files = [],
}: InjectionInput): Promise<InjectionResult> {
  const fileContext = buildFileContextBlock(files);

  /*
   * Les artefacts mécaniques — marqueurs, noms de chemin, {{VAR}} et
   * (fallback …) — partent **avant** l'appel. Le modèle ne peut plus
   * échouer à les retirer. Le retry ci-dessous n'est qu'un filet.
   */
  const prepared = prepareTemplateBody(templateBody, assetPath, vars);
  const injectUser = buildInjectUserMessage(
    prepared.body,
    vars,
    assetPath,
    fileContext,
    idea,
  );

  const attempts: GenerationAttempt[] = [];
  let tokensIn = 0;
  let tokensOut = 0;
  let durationMs = 0;
  const injectBudget = maxInjectOutputTokens();
  const injectRetryBudget = Math.max(maxOutputTokens(), injectBudget * 2);
  let previousWasTruncated = false;
  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const injectSystem = [INJECT_SYSTEM_PROMPT];
    if (fileContext) injectSystem.push(FILE_CONTEXT_SYSTEM_ADDENDUM);
    const previous = attempts.at(-1);
    const previousRecoverable = previous
      ? recoverableScaffoldingIssues(previous.validation)
      : [];
    /*
     * Le message de régénération vise un texte qui contient encore des
     * artefacts (placeholder / fallback). Une sortie vide par troncature
     * n'en a pas : changer budget et effort suffit. Si l'essai suivant
     * produit du texte sale, l'essai d'après reçoit le feedback.
     */
    if (previousRecoverable.length > 0) {
      const classes = [...new Set(previousRecoverable)].join(", ");
      injectSystem.push(
        `REGENERATION — your previous output was rejected because it still contained residual template scaffolding of class: ${classes}. ` +
          `Remove every unresolved placeholder and every parenthesised fallback default. ` +
          `Output the finished prompt only.`,
      );
    }

    const truncationRetry =
      previousWasTruncated && previousRecoverable.length === 0;

    const injectCall = await client.complete({
      model: injectModel,
      system: injectSystem,
      user: injectUser,
      maxOutputTokens:
        truncationRetry || previousWasTruncated || attempt >= 3
          ? injectRetryBudget
          : injectBudget,
      reasoningEffort: truncationRetry ? "minimal" : "low",
    });

    durationMs += injectCall.durationMs;
    tokensIn += injectCall.tokensIn;
    tokensOut += injectCall.tokensOut;
    const output = injectCall.text.trim();
    previousWasTruncated =
      injectCall.truncated === true ||
      (!output && injectCall.finishReason === "length");

    /*
     * La source de vérité des chiffres autorisés : l'idée de l'utilisateur, le
     * corps du template qui porte ses propres valeurs techniques, **et le
     * texte des fichiers joints**.
     *
     * Ce troisième terme n'est pas un assouplissement, c'est une correction de
     * cohérence. Un fichier est une déclaration de l'utilisateur au même titre
     * que son idée ; sans lui, un tarif ou une date lus dans un cahier des
     * charges seraient traités comme inventés et feraient échouer la
     * génération après deux appels payants.
     */
    const validation = validateOutput(output, {
      domain,
      sourceText: [idea, templateBody, ...files.map((file) => file.text)].join(
        "\n",
      ),
    });

    attempts.push({
      attempt,
      validation,
      durationMs: injectCall.durationMs,
      tokensIn: injectCall.tokensIn,
      tokensOut: injectCall.tokensOut,
    });

    if (validation.valid) {
      return {
        output,
        attempts,
        regenerated: attempt > 1,
        tokensIn,
        tokensOut,
        durationMs,
      };
    }

    const canRetry =
      attempt < 2 ||
      (attempt === 2 && recoverableScaffoldingIssues(validation).length > 0);
    if (!canRetry) break;
  }

  throw new GenerationError(
    "La sortie n'a pas passé la validation après régénération.",
    "validation-failed",
    attempts,
  );
}

export type GenerationInput = {
  idea: string;
  /** Pill du sélecteur de type de projet. Impose le domaine quand elle est là. */
  projectType?: Domain | null;
  loadTemplates: TemplateLoader;
  /** Injectable pour le banc d'essai. Par défaut : le client OpenAI. */
  client?: CompletionClient;
  /** Injectables avec le client. Par défaut : lus dans `process.env`. */
  models?: { classify: string; inject: string };
  /**
   * Fichiers joints, déjà validés et bornés par `lib/files/ingest.ts`.
   *
   * Absent ou vide, **rien ne change** : ni le prompt système, ni le message
   * utilisateur, ni la source de validation. C'est la garantie que la
   * génération sans pièce jointe se comporte exactement comme avant.
   */
  files?: readonly GenerationFileContext[];
};

/** Retire une éventuelle clôture markdown autour du JSON de l'appel #1. */
function stripFences(text: string): string {
  const trimmed = text.trim();
  if (!trimmed.startsWith("```")) return trimmed;
  return trimmed
    .replace(/^```[a-z]*\s*/i, "")
    .replace(/```\s*$/, "")
    .trim();
}

export async function runGeneration({
  idea,
  projectType,
  loadTemplates,
  client,
  models: injectedModels,
  files = [],
}: GenerationInput): Promise<GenerationSuccess> {
  const trimmedIdea = idea.trim();
  if (trimmedIdea.length < IDEA_MIN_LENGTH) {
    throw new GenerationError("Idée trop courte.", "idea-too-short");
  }
  if (trimmedIdea.length > IDEA_MAX_LENGTH) {
    throw new GenerationError("Idée trop longue.", "idea-too-long");
  }

  const models = injectedModels ?? readAiModels();
  const completion = client ?? createCompletionClient();
  const startedAt = Date.now();

  // --- Appel #1 : classification -------------------------------------------
  const fileContext = buildFileContextBlock(files);

  const classifySystem = [CLASSIFY_SYSTEM_PROMPT];
  if (projectType) classifySystem.push(domainOverrideAddendum(projectType));
  if (fileContext) classifySystem.push(FILE_CONTEXT_SYSTEM_ADDENDUM);

  /*
   * Le message reste l'idée seule quand rien n'est joint. Avec des fichiers,
   * l'idée est étiquetée pour que la frontière entre la demande et le contexte
   * soit lisible — sans étiquette, un cahier des charges de vingt lignes noierait
   * la phrase qui dit ce que l'utilisateur veut.
   */
  const classifyUser = fileContext
    ? `IDEA:\n${trimmedIdea}\n\n${fileContext}`
    : trimmedIdea;

  const classifyCall = await completion.complete({
    model: models.classify,
    system: classifySystem,
    user: classifyUser,
    json: true,
  });

  let classification: Classification;
  try {
    classification = classificationSchema.parse(
      JSON.parse(stripFences(classifyCall.text)),
    );
  } catch (error) {
    console.error("[generate] classification illisible", error);
    throw new GenerationError(
      "La classification n'a pas renvoyé un JSON exploitable.",
      "classification-unreadable",
    );
  }

  // Une demande explicite de l'utilisateur prime sur l'inférence.
  const domain: Domain = projectType ?? classification.domain;
  const projectTypeSource = projectType ? "user" : "classifier";

  // --- Étape 7 : chemin d'assets -------------------------------------------
  const assetPath = resolveAssetPath({
    HERO_ASSET: classification.vars.HERO_ASSET ?? null,
    SCREEN: classification.vars.SCREEN ?? null,
  });

  // --- Étape 6 : sélection SQL puis classement ------------------------------
  const candidates = await loadTemplates(domain);
  if (candidates.length === 0) {
    throw new GenerationError(
      `Aucun template actif pour le domaine ${domain}.`,
      "no-template",
    );
  }

  /*
   * RAG sur le catalogue : l'idée brute entre dans le classement, pas seulement
   * les hints de style. `retrieveTemplates` additionne le score structurel
   * (tags, direction, variables) et le recouvrement lexical du brief.
   */
  const ranked = retrieveTemplates(candidates, {
    idea: trimmedIdea,
    hints: classification.art_direction_hints,
    subType: classification.sub_type ?? null,
    vars: { ...classification.vars, ...classification.domain_vars },
    assetPath,
  });
  const selection = ranked[0];
  if (!selection) {
    throw new GenerationError(
      `Aucun template retenu pour ${domain}.`,
      "no-template",
    );
  }

  // --- Appel #2 : injection, puis validation, régénération conditionnelle ---
  const injection = await runInjection({
    templateBody: selection.template.body,
    vars: { ...classification.vars, ...classification.domain_vars },
    assetPath,
    domain,
    idea: trimmedIdea,
    client: completion,
    injectModel: models.inject,
    files,
  });

  return {
    output: injection.output,
    classification,
    domain,
    projectTypeSource,
    assetPath,
    selection,
    runnerUp: ranked[1] ?? null,
    attempts: injection.attempts,
    regenerated: injection.regenerated,
    tokensIn: classifyCall.tokensIn + injection.tokensIn,
    tokensOut: classifyCall.tokensOut + injection.tokensOut,
    durations: {
      classify: classifyCall.durationMs,
      inject: injection.durationMs,
      total: Date.now() - startedAt,
    },
  };
}
