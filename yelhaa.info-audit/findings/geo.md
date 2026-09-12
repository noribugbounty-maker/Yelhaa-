# AI Search Readiness (GEO) — Findings

Optimising for AI Overviews, ChatGPT Search, Perplexity and Bing Copilot.

## Crawler access — all clear

| Crawler | Response |
|---|---|
| Googlebot | 200 |
| bingbot | 200 |
| GPTBot (OpenAI) | 200 |
| ClaudeBot (Anthropic) | 200 |
| PerplexityBot | 200 |

`robots.txt` blocks no AI user-agent. Its disallow list covers only genuinely private areas (`/api/`, `/account`, `/generate`, `/prompt/`, `/workspace/`, `/chat`, `/checkout/`, `/auth/`).

**Critically: the full page text is present in the server HTML.** Verified by fetching with curl and no JavaScript execution — the homepage `<h1>`, all body copy and all JSON-LD are in the initial response. This matters because most AI crawlers do not execute JavaScript, unlike Googlebot. A Next.js site can easily fail here; this one does not.

*(One caveat: the content arrives inside React streaming containers — `<div hidden id="S:1">` with `$RC()` relocation scripts. The text is in the bytes and any tag-stripping extractor will find it, but extractors that filter on computed visibility may skip `hidden` containers. This is inherent to React streaming SSR and not something to restructure the app around — noted for completeness.)*

---

## CORRECTED 2026-09-12 — Q&A markup is NOT the AI-search lever

**The original version of this file called missing `FAQPage`/`QAPage` markup "the single highest-leverage GEO fix available here." That was wrong.**

Google retired FAQ rich results for all sites on **2026-05-07**, and any AI-citation benefit from `FAQPage` is **unconfirmed** — it must not be claimed as a lever. `QAPage` is reserved for genuine user Q&A where visitors submit answers, so it would misdescribe these publisher-authored pages. The site's omission of both is a deliberate, documented and correct decision (`components/seo/json-ld.tsx`).

**What actually drives AI citation here** is unchanged and sits elsewhere in this file: crawler access (already open), content in the server HTML (already true), fixing the localhost URLs so citations can resolve, entity signals, and above all having more substantive content worth quoting. Markup was never the lever.

See `SCHEMA-REPORT.md`.

---

## HIGH — Citations would point at `http://localhost:3000`

Every canonical, `og:url` and schema `url` on the site names localhost. An AI system that does decide to cite Yelhaa has no correct URL to attribute it to. This nullifies AI visibility work until fixed. See `findings/technical.md`.

---

## MEDIUM — No entity or authorship signals

AI systems weight provenance heavily: who wrote this, what organisation stands behind it, when was it last updated, what else corroborates it.

Currently absent: `sameAs` links, author attribution, publication or update dates, an About page, external citations, and any third-party corroboration of the brand. The `Organization` block carries only name, url, slogan and logo.

Brand mentions elsewhere on the web are the other half of this, and they are outside the site's control — but the on-site half (entity markup, About page, dated content) is straightforward. See `findings/content.md` and `findings/schema.md`.

---

## MEDIUM — Content depth limits what there is to cite

AI systems cite passages that answer a question completely and specifically. At roughly 5,500 indexable words — most of it legal text — there is little to draw from. The FAQ answers are the strongest material on the site and run 110–183 words each: good shape, but shallow.

The unpublished library of 1,000+ prompt templates in `content/templates/` is the obvious remedy. Explained templates — the prompt, plus why it is structured that way — are exactly the kind of specific, attributable, self-contained content these systems quote. See `findings/content.md`.

---

## LOW — No `llms.txt`

`https://yelhaa.info/llms.txt` returns 404.

Worth being precise about this one: `llms.txt` is a **proposed** convention with no confirmed adoption by Google, OpenAI, Anthropic or Perplexity. It is not a ranking or citation factor today. It costs very little to add and may pay off later, but it should sit at the bottom of the list — behind schema, content and the canonical fix, all of which have demonstrable effects now. Do not let it displace real work.

---

## Citability assessment by page

| Page | Citability | Why |
|---|---|---|
| `/faq/*` ×12 | **Strong structure, thin substance** | Question as `<h1>`, direct answer, self-contained. Add dates; no Q&A markup needed (see correction above). |
| `/faq` | **Strong structure** | 12 Q&As in clean `<h3>` + answer form — already the right shape for extraction without markup. |
| `/legal/privacy` | **Good** | Specific, well-structured, genuinely informative on GDPR handling. |
| `/pricing` | **Moderate** | Concrete figures with `Offer` markup — quotable, but URLs are broken. |
| `/` | **Moderate** | Clear positioning and a worked example; thin overall. |
| `/build` | **Weak** | 95 words. Nothing to quote. |

---

## What already works

- Every major AI crawler is permitted and receives a 200
- Content is server-rendered — no JS execution required to read the page
- The FAQ architecture (one question per URL, question as `<h1>`, direct answer) is already the ideal shape for AI citation — extractors read the structure directly; no markup layer is needed or available
- Clean semantic HTML with a correct heading hierarchy and no level skips
- Factual consistency across pages — prices, quotas and model names agree everywhere, so there is no contradictory signal to confuse an extractor
- The FAQ names specifics rather than hedging (which models run the engine, what happens at quota, what is stored) — specificity is what gets quoted
- No content is gated behind interaction, cookie walls or consent banners
