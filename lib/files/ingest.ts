/**
 * Fichiers joints — validation et extraction.
 *
 * Module **pur** : aucune base, aucun réseau, aucun `server-only`. Les bornes
 * sont partagées avec l'interface pour qu'elle refuse tôt et explique ; le
 * serveur les revalide intégralement, parce qu'une vérification faite dans le
 * navigateur n'est qu'un confort d'affichage.
 *
 * ## Ce qui est accepté, et pourquoi si peu
 *
 * Le pipeline ne sait consommer que du texte : l'appel #1 classe du texte,
 * l'appel #2 injecte du texte. Accepter un PDF ou une image supposerait une
 * extraction que le produit n'a pas — donc un fichier accepté puis ignoré, ce
 * qui est pire qu'un refus clair.
 *
 * ## Le type déclaré ne suffit pas
 *
 * `File.type` vient du navigateur et se falsifie. Trois contrôles indépendants
 * doivent concorder : l'extension, le type MIME, et le contenu réellement
 * décodé. Un binaire renommé `.txt` avec un MIME forgé échoue au troisième —
 * un octet nul ne survit pas à une lecture texte.
 */

/**
 * Extension acceptée, et les types MIME que les navigateurs lui associent.
 *
 * **Cette table est la seule source.** L'attribut `accept` du sélecteur de
 * fichiers et la ligne de formats affichée sous le composeur en sont dérivés,
 * pour qu'aucun écran ne puisse annoncer un format que le serveur refuse.
 *
 * ## Le SVG
 *
 * C'est du XML, donc du texte : il traverse le pipeline existant sans qu'une
 * seule ligne d'ingestion change. Un fichier SVG déclare des couleurs, des
 * dimensions, parfois un titre — autant de faits utilisables comme contexte.
 *
 * Un SVG peut contenir `<script>`, mais cela n'ouvre rien ici : le fichier
 * n'est jamais rendu, jamais servi, jamais écrit sur disque. Seul son texte
 * est conservé, et il part au modèle encadré par les marqueurs FILE et
 * l'addendum qui dit qu'un fichier est une donnée, pas une instruction.
 *
 * PNG, JPEG et PDF restent absents, et c'est délibéré : le pipeline ne sait
 * pas les lire. Les accepter reviendrait à joindre un fichier que le moteur
 * ignore, ce qui est pire qu'un refus clair.
 */
export const ALLOWED_FILE_TYPES: Readonly<Record<string, readonly string[]>> = {
  ".svg": ["image/svg+xml", "text/xml", "application/xml", "text/plain"],
  ".txt": ["text/plain"],
  ".md": ["text/markdown", "text/x-markdown", "text/plain"],
  ".csv": ["text/csv", "application/csv", "text/plain"],
  ".json": ["application/json", "text/json", "text/plain"],
};

/** Formats annoncés à l'utilisateur, dérivés de la table ci-dessus. */
export const ALLOWED_EXTENSIONS = Object.keys(ALLOWED_FILE_TYPES);

export const MAX_FILES = 5;
export const MAX_FILE_BYTES = 512 * 1024;
export const MAX_TOTAL_BYTES = 1024 * 1024;

/**
 * Caractères de contexte fichier envoyés au modèle, tous fichiers confondus.
 *
 * Cette borne est la raison d'être du §6 : sans elle, un fichier d'un demi-
 * mégaoctet part tel quel dans deux appels payants. 24 000 caractères valent
 * environ 6 000 jetons — assez pour un cahier des charges, très loin du budget
 * d'une génération.
 */
export const FILE_CONTEXT_BUDGET = 24_000;

export type FileRejection =
  | "too-many"
  | "extension"
  | "mime-mismatch"
  | "too-large"
  | "total-too-large"
  | "empty"
  | "binary";

export const FILE_REJECTION_MESSAGES: Readonly<Record<FileRejection, string>> =
  {
    "too-many": `Attach at most ${MAX_FILES} files.`,
    extension: `Only ${ALLOWED_EXTENSIONS.join(", ")} files are supported.`,
    "mime-mismatch": "This file's type does not match its extension.",
    "too-large": `Each file must be under ${Math.round(MAX_FILE_BYTES / 1024)} KB.`,
    "total-too-large": `All files together must stay under ${Math.round(MAX_TOTAL_BYTES / 1024)} KB.`,
    empty: "This file is empty.",
    binary: "This file is not readable as text.",
  };

/** Point de code du caractère de remplacement Unicode. */
const REPLACEMENT_CHAR = 0xfffd;

/** Le caractère est-il un caractère de contrôle ? Tabulation exclue. */
function isControlCode(code: number): boolean {
  return (code < 32 && code !== 9 && code !== 10 && code !== 13) || code === 127;
}

/**
 * Extension en minuscules, **sans jamais interpréter le chemin**.
 *
 * Le nom est traité comme une chaîne opaque : on ne le résout pas, on ne le
 * joint à rien, et il ne devient jamais un chemin. `../../etc/passwd` est un
 * nom de fichier bizarre, pas une destination — rien n'est écrit sur disque.
 */
export function fileExtension(filename: string): string {
  const base = filename.trim().toLowerCase();
  const dot = base.lastIndexOf(".");
  return dot <= 0 ? "" : base.slice(dot);
}

/**
 * Nom d'affichage assaini : sans séparateur de chemin, sans caractère de
 * contrôle, borné. Ce nom finit dans le contexte envoyé au modèle, donc il ne
 * doit pas pouvoir y dessiner une fausse structure.
 *
 * Le filtrage se fait par point de code plutôt que par classe de caractères
 * dans une expression régulière : un littéral de contrôle dans le source est
 * invisible à la relecture et se perd au premier outil qui normalise le
 * fichier.
 */
export function safeFilename(filename: string): string {
  let out = "";
  for (const char of filename) {
    const code = char.codePointAt(0) ?? 0;
    out += isControlCode(code) || char === "/" || char === "\\" ? " " : char;
  }
  return out.replace(/\s+/g, " ").trim().slice(0, 255) || "untitled";
}

export type UploadCandidate = {
  filename: string;
  mimeType: string;
  byteSize: number;
};

/** Contrôles qui ne demandent pas le contenu. Rendus dans un ordre stable. */
export function validateCandidate(
  candidate: UploadCandidate,
): FileRejection | null {
  const extension = fileExtension(candidate.filename);
  const accepted = ALLOWED_FILE_TYPES[extension];
  if (!accepted) return "extension";

  // Un type vide est courant et honnête — certains systèmes n'en fournissent
  // pas. C'est un type *présent et contradictoire* qui trahit une falsification.
  const declared = candidate.mimeType.split(";")[0]?.trim().toLowerCase() ?? "";
  if (declared && !accepted.includes(declared)) return "mime-mismatch";

  if (candidate.byteSize <= 0) return "empty";
  if (candidate.byteSize > MAX_FILE_BYTES) return "too-large";

  return null;
}

/** Contrôles du lot entier. */
export function validateBatch(
  candidates: readonly UploadCandidate[],
): FileRejection | null {
  if (candidates.length > MAX_FILES) return "too-many";
  const total = candidates.reduce((sum, file) => sum + file.byteSize, 0);
  if (total > MAX_TOTAL_BYTES) return "total-too-large";
  return null;
}

/**
 * Le contenu décodé est-il réellement du texte ?
 *
 * L'octet nul ne paraît jamais dans un fichier texte, et le caractère de
 * remplacement signale un octet que l'UTF-8 n'a pas su lire. Le second est
 * toléré à l'état de trace — un fichier peut porter un caractère abîmé sans
 * cesser d'être du texte — mais pas en proportion.
 */
export function looksBinary(text: string): boolean {
  let replacements = 0;
  for (const char of text) {
    const code = char.codePointAt(0) ?? 0;
    if (code === 0) return true;
    if (code === REPLACEMENT_CHAR) replacements += 1;
  }
  return replacements > 0 && replacements / Math.max(text.length, 1) > 0.001;
}

export type IngestedFile = {
  filename: string;
  mimeType: string;
  byteSize: number;
  text: string;
  truncated: boolean;
};

/**
 * Valide puis normalise un contenu déjà décodé.
 *
 * La troncature n'est pas appliquée ici : elle dépend du lot entier et se fait
 * dans `budgetFiles`, une fois que l'on sait combien de fichiers se partagent
 * le budget.
 */
export function ingestText(
  candidate: UploadCandidate,
  decoded: string,
): { file: IngestedFile } | { rejection: FileRejection } {
  const rejection = validateCandidate(candidate);
  if (rejection) return { rejection };
  if (looksBinary(decoded)) return { rejection: "binary" };

  const text = decoded.replace(/\r\n/g, "\n").trim();
  if (!text) return { rejection: "empty" };

  return {
    file: {
      filename: safeFilename(candidate.filename),
      mimeType: candidate.mimeType,
      byteSize: candidate.byteSize,
      text,
      truncated: false,
    },
  };
}

/**
 * Répartit `FILE_CONTEXT_BUDGET` entre les fichiers, de façon **déterministe**.
 *
 * Part égale plutôt que proportionnelle : un fichier volumineux ne doit pas
 * réduire au silence les petits, qui portent souvent l'essentiel — une charte,
 * une liste de contraintes. Ce qui reste inutilisé par les fichiers courts est
 * redistribué, donc un seul fichier reçoit tout le budget.
 *
 * La coupe recule jusqu'au dernier saut de ligne s'il est assez proche, pour
 * ne pas trancher au milieu d'un mot.
 */
export function budgetFiles(
  files: readonly IngestedFile[],
  budget = FILE_CONTEXT_BUDGET,
): IngestedFile[] {
  if (files.length === 0) return [];

  const result = files.map((file) => ({ ...file }));
  let remaining = budget;
  let sharers = result.length;

  // Les fichiers les plus courts passent en premier : ceux qui tiennent dans
  // leur part libèrent le reste pour les suivants.
  const byLength = [...result].sort((a, b) => a.text.length - b.text.length);

  for (const file of byLength) {
    const share = Math.floor(remaining / sharers);
    sharers -= 1;

    if (file.text.length <= share) {
      remaining -= file.text.length;
      continue;
    }

    const cut = cutOnBoundary(file.text, share);
    file.text = cut;
    file.truncated = true;
    remaining -= cut.length;
  }

  return result;
}

/** Coupe à `limit`, en reculant jusqu'au dernier saut de ligne s'il est proche. */
function cutOnBoundary(text: string, limit: number): string {
  if (limit <= 0) return "";
  if (text.length <= limit) return text;

  const slice = text.slice(0, limit);
  const newline = slice.lastIndexOf("\n");
  // 80 % : au-delà, reculer coûterait plus de contenu que la propreté ne vaut.
  return newline > limit * 0.8 ? slice.slice(0, newline) : slice;
}
