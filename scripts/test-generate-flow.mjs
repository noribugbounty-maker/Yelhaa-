/**
 * Flow backend de génération — sans OpenAI réel.
 *
 *   npm run test:generate:flow
 *
 * Vérifie le contrat de la route : profil / quota avant le modèle,
 * output vide ≠ 200, propagation de `output`, conversation_id seulement
 * quand les messages existent, remboursement unique.
 */
import { GenerationError, runInjection } from "../lib/ai/engine.ts";
import { validateOutput } from "../lib/ai/validate.ts";
import { reserveGeneration } from "../lib/quota.ts";
import { ensureProfile } from "../lib/auth/profile.ts";
import {
  conversationIdForClient,
  parseGenerateResponse,
  readNonEmptyOutput,
} from "../lib/generate/contract.ts";

let passed = 0;
let failed = 0;

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

const AUTH_USER = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";

const TEMPLATE_BODY = [
  "## TECH STACK",
  "Next.js.",
  "## DESIGN SYSTEM",
  "Monochrome.",
  "## SECTIONS",
  "Hero, Features.",
  "## STATES & EDGE CASES",
  "Empty, loading, error.",
  "## PERFORMANCE",
  "No layout shift.",
  "## ACCESSIBILITY",
  "Keyboard reachable.",
  "## STRICT RULES",
  "Ship the smallest thing that works.",
].join("\n");

function mockComplete(script) {
  const calls = [];
  let index = 0;
  return {
    calls,
    async complete(request) {
      calls.push(request);
      const step = script[Math.min(index, script.length - 1)];
      index += 1;
      if (step instanceof Error) throw step;
      return { text: step, tokensIn: 10, tokensOut: 20, durationMs: 1 };
    },
  };
}

console.log("=== 11. profil absent → pas d'OpenAI ===");
{
  const client = {
    from() {
      return {
        select: () => ({
          eq: () => ({
            maybeSingle: async () => ({ data: null, error: null }),
          }),
        }),
        upsert: () => ({
          select: () => ({
            maybeSingle: async () => ({
              data: null,
              error: { message: "upsert failed" },
            }),
          }),
        }),
      };
    },
    async rpc() {
      throw new Error("reserve_generation ne doit pas être appelée");
    },
  };
  const profile = await ensureProfile(client, {
    id: AUTH_USER,
    email: "nori@test.invalid",
  });
  assert("ensureProfile échoue", profile.ok === false);
  const quota = await reserveGeneration(client, AUTH_USER);
  assert("aucune réservation", quota.allowed === false);
  check("reason", quota.allowed ? null : quota.reason, "unavailable");
}

console.log("\n=== 12. quota atteint → aucun OpenAI ===");
{
  const rpcs = [];
  const client = {
    from() {
      return {
        select: () => ({
          eq: () => ({
            maybeSingle: async () => ({ data: { plan: "free" }, error: null }),
          }),
        }),
      };
    },
    async rpc(name, args) {
      rpcs.push({ name, args });
      return { data: null, error: null };
    },
  };
  const quota = await reserveGeneration(client, AUTH_USER);
  assert("réservation refusée", quota.allowed === false);
  check("reason", quota.allowed ? null : quota.reason, "limit");
  assert(
    "un seul RPC reserve",
    rpcs.length === 1 && rpcs[0].name === "reserve_generation",
  );
}

console.log("\n=== 13. OpenAI success + persist success → 200 + output ===");
{
  const injection = await runInjection({
    templateBody: TEMPLATE_BODY,
    vars: { BRAND_NAME: "Acme" },
    assetPath: "standard",
    domain: "saas",
    idea: "A landing page for a quiet bookkeeping tool.",
    client: mockComplete([TEMPLATE_BODY]),
    injectModel: "mock-inject",
  });
  const output = readNonEmptyOutput(injection.output);
  assert("output propagé depuis runInjection", output === TEMPLATE_BODY);
  const parsed = parseGenerateResponse(200, {
    id: "gen-ok",
    conversation_id: "conv-ok",
    output,
  });
  assert("HTTP 200 + output → succès", parsed.ok === true);
  check("output jusqu'à la route", parsed.ok ? parsed.output : null, TEMPLATE_BODY);
}

console.log("\n=== 14–15. OpenAI / persist : un seul refund ===");
{
  const refunds = [];
  const client = {
    from() {
      return {
        select: () => ({
          eq: () => ({
            maybeSingle: async () => ({ data: { plan: "free" }, error: null }),
          }),
        }),
      };
    },
    async rpc(name, args) {
      if (name === "reserve_generation") {
        return { data: { used: 1, period: "2026-09-01" }, error: null };
      }
      refunds.push(args);
      return { data: 0, error: null };
    },
  };
  const quota = await reserveGeneration(client, AUTH_USER);
  assert("réservation accordée", quota.allowed === true);
  const first = quota.allowed ? await quota.refund() : null;
  const second = quota.allowed ? await quota.refund() : null;
  check("premier refund", first, 0);
  check("deuxième refund no-op", second, null);
  check("un seul RPC refund", refunds.length, 1);
}

console.log("\n=== 16. OpenAI empty output → pas de faux 200 ===");
{
  let error = null;
  try {
    await runInjection({
      templateBody: TEMPLATE_BODY,
      vars: {},
      assetPath: "standard",
      domain: "saas",
      idea: "A landing page for a quiet bookkeeping tool.",
      client: mockComplete(["", ""]),
      injectModel: "mock-inject",
    });
  } catch (caught) {
    error = caught;
  }
  assert(
    "levée GenerationError",
    error instanceof GenerationError && error.code === "validation-failed",
    error?.code ?? "aucune erreur",
  );
  assert("sortie vide invalide", !validateOutput("", { domain: "saas", sourceText: "x" }).valid);
  const fakeSuccess = parseGenerateResponse(200, {
    id: "gen-empty",
    conversation_id: "conv-empty",
    output: "",
  });
  check("200 + output vide → protocol", fakeSuccess.ok ? null : fakeSuccess.kind, "protocol");
}

console.log("\n=== 17. résultat final propagé, chat seulement si messages ===");
{
  const output = "FINISHED PROMPT";
  assert("readNonEmptyOutput garde le texte", readNonEmptyOutput(output) === output);
  check(
    "sans messages → pas de conversation_id",
    conversationIdForClient("conv-1", false),
    null,
  );
  check(
    "avec messages → conversation_id",
    conversationIdForClient("conv-1", true),
    "conv-1",
  );
  const parsed = parseGenerateResponse(200, {
    id: "gen-3",
    conversation_id: conversationIdForClient("conv-1", true),
    output,
  });
  check("output jusqu'au client", parsed.ok ? parsed.output : null, output);
  check("id jusqu'au client", parsed.ok ? parsed.id : null, "gen-3");
}

console.log(
  `\n${failed === 0 ? "TOUS LES TESTS PASSENT" : "ECHECS"} — ${passed} pass, ${failed} fail`,
);
process.exit(failed === 0 ? 0 : 1);
