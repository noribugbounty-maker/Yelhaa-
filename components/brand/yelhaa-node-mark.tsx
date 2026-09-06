"use client";

/**
 * Yelhaa — marque « Nœud » et ses deux animations retenues.
 *
 * Une seule source de vérité pour le pictogramme : trois branches en
 * `stroke` + trois nœuds en `fill`, tout en `currentColor`. Aucune couleur
 * n'est écrite ici — la marque prend l'encre de son parent, donc elle suit
 * la palette monochrome du produit (`text-ink` sur `--color-void`,
 * `text-void` sur un aplat clair) sans variante de fichier.
 *
 * Deux animations, pas plus (décision : « une seule animation par écran,
 * en entrée ; pas de boucle permanente dans le produit ») :
 *   - `<YelhaaMark animate="trace" />`   → le tracé : les branches se
 *     dessinent en `stroke-dashoffset`, les nœuds éclosent derrière.
 *   - `<YelhaaLockup animate />`         → le tracé puis le dévoilement du
 *     wordmark en `clip-path`. Réservé aux intros (auth, splash, hero).
 * `<YelhaaMarkLoader />` est la seule boucle autorisée : elle remplace
 * `PictoLoader` et n'existe que pendant une attente.
 *
 * Prérequis : monter `<YelhaaBrandStyles />` une fois dans `app/layout.tsx`,
 * ou coller `YELHAA_BRAND_CSS` dans `app/globals.css` (@layer components).
 *
 * Tailles minimales : picto 20px, lockup 90px de large. En dessous du
 * lockup minimum, on passe au picto seul.
 */

import * as React from "react";

/* ------------------------------------------------------------------ */
/* Géométrie — ne pas redessiner à la main ailleurs.                   */
/* ------------------------------------------------------------------ */

export const YELHAA_NODE = {
  viewBox: "0 0 100 100",
  /** Le centre où les trois branches se rejoignent. */
  hub: { x: 50, y: 49 },
  /** Les trois nœuds, dans l'ordre de tracé. */
  tips: [
    { x: 24, y: 21 },
    { x: 76, y: 21 },
    { x: 50, y: 79 },
  ],
  /** Rayon des nœuds et épaisseur des branches, en unités de viewBox. */
  dotRadius: 10,
  strokeWidth: 8.5,
  /** Rayon du carré de l'icône d'app, en unités de viewBox. */
  tileRadius: 22,
} as const;

/** Longueur de tracé (arrondie au-dessus) et retard, par branche. */
const BRANCHES = [
  { d: "M50 49 L24 21", length: 40, delay: 0 },
  { d: "M50 49 L76 21", length: 40, delay: 70 },
  { d: "M50 49 L50 79", length: 32, delay: 140 },
] as const;

/* ------------------------------------------------------------------ */
/* Styles                                                              */
/* ------------------------------------------------------------------ */

export const YELHAA_BRAND_CSS = `
/* Yelhaa — marque « Nœud ». Tracé unique, réutilisé par le lockup et le loader. */
.y-branch { stroke-dasharray: var(--y-len, 40); stroke-dashoffset: 0; }
.y-node { transform-box: fill-box; transform-origin: center; }

.y-trace .y-branch {
  animation: y-branch-draw 620ms var(--ease-cut, cubic-bezier(.2,0,0,1)) backwards;
  animation-delay: var(--y-delay, 0ms);
}
.y-trace .y-node {
  animation: y-node-pop 380ms cubic-bezier(.34,1.4,.64,1) backwards;
  animation-delay: calc(var(--y-delay, 0ms) + 300ms);
}
.y-trace .y-wordmark {
  animation: y-wordmark-wipe 520ms var(--ease-cut, cubic-bezier(.2,0,0,1)) backwards;
  animation-delay: 620ms;
}

.y-loop .y-branch {
  animation: y-branch-draw 1400ms var(--ease-cut, cubic-bezier(.2,0,0,1)) infinite both;
  animation-delay: var(--y-delay, 0ms);
}
.y-loop .y-node {
  animation: y-node-pop 1400ms cubic-bezier(.34,1.4,.64,1) infinite both;
  animation-delay: calc(var(--y-delay, 0ms) + 120ms);
}

@keyframes y-branch-draw {
  from { stroke-dashoffset: var(--y-len, 40); }
}
@keyframes y-node-pop {
  0% { transform: scale(0); }
  60% { transform: scale(1.16); }
  100% { transform: scale(1); }
}
@keyframes y-wordmark-wipe {
  from { clip-path: inset(0 100% 0 0); }
  to { clip-path: inset(0 0 0 0); }
}

@media (prefers-reduced-motion: reduce) {
  .y-trace .y-branch,
  .y-trace .y-node,
  .y-trace .y-wordmark,
  .y-loop .y-branch,
  .y-loop .y-node {
    animation: none;
    stroke-dashoffset: 0;
    transform: none;
    clip-path: none;
  }
}
`;

/** À monter une fois, dans `app/layout.tsx`, si le CSS n'est pas dans globals.css. */
export function YelhaaBrandStyles() {
  return <style precedence="default">{YELHAA_BRAND_CSS}</style>;
}

/* ------------------------------------------------------------------ */
/* Le pictogramme                                                      */
/* ------------------------------------------------------------------ */

type Animate = false | "trace" | "loop";

type MarkProps = {
  /** Côté du carré, en px. Minimum 20. */
  size?: number;
  /** `"trace"` : entrée jouée une fois. `"loop"` : réservé au loader. */
  animate?: Animate;
  /** Retard global avant le tracé, en ms. */
  delayMs?: number;
  className?: string;
  /**
   * Libellé accessible. Vide (défaut) quand la marque est décorative ou
   * accompagnée d'un libellé textuel — elle est alors `aria-hidden`.
   */
  title?: string;
};

function animClass(animate: Animate) {
  if (animate === "trace") return "y-trace";
  if (animate === "loop") return "y-loop";
  return undefined;
}

export function YelhaaMark({
  size = 32,
  animate = false,
  delayMs = 0,
  className,
  title = "",
}: MarkProps) {
  const { viewBox, tips, dotRadius, strokeWidth } = YELHAA_NODE;

  return (
    <svg
      viewBox={viewBox}
      width={size}
      height={size}
      role={title ? "img" : undefined}
      aria-label={title || undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
      className={[animClass(animate), className].filter(Boolean).join(" ")}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      >
        {BRANCHES.map((b) => (
          <path
            key={b.d}
            d={b.d}
            className="y-branch"
            style={
              {
                "--y-len": b.length,
                "--y-delay": `${delayMs + b.delay}ms`,
              } as React.CSSProperties
            }
          />
        ))}
      </g>
      <g fill="currentColor">
        {tips.map((t, i) => (
          <circle
            key={`${t.x}-${t.y}`}
            cx={t.x}
            cy={t.y}
            r={dotRadius}
            className="y-node"
            style={
              { "--y-delay": `${delayMs + i * 70}ms` } as React.CSSProperties
            }
          />
        ))}
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Le lockup — picto + wordmark                                        */
/* ------------------------------------------------------------------ */

type LockupProps = {
  /** Hauteur du pictogramme, en px. Le wordmark en découle. */
  height?: number;
  /** Joue l'intro : tracé du picto puis dévoilement du mot. */
  animate?: boolean;
  className?: string;
};

/**
 * Rapports fixés à la validation. Le wordmark fait 0,75× la hauteur du
 * picto en corps, l'écart 0,34×. Ne pas resserrer, ne pas substituer la
 * typo : c'est `--font-display` (Inter) en 600, tracking -0.035em.
 */
const LOCKUP = { wordRatio: 0.75, gapRatio: 0.34 } as const;

export function YelhaaLockup({
  height = 44,
  animate = false,
  className,
}: LockupProps) {
  return (
    <span
      role="img"
      aria-label="Yelhaa"
      className={[
        "inline-flex items-center",
        animate ? "y-trace" : undefined,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ gap: Math.round(height * LOCKUP.gapRatio) }}
    >
      <YelhaaMark size={height} />
      <span
        className="y-wordmark font-display font-semibold leading-none"
        style={{
          fontSize: Math.round(height * LOCKUP.wordRatio),
          letterSpacing: "-0.035em",
        }}
      >
        Yelhaa
      </span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* L'icône d'application                                               */
/* ------------------------------------------------------------------ */

/**
 * Le picto en réserve dans une tuile pleine. `invert` retourne le couple :
 * tuile claire, marque sombre. Le picto occupe 62% de la tuile.
 */
export function YelhaaAppIcon({
  size = 64,
  invert = false,
  className,
}: {
  size?: number;
  invert?: boolean;
  className?: string;
}) {
  const { tileRadius } = YELHAA_NODE;

  return (
    <span
      aria-hidden="true"
      className={["inline-grid place-items-center", className]
        .filter(Boolean)
        .join(" ")}
      style={{
        width: size,
        height: size,
        borderRadius: (size * tileRadius) / 100,
        background: invert ? "var(--color-ink)" : "var(--color-void)",
        color: invert ? "var(--color-void)" : "var(--color-ink)",
      }}
    >
      <YelhaaMark size={Math.round(size * 0.62)} />
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Le loader                                                           */
/* ------------------------------------------------------------------ */

/**
 * Le seul loader du produit — remplace `PictoLoader`. Aucun spinner
 * circulaire : la marque se dessine en boucle, et seulement pendant une
 * attente. L'état est annoncé par la région `aria-live` qui accompagne ce
 * composant.
 */
export function YelhaaMarkLoader({ size = 48 }: { size?: number }) {
  return <YelhaaMark size={size} animate="loop" />;
}
