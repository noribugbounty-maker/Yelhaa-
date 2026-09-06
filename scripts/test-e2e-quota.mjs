/**
 * Validation E2E du quota et de la re-sélection — **base Supabase réelle**.
 *
 *   node --env-file-if-exists=.env.local scripts/test-e2e-quota.mjs
 *
 * Chaque appel `rpc()` part en HTTP indépendant et atterrit sur une connexion
 * distincte du pool PostgREST : `Promise.all` produit donc de la **vraie
 * concurrence multi-connexions**, ce qu'aucun banc local ne pouvait simuler.
 *
 * Le script crée ses fixtures, les vérifie, puis les supprime. Il ne touche
 * qu'aux lignes qu'il a créées.
 */
import { createClient } from "@supabase/supabase-js";

const db = createClient(
  process.env["NEXT_PUBLIC_SUPABASE_URL"],
  process.env["SUPABASE_SERVICE_ROLE_KEY"],
  { auth: { persistSession: false } },
);

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

const period = new Date(
  Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), 1),
)
  .toISOString()
  .slice(0, 10);

const { data: profile } = await db
  .from("profiles")
  .select("id, plan")
  .limit(1)
  .maybeSingle();

if (!profile) {
  console.log("BLOCKED — aucun profil en base.");
  process.exit(2);
}
const USER = profile.id;
console.log(`Utilisateur de test : plan=${profile.plan}\n`);

/** Sauvegarde puis restauration : on ne laisse aucune trace. */
const { data: before } = await db
  .from("usage_counters")
  .select("generations_used")
  .eq("user_id", USER)
  .eq("period_start", period)
  .maybeSingle();
const initial = before?.generations_used ?? null;

const createdGenerations = [];

const counter = async () =>
  (
    await db
      .from("usage_counters")
      .select("generations_used")
      .eq("user_id", USER)
      .eq("period_start", period)
      .maybeSingle()
  ).data?.generations_used ?? 0;

const clearCounter = async () =>
  db
    .from("usage_counters")
    .delete()
    .eq("user_id", USER)
    .eq("period_start", period);

/** N réservations lancées en parallèle — N requêtes HTTP, N connexions. */
async function burst(count, limit) {
  const results = await Promise.all(
    Array.from({ length: count }, () =>
      db.rpc("reserve_generation", { p_user_id: USER, p_limit: limit }),
    ),
  );
  /*
   * Au-delà d'une trentaine de requêtes simultanées, quelques-unes échouent au
   * transport (`fetch failed`) avant d'atteindre Postgres. Ce sont des refus
   * côté réseau, pas des réservations : elles sont comptées à part, et
   * l'invariant porte sur `accepted`, jamais sur le total.
   */
  const errors = results.filter((r) => r.error);
  const granted = results.filter((r) => !r.error && r.data !== null);
  return {
    accepted: granted.length,
    refused: results.filter((r) => !r.error && r.data === null).length,
    transportErrors: errors.length,
    values: granted.map((r) => r.data.used).sort((a, b) => a - b),
  };
}

try {
  for (const n of [10, 20, 50]) {
    console.log(`=== F14 — ${n} réservations CONCURRENTES / limite 3 ===`);
    await clearCounter();
    const r = await burst(n, 3);
    const final = await counter();
    console.log(
      `  requests=${n}  accepted=${r.accepted}  refused=${r.refused}` +
        `  transport=${r.transportErrors}  final=${final}`,
    );
    check("accepted == 3", r.accepted, 3);
    check(
      "toutes les requêtes comptabilisées",
      r.accepted + r.refused + r.transportErrors,
      n,
    );
    check("compteur final == 3", final, 3);
    check("valeurs distinctes 1,2,3", r.values, [1, 2, 3]);
    check("INVARIANT accepted <= limit", r.accepted <= 3, true);
    console.log("");
  }

  console.log("=== Limite 1 : une seule acceptée sur 30 concurrentes ===");
  await clearCounter();
  const one = await burst(30, 1);
  console.log(
    `  accepted=${one.accepted}  refused=${one.refused}  transport=${one.transportErrors}`,
  );
  check("accepted == 1", one.accepted, 1);
  check(
    "toutes les requêtes comptabilisées",
    one.accepted + one.refused + one.transportErrors,
    30,
  );
  check("compteur == 1", await counter(), 1);

  console.log(
    "\n=== Remboursement : réservation → échec → remboursement → nouvelle réservation ===",
  );
  await clearCounter();
  await burst(3, 3);
  check("quota épuisé", await counter(), 3);
  check(
    "réservation refusée",
    (await db.rpc("reserve_generation", { p_user_id: USER, p_limit: 3 })).data,
    null,
  );
  const refunded = await db.rpc("refund_generation", {
    p_user_id: USER,
    p_period_start: period,
  });
  check("remboursement rend 2", refunded.data, 2);
  const again = await db.rpc("reserve_generation", {
    p_user_id: USER,
    p_limit: 3,
  });
  check("nouvelle réservation accordée", again.data?.used, 3);

  console.log("\n=== Double remboursement concurrent : jamais de négatif ===");
  await clearCounter();
  await burst(3, 3);
  const refunds = await Promise.all(
    Array.from({ length: 10 }, () =>
      db.rpc("refund_generation", { p_user_id: USER, p_period_start: period }),
    ),
  );
  check(
    "exactement 3 remboursements effectifs",
    refunds.filter((r) => !r.error && r.data !== null).length,
    3,
  );
  check("compteur à 0, jamais négatif", await counter(), 0);

  console.log(
    "\n=== Remboursement d'un autre utilisateur / période étrangère ===",
  );
  await clearCounter();
  await db.rpc("reserve_generation", { p_user_id: USER, p_limit: 3 });
  const foreign = await db.rpc("refund_generation", {
    p_user_id: "00000000-0000-0000-0000-000000000000",
    p_period_start: period,
  });
  check("refund d'un autre user ne rend rien", foreign.data, null);
  check("compteur intact", await counter(), 1);
  const wrongPeriod = await db.rpc("refund_generation", {
    p_user_id: USER,
    p_period_start: "2020-01-01",
  });
  check("refund sur période étrangère ne rend rien", wrongPeriod.data, null);
  check("compteur toujours intact", await counter(), 1);

  console.log("\n=== Re-sélection : échelle 1→5 acceptées, 6e refusée ===");
  const { data: template } = await db
    .from("prompt_templates")
    .select("id")
    .eq("is_active", true)
    .limit(1)
    .maybeSingle();

  const { data: gen, error: genError } = await db
    .from("generations")
    .insert({
      user_id: USER,
      idea: "Fixture de validation E2E du budget de re-sélection.",
      output: "sortie de test",
      template_id: template?.id ?? null,
      domain: "saas",
    })
    .select("id, template_reselects")
    .single();

  if (genError) {
    console.log(
      `  BLOCKED — création de la fixture impossible : ${genError.message}`,
    );
    failed++;
  } else {
    createdGenerations.push(gen.id);
    check("budget initial à 0", gen.template_reselects, 0);

    const ladder = [];
    for (let i = 1; i <= 6; i++) {
      const r = await db.rpc("consume_template_reselect", {
        p_generation_id: gen.id,
        p_user_id: USER,
        p_max: 5,
      });
      ladder.push(r.data);
    }
    console.log(`  échelle : ${JSON.stringify(ladder)}`);
    check("1→5 acceptées puis 6e refusée", ladder, [1, 2, 3, 4, 5, null]);

    const { data: after } = await db
      .from("generations")
      .select("template_reselects")
      .eq("id", gen.id)
      .single();
    check("compteur DB == 5", after.template_reselects, 5);

    console.log("\n=== Re-sélection : génération d'un autre utilisateur ===");
    const stranger = await db.rpc("consume_template_reselect", {
      p_generation_id: gen.id,
      p_user_id: "00000000-0000-0000-0000-000000000000",
      p_max: 5,
    });
    check("user étranger refusé", stranger.data, null);

    console.log("\n=== Re-sélection : génération inexistante ===");
    const ghost = await db.rpc("consume_template_reselect", {
      p_generation_id: "00000000-0000-0000-0000-000000000000",
      p_user_id: USER,
      p_max: 5,
    });
    check("génération inexistante refusée", ghost.data, null);

    console.log(
      "\n=== Re-sélection : 10 tentatives concurrentes sur budget 5 ===",
    );
    const { data: gen2 } = await db
      .from("generations")
      .insert({
        user_id: USER,
        idea: "Fixture de validation E2E — concurrence re-sélection.",
        output: "sortie de test",
        template_id: template?.id ?? null,
        domain: "saas",
      })
      .select("id")
      .single();
    createdGenerations.push(gen2.id);

    const race = await Promise.all(
      Array.from({ length: 10 }, () =>
        db.rpc("consume_template_reselect", {
          p_generation_id: gen2.id,
          p_user_id: USER,
          p_max: 5,
        }),
      ),
    );
    const ok = race.filter((r) => !r.error && r.data !== null).length;
    const { data: after2 } = await db
      .from("generations")
      .select("template_reselects")
      .eq("id", gen2.id)
      .single();
    console.log(`  accepted=${ok}  compteur=${after2.template_reselects}`);
    check("exactement 5 acceptées", ok, 5);
    check("compteur == 5, jamais au-delà", after2.template_reselects, 5);
  }
} finally {
  // Nettoyage : fixtures supprimées, compteur restauré à son état initial.
  for (const id of createdGenerations) {
    await db.from("generations").delete().eq("id", id);
  }
  await clearCounter();
  if (initial !== null) {
    await db
      .from("usage_counters")
      .insert({
        user_id: USER,
        period_start: period,
        generations_used: initial,
      });
  }
  const { count } = await db
    .from("generations")
    .select("id", { count: "exact", head: true });
  console.log(
    `\nNettoyage : ${createdGenerations.length} fixture(s) supprimée(s), ` +
      `compteur restauré à ${initial ?? "(aucune ligne)"}, ` +
      `${count} génération(s) en base.`,
  );
}

console.log(
  `\n${failed === 0 ? "TOUS LES TESTS PASSENT" : "ECHECS"} — ${passed} pass, ${failed} fail`,
);
process.exit(failed === 0 ? 0 : 1);
