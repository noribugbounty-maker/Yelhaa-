# YELHAA — PROMPT DE RENOUVEAU UI (v3 « CHARGED GLASS »)

> **Nature de ce document.** C'est un prompt d'exécution destiné à Claude Code, écrit après relecture
> intégrale de `README.txt`, `yelhaa-design-prompt.md`, `yelhaa-build-prompt.md` et `yelhaa-decisions.md`.
> Il **remplace la couche visuelle** de `yelhaa-design-prompt.md` là où les deux se contredisent, et
> **laisse intact tout le reste** : structure produit, parcours, architecture technique, contenus, tarifs,
> quotas, textes tranchés.
>
> **Ordre de priorité révisé :**
> ```
> 1. Demandes explicites de l'utilisateur
> 2. README.txt — structure produit (parcours, routes, règles non négociables)
> 3. yelhaa-decisions.md — décisions produit
> 4. yelhaa-build-prompt.md — architecture technique
> 5. CE FICHIER — couche visuelle v3
> 6. yelhaa-design-prompt.md — couche visuelle v2, historique (voir §0.2)
> ```

---

## 0. CE QUI CHANGE, CE QUI NE CHANGE PAS

### 0.1 Ce qui ne change pas — à ne réinterpréter sous aucun prétexte

| Domaine | État |
|---|---|
| **UX et parcours** | `YOUR IDEA → GENERATE → AUTH (si besoin) → GENERATION → YOUR PROMPT → MULTI-AI` — inchangé, jamais rompu, l'idée n'est jamais perdue |
| **Palette** | Les 20 tokens du §1.3 de la v2, valeurs exactes, aucun ajout de teinte, aucune couleur nouvelle |
| **Discipline du jaune** | `--volt` ≤ ~8 % de la surface d'un écran, jamais dans le fond, jamais en dégradé, jamais en glow |
| **Logo** | Picto SVG intouchable, wordmark Arial Bold Italic vectorisé, règles d'usage du §1.2 |
| **Typographie** | Inter (UI/body), JetBrains Mono (données) — **inchangés**. Seule exception : le h1 de la HOME (§3) |
| **Échelle typo, contrastes** | Tableaux §1.4 et §1.6 de la v2, y compris les couples interdits sur fond clair |
| **Mode sombre/clair** | Sombre partout, `--paper` sur `/login` et `/signup` uniquement |
| **Contenus** | h1 « Your idea. Made real. », sous-titre, absence de badge, placeholder statique, footer, prix, quotas, 12 articles FAQ |
| **Backend** | Schéma, RLS, pipeline de génération, prompts système, Stripe, quotas, sécurité — **rien n'est modifié fonctionnellement** ; §7 ne traite que la couche présentation |
| **Règle absolue** | **Ne rien inventer** : ni prix, ni quotas, ni fonctionnalité, ni chiffre, ni nom de modèle, ni URL, ni adresse, ni logo partenaire |

### 0.2 Ce qui change — les sept renversements

| # | v2 (`yelhaa-design-prompt.md`) | v3 (ce fichier) |
|---|---|---|
| 1 | « Aucune carte en glassmorphism » ; verre plafonné à 2 surfaces sur la HOME | **Le glassmorphism est le système visuel principal**, sur tout le produit, sous les contraintes du §2 |
| 2 | Grille technique `repeating-linear-gradient` 56px en couche z-2 du fond | **Interdiction absolue de toute grille dans le fond.** Couche supprimée partout |
| 3 | « La structure vient des filets 1px » | La structure vient de **l'arête de verre** : filet + hairline interne + différentiel de flou |
| 4 | Aucune ombre, nulle part, sans exception | Ombres portées toujours interdites. **Une seule dérogation** : le hairline `inset` du verre (§2.2) |
| 5 | Composants maison au cas par cas | **shadcn/ui** comme socle de composants, via `components.json` déjà présent |
| 6 | « 35 directions artistiques », « les quatre domaines » affichés dans l'UI | **Aucun chiffre, aucune énumération de domaines dans l'UI** (§6) |
| 7 | 12 FAQ affichées avec question + réponse dans l'accordéon | **Section FAQ de la HOME : questions seules** (§5.6). Les réponses restent sur `/faq/[slug]`, contenu inchangé |

### 0.3 Interdits qui survivent au changement de style

Le glassmorphism amène habituellement une liste de tics. Aucun n'entre ici :

1. **Aucun dégradé coloré.** Le verre est un `color-mix` d'un token gris existant, pas un dégradé arc-en-ciel.
2. **Aucune ombre portée** — pas de `box-shadow` extérieure. Le hairline `inset` du §2.2 est la seule dérogation, et elle est monochrome.
3. **Aucun glow, aucun halo, aucun `ring` flou.** Le jaune est une encre, pas une LED.
4. **Le `--volt` n'apparaît jamais dans une surface de verre en aplat.** Il reste un liseré, un caret, un état actif.
5. **Aucune bordure en dégradé animé** (le « glow border » qui tourne). Aucune.
6. **Aucun `saturate()` dans le `backdrop-filter`.** Le produit est monochrome ; saturer inventerait de la couleur.
7. **Aucune grille**, ni dans le fond, ni derrière le verre, ni en filigrane sur une carte.
8. **Aucun logo tiers.** Les noms des outils restent en texte (bande « Works with »).
9. **Aucune parallaxe, aucun scroll pinné, aucun curseur suiveur, aucun spinner circulaire.**
10. **Aucun chiffre de catalogue affiché** (nombre de templates, nombre de domaines).

---

## 1. OUTILLAGE OBLIGATOIRE — MCP

Ces trois serveurs sont connectés et **doivent** être utilisés. Ne pas coder de mémoire.

| MCP | Usage imposé | À quel moment |
|---|---|---|
| **shadcn** | Installer et inspecter chaque primitive utilisée. Ne jamais réécrire à la main un composant que le registre fournit | Avant d'écrire un composant : chercher dans le registre, puis installer, puis restyler avec les tokens Yelhaa |
| **21st.dev** | Chercher des références d'implémentation de surfaces en verre, de nav flottantes, d'accordéons, de sélecteurs — **comme référence, jamais en copier-coller** | Au moment de dessiner un composant signature (nav, champ YOUR IDEA, sélecteur de template, FAQ) |
| **context7** | Vérifier l'API réelle de Next.js 15, Tailwind v4, Radix, shadcn, Supabase avant tout appel non trivial | Systématiquement, avant d'utiliser une API dont la signature n'est pas certaine |

**Règle de retraitement :** tout composant venant de shadcn ou inspiré de 21st passe par le filtre §0.3
avant d'entrer dans le projet. Un composant qui arrive avec une `box-shadow`, un dégradé, un `ring` flou
ou un radius > 6px se fait retirer ces propriétés — on garde la logique et l'accessibilité, on jette le style.

**shadcn — configuration :** `components.json` existe déjà à la racine. Le vérifier avant tout : style
`new-york`, alias `@/components`, `cssVariables: true`, `baseColor` neutre. Les variables shadcn
(`--background`, `--foreground`, `--card`, `--border`, `--ring`, `--radius`…) sont **mappées sur les tokens
Yelhaa** dans `globals.css` — on ne crée pas un second système de couleurs à côté du premier.

```css
/* Mapping shadcn → Yelhaa, dans @theme / :root */
--background:  var(--color-void);
--foreground:  var(--color-ink);
--card:        var(--color-surface);
--muted:       var(--color-surface-2);
--muted-foreground: var(--color-ink-3);
--border:      var(--color-line);
--input:       var(--color-line);
--ring:        var(--color-volt);
--primary:     var(--color-volt);
--primary-foreground: var(--color-void);
--destructive: var(--color-err);
--radius:      6px;
```

---

## 2. LE SYSTÈME DE VERRE — « CHARGED GLASS »

Le concept en une phrase : **un plan de travail noir traversé d'un champ lumineux sombre, sur lequel
flottent des panneaux de verre dépoli aux arêtes nettes, et une seule encre électrique.**

Le verre n'est pas une décoration posée sur des cartes : c'est **la matière de toute l'interface**.

### 2.1 Les trois niveaux de verre

Trois recettes, et trois seulement. Aucune valeur intermédiaire improvisée.

```css
/* --- Niveau 1 — GLASS-CHROME : nav, barres d'outils, overlays, en-têtes collants --- */
.glass-chrome {
  background: color-mix(in srgb, var(--color-void) 62%, transparent);
  backdrop-filter: blur(20px);
  border: 1px solid color-mix(in srgb, var(--color-line-strong) 70%, transparent);
  border-radius: 6px;
}

/* --- Niveau 2 — GLASS-PANEL : cartes, panneaux, items FAQ, colonnes pricing --- */
.glass-panel {
  background: color-mix(in srgb, var(--color-surface) 55%, transparent);
  backdrop-filter: blur(14px);
  border: 1px solid var(--color-line);
  border-radius: 6px;
}

/* --- Niveau 3 — GLASS-INSET : inputs, textarea, pills, cellules internes --- */
.glass-inset {
  background: color-mix(in srgb, var(--color-surface-2) 48%, transparent);
  backdrop-filter: blur(8px);
  border: 1px solid var(--color-line);
  border-radius: 6px;
}
```

**Un panneau de verre ne contient jamais un panneau de verre de même niveau.** Un `glass-panel` peut
contenir un `glass-inset`. Deux `glass-panel` imbriqués donnent une bouillie opaque : c'est interdit.

**Profondeur maximale : deux niveaux de verre superposés.** Au-delà, la surface intérieure passe en
`--surface` opaque.

### 2.2 L'arête de verre — la seule dérogation à l'interdiction des ombres

Ce qui distingue une vraie surface de verre d'un rectangle translucide, c'est l'arête. Une seule ligne,
`inset`, monochrome, non floue :

```css
box-shadow: inset 0 1px 0 0 color-mix(in srgb, var(--color-ink) 8%, transparent);
```

**Contraintes :**
- `inset` uniquement. Aucune ombre extérieure n'est jamais autorisée.
- Une seule déclaration par élément. Jamais d'empilement de plusieurs `inset`.
- Toujours monochrome, dérivée de `--ink`. Jamais de `--volt` dans une arête.
- Opacité ≤ 10 %. Au-delà, ça devient un liseré et ça se voit comme un bug.

Cette dérogation est **explicite, limitée et documentée**. Elle ne rouvre pas la porte aux ombres portées :
la règle 2 de la PARTIE 7 de la v2 reste vraie pour tout le reste du projet.

### 2.3 Le repli, non négociable

```css
@supports not (backdrop-filter: blur(1px)) {
  .glass-chrome { background: var(--color-void); }
  .glass-panel  { background: var(--color-surface); }
  .glass-inset  { background: var(--color-surface-2); }
}
```

Le contraste est identique dans les deux cas. Seul l'effet est perdu, jamais la lisibilité.

**Vérification obligatoire :** mesurer `--ink` et `--ink-2` **sur la frame la plus claire du fond animé,
verre appliqué**. Les deux tiennent 4,5:1 ou on augmente l'opacité de la surface de verre — on
n'éclaircit jamais le texte, on ne baisse jamais le seuil.

### 2.4 Coût et plafonds

`backdrop-filter` est cher. Il se plafonne :

- **Maximum 6 surfaces de verre simultanément visibles dans un viewport.** Au-delà, les surfaces
  secondaires passent en `--surface` opaque avec le même filet.
- Aucune surface de verre n'est **animée en position** pendant qu'elle floute. Un panneau qui glisse
  perd son `backdrop-filter` le temps du mouvement et le retrouve à l'arrivée.
- Aucun verre à l'intérieur d'une liste virtualisée ou d'un conteneur défilant à contenu long.
- `will-change` n'est jamais posé sur une surface de verre.
- Sur `navigator.hardwareConcurrency < 4` : le verre passe en opaque sur tout le site, en même temps
  que le repli du champ de fond.

---

## 3. TYPOGRAPHIE — LE SEUL CHANGEMENT

**Inter et JetBrains Mono ne bougent pas. General Sans reste la police display pour tous les h2, h3 et
chiffres clés du produit.**

Une seule exception, et elle ne concerne qu'un seul élément dans tout le site :

```
h1 de la HOME  →  "Bricolage Grotesque" (Google Fonts, variable)
                  weight 700-800, optical size max
                  tracking -0.045em, leading 0.88
                  Alternative si indisponible : "Clash Display" 700 (Fontshare),
                  puis General Sans 700 (repli existant)
```

**Pourquoi celle-là :** grotesque contemporaine à contreformes fermées et à coupes franches, elle partage
la densité du wordmark sans en emprunter l'oblique. Elle donne à « Your idea. Made real. » une présence
que General Sans, plus neutre, ne produit pas — tout en restant dans la même famille de sensations.

**Contraintes :**
- Chargée via `next/font/google`, `display: 'swap'`, `size-adjust`, **préchargée** (elle est au-dessus de
  la ligne de flottaison). Un seul axe de poids exposé.
- **Elle ne sert nulle part ailleurs.** Pas sur les h2, pas sur les autres pages, pas sur les h1 de
  `/pricing`, `/faq`, `/contact`. Un seul usage dans tout le produit, c'est ce qui le rend signifiant.
- Le total reste à **trois familles chargées par page** : la HOME charge Bricolage + Inter + Mono ;
  les autres pages chargent General Sans + Inter + Mono.
- **Aucune italique, aucun texte incliné.** L'oblique appartient au logo seul (règle 7, PARTIE 7).
- L'échelle du h1 reste `clamp(2.5rem, 6.5vw, 5.5rem)`.

---

## 4. LA PILE DE FOND — SANS GRILLE

**Règle non négociable : aucune grille, nulle part, dans aucun fond.** Ni `repeating-linear-gradient`, ni
image, ni SVG de grille, ni pointillés en quinconce, ni filigrane technique. La couche z-2 de la v2 est
**supprimée du projet**.

Nouvelle pile, trois couches :

```
z-0   Champ plasma        canvas WebGL, monochrome sombre, animé  (réglages v2 §2bis.1 inchangés)
z-1   Voile               dégradé --void, garantit le contraste     (v2 §2bis.2 inchangé)
z-2   Grain               feTurbulence, opacity 0.05, mix-blend-overlay
z-10  Contenu
```

Toutes les couches restent `aria-hidden` et `pointer-events-none`. Seul le canvas écoute le pointeur.

**Conséquence directe et voulue :** sans grille, le verre n'a plus de trame à briser — il floute
désormais **le champ plasma lui-même**. Le mouvement lent du champ derrière un panneau devient l'effet.
C'est plus juste : la grille et le verre se disputaient la même fonction structurelle.

**Où le champ vit — élargi par rapport à la v2 :**

| Écran | Fond |
|---|---|
| `/` HOME | Champ plasma + voile + grain — pile complète |
| `/pricing`, `/faq`, `/faq/[slug]`, `/contact`, `/account`, légales | **Repli statique** du §2bis.1 (trois lavis radiaux `--surface`/`--surface-2` à 18 %, flou 300px, vignette) + grain. Pas de canvas. Le verre a de quoi flouter, et le coût est nul |
| `/generate`, `/prompt/[id]` | Champ plasma (même page que la HOME dans le parcours) |
| `/workspace/[id]` | `--void` uni + grain. Pas de champ, pas de lavis : l'espace de travail est dense, le fond s'efface |
| `/login`, `/signup` | `--paper`, avec un équivalent clair du repli statique : trois lavis `--paper-2` très faibles. Le verre y devient un verre clair (§9) |

Les contraintes d'implémentation du champ plasma (DPR ≤ 2, pause `visibilitychange` +
`IntersectionObserver`, gestion de `webglcontextlost`, `hardwareConcurrency < 4`,
`prefers-reduced-motion` → une seule frame) sont **reprises telles quelles**.

---

## 5. ÉCRAN PAR ÉCRAN — CE QUI EST RETRAVAILLÉ

### 5.1 Shell global

**Navigation** — c'est le composant signature du renouveau.

- **Flottante**, pas collée au bord : `position: sticky`, `top: 12px`, largeur contenue, centrée,
  détachée des bords de l'écran. Elle a l'air posée sur la page, pas soudée dedans.
- Recette `glass-chrome` + arête `inset` du §2.2. Radius **6px** — elle reste rectangulaire, jamais une
  pilule (décision structurelle conservée de la v2).
- Gauche : picto 22px sur mobile, lockup complet à partir de `md`.
- Centre : HOME · PRICING · FAQ · CONTACT en `label`, dans le même objet de verre. L'item actif porte un
  `glass-inset` sur sa cellule entière.
- Droite : **Log in** en lien texte, **Sign up** en bouton `--volt` plein, texte `--void`, radius 999px, h34.
- Au hover d'un lien : `--ink-2 → --ink` sur 140ms + la **barre manuelle** `--volt` qui se dessine dessous.
- Au scroll > 24px : l'opacité de fond du verre monte de 62 % à 78 % sur 160ms. Rien d'autre ne change —
  pas de rétrécissement, pas de changement de hauteur, aucun `layout shift`.
- Mobile : panneau plein écran en `glass-chrome` à 88 %, focus piégé, `Escape` ferme, scroll verrouillé.
- **`ALL RIGHTS RESERVED` n'apparaît jamais dans la nav.** Footer uniquement.

**Footer** — structure et contenus de la v2 §3.1 **inchangés** (deux tiers, trois groupes de liens réels,
réseaux sociaux en texte lus depuis `lib/config.ts`, barre basse `All rights reserved, Yelhaa AI, 2026.`).
Seul le traitement change : le bloc marque passe en `glass-panel`, les groupes de liens restent sur le fond.

### 5.2 HOME — bloc héros

- `min-h-[88vh]`, contenu centré horizontalement, aligné vers le haut. Le champ reste **visible sans scroll**.
- Fond : pile complète du §4. **Aucune grille.**
- **Aucun badge au-dessus du h1.** Décision conservée.
- **h1** « Your idea. Made real. » en deux lignes empilées, **Bricolage Grotesque 700-800** (§3), `--ink`.
  Le mot **« real »** garde son **soulignement manuel** `--volt`, `stroke-dashoffset` sur 280ms, 400ms
  après chargement. C'est le seul moment décoratif de l'écran.
- Sous-titre : texte tranché de la v2 §3.2, `--ink-2`, 17px, `max-w-2xl`, le mot *prompt* en `--ink`.
- Séquence d'entrée en quatre temps (0 / 90 / 180 / 270 / 360ms), `animation-fill-mode: backwards`,
  `prefers-reduced-motion` supprime décalages et translations. Inchangée.

### 5.3 Le champ YOUR IDEA

L'objet le plus important du site. Il devient la **pièce de verre maîtresse**.

- Conteneur : `glass-panel` + arête `inset`, `max-w-3xl`, padding 18px, radius 6px.
- Au focus **du textarea** : la bordure du conteneur passe `--volt` en 120ms, et **l'opacité du verre monte
  à 70 %** sur la même durée — le panneau se solidifie quand on écrit dedans. Aucun glow, aucun ring flou.
  Le ring d'accessibilité `2px --volt offset 2px` reste présent au clavier.
- Textarea : fond transparent, `--ink`, Inter 16px, `leading 1.6`, 3 lignes mini, auto-grow jusqu'à 10 puis
  scroll interne. Fondus de défilement en `mask-image`, opacité pilotée par `scrollTop`.
- **Le champ ne se replie jamais.** Ouvert et utilisable au chargement.
- Caret `--volt`. **Placeholder statique** « Describe your idea… » en `--ink-3`. Aucun placeholder tournant,
  aucun `setInterval`.
- Barre inférieure, séparée par `1px --line` : à gauche le sélecteur de type de projet en pills
  `glass-inset` (l'actif passe `--volt` plein, texte `--void`) ; à droite le compteur en mono `--ink-3` et
  le bouton d'action.
- **Bouton GENERATE** : `--volt` plein, texte `--void`, weight 600, h38, px-5, radius 6px, **chevron manuel**
  `--void` à droite. Hover `--volt-hot`, chevron +3px en x sur 140ms. Active `--volt-press`. Désactivé quand
  vide : `glass-inset` avec texte `--ink-3`, `aria-disabled`, curseur `not-allowed`.
  **Aucun `backdrop-filter` sur un bouton** — un bouton est un objet plein, pas une fenêtre.
- Bouton morphing (flèche ↔ carré stop) en transition croisée 200ms sur `opacity` et `scale`. Inchangé.
- **Ce qui n'existe pas :** pas de sélecteur de modèle, pas de curseur d'effort, pas de pièces jointes,
  pas de saisie vocale.
- `⌘/Ctrl + Enter` déclenche. Indication en mono `--ink-3` 11px sous le champ, à droite.

### 5.4 Bande « Works with »

Contenu, forme et implémentation de la v2 §3.2 **inchangés** : douze noms **en texte**, marquee CSS sans
dépendance, nœud dupliqué mesuré au montage et au resize débouncé, `mask-image` sur les bords, pause au
hover / `focus-within` / hors écran, `prefers-reduced-motion` fige à un décalage conçu.

Un seul ajustement : la bande est posée sur le fond, **pas sur du verre**. Une surface de verre pleine
largeur derrière du texte défilant coûterait cher pour rien.

### 5.5 Sélection de template — le nouvel écran clé de l'UX

L'UX reste exactement celle décidée : l'IA analyse l'idée, la restructure, **sélectionne** une template en
fonction du design et du domaine, **et l'utilisateur peut changer ce choix**. La template retenue reçoit
ensuite l'injection des infos, palette et typographie de l'utilisateur.

Ce que le renouveau apporte, c'est **la forme** de ce moment :

- Un panneau `glass-panel` présente la **template retenue** : son nom de direction artistique, son résumé
  en une phrase, et sa palette en pastilles. Un `label` `--ink-3` au-dessus dit ce que c'est.
- Sous ce panneau, une action secondaire en lien texte : **« Choose a different template »**.
- Au clic, un sélecteur s'ouvre — `Dialog` shadcn restylé en `glass-chrome`, focus piégé, `Escape` ferme,
  focus rendu au déclencheur.
- Dans le sélecteur : un champ de recherche `glass-inset`, des filtres en pills `glass-inset`, et une
  grille de vignettes `glass-panel`. Chaque vignette : nom de la D/A, résumé, palette en pastilles,
  état sélectionné porté par un `1px --volt` **et** un libellé — jamais la couleur seule.
- Le catalogue est **paginé ou défilant virtualisé**, jamais rendu en entier d'un coup.
- La sélection manuelle rejoue l'injection sur la même idée, sans reclassification et **sans consommer de
  quota supplémentaire** — c'est le même travail de génération, pas un nouveau.

**Formulation dans l'UI — règle stricte :** l'interface ne donne **jamais de chiffre** ni d'énumération
fermée. Pas de « 35 templates », pas de « 4 domaines », pas de liste des domaines actuels. Le catalogue
grandit ; toute valeur écrite en dur deviendrait fausse.

```
Autorisé   « Pick from the full template library. »
           « Browse every art direction. »
           « Yelhaa picked this one. You can change it. »
Interdit   « 35 art directions »  ·  « all four domains »
           « SaaS, Product, Finance, Agency »  ·  tout compteur
```

Si un compteur est réellement souhaité un jour, il est **lu depuis la base**, jamais écrit dans le code.

### 5.6 Section FAQ de la HOME — questions seules

**Nouvelle exigence :** sur la HOME, la section FAQ affiche **les questions, et rien d'autre**.

- Chaque question est un item `glass-panel` séparé, espacés de 10px, radius 6px.
- Composition : le carré 34px `glass-inset` contenant un `+` `--volt` tracé en SVG 1,5px ; la question en
  `type-h3` `--ink` ; le tag de catégorie en `label` `--ink-3` dans un cadre `1px --line` à droite sur `sm+`.
- **Aucune réponse n'est rendue dans cette section.** Pas d'accordéon, pas de panneau qui se déplie.
  Chaque item est un **lien direct vers `/faq/[slug]`**, où la réponse vit déjà.
- Le `+` ne pivote plus : il se translate de 3px en x au hover, comme un chevron d'entrée. Un `+` qui ne
  déplie rien serait un mensonge d'affordance.
- Hover et `focus-within` : bordure `--line-strong`, opacité du verre +8 points, sur 140ms. Aucun lift,
  aucune ombre, aucun halo suivant le curseur.
- Sous la liste, un lien texte vers `/faq`.
- Le contenu des questions vient de `faq_articles`, **inchangé**. Ne rien réécrire, ne rien inventer,
  ne pas ajouter de treizième question.

Sur `/faq` et `/faq/[slug]`, les réponses restent affichées comme prévu au v2 §3.7 et au build prompt §10,
avec l'animation de hauteur en `grid-template-rows: 0fr → 1fr` — **jamais `max-height` fixe**.

### 5.7 Comment ça marche · Capacités multi-IA · Aperçu · CTA final

- **Comment ça marche** : trois étapes `YOUR IDEA` → `YOUR PROMPT` → `MULTI-AI ENVIRONMENT` (termes exacts
  du README), séparées par le **chevron manuel** `--volt` qui se dessine au scroll. Chaque étape sur
  `glass-panel`. Sous `md` : vertical, chevrons pivotés de 90deg.
- **Capacités multi-IA** : grille de cartes `glass-panel`, icône lucide 20px `--volt` `strokeWidth 1.5`,
  titre display 18px, deux lignes `--ink-2`. Hover : bordure `--line-strong`, opacité +8. Aucun lift,
  aucun scale, aucune ombre. Contenu limité aux capacités listées au README §5.
- **Aperçu de l'environnement** : panneau `glass-panel` avec barre de chrome (trois carrés 8px `--ink-3`,
  titre mono 12px). Chemin standard = maquette en CSS + state React, deux valeurs qui s'actualisent sur un
  intervalle de 4s nettoyé au démontage, `IntersectionObserver` pour la pause. Légende 12px `--ink-3`
  précisant que les données sont illustratives.
- **CTA final** : bande pleine largeur `glass-panel` à faible opacité, filet haut et bas, un titre display,
  un bouton `--volt`, le **tick manuel** à gauche du titre.

### 5.8 `/generate` et `/prompt/[id]`

- **Barre de progression** : piste `glass-inset` 6px, radius 999px, `max-w-md`. Remplissage **`--volt` plein**.
  Aucun dégradé, aucun reflet qui glisse, aucun balayage décoratif.
- **La barre ne ment jamais.** Deux paliers réellement observables : `0 % Sending your idea` →
  `40 % Building your prompt` → `100 % Done`. Elle ne rampe pas, ne devine pas, n'atteint jamais 100 %
  avant la réponse. Règle conservée intégralement.
- Label d'étape en **coupe de 60ms**, jamais en fondu, jamais lettre par lettre.
- Le **picto** au-dessus, tracé en boucle sur 1,4s en `clip-path`. Seul loader du produit.
- `role="progressbar"`, `aria-valuemin/max/now`, `aria-valuetext` portant pourcentage **et** label ; picto et
  label visuel `aria-hidden`. **Aucune estimation de temps.**
- `/prompt/[id]` : deux colonnes à partir de `lg`. Gauche = le prompt en mono 13px dans un `glass-panel`,
  numéros de ligne `--ink-3` en gouttière, barre supérieure avec tokens en `tabular-nums`, bouton **Copier**
  (devient tick manuel + « Copié » 1,6s) et téléchargement. Droite = l'idée d'origine dans un `glass-inset`,
  puis les paramètres retenus, puis le **panneau de template du §5.5**. Action principale pleine largeur :
  `OPEN IN MULTI-AI ENVIRONMENT`, `--volt` plein, h46.
- Les **suggestions** issues du tableau `missing` de l'appel #1 restent affichées comme prévu au build
  prompt §4bis. Le JSON brut de classification n'est jamais montré.

### 5.9 `/workspace/[id]`

La densité est l'esthétique. **Le verre y est rationné** : trois surfaces maximum, jamais plus.

- Ossature trois colonnes (240 / flex-1 / 280), redimensionnables, séparées par `1px --line`.
- **Verre autorisé sur : la barre supérieure (44px), la barre inférieure (28px), et la zone de saisie
  collée en bas du centre.** Tout le reste est opaque — arborescence, messages, colonne de droite.
- Fichier actif : `--surface-2`, barre `2px --volt` au bord gauche. Fichier modifié par un agent : **tick
  manuel** `--volt` à droite du nom.
- Messages en pleine largeur, séparés par des filets, **sans bulles ni cartes**. Rôle porté par un `label`.
- Blocs de code : `--surface` opaque, `1px --line`, mono 13px. Coloration en niveaux de gris **plus**
  `--volt` réservé aux mots-clés. Aucun thème arc-en-ciel.
- Diffs : `+` en `--ok` sur fond `--ok` 8 %, `−` en `--err` sur fond `--err` 8 %. **Le préfixe est toujours
  présent** — la couleur n'est jamais seule porteuse.
- Colonne droite : `role="radiogroup"` des sept rôles d'agents, alimenté par la constante `AGENT_ROLES`
  unique. Ligne **« Engine »** passive, non focusable, affichant le modèle lu depuis la configuration
  serveur. **Aucun choix de fournisseur ou de modèle exposé** (README §5).
- Barre supérieure droite : export, synchronisation dépôt, publication — boutons icône avec `aria-label`.
  Si le mécanisme n'existe pas encore, l'état « bientôt disponible » est explicite, jamais silencieux.
- Barre inférieure : mono 11px `--ink-3`, modèle actif, tokens en `tabular-nums`, statut avec pastille
  `--ok`/`--warn`/`--err` **accompagnée d'un mot**.
- Sous `lg` : trois onglets en bas d'écran, cibles ≥ 44px. On sépare, on ne compresse jamais.

### 5.10 `/pricing`

Structure, prix, quotas et textes **inchangés** — Free 0 $ / 3, Pro 4,99 $ / 150, Agency 17,99 $ / 500.
Ordre de page conservé : titre → bloc « Everything is included » → trois colonnes → transparence tarifaire.

Deux changements seulement :

1. **Les colonnes deviennent des `glass-panel`.** La v2 imposait « pas de cartes, séparation par filet
   vertical seul » ; le verre rend la carte lisible sans l'alourdir. La colonne recommandée (Pro) porte un
   `1px --volt` sur ses quatre côtés et une opacité de verre supérieure de 10 points. **Aucun scale,
   aucune ombre, aucun badge flottant, aucune pilule « Most popular ».**
2. **Le bloc « Everything is included » ne cite plus de chiffre.** Le sous-titre devient :
   « Every art direction, every domain, every feature. Plans differ only in how many generations you get. »
   Aucun « 35 », aucun « four ».

Le reste tient : quatre éléments précédés d'un **carré `--volt` de 4px** (pas d'un tick), un seul tick
manuel sur la page, aucun tableau comparatif, aucune croix, aucune bascule mensuel/annuel, aucun langage
de rareté, aucun essai gratuit annoncé.

### 5.11 `/contact` et `/account`

- `/contact` : deux colonnes à partir de `lg`. Gauche = titre display, paragraphe, liens sociaux **en texte**
  lus depuis `lib/config.ts` (une entrée sans URL n'est pas rendue). Droite = formulaire dans un
  `glass-panel`, inputs `glass-inset` h42. **Labels au-dessus des champs**, jamais de placeholder-label.
  Focus : bordure `--volt` + ring `2px --volt offset 2px`. Validation au blur, erreurs `--err` 13px sous le
  champ, `aria-describedby`, `aria-live="polite"`. Case de consentement décochée par défaut, distincte de
  toute case marketing, bouton désactivé tant qu'elle n'est pas cochée. Au succès, le formulaire est
  **remplacé** par un bloc de confirmation portant le tick manuel. Jamais d'`alert()`.
- `/account` : plan, usage, historique, accès Customer Portal — dans des `glass-panel`. Le compteur d'usage
  en `tabular-nums`. **L'action de suppression du compte et des données existe réellement** (décisions §6),
  isolée en bas de page, séparée visuellement et spatialement des actions normales, en `--err`, avec
  dialogue de confirmation.

---

## 6. RÈGLE DE CONTENU — LE CATALOGUE N'A PAS DE CHIFFRE

Applicable partout : HOME, `/pricing`, FAQ, sélecteur de template, métadonnées, textes marketing.

- **Jamais de nombre de templates.** Ni 35, ni « plus de 35 », ni aucune valeur.
- **Jamais d'énumération des domaines.** Ni « quatre domaines », ni la liste des domaines actuels.
- Le langage reste **qualitatif et vrai** : « the full library », « every art direction », « every domain ».
- Les seuls chiffres affichés dans le produit sont ceux qui sont tranchés et stables : **prix, quotas,
  compteurs de tokens, compteurs d'usage**. Rien d'autre.
- Cette règle est une **application** de la règle « ne rien inventer », pas une exception : un chiffre écrit
  en dur qui deviendra faux demain est une invention à retardement.

---

## 7. BACK-END — CE QUI EST RETRAVAILLÉ, ET CE QUI NE L'EST PAS

**Aucun comportement fonctionnel ne change.** Le pipeline `/api/generate`, les deux prompts système, la
sélection SQL, la validation de sortie, la persistance, les quotas, Stripe, les RLS, les en-têtes de
sécurité : tous **conservés à l'identique**. Ce qui suit ne concerne que la **couche de présentation du
back-end** et son alignement sur le renouveau.

1. **Sélection de template exposée.** Le corps de réponse de `/api/generate` renvoie déjà
   `template: { title, art_direction }`. Il porte en plus, pour alimenter le §5.5 : le `slug`, le `summary`,
   la palette du template si elle est stockée, et un booléen indiquant que le choix est modifiable.
   Aucune nouvelle table, aucun nouveau champ inventé — uniquement des colonnes qui existent déjà dans
   `prompt_templates`.
2. **Route de re-sélection.** Un endpoint permet de rejouer l'injection sur la même génération avec un
   `template_id` choisi par l'utilisateur. Il **ne consomme pas de quota** — c'est la même génération.
   Il réutilise les `extracted_vars` déjà persistées : **aucune reclassification, aucun second appel #1.**
3. **Listing du catalogue.** Une route de lecture paginée sur `prompt_templates` (`is_active = true`),
   filtrable par domaine et par tag, servant le sélecteur. Lecture publique conforme aux RLS existantes.
   **Elle ne renvoie jamais de total figé dans le code** : si un compteur est nécessaire, il vient du
   `count` de la requête.
4. **États d'erreur alignés.** Chaque code d'erreur du pipeline (401, 402, 400, 429, 5xx) a un état d'UI
   correspondant décrit en PARTIE 4 de la v2 — chargement, vide, erreur, quota atteint, hors ligne.
   **Aucun code d'erreur n'est affiché à l'utilisateur** ; ils sont journalisés côté serveur.
5. **Aucun secret ne bouge.** Règle absolue du build prompt §0 maintenue : rien en dur, `.env.example` avec
   des valeurs vides, relecture finale à la recherche de `sk-`, `pk_`, `whsec_`, JWT, URL avec identifiants.
   **Vérifier `.env.example` en premier** — des valeurs réelles y ont déjà atterri par le passé.

---

## 8. MOUVEMENT

Le budget de la v2 §1.8 est **conservé sans assouplissement** :

```
Durées      60–260ms. Rien au-dessus de 320ms, jamais.
Easing      cubic-bezier(0.2, 0, 0, 1)     — sortie sèche
            cubic-bezier(0.16, 1, 0.3, 1)  — entrées de panneau
Interdits   ressorts rebondissants, elastic, overshoot > 1.02, fondus longs,
            parallaxe, scroll pinné, curseur suiveur
```

Trois moments signature, et rien d'autre : **le trait de dessin** (marques manuelles en `stroke-dashoffset`),
**la coupe franche** (60ms sur les changements d'état importants), **le glissement de panneau** (220ms en
`x` ou `y`, jamais en `scale`).

Le verre ajoute **une seule transition, et une seule** : la variation d'opacité de la surface au focus et
au hover, 140ms. **Le `backdrop-filter` lui-même ne s'anime jamais** — animer un flou est le moyen le plus
sûr de faire tomber une page à 20 fps.

`prefers-reduced-motion` : les marques rendent leur état final, les coupes restent, les panneaux
apparaissent sans glissement, le champ plasma rend une frame et s'arrête.

---

## 9. `/login` et `/signup` — le verre clair

Seuls écrans clairs du produit. Le renouveau y applique la même matière, transposée :

```css
.glass-panel-light {
  background: color-mix(in srgb, var(--color-paper) 62%, transparent);
  backdrop-filter: blur(14px);
  border: 1px solid var(--color-paper-line);
  border-radius: 6px;
  box-shadow: inset 0 1px 0 0 color-mix(in srgb, #FFFFFF 55%, transparent);
}
```

Tout le reste est conservé : picto `--volt` 32px, wordmark `--void`, **bandeau de conservation de l'idée**
en haut avec le tick manuel et l'idée tronquée (élément le plus important de l'écran), **OAuth en premier**
— Google puis Apple, logos en SVG inline dans `components/ui/provider-icons.tsx` — puis séparateur et
formulaire email/mot de passe réduit au strict minimum. Bouton principal `--void` sur texte `--paper`.
Pas de « Skip for now ». `--volt` interdit en texte sur fond clair : `--volt-deep` uniquement.

---

## 10. ACCESSIBILITÉ — RENFORCÉE PAR LE VERRE

Tout le §6 de la v2 s'applique, plus quatre points propres au verre :

1. **Le contraste se mesure verre appliqué, sur la frame la plus claire du fond.** Pas en théorie, pas sur
   le token seul. Si `--ink-2` ne tient pas 4,5:1 dans le pire cas, on opacifie le verre.
2. **La bordure de chaque surface de verre reste visible dans tous les états.** Un panneau dont l'arête
   disparaît devient un panneau invisible pour qui a une vision faible.
3. **L'anneau de focus `2px --volt offset 2px` n'est jamais posé sur une surface floutée** — il vit au-dessus,
   sur un élément non flouté, sinon il se noie.
4. `prefers-reduced-transparency` : **le verre passe en opaque**, exactement comme le repli `@supports`.
   Même règle, même code, même résultat.

Le reste tient sans changement : HTML sémantique, un seul `<h1>` par page, tout hover doublé en
`focus-visible`, la couleur jamais seule porteuse d'information, décoratif en `aria-hidden` +
`pointer-events-none`, `aria-label` stable sur le champ YOUR IDEA, `role="tree"` sur l'arborescence,
`role="radiogroup"` sur les rôles d'agents, loader annoncé en `aria-live="polite"`.

---

## 11. PERFORMANCE

- Trois familles de polices maximum **par page**, `next/font`, `display: swap`, `size-adjust`.
- **`backdrop-filter` plafonné à 6 surfaces visibles simultanément** (§2.4). C'est le nouveau poste de coût
  principal du projet : il se surveille comme la grille se surveillait avant.
- Aucune bibliothèque de scroll fluide, aucun scroll pinné, aucune parallaxe.
- **Aucune grille** : la couche `repeating-linear-gradient` disparaît, autant de peinture en moins.
- Marques manuelles en SVG inline, jamais de requête réseau.
- Animations en `transform` et `opacity` uniquement. Jamais `width`, `height`, `top`, `left`, ni `filter`.
- Tous les `setInterval` et boucles `rAF` nettoyés au démontage.
- Images en `next/image` avec `sizes` et conteneurs à ratio explicite.
- **Cibles inchangées : LCP < 1,8s · CLS < 0,03 · INP < 170ms.** Si le verre les fait tomber, c'est le verre
  qui recule, pas la cible.

---

## 12. CRITÈRES D'ACCEPTATION DU RENOUVEAU

Le renouveau UI est terminé quand **tous** ces points sont vrais, en plus des critères du build prompt §12 :

- [ ] `components.json` est configuré et les primitives shadcn utilisées sont réellement installées via le MCP shadcn.
- [ ] Les MCP context7 et 21st ont été consultés pour les composants signature ; aucune API n'a été écrite de mémoire.
- [ ] **Aucune grille nulle part** : zéro `repeating-linear-gradient`, zéro image de grille, zéro trame de fond.
- [ ] Les trois recettes de verre du §2.1 existent en un seul endroit et sont les seules utilisées.
- [ ] Aucune `box-shadow` dans le projet, sauf le hairline `inset` du §2.2 — vérifiable par recherche texte.
- [ ] Aucun dégradé coloré, aucun glow, aucun `ring` flou, aucun `saturate()` dans un `backdrop-filter`.
- [ ] Le repli `@supports not (backdrop-filter)` et `prefers-reduced-transparency` rendent la même UI opaque, lisible.
- [ ] Maximum 6 surfaces de verre par viewport ; l'espace de travail n'en a que 3.
- [ ] Le h1 de la HOME utilise la police display moderne ; **elle n'apparaît nulle part ailleurs**.
- [ ] Inter, JetBrains Mono et General Sans sont inchangés dans leurs rôles respectifs.
- [ ] Palette strictement identique : aucun token ajouté, retiré ou modifié.
- [ ] `--volt` ≤ ~8 % de surface sur chaque écran, absent du fond, jamais en dégradé.
- [ ] La section FAQ de la HOME affiche **les questions seules**, chacune liant vers `/faq/[slug]`.
- [ ] Aucun chiffre de catalogue ni énumération de domaines dans l'UI (§6).
- [ ] Le sélecteur de template existe, est ouvrable, et la re-sélection ne consomme pas de quota.
- [ ] Contraste `--ink` et `--ink-2` mesuré ≥ 4,5:1 **verre appliqué, frame la plus claire du fond**.
- [ ] Anneau de focus `2px --volt offset 2px` sur tout élément interactif, jamais posé sur une surface floutée.
- [ ] Aucune animation > 320ms ; le `backdrop-filter` n'est jamais animé.
- [ ] LCP < 1,8s · CLS < 0,03 · INP < 170ms, mesurés après l'ajout du verre.
- [ ] Entièrement utilisable à 375px, espace de travail en trois onglets.
- [ ] TypeScript strict, aucun `any`, build sans erreur ni avertissement.
- [ ] Aucun secret, aucune donnée de test, aucun lien mort, aucun placeholder non résolu.
- [ ] **Rien d'inventé** : aucun prix, quota, fonctionnalité, chiffre, nom de modèle, URL ou adresse absent des sources.

---

**FIN DU PROMPT DE RENOUVEAU UI — YELHAA v3 « CHARGED GLASS »**
