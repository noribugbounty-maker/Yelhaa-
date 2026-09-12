# Search Experience Optimization (SXO) — Findings

SERP-backwards analysis: what page type actually ranks for the target queries, versus what the site offers.

---

## Why this matters here

Every other finding in this audit is about making the site *work* — canonicals, schema, content depth. SXO asks a different question: **even fully fixed, would these pages satisfy the searcher who lands on them?**

For Yelhaa the answer is currently no, for two different reasons in two different query clusters. This is the finding most likely to be missed, because nothing is broken — the pages are simply aimed at intents the SERP is not serving.

---

## Cluster 1 — Transactional: "ai prompt generator", "free prompt generator"

**What ranks** (live SERP check, 2026-09-12):

| Result | Positioning |
|---|---|
| TripleTen | "totally free with no sign-up required" |
| GeneratePrompt.net | "no sign-up and unlimited use" |
| Feedough | "Unlimited & No Login" |
| Promptsera | "100% free… no login required" |
| Quillbot | free tool, paste-and-go |
| ryrob | "free AI prompt generator" |

**Every single result on this SERP leads with free, unlimited, and no signup.** That is the promise the query has been trained to expect.

**What Yelhaa offers:** 3 generations per month on the free tier, behind an account. `/build` is 53 words and the primary CTA is "Start building" → authentication.

### HIGH — Offer mismatch, not a page problem

This is not fixable by rewriting `/build`. A searcher arriving from this cluster meets a quota and a signup wall where the SERP promised unlimited and no login. Expected outcome: high bounce, and over time the behavioural signals that keep a page out of the top ten.

Three honest options, in order of my preference:

1. **Let the first generation run without an account.** Capture the email after the user has seen the output, not before. The FAQ already promises "the idea you typed is kept through the whole authentication step" — the plumbing for this exists. This makes the transactional cluster winnable without changing the pricing model.
2. **Compete on quality, not access.** Target qualified variants instead — "prompt optimizer for developers", "structured prompt builder", "prompt engineering tool for teams" — where a signup is normal and depth is the differentiator. Lower volume, far better fit.
3. **Accept the cluster is not winnable** and put the effort into Cluster 2.

Option 1 is the only one that competes head-on. Options 2 and 3 are legitimate strategy; what is not legitimate is optimising `/build` for a query whose SERP promises something the product does not offer.

---

## Cluster 2 — Informational: "how to write better prompts", "prompt engineering guide"

**What ranks** (live SERP check, 2026-09-12):

| Result | Type |
|---|---|
| learnprompting.org | Long-form documentation |
| eWeek | Cheat sheet / editorial guide |
| IABAC | Guide with worked examples |
| MoreOnlineTools | "Complete Guide (2026)" |
| GPT Central (Substack) | Step-by-step guide |

100% long-form editorial. No product pages, no tool landing pages. These results cover few-shot prompting, iteration, step-by-step reasoning, persona assignment — techniques, with examples.

**What Yelhaa offers:** nothing. There is no content of this type on the site. `/build` (53 words) is not a competitor in this SERP; it is a different category of page.

### HIGH — Page-type mismatch: the site has no entry in the cluster that matches its own subject

This is the larger opportunity of the two, and the one the site is best equipped to win:

- The intent is informational, which is where this category's volume concentrates
- The competing pages are guides — a format the site can produce
- **The raw material already exists**: 1,000+ curated templates in `content/templates/`, plus domain packs for SaaS, agency, finance and product
- A tool company explaining the technique carries more credibility than a content site doing the same, *provided* the explanation is real

The corresponding gap in the copy is documented in `CONTENT-REPORT.md`: "prompt engineering" appears twice sitewide, and the site never defines the term.

---

## Persona scoring

Three plausible searchers, scored on whether the current site serves them.

### Persona A — "Casual user, wants a better prompt right now"
*Query: "free ai prompt generator" · Intent: transactional, immediate*

| Stage | Experience | Score |
|---|---|---|
| SERP | Site does not rank | — |
| Landing (`/build`) | 53 words, no explanation of what happens | 3/10 |
| Task | Must create an account; 3/month cap | 2/10 |
| Outcome | Competitors deliver output with no login | **2/10** |

Worst-served persona, and the one the transactional SERP sends. Option 1 above is the fix.

### Persona B — "Developer or team lead evaluating a tool"
*Query: "prompt engineering tool for teams" · Intent: commercial investigation*

| Stage | Experience | Score |
|---|---|---|
| Landing (`/`) | Clear positioning, credible worked example | 8/10 |
| Product understanding | Homepage demo shows the pipeline concretely | 7/10 |
| Pricing | Transparent, three tiers, no hidden terms | 9/10 |
| Trust | Full legal identity, thorough privacy policy, honest FAQ | 9/10 |
| Depth | Nothing on methodology, no docs, no API detail | 4/10 |
| Outcome | Convinced it is legitimate; unsure it is *good* | **7/10** |

**The site's best-served persona by a wide margin.** Everything an evaluator checks for legitimacy is present and unusually well done. What is missing is evidence of competence — which is again the guides and the template library.

### Persona C — "Learner, wants to understand prompting"
*Query: "how to write better prompts" · Intent: informational*

| Stage | Experience | Score |
|---|---|---|
| SERP | No eligible page exists | 0/10 |
| If landed on `/faq` | 12 good answers, but all product-scoped | 4/10 |
| Learning value | No techniques, no examples, no definitions | 2/10 |
| Outcome | Leaves for learnprompting.org | **2/10** |

Largest volume, zero coverage. This is Cluster 2.

---

## User stories the site does not yet satisfy

Derived from the two SERPs above:

1. *As someone with a vague idea, I want to see a better prompt immediately, so I can judge whether the tool is worth an account.* → blocked by the signup wall
2. *As someone learning to prompt, I want worked before/after examples, so I can understand what "better" means.* → no such content
3. *As a developer, I want to know how the engine structures a prompt, so I can trust it with real work.* → the FAQ gestures at this in ~84 words
4. *As a team lead, I want to see prompts for my domain, so I can judge relevance.* → the domain packs exist, unpublished
5. *As an evaluator, I want to know who built this, so I can assess credibility.* → no About page, no named humans

Stories 2, 4 and 5 are all satisfiable with material already in the repository.

---

## Recommendations, in priority order

| # | Action | Cluster | Effort |
|---|---|---|---|
| 1 | Let the first generation run without an account; capture email after the user sees output | 1 | Product decision |
| 2 | Publish 20–30 explained templates as guide-format pages | 2 | 2–4 weeks |
| 3 | Add a real "Prompt engineering is…" definition and a before/after example on `/build` | 2 | 1 day |
| 4 | Expand `/build` to 600–900 words as a genuine tool landing page | 1 | 4–6 h |
| 5 | Add an About page — Persona B's only remaining gap | both | 1 day |

Items 2–5 are content work already scoped elsewhere in this audit. **Item 1 is a product decision, not an SEO fix**, and it is the only one that makes Cluster 1 winnable. Flagging it because the SEO consequence is real; the call is the team's.

---

## What already works

- **Persona B (evaluator) is genuinely well served** — clear positioning, a demo that shows rather than tells, transparent pricing, and trust signals well above the norm for an early-stage product
- **The homepage worked example** (`"make me a website for my startup"` → Intent · Context · Structure · Constraints → finished prompt) is exactly the right idea; it needs to exist as static, linkable text as well as animation
- **Pricing is honest and legible** — no hidden quotas, no dark patterns, plan differences stated plainly
- **The FAQ answers real pre-purchase objections** — quota behaviour, data handling, cancellation, which models run the engine
- **No SERP-to-page deception** — titles and descriptions accurately describe what the pages contain, so there is no bounce risk from mismatched promises
- **The product genuinely does what the category wants**; the gap is in demonstrating it, not in the thing itself
