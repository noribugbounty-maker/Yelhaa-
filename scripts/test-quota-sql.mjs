/**
 * Banc d'essai des fonctions de quota — Postgres réel, en processus.
 *
 *   node scripts/test-quota-sql.mjs
 *
 * PGlite exécute un vrai Postgres compilé en WebAssembly : les fonctions
 * testées ici sont **exactement** celles de la migration, chargées depuis le
 * fichier, sans réécriture. Ce banc valide la sémantique SQL — bornes,
 * branches `insert` et `update`, période de remboursement, plancher à zéro,
 * isolation entre utilisateurs.
 *
 * Ce qu'il ne valide pas : la concurrence multi-connexions. PGlite est
 * mono-connexion, donc le verrou de ligne d'`on conflict do update` ne peut pas
 * y être mis en défaut par deux transactions parallèles. Cette propriété-là
 * doit être mesurée sur la vraie base.
 */
import { readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";

const db = new PGlite();

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

const USER_A = "11111111-1111-1111-1111-111111111111";
const USER_B = "22222222-2222-2222-2222-222222222222";

// Schéma minimal : seulement ce que les fonctions touchent.
await db.exec(`
  create table public.usage_counters (
    user_id uuid not null,
    period_start date not null,
    generations_used int not null default 0,
    primary key (user_id, period_start)
  );
`);

// Les fonctions viennent du fichier de migration, telles quelles. On retire
// seulement les GRANT/REVOKE, qui portent sur des rôles Supabase absents ici.
const migration = readFileSync(
  "supabase/migrations/20260811100000_reserve_generation.sql",
  "utf8",
)
  .split("\n")
  .filter(
    (line) =>
      !/^\s*(revoke|grant)\b/i.test(line) &&
      !/^\s+(from|to) (public|service_role)/i.test(line),
  )
  .join("\n");
await db.exec(migration);

const reserve = async (user, limit) =>
  (
    await db.query("select public.reserve_generation($1, $2) as r", [
      user,
      limit,
    ])
  ).rows[0].r;
const refund = async (user, period) =>
  (
    await db.query("select public.refund_generation($1, $2) as r", [
      user,
      period,
    ])
  ).rows[0].r;
const counter = async (user, period) =>
  (
    await db.query(
      "select generations_used from public.usage_counters where user_id = $1 and period_start = $2",
      [user, period],
    )
  ).rows[0]?.generations_used ?? null;
const reset = async () => db.exec("truncate public.usage_counters");

const period = (
  await db.query(
    "select date_trunc('month', now() at time zone 'utc')::date as p",
  )
).rows[0].p;
const periodStr =
  period instanceof Date ? period.toISOString().slice(0, 10) : String(period);

console.log("=== 1. Bornes de la réservation ===");
await reset();
check("p_limit = 0 refuse (branche insert)", await reserve(USER_A, 0), null);
check("aucune ligne créée", await counter(USER_A, periodStr), null);
check("p_limit = null refuse", await reserve(USER_A, null), null);
check("p_limit négatif refuse", await reserve(USER_A, -5), null);

await reset();
const r1 = await reserve(USER_A, 1);
check("p_limit = 1 : 1re accordée", r1?.used, 1);
check("période renvoyée", r1?.period, periodStr);
check("p_limit = 1 : 2e refusée", await reserve(USER_A, 1), null);
check("compteur reste à 1", await counter(USER_A, periodStr), 1);

console.log("\n=== 2. Limite 3 — ligne inexistante puis existante ===");
await reset();
const seq = [];
for (let i = 0; i < 6; i++) seq.push((await reserve(USER_A, 3))?.used ?? null);
check("séquence 1,2,3 puis refus", seq, [1, 2, 3, null, null, null]);
check("compteur final = 3", await counter(USER_A, periodStr), 3);

console.log("\n=== 3. Quota déjà supérieur à la limite ===");
await reset();
await db.query(
  "insert into public.usage_counters (user_id, period_start, generations_used) values ($1, $2, 9)",
  [USER_A, periodStr],
);
check("réservation refusée si used > limit", await reserve(USER_A, 3), null);
check("compteur inchangé", await counter(USER_A, periodStr), 9);

console.log("\n=== 4. Remboursement ===");
await reset();
await reserve(USER_A, 3);
await reserve(USER_A, 3);
check("2 réservations", await counter(USER_A, periodStr), 2);
check("remboursement rend 1", await refund(USER_A, periodStr), 1);
check("compteur = 1", await counter(USER_A, periodStr), 1);
check("nouvelle réservation possible", (await reserve(USER_A, 3))?.used, 2);

console.log("\n=== 5. Plancher : jamais de compteur négatif ===");
await reset();
await reserve(USER_A, 3);
check("1er remboursement", await refund(USER_A, periodStr), 0);
check("2e remboursement ne rend rien", await refund(USER_A, periodStr), null);
check("3e remboursement ne rend rien", await refund(USER_A, periodStr), null);
check("compteur reste à 0", await counter(USER_A, periodStr), 0);

console.log("\n=== 6. Remboursement à cheval sur un changement de mois ===");
await reset();
const august = "2026-08-01";
const september = "2026-09-01";
await db.query(
  "insert into public.usage_counters (user_id, period_start, generations_used) values ($1, $2, 3), ($1, $3, 0)",
  [USER_A, august, september],
);
check("remboursement ciblant août", await refund(USER_A, august), 2);
check("août décrémenté", await counter(USER_A, august), 2);
check("septembre intact", await counter(USER_A, september), 0);

console.log(
  "\n=== 7. Remboursement d'un autre utilisateur / période inexistante ===",
);
await reset();
await reserve(USER_A, 3);
check("refund sur user inexistant", await refund(USER_B, periodStr), null);
check("compteur de A intact", await counter(USER_A, periodStr), 1);
check(
  "refund sur période inexistante",
  await refund(USER_A, "2020-01-01"),
  null,
);
check("compteur de A toujours intact", await counter(USER_A, periodStr), 1);

console.log("\n=== 8. Isolation entre utilisateurs ===");
await reset();
for (let i = 0; i < 5; i++) await reserve(USER_A, 3);
for (let i = 0; i < 5; i++) await reserve(USER_B, 3);
check("A plafonné à 3", await counter(USER_A, periodStr), 3);
check("B plafonné à 3", await counter(USER_B, periodStr), 3);
await refund(USER_A, periodStr);
check(
  "remboursement de A n'affecte pas B",
  await counter(USER_B, periodStr),
  3,
);
check("A décrémenté", await counter(USER_A, periodStr), 2);

console.log("\n=== 9. Limites différentes selon le plan ===");
await reset();
const pro = [];
for (let i = 0; i < 4; i++)
  pro.push((await reserve(USER_B, 150))?.used ?? null);
check("plan élevé : 4 réservations accordées", pro, [1, 2, 3, 4]);

console.log(
  `\n${failed === 0 ? "TOUS LES TESTS PASSENT" : "ECHECS"} — ${passed} pass, ${failed} fail`,
);
await db.close();
process.exit(failed === 0 ? 0 : 1);
