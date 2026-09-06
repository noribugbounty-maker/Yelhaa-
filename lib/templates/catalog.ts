/**
 * Catalogue fichier — source de vérité du RAG.
 *
 * Les 35 templates vivent dans `content/templates/*.md`. Le seed Supabase
 * n'est qu'une copie pour les identifiants persistés. Le classement se fait
 * toujours sur ce corpus, pas sur une recherche vectorielle externe.
 */

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import type { SelectableTemplate } from "@/lib/ai/select-template";
import {
  DOMAINS,
  TEMPLATE_FILES,
  parseLooseTemplates,
  parseTemplateFile,
  type Domain,
  type LooseTemplate,
  type ParsedTemplate,
} from "@/lib/templates/parse";

export function catalogRoot(cwd = process.cwd()): string {
  return join(cwd, "content", "templates");
}

export function loadParsedCatalog(cwd = process.cwd()): ParsedTemplate[] {
  const root = catalogRoot(cwd);
  return DOMAINS.flatMap((domain) => {
    const source = readFileSync(join(root, TEMPLATE_FILES[domain]), "utf8");
    return parseTemplateFile(domain, source);
  });
}

/**
 * Tous les `*.md` du dossier, lus à l'instant T — pas la liste figée des
 * quatre fichiers domaine. Le ranking / RAG continue d'utiliser
 * `loadParsedCatalog` uniquement.
 */
export function loadAllDiskTemplateBodies(
  cwd = process.cwd(),
): LooseTemplate[] {
  const root = catalogRoot(cwd);
  return readdirSync(root)
    .filter((name) => name.endsWith(".md"))
    .sort()
    .flatMap((name) => {
      const source = readFileSync(join(root, name), "utf8");
      return parseLooseTemplates(source, name);
    });
}

export function parsedToSelectable(
  template: ParsedTemplate,
  id = template.slug,
): SelectableTemplate {
  return {
    id,
    slug: template.slug,
    domain: template.domain,
    art_direction: template.art_direction,
    title: template.title,
    summary: template.summary,
    body: template.body,
    tags: template.tags,
    variables: template.variables,
    asset_paths: template.asset_paths,
  };
}

export function loadSelectableCatalog(
  domain?: Domain,
  cwd = process.cwd(),
): SelectableTemplate[] {
  return loadParsedCatalog(cwd)
    .filter((template) => (domain ? template.domain === domain : true))
    .map((template) => parsedToSelectable(template));
}
