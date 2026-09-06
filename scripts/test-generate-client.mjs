/**
 * Contrat frontend ↔ `/api/generate`.
 *
 *   npm run test:generate:client
 *
 * Aucun réseau réel : `fetch` est remplacé. Couvre le submit, le parsing
 * des statuts, le JSON invalide, la réponse vide, l'échec réseau et le
 * double envoi.
 */
import {
  assistantMessageFromSuccess,
  buildGenerateRequestBody,
  conversationIdForClient,
  generationDestination,
  parseGenerateResponse,
  requestBodyHasForbiddenFields,
} from "../lib/generate/contract.ts";
import {
  requestGeneration,
  resetGenerateInflight,
} from "../lib/generate/request.ts";

let passed = 0;
let failed = 0;
const fetchCalls = [];

function check(label, actual, expected) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (ok) passed++;
  else failed++;
  console.log(
    `  ${ok ? "PASS" : "FAIL"}  ${label}` +
      (ok
        ? ""
        : `\n        attendu ${JSON.stringify(expected)}, obtenu ${JSON.stringify(actual)}`),
  );
}

function assert(label, condition, detail = "") {
  if (condition) passed++;
  else failed++;
  console.log(
    `  ${condition ? "PASS" : "FAIL"}  ${label}${condition ? "" : `\n        ${detail}`}`,
  );
}

function jsonResponse(status, body, headers = { "content-type": "application/json" }) {
  return new Response(body === null ? "" : JSON.stringify(body), {
    status,
    headers,
  });
}

const IDEA = "A landing page for a quiet bookkeeping tool.";

console.log("=== 1. submit valide → POST /api/generate ===");
{
  resetGenerateInflight();
  fetchCalls.length = 0;
  globalThis.fetch = async (url, init) => {
    fetchCalls.push({ url, init });
    return jsonResponse(200, {
      id: "gen-1",
      conversation_id: "conv-1",
      output: "THE PROMPT",
    });
  };

  const result = await requestGeneration({ idea: IDEA, projectType: "saas" });
  check("chemin", fetchCalls[0]?.url, "/api/generate");
  check("méthode", fetchCalls[0]?.init?.method, "POST");
  const sent = JSON.parse(fetchCalls[0].init.body);
  check("idée envoyée", sent.idea, IDEA);
  check("projectType envoyé", sent.projectType, "saas");
  assert("succès", result.ok === true);
  assert(
    "aucun champ interdit",
    !requestBodyHasForbiddenFields(sent),
    JSON.stringify(sent),
  );
}

console.log("\n=== 2. 200 valide → message assistant ===");
{
  const parsed = parseGenerateResponse(200, {
    id: "gen-1",
    conversation_id: "conv-1",
    output: "THE PROMPT",
  });
  assert("ok", parsed.ok === true);
  if (parsed.ok) {
    const message = assistantMessageFromSuccess(parsed);
    check("rôle", message.role, "assistant");
    check("contenu = output", message.content, "THE PROMPT");
    check("generationId", message.generationId, "gen-1");
    check("destination chat", generationDestination(parsed), "/chat/conv-1");
  }
}

console.log("\n=== 3–6. erreurs HTTP visibles ===");
{
  const cases = [
    [400, "Your idea must be between 10 and 2000 characters.", "validation"],
    [401, "Authentication required.", "auth"],
    [429, "Too many generations in a row. Try again in a moment.", "quota"],
    [500, "The generation did not complete. Try again.", "server"],
  ];
  for (const [status, error, kind] of cases) {
    const parsed = parseGenerateResponse(status, { error });
    check(`${status} kind`, parsed.ok ? null : parsed.kind, kind);
    check(`${status} message`, parsed.ok ? null : parsed.message, error);
    assert(`${status} n'est pas un succès`, parsed.ok === false);
  }
}

console.log("\n=== 7. JSON invalide ===");
{
  resetGenerateInflight();
  globalThis.fetch = async () =>
    new Response("{not-json", {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  const result = await requestGeneration({ idea: IDEA });
  check("kind", result.ok ? null : result.kind, "protocol");
}

console.log("\n=== 8. réponse vide ===");
{
  resetGenerateInflight();
  globalThis.fetch = async () =>
    new Response("", {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  const result = await requestGeneration({ idea: IDEA });
  check("kind", result.ok ? null : result.kind, "protocol");
}

console.log("\n=== 9. échec réseau ===");
{
  resetGenerateInflight();
  globalThis.fetch = async () => {
    throw new TypeError("Failed to fetch");
  };
  const result = await requestGeneration({ idea: IDEA });
  check("kind", result.ok ? null : result.kind, "network");
}

console.log("\n=== 10. double submit → une seule requête ===");
{
  resetGenerateInflight();
  fetchCalls.length = 0;
  let resolveFetch;
  const gate = new Promise((resolve) => {
    resolveFetch = resolve;
  });
  globalThis.fetch = async (url, init) => {
    fetchCalls.push({ url, init });
    await gate;
    return jsonResponse(200, {
      id: "gen-2",
      conversation_id: "conv-2",
      output: "SECOND",
    });
  };

  const first = requestGeneration({ idea: IDEA });
  const second = requestGeneration({ idea: "Another distinct idea here." });
  resolveFetch();
  const [a, b] = await Promise.all([first, second]);
  check("une seule requête", fetchCalls.length, 1);
  assert("même résultat partagé", a.ok && b.ok && a.id === b.id);
}

console.log("\n=== Contrat : 200 sans output n'est pas un succès ===");
{
  const empty = parseGenerateResponse(200, {
    id: "gen-1",
    conversation_id: "conv-1",
    output: "",
  });
  check("output vide → protocol", empty.ok ? null : empty.kind, "protocol");

  const promptOnly = parseGenerateResponse(200, {
    id: "gen-1",
    prompt: "HIDDEN",
  });
  check(
    "champ prompt ignoré",
    promptOnly.ok ? null : promptOnly.kind,
    "protocol",
  );

  const noConversation = parseGenerateResponse(200, {
    id: "gen-1",
    conversation_id: null,
    output: "THE PROMPT",
  });
  check(
    "sans conversation → /prompt",
    noConversation.ok ? generationDestination(noConversation) : null,
    "/prompt/gen-1",
  );
}

console.log("\n=== Corps autorisé ===");
{
  const body = buildGenerateRequestBody({
    idea: `  ${IDEA}  `,
    projectType: "saas",
    fileIds: ["11111111-1111-1111-1111-111111111111"],
  });
  check("idée trimée", body.idea, IDEA);
  assert("pas de model", !("model" in body));
  assert("pas de user_id", !("user_id" in body));
  check(
    "conversation_id seulement si messages écrits",
    conversationIdForClient("conv-1", false),
    null,
  );
  check(
    "conversation_id si messages écrits",
    conversationIdForClient("conv-1", true),
    "conv-1",
  );
}

console.log(
  `\n${failed === 0 ? "TOUS LES TESTS PASSENT" : "ECHECS"} — ${passed} pass, ${failed} fail`,
);
process.exit(failed === 0 ? 0 : 1);
