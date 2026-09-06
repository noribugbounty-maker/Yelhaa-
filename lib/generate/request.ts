/**
 * Client HTTP de génération — navigateur uniquement pour l'appel réseau.
 *
 * Un seul `POST /api/generate`. Pas de modèle, pas de clé, pas d'Abort
 * lié au démontage React : si le composant disparaît, le serveur continue.
 */

import {
  GENERATE_PATH,
  buildGenerateRequestBody,
  parseGenerateResponse,
  type GenerateClientFailure,
  type GenerateClientResult,
  type GenerateRequestBody,
} from "@/lib/generate/contract";
import { logGenerate } from "@/lib/generate/observe";

export type RequestGenerationInput = {
  idea: string;
  projectType?: string | null;
  fileIds?: readonly string[];
};

let inflight: Promise<GenerateClientResult> | null = null;

export function resetGenerateInflight(): void {
  inflight = null;
}

async function readResponseBody(
  response: Response,
): Promise<{ body: unknown; protocolError: GenerateClientFailure | null }> {
  const text = await response.text();
  if (!text.trim()) {
    return {
      body: null,
      protocolError: {
        ok: false,
        kind: "protocol",
        status: response.status,
        message: "The generation response was empty.",
      },
    };
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return {
      body: null,
      protocolError: {
        ok: false,
        kind: "protocol",
        status: response.status,
        message: "The generation response was not JSON.",
      },
    };
  }

  try {
    return { body: JSON.parse(text) as unknown, protocolError: null };
  } catch {
    return {
      body: null,
      protocolError: {
        ok: false,
        kind: "protocol",
        status: response.status,
        message: "The generation response was not valid JSON.",
      },
    };
  }
}

async function requestGenerationOnce(
  input: RequestGenerationInput,
): Promise<GenerateClientResult> {
  const payload: GenerateRequestBody = buildGenerateRequestBody(input);

  logGenerate("ui", "request started", {
    path: GENERATE_PATH,
    method: "POST",
    ideaLength: payload.idea.length,
    hasProjectType: Boolean(payload.projectType),
    fileCount: payload.fileIds?.length ?? 0,
  });

  let response: Response;
  try {
    response = await fetch(GENERATE_PATH, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    logGenerate("ui", "response received", { kind: "network" });
    return parseGenerateResponse(0, null);
  }

  logGenerate("ui", "response received");
  logGenerate("ui", "response status", { status: response.status });

  const { body, protocolError } = await readResponseBody(response);
  if (protocolError) {
    logGenerate("ui", "response parsed", { kind: protocolError.kind });
    return protocolError;
  }

  const parsed = parseGenerateResponse(response.status, body);
  logGenerate("ui", "response parsed", {
    ok: parsed.ok,
    kind: parsed.ok ? "success" : parsed.kind,
    hasOutput: parsed.ok,
    conversation: parsed.ok ? Boolean(parsed.conversationId) : false,
  });
  return parsed;
}

export async function requestGeneration(
  input: RequestGenerationInput,
): Promise<GenerateClientResult> {
  if (inflight) return inflight;

  inflight = requestGenerationOnce(input).finally(() => {
    inflight = null;
  });

  return inflight;
}
