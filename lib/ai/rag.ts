import type { SelectableTemplate, SelectionSignals } from "@/lib/ai/select-template";
import { rankTemplates, type ScoredTemplate } from "@/lib/ai/select-template";

/**
 * RAG lexical sur `content/templates`.
 *
 * Pas d'embeddings, pas de base vectorielle : 35 templates tiennent en
 * mémoire. On classe le corpus fichier avec (a) le score structurel déjà
 * mesuré — tags, direction artistique, couverture des variables — et (b) le
 * recouvrement de l'idée brute contre le titre, le résumé et le corps.
 *
 * C'est de la retrieval-augmented generation au sens du produit : le modèle
 * n'invente pas le gabarit, il le retrouve, puis y injecte la demande.
 */

const STOPWORDS = new Set([
  "the",
  "and",
  "for",
  "with",
  "une",
  "des",
  "les",
  "pour",
  "avec",
  "dans",
  "que",
  "qui",
  "sur",
  "plus",
  "want",
  "need",
  "site",
  "page",
  "web",
  "website",
]);

export function tokenize(value: string): string[] {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length >= 3 && !STOPWORDS.has(word));
}

function termFrequency(haystack: string, terms: string[]): number {
  if (terms.length === 0 || !haystack) return 0;
  const normalized = haystack
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
  let hits = 0;
  for (const term of terms) {
    if (normalized.includes(term)) hits += 1;
  }
  return hits / terms.length;
}

export function lexicalOverlap(
  template: SelectableTemplate,
  query: string,
): number {
  const terms = tokenize(query);
  if (terms.length === 0) return 0;

  const title = termFrequency(`${template.title} ${template.art_direction}`, terms);
  const summary = termFrequency(template.summary, terms);
  const tags = termFrequency(template.tags.join(" "), terms);
  const body = termFrequency(template.body.slice(0, 4000), terms);

  return title * 5 + summary * 3 + tags * 3 + body * 4;
}

export type RetrievalQuery = SelectionSignals & {
  /** Idée brute — le signal que le classement par hints seul ignorait. */
  idea: string;
};

export type RetrievedTemplate<T extends SelectableTemplate = SelectableTemplate> =
  ScoredTemplate<T> & {
    lexical: number;
  };

/**
 * Retrouve le gabarit le plus proche dans le catalogue fichier.
 *
 * Le score final additionne le classement structurel et le recouvrement
 * lexical de l'idée. Un template qui colle au brief gagne même si les hints
 * de style sont pauvres. Le départage reste le slug.
 */
export function retrieveTemplates<T extends SelectableTemplate>(
  templates: T[],
  query: RetrievalQuery,
): RetrievedTemplate<T>[] {
  const ranked = rankTemplates(templates, query);

  return ranked
    .map((entry) => {
      const lexical = lexicalOverlap(entry.template, query.idea);
      return {
        ...entry,
        lexical,
        score: entry.score + lexical,
      };
    })
    .sort((a, b) =>
      b.score !== a.score
        ? b.score - a.score
        : a.template.slug.localeCompare(b.template.slug),
    );
}
