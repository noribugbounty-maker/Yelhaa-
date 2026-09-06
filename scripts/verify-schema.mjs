/**
 * Vérification du schéma déployé — **base Supabase réelle**, pas les fichiers.
 *
 *   node --env-file-if-exists=.env.local scripts/verify-schema.mjs
 *
 * Une migration présente dans `supabase/migrations/` ne prouve rien : ce qui
 * compte est ce que la base contient. Ce banc interroge la base de production
 * et refuse de conclure autrement que sur ce qu'elle répond.
 *
 * Trois familles de contrôles :
 *
 *   1. **Migrations** — chaque table et chaque colonne critique existe.
 *   2. **RPC** — chaque fonction est présente et appelable. L'absence se
 *      distingue de l'erreur métier par le code PostgREST : `PGRST202` signifie
 *      « fonction introuvable », tout autre code signifie qu'elle existe et
 *      a refusé l'appel — ce qui est un succès pour ce contrôle.
 *   3. **RLS / IDOR** — avec la clé **anon**, donc sans session, aucune lecture
 *      ni écriture des tables privées ne doit aboutir. C'est le contrôle qui
 *      attrape une policy oubliée après une migration.
 *
 * Aucune donnée n'est créée ni modifiée : le script est en lecture seule, à
 * l'exception des appels RPC sur un utilisateur nul qui ne peuvent rien écrire.
 */
import { createClient } from "@supabase/supabase-js";

const url =
  process.env["NEXT_PUBLIC_SUPABASE_URL"] ?? process.env["SUPABASE_URL"];
const anonKey =
  process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"] ??
  process.env["SUPABASE_ANON_KEY"];
const serviceKey = process.env["SUPABASE_SERVICE_ROLE_KEY"];

if (!url || !anonKey || !serviceKey) {
  console.log(
    "BLOCKED — configuration absente. Requis : URL, clé anon, clé service_role.",
  );
  process.exit(2);
}

const admin = createClient(url, serviceKey, {
  auth: { persistSession: false },
});
const anon = createClient(url, anonKey, { auth: { persistSession: false } });

let passed = 0;
let failed = 0;

function assert(label, condition, detail = "") {
  if (condition) passed++;
  else failed++;
  console.log(
    `  ${condition ? "PASS" : "FAIL"}  ${label}${condition ? "" : `\n        ${detail}`}`,
  );
}

/** UUID nul — aucun utilisateur ne le porte, donc aucun effet de bord. */
const NIL = "00000000-0000-0000-0000-000000000000";

console.log("=== 1. MIGRATIONS — tables présentes ===");
const TABLES = [
  "profiles",
  "usage_counters",
  "generations",
  "prompt_templates",
  "faq_articles",
  "contact_messages",
  "stripe_events",
  "conversations",
  "messages",
];
for (const table of TABLES) {
  const { error } = await admin
    .from(table)
    .select("*", { count: "exact", head: true });
  assert(
    `table « ${table} »`,
    !error,
    error ? `${error.code ?? "sans code"} : ${error.message}` : "",
  );
}

console.log("\n=== 2. MIGRATIONS — colonnes critiques ===");
{
  const { error } = await admin
    .from("generations")
    .select("template_reselects")
    .limit(1);
  assert(
    "generations.template_reselects (20260811090000_reselect_budget)",
    !error,
    error ? `${error.code ?? ""} ${error.message}` : "",
  );
}
{
  const { error } = await admin
    .from("usage_counters")
    .select("period_start, generations_used")
    .limit(1);
  assert("usage_counters.period_start + generations_used", !error);
}
{
  const { error } = await admin
    .from("profiles")
    .select("plan, stripe_customer_id, stripe_subscription_id")
    .limit(1);
  assert("profiles.plan + identifiants Stripe", !error);
}
{
  const { error } = await admin
    .from("conversations")
    .select("id, user_id, title, created_at, updated_at")
    .limit(1);
  assert(
    "conversations : toutes les colonnes (20260812090000)",
    !error,
    error ? `${error.code ?? ""} ${error.message}` : "",
  );
}
{
  const { error } = await admin
    .from("messages")
    .select(
      "id, conversation_id, user_id, role, content, generation_id, created_at",
    )
    .limit(1);
  assert(
    "messages : toutes les colonnes (20260812090000)",
    !error,
    error ? `${error.code ?? ""} ${error.message}` : "",
  );
}
{
  /*
   * Ce banc a déjà rendu un vert trompeur : il passait 31/31 alors que
   * `20260813090000_generation_history.sql` n'avait jamais été appliquée. Un
   * fichier de migration présent dans le dépôt ne prouve rien sur l'état de la
   * base — c'est la base qu'il faut interroger. Toute migration ajoutée ici
   * doit désormais l'être avec une assertion, sinon son absence reste
   * invisible.
   */
  const { error } = await admin
    .from("generations")
    .select("is_favorite")
    .limit(1);
  assert(
    "generations.is_favorite (20260813090000_generation_history)",
    !error,
    error
      ? `${error.code ?? ""} ${error.message}\n        ` +
        "migration non appliquée — exécuter : npx supabase db push"
      : "",
  );
}

console.log("\n=== 3. RPC — fonctions déployées et appelables ===");
/**
 * `PGRST202` = fonction introuvable. Tout autre résultat — succès ou refus
 * métier — prouve que la fonction existe, ce qui est l'objet du contrôle.
 */
const rpcExists = async (name, args) => {
  const { error } = await admin.rpc(name, args);
  return { found: error?.code !== "PGRST202", error };
};

for (const [name, args] of [
  ["reserve_generation", { p_user_id: NIL, p_limit: 1 }],
  ["refund_generation", { p_user_id: NIL, p_period_start: "2020-01-01" }],
  [
    "consume_template_reselect",
    { p_generation_id: NIL, p_user_id: NIL, p_max: 5 },
  ],
]) {
  const { found, error } = await rpcExists(name, args);
  assert(
    `fonction « ${name} » déployée`,
    found,
    found ? "" : `introuvable — ${error?.message ?? ""}`,
  );
}

console.log("\n=== 4. RLS / IDOR — la clé anon ne lit rien de privé ===");
/**
 * Deux issues acceptables et une seule inacceptable : soit PostgREST refuse
 * (erreur), soit la policy filtre tout (zéro ligne). Recevoir des lignes avec
 * la clé anon serait une fuite.
 */
const PRIVATE_TABLES = [
  "profiles",
  "generations",
  "usage_counters",
  "contact_messages",
  "stripe_events",
  "conversations",
  "messages",
];
for (const table of PRIVATE_TABLES) {
  const { data, error } = await anon.from(table).select("*").limit(5);
  const rows = data?.length ?? 0;
  assert(
    `anon ne lit aucune ligne de « ${table} »`,
    Boolean(error) || rows === 0,
    `${rows} ligne(s) renvoyée(s) sans session`,
  );
}

console.log("\n=== 5. RLS — la clé anon n'écrit rien de privé ===");
{
  const { error } = await anon
    .from("generations")
    .insert({ user_id: NIL, idea: "sonde RLS", output: "sonde" });
  assert(
    "insertion refusée dans generations",
    Boolean(error),
    "insertion acceptée sans session",
  );
}
{
  const { error } = await anon
    .from("profiles")
    .update({ plan: "agency" })
    .eq("id", NIL);
  assert(
    "élévation de plan refusée sur profiles",
    Boolean(error),
    "mise à jour acceptée sans session",
  );
}
{
  const { error } = await anon
    .from("usage_counters")
    .update({ generations_used: 0 })
    .eq("user_id", NIL);
  assert(
    "remise à zéro du compteur refusée",
    Boolean(error),
    "mise à jour acceptée sans session",
  );
}
{
  // Le formulaire de contact passe par une route serveur : l'écriture directe
  // depuis le navigateur doit être fermée.
  const { error } = await anon
    .from("contact_messages")
    .insert({ name: "sonde", email: "sonde@test.invalid", message: "sonde" });
  assert(
    "insertion directe refusée dans contact_messages",
    Boolean(error),
    "insertion acceptée sans session",
  );
}

console.log("\n=== 6. Lecture publique — ce qui doit rester ouvert l'est ===");
for (const table of ["faq_articles", "prompt_templates"]) {
  const { error } = await anon
    .from(table)
    .select("*", { count: "exact", head: true });
  assert(
    `anon peut interroger « ${table} »`,
    !error,
    error ? `${error.code ?? ""} ${error.message}` : "",
  );
}
{
  const { count } = await anon
    .from("faq_articles")
    .select("slug", { count: "exact", head: true })
    .eq("is_active", true);
  assert(
    "les 12 articles de FAQ sont semés",
    count === 12,
    `${count} article(s) actif(s)`,
  );
}

console.log(
  `\n${failed === 0 ? "TOUS LES TESTS PASSENT" : "ECHECS"} — ${passed} pass, ${failed} fail`,
);
process.exit(failed === 0 ? 0 : 1);
