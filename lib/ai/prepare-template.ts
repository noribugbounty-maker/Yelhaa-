/**
 * Nettoyage mécanique du template avant l'appel d'injection.
 *
 * ## Pourquoi le serveur fait ce travail
 *
 * Quatre transformations sont **purement mécaniques** : supprimer les
 * marqueurs `[REQUIRES: …]`, supprimer les mots « STANDARD PATH » et
 * variantes, substituer les `{{VARIABLES}}`, appliquer les `(fallback …)`
 * d'échafaudage. Le serveur les fait exactement, gratuitement, et sans
 * jamais se tromper.
 *
 * Les laisser au modèle coûtait deux fois :
 *
 * 1. en **entrée**, puisque les artefacts partent dans le message ;
 * 2. en **régénération**, puisque le validateur rejette la sortie quand un
 *    seul `{{` ou `(fallback #…)` survit — et un rejet relance l'appel le
 *    plus cher du pipeline.
 *
 * Ce qui reste au modèle : choisir le bloc de chemin (`ASSET_PATH`),
 * assembler le livrable, et appliquer la règle 2 uniquement si un token
 * non résolu réapparaissait (défense en profondeur).
 *
 * ## Ce qui n'est pas fait ici
 *
 * Les **blocs de chemin** ne sont pas découpés. Ils ne sont pas délimités :
 * ce sont des puces en prose, dont la fin se devine à l'indentation. Un
 * découpage approximatif retirerait du contenu utile, et le template est la
 * propriété intellectuelle du produit — le mutiler coûterait bien plus cher
 * que les jetons économisés. Le modèle continue donc de choisir le bloc, avec
 * `ASSET_PATH` pour le lui dire.
 *
 * Les phrases d'ingénierie du type « fallback to CSS gradients » ne sont
 * jamais touchées : le motif `(fallback …)` n'est consommé que lorsqu'il
 * suit immédiatement un `{{VAR}}`.
 */

import type { AssetPath } from "@/lib/templates/parse";

export type PreparedTemplate = {
  body: string;
  /** Ce qui a été retiré, pour l'instrumentation. Aucun contenu, des compteurs. */
  removed: {
    requiresMarkers: number;
    pathNames: number;
    variablesResolved: number;
    fallbacksApplied: number;
    placeholdersStripped: number;
    linesDropped: number;
    charactersSaved: number;
  };
  /** Lignes où un {{VAR}} sans valeur ni fallback n'a pas pu être retiré proprement. */
  warnings: string[];
};

/** `[REQUIRES: …]`, y compris l'espace qui le précède. */
const REQUIRES_MARKER = /\s*\[REQUIRES:[^\]]*\]/g;

/**
 * Les noms de chemin, avec la virgule qui les introduit quand il y en a une.
 *
 * « Frame contents, STANDARD PATH: » devient « Frame contents: » plutôt que
 * « Frame contents, : ». La ponctuation orpheline est du bruit que le modèle
 * devrait ensuite interpréter.
 */
const PATH_NAME = /,?\s*\b(STANDARD|ENHANCED|SEQUENCE|VIDEO|ADVANCED) PATH\b/g;

/**
 * `{{VAR}}` éventuellement suivi, sur la même ligne, de `(fallback <valeur>)`.
 *
 * Le lookahead `(?!to\b)` est le même contrat que le validateur : une
 * parenthèse « (fallback to CSS gradients…) » n'est pas de l'échafaudage
 * et ne doit jamais être consommée — et de toute façon elle ne suit pas
 * un `{{VAR}}` dans le catalogue.
 */
const PLACEHOLDER_WITH_OPTIONAL_FALLBACK =
  /\{\{([A-Z_0-9]+)\}\}(?:[ \t]*(\(\s*fallback[:\s]+(?!to\b)[^)]+\)))?/g;

/** `{{INTEGRATION_1..6}}`, `{{PLATFORM_3..5}}` — plage d'une famille. */
const RANGE_PLACEHOLDER = /\{\{([A-Z][A-Z0-9_]*)_(\d+)\.\.(\d+)\}\}/g;

/** `{{PROOF_STAT_*}}`, `{{ITEM_*}}`, `{{TEAM_*}}` — famille, pas une entrée. */
const FAMILY_PLACEHOLDER = /\{\{([A-Z][A-Z0-9_]*)_\*\}\}/g;

/** `{{year}}`, `{{scheme}}` — champs libres, hors contrat CORE. */
const LOOSE_PLACEHOLDER = /\{\{([a-z][a-z0-9_]*)\}\}/g;

/**
 * Objet JSX `viewport={{ once: true }}` : les doubles accolades sont du
 * React, pas un placeholder. Le validateur les rejetterait quand même.
 * On les réécrit en `viewport={({ once: true })}` — même objet, plus de `{{`.
 */
const JSX_OBJECT_PROP = /(=\s*)\{\{([^{}]+)\}\}/g;

const ANY_PLACEHOLDER = /\{\{[^}]*\}\}/g;

const LOOSE_ALIASES: Record<string, string> = {
  scheme: "PROTECTION_SCHEME",
  year: "YEAR",
  category: "CATEGORY",
};

function isFilled(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

function formatVarValue(value: unknown): string | null {
  if (!isFilled(value)) return null;
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (Array.isArray(value)) {
    if (value.every((entry) => typeof entry === "string")) {
      const parts = value.map((entry) => entry.trim()).filter(Boolean);
      return parts.length > 0 ? parts.join(", ") : null;
    }
    return JSON.stringify(value);
  }
  if (typeof value === "object") return JSON.stringify(value);
  return null;
}

/**
 * Lit une variable comme l'injection la comprend : clé directe, ou forme
 * indexée `ITEM_3` satisfaite par le tableau `ITEM`.
 */
export function lookupVarValue(
  name: string,
  vars: Record<string, unknown>,
): string | null {
  if (name in vars) return formatVarValue(vars[name]);

  const indexed = /^(.+)_(\d+)$/.exec(name);
  if (indexed) {
    const [, base, position] = indexed;
    const collection = vars[base as string];
    if (Array.isArray(collection)) {
      const index = Number(position) - 1;
      if (index >= 0 && index < collection.length) {
        return formatVarValue(collection[index]);
      }
    }
  }

  return null;
}

function lookupFamilyValue(
  base: string,
  vars: Record<string, unknown>,
): string | null {
  const direct = lookupVarValue(base, vars);
  if (direct !== null) return direct;

  const indexed: Array<[number, string]> = [];
  for (const [key, value] of Object.entries(vars)) {
    const match = new RegExp(`^${base}_(\\d+)$`).exec(key);
    if (!match) continue;
    const formatted = formatVarValue(value);
    if (formatted !== null) indexed.push([Number(match[1]), formatted]);
  }
  if (indexed.length === 0) return null;
  return indexed
    .sort((a, b) => a[0] - b[0])
    .map(([, value]) => value)
    .join(", ");
}

export function lookupRangeValue(
  base: string,
  start: number,
  end: number,
  vars: Record<string, unknown>,
): string | null {
  if (!Number.isFinite(start) || !Number.isFinite(end) || start > end) {
    return null;
  }

  const fromIndexed: string[] = [];
  for (let index = start; index <= end; index += 1) {
    const value = lookupVarValue(`${base}_${index}`, vars);
    if (value !== null) fromIndexed.push(value);
  }
  if (fromIndexed.length > 0) return fromIndexed.join(", ");

  const collection = vars[base];
  if (Array.isArray(collection)) {
    const slice = collection
      .slice(start - 1, end)
      .map((entry) => formatVarValue(entry))
      .filter((entry): entry is string => entry !== null);
    if (slice.length > 0) return slice.join(", ");
  }

  return null;
}

function extractFallbackValue(paren: string): string | null {
  const match = /^\(\s*fallback[:\s]+(?!to\b)\s*([^)]+?)\s*\)$/i.exec(
    paren.trim(),
  );
  const value = match?.[1]?.trim();
  return value && value.length > 0 ? value : null;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Retire un token, et les guillemets qui ne l'enveloppaient que lui. */
function stripToken(line: string, token: string): string {
  const wrapped = new RegExp(`["']${escapeRegExp(token)}["']`, "g");
  return line.replace(wrapped, "").replaceAll(token, "");
}

/**
 * Une ligne ne portait que le(s) placeholder(s) : marqueur de liste,
 * nom de propriété CSS, ponctuation. La supprimer ne casse pas un objet
 * JSON ni une règle qui a d'autre contenu.
 */
function remainderIsEmptyStructure(line: string): boolean {
  const leftover = line
    .replace(/^\s*(?:[-*+]|\d+\.)\s*/, "")
    .replace(/^\s*(?:[A-Za-z][\w-]*|--[\w-]+)\s*:\s*/, "")
    .replace(/["'`,;:.…—–−()[\]{}]/g, " ")
    .replace(/[ \t]+/g, " ")
    .trim();
  return leftover.length === 0;
}

type ResolutionStats = {
  variablesResolved: number;
  fallbacksApplied: number;
  placeholdersStripped: number;
  linesDropped: number;
  warnings: string[];
};

function resolveLine(
  line: string,
  vars: Record<string, unknown>,
  stats: ResolutionStats,
): string | null {
  const tokenRe = new RegExp(PLACEHOLDER_WITH_OPTIONAL_FALLBACK.source, "g");
  const matches = [...line.matchAll(tokenRe)];
  if (matches.length === 0) return line;

  let resolved = line;
  const unresolved: string[] = [];

  for (const match of [...matches].reverse()) {
    const full = match[0];
    const name = match[1];
    const fallbackParen = match[2];
    const index = match.index;
    if (name === undefined || index === undefined) continue;

    const value = lookupVarValue(name, vars);
    const fallbackValue = fallbackParen
      ? extractFallbackValue(fallbackParen)
      : null;

    if (value !== null) {
      resolved =
        resolved.slice(0, index) + value + resolved.slice(index + full.length);
      stats.variablesResolved += 1;
      if (fallbackParen) stats.fallbacksApplied += 1;
      continue;
    }

    if (fallbackValue !== null) {
      resolved =
        resolved.slice(0, index) +
        fallbackValue +
        resolved.slice(index + full.length);
      stats.fallbacksApplied += 1;
      continue;
    }

    unresolved.push(full);
  }

  if (unresolved.length === 0) {
    return resolved.replace(/[ \t]{2,}(?=\S)/g, " ").replace(/[ \t]+$/g, "");
  }

  let stripped = resolved;
  for (const token of unresolved) {
    stripped = stripToken(stripped, token);
    stats.placeholdersStripped += 1;
  }
  stripped = stripped.replace(/[ \t]{2,}(?=\S)/g, " ").replace(/[ \t]+$/g, "");

  if (remainderIsEmptyStructure(stripped)) {
    stats.linesDropped += 1;
    return null;
  }

  const names = unresolved
    .map((token) => token.replace(/^\{\{|\}\}$/g, ""))
    .join(", ");
  stats.warnings.push(
    `[prepare-template] ${names} has no value and no fallback; ` +
      `stripped token from mixed line: ${line.trim().slice(0, 96)}`,
  );
  return stripped;
}

function resolveTemplateVariables(
  body: string,
  vars: Record<string, unknown>,
): { body: string; stats: ResolutionStats } {
  const stats: ResolutionStats = {
    variablesResolved: 0,
    fallbacksApplied: 0,
    placeholdersStripped: 0,
    linesDropped: 0,
    warnings: [],
  };

  const lines = body.split("\n");
  const kept: string[] = [];
  for (const line of lines) {
    const next = resolveLine(line, vars, stats);
    if (next !== null) kept.push(next);
  }

  let resolved = kept.join("\n").replace(/\n{3,}/g, "\n\n");

  resolved = resolved.replace(
    RANGE_PLACEHOLDER,
    (_full, base: string, startRaw: string, endRaw: string) => {
      const value = lookupRangeValue(base, Number(startRaw), Number(endRaw), vars);
      if (value !== null) {
        stats.variablesResolved += 1;
        return value;
      }
      stats.placeholdersStripped += 1;
      stats.warnings.push(
        `[prepare-template] ${base}_${startRaw}..${endRaw} has no value and no fallback; stripped range token`,
      );
      return "";
    },
  );

  resolved = resolved.replace(FAMILY_PLACEHOLDER, (_full, base: string) => {
    const value = lookupFamilyValue(base, vars);
    if (value !== null) {
      stats.variablesResolved += 1;
      return value;
    }
    stats.placeholdersStripped += 1;
    stats.warnings.push(
      `[prepare-template] ${base}_* has no value and no fallback; stripped family token`,
    );
    return "";
  });

  resolved = resolved.replace(LOOSE_PLACEHOLDER, (_full, name: string) => {
    const aliased = LOOSE_ALIASES[name] ?? name.toUpperCase();
    const value = lookupVarValue(name, vars) ?? lookupVarValue(aliased, vars);
    if (value !== null) {
      stats.variablesResolved += 1;
      return value;
    }
    stats.placeholdersStripped += 1;
    return "";
  });

  resolved = resolved.replace(
    JSX_OBJECT_PROP,
    (_full, equals: string, objectBody: string) =>
      `${equals}{({${objectBody.trim()}})}`,
  );

  const leftover = resolved.match(ANY_PLACEHOLDER) ?? [];
  if (leftover.length > 0) {
    for (const token of leftover) {
      resolved = stripToken(resolved, token);
      stats.placeholdersStripped += 1;
    }
    stats.warnings.push(
      `[prepare-template] stripped ${leftover.length} leftover placeholder(s) in a final sweep`,
    );
  }

  resolved = resolved.replace(/[ \t]{2,}(?=\S)/g, " ").replace(/\n{3,}/g, "\n\n");

  return { body: resolved, stats };
}

export function prepareTemplateBody(
  body: string,
  _assetPath: AssetPath,
  vars: Record<string, unknown> = {},
): PreparedTemplate {
  const requiresMarkers = (body.match(REQUIRES_MARKER) ?? []).length;
  const pathNames = (body.match(PATH_NAME) ?? []).length;

  const cleaned = body
    .replace(REQUIRES_MARKER, "")
    .replace(PATH_NAME, "")
    .replace(/[ \t]{2,}(?=\S)/g, " ")
    .replace(/[ \t]+$/gm, "");

  const { body: resolved, stats } = resolveTemplateVariables(cleaned, vars);

  for (const warning of stats.warnings) {
    console.warn(warning);
  }

  return {
    body: resolved,
    removed: {
      requiresMarkers,
      pathNames,
      variablesResolved: stats.variablesResolved,
      fallbacksApplied: stats.fallbacksApplied,
      placeholdersStripped: stats.placeholdersStripped,
      linesDropped: stats.linesDropped,
      charactersSaved: body.length - resolved.length,
    },
    warnings: stats.warnings,
  };
}
