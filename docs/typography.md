# Typographie

## État actuel

Trois familles, chargées par `next/font/google` dans `app/layout.tsx` :

| Rôle | Famille servie | Variable CSS |
|---|---|---|
| Display | **Poppins** 600 / 700 | `--font-display-family` |
| UI / Body | Inter variable | `--font-sans-family` |
| Mono | JetBrains Mono 400 / 500 | `--font-mono-family` |

Poppins est l'alternative documentée au §1.4 du prompt design. La famille
demandée est **General Sans** (Fontshare), qui n'est pas servie par
`next/font/google`.

Le wordmark n'entre pas dans ce tableau : il est vectorisé dans le SVG et
n'utilise aucune police au runtime (décisions §2).

## Bascule vers General Sans — ce qui est attendu

### Fichiers

Deux `.woff2`, exactement à cet emplacement et sous ces noms :

```
app/fonts/GeneralSans-Semibold.woff2     poids 600
app/fonts/GeneralSans-Bold.woff2         poids 700
```

Dans l'archive Fontshare, ils se trouvent sous `Fonts/WEB/fonts/`. Seul le
`.woff2` est nécessaire — ni `.woff`, ni `.ttf`, ni `.otf`, ni les statiques
des autres graisses : le display n'utilise que 600 et 700.

Le dossier `app/fonts/` n'existe pas encore ; il est créé au dépôt des
fichiers. Le chemin est relatif à `app/layout.tsx`, c'est ce que `next/font/local`
attend.

### Code qui remplacera l'import Poppins

```ts
import localFont from "next/font/local";

const display = localFont({
  src: [
    { path: "./fonts/GeneralSans-Semibold.woff2", weight: "600", style: "normal" },
    { path: "./fonts/GeneralSans-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-display-family",
  display: "swap",
  preload: true,
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
  adjustFontFallback: "Arial",
});
```

Trois points sur ce bloc :

- `adjustFontFallback: "Arial"` génère le `size-adjust` exigé au §5 — c'est ce
  qui empêche le décalage de mise en page pendant le `swap`.
- `preload: true` ne charge que ces deux graisses, utilisées au-dessus de la
  ligne de flottaison. Le mono reste en `preload: false`.
- `--font-display-family` ne change pas de nom : `globals.css` continue de le
  consommer sans modification.

L'import `Poppins` disparaît de `app/layout.tsx` et son nom sort de la chaîne
de repli du `@theme`. On reste à trois familles.

### Ce qui sera revérifié après la bascule

Le §1.4 calibre `tracking -0.035em` et `leading 0.94` sur les métriques de
General Sans. Poppins a une hauteur d'x et une chasse différentes, donc :

- le rendu du h1 « Your idea. / Made real. » et ses points de rupture de
  `clamp(2.5rem, 6.5vw, 5.5rem)` ;
- la position et la longueur du soulignement manuel sous « real », calées en
  `em` sur la boîte du mot ;
- les `type-h2` et `type-h3`, mêmes réglages de tracking ;
- l'absence de décalage cumulé au chargement (CLS < 0,03).

### Licence

General Sans est publiée sous ITF Free Font License, qui autorise
l'auto-hébergement web. Les fichiers vivent dans le dépôt, aucune requête vers
un domaine tiers n'est émise — cohérent avec le §5 et avec la CSP de la phase 11.
