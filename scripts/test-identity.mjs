/**
 * Identité affichable — fonctions pures, aucun réseau, aucune base.
 *
 *   npm run test:identity
 *
 * Ce banc porte surtout sur une garantie de confidentialité : **l'e-mail
 * complet ne doit jamais sortir** des fonctions destinées à l'affichage public.
 * Le reste — déterminisme, initiales, bornes — protège l'apparence.
 */
import {
  avatarHueFromEmail,
  displayNameFromEmail,
  initialsFromEmail,
  maskEmail,
} from "../lib/auth/identity.ts";

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

console.log("=== 1. Nom d'affichage ===");
check(
  "prenom.nom → deux mots capitalisés",
  displayNameFromEmail("alexandre.martin@gmail.com"),
  "Alexandre Martin",
);
check(
  "prénom seul",
  displayNameFromEmail("alexandre@gmail.com"),
  "Alexandre",
);
check(
  "séparateur underscore",
  displayNameFromEmail("marie_curie@lab.fr"),
  "Marie Curie",
);
check(
  "séparateur tiret",
  displayNameFromEmail("jean-pierre@example.com"),
  "Jean Pierre",
);
check(
  "sous-adressage ignoré",
  displayNameFromEmail("alexandre+yelhaa@gmail.com"),
  "Alexandre",
);
check(
  "casse d'entrée sans effet",
  displayNameFromEmail("ALEXANDRE.MARTIN@GMAIL.COM"),
  "Alexandre Martin",
);
check(
  "au plus deux fragments",
  displayNameFromEmail("jean.pierre.dupont.martin@x.fr"),
  "Jean Pierre",
);
check(
  "fragment avec chiffres laissé brut",
  displayNameFromEmail("user1234@gmail.com"),
  "user1234",
);
check(
  "initiales trop courtes → partie locale brute",
  displayNameFromEmail("a.m@gmail.com"),
  "a.m",
);
check("e-mail vide → repli", displayNameFromEmail(""), "Account");
check("null → repli", displayNameFromEmail(null), "Account");
check("undefined → repli", displayNameFromEmail(undefined), "Account");

console.log("\n=== 2. Le domaine ne fuit jamais ===");
for (const email of [
  "alexandre.martin@gmail.com",
  "user1234@protonmail.com",
  "a.m@corp.internal",
]) {
  const name = displayNameFromEmail(email);
  const domain = email.slice(email.indexOf("@") + 1);
  assert(
    `« ${email} » : le domaine est absent du nom affiché`,
    !name.includes(domain) && !name.includes("@"),
    `nom obtenu « ${name} »`,
  );
}

console.log("\n=== 3. Initiales ===");
check("deux mots → deux lettres", initialsFromEmail("alexandre.martin@x.fr"), "AM");
check("un mot → une lettre", initialsFromEmail("alexandre@x.fr"), "A");
check("jamais plus de deux", initialsFromEmail("jean.pierre.dupont@x.fr").length, 2);
check("vide → point d'interrogation", initialsFromEmail(""), "A");
for (const email of ["a@b.c", "user1234@x.fr", "..@x.fr"]) {
  const initials = initialsFromEmail(email);
  assert(
    `« ${email} » → 1 ou 2 caractères (${initials})`,
    initials.length >= 1 && initials.length <= 2,
  );
}

console.log("\n=== 4. Teinte déterministe ===");
{
  const a = avatarHueFromEmail("alexandre.martin@gmail.com");
  const b = avatarHueFromEmail("alexandre.martin@gmail.com");
  check("même e-mail → même teinte", a, b);
  assert("teinte dans [0, 360[", a >= 0 && a < 360, String(a));
  assert(
    "deux e-mails proches ne donnent pas la même teinte",
    avatarHueFromEmail("a@x.fr") !== avatarHueFromEmail("b@x.fr"),
  );
  check("e-mail vide → 0", avatarHueFromEmail(""), 0);
  const hues = new Set(
    ["alice@x.fr", "bob@x.fr", "carol@x.fr", "dave@x.fr", "erin@x.fr"].map(
      avatarHueFromEmail,
    ),
  );
  assert("cinq comptes → teintes variées", hues.size >= 4, `${hues.size} teintes`);
}

console.log("\n=== 5. Masquage de l'e-mail ===");
{
  const masked = maskEmail("alexandre.martin@gmail.com");
  assert("le domaine reste lisible", masked.endsWith("@gmail.com"), masked);
  assert("le début de la partie locale reste", masked.startsWith("al"), masked);
  assert(
    "le milieu est masqué",
    !masked.includes("exandre.martin"),
    masked,
  );
  assert("des puces sont présentes", masked.includes("•"), masked);

  check("partie locale très courte", maskEmail("ab@x.fr"), "ab•••@x.fr");
  check("entrée sans arobase → vide", maskEmail("pasunemail"), "");
  check("entrée vide → vide", maskEmail(""), "");
  check("null → vide", maskEmail(null), "");
}

console.log("\n=== 6. Aucune donnée sensible dans les sorties ===");
{
  const email = "alexandre.martin@gmail.com";
  const outputs = {
    displayName: displayNameFromEmail(email),
    initials: initialsFromEmail(email),
    hue: String(avatarHueFromEmail(email)),
  };
  for (const [name, value] of Object.entries(outputs)) {
    assert(
      `${name} ne contient pas l'e-mail complet`,
      !value.includes(email),
      value,
    );
  }
  // Le masque est le SEUL à porter une partie de l'adresse, par conception.
  assert(
    "seul maskEmail expose une portion de l'adresse",
    maskEmail(email).includes("@gmail.com") &&
      !maskEmail(email).includes(email),
  );
}

console.log(
  `\n${failed === 0 ? "TOUS LES TESTS PASSENT" : "ECHECS"} — ${passed} pass, ${failed} fail`,
);
process.exit(failed === 0 ? 0 : 1);
