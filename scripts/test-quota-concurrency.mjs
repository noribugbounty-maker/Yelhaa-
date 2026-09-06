/**
 * Test de concurrence **multi-connexions** de la réservation de quota.
 *
 *   DATABASE_URL=postgres://... node scripts/test-quota-concurrency.mjs
 *
 * C'est le seul test qui peut mettre à l'épreuve le verrou de ligne
 * d'`on conflict do update ... where` : il exige N connexions réellement
 * parallèles, chacune dans sa transaction.
 *
 * Il a besoin d'une chaîne `DATABASE_URL` vers un Postgres où les fonctions de
 * `20260811100000_reserve_generation.sql` sont appliquées — la base Supabase du
 * projet convient, avec le mot de passe de base (pas la clé API : PostgREST ne
 * donne pas de connexion SQL).
 *
 * Pourquoi pas PGlite : `pglite-socket` n'accepte **qu'une connexion à la
 * fois** et coupe la seconde (`ECONNRESET`). La sémantique SQL est donc
 * couverte par `test-quota-sql.mjs`, en mono-connexion, mais la concurrence
 * réelle ne peut pas y être simulée.
 *
 * Invariant vérifié, sans exception :
 *   accepted <= limit   et   compteur final == accepted
 */
import pg from "pg";

const URL = process.env["DATABASE_URL"];

if (!URL) {
  console.log("BLOCKED — DATABASE_URL absente.");
  console.log("");
  console.log("Ce test exige une connexion SQL directe. Les clés API Supabase");
  console.log(
    "(`sb_publishable_`, `sb_secret_`) ouvrent PostgREST, pas Postgres.",
  );
  console.log("");
  console.log("Pour l'exécuter :");
  console.log(
    "  1. appliquer supabase/migrations/20260811100000_reserve_generation.sql",
  );
  console.log(
    "  2. récupérer la chaîne de connexion (Dashboard → Settings → Database)",
  );
  console.log(
    "  3. DATABASE_URL='postgres://...' node scripts/test-quota-concurrency.mjs",
  );
  process.exit(2);
}

const USER_A = process.env["TEST_USER_A"];
const USER_B = process.env["TEST_USER_B"];

if (!USER_A || !USER_B) {
  console.log("BLOCKED — TEST_USER_A et TEST_USER_B requis.");
  console.log("Deux identifiants de `profiles` existants : le test écrit dans");
  console.log("`usage_counters`, dont la clé étrangère pointe sur `profiles`.");
  process.exit(2);
}

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

const pool = new pg.Pool({ connectionString: URL, max: 60 });

const periodStr = (
  await pool.query(
    "select date_trunc('month', now() at time zone 'utc')::date::text as p",
  )
).rows[0].p;

const counter = async (user) =>
  (
    await pool.query(
      "select generations_used from public.usage_counters where user_id = $1 and period_start = $2",
      [user, periodStr],
    )
  ).rows[0]?.generations_used ?? 0;

/** Remet à zéro **uniquement** les lignes des deux utilisateurs de test. */
const reset = async () =>
  pool.query(
    "delete from public.usage_counters where user_id = any($1) and period_start = $2",
    [[USER_A, USER_B], periodStr],
  );

/** N réservations lancées réellement en parallèle, chacune sur sa connexion. */
async function burst(user, count, limit) {
  const results = await Promise.all(
    Array.from({ length: count }, async () => {
      const client = await pool.connect();
      try {
        const r = await client.query(
          "select public.reserve_generation($1, $2) as r",
          [user, limit],
        );
        return r.rows[0].r;
      } finally {
        client.release();
      }
    }),
  );
  return {
    accepted: results.filter((r) => r !== null).length,
    refused: results.filter((r) => r === null).length,
    values: results
      .filter((r) => r !== null)
      .map((r) => r.used)
      .sort((a, b) => a - b),
  };
}

try {
  for (const n of [10, 20, 50]) {
    console.log(`\n=== ${n} réservations concurrentes / limite 3 ===`);
    await reset();
    const r = await burst(USER_A, n, 3);
    const final = await counter(USER_A);
    console.log(
      `  requests=${n}  accepted=${r.accepted}  refused=${r.refused}  final=${final}`,
    );
    check("accepted == 3", r.accepted, 3);
    check(`refused == ${n - 3}`, r.refused, n - 3);
    check("compteur final == 3", final, 3);
    check("valeurs distinctes 1,2,3", r.values, [1, 2, 3]);
    check("INVARIANT accepted <= limit", r.accepted <= 3, true);
  }

  console.log("\n=== Multi-utilisateurs : 10 + 10 en parallèle, limite 3 ===");
  await reset();
  const [a, b] = await Promise.all([
    burst(USER_A, 10, 3),
    burst(USER_B, 10, 3),
  ]);
  check("A plafonné à 3", a.accepted, 3);
  check("B plafonné à 3", b.accepted, 3);
  check("compteur A == 3", await counter(USER_A), 3);
  check("compteur B == 3", await counter(USER_B), 3);

  console.log("\n=== Limite 1 : une seule acceptée sur 30 concurrentes ===");
  await reset();
  const one = await burst(USER_A, 30, 1);
  check("accepted == 1", one.accepted, 1);
  check("compteur == 1", await counter(USER_A), 1);

  console.log("\n=== Remboursements concurrents : jamais de négatif ===");
  await reset();
  await burst(USER_A, 3, 3);
  const refunds = await Promise.all(
    Array.from({ length: 10 }, async () => {
      const client = await pool.connect();
      try {
        return (
          await client.query("select public.refund_generation($1, $2) as r", [
            USER_A,
            periodStr,
          ])
        ).rows[0].r;
      } finally {
        client.release();
      }
    }),
  );
  check(
    "exactement 3 remboursements effectifs",
    refunds.filter((r) => r !== null).length,
    3,
  );
  check("compteur à 0, jamais négatif", await counter(USER_A), 0);

  await reset();
  console.log(
    `\n${failed === 0 ? "TOUS LES TESTS PASSENT" : "ECHECS"} — ${passed} pass, ${failed} fail`,
  );
} finally {
  await pool.end();
}

process.exit(failed === 0 ? 0 : 1);
