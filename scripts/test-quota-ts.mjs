/**
 * Banc d'essai de `reserveGeneration` — logique TypeScript, client Supabase
 * simulé.
 *
 *   node --conditions=react-server --import ./scripts/alias-hook.mjs scripts/test-quota-ts.mjs
 *
 * La sémantique SQL est couverte par `test-quota-sql.mjs`, sur un vrai
 * Postgres. Ce banc-ci couvre ce que le SQL ne peut pas voir : le règlement à
 * usage unique, la distinction entre « quota atteint » et « base
 * indisponible », l'absence de requête superflue sur le chemin de refus, et
 * l'ordre réservation → appel modèle.
 */
import { formatResetDate, nextPlanAbove, PLANS } from "../lib/config.ts";
import { GENERATION_LIMITS, reserveGeneration } from "../lib/quota.ts";

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

const USER = "11111111-1111-1111-1111-111111111111";

/** Client Supabase simulé : compte les appels et rejoue des réponses fixées. */
function fakeClient({ plan = "free", reserve, refund }) {
  const calls = { from: 0, reserve: 0, refund: 0, refundArgs: [] };
  return {
    calls,
    from() {
      calls.from++;
      const chain = {
        select: () => chain,
        eq: () => chain,
        maybeSingle: async () => ({ data: { plan }, error: null }),
      };
      return chain;
    },
    async rpc(name, args) {
      if (name === "reserve_generation") {
        calls.reserve++;
        return reserve(args);
      }
      calls.refund++;
      calls.refundArgs.push(args);
      return refund(args);
    },
  };
}

console.log("=== 1. Réservation accordée ===");
{
  const client = fakeClient({
    reserve: () => ({ data: { used: 1, period: "2026-08-01" }, error: null }),
    refund: () => ({ data: 0, error: null }),
  });
  const r = await reserveGeneration(client, USER);
  check("allowed", r.allowed, true);
  check("used", r.state.used, 1);
  check("remaining (limite free 3)", r.state.remaining, 2);
  check("un seul appel reserve", client.calls.reserve, 1);
}

console.log(
  "\n=== 2. Quota atteint : 'limit', et AUCUNE requête supplémentaire ===",
);
{
  const client = fakeClient({
    reserve: () => ({ data: null, error: null }),
    refund: () => ({ data: null, error: null }),
  });
  const r = await reserveGeneration(client, USER);
  check("allowed", r.allowed, false);
  check("reason", r.reason, "limit");
  check("used = limit", r.state.used, 3);
  check("une seule lecture (le plan), pas de 2e", client.calls.from, 1);
}

console.log("\n=== 3. RPC en erreur : 'unavailable', jamais 'limit' ===");
{
  const client = fakeClient({
    reserve: () => ({
      data: null,
      error: { message: "function does not exist" },
    }),
    refund: () => ({ data: null, error: null }),
  });
  const r = await reserveGeneration(client, USER);
  check("allowed", r.allowed, false);
  check("reason", r.reason, "unavailable");
  check("used non inventé", r.state.used, 0);
}

console.log("\n=== 4. Remboursement : à usage unique ===");
{
  const client = fakeClient({
    reserve: () => ({ data: { used: 2, period: "2026-08-01" }, error: null }),
    refund: () => ({ data: 1, error: null }),
  });
  const r = await reserveGeneration(client, USER);
  check("1er remboursement rend le compteur", await r.refund(), 1);
  check("2e remboursement rend null", await r.refund(), null);
  check("3e remboursement rend null", await r.refund(), null);
  check("un seul appel RPC de remboursement", client.calls.refund, 1);
}

console.log(
  "\n=== 5. Remboursement : période de la RÉSERVATION, pas now() ===",
);
{
  const client = fakeClient({
    reserve: () => ({ data: { used: 1, period: "2026-08-01" }, error: null }),
    refund: () => ({ data: 0, error: null }),
  });
  const r = await reserveGeneration(client, USER);
  await r.refund();
  check(
    "période transmise",
    client.calls.refundArgs[0].p_period_start,
    "2026-08-01",
  );
  check("utilisateur transmis", client.calls.refundArgs[0].p_user_id, USER);
}

console.log(
  "\n=== 6. Remboursement en échec : null, jamais une valeur supposée ===",
);
{
  const client = fakeClient({
    reserve: () => ({ data: { used: 1, period: "2026-08-01" }, error: null }),
    refund: () => ({ data: null, error: { message: "connection lost" } }),
  });
  const r = await reserveGeneration(client, USER);
  check("refund signale l'échec", await r.refund(), null);
}

console.log("\n=== 7. La limite vient du plan serveur, jamais du client ===");
{
  for (const [plan, limit] of [
    ["free", 3],
    ["pro", 150],
    ["agency", 500],
  ]) {
    const client = fakeClient({
      plan,
      reserve: (args) => ({
        data: { used: 1, period: "2026-08-01" },
        error: null,
        _limit: args.p_limit,
      }),
      refund: () => ({ data: 0, error: null }),
    });
    let seen = null;
    const wrapped = {
      ...client,
      rpc: async (n, a) => {
        if (n === "reserve_generation") seen = a.p_limit;
        return client.rpc(n, a);
      },
    };
    const r = await reserveGeneration(wrapped, USER);
    check(`plan ${plan} → p_limit ${limit}`, seen, limit);
    check(`plan ${plan} → state.limit`, r.state.limit, limit);
  }
}

console.log("\n=== 8. Plan inconnu / absent → repli sur free ===");
{
  const client = fakeClient({
    plan: undefined,
    reserve: () => ({ data: { used: 1, period: "2026-08-01" }, error: null }),
    refund: () => ({ data: 0, error: null }),
  });
  let seen = null;
  const wrapped = {
    ...client,
    rpc: async (n, a) => {
      if (n === "reserve_generation") seen = a.p_limit;
      return client.rpc(n, a);
    },
  };
  await reserveGeneration(wrapped, USER);
  check("limite de repli", seen, 3);
}

console.log("\n=== 9. Affichage du quota — plan supérieur ===");
{
  check("free propose pro", nextPlanAbove("free")?.id, "pro");
  check("pro propose agency", nextPlanAbove("pro")?.id, "agency");
  // Le cas qui compte : pas d'impasse pour le client le mieux servi.
  check("agency ne propose rien", nextPlanAbove("agency"), null);
  check("plan inconnu traité comme free", nextPlanAbove("legacy")?.id, "pro");
  check("chaîne vide traitée comme free", nextPlanAbove("")?.id, "pro");

  // Le nombre annoncé doit venir de la table des plans, jamais d'un littéral
  // recopié dans l'interface.
  const limits = Object.fromEntries(
    PLANS.map((plan) => [plan.id, plan.generationsPerMonth]),
  );
  check("les plans annoncent les limites du serveur", limits, {
    free: GENERATION_LIMITS.free,
    pro: GENERATION_LIMITS.pro,
    agency: GENERATION_LIMITS.agency,
  });
}

console.log("\n=== 10. Affichage du quota — date de remise à zéro ===");
{
  check(
    "frontière UTC rendue au bon jour",
    formatResetDate("2026-09-01T00:00:00.000Z"),
    "September 1",
  );
  check(
    "minuit UTC ne recule pas d'un jour",
    formatResetDate("2026-01-01T00:00:00.000Z"),
    "January 1",
  );
  check("entrée illisible → chaîne vide", formatResetDate("pas-une-date"), "");
  check("entrée vide → chaîne vide", formatResetDate(""), "");
  // Jamais « Invalid Date » à l'écran : l'appelant n'affiche alors rien.
  check(
    "aucune sortie ne contient Invalid",
    ["pas-une-date", "", "2026-13-45"].some((value) =>
      formatResetDate(value).includes("Invalid"),
    ),
    false,
  );
}

console.log(
  `\n${failed === 0 ? "TOUS LES TESTS PASSENT" : "ECHECS"} — ${passed} pass, ${failed} fail`,
);
process.exit(failed === 0 ? 0 : 1);
