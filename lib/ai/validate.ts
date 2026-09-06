/**
 * Validation de sortie — build prompt §4 étape 9.
 *
 * « Rejet et régénération une fois si l'un de ces motifs subsiste. »
 * Après un second échec : erreur claire, et le quota n'est pas décompté.
 */

export type RejectionReason =
  | "empty"
  | "placeholder"
  | "requires-marker"
  | "path-name"
  | "fallback"
  | "finance-figure";

export type ValidationIssue = {
  reason: RejectionReason;
  /** Extraits fautifs, dédupliqués, tronqués — sert au diagnostic. */
  samples: string[];
};

export type ValidationResult = {
  valid: boolean;
  issues: ValidationIssue[];
};

/** Les quatre motifs du §4, dans l'ordre où ils y sont écrits. */
const PATTERNS: Array<{ reason: RejectionReason; pattern: RegExp }> = [
  { reason: "placeholder", pattern: /\{\{|\}\}/g },
  { reason: "requires-marker", pattern: /\[REQUIRES:/g },
  {
    reason: "path-name",
    pattern: /(STANDARD|ENHANCED|SEQUENCE|VIDEO|ADVANCED) PATH/g,
  },
  /*
   * « fallback » a **deux sens** dans les templates, et n'en rejeter qu'un
   * seul est la correction qui compte ici.
   *
   * Échafaudage — à retirer :
   *     --accent: {{ACCENT_HEX}} (fallback #0B0B0B)
   * La parenthèse porte la valeur par défaut du gabarit. Une fois la variable
   * substituée, elle n'a plus de sens et doit disparaître.
   *
   * Prose technique — à conserver :
   *     react-three-fiber (fallback to CSS gradients if WebGL unavailable)
   *     …fallback to CSS gradients if WebGL unavailable
   * C'est une vraie consigne d'ingénierie, exactement le genre de chose qu'un
   * prompt final doit dire.
   *
   * L'ancien motif `\bfallback\b` rejetait les deux. Mesuré sur un banc de
   * trois générations réelles : deux échouaient à la première tentative sur ce
   * seul mot, et chaque échec relance l'appel le plus cher du pipeline. Le
   * motif ne vise donc plus que la forme « (fallback <valeur> ) » suivie d'une
   * valeur littérale — couleur, jeton CSS, nombre — jamais un verbe.
   */
  {
    reason: "fallback",
    pattern: /\(\s*fallback[:\s]+(?!to\b)[^)]{0,40}\)/gi,
  },
];

/**
 * Chiffres à contrôler pour `domain === "finance"` : pourcentages et montants
 * monétaires. « Un rendement inventé expose ton utilisateur à un vrai risque
 * réglementaire — pas à un bug d'affichage. »
 *
 * `sourceText` doit contenir **l'idée de l'utilisateur ET le corps du template
 * retenu**. Les templates portent leurs propres pourcentages techniques —
 * `width 100%`, `opacity 8%` — qui font partie de la spécification et ne sont
 * inventés par personne. Ne comparer qu'à l'idée rejetterait toute génération
 * finance dès le premier `100%` de CSS. Ce qui est invention, c'est ce que le
 * modèle ajoute et qui n'est ni dans l'idée ni dans le template.
 */
const FINANCE_FIGURES =
  /(\d+(?:[.,]\d+)?\s*%)|([$€£¥]\s?\d[\d\s.,]*)|(\d[\d\s.,]*\s?(?:€|\$|£|¥|EUR|USD|GBP|CHF))/gi;

/** Compare des chiffres à la source en ignorant espaces et séparateurs. */
function figureKey(value: string): string {
  return value.replace(/[\s ]/g, "").replace(/,/g, ".").toLowerCase();
}

function collect(output: string, pattern: RegExp): string[] {
  const matches = output.match(pattern) ?? [];
  return [...new Set(matches)].slice(0, 5);
}

export function validateOutput(
  output: string,
  options: { domain: string; sourceText: string },
): ValidationResult {
  if (!output.trim()) {
    return { valid: false, issues: [{ reason: "empty", samples: [] }] };
  }

  const issues: ValidationIssue[] = [];

  for (const { reason, pattern } of PATTERNS) {
    const samples = collect(output, pattern);
    if (samples.length > 0) issues.push({ reason, samples });
  }

  if (options.domain === "finance") {
    const sourceKeys = new Set(
      (options.sourceText.match(FINANCE_FIGURES) ?? []).map(figureKey),
    );

    const invented = [
      ...new Set(
        (output.match(FINANCE_FIGURES) ?? []).filter(
          (figure) => !sourceKeys.has(figureKey(figure)),
        ),
      ),
    ];

    if (invented.length > 0) {
      issues.push({ reason: "finance-figure", samples: invented.slice(0, 5) });
    }
  }

  return { valid: issues.length === 0, issues };
}
