# Images & Sitemap — Findings

---

# Images

## Summary

**Zero `<img>` elements across all 22 crawled pages.** Every graphic on the site is inline SVG (brand mark, loader, icons, the globe) or pure CSS. Consequences:

- No missing `alt` attributes — there are no raster images to annotate
- No oversized images, no format conversion work (WebP/AVIF is moot)
- No lazy-loading debt
- No image-driven layout shift
- Zero image bytes on the critical path

This is an unusually clean position and nothing needs fixing in the traditional image-optimisation sense.

## HIGH — The Open Graph image is advertised at an unreachable URL

The image itself is correct:
```
GET https://yelhaa.info/opengraph-image  →  200, image/png, 38,586 bytes, 1200×630
```
Generated at the edge by `app/opengraph-image.tsx`. Dimensions are right, the format is right, and `og:image:width`/`og:image:height`/`og:image:alt` are all declared.

But every page advertises it as:
```html
<meta property="og:image" content="http://localhost:3000/opengraph-image?e5f8462b3f0e50e2"/>
<meta name="twitter:image" content="http://localhost:3000/opengraph-image?e5f8462b3f0e50e2"/>
```

LinkedIn, X, Slack, Discord, WhatsApp and iMessage cannot fetch that host, so **every share of this site renders as bare text with no preview card**. `twitter:card` is set to `summary_large_image`, which promises a large image and then supplies none — the worst of both, since the card degrades to plain text rather than a small-image fallback.

Resolves entirely with the `NEXT_PUBLIC_SITE_URL` fix in `findings/technical.md`. No image work required.

**Verify after redeploy** with the LinkedIn Post Inspector and X Card Validator, then force a re-scrape (both cache aggressively).

## LOW — Per-page Open Graph images

All pages share one generic OG image. Once the domain is fixed, consider per-page variants for `/pricing` and the FAQ articles — Next.js supports this by adding an `opengraph-image.tsx` in the relevant route folder. `lib/seo.ts` already attaches the image explicitly to every page that calls `pageMetadata()`, so the wiring exists.

## Icons — correct

```
/icon.svg          → 200, image/svg+xml   (declared sizes="any")
/apple-icon        → 200, image/png       (180×180)
```

---

# Sitemap

## Structure — correct

`app/sitemap.ts` builds from two sources: `INDEXABLE_ROUTES` in `lib/seo.ts` and `FAQ_ARTICLES` in `content/faq.ts` (the same constant that seeds the database, so the sitemap cannot drift from the content).

All 20 public URLs are present:

| Group | Count | Priority |
|---|---|---|
| Homepage | 1 | 1.0 |
| `/build`, `/pricing` | 2 | 0.9 |
| `/faq` | 1 | 0.8 |
| FAQ articles | 12 | 0.6 |
| `/contact` | 1 | 0.5 |
| `/legal/*` | 3 | 0.2 |

**Quality gates passed:**
- No protected routes (`/generate`, `/account`, `/prompt/*`, `/workspace/*`, `/chat`) — correctly excluded
- No API routes, no checkout return pages
- No `/login` or `/signup`
- No duplicates, no redirect chains, no 404s — all 20 paths return 200 when requested on the real host
- No conflict with `robots.txt`: nothing listed is disallowed
- Well under the 50,000-URL / 50 MB limits
- Valid XML, correct `urlset` namespace
- Discoverable at `/sitemap.xml` and referenced from `robots.txt`

## CRITICAL — Every `<loc>` uses the localhost host

```xml
<loc>http://localhost:3000</loc>
<loc>http://localhost:3000/build</loc>
...
```
**0 of 20 URLs are on the submitted domain.** Google rejects sitemap entries that fall outside the host the sitemap is served from, so the site currently has, in effect, no sitemap at all. This is the same root cause as everything else in `findings/technical.md`.

## LOW — `lastmod` is the build timestamp, not a content date

```ts
const lastModified = new Date();   // evaluated at generation time
```
Every URL reports the same `lastmod`, refreshed on each regeneration regardless of whether the content changed. Google discounts `lastmod` when it is provably unreliable.

**Fix.** Add an `updatedAt` field to each entry in `INDEXABLE_ROUTES` and `FAQ_ARTICLES` and use the real date. This pairs with the recommendation in `findings/content.md` to surface update dates on FAQ articles — one field serves both.

## Next steps after the domain fix

1. Verify the property in Google Search Console (DNS or the existing `/icon.svg` route)
2. Submit `https://yelhaa.info/sitemap.xml`
3. Confirm all 20 URLs are discovered, then watch the Pages report for indexation
4. Do the same in Bing Webmaster Tools — it also feeds Copilot
