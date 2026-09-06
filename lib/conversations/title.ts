import { TITLE_MAX_LENGTH } from "@/lib/conversations/types";

/**
 * Titre automatique, dérivé du premier message.
 *
 * ## Pourquoi une heuristique et pas un appel au modèle
 *
 * Demander un titre à un modèle donnerait « Cinematic Sports Car » là où cette
 * fonction rend « Cinematic advertisement for a futuristic sports car ». C'est
 * moins élégant, et c'est assumé : un appel supplémentaire par conversation
 * coûterait un aller-retour réseau sur le chemin critique de l'envoi, et il
 * échouerait exactement quand le service est déjà en difficulté. Un titre est
 * une commodité — il ne mérite pas d'être un point de panne, ni une dépense.
 *
 * Le titre reste **renommable en un clic**, ce qui rend l'approximation
 * acceptable là où une erreur silencieuse ne le serait pas.
 *
 * ## Ce que fait l'heuristique
 *
 * 1. normalise les espaces et retire le balisage markdown de surface ;
 * 2. coupe à la première frontière de phrase — un titre n'est pas un paragraphe ;
 * 3. retire les amorces impératives (« create a », « make me a »…) qui
 *    n'apportent rien : toutes les conversations commenceraient pareil ;
 * 4. borne la longueur en coupant sur un mot, jamais au milieu.
 */

const FALLBACK_TITLE = "New conversation";

/** Longueur visée — bien en deçà du plafond SQL, pour rester lisible. */
const TARGET_LENGTH = 48;

/**
 * Amorces sans valeur informative. L'ordre importe : les plus longues
 * d'abord, sinon « create » consommerait le début de « create a ».
 */
const LEAD_INS = [
  "can you please",
  "could you please",
  "i would like you to",
  "i want you to",
  "please help me",
  "help me to",
  "help me",
  "can you",
  "could you",
  "i need a",
  "i need",
  "i want a",
  "i want",
  "generate a",
  "generate an",
  "generate",
  "create a",
  "create an",
  "create",
  "make me a",
  "make me an",
  "make a",
  "make an",
  "make",
  "build me a",
  "build a",
  "build an",
  "build",
  "design a",
  "design an",
  "design",
  "write me a",
  "write a",
  "write an",
  "write",
];

function stripMarkdown(value: string): string {
  return value
    .replace(/```[\s\S]*?```/g, " ") // blocs de code entiers
    .replace(/`([^`]*)`/g, "$1")
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1") // liens et images
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_~>]/g, "");
}

/** Première frontière de phrase — point, interrogation, exclamation, saut. */
function firstSentence(value: string): string {
  const match = value.match(/^[^.!?\n]+/);
  return (match?.[0] ?? value).trim();
}

function stripLeadIn(value: string): string {
  const lower = value.toLowerCase();
  for (const lead of LEAD_INS) {
    if (lower.startsWith(`${lead} `)) {
      return value.slice(lead.length + 1).trimStart();
    }
  }
  return value;
}

/** Coupe sur un mot. Un titre tronqué au milieu d'un mot se lit comme un bug. */
function clampOnWord(value: string, limit: number): string {
  if (value.length <= limit) return value;
  const cut = value.slice(0, limit);
  const lastSpace = cut.lastIndexOf(" ");
  const kept = lastSpace > limit * 0.5 ? cut.slice(0, lastSpace) : cut;
  return `${kept.replace(/[\s.,;:—-]+$/, "")}…`;
}

/**
 * Dérive un titre depuis le premier message.
 *
 * Rend toujours une chaîne valide au regard de la contrainte SQL : jamais
 * vide, jamais au-delà du plafond.
 */
export function deriveTitle(firstMessage: string): string {
  const flat = stripMarkdown(firstMessage).replace(/\s+/g, " ").trim();
  if (!flat) return FALLBACK_TITLE;

  const candidate = stripLeadIn(firstSentence(flat)).trim();
  if (!candidate) return clampOnWord(flat, TARGET_LENGTH) || FALLBACK_TITLE;

  // Majuscule initiale uniquement : forcer une capitale par mot abîmerait les
  // noms propres, les acronymes et les identifiants techniques.
  const titled = candidate.charAt(0).toUpperCase() + candidate.slice(1);
  return clampOnWord(titled, TARGET_LENGTH);
}

export type TitleValidation =
  { ok: true; title: string } | { ok: false; reason: "empty" | "too-long" };

/**
 * Valide un titre saisi à la main, avec la **même règle que la base**.
 *
 * Le `trim` est appliqué avant la mesure : un titre fait de trois espaces est
 * vide, et la contrainte SQL le refuserait de toute façon. Valider ici évite
 * un aller-retour réseau pour rien, mais ne remplace pas la contrainte —
 * PostgREST reste joignable sans passer par ce formulaire.
 */
export function validateTitle(input: string): TitleValidation {
  const title = input.trim().replace(/\s+/g, " ");
  if (!title) return { ok: false, reason: "empty" };
  if (title.length > TITLE_MAX_LENGTH) return { ok: false, reason: "too-long" };
  return { ok: true, title };
}
