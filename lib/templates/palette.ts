/**
 * Palette d'un template — build prompt §4bis, bloc 2 de l'écran YOUR PROMPT.
 *
 * « La direction artistique retenue — nom de la D/A, son résumé en une phrase,
 *   et la palette du template affichée en pastilles. L'utilisateur doit
 *   comprendre *pourquoi* il a reçu ce style. »
 *
 * Les couleurs sont **lues** dans le corps du template, jamais choisies : les
 * templates déclarent leur bloc `Colors` sous la forme `--bg: #FFFFFF`.
 */

export type PaletteEntry = {
  /** Nom de la variable telle qu'elle est écrite dans le template. */
  name: string;
  hex: string;
};

const DECLARATION = /--([a-z0-9-]+)\s*:\s*(#[0-9a-fA-F]{3,8})\b/g;

export function extractPalette(body: string, limit = 8): PaletteEntry[] {
  const seen = new Map<string, string>();

  for (const match of body.matchAll(DECLARATION)) {
    const name = match[1];
    const hex = match[2];
    if (!name || !hex) continue;
    if (!seen.has(name)) seen.set(name, hex.toUpperCase());
  }

  return [...seen.entries()]
    .slice(0, limit)
    .map(([name, hex]) => ({ name: `--${name}`, hex }));
}
