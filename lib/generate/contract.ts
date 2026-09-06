/**
 * Contrat partagé `/api/generate` ↔ frontend.
 *
 * Une seule forme : HTTP 200 signifie un prompt non vide dans `output`.
 * Le client ne lit jamais `prompt` à la place de `output`.
 */

export const GENERATE_PATH = "/api/generate";

export type GenerateRequestBody = {
  idea: string;
  projectType?: string | null;
  fileIds?: string[];
};

export type GenerateSuccessBody = {
  id: string;
  conversation_id: string | null;
  output: string;
};

export type GenerateErrorKind =
  | "auth"
  | "quota"
  | "validation"
  | "server"
  | "network"
  | "protocol";

export type GenerateClientSuccess = {
  ok: true;
  id: string;
  output: string;
  conversationId: string | null;
};

export type GenerateClientFailure = {
  ok: false;
  kind: GenerateErrorKind;
  status: number | null;
  message: string;
};

export type GenerateClientResult = GenerateClientSuccess | GenerateClientFailure;

/** Corps JSON autorisé — jamais de model / provider / plan / user_id / p_limit. */
export function buildGenerateRequestBody(input: {
  idea: string;
  projectType?: string | null;
  fileIds?: readonly string[];
}): GenerateRequestBody {
  const body: GenerateRequestBody = { idea: input.idea.trim() };
  if (input.projectType) body.projectType = input.projectType;
  if (input.fileIds && input.fileIds.length > 0) {
    body.fileIds = [...input.fileIds];
  }
  return body;
}

export function requestBodyHasForbiddenFields(
  body: Record<string, unknown>,
): boolean {
  return ["model", "provider", "plan", "user_id", "p_limit"].some(
    (key) => key in body,
  );
}

export function readNonEmptyOutput(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const output = value.trim();
  return output.length > 0 ? output : null;
}

/**
 * `conversation_id` n'est exposé que si les deux messages ont été écrits.
 * Sinon le client doit aller sur `/prompt/[id]`, pas sur un chat vide.
 */
export function conversationIdForClient(
  conversationId: string | null | undefined,
  messagesWritten: boolean,
): string | null {
  if (!messagesWritten) return null;
  if (typeof conversationId !== "string" || !conversationId) return null;
  return conversationId;
}

export function generationDestination(result: {
  id: string;
  conversationId: string | null;
}): string {
  return result.conversationId
    ? `/chat/${result.conversationId}`
    : `/prompt/${result.id}`;
}

export function assistantMessageFromSuccess(result: GenerateClientSuccess): {
  role: "assistant";
  content: string;
  generationId: string;
} {
  return {
    role: "assistant",
    content: result.output,
    generationId: result.id,
  };
}

function errorKindForStatus(status: number): GenerateErrorKind {
  if (status === 401) return "auth";
  if (status === 402 || status === 429) return "quota";
  if (status === 400 || status === 404) return "validation";
  if (status >= 500) return "server";
  if (status >= 400) return "validation";
  return "protocol";
}

function errorMessageFromBody(body: unknown, fallback: string): string {
  if (
    body &&
    typeof body === "object" &&
    "error" in body &&
    typeof body.error === "string" &&
    body.error.trim()
  ) {
    return body.error;
  }
  return fallback;
}

/**
 * Interprète une réponse HTTP déjà lue.
 *
 * `response.ok` ne suffit pas : 200 sans `output` non vide est un échec
 * de protocole, pas un succès.
 */
export function parseGenerateResponse(
  status: number,
  body: unknown,
): GenerateClientResult {
  if (status === 200) {
    if (!body || typeof body !== "object") {
      return {
        ok: false,
        kind: "protocol",
        status,
        message: "The generation response was empty.",
      };
    }

    const record = body as Record<string, unknown>;
    const id = typeof record.id === "string" ? record.id : "";
    const output = readNonEmptyOutput(record.output);

    if (!id || !output) {
      return {
        ok: false,
        kind: "protocol",
        status,
        message: "The generation did not return a prompt.",
      };
    }

    return {
      ok: true,
      id,
      output,
      conversationId: conversationIdForClient(
        typeof record.conversation_id === "string"
          ? record.conversation_id
          : null,
        true,
      ),
    };
  }

  if (status === 0) {
    return {
      ok: false,
      kind: "network",
      status: null,
      message: "The connection dropped. Your idea is safe.",
    };
  }

  return {
    ok: false,
    kind: errorKindForStatus(status),
    status,
    message: errorMessageFromBody(
      body,
      status >= 500
        ? "The generation did not complete. Try again."
        : "The generation could not start.",
    ),
  };
}
