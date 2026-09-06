/**
 * Parseur du catalogue de prompts — build prompt §3.
 *
 * Pur : ne touche ni au réseau ni à la base. Le script de seed s'en sert pour
 * alimenter `prompt_templates`, et il est exécutable seul pour vérifier
 * l'extraction sans projet Supabase.
 *
 * Format de source constaté dans `content/templates/` :
 *
 *   ## TEMPLATE 01 — Swiss Brutalist Monochrome
 *   ```
 *   <corps du prompt, en clair, avec ses propres titres ## >
 *   ```
 *
 * Un seul bloc clôturé par template, jamais imbriqué, jamais annoté d'un
 * langage — vérifié sur les quatre fichiers.
 */

export const DOMAINS = ["saas", "product", "finance", "agency"] as const;
export type Domain = (typeof DOMAINS)[number];

export const ASSET_PATHS = [
  "standard",
  "enhanced",
  "sequence",
  "video",
  "advanced",
] as const;
export type AssetPath = (typeof ASSET_PATHS)[number];

export type AssetPathAvailability = Record<AssetPath, boolean>;

export type ParsedTemplate = {
  slug: string;
  domain: Domain;
  art_direction: string;
  title: string;
  summary: string;
  body: string;
  variables: string[];
  tags: string[];
  asset_paths: AssetPathAvailability;
  complexity: string;
  /** Marqueurs bruts relevés dans le corps — sert au contrôle, pas au matching. */
  markers: string[];
};

/** Nom de fichier attendu par domaine. */
export const TEMPLATE_FILES: Record<Domain, string> = {
  saas: "saas-prompt-templates.md",
  product: "product-prompt-templates.md",
  finance: "finance-prompt-templates.md",
  agency: "agency-prompt-templates.md",
};

/**
 * Renommages imposés par `prompt-variable-schema.md`, à passer **à
 * l'ingestion** : un seul nom, un seul extracteur.
 */
const RENAMES: Array<[RegExp, string]> = [
  [/\{\{FEATURE_(\d+)\.\.(\d+)\}\}/g, "{{ITEM_$1..$2}}"],
  [/\{\{SERVICE_(\d+)\.\.(\d+)\}\}/g, "{{ITEM_$1..$2}}"],
  [/\{\{PRODUCT_SHOT_(\d+)\.\.(\d+)\}\}/g, "{{SCREEN_$1..$2}}"],
  [/\{\{FEATURE_(\d+)\}\}/g, "{{ITEM_$1}}"],
  [/\{\{SERVICE_(\d+)\}\}/g, "{{ITEM_$1}}"],
  [/\{\{PRODUCT_SHOT_(\d+)\}\}/g, "{{SCREEN_$1}}"],
];

/** Mots-clés de stack relevés dans le corps, pour les tags (§3.7). */
const STACK_KEYWORDS: Array<[string, RegExp]> = [
  ["nextjs", /next\.js/i],
  ["gsap", /\bGSAP\b/],
  ["framer-motion", /framer\s*motion/i],
  ["lenis", /\bLenis\b/],
  ["r3f", /react\s*three\s*fiber|@react-three|\bR3F\b/i],
  ["recharts", /\bRecharts\b/i],
];

/** Mots trop courts ou trop génériques pour faire un tag utile. */
const TAG_STOPWORDS = new Set(["and", "the", "with", "of", "de", "la", "le"]);

export function toKebabCase(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Classe un marqueur `[REQUIRES: …]` sur les chemins d'assets qu'il ouvre.
 *
 * Les marqueurs réels débordent des cinq formes du schéma : « 3+ images »,
 * « frame sequence », « 3+ screenshots or video », « explicit WebGL opt-in »…
 * On classe donc sur le sens, pas sur une liste fermée. Les marqueurs qui
 * conditionnent du **contenu** et non un asset (`[REQUIRES: {{TEAM_*}}]`)
 * n'ouvrent aucun chemin.
 */
export function classifyMarker(marker: string): AssetPath[] {
  const text = marker.toLowerCase();
  const paths = new Set<AssetPath>();

  if (/\bnone\b/.test(text)) paths.add("standard");
  if (/\bvideo\b/.test(text)) paths.add("video");
  if (/3d model|webgl/.test(text)) paths.add("advanced");
  if (
    /\b[3-9]\+\s*(image|screenshot|shot)/.test(text) ||
    /frame sequence/.test(text)
  ) {
    paths.add("sequence");
  }
  if (/\b[12]\+\s*(image|screenshot|shot)/.test(text)) paths.add("enhanced");

  return [...paths];
}

function extractMarkers(body: string): string[] {
  const found = body.match(/\[REQUIRES:[^\]]*\]/g) ?? [];
  // `[REQUIRES: …]` avec l'ellipsis littérale est une mention de la convention
  // dans les règles, pas un marqueur posé sur une section.
  return [...new Set(found.filter((marker) => !marker.includes("…")))];
}

function detectAssetPaths(markers: string[]): AssetPathAvailability {
  const availability: AssetPathAvailability = {
    // « The standard path must always produce a complete, finished-looking
    // page » — règle 3 du bloc ASSET GATING, vraie pour tous les templates.
    standard: true,
    enhanced: false,
    sequence: false,
    video: false,
    advanced: false,
  };

  for (const marker of markers) {
    for (const path of classifyMarker(marker)) availability[path] = true;
  }

  return availability;
}

function extractVariables(body: string): string[] {
  const found = body.match(/\{\{([A-Z_0-9]+)\}\}/g) ?? [];
  return [...new Set(found.map((raw) => raw.slice(2, -2)))].sort();
}

function buildTags(
  domain: Domain,
  artDirection: string,
  body: string,
): string[] {
  const tags = new Set<string>([domain]);

  tags.add(toKebabCase(artDirection));
  for (const word of toKebabCase(artDirection).split("-")) {
    if (word.length >= 3 && !TAG_STOPWORDS.has(word)) tags.add(word);
  }

  for (const [tag, pattern] of STACK_KEYWORDS) {
    if (pattern.test(body)) tags.add(tag);
  }

  return [...tags].sort();
}

/**
 * Résumé d'une phrase, **extrait** du corps et jamais rédigé : chaque template
 * ouvre sur « Art direction: <description> ». C'est la phrase que l'écran
 * YOUR PROMPT affiche pour expliquer le style retenu (§4bis).
 */
function extractSummary(body: string, artDirection: string): string {
  const match = /Art direction:\s*([^\n]+)/i.exec(body);
  if (!match?.[1]) return artDirection;

  const sentence = match[1].trim();
  // On s'arrête à la fin de la phrase d'art direction si elle en enchaîne une autre.
  const cut = /^(.*?[.!?])(\s+[A-Z])/.exec(sentence);
  return (cut?.[1] ?? sentence).replace(/\s+/g, " ").trim();
}

/** Corps du premier bloc clôturé qui suit une position donnée. */
function readFencedBlock(lines: string[], startIndex: number): string | null {
  let open = -1;
  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i] ?? "";
    if (line.startsWith("```")) {
      open = i;
      break;
    }
    // Un nouveau template avant tout bloc : la section n'en contient pas.
    if (/^## TEMPLATE\s+\d+/.test(line)) return null;
  }
  if (open === -1) return null;

  for (let i = open + 1; i < lines.length; i++) {
    if ((lines[i] ?? "").startsWith("```")) {
      return lines
        .slice(open + 1, i)
        .join("\n")
        .trim();
    }
  }
  return null;
}

/**
 * Titre de section template : `## TEMPLATE 01 — …` (catalogue domaine)
 * ou `TEMPLATE 001 — …` (lots yelhaa-prompts / gold).
 */
const TEMPLATE_HEADING = /^(?:##\s+)?TEMPLATE\s+(\d+)\s+[—–-]\s+(.+?)\s*$/;

export type LooseTemplate = {
  origin: string;
  number: string;
  title: string;
  slug: string;
  body: string;
};

function applyRenames(raw: string): string {
  return RENAMES.reduce(
    (text, [pattern, replacement]) => text.replace(pattern, replacement),
    raw,
  );
}

export function extractTemplateSections(
  source: string,
): Array<{ number: string; title: string; heading: string; raw: string }> {
  const lines = source.split(/\r?\n/);
  const sections: Array<{
    number: string;
    title: string;
    heading: string;
    raw: string;
  }> = [];

  for (let i = 0; i < lines.length; i++) {
    const heading = TEMPLATE_HEADING.exec(lines[i] ?? "");
    if (!heading) continue;

    const [, number, artDirection] = heading;
    if (!number || !artDirection) continue;

    const raw = readFencedBlock(lines, i + 1);
    if (!raw) {
      throw new Error(`TEMPLATE ${number} : aucun bloc de prompt trouvé.`);
    }

    sections.push({
      number,
      title: artDirection,
      heading: (lines[i] ?? "").replace(/^##\s+/, "").trim(),
      raw,
    });
  }

  return sections;
}

export function parseLooseTemplates(
  source: string,
  origin: string,
): LooseTemplate[] {
  const fileStem = origin.replace(/\.md$/i, "");
  return extractTemplateSections(source).map((section) => {
    const body = applyRenames(section.raw);
    return {
      origin,
      number: section.number,
      title: section.title,
      slug: `${fileStem}-${section.number.padStart(4, "0")}-${toKebabCase(section.title)}`,
      body,
    };
  });
}

export function parseTemplateFile(
  domain: Domain,
  source: string,
): ParsedTemplate[] {
  return extractTemplateSections(source).map((section) => {
    const body = applyRenames(section.raw);
    const markers = extractMarkers(body);

    return {
      slug: `${domain}-${section.number.padStart(2, "0")}-${toKebabCase(section.title)}`,
      domain,
      art_direction: section.title,
      title: section.heading,
      summary: extractSummary(body, section.title),
      body,
      variables: extractVariables(body),
      tags: buildTags(domain, section.title, body),
      asset_paths: detectAssetPaths(markers),
      complexity: "medium",
      markers,
    };
  });
}
