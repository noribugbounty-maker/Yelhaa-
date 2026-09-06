/**
 * Schéma conversations / messages — Postgres réel, en processus.
 *
 *   npm run test:conversations:sql
 *
 * PGlite exécute un vrai Postgres compilé en WebAssembly. La migration est
 * chargée **depuis le fichier**, jamais recopiée : ce banc teste ce qui sera
 * appliqué, pas une paraphrase.
 *
 * Ce qu'il valide :
 *
 *   * contraintes de titre et de rôle ;
 *   * cascade — supprimer une conversation efface ses messages ;
 *   * `updated_at` remonté par un nouveau message et par un renommage ;
 *   * cohérence du propriétaire imposée par trigger, même si le client ment ;
 *   * **RLS et IDOR** : deux utilisateurs authentifiés, plus `anon`.
 *
 * Ce qu'il ne valide pas : la concurrence multi-connexions (PGlite est
 * mono-connexion) et le comportement de PostgREST au-dessus des policies.
 * Ces deux-là ne se mesurent que sur la vraie base.
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

const USER_A = "11111111-1111-1111-1111-111111111111";
const USER_B = "22222222-2222-2222-2222-222222222222";

/** Vrai si l'instruction a été refusée — peu importe le message exact. */
async function denied(sql, params = []) {
  try {
    await db.query(sql, params);
    return false;
  } catch {
    return true;
  }
}

/**
 * Simulacre du contexte Supabase.
 *
 * `auth.uid()` lit la revendication `sub` du JWT. En posant `request.jwt.claims`
 * puis en endossant le rôle, on obtient exactement le contexte dans lequel les
 * policies s'évaluent en production.
 */
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

// --- Socle minimal : ce que la migration référence, et rien de plus ---------
await db.exec(`
  -- gen_random_uuid() est natif depuis Postgres 13 : aucune extension à
  -- charger, et PGlite n'embarque de toute façon pas pgcrypto.
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

  create table public.profiles (
    id    uuid primary key,
    email text
  );
  create table public.generations (
    id      uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.profiles (id) on delete cascade
  );

  insert into public.profiles (id, email)
  values ('${USER_A}', 'a@test.invalid'), ('${USER_B}', 'b@test.invalid');
`);

// La migration réelle, telle qu'elle sera appliquée.
await db.exec(
  readFileSync("supabase/migrations/20260812090000_conversations.sql", "utf8"),
);

console.log("=== 1. Contraintes de la table ===");
{
  await asOwner();
  assert(
    "titre vide refusé",
    await denied(
      "insert into public.conversations (user_id, title) values ($1, '')",
      [USER_A],
    ),
  );
  assert(
    "titre uniquement espaces refusé",
    await denied(
      "insert into public.conversations (user_id, title) values ($1, '     ')",
      [USER_A],
    ),
  );
  assert(
    "titre de 121 caractères refusé",
    await denied(
      "insert into public.conversations (user_id, title) values ($1, $2)",
      [USER_A, "x".repeat(121)],
    ),
  );
  const ok = await db.query(
    "insert into public.conversations (user_id, title) values ($1, $2) returning id",
    [USER_A, "x".repeat(120)],
  );
  assert("titre de 120 caractères accepté", ok.rows.length === 1);
  await db.exec("delete from public.conversations;");
}

console.log("\n=== 2. Rôles de message et contenu ===");
{
  await asOwner();
  const { rows } = await db.query(
    "insert into public.conversations (user_id, title) values ($1, 'Test') returning id",
    [USER_A],
  );
  const conv = rows[0].id;
  assert(
    "rôle inconnu refusé",
    await denied(
      "insert into public.messages (conversation_id, user_id, role, content) values ($1,$2,'system','x')",
      [conv, USER_A],
    ),
  );
  assert(
    "contenu vide refusé",
    await denied(
      "insert into public.messages (conversation_id, user_id, role, content) values ($1,$2,'user','')",
      [conv, USER_A],
    ),
  );
  for (const role of ["user", "assistant"]) {
    const r = await db.query(
      "insert into public.messages (conversation_id, user_id, role, content) values ($1,$2,$3,'contenu') returning id",
      [conv, USER_A, role],
    );
    assert(`rôle « ${role} » accepté`, r.rows.length === 1);
  }
  await db.exec("delete from public.conversations;");
}

console.log("\n=== 3. Propriétaire imposé par trigger ===");
{
  await asOwner();
  const { rows } = await db.query(
    "insert into public.conversations (user_id, title) values ($1,'A') returning id",
    [USER_A],
  );
  const conv = rows[0].id;
  // Le client ment sur `user_id` : le trigger doit le corriger.
  await db.query(
    "insert into public.messages (conversation_id, user_id, role, content) values ($1,$2,'user','usurpation')",
    [conv, USER_B],
  );
  const { rows: got } = await db.query(
    "select user_id from public.messages where conversation_id = $1",
    [conv],
  );
  check(
    "user_id falsifié réécrit par le propriétaire réel",
    got[0].user_id,
    USER_A,
  );
  assert(
    "conversation inexistante refusée",
    await denied(
      "insert into public.messages (conversation_id, user_id, role, content) values ($1,$2,'user','x')",
      ["33333333-3333-3333-3333-333333333333", USER_A],
    ),
  );
  await db.exec("delete from public.conversations;");
}

console.log("\n=== 4. Cascade — aucun message orphelin ===");
{
  await asOwner();
  const { rows } = await db.query(
    "insert into public.conversations (user_id, title) values ($1,'Cascade') returning id",
    [USER_A],
  );
  const conv = rows[0].id;
  for (let i = 0; i < 10; i++) {
    await db.query(
      "insert into public.messages (conversation_id, user_id, role, content) values ($1,$2,'user',$3)",
      [conv, USER_A, `message ${i}`],
    );
  }
  const before = await db.query(
    "select count(*)::int as n from public.messages where conversation_id = $1",
    [conv],
  );
  check("10 messages insérés", before.rows[0].n, 10);

  await db.query("delete from public.conversations where id = $1", [conv]);

  const convLeft = await db.query(
    "select count(*)::int as n from public.conversations where id = $1",
    [conv],
  );
  const msgLeft = await db.query(
    "select count(*)::int as n from public.messages where conversation_id = $1",
    [conv],
  );
  check("conversation supprimée", convLeft.rows[0].n, 0);
  check("messages supprimés en cascade", msgLeft.rows[0].n, 0);

  const orphans = await db.query(`
    select count(*)::int as n from public.messages m
    left join public.conversations c on c.id = m.conversation_id
    where c.id is null
  `);
  check("aucun message orphelin dans toute la table", orphans.rows[0].n, 0);
}

console.log("\n=== 5. updated_at — la conversation remonte ===");
{
  await asOwner();
  const { rows } = await db.query(
    "insert into public.conversations (user_id, title) values ($1,'Tri') returning id, updated_at",
    [USER_A],
  );
  const conv = rows[0].id;
  const t0 = rows[0].updated_at;

  await new Promise((r) => setTimeout(r, 20));
  await db.query(
    "insert into public.messages (conversation_id, user_id, role, content) values ($1,$2,'user','nouveau')",
    [conv, USER_A],
  );
  const afterMessage = await db.query(
    "select updated_at from public.conversations where id = $1",
    [conv],
  );
  assert(
    "un nouveau message remonte la conversation",
    new Date(afterMessage.rows[0].updated_at) > new Date(t0),
  );

  await new Promise((r) => setTimeout(r, 20));
  await db.query(
    "update public.conversations set title = 'Renommée' where id = $1",
    [conv],
  );
  const afterRename = await db.query(
    "select updated_at, title from public.conversations where id = $1",
    [conv],
  );
  assert(
    "un renommage remonte aussi la conversation",
    new Date(afterRename.rows[0].updated_at) >
      new Date(afterMessage.rows[0].updated_at),
  );
  check("titre effectivement renommé", afterRename.rows[0].title, "Renommée");
  await db.exec("delete from public.conversations;");
}

console.log("\n=== 6. RLS — chacun ne voit que ses conversations ===");
{
  await asOwner();
  const a = (
    await db.query(
      "insert into public.conversations (user_id, title) values ($1,'Conv A') returning id",
      [USER_A],
    )
  ).rows[0].id;
  const b = (
    await db.query(
      "insert into public.conversations (user_id, title) values ($1,'Conv B') returning id",
      [USER_B],
    )
  ).rows[0].id;
  await db.query(
    "insert into public.messages (conversation_id, user_id, role, content) values ($1,$2,'user','secret de A')",
    [a, USER_A],
  );

  await actAs(USER_A);
  const seenByA = await db.query("select id from public.conversations");
  check("A voit exactement 1 conversation", seenByA.rows.length, 1);
  check("et c'est la sienne", seenByA.rows[0].id, a);

  await actAs(USER_B);
  const seenByB = await db.query("select id from public.conversations");
  check("B voit exactement 1 conversation", seenByB.rows.length, 1);
  check("et c'est la sienne", seenByB.rows[0].id, b);

  console.log("\n=== 7. IDOR — B cible directement la conversation de A ===");
  await actAs(USER_B);

  const readA = await db.query(
    "select id from public.conversations where id = $1",
    [a],
  );
  check("B ne lit pas la conversation de A par id", readA.rows.length, 0);

  const readMsgA = await db.query(
    "select id from public.messages where conversation_id = $1",
    [a],
  );
  check("B ne lit aucun message de A", readMsgA.rows.length, 0);

  const renamed = await db.query(
    "update public.conversations set title = 'volé' where id = $1 returning id",
    [a],
  );
  check("B ne renomme pas la conversation de A", renamed.rows.length, 0);

  const deleted = await db.query(
    "delete from public.conversations where id = $1 returning id",
    [a],
  );
  check("B ne supprime pas la conversation de A", deleted.rows.length, 0);

  assert(
    "B n'écrit pas de message dans la conversation de A",
    await denied(
      "insert into public.messages (conversation_id, user_id, role, content) values ($1,$2,'user','intrusion')",
      [a, USER_B],
    ),
  );

  assert(
    "B ne s'attribue pas la conversation de A",
    await denied(
      "insert into public.conversations (user_id, title) values ($1,'usurpée')",
      [USER_A],
    ),
  );

  const stolen = await db.query(
    "update public.conversations set user_id = $1 where id = $2 returning id",
    [USER_B, a],
  );
  check("B ne se réassigne pas la conversation de A", stolen.rows.length, 0);

  // La conversation de A est-elle intacte après toutes ces tentatives ?
  await asOwner();
  const intact = await db.query(
    "select title from public.conversations where id = $1",
    [a],
  );
  check("la conversation de A est intacte", intact.rows[0].title, "Conv A");

  console.log("\n=== 8. anon — aucune lecture, aucune écriture ===");
  await actAs(null);
  for (const table of ["conversations", "messages"]) {
    const r = await db
      .query(`select * from public.${table}`)
      .catch(() => ({ rows: [] }));
    check(`anon ne lit aucune ligne de « ${table} »`, r.rows.length, 0);
  }
  assert(
    "anon n'insère aucune conversation",
    await denied(
      "insert into public.conversations (user_id, title) values ($1,'anon')",
      [USER_A],
    ),
  );
  assert(
    "anon ne supprime aucune conversation",
    await denied("delete from public.conversations where id = $1", [a]),
  );
}

console.log("\n=== 9. Message immuable ===");
{
  await asOwner();
  const conv = (
    await db.query(
      "insert into public.conversations (user_id, title) values ($1,'Immuable') returning id",
      [USER_A],
    )
  ).rows[0].id;
  await db.query(
    "insert into public.messages (conversation_id, user_id, role, content) values ($1,$2,'user','original')",
    [conv, USER_A],
  );
  await actAs(USER_A);
  assert(
    "même son propriétaire ne réécrit pas un message",
    await denied(
      "update public.messages set content = 'réécrit' where conversation_id = $1",
      [conv],
    ),
    "un GRANT UPDATE traîne sur messages",
  );
}

await asOwner();
console.log(
  `\n${failed === 0 ? "TOUS LES TESTS PASSENT" : "ECHECS"} — ${passed} pass, ${failed} fail`,
);
process.exit(failed === 0 ? 0 : 1);
