# Performance — Findings

## Measurement status — read this first

**Core Web Vitals could not be reliably measured in this environment.** I am reporting what was actually observed rather than presenting an estimate as a measurement.

| Source | Outcome |
|---|---|
| PageSpeed Insights (lab + CrUX field) | **Unavailable** — `PSI rate limit exceeded (240 QPM / 25,000 QPD)` on three attempts spread across the audit. No `PAGESPEED_API_KEY` is configured, so requests fall back to a shared, exhausted quota. |
| CrUX field data | **Unavailable** — no Google API credentials configured (`google_auth.py --check` fails). Also likely to be unavailable regardless: the domain is new and probably below CrUX's traffic threshold. |
| Headless Chromium (Playwright) | Page rendered fully and correctly, but the run took ~43 s to settle. The homepage contains perpetual animations (an animated loader mark, a stepped "Analyzing intent… / Structuring context…" sequence), which prevent a network/animation-idle heuristic from ever settling. **This 43 s is the tool's wait strategy, not a user-visible load time.** |
| In-app browser pane | Content stayed behind the route loading spinner for 50 s+. The pane reported itself **hidden** throughout, and Chrome heavily throttles timers, `requestAnimationFrame` and `IntersectionObserver` in hidden tabs — the site's scroll-reveal system (`components/site/reveal.tsx`) depends on `IntersectionObserver`. **This measurement is contaminated and I am discarding it.** |

**Both local measurements were subsequently confirmed to be artefacts.** Screenshot captures (`screenshots/`, taken with headless Chromium in a visible context) render the homepage fully and correctly on both desktop and mobile — hero, animated demo panel, everything. There is no rendering defect. Those two timings are excluded from this report rather than reported as Core Web Vitals. See `findings/visual.md`.

**Recommendation:** run PageSpeed Insights directly on https://pagespeed.web.dev/ for `https://yelhaa.info/` and `/pricing`, or add a `PAGESPEED_API_KEY`. Treat the section below as structural analysis, not as CWV scores.

---

## What was measured reliably

### Server response — good

TTFB over five sequential requests (curl, single location):
```
0.375s  0.237s  0.261s  0.274s  0.265s
```
Browser navigation timing on a warm connection: `TTFB 22 ms · DOMContentLoaded 320 ms · load 386 ms`, 26 resources, 0 pending.

The origin is fast and the HTML document is fully delivered well under half a second.

### Payload — moderate

| Asset class | Count | Compressed |
|---|---|---|
| JS chunks | 22 | ~287 KB |
| — of which `polyfills-*.js` | 1 | 41 KB (`noModule` — modern browsers skip it) |
| CSS | 2 | 14 KB |
| HTML document | 1 | 48 KB |
| Fonts (woff2, self-hosted) | 2 | — |
| **Effective JS + CSS for a modern browser** | | **~252 KB** |

Around 250 KB of compressed JavaScript is on the high side for a marketing page, though not unusual for Next.js App Router. Three chunks dominate: 57 KB, 56 KB and 46 KB.

---

## MEDIUM — No edge caching on any marketing page

Every response carries `Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate` with `X-Vercel-Cache: MISS` — verified over five consecutive requests. Every visitor reaches the origin function; the CDN serves nothing.

TTFB is fine today from one location under no load, but this is the difference between a static asset served from the nearest edge and a function invocation on every hit. Full cause analysis and the fix are in `findings/technical.md`.

---

## MEDIUM — Above-the-fold content sits behind a route-level Suspense boundary

`app/(site)/loading.tsx` renders a full-height centred spinner (`min-h-[60dvh]`) for the whole content area while the route resolves. The homepage's hero — which contains the LCP element — is inside that boundary.

The server HTML is complete and arrives in ~300 ms, so this is not a crawler problem. But it does mean the first paint a user sees is a spinner rather than the headline, and the LCP candidate cannot paint until hydration completes. Combined with ~250 KB of JS and heavy client sections (an animated globe in `Locations`, a horizontally scrollable `PreviewGallery`), this is the most likely LCP risk on the site.

**Worth checking once PSI is available.** If LCP is poor, the fix is to render the hero outside the Suspense boundary so the headline paints from the server HTML immediately, and to defer the globe and gallery below the fold.

---

## LOW — Scroll-reveal animation gates content visibility on JavaScript

`components/site/reveal.tsx` starts elements at `opacity: 0` and adds `.is-visible` via `IntersectionObserver`. The component's own documentation states the intent correctly — "if nothing runs, everything is visible" — and there is a `prefers-reduced-motion` branch in the CSS.

Worth verifying that the CSS rest state genuinely defaults to visible when JS does not execute. If `.reveal { opacity: 0 }` applies unconditionally and only `.is-visible` restores it, then any failure of the observer leaves content permanently invisible. A `@media (scripting: none)` fallback, or driving the initial hidden state from a class added by JS rather than from the base stylesheet, removes the risk entirely.

This does not affect Googlebot, which executes JavaScript.

---

## What already works

- TTFB consistently under 400 ms, and 22 ms on a warm connection
- All 26 resources return 200 — no failed requests, no render-blocking third parties
- Zero console errors across every page tested
- `polyfills` chunk correctly marked `noModule`, so modern browsers never download its 41 KB
- Fonts self-hosted as `woff2` via `next/font` with `display: swap` — no external font requests, no FOIT, no layout shift from font swapping
- Only two CSS files, both small (14 KB combined)
- No render-blocking external scripts; the CSP permits only Stripe, which is not loaded on marketing pages
- No `<img>` tags anywhere — all graphics are inline SVG, so there is no image weight, no lazy-loading debt and no image-driven CLS
- Explicit `width`/`height` on the Open Graph image declaration
