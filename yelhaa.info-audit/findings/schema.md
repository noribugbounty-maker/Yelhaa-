# Schema / Structured Data — Findings

## Current implementation

| Page | Types present | Valid? |
|---|---|---|
| `/` | `Organization`, `WebSite` | Syntax OK — **all URLs invalid** |
| `/pricing` | `SoftwareApplication` + 3 × `Offer` | Syntax OK — **all URLs invalid** |
| `/faq/*` ×12 | `BreadcrumbList` | Syntax OK |
| `/faq` (hub) | none | Correct — see the FAQPage correction below |
| `/build`, `/contact`, `/legal/*`, `/login`, `/signup` | none | — |

All JSON-LD parses without error — no malformed blocks anywhere.

---

## CRITICAL — Every URL inside the structured data points to localhost

```json
{"@context":"https://schema.org","@type":"Organization","name":"Yelhaa",
 "url":"http://localhost:3000",
 "slogan":"Better prompts. Better AI outputs.",
 "logo":"http://localhost:3000/brand/picto.svg"}

{"@context":"https://schema.org","@type":"WebSite","name":"Yelhaa",
 "url":"http://localhost:3000"}

{"@type":"SoftwareApplication","url":"http://localhost:3000/pricing",
 "offers":[{"@type":"Offer","name":"Pro","price":"9.99","priceCurrency":"USD",
            "url":"http://localhost:3000/pricing","category":"Subscription"}, ...]}
```

`Organization.logo` must be a fetchable image for Google to use it; it cannot fetch this one, so the logo is dropped and the entity is not associated with the domain. The `Offer.url` values are equally unusable.

This resolves automatically once `NEXT_PUBLIC_SITE_URL` is corrected — the generators already build these from `absoluteUrl()`. See `findings/technical.md`. No schema code changes are needed for this item.

---

## CORRECTED 2026-09-12 — `FAQPage` should NOT be added

**The original version of this file ranked "add FAQPage schema" as the largest missed opportunity on the site. That was wrong. Do not do it.**

Google **retired FAQ rich results for all sites on 2026-05-07**, superseding the August 2023 gov/health restriction. No site receives the SERP feature any more; the documentation carried a deprecation notice on 2026-05-08 and was removed on 2026-06-15. Any AI-citation benefit is unconfirmed and must not be claimed.

The absence of `FAQPage` here was a deliberate decision, documented in `components/seo/json-ld.tsx`:

> **Pas de `FAQPage`.** Google a retiré les rich results FAQ pour tous les sites le 7 mai 2026 : la fonctionnalité SERP n'existe plus, et rien ne démontre de bénéfice de citation par les moteurs de réponse. En ajouter reviendrait à empiler du balisage sans contrepartie.

That reasoning is correct and current.

**`QAPage` is not a substitute.** It is reserved for genuine user Q&A pages where visitors submit answers. The `/faq/[slug]` pages carry publisher-authored single answers with no user submissions, so `QAPage` would misdescribe them.

**What to do with the FAQ pages instead:** nothing schema-wise. Keep the existing `BreadcrumbList`, which is an active type with a live rich result and is already implemented correctly. The FAQ content's value lies in the answers themselves and in the internal linking — not in markup Google no longer reads.

See `SCHEMA-REPORT.md` for the full corrected analysis.

---

## MEDIUM — `Organization` is missing the fields that establish the entity

Current markup has `name`, `url`, `slogan`, `logo`. Google uses `Organization` to build a knowledge entity; the fields that actually do that work are absent.

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Yelhaa",
  "url": "https://yelhaa.info",
  "logo": "https://yelhaa.info/brand/picto.svg",
  "description": "Yelhaa turns your ideas into better prompts, for better results with AI.",
  "slogan": "Better prompts. Better AI outputs.",
  "foundingDate": "2026",
  "sameAs": [],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer support",
    "url": "https://yelhaa.info/contact",
    "availableLanguage": ["en", "fr"]
  }
}
```

`sameAs` is the important one — it is how Google links the site to its social profiles and disambiguates the brand. `lib/config.ts` already reads `NEXT_PUBLIC_URL_X`, `NEXT_PUBLIC_URL_GITHUB`, `NEXT_PUBLIC_URL_LINKEDIN` and others from the environment; populate `sameAs` from whichever are set, filtering empties. Leave it as `[]` until real profiles exist — never invent them.

The publisher's legal identity (company name, registration number, registered office) is already written out on `/legal/notice`; mirroring the real values into `Organization` is low effort and materially strengthens the entity.

---

## MEDIUM — `SoftwareApplication` is missing `description` and `aggregateRating`

Add `description` and `softwareVersion`. `offers` should be wrapped so the price range is legible:

```json
"offers": {
  "@type": "AggregateOffer",
  "lowPrice": "0",
  "highPrice": "39.99",
  "priceCurrency": "USD",
  "offerCount": 3,
  "offers": [ /* the three existing Offer objects */ ]
}
```

Do **not** add `aggregateRating` until there are genuine, verifiable user ratings displayed on the page. Marking up ratings that are not visible to users is a structured-data violation and risks a manual action.

Prices were cross-checked and are consistent across the pricing page, the homepage pricing block, `/faq/plans-and-quotas` and `lib/config.ts` ($0 / $9.99 / $39.99; 3 / 150 / 500 generations). No contradiction found.

---

## LOW — No `BreadcrumbList` outside the FAQ articles

`/pricing`, `/build`, `/contact` and the three `/legal/*` pages have no breadcrumb markup. The FAQ articles implement it correctly and can serve as the pattern. Minor SERP presentation gain; worth doing once the higher items are closed.

## LOW — No `WebSite` `SearchAction`

Only relevant if the site adds an on-site search. Skip for now.

---

## What already works

- Every JSON-LD block parses cleanly — no syntax errors, no malformed nesting
- `BreadcrumbList` is correctly implemented across all 12 FAQ articles
- `SoftwareApplication` uses appropriate `applicationCategory` and `operatingSystem` values
- Offer prices, currencies and plan names match the visible page content exactly
- Schema is emitted server-side in the initial HTML, so non-rendering crawlers can read it
- Markup is generated from shared constants rather than hand-written per page, so it stays consistent
