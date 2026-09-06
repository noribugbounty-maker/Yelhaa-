import type { AssetPath, Domain } from "@/lib/templates/parse";

/**
 * Sélection du template — build prompt §4 étape 6.
 *
 * « Pas de recherche vectorielle. » Le SQL filtre sur le domaine, le classement
 * se fait en TypeScript : à 35 templates c'est instantané, déterministe et
 * inspectable.
 *
 * ## Pourquoi le score a changé
 *
 * L'ancienne forme ne pesait que trois termes :
 *
 *     tags × 3  +  art_direction × 5  +  asset_path × 2
 *
 * Les trois dépendent d'`art_direction_hints`, des mots de style libres rendus
 * par le classifieur. Mesuré sur le vrai catalogue, avec huit jeux d'indices
 * réalistes : **quatre fois sur huit, tous les candidats du domaine étaient ex
 * aequo** et le gagnant était celui dont le slug passe premier dans l'ordre
 * alphabétique. « dark, technical » choisissait `saas-01-swiss-brutalist-
 * monochrome`, un template monochrome suisse, plutôt que le terminal cyberpunk
 * du même domaine. Le domaine comptait ; la direction artistique, une fois sur
 * deux, ne comptait pas.
 *
 * La cause est le vocabulaire : les tags décrivent la technique et le style
 * concret — `brutalist`, `nextjs`, `swiss` — quand les indices décrivent une
 * humeur — `dark`, `trustworthy`. Aucun des deux n'est fautif ; ils ne se
 * rencontrent simplement pas assez souvent pour départager dix candidats.
 *
 * Deux signaux **déjà produits et déjà stockés** étaient jetés :
 *
 * 1. `sub_type`, rendu par l'appel de classification, n'était transmis à
 *    personne.
 * 2. `variables`, la liste des variables que le template réclame, présente en
 *    base sur les 35 lignes, n'était pas lue.
 *
 * Le second est le plus utile, et c'est le seul qui parle des **informations
 * réellement fournies** : un template qui exige `PRICING_TIERS` alors que
 * l'utilisateur n'a donné aucun prix produira des sections vides que l'appel
 * d'injection devra supprimer. Le préférer est un mauvais choix mesurable.
 *
 * Aucune colonne n'est ajoutée, aucun appel de modèle supplémentaire n'est
 * fait. `complexity` reste ignorée : elle vaut `medium` sur les 35 lignes, donc
 * elle ne départage rien — l'utiliser serait décoratif.
 */

export type SelectableTemplate = {
  id: string;
  slug: string;
  domain: Domain;
  art_direction: string;
  title: string;
  summary: string;
  body: string;
  tags: string[];
  asset_paths: Record<string, boolean>;
  /** Variables réclamées par le corps, normalisées à l'ingestion. */
  variables: string[];
};

export type ScoredTemplate<T extends SelectableTemplate = SelectableTemplate> =
  {
    template: T;
    score: number;
    breakdown: {
      tagOverlap: number;
      artDirectionMatch: number;
      assetPathFit: number;
      subTypeMatch: number;
      /** Part des variables réclamées que la classification fournit, 0 à 1. */
      varCoverage: number;
    };
  };

/** Tout ce que la classification sait, au moment de choisir. */
export type SelectionSignals = {
  hints: string[];
  /** `sub_type` de l'appel #1. Absent sur les entrées les plus vagues. */
  subType?: string | null;
  /** `vars` fusionnées avec `domain_vars` — les informations fournies. */
  vars?: Record<string, unknown>;
  assetPath: AssetPath;
};

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

/** Mots signifiants d'une expression, bornés pour éviter les faux positifs. */
function words(value: string): string[] {
  return normalize(value)
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length >= 3);
}

/**
 * Une variable réclamée est-elle réellement fournie ?
 *
 * Le contrat suit celui de l'injection, et il n'en invente pas un second : le
 * classifieur rend `ITEM` et `SCREEN` sous forme de **tableaux**, tandis que le
 * corps du template écrit `{{ITEM_1}}`, `{{ITEM_2}}`… La forme indexée est donc
 * satisfaite quand le tableau du même nom est assez long.
 *
 * Une chaîne vide ou `null` ne compte pas : la variable est déclarée, pas
 * fournie, et c'est exactement la situation qui produit une section vide.
 */
export function isVariableSupplied(
  name: string,
  vars: Record<string, unknown>,
): boolean {
  const filled = (value: unknown): boolean => {
    if (value === null || value === undefined) return false;
    if (typeof value === "string") return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    return true;
  };

  if (name in vars && filled(vars[name])) return true;

  const indexed = /^(.+)_(\d+)$/.exec(name);
  if (indexed) {
    const [, base, position] = indexed;
    const collection = vars[base as string];
    if (Array.isArray(collection)) {
      const index = Number(position) - 1;
      return index >= 0 && index < collection.length && filled(collection[index]);
    }
  }

  return false;
}

export function scoreTemplate<T extends SelectableTemplate>(
  template: T,
  signals: SelectionSignals,
): ScoredTemplate<T> {
  const { hints, subType, vars, assetPath } = signals;

  const normalizedHints = hints.map(normalize).filter(Boolean);
  const normalizedTags = template.tags.map(normalize);
  const normalizedArtDirection = normalize(template.art_direction);

  const tagOverlap = normalizedHints.filter((hint) =>
    normalizedTags.some(
      (tag) => tag === hint || tag.includes(hint) || hint.includes(tag),
    ),
  ).length;

  const artDirectionMatch = normalizedHints.filter((hint) =>
    normalizedArtDirection.includes(hint),
  ).length;

  const assetPathFit = template.asset_paths[assetPath] === true ? 1 : 0;

  /*
   * `sub_type` est une expression — « analytics dashboard », « e-commerce ».
   * La comparaison se fait mot à mot et non par sous-chaîne : « ai » contenu
   * dans « detail » ferait mouche partout et le signal ne vaudrait plus rien.
   */
  const subTypeWords = subType ? words(subType) : [];
  const templateWords = new Set([
    ...template.tags.flatMap(words),
    ...words(template.art_direction),
    ...words(template.title),
  ]);
  const subTypeMatch = subTypeWords.filter((word) =>
    templateWords.has(word),
  ).length;

  /*
   * Part des variables réclamées que la classification fournit. Une fraction,
   * volontairement : elle départage les candidats que les termes entiers
   * laissent à égalité, sans jamais renverser une correspondance de style
   * franche. Un template sans variables déclarée ne peut ni gagner ni perdre
   * sur ce terme.
   */
  const declared = template.variables ?? [];
  const varCoverage =
    vars && declared.length > 0
      ? declared.filter((name) => isVariableSupplied(name, vars)).length /
        declared.length
      : 0;

  return {
    template,
    score:
      tagOverlap * 3 +
      artDirectionMatch * 5 +
      assetPathFit * 2 +
      subTypeMatch * 3 +
      varCoverage * 4,
    breakdown: {
      tagOverlap,
      artDirectionMatch,
      assetPathFit,
      subTypeMatch,
      varCoverage,
    },
  };
}

/**
 * Classe et renvoie le meilleur en premier.
 *
 * Le départage final reste le slug : deux exécutions sur la même entrée
 * choisissent toujours le même template. Ce n'est plus le mécanisme de
 * décision courant — il ne sert qu'aux égalités parfaites, où tout autre
 * critère serait arbitraire aussi.
 */
export function rankTemplates<T extends SelectableTemplate>(
  templates: T[],
  signals: SelectionSignals,
): ScoredTemplate<T>[] {
  return templates
    .map((template) => scoreTemplate(template, signals))
    .sort((a, b) =>
      b.score !== a.score
        ? b.score - a.score
        : a.template.slug.localeCompare(b.template.slug),
    );
}
