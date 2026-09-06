/**
 * Quota affiché dans la barre de navigation — **base Supabase réelle**.
 *
 *   npm run test:quota:view
 *
 * Ce banc couvre le seul chemin qui alimente `GET /api/me/quota` :
 * `readQuotaState`, appelé avec le **client de session** de l'utilisateur.
 *
 * Le point qui compte n'est pas que le compteur soit juste — `test:quota:sql`
 * s'en charge — mais qu'il soit **impossible de lire celui d'un autre**. La
 * route n'accepte aucun identifiant en entrée ; ce banc va plus loin et force
 * l'identifiant d'un tiers dans la fonction elle-même, pour vérifier que la
 * barrière est la RLS et non une comparaison écrite en TypeScript.
 *
 * Les deux comptes sont créés puis supprimés. Aucune ligne préexistante n'est
 * touchée.
 */
import { createClient } from "@supabase/supabase-js";

import { formatResetDate, nextPlanAbove, PLANS } from "../lib/config.ts";
import { GENERATION_LIMITS, readQuotaState } from "../lib/quota.ts";

const url =
  process.env["NEXT_PUBLIC_SUPABASE_URL"] ?? process.env["SUPABASE_URL"];
const anonKey =
  process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"] ??
  process.env["SUPABASE_ANON_KEY"];
const serviceKey = process.env["SUPABASE_SERVICE_ROLE_KEY"];

if (!url || !anonKey || !serviceKey) {
  console.log(
    "BLOCKED — NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY et " +
      "SUPABASE_SERVICE_ROLE_KEY sont requis.",
  );
  process.exit(2);
}

const admin = createClient(url, serviceKey, {
  auth: { persistSession: false },
});

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

const RUN = `quota-view-${Date.now()}`;
const PASSWORD = `${RUN}-Aa1!`;
const created = [];

/** Compte confirmé, plus un client porteur de son JWT (clé **anon**). */
async function makeUser(tag) {
  const email = `${RUN}-${tag}@yelhaa.invalid`;
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password: PASSWORD,
    email_confirm: true,
  });
  if (error) throw new Error(`création de ${tag} impossible : ${error.message}`);
  created.push(data.user.id);

  const session = createClient(url, anonKey, {
    auth: { persistSession: false },
  });
  const { error: signInError } = await session.auth.signInWithPassword({
    email,
    password: PASSWORD,
  });
  if (signInError)
    throw new Error(`connexion de ${tag} impossible : ${signInError.message}`);

  return { id: data.user.id, email, db: session };
}

const period = new Date(
  Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), 1),
)
  .toISOString()
  .slice(0, 10);

let A;
let B;

try {
  A = await makeUser("a");
  B = await makeUser("b");
  console.log(`Deux comptes créés (${RUN}).\n`);

  console.log("=== 1. État initial d'un compte neuf ===");
  {
    const state = await readQuotaState(A.db, A.id);
    assert("un état est renvoyé", state !== null, "readQuotaState a rendu null");
    check("plan par défaut", state?.plan, "free");
    check("limite du plan free", state?.limit, GENERATION_LIMITS.free);
    check("aucune génération consommée", state?.used, 0);
    check("restant = limite", state?.remaining, GENERATION_LIMITS.free);
    assert(
      "resetsAt est une date lisible",
      typeof state?.resetsAt === "string" &&
        !Number.isNaN(new Date(state.resetsAt).getTime()),
      String(state?.resetsAt),
    );
    assert(
      "resetsAt tombe le 1er du mois, en UTC",
      new Date(state.resetsAt).getUTCDate() === 1,
      state.resetsAt,
    );
    assert(
      "resetsAt est dans le futur",
      new Date(state.resetsAt).getTime() > Date.now(),
      state.resetsAt,
    );
  }

  console.log("\n=== 2. Le compteur réel remonte ===");
  {
    await admin
      .from("usage_counters")
      .upsert(
        { user_id: A.id, period_start: period, generations_used: 2 },
        { onConflict: "user_id,period_start" },
      );

    const state = await readQuotaState(A.db, A.id);
    check("used reflète la base", state?.used, 2);
    check("remaining = limite - used", state?.remaining, GENERATION_LIMITS.free - 2);
  }

  console.log("\n=== 3. Quota épuisé — ce que la barre doit proposer ===");
  {
    await admin
      .from("usage_counters")
      .upsert(
        {
          user_id: A.id,
          period_start: period,
          generations_used: GENERATION_LIMITS.free,
        },
        { onConflict: "user_id,period_start" },
      );

    const state = await readQuotaState(A.db, A.id);
    check("remaining tombe à zéro", state?.remaining, 0);

    const upgrade = nextPlanAbove(state.plan);
    check("un plan supérieur est proposé", upgrade?.id, "pro");
    check(
      "le nombre annoncé vient de la table des plans",
      upgrade?.generationsPerMonth,
      GENERATION_LIMITS.pro,
    );
    assert(
      "la date affichée n'est jamais vide pour un état valide",
      formatResetDate(state.resetsAt).length > 0,
      formatResetDate(state.resetsAt),
    );
  }

  console.log("\n=== 4. Dépassement : jamais de reste négatif ===");
  {
    // Plan rétrogradé en cours de mois : le compteur dépasse la limite.
    await admin
      .from("usage_counters")
      .upsert(
        { user_id: A.id, period_start: period, generations_used: 99 },
        { onConflict: "user_id,period_start" },
      );

    const state = await readQuotaState(A.db, A.id);
    check("remaining borné à zéro", state?.remaining, 0);
    assert(
      "aucun nombre négatif ne peut atteindre l'écran",
      state.remaining >= 0 && state.limit >= 0,
      JSON.stringify(state),
    );
  }

  console.log("\n=== 5. IDOR — le quota d'un tiers reste hors d'atteinte ===");
  {
    /*
     * B passe sur `agency` avec un compteur bien rempli. Si A pouvait lire la
     * ligne de B, la différence sauterait aux yeux : plan `agency`, limite 500.
     */
    await admin.from("profiles").update({ plan: "agency" }).eq("id", B.id);
    await admin
      .from("usage_counters")
      .upsert(
        { user_id: B.id, period_start: period, generations_used: 123 },
        { onConflict: "user_id,period_start" },
      );

    // Contrôle : avec sa propre session, B voit bien ses vraies valeurs.
    const own = await readQuotaState(B.db, B.id);
    check("B voit son plan agency", own?.plan, "agency");
    check("B voit ses 123 générations", own?.used, 123);

    // L'attaque : la session de A, l'identifiant de B.
    const stolen = await readQuotaState(A.db, B.id);
    assert(
      "A n'obtient jamais le plan de B",
      stolen === null || stolen.plan !== "agency",
      JSON.stringify(stolen),
    );
    assert(
      "A n'obtient jamais la limite de B",
      stolen === null || stolen.limit !== GENERATION_LIMITS.agency,
      JSON.stringify(stolen),
    );
    assert(
      "A n'obtient jamais le compteur de B",
      stolen === null || stolen.used !== 123,
      JSON.stringify(stolen),
    );

    // Et l'inverse, pour écarter un privilège accidentel dans un seul sens.
    const reverse = await readQuotaState(B.db, A.id);
    assert(
      "B n'obtient pas davantage le compteur de A",
      reverse === null || reverse.used !== 99,
      JSON.stringify(reverse),
    );
  }

  console.log("\n=== 6. Cohérence des plans annoncés ===");
  {
    for (const plan of PLANS) {
      check(
        `${plan.id} : la page de tarifs annonce la limite du serveur`,
        plan.generationsPerMonth,
        GENERATION_LIMITS[plan.id],
      );
    }
    check("aucun plan au-dessus du plus élevé", nextPlanAbove("agency"), null);
  }
} finally {
  for (const id of created) {
    await admin.from("usage_counters").delete().eq("user_id", id);
    await admin.auth.admin.deleteUser(id).catch(() => {});
  }
  console.log("\nComptes de test supprimés.");
}

console.log(
  `\n${failed === 0 ? "TOUS LES TESTS PASSENT" : "ECHECS"} — ${passed} pass, ${failed} fail`,
);
process.exit(failed === 0 ? 0 : 1);
