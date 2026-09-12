# Full SEO Audit — yelhaa.info

**Audited** 2026-09-11 · **Re-audited** 2026-09-12 · **Pages crawled** 22 (10 static + 12 FAQ articles) · **Stack** Next.js App Router on Vercel

> ## Re-audit status — 2026-09-12: nothing has shipped
>
> Identical build fingerprint (`webpack-57103c76339c04b1.js`). Every Phase 1 item is still open:
>
> | Check | Status |
> |---|---|
> | Canonical | still `http://localhost:3000` |
> | Sitemap URLs on the live host | **0 of 20** |
> | robots.txt `Sitemap:` | still `http://localhost:3000/sitemap.xml` |
> | `/login` robots meta | still `index, follow` |
> | `www.yelhaa.info` | still unresolved (DNS) |
> | `X-Vercel-Cache` | still `MISS` |
>
> **Added in this pass:** Search Experience (SXO) analysis with live SERP checks · Common Crawl backlink check · drift baseline captured for 4 URLs. **Still missing:** Core Web Vitals — PageSpeed Insights rate-limited on a fourth attempt.

---

## SEO Health Score: 47 / 100

| Category | Weight | Score | Weighted |
|---|---|---|---|
| Technical SEO | 22% | 35 | 7.7 |
| Content Quality | 23% | 52 | 12.0 |
| On-Page SEO | 20% | 50 | 10.0 |
| Schema / Structured Data | 10% | 45 | 4.5 |
| Performance (CWV) | 10% | 60 \* | 6.0 |
| AI Search Readiness | 10% | 48 | 4.8 |
| Images | 5% | 55 | 2.8 |
| **Total** | | | **47** |

*Revised 2026-09-12 by the follow-up specialist passes: Schema 40 → 45 (incorrect FAQPage finding withdrawn), Content 55 → 52 (word counts re-measured on body prose only — 4,859 sitewide, not ~5,500), AI Search 45 → 48 (GEO five-factor model). Total 48 → 47.*

\* Performance could not be measured — PageSpeed Insights was rate-limited on every attempt and no API key is configured. Scored provisionally from server-side observations. See `findings/performance.md`.

**This score is misleading in an important way, and the shape of it matters more than the number.**

The engineering here is careful and well above average. Security headers are close to exemplary. Content is server-rendered so every crawler can read it. URL handling, redirects and 404s are all correct. The sitemap generator is properly architected. The copy is genuinely well written, and the privacy and terms pages are better than most funded startups ship. Structured data is generated from shared constants rather than hand-maintained.

Then a single environment variable takes most of it out.

`NEXT_PUBLIC_SITE_URL` is set to `http://localhost:3000` in the production build. Because `lib/seo.ts` is correctly designed as the single source of truth for every absolute URL, that one wrong value propagates into **every canonical tag, every sitemap entry, every Open Graph tag, every social preview image, every structured-data URL, and the `Sitemap:` line in robots.txt**. The site is well built and currently telling Google it lives on a developer's laptop.

Fix that variable and redeploy, and the score moves to roughly the mid-60s in a day. The remaining work is ordinary growth work: publish the content that already exists, restore edge caching, and give the site an identity.

---

## Business type

**B2C/B2B SaaS — AI prompt engineering tool.** Freemium, three tiers ($0 / $9.99 / $39.99), Stripe checkout, Supabase auth. No local-business signals, no e-commerce catalogue. English interface with a complete but unpublished French translation.

Relevant category search demand is dominated by informational intent — *prompt engineering*, *AI prompt generator*, *prompt optimizer*, *ChatGPT prompt examples*. The site currently targets none of it.

---

## Top 5 critical issues

### 1. Every canonical, sitemap URL and social tag points to `http://localhost:3000`
Sitewide. `robots.txt` advertises `Sitemap: http://localhost:3000/sitemap.xml`; all 20 sitemap `<loc>` values use the localhost host; every page's canonical, `og:url`, `og:image` and JSON-LD `url` do the same. Google discards the entire sitemap, and every social share renders without a preview card.
**Cause:** the Vercel Production env var carries the localhost value. → `findings/technical.md`

### 2. The placeholder guard cannot catch this class of error
`app/robots.ts` already has the right defence — it serves `Disallow: /` while the domain is unset — but `isPlaceholderOrigin()` only tests for an *empty* string. A localhost value passes straight through, so the safety net never fired. Worth fixing alongside #1 so it cannot recur. → `findings/technical.md`

### 3. `/login` and `/signup` are indexable and declare the homepage as their canonical
An independent bug that survives fixing #1. Both bypass `pageMetadata()` and inherit the root layout's `canonical: "/"` plus `index, follow`. After the domain fix they will tell Google that two thin auth forms are the homepage. → `findings/onpage.md`

### 4. A complete French site exists at the same URLs and cannot be indexed
`lib/i18n/fr.ts` is fully translated and renders correctly via the `yelhaa-locale` cookie — but on the same URLs, with no `hreflang`, the same canonical, and English `<title>`/`<meta>` even in French mode. Finished work earning nothing. → `findings/onpage.md`

### 5. No edge caching — every request reaches the origin
`Cache-Control: private, no-cache, no-store` with `X-Vercel-Cache: MISS` on all five test requests. The root layout's `await cookies()` and the sitewide Supabase middleware opt every marketing page out of static generation, so the CDN serves nothing. → `findings/technical.md`

> **Correction (2026-09-12):** this slot previously read "No `FAQPage`/`QAPage` markup on 13 Q&A pages." That was wrong — Google retired FAQ rich results for **all** sites on 2026-05-07, and the site's omission of `FAQPage` is a deliberate, documented, correct decision. See `SCHEMA-REPORT.md`.

---

## Top 5 quick wins

1. **Set `NEXT_PUBLIC_SITE_URL=https://yelhaa.info` in Vercel and redeploy** — 5 minutes, fixes items across every category in this report. `NEXT_PUBLIC_*` is inlined at build time, so the redeploy is mandatory.
2. **Add `robots: { index: false, follow: false }` to `/login` and `/signup`** — 5 minutes, two lines.
3. **Extend the existing `BreadcrumbList` component to `/pricing`, `/build`, `/contact` and `/legal/*`** — under an hour; the FAQ articles already implement it correctly and it is a live rich result.
4. **Add `www.yelhaa.info` in Vercel with a 308 to the apex** — 5 minutes; it currently fails DNS entirely.
5. **Populate `Organization.sameAs` and `contactPoint`** — 15 minutes; `lib/config.ts` already reads the social URLs from the environment.

---

## Technical SEO — 35/100

The category carrying the damage, and also the category with the strongest foundations.

**Broken:** every canonical, sitemap entry and social URL points to localhost (critical). No edge caching — `Cache-Control: no-store` and `X-Vercel-Cache: MISS` on every request, because the root layout calls `await cookies()` and the Supabase middleware matches all routes. `www.yelhaa.info` does not resolve. Eight internal links point at `/chat`, which is both `Disallow`ed and a 307 redirect.

**Correct:** HSTS with `preload`, a tight per-directive CSP, `X-Frame-Options: DENY`, `nosniff`, a restrictive `Permissions-Policy`. HTTP→HTTPS and trailing-slash normalisation both 308. Genuine 404s. `/_next/` left crawlable so Google can render. All five major crawlers get 200. Full content in the server HTML.

→ `findings/technical.md`

## Content Quality — 52/100

**The writing is the site's biggest asset and its most underused one.** Prose is specific, human and free of AI-tell phrasing; the FAQ answers state real limits instead of hedging; the legal pages are genuinely thorough.

But there are only **4,859 words** of body prose, and the privacy policy plus terms of service are 2,143 of them — **44% of all content on the site is legal boilerplate**. "data" and "account" both outrank "prompt" in sitewide frequency, and "prompt engineering" appears exactly twice. Nothing addresses the informational queries that dominate the category. E-E-A-T signals are largely absent: no About page, no authorship, no dates, no social proof.

Meanwhile `content/templates/` holds **over 1,000 curated prompt templates**, none of them published. That is the content strategy, sitting unused in the repository.

→ `findings/content.md`

## On-Page SEO — 50/100

Clean fundamentals: 22 unique titles, all well within length limits; unique descriptions on 20 of 22; exactly one descriptive `<h1>` per page; no heading-level skips; canonical paths correctly normalised.

Held back by the localhost canonicals, the `/login` + `/signup` canonical bug, the unindexable French site, and titles written as interface labels (`Prompt Builder`, `Pricing`) rather than for search intent. `/build` carries 95 words while holding sitemap priority 0.9 and inbound links from every marketing page.

→ `findings/onpage.md`

## Schema / Structured Data — 45/100

Present and syntactically valid: `Organization` + `WebSite` on the homepage, `SoftwareApplication` with three `Offer` objects on pricing, `BreadcrumbList` across all 12 FAQ articles. Everything parses; prices match the visible content exactly.

Every URL inside it points to localhost — 43 values across 15 pages, including 36 in the FAQ breadcrumbs — which invalidates `Organization.logo` and all `Offer.url` values. `Organization` lacks `sameAs`, `contactPoint` and `description`. No missing types: `FAQPage` is correctly absent by design.

→ `findings/schema.md`

## Performance — not measured

PageSpeed Insights returned `rate limit exceeded` on all three attempts (no API key configured); CrUX field data requires credentials that are not set up. The headless-Chromium and in-app-browser timings I collected were both contaminated — by animation-idle wait strategies and by Chrome's hidden-tab throttling respectively — so I am discarding them rather than reporting them as measurements.

What is reliable: TTFB 237–375 ms cold and 22 ms warm; DOMContentLoaded 320 ms; ~252 KB of effective compressed JS+CSS; 26 resources, all 200, zero console errors; self-hosted `woff2` fonts via `next/font`; no render-blocking third parties.

The structural risk worth checking: the LCP element sits inside the `app/(site)/loading.tsx` Suspense boundary, so the hero cannot paint until hydration completes, behind ~250 KB of JS and an animated globe.

**Run PageSpeed Insights manually** on https://pagespeed.web.dev/ before acting on performance.

→ `findings/performance.md`

## AI Search Readiness — 48/100

Access is fully clear: GPTBot, ClaudeBot, PerplexityBot, Googlebot and bingbot all receive 200, and — importantly for crawlers that do not run JavaScript — the complete page text is in the server HTML.

The gap is everything downstream — and the binding one is off-site. Searches for the brand, the domain and the legal entity return **no web mentions at all**: no Wikipedia, Reddit, YouTube, LinkedIn, press or directory listings. ChatGPT draws ~48% of citations from Wikipedia and ~11% from Reddit; Perplexity ~47% from Reddit. Brand mentions correlate ~3x more strongly with AI visibility than backlinks, and no on-site change substitutes for them. On-site: citations would resolve to `localhost:3000`, there are no entity or authorship signals, and ten of twelve FAQ answers fall below the 134–167 word citation band.

`llms.txt` is absent — noted, but it is a proposed convention with no confirmed adoption by any major AI platform. It belongs at the bottom of the list, well behind schema and content.

→ `findings/geo.md`

## Images — 55/100

**Zero `<img>` elements sitewide** — everything is inline SVG or CSS. No alt-text debt, no oversized files, no format conversion, no lazy-loading work, no image-driven CLS.

The one real problem: the Open Graph image is generated correctly (200, PNG, 38 KB, 1200×630) but advertised at `http://localhost:3000/opengraph-image`, so **every social share renders as bare text**. `twitter:card` promises `summary_large_image` and delivers nothing. Fixed by the env var, not by image work.

→ `findings/images-and-sitemap.md`

---

## Search Experience (SXO) — diagnostic

*Not part of the weighted score. Added 2026-09-12.*

Live SERP checks revealed the finding most likely to be missed, because nothing is broken — the pages are aimed at intents the SERP is not serving.

**Cluster 1 — transactional** (`"ai prompt generator tool free"`): all six ranking competitors lead with **free, unlimited, no signup** — TripleTen, GeneratePrompt.net, Feedough, Promptsera, Quillbot, ryrob. Yelhaa offers 3 generations/month behind an account. That is an **offer mismatch, not a page defect**: rewriting `/build` cannot fix it. The one change that makes this cluster winnable is letting the first generation run without an account — a product decision, flagged here because the SEO consequence is real.

**Cluster 2 — informational** (`"how to write better prompts"`): 100% long-form editorial (learnprompting.org, eWeek, IABAC, MoreOnlineTools). No product pages rank. Yelhaa has **no content of this type at all**. This is the cluster the site is best equipped to win — the intent matches its subject, and 1,000+ templates already sit in the repo.

**Persona scores:** developer/evaluator **7/10** (well served — clear positioning, honest pricing, strong trust signals); casual searcher **2/10**; learner **2/10** with zero eligible pages.

→ `findings/sxo.md`

## Backlinks & Off-site — diagnostic

*Not part of the weighted score. Tier 0 data only.*

Common Crawl (`cc-main-2026-jan-feb-mar`): `in_crawl: false`, no PageRank, no linking hosts recorded. This does not prove zero backlinks — Common Crawl is a sample, and absence is expected for a new domain — but it corroborates the independent brand-mention research, which found no web references to Yelhaa anywhere. Two methods agreeing makes it safe: **effectively no inbound link or mention profile.**

No toxic links, nothing to disavow, no anchor over-optimisation — the cleanest possible starting position.

**Sequence matters:** fix the origin → publish something worth linking to → then earn links. Coverage earned now would point at a site Google cannot index properly.

Not assessed (no credentials): referring domains, anchor text, toxic links, competitor gap, link velocity. Bing Webmaster Tools is free and unlocks most of it.

→ `findings/backlinks.md`

---

## Artifacts

```
yelhaa.info-audit/
├── FULL-AUDIT-REPORT.md          this file
├── ACTION-PLAN.md                prioritised, with code
├── SCHEMA-REPORT.md              structured data + FAQPage correction
├── CONTENT-REPORT.md             E-E-A-T, readability, keyword coverage
├── GEO-ANALYSIS.md               AI search readiness, crawler matrix, brand mentions
├── audit-data.json               structured envelope (9 categories)
├── generated-schema.json         paste-ready JSON-LD
├── sitemap.xml                   captured live copy
├── screenshots/
│   ├── yelhaa_info_desktop.png   1920×1080
│   └── yelhaa_info_mobile.png    750×1624
└── findings/
    ├── technical.md
    ├── technical-deep.md         9-category technical pass
    ├── onpage.md
    ├── content.md
    ├── schema.md
    ├── performance.md
    ├── geo.md
    ├── visual.md
    ├── sxo.md                    NEW — SERP-backwards, personas
    ├── backlinks.md              NEW — Common Crawl, off-site
    └── images-and-sitemap.md
```

**PDF generation is unavailable on this machine.** `google_report.py` requires WeasyPrint, which needs native GTK/Pango libraries that are not installed under Windows. The Markdown reports above are complete and self-contained. To produce the PDF, install the GTK runtime per the [WeasyPrint Windows instructions](https://doc.courtbouillon.org/weasyprint/stable/first_steps.html#windows), then run:

```bash
claude-seo run google_report.py --type full --data yelhaa.info-audit/audit-data.json --domain yelhaa.info --output-dir yelhaa.info-audit/
```

## Limitations

- **PageSpeed Insights / CrUX:** unavailable after **four attempts across two days** (rate limit, no API key). No field or lab Core Web Vitals anywhere in this audit — run https://pagespeed.web.dev/ manually.
- **Google Search Console / GA4:** no credentials configured — no indexation status, impressions, clicks or organic traffic data.
- **Backlinks:** Tier 0 only (Common Crawl). No Moz or Bing Webmaster credentials, so no referring-domain, anchor-text, toxicity or competitor-gap analysis. Bing Webmaster Tools is free and unlocks most of it.
- **Rankings / search volume:** no DataForSEO access — no live SERP positions or keyword volumes. Category demand is described qualitatively.
- **Crawl scope:** 22 URLs, which is the site's full public surface. No pages were missed.
