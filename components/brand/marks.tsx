/**
 * Marques manuelles — design prompt §1.5.
 *
 * Dérivées de l'éclair du picto : contour irrégulier, trait de doublure
 * décalé. Toujours en --volt, jamais en gris. Toujours décoratives :
 * `aria-hidden` et `pointer-events-none` systématiques.
 *
 * Rappel de la règle : maximum trois marques visibles simultanément dans
 * un viewport.
 */

type MarkProps = {
  className?: string;
  /** Dessine le tracé en stroke-dashoffset au montage (§1.8). */
  draw?: boolean;
  /** Retard avant le tracé, en millisecondes. */
  delayMs?: number;
  /**
   * Encre de la marque. `volt` par défaut — jamais de gris.
   *
   * `volt-deep` sur les surfaces claires : le `--volt` y descend à 1,5:1 et
   * devient illisible (§1.6). `inherit` sert au chevron posé sur un aplat
   * `--volt`, où il est en `--void` (§3.2) : la couleur est portée par le
   * parent.
   */
  tone?: "volt" | "volt-deep" | "inherit";
};

type DrawStyle = React.CSSProperties & {
  "--mark-length"?: string;
  "--mark-delay"?: string;
};

const TONE_CLASS = {
  volt: "text-volt",
  "volt-deep": "text-volt-deep",
  inherit: "",
} as const;

function markClass(tone: MarkProps["tone"], className: string | undefined) {
  return ["pointer-events-none", TONE_CLASS[tone ?? "volt"], className]
    .filter(Boolean)
    .join(" ");
}

function drawProps(draw: boolean | undefined, length: number, delayMs = 0) {
  if (!draw) return {};
  const style: DrawStyle = {
    "--mark-length": String(length),
    "--mark-delay": `${delayMs}ms`,
  };
  return { className: "mark-draw", style };
}

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/** La coche — états validés, étapes franchies, features incluses. */
export function MarkTick({ className, draw, delayMs, tone }: MarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={markClass(tone, className)}
    >
      <g {...base} strokeWidth={2.1}>
        <path
          d="M2.6 12.9 C5.1 14.4 6.9 16.6 8.9 20.1 C12.1 13.4 16.1 7.6 21.4 3.2"
          {...drawProps(draw, 34, delayMs)}
        />
        <path
          d="M5.4 11.4 C6.2 12.1 6.9 12.9 7.6 13.9"
          {...drawProps(draw, 6, (delayMs ?? 0) + 120)}
        />
      </g>
    </svg>
  );
}

/** Le soulignement — sous un mot clé de titre. Une occurrence par page maximum. */
export function MarkUnderline({ className, draw, delayMs, tone }: MarkProps) {
  return (
    <svg
      viewBox="0 0 200 14"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      className={markClass(tone, className)}
    >
      <g {...base} strokeWidth={3.2}>
        <path
          d="M2.4 9.1 C36 4.2 79 2.6 123 4.3 C151 5.4 176 7.2 197.8 10.6"
          {...drawProps(draw, 200, delayMs)}
        />
        <path
          d="M26 12.4 C61 8.9 103 7.6 147 8.8"
          {...drawProps(draw, 122, (delayMs ?? 0) + 90)}
        />
      </g>
    </svg>
  );
}

/** Le chevron — progression entre les étapes du parcours. */
export function MarkChevron({ className, draw, delayMs, tone }: MarkProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      focusable="false"
      className={markClass(tone, className)}
    >
      <g {...base} strokeWidth={2}>
        <path
          d="M4.4 2.1 C6.9 4.8 9.3 6.8 12 8.1 C9.2 9.6 6.6 11.7 4.1 14.2"
          {...drawProps(draw, 24, delayMs)}
        />
        <path
          d="M6.6 4.9 C7.6 5.8 8.6 6.6 9.7 7.2"
          {...drawProps(draw, 6, (delayMs ?? 0) + 100)}
        />
      </g>
    </svg>
  );
}

/**
 * Le plus — en tête de chaque question de la section FAQ de la HOME (§5.6).
 *
 * Tracé à 1,5px comme le demande le §5.6, et volontairement **sans** état
 * ouvert : il ne pivote jamais en croix. Sur la HOME, il n'y a rien à déplier —
 * l'item est un lien vers `/faq/[slug]`, et un `+` qui pivoterait sans rien
 * ouvrir serait un mensonge d'affordance.
 */
export function MarkPlus({ className, draw, delayMs, tone }: MarkProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      focusable="false"
      className={markClass(tone, className)}
    >
      <g {...base} strokeWidth={1.5}>
        <path
          d="M8.2 2.3 C7.9 6.1 7.9 10 8.1 13.7"
          {...drawProps(draw, 12, delayMs)}
        />
        <path
          d="M2.4 7.9 C6.2 7.6 10.1 7.6 13.8 7.8"
          {...drawProps(draw, 12, (delayMs ?? 0) + 90)}
        />
      </g>
    </svg>
  );
}

/** La barre — puces de liste, séparateurs de méta, soulignement de nav. */
export function MarkBar({ className, draw, delayMs, tone }: MarkProps) {
  return (
    <svg
      viewBox="0 0 24 8"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      className={markClass(tone, className)}
    >
      <g {...base} strokeWidth={2.4}>
        <path
          d="M1.4 5.6 C7.2 3.4 14.6 2.8 22.6 3.4"
          {...drawProps(draw, 24, delayMs)}
        />
      </g>
    </svg>
  );
}
