# GEO / AI Search Analysis — yelhaa.info

**Analysed** 2026-09-12 · 22 URLs · 18 AI user-agents tested

> **Framing.** Per Google's own AI optimization guide, optimizing for generative AI search **is SEO** — "AEO" and "GEO" are rebranded labels for the same work. Google explicitly rejects `llms.txt`, content chunking, AI-specific rewrites and mention-farming as levers. Everything below is SEO fundamentals applied to AI-search surfaces. Scores are this skill's heuristics, not Google-internal signals.

---

## GEO Readiness Score: 48/100

| Factor | Weight | Score | Weighted |
|---|---|---|---|
| Citability | 25% | 45 | 11.3 |
| Structural readability | 20% | 85 | 17.0 |
| Multi-modal content | 15% | 15 | 2.3 |
| Authority & brand signals | 20% | 15 | 3.0 |
| Technical accessibility | 20% | 70 | 14.0 |
| **Total** | | | **48** |

*(The content report cited 40/100 for "AI Citation Readiness" — that was a rough judgement; this is the skill's explicit five-factor model. Same findings, different instrument.)*

**The shape:** technical access and page structure are close to ideal. What is missing is anything to cite, anyone to attribute it to, and a URL that resolves.

---

## Platform breakdown

| Platform | Score | Why |
|---|---|---|
| **Google AI Overviews** | 25/100 | Strongly ranking-correlated (92% of citations come from top-10 pages). The site does not rank — new domain, sitemap rejected, canonicals pointing at localhost. Fix indexing first; AIO follows ranking. |
| **Google AI Mode** | 20/100 | Weaker ranking correlation and a broader pool (~9 domains per query), but it weights **freshness and entity authority** — the site's two weakest signals. No dates outside legal pages, no entity presence anywhere. |
| **ChatGPT Search** | 15/100 | Cites Wikipedia (47.9%) and Reddit (11.3%) heavily. Zero presence on either. `OAI-SearchBot` is allowed, so the door is open and the room is empty. |
| **Perplexity** | 15/100 | Cites Reddit (46.7%) and Wikipedia most. Zero presence. `PerplexityBot` allowed. |
| **Bing Copilot** | 20/100 | Draws on the Bing index. Site not submitted to Bing Webmaster Tools, and IndexNow is not implemented. |

AI Mode and AI Overviews reach the same conclusion ~86% of the time but cite the same URLs only **13.7%** of the time — they are separate citation engines and are scored separately above, even though Google merged them into one UX flow at I/O 2026.

---

## AI crawler access — every agent tested returns 200

**Training-data crawlers** — these govern whether content may be used to train models. They say nothing about search citability.

| Crawler | Status | Governs |
|---|---|---|
| `GPTBot` | 200 allowed | OpenAI **model training only** |
| `ClaudeBot` | 200 allowed | Anthropic **model training only** |
| `Google-Extended` | 200 allowed | Gemini / Vertex **training & grounding only** |
| `Applebot-Extended` | 200 allowed | Apple Intelligence **training opt-out signal only** |
| `CCBot` | 200 allowed | Common Crawl dataset |
| `Bytespider` | 200 allowed | ByteDance training |
| `cohere-ai` | 200 allowed | Cohere models |
| `meta-externalagent` | 200 allowed | Meta AI training |
| `Amazonbot` | 200 allowed | Amazon |
| `Google-CloudVertexBot` | 200 allowed | Site-owner-requested Vertex crawls |

**Search-citability crawlers** — these are the ones that determine whether AI search can cite the site. **This is the set that matters for visibility.**

| Crawler | Status | Governs |
|---|---|---|
| `OAI-SearchBot` | **200 allowed** | **ChatGPT Search citability** |
| `Claude-SearchBot` | **200 allowed** | **Claude search citability** |
| `PerplexityBot` | **200 allowed** | Perplexity AI search |
| `Googlebot` | **200 allowed** | Google Search, **AI Overviews and AI Mode** |
| `bingbot` | **200 allowed** | Bing index → Copilot |
| `Applebot` | **200 allowed** | Siri, Spotlight, Safari discoverability |

**User-triggered fetchers** (ignore robots.txt by design; blockable only server-side): `ChatGPT-User` 200, `Claude-User` 200, `Google-Agent` 200, `Google-NotebookLM` 200.

`robots.txt` contains **no AI-specific directives** at all. Its disallow list covers only genuinely private routes.

**Verdict: nothing is blocked, and every search-citability crawler is open.** Note that AI Overviews and AI Mode eligibility is governed by `Googlebot`, not `Google-Extended` — so the training-crawler settings are irrelevant to Google AI visibility either way.

### Snippet controls — full eligibility

There is no AI-specific opt-out file; AI-feature appearance is governed by standard preview directives. All absent:

```
nosnippet · data-nosnippet · max-snippet · noarchive
noimageindex · max-image-preview · X-Robots-Tag header
```

Nothing restricts snippet length or preview generation. The site is fully eligible for AI Overviews and AI Mode surfacing.

**This is a permissive default rather than a decision.** It happens to be the right posture. But it is worth making deliberate: if the 1,000+ prompt templates are published, whether *training* crawlers (`GPTBot`, `Google-Extended`, `CCBot`, `ClaudeBot`) get that library is a licensing question, entirely separate from citability. Blocking them would not affect ChatGPT Search, Claude search, Google Search, AI Overviews or AI Mode.

---

## Server-side rendering — passes

**The single most important technical GEO check, and the site passes it cleanly.** AI crawlers do not execute JavaScript (unlike Googlebot). Verified by fetching with curl and no JS: the homepage `<h1>`, all body copy, and all JSON-LD are present in the initial HTML response.

A Next.js App Router site can easily fail here. This one is SSR throughout, `is_spa: false`, no dynamic rendering, no CSR-only content.

*Two caveats, both minor:*
- Content arrives inside React streaming containers (`<div hidden id="S:n">` + `$RC()` scripts). The text is in the response bytes and any tag-stripping extractor finds it, but extractors filtering on computed visibility may skip `hidden` containers. Inherent to React streaming SSR; not worth restructuring for.
- The route loader's screen-reader text means **"Loading…" is the first text string on every page** for a naive extractor. Trivial, but it is the first thing a text-based crawler reads. Consider `aria-live` without the visible `sr-only` string, or placing it after the heading.

---

## Brand mention analysis — zero presence

Brand mentions correlate roughly **3× more strongly with AI visibility than backlinks** (Ahrefs, 75,000 brands): YouTube ~0.737, Reddit high, Wikipedia high — against Domain Rating at ~0.266.

Searched for the brand, the domain, and the legal entity:

| Platform | Presence |
|---|---|
| Wikipedia / Wikidata | **None** |
| Reddit | **None** |
| YouTube | **None** |
| LinkedIn | **None** |
| Industry directories / roundups | **None** — absent from every "best prompt engineering tools 2026" listicle found |
| Press / news | **None** |
| Any web mention of "Yelhaa" | **None found** |

Searches for `"Yelhaa" prompt engineering AI tool`, `"yelhaa.info" OR "Yelhaa AI" SARL`, and `Yelhaa reddit OR youtube OR linkedin` returned **no results referencing this brand at all**. The web does not know this company exists.

**This is the binding constraint on AI visibility, and no on-site change fixes it.** ChatGPT draws ~48% of citations from Wikipedia and ~11% from Reddit; Perplexity draws ~47% from Reddit. A brand with no footprint on either is structurally very unlikely to be cited, regardless of how good its own pages are.

It is also the one finding here that is *expected* for a site this new — and the one that takes longest to change, which is why it should start now rather than after the on-site work.

---

## Passage-level citability

Optimal citation block is **134–167 words**, and ~44% of AI citations come from the **first 30% of a page**.

**Front-loading: strong.** The FAQ articles do this correctly — question as `<h1>`, direct answer immediately after. First 30% of `/faq/what-is-yelhaa` reads:

> "Yelhaa turns an idea written in plain language into a structured prompt, then opens…"

That is a textbook answer-first opening. Same pattern on all twelve.

**Passage length: too short.** Almost nothing lands in the optimal band.

| Page | Words | In 134–167 band |
|---|---|---|
| `/contact` | 154 | yes |
| `/faq/cancel-subscription-and-refunds` | 148 | yes |
| `/faq/what-happens-to-what-i-write` | 117 | no — short |
| `/faq/what-happens-when-i-hit-my-quota` | 105 | no — short |
| `/faq/plans-and-quotas` | 102 | no — short |
| Remaining 8 FAQ articles | 73–89 | no — short |
| `/build` | 53 | no — far short |

Ten of twelve FAQ articles fall **below** the band, most by 50–60 words. The structure is right; the answers stop too early. Extending each to ~140 words — a worked example, a concrete number, an edge case — would move them into the band without padding.

**Definition patterns: weak.** Only four "X is…" constructions sitewide, and two describe internal jargon ("A generation is one complete run of the engine"). **There is no definition of prompt engineering anywhere on the site** — the category the product sells into is never defined. That is a straightforward, high-value gap: "Prompt engineering is…" in the first 60 words of `/build` or a new guide page is exactly the pattern AI systems extract.

**Quotable data: pricing only.** Every hard number on the site is a price, a quota, or a GDPR statutory figure. No performance data, no benchmarks, no research. Nothing an AI system would cite as evidence about prompting.

---

## Citations would resolve to localhost

Every canonical, `og:url` and schema `url` names `http://localhost:3000`. An AI system that decides to cite Yelhaa has no correct URL to attribute it to.

This nullifies AI-visibility work until fixed, and it is a five-minute fix. See `findings/technical.md`.

---

## llms.txt — absent, and that is fine

`https://yelhaa.info/llms.txt` returns 404.

**No weight assigned, and it is not recommended as a lever.** Google's AI optimization guide (introduced 2026-05-15, clarified 2026-06-15) states plainly that `llms.txt` and other AI-text files are **not needed for Google Search and neither help nor hurt visibility or rankings**. Mueller and Illyes have said the same; a 300k-domain SE Ranking study and an OtterlyAI server-log audit found no evidence of major AI systems fetching it.

It may serve non-Google systems, and it costs almost nothing. But it must not displace real work — and community advice recommending it as a GEO lever contradicts Google's primary source.

## RSL 1.0 — not implemented

No `/license.xml`, `/.well-known/rsl.xml`, `/rsl.xml`, `Link rel="license"`, or robots.txt licensing directive.

Relevant only as a licensing decision, not a visibility one. Worth considering **if** the prompt-template library is published and the company wants machine-readable terms on it.

---

## Top 5 highest-impact changes

### 1. Fix the origin so citations can resolve · 5 min
`NEXT_PUBLIC_SITE_URL=https://yelhaa.info` in Vercel, then redeploy. Everything else in this document is worthless while attribution points at a laptop.

### 2. Build brand presence off-site · ongoing, start now
The binding constraint. In rough order of correlation strength:
- **YouTube** (~0.737, strongest single signal) — short demos of the product turning a vague prompt into a structured one
- **Reddit** — genuine participation in r/PromptEngineering, r/ChatGPT and similar. Contribute answers, not links; astroturfing is both against Google's guidance and reliably counterproductive
- **LinkedIn** — a company page at minimum, so `Organization.sameAs` has something real to point at
- **Directories** — the "best prompt engineering tools" roundups the site is currently absent from

Google explicitly calls mention-farming unhelpful. The goal is being genuinely present where the category is discussed, not manufacturing mentions.

### 3. Publish the prompt library with dates and bylines · 2–4 weeks
1,000+ templates sit unpublished in `content/templates/`. This is simultaneously the fix for citability (unique first-party material), topical authority (clusters instead of isolated pages), Experience (E-E-A-T), and freshness. Start with 20–30, each with the reasoning behind the prompt. Content under 3 months old is ~3× more likely to be cited; pages stale 6+ months lose eligibility — so a **scheduled refresh program** matters as much as the initial publish.

### 4. Add dates and authorship · 1–2 days
No dates exist outside the three legal pages; no author is named anywhere. Both are direct AI-citation signals. Add `updatedAt` to `content/faq.ts` and render it; add an About page with `Person`/`ProfilePage` schema.

### 5. Extend FAQ answers into the 134–167 word band and define the category · 1 week
Ten of twelve articles are 50–60 words short of optimal. Add a worked example or a concrete number to each. Separately, add a real "Prompt engineering is…" definition — the site currently never defines the thing it sells.

---

## Schema recommendations for AI discoverability

Full markup in `generated-schema.json`. For AI discoverability specifically:

- **`Organization.sameAs`** — the entity-linking field. Currently absent, and currently there is nothing real to point it at, which is itself the finding. It becomes valuable the moment item 2 above produces profiles.
- **`Person` / `ProfilePage`** — authorship for the About page and any published guides.
- **`Article`** — for prompt-library entries, with genuine `datePublished` / `dateModified`.
- **Not `FAQPage`.** Google retired FAQ rich results for all sites on 2026-05-07 and any AI-citation benefit is unconfirmed. The site's omission is deliberate and correct — see `SCHEMA-REPORT.md`.

---

## Content reformatting suggestions

**`/build` (53 words)** — open with a definition in the first 60 words:
> "Prompt engineering is the practice of structuring an instruction so a model returns what you actually wanted. Yelhaa's prompt builder does this automatically: you describe an idea in plain language, and it returns a prompt with explicit intent, context, structure and constraints."

Then a worked before/after, then who it is for. Target 600–900 words.

**FAQ articles** — keep the answer-first opening, then extend to ~140 words with one worked example and one concrete number each. `/faq/why-prompt-quality-matters` (88 words) is the highest-value one to extend: it is the category-defining question and currently the thinnest treatment of it.

**Homepage** — the animated "Analyzing intent… / Structuring context… / Optimizing instructions…" sequence demonstrates the pipeline but is not extractable text. A static, quotable version of the same three steps would be citable.

**Everywhere** — add a real before/after prompt comparison as text (not only animation). It is the single most quotable artefact this product could publish, and it currently exists only as motion.

---

## What already works

- **Every search-citability crawler is allowed** — `OAI-SearchBot`, `Claude-SearchBot`, `PerplexityBot`, `Googlebot`, `bingbot`, `Applebot` all return 200
- **Server-side rendering throughout** — content readable without JS execution, which most AI crawlers require
- **No snippet restrictions** — full AI Overviews and AI Mode eligibility
- **Answer-first FAQ architecture** — question as `<h1>`, direct answer immediately after, one question per URL. This is the ideal shape and it is already built
- **Clean heading hierarchy** — no level skips, question-based headings matching real query patterns
- **Short paragraphs**, comfortable readability (FAQ articles 62–80 Flesch)
- **Factual consistency** across all pages — no contradictory signals for an extractor to trip on
- **Genuine specificity** in the FAQ — names the actual model, states real quota behaviour, explains what is stored. Specificity is what gets quoted
- **No content gated** behind interaction, cookie walls or consent banners
- **Verifiable organisational credentials** — SIREN, SIRET and EU VAT are checkable against public registries, a real trust signal even though it is not yet surfaced in schema
