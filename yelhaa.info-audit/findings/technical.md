# Technical SEO — Findings

Audited 2026-09-11 · https://yelhaa.info/ · 22 URLs crawled (10 static pages + 12 FAQ articles)

---

## CRITICAL — Every canonical URL, sitemap entry and robots directive points to `http://localhost:3000`

**Evidence (live production responses):**

`https://yelhaa.info/robots.txt`
```
User-Agent: *
Allow: /
Disallow: /api/
...
Host: http://localhost:3000
Sitemap: http://localhost:3000/sitemap.xml
```

`https://yelhaa.info/sitemap.xml` — 20 URLs, **0 of them valid**:
```
<loc>http://localhost:3000</loc>
<loc>http://localhost:3000/build</loc>
<loc>http://localhost:3000/pricing</loc>
... (all 20)
```

Every page's `<head>`:
```html
<link rel="canonical" href="http://localhost:3000/pricing"/>
<meta property="og:url" content="http://localhost:3000"/>
<meta property="og:image" content="http://localhost:3000/opengraph-image?e5f8462b3f0e50e2"/>
```

And inside the JSON-LD:
```json
{"@type":"Organization","url":"http://localhost:3000","logo":"http://localhost:3000/brand/picto.svg"}
```

**Impact.** This is a single misconfiguration with sitewide blast radius:

| Surface | Consequence |
|---|---|
| Sitemap | Google fetches it and discards all 20 URLs — they are not on the submitted host. Effectively **no sitemap**. |
| Canonicals | Every page declares its canonical to be an unreachable host. Google will usually fall back to the self-referential URL, but the signal is at best ignored and at worst suppresses indexing. |
| `og:url` / `og:image` | Social previews (LinkedIn, X, Slack, Discord, iMessage) cannot resolve the image — **every share renders bare text**. The image itself is fine (`/opengraph-image` returns 200, PNG, 38 KB); only the advertised URL is wrong. |
| JSON-LD | `Organization.logo`, `Organization.url`, `WebSite.url` and all three `Offer.url` values are invalid. Google drops the logo and will not associate the entity. |
| robots.txt | The `Sitemap:` line is unusable. (`Host:` is a legacy Yandex directive and is ignored by Google either way.) |

**Root cause — located in source.** `lib/seo.ts` resolves the origin:

```ts
const DEV_ORIGIN = "http://localhost:3000";

export function siteUrl(): string {
  const configured = SITE.url.trim().replace(/\/+$/, "");
  return configured || DEV_ORIGIN;
}

export function isPlaceholderOrigin(): boolean {
  return !SITE.url.trim();     // ← only catches an EMPTY value
}
```

with `lib/config.ts`: `url: process.env.NEXT_PUBLIC_SITE_URL ?? ""`.

The production deployment is building with `NEXT_PUBLIC_SITE_URL` set to `http://localhost:3000` — not unset. We can prove it is *set*: `app/robots.ts` emits `disallow: "/"` for the whole site when `isPlaceholderOrigin()` is true, and production instead emitted the normal `Allow: /` block. So the guard passed, meaning the variable is non-empty; and the value it carries is the localhost origin.

The local `.env.local` contains exactly that value (`NEXT_PUBLIC_SITE_URL= http://localhost:3000`), which is the likely source — the Vercel Production environment variable appears to have been populated from the local file.

**Fix (two parts — both needed):**

1. In Vercel → Project → Settings → Environment Variables, set for **Production** (and Preview):
   ```
   NEXT_PUBLIC_SITE_URL=https://yelhaa.info
   ```
   `NEXT_PUBLIC_*` values are inlined at build time, so a **redeploy is required** — changing the variable alone will not update the served HTML.

2. Harden the guard so this cannot recur silently. The current check only treats an *empty* value as a placeholder; a localhost value sails straight through:

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
       return true;
     }
   }
   ```

   With this in place the existing `app/robots.ts` branch would have caught the misconfiguration on day one by serving `Disallow: /` — loud and obvious — instead of publishing broken canonicals quietly. Consider also failing the production build outright when the origin is a placeholder and `NODE_ENV === "production"`.

**Verification after redeploy:**
```bash
curl -s https://yelhaa.info/sitemap.xml | grep -c "yelhaa.info"   # expect 20
curl -s https://yelhaa.info/ | grep -o 'rel="canonical" href="[^"]*"'
curl -s https://yelhaa.info/robots.txt | grep Sitemap
```

---

## HIGH — Marketing pages are never cached at the edge

**Evidence** — five consecutive requests to the homepage, every one identical:
```
Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate
X-Vercel-Cache: MISS
```

Every visitor — and every crawler hit — reaches the origin function. Nothing is served from Vercel's CDN.

**Cause.** The root layout is dynamic: `app/layout.tsx` calls `await cookies()` to read the theme and locale cookies, and `middleware.ts` runs Supabase `updateSession` across all matched routes, which touches cookies on every request. Either alone opts the route out of static generation; `no-store` is the result.

**Impact.** Measured TTFB is currently acceptable (237–375 ms from this location), but it is origin-bound: it will degrade with distance and under load, and crawl budget is spent on uncached responses. The eight public marketing pages and twelve FAQ articles are identical for every anonymous visitor and have no reason to be dynamic.

**Fix.** Decouple personalisation from the static shell. Read the theme/locale cookies in a client component (they are already applied by the inline `BOOTSTRAP` script before paint, so no flash) rather than in the root layout, and narrow the `middleware.ts` matcher so it skips the public marketing routes — it currently matches everything except static assets. Then add `export const revalidate = 3600` (or `dynamic = "force-static"`) to the `(site)` group. Target `X-Vercel-Cache: HIT` on `/`, `/pricing`, `/build`, `/faq`, `/faq/*` and the legal pages.

---

## MEDIUM — Eight internal links point at `/chat`, which is disallowed and redirects

`/chat` is linked from the header or footer on 8 of the 10 static pages. It is simultaneously:
- listed under `Disallow: /chat` in robots.txt, and
- a `307` redirect to `/login` for anonymous visitors (`middleware.ts`).

Sitewide navigation links to a blocked, redirecting URL waste crawl budget and leak internal link equity into a dead end. `/account` has the same pattern on 2 pages.

**Fix.** These are product entry points, not marketing destinations. Either render them only for authenticated sessions, or keep them and add `rel="nofollow"` — the former is cleaner.

---

## MEDIUM — `www.yelhaa.info` does not resolve

```
curl https://www.yelhaa.info/  →  000 (DNS failure)
```

The apex works and `http://` correctly 308s to `https://`. But a visitor who types or links `www.` gets a connection error rather than a redirect, and any inbound link built on the `www.` host is lost.

**Fix.** Add `www.yelhaa.info` as a domain in Vercel and set it to redirect (308) to the apex.

---

## What already works

These were tested and are correct — worth protecting during the fixes above.

| Check | Result |
|---|---|
| HTTPS + HSTS | `max-age=63072000; includeSubDomains; preload` — preload-ready |
| Content-Security-Policy | Explicit, scoped allowlist per directive; `frame-ancestors 'none'`, `object-src 'none'`, `base-uri 'self'`, `upgrade-insecure-requests` |
| Other headers | `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` denying camera/mic/geo/payment/USB + `interest-cohort=()` |
| HTTP → HTTPS | `308` to `https://yelhaa.info/` |
| Trailing slashes | `/pricing/` → `308` → `/pricing` (no duplicate URLs) |
| 404 handling | Returns a genuine `404` status, not a soft 200 |
| Crawler access | Googlebot, bingbot, GPTBot, ClaudeBot, PerplexityBot all receive `200` |
| Server-rendered content | Full page text is present in the initial HTML response — no JS execution required for a crawler to read it |
| URL structure | Flat, lowercase, hyphenated, no query-string parameters, no session IDs |
| robots.txt disallow list | Correctly scoped to genuinely private areas; `/_next/` is **not** blocked, so Google can render the pages |
| Sitemap completeness | All 20 public routes present including the 12 FAQ articles (host is wrong, but nothing is missing) |
