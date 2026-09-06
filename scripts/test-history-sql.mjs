/**
 * Historique des générations — Postgres réel, en processus.
 *
 *   npm run test:history:sql
 *
 * La migration est chargée **depuis le fichier**, jamais recopiée. Ce banc
 * valide ce qui sera appliqué : la suppression par le propriétaire, la bascule
 * du favori, et surtout que l'ouverture de l'écriture n'a **pas** ouvert le
 * contenu — c'est le risque réel d'un `grant update` mal borné.
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

function assert(label, condition, detail = "") {
  if (condition) passed++;
  else failed++;
  console.log(
    `  ${condition ? "PASS" : "FAIL"}  ${label}${condition ? "" : `\n        ${detail}`}`,
  );
}

const A = "11111111-1111-1111-1111-111111111111";
const B = "22222222-2222-2222-2222-222222222222";

async function denied(sql, params = []) {
  try {
    await db.query(sql, params);
    return false;
  } catch {
    return true;
  }
}

async function actAs(userId) {
  await db.exec("reset role;");
  if (userId === null) {
    await db.exec(`set request.jwt.claims = '{"role":"anon"}';`);
    await db.exec("set role anon;");
    return;
  }
  await db.exec(
    `set request.jwt.claims = '{"sub":"${userId}","role":"authenticated"}';`,
  );
  await db.exec("set role authenticated;");
}

const asOwner = () => db.exec("reset role;");

// Socle : la table telle que la migration initiale la définit, plus les GRANT
// et la policy de lecture d'origine. C'est l'état AVANT la nouvelle migration.
await db.exec(`
  create role anon;
  create role authenticated;
  create role service_role;

  create schema if not exists auth;
  create or replace function auth.uid() returns uuid
    language sql stable as $$
      select nullif(
        current_setting('request.jwt.claims', true)::json ->> 'sub', ''
      )::uuid
    $$;

  create table public.profiles (id uuid primary key, email text);
  create table public.prompt_templates (id uuid primary key default gen_random_uuid());

  create table public.generations (
    id             uuid primary key default gen_random_uuid(),
    user_id        uuid references public.profiles (id) on delete cascade,
    idea           text not null,
    template_id    uuid references public.prompt_templates (id),
    domain         text,
    extracted_vars jsonb,
    asset_path     text,
    output         text not null,
    tokens_in      int,
    tokens_out     int,
    created_at     timestamptz not null default now()
  );

  alter table public.generations enable row level security;
  revoke all on public.generations from anon, authenticated;
  grant select on public.generations to authenticated;
  grant all on public.generations to service_role;

  create policy generations_select_own
    on public.generations for select to authenticated
    using ((select auth.uid()) = user_id);

  insert into public.profiles (id, email)
  values ('${A}', 'a@test.invalid'), ('${B}', 'b@test.invalid');
`);

console.log("=== 1. État AVANT la migration ===");
{
  await asOwner();
  const { rows } = await db.query(
    "insert into public.generations (user_id, idea, output) values ($1,'idée','sortie') returning id",
    [A],
  );
  const id = rows[0].id;
  await actAs(A);
  assert(
    "le propriétaire ne peut PAS supprimer (le défaut mesuré)",
    await denied("delete from public.generations where id = $1", [id]),
    "la suppression passait déjà",
  );
  await asOwner();
  await db.exec("delete from public.generations;");
}

// La migration réelle.
await db.exec(
  readFileSync(
    "supabase/migrations/20260813090000_generation_history.sql",
    "utf8",
  ),
);

console.log("\n=== 2. Colonne et index ===");
{
  await asOwner();
  const { rows } = await db.query(
    "insert into public.generations (user_id, idea, output) values ($1,'idée','sortie') returning is_favorite",
    [A],
  );
  check("is_favorite existe et vaut false par défaut", rows[0].is_favorite, false);
  const idx = await db.query(
    "select indexname from pg_indexes where tablename = 'generations' and indexname = 'generations_user_favorite_idx'",
  );
  check("index partiel des favoris créé", idx.rows.length, 1);
  await db.exec("delete from public.generations;");
}

console.log("\n=== 3. Suppression par le propriétaire ===");
{
  await asOwner();
  const mine = (
    await db.query(
      "insert into public.generations (user_id, idea, output) values ($1,'à moi','sortie') returning id",
      [A],
    )
  ).rows[0].id;
  const theirs = (
    await db.query(
      "insert into public.generations (user_id, idea, output) values ($1,'à B','sortie') returning id",
      [B],
    )
  ).rows[0].id;

  await actAs(A);
  const own = await db.query(
    "delete from public.generations where id = $1 returning id",
    [mine],
  );
  check("A supprime la sienne", own.rows.length, 1);

  const foreign = await db.query(
    "delete from public.generations where id = $1 returning id",
    [theirs],
  );
  check("A ne supprime pas celle de B", foreign.rows.length, 0);

  await asOwner();
  const left = await db.query(
    "select count(*)::int as n from public.generations where id = $1",
    [theirs],
  );
  check("la génération de B est intacte", left.rows[0].n, 1);
  await db.exec("delete from public.generations;");
}

console.log("\n=== 4. Favori — bascule autorisée ===");
{
  await asOwner();
  const mine = (
    await db.query(
      "insert into public.generations (user_id, idea, output) values ($1,'à moi','sortie originale') returning id",
      [A],
    )
  ).rows[0].id;
  const theirs = (
    await db.query(
      "insert into public.generations (user_id, idea, output) values ($1,'à B','sortie B') returning id",
      [B],
    )
  ).rows[0].id;

  await actAs(A);
  const toggled = await db.query(
    "update public.generations set is_favorite = true where id = $1 returning is_favorite",
    [mine],
  );
  check("A marque la sienne en favori", toggled.rows[0]?.is_favorite, true);

  const foreign = await db.query(
    "update public.generations set is_favorite = true where id = $1 returning id",
    [theirs],
  );
  check("A ne marque pas celle de B", foreign.rows.length, 0);
}

console.log("\n=== 5. Le contenu reste inviolable ===");
{
  // Le point qui compte : ouvrir le favori ne doit pas avoir ouvert `output`.
  await actAs(A);
  const { rows } = await db.query(
    "select id from public.generations where user_id = $1 limit 1",
    [A],
  );
  const id = rows[0].id;

  assert(
    "A ne réécrit pas `output`",
    await denied(
      "update public.generations set output = 'réécrit' where id = $1",
      [id],
    ),
    "un GRANT UPDATE trop large laisse passer le contenu",
  );
  assert(
    "A ne réécrit pas `idea`",
    await denied("update public.generations set idea = 'réécrit' where id = $1", [
      id,
    ]),
  );
  assert(
    "A ne falsifie pas `tokens_in`",
    await denied("update public.generations set tokens_in = 0 where id = $1", [
      id,
    ]),
  );
  assert(
    "A ne se réassigne pas la ligne d'un autre",
    await denied(
      "update public.generations set user_id = $1 where user_id = $2",
      [A, B],
    ),
  );

  await asOwner();
  const intact = await db.query(
    "select output from public.generations where id = $1",
    [id],
  );
  check("la sortie d'origine est intacte", intact.rows[0].output, "sortie originale");
}

console.log("\n=== 6. anon — toujours rien ===");
{
  await actAs(null);
  const read = await db
    .query("select * from public.generations")
    .catch(() => ({ rows: [] }));
  check("anon ne lit rien", read.rows.length, 0);
  assert(
    "anon ne supprime rien",
    await denied("delete from public.generations where user_id = $1", [A]),
  );
  assert(
    "anon ne marque aucun favori",
    await denied("update public.generations set is_favorite = true where user_id = $1", [
      A,
    ]),
  );
}

await asOwner();
console.log(
  `\n${failed === 0 ? "TOUS LES TESTS PASSENT" : "ECHECS"} — ${passed} pass, ${failed} fail`,
);
process.exit(failed === 0 ? 0 : 1);
