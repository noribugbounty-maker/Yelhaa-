# Content Quality & E-E-A-T Report — yelhaa.info

**Analysed** 2026-09-12 · 22 URLs · 4,859 words of body prose (site chrome excluded)

> **Scoring honesty.** The scores below are this skill's own heuristics, not Google-internal signals. No third-party tool has access to Google's ranking data. Search Console is the first-party source; treat everything here as a prioritisation aid, not a measurement of how Google actually rates the site.

---

## Content Quality Score: 52/100

## E-E-A-T Breakdown

| Factor | Score | Key signals |
|---|---|---|
| **Experience** | **5/20** | No original research, case studies, or first-hand data. No process documentation beyond the homepage demo. 1,000+ prompt templates exist in the repo, unpublished. |
| **Expertise** | **9/25** | Zero named humans anywhere — no bylines, no bios, no About page. Offsetting: genuine technical specificity (names the actual model, explains the pipeline honestly). |
| **Authoritativeness** | **5/25** | Two outbound citations sitewide, both regulatory boilerplate. No press, recognition, testimonials, or third-party validation. New domain. |
| **Trustworthiness** | **24/30** | The site's strongest dimension by a wide margin — full verifiable legal identity, detailed GDPR policy, real contact routes, HTTPS with excellent headers. |

**Total: 43/100.** Weights follow Google's stated hierarchy (trust most important); Google publishes no numeric weights, so the 30/25/25/20 split is this skill's model.

## AI Citation Readiness: 40/100

---

## Google's Who / How / Why test

| Question | Answer | Verdict |
|---|---|---|
| **Who** created it? | Nobody is named. No byline, no bio, no About page, no team page, no `Person` schema. The only human trace on the entire site is the email `fondateur@yelhaa.info` buried in the legal notice — a role, not a person. | **Fails** |
| **How** was it created? | The FAQ explains how the *product* works ("Your idea is analysed to extract its domain, its style and the concrete facts it contains"), and names the engine (OpenAI, gpt-5-nano by default) — unusually transparent. But nothing discloses how the *content* was made or who edited it. | **Partial** |
| **Why** does it exist? | Clearly to explain and sell a real product. No churn, no word-count padding, no thin pages spun for search. The content is honest about limits. | **Passes** |

Two of three answers are weak, and both weak answers are the same gap: **there is no human or organisation attached to the content**. The legal identity exists but is quarantined on `/legal/notice`; the pages a reader actually lands on carry no provenance at all.

---

## Volume against page-type floors

These are topical-coverage floors, not targets — Google has confirmed word count is not a ranking factor. But every commercial page on this site sits below its floor, several by a wide margin.

| Page | Words | Floor | Gap |
|---|---|---|---|
| `/legal/privacy` | 1,117 | — | — |
| `/legal/terms` | 1,026 | — | — |
| `/faq` | 397 | — | adequate for a hub |
| `/home` | **350** | 500 | **−150** |
| `/legal/notice` | 277 | — | appropriate |
| `/pricing` | **267** | 300 | **−33** |
| `/contact` | 149 | — | appropriate |
| `/faq/*` ×12 | **73–148** | — | thin individually |
| `/build` | **53** | 800 (service page) | **−747** |
| `/login`, `/signup` | 55–64 | — | expected (should be `noindex`) |

**The two legal pages are 2,143 words — 44% of all content on the site.** The privacy policy alone outweighs the homepage, pricing page, `/build` and all twelve FAQ articles combined.

`/build` is the outlier that matters: **53 words** on the page that carries sitemap priority 0.9 and inbound links from all eight marketing pages. The internal linking treats it as a primary destination; there is essentially nothing on it.

---

## Keyword coverage — the category is missing

Sitewide term frequency across 4,859 words:

| Term | Count | Density |
|---|---|---|
| yelhaa | 62 | 1.28% |
| data | 43 | 0.88% |
| account | 42 | 0.86% |
| **prompt** | **41** | **0.84%** |
| idea | 34 | 0.70% |
| generation | 33 | 0.68% |

**"data" and "account" both outrank "prompt" on a prompt engineering site.** That is the legal pages dominating the corpus. The primary product term sits at 0.84%, below the 1–3% natural range.

Category terms are almost entirely absent:

| Term | Occurrences |
|---|---|
| `prompt quality` | 7 |
| `ai model` | 7 |
| `prompt builder` | 3 |
| **`prompt engineering`** | **2** |
| `ai prompt` | 0 |
| `prompt generator` | 0 |
| `prompt optimizer` | 0 |
| `prompt template` | 0 |
| `prompt library` | 0 |
| `chatgpt` | 0 |
| `llm` / `large language model` | 0 |

A tool for engineering prompts mentions "prompt engineering" twice on its entire website, and never mentions ChatGPT, LLMs, or any model family by the name people actually search for. (OpenAI and `gpt-5-nano` do appear, once, in a single FAQ answer.)

This is not a keyword-density problem to fix by sprinkling terms. It is the symptom of the content gap in the next section: there are no pages *about the subject*, only pages about the product.

**Homepage keyword positions** — these are fine: "prompt"/"prompts" appear in the title, the H1 and the first 100 words. "prompt engineering" appears in the first 100 words (the eyebrow text "PROMPT ENGINEERING, DONE PROPERLY") but not in the title or H1.

---

## HIGH — 1,000+ prompt templates are sitting unpublished

`content/templates/` contains ten batch files (`yelhaa-prompts-0001-0100.md` through `0901-1000.md`), a curated "gold" batch, domain packs for SaaS, agency, finance and product, plus a variable schema.

Category search intent is overwhelmingly informational — *how to write better prompts*, *prompt engineering techniques*, *ChatGPT prompt examples*. This library is exactly that content, already written.

Publishing it addresses, in one move: the volume gap, the keyword gap, the Experience score (first-hand, proprietary material), the topical-authority gap, and the "nothing to cite" problem for AI search.

**Do it incrementally.** Start with 20–30 of the strongest templates behind a hub page organised by domain. Each entry needs the prompt *plus the reasoning* — why it is structured that way, what it fixes, what changes in the output. A bare template is thin content; an explained template is a genuine resource and is what AI systems quote. Measure indexation and impressions, then scale. Do not bulk-publish 1,000 pages — that is a scaled-content risk, not a strategy.

## HIGH — No authorship anywhere

Scanned all 22 pages: zero bylines, no `rel="author"`, no `<meta name="author">`, no `Person` schema, no About page, no team page. (An automated byline scan returned 21 matches — all prose false positives like "by Stripe", "by default", "by French law".)

**Fix, in order:** an About page naming who built this and why; `Person`/`ProfilePage` schema on it (template in `generated-schema.json`); bylines on any library or guide content published under item 1.

## HIGH — No dates outside the legal pages

| Signal | Where |
|---|---|
| "Last updated: 12 August 2026" | `/legal/notice`, `/legal/privacy`, `/legal/terms` — all three |
| ISO dates, `<time>` elements, `datetime` attributes | **none anywhere** |
| Any date on the homepage, FAQ hub, or 12 FAQ articles | **none** |

The legal pages are properly dated. Nothing a reader actually lands on is. AI systems weight recency and discount undated content, and Google's freshness signals cannot read a date that isn't there.

`content/faq.ts` already has a `position` field per article — add `updatedAt` alongside it and render it. That single field also fixes the unreliable `lastmod` in `sitemap.ts` (currently `new Date()` at build time, identical for all 20 URLs).

## MEDIUM — Two outbound citations, both regulatory

The only external links on the site are `cnil.fr` and `ec.europa.eu/consumers/odr`, on the privacy and terms pages. Both appropriate and authoritative — but they are compliance boilerplate, not editorial sourcing. No content page cites anything.

Citing real sources (model documentation, published research on prompting techniques, benchmark results) is a straightforward Authoritativeness gain and is expected in this category.

## MEDIUM — No multimedia

Zero `<img>` elements sitewide; all graphics are inline SVG or CSS. Clean from a performance standpoint — no alt-text debt, no image weight — but it also means no diagrams, no annotated screenshots, no before/after comparisons, no charts.

For a product whose value is "the difference between a vague prompt and a structured one," a side-by-side visual of exactly that would carry more weight than several paragraphs. The homepage animation gestures at it; a static, linkable, quotable version would work harder.

## LOW — Duplicate meta descriptions on `/login` and `/signup`

Both inherit the site default — the only duplicates across 22 URLs. Resolved by the `noindex` fix in `findings/onpage.md`.

---

## Readability

| Group | Words | Avg sentence | Flesch | Grade |
|---|---|---|---|---|
| FAQ articles (12) | 73–148 | 7.3–13.2 | **61.9–80.1** | 3.9–7.3 |
| `/faq` hub | 397 | 14.2 | 60.1 | 8.4 |
| `/contact` | 149 | 12.4 | 74.4 | 6.0 |
| `/build` | 53 | 13.2 | 70.5 | 6.7 |
| `/pricing` | 267 | 13.3 | 48.2 | 9.9 |
| `/` homepage | 350 | 11.3 | 46.5 | 9.6 |
| Legal pages | 277–1,117 | 13.2–13.9 | 32.8–46.0 | 10.3–12.0 |
| **Sitewide** | **4,859** | **12.8** | **52.6** | **9.1** |

*(Flesch is a content-quality indicator, not a ranking factor — Google has confirmed it does not use readability scores for ranking.)*

**The FAQ articles are the best-written content on the site**, landing at 62–80 Flesch, squarely in and above the 60–70 general-audience target, at grade 4–7. Marketing and legal pages score lower, which is normal for those genres.

Average sentence length is 12.8 words sitewide — shorter than the 15–20 guideline, which here reads as deliberate and punchy rather than choppy. 43 sentences exceed 25 words, and 22 of those are in the legal pages.

---

## AI content assessment — clean

| Check | Result |
|---|---|
| QRG filler score | **0** across every page |
| QRG AI-pattern score | **0** across every page |
| AI-typical phrasing swaps needed | **0** (`content_humanize.py` over the full corpus) |
| Invisible/zero-width characters | **none** — scanned all 22 pages for ZWSP, ZWNJ, ZWJ, directional marks/overrides, BOM, word-joiner, Unicode tag chars |
| Generic phrasing, repetitive structure | not detected |
| Factual accuracy | verified — prices and quotas agree across `/pricing`, the homepage, `/faq/plans-and-quotas` and `lib/config.ts` |

Per-page QRG quality on clean prose: `/legal/privacy` 93, `/build` 89, `/` 83, `/pricing` 80, `/faq` 75, FAQ articles ~68 (marked down for thinness, not for quality).

*(Scope note: statistical watermarks of the SynthID kind live in token probabilities, not codepoints. No tool reliably detects them, and this scan makes no claim about them.)*

**Nothing here reads as low-quality or scaled content.** Whoever wrote this site wrote it deliberately.

---

## AI Citation Readiness: 40/100

| Signal | Status |
|---|---|
| AI crawler access | **Full** — GPTBot, OAI-SearchBot, ClaudeBot, Claude-SearchBot, PerplexityBot, Bytespider, CCBot, Google-Extended, Applebot-Extended all receive 200 |
| Content in server HTML | **Yes** — no JS execution needed, which most AI crawlers cannot do |
| Answer-first Q&A formatting | **Yes** — question as `<h1>`, direct answer immediately after |
| Heading hierarchy | **Clean** — no level skips |
| Comparative tables/lists | **Partial** — pricing comparison and FAQ lists |
| Quotable statistics / first-party data | **Weak** — the only hard numbers are prices and quotas |
| Entity clarity | **Weak** — no `sameAs`, no `Person`, no About page |
| Attribution and source citations | **Weak** — two regulatory links |
| Freshness signals | **Absent** outside the legal pages |
| Topical authority / content clusters | **Absent** — isolated pages, no depth in any subject |
| Citable URL | **Broken** — canonicals resolve to `http://localhost:3000` |

The structural foundations are genuinely good and the access is wide open. What is missing is substance to cite, provenance to attribute it to, and a URL that resolves.

**Note on markup:** adding `FAQPage` is *not* a lever here — Google retired FAQ rich results for all sites on 2026-05-07 and any AI-citation benefit is unconfirmed. Per Google's own generative-AI guidance, AEO/GEO is rebranded SEO: no AI-specific files, markup, chunking or rewrites are needed. See `SCHEMA-REPORT.md`.

---

## Priority recommendations

| # | Action | Effort | Impact |
|---|---|---|---|
| 1 | Publish 20–30 explained prompt templates from `content/templates/` behind a hub | 2–4 weeks | Volume + keywords + Experience + topical authority + citability |
| 2 | Add an About page naming who built this, with `Person`/`ProfilePage` schema | 1 day | Who-test, Expertise, entity clarity |
| 3 | Expand `/build` from 53 to 600–900 words | 4–6 h | Primary commercial page currently cannot rank |
| 4 | Add `updatedAt` to `content/faq.ts` and render dates on FAQ articles | 2 h | Freshness; also fixes sitemap `lastmod` |
| 5 | Publish the existing French translation on its own URLs | 1–2 weeks | Roughly doubles indexable content — already written |
| 6 | Add real outbound citations on content pages | ongoing | Authoritativeness |
| 7 | Add a before/after prompt comparison visual | 1 day | Demonstrates the core value proposition |

Items 1, 2, 4 and 5 are all publishing or surfacing work that already exists in the repository. The content problem here is less about writing more than about shipping what is already written.

---

## What already works

- **Genuinely well-written prose.** Zero filler, zero AI-pattern matches, zero invisible characters, no generic phrasing. This is the hardest thing to fix and it is already done.
- **Trustworthiness is close to exemplary** — verifiable French legal identity (Yelhaa AI, SARL, share capital €1,500,700.00, SIREN 449 759 992, SIRET, EU VAT FR94449759992, registered office, telephone, founder email). SIREN and VAT are checkable against public registries. Very few early-stage sites publish this much.
- **A detailed, jurisdiction-aware privacy policy** that names the CNIL and the EU ODR platform and explains legal bases, retention and rights properly.
- **The FAQ is honest and specific** — it names the actual model running the engine, states what happens at quota, what is stored, and how refunds work. Specificity of this kind is exactly what earns citations.
- **Excellent readability where it matters most** — FAQ articles at 62–80 Flesch, grade 4–7.
- **Clean structure** — one descriptive `<h1>` per page, no heading skips, short paragraphs, scannable sections.
- **Factually consistent** across every page and against the source constants.
- **No thin-content spam patterns** — 12 FAQ articles, each answering a genuinely distinct question, none spun for search.
- **The "Why" test passes cleanly.** This content exists to explain a real product to real users, not to catch search clicks.
