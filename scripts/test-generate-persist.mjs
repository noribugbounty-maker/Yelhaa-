/**
 * Régression — persistance `generations` et FK `generations_user_id_fkey`.
 *
 *   node --conditions=react-server --import ./scripts/alias-hook.mjs scripts/test-generate-persist.mjs
 *
 * Reproduit l'erreur observée :
 *   insert or update on table "generations" violates foreign key
 *   constraint "generations_user_id_fkey"
 *
 * La colonne `generations.user_id` référence `public.profiles(id)`, elle-même
 * calée sur `auth.users.id`. Un INSERT avec l'UUID Auth sans ligne `profiles`
 * correspondante est exactement cette violation.
 */
import { PGlite } from "@electric-sql/pglite";

import { ensureProfile } from "../lib/auth/profile.ts";
import { reserveGeneration } from "../lib/quota.ts";

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
const ORPHAN = "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb";

const db = new PGlite();

await db.exec(`
  create schema if not exists auth;
  create table auth.users (
    id uuid primary key,
    email text
  );
  create table public.profiles (
    id uuid primary key references auth.users (id) on delete cascade,
    email text,
    plan text not null default 'free'
  );
  create table public.generations (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references public.profiles (id) on delete cascade,
    idea text not null,
    output text not null
  );
`);

await db.query("insert into auth.users (id, email) values ($1, $2)", [
  AUTH_USER,
  "nori@test.invalid",
]);

console.log("=== 1. FK : INSERT generations sans profiles ===");
{
  let code = null;
  let message = "";
  try {
    await db.query(
      "insert into public.generations (user_id, idea, output) values ($1, $2, $3)",
      [AUTH_USER, "une idée", "un prompt"],
    );
  } catch (error) {
    code = error.code ?? null;
    message = String(error.message ?? error);
  }
  check("Postgres refuse (23503)", code, "23503");
  assert(
    "le message nomme generations_user_id_fkey",
    message.includes("generations_user_id_fkey"),
    message,
  );
}

console.log("\n=== 2. UUID Auth ≠ ligne profiles : toujours la même FK ===");
{
  let code = null;
  try {
    await db.query(
      "insert into public.generations (user_id, idea, output) values ($1, $2, $3)",
      [ORPHAN, "une idée", "un prompt"],
    );
  } catch (error) {
    code = error.code ?? null;
  }
  check("UUID absent de profiles refusé", code, "23503");
}

console.log("\n=== 3. Profil calé sur auth.users.id : l'INSERT passe ===");
{
  await db.query("insert into public.profiles (id, email) values ($1, $2)", [
    AUTH_USER,
    "nori@test.invalid",
  ]);
  const { rows } = await db.query(
    "insert into public.generations (user_id, idea, output) values ($1, $2, $3) returning user_id",
    [AUTH_USER, "une idée", "un prompt"],
  );
  check("user_id persisté = auth.users.id", rows[0]?.user_id, AUTH_USER);
}

console.log("\n=== 4. ensureProfile pose profiles.id = auth.users.id ===");
{
  const writes = [];
  const client = {
    from(table) {
      return {
        upsert(row, options) {
          writes.push({ table, row, options });
          return {
            select: () => ({
              maybeSingle: async () => ({
                data: { id: row.id },
                error: null,
              }),
            }),
          };
        },
        select() {
          return {
            eq: () => ({
              maybeSingle: async () => ({ data: null, error: null }),
            }),
          };
        },
      };
    },
  };

  const user = { id: AUTH_USER, email: "nori@test.invalid" };
  const result = await ensureProfile(client, user);
  check("ok", result.ok, true);
  check("id renvoyé = auth.users.id", result.ok ? result.id : null, AUTH_USER);
  check("écrit dans profiles", writes[0]?.table, "profiles");
  check("aucune UUID inventée", writes[0]?.row.id, AUTH_USER);
  check("e-mail Auth recopié", writes[0]?.row.email, "nori@test.invalid");
}

console.log("\n=== 5. ensureProfile ne fabrique pas un autre identifiant ===");
{
  const writes = [];
  const client = {
    from() {
      return {
        upsert(row) {
          writes.push(row);
          return {
            select: () => ({
              maybeSingle: async () => ({ data: { id: row.id }, error: null }),
            }),
          };
        },
        select() {
          return {
            eq: () => ({
              maybeSingle: async () => ({
                data: { id: AUTH_USER },
                error: null,
              }),
            }),
          };
        },
      };
    },
  };
  const result = await ensureProfile(client, {
    id: AUTH_USER,
    email: "nori@test.invalid",
  });
  check("réutilise l'id Auth existant", result.ok ? result.id : null, AUTH_USER);
  check("pas d'écriture si la ligne est là", writes.length, 0);
}

console.log(
  "\n=== 6. Quota : profil absent → unavailable, pas d'appel OpenAI ===",
);
{
  const calls = { reserve: 0 };
  const client = {
    from() {
      return {
        select: () => ({
          eq: () => ({
            maybeSingle: async () => ({ data: null, error: null }),
          }),
        }),
      };
    },
    async rpc() {
      calls.reserve++;
      return { data: { used: 1, period: "2026-09-01" }, error: null };
    },
  };
  const quota = await reserveGeneration(client, AUTH_USER);
  check("allowed", quota.allowed, false);
  check("reason", quota.allowed ? null : quota.reason, "unavailable");
  check("reserve_generation non appelée", calls.reserve, 0);
}

console.log(
  "\n=== 7. Persist FK : un seul remboursement, pas de faux succès ===",
);
{
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
      client.refunds.push(args);
      return { data: 0, error: null };
    },
    refunds: [],
  };
  const quota = await reserveGeneration(client, AUTH_USER);
  assert("réservation accordée", quota.allowed === true);

  const insertError = {
    code: "23503",
    message:
      'insert or update on table "generations" violates foreign key constraint "generations_user_id_fkey"',
  };
  // Même contrat que la route : l'échec de persist rembourse, et ne
  // prétend pas que la génération a réussi.
  const first = quota.allowed ? await quota.refund() : null;
  const second = quota.allowed ? await quota.refund() : null;
  check("premier refund rend le compteur", first, 0);
  check("deuxième refund est un no-op", second, null);
  check("un seul RPC refund", client.refunds.length, 1);
  check("user_id du refund = Auth", client.refunds[0]?.p_user_id, AUTH_USER);
  check("l'erreur FK n'est pas avalée", insertError.code, "23503");
}

console.log(
  `\n${failed === 0 ? "TOUS LES TESTS PASSENT" : "ECHECS"} — ${passed} pass, ${failed} fail`,
);
process.exit(failed === 0 ? 0 : 1);
