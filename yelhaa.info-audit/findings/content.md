# Content Quality & E-E-A-T — Findings

> **Refined 2026-09-12.** The word counts below were measured on full page text including header and footer chrome. A dedicated content pass re-measured body prose only: **4,859 words sitewide**, not ~5,500, and `/build` is **53 words**, not 95. The conclusions are unchanged and in fact sharper. Full analysis, E-E-A-T scoring, readability and keyword data: `CONTENT-REPORT.md`.

## Volume

| Page | Words (body prose) | Floor | Assessment |
|---|---|---|---|
| `/legal/privacy` | 1,117 | — | Substantial |
| `/legal/terms` | 1,026 | — | Substantial |
| `/faq` | 397 | — | Adequate for a hub |
| `/` | 350 | 500 | Below floor |
| `/legal/notice` | 277 | — | Appropriate |
| `/pricing` | 267 | 300 | Below floor |
| `/contact` | 149 | — | Appropriate |
| `/faq/*` ×12 | 73–148 | — | Thin per page, coherent as a set |
| `/build` | **53** | 800 | **Critically thin** |
| `/login`, `/signup` | 55–64 | — | Expected (should be `noindex`) |

Total indexable body content across the site is **4,859 words** (body prose, chrome excluded). The two longest pages are the privacy policy and terms of service — that is, **the majority of the site's text is legal boilerplate**.

---

## HIGH — Almost no content targets the category's search demand

The site explains what Yelhaa is, but never covers the subject it sells into. There is nothing on prompt engineering as a practice: no guides, no technique breakdowns, no before/after examples, no model-specific advice, no use-case walkthroughs.

This matters more than usual here. Queries in this category are overwhelmingly informational — *how to write better prompts*, *prompt engineering techniques*, *ChatGPT prompt examples*, *how to structure a prompt* — and they are exactly the queries a prompt tool should own. The product's own repository contains **over 1,000 curated prompt templates** (`content/templates/`, ten batch files plus domain packs for SaaS, agency, finance and product). None of it is published.

That asset is the content strategy. A structured, indexable prompt library — organised by domain and use case, each with an explanation of why the prompt is shaped the way it is — would:
- create hundreds of long-tail entry points,
- match the informational intent that dominates the category,
- demonstrate the product's competence rather than asserting it, and
- give AI assistants something concrete and attributable to cite.

Start with 20–30 of the strongest templates behind a hub page, measure, then scale. Do not bulk-publish 1,000 thin pages — that is a thin-content risk, not a strategy.

---

## HIGH — E-E-A-T signals are almost entirely absent

Google's quality framework asks who is behind the site and why they should be trusted. The site answers almost none of it.

| Signal | Status |
|---|---|
| Named author or team | **Absent** — no bylines, no contributors |
| About page | **Absent** — no company story, mission or background |
| Author credentials | **Absent** |
| Publication / update dates | **Absent** on all content |
| External citations | **Near-absent** — two sitewide (`cnil.fr`, EU ODR), both regulatory boilerplate on legal pages |
| Social proof (testimonials, logos, case studies, counts) | **Absent** |
| Third-party validation (reviews, press, directories) | **Absent** |
| Legal identity | **Present** — `/legal/notice` carries publisher details, registration and hosting |
| Contact route | **Present** — `/contact` with a working form |
| Privacy transparency | **Strong** — a genuinely detailed, GDPR-specific policy |

The legal and privacy pages are a real asset: they are specific, thorough and clearly written by someone who understood the obligations. That is a credible trust signal. But there is no human or organisational identity attached to any of the product or FAQ content.

**Fix, in order of value:**
1. An **About page** — who built this, why, what the approach is. Currently the only place a visitor can learn who publishes the site is the legal notice.
2. **Dates on FAQ articles.** `content/faq.ts` already has a `position` field; add `updatedAt` and surface it. AI systems weight recency, and undated content is discounted.
3. **Authorship** on any guide or library content that gets published.
4. **Social proof** once it genuinely exists — never fabricated.

---

## MEDIUM — `/build` cannot rank as written

53 words of body prose on the primary product page, carrying sitemap priority 0.9 and inbound links from all 8 marketing pages. The internal linking treats it as a key destination; the content does not support that. Covered in `findings/onpage.md`.

---

## MEDIUM — The French translation is written but unpublished

A complete FR translation exists (`lib/i18n/fr.ts`) and renders correctly, but lives at the same URLs as the English and is therefore unindexable. This is finished work earning nothing. See `findings/onpage.md` for the routing fix.

---

## LOW — Duplicate meta descriptions on `/login` and `/signup`

Both inherit the site default. Resolved by the `noindex` fix in `findings/onpage.md`.

---

## What already works

The writing quality is genuinely high, and that is not a small thing — it is the hardest part to fix and it is already done.

- **Clear, specific, human prose.** No filler, no keyword padding, no AI-tell phrasing ("delve", "in today's fast-paced world", "unlock the power of"). Checked across all 22 pages.
- **A concrete value proposition.** "Turn ideas into better prompts" with a worked example on the homepage (`"make me a website for my startup"` → Intent · Context · Structure · Constraints → a finished prompt). The product is explained by demonstration.
- **The FAQ is honest.** Answers state real limits — what happens at quota, what is stored, which models run the engine (named explicitly), how cancellation and refunds work. This is the kind of specificity that earns citations.
- **Consistent facts.** Pricing and quotas were cross-checked across the pricing page, homepage, FAQ and source constants. Everything agrees.
- **No duplicate or near-duplicate pages.** Each of the 12 FAQ articles answers a distinct question.
- **Readable structure.** Short paragraphs, meaningful subheadings, constrained line length. Comfortably readable at a general-audience level.
- **Excellent privacy and terms pages.** Specific, jurisdiction-aware, and far above the template-boilerplate norm.
