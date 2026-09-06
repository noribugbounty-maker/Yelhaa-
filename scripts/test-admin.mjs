/**
 * Rôle administrateur — reconnaissance, quota non compté, et escalade.
 *
 *   npm run test:admin
 *
 * Deux garanties sont visées, et la seconde compte plus que la première.
 *
 * 1. Le rôle se déduit **uniquement** de la session validée par Supabase.
 * 2. Un administrateur ne réserve rien : `reserve_generation` n'est pas
 *    appelée, donc aucun compteur ne bouge et il n'y a rien à rembourser.
 *
 * La lecture de source à la fin n'est pas de la cosmétique : elle vérifie que
 * la route n'a pas une seconde voie où un champ de la requête déciderait du
 * rôle. C'est le seul contrôle qui survivrait à un refactor distrait.
 */
import { readFileSync } from "node:fs";

import { adminEmails, isAdminUser } from "../lib/auth/admin.ts";
import { unmeteredReservation, UNMETERED_LIMIT } from "../lib/quota.ts";

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

const ADMIN = "nori.bugbounty@gmail.com";
const OTHER = "quelquun.dautre@example.com";

/** Utilisateur tel que `getCurrentUser()` le rend. */
const user = (over = {}) => ({
  id: "11111111-1111-1111-1111-111111111111",
  email: ADMIN,
  email_confirmed_at: "2026-01-01T00:00:00.000Z",
  ...over,
});

const withEnv = (value, run) => {
  const previous = process.env["ADMIN_EMAILS"];
  if (value === undefined) delete process.env["ADMIN_EMAILS"];
  else process.env["ADMIN_EMAILS"] = value;
  try {
    return run();
  } finally {
    if (previous === undefined) delete process.env["ADMIN_EMAILS"];
    else process.env["ADMIN_EMAILS"] = previous;
  }
};

console.log("=== 1. Fermé par défaut ===");
{
  withEnv(undefined, () => {
    check("variable absente : personne n'est admin", isAdminUser(user()), false);
    check("aucune adresse déclarée", adminEmails(), []);
  });
  withEnv("", () => {
    check("variable vide : personne n'est admin", isAdminUser(user()), false);
  });
  withEnv("   ,  , ", () => {
    check("séparateurs seuls : personne n'est admin", isAdminUser(user()), false);
    check("aucune adresse retenue", adminEmails(), []);
  });
}

console.log("\n=== 2. Reconnaissance ===");
withEnv(ADMIN, () => {
  check("l'adresse déclarée et confirmée est admin", isAdminUser(user()), true);
  check(
    "une autre adresse ne l'est pas",
    isAdminUser(user({ email: OTHER })),
    false,
  );
  check("casse ignorée", isAdminUser(user({ email: ADMIN.toUpperCase() })), true);
  check(
    "espaces ignorés",
    isAdminUser(user({ email: `  ${ADMIN}  ` })),
    true,
  );
  check("aucun utilisateur : refus", isAdminUser(null), false);
  check("utilisateur sans e-mail : refus", isAdminUser(user({ email: null })), false);
  check("e-mail vide : refus", isAdminUser(user({ email: "" })), false);
});

withEnv(` ${ADMIN.toUpperCase()} , ${OTHER} `, () => {
  check("liste multiple, casse et espaces", isAdminUser(user()), true);
  check("second de la liste reconnu", isAdminUser(user({ email: OTHER })), true);
  check("adresse hors liste refusée", isAdminUser(user({ email: "x@y.z" })), false);
});

console.log("\n=== 3. L'adresse doit être confirmée ===");
withEnv(ADMIN, () => {
  // Sans cette condition, créer un compte avec l'adresse avant son
  // propriétaire suffirait à hériter du rôle.
  check(
    "adresse non confirmée : refus",
    isAdminUser(user({ email_confirmed_at: null })),
    false,
  );
  check(
    "champ absent : refus",
    isAdminUser({ id: "x", email: ADMIN }),
    false,
  );
  check(
    "chaîne vide : refus",
    isAdminUser(user({ email_confirmed_at: "" })),
    false,
  );
});

console.log("\n=== 4. Aucune escalade depuis le client ===");
withEnv(ADMIN, () => {
  /*
   * `isAdminUser` ne lit que `email` et `email_confirmed_at`. Tout le reste
   * peut être posé par un attaquant sans effet — et c'est vérifié plutôt que
   * supposé.
   */
  const hostile = {
    id: "22222222-2222-2222-2222-222222222222",
    email: OTHER,
    email_confirmed_at: "2026-01-01T00:00:00.000Z",
    isAdmin: true,
    is_admin: true,
    admin: true,
    role: "admin",
    plan: "admin",
    app_metadata: { role: "admin", claims_admin: true },
    user_metadata: { isAdmin: true, plan: "admin" },
  };
  check("isAdmin=true ignoré", isAdminUser(hostile), false);
  check(
    "plan=admin ignoré",
    isAdminUser({ ...hostile, plan: "admin" }),
    false,
  );
  check(
    "app_metadata.role ignoré",
    isAdminUser({ ...hostile, app_metadata: { role: "admin" } }),
    false,
  );
  check(
    "user_metadata ignoré",
    isAdminUser({ ...hostile, user_metadata: { admin: true } }),
    false,
  );
  // L'identifiant de l'admin dans le corps ne change rien : c'est l'e-mail de
  // la session qui décide.
  check(
    "identifiant admin usurpé ignoré",
    isAdminUser({ ...hostile, id: user().id }),
    false,
  );
});

console.log("\n=== 5. Stabilité entre sessions ===");
withEnv(ADMIN, () => {
  // Le rôle est recalculé à chaque appel depuis l'e-mail de la session : il ne
  // dépend d'aucun état conservé, donc déconnexion et reconnexion le rendent
  // à l'identique.
  const results = Array.from({ length: 5 }, () => isAdminUser(user()));
  check("cinq évaluations successives identiques", results, [
    true,
    true,
    true,
    true,
    true,
  ]);
  // Et une session détruite ne laisse aucun privilège.
  check("sans session, aucun privilège", isAdminUser(null), false);
  check("session vide, aucun privilège", isAdminUser(undefined), false);
});

console.log("\n=== 6. La variable est relue à chaque appel ===");
{
  // Figée à l'import, une variable posée au déploiement ne serait jamais vue.
  withEnv(undefined, () => {
    check("avant déclaration", isAdminUser(user()), false);
  });
  withEnv(ADMIN, () => {
    check("après déclaration", isAdminUser(user()), true);
  });
  withEnv(OTHER, () => {
    check("après retrait de la liste", isAdminUser(user()), false);
  });
}

console.log("\n=== 7. Réservation non comptée ===");
{
  const reservation = unmeteredReservation("free");
  check("la réservation est autorisée", reservation.allowed, true);
  check("le plan commercial est conservé", reservation.state.plan, "free");
  check("la limite est infinie", reservation.state.limit, UNMETERED_LIMIT);
  check("aucune unité consommée", reservation.state.used, 0);
  check("le reste est infini", reservation.state.remaining, UNMETERED_LIMIT);
  assert(
    "la limite n'est pas un grand nombre déguisé",
    reservation.state.limit === Number.POSITIVE_INFINITY,
    String(reservation.state.limit),
  );
  assert(
    "resetsAt reste une date lisible",
    !Number.isNaN(new Date(reservation.state.resetsAt).getTime()),
    reservation.state.resetsAt,
  );

  // Rien n'a été pris, donc le remboursement ne rend rien — et surtout n'écrit
  // rien : la fonction n'a aucun client de base dans sa signature.
  check("le remboursement ne rend rien", await reservation.refund(), null);
  check("un second remboursement non plus", await reservation.refund(), null);
  check(
    "la fonction ne reçoit aucun client de base",
    unmeteredReservation.length,
    1,
  );

  // Le plan payant est conservé tel quel : le rôle ne réécrit pas la facturation.
  for (const plan of ["free", "pro", "agency"]) {
    check(`plan ${plan} conservé`, unmeteredReservation(plan).state.plan, plan);
  }
}

console.log("\n=== 8. Concurrence — rien à sérialiser ===");
{
  /*
   * Le point du §5 : plusieurs générations administrateur simultanées ne
   * peuvent pas se marcher dessus, parce qu'aucune n'écrit. Ce banc le vérifie
   * sur la seule chose qui pourrait diverger — l'état rendu.
   */
  for (const count of [10, 20, 50]) {
    const results = await Promise.all(
      Array.from({ length: count }, async () => {
        const reservation = unmeteredReservation("free");
        const refunded = await reservation.refund();
        return {
          allowed: reservation.allowed,
          used: reservation.state.used,
          refunded,
        };
      }),
    );
    assert(
      `${count} réservations concurrentes : toutes autorisées`,
      results.every((r) => r.allowed === true),
    );
    assert(
      `${count} réservations concurrentes : aucun compteur consommé`,
      results.every((r) => r.used === 0),
    );
    assert(
      `${count} réservations concurrentes : aucun remboursement`,
      results.every((r) => r.refunded === null),
    );
  }
}

console.log("\n=== 9. La route ne connaît qu'une source de rôle ===");
{
  const source = readFileSync("app/api/generate/route.ts", "utf8");

  assert(
    "le rôle vient de isAdminUser(user)",
    /isAdminUser\(user\)/.test(source),
    "appel introuvable",
  );
  check(
    "aucun champ de la requête ne décide du rôle",
    /parsed\.data\.(isAdmin|admin|role|plan)/.test(source),
    false,
  );
  check(
    "aucun en-tête ne décide du rôle",
    /headers\.get\(["'](x-admin|x-role|x-is-admin)/i.test(source),
    false,
  );
  check(
    "aucun paramètre d'URL ne décide du rôle",
    /searchParams\.get\(["'](admin|role|isAdmin)/i.test(source),
    false,
  );
  assert(
    "la réservation normale reste sur la branche non administrateur",
    /isAdmin\s*\n?\s*\?\s*unmeteredReservation[\s\S]{0,160}:\s*await reserveGeneration/.test(
      source,
    ),
    "la branche conditionnelle attendue est absente",
  );
  assert(
    "reserve_generation n'est appelée qu'à un seul endroit",
    (source.match(/reserveGeneration\(/g) ?? []).length === 1,
    `${(source.match(/reserveGeneration\(/g) ?? []).length} appels`,
  );

  // Le rôle ne doit jamais être dérivé de `plan` : la colonne est bornée à
  // free/pro/agency par une contrainte SQL, et Stripe l'écrit.
  check(
    "le rôle n'est pas déduit du plan commercial",
    /plan\s*===\s*["']admin["']/.test(source),
    false,
  );
}

console.log("\n=== 10. Le module admin est serveur uniquement ===");
{
  const source = readFileSync("lib/auth/admin.ts", "utf8");
  assert("import server-only présent", /^import "server-only";/m.test(source));
  check(
    "aucune variable NEXT_PUBLIC utilisée",
    /NEXT_PUBLIC_/.test(source),
    false,
  );
  check(
    "aucune adresse en dur dans le module",
    /@[a-z0-9-]+\.(com|fr|net|org)/i.test(source.replace(/^\s*\*.*$/gm, "")),
    false,
  );
}

console.log(
  `\n${failed === 0 ? "TOUS LES TESTS PASSENT" : "ECHECS"} — ${passed} pass, ${failed} fail`,
);
process.exit(failed === 0 ? 0 : 1);
