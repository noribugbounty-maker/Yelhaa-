# Audit SSR / hydratation — yelhaa.info

**Date** 2026-09-12 · Chromium headless 1440×900, onglet visible, `PLAYWRIGHT_BROWSERS_PATH` = installation claude-seo

## Verdict

**L'hypothèse d'un contenu qui ne s'injecterait jamais dans le DOM est infirmée.** Le streaming React se résout correctement. Les observations qui avaient conduit à ce soupçon lors de l'audit du 2026-09-11 étaient des artefacts d'instrumentation.

---

## [PREUVE] — HTML serveur : `<main>` ne contient que le fallback

`curl` sur `https://yelhaa.info/`, réponse 48 168 octets :

```
<main class="flex-1"><!--$?--><template id="B:1"></template>
<div role="status" aria-live="polite" class="mx-auto flex min-h-[60dvh] ...">
  ...<span class="sr-only">Loading…</span></div><!--/$--></main>
```
Bloc `<main>…</main>` = **952 octets, 1 mot de texte**.

Offsets dans le HTML brut :
```
<main            7887      </main>   8832
<div hidden id="S:1"  12066
<h1                   12773   -> DANS S:1 : True   DANS <main> : False
$RC("B:1","S:1")      32814
$RC("B:2","S:2")      32874
$RC("B:0","S:0")      34878
```

**[CAUSE]** Comportement nominal du streaming SSR de React 19 / Next.js 15 App Router : la coquille est envoyée d'abord avec la frontière Suspense en attente (`<!--$?-->`), le contenu suit dans `<div hidden id="S:n">`, et les scripts `$RC(...)` le replacent. **Les trois appels `$RC` sont présents dans la réponse serveur** — le serveur envoie donc des instructions complètes.

---

## [PREUVE] — DOM final : relocalisation effectuée

Sonde Playwright, onglet visible, après `networkidle` :

```json
{
  "mainInnerTextLen": 2623,
  "mainStillHasSpinner": false,
  "bodyInnerTextLen": 2890,
  "hiddenDivs": 1,
  "templatesLeft": 0,
  "h1Text": "Turn ideas into better prompts.",
  "h1Opacity": "1",
  "h1Rect": { "w": 689, "h": 182 },
  "RC": "function",
  "docReadyState": "complete",
  "visibility": "visible"
}
```

Diff serveur ↔ DOM final :

| | HTML serveur | DOM final |
|---|---|---|
| `<main>` interne | 924 o | **25 333 o** |
| Texte dans `<main>` | 1 mot | **416 mots** |
| `div[hidden]` | 4 | **1** |
| `template id="B:…"` | 3 | **0** |
| `<!--$?-->` (en attente) | 3 | **0** |
| `<!--$-->` (résolu) | 0 | **3** |
| `<h1>` dans `<main>` | non | **oui** |

**[CAUSE]** Les trois frontières Suspense passent de l'état « en attente » à « résolu », les trois templates sont consommés, le `<h1>` est déplacé dans `<main>` avec `opacity: 1` et une boîte de 689×182 px. Capture d'écran jointe : la page s'affiche intégralement.

---

## [PREUVE] — Aucune erreur runtime

Console complète, **sans filtrage**, sur le chargement entier :

```
[warning] THREE.Clock: This module has been deprecated. Please use THREE.Timer instead.
          location: /_next/static/chunks/bd904a5c.8f95ceaeedf4b04b.js:0:7888
```

```
PAGE ERRORS (exceptions JS non capturées) : 0
REQUÊTES ÉCHOUÉES (requestfailed)         : 0
RÉPONSES 4xx/5xx                          : 0  (sur 37 requêtes)
```

Les 37 réponses sont en `200`, y compris les chunks three.js (`bd904a5c`, `72c373f8`, `b536a0f1`, `9930`), `/geo/land-110m.json`, `/api/me/quota` et cinq préchargements RSC (`/pricing?_rsc=`, `/faq?_rsc=`, `/build?_rsc=`, `/login?_rsc=`, `/signup?_rsc=`).

**[CAUSE]** Aucune erreur JS bloquante, aucun chunk 404, aucun fetch en échec, aucun script bloqué par la CSP. Le seul message est un avertissement de dépréciation three.js, sans effet sur le rendu.

---

## [PREUVE] — Pas de mismatch d'hydratation

Diff ligne à ligne, zone serveur `div#S:1` contre zone client `<main>`, 400 lignes normalisées : **210 lignes divergentes**. Extrait :

```diff
-<span>Create a premium SaaS landing page for an AI productivity platform.</span>
+<span>Create a premium SaaS l</span>
+<span aria-hidden="true" class="hero-caret ...">

-<li data-state="done"  class="hero-step ...">
+<li data-state="idle"  class="hero-step ...">

-<div style="--enter-delay:0ms" class="reveal ">
+<div style="--enter-delay:0ms" class="reveal is-visible">
```

**[CAUSE]** Ces divergences sont des **mutations volontaires post-hydratation**, pas un mismatch :
1. animation machine à écrire capturée en cours de frappe ;
2. `data-state` piloté par la séquence d'animation du héros ;
3. `.is-visible` ajouté par l'`IntersectionObserver` de `components/site/reveal.tsx`.

Un vrai mismatch produirait une erreur console React (« Hydration failed because the server rendered HTML didn't match… »). **0 erreur console, 0 page error.** La distinction est importante : ces 210 lignes pourraient être lues à tort comme la preuve d'un bug.

---

## [PREUVE] — Configuration du streaming

```
grep -rn "renderToPipeableStream|renderToReadableStream|renderToString" app lib components
  -> AUCUN
grep -rn "Suspense" app lib components
  -> AUCUN <Suspense> explicite
```

`next` `^15.1.6` · `react` / `react-dom` `^19.0.0`. `next.config.ts` ne contient aucun réglage de streaming ni PPR — seulement `reactStrictMode`, `poweredByHeader: false`, `serverActions.bodySizeLimit`, les redirections FAQ et les en-têtes de sécurité.

**[CAUSE]** La frontière Suspense provient exclusivement de la convention Next.js : la présence de `app/(site)/loading.tsx` enveloppe automatiquement `app/(site)/page.tsx`. Aucun code applicatif ne pilote le streaming, donc aucun réglage à corriger.

---

## [CAUSE RACINE de l'observation initiale]

Les deux mesures du 2026-09-11 étaient invalides, chacune pour une raison distincte :

| Mesure | Résultat annoncé | Cause de l'artefact |
|---|---|---|
| Volet navigateur intégré | spinner encore présent à 52 s | L'outil signalait `Browser pane is currently hidden`. Chrome bride massivement `IntersectionObserver`, `requestAnimationFrame` et les timers dans un onglet masqué — or `reveal.tsx` dépend de `IntersectionObserver`. |
| Playwright via `render_page.py` | ~43 s de rendu | Stratégie d'attente réseau/animation qui ne se stabilise jamais sur une page à animations perpétuelles (loader, séquence « Analyzing intent… »). Mesure de l'outil, pas du temps utilisateur. |

Dans la sonde de cette session, `visibility: "visible"` et le contenu est résolu.

**Limite de mesure à signaler explicitement :** ma boucle de sondage ne démarrait qu'**après** `networkidle` (11,66 s). Le premier sondage a déjà trouvé le contenu résolu. **Je ne peux donc pas dater la résolution réelle du Suspense** — elle a eu lieu à un instant non mesuré, antérieur à 11,66 s. `networkidle` est retardé par les cinq préchargements RSC et les chunks three.js ; ce n'est pas un temps de rendu perçu.

---

## Point réel découvert au passage : `.reveal` dépend du JS pour être visible

`app/globals.css` :
```css
.reveal            { opacity: 0; transform: translateY(12px); }   /* ligne 454 */
.reveal.is-visible { opacity: 1; transform: none; ... }           /* ligne 458 */
```
et, uniquement sous `@media (prefers-reduced-motion: reduce)` (ligne 704) :
```css
.reveal { opacity: 1; transform: none; }                          /* ligne 732 */
```

**[CAUSE]** Sans exécution JS et sans `prefers-reduced-motion`, les sections `.reveal` restent à `opacity: 0`. Le commentaire de `reveal.tsx` affirme « L'état de repos est l'état final : si rien ne tourne, tout est visible » — **le CSS ne tient pas cette promesse**. Sans effet sur Googlebot (qui exécute le JS) ni sur l'extraction de texte, mais réel pour un visiteur sans JS.

**[CORRECTIF PROPOSÉ]**
```diff
--- a/app/globals.css
+++ b/app/globals.css
-  .reveal {
-    opacity: 0;
-    transform: translateY(12px);
-  }
+  /* L'etat de repos doit rester visible : le masquage n'est applique que
+     lorsque le JS peut le lever. Voir components/site/reveal.tsx. */
+  @media (scripting: enabled) {
+    .reveal {
+      opacity: 0;
+      transform: translateY(12px);
+    }
+  }
```
Alternative équivalente : conserver le CSS et faire poser la classe `reveal` elle-même par le composant au montage, plutôt que de la rendre côté serveur.

---

## [PREUVE] — Impact SEO : contenu indexable sans JS

Extraction texte du HTML brut curl, balises retirées : **421 mots**. Les six chaînes de contenu principal testées sont toutes présentes :

```
[OUI] "Turn ideas into better prompts."
[OUI] "Yelhaa helps you engineer, refine and optimize prompts"
[OUI] "See what better prompts can create."
[OUI] "Simple, transparent pricing."
[OUI] "Your next idea starts with a better prompt."
[OUI] "3 prompt generations / month"
```

**[CAUSE]** Le texte est dans les octets de la réponse, donc récupérable par tout extracteur qui retire les balises — y compris les crawlers IA, qui n'exécutent pas de JS. Nuance à ne pas gommer : il se trouve dans `<div hidden>` (`display:none`) tant que `$RC()` n'a pas tourné, donc un extracteur filtrant sur la visibilité calculée pourrait l'ignorer. Googlebot exécute le JS et n'est pas concerné.

**Aucun correctif nécessaire.** C'est le fonctionnement normal du streaming React.

---

## [PREUVE] — Sitemap vs liens internes

```
URLs dans sitemap.xml       : 20
URLs liees en interne (<a>) : 24

DANS LE SITEMAP MAIS JAMAIS LIEES : 0
LIEES EN INTERNE MAIS ABSENTES DU SITEMAP : 4
  /account    307 -> /login
  /chat       307 -> /login
  /login      200
  /signup     200
```

*(Correction de fiabilité : une première vérification via `urllib` affichait `200` pour `/account` et `/chat` parce qu'elle suivait les redirections. `curl` sans `-L` donne bien `307`.)*

**[CAUSE]** Aucune page orpheline — les 20 URLs du sitemap sont toutes atteignables par lien interne. Les 4 écarts sont volontaires côté sitemap :
- `/account` et `/chat` : routes protégées, listées dans `DISALLOWED_PATHS`, exclues à raison ;
- `/login` et `/signup` : exclues du sitemap **mais toujours `index, follow`** — incohérence déjà relevée dans `findings/onpage.md`.

**[CORRECTIF PROPOSÉ]** — `app/(auth)/login/page.tsx` :
```diff
-export const metadata: Metadata = { title: "Log in" };
+export const metadata: Metadata = {
+  title: "Log in",
+  robots: { index: false, follow: false },
+  alternates: { canonical: absoluteUrl("/login") },
+};
```
Idem pour `signup/page.tsx`. Les 8 liens internes vers `/chat` restent à traiter (voir `findings/technical.md`).

---

## Performance

**Non mesurée.** PageSpeed Insights a renvoyé `rate limit exceeded` à quatre tentatives sur deux jours (aucune `PAGESPEED_API_KEY` configurée), et CrUX exige des identifiants absents. Aucun LCP, INP ou CLS n'est rapporté ici.

Les seules valeurs relevées dans cette session, qui ne sont **pas** des Core Web Vitals :
- `domcontentloaded` : 3,35 s (Chromium headless, réseau non bridé, une exécution)
- `networkidle` : 11,66 s — retardé par 5 préchargements RSC et les chunks three.js
- 37 requêtes, toutes en 200

Une seule exécution sur une seule machine : non représentatif d'un percentile terrain.
