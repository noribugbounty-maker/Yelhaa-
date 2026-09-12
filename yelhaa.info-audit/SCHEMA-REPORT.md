# Schema Markup Report — yelhaa.info

**Scanned** 2026-09-12 · 22 URLs · JSON-LD, Microdata and RDFa

---

## Correction to the 2026-09-11 audit

**I told you to add `FAQPage` schema and ranked it as the highest-value schema and GEO fix on the site. That was wrong — do not do it.**

Google **retired FAQ rich results for all sites on 2026-05-07**. This superseded the August 2023 gov/health restriction: no site gets the SERP feature any more. The FAQ documentation carried a deprecation notice on 2026-05-08 and was removed on 2026-06-15. Any AI-citation benefit is unconfirmed and should not be claimed.

The absence of `FAQPage` on this site was not an oversight. `components/seo/json-ld.tsx` documents the decision:

> **Pas de `FAQPage`.** Google a retiré les rich results FAQ pour tous les sites le 7 mai 2026 : la fonctionnalité SERP n'existe plus, et rien ne démontre de bénéfice de citation par les moteurs de réponse. En ajouter reviendrait à empiler du balisage sans contrepartie.

That reasoning is correct and current. I recommended reversing a deliberate, well-documented, right decision because I did not check the type's status before calling it a gap.

**`QAPage` is not the substitute either.** It is reserved for genuine user Q&A pages where visitors submit answers. The `/faq/[slug]` pages are publisher-authored single answers with no user submissions, so `QAPage` would misdescribe them.

**Net effect on the plan:** the "add FAQ schema" item is withdrawn from Phase 2. The schema work that remains is smaller and is listed below. Affected files (`findings/schema.md`, `findings/geo.md`, `FULL-AUDIT-REPORT.md`, `ACTION-PLAN.md`, `audit-data.json`) have been corrected.

---

## Detection results

| Format | Count | Notes |
|---|---|---|
| JSON-LD | **16 blocks** across 15 pages | Google's preferred format — correct choice |
| Microdata (`itemscope`) | 0 | — |
| RDFa (`typeof`) | 0 | — |

No format mixing, no conflicting duplicate markup. All JSON-LD is **server-rendered in the initial HTML**, which is right under Google's December 2025 guidance that JS-injected structured data faces delayed processing.

### Coverage by page

| Page | Types | Status |
|---|---|---|
| `/` | `Organization`, `WebSite` | ⚠️ localhost URLs |
| `/pricing` | `SoftwareApplication` + 3 `Offer` | ⚠️ localhost URLs |
| `/faq/*` ×12 | `BreadcrumbList` | ⚠️ localhost URLs |
| `/faq` | — | none |
| `/build` | — | none |
| `/contact` | — | none |
| `/legal/notice`, `/legal/privacy`, `/legal/terms` | — | none |
| `/login`, `/signup` | — | none (correct — these should be `noindex`) |

---

## Validation results

| Schema | Type | Status | Issues |
|---|---|---|---|
| Homepage | `Organization` | ⚠️ | 2 localhost URLs (`url`, `logo`); missing `sameAs`, `contactPoint`, `description` |
| Homepage | `WebSite` | ⚠️ | 1 localhost URL (`url`) |
| Pricing | `SoftwareApplication` | ⚠️ | 4 localhost URLs; missing `description`; offers not wrapped in `AggregateOffer` |
| FAQ ×12 | `BreadcrumbList` | ⚠️ | 3 localhost URLs each (36 total); structure otherwise correct |

**Syntax: clean.** Every block parses without error. No missing `@context`, no invalid `@type`, no wrong data types, no placeholder text, no relative URLs, no malformed dates, no deprecated types.

**The only validation defect is the host.** 43 URL values across 15 pages point to `http://localhost:3000`:

```
Organization.url                            → http://localhost:3000
Organization.logo                           → http://localhost:3000/brand/picto.svg
WebSite.url                                 → http://localhost:3000
SoftwareApplication.url                     → http://localhost:3000/pricing
SoftwareApplication.offers[0..2].url        → http://localhost:3000/pricing
BreadcrumbList.itemListElement[0..2].item   → http://localhost:3000/... (×12 pages)
```

`Organization.logo` must resolve to a fetchable image for Google to use it; it cannot, so the logo is dropped and the entity is not associated with the domain. The 36 breadcrumb URLs are new detail — yesterday's audit recorded `BreadcrumbList` as correctly implemented, which is true structurally, but its URLs are contaminated like everything else.

**This is not a schema bug.** The generators already build every URL through `absoluteUrl()`; the input is wrong. It resolves entirely when `NEXT_PUBLIC_SITE_URL` is fixed — no changes to `json-ld.tsx` required for this item.

---

## Recommendations

Ready-to-paste JSON-LD for all of these is in `generated-schema.json`.

### HIGH — Fix the origin (no schema code change)
Set `NEXT_PUBLIC_SITE_URL=https://yelhaa.info` in Vercel Production and redeploy. Clears all 43 URL defects at once. Details in `findings/technical.md`.

### MEDIUM — Complete the `Organization` entity
Currently `name`, `url`, `slogan`, `logo`. Add `description`, `contactPoint`, and — most importantly — `sameAs`, which is how Google links the site to its social profiles and disambiguates the brand. `lib/config.ts` already reads `NEXT_PUBLIC_URL_X`, `NEXT_PUBLIC_URL_GITHUB`, `NEXT_PUBLIC_URL_LINKEDIN` and others from the environment; populate `sameAs` from whichever are set, filtering empties. Leave it `[]` until real profiles exist.

Consider mirroring the real publisher details already written on `/legal/notice` (company name, registration, registered office) — they are verifiable and strengthen the entity.

### MEDIUM — Add `description` and `AggregateOffer` to `SoftwareApplication`
Wrapping the three existing `Offer` objects in `AggregateOffer` with `lowPrice: 0` / `highPrice: 39.99` / `offerCount: 3` makes the price range machine-legible. Keep generating them from `PLANS` so they cannot drift from the visible page.

**Do not add `aggregateRating`** until genuine, verifiable ratings are displayed on the page. Marking up ratings users cannot see is a structured-data violation and risks a manual action.

### MEDIUM — Extend `BreadcrumbList` beyond the FAQ
`BreadcrumbList` is an active type with a live rich result, and `FaqBreadcrumbJsonLd()` already implements it correctly. Generalise it and apply to `/pricing`, `/build`, `/contact` and the three `/legal/*` pages. Modest, reliable SERP presentation gain.

### LOW — `ContactPage` on `/contact`
Active type, accurate for the page, trivial to add.

### FUTURE — types worth adding when the content exists
- **`Article`** on prompt-library entries and guides when `content/templates/` ships. This is where the real schema upside is — see `findings/content.md`.
- **`ProfilePage` + `Person`** on an About page. Directly supports the E-E-A-T gap: the site currently has no authorship or named-human signal anywhere.

Templates for both are in `generated-schema.json` with placeholders clearly marked. Replace them with real values — do not publish invented names or dates.

---

## Types deliberately not recommended

| Type | Reason |
|---|---|
| `FAQPage` | Rich results retired for all sites 2026-05-07. No SERP benefit; AI-citation benefit unconfirmed. Correctly absent — see the correction above. |
| `QAPage` | For genuine user Q&A where visitors submit answers. Would misdescribe publisher-authored FAQ answers. |
| `HowTo` | Rich results removed September 2023. |
| `AggregateRating` | No real ratings exist or are displayed. Fabricating them risks a manual action. |
| `Product` | Not applicable to SaaS — `SoftwareApplication` is the correct type and is already in use. |
| `LocalBusiness` | No physical location or service area. |

---

## What already works

- **JSON-LD chosen over Microdata/RDFa** — Google's stated preference, and applied consistently with no format mixing
- **Server-rendered, not JS-injected** — verified identical in raw HTML and rendered DOM, so no delayed processing and no canonical-style conflict
- **Zero syntax errors** across all 16 blocks
- **No deprecated types** anywhere — and `FAQPage` was correctly and deliberately excluded with the reasoning documented in code
- **`BreadcrumbList` correctly structured** on all 12 FAQ articles: proper `position` sequence, `name` and `item` on every `ListItem`
- **Markup matches visible content** — prices, currencies and plan names in `SoftwareApplication` agree exactly with the pricing page, the homepage and `/faq/plans-and-quotas`
- **Generated from shared constants** (`SITE`, `PLANS`) rather than hand-written per page, so the markup cannot drift from the UI
- **Nothing over-claimed** — no ratings, no reviews, no invented properties. The code comment states the principle directly: markup describing an imaginary page is a penalty risk, not a gain.

The schema on this site is thoughtfully built. Once the origin is corrected, the remaining work is additive rather than remedial.

---

## Validation after the fix

```bash
curl -s https://yelhaa.info/ | grep -o 'application/ld+json.*' | head -1
```

Then run both:
- https://validator.schema.org/ — syntax and vocabulary
- https://search.google.com/test/rich-results — Google's own eligibility view (expect `BreadcrumbList` to be reported; `Organization` and `SoftwareApplication` are entity-understanding markup rather than rich-result types, so their absence from the report is normal)
