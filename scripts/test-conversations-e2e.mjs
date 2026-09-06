/**
 * Conversations — **base Supabase réelle, deux utilisateurs authentifiés**.
 *
 *   node --env-file-if-exists=.env.local scripts/test-conversations-e2e.mjs
 *
 * Le banc PGlite valide la sémantique SQL des policies. Celui-ci valide la
 * chaîne complète : **PostgREST au-dessus des policies**, avec de vrais jetons
 * JWT. C'est le seul niveau où l'on peut affirmer qu'un `conversation_id`
 * étranger passé à l'API est refusé — un test SQL ne traverse pas PostgREST.
 *
 * Deux comptes sont créés puis **supprimés en fin de course**, quel que soit le
 * résultat. La suppression de l'utilisateur cascade jusqu'aux conversations et
 * aux messages : le banc ne laisse rien derrière lui.
 *
 * Le §37 demande explicitement `anon`, l'utilisateur A et l'utilisateur B :
 * les trois contextes sont couverts.
 */
import { createClient } from "@supabase/supabase-js";

const url =
  process.env["NEXT_PUBLIC_SUPABASE_URL"] ?? process.env["SUPABASE_URL"];
const anonKey =
  process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"] ??
  process.env["SUPABASE_ANON_KEY"];
const serviceKey = process.env["SUPABASE_SERVICE_ROLE_KEY"];

if (!url || !anonKey || !serviceKey) {
  console.log("BLOCKED — URL, clé anon et clé service_role sont requises.");
  process.exit(2);
}

const admin = createClient(url, serviceKey, {
  auth: { persistSession: false },
});
const anon = createClient(url, anonKey, { auth: { persistSession: false } });

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

/** Marqueur unique — aucune collision avec de vraies données. */
const RUN = `conv-e2e-${Date.now()}`;
const PASSWORD = `${RUN}-Aa1!`;

const created = [];

/**
 * Crée un compte confirmé et rend un client **porteur de son JWT**.
 *
 * Le client utilise la clé **anon** : c'est bien la RLS qui filtre, pas un
 * privilège de service. C'est la seule configuration qui teste ce que vit un
 * navigateur réel.
 */
async function makeUser(tag) {
  const email = `${RUN}-${tag}@yelhaa.invalid`;
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password: PASSWORD,
    email_confirm: true,
  });
  if (error)
    throw new Error(`création de ${tag} impossible : ${error.message}`);
  created.push(data.user.id);

  const session = createClient(url, anonKey, {
    auth: { persistSession: false },
  });
  const { error: signInError } = await session.auth.signInWithPassword({
    email,
    password: PASSWORD,
  });
  if (signInError) {
    throw new Error(`connexion de ${tag} impossible : ${signInError.message}`);
  }
  return { id: data.user.id, email, db: session };
}

let A;
let B;

try {
  A = await makeUser("a");
  B = await makeUser("b");
  console.log(`Deux comptes créés (${RUN}).\n`);

  // Le trigger d'inscription doit avoir créé les profils : la clé étrangère de
  // `conversations` en dépend.
  const { count: profileCount } = await admin
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .in("id", [A.id, B.id]);
  check("profils créés par le trigger d'inscription", profileCount, 2);

  console.log("=== 1. Création et lecture — chacun chez soi ===");
  const { data: convA, error: convAError } = await A.db
    .from("conversations")
    .insert({ user_id: A.id, title: "Conversation de A" })
    .select("id, title, created_at, updated_at")
    .single();
  assert(
    "A crée sa conversation",
    !convAError,
    convAError ? `${convAError.code} ${convAError.message}` : "",
  );

  const { data: convB } = await B.db
    .from("conversations")
    .insert({ user_id: B.id, title: "Conversation de B" })
    .select("id")
    .single();
  assert("B crée la sienne", Boolean(convB?.id));

  const listA = await A.db.from("conversations").select("id");
  check("A ne voit qu'une conversation", listA.data?.length, 1);
  check("et c'est la sienne", listA.data?.[0]?.id, convA.id);

  const listB = await B.db.from("conversations").select("id");
  check("B ne voit qu'une conversation", listB.data?.length, 1);
  check("et c'est la sienne", listB.data?.[0]?.id, convB.id);

  console.log("\n=== 2. Messages — écriture et propriété ===");
  const { error: msgError } = await A.db.from("messages").insert({
    conversation_id: convA.id,
    user_id: A.id,
    role: "user",
    content: "Premier message de A",
  });
  assert("A écrit dans sa conversation", !msgError, msgError?.message ?? "");

  // Le trigger doit écraser un `user_id` falsifié.
  await A.db.from("messages").insert({
    conversation_id: convA.id,
    user_id: B.id,
    role: "assistant",
    content: "Réponse avec user_id falsifié",
  });
  const { data: owners } = await admin
    .from("messages")
    .select("user_id")
    .eq("conversation_id", convA.id);
  check(
    "tous les messages appartiennent à A malgré la falsification",
    [...new Set(owners?.map((m) => m.user_id))],
    [A.id],
  );

  console.log("\n=== 3. updated_at remonte après un message ===");
  const { data: touched } = await A.db
    .from("conversations")
    .select("updated_at")
    .eq("id", convA.id)
    .single();
  assert(
    "updated_at postérieur à created_at",
    new Date(touched.updated_at) > new Date(convA.created_at),
    `${convA.created_at} → ${touched.updated_at}`,
  );

  console.log("\n=== 4. IDOR — B cible la conversation de A via l'API ===");
  const readForeign = await B.db
    .from("conversations")
    .select("id, title")
    .eq("id", convA.id);
  check("B ne lit pas la conversation de A", readForeign.data?.length, 0);

  const readForeignMessages = await B.db
    .from("messages")
    .select("id, content")
    .eq("conversation_id", convA.id);
  check("B ne lit aucun message de A", readForeignMessages.data?.length, 0);

  const renameForeign = await B.db
    .from("conversations")
    .update({ title: "Volée par B" })
    .eq("id", convA.id)
    .select("id");
  check("B ne renomme pas la conversation de A", renameForeign.data?.length, 0);

  const deleteForeign = await B.db
    .from("conversations")
    .delete()
    .eq("id", convA.id)
    .select("id");
  check(
    "B ne supprime pas la conversation de A",
    deleteForeign.data?.length,
    0,
  );

  const writeForeign = await B.db.from("messages").insert({
    conversation_id: convA.id,
    user_id: B.id,
    role: "user",
    content: "Intrusion",
  });
  assert(
    "B n'écrit pas dans la conversation de A",
    Boolean(writeForeign.error),
    "insertion acceptée",
  );

  const impersonate = await B.db
    .from("conversations")
    .insert({ user_id: A.id, title: "Créée au nom de A" })
    .select("id");
  assert(
    "B ne crée pas de conversation au nom de A",
    Boolean(impersonate.error),
    "insertion acceptée",
  );

  const reassign = await B.db
    .from("conversations")
    .update({ user_id: B.id })
    .eq("id", convA.id)
    .select("id");
  check("B ne se réassigne pas la conversation de A", reassign.data?.length, 0);

  const deleteForeignMessages = await B.db
    .from("messages")
    .delete()
    .eq("conversation_id", convA.id)
    .select("id");
  check(
    "B ne supprime aucun message de A",
    deleteForeignMessages.data?.length,
    0,
  );

  // Après toutes ces tentatives, l'état de A doit être intact.
  const { data: intact } = await admin
    .from("conversations")
    .select("title, user_id")
    .eq("id", convA.id)
    .single();
  check("titre de A intact", intact.title, "Conversation de A");
  check("propriétaire de A intact", intact.user_id, A.id);
  const { count: stillThere } = await admin
    .from("messages")
    .select("id", { count: "exact", head: true })
    .eq("conversation_id", convA.id);
  check("les 2 messages de A sont toujours là", stillThere, 2);

  console.log("\n=== 5. anon — rien, dans les deux sens ===");
  for (const table of ["conversations", "messages"]) {
    const { data, error } = await anon.from(table).select("*").limit(5);
    assert(
      `anon ne lit rien de « ${table} »`,
      Boolean(error) || (data?.length ?? 0) === 0,
      `${data?.length} ligne(s)`,
    );
  }
  const anonInsert = await anon
    .from("conversations")
    .insert({ user_id: A.id, title: "anon" });
  assert("anon n'insère aucune conversation", Boolean(anonInsert.error));
  const anonDelete = await anon
    .from("conversations")
    .delete()
    .eq("id", convA.id)
    .select("id");
  assert(
    "anon ne supprime rien",
    Boolean(anonDelete.error) || anonDelete.data?.length === 0,
  );

  console.log("\n=== 6. Contraintes appliquées par la base ===");
  const emptyTitle = await A.db
    .from("conversations")
    .insert({ user_id: A.id, title: "   " });
  assert("titre vide refusé par la base", Boolean(emptyTitle.error));
  const longTitle = await A.db
    .from("conversations")
    .insert({ user_id: A.id, title: "x".repeat(121) });
  assert("titre de 121 caractères refusé", Boolean(longTitle.error));
  const badRole = await A.db.from("messages").insert({
    conversation_id: convA.id,
    user_id: A.id,
    role: "system",
    content: "x",
  });
  assert("rôle « system » refusé", Boolean(badRole.error));

  console.log("\n=== 7. Message immuable ===");
  const { data: someMessage } = await A.db
    .from("messages")
    .select("id")
    .eq("conversation_id", convA.id)
    .limit(1)
    .single();
  const rewrite = await A.db
    .from("messages")
    .update({ content: "réécrit" })
    .eq("id", someMessage.id)
    .select("id");
  assert(
    "A ne réécrit pas son propre message",
    Boolean(rewrite.error) || rewrite.data?.length === 0,
    "mise à jour acceptée",
  );

  console.log("\n=== 8. Suppression en cascade ===");
  const { data: cascadeConv } = await A.db
    .from("conversations")
    .insert({ user_id: A.id, title: "À supprimer" })
    .select("id")
    .single();
  for (let i = 0; i < 10; i++) {
    await A.db.from("messages").insert({
      conversation_id: cascadeConv.id,
      user_id: A.id,
      role: i % 2 === 0 ? "user" : "assistant",
      content: `message ${i}`,
    });
  }
  const { count: before } = await admin
    .from("messages")
    .select("id", { count: "exact", head: true })
    .eq("conversation_id", cascadeConv.id);
  check("10 messages écrits", before, 10);

  const removed = await A.db
    .from("conversations")
    .delete()
    .eq("id", cascadeConv.id)
    .select("id");
  check("A supprime bien sa conversation", removed.data?.length, 1);

  const { count: afterConv } = await admin
    .from("conversations")
    .select("id", { count: "exact", head: true })
    .eq("id", cascadeConv.id);
  const { count: afterMsg } = await admin
    .from("messages")
    .select("id", { count: "exact", head: true })
    .eq("conversation_id", cascadeConv.id);
  check("conversation absente", afterConv, 0);
  check("messages absents (cascade)", afterMsg, 0);

  console.log("\n=== 9. Tri par updated_at décroissant ===");
  const { data: older } = await A.db
    .from("conversations")
    .insert({ user_id: A.id, title: "Plus ancienne" })
    .select("id")
    .single();
  await new Promise((r) => setTimeout(r, 1100));
  await A.db.from("messages").insert({
    conversation_id: convA.id,
    user_id: A.id,
    role: "user",
    content: "Je relance cette conversation",
  });
  const { data: ordered } = await A.db
    .from("conversations")
    .select("id")
    .order("updated_at", { ascending: false });
  check("la conversation relancée repasse en tête", ordered?.[0]?.id, convA.id);
  assert("l'autre suit", ordered?.[1]?.id === older.id);

  console.log("\n=== 10. Double soumission — aucun doublon involontaire ===");
  // Dix insertions simultanées du même titre : la base ne les fusionne pas,
  // c'est à l'application de ne les émettre qu'une fois. Ce contrôle mesure ce
  // que la base garantit réellement, sans prétendre à une idempotence absente.
  const burst = await Promise.all(
    Array.from({ length: 10 }, () =>
      A.db
        .from("conversations")
        .insert({ user_id: A.id, title: "Rafale" })
        .select("id")
        .single(),
    ),
  );
  const accepted = burst.filter((r) => !r.error).length;
  check(
    "les 10 insertions aboutissent (aucune idempotence en base)",
    accepted,
    10,
  );
  console.log(
    "        note : la déduplication est une responsabilité applicative,",
  );
  console.log(
    "        assurée côté client par le verrouillage du bouton d'envoi.",
  );
} catch (error) {
  failed++;
  console.log(`\n  FAIL  banc interrompu : ${error.message}`);
} finally {
  // Nettoyage inconditionnel : supprimer l'utilisateur cascade jusqu'aux
  // conversations et aux messages.
  for (const id of created) {
    await admin.auth.admin.deleteUser(id).catch(() => {});
  }
  const { count: leftovers } = await admin
    .from("conversations")
    .select("id", { count: "exact", head: true })
    .in(
      "user_id",
      created.length ? created : ["00000000-0000-0000-0000-000000000000"],
    );
  check("aucune donnée de test laissée derrière", leftovers ?? 0, 0);
}

console.log(
  `\n${failed === 0 ? "TOUS LES TESTS PASSENT" : "ECHECS"} — ${passed} pass, ${failed} fail`,
);
process.exit(failed === 0 ? 0 : 1);
