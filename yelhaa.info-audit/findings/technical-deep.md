# Technical SEO Audit — yelhaa.info

**Audited** 2026-09-12 · Deep technical pass across the nine standard categories, plus Agent-UX.

> **Note on the score.** The full audit (2026-09-11) scored "Technical SEO" **35/100** against a single broad category dominated by the canonical failure. This pass scores **63/100** across nine separate sub-categories, several of which (URL structure, security, JS rendering, agent readiness) are genuinely excellent and pull the average up. Both numbers are correct for their own scope — the deeper breakdown below is the more useful diagnostic.

---

## Technical Score: 63/100

| Category | Status | Score |
|----------|--------|-------|
| Crawlability | warn | 70/100 |
| Indexability | **fail** | 30/100 |
| Security | pass | 95/100 |
| URL Structure | pass | 100/100 |
| Mobile | pass | 85/100 |
| Core Web Vitals | — | **not measurable** |
| Structured Data | warn | 45/100 |
| JS Rendering | pass | 95/100 |
| IndexNow | fail | 0/100 |
| *Agent-UX (bonus)* | *pass* | *100/100* |

Core Web Vitals is excluded from the weighted total rather than guessed at. Weights: Indexability 25, Crawlability 15, JS Rendering 12, Security 10, Mobile 10, Structured Data 10, URL Structure 8, IndexNow 5 — renormalised over the 95% that could be measured.

---

## Critical Issues — fix immediately

### C1. Every canonical on the site points to `http://localhost:3000`

Covered in depth in `technical.md`; restated here because it is the single determinant of the Indexability score. Root cause: production builds with `NEXT_PUBLIC_SITE_URL=http://localhost:3000`.

**New evidence from this pass — the JS/raw canonical check passes.** Google's December 2025 JavaScript SEO guidance warns that a canonical in raw HTML differing from one injected by JavaScript may cause Google to use either. Verified in the rendered DOM:

| Element | Raw HTML | Rendered DOM | Conflict? |
|---|---|---|---|
| `rel=canonical` | `http://localhost:3000` | `http://localhost:3000` | No |
| `meta robots` | `index, follow` | `index, follow` | No |
| `<title>` | Yelhaa — Better prompts… | Yelhaa — Better prompts… | No |
| JSON-LD blocks | 2 | 2 | No |

So there is no rendering-layer ambiguity — the value is simply wrong everywhere, consistently. That is the better of the two failure modes: one fix corrects both layers at once.

### C2. `/login` and `/signup` are indexable with the homepage as canonical

See `onpage.md`. Independent of C1 and survives fixing it.

---

## High Priority — fix within 1 week

### H1. robots.txt declares a cross-host sitemap that cannot be fetched

`sitemap_discovery.py` output:
```json
"declared": [{ "url": "http://localhost:3000/sitemap.xml" }],
"checked": [{ "url": "http://localhost:3000/sitemap.xml",
              "source": "robots.txt", "valid": false,
              "error": "URL safety validation failed", "cross_host": true }],
"found":   [{ "url": "https://yelhaa.info/sitemap.xml",
              "source": "common_path", "status_code": 200,
              "kind": "urlset", "valid": true }]
```

Worth separating two things that are easy to conflate:

- **Discovery survives.** The declared sitemap is unusable, but `/sitemap.xml` is found at the conventional path and returns a valid `urlset`. Google checks that path regardless, so the sitemap *will* be discovered.
- **Contents do not.** All 20 `<loc>` values inside it use the localhost host, so every entry is rejected as off-host. Discovery succeeding does not rescue the file.

Both halves are fixed by C1.

### H2. No hreflang, and a French version with no URL of its own

See `onpage.md`. Technically this is an indexability failure: content exists that has no address at which it can be indexed.

---

## Medium Priority — fix within 1 month

### M1. `www.yelhaa.info` does not resolve
DNS failure (`000`), not a redirect. See `technical.md`.

### M2. Eight internal links to `/chat`, which is disallowed and redirects
See `technical.md`. Redirect itself is clean — a single hop to `/login?next=%2Fchat`.

### M3. No edge caching on any page
`Cache-Control: private, no-cache, no-store` with `X-Vercel-Cache: MISS` on every request. See `technical.md`.

### M4. Mobile touch targets and base font size fall slightly below guidance

| Check | Measured | Target |
|---|---|---|
| Base font size | **15.5px** | ≥16px |
| Footer nav links | **~17px tall** (e.g. "Pricing" 46×17, "Help Center" 79×17, "Contact" 52×17) | ≥44×44px (Google recommends 48×48 with 8px spacing) |
| Horizontal scroll at 375px | none (`scrollWidth 375 = innerWidth 375`) | none |
| Viewport meta | `width=device-width, initial-scale=1` | correct |

*Measurement caveat:* the sample captured 11 visible interactive elements — the header controls and footer links — because the main content had not painted in the throttled test pane. The hero CTAs are comfortably sized in the mobile screenshot (`screenshots/yelhaa_info_mobile.png`). **The finding applies to footer navigation, not to the primary CTAs.**

Both items are minor. Bumping the body to 16px and giving footer links vertical padding to reach a 44px hit area is a small CSS change.

---

## Low Priority — backlog

### L1. IndexNow is not implemented
```
/indexnow.txt              → 404
/IndexNow.txt              → 404
/<64-hex-key>.txt          → 404
```
No key file, no submission endpoint. IndexNow is supported by Bing, Yandex, Naver and Seznam — not Google. On Vercel + Next.js it is a small addition: host a key file in `public/` and POST changed URLs on deploy. The plugin ships `indexnow_submit.py` for this. Genuinely low priority until the site has content worth pushing.

### L2. HSTS advertises `preload` but the domain is not on the preload list

The header is correct and preload-eligible:
```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```
But hstspreload.org reports:
```json
{ "name": "yelhaa.info", "status": "unknown", "bulk": false, "preloadedDomain": "" }
```

The `preload` token is a declaration of intent; it does nothing until the domain is submitted at hstspreload.org and accepted. Submit it, or drop the token to avoid advertising a state that isn't real. Note that preload inclusion is effectively permanent and hard to reverse — fine for a site that will always be HTTPS-only, which this is.

*(This has negligible SEO impact. HTTPS is a confirmed but lightweight ranking signal affecting under ~1% of queries, and the page-experience framing does not weight security headers. Listed for completeness, not urgency.)*

---

## Category detail

### Crawlability — 70/100 · warn

| Check | Result |
|---|---|
| robots.txt exists and parses | Yes, well-formed |
| Blocks important resources | No — `/_next/` deliberately left crawlable so Google can render |
| Disallow list scoped correctly | Yes — only genuinely private routes |
| Sitemap declared in robots.txt | **Broken** (cross-host localhost) |
| Sitemap discoverable | Yes, via `/sitemap.xml` common-path fallback, valid `urlset` |
| Accidental noindex | None on public pages |
| Crawl depth | **Max 2 clicks** — all 8 static pages linked from the homepage; 12 FAQ articles one hop from `/faq` |
| HTML size vs Googlebot's 2MB fetch cap | 48 KB — no risk; JSON-LD sits well inside the first 2MB |
| Crawl budget | 22 URLs — a non-issue at this scale |

### AI crawler posture — fully open

All ten tested agents receive `200`, and robots.txt contains **no AI-specific directives**:

| Crawler | Status | Governs |
|---|---|---|
| GPTBot | 200 | OpenAI model training |
| OAI-SearchBot | 200 | **ChatGPT Search citability** |
| ChatGPT-User | 200 | User-triggered browsing |
| ClaudeBot | 200 | Anthropic model training |
| Claude-SearchBot | 200 | **Claude search citability** |
| PerplexityBot | 200 | Perplexity index + training |
| Google-Extended | 200 | Gemini training (not Search) |
| Applebot-Extended | 200 | Apple Intelligence training opt-out |
| Bytespider | 200 | ByteDance training |
| CCBot | 200 | Common Crawl dataset |

The distinction that matters for the AI-visibility goals in `geo.md`: **`OAI-SearchBot` and `Claude-SearchBot` are the tokens that govern citability** in ChatGPT and Claude search respectively — `GPTBot` and `ClaudeBot` only govern training use. All four are open, so nothing blocks citation.

This is currently a permissive default rather than a decision. It happens to be the right posture for a site that wants AI visibility, but it is worth making it deliberate: if the prompt-template library in `content/templates/` is ever published, whether training crawlers should have it is a real business question, separate from citability. Blocking `GPTBot` and `Google-Extended` would restrict training use without affecting ChatGPT Search or Google Search.

### Indexability — 30/100 · fail

Canonicals all localhost (C1); `/login` + `/signup` canonicalised to the homepage while indexable (C2); no hreflang for an existing French version (H2); `www` unresolvable (M1). No duplicate-content problems otherwise — no parameter URLs, no near-duplicates, no pagination, no index bloat. `/build` is thin at 95 words.

*Timing note for when C1 ships:* Google may keep corrected pages in a duplicate cluster for **up to two weeks** while re-evaluating. An unchanged canonical in Search Console the day after the fix is not evidence the fix failed.

### Security — 95/100 · pass

| Header | Value |
|---|---|
| Strict-Transport-Security | `max-age=63072000; includeSubDomains; preload` |
| Content-Security-Policy | Per-directive allowlist; `frame-ancestors 'none'`, `object-src 'none'`, `base-uri 'self'`, `upgrade-insecure-requests` |
| X-Frame-Options | `DENY` |
| X-Content-Type-Options | `nosniff` |
| Referrer-Policy | `strict-origin-when-cross-origin` |
| Permissions-Policy | camera, microphone, geolocation, payment, USB all `()`; `interest-cohort=()` |

HTTPS enforced (308 from HTTP), valid certificate, **no mixed content** — zero `http://` subresources in the served HTML.

**Back-button hijacking: PASS.** Google added this to its spam policies on 2026-04-13 with enforcement live since 2026-06-15, so it is worth an explicit check. Measured on the homepage:
```
historyLenOnLoad: 1 · historyLenAfter4s: 1 · historyGrewWithoutNav: false · onbeforeunload: none
```
No synthetic history entries, no `popstate` trap, no unload interception. The `history.pushState` calls in the bundle are Next.js App Router client navigation — legitimate use.

Only deduction: the `preload` token is advertised but unregistered (L2).

### URL Structure — 100/100 · pass

Clean, lowercase, hyphenated, descriptive. No query parameters on content URLs. Logical hierarchy (`/faq/[slug]`, `/legal/[doc]`). Longest URL is 56 characters, well under the 100 flag. Trailing slashes consistently normalised — `/pricing/` → 308 → `/pricing`, matching the canonical form.

**No redirect chains** — every redirect resolves in exactly one hop:
```
http://yelhaa.info/        → 1 hop → https://yelhaa.info/
https://yelhaa.info/pricing/ → 1 hop → https://yelhaa.info/pricing
https://yelhaa.info/chat    → 1 hop → https://yelhaa.info/login?next=%2Fchat
https://yelhaa.info/generate → 1 hop → https://yelhaa.info/login?next=%2Fgenerate
```

### Mobile — 85/100 · pass

**Content parity is perfect** — the highest-value mobile check under mobile-first indexing. Fetched with Googlebot-Smartphone-class and desktop user agents and compared:

```
title MATCH · description MATCH · canonical MATCH · robots MATCH
h1 MATCH · h2 count MATCH · JSON-LD blocks MATCH · word count MATCH (421/421)
response bytes MATCH (byte-identical)
```

One responsive codebase, no separate mobile URLs, no dynamic serving, no content withheld on mobile. Nothing primary is lazy-loaded behind interaction. No intrusive interstitials, no consent-redirect page, no blocking dialogs, no ad density.

Deductions are M4 only (15.5px base font, small footer touch targets).

### Core Web Vitals — not measurable

PageSpeed Insights returned `rate limit exceeded (240 QPM / 25,000 QPD)` on every attempt across both sessions; no `PAGESPEED_API_KEY` is configured. CrUX field data needs Google API credentials that are not set up, and this domain is very likely below CrUX's traffic threshold anyway.

**Run https://pagespeed.web.dev/ manually.** Reliable server-side proxies collected: TTFB 237–375 ms cold / 22 ms warm, DOMContentLoaded 320 ms, load 386 ms, ~252 KB effective compressed JS+CSS, 26 resources all 200, zero console errors.

Structural risk worth checking against real LCP: the hero sits inside the `app/(site)/loading.tsx` Suspense boundary, so the LCP element cannot paint until hydration completes. Full analysis and the discarded-measurement explanation in `performance.md`.

INP and CLS cannot be assessed without field data.

### Structured Data — 45/100 · warn

Valid JSON-LD, correctly **server-rendered in the initial HTML** rather than JS-injected — which is exactly right under Google's December 2025 guidance that JS-injected structured data faces delayed processing. Rendered DOM shows the same 2 blocks as raw HTML, confirming no injection.

All URLs inside point to localhost (C1) — 43 values across 15 pages, including 36 in the FAQ `BreadcrumbList` items. No missing types: `FAQPage` is correctly absent (Google retired FAQ rich results for all sites on 2026-05-07) and `QAPage` would misdescribe publisher-authored answers. Full detail in `SCHEMA-REPORT.md`.

### JS Rendering — 95/100 · pass

**Strategy is correct.** Next.js App Router with SSR for public content — the recommended approach for SEO-facing pages, and one of the preferred frameworks. No dynamic rendering (which Google documents as a workaround, not a solution), no CSR-only content, no SPA indexing trap. `is_spa: false`.

Against the December 2025 JavaScript SEO checklist:

| Guidance | Status |
|---|---|
| Canonical identical in raw HTML and JS-rendered output | **Pass** (both `http://localhost:3000` — wrong, but consistent) |
| Robots directives correct in initial HTML response | **Pass** — `index, follow` served, not JS-injected |
| No reliance on JS rendering for non-200 pages | **Pass** — `/this-does-not-exist` returns a real 404 |
| Structured data in initial server-rendered HTML | **Pass** — 2 blocks in raw HTML, unchanged after render |
| Title / meta description server-rendered | **Pass** |

Content is delivered inside React streaming containers (`<div hidden id="S:n">` with `$RC()` relocation scripts) — inherent to React streaming SSR, and the text is present in the response bytes either way. Googlebot renders JS so this is a non-issue for Search; noted in `geo.md` for non-rendering AI crawlers.

Deduction is for the route-level Suspense boundary gating the LCP element behind hydration, not for a correctness problem.

### IndexNow — 0/100 · fail

Not implemented. See L1.

### Agent-UX — 100/100 · pass

`agent_ux_check.py` scored a clean 100 with **zero issues**:

```
real_buttons: 7 · real_anchors: 22 · div_onclick_widgets: 0
semantic_landmarks: 16 · inputs_without_label: 0 · inputs_without_aria: 0
a11y tree: 527 nodes · 28 interactive · 0 unnamed_interactive · role_generic: 30
```

Real `<button>` and `<a>` elements throughout, no `<div onclick>` widgets, 16 semantic landmarks, and every interactive node carries an accessible name. As agentic browsing matures — Google shipped a Lighthouse *Agentic Browsing* category by default in Lighthouse 13.3.0 / Chrome 150+ — this is a strong position to already be in, achieved by writing correct HTML rather than by optimising for it.

Worth running Lighthouse's own category for the WebMCP audits it adds:
```bash
lighthouse https://yelhaa.info/ --only-categories=agentic-browsing
```
It reports a fractional pass-ratio (X of N), not a 0–100 score. Absence of WebMCP support is an opportunity, not a defect.

---

## Verification commands

After the `NEXT_PUBLIC_SITE_URL` fix and redeploy:

```bash
curl -s https://yelhaa.info/sitemap.xml | grep -c "yelhaa.info"
curl -s https://yelhaa.info/robots.txt | grep -E "Sitemap|Host"
curl -s https://yelhaa.info/ | grep -o 'rel="canonical" href="[^"]*"'
curl -s https://yelhaa.info/login | grep -o '<meta name="robots"[^>]*>'
curl -s -o /dev/null -w "%{http_code}\n" https://www.yelhaa.info/
curl -s -D - -o /dev/null https://yelhaa.info/pricing | grep -i x-vercel-cache
```
