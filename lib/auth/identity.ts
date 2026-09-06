/**
 * Identité affichable — dérivée de l'e-mail, jamais inventée.
 *
 * ## Ce qui sort d'ici, et ce qui n'en sort pas
 *
 * L'e-mail complet n'est **jamais** rendu par ces fonctions. Elles produisent
 * un nom d'affichage et des initiales à partir de la partie locale, ce qui
 * suffit à personnaliser la barre de navigation sans exposer l'adresse à
 * quiconque regarde l'écran par-dessus l'épaule.
 *
 * ## Pourquoi déterministe
 *
 * Le même e-mail donne toujours le même nom et la même teinte. Un avatar qui
 * change de couleur à chaque rendu se lit comme un défaut, et une teinte
 * aléatoire empêcherait de reconnaître son propre compte d'un coup d'œil.
 *
 * Aucune de ces fonctions ne touche au réseau : elles sont pures et testables.
 */

/** Séparateurs usuels d'une partie locale : `prenom.nom`, `prenom_nom`, … */
const WORD_SEPARATORS = /[._\-+]+/;

/** Suffixe de sous-adressage : `alexandre+yelhaa@…` désigne « alexandre ». */
function stripSubaddress(localPart: string): string {
  const plus = localPart.indexOf("+");
  return plus === -1 ? localPart : localPart.slice(0, plus);
}

function capitalize(word: string): string {
  if (!word) return word;
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

/**
 * Un fragment est-il un nom plausible ?
 *
 * Un fragment contenant un chiffre — `alex92`, `user1234` — n'est pas un
 * prénom. Le capitaliser produirait « Alex92 », qui a l'air d'une erreur
 * d'affichage plutôt que d'un nom. Ces fragments sont écartés.
 */
function looksLikeName(fragment: string): boolean {
  return /^[a-zà-öø-ÿ]{2,}$/i.test(fragment);
}

/**
 * Nom d'affichage déduit de l'e-mail.
 *
 * `alexandre.martin@gmail.com` → « Alexandre Martin »
 * `alexandre@gmail.com`        → « Alexandre »
 * `a.m@gmail.com`              → « A.m » écarté, repli sur la partie locale
 * `user1234@gmail.com`         → « user1234 » tel quel, jamais « User1234 »
 *
 * Le repli rend la partie locale **brute** : préférable à une invention. Le
 * domaine est toujours retiré — c'est lui qui rend l'adresse utilisable par un
 * tiers.
 */
export function displayNameFromEmail(email: string | null | undefined): string {
  const raw = (email ?? "").trim().toLowerCase();
  const at = raw.indexOf("@");
  const localPart = stripSubaddress(at === -1 ? raw : raw.slice(0, at));
  if (!localPart) return "Account";

  const fragments = localPart.split(WORD_SEPARATORS).filter(Boolean);
  const names = fragments.filter(looksLikeName);

  // Au plus deux fragments : « jean.pierre.dupont.martin » deviendrait une
  // phrase, pas un nom, et déborderait de la barre.
  if (names.length > 0) return names.slice(0, 2).map(capitalize).join(" ");

  return localPart;
}

/**
 * Une ou deux initiales.
 *
 * Deux fragments nominaux donnent deux lettres ; sinon une seule. Jamais plus :
 * trois lettres dans un disque de 30px deviennent illisibles.
 */
export function initialsFromEmail(email: string | null | undefined): string {
  const name = displayNameFromEmail(email);
  const parts = name.split(" ").filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0]?.charAt(0) ?? ""}${parts[1]?.charAt(0) ?? ""}`.toUpperCase();
  }
  return (parts[0]?.charAt(0) ?? "?").toUpperCase();
}

/**
 * Teinte déterministe, en degrés.
 *
 * Somme des points de code — suffisant ici : on cherche une répartition
 * stable, pas une résistance cryptographique. Deux comptes peuvent partager une
 * teinte sans conséquence, et l'initiale les distingue de toute façon.
 */
export function avatarHueFromEmail(email: string | null | undefined): number {
  const source = (email ?? "").trim().toLowerCase();
  if (!source) return 0;

  let total = 0;
  for (let i = 0; i < source.length; i++) {
    total = (total + source.charCodeAt(i) * (i + 1)) % 360;
  }
  return total;
}

/**
 * E-mail masqué, pour le menu déroulant.
 *
 * `alexandre.martin@gmail.com` → `al••••••••••@gmail.com`
 *
 * Le domaine reste lisible — il aide à reconnaître son compte — et le début de
 * la partie locale aussi. Le milieu est masqué : c'est ce qui rend l'adresse
 * inutilisable pour quelqu'un qui ne fait que regarder l'écran.
 */
export function maskEmail(email: string | null | undefined): string {
  const raw = (email ?? "").trim();
  const at = raw.lastIndexOf("@");
  if (at <= 0) return "";

  const localPart = raw.slice(0, at);
  const domain = raw.slice(at);

  if (localPart.length <= 2) return `${localPart}${"•".repeat(3)}${domain}`;
  return `${localPart.slice(0, 2)}${"•".repeat(Math.min(localPart.length - 2, 10))}${domain}`;
}
