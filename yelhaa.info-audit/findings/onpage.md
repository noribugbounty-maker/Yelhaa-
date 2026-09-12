# On-Page SEO — Findings

## Page inventory (22 URLs)

| URL | Title (len) | Meta description (len) | H1 | Words |
|---|---|---|---|---|
| `/` | Yelhaa — Better prompts. Better AI outputs. (43) | 72 | Turn ideas into better prompts. | 421 |
| `/build` | Prompt Builder — Yelhaa (23) | 94 | Describe your idea. | 95 |
| `/pricing` | Pricing — Yelhaa (16) | 132 | Simple, transparent pricing | 320 |
| `/faq` | Frequently asked questions — Yelhaa (35) | 102 | Frequently asked | 439 |
| `/contact` | Contact — Yelhaa (16) | 108 | Get in touch | 189 |
| `/legal/notice` | Legal notice — Yelhaa (21) | 110 | Legal notice | 358 |
| `/legal/privacy` | Privacy policy — Yelhaa (23) | 107 | Privacy policy | 1226 |
| `/legal/terms` | Terms of service — Yelhaa (25) | 106 | Terms of service | 1121 |
| `/login` | Log in — Yelhaa (15) | **72 (duplicate)** | Welcome back. | 66 |
| `/signup` | Create your account — Yelhaa (28) | **72 (duplicate)** | Build something better. | 67 |
| `/faq/*` ×12 | question text — Yelhaa (24–56) | 77–155, all unique | the question | 110–183 |

No missing titles, no missing descriptions, no duplicate titles, exactly one H1 per page, no heading-level skips.

---

## HIGH — `/login` and `/signup` are indexable and declare the homepage as their canonical

**Evidence:**
```html
<!-- served at https://yelhaa.info/login -->
<link rel="canonical" href="http://localhost:3000"/>     <!-- no path -->
<meta name="robots" content="index, follow"/>
<meta name="description" content="Yelhaa turns your ideas into better prompts, for better results with AI."/>
```
Identical on `/signup`. Both also carry the site-default description, the only duplicate descriptions on the site.

**Cause.** `app/layout.tsx` sets a site-wide default:
```ts
alternates: { canonical: absoluteUrl("/") },
robots: { index: true, follow: true },
```
and the two auth pages override only the title:
```ts
export const metadata: Metadata = { title: "Log in" };
```
Every other page routes through `pageMetadata()` in `lib/seo.ts`, which sets a correct per-page canonical. These two bypass it, so they inherit the root's canonical — the homepage.

Note this is a **separate bug from the localhost issue** and will survive fixing it. Once the domain is corrected, `/login` and `/signup` will point a canonical at `https://yelhaa.info/` — actively telling Google that two thin auth forms are the homepage.

**Fix.** Auth pages have no search value. Mark them explicitly:
```ts
export const metadata: Metadata = {
  title: "Log in",
  robots: { index: false, follow: false },
  alternates: { canonical: absoluteUrl("/login") },
};
```
Optionally add `/login` and `/signup` to `DISALLOWED_PATHS` in `lib/seo.ts` for consistency with the other product routes — though `noindex` is the directive that actually does the work, and a page must stay crawlable for it to be read.

---

## HIGH — A complete French site exists on the same URLs, invisible to search

The site ships a full FR translation (`lib/i18n/fr.ts`), selected by the `yelhaa-locale` cookie:

```bash
curl https://yelhaa.info/ -H "Cookie: yelhaa-locale=fr"
```
```html
<html lang="fr">
<h1>Transformez vos idées en meilleurs prompts.</h1>
<title>Yelhaa — Better prompts. Better AI outputs.</title>   <!-- still English -->
<link rel="canonical" href="http://localhost:3000"/>          <!-- same URL -->
```

Three compounding problems:

1. **No distinct URL.** Both languages live at `/`. Google crawls without cookies, sees only English, and has no address at which to index the French content. The entire FR translation is unreachable from search.
2. **Metadata does not follow the locale.** In FR mode the `<h1>` is French while `<title>`, `<meta description>` and all Open Graph tags stay English — the FR page describes itself in the wrong language.
3. **No `hreflang` annotations** anywhere (0 occurrences on both variants).

**Fix.** Move locale into the URL — Next.js App Router sub-path routing (`/en/...`, `/fr/...`, or apex-as-EN plus `/fr/...`). Then:
- give each locale its own self-referential canonical,
- localise `title`/`description`/`og:*` through `pageMetadata()`,
- emit reciprocal `hreflang` pairs plus `x-default`,
- list both locales in `sitemap.ts`.

This roughly doubles the indexable surface and is the single largest content opportunity on the site, since the translation already exists and is written.

---

## MEDIUM — Titles describe the interface rather than the search intent

Titles are clean, unique and well-sized, but written as app navigation labels. `Prompt Builder — Yelhaa`, `Pricing — Yelhaa`, `Contact — Yelhaa` compete for nothing: nobody searches "prompt builder" expecting Yelhaa specifically, and the pages carry no qualifying terms.

The product sits in a category with real search demand — *prompt engineering*, *AI prompt generator*, *prompt optimizer*, *ChatGPT prompt builder*. None of these appear in any title.

Suggested direction (keep the `%s — Yelhaa` template; it is correct):

| Page | Current | Suggested |
|---|---|---|
| `/` | Yelhaa — Better prompts. Better AI outputs. | keep — brand + positioning is right for the homepage |
| `/build` | Prompt Builder | AI Prompt Generator — Turn Ideas Into Structured Prompts |
| `/pricing` | Pricing | Pricing — Free, Pro and Agency Plans |
| `/faq` | Frequently asked questions | Prompt Engineering FAQ — How Yelhaa Works |

Do this **after** the canonical fix, and change one page at a time so the effect is attributable.

---

## MEDIUM — `/build` is the weakest page on the site

95 words, H1 "Describe your idea.", and it is the product's primary landing target (priority 0.9 in the sitemap, linked from all 8 marketing pages). It carries almost no text for a search engine to classify and nothing for an AI assistant to quote.

It needs, at minimum: what the builder does, what goes in, what comes out, a worked example, and who it is for. 600–900 words is a reasonable target for a primary commercial page in this category.

---

## What already works

- Unique, non-truncating titles on all 22 URLs (15–56 chars; none over the ~60-char SERP limit)
- Unique meta descriptions on 20 of 22 URLs, most in the 100–155 sweet spot
- Exactly one `<h1>` per page, descriptive, no level skips
- FAQ articles use the question verbatim as both `<title>` and `<h1>` — ideal for question-intent queries
- FAQ descriptions are generated from the answer text itself (`lib/seo.ts`), so they never over-promise
- Clean internal linking: every public page is reachable within one click of the homepage; the FAQ hub links all 12 articles
- Canonical paths are correctly normalised without trailing slashes, matching what the server actually serves
