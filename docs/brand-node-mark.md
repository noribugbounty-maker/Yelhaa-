# Yelhaa — marque « Nœud » (drop-in)

Palette retenue : le pictogramme **Nœud**, l'animation **Tracé** et l'intro
**Lockup complet**. Strictement noir & blanc : la marque est en
`currentColor`, donc elle suit les tokens du produit sans variante.

## Fichiers

| Fichier | Destination dans le repo |
| --- | --- |
| `components/brand/yelhaa-node-mark.tsx` | `components/brand/yelhaa-node-mark.tsx` |
| `public/brand/node-picto.svg` | `public/brand/` — picto en `currentColor` (inline) |
| `public/brand/node-picto-dark.svg` | `public/brand/` — encre `#F5F5F5`, surfaces sombres |
| `public/brand/node-picto-light.svg` | `public/brand/` — encre `#050505`, surfaces claires |
| `public/brand/node-app-icon.svg` | `public/brand/` — tuile noire, marque blanche |
| `public/brand/node-app-icon-light.svg` | `public/brand/` — tuile blanche, marque noire |
| `app/icon.svg` | `app/icon.svg` — favicon / icône Next |

## État dans ce repo — installé

L'intégration est faite ; ce qui suit décrit où, pour la maintenance.

1. Fichiers copiés aux chemins du tableau ci-dessus.
2. Keyframes montées via la **première** option : `YELHAA_BRAND_CSS` est
   recopié dans `app/globals.css`, dans le `@layer components` existant (à la
   place de l'ancien `.picto-draw`), et son bloc `prefers-reduced-motion` est
   fusionné dans celui de fin de fichier. `<YelhaaBrandStyles />` n'est donc
   **pas** monté dans `app/layout.tsx` — ne pas l'ajouter, ce serait un
   doublon. Le composant garde l'export pour les consommateurs hors repo.
3. `PictoLoader` remplacé par `YelhaaMarkLoader` sur ses 7 appels ;
   `components/brand/picto-loader.tsx` supprimé.
4. L'ancien `Logo` (wordmark jaune vectorisé) est supprimé lui aussi : ses 13
   appels passent à `<YelhaaMark>` / `<YelhaaLockup>`. Les SVG jaunes de
   `public/brand/` et les scripts `brand:derive` / `brand:normalize` qui les
   fabriquaient ont été retirés — la marque est désormais monochrome de bout
   en bout.
5. Images générées recâblées sur les assets « Nœud » : `app/apple-icon.tsx`,
   `app/opengraph-image.tsx` (qui compose picto + wordmark, l'ancien lockup
   n'étant plus un SVG unique) et `lib/brand-assets.ts`.

> Le CSS vit à deux endroits : `YELHAA_BRAND_CSS` dans le composant et sa
> copie dans `app/globals.css`. **Garder les deux identiques** — c'est le prix
> de l'option « pas de `<style>` au runtime ».

Le CSS déclare son propre bloc `prefers-reduced-motion` : les trois
animations tombent à zéro sans dépendre de la règle globale.

## API

```tsx
import {
  YelhaaMark,
  YelhaaLockup,
  YelhaaAppIcon,
  YelhaaMarkLoader,
  YELHAA_NODE,
} from "@/components/brand/yelhaa-node-mark";

// Picto statique — nav, favicon inline, puces
<YelhaaMark size={24} />

// Tracé : entrée jouée une fois
<YelhaaMark size={64} animate="trace" title="Yelhaa" />

// Lockup avec intro (auth, splash, hero) — une seule fois par écran
<YelhaaLockup height={44} animate />

// Icône d'app
<YelhaaAppIcon size={64} />
<YelhaaAppIcon size={64} invert />

// Le seul loader du produit
<YelhaaMarkLoader size={48} />
```

## Règles

- **Deux valeurs, jamais plus.** Aucune couleur, aucun dégradé, aucune ombre.
- **Tailles minimales :** picto 20 px, lockup 90 px de large. En dessous,
  picto seul.
- **Zone de protection :** la hauteur du picto sur les quatre côtés.
- **Une animation par écran**, en entrée. Seule exception : le loader, et
  uniquement pendant une attente.
- **Ne pas** étirer, incliner, contourner le picto ; **ne pas** substituer la
  typo du lockup (`--font-display` en 600, tracking -0.035em) ni resserrer
  l'écart signe/mot (0,34× la hauteur du picto).
- Sur photo : version pleine sur un aplat noir ou blanc, jamais posée
  directement.

## Géométrie

`YELHAA_NODE` expose le viewBox, le centre, les trois nœuds, le rayon et
l'épaisseur. Toute redéclaration manuelle du tracé ailleurs dans le repo est
un bug : importer la constante.
