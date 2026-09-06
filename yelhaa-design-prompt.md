# YELHAA — DESIGN / BRANDING / CREATIVE DIRECTION PROMPT

> **À coller dans Cursor / Claude Code APRÈS le fichier `README.txt` (STRUCTURE DIRECTIVE v2.0).**
>
> Ce document est la **couche design**. Le README est la **couche structure**.
> En cas de conflit, la structure du README gagne — sauf demande explicite contraire.
>
> Toutes les décisions de branding et de contenu sont tranchées. Les rares valeurs encore ouvertes
> (liste des modèles, URL sociales) sont signalées en clair et ne bloquent pas le build.

---

# PARTIE 1 — BRAND FOUNDATION

## 1.0 Langue de l'interface

**Toute l'interface est en anglais.** Libellés, boutons, messages d'erreur, états vides, FAQ, pages légales, e-mails. Aucun mélange. Le produit s'adresse à un public international de développeurs et d'agences, et la moitié des termes du métier n'ont pas d'équivalent français utilisable.

Les seuls textes déjà arrêtés : le h1 « Your idea. Made real. » et le sous-titre du §3.2.

## 1.1 Identité

| | |
|---|---|
| Nom | **Yelhaa** |
| Produit | Environnement de développement multi-IA |
| Accroche | **Your idea. Made real.** |
| Promesse | De l'idée au prompt au code, dans un seul environnement |
| Registre | Électrique, rapide, technique. Jamais corporate, jamais mignon. |

## 1.2 Le logo

Deux fichiers fournis, tous deux vectoriels :

- `logo_fond_noir.svg` — éclair jaune + wordmark **blanc**. Usage par défaut.
- `logo_fond_blanc.svg` — éclair jaune + wordmark **noir**. Usage sur surfaces claires uniquement.
- `01-picto_1.svg` — le picto éclair seul.

**Le logo se compose de deux éléments de nature opposée, et cette opposition est l'identité :**

1. **Le picto** — un éclair tracé à la main, arêtes irrégulières, un trait de doublure décalé sur la droite. Il est brut, rapide, humain. Il a l'air d'avoir été fait en une seconde.
2. **Le wordmark** — une grotesque géométrique très grasse et oblique, parfaitement régulière. Contreformes fermées, `a` monoculaire, inclinaison constante.

**Règle de direction artistique fondamentale :** tout le système visuel doit rejouer cette tension — **une grille rigoureuse traversée par des marques rapides et manuelles**. Ni tout propre, ni tout brut.

### Règles d'usage du logo

- Zone de protection : la hauteur du picto, sur les quatre côtés. Rien n'entre dedans.
- Taille minimale : picto seul 20px, lockup complet 96px de large.
- Le picto ne se redessine jamais. Il ne se met pas au carré, ne se met pas dans un cercle, ne reçoit ni ombre ni contour.
- L'éclair ne change jamais de couleur. Il est `#DFD200`, sur fond noir comme sur fond clair.
- Interdit : étirer, faire pivoter le lockup, recolorer le wordmark autrement qu'en `#FFFFFF` ou `#0A0A0A`, ajouter un dégradé, ajouter un glow.
- Dans la navigation : picto seul sur mobile, lockup complet à partir de `md`.

## 1.3 Palette

La marque n'a **qu'une seule couleur**. Tout le reste est une valeur de gris. C'est volontaire et c'est ce qui rend le jaune violent.

```css
@theme {
  /* Encre — la seule couleur de marque */
  --color-volt:        #DFD200;   /* jaune électrique, valeur exacte du picto */
  --color-volt-hot:    #F2E400;   /* hover uniquement */
  --color-volt-press:  #BFB400;   /* fond pressé du CTA — texte --void dessus */
  --color-volt-deep:   #756E00;   /* texte jaune SUR FOND CLAIR uniquement — §1.6 */

  /* Fond — échelle sombre */
  --color-void:        #08090A;   /* fond global */
  --color-surface:     #0F1113;   /* cartes, panneaux */
  --color-surface-2:   #16191C;   /* surfaces élevées, inputs */
  --color-line:        #22262B;   /* filets 1px, la structure entière */
  --color-line-strong: #333940;   /* filets d'accent, séparateurs de section */

  /* Texte */
  --color-ink:         #F4F5F6;   /* texte principal */
  --color-ink-2:       #A8AEB5;   /* texte secondaire */
  --color-ink-3:       #7A8089;   /* labels, méta, désactivé */

  /* Fond — échelle claire (pages auth uniquement, voir §1.7) */
  --color-paper:       #FAFAF8;
  --color-paper-2:     #F0F0EC;
  --color-paper-line:  #E2E2DC;
  --color-ink-3-paper: #646A73;   /* équivalent de --ink-3 sur fond clair */
  --color-err-paper:   #B02622;   /* équivalent de --err sur fond clair */

  /* Signaux fonctionnels — jamais décoratifs */
  --color-ok:          #3DD68C;
  --color-warn:        #F5A524;
  --color-err:         #FF5C5C;
}
```

**Discipline du jaune, non négociable :**

- Le `--volt` ne dépasse jamais **~8% de la surface d'un écran**. Il marque : le picto, le CTA primaire, l'état actif, le curseur de saisie, la barre de progression, un chiffre clé. Rien d'autre.
- Aucun aplat jaune plein larger qu'un bouton ou qu'une bande de 40px de haut.
- Aucun dégradé impliquant le `--volt`. Jamais. C'est une encre, pas une lumière.
- Aucun glow, aucune ombre portée colorée. La structure vient des filets `1px --line`, pas du flou.
- Deux surfaces `--volt` ne se touchent jamais dans un même bloc visuel.

## 1.4 Typographie

**Wordmark : Arial Bold Italic.** C'est la police du mark, et elle ne concerne QUE le mark.

Deux conséquences techniques à respecter :
- Le logo est fourni en SVG avec les lettres déjà vectorisées. **Le wordmark n'a donc besoin d'aucune police au runtime** — on affiche le SVG, jamais du texte stylé. C'est la seule façon de garantir un rendu identique partout.
- Si un wordmark en texte est malgré tout nécessaire quelque part (balise title, e-mail, fallback), la pile est `Arial, Helvetica, "Liberation Sans", sans-serif` en `font-weight: 700; font-style: italic`. Arial est une police système sous licence : elle ne se sert jamais en webfont depuis le serveur.

**L'interface, elle, n'utilise pas Arial.** Le système ci-dessous s'applique à tout le reste du produit.

```
Display  →  "General Sans" (Fontshare) — weights 600 / 700
            Alternative si indisponible : "Poppins" 700, "Satoshi" 700
            Usage : h1, h2, chiffres clés, wordmark de secours
            tracking -0.035em, leading 0.94

UI/Body  →  "Inter" variable — weights 400 / 500 / 600
            Usage : tout le texte courant, labels, boutons, formulaires
            leading 1.6, taille de base 15.5px

Mono     →  "JetBrains Mono" — weights 400 / 500
            Usage : code, prompts, noms de modèles, IDs, timestamps,
                    compteurs de tokens, chemins de fichiers
            tabular-nums TOUJOURS actif
            taille 13px, leading 1.55
```

**Échelle :**

```
h1     clamp(2.5rem, 6.5vw, 5.5rem)   display 700, tracking -0.04em, leading 0.92
h2     clamp(1.875rem, 4vw, 3.25rem)  display 600, tracking -0.03em
h3     clamp(1.25rem, 2.2vw, 1.75rem) display 600
body   15.5px                          Inter 400
small  13px                            Inter 400
label  10.5px  uppercase, tracking 0.2em, weight 600, --ink-3
mono   13px                            JetBrains Mono 400, tabular-nums
```

**Règle stricte :** l'oblique du wordmark **ne se propage jamais** au reste de la typographie. Aucun titre en italique, aucun texte incliné. L'inclinaison appartient au logo seul — c'est ce qui la garde signifiante.

## 1.5 Le système de marques manuelles

C'est l'élément qui empêche Yelhaa de ressembler à n'importe quel SaaS sombre. Le picto n'est pas un logo posé dans un coin : c'est le vocabulaire graphique du produit.

Construire un petit set de **marques SVG tracées main** dérivées de l'éclair — même irrégularité de contour, même trait de doublure décalé :

- **Le tick** — une coche rapide. États validés, étapes franchies, features incluses.
- **Le trait de soulignement** — un souligné à main levée sous un mot clé de titre. Maximum **une occurrence par page**.
- **Le chevron** — flèche de progression entre les étapes du parcours.
- **La barre** — un segment court pour les puces de liste et les séparateurs de méta.

**Règles d'emploi :**

- Toujours en `--volt`, jamais en gris.
- Stroke irrégulier — jamais un path parfaitement lisse. L'imperfection est le point.
- Maximum **trois marques manuelles visibles simultanément** dans un viewport.
- Elles s'animent en `stroke-dashoffset` sur 280ms, ease `cubic-bezier(0.2,0,0,1)` — dessinées rapidement, comme au marqueur.
- `aria-hidden` et `pointer-events-none` systématiquement.

## 1.6 Contraste — vérifications obligatoires

Le `--volt` est un jaune clair. Il **échoue** en texte sur fond clair et il faut le savoir avant de coder.

| Combinaison | Ratio mesuré | Verdict |
|---|---|---|
| `--volt` sur `--void` | 12,67:1 | ✅ tout usage, y compris texte courant |
| `--void` sur `--volt` | 12,67:1 | ✅ texte de bouton primaire |
| `--ink` sur `--surface` | 17,33:1 | ✅ |
| `--ink-2` sur `--void` | 8,91:1 | ✅ |
| `--ink-3` sur `--void` | 5,01:1 | ✅ à toute taille |
| `--ink-3` sur `--surface` | 4,75:1 | ✅ à toute taille |
| `--volt-deep` sur `--paper` | 5,04:1 | ✅ |
| `--volt-deep` sur `--paper-2` | 4,61:1 | ✅ |
| `--void` sur `--paper` | 19,07:1 | ✅ |
| `--void` sur `--volt-press` | 9,25:1 | ✅ état pressé du CTA |
| `--ink-3-paper` sur `--paper` | 5,22:1 | ✅ |
| `--ink-3-paper` sur `--paper-2` | 4,77:1 | ✅ |
| `--err-paper` sur `--paper` | 6,39:1 | ✅ |
| `--volt` sur `--paper` | 1,50:1 | ❌ **interdit en texte** — utiliser `--volt-deep` |
| `--ink-3` sur `--paper` | 3,81:1 | ❌ **interdit sur fond clair** — utiliser `--ink-3-paper` |
| `--err` sur `--paper` | 2,90:1 | ❌ **interdit sur fond clair** — utiliser `--err-paper` |

Ces valeurs sont mesurées au rendu, pas estimées. Toute modification d'un token de la palette impose de les remesurer.

**Il n'y a plus de plancher de taille sur `--ink-3`.** L'ancienne règle « jamais en dessous de 13px » compensait une valeur trop sombre ; le token tenant désormais 4,75:1 sur sa surface la plus claire, il s'utilise à 10,5px en `label` comme prévu au §1.4 et à 12px pour le copyright au §3.1. Ces trois sections sont maintenant cohérentes.

**Trois tokens ont un équivalent clair, et un seul rôle chacun :**

| Sombre | Clair | Usage |
|---|---|---|
| `--volt` | `--volt-deep` | texte et filets jaunes |
| `--ink-3` | `--ink-3-paper` | labels, méta, séparateurs |
| `--err` | `--err-paper` | messages d'erreur |

`--volt-deep` sert **au texte sur fond clair, et à rien d'autre**. Il n'est jamais un fond de bouton : c'est `--volt-press` qui porte l'état pressé du CTA sur fond sombre. Confondre les deux fait passer le bouton pressé sous le seuil.

Le picto, lui, reste `--volt` sur toute surface : c'est un élément graphique, pas du texte.

## 1.7 Mode sombre / clair

Yelhaa est **sombre par défaut**, sur toute l'application. Une seule exception :

Les écrans **Login / Sign Up** sont sur `--paper`. Raison : ce sont les seuls moments où l'utilisateur saisit des identifiants, et le passage au clair marque physiquement le changement de contexte — on quitte l'atelier, on franchit une porte. C'est aussi ce qui rend le retour au sombre, juste après, satisfaisant.

Le picto reste `--volt`. Le wordmark passe en `--void`. Aucun autre écran n'est clair.

## 1.8 Mouvement

L'argument produit de Yelhaa est la vitesse. Le mouvement doit le dire.

```
Durées      60–260ms. Rien au-dessus de 320ms, jamais.
Easing      cubic-bezier(0.2, 0, 0, 1)  — sortie sèche
            cubic-bezier(0.16, 1, 0.3, 1) — pour les entrées de panneau
Interdits   ressorts rebondissants, elastic, overshoot > 1.02,
            fondus longs, parallaxe, scroll pinné, curseur suiveur
```

**Trois moments signature, et rien d'autre :**

1. **Le trait de dessin** — les marques manuelles se dessinent en `stroke-dashoffset`.
2. **La coupe franche** — les changements d'état importants (modèle sélectionné, génération lancée) sont des coupes de 60ms, pas des fondus. La netteté est le message.
3. **Le glissement de panneau** — les panneaux de l'espace de travail entrent en `x` ou `y` sur 220ms, ease de sortie. Jamais de `scale`.

`prefers-reduced-motion` : les marques rendent leur état final, les coupes restent (elles n'ont pas de transition), les panneaux apparaissent sans glissement.

## 1.10 Le système de boutons

Trois variantes, et trois seulement.

**Primaire** — l'action principale de l'écran, une seule par vue.
```css
background: var(--color-volt);
color: var(--color-void);
border: none;
border-radius: 6px;
/* hover  */ background: var(--color-volt-hot);
/* active */ background: var(--color-volt-press);
```
Aucune ombre, aucun dégradé, aucun `ring`. Le jaune plein est l'emphase.

**Secondaire** — surface pleine, aucun verre :
```css
background: var(--color-surface);
border: 1px solid var(--color-line);
border-radius: 6px;
color: var(--color-ink);
/* hover */ background: var(--color-surface-2); border-color: var(--color-line-strong);
```
**Aucun `backdrop-filter` sur un bouton.** Le §2bis.3 plafonne le verre à deux surfaces sur la HOME — le bloc de nav et le champ YOUR IDEA — et un bouton en verre casserait cette limite. **Aucun filet de lumière non plus** : ce serait un dégradé dans un composant, ce que le §2 interdit sans exception. La règle « aucun dégradé dans l'interface » n'a qu'une seule dérogation, la pile de fond du §2bis, et elle ne s'étend à rien d'autre.

**Fantôme** — lien texte avec la barre manuelle en `--volt` au survol et au `focus-visible`. Pour tout le reste.

**Ce qui n'est pas fait, et pourquoi.** Le « liquid glass » de référence empile une dizaine d'`inset box-shadow` et applique `backdrop-filter: url(#svg-filter)` avec un `feDisplacementMap`. Deux problèmes : les ombres sont interdites par le §2, et surtout `backdrop-filter` avec un filtre SVG **n'est pas supporté hors Chromium** — Safari et Firefox rendraient un bouton plat, donc un site cassé pour une part importante des visiteurs. Le verre technique ci-dessus produit une arête de verre crédible avec des propriétés supportées partout.

Le `MetalButton` du même fichier est entièrement construit en dégradés et ombres : hors charte de bout en bout, non repris.

## 1.11 Le curseur

**Aucun curseur personnalisé. Le curseur natif partout.**

Le §1.8 interdit les curseurs suiveurs, et il a raison : ils ajoutent une boucle `rAF` permanente, ils décalent le point de clic perçu, et ils masquent régulièrement l'anneau de focus.

**L'effet de curseur existe déjà, et il est gratuit** : le champ plasma réagit au pointeur via son uniforme `u_cursor` en mode swirl, force 0.55, rayon 0.28. Bouger la souris tord le champ localement. C'est la seule réaction au pointeur du site, elle est portée par le shader, et elle ne coûte rien de plus.

Le curseur « tubes » de référence est écarté pour trois raisons cumulatives : import Three.js depuis un CDN externe à l'exécution, ce que la CSP du §9 bloque ; second contexte WebGL par-dessus le champ plasma ; couleurs aléatoires, contre la règle d'une seule couleur.

## 1.9 Grille et forme

```
Radius        4px sur les surfaces, 6px sur les inputs, 999px sur les pills.
              Aucune valeur intermédiaire. Aucun radius > 6px hors pills.
Bordures      1px --line partout. La structure vient des filets.
Ombres        AUCUNE. Pas une seule box-shadow dans tout le projet.
Flou          backdrop-blur uniquement sur la nav sticky et les overlays modaux.
              Nulle part ailleurs.
Grille        12 colonnes, gouttière 24px, max-width 1440px marketing,
              max-width 100% sur l'espace de travail.
Padding       px-5 mobile / px-8 desktop.
Rythme        py-20 mobile / py-28 desktop sur les sections marketing.
```

---

# PARTIE 2 — DIRECTION ARTISTIQUE : « CHARGED INK »

Le concept en une phrase : **un plan de travail noir, une seule encre électrique, une grille de filets, traversée par des marques rapides tracées à la main.**

Ce que ça n'est pas, et que le modèle génératif produira si on ne l'en empêche pas : un SaaS sombre avec des dégradés violets, des cartes en glassmorphism, des glows partout et des icônes dans des cercles dégradés. **Aucun de ces éléments n'existe dans Yelhaa.**

Les interdits qui définissent la marque en creux :

1. **Aucun dégradé dans l'interface.** Ni sur le texte, ni sur les bordures, ni sur les boutons, ni sur les cartes. La seule exception est la **pile de fond** décrite en §2bis — le champ plasma et son voile — qui vit strictement derrière tout le contenu et n'appartient à aucun composant.
2. **Aucune ombre portée.** Nulle part, aucune `box-shadow`. La profondeur vient de la valeur du fond et des filets.
3. **Aucun glow.** Le jaune est une encre imprimée, pas une LED. Aucune ombre colorée, aucun halo, aucun `ring` flou.
4. **Le `--volt` n'apparaît jamais dans le fond.** Ni dans le shader, ni dans le voile, ni dans la grille. Il vit exclusivement dans l'interface. C'est ce qui lui garde toute sa force.

---

# PARTIE 2BIS — LA PILE DE FOND

Le fond n'est pas une image : c'est une pile de quatre couches, dans cet ordre du plus profond au plus proche.

```
z-0   Champ plasma        canvas WebGL, monochrome sombre, animé
z-1   Voile               dégradé --void, garantit le contraste du texte
z-2   Grille technique    repeating-linear-gradient, 56px, --line à 30%
z-3   Grain               feTurbulence, opacity 0.05, mix-blend-overlay
z-10  Contenu
```

Les quatre couches sont `aria-hidden` et `pointer-events-none`. Seul le canvas écoute le pointeur, et uniquement pour l'effet de curseur.

## 2bis.1 — Le champ plasma

Un shader « Plasma » rendu dans un contexte WebGL1 nu, sans bibliothèque, sur un triangle plein écran.

**Palette du shader — monochrome, dérivée de la palette Yelhaa :**

```glsl
u_colors[0] = vec3(0.031, 0.035, 0.039);  // #08090A  --void
u_colors[1] = vec3(0.102, 0.118, 0.133);  // #1A1E22
u_colors[2] = vec3(0.165, 0.188, 0.212);  // #2A3036
u_colors[3] = vec3(0.239, 0.267, 0.298);  // #3D444C
```

**Réglages :**

```glsl
u_scene     = vec4(width, height, seconds * 0.34, 4.0)
u_shape     = vec4(1.50, 0.40, 0.50, 0.00)   // scale, intensity, paramA, warp
u_surface   = vec4(2.40, 0.92, -0.06, 0.00)  // detail, contrast, brightness, saturation
u_finish    = vec4(0.00, 0.68, 0.000, 0.16)  // hue, vignette, blur, grain
u_transform = vec4(7.0, 0.00, 0.28, 0.0)     // seed, rotation, drift, oklab
u_space     = vec4(0.0, 0.0, pointerX, pointerY)
u_cursor    = vec4(presence, 2.0, 0.55, 0.28) // swirl
```

**Quatre écarts délibérés par rapport aux réglages d'origine, chacun pour une raison :**

| Réglage | Origine | Yelhaa | Pourquoi |
|---|---|---|---|
| `saturation` | 0.50 | **0.00** | monochrome strict. Une seule couleur sur la page, et c'est le jaune de l'interface |
| `hue` | 3.04 (174°) | **0.00** | une rotation de teinte sur du gris ne produit rien, sauf du bruit numérique |
| `blur` | 0.016 | **0.000** | le flou 5-taps multiplie par cinq le coût par fragment. Invisible ici, cher partout |
| `speed` | 0.59 | **0.34** | le champ est derrière du texte à lire. Il respire, il ne bouge pas |

La vignette monte à 0.68 : elle assombrit les bords et c'est elle qui garantit la lisibilité de la navigation et du pied de page.

**Contraintes d'implémentation, non négociables :**

- `devicePixelRatio` plafonné à 2.
- Boucle `requestAnimationFrame` mise en pause sur `visibilitychange` **et** via `IntersectionObserver` quand le canvas quitte le viewport.
- Contexte perdu (`webglcontextlost`) : bascule immédiate sur le repli statique, sans saut de mise en page.
- `navigator.hardwareConcurrency < 4` : le canvas n'est jamais monté, repli statique directement.
- `prefers-reduced-motion` : une seule frame rendue puis la boucle s'arrête. Le champ est présent, figé. Ce n'est pas un fond vide.

**Le repli statique** est une composition CSS conçue, pas un fond noir : trois lavis radiaux en `--surface` et `--surface-2` à 18 % d'opacité, flou 300px, positions fixes, plus la vignette en `radial-gradient`. Un visiteur sans WebGL ne doit pas pouvoir deviner qu'il lui manque quelque chose.

**Où le shader vit :** sur la HOME uniquement. Aucune autre page ne le monte. Les écrans d'authentification restent sur `--paper`, les pages marketing et l'espace de travail restent sur `--void` uni avec la grille. Un shader plein écran sur chaque page coûterait cher pour un bénéfice nul.

## 2bis.2 — Le voile

Entre le shader et la grille, une couche qui garantit le contraste du texte quelle que soit la frame :

```css
background:
  radial-gradient(120% 90% at 50% 0%, transparent 0%, var(--void) 78%),
  linear-gradient(to bottom, rgba(8,9,10,0.55) 0%, rgba(8,9,10,0.82) 100%);
```

Sans ce voile, le contraste du texte dépend de ce que le shader affiche à l'instant T — c'est-à-dire qu'il n'est plus garanti. Le voile rend le pire cas mesurable.

**Vérification obligatoire :** mesurer `--ink` et `--ink-2` sur la frame la plus claire du shader, voile appliqué. Les deux doivent tenir 4,5:1. Si ce n'est pas le cas, on augmente l'opacité du voile — jamais on n'éclaircit le texte.

## 2bis.3 — Le verre technique

Le champ plasma donne enfin au verre quelque chose à brouiller. Le glass est donc autorisé, sous une forme précise :

```css
background: color-mix(in srgb, var(--color-surface) 60%, transparent);
backdrop-filter: blur(14px);
border: 1px solid var(--color-line);
border-radius: 6px;
```

**Pas de `saturate()`, pas de `ring`, pas d'ombre intérieure, pas de pilule.** Ce qui se voit, c'est la grille technique qui se brouille derrière le panneau et se redresse autour. Du verre technique, pas du verre décoratif.

**Deux surfaces au maximum par écran**, et sur la HOME ce sont :
1. le bloc de navigation
2. le conteneur du champ YOUR IDEA

Aucun autre élément ne reçoit de `backdrop-filter`. Pas les pills, pas les cartes, pas les boutons.

`@supports not (backdrop-filter: blur(1px))` : le fond passe à `--surface` opaque. Le contraste est préservé, seul l'effet est perdu.

---

# PARTIE 3 — SPÉCIFICATION ÉCRAN PAR ÉCRAN

> La structure des routes vient du README. Ce qui suit est le design de chacune.
> Routes : `/` (HOME + expérience PROMPT), `/pricing`, `/faq`, `/contact`, `/login`, `/signup`, et l'espace de travail multi-IA.

## 3.1 Shell global

**Navigation principale**

- Sticky en haut, hauteur 60px, `bg-[--void]/85 backdrop-blur-md`, `border-b 1px --line`.
- Gauche : le picto seul en 22px sur mobile, le lockup complet à partir de `md`. Lien vers `/`.
- Centre : HOME · PRICING · FAQ · CONTACT en `label` styling, **regroupés dans un unique conteneur** — `--surface`, `1px --line`, radius 6px, padding 4px. Les liens vivent à l'intérieur, séparés par rien. L'item actif porte un fond `--surface-2` sur toute sa cellule, pas un filet.
- Ce regroupement est une décision structurelle : la navigation forme un objet, pas une rangée de liens flottants. Il reste rectangulaire — jamais une pilule.
- Droite : **Log in** en lien texte, puis **Sign up** en bouton `--volt` avec texte `--void`, radius 999px, hauteur 34px, px-4.
- Au hover d'un lien : la couleur passe `--ink-2` → `--ink` sur 140ms, et une **barre manuelle** en `--volt` se dessine dessous en `stroke-dashoffset` sur 200ms.
- Mobile : bouton menu avec `aria-label`, ouvrant un panneau plein écran `--void`, liens en display 28px, entrées en coupes de 60ms décalées de 40ms. Scroll du body verrouillé, focus piégé, `Escape` ferme, focus rendu au déclencheur.
- **`ALL RIGHTS RESERVED` n'apparaît jamais dans la navigation.** Footer uniquement.

**Footer**

`bg-[--void]`, `border-t 1px --line`. Aucun dégradé, aucun flou, aucun rayon supérieur à 6px — la maquette d'origine ouvre sur un `radial-gradient` et un filet flouté, les deux sont exclus par le §2.

**Disposition en deux tiers**, plus lisible que quatre colonnes égales :

```
xl:   [ bloc marque — 1/3 ]  [ trois groupes de liens — 2/3 ]
md:   bloc marque au-dessus, puis 3 colonnes
sm:   tout empilé, 2 colonnes de liens
```

**Bloc marque** — le picto seul en 26px, puis une ligne de description en `--ink-2`, 14px, 40ch maximum. En bas du bloc, la ligne de copyright.

**Trois groupes de liens**, et uniquement des routes qui existent :

```
Product     Home · Pricing · FAQ
Company     Contact · Privacy Policy · Terms of Service
Account     Log in · Sign up
```

Aucune entrée Blog, Changelog, About, Help, Brand, Testimonials ou Integration : ces pages n'existent pas, et un lien mort dans un pied de page est le premier endroit où un visiteur perd confiance.

- Titre de groupe en `label` `--ink-3`.
- Liens en 14px `--ink-2`, hover et `focus-visible` vers `--ink` en 140ms, avec la **barre manuelle** en `--volt` qui se dessine dessous.

**Réseaux sociaux** — un quatrième groupe, en **texte et non en icônes** :

```
LinkedIn · Instagram · TikTok · Email
```

- Même traitement que les autres liens.
- Les URL viennent des constantes de `lib/config.ts`. **Une entrée sans URL n'est pas rendue du tout** : pas de lien mort, pas d'état grisé, pas de `href="#"`. Le groupe entier disparaît si les quatre sont vides, et le pied de page reste équilibré à trois groupes.
- Pas d'icônes `lucide-react` : la bibliothèque a retiré la plupart de ses icônes de marque, TikTok n'y figure pas, et ces imports cassent au moindre changement de version. Le texte ne casse jamais.

**Barre basse** — `border-t 1px --line`, texte en `--ink-3` 12px :

```
All rights reserved, Yelhaa AI, 2026.
```

Chaîne littérale, année fixe, décidée au §8 des décisions produit. Aucune adresse, aucune entité, aucune mention légale supplémentaire. Seule occurrence de cette ligne dans tout le site — elle n'apparaît jamais dans la navigation.

**Entrée au scroll** — les quatre blocs entrent en décalé, `opacity 0 → 1` et `y -6 → 0`, 220ms chacun, 70ms d'écart, déclenchés une seule fois à l'entrée dans le viewport.

- **En CSS pur, via `IntersectionObserver` posant une classe.** Pas de `motion`, pas de `framer-motion` : la bibliothèque n'est autorisée qu'à partir de la phase 7, sur `/prompt` et `/workspace`, et le paquet `motion` en serait une seconde.
- `animation-fill-mode: backwards` — l'état de repos est l'état final. Si l'animation ne tourne pas, tout est visible et bien placé.
- `prefers-reduced-motion` : aucun décalage, tout apparaît d'un coup.

## 3.2 `/` — HOME + expérience PROMPT

C'est la page qui porte tout le produit. Le champ de saisie est **visible sans scroll**, conformément au README §3.

### Bloc héros

- Hauteur : `min-h-[88vh]`, contenu centré horizontalement, aligné vers le haut (pas de centrage vertical parfait — le champ doit être haut dans l'écran).
- Fond : la **pile de fond complète du §2bis** — champ plasma, voile, grille technique à 30 % d'opacité, grain. La HOME est le seul écran qui monte le shader.
- **Aucun badge au-dessus du titre.** Le h1 ouvre l'écran directement. Cette absence est une décision — ne pas y ajouter de pill, d'annonce ou de baseline.
- **h1** : **« Your idea. Made real. »** — en deux lignes empilées (`Your idea.` / `Made real.`), en display 700, `clamp(2.5rem, 6.5vw, 5.5rem)`, `--ink`. Le mot **« real »** reçoit le **soulignement manuel** en `--volt`, dessiné en `stroke-dashoffset` sur 280ms, 400ms après le chargement de la page. C'est le seul moment décoratif de l'écran, et il souligne exactement le mot qui porte la promesse.
- Sous-titre : « Describe your idea. Yelhaa analyses it, structures it, and hands you a production-ready prompt — then opens it in an environment where multiple AIs build it with you. » en `--ink-2`, 17px, `max-w-2xl`. Le mot **prompt** est en `--ink` plutôt qu'en `--ink-2` — c'est le seul appui typographique de la phrase, et il ne reçoit ni marque manuelle ni couleur (le soulignement jaune appartient déjà au h1).

### Séquence d'entrée du héros

L'écran se construit en quatre temps, jamais tout en même temps. Chaque bloc entre en `opacity 0 → 1` et `y 16 → 0`, durée 320ms, ease `cubic-bezier(0.2,0,0,1)`, avec un décalage de 90ms entre les blocs :

```
0ms    h1 « Your idea. » / « Made real. »
90ms   le soulignement manuel sous « real » se dessine (280ms)
180ms  le sous-titre
270ms  le champ YOUR IDEA
360ms  la bande « Works with »
```

L'état de repos de chaque bloc est son état final (`animation-fill-mode: backwards`) : si le moteur d'animation ne tourne pas, tout est visible et correctement placé. `prefers-reduced-motion` supprime les décalages et les translations, tout apparaît d'un coup.

Aucune animation ne dépasse 320ms, et aucune ne se répète.

### Le champ YOUR IDEA — l'élément central du produit

C'est l'objet le plus important de tout le site. Il mérite le plus de soin.

- Conteneur : `--surface`, `1px --line`, `radius 6px`, `max-w-3xl`, largeur pleine du conteneur, padding 18px.
- Au focus : la bordure passe `--volt` en 120ms. **Aucun glow, aucun ring flou** — juste la bordure qui change de couleur. Un ring d'accessibilité `2px --volt offset 2px` reste présent pour la navigation clavier.
- Textarea : fond transparent, `--ink`, Inter 16px, `leading-1.6`, hauteur mini 3 lignes, auto-grow jusqu'à 10 lignes puis scroll interne.
- **Fondus de défilement** : deux bandes de 32px en haut et en bas de la zone de texte, en `mask-image` et non en dégradé peint. Leur opacité suit `scrollTop` et la distance au bas — elles n'apparaissent que quand il y a réellement du texte hors champ.
- **Le champ ne se replie jamais.** Il est ouvert et utilisable dès le chargement. Un état replié en pilule de 48px cacherait le produit, et le README §3 impose que le champ soit l'action principale visible sans scroll.
- Curseur de saisie : caret `--volt` (`caret-color`).
- **Placeholder statique.** Un seul texte fixe, en `--ink-3`, reading “Describe your idea…”. **Pas de placeholder tournant, pas d'exemples qui défilent** — c'est une décision, ne pas la réintroduire. Aucun `setInterval` sur ce champ.
- Barre inférieure du conteneur, séparée par un `1px --line` : à gauche un sélecteur de type de projet en pills `--surface-2` (l'actif passe en `--volt` avec texte `--void`) ; à droite le compteur de caractères en mono `--ink-3` et le bouton d'action.
- **Bouton GENERATE** : fond `--volt`, texte `--void`, weight 600, hauteur 38px, px-5, radius 6px. À droite du label, le **chevron manuel** en `--void`. Au hover : fond `--volt-hot`, le chevron se translate de 3px en x sur 140ms. Au `:active` : fond `--volt-press`. Désactivé tant que le champ est vide : `--surface-2` avec texte `--ink-3`, `aria-disabled`, curseur `not-allowed`.
- **Le bouton d'action est morphing** : deux glyphes superposés en `absolute`, un seul visible à la fois, transition croisée de 200ms sur `opacity` et `scale` — la flèche quand le champ contient du texte, un carré `stop` pendant la génération. Pas de rotation, pas de flou.
- **Ce qui n'existe pas dans ce champ** : pas de sélecteur de modèle (le README §5 interdit d'exposer un choix de modèle), pas de curseur d'effort, pas de pièces jointes (aucun upload en V1), pas de saisie vocale. Chacun ajouterait une promesse que le produit ne tient pas.
- Raccourci : `⌘/Ctrl + Enter` déclenche la génération. L'indication est affichée en mono `--ink-3` 11px sous le champ, à droite.

### Bande « Works with »

Sous le champ, séparée par un espace généreux, une **barre défilante** qui dit à l'utilisateur où coller ce qu'il va recevoir.

**Contenu — la liste complète :**

```
Claude Code · Cursor · Lovable · v0 · Bolt · Codex
ChatGPT · Claude · Gemini · Windsurf · Replit · GitHub Copilot
```

Douze entrées. Ce sont des outils qui consomment un prompt en texte pour produire une interface web — c'est le cas de tous ceux-là. La formulation « Works with » est un constat de compatibilité, pas une revendication de partenariat, et c'est la seule qui soit exacte.

**Forme :**

- Un `label` centré en `--ink-3` au-dessus : « WORKS WITH ».
- En dessous, une seule rangée qui défile de droite à gauche en continu. Les noms en `label` styling, `--ink-2`, séparés par un point `--volt` de 3px.
- Hauteur de bande 44px, séparée du champ par 72px au-dessus et 96px en dessous.

**Implémentation — marquee CSS, sans dépendance :**

- `transform: translateX(0 → -50%)`, 42s linéaire, boucle infinie. Nœud dupliqué, **mesuré au montage et au redimensionnement débouncé** pour que la boucle soit sans couture à toute largeur.
- **Pas d'Embla, pas de plugin auto-scroll.** Deux dépendances pour faire défiler douze mots contredisent le §5, qui demande le projet le plus léger de sa catégorie. Un marquee CSS suffit et coûte zéro kilo-octet.
- `will-change: transform`, mis en pause via `IntersectionObserver` hors écran.
- Pause au survol **et** au `focus-within`.
- `prefers-reduced-motion` : la bande se fige à un décalage conçu, tous les noms restant lisibles. Pas de défilement, pas de bande vide.

**Fondus de bord :**

- En `mask-image: linear-gradient(90deg, transparent, black 8%, black 92%, transparent)`, **pas** en dégradé peint par-dessus.
- La maquette d'origine superpose deux `bg-linear-to-r from-background` : ce sont des dégradés dans l'interface, ce que le §2 interdit. Un masque produit le même résultat sans peindre quoi que ce soit.

**Du texte, pas des logos.**

- Les logos de ces produits ne sont pas des fichiers que tu possèdes, chacun a ses propres règles de marque, et les afficher suggérerait une relation qui n'existe pas.
- Les noms en toutes lettres disent exactement la même chose, sans rien prétendre et sans requête réseau.
- La structure reste prête : la liste vient d'une constante unique dans `lib/config.ts`, sous la forme `{ name, logo?: string }`. Si un logo est un jour ajouté et autorisé, il remplace le texte de cette entrée sans toucher au composant.

**Accessibilité :**

- Le nœud dupliqué est `aria-hidden`. Le premier reste dans l'ordre de lecture.
- Aucun lien, aucun survol interactif, aucune animation au pointeur. C'est une information, pas une interaction.
- Sur mobile, le marquee est conservé — un `scroll-snap` manuel obligerait l'utilisateur à agir pour lire une information passive.

### Comment ça marche

- Trois étapes en ligne, séparées par le **chevron manuel** en `--volt` qui se dessine au scroll.
- Chaque étape : un numéro en mono `--volt`, un titre en display, une ligne de corps en `--ink-2`.
- Étapes : `YOUR IDEA` → `YOUR PROMPT` → `MULTI-AI ENVIRONMENT`. Ce sont les termes exacts du README, à ne pas reformuler.
- En dessous de `md` : disposition verticale, chevrons pivotés de 90deg.

### Capacités multi-IA

- Grille de 4 à 6 cartes `--surface` avec `1px --line`, radius 4px.
- Chaque carte : une icône lucide en 20px `--volt` (`strokeWidth 1.5`), un titre display 18px, deux lignes de corps `--ink-2`.
- Hover et `focus-within` : la bordure passe `--line-strong`, le fond `--surface-2`, sur 140ms. Aucun lift, aucune ombre, aucun scale.
- Le contenu doit rester dans les capacités listées au README §5 (agents coding, architecture, review, debug, test, documentation, recherche) sans inventer de fonctionnalités non fournies.

### Aperçu de l'environnement

- Un panneau `--surface` avec `1px --line`, précédé d'une barre de chrome type fenêtre : trois carrés de 8px en `--ink-3`, un titre en mono 12px.
- **CHEMIN STANDARD (par défaut) :** une maquette d'interface construite entièrement en CSS et state React — barre latérale de fichiers en mono, zone centrale avec un flux de messages, sélecteur de rôle en haut à droite, barre de statut en bas avec compteur de tokens en `tabular-nums`. Deux valeurs s'actualisent sur un intervalle de 4s, nettoyé au démontage.
- **CHEMIN CAPTURE (si des captures réelles existent) :** l'image dans le même cadre, ratio réservé avant chargement.
- Une légende en 12px `--ink-3` sous le panneau précise qu'il s'agit d'un aperçu, si les données affichées sont illustratives.

### CTA final

- Bande pleine largeur, `--surface`, `1px --line` haut et bas.
- Un titre display, un bouton `--volt`, et **le tick manuel** à gauche du titre.

## 3.3 Le parcours de génération

C'est le cœur fonctionnel décrit au README §3. Le design doit rendre la continuité **visible**.

**Après clic sur GENERATE :**

1. **Le champ se verrouille** — la bordure passe `--volt` fixe, le contenu devient non éditable, une barre de progression `2px --volt` apparaît en haut du conteneur et avance réellement selon l'état, jamais en boucle décorative.
2. **Si l'utilisateur est déjà connecté :** on enchaîne directement sur la génération. Aucun écran intermédiaire.
3. **Si l'utilisateur n'est pas connecté :** transition vers `/login` ou `/signup`. Un **bandeau persistant** en haut de l'écran d'auth, `--surface` avec `1px --volt` à gauche, affiche l'idée saisie tronquée à une ligne, précédée du **tick manuel**, avec un texte du type « ton idée est conservée ». Ce bandeau est la garantie visuelle de la règle critique du README §3.3.
4. **Après authentification :** retour automatique, l'idée est restaurée dans le champ, et la génération démarre sans nouvelle action.

**Écran de génération**

Plein écran, `--void`, la grille visible. Le champ plasma reste monté — c'est la même page.

**Barre de progression, pilotée par l'état réel du moteur.**

- Piste : 6px de haut, `--surface-2`, radius 999px, largeur `max-w-md`.
- Remplissage : **`--volt` plein**. Aucun dégradé, aucun `box-shadow` coloré, aucun reflet qui glisse. La barre de référence empile un dégradé bleu-cyan, deux halos et un `sheen` en `mix-blend-screen` : les trois sont interdits par le §2, et le jaune plein se lit mieux sur du noir.
- Transition de largeur : 280ms, ease `cubic-bezier(0.2,0,0,1)`.

**La règle qui compte : la barre ne ment jamais.**

- Elle est **entièrement contrôlée** par l'état serveur. Le mode « balayage automatique » du composant de référence est une barre décorative qui progresse toute seule — c'est un mensonge à l'utilisateur, et c'est exclu.
- Le moteur a trois étapes réellement observables depuis le navigateur : requête envoyée, appel d'injection en cours, validation et persistance. Les deux appels IA ne peuvent pas rapporter de progression interne sans streaming.
- La barre avance donc au seuil de l'étape atteinte **et s'y arrête**. Elle ne rampe pas, elle ne devine pas, elle n'atteint jamais 100 % avant que la réponse ne soit là.

```
0 %     Sending your idea
40 %    Building your prompt
100 %   Done
```

**Deux paliers, pas quatre.** `/api/generate` n'offre aujourd'hui que deux transitions observables depuis le navigateur : requête partie, réponse arrivée. Un palier intermédiaire à 70 % ne serait jamais atteint — donc il ne doit pas exister. Une barre qui affiche un état qu'elle n'atteint jamais est exactement le mensonge que cette section interdit.

Passer `/api/generate` en flux SSE permettrait des paliers plus fins. **Ce n'est pas fait maintenant** : le moteur n'a pas encore produit une seule génération réelle, et on ne réécrit pas son transport pour un gain cosmétique avant de l'avoir validé. À reconsidérer après la phase 6.

**Le label d'étape** change en **coupe de 60ms**, pas en fondu, et surtout pas avec l'entrée 3D lettre par lettre du composant de référence : elle dure 900ms, ce qui dépasse le budget de 320ms du §1.8, et elle attirerait l'attention sur l'attente plutôt que sur le résultat.

**Le picto** reste au-dessus de la barre, son tracé se dessinant en boucle sur 1,4s en `clip-path`. Il dit « ça travaille » ; la barre dit « où ça en est ».

**Accessibilité** : `role="progressbar"`, `aria-valuemin/max/now`, et `aria-valuetext` portant le pourcentage **et** le label. Le picto et le label visuel sont `aria-hidden` — la barre est le seul porteur de l'information.

**Aucune estimation de temps.** Si la durée n'est pas connue, elle ne s'affiche pas.

## 3.4 YOUR PROMPT

L'écran de résultat, décrit au README §4.

- Disposition en deux colonnes à partir de `lg`, empilées en dessous.
- **Colonne gauche — le prompt généré :** panneau `--surface`, `1px --line`, contenu en mono 13px `--ink`, `leading 1.6`, avec numéros de ligne en `--ink-3` dans une gouttière séparée par un `1px --line`. Barre supérieure du panneau : le nombre de tokens en mono `tabular-nums`, un bouton **Copier** (qui devient le tick manuel + « Copié » pendant 1,6s), et un bouton de téléchargement.
- **Colonne droite — le contexte :** l'idée originale de l'utilisateur dans un bloc `--surface-2` en italique `--ink-2` ; en dessous, les paramètres retenus en liste de définition avec filets `1px --line`.
- **Action principale, pleine largeur sous les deux colonnes :** `OPEN IN MULTI-AI ENVIRONMENT` en bouton `--volt`, texte `--void`, hauteur 46px. C'est le passage obligatoire vers l'étape suivante du parcours.
- Actions secondaires en liens texte : régénérer, affiner l'idée.

## 3.5 L'environnement de développement multi-IA

C'est l'écran le plus dense du produit. La densité **est** l'esthétique ici — on ne l'aère pas, on la structure.

**Ossature en trois colonnes**, séparées par des filets `1px --line`, chaque colonne redimensionnable :

**Gauche (240px) — contexte projet**
- Arborescence fichiers en mono 12.5px. Indentation 12px par niveau.
- Fichier actif : fond `--surface-2`, barre `2px --volt` collée au bord gauche.
- Fichier modifié par un agent : le **tick manuel** en `--volt` à droite du nom.
- En bas de colonne, séparé par un filet : la liste des conversations, la plus récente en haut, avec un timestamp mono relatif.

**Centre (flex-1) — conversation et travail**
- Messages en pleine largeur, séparés par des filets `1px --line`, sans bulles ni cartes. Le rôle est porté par un `label` en tête de message.
- Message utilisateur : label `--ink-3`, corps `--ink`.
- Message agent : label en `--volt`, précédé d'une pastille carrée de 6px identifiant le modèle, corps `--ink`.
- Blocs de code : fond `--surface`, `1px --line`, mono 13px, barre de titre avec le langage et un bouton copier. Coloration syntaxique en niveaux de gris **plus** le `--volt` réservé aux mots-clés uniquement. Pas de thème arc-en-ciel — ce serait la seule entorse au système monochrome et elle est interdite.
- Diffs : lignes ajoutées avec un fond `--ok` à 8% et un `+` en `--ok` ; lignes supprimées avec un fond `--err` à 8% et un `−` en `--err`. Le préfixe est toujours présent — la couleur n'est jamais le seul porteur d'information.
- Zone de saisie en bas, collée, `--surface`, `1px --line` en haut, même traitement de focus que le champ YOUR IDEA (bordure `--volt`, pas de glow).

**Droite (280px) — agents et modèles**
- **Le sélecteur de RÔLE est une exigence structurelle du README §5.** Il est visible en permanence, jamais caché derrière un menu. Le README interdit explicitement d'exposer un choix de fournisseur ou de modèle : un seul moteur, OpenAI, exécute tous les rôles.
- `role="radiogroup"` des sept rôles d'agents du README, alimenté par une constante `AGENT_ROLES` unique. Chaque entrée : nom du rôle, et un indicateur d'état. L'entrée active porte un `1px --volt` et un fond `--surface-2`.
- En dessous, séparé par un filet `1px --line` : une ligne **« Engine »** passive affichant le modèle réellement appelé, lu depuis la configuration serveur. C'est un affichage, jamais un contrôle — aucun clic, aucune alternative proposée. Un agent en cours d'exécution affiche une barre de progression `2px --volt`.
- Aucune liste de modèles à renseigner : la ligne « Engine » affiche le seul modèle configuré côté serveur.

**Barre supérieure de l'espace de travail (44px)**
- Gauche : le picto 18px, puis le nom du projet en mono.
- Centre : rien.
- Droite : les actions de **sortie** exigées par le README §6bis — export, synchronisation dépôt, publication — en boutons icône avec `aria-label`, séparés par un filet `1px --line`. Si le mécanisme n'est pas encore défini, les boutons sont présents et ouvrent un état « bientôt disponible » explicite, jamais silencieux.

**Barre inférieure (28px)**
- Mono 11px `--ink-3` : modèle actif, tokens consommés en `tabular-nums`, statut de connexion avec une pastille `--ok` / `--warn` / `--err` accompagnée d'un mot — jamais la couleur seule.

**Responsive de l'espace de travail :** en dessous de `lg`, les trois colonnes deviennent trois onglets en bas d'écran, cibles tactiles de 44px minimum. On ne compresse jamais les colonnes ; on les sépare.

## 3.6 `/pricing`

**Grille tarifaire arrêtée :**

| Plan | Prix | Générations / mois |
|---|---|---|
| Free | 0 $ | 3 |
| Pro | 4,99 $/mois | 150 |
| Agency | 17,99 $/mois | 500 |

Une génération = une exécution complète du moteur. Les étapes internes ne sont jamais comptées séparément.

### La décision structurante : tout est inclus partout

Les trois plans donnent accès **aux mêmes 35 directions artistiques, aux quatre domaines et à toutes les fonctions**. Ils ne diffèrent que sur le nombre de générations.

C'est une position, et elle doit être affichée comme telle plutôt que masquée. **Aucun tableau comparatif de fonctionnalités** : il n'aurait qu'une ligne qui change, et le remplir supposerait d'inventer des différences que le produit n'a pas.

Structure de la page, dans cet ordre :

```
1. Titre + sous-titre
2. Bloc « Everything is included »   ← avant les prix, pas après
3. Les trois colonnes
4. Ligne de transparence tarifaire
```

### Bloc « Everything is included »

- Placé **au-dessus** des colonnes. C'est l'argument, les prix ne sont que la conséquence.
- Titre en `type-h3` : « Every plan includes everything. »
- Sous-titre en `--ink-2` : « All 35 art directions, all four domains, every feature. Plans differ only in how many generations you get. »
- En dessous, une rangée de quatre éléments, chacun précédé d'un **carré `--volt` de 4px** — pas d'un tick. Le §7 règle 8 plafonne à trois marques manuelles par viewport : quatre ticks ici, plus ceux des colonnes, dépasseraient. Le tick manuel apparaît **une seule fois sur la page**, en tête du bloc.
- Sur `--surface` avec `1px --line`, radius 6px. Pas de verre — le verre technique est réservé à la HOME.

### Les trois colonnes

- Séparées par des filets `1px --line` verticaux. **Pas de cartes.** La séparation se fait par le filet seul. En dessous de `md` : une colonne, empilée, filets horizontaux.
- Par colonne, dans l'ordre :
    - nom du plan en `label`
    - **une ligne de description** en `--ink-3`, 13px — nouvelle par rapport à la version précédente :
        Free → « Try it out. No card required. »
        Pro → « For solo builders shipping regularly. »
        Agency → « For studios producing at volume. »
    - le prix en display `clamp(2.5rem, 5vw, 4rem)`, `tabular-nums`, la période en `--ink-3`
    - le quota en mono `tabular-nums` : « 150 generations / month »
    - **aucun tick dans les colonnes** : il n'y a rien à cocher ni à exclure, tout est inclus partout
    - un filet `1px --line`
    - le CTA
- Plan recommandé (Pro) : la colonne entière passe en `--surface` avec un `1px --volt` sur ses quatre côtés. **Aucun scale, aucune ombre, aucun badge flottant, aucune pilule « Most popular ».** L'inversion de surface est l'emphase, et elle suffit.
- CTA : `--volt` plein sur Pro et Agency, bordé `1px --line` sur Free.
- **Pas de bascule mensuel / annuel** : aucun tarif annuel n'existe.
- **Aucune croix pour les fonctions absentes** : il n'y en a pas. Là où la version d'origine met une `X` en `--ink-3`, Yelhaa ne met rien, parce qu'il n'y a rien à exclure.

### Ligne de transparence tarifaire

Sous la grille, en `--ink-2` 14px, quatre faits en une ou deux phrases :

- ce qui est décompté — une génération = une exécution complète du moteur ;
- la réinitialisation le 1er de chaque mois ;
- l'absence de report des générations non utilisées ;
- le blocage au dépassement, sans facturation supplémentaire.

Puis, en `--ink-3` 13px : les prix sont en USD et s'affichent dans la devise locale au paiement.

**Interdits sur cette page :**

- Aucune mention d'essai gratuit, de période d'essai ou de « no credit card required » ailleurs que sur la ligne du plan Free — il n'y a pas d'essai, il y a un plan gratuit permanent, et les deux ne se disent pas pareil.
- Aucun compte à rebours, aucune mention de rareté, aucune urgence.
- Aucune remise annoncée qui n'existe pas.

## 3.7 `/faq`

Fond : `--void` uni avec la grille technique. **Pas de shader** — il est réservé à la HOME. Pas de verre non plus.

### En-tête

- Disposition en deux colonnes à partir de `md`, alignées sur la ligne de base basse.
- Gauche : un `label` en `--ink-3` (« QUESTIONS »), puis un `type-h2`, puis une ligne de corps en `--ink-2` limitée à 66ch.
- Droite : rien. Pas de bascule de thème — Yelhaa est sombre, et les écrans d'authentification sont la seule exception, décidée au §1.7. Une bascule utilisateur casserait tout le système.

### Les items

Chaque question est un **objet séparé**, pas une ligne dans une liste bordée : `--surface`, `1px --line`, radius 6px, espacés de 10px. C'est ce qui donne le rythme de la maquette d'origine sans en reprendre la matière.

Composition d'un item, de gauche à droite :

- **L'icône plus/croix** — un carré de 34px, `1px --line`, radius 6px, contenant un `+` en `--volt` tracé en SVG à 1,5px. À l'ouverture, il **pivote de 45°** et devient une croix, sur 200ms. C'est plus clair qu'un chevron : le plus dit « ouvrir », la croix dit « fermer ».
- **La question** en `type-h3`, `--ink`.
- **Le tag de catégorie** en `label` `--ink-3`, aligné à droite sur `sm+`, dans un cadre `1px --line` radius 6px. Il vient de `faq_articles.category` — la colonne existe déjà en base et n'était pas exploitée.
- **La réponse** en `--ink-2`, 66ch maximum, révélée en dessous.

### Ouverture

- Un seul item ouvert à la fois. `aria-expanded` maintenu, `aria-controls` vers le panneau, panneau en `role="region"` avec `aria-labelledby`.
- Opérable au clavier : `Entrée` et `Espace` basculent, `Tab` circule normalement.
- **L'animation de hauteur se fait sur `height: auto`** — via `grid-template-rows: 0fr → 1fr`, ou en mesurant `scrollHeight`. **Jamais sur `max-height` avec une valeur fixe.** La maquette d'origine utilise `max-h-64`, ce qui tronque silencieusement toute réponse dépassant 256px : plusieurs de tes douze articles la dépassent. Ce serait un bug invisible en développement et visible en production.
- Durée 220ms, ease `cubic-bezier(0.2,0,0,1)`.

### Interaction

- Hover et `focus-within` : la bordure passe `--line-strong`, le fond `--surface-2`, en 140ms. **Aucun lift, aucune ombre, aucun halo suivant le curseur.**
- L'item ouvert garde `--surface-2` et sa bordure passe `--volt`.
- Anneau de focus : `2px --volt`, offset 2px, sur le bouton de chaque item.

### Contenu

Les douze articles rédigés au §10 du `yelhaa-build-prompt.md`, insérés en seed dans `faq_articles`, **en anglais** conformément au §1.0. Chaque question renvoie vers sa page dédiée `/faq/[slug]`.

Ne rien inventer au-delà de ces douze articles.

## 3.8 `/contact`

- Deux colonnes à partir de `lg`.
- Gauche : un titre display, un paragraphe, et les liens sociaux **en texte** — LinkedIn, Instagram, TikTok, Email — lus depuis `lib/config.ts`, même traitement qu'au §3.1. Pas d'icônes. Une entrée sans URL n'est pas rendue. Aucune adresse physique.
- Droite : le formulaire. Inputs `--surface-2`, `1px --line`, radius 6px, hauteur 42px. **Labels au-dessus des champs, jamais de placeholder servant de label.** Focus : bordure `--volt`, ring `2px --volt offset 2px`.
- Validation au blur, messages d'erreur en `--err` 13px sous le champ, reliés par `aria-describedby`, annoncés en `aria-live="polite"`.
- Case de consentement au traitement des données, décochée par défaut, distincte de toute case marketing. Le bouton d'envoi reste désactivé tant qu'elle n'est pas cochée.
- Pendant l'envoi : le bouton affiche « Envoi… » et est désactivé. Au succès : le formulaire est **remplacé** par un bloc de confirmation `--surface` portant le tick manuel et indiquant le délai de réponse réel. Jamais d'`alert()`.

## 3.9 `/login` et `/signup`

Les seuls écrans clairs du produit (§1.7).

- Fond `--paper`, colonne centrée `max-w-md`.
- Le picto `--volt` en 32px au-dessus du titre. Le wordmark, si présent, en `--void`.
- **Si l'utilisateur arrive depuis le parcours de génération :** le bandeau de conservation de l'idée est affiché en haut, `--paper-2` avec `1px --volt-deep` à gauche, portant le tick manuel et l'idée tronquée. C'est l'élément le plus important de cet écran.
- La colonne est structurée comme une carte : picto en tête, titre en `type-h2`, une ligne de description en `--ink-3`, puis les actions. Entrée en `opacity 0 → 1` et `y 12 → 0`, 320ms — **pas de `scale`**, ni à l'entrée ni au survol.
- **OAuth en premier** (exigence README §3.3) : boutons pleine largeur, `--paper`, `1px --paper-line`, radius 6px, hauteur 44px, logo du fournisseur à gauche, libellé centré. **Google en premier, Apple en second**, puis le séparateur et le formulaire e-mail / mot de passe.
- **Les logos Google et Apple sont des SVG inline** dans `components/ui/provider-icons.tsx`, un `path` monochrome chacun en `currentColor`. Cela supprime le besoin de `public/providers/` et le risque de rupture des icônes de marque de `lucide-react`. Aucun autre fournisseur : GitHub n'est pas configuré, et un bouton vers un fournisseur inexistant est un lien mort.
- **Pas de bouton « Skip for now ».** La génération exige un compte : proposer de passer l'étape mènerait à une impasse.
- Sous la carte, une ligne en `--ink-3` 13px renvoyant vers les conditions d'utilisation et la politique de confidentialité, en liens réels vers `/legal/terms` et `/legal/privacy`.
- Séparateur : un filet `1px --paper-line` avec un « ou » centré en `--ink-3` sur fond `--paper`.
- Formulaire email / mot de passe : inputs `--paper-2`, `1px --paper-line`, focus bordure `--volt-deep`. **Le nombre de champs à l'inscription est réduit au strict minimum** — email et mot de passe, rien d'autre.
- Bouton principal : fond `--void`, texte `--paper`. Sur fond clair, le noir prime sur le jaune pour le contraste.
- Bascule login / signup en lien texte sous le formulaire, préservant l'idée en cours.
- Erreurs d'authentification en langage clair, jamais de code technique.

---

# PARTIE 4 — ÉTATS ET CAS LIMITES (obligatoires)

- **Chargement :** blocs `--surface` aux dimensions finales exactes avec une barre `--volt` balayant horizontalement sur 1s. **Jamais de spinner circulaire.** Le seul loader du produit est le picto qui se dessine.
- **Vide :** panneau `--surface` avec `1px --line`, une marque manuelle en `--volt`, une ligne d'explication en `--ink-2`, une action unique.
- **Erreur :** carte `--surface` avec un `2px --err` à gauche, message en langage clair, bouton de réessai. **Aucun code d'erreur affiché** — on les journalise.
- **Génération échouée :** l'idée de l'utilisateur est **toujours conservée** et reste éditable. Un message explique ce qui a échoué et propose de relancer. Perdre l'idée à ce moment est un échec produit critique.
- **Quota atteint :** état explicite indiquant le quota réel, ce qui reste, et quand il se réinitialise. Un lien vers `/pricing`, sans langage de pression.
- **Hors ligne / API indisponible :** bandeau `--warn` persistant en haut, et la saisie reste possible — l'idée est mise en file d'attente localement plutôt que perdue.
- **Formulaires :** labels visibles au-dessus, validation au blur, `aria-describedby`, `aria-live="polite"`, soumission désactivée pendant l'envoi, succès remplaçant le formulaire.
- **Modales et panneaux :** focus piégé, `Escape` ferme, focus rendu au déclencheur, `aria-modal="true"`.
- **Tous les `setInterval` et boucles `rAF` nettoyés au démontage.** Aucun timer fuyant.
- **`/404` et `/500`** dans le même système, avec la navigation intacte et le picto présent.

---

# PARTIE 5 — PERFORMANCE

- Trois familles de polices maximum, chargées via `next/font` avec `display: swap` et `size-adjust`. Ne précharger que le poids display utilisé au-dessus de la ligne de flottaison.
- Aucune bibliothèque de scroll fluide. Aucun scroll pinné. Aucune parallaxe. Le scroll natif est correct pour ce produit.
- Aucune ombre, aucun dégradé, un seul `backdrop-blur` sur la nav — ce projet doit être parmi les plus légers de sa catégorie, et c'est un argument produit cohérent avec la promesse de vitesse.
- La grille technique est un `repeating-linear-gradient` CSS, jamais une image.
- Les marques manuelles sont des SVG inline, jamais des requêtes réseau.
- Animations en `transform` et `opacity` uniquement. Jamais `width`, `height`, `top` ou `left`.
- Le panneau d'aperçu de l'environnement pause ses intervalles via `IntersectionObserver` hors écran et sur `visibilitychange`.
- Images en `next/image` avec `sizes` et conteneurs à ratio explicite.
- **Cibles :** LCP < 1,8s · CLS < 0,03 · INP < 170ms.

---

# PARTIE 6 — ACCESSIBILITÉ

- HTML sémantique : `<header>`, `<nav>`, `<main>`, `<section aria-label>`, `<footer>`. Un seul `<h1>` par page.
- Anneaux de focus : `2px --volt`, `offset 2px`, sur **tout** élément interactif. Jamais `outline: none` sans remplacement.
- Tout état déclenché au hover se déclenche aussi au `focus-visible`.
- La couleur n'est jamais le seul porteur d'information : les statuts ont un mot, les diffs ont un préfixe, les items sélectionnés ont un libellé.
- Le `--volt` en texte est interdit sur fond clair — `--volt-deep` uniquement (§1.6).
- Grille technique, marques manuelles et éléments décoratifs : `aria-hidden` et `pointer-events-none`.
- Le champ YOUR IDEA porte un `aria-label` explicite et stable ; le placeholder n'est jamais le seul porteur de son intitulé.
- Le sélecteur de rôle est un `role="radiogroup"` avec des noms accessibles portant le rôle et son état. La ligne « Engine » n'est pas un contrôle et n'est pas focusable.
- L'arborescence de fichiers est un `role="tree"` avec navigation aux flèches.
- Le picto-loader est `aria-hidden` ; l'état de chargement est annoncé dans une région `aria-live="polite"`.
- Contraste vérifié à la taille de rendu réelle, pas en théorie. Tous les couples du §1.6 tiennent AA à toute taille — aucun plancher de taille n'est nécessaire.

---

# PARTIE 7 — RÈGLES STRICTES

1. `TypeScript` strict. Aucun `any`, aucune assertion non nulle.
2. **Aucun dégradé, aucune ombre portée, aucun glow.** Nulle part, sous aucun prétexte.
3. Le `--volt` ne dépasse jamais ~8% de la surface d'un écran.
4. Aucun radius supérieur à 6px, hors pills à 999px.
5. Rien ne dépasse 320ms. Aucun ressort rebondissant, aucun overshoot au-delà de 1.02.
6. Le picto ne se redessine, ne se recolore et ne se déforme jamais.
7. L'oblique appartient au logo seul. Aucun autre élément typographique n'est incliné.
8. Maximum trois marques manuelles visibles simultanément par viewport.
9. Le seul loader du produit est le picto qui se dessine. Aucun spinner circulaire.
10. Tout chiffre variable utilise `tabular-nums`. Aucun tremblement de largeur.
11. **Ne rien inventer :** ni prix, ni quotas, ni fonctionnalités, ni FAQ, ni chiffres, ni noms de modèles, ni URL, ni adresse. Une valeur non fournie reste vide et visible — mieux vaut un trou assumé qu'une invention.
12. `ALL RIGHTS RESERVED` uniquement dans le footer.
13. Le parcours `YOUR IDEA → GENERATE → AUTH (si besoin) → GENERATION → YOUR PROMPT → MULTI-AI` n'est jamais rompu, et l'idée n'est jamais perdue.
14. Entièrement conçu à 375px — pas simplement empilé. L'espace de travail devient trois onglets, jamais trois colonnes compressées.

---

# PARTIE 8 — CE QUE TU DOIS REMPLIR AVANT DE LANCER

Seules deux valeurs restent à renseigner, et aucune ne bloque le build :

| # | Élément | Où |
|---|---|---|
| 1 | Liste des modèles IA affichés dans le sélecteur | §3.5 |
| 2 | Les 4 URL sociales | §3.8 — renseignées dans le code après génération |

**Tranchés :** h1, sous-titre, absence de badge, placeholder statique sans exemples, police du wordmark (Arial Bold Italic), pricing (3 plans), footer, quotas et réinitialisation, export (copie + téléchargement, pas de publication).

Ces deux points ne bloquent pas le build : la structure existe, il suffit de renseigner les valeurs.

---

**FIN DU PROMPT DESIGN — YELHAA**
