# Backlink Profile — Findings

**Tier 0 (Basic)** — Common Crawl web graph + verification crawler. No Moz, Bing Webmaster, Keywords Everywhere or DataForSEO credentials configured, so no referring-domain list, anchor-text distribution, DA/PA, or spam-score analysis is available.

---

## Common Crawl web graph — domain not present

```json
{
  "domain": "yelhaa.info",
  "in_crawl": false,
  "in_rankings": false,
  "pagerank": null,
  "harmonic_centrality": null,
  "n_hosts": null,
  "note": "Domain not found in Common Crawl data."
}
```
*Release: `cc-main-2026-jan-feb-mar`*

The domain does not appear in the Common Crawl host-level web graph at all — no PageRank, no harmonic centrality, no linking hosts recorded.

## What this does and does not tell us

**Does:** the domain has no meaningful presence in the open web graph as of the Jan–Mar 2026 release. Common Crawl is broad, so a site with even a handful of links from crawled hosts usually appears.

**Does not:** prove zero backlinks. Common Crawl is a sample, not a census, and the release predates recent activity. A brand-new domain being absent is the expected result, not evidence of a problem.

**Corroboration:** the independent brand-mention research in `GEO-ANALYSIS.md` found no web references to Yelhaa on any platform — no Wikipedia, Reddit, YouTube, LinkedIn, press or directory listings. Two independent methods agreeing makes the conclusion safe: **the site currently has effectively no inbound link or mention profile.**

---

## Assessment

For a domain this new, this is a baseline, not a defect. There is nothing to disavow, no toxic-link exposure, and no anchor-text over-optimisation — the cleanest possible starting position.

Two things worth keeping in proportion:

1. **Backlinks are the weaker signal for the goal this site cares about.** Brand mentions correlate roughly 3× more strongly with AI visibility than backlinks (Ahrefs, 75,000 brands: YouTube ~0.737, Reddit high, vs Domain Rating ~0.266). The off-site work in `GEO-ANALYSIS.md` item 2 addresses both at once, and mentions are the higher-leverage half.

2. **Nothing links to a site nobody can find.** The sitemap is currently rejected wholesale and every canonical points at localhost. Link acquisition before that is fixed is wasted effort — any coverage earned now would point at a site Google is struggling to index properly.

**Sequence: fix the origin → publish content worth linking to → then earn links and mentions.** Not the reverse.

---

## What to do

### Now (with the Phase 1 fixes)
- Verify in Google Search Console and Bing Webmaster Tools. Both are free, and **Bing Webmaster also unlocks Tier 1 backlink data** for this toolchain — the cheapest upgrade available from here.

### After content ships
- The prompt-template library is the linkable asset. Reference tools and template collections earn links in this category; product pages do not.
- Directory and roundup submissions — the site is currently absent from every "best prompt engineering tools 2026" listicle found. These are legitimate, relevant, and often just require an application.

### Optional, to deepen future audits
| Source | Cost | Unlocks |
|---|---|---|
| Bing Webmaster Tools API | Free | Referring domains, anchor text, Tier 1 |
| Moz Link Explorer API | Free tier | DA/PA, spam score, link metrics |
| Keywords Everywhere | Paid | Open PageRank |
| DataForSEO | Paid | Full profile, competitor gap, live SERP positions |

Set via `MOZ_API_KEY` / `BING_WEBMASTER_API_KEY` env vars, or in `~/.config/claude-seo/backlinks-api.json`.

---

## Not assessed

Referring domains and their quality · anchor-text distribution · toxic or spammy links · competitor link gap · link velocity · lost or broken backlinks · internal PageRank flow.

All require credentials that are not configured. **No claim is made about any of them** — the only positive statement this file supports is that the domain is absent from the Common Crawl graph.
