/**
 * Fichiers joints — Postgres réel, en processus.
 *
 *   npm run test:files:sql
 *
 * La migration est chargée **depuis le fichier**, jamais recopiée : ce banc
 * valide ce qui sera réellement appliqué.
 *
 * Le point central est le §17 : un utilisateur ne doit atteindre ni les
 * fichiers, ni le contexte extrait d'un autre. Le second point est plus subtil
 * — l'attachement d'un fichier à une génération est une écriture, et une
 * écriture mal bornée permettrait de réécrire `extracted_text` après
 * validation, c'est-à-dire d'injecter du contexte que le serveur n'a jamais
 * inspecté.
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

/**
 * Repasse propriétaire de la table **et efface les claims**.
 *
 * Les deux comptent : `reset role` seul laisserait `request.jwt.claims` de
 * l'appelant précédent, et le trigger de propriété attribuerait alors les
 * lignes à lui plutôt qu'à l'utilisateur passé en paramètre. C'est exactement
 * l'erreur qui faisait passer les fichiers de B pour ceux de A dans ce banc.
 */
const asOwner = async () => {
  await db.exec("reset role;");
  /*
   * Un objet JSON vide, posé par la même forme que `actAs`.
   *
   * Deux pièges évités ici. Une chaîne vide ferait échouer `auth.uid()`, qui
   * applique `::json` avant le `nullif`. Et `set_config(..., true)` serait
   * local à la transaction, donc annulé dès l'instruction suivante — la
   * session garderait les claims de l'appelant précédent.
   */
  await db.exec(`set request.jwt.claims = '{}';`);
};

// Socle minimal : ce dont la migration dépend, tel que les migrations
// antérieures le laissent.
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
    id          uuid primary key default gen_random_uuid(),
    user_id     uuid references public.profiles (id) on delete cascade,
    idea        text not null,
    output      text not null,
    created_at  timestamptz not null default now()
  );

  insert into public.profiles (id, email)
  values ('${A}', 'a@test.invalid'), ('${B}', 'b@test.invalid');
`);

await db.exec(
  readFileSync("supabase/migrations/20260814090000_generation_files.sql", "utf8"),
);

const insert = (userId, over = {}) => {
  const row = {
    filename: "notes.txt",
    mime_type: "text/plain",
    byte_size: 100,
    extracted_text: "contenu",
    ...over,
  };
  return db.query(
    `insert into public.generation_files
       (user_id, filename, mime_type, byte_size, extracted_text)
     values ($1, $2, $3, $4, $5) returning id`,
    [userId, row.filename, row.mime_type, row.byte_size, row.extracted_text],
  );
};

console.log("=== 1. Table et valeurs par défaut ===");
{
  await asOwner();
  const { rows } = await db.query(
    `insert into public.generation_files
       (user_id, filename, mime_type, byte_size, extracted_text)
     values ($1,'a.txt','text/plain',10,'texte')
     returning truncated, generation_id, created_at`,
    [A],
  );
  check("truncated vaut false par défaut", rows[0].truncated, false);
  check("generation_id est nul à l'envoi", rows[0].generation_id, null);
  assert("created_at est rempli", rows[0].created_at !== null);

  const idx = await db.query(
    "select indexname from pg_indexes where tablename = 'generation_files' order by indexname",
  );
  check(
    "les deux index existent",
    idx.rows.map((r) => r.indexname).filter((n) => n !== "generation_files_pkey"),
    ["generation_files_generation_idx", "generation_files_user_idx"],
  );
  await db.exec("delete from public.generation_files;");
}

console.log("\n=== 2. Contraintes de contenu ===");
{
  await asOwner();
  assert(
    "un nom vide est refusé",
    await denied(
      `insert into public.generation_files (user_id, filename, mime_type, byte_size, extracted_text)
       values ($1,'   ','text/plain',10,'t')`,
      [A],
    ),
  );
  assert(
    "une taille négative est refusée",
    await denied(
      `insert into public.generation_files (user_id, filename, mime_type, byte_size, extracted_text)
       values ($1,'a.txt','text/plain',-1,'t')`,
      [A],
    ),
  );
  assert(
    "un utilisateur inconnu est refusé",
    await denied(
      `insert into public.generation_files (user_id, filename, mime_type, byte_size, extracted_text)
       values ('33333333-3333-3333-3333-333333333333','a.txt','text/plain',1,'t')`,
    ),
  );
}

console.log("\n=== 3. Le propriétaire agit sur ses fichiers ===");
{
  await actAs(A);
  const mine = (await insert(A)).rows[0].id;
  assert("A envoie un fichier", Boolean(mine));

  const read = await db.query(
    "select id from public.generation_files where id = $1",
    [mine],
  );
  check("A relit le sien", read.rows.length, 1);

  const removed = await db.query(
    "delete from public.generation_files where id = $1 returning id",
    [mine],
  );
  check("A retire le sien avant génération", removed.rows.length, 1);
}

console.log("\n=== 4. IDOR — rien de B n'est atteignable ===");
{
  await asOwner();
  await db.exec("delete from public.generation_files;");
  const theirs = (
    await db.query(
      `insert into public.generation_files
         (user_id, filename, mime_type, byte_size, extracted_text)
       values ($1,'secret-de-b.md','text/markdown',10,'CONTEXTE CONFIDENTIEL DE B')
       returning id`,
      [B],
    )
  ).rows[0].id;

  await actAs(A);
  const read = await db.query("select * from public.generation_files");
  check("A ne voit aucun fichier de B", read.rows.length, 0);

  const byId = await db.query(
    "select extracted_text from public.generation_files where id = $1",
    [theirs],
  );
  check("A ne lit pas le contexte de B par identifiant", byId.rows.length, 0);

  const removed = await db.query(
    "delete from public.generation_files where id = $1 returning id",
    [theirs],
  );
  check("A ne supprime pas le fichier de B", removed.rows.length, 0);

  const stolen = await db.query(
    "update public.generation_files set generation_id = null where id = $1 returning id",
    [theirs],
  );
  check("A ne modifie pas le fichier de B", stolen.rows.length, 0);

  await asOwner();
  const intact = await db.query(
    "select extracted_text from public.generation_files where id = $1",
    [theirs],
  );
  check(
    "le contexte de B est intact",
    intact.rows[0].extracted_text,
    "CONTEXTE CONFIDENTIEL DE B",
  );
}

console.log("\n=== 5. Le contexte extrait n'est jamais réécrit ===");
{
  await asOwner();
  await db.exec("delete from public.generation_files;");
  const mine = (
    await db.query(
      `insert into public.generation_files
         (user_id, filename, mime_type, byte_size, extracted_text)
       values ($1,'a.txt','text/plain',10,'texte validé par le serveur')
       returning id`,
      [A],
    )
  ).rows[0].id;
  const generation = (
    await db.query(
      "insert into public.generations (user_id, idea, output) values ($1,'idée','sortie') returning id",
      [A],
    )
  ).rows[0].id;

  await actAs(A);
  // L'attachement est la seule écriture prévue, et elle doit marcher.
  const attached = await db.query(
    "update public.generation_files set generation_id = $1 where id = $2 returning generation_id",
    [generation, mine],
  );
  check("A rattache son fichier à sa génération", attached.rows[0]?.generation_id, generation);

  // Tout le reste doit être refusé par le GRANT, pas par une policy.
  assert(
    "A ne réécrit pas extracted_text",
    await denied(
      "update public.generation_files set extracted_text = 'INJECTÉ' where id = $1",
      [mine],
    ),
    "un GRANT UPDATE trop large laisserait injecter du contexte non validé",
  );
  assert(
    "A ne réécrit pas filename",
    await denied(
      "update public.generation_files set filename = 'autre.txt' where id = $1",
      [mine],
    ),
  );
  assert(
    "A ne falsifie pas byte_size",
    await denied("update public.generation_files set byte_size = 0 where id = $1", [
      mine,
    ]),
  );
  assert(
    "A ne ment pas sur truncated",
    await denied(
      "update public.generation_files set truncated = true where id = $1",
      [mine],
    ),
  );
  assert(
    "A ne se réassigne pas le fichier d'un autre",
    await denied("update public.generation_files set user_id = $1", [A]),
  );

  await asOwner();
  const intact = await db.query(
    "select extracted_text from public.generation_files where id = $1",
    [mine],
  );
  check(
    "le contexte d'origine est intact",
    intact.rows[0].extracted_text,
    "texte validé par le serveur",
  );
}

console.log("\n=== 6. Le propriétaire est imposé par la base ===");
{
  await actAs(A);
  // A prétend écrire pour B : le trigger réécrit, l'attaque est sans effet.
  const { rows } = await insert(B, { filename: "usurpation.txt" });
  await asOwner();
  const owner = await db.query(
    "select user_id from public.generation_files where id = $1",
    [rows[0].id],
  );
  check("le user_id falsifié est écrasé", owner.rows[0].user_id, A);
}

console.log("\n=== 7. Cycles de vie ===");
{
  await asOwner();
  await db.exec("delete from public.generation_files;");
  const generation = (
    await db.query(
      "insert into public.generations (user_id, idea, output) values ($1,'idée','sortie') returning id",
      [A],
    )
  ).rows[0].id;
  const fileId = (
    await db.query(
      `insert into public.generation_files
         (user_id, generation_id, filename, mime_type, byte_size, extracted_text)
       values ($1,$2,'a.txt','text/plain',10,'texte') returning id`,
      [A, generation],
    )
  ).rows[0].id;

  await db.query("delete from public.generations where id = $1", [generation]);
  const orphan = await db.query(
    "select generation_id from public.generation_files where id = $1",
    [fileId],
  );
  check("supprimer la génération ne supprime pas le fichier", orphan.rows.length, 1);
  check("le lien est simplement défait", orphan.rows[0].generation_id, null);

  await db.query("delete from public.profiles where id = $1", [A]);
  const gone = await db.query(
    "select id from public.generation_files where id = $1",
    [fileId],
  );
  check("supprimer le compte supprime ses fichiers", gone.rows.length, 0);
}

console.log("\n=== 8. anon — rien du tout ===");
{
  await asOwner();
  await db.exec(`insert into public.profiles (id, email) values ('${A}', 'a@test.invalid');`);
  await db.query(
    `insert into public.generation_files
       (user_id, filename, mime_type, byte_size, extracted_text)
     values ($1,'a.txt','text/plain',10,'texte')`,
    [A],
  );

  await actAs(null);
  const read = await db
    .query("select * from public.generation_files")
    .catch(() => ({ rows: [] }));
  check("anon ne lit rien", read.rows.length, 0);
  assert(
    "anon n'envoie rien",
    await denied(
      `insert into public.generation_files
         (user_id, filename, mime_type, byte_size, extracted_text)
       values ($1,'a.txt','text/plain',10,'t')`,
      [A],
    ),
  );
  assert(
    "anon ne supprime rien",
    await denied("delete from public.generation_files where user_id = $1", [A]),
  );
}

await asOwner();
console.log(
  `\n${failed === 0 ? "TOUS LES TESTS PASSENT" : "ECHECS"} — ${passed} pass, ${failed} fail`,
);
process.exit(failed === 0 ? 0 : 1);
