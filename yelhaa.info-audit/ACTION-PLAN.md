# Action Plan — yelhaa.info

Ordered by impact per unit of effort. Phase 1 is roughly an hour of work and is worth more than everything after it combined.

---

# Phase 1 — Critical fixes (this week)

## 1.1 Set the production site URL · 5 min · CRITICAL

**Vercel → Project → Settings → Environment Variables**, for **Production** and **Preview**:

```
NEXT_PUBLIC_SITE_URL=https://yelhaa.info
```

Then **redeploy**. `NEXT_PUBLIC_*` values are inlined at build time — editing the variable without redeploying changes nothing in the served HTML.

Also correct the local file, which currently has both a stray leading space and the wrong value:
```bash
# .env.local line 17 — currently: NEXT_PUBLIC_SITE_URL= http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```
(`siteUrl()` calls `.trim()`, so the space is harmless — but it is how the localhost value likely reached Vercel in the first place.)

**This one change fixes:** all 22 canonical tags · all 20 sitemap URLs · the `Sitemap:` line in robots.txt · `og:url` and `og:image` on every page · Twitter card images · `Organization.url` and `.logo` · `WebSite.url` · all three `Offer.url` values.

**Verify:**
```bash
curl -s https://yelhaa.info/sitemap.xml | grep -c "yelhaa.info"          # expect 20
curl -s https://yelhaa.info/robots.txt | grep Sitemap                    # expect https://yelhaa.info/sitemap.xml
curl -s https://yelhaa.info/ | grep -o 'rel="canonical" href="[^"]*"'    # expect https://yelhaa.info
curl -s https://yelhaa.info/pricing | grep -o 'og:image" content="[^"]*"'
```

## 1.2 Harden the placeholder guard · 15 min · CRITICAL

The safety net in `app/robots.ts` exists and is well designed — it serves `Disallow: /` while the domain is unset — but it never fired, because it only tests for an empty string.

In `lib/seo.ts`:
```ts
export function isPlaceholderOrigin(): boolean {
  const raw = SITE.url.trim();
  if (!raw) return true;
  try {
    const { hostname } = new URL(raw);
    return hostname === "localhost" ||
           hostname === "127.0.0.1" ||
           hostname.endsWith(".local");
  } catch {
    return true;   // unparseable is a placeholder too
  }
}
```

Consider also failing the build outright rather than shipping broken canonicals silently:
```ts
if (process.env.NODE_ENV === "production" && isPlaceholderOrigin()) {
  throw new Error(
    "NEXT_PUBLIC_SITE_URL must be a public origin in production. " +
    `Received: ${JSON.stringify(SITE.url)}`,
  );
}
```

Do 1.1 first — with this guard in place and the variable still wrong, the site would go `Disallow: /`.

## 1.3 Stop indexing the auth pages · 5 min · HIGH

Both pages bypass `pageMetadata()` and inherit the root layout's `canonical: "/"` — so after 1.1 they would declare themselves to be the homepage.

`app/(auth)/login/page.tsx`:
```ts
export const metadata: Metadata = {
  title: "Log in",
  robots: { index: false, follow: false },
  alternates: { canonical: absoluteUrl("/login") },
};
```
`app/(auth)/signup/page.tsx`: the same, with `title: "Create your account"` and `/signup`.

Remember to import `absoluteUrl` from `@/lib/seo`.

## 1.4 Add the www host · 5 min · MEDIUM

`https://www.yelhaa.info/` currently fails DNS outright. Add it in **Vercel → Settings → Domains** and set it to redirect (308) to the apex.

## 1.5 Submit to search engines · 20 min · HIGH

Only after 1.1 is deployed and verified.

1. Google Search Console → add `yelhaa.info` → verify by DNS TXT
2. Submit `https://yelhaa.info/sitemap.xml`
3. Use URL Inspection → *Request indexing* on `/`, `/build`, `/pricing`, `/faq`
4. Repeat in Bing Webmaster Tools (it also feeds Copilot)
5. Note the date — it is the baseline for everything that follows

---

# Phase 2 — High-impact improvements (weeks 2–3)

## 2.1 ~~FAQ schema~~ — WITHDRAWN 2026-09-12

**This item has been removed. Do not implement it.**

The original plan called for `FAQPage` on `/faq` and `QAPage` on each `/faq/[slug]`, at HIGH priority. Both were wrong:

- Google **retired FAQ rich results for all sites on 2026-05-07**. No SERP feature exists, and any AI-citation benefit is unconfirmed.
- `QAPage` is for genuine user Q&A where visitors submit answers — it would misdescribe publisher-authored FAQ answers.

The site's omission of `FAQPage` was a deliberate decision already documented in `components/seo/json-ld.tsx`, and it is correct. Keep the existing `BreadcrumbList` on the FAQ articles.

**Replacement work at this slot: extend `BreadcrumbList` beyond the FAQ · 1–2 h · MEDIUM**

`BreadcrumbList` is an active type with a live rich result, and `FaqBreadcrumbJsonLd()` already implements it correctly. Generalise the component and apply it to `/pricing`, `/build`, `/contact` and the three `/legal/*` pages. Ready-to-use JSON-LD is in `generated-schema.json`.

See `SCHEMA-REPORT.md` for the full corrected analysis.

## 2.2 Complete the Organization entity · 30 min · MEDIUM

```ts
{
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.name,
  url: siteUrl(),
  logo: absoluteUrl("/brand/picto.svg"),
  description: SITE.description,
  slogan: SITE.tagline,
  sameAs: [
    process.env.NEXT_PUBLIC_URL_X,
    process.env.NEXT_PUBLIC_URL_GITHUB,
    process.env.NEXT_PUBLIC_URL_LINKEDIN,
  ].filter(Boolean),
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    url: absoluteUrl("/contact"),
    availableLanguage: ["en", "fr"],
  },
}
```
`sameAs` is what links the site to its social profiles and disambiguates the brand. Leave it empty until real profiles exist — never invent them. Mirror the real company details from `/legal/notice` where they apply.

## 2.3 Expand `/build` · 4–6 h · HIGH

95 words on the primary commercial page, which holds sitemap priority 0.9 and inbound links from all 8 marketing pages. Target 600–900 words: what the builder does, what goes in, what comes out, a worked example end to end, and who it is for.

## 2.4 Restore edge caching · 3–4 h · MEDIUM

Every page currently serves `Cache-Control: no-store` with `X-Vercel-Cache: MISS` — no CDN caching at all, because the root layout calls `await cookies()` and the Supabase middleware matches every route.

1. Read the theme/locale cookies in a client component instead of the root layout. The inline `BOOTSTRAP` script already applies both before paint, so there is no flash to reintroduce.
2. Narrow the `middleware.ts` matcher so it skips public marketing routes — it currently matches everything but static assets.
3. Add `export const revalidate = 3600` to the `(site)` group.

Target `X-Vercel-Cache: HIT` on `/`, `/pricing`, `/build`, `/faq`, `/faq/*` and the legal pages.

## 2.5 Measure performance properly · 30 min · MEDIUM

Nothing in this report gives you real Core Web Vitals — PSI was rate-limited throughout.

1. Run https://pagespeed.web.dev/ on `https://yelhaa.info/` and `/pricing`
2. If LCP is poor, move the hero outside the `app/(site)/loading.tsx` Suspense boundary so the headline paints from server HTML, and defer the globe (`Locations`) and `PreviewGallery` below the fold
3. Optionally add a `PAGESPEED_API_KEY` so automated checks stop hitting the shared quota

## 2.6 Clean up the internal link graph · 1 h · MEDIUM

`/chat` is linked from 8 of 10 marketing pages while being both `Disallow`ed and a 307 to `/login`; `/account` has the same pattern on 2 pages. Render these only for authenticated sessions, or add `rel="nofollow"`.

---

# Phase 3 — Content & authority (month 2)

## 3.1 Publish the prompt library · 2–4 weeks · HIGH

`content/templates/` holds **1,000+ curated prompt templates** — ten batch files plus domain packs for SaaS, agency, finance and product — none of it published. This is the site's content strategy sitting unused.

Category search demand is overwhelmingly informational (*prompt engineering*, *how to write better prompts*, *ChatGPT prompt examples*), and this is exactly that content.

- Start with **20–30** of the strongest templates behind a hub page, organised by domain
- Give each an explanation of *why* the prompt is structured that way — the reasoning is what earns citations and what a bare template cannot
- Measure indexation and impressions before scaling
- **Do not bulk-publish 1,000 thin pages.** That is a thin-content risk, not a strategy.

## 3.2 Publish the French site · 1–2 weeks · HIGH

`lib/i18n/fr.ts` is fully translated, renders correctly, and is completely invisible to search because both languages share one URL.

- Move locale into the URL (App Router sub-path routing: apex as EN, `/fr/...` as FR)
- Self-referential canonical per locale
- Localise `title`, `description` and `og:*` through `pageMetadata()` — currently the FR page has a French `<h1>` under an English `<title>`
- Reciprocal `hreflang` pairs plus `x-default`
- Both locales in `sitemap.ts`

Roughly doubles the indexable surface from work that is already finished.

## 3.3 Build E-E-A-T signals · 1 week · HIGH

Currently absent: About page, authorship, content dates, social proof, external validation.

1. **About page** — who built this and why. Today the only place a visitor learns who publishes the site is the legal notice.
2. **Dates on FAQ articles** — add `updatedAt` to `content/faq.ts` and surface it. This also fixes the `lastmod` problem in 3.5.
3. **Authorship** on library and guide content.
4. **Social proof** once it genuinely exists — never fabricated.

## 3.4 Rewrite titles for search intent · 2 h · MEDIUM

Do this **after** the canonical fix, one page at a time so effects stay attributable.

| Page | Current | Suggested |
|---|---|---|
| `/build` | Prompt Builder | AI Prompt Generator — Turn Ideas Into Structured Prompts |
| `/pricing` | Pricing | Pricing — Free, Pro and Agency Plans |
| `/faq` | Frequently asked questions | Prompt Engineering FAQ — How Yelhaa Works |

Keep the `%s — Yelhaa` template and the homepage title; both are correct.

## 3.5 Real `lastmod` dates · 1 h · LOW

`app/sitemap.ts` uses `new Date()` at generation time, so every URL claims the same timestamp and refreshes whether or not anything changed. Google discounts `lastmod` when it is provably unreliable. Add real `updatedAt` values to `INDEXABLE_ROUTES` and `FAQ_ARTICLES` — the same field 3.3 adds.

## 3.6 Per-page Open Graph images · 2–3 h · LOW

All pages share one generic OG image. Add route-level `opengraph-image.tsx` files for `/pricing` and the FAQ articles. `lib/seo.ts` already attaches the image explicitly on every page that calls `pageMetadata()`.

## 3.7 `llms.txt` · 30 min · LOW

`/llms.txt` returns 404. Worth being honest about this: it is a **proposed** convention with no confirmed adoption by Google, OpenAI, Anthropic or Perplexity, and it is not a ranking or citation factor today. Cheap to add, possibly useful later — but it must not displace schema, content or the canonical fix, which have demonstrable effects now.

---

# Phase 4 — Monitoring (ongoing)

**Weekly**
- GSC Pages report — indexation trend across the 20 URLs
- GSC Performance — impressions, clicks, average position
- Any new Coverage errors

**Monthly**
- Re-run this audit: `/claude-seo:seo-audit https://yelhaa.info/`
- PageSpeed Insights on `/` and `/pricing`
- Re-validate structured data after any schema change
- Check whether AI assistants cite the site for category queries

**On every deploy**
- Confirm canonicals still resolve to `https://yelhaa.info` — this is the regression that already happened once
- Confirm `X-Vercel-Cache: HIT` on marketing pages after 2.4

A drift baseline is worth capturing once Phase 1 lands:
```bash
claude-seo run drift_baseline.py https://yelhaa.info/
```

---

# Expected trajectory

| Milestone | Score | Basis |
|---|---|---|
| Today | **48** | Sitewide localhost canonicals |
| After Phase 1 (~1 h) | **~65** | Sitemap valid, canonicals correct, social previews working, auth pages excluded |
| After Phase 2 | **~74** | Complete entity, breadcrumbs extended, `/build` expanded, edge caching |
| After Phase 3 | **~85** | Prompt library live, French indexed, E-E-A-T established |

The gap between 48 and 65 is one environment variable and a redeploy.
