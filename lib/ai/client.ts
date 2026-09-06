import "server-only";

import OpenAI from "openai";

/**
 * Couche IA — un seul fournisseur, un seul modèle par défaut.
 *
 * Chaîne :
 *   idée → gpt-5-nano (classification) → RAG `content/templates`
 *        → injection des faits extraits → prompt → chat mono-IA
 *
 * Rien d'autre du code ne connaît OpenAI : le moteur ne voit que
 * `CompletionClient`. Les noms de modèles viennent de `process.env`,
 * jamais d'un repli inventé dans ce fichier.
 */

export type ReasoningEffort = "none" | "minimal" | "low" | "medium" | "high";

export type CompletionRequest = {
  model: string;
  system: string[];
  user: string;
  /** Force une réponse JSON stricte — appel #1 uniquement. */
  json?: boolean;
  /**
   * Historique déjà persisté, dans l'ordre chronologique.
   * Utilisé par le chat ; le pipeline de génération ne le renseigne pas.
   */
  history?: readonly { role: "user" | "assistant"; content: string }[];
  /**
   * Plafond de tokens de sortie pour cet appel. Absent : `maxOutputTokens()`.
   * L'injection passe `OPENAI_MAX_OUTPUT_TOKENS_INJECT` via
   * `maxInjectOutputTokens()`.
   */
  maxOutputTokens?: number;
  /**
   * Effort de raisonnement GPT-5 / o-series. **Jamais envoyé** si l'appelant
   * ne le pose pas — classification et chat restent inchangés.
   */
  reasoningEffort?: ReasoningEffort;
};

export type CompletionResult = {
  text: string;
  tokensIn: number;
  tokensOut: number;
  durationMs: number;
  finishReason?: string | null;
  reasoningTokens?: number | null;
  /** `finish_reason === "length"` ou budget épuisé sans texte visible. */
  truncated?: boolean;
};

export interface CompletionClient {
  complete(request: CompletionRequest): Promise<CompletionResult>;
}

export class MissingAiConfigurationError extends Error {
  readonly missing: string[];

  constructor(missing: string[]) {
    super(`Configuration IA incomplète : ${missing.join(", ")}`);
    this.name = "MissingAiConfigurationError";
    this.missing = missing;
  }
}

const DEFAULT_MAX_OUTPUT_TOKENS = 6000;

function readPositiveInt(name: string): number | null {
  const raw = Number(process.env[name]);
  return Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : null;
}

export function maxOutputTokens(): number {
  return (
    readPositiveInt("OPENAI_MAX_OUTPUT_TOKENS") ??
    readPositiveInt("AI_MAX_OUTPUT_TOKENS") ??
    DEFAULT_MAX_OUTPUT_TOKENS
  );
}

/** Budget de l'injection : `OPENAI_MAX_OUTPUT_TOKENS_INJECT`, sinon le budget global. */
export function maxInjectOutputTokens(): number {
  return readPositiveInt("OPENAI_MAX_OUTPUT_TOKENS_INJECT") ?? maxOutputTokens();
}

function readEnv(name: string): string {
  return process.env[name]?.trim() ?? "";
}

/**
 * Modèle unique du produit. Les trois étapes (classification, injection,
 * chat) le partagent, sauf si une variable d'étape est renseignée.
 */
export function resolveEngineModel(): string {
  return (
    readEnv("OPENAI_MODEL") ||
    readEnv("OPENAI_MODEL_INJECT") ||
    readEnv("OPENAI_MODEL_CLASSIFY") ||
    readEnv("OPENAI_MODEL_CHAT")
  );
}

export function resolveClassifyModel(): string {
  return readEnv("OPENAI_MODEL_CLASSIFY") || resolveEngineModel();
}

export function resolveInjectModel(): string {
  return readEnv("OPENAI_MODEL_INJECT") || resolveEngineModel();
}

export function resolveChatModel(): string {
  return readEnv("OPENAI_MODEL_CHAT") || resolveEngineModel();
}

export function readOpenAiApiKey(): string {
  return readEnv("OPENAI_API_KEY");
}

/**
 * Noms de modèles : jamais en dur, jamais de valeur de repli inventée.
 *
 * `OPENAI_MODEL` suffit pour les trois étapes. Les overrides
 * `OPENAI_MODEL_CLASSIFY` / `OPENAI_MODEL_INJECT` / `OPENAI_MODEL_CHAT`
 * ne servent que si l'on veut séparer les appels plus tard.
 */
export function readAiModels(): {
  classify: string;
  inject: string;
  chat: string;
} {
  const classify = resolveClassifyModel();
  const inject = resolveInjectModel();
  const chat = resolveChatModel();
  const key = readOpenAiApiKey();

  const missing = [
    key ? null : "OPENAI_API_KEY",
    classify ? null : "OPENAI_MODEL",
    inject ? null : "OPENAI_MODEL",
    chat ? null : "OPENAI_MODEL",
  ].filter((name, index, list): name is string => {
    if (name === null) return false;
    return list.indexOf(name) === index;
  });

  if (missing.length > 0) throw new MissingAiConfigurationError(missing);

  return { classify, inject, chat };
}

/**
 * Les modèles de la famille GPT-5 (et o-series) refusent `max_tokens` et
 * une température imposée : ils attendent `max_completion_tokens`.
 */
function usesCompletionTokenBudget(model: string): boolean {
  return /^(gpt-5|o[1-9]|o4)/i.test(model);
}

class OpenAICompletionClient implements CompletionClient {
  readonly client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  async complete({
    model,
    system,
    user,
    json,
    history = [],
    maxOutputTokens: requestedBudget,
    reasoningEffort,
  }: CompletionRequest): Promise<CompletionResult> {
    const startedAt = Date.now();
    const budget = requestedBudget ?? maxOutputTokens();
    const reasoningModels = usesCompletionTokenBudget(model);

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      ...system.map((content) => ({ role: "system" as const, content })),
      ...history.map((turn) => ({
        role: turn.role,
        content: turn.content,
      })),
      { role: "user" as const, content: user },
    ];

    const response = await this.client.chat.completions.create({
      model,
      messages,
      ...(reasoningModels
        ? { max_completion_tokens: budget }
        : { max_tokens: budget }),
      ...(json ? { response_format: { type: "json_object" } } : {}),
      ...(reasoningModels && reasoningEffort
        ? { reasoning_effort: reasoningEffort }
        : {}),
    });

    const choice = response.choices[0];
    const text = choice?.message?.content ?? "";
    const finishReason = choice?.finish_reason ?? null;
    const tokensIn = response.usage?.prompt_tokens ?? 0;
    const tokensOut = response.usage?.completion_tokens ?? 0;
    const reasoningTokens =
      response.usage?.completion_tokens_details?.reasoning_tokens ?? null;
    const truncated =
      finishReason === "length" ||
      (!text.trim() && tokensOut > 0 && tokensOut >= budget);

    if (process.env.NODE_ENV !== "production") {
      console.info(`[ai] model=${model}`);
      console.info(`[ai] finish_reason=${finishReason ?? ""}`);
      console.info(`[ai] completion_tokens=${tokensOut}`);
      console.info(`[ai] reasoning_tokens=${reasoningTokens ?? ""}`);
      console.info(`[ai] content_length=${text.length}`);
    }

    return {
      text,
      tokensIn,
      tokensOut,
      durationMs: Date.now() - startedAt,
      finishReason,
      reasoningTokens,
      truncated,
    };
  }
}

let cached: CompletionClient | null = null;

export function createCompletionClient(): CompletionClient {
  if (cached) return cached;

  const apiKey = readOpenAiApiKey();
  if (!apiKey) throw new MissingAiConfigurationError(["OPENAI_API_KEY"]);

  cached = new OpenAICompletionClient(apiKey);
  return cached;
}

/** Réservé aux bancs d'essai : un client injecté ne doit pas rester en cache. */
export function resetCompletionClientCache(): void {
  cached = null;
}
