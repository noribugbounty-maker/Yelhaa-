# Yelhaa GOLD Prompt Dataset — Batch 1 (50 templates)

Hand-authored, non-combinatorial. See yelhaa_gold_batch1.json for structured metadata.

TEMPLATE 001 — AI Code Review Agent (Developer Tool)

```text
Act as a senior product designer and staff frontend engineer who has shipped developer tools used by thousands of engineers. Build the marketing + product site for "{{BRAND_NAME}}", an AI agent that reviews pull requests automatically and leaves inline comments. Primary audience: engineering leads evaluating whether to trust an AI reviewer with their codebase — they are skeptical, technical, and will bounce instantly if the site feels like a generic SaaS template. The single job of this page is to prove the agent's reasoning is good, not just claim it.

## PRODUCT REASONING
- The page must show the agent's actual review output, not describe it. A visitor should be able to read a real PR diff with real inline comments within 3 seconds of landing.
- Information priority: (1) does it catch real bugs, (2) does it integrate with existing workflow (GitHub/GitLab), (3) does it respect codebase privacy, (4) pricing.
- Trust is the primary UX problem, not delight — every visual choice should read as engineering rigor, not marketing polish.

## TECH STACK (justified)
- Framework: Next.js 15 App Router — server-rendered diff content for fast LCP on a text-heavy page.
- Styling: Tailwind CSS v4, design tokens in globals.css.
- Syntax highlighting: Shiki (server-side, ships static HTML — no client-side highlighting flash).
- Animation: Framer Motion for panel transitions only; no scroll-jacking libraries — developers scroll fast and expect native scroll physics.
- Diagram: hand-built SVG for the architecture section (no canvas/WebGL — this audience distrusts unnecessary visual flourish).

## DESIGN SYSTEM
Colors:
  --bg: #0B0D10 · --surface: #14171B · --surface-raised: #1B1F24 · --border: #262B31
  --fg: #E8EAED · --muted: #8A919B
  --diff-add: #2EA043 (bg #0F2A16) · --diff-remove: #F85149 (bg #2A1215)
  --accent: {{ACCENT_HEX}} (fallback #58A6FF) — used only for the agent's own comments, never for diff coloring, so the two visual languages never compete.
Typography: Display "Inter Tight" 600, tracking -0.01em; Body "Inter" 400; Code "JetBrains Mono" 400, 14px, line-height 1.6.
Grid: max-width 1120px for prose sections, full-width (edge-to-edge) for the diff viewer — the one place density is a feature, not a compromise.
Radius: 8px on cards, 4px on inline code chips, 0 on the diff viewer (it should look like a real diff, not a designed artifact).

## SECTIONS

### 1. Nav
Minimal: wordmark, "Docs", "Pricing", GitHub star count (live via GitHub API, cached 10 min), "{{PRIMARY_CTA}}" (Install on GitHub). No mega-menu — this audience wants speed.

### 2. Hero — Live Diff Demo (the product surface IS the hero)
- Two-column above the fold: left is the pitch (`{{HERO_HEADLINE}}`, one sentence, `{{VALUE_PROP}}`), right is a real, static (not fake-animated) PR diff rendered with Shiki, 5-8 changed lines, with 2 inline agent comments anchored to specific lines — a comment catching a genuine off-by-one error and one catching a missing null check. Comments use a distinct card: agent avatar, confidence label ("High confidence"), the specific line reference, and a one-line fix suggestion with a "Apply suggestion" button (non-functional in the mock, styled as real).
- No looping GIF, no autoplay animation. This is a static, readable artifact people can actually parse — motion here would undermine the credibility.
- Below the fold, a single line of real text: "Every comment above is unedited output from {{BRAND_NAME}} on a real open-source PR ({{EXAMPLE_REPO_LINK}})." — if this claim can't be substantiated with a real link, the section is not shipped with this framing; it falls back to "Example output, illustrative" labelled visibly.

### 3. How Review Works (progressive disclosure, not a marketing feature grid)
Three collapsed accordion rows, each expanding to show a concrete mechanism, not a benefit:
  1. "Reads the full diff plus surrounding context" — expands to show a small file-tree excerpt highlighting which files were pulled in beyond the diff itself.
  2. "Cross-references your existing review comments" — expands to show a before/after: a past human comment the agent learned from.
  3. "Runs your test suite's static rules before commenting" — expands to a terminal-style log snippet of the pre-check.
Accordion expands with height: auto via a measured-height animation (Framer Motion layout), 280ms ease-out; only one open at a time on mobile, multiple allowed on desktop.

### 4. Integrations
Grid of real supported platforms ({{INTEGRATION_1..6}}: GitHub, GitLab, Bitbucket, Linear, Slack, Jira) as flat monochrome marks; clicking one swaps the diff-viewer example in section 2 to that platform's comment UI style (GitHub-style vs GitLab-style threading) — a functional interaction, not decorative.

### 5. Privacy & Data Handling (this is not optional for this category)
- Explicit statement of what leaves the customer's infrastructure, rendered as a real data-flow diagram (SVG): repo → agent (ephemeral context window, not stored) → comment posted → context discarded. Each arrow labeled with retention policy.
- "Self-hosted option" toggle if {{SELF_HOSTED_AVAILABLE}} is true — shows an alternate architecture diagram with the agent running inside the customer's VPC.
- No vague "enterprise-grade security" copy without the diagram backing it.

### 6. Pricing
Per-seat tiers from {{PRICING_TIERS}}; usage-based add-on (reviews/month) shown as a small calculator: a slider that recomputes an estimated monthly cost live (client-side, no round trip), tabular-nums output.

### 7. Docs CTA / Footer
Footer includes a direct link to API reference and CLI install command shown as a copyable one-liner (`npm install -g {{CLI_NAME}}`), copy button confirms with a checkmark swap for 1.5s.

## STATES & INTERACTIONS
- Diff viewer: hover a comment card highlights its anchor line in the diff with a 2px accent left-border; clicking a diff line without a comment shows a ghost "+ agent would not comment here" tooltip on hover (reinforces selectivity, not noise).
- Copy buttons: idle → "Copy" icon; success → checkmark + "Copied" for 1.5s; failure (clipboard API blocked) → falls back to a visible selectable text state, never a silent failure.
- Integration grid: keyboard-focusable, Enter/Space triggers the same swap as click.

## RESPONSIVE
- Desktop: two-column hero (pitch + diff) at 44/56 split. Tablet (768-1024px): stacks vertically, diff viewer keeps full width with horizontal scroll for long lines rather than wrapping (wrapped diffs are unreadable to this audience). Mobile: diff viewer becomes a horizontally scrollable card with a persistent left gutter showing line numbers (position: sticky) so context isn't lost while scrolling right.

## ACCESSIBILITY
- Diff additions/removals communicated by icon + label ("Added", "Removed") in addition to color, for colorblind users who can't rely on green/red.
- Accordion rows are real `<button aria-expanded>` elements; screen readers announce state changes.
- Live GitHub star count region is `aria-live="polite"` with `aria-atomic="true"` so it announces once, not on every poll.

## PERFORMANCE
- Shiki highlighting done at build/request time server-side — zero client-side highlighting JS shipped.
- Architecture SVGs inlined (no external requests), under 8KB each.
- GitHub API call cached server-side (ISR, revalidate 600s) — never a client-side fetch blocking render.

## STRICT RULES
- Never fabricate the "real PR" claim without a real backing link — fall back to explicitly labeled illustrative output.
- Never use generic checkmark-list "Features" sections — every capability claim must be demonstrated by an artifact (diagram, diff, log), not just asserted.
- No stock developer photography anywhere on this page.
```

---

TEMPLATE 002 — Private Wealth Management (Ultra-High-Net-Worth Fintech)

```text
Act as a senior brand designer who has worked on private banking and luxury financial brands, paired with a frontend engineer who understands regulated-industry constraints. Build the site for "{{BRAND_NAME}}", a private wealth management firm serving ultra-high-net-worth individuals ({{AUM_SEGMENT}}, e.g. $10M+ investable assets). Audience: prospective clients who are not price-sensitive but are extremely sensitive to perceived competence and discretion — they are referred by word of mouth, not acquired through performance marketing. The page's job is to signal restraint and substance, and to filter out unqualified inquiries via a private, unadvertised intake process rather than a public "sign up" flow.

## PRODUCT REASONING
- No public pricing, no self-serve signup — the primary action is a private introduction request, gated behind a short qualifying form.
- Visual density must be low: this audience associates whitespace and quiet typography with competence; dense dashboards or bold color would read as retail fintech, undermining the exact positioning being sold.
- Performance figures, if shown at all, require explicit time-period and benchmark comparison — this is a regulated claim, not a marketing number.

## TECH STACK (justified)
- Framework: Astro 4 with a single React island for the intake form — the rest of the page is static, content-led, and should load instantly with zero unnecessary JS.
- Styling: Tailwind CSS v4, restrained token set.
- Animation: CSS-only crossfades and 1px rule draw-ins; no scroll-jacking, no parallax — motion here should feel like turning a page, not a product demo.

## DESIGN SYSTEM
Colors: --bg: #FAF9F7 · --surface: #F1EFEA · --border: #DCD6C9 · --fg: #14130F · --muted: #6B6558 · --accent: {{ACCENT_HEX}} (fallback a single restrained bronze #8C7853, used only for the firm's monogram and one rule per section — never for buttons at scale).
Typography: Display "GT Sectra" (serif) 500, used sparingly for pull-statements only; Body "Söhne" 400, generous leading 1.7; all-caps label style at 11px tracking 0.2em for section eyebrows, never for body copy.
Grid: max-width 960px for all reading content — narrower than a typical SaaS page, deliberately, to force a slow, editorial pace. Side padding 32px mobile / 96px desktop.
Rules: no cards, no shadows, no rounded corners anywhere. Sections separated by a single 1px --border rule with generous 120px vertical breathing room.

## SECTIONS

### 1. Mark (not a navbar)
Just the firm's wordmark, centered, top of page. A single small-caps link, right-aligned: "Private Client Access" (leads to a login for existing clients, visually de-emphasized). No nav links, no menu — there is nothing to browse.

### 2. Opening Statement
Full-viewport-height section, vertically centered, a single sentence in serif display type — the firm's actual positioning statement (`{{HERO_HEADLINE}}`), e.g. "We manage capital for a small number of families who value discretion over scale." Below it, in body type, one supporting sentence (`{{VALUE_PROP}}`) and nothing else. No CTA button in this section — the page earns the ask later.

### 3. Philosophy (long-form, editorial)
Three short paragraphs of real philosophy copy (not lorem, not `{{ITEM_1..3}}` bullets) addressing: how the firm thinks about risk, how it thinks about time horizon, and how it structures the client relationship (single point of contact vs. team model — state which). This is prose, set two-column on desktop (60/40 split with a pull-quote in the narrow column), single column on mobile.

### 4. What We Manage (structure, not features)
A simple horizontal list of service lines from {{SERVICE_1..5}} (e.g. discretionary portfolio management, estate and trust structuring, private credit access, family governance advisory) rendered as plain text rows with a hairline rule between them — no icons, no cards. Icons here would read as retail.

### 5. Track Record (only if data is truly supplied)
- If {{PERFORMANCE_DATA}} is supplied: a single restrained line chart (thin 1px stroke, no fill, no gradient), annualized return vs. a named benchmark, with the measurement period and "past performance does not guarantee future results" set at the same visual weight as the number itself — not footnote-sized.
- If not supplied: this section is omitted entirely. Never a placeholder chart with invented numbers — in this category that is not a visual gap, it's a compliance violation.

### 6. Regulatory Identity
{{ENTITY_LEGAL}} and {{REGULATOR}} (e.g. SEC-registered investment advisor, CRD number) rendered as real, legible text — minimum 14px, full contrast — in a dedicated block, not buried in an 8px footer line. This block always renders, even if the firm must supply a placeholder pending real registration data — an omitted regulatory line is worse than an ugly one.

### 7. Private Introduction (the only CTA on the page)
A short, qualifying intake form: name, referral source (dropdown — "How were you introduced to us"), investable asset range (a private, non-judgmental range selector, not a public "select your budget" slider aesthetic), and a message field. Submit copy: "Request an introduction" — never "Get started" or "Sign up", which would misrepresent the relationship model. On submit: the form is replaced in place by a quiet confirmation sentence, no modal, no confetti.

## STATES & EDGE CASES
- Form validation: inline, understated — a single muted-red line beneath the field, no red border glow, no shake animation (this audience should never feel "scolded" by a form).
- Submit pending: button label changes to "Sending…" with no spinner icon — text alone communicates state, consistent with the page's restraint.
- If the referral-source field is left blank, do not block submission — treat it as optional context, not a gate.

## RESPONSIVE
- The two-column philosophy section collapses to single column under 768px, and the pull-quote moves to appear inline after the first paragraph rather than beside it.
- The intake form remains single-column at all breakpoints — this is a considered decision, not a fallback: a form this important should never feel like it's competing for space.

## ACCESSIBILITY
- All-caps eyebrow labels have appropriate `letter-spacing` but retain real casing in the DOM (`text-transform`, not literal uppercase text) so screen readers pronounce them normally.
- The performance chart (if present) has a text-equivalent summary adjacent to it, not only an SVG with no accessible description.
- Focus states use a 2px offset outline in the bronze accent, visible against the cream background at all times.

## PERFORMANCE
- The page ships as close to zero client JS as possible outside the single form island; target a Lighthouse performance score of 100 on this route specifically, since there is no other content competing for the budget.
- Serif display font subset to the exact glyphs used in the opening statement plus body headings — do not ship a full font family for three sentences of display type.

## STRICT RULES
- No stock imagery of handshakes, skylines, or people in suits — if imagery is used at all, it must be supplied real photography of the firm's actual office or people, otherwise no imagery is used.
- No urgency mechanics, no countdowns, no "limited availability" — directly contradicts the positioning.
- No invented AUM figures, client counts, or awards anywhere on the page.
```

---

TEMPLATE 003 — Consumer Neobank (Everyday Banking App)

```text
Act as a senior product designer specializing in consumer fintech and a frontend engineer focused on conversion-critical flows. Build the marketing site for "{{BRAND_NAME}}", a mobile-first neobank targeting people underserved by traditional banks (no monthly fees, no minimum balance, early paycheck access). Audience: price-sensitive, mobile-native, often skeptical of financial products due to past bad experiences with overdraft fees — the page must lead with concrete, checkable numbers ("no fees" needs to be provable, not just claimed) and get to account opening in the fewest possible steps.

## PRODUCT REASONING
- Primary user intent on arrival: "how much will this actually cost me and how fast can I get a card." Everything else is secondary.
- The product surface to demonstrate is the transaction feed and fee comparison — not a generic "dashboard" screenshot.
- Trust signal here is different from private banking: it's FDIC-equivalent insurance disclosure, a real fee schedule, and app store ratings — public, numeric proof, not discretion.

## TECH STACK (justified)
- Framework: Next.js 15 App Router, optimized for mobile web since a large share of traffic arrives from social ads on phones.
- Styling: Tailwind CSS v4.
- Animation: Framer Motion for the fee-comparison interaction (the one place motion earns its keep); CSS transitions elsewhere.
- Forms: native form elements with client-side validation only — no heavy form library needed for a 3-field signup.

## DESIGN SYSTEM
Colors: --bg: #FFFFFF · --surface: #F7F9FC · --border: #E3E8F0 · --fg: #101828 · --muted: #667085 · --success: #12B76A · --warning: #F79009 · --accent: {{ACCENT_HEX}} (fallback #2E5CFF, a confident but approachable blue — avoiding both "corporate navy" and "trendy neon," which this audience associates with either boring banks or predatory fintech apps respectively).
Typography: Display "Inter" 700, no exotic display font — approachability over prestige. Body "Inter" 400. Numeric values always tabular-nums.
Grid: max-width 1200px; mobile-first, since most sessions are on a phone.
Radius: 16px on cards (soft, friendly, mirrors the actual app's card UI so the web experience feels continuous with the product).

## SECTIONS

### 1. Nav
Logo, "How it works", "Fees", "{{PRIMARY_CTA}}" (Open account — free) as a filled pill button visible at all scroll positions on mobile (sticky bottom bar on mobile specifically, not just a sticky top nav — this is the single highest-leverage placement for a conversion-critical CTA on this category of product).

### 2. Hero — Real Fee Comparison (interactive, not a screenshot)
- H1: `{{HERO_HEADLINE}}` (e.g. "Banking that doesn't charge you for being short on cash").
- Below it, an interactive slider: "See what a $50 overdraft costs at your bank vs. {{BRAND_NAME}}." User drags a slider selecting their current bank from a short list ({{COMPETITOR_1..5}}, generic labeled "Traditional Bank A/B/C" if real competitor names aren't legally cleared for comparison), and a live-recalculated number shows the fee difference ($0 vs. their typical overdraft fee, sourced from {{FEE_DATA}}). This is the actual argument of the product, made interactive rather than asserted in a headline.
- Below: three real numbers in a row (tabular-nums, large): "$0 monthly fees" / "2 days early paycheck" / "55,000+ fee-free ATMs" — each sourced from {{PROOF_STAT_1..3}}, never invented.

### 3. How It Works (three real screens, not icons)
Three phone-frame mockups (built in CSS, matching the actual app's real UI system if {{SCREEN_1..3}} isn't supplied) showing: sign up in the app → transaction feed with instant notifications → early paycheck arriving 2 days early with a visible date comparison. Each frame is a live-updating mock (a notification slides in on a loop, timestamps update) so it reads as a working product.

### 4. Transparent Fee Schedule
A real, complete table (not a marketing summary) of every fee the bank does and does not charge, sourced from {{FEE_SCHEDULE}} — including the rare fees that do exist (e.g. paper statement fee), listed with equal visual weight to the free items. Deliberately un-marketing in tone: this table's credibility depends on including the unflattering line items too.

### 5. Trust & Insurance
FDIC-equivalent insurance badge and coverage amount stated in real text (not just a logo), app store rating pulled live if {{APP_STORE_ID}} is supplied (server-rendered, cached), and a plain-language one-paragraph explanation of how the bank makes money if it doesn't charge fees (interchange revenue) — addressing the skepticism directly rather than avoiding the question.

### 6. Early Access CTA
Phone number input with SMS app-download link (this is how neobank signups actually convert — not an email capture) — inline country-code selector, input mask for phone formatting, and a clear one-line disclosure of SMS terms beneath the field at readable size.

### 7. Footer
Standard footer plus a required-by-category block: routing/account structure disclosure (which partner bank actually holds FDIC-insured deposits, since neobanks are not banks themselves) — this line is legally load-bearing and must never be omitted or shrunk below 12px.

## STATES & EDGE CASES
- Fee-comparison slider: if a selected competitor has no data in {{FEE_DATA}}, the slider shows "data not available for this bank" rather than a fabricated number or a broken $0 result.
- Phone input: real-time validation on format (not just on blur) since typos here are the main drop-off point; error state shows a specific message ("Enter a valid 10-digit number"), not a generic "invalid input."
- Sticky mobile CTA bar hides on scroll-down and reappears on scroll-up past a threshold, so it doesn't obscure content while reading but is always one gesture away.

## RESPONSIVE
- Mobile (primary target): single column throughout, sticky bottom CTA bar as described, phone mockups sized to roughly 70% viewport width so context (the surrounding page) remains visible.
- Desktop: fee-comparison slider and the three real numbers sit in a two-column layout; phone mockups arranged in a horizontal row with connecting arrows showing the flow left to right.

## ACCESSIBILITY
- Fee comparison slider is operable via arrow keys when focused, with the resulting number change announced via `aria-live="polite"`.
- Fee schedule table uses real `<table>` markup with proper `<th scope="col">` — not a div-grid — since screen reader users rely on table navigation for this kind of dense financial data.
- Color is never the only signal for fee-free vs. fee-charging rows; each row also carries a text label ("No fee" / "Fee applies").

## PERFORMANCE
- Phone mockup animations (notification slide-ins) pause when the section is out of viewport (IntersectionObserver) to avoid wasting battery on mobile, which matters disproportionately for this audience's devices.
- Sticky bottom bar uses `position: sticky` with a CSS-only show/hide via scroll-driven animation where supported, falling back to a small JS scroll listener (passive, throttled) otherwise.

## STRICT RULES
- Never state "no fees" without the complete fee schedule directly reachable from the same page — this exact gap is the #1 trust-killer for this product category.
- Never fabricate a competitor's fee for the comparison slider.
- The partner-bank disclosure required by this business model must never be omitted, regardless of art direction preferences.
```

---

TEMPLATE 004 — SOC Cybersecurity Platform (Enterprise Threat Detection)

```text
Act as a senior product designer who has built for security operations centers, and a frontend engineer comfortable with high-density real-time data UI. Build the site for "{{BRAND_NAME}}", a threat-detection platform used by security analysts monitoring enterprise networks. Audience: SOC analysts and CISOs — technically expert, allergic to marketing fluff, and specifically evaluating whether the tool reduces alert fatigue (the #1 complaint in this category) rather than adding another noisy dashboard.

## PRODUCT REASONING
- The core claim to prove is signal-to-noise, not "detection." Any security vendor claims detection; this page must show the platform suppressing false positives, which is the actual differentiator analysts care about.
- Dense, real-time-feeling UI is appropriate here (unlike consumer products) because the audience's day job is dense real-time UI — a sparse marketing page would read as unserious to this buyer.
- CISOs (economic buyer) need compliance/coverage-map content; analysts (technical evaluator/champion) need to see the alert triage UI. The page must serve both without forcing either to scroll past irrelevant content.

## TECH STACK (justified)
- Framework: Next.js 15 App Router.
- Styling: Tailwind CSS v4.
- Data/animation: a lightweight custom canvas renderer for the live network-graph visualization (WebGL would be overkill and add unjustified load time for what is fundamentally a 2D force-directed graph); D3-force for the layout physics only, rendered to canvas for performance at scale.
- Real-time feel: a simulated event stream (setInterval-driven, clearly a demo, not a live customer feed) feeding both the graph and the alert list so they stay in sync.

## DESIGN SYSTEM
Colors: --bg: #0A0C10 · --surface: #12151B · --border: #1F242C · --fg: #DCE1E8 · --muted: #6E7681
  Severity scale (used consistently everywhere severity appears — graph nodes, alert list, badges): --sev-critical: #F04438 · --sev-high: #F79009 · --sev-medium: #FDB022 · --sev-low: #667085 · --sev-info: #3E7BFA
  --accent: {{ACCENT_HEX}} (fallback #3E7BFA) — reserved for interactive UI chrome only, never for severity, so the two color systems never collide.
Typography: Display "Inter Tight" 600; Body "Inter" 400; all data values and timestamps in "IBM Plex Mono" with tabular-nums.
Grid: full-width dashboard-style layout above the fold (no centered marketing max-width) — this signals "this is the real product," matching audience expectations for the category.
Density: 8px base spacing unit (tighter than a typical marketing site's 16px) throughout the product-surface sections specifically, looser (16px) in the narrative/compliance sections — the density itself communicates which parts are "real tool" vs. "explanation."

## SECTIONS

### 1. Nav
Compact, dense: logo, "Platform", "Detections library", "Pricing", "{{PRIMARY_CTA}}" (Request access — this category sells via demo, not self-serve trial, so the CTA leads to a qualifying form, not a signup).

### 2. Hero — Live Triage Surface
- Split view: left is a force-directed network graph (canvas-rendered) of simulated hosts and connections, with 2-3 nodes pulsing in severity colors to represent active alerts; right is a real alert triage panel — a list of alerts with severity badge, affected host, a one-line MITRE ATT&CK technique reference, and a "Suppressed 34 similar alerts as noise" line on select items. That suppression line is the actual product argument, placed exactly where a skeptical analyst would look for it.
- H1 (`{{HERO_HEADLINE}}`) and value prop are compact, positioned above the graph, not competing with it for space — the surface itself is the argument, headline copy is secondary.
- Clicking an alert in the list highlights its corresponding node in the graph with a pulsing ring and draws a connection path to related nodes (the actual investigative workflow, demonstrated).

### 3. Signal-to-Noise (the core claim, made concrete)
A before/after comparison, not a percentage claim in isolation: a static rendering of "1,240 raw events" collapsing via an animated funnel (SVG, not video) down to "6 alerts requiring analyst review," with the specific correlation rules responsible for each collapse listed on hover (e.g. "890 events grouped: single authenticated user, known device, off-hours access pattern — suppressed"). Specificity here is what makes this credible to a technical buyer; a bare "99% noise reduction" stat without mechanism would be dismissed.

### 4. Coverage Map (for the CISO reader)
A grid mapped to a named framework ({{FRAMEWORK}}, e.g. MITRE ATT&CK tactics) showing which tactics/techniques the platform detects, each cell showing detection depth (full / partial / roadmap) — never all-green marketing wash; an honest partial-coverage map is more credible to this buyer than a suspiciously perfect one.

### 5. Integrations & Deployment
Grid of log sources / SIEM integrations ({{INTEGRATION_1..8}}); a toggle switching between "Cloud-hosted" and "On-premises / air-gapped" deployment, each showing its own architecture diagram (SVG) since air-gapped deployment is a real, distinct buying consideration in this category, not a footnote.

### 6. Compliance & Certifications
SOC 2 Type II, ISO 27001, FedRAMP (if applicable) badges rendered only if {{CERTIFICATIONS}} supplied, each linking to a downloadable real attestation letter or report summary — a badge with no backing document is actively counterproductive to this specific audience, who will check.

### 7. Request Access
A qualifying form (company size, current SIEM, use case) rather than a generic contact form — the fields themselves signal the platform is built for a specific kind of buyer, filtering appropriately.

## STATES & EDGE CASES
- Simulated event stream: explicitly labeled "Simulated data for demonstration" in a small persistent caption near the graph — this category's buyers are trained to distrust unlabeled "live" demos and the honesty itself builds trust.
- Alert list: empty state (all alerts triaged) shows a genuinely calm confirmation state, not a generic "nothing here" — for a SOC tool, an empty alert queue is a success state worth designing well.
- Graph performance: node count caps at a reasonable simulated ceiling (e.g. 200 nodes) with a "showing a representative subset" note — never silently degrades to a laggy, unbounded render.

## RESPONSIVE
- The dense dashboard hero is genuinely difficult to make work under 768px — the honest answer is a curated mobile version: graph is replaced by a static annotated screenshot with a "view interactive demo on desktop" note, while the alert-triage list (which works fine narrow) remains fully interactive. Do not attempt to cram the force-directed graph into a phone viewport.
- Coverage map becomes a horizontally scrollable grid on mobile with sticky row labels, rather than reflowing into an unreadable stack.

## ACCESSIBILITY
- Severity is always paired with text labels ("Critical", "High") in addition to color, given the density and stakes of this data.
- The canvas-rendered graph is supplemented with a visually-hidden but screen-reader-accessible summary list of the same alert data (the alert panel already serves this; ensure it's the primary DOM content, with the graph as a supplementary visualization, not the other way around).
- Keyboard users can tab through the alert list and trigger the same node-highlight interaction via Enter, not only via mouse click.

## PERFORMANCE
- Canvas graph rendering throttled to 30fps (not 60) — imperceptible for this use case and meaningfully reduces CPU load, important since this audience may have this page open in a background tab for a while during evaluation.
- Simulated event stream interval cleared immediately on tab blur (Page Visibility API) to avoid burning CPU/battery when not being watched.

## STRICT RULES
- Never show an unlabeled "live" data claim that isn't actually live.
- Never present a 100%-green coverage map — partial/roadmap states must be visible and honest.
- No decorative "hacker" visual clichés (green matrix rain, hoodie photography) — this audience finds those actively discrediting.
```

---

TEMPLATE 005 — Telemedicine Consultation Platform

```text
Act as a senior healthcare UX designer and a frontend engineer experienced with accessibility-critical products. Build the site for "{{BRAND_NAME}}", a telemedicine platform connecting patients with licensed physicians for video consultations. Audience: patients seeking care, often while unwell, anxious, or in discomfort — the design must minimize cognitive load and never make someone searching for care feel like they're using a "tech product." A meaningful share of visitors will be older or less tech-comfortable than the typical SaaS user; this changes almost every interaction decision below.

## PRODUCT REASONING
- Primary user intent: "can I see a doctor right now, and what will it cost." Both answers must be visible without scrolling on mobile.
- This is a state-dependent product: the same visitor could be here for a routine prescription refill (low urgency) or an urgent symptom check (high urgency) — the entry flow must branch early rather than assuming one intent.
- Emotional tone must be calm and competent, never clinical-cold or falsely cheerful — both read as inauthentic to someone who doesn't feel well.

## TECH STACK (justified)
- Framework: Next.js 15 App Router — server-rendered for fast initial paint, since some users will be on slower connections or older devices.
- Styling: Tailwind CSS v4, generous touch targets throughout (minimum 48px) — this audience skews toward less precise pointer/touch input.
- Animation: minimal — CSS transitions only, no scroll-driven effects. Motion should never be the reason a stressed user has trouble finding a button.

## DESIGN SYSTEM
Colors: --bg: #FFFFFF · --surface: #F5F9F8 · --border: #DCE7E3 · --fg: #1A2E28 · --muted: #5C7168 · --accent: {{ACCENT_HEX}} (fallback #2F7A63, a calm clinical green-teal — avoiding both sterile hospital-blue and overly playful startup colors).
  --urgent: #C0392B (reserved exclusively for the emergency-redirect notice, never used decoratively, so it retains its alarm meaning).
Typography: Display "Inter" 600 (not a stylized font — clarity over personality); Body "Inter" 400, minimum 16px base size sitewide (never smaller, given the audience), leading 1.6.
Grid: max-width 1040px, generous white space; forms never exceed 480px width even on desktop — narrow forms are measurably easier to complete under stress or with reduced fine motor control.
Radius: 12px, soft but not childish.

## SECTIONS

### 1. Emergency Notice (always present, always first)
A persistent, dismissible-but-returns-on-reload banner: "If you are experiencing a medical emergency, call {{EMERGENCY_NUMBER}} or go to your nearest emergency room." This is not a legal footnote — for this category it is a first-priority UX and ethical requirement, rendered in readable body text, not 10px grey.

### 2. Hero — Intent Branching
Instead of a single CTA, two clearly differentiated large buttons: "See a doctor now" (shows live estimated wait time, e.g. "~8 min wait", sourced from {{LIVE_WAIT_TIME}} or omitted if unavailable rather than showing a stale number) and "Schedule for later" (opens a calendar picker). This branch happens above the fold, before any marketing copy — the marketing copy exists below for the visitor who scrolls, not before the functional choice.

### 3. What This Costs (transparent, before signup)
A simple real breakdown: cash price without insurance, and "check if your insurance is accepted" as an inline lookup (insurance provider dropdown → immediate yes/no/copay-estimate result) — cost uncertainty is a leading cause of care avoidance, and resolving it before requiring an account is both ethically and commercially correct for this product.

### 4. How a Visit Works (concrete, reduces anxiety)
A simple four-step visual sequence (not icons-with-buzzwords, but literal, concrete steps): "1. Answer a few questions about your symptoms · 2. Get matched with a licensed physician in {{STATE_OR_REGION}} · 3. Video call — no app download required for browser-based visits · 4. Prescription sent directly to your pharmacy if needed." Each step includes what to expect in plain language (e.g. "This usually takes 2-3 minutes").

### 5. Physician Credibility
Real physician profiles if {{PHYSICIAN_1..N}} supplied (name, license state, specialty, photo) — never generic stock "doctor" photography standing in for real providers; if individual profiles aren't available, this section shows aggregate credentialing information instead (e.g. "All physicians are board-certified and licensed in your state") rather than fabricated individual bios.

### 6. Privacy (HIPAA-equivalent, stated plainly)
A short, genuinely plain-language explanation of how health information is protected and who can see it — avoiding both legal jargon and vague reassurance ("we take your privacy seriously"). Link to the full policy for those who want detail, but the on-page summary must be readable to someone who has never read a privacy policy in their life.

### 7. Book Now (repeated, not just at page end)
The same two-button intent-branch from the hero repeats after the cost/how-it-works content, since a meaningful share of visitors will act as soon as their specific concern (cost, or "will a real doctor see me") is resolved, without reading to the bottom.

## STATES & EDGE CASES
- Live wait time: if the data source is unavailable, the button reads "See a doctor now" with no time estimate rather than a stale or fabricated number.
- Insurance lookup: a "not found" result shows the cash-price fallback immediately with reassurance copy ("You can still be seen — here's the self-pay cost"), never a dead end.
- Video-visit flow: an explicit "test your camera and microphone" step is offered before the call starts, with clear fallback instructions if either fails (switch to phone-only consultation) — for a health product, a broken video call must degrade gracefully, not just error out.

## RESPONSIVE
- Mobile is the primary target (most patients in this category start on a phone, often mid-symptom): the two intent-branch buttons stack full-width and are the very first content after the emergency banner, before any hero imagery.
- Insurance dropdown becomes a native `<select>` on mobile (not a custom-styled dropdown) to guarantee correct behavior across the wide range of devices this audience uses.

## ACCESSIBILITY (elevated priority for this category)
- Minimum 16px body text sitewide, scalable without breaking layout up to 200% browser zoom.
- All interactive elements meet a 48x48px minimum touch target.
- The emergency banner and cost information are never conveyed by color alone.
- Form errors are announced via `aria-live="assertive"` (not "polite") given the higher stakes of a missed error in a healthcare intake form.
- Full keyboard operability for the entire booking flow, including the calendar picker.

## PERFORMANCE
- Page must render usably on 3G-equivalent connections — this audience cannot be assumed to have a fast connection or a new device.
- No heavy client-side framework overhead for the informational sections; the video-call functionality itself is the only place a heavier client bundle is justified, and it should be code-split so it only loads when a visit actually starts.

## STRICT RULES
- Never show a live wait time that isn't actually live — a stale or fabricated number in a healthcare urgency context is a serious trust and safety issue, not just a UX flaw.
- Never use stock photography of generic "diverse smiling patients" in place of real product or provider content — if no real assets exist, use no photography rather than stock.
- The emergency notice must never be removable from the page's information architecture, regardless of art-direction preferences.
```

---

TEMPLATE 006 — K-12 EdTech Learning Platform (Children, Ages 6-11)

```text
Act as a senior designer with experience in children's digital products and a frontend engineer who understands both parent-facing and child-facing UX within the same product. Build the site for "{{BRAND_NAME}}", a K-12 learning platform for children ages 6-11 covering math and reading. Critical framing: this marketing site has two distinct audiences reading the same page — the parent (who decides and pays) and, sometimes, the child looking over their shoulder (who needs to feel excited, not bored). The design must earn parental trust (evidence, safety, curriculum alignment) while still being visually inviting enough that a child would want to use the product being described.

## PRODUCT REASONING
- Parents' actual question is rarely "is this fun" — it's "will this help my kid's grades/confidence, and is it safe." Playfulness must not come at the expense of visible substance (curriculum standards, progress reporting).
- The product surface to demonstrate is the child-facing app UI itself (shown as a real interactive-feeling demo), because parents want to see exactly what their kid's screen time will look like, not an abstract feature list.
- Safety and screen-time content is a real decision factor for this buyer and deserves a dedicated, substantive section — not a token line.

## TECH STACK (justified)
- Framework: Next.js 15 App Router.
- Styling: Tailwind CSS v4.
- Animation: Framer Motion for the child-app-preview interactions (bouncy, expressive — this is the one part of the page allowed real playfulness) and restrained CSS transitions for the parent-facing informational sections — the page deliberately uses two motion registers for its two readers.

## DESIGN SYSTEM
Colors (two coordinated palettes used in different zones):
  Parent-facing zones: --bg: #FFFFFF · --surface: #F7F8FC · --border: #E4E7F0 · --fg: #1E2233 · --muted: #6B7089 · --accent: {{ACCENT_HEX}} (fallback #4C6FFF) — clean, credible, similar in register to a mainstream edtech SaaS site.
  Child-app-preview zone only: a brighter, higher-saturation palette (#FFC93C yellow, #FF6B6B coral, #4ECDC4 teal, #6C5CE7 purple) used exclusively inside the phone/tablet-frame mockup, never bleeding into the surrounding parent-facing chrome — this containment is deliberate so the page doesn't read as "childish" as a whole, only where it needs to.
Typography: Parent zones — "Inter" throughout, adult and legible. Child-app-preview zone — a rounded, friendly display face ("Baloo 2" or similar) used only inside the mockup frame, reinforcing the visual separation between "marketing site for adults" and "product for kids."
Grid: max-width 1140px; generous padding; large touch targets even in parent-facing CTAs (this audience is often on mobile while multitasking with an actual child nearby).

## SECTIONS

### 1. Nav
Logo, "How it works", "For Schools" (if {{B2B_OFFERING}} exists — many K-12 edtech products sell both direct-to-consumer and to schools/districts, and conflating them confuses both buyers), "Pricing", "{{PRIMARY_CTA}}" (Try free for 7 days).

### 2. Hero — Parent Headline + Child App Preview
- Left: parent-facing headline (`{{HERO_HEADLINE}}`, addressing the actual outcome parents want, e.g. "Build real reading confidence in 15 minutes a day") and `{{VALUE_PROP}}`.
- Right: a tablet-frame mockup showing the actual child-facing app: a character guide, a progress path (like a game level map, not a dry lesson list), and a large "Continue Lesson 4" button. This mock has genuinely playful micro-motion — the character does a small idle bounce animation (translateY ±4px, 2s ease-in-out infinite) — because this is the one element in the page meant to sell the child-experience directly.

### 3. Evidence & Outcomes (for the skeptical parent)
Real, specific outcome data if {{OUTCOME_DATA}} supplied (e.g. "Students using {{BRAND_NAME}} for 12+ weeks improved reading level by an average of {{X}} grade-levels, based on {{STUDY_SOURCE}}") — cited, with the study source named, not a vague "kids love it!" claim. If no real study data exists, this section is replaced with concrete curriculum-alignment information instead (which standards are covered, e.g. Common Core) rather than an invented outcome statistic.

### 4. See It In Action (interactive demo, not video)
An actual playable sample lesson embedded directly in the marketing page (one real math or reading exercise from {{SAMPLE_LESSON}}) — letting a parent (or child) try one real interaction before signing up is the single highest-converting element for this category, more effective than any description of the product.

### 5. Safety & Screen Time (substantive, not a token line)
A dedicated section addressing: no ads, no in-app purchases directed at children, a visible daily-time-limit parental control (shown as a real settings-screen mockup), and COPPA-compliance statement in plain language. This is a genuine decision factor for this buyer, not boilerplate — treat it with the same visual weight as the outcomes section.

### 6. Parent Dashboard Preview
A screenshot/mock of the parent-facing progress dashboard (separate from the child app) showing weekly progress summary, time spent, and skill areas — because parents are buying visibility into learning, not just the learning tool itself.

### 7. Pricing
Family plans from {{PRICING_TIERS}} (often per-child or per-family, not per-seat like B2B SaaS) with a clear "how many kids" selector affecting the displayed price live.

### 8. Trial CTA
Low-friction: email + one child's approximate age/grade (used to route to the right starting content), not a full account-creation form up front — this category converts better with a "try it in 60 seconds" framing than a full signup wall.

## STATES & EDGE CASES
- Embedded sample lesson: if the child gets the practice question wrong, the app-preview shows the actual gentle-correction UI (no red X, no "Wrong!" — a real children's-edtech pattern is a supportive retry prompt), demonstrating the product's actual pedagogical tone, not just its visual style.
- Grade/age selector: if a parent selects an age outside the product's supported range, show a clear, kind message pointing to what the product does support rather than a broken or empty result.

## RESPONSIVE
- Mobile: the hero's tablet-frame mockup shrinks but remains interactive (the idle character animation stays, since this is a low-cost, high-signal detail even on small screens); parent-facing sections stack normally.
- The embedded sample lesson is fully touch-operable and resizes to fit mobile without requiring pinch-zoom — since a child might genuinely try it on a parent's phone in the moment.

## ACCESSIBILITY
- Child-facing preview content includes text alongside all icon-based instructions (pre-literate-adjacent design consideration, even though this preview is inside a parent-facing marketing page).
- Parent-facing content meets standard WCAG AA contrast; the brighter child-zone palette is contained specifically so it doesn't compromise the page's overall contrast compliance outside that zone.
- The embedded sample lesson supports keyboard interaction, not only touch/click, since some parents will evaluate on desktop.

## PERFORMANCE
- The playable sample lesson is the heaviest asset on the page and is lazy-loaded (not blocking initial hero paint), with a lightweight static preview shown until it's ready.
- Character idle animation uses CSS transform only (GPU-accelerated), paused via `prefers-reduced-motion` and also when the mockup scrolls out of view.

## STRICT RULES
- Never invent outcome statistics or study citations — omit the section rather than fabricate a "X% improvement" figure.
- Never blur the line between the parent-facing marketing site's tone and the child-facing app's tone outside the explicitly contained preview zone — the page must read as credible to an adult first.
- No manipulative "kids will nag you" framing anywhere in parent-facing copy — this undermines trust with a specifically skeptical buyer.
```

---

TEMPLATE 007 — Legal Contract Automation (Legal Tech, B2B)

```text
Act as a senior enterprise UX designer and frontend engineer who has built tools for legal departments. Build the site for "{{BRAND_NAME}}", an AI platform that reviews and redlines commercial contracts for in-house legal teams. Audience: general counsel and contract managers who are risk-averse by profession — they will distrust any claim of "AI accuracy" that isn't paired with visible human oversight controls. The page's job is to demonstrate a defensible workflow (AI proposes, human approves), not an autonomous black box.

## PRODUCT REASONING
- The buyer's fear is liability from an AI error slipping through unreviewed — every product-surface demo must show a human-in-the-loop checkpoint, never full automation as the headline.
- Primary evaluation question: "does it understand OUR playbook/precedents, or just generic contract law." The demo must show custom clause-library matching, not generic redlining.
- Legal buyers read dense text comfortably (unlike most SaaS audiences) — the page can and should be more text-substantive than a typical B2B SaaS landing page.

## TECH STACK (justified)
Next.js 15 App Router; Tailwind CSS v4; a real diff-view component (custom, tracked-changes style — strikethrough removals, underlined additions, exactly matching what a lawyer expects from redlining software they already use) rendered server-side; Framer Motion used only for the approve/reject interaction, nowhere else.

## DESIGN SYSTEM
Colors: --bg:#FCFCFB · --surface:#F4F3EF · --border:#DFDCD3 · --fg:#1C1B18 · --muted:#716C60 · --insert:#1B6B3A (underline) · --delete:#A32B2B (strikethrough) · --accent:{{ACCENT_HEX}} (fallback #2C4A6E, a restrained legal-navy).
Typography: Display "Source Serif 4" 600 for headings (legal documents are set in serif; the marketing site borrows that register deliberately); Body "Inter" 400; contract text itself rendered in "Source Serif 4" 400 at 15px to match real document typography.
Grid: max-width 1080px; the redline demo breaks to full-bleed width since document review benefits from real reading width, not marketing-constrained columns.

## SECTIONS
### 1. Nav — logo, "How it works", "Security", "{{PRIMARY_CTA}}" (Book a demo — this sells via sales-assisted demo, not self-serve).
### 2. Hero — Redline Demo with Approval Gate
A real contract clause shown with AI-proposed redlines (visible strikethrough/underline, matching real redlining conventions) and, critically, each proposed change has an explicit "Accept" / "Reject" / "Ask why" control — clicking "Ask why" reveals the specific playbook rule or precedent clause that triggered the suggestion. This "show your work" interaction is the actual trust-building mechanism, placed in the hero rather than buried in a features section.
### 3. Your Playbook, Not Generic Law
A short explanation of how the customer's own clause library and past-negotiated positions are ingested, with a visual (real, not stock) showing a clause being matched against three prior contracts — the differentiator from "generic AI contract review" made concrete.
### 4. Turnaround Time Comparison
A simple before/after: "Average NDA review time" — manual (e.g. 2 days, sourced from {{BENCHMARK_DATA}}) vs. with {{BRAND_NAME}} (e.g. 20 minutes) — as a real comparison bar, not an isolated percentage claim.
### 5. Security & Confidentiality
Data handling specifics: contract content encryption at rest/in transit, retention policy, and explicit statement on whether customer contract data is used to train shared models (a real, high-stakes question for this buyer that must be answered directly, not glossed).
### 6. Integrations — CLM/DMS systems ({{INTEGRATION_1..5}}: iManage, NetDocuments, DocuSign, Salesforce, SharePoint) as it must slot into existing legal-ops stack, not replace it.
### 7. Book a Demo — form fields include contract volume/month and current review process, qualifying the lead for a sales-assisted follow-up.

## STATES, ACCESSIBILITY, PERFORMANCE
- Redline diff: "Ask why" panel opens via an accessible disclosure pattern (`aria-expanded`), keyboard operable; accept/reject states persist visually (a checkmark or strikethrough-removed state) so multi-clause review remains legible.
- Long contract text lazy-renders in the full-bleed demo (virtualized list) if {{SAMPLE_LENGTH}} is long, to avoid layout jank.
- No color-only signal for insert/delete — underline and strikethrough carry the meaning independent of color, matching real redlining accessibility conventions lawyers already expect.

## STRICT RULES
Never present the AI as fully autonomous — every demo interaction must show an explicit human approval step. Never fabricate turnaround-time benchmarks without a cited source.
```

---

TEMPLATE 008 — Commercial Real Estate Listings Platform

```text
Act as a senior product designer specializing in data-dense marketplace UX and a frontend engineer skilled with map-based interfaces. Build "{{BRAND_NAME}}", a platform where brokers list commercial properties (office, industrial, retail) and institutional buyers/tenants search by detailed criteria. Audience: commercial real estate professionals doing serious due diligence — they need dense filterable data, not a consumer-real-estate emotional browsing experience like a residential site.

## PRODUCT REASONING
Search precision is the product. Unlike residential real estate, buyers here filter on cap rate, zoning, loading-dock count, ceiling height — the filter system itself is the primary UI surface, not photography. Map and list must stay in permanent sync since professionals cross-reference location context constantly during a session.

## TECH STACK (justified)
Next.js 15; Tailwind CSS v4; Mapbox GL JS (real map interaction is core, not decorative) with a custom muted commercial-map style (industrial zones, transit overlays); React Table (or a custom virtualized table) for the list view, since result sets can run into hundreds of properties.

## DESIGN SYSTEM
Colors: --bg:#FFFFFF · --surface:#F6F7F8 · --border:#DEE1E5 · --fg:#171A1F · --muted:#5D6470 · --accent:{{ACCENT_HEX}} (fallback #1B4B91, an institutional blue).
Typography: "Inter Tight" for headings, "Inter" for body/data, tabular-nums for every numeric field (sq ft, cap rate, price/sf).
Layout: split-view, map fixed right 45%, filterable list scrollable left 55% on desktop — never a full-width hero-led marketing layout; this product opens directly into its utility.

## SECTIONS
### 1. Persistent Filter Bar — property type, size range, price/sf range, zoning, and a "more filters" expansion (loading docks, ceiling height, year built) — each active filter shown as a removable chip.
### 2. Synced Map + List — hovering a list card highlights its map pin (scale 1→1.3, 150ms); clicking a pin scrolls the list to that card and highlights it with a left accent border. Map viewport changes (pan/zoom) re-query and update the visible list results, debounced 400ms.
### 3. Property Detail (expandable inline panel, not a forced page navigation) — key stats grid (cap rate, NOI, sq ft, zoning) in a dense data table, floor plan viewer (if {{FLOOR_PLAN_ASSET}} supplied) with pan/zoom, and broker contact card.
### 4. Saved Searches & Alerts — for repeat institutional users, a saved-search system with email alert frequency controls (a real recurring-use feature this audience relies on, unlike one-off residential search).
### 5. Broker Listing Submission (secondary flow) — a distinct, clearly separated path for brokers to list a property, with required fields matching institutional data standards (not a casual "add photos" consumer flow).

## STATES, RESPONSIVE, ACCESSIBILITY
Empty results state suggests specific filter relaxations ("Try expanding your size range — 3 properties match within +20%") rather than a bare "no results." On mobile, map and list become tabs (not simultaneous split-view, which doesn't work below ~900px) with a toggle; filter bar collapses into a full-screen sheet. Data table remains horizontally scrollable with sticky first column (property name) rather than reflowing into unreadable stacked cards. Map markers have accessible text alternatives via a synchronized, screen-reader-navigable list — the map itself is supplementary, the list is the accessible source of truth.

## STRICT RULES
Never show a property without its core institutional data fields (cap rate/NOI/zoning) — incomplete listings must be visually flagged as such ("Financials pending"), not silently omitted. No emotional lifestyle photography framing — this is underwriting-grade research software, not home-buying inspiration content.
```

---

TEMPLATE 009 — Boutique Architecture Studio Portfolio

```text
Act as a senior designer who understands architectural presentation and a frontend engineer who prioritizes image fidelity over cleverness. Build the portfolio site for "{{BRAND_NAME}}", a boutique architecture studio ({{STUDIO_FOCUS}}, e.g. residential and cultural projects). Audience: prospective clients (often other architects, developers, or discerning private clients) and design-press/awards juries — both groups judge competence primarily through the quality of the photography and the restraint of its presentation, not through copy.

## PRODUCT REASONING
The work must be shown at the largest, highest-fidelity size the format allows — any UI chrome competing visually with the photography is a design failure in this category specifically. Project sequencing (which images in what order) is itself an editorial decision the studio makes per project, so the CMS/template must support variable-length, variable-pacing project narratives rather than a fixed template.

## TECH STACK (justified)
Astro 4 (near-zero JS for what is fundamentally a photography-led content site; fast image-heavy page loads matter more here than interactivity); Tailwind CSS v4 for restrained chrome; native `<img>` with modern format negotiation (AVIF/WebP) and the framework's built-in image optimization — no animation library needed beyond CSS crossfades.

## DESIGN SYSTEM
Colors: --bg:#FFFFFF · --fg:#111111 · --muted:#6B6B6B — genuinely minimal, no secondary surface color; the photography supplies all color in practice.
Typography: single family "Neue Haas Unica," used at exactly two sizes sitewide (a small caps label size for project metadata, and a slightly larger size for the studio statement) — resisting the urge to add a decorative display face, since restraint is the actual brand position here.
Grid: full-bleed imagery, no max-width constraint on photography; text content constrained to 640px reading width when it appears, off to one side of the image.

## SECTIONS
### 1. Index (the homepage IS a project grid, not a hero) — a single-column or sparse two-column list of project thumbnails, each labeled only with project name, typology, and year (small caps, no descriptive marketing copy on the index) — the restraint of the index itself signals confidence.
### 2. Project Page — full-bleed image sequence (the studio's own curated pacing, {{PROJECT_IMAGE_1..N}}), interspersed with short factual captions (location, program, size, completion year, awards if any) never marketing adjectives ("stunning," "innovative") — architecture press and juries specifically penalize promotional language in this category.
### 3. Studio Statement — a single page, one paragraph of real philosophy text, principal names, and press mentions (logos of publications that have covered the studio, if {{PRESS_LOGOS}} supplied) rendered small and unobtrusive.
### 4. Contact — a plain mailto link and studio address; no contact form, no CTA button styling — a boutique studio at this level does not need conversion-optimized forms, and having one would undercut the positioning.

## STATES, RESPONSIVE, PERFORMANCE
Images lazy-load below the fold with blur-up placeholders generated at build time (matching the image's dominant color, not a generic grey box) so the page never shows a jarring pop-in. On mobile, the full-bleed sequence remains full-bleed (never adds padding around images to "fit a card") — cropping/composition decisions stay with the photography, not the layout system. Largest Contentful Paint is the single most important metric to protect on this site, given the imagery-first content; hero project image is preloaded with `fetchpriority="high"`.

## STRICT RULES
Never use stock architectural photography. Never add marketing copy ("award-winning," "world-class") to project pages — let press mentions and awards, if real, speak for themselves as factual citations only. No scroll-jacking or pinned-scroll gimmicks — the photography does not need help.
```

---

TEMPLATE 010 — Construction Project Management SaaS

```text
Act as a senior enterprise SaaS designer with field-operations UX experience and a frontend engineer building for mixed office/jobsite use. Build "{{BRAND_NAME}}", a project management platform for general contractors coordinating subcontractors, schedules, and daily field reports across active construction sites. Audience: office-based project managers (desktop, detail-oriented scheduling) AND superintendents/foremen on jobsites (mobile, often gloved hands, bright sunlight, spotty connectivity) — this single fact drives most of the product's real design constraints, and the marketing site must demonstrate both contexts, not just the office dashboard.

## PRODUCT REASONING
A construction PM tool that only shows a polished desktop dashboard in its marketing is telling an informed buyer it wasn't built for the field — this audience will specifically ask "does this work when I'm standing in a trench with no signal." The site must show the offline-capable mobile field-report flow as prominently as the office Gantt chart.

## TECH STACK (justified)
Next.js 15; Tailwind CSS v4; Framer Motion for Gantt-chart interactions; the marketing page itself doesn't need offline support, but its field-mockup section must accurately represent the real product's offline-sync behavior (a specific, honest UI state, not glossed over).

## DESIGN SYSTEM
Colors: --bg:#F5F4F1 (a warm concrete-adjacent neutral, distinct from typical cool-grey SaaS) · --surface:#FFFFFF · --border:#D8D5CC · --fg:#201E19 · --muted:#6E6A60 · --accent:{{ACCENT_HEX}} (fallback #C9491C, a hi-vis-adjacent safety orange — functional and industry-appropriate rather than a generic SaaS blue).
Typography: "Inter Tight" headings, "Inter" body, tabular-nums for schedule/dates; deliberately high base font size (17px) and high contrast throughout, since field-mockup content should stay legible under simulated "bright sunlight" high-contrast conditions.

## SECTIONS
### 1. Hero — Split: office Gantt-chart view (desktop-frame) and field daily-report view (phone-frame, shown with a visible "Offline — will sync" badge on one entry) presented side by side as equally weighted, communicating the dual-context product from the first screen.
### 2. Daily Field Reports Demo — an interactive mock: superintendent logs weather, crew count, and a photo of completed work; submitting while "offline" (simulated) queues the entry with a visible pending-sync indicator, then shows it syncing when "back online" — this exact interaction is the product's core trust-builder for field crews.
### 3. Schedule & Subcontractor Coordination — Gantt chart with drag-to-reschedule (Framer Motion drag constraints), dependency lines redrawing live, and a "notify affected subs" toast appearing on any date change — showing the coordination consequence, not just the chart itself.
### 4. Punch List & Photo Documentation — grid of field photos tagged to specific locations/trades, with status states (open/in review/closed) shown via both color and icon.
### 5. Reporting for Owners/GCs — exportable progress reports (PDF preview mock) since this audience must regularly report upward to clients/owners, a distinct need from day-to-day field coordination.

## STATES, RESPONSIVE, ACCESSIBILITY
Explicit offline/syncing/synced/sync-failed states are core product states, not edge cases, and must each have a distinct, legible visual treatment. Mobile field-report flow uses large touch targets (56px minimum, larger than typical mobile SaaS) accounting for gloved use. Gantt chart on mobile switches to a simplified list-view-with-dates rather than attempting a horizontally-scrollable chart, which is genuinely unusable at jobsite phone sizes.

## STRICT RULES
Never show only the office/desktop experience — field/mobile parity must be demonstrated with equal prominence. Never gloss over offline behavior with a vague "works everywhere" claim; show the actual queued/sync state honestly.
```

---

TEMPLATE 011 — Climate Tech Carbon Accounting Platform (Enterprise)

```text
Act as a senior data-product designer and a frontend engineer experienced with regulatory-adjacent reporting tools. Build "{{BRAND_NAME}}", a platform that helps enterprises measure and report Scope 1/2/3 carbon emissions for compliance and disclosure. Audience: sustainability officers and finance teams who need audit-defensible numbers, not aspirational "green" marketing — this is closer in buyer psychology to accounting software than to a climate-advocacy brand, and the design should reflect that.

## PRODUCT REASONING
Credibility depends on methodology transparency (which emission factors, which calculation standard — GHG Protocol, etc.) more than on visual "sustainability" signaling (leaf icons, green gradients actively undermine credibility with this specific technical buyer). The product surface to demonstrate is the emissions calculation and data-lineage trail — showing your work, similar in spirit to the legal-tech and fintech categories.

## TECH STACK (justified)
Next.js 15; Tailwind CSS v4; D3 for the emissions breakdown visualizations (Sankey-style flow from activity data to Scope 1/2/3 totals is a natural D3 use case); real data-lineage UI, not decorative charts.

## DESIGN SYSTEM
Colors: --bg:#0F1210 · --surface:#171B18 · --border:#262D27 · --fg:#E3E7E2 · --muted:#8B948A — a deliberately restrained near-monochrome dark palette, NOT green-branded; --accent:{{ACCENT_HEX}} (fallback #4C9A7A, used sparingly, only for primary interactive elements, never for chart categories, which use a neutral categorical palette instead).
Typography: "Inter Tight" headings, "Inter" body, "IBM Plex Mono" for methodology references/formulas, tabular-nums throughout data views.

## SECTIONS
### 1. Hero — Live Emissions Breakdown (Sankey diagram, D3) — real-feeling flow from activity categories (fuel, electricity, business travel, purchased goods) into Scope 1/2/3 totals, hoverable nodes revealing the specific emission factor source and calculation.
### 2. Methodology Transparency — explicit statement of which standard is followed ({{STANDARD}}, e.g. GHG Protocol Corporate Standard), which emission-factor databases are used ({{EMISSION_FACTOR_SOURCE}}), and how Scope 3 estimation handles data gaps (a real, hard problem in this category — showing the honest approach, e.g. spend-based estimation with a visible confidence indicator, rather than implying false precision).
### 3. Audit Trail / Data Lineage — for any given number in a report, a "view calculation" panel showing every input that contributed to it, since disclosure reports in this category face external audit and the tool must demonstrably support that.
### 4. Reporting Frameworks Supported — grid of disclosure frameworks ({{FRAMEWORK_1..4}}: CDP, TCFD, CSRD, SEC Climate Disclosure) the platform can export against, each with its own report-template preview.
### 5. Reduction Scenario Modeling — an interactive tool: adjust sliders for specific interventions (e.g. % renewable electricity, fleet electrification %) and see a live-recalculated projected emissions trajectory chart — turning the "now what" question the buyer actually has into an interactive answer rather than a static case study.

## STATES, ACCESSIBILITY, PERFORMANCE
Any estimated (vs. measured) figure is visually distinguished (a dashed line/pattern fill in charts, an "estimated" text badge in tables) — never presented with the same visual confidence as measured data. Sankey diagram has an accessible data-table equivalent alongside it, not only the visualization. D3 transitions are interruptible and respect `prefers-reduced-motion` by rendering the end-state directly.

## STRICT RULES
Never claim a specific reduction percentage or offset-equivalence without a cited methodology. Never use greenwashing visual tropes (stock forest imagery, leaf iconography, gradient-green "eco" branding) — this is enterprise compliance software, and looking like a climate-advocacy brand actively damages credibility with its actual buyer.
```

---

TEMPLATE 012 — Freight & Logistics Tracking Platform (B2B)

```text
Act as a senior logistics-software designer and a frontend engineer skilled in real-time map/data interfaces. Build "{{BRAND_NAME}}", a platform giving shippers real-time visibility into freight shipments across multiple carriers. Audience: logistics coordinators managing dozens to hundreds of concurrent shipments — their core need is exception-based monitoring (which shipments need attention right now), not a pretty map of every truck.

## PRODUCT REASONING
The real product insight: nobody watches a map of on-time shipments. The UI must surface exceptions (delayed, at-risk, temperature excursion for cold-chain) by default, with the "everything is fine" majority collapsed rather than given equal visual weight — this is the opposite instinct from a consumer map-tracking product.

## TECH STACK (justified)
Next.js 15; Tailwind CSS v4; Mapbox GL JS for the geographic layer; a dense, sortable/filterable data table (the primary interface, not the map) built with a virtualized-list approach for hundreds of concurrent shipment rows.

## DESIGN SYSTEM
Colors: --bg:#0E1013 · --surface:#161920 · --border:#262B34 · --fg:#DEE2E8 · --muted:#7A8290 · Status scale: --on-time:#2FA766 · --at-risk:#E8A33D · --delayed:#E5484D · --accent:{{ACCENT_HEX}} (fallback #3E7BFA). Dark UI chosen deliberately: this is an always-open operational tool (like the SOC/financial-terminal categories), often on a secondary monitor for hours at a time.
Typography: "Inter Tight" / "Inter", tabular-nums, "IBM Plex Mono" for tracking/reference numbers specifically (so they're unambiguous to read and copy — a real operational need, not a stylistic choice).

## SECTIONS
### 1. Exception Dashboard (the actual hero, not a marketing hero) — a filtered, sorted-by-urgency table showing only at-risk/delayed shipments first, with an explicit toggle "show all shipments" for the full list — demonstrating the exception-first philosophy immediately rather than a scenic all-shipments map.
### 2. Live Map (secondary, contextual) — shown when a specific shipment row is selected, not as the default view; flies to the shipment's current position with route-so-far and predicted-route-remaining shown differently (solid vs. dashed line).
### 3. Multi-Carrier Normalization — a visual showing raw, inconsistent carrier status codes ("OFD," "Out for Delivery," "017") being normalized into one consistent status taxonomy — the actual hard integration problem this category solves, made visible rather than assumed.
### 4. Alerting Rules — a rules-builder mock ("Notify me if a temperature-controlled shipment exceeds {{THRESHOLD}} for more than {{DURATION}}") since proactive, configurable alerting (not just a dashboard someone has to watch) is the real differentiator buyers evaluate.
### 5. API & EDI Integration — for the technical evaluator on the buying committee: real integration methods (API, EDI 214/990 if relevant to the vertical) listed explicitly, not just a generic "integrates with everything" claim.

## STATES, RESPONSIVE, ACCESSIBILITY
Status is always paired with text label, never color-only, given the operational stakes. Table remains the primary mobile view too (map becomes a drill-down on a selected row, same as desktop) rather than trying to force a data-dense table into a phone-sized card grid — some information genuinely doesn't compress well, and the honest answer is a well-designed horizontally-scrollable table with a frozen identifier column.

## STRICT RULES
Never default to an all-shipments map view as the primary interface — the exception-first table view is the core product argument and must lead. Never fabricate a specific on-time-percentage claim without a sourced benchmark.
```

---

TEMPLATE 013 — Boutique Experiential Travel Agency

```text
Act as a senior brand/editorial designer with travel-industry experience and a frontend engineer who treats imagery as the primary content type. Build the site for "{{BRAND_NAME}}", a boutique travel agency curating small-group, experiential trips to {{DESTINATION_FOCUS}} (e.g. East Africa, the Himalayas). Audience: affluent travelers who could book anything themselves but are paying specifically for curation, access, and a point of view — the site must read as a considered editorial publication about places, not a booking-engine UI with a coat of paint.

## PRODUCT REASONING
This audience is not comparison-shopping on price; they are being sold a specific sensibility. The homepage should function like a magazine front page for the current season's trips, not a search form. Booking itself is a secondary, low-friction action that happens after the visitor is emotionally sold — the inquiry form, not instant checkout, is the correct conversion point (these trips are typically customized and consultative).

## TECH STACK (justified)
Astro 4 with a CMS-driven content model (trips are edited frequently by non-engineers); minimal JS; large, carefully art-directed imagery with the framework's native image optimization; GSAP used sparingly for one signature interaction (a horizontal-scroll destination gallery), not throughout.

## DESIGN SYSTEM
Colors: --bg:#FBF8F3 · --fg:#241F19 · --muted:#8B8175 · --accent:{{ACCENT_HEX}} (fallback a warm terracotta #B5673A) — earthy, editorial, distinct per {{DESTINATION_FOCUS}} (a Nordic-focused agency would use a cooler palette instead — the palette must be chosen to reflect the actual geography being sold, not a generic "travel brand" default).
Typography: Display "Canela" (serif, editorial) for trip titles and pull-quotes; Body "Söhne"; generous line-height (1.7) throughout, matching long-form travel writing conventions.
Grid: asymmetric editorial layout, full-bleed imagery alternating with narrow-column text blocks — deliberately varied per trip, not a repeating card grid.

## SECTIONS
### 1. Current Season (homepage as magazine front page) — 2-3 featured trips presented as full-bleed editorial spreads (image + trip name + one evocative sentence), not a grid of identical cards.
### 2. Trip Page — long-form narrative structure: an opening full-bleed image, a real day-by-day itinerary outline (not marketing bullet points — actual specifics: "Day 3: trek to {{LOCATION}}, overnight at {{CAMP_NAME}}"), a horizontal-scroll image gallery (GSAP horizontal scrub) of real trip photography, and a "what's included" plain list (accommodation level, guiding, permits — the practical information this buyer does need despite the editorial framing).
### 3. The Guides — real guide profiles (name, years of experience in the region, a short bio) — never generic stock "adventure guide" photography; if real guide content isn't available, this section is omitted rather than faked.
### 4. Journal (supporting content) — a small number of long-form dispatches/stories from past trips, reinforcing the point-of-view/expertise positioning.
### 5. Inquiry (the actual conversion point) — a considered, slightly longer-than-usual form (preferred dates, group size, specific interests) reflecting that this is the start of a consultative conversation, not an instant transaction — framed with copy like "Tell us about the trip you're imagining" rather than "Book now."

## STATES, RESPONSIVE, PERFORMANCE
Images are the entire performance budget here — responsive `srcset` sizing tuned per breakpoint, with the largest full-bleed hero images reserved for desktop and appropriately smaller/cropped variants on mobile rather than shipping desktop-sized imagery to a phone. The horizontal-scroll gallery gains touch-swipe on mobile and a visible scroll-progress indicator (thin bar) so users understand there's more content to the side.

## STRICT RULES
Never fabricate a day-by-day itinerary detail that wasn't supplied — use the real {{ITINERARY}} content or a visibly marked "sample itinerary, customized per trip" framing. No generic travel-stock imagery — every image should read as specific to this operator's actual trips.
```

---

TEMPLATE 014 — Independent Literary Magazine (Digital Publishing)

```text
Act as an editorial designer with print-magazine sensibility and a frontend engineer focused on long-form reading experience. Build the site for "{{BRAND_NAME}}", an independent literary magazine publishing essays, fiction, and poetry. Audience: readers and writers who care about typographic craft — this audience will judge the publication's seriousness partly by how well the site handles reading, not by feature richness. Contributors (a secondary but important audience) evaluate the site when deciding whether to submit work, based on how well past work is presented.

## PRODUCT REASONING
Reading comfort at length (measure, line-height, font choice) is the actual product here, more than any interactive feature. Navigation should support browsing by issue (this magazine publishes in discrete issues, not a continuous blog feed) since that's how literary magazines are actually read and referenced.

## TECH STACK (justified)
Astro 4 with MDX for long-form content (editorial control over typography per piece matters, and MDX allows occasional custom formatting within otherwise plain prose); near-zero client JS; a serif reading font served via variable font file to minimize font-loading overhead across weights.

## DESIGN SYSTEM
Colors: --bg:#FFFFFF · --fg:#181614 · --muted:#847E71 · --rule:#DEDBD2 · --accent:{{ACCENT_HEX}} (fallback #B0281C, used only for issue numbers and rare emphasis, never decoratively).
Typography: Display "Tiempos Headline" for titles; Body "Tiempos Text" at 19px (larger than typical web body text — long-form literary reading benefits from a larger size than a SaaS product), measure capped at 68 characters per line, line-height 1.6.
Grid: single reading column for pieces (no sidebar competing with the text); a masthead running head at the top of every page (issue number, section).

## SECTIONS
### 1. Current Issue (homepage) — masthead, then a simple numbered table of contents for the current issue (author, title, genre tag) — text-forward, minimal imagery, matching literary-magazine convention over a typical "featured post" hero pattern.
### 2. Piece Page — running head (issue/section), title in display serif, author byline, then the piece itself set at the reading typography specified above; first paragraph after any section break gets a 3-line drop cap (a genuine editorial-typography detail, not decoration for its own sake); a "next in this issue" link at the end keeps readers moving through the issue as a whole, mirroring print-magazine sequencing.
### 3. Archive by Issue — browse past issues as a simple chronological list (issue number, season/year, theme if any) rather than an infinite blog-style scroll — issues are the organizing unit, and the IA should respect that.
### 4. Submissions — plain-text submission guidelines page (reading period dates, format requirements, response time) — genuinely just well-set text, no form-builder gloss; most literary magazines route submissions through a dedicated external system ({{SUBMISSIONS_PLATFORM_LINK}}), linked plainly.
### 5. About / Masthead — editors, a short mission statement, real prose (not marketing copy).

## STATES, RESPONSIVE, ACCESSIBILITY
Reading-mode considerations apply sitewide, not just to pieces: sufficient contrast, no auto-playing anything, no interstitial newsletter modal interrupting an in-progress read (a newsletter signup exists, quietly, at the end of pieces and in the footer only). Mobile reduces the measure appropriately but keeps the same generous line-height and drop-cap treatment — literary readers on mobile still deserve the typographic care, not a stripped-down experience. Font loads with `font-display: optional` for the body serif specifically, to avoid a layout-shifting swap mid-read on slower connections, accepting a possible fallback-font first render as the better trade-off for a reading-focused site.

## STRICT RULES
Never break a single piece across multiple pages/scroll-triggered lazy sections purely for pageview metrics — respect the reading experience as one continuous piece. No autoplay video, no cookie-consent-driven layout shift above the fold if avoidable. No stock imagery standing in for real cover art or author photography — omit rather than fake.
```

---

TEMPLATE 015 — Independent Game Studio (Narrative Single-Player Game)

```text
Act as a senior games-industry web designer and a frontend engineer experienced with cinematic, media-heavy sites. Build the site for "{{GAME_TITLE}}" by "{{STUDIO_NAME}}", a narrative single-player game ({{GENRE}}, e.g. atmospheric adventure). Audience: players deciding whether to wishlist/buy, plus press and platform curators (Steam, console storefronts) evaluating the game's identity — the site's job is to convey mood and world before mechanics, since narrative games are sold on atmosphere first.

## PRODUCT REASONING
Unlike a multiplayer/competitive game (sold on mechanics and moment-to-moment gameplay clips), a narrative single-player game is sold on world, tone, and story hook — the hero should be a carefully chosen still frame or short ambient loop, not an action montage. Wishlisting on the platform storefront (not an email capture) is the actual conversion goal pre-launch.

## TECH STACK (justified)
Next.js 15 App Router; Tailwind CSS v4; a subtle WebGL/CSS parallax on the hero background (depth-of-field style layered still frames, not a full 3D scene — full 3D would be an unjustified performance cost for what a well-composed parallax achieves); native `<video>` for the single ambient hero loop, muted/looped/no controls, with a static poster fallback.

## DESIGN SYSTEM
Colors: derived from the game's actual key art ({{KEY_ART_PALETTE}}) — this is the one category where the palette should be extracted from the creative work itself rather than chosen independently; typical values might be a desaturated, moody palette (e.g. --bg:#0D0F14 · --fg:#EDEBE6 · --accent:{{ACCENT_HEX}} matched to the game's key art accent color).
Typography: a distinctive display face matching the game's tone (chosen per title, e.g. a hand-tuned serif for a melancholic period piece, a geometric sans for a sci-fi setting) — genre-appropriate, not a generic "gaming" font (angular/aggressive fonts would misrepresent a quiet narrative game).

## SECTIONS
### 1. Hero — ambient video/still loop, game logo, one evocative line (not a feature list), and platform wishlist buttons (Steam/PlayStation/Xbox — only the platforms actually confirmed via {{PLATFORM_LINKS}}) as the primary CTA.
### 2. World / Premise — a short narrative hook (2-3 sentences of real setting/premise copy, not generic "embark on a journey" filler), paired with key art, revealed via a slow crossfade on scroll (900ms+, unhurried, matching the game's tone).
### 3. Media Gallery — a curated horizontal gallery of screenshots ({{SCREEN_1..8}}) presented large, few at a time, letterboxed to the game's actual aspect ratio (never stretched/cropped to fit a generic grid) — plus one real gameplay trailer embed if {{TRAILER_URL}} exists.
### 4. Studio / Credits — small, honest "about the studio" section; team size and prior work if relevant to credibility (press and curators do check this), no inflated claims.
### 5. Press Kit Link — a dedicated, clearly linked press-kit page/download (key art, logos, fact sheet) since press/curators specifically need this and its absence is a real friction point in this category.
### 6. Wishlist CTA (repeated) — platform buttons repeated at page end, matching the single actual conversion goal throughout.

## STATES, RESPONSIVE, PERFORMANCE
Ambient hero video has a genuine static-image fallback for reduced-motion preference and for slow connections (detected via a lightweight connection-aware check, falling back gracefully rather than forcing a large video download). Media gallery on mobile becomes a swipeable single-image-at-a-time view (matching how screenshots are actually meant to be looked at, not shrunk into a grid). Largest asset (hero video) is compressed and served at the smallest acceptable bitrate/resolution for a background loop — this is not the place to ship a 4K trailer file as a looping background.

## STRICT RULES
Never use combat/action-montage editing for a narrative-focused game's hero if that doesn't reflect the actual gameplay — misrepresenting tone in marketing directly damages the eventual player-review-driven storefront reputation this category depends on. Never list a platform in wishlist CTAs that hasn't been actually confirmed.
```

---

TEMPLATE 016 — Competitive Multiplayer Game Platform

```text
Act as a senior games-industry designer specializing in live-service products and a frontend engineer comfortable with high-motion, high-energy interfaces. Build the site for "{{GAME_TITLE}}", a competitive multiplayer game with ranked seasons and esports ambitions. Audience: players evaluating whether the game has an active, skilled community worth investing time in — proof of an active playerbase and competitive depth matters more here than narrative/mood (the opposite emphasis from Template 015).

## PRODUCT REASONING
This category is sold on momentum and mastery: live player counts, current season standings, and skill-expression clips are the actual trust signals, not atmosphere. The site should feel like it has a pulse — genuinely current data (season number, patch version) displayed prominently, since a stale-looking competitive-game site (an old season number, no recent patch notes) actively signals a dying game to this specific audience.

## TECH STACK (justified)
Next.js 15 App Router with real API-backed live data (current season, player count if publicly shareable) rather than static marketing copy; Tailwind CSS v4; GSAP for high-energy hero motion (kinetic type, fast cuts) matching the game's actual pace; a lightweight WebGL hero option only if the game's own visual identity is 3D-native — otherwise sharp video/motion-graphics editing achieves the same energy without unjustified render cost.

## DESIGN SYSTEM
Colors: high-contrast, saturated, derived from the game's actual UI/key art — typically dark base with one or two extremely saturated accent colors used for rank tiers and CTAs (e.g. --bg:#0A0A0F · --accent:{{ACCENT_HEX}}, plus a distinct rank-tier color scale: bronze/silver/gold/platinum/diamond, each a real, distinguishable hue — this scale must be accessible-distinguishable, not just aesthetic, since players reference rank colors constantly in-game).
Typography: an aggressive, condensed display face for headlines and rank/stat displays; tabular-nums mandatory for all stats (K/D, win rate, rank).

## SECTIONS
### 1. Hero — Kinetic Motion + Live Season Data — fast-cut motion graphics or gameplay-clip montage (actual skill-expression moments, not a slow narrative pan), overlaid with a real live data strip: current season name/number, a live-updating (or recently-cached) global player count, and time remaining in the current ranked season (countdown, tabular-nums).
### 2. Ranked Ladder Preview — a real-feeling leaderboard snippet (top players this season, rank icons, real or realistic handles) with the rank-tier color scale visibly in use — demonstrating the actual competitive structure, not describing it abstractly.
### 3. Skill Expression Clips — a gallery of short gameplay clips (autoplay muted on hover/focus only, never autoplay on load at this density) showing genuinely impressive plays — curated for skill, not generic gameplay.
### 4. Patch Notes / Live Ops Cadence — a visible, dated feed of recent patches ({{PATCH_1..3}}) proving active, ongoing development — staleness here is one of the strongest negative signals for this category, so this section must always reflect genuinely current content.
### 5. Esports / Community (if applicable) — tournament results or community-event highlights if {{ESPORTS_DATA}} exists; omitted rather than faked if the game has no competitive scene yet.
### 6. Play Now CTA — platform download/store links, repeated at multiple scroll points given how motion-heavy and long the page is.

## STATES, RESPONSIVE, PERFORMANCE
Live player count and season timer must be clearly timestamped ("as of {{TIMESTAMP}}") if not truly real-time, to avoid the specific credibility risk of a stale number presented as live. Clip gallery lazy-loads video sources (poster-frame-first) and caps concurrent video decode to avoid the well-known mobile performance/battery cost of multiple autoplaying videos. High-motion hero respects `prefers-reduced-motion` by replacing kinetic type/fast cuts with a single strong static frame plus the same live-data strip — the data, not just the motion, carries the message.

## STRICT RULES
Never show a stale season number or player count without a visible timestamp. Never fabricate esports/tournament content. Motion energy must never come at the cost of the live-data strip's legibility — if forced to choose, data readability wins.
```

---

TEMPLATE 017 — Canvas-Based Creative Design Tool (Figma-like)

```text
Act as a senior product designer who has worked on creative tools and a frontend engineer skilled in canvas/interaction-heavy UI. Build "{{BRAND_NAME}}", a collaborative design tool for interface and product design. Audience: designers evaluating whether to switch tools — deeply skeptical of marketing claims about "performance" and "collaboration" until they can feel the actual canvas responsiveness, since that feel is the entire product experience in this category.

## PRODUCT REASONING
The only credible demo is a genuinely interactive embedded canvas, not a video of one — this audience will bounce from a video demo specifically because they know real-time manipulation feel can't be faked in a recording. The marketing site itself should demonstrate the design system philosophy (since design tools are judged partly on whether their own site is well-designed) without becoming precious about it.

## TECH STACK (justified)
Next.js 15; a real embedded canvas built with a lightweight 2D rendering approach (SVG/Canvas hybrid) for the interactive hero demo — genuinely draggable/resizable shapes, not a fake looping animation; Tailwind CSS v4 for surrounding chrome; Framer Motion for chrome transitions only, never inside the canvas itself (canvas interactions need raw pointer-event handling, not a motion library's abstraction).

## DESIGN SYSTEM
Colors: --bg:#FFFFFF · --canvas-bg:#F0F0F2 (a distinct, slightly cooler grey specifically for canvas areas, differentiating "tool surface" from "page chrome") · --border:#E4E4E8 · --fg:#111114 · --muted:#75757F · --accent:{{ACCENT_HEX}} (fallback #6E56F8). Multiplayer cursor colors: a fixed palette of 6 distinguishable hues assigned round-robin to collaborators, never reused for anything else in the UI, so a cursor color is always unambiguous.
Typography: "Inter" throughout — clean, gets out of the way, since the product's own interface typography (not the marketing site's) is what this audience actually judges.

## SECTIONS
### 1. Hero — Live Interactive Canvas: a real, small embedded canvas with 4-5 draggable/resizable shape objects, a functioning selection tool, and 1-2 simulated "other collaborator" cursors moving and leaving comments live (clearly simulated, not claiming to be real other users) — proving canvas feel directly rather than describing it.
### 2. Performance Claim, Demonstrated Not Asserted — a live FPS counter overlay (small, dismissible) on the interactive canvas while the visitor manipulates it, so "fast" is something they can literally watch a number confirm rather than take on faith.
### 3. Real-Time Collaboration — multiplayer cursor demo (as above) plus a live comment thread on a canvas object, showing resolve/reply states.
### 4. Component System / Design Tokens — a real interactive demo: changing one token value (e.g. a color variable) propagates live across multiple instances on the canvas, demonstrating the actual systems-thinking feature this audience cares about most when evaluating a switch.
### 5. Plugin / API Ecosystem — grid of real integrations/plugins ({{INTEGRATION_1..8}}), each with a one-line description of what it actually does, not just a logo wall.
### 6. Import From Your Current Tool — a specific, named migration path (e.g. "Import your Figma files in one click") since switching cost is the #1 objection for this audience, and addressing it concretely converts better than generic feature comparison.
### 7. Pricing — per-seat/team tiers from {{PRICING_TIERS}} with an editor-vs-viewer seat distinction shown clearly (a real pricing-model detail specific to this category).

## STATES, ACCESSIBILITY, PERFORMANCE
Interactive canvas demo has a genuine empty/reset state (a visible "reset demo" control) since visitors will make a mess of it. Canvas interactions are keyboard-accessible at a basic level (arrow-key nudge on selected object, Tab to cycle objects) — full parity with the real product isn't required in a marketing demo, but zero keyboard access to an interactive canvas would be a real regression from the product's own accessibility standard. The interactive canvas is the heaviest asset on the page and is code-split, loading after the hero's static first paint so LCP isn't blocked by it.

## STRICT RULES
Never fake the collaboration/performance demos with pre-recorded video presented as live interaction. Never claim a specific performance multiple ("10x faster") without the live FPS demonstration backing it up on the same page.
```

---

TEMPLATE 018 — Team Whiteboard / Async Collaboration Tool

```text
Act as a senior collaboration-software designer and a frontend engineer experienced with real-time multi-user interfaces. Build "{{BRAND_NAME}}", an infinite-canvas whiteboard for distributed team brainstorming and planning. Audience: team leads and facilitators evaluating tools for remote/hybrid team workshops — the emotional problem being sold against is "the awkward, laggy, hard-to-follow remote whiteboard session," so the site must feel calm, spacious, and low-friction, distinct in tone from the more technical, performance-flexing register of the design-tool template above.

## PRODUCT REASONING
This buyer isn't a power-user designer; they're a facilitator who needs the tool to disappear during a live session. The product surface to demonstrate is a template-driven workflow (starting a retro/planning session from a template) more than raw canvas manipulation — templates are the actual adoption driver for this category's less technical buyer.

## TECH STACK (justified)
Next.js 15; Tailwind CSS v4; a lighter-weight interactive canvas than a full design tool (sticky notes, simple shapes, text) — genuinely interactive but intentionally less feature-dense, matching the product's own simplicity positioning; Framer Motion for the calm, soft entrance/exit of canvas elements (stickies "pop" in with a gentle scale+fade, 220ms).

## DESIGN SYSTEM
Colors: --bg:#FFFFFF · --canvas-bg:#FAFAF7 (warm, calm, not clinical) · --border:#E9E7DF · --fg:#1F1D18 · --muted:#7C7869 · --accent:{{ACCENT_HEX}} (fallback #FF8A5B, warm and approachable). Sticky-note palette: 6 soft, low-saturation colors (not the harsh primary yellow of a literal sticky note) so a board full of notes still reads as calm rather than visually loud.
Typography: "Inter" for chrome; a friendly handwriting-adjacent face used only for sticky-note placeholder text in demos, reinforcing the "this replaces physical stickies" positioning without being twee.

## SECTIONS
### 1. Hero — Live Template Demo: an embedded mini-canvas pre-populated with a real retrospective template (three columns: Went Well / Didn't Go Well / Action Items, each with 2-3 real-feeling sample sticky notes) that the visitor can actually add a sticky to — demonstrating the exact first-five-minutes experience of a real session.
### 2. Template Gallery — a grid of real named templates ({{TEMPLATE_1..8}}: Sprint Retro, Roadmap Planning, User Journey Map, Icebreaker) each with a small live-preview thumbnail (a genuinely rendered mini-canvas snapshot, not a generic icon) — since template variety is the actual feature this buyer shops for.
### 3. Facilitation Tools — timer, voting/dot-voting demo (click to place a vote dot on a sticky, tally updates live), and a "reveal" mechanic (hide responses until a facilitator reveals them) — these specific facilitation mechanics are what differentiate this from a generic drawing canvas, and each deserves its own concrete demo rather than a bullet point.
### 4. Async Mode — a demonstration of a board left open between synchronous sessions, with new contributions marked "added since you last viewed" (a small unread-indicator pattern) — since this category increasingly sells on async, not just live-meeting, collaboration.
### 5. Integrations — calendar/video-call integrations ({{INTEGRATION_1..4}}: Zoom, Google Calendar, Slack) since this tool's usage is scheduled around meetings, a distinct integration need from a general design tool.
### 6. Pricing / Team CTA — simple per-seat pricing, with a clear "start a free session, no signup" option (low-friction trial matching the low-stakes, exploratory nature of a first whiteboard session).

## STATES, ACCESSIBILITY, PERFORMANCE
Voting/reveal mechanics have explicit, understandable states (votes hidden vs. revealed) communicated with text labels, not only a lock icon. The interactive demo canvas works via both mouse and touch equally well, since facilitators frequently use this product on tablets during in-person hybrid sessions. Canvas demo loads progressively (template structure first, then interactive affordances) so the page feels instant even before full interactivity is ready.

## STRICT RULES
Never show a cluttered, chaotic-looking canvas in marketing screenshots — calm and legible must be demonstrated even in a "busy team board" example. Never claim facilitation features (voting, timer, reveal) without demoing the actual mechanic interactively.
```

---

TEMPLATE 019 — Enterprise CRM for Complex B2B Sales

```text
Act as a senior enterprise SaaS designer with sales-operations domain knowledge and a frontend engineer building for data-dense, permission-layered UI. Build "{{BRAND_NAME}}", a CRM built specifically for complex, multi-stakeholder B2B sales cycles (as opposed to simple transactional sales). Audience: VPs of Sales and RevOps leaders evaluating a switch from a generic CRM — their real pain is pipeline visibility across deals with many stakeholders and long cycles, not basic contact management, which every CRM already does.

## PRODUCT REASONING
The differentiator to prove is multi-threading visibility (seeing all stakeholders in a deal and their relative influence/sentiment) and forecast accuracy, not generic "manage your contacts" framing. The demo must show a genuinely complex deal (multiple contacts, a stalled stage, a risk flag) rather than a clean, simple example deal that undersells the product's actual value for its target buyer.

## TECH STACK (justified)
Next.js 15; Tailwind CSS v4; a real Kanban-style pipeline board (drag-and-drop stage changes via a library like dnd-kit) as the primary interactive demo; D3 or a charting library for the forecast-accuracy visualization.

## DESIGN SYSTEM
Colors: --bg:#F7F8FA · --surface:#FFFFFF · --border:#E2E5EA · --fg:#15181D · --muted:#5F6672 · --accent:{{ACCENT_HEX}} (fallback #2E5CE6). Deal-health scale (distinct from generic status color): --healthy:#1AA179 · --at-risk:#D98E1E · --stalled:#D9432E, used consistently on pipeline cards, forecast charts, and deal detail views.
Typography: "Inter Tight" / "Inter", tabular-nums for all deal values and dates.

## SECTIONS
### 1. Hero — Live Pipeline Board: a real Kanban board with realistic complex deals (multi-stakeholder deal cards showing 3-4 contact avatars, a deal-health indicator, and days-in-stage) — draggable between stages, demonstrating actual product interaction, not a static screenshot.
### 2. Multi-Threading View — clicking a deal opens a stakeholder map (a real org-chart-style visual: economic buyer, champion, technical evaluator, blocker, each with a relationship-strength indicator) — this specific visualization is the product's real differentiator and deserves its own dedicated, deeply-demonstrated section rather than a feature-list bullet.
### 3. Forecast Accuracy — a chart comparing "rep-submitted forecast" vs. "AI-adjusted forecast" vs. "actual closed" over past quarters (using {{FORECAST_DATA}} if real, otherwise a clearly labeled illustrative example) — the second most important buying criterion for this persona, made visual.
### 4. Activity & Engagement Signals — a timeline showing real signal types this CRM surfaces beyond manual logging (email opens, meeting no-shows, contract review time) since automatic signal capture (vs. manual data entry) is a major switching driver from legacy CRMs.
### 5. Admin & Permissions — for the RevOps buyer specifically: a role/permission matrix mock showing field-level and pipeline-level access control, since enterprise deployments live or die on this being solid.
### 6. Migration From Existing CRM — a specific, named migration path and data-mapping preview, addressing switching-cost objection directly, as with the design-tool template.
### 7. Book a Demo — this category sells via sales-assisted demo; the CTA form should qualify by team size and current CRM.

## STATES, ACCESSIBILITY, PERFORMANCE
Deal-health color is always paired with a text label and an icon shape (not color alone) given how central this signal is to daily use. Kanban drag-and-drop has a full keyboard-operable alternative (select a card, use a menu/keyboard shortcut to move stages) since drag-and-drop-only interfaces are a common, serious accessibility gap in this product category. Pipeline board virtualizes off-screen columns/cards for realistic enterprise data volumes (hundreds of deals) without jank.

## STRICT RULES
Never demo an unrealistically simple, single-stakeholder deal — the complexity is the point and must be shown. Never fabricate forecast-accuracy data without labeling it illustrative if real data isn't supplied.
```

---

TEMPLATE 020 — HR / People Operations Platform

```text
Act as a senior HR-tech product designer and a frontend engineer who understands sensitive-data UI patterns. Build "{{BRAND_NAME}}", an HR platform covering time-off, performance reviews, and org-chart management for mid-size companies. Audience: two distinct users of the same product — HR administrators (need control, compliance, reporting) and every employee at the company (need a simple, low-friction self-serve experience for time-off requests). The marketing site must speak to the HR buyer while accurately representing the employee-facing experience, since a bad employee experience is the #1 driver of HR software churn.

## PRODUCT REASONING
HR buyers have been burned by "beautiful admin, painful employee UX" tools before — showing the actual employee self-serve flow (not just the admin dashboard) is a specific trust-builder for this informed buyer. Sensitive data (performance review content, PTO balances) requires visibly considered privacy/permission handling shown in the product surface, not just asserted in a security page.

## TECH STACK (justified)
Next.js 15; Tailwind CSS v4; Framer Motion for the org-chart interaction (expand/collapse) and the time-off-request flow.

## DESIGN SYSTEM
Colors: --bg:#FFFFFF · --surface:#F6F7FB · --border:#E5E8F0 · --fg:#1A1D29 · --muted:#656B7D · --accent:{{ACCENT_HEX}} (fallback #4E63F0) — approachable, warm-adjacent blue, avoiding both sterile corporate-grey and overly playful startup color, matching the emotional register of "workplace software everyone has to use, including non-technical staff."
Typography: "Inter" throughout, minimum 15px body — this product is used by every employee regardless of tech comfort, and legibility defaults should assume a broad, non-technical audience.

## SECTIONS
### 1. Hero — Split Admin/Employee Preview: two small phone/desktop-frame mockups side by side — admin dashboard (headcount, pending approvals) and employee view (a simple "Request time off" button and calendar) — explicitly showing both sides of the product from the first screen, addressing the "will my employees actually use this" concern directly.
### 2. Employee Self-Serve Flow (interactive) — a real mini-demo: employee selects dates on a calendar, sees remaining PTO balance update live, submits, and sees a pending-approval state — genuinely showing the 30-second task this replaces a clunky spreadsheet/email process for.
### 3. Approval & Org Visibility (admin side) — manager approval queue, team calendar heat-map (who's out when, useful for coverage planning), and org chart with expand/collapse by department.
### 4. Performance Reviews — a review-cycle timeline (self-review → manager review → calibration → delivered) with explicit visibility rules shown ("Only visible to you and your manager until calibration is complete") — since review-content privacy is a real, specific trust concern for this category.
### 5. Compliance & Reporting — jurisdiction-aware time-off policy handling (if {{MULTI_JURISDICTION}} applies) and exportable compliance reports (EEO-1 style, if relevant to {{MARKET}}) for the HR admin's own reporting obligations.
### 6. Integrations — payroll and SSO integrations ({{INTEGRATION_1..5}}), since HR software must slot into an existing, often legacy, systems stack.
### 7. Pricing / Demo CTA — per-employee pricing from {{PRICING_TIERS}}, with a demo-request path for larger org sizes and self-serve trial for smaller ones (a real bifurcation point in this category's actual go-to-market).

## STATES, ACCESSIBILITY, PERFORMANCE
PTO balance updates are always shown as a running total, never requiring the employee to calculate remaining days themselves. Review-cycle visibility states (draft/submitted/visible-to-manager/calibrated/delivered) are each explicitly labeled in the UI, not implied. Org chart is fully keyboard-navigable (arrow keys between nodes, Enter to expand) since this is core information architecture, not a decorative visualization.

## STRICT RULES
Never show only the admin-side experience — the employee self-serve flow must be demonstrated with genuine care, given its role in actual product adoption. Never imply review content is visible to parties it isn't — visibility-scope claims in an HR product are a real trust and legal issue, not just a UX nicety.
```

---

TEMPLATE 021 — Applicant Tracking / Recruitment Platform

```text
Act as a senior recruiting-software designer and a frontend engineer experienced with high-volume list/pipeline UI. Build "{{BRAND_NAME}}", an applicant tracking system for talent teams managing multiple open roles and high applicant volume. Audience: talent acquisition leads and hiring managers — their core pain is candidate pipeline visibility and reducing time-to-hire, and (increasingly) a real evaluation criterion is whether the tool actively reduces bias in screening, which deserves substantive treatment, not a token diversity-statement line.

## PRODUCT REASONING
The product surface to demonstrate is the pipeline-per-role kanban and the structured-interview-scorecard flow — this is what differentiates a real ATS from a spreadsheet, and it's what a hiring manager (often not the primary buyer, but a critical influencer) actually touches day to day.

## TECH STACK (justified)
Next.js 15; Tailwind CSS v4; drag-and-drop pipeline (dnd-kit) similar in spirit to the CRM template but with recruitment-specific stages (Applied → Screen → Interview → Offer → Hired); a structured scorecard form component.

## DESIGN SYSTEM
Colors: --bg:#FFFFFF · --surface:#F6F8F7 · --border:#E1E7E3 · --fg:#16201A · --muted:#616E64 · --accent:{{ACCENT_HEX}} (fallback #2F8F5B). Neutral, professional, deliberately avoiding both cold corporate grey and playful startup color — recruitment software sits between HR and hiring-manager audiences and should read as credible to both.
Typography: "Inter Tight" / "Inter", tabular-nums for time-in-stage and applicant counts.

## SECTIONS
### 1. Hero — Live Pipeline Board per Role: a real Kanban board for one open role showing candidate cards (name, current stage, days-in-stage, scorecard-average if past interview stage) — draggable between stages.
### 2. Structured Interview Scorecards — an actual scorecard form demo (competency-based questions with a 1-5 rating and required written justification field) — the concrete mechanism by which the tool claims to reduce inconsistent, biased evaluation, shown rather than asserted.
### 3. Bias-Reduction Features (substantive) — specific, real mechanisms if the product has them: anonymized resume review mode (name/photo hidden during initial screen), structured (vs. freeform) scorecards enforced before an offer can be extended, interviewer calibration reports — each explained concretely with what it actually changes about the hiring process, not a generic "we care about diversity" statement.
### 4. Candidate Experience (the applicant's side) — a brief demonstration of the actual application form and status-update emails candidates receive, since candidate experience affects the hiring company's employer brand and is a real evaluation criterion for sophisticated buyers.
### 5. Time-to-Hire Analytics — funnel visualization (applied → hired, with drop-off rates per stage) and time-in-stage benchmarking against {{INDUSTRY_BENCHMARK}} if available.
### 6. Integrations — job board syndication ({{JOB_BOARD_1..5}}: LinkedIn, Indeed) and HRIS/payroll handoff on hire, since recruitment software sits at the start of a longer HR pipeline.
### 7. Pricing / Demo CTA — per-open-role or per-seat pricing from {{PRICING_TIERS}}.

## STATES, ACCESSIBILITY, PERFORMANCE
Scorecard forms require the written-justification field before submission when a rating is below a configurable threshold (a real product rule worth showing, since it's part of the actual bias-reduction mechanism). Pipeline board keyboard-operable alternative to drag-and-drop, same requirement as the CRM template and for the same underlying reason. Candidate-count-heavy pipeline views virtualize rendering for realistic high-volume roles (hundreds of applicants).

## STRICT RULES
Never reduce bias-reduction claims to a generic diversity statement without a concrete product mechanism behind each claim. Never fabricate time-to-hire benchmark data without a cited source.
```

---

TEMPLATE 022 — Marketing Automation & Campaign Analytics Platform

```text
Act as a senior marketing-ops product designer and a frontend engineer skilled with multi-channel data visualization. Build "{{BRAND_NAME}}", a platform for planning, executing, and measuring multi-channel marketing campaigns (email, paid, social). Audience: marketing ops leads and CMOs who are attribution-skeptical — most marketing tools overclaim ROI, so the credible move is transparent methodology on attribution modeling, similar in spirit to the carbon-accounting template's methodology transparency.

## PRODUCT REASONING
The real differentiator to prove is cross-channel attribution done honestly (showing which model is used and its limitations) rather than a single inflated "marketing generated $X in pipeline" hero number, which sophisticated buyers have learned to distrust from other tools.

## TECH STACK (justified)
Next.js 15; Tailwind CSS v4; D3 for the multi-touch attribution visualization (a Sankey or multi-touch-path diagram is the natural fit, as in the carbon-accounting and logistics templates); a campaign-builder drag interface for the workflow demo.

## DESIGN SYSTEM
Colors: --bg:#FFFFFF · --surface:#F7F7FB · --border:#E6E5F0 · --fg:#18172A · --muted:#65637A · --accent:{{ACCENT_HEX}} (fallback #6D4AFF). Channel color-coding (used consistently across all charts): email/paid-search/paid-social/organic each get one fixed, distinguishable hue, never reused for anything else.
Typography: "Inter Tight" / "Inter", tabular-nums throughout.

## SECTIONS
### 1. Hero — Campaign Performance Overview: a real-feeling multi-channel dashboard (spend, conversions, and a clearly-labeled attribution model selector: "Last-touch / First-touch / Linear / Data-driven") — switching the selector live recalculates the displayed conversion credit per channel, demonstrating the actual honest-methodology argument interactively rather than asserting it in copy.
### 2. Attribution Path Visualization — a Sankey-style diagram (D3) of real customer journey paths across touchpoints, with the explicit model applied shown affecting which touchpoint gets credit — this interactive, methodology-transparent demo is the actual product argument.
### 3. Campaign Builder — a drag-and-drop multi-step campaign flow (e.g. email → wait 3 days → conditional branch based on open) shown as a real interactive canvas, demonstrating workflow-building capability concretely.
### 4. Cross-Channel Reporting — a unified reporting view combining channels that are normally siloed in separate platforms (the actual pain point this category solves), with export/scheduled-report functionality shown.
### 5. Integrations — ad platforms and CRM/email tools ({{INTEGRATION_1..8}}: Google Ads, Meta Ads, Salesforce, HubSpot) since this product's value depends entirely on data-source breadth.
### 6. Pricing — tiered by contact volume or ad spend managed, from {{PRICING_TIERS}}.

## STATES, ACCESSIBILITY, PERFORMANCE
Attribution model selector always shows a one-line plain-language caveat about that model's known bias (e.g. "Last-touch overweights bottom-funnel channels") — this honesty is the core credibility mechanism for the whole page. Sankey/path diagrams have an accessible tabular alternative. Dashboard charts avoid unlabeled dual-axis charts (a common, genuinely misleading marketing-analytics pattern) — every chart with two metrics uses either a single axis or clearly separate small multiples.

## STRICT RULES
Never lead with a single inflated attribution number without the model used clearly labeled next to it. Never present "last-touch" and "data-driven" attribution results as if they'd naturally agree — show that they differ, since that difference is the actual point being made about honest measurement.
```

---

TEMPLATE 023 — Business Intelligence / Data Analytics Platform (Self-Serve BI)

```text
Act as a senior data-product designer and a frontend engineer specializing in dashboard/query interfaces. Build "{{BRAND_NAME}}", a self-serve BI platform letting non-technical business users build their own dashboards from company data without writing SQL. Audience: two personas again — data teams (evaluating governance, semantic-layer control, whether this creates chaos) and business users (evaluating whether they can actually self-serve without help) — the site must resolve the data team's specific fear: "if we give business users a query builder, will it create a mess of inconsistent metrics."

## PRODUCT REASONING
The differentiator to prove is a governed semantic layer underneath a self-serve UI — showing that "revenue" means the same verified thing everywhere in the tool, set by the data team once, is the actual sale to the skeptical technical buyer, more than the drag-and-drop chart builder itself (which every BI tool has).

## TECH STACK (justified)
Next.js 15; Tailwind CSS v4; a real drag-and-drop chart builder demo (field list → drop onto chart canvas → chart renders) using a lightweight charting library; a distinct "semantic layer" visual (a data-team-facing view, different in tone/density from the business-user builder) to serve both personas without conflating them.

## DESIGN SYSTEM
Colors: --bg:#FFFFFF · --surface:#F6F7FA · --border:#E3E6EC · --fg:#151924 · --muted:#5E6675 · --accent:{{ACCENT_HEX}} (fallback #2D6CDF). Chart categorical palette: a validated, accessible 8-color qualitative set used consistently across every chart example on the page.
Typography: "Inter Tight" / "Inter", tabular-nums.

## SECTIONS
### 1. Two-Persona Hero — split framing: "For business teams: build your own dashboard in minutes" (left, business-user tone) and "For data teams: one governed source of truth" (right, technical tone) — each with its own short live-feeling preview beneath it (a drag-and-drop chart builder snippet on the left, a semantic-model definition snippet on the right) rather than forcing one generic hero to serve both.
### 2. Self-Serve Chart Builder (interactive) — a real drag-and-drop demo: dragging "Revenue" and "Region" fields onto a canvas renders an actual bar chart, changing chart type via a toggle re-renders it live — genuinely operable, not a static screenshot.
### 3. Governed Semantic Layer (for the data team) — a visual showing a single "Revenue" metric defined once (with its exact calculation logic visible: gross vs. net, currency handling) and then reused consistently across three different example dashboards — directly addressing the "will this create inconsistent metrics" fear.
### 4. Data Freshness & Lineage — a small, real indicator pattern ("Last synced 4 minutes ago" plus a lineage trail back to the source table) since staleness and trust-in-the-number are recurring, specific concerns in self-serve BI.
### 5. Row-Level Security / Permissions — a demo showing the same dashboard rendering different data scoped to a regional manager's permissions vs. an exec's full-access view — a real, differentiating governance feature for the data-team buyer.
### 6. Integrations — data warehouse connections ({{INTEGRATION_1..6}}: Snowflake, BigQuery, Postgres, dbt) since this category's credibility depends on real warehouse-native integration, not proprietary data import.
### 7. Pricing — from {{PRICING_TIERS}}, typically split between viewer seats and creator seats, a real pricing-model detail for this category worth surfacing explicitly.

## STATES, ACCESSIBILITY, PERFORMANCE
Chart builder shows a clear empty state before any fields are dropped ("Drag a field here to get started") and a clear error state for incompatible field combinations (e.g. two text fields on a line chart) with a specific, actionable message. Charts have accessible data-table equivalents toggleable per chart. Data freshness indicator uses `aria-live="polite"` only if it updates without user action; otherwise it's static text, avoiding unnecessary live-region noise.

## STRICT RULES
Never show the self-serve builder without also showing the governance layer underneath it — presenting only one side misrepresents the product to whichever persona is reading. Never fabricate a "last synced" timestamp claim without it reflecting real behavior.
```

---

TEMPLATE 024 — Enterprise API Gateway (Developer Infrastructure)

```text
Act as a senior infrastructure-product designer and a frontend engineer who writes real, correct code samples. Build "{{BRAND_NAME}}", an API gateway product handling authentication, rate limiting, and observability for companies exposing APIs at scale. Audience: platform/infrastructure engineers — an extremely technical, low-tolerance-for-fluff audience who will judge the entire company's credibility by whether the code samples on the homepage actually work.

## PRODUCT REASONING
This audience does not read marketing copy; they read code samples and architecture diagrams. The homepage should function closer to a documentation landing page than a SaaS marketing page — real config snippets, a real latency/overhead number with methodology, and an honest architecture diagram showing exactly where the gateway sits in a request path.

## TECH STACK (justified)
Next.js 15 with MDX for code-heavy sections; Tailwind CSS v4; Shiki for syntax highlighting (server-rendered, matching the code-review-agent template's reasoning); no unnecessary animation — this audience is here to read technical content quickly, not be delighted.

## DESIGN SYSTEM
Colors: --bg:#0A0B0D · --surface:#131518 · --border:#232830 · --fg:#E4E7EB · --muted:#7C8592 · --accent:{{ACCENT_HEX}} (fallback #4FA6FF). Method-color coding for API examples (GET/POST/PUT/DELETE each a fixed, conventional color matching common API-doc conventions this audience already recognizes, e.g. GET blue, POST green, DELETE red).
Typography: "Inter Tight" for the sparse prose; "JetBrains Mono" for all code, 14px, line-height 1.7.

## SECTIONS
### 1. Hero — Real Config + Latency Number: a real gateway config snippet (YAML, {{CONFIG_SAMPLE}}, e.g. a rate-limit rule) shown alongside a specific added-latency figure with its measurement methodology stated inline in small text ("p99 added latency: 1.8ms, measured at {{RPS}} req/s on {{INSTANCE_TYPE}}") — a bare "blazing fast" claim would be actively counterproductive to this audience; a specific, falsifiable number is what earns trust.
### 2. Architecture Diagram — an honest request-path diagram (SVG): client → gateway (auth, rate limit, routing, observability hooks labeled explicitly) → backend services — showing exactly what happens at each hop, not an abstract "smart routing" cloud graphic.
### 3. Multi-Language Quickstart — real, runnable code samples in 3-4 languages ({{LANGUAGE_1..4}}: curl, Node, Python, Go) with a tab switcher — each sample must be a complete, correct, copy-pasteable example, not pseudocode.
### 4. Observability — a real-feeling metrics dashboard snippet (request rate, error rate, p50/p95/p99 latency) since this audience specifically evaluates observability depth as a first-class feature, not an afterthought.
### 5. Rate Limiting & Auth Strategies — concrete supported strategies listed with their actual tradeoffs stated (e.g. "Token bucket: allows bursts, better for user-facing APIs" vs. "Fixed window: simpler, can allow edge-of-window bursts") — showing engineering judgment, not just a feature checklist.
### 6. Self-Hosted vs. Managed — an honest comparison table of what's different between deployment models (a real decision this buyer makes), not a marketing push toward only the higher-margin option.
### 7. Pricing / Docs CTA — usage-based pricing from {{PRICING_TIERS}} with a calculator, and a prominent "Read the docs" CTA at least as prominent as any signup CTA — this audience often wants to read documentation before ever creating an account.

## STATES, ACCESSIBILITY, PERFORMANCE
Code tabs are keyboard-operable (arrow keys between tabs, matching the ARIA tabs pattern) with each code sample individually copy-buttoned. All code samples are tested/valid — the strict rule below elevates this from a nice-to-have to a requirement given the audience. Page ships minimal JS outside syntax highlighting (server-rendered) and the tab-switcher; no unnecessary animation library.

## STRICT RULES
Every code sample must be complete and correct enough to actually run, not illustrative pseudocode dressed as real code. Never state a performance/latency number without its measurement methodology alongside it. No generic "blazing fast," "enterprise-grade," or "seamless" adjectives without a concrete number or mechanism backing each claim.
```

---

TEMPLATE 025 — Genomics Research Data Platform (Scientific/Lab Software)

```text
Act as a senior scientific-software designer and a frontend engineer experienced with large-dataset visualization. Build "{{BRAND_NAME}}", a platform for genomics researchers to store, analyze, and visualize sequencing data. Audience: PhD-level computational biologists and lab directors — extremely domain-literate, distrustful of oversimplified visuals that misrepresent biological data, and evaluating primarily on analytical rigor and reproducibility, not ease-of-use marketing.

## PRODUCT REASONING
This audience wants to see real analytical output (a genome browser track, a variant call table) rendered correctly, not an abstract "DNA helix" marketing graphic — helix/double-strand imagery is a strong negative signal of a non-technical, non-credible vendor to this specific buyer. Reproducibility (exact pipeline versioning, parameter tracking) is a real, specific evaluation criterion this category's buyers care about and competitors often gloss over.

## TECH STACK (justified)
Next.js 15; Tailwind CSS v4; a real genome-browser-style track visualization (canvas-rendered for performance across large coordinate ranges, similar rendering approach to genome browsers researchers already use, e.g. IGV) — not a generic bar chart standing in for genomic data.

## DESIGN SYSTEM
Colors: --bg:#FFFFFF · --surface:#F5F7F8 · --border:#DCE3E6 · --fg:#12181B · --muted:#5C6870 · --accent:{{ACCENT_HEX}} (fallback #1B7A8C). Variant-classification color scale (pathogenic/likely pathogenic/VUS/likely benign/benign) using an established, unambiguous 5-step scale, since misrepresenting this specific color mapping would be a genuine scientific-communication error, not just a style choice.
Typography: "IBM Plex Sans" for prose, "IBM Plex Mono" with tabular-nums for genomic coordinates, read depths, and p-values.

## SECTIONS
### 1. Hero — Real Genome Browser Track: an actual (or realistically representative, clearly labeled if synthetic) track view showing read pileups across a gene region with a variant call highlighted — pan/zoom interaction functional, matching the real tool researchers would use daily.
### 2. Pipeline Reproducibility — a visible, versioned pipeline record (tool versions, reference genome build, exact parameters used) attached to any shown analysis — the specific mechanism addressing this field's well-known reproducibility crisis, made concrete rather than asserted.
### 3. Variant Interpretation Workflow — a real interpretation UI: variant table with classification, ACMG criteria checklist applied, and literature/database cross-references (ClinVar-style) — demonstrating actual clinical/research workflow depth.
### 4. Collaboration & Data Sharing — controlled-access sharing between labs/collaborators shown with explicit permission scoping, since genomic data sharing has real regulatory/consent constraints (IRB, data-use agreements) this audience takes seriously.
### 5. Compute & Storage Scale — concrete numbers on dataset scale handled (e.g. "{{DATASET_SCALE}}, whole-genome sequencing at population scale") and compute backend transparency (cloud region, HIPAA/GxP compliance if applicable to {{USE_CASE}}).
### 6. Publications / Validation — citations of real published papers using the platform if {{PUBLICATION_1..N}} supplied; omitted, not fabricated, if none exist yet.

## STATES, ACCESSIBILITY, PERFORMANCE
Genome browser track virtualizes rendering to only the visible coordinate range plus a buffer, essential given genomic datasets can span billions of base pairs. Variant classification color is always paired with the text classification label, given the clinical stakes of misreading a color. Any synthetic/example dataset is explicitly labeled as such, never presented ambiguously as real patient data.

## STRICT RULES
Never use generic DNA-helix stock imagery in place of real analytical UI — this specific audience reads that as a marketing-over-substance signal. Never fabricate publication citations or dataset-scale numbers.
```

---

TEMPLATE 026 — Academic Preprint / Open Research Publication Platform

```text
Act as a senior academic-publishing UX designer and a frontend engineer focused on citation-grade content integrity. Build "{{BRAND_NAME}}", a platform where researchers publish and discover preprints across a scientific field. Audience: researchers browsing for relevant work and submitting their own — trust depends on visible rigor signals (versioning, moderation policy, citation permanence) since this platform is competing with the reputational weight of traditional peer-reviewed journals.

## PRODUCT REASONING
A preprint's version history is not a nice-to-have UI detail — it's the core scientific-integrity feature, since claims and data can be revised between v1 and v3 and prior citations must remain resolvable to the exact version cited. The browse/discovery experience should support serious literature review (filtering by field, date, methodology type), not a social-media-style feed.

## TECH STACK (justified)
Next.js 15 with MDX/LaTeX rendering support (KaTeX) for mathematical notation, essential for most scientific fields; Tailwind CSS v4; server-rendered pages for citation-crawler compatibility (Google Scholar and similar must be able to index this content reliably).

## DESIGN SYSTEM
Colors: --bg:#FFFFFF · --surface:#F6F6F4 · --border:#E1DFD8 · --fg:#1A1917 · --muted:#7A7669 · --accent:{{ACCENT_HEX}} (fallback #A23B2E). Restrained, print-journal-adjacent, avoiding both a flashy startup look and a dated academic-database look.
Typography: "Source Serif 4" for paper titles/abstracts (matching how papers are actually typeset); "Inter" for site chrome; math rendered via KaTeX at native size, never as low-res images.

## SECTIONS
### 1. Search-First Homepage — a prominent field-scoped search (not a generic feed) with filters for subject area, date range, and preprint status (preprint / peer-reviewed elsewhere / withdrawn) — since serious literature search, not browsing, is the actual primary use case.
### 2. Paper Page — title, authors with affiliations and ORCID links, abstract, a clearly labeled version history (v1, v2, v3 each individually citable and permanently resolvable via a persistent identifier/DOI-equivalent), full-text with correctly rendered math and figures, and a "cite this version" button generating BibTeX/APA formats.
### 3. Author Profile — publication list, ORCID-verified identity, and a real citation count if {{CITATION_DATA}} is available from a legitimate source.
### 4. Moderation & Screening Policy — an explicit, plain-language statement of what is and isn't checked before a preprint is posted (this platform is not peer review, and conflating the two is a real, damaging category error many preprint servers have been criticized for) — stated honestly rather than implying peer-review-equivalent rigor.
### 5. Submit a Preprint — author-facing submission flow: format requirements, conflict-of-interest disclosure requirement, and license selection (CC-BY etc.) shown explicitly.
### 6. Field-Specific Collections — curated collections by subfield ({{FIELD_1..6}}) for researchers doing a broad literature scan of an area.

## STATES, ACCESSIBILITY, PERFORMANCE
Every version of a paper remains permanently accessible at a stable URL even after a newer version is posted — this is a hard scientific-integrity requirement, not a nice-to-have. Math rendering (KaTeX) has an accessible text/MathML fallback for screen readers. Search results load with proper pagination (not infinite scroll) since researchers need to reliably return to a specific position in a result set for citation purposes.

## STRICT RULES
Never imply peer-review-equivalent vetting for content that is unreviewed preprint material — the moderation-policy section must be honest about this distinction. Never break a permanent link to a previously-cited paper version.
```

---

TEMPLATE 027 — Industrial IoT Manufacturing Monitoring Dashboard

```text
Act as a senior industrial-software designer and a frontend engineer experienced with real-time sensor data at scale. Build "{{BRAND_NAME}}", a platform monitoring equipment health and production-line performance across factory floors via IoT sensors. Audience: plant managers and reliability engineers — a non-desk-bound audience often glancing at this on a floor-mounted display or tablet between physical tasks, evaluating on whether it reduces unplanned downtime, the single most expensive failure mode in this category.

## PRODUCT REASONING
The real differentiator to prove is predictive maintenance (catching a failure before it happens) versus reactive monitoring (an alert after something already broke) — the demo must show a predicted-failure alert with lead time, not just a real-time gauge dashboard, which every competitor already has.

## TECH STACK (justified)
Next.js 15; Tailwind CSS v4; D3 or a lightweight charting library for real-time sensor trend lines (vibration, temperature) with anomaly-detection bands overlaid; large, high-contrast UI elements suited to being viewed on a floor-mounted display from a few feet away, not just a desk monitor.

## DESIGN SYSTEM
Colors: --bg:#0D1013 · --surface:#171B1F · --border:#282E34 · --fg:#E7EAEC · --muted:#828C96 · Machine-status scale: --running:#2FA766 · --warning:#E8A33D · --stopped:#8A8F96 · --fault:#E5484D · --accent:{{ACCENT_HEX}} (fallback #4FA6FF). High-contrast dark theme chosen deliberately for floor-visibility and long-duration always-on displays.
Typography: "Inter Tight" / "Inter" at a larger-than-typical base size (given viewing distance on floor displays), tabular-nums for all sensor readings.

## SECTIONS
### 1. Hero — Predictive Alert Demo: a real-feeling equipment card showing a bearing-vibration trend line drifting outside its normal band over several days, culminating in a "Predicted bearing failure within 5-7 days — schedule maintenance" alert — this specific lead-time framing is the actual product argument, shown mechanically (the trend, the threshold, the prediction) rather than just claimed.
### 2. Factory Floor Overview — a floor-plan-style layout (SVG) with equipment nodes color-coded by status, matching how plant managers actually think about their space (spatial layout, not an abstract list).
### 3. Downtime Cost Calculator — an interactive tool: plant manager inputs their line's hourly downtime cost and current unplanned-downtime hours/month, sees a live-recalculated estimated annual cost — translating the abstract "reduce downtime" pitch into their own specific number.
### 4. Maintenance Scheduling Integration — showing a predicted-failure alert flowing directly into a work-order in {{CMMS_INTEGRATION}} (a named maintenance-management system), since this handoff to action (not just alerting) is what actually prevents the downtime.
### 5. Sensor & Protocol Compatibility — real supported sensor types and industrial protocols ({{PROTOCOL_1..4}}: Modbus, OPC-UA, MQTT) since integration with existing, often decades-old, factory equipment is a genuine technical evaluation criterion.
### 6. ROI / Case Study — a real customer downtime-reduction case study if {{CASE_STUDY_DATA}} exists, with specific numbers and the equipment type involved; omitted rather than replaced with a generic testimonial if unavailable.

## STATES, ACCESSIBILITY, PERFORMANCE
Machine status is always shown with both color and a distinct icon shape (critical given some floor viewers may have color-vision differences and are making real operational decisions from this display). Real-time sensor charts throttle their redraw rate appropriately (e.g. 1-2 updates/sec, not 60fps) since floor displays often run continuously for months and unnecessary render churn causes real hardware strain over that lifetime. Large touch targets throughout for tablet-based floor use with potentially gloved hands.

## STRICT RULES
Never show a predictive-maintenance claim without demonstrating the actual mechanism (trend + threshold + lead-time prediction) — a bare "AI predicts failures" claim is not credible to this engineering-literate audience. Never fabricate ROI/case-study numbers.
```

---

TEMPLATE 028 — Handmade Goods Marketplace (Etsy-Adjacent)

```text
Act as a senior marketplace-product designer and a frontend engineer balancing discovery-browsing UX with seller trust signals. Build "{{BRAND_NAME}}", a marketplace where independent makers sell handmade and vintage goods. Audience: buyers browsing for something with a story (not commodity shopping) and sellers evaluating whether the platform will treat their small business fairly — both audiences need real attention, unlike a pure buyer-focused DTC template.

## PRODUCT REASONING
Browsing here is closer to discovery/inspiration shopping than task-driven search — visual, exploratory navigation matters more than dense filtering. Seller story and provenance ("who made this, where") is a real purchase driver in this category, unlike mass-market e-commerce, and deserves visible product-page real estate, not a buried "about the seller" link.

## TECH STACK (justified)
Next.js 15; Tailwind CSS v4; masonry-style grid layout for browsing (variable image aspect ratios are common and desirable in handmade-goods photography, unlike a rigid uniform product grid); Framer Motion for hover-preview interactions.

## DESIGN SYSTEM
Colors: --bg:#FFFCF7 · --surface:#FFFFFF · --border:#EDE6D8 · --fg:#241F17 · --muted:#8A8272 · --accent:{{ACCENT_HEX}} (fallback #C1622E, warm and crafted-feeling, avoiding both cold e-commerce grey and oversaturated retail red).
Typography: "Fraunces" for category/editorial headers (a warm, characterful serif matching the handmade positioning); "Inter" for product data/prices; prices always shown plainly, no strikethrough-fake-discount patterns common in mass e-commerce, since that tactic reads as inauthentic in this category.

## SECTIONS
### 1. Discovery Homepage — a masonry grid mixing editorial curation ("Handpicked: {{CURATED_COLLECTION}}") with browsable categories, not a search-bar-first layout — browsing-as-discovery is the primary intended behavior.
### 2. Product Page — large real photography (multiple angles, {{PRODUCT_IMAGE_1..6}}), a prominent maker/seller card (name, location, shop story, years active) placed near the top of the page (not buried below the fold), materials/process description written in the maker's own voice where possible, and honest handmade-specific states: "Made to order — ships in {{LEAD_TIME}}" clearly distinguished from "Ready to ship."
### 3. Seller Shop Page — a mini-storefront for each seller (their full catalog, shop policies, and reviews specific to that seller) since buyer trust in this category attaches to the individual maker, not just the platform brand.
### 4. Search & Filters (secondary to browsing) — category, price range, "made to order vs. ready to ship," and material filters, available but not the forced default entry point.
### 5. Trust & Buyer Protection — return/dispute policy stated plainly, since a marketplace of many independent small sellers needs a clear, consistent buyer-protection story distinct from any single seller's own policy.
### 6. Sell on {{BRAND_NAME}} (seller onboarding, distinct flow) — fee structure stated transparently upfront (a real, specific seller concern — vague or hidden fee structures are a leading cause of marketplace seller distrust), and a realistic onboarding checklist (shop setup, first listing, payout setup).

## STATES, ACCESSIBILITY, PERFORMANCE
"Made to order" vs. "Ready to ship" vs. "Sold out" (with an optional "notify me when available" for popular handmade items, since restocking on a maker's own schedule is a real, distinct inventory pattern from mass retail) are always shown as explicit text labels near the price, not just implied by a greyed-out button. Masonry grid images use responsive `srcset` and lazy-load below the fold, with layout-stable placeholder boxes matching each image's real aspect ratio (no cumulative layout shift as images pop in at variable heights).

## STRICT RULES
Never use fake strikethrough-discount pricing patterns — inauthentic to this category and its buyer's expectations. Never present a "made to order" item with instant-ship messaging or timelines that misrepresent real production lead time.
```

---

TEMPLATE 029 — B2B Wholesale Marketplace (Buyer-Seller, Bulk Ordering)

```text
Act as a senior B2B marketplace designer and a frontend engineer experienced with bulk-order and account-based commerce UX. Build "{{BRAND_NAME}}", a wholesale marketplace connecting retail buyers with manufacturers/distributors for bulk purchasing. Audience: professional buyers (retail store owners, procurement staff) making repeat, high-volume purchase decisions — this is closer to enterprise procurement UX than to consumer or even handmade-marketplace shopping, and price transparency, MOQs (minimum order quantities), and net-payment-terms are core, not edge-case, information.

## PRODUCT REASONING
Unlike consumer marketplaces, pricing here is often tiered by quantity and sometimes gated behind an approved-buyer account (some suppliers require verification before showing wholesale pricing at all) — the browsing/product experience must accommodate this gating honestly rather than pretending it's open, consumer-style shopping.

## TECH STACK (justified)
Next.js 15; Tailwind CSS v4; a real quantity-tiered pricing table component (price per unit changes as order quantity increases) as the core interactive product-page element; a dense, sortable/filterable catalog table view as an alternative to grid browsing, since professional bulk buyers often prefer scanning a spec/price table over visual browsing.

## DESIGN SYSTEM
Colors: --bg:#FFFFFF · --surface:#F6F7F8 · --border:#E0E3E7 · --fg:#161A20 · --muted:#5E6673 · --accent:{{ACCENT_HEX}} (fallback #1D5FBF). Professional, credible, unremarkable-on-purpose — this category's buyers are optimizing for efficiency and reliability, not visual delight.
Typography: "Inter Tight" / "Inter", tabular-nums for all pricing/quantity fields.

## SECTIONS
### 1. Account-Gated Pricing Model, Stated Upfront — a clear notice on the homepage/catalog: "Wholesale pricing shown after buyer verification" (if {{ACCOUNT_GATING}} applies) rather than showing consumer-style prices that don't reflect the real bulk-purchase experience.
### 2. Product Page — Tiered Pricing Table: an actual interactive table (1-9 units: $X, 10-49: $Y, 50+: $Z) with a quantity input that highlights the applicable tier live and recalculates total cost — the core interaction this category's buyer actually needs, not a single static price.
### 3. Catalog Table View (toggle from grid) — sortable columns (price, MOQ, lead time, category) for buyers doing systematic sourcing comparisons across many SKUs at once.
### 4. Supplier Verification & Ratings — supplier profile showing verification status, years on platform, and real order-fulfillment metrics (on-time shipment rate) if {{SUPPLIER_METRICS}} available — since trust in an unfamiliar supplier is the primary risk this buyer is managing.
### 5. Bulk RFQ (Request for Quote) — for orders exceeding standard tiers or custom specifications, a structured RFQ form rather than forcing everything through instant checkout, since large B2B orders are often genuinely negotiated.
### 6. Payment Terms — net-30/net-60 terms display where applicable (a real, specific B2B commerce feature, distinct from consumer instant-payment expectations), shown per-supplier where terms vary.
### 7. Become a Supplier — separate onboarding flow with catalog upload/bulk-listing tools (CSV import), since suppliers in this category typically list hundreds of SKUs, not a handful.

## STATES, ACCESSIBILITY, PERFORMANCE
Quantity/pricing tier table always shows which tier is currently active with a visible highlight, and the total recalculates without a page reload as quantity changes. MOQ-not-met state on checkout attempt shows a specific, actionable message ("Minimum order is 25 units — add {{N}} more to proceed") rather than a generic blocked-checkout error. Catalog table view is virtualized for realistic supplier catalogs running into thousands of SKUs.

## STRICT RULES
Never show consumer-style single-unit pricing as the primary price if the real transaction model is bulk/tiered — this misrepresents the actual buying experience. Never fabricate supplier fulfillment metrics.
```

---

TEMPLATE 030 — Local Home Services Marketplace (On-Demand Booking)

```text
Act as a senior local-services marketplace designer and a frontend engineer focused on location-aware, trust-critical booking flows. Build "{{BRAND_NAME}}", a marketplace connecting homeowners with vetted local service providers (e.g. plumbing, electrical, cleaning). Audience: homeowners who are often dealing with an inconvenient or urgent problem (a leak, a broken appliance) — speed-to-booking and provider trust signals (background checks, real reviews, insurance) are the dominant UX concerns, more than browsing or discovery.

## PRODUCT REASONING
This is a task-completion product under mild-to-moderate stress (something in the home is broken), not a browsing/inspiration product like the handmade marketplace — the entry flow should ask "what do you need done" and "where" within the first interaction, not lead with brand storytelling.

## TECH STACK (justified)
Next.js 15; Tailwind CSS v4; Mapbox or a lightweight geocoding-based service-area check (confirming coverage in the user's zip/postal code) as an early, functional step, not decorative; a real-feeling instant-quote or provider-matching flow.

## DESIGN SYSTEM
Colors: --bg:#FFFFFF · --surface:#F5F8F7 · --border:#DDE7E2 · --fg:#152420 · --muted:#5D6B65 · --accent:{{ACCENT_HEX}} (fallback #1B8A5A) — trustworthy, calm, avoiding both a sterile corporate look and an overly casual gig-economy look, since this category involves people into their homes.
Typography: "Inter", minimum 16px, high contrast — this audience may be older or dealing with a stressful situation, similar reasoning to the telemedicine template.

## SECTIONS
### 1. Hero — Service + Location Entry (the actual functional first step, not a marketing headline) — a two-field entry: "What do you need done?" (category selector) and "Where?" (zip/postal code with geolocation-detect option), immediately showing "{{N}} providers available in your area" once both are filled — proving coverage and availability before any further browsing.
### 2. Provider Matching / Instant Quote — depending on {{SERVICE_MODEL}}: either a real instant-quote estimate (for standardized services like cleaning) with a clear price range and what's included, or a "get matched with 3 vetted providers" flow (for more variable services like plumbing) showing example provider cards with real trust signals (background-check badge, years active, real review count and rating) rather than generic star ratings alone.
### 3. Vetting & Trust (substantive, not a badge wall) — an explicit explanation of what "vetted" actually means for this platform (background check type, license/insurance verification process) since this claim is load-bearing for a category involving strangers entering someone's home, and a vague badge without explanation is not sufficiently reassuring.
### 4. Real Reviews — genuine review excerpts if {{REVIEW_DATA}} supplied, shown with the specific service performed and date, never generic five-star-only aggregate numbers without underlying text.
### 5. Booking Flow — date/time selection, real-time provider availability (not a form submitted into a black hole), and a clear cancellation policy stated before final confirmation, not discovered after the fact.
### 6. Become a Provider (separate, distinct-toned section/flow) — earnings potential framed honestly (a realistic range, not an inflated headline number), the vetting process from the provider's side, and payout terms.

## STATES, ACCESSIBILITY, PERFORMANCE
"No providers available in your area yet" is a real, honestly-designed state (with a "notify me when available" capture) rather than silently showing an empty or broken results page. Booking confirmation clearly states what happens next (provider contact timeline, how to reach support) since post-booking anxiety ("did this actually work?") is a real UX consideration for a service being trusted into someone's home. Location entry supports both manual zip/postal entry and geolocation, since not all users will grant location permission, and the manual path must work equally well.

## STRICT RULES
Never claim "vetted" or "background-checked" without stating what that process actually involves. Never fabricate review content or provider availability data. Never bury the cancellation policy until after a booking is confirmed.
```

---

TEMPLATE 031 — Technical Conference / Industry Event Platform

```text
Act as a senior event-brand designer and a frontend engineer experienced with schedule-heavy, time-zone-sensitive content. Build the site for "{{EVENT_NAME}}", an annual technical conference for {{INDUSTRY_FOCUS}} (e.g. distributed-systems engineers). Audience: prospective attendees deciding whether the content justifies travel cost/time, and returning attendees needing fast access to schedule/logistics — two very different jobs-to-be-done from the same site at different points in the event lifecycle (pre-CFP, post-lineup-announced, during-event).

## PRODUCT REASONING
Speaker/session quality is the actual purchase driver for a technical conference (unlike a consumer event) — the schedule and speaker lineup deserve the most prominent, information-dense treatment on the site, not a generic "network and learn" marketing hero. During the event itself, the site's job shifts entirely to fast, live-updating logistics (which room, is this session running late) — this must be designed as a real state, not an afterthought.

## TECH STACK (justified)
Next.js 15 App Router (server-rendered schedule data, since this content changes on a real publishing cadence and benefits from fast, cacheable pages); Tailwind CSS v4; a real timezone-aware schedule component (critical for any conference with virtual/hybrid attendance across regions) using the visitor's local timezone by default with an explicit override.

## DESIGN SYSTEM
Colors: --bg:#0E0F13 · --surface:#181A20 · --border:#282B33 · --fg:#EDEEF2 · --muted:#888E9C · --accent:{{ACCENT_HEX}} (fallback #5B8CFF) — a confident, technical-conference-appropriate dark theme, distinct per {{EVENT_NAME}}'s own brand rather than a generic template default.
Typography: "Inter Tight" / "Inter", tabular-nums for all times/dates; track-color-coding (a fixed hue per conference track, e.g. Infrastructure/Product/Security) used consistently across schedule, speaker tags, and session pages.

## SECTIONS
### 1. Hero — Dates, Location, Key Numbers — event name, exact dates and location (or "Virtual"/"Hybrid" explicitly), and a small strip of real numbers if available ({{PROOF_STAT_1..3}}: past-year attendee count, speaker count) — never fabricated for a first-year event; if this is a first edition, this strip is replaced by the organizing team's credibility (past events they've run, company backing) instead.
### 2. Schedule (the actual core page) — a real, filterable, timezone-aware grid: filter by track/day, each session card showing title, speaker, room, and time in the visitor's local timezone with the option to view "Conference local time" instead — this timezone handling is a genuine, frequently-botched detail worth getting right deliberately.
### 3. Speakers — grid of real confirmed speakers ({{SPEAKER_1..N}}: name, title, company, session title) — during the CFP-open phase before speakers are confirmed, this section is replaced with "Call for Proposals" content instead, never populated with placeholder "TBD" speaker cards that look like real, empty ones.
### 4. Venue & Travel — practical logistics (address, nearest airport, recommended hotels with any conference rate, visa-letter request process if relevant to an international audience).
### 5. Tickets — tiered pricing from {{PRICING_TIERS}} (early-bird/regular/late, and student/group discounts if applicable) with the price-increase date shown explicitly and countdown to it (a legitimate urgency mechanic here, unlike the finance/wealth template, since ticket pricing deadlines are real and disclosed, not manufactured scarcity theater).
### 6. Past Talks / Content Archive (for a recurring conference) — links to past years' recorded sessions if {{ARCHIVE_LINKS}} exist, since a rich public archive is itself a credibility signal for a technical audience evaluating whether to attend.
### 7. Day-Of Mode (state, not a separate page) — once the event is live, the schedule section becomes the entire homepage focus, with a "Happening now" highlight and any real-time room-change/delay notices surfaced prominently — a distinct, intentional UI mode for the live-event window.

## STATES, ACCESSIBILITY, PERFORMANCE
Schedule handles session cancellations/room changes with a visible "Updated" flag and timestamp, never silently changing published information. Timezone selector is a real, working control, not decorative — defaulting to the visitor's detected timezone via the Intl API with manual override always available. Schedule grid remains usable on mobile as a filterable list (not a forced horizontal-scroll grid) since attendees will check it constantly on their phones during the event itself, often on venue wifi.

## STRICT RULES
Never show placeholder "TBD" speaker cards styled identically to confirmed ones — distinguish clearly or omit. Never fabricate past-attendance numbers for a first-year event. Timezone handling must be genuinely correct, not just present — this is a frequent, credibility-damaging bug category for event sites specifically.
```

---

TEMPLATE 032 — Nonprofit Climate Advocacy Organization

```text
Act as a senior nonprofit/advocacy designer and a frontend engineer focused on donation-conversion and accessible civic content. Build the site for "{{ORG_NAME}}", a nonprofit advocating for climate policy change through campaigns and grassroots organizing. Audience: three groups needing distinct treatment — potential donors (need to trust their money creates real impact), volunteers/activists (need a clear, low-friction way to take action right now), and journalists/policymakers (need credible, sourced research). Conflating these into one generic "get involved" CTA underserves all three.

## PRODUCT REASONING
Impact transparency (where does donated money actually go) is the dominant trust factor for climate/advocacy nonprofits specifically, given well-publicized skepticism about overhead ratios in this sector — real, specific financial transparency deserves prominent, substantive treatment, not a buried annual-report PDF link.

## TECH STACK (justified)
Astro 4 (content-heavy, campaign pages updated frequently by non-engineering staff) with a React island for the donation flow; Tailwind CSS v4; minimal animation — urgency here should come from real, current campaign content, not decorative motion.

## DESIGN SYSTEM
Colors: --bg:#FFFFFF · --surface:#F3F6F2 · --border:#DCE6D8 · --fg:#182015 · --muted:#5B6656 · --accent:{{ACCENT_HEX}} (fallback #2E7D4F) — an intentional, non-generic green (avoiding the cliché "nonprofit green gradient" look) paired with a strong secondary action color for donation CTAs specifically so they're never visually confused with informational links.
Typography: "Inter Tight" for campaign headlines (bold, legible at a glance for social-shared content); "Source Serif 4" for longer research/policy writing, matching that content's more analytical register.

## SECTIONS
### 1. Current Campaign Hero — the org's actual current, specific campaign (not a generic mission statement) — e.g. "{{CAMPAIGN_NAME}}: tell your senator to support {{BILL_NAME}}" with a direct, one-click action (pre-filled message to a representative via {{ADVOCACY_TOOL_INTEGRATION}}) as the primary CTA — specificity and immediate action, not abstract mission messaging, drives this category's actual engagement.
### 2. Take Action (distinct path from donation) — volunteer sign-up, petition-signing, or the representative-contact tool from the hero, repeated here with more context — this path must never be visually subordinate to the donation CTA; both are legitimate, equally important conversions for an advocacy org.
### 3. Impact & Transparency — real, specific outcomes ({{IMPACT_1..4}}: e.g. "helped pass {{POLICY}} in {{STATE}}, affecting {{N}} residents") with sourced links to the actual policy outcome, plus a genuine financial breakdown (% to programs vs. overhead, linked to the actual audited annual report) — this section deserves real design investment, not a token line, given the sector's trust challenges.
### 4. Research & Policy Briefs — for the journalist/policymaker audience: downloadable, properly cited policy research ({{RESEARCH_1..N}}), presented with academic-adjacent credibility (author credentials, publication date, methodology summary) distinct in tone from the campaign-urgency sections.
### 5. Donate — a clear, honest ask with real allocation transparency shown at the point of donation itself ("$50 funds {{SPECIFIC_OUTCOME}}"), never a vague "help our mission" ask disconnected from a concrete result.
### 6. Volunteer / Local Chapters — if {{LOCAL_CHAPTERS}} exist, a location-based finder connecting visitors to real local organizing groups, since grassroots advocacy orgs often operate through genuinely local structures that deserve visibility, not just a national donation funnel.

## STATES, ACCESSIBILITY, PERFORMANCE
Advocacy action tool (contacting a representative) shows real confirmation of what was sent and to whom, with an option to add a personal note — never a black-box "message sent" with no visibility. Impact numbers are dated and sourced, never presented as evergreen/timeless claims that don't specify when they were achieved. Full keyboard and screen-reader accessibility is a stated organizational value for a civic-engagement platform specifically, not just a technical checkbox — semantic landmarks, proper heading hierarchy, and high contrast throughout.

## STRICT RULES
Never fabricate impact numbers or policy outcomes. Never subordinate the volunteer/action path visually beneath the donation path — both matter to this organization's actual mission. Never use manipulative urgency/guilt-based donation copy.
```

---

TEMPLATE 033 — Consumer Insurance Platform (Auto/Home/Renters)

```text
Act as a senior insurtech product designer and a frontend engineer experienced with quote-flow conversion and regulatory disclosure. Build "{{BRAND_NAME}}", a direct-to-consumer insurance platform for {{INSURANCE_TYPE}} (e.g. renters insurance). Audience: consumers who find insurance shopping confusing and mildly distrust the industry — the product's whole value proposition rests on making a quote genuinely fast and the coverage genuinely understandable, so the quote flow itself is the product, not a lead-gen form in front of a phone call.

## PRODUCT REASONING
The single biggest UX failure mode in this category is a "get a quote" flow that turns into a 20-field form before showing any price — the flow must show a real price as early as possible (even a range, refined as more information is added) to maintain the "fast and simple" promise the whole brand rests on.

## TECH STACK (justified)
Next.js 15; Tailwind CSS v4; a real progressive-disclosure quote form (React state-driven, showing a live-updating price estimate as fields are filled, not only at the end); no unnecessary animation — trust and clarity matter more than delight in a regulated-adjacent purchase decision.

## DESIGN SYSTEM
Colors: --bg:#FFFFFF · --surface:#F6F8FA · --border:#E1E6EC · --fg:#141A22 · --muted:#5E6B7A · --accent:{{ACCENT_HEX}} (fallback #2563EB) — clean, modern, deliberately distinct from legacy insurance-industry visual clichés (no stock photos of families/houses, no fake-friendly mascots) to signal a genuinely different, faster experience.
Typography: "Inter", tabular-nums for all price figures, minimum 16px given the audience skews broad, similar reasoning to healthcare/HR templates.

## SECTIONS
### 1. Hero — Progressive Quote Flow (starts immediately, not after a marketing scroll) — first field (zip/postal code + property type) immediately shows a real, live estimated price range; each subsequent field (coverage amount, deductible) refines the number visibly in place — proving the "fast quote" claim through direct experience rather than a headline claim.
### 2. Coverage Explained Plainly — a real, specific breakdown of what is and isn't covered ({{COVERAGE_ITEM_1..6}}) in plain language with concrete examples ("Covers your laptop if stolen from your car; does not cover flood damage — see flood coverage add-on") — genuinely educational, addressing the actual confusion this audience has about insurance products, not marketing copy dressed as education.
### 3. Price Comparison / Savings Framing — if legally supportable, a comparison against average market rates for the category/region ({{BENCHMARK_DATA}}), sourced and dated; omitted rather than a vague "save up to 40%" claim if not substantiated.
### 4. Claims Process (shown before purchase, not hidden until needed) — a real explanation of how filing a claim actually works (steps, typical timeline) since ease-of-claims is a major, if less immediately visible, purchase factor this audience has learned to ask about after bad experiences elsewhere.
### 5. Regulatory Identity & Underwriting — the actual underwriting carrier (a DTC insurance platform is very often a technology layer over a licensed underwriter, and this relationship must be disclosed clearly, similar in spirit to the neobank template's partner-bank disclosure) plus state-specific licensing information.
### 6. Checkout — a genuinely fast final step (payment, policy start date, digital delivery of documents) with a clear post-purchase "what happens next" summary.

## STATES, ACCESSIBILITY, PERFORMANCE
Live price estimate is always labeled as an estimate until final underwriting factors are confirmed, avoiding a bait-and-switch perception if the final bindable price differs. Form validation is inline and specific (e.g. "This zip code isn't in our current coverage area yet" rather than a generic error) since coverage-area gaps are a real, common state in early-stage insurtech expansion. Every price/number is in tabular-nums and updates without a jarring layout shift as the estimate refines.

## STRICT RULES
Never hide the price behind a full form submission — progressive, visible pricing is the category's actual credibility mechanism. Never state a savings/comparison claim without a dated, sourced benchmark. The underwriting-carrier disclosure must never be omitted or minimized regardless of art-direction preference.
```

---

TEMPLATE 034 — Retail Trading & Investment Platform

```text
Act as a senior fintech designer specializing in trading interfaces and a frontend engineer experienced with real-time financial data rendering. Build "{{BRAND_NAME}}", a retail trading platform for stocks/ETFs/options. Audience: retail investors ranging from beginners to active traders — this category has faced real regulatory scrutiny over gamification of trading (encouraging excessive risk-taking through app design), so the design must be evaluated against that standard explicitly, distinct from the "make it engaging" instinct that drives most consumer app design.

## PRODUCT REASONING
Unlike the private-wealth template (institutional, discretion-focused) or the neobank template (fee-transparency-focused), this category's central design tension is between engagement and responsible-design — every interaction pattern must be checked against "does this encourage impulsive trading" before being adopted, and confetti/streak/badge gamification mechanics common in other consumer fintech are specifically inappropriate here.

## TECH STACK (justified)
Next.js 15; Tailwind CSS v4; a real-time (or realistically simulated, clearly labeled) price chart using a lightweight financial charting library (candlestick/line toggle) — genuinely functional, not decorative; WebSocket-based live price updates for the actual product (the marketing page can use a simulated, labeled feed).

## DESIGN SYSTEM
Colors: --bg:#0B0D10 · --surface:#141820 · --border:#242A34 · --fg:#E5E9EF · --muted:#7C8494 · --gain:#1FAE6C · --loss:#E5484D · --accent:{{ACCENT_HEX}} (fallback #3E7BFA). Deliberately restrained use of the gain/loss colors — reserved strictly for actual price/PnL data, never used decoratively elsewhere on the page, since color-coded excitement around gains is precisely the gamification pattern regulators have scrutinized.
Typography: "Inter Tight" / "Inter", tabular-nums mandatory for all prices/percentages/quantities, since misaligned numeric columns in a trading context are a genuine usability and trust issue, not just aesthetic.

## SECTIONS
### 1. Hero — Real Chart + Risk Disclosure Adjacent — a functional price chart for a real or representative symbol, with the standard risk disclosure ("Trading involves risk of loss") shown adjacent at legible size (never footer-only fine print) — matching the compliance-baseline pattern from the finance template category but adapted for active trading's specific risk profile.
### 2. Order Types Explained — plain-language explanation of market/limit/stop orders with a real interactive example (adjusting a limit price on a mock order ticket and seeing when it would execute against a sample price history) — genuinely educational, addressing real beginner confusion, not just a features list.
### 3. Fees, Stated Completely — a full, specific fee schedule (commission, if any; payment-for-order-flow disclosure if applicable and required by {{REGULATOR}}; margin interest rates) — this category has specific, real disclosure obligations around order execution and must not obscure them.
### 4. Account Types — cash vs. margin account differences explained with the real risk implications of margin trading stated plainly, not minimized, given margin's amplified-loss risk.
### 5. Research & Education (not gamified) — access to real research tools/educational content, framed as genuinely informative, distinct in tone from any "hot stocks" or trending-ticker social-proof pattern that would nudge impulsive behavior.
### 6. Security & Account Protection — SIPC-equivalent coverage disclosure, two-factor authentication requirement stated as a feature, and account-recovery process overview.
### 7. Account Opening CTA — a genuinely appropriate-paced onboarding (identity verification, suitability/risk-tolerance questions asked honestly, not skippable) rather than instant frictionless signup, since suitability assessment is often a real regulatory requirement in this category.

## STATES, ACCESSIBILITY, PERFORMANCE
No animated celebratory effects (confetti, badges, streak counters) anywhere in the product-surface demos — a deliberate, explicit exclusion given this category's known design-ethics concerns. Price/PnL color is always paired with a +/- sign and explicit numeric value, never color alone. Real-time chart updates are throttled to a reasonable rate and clearly timestamped if any latency/delay exists relative to live markets.

## STRICT RULES
Never use gamification mechanics (streaks, badges, celebratory animation) tied to trading activity or frequency. Never omit or minimize risk disclosures relative to marketing content promoting returns. Never fabricate a specific historical return figure without its full basis and disclaimer.
```

---

TEMPLATE 035 — SMB Accounting & Bookkeeping Software

```text
Act as a senior SMB-software designer and a frontend engineer who understands small-business owners are not accountants. Build "{{BRAND_NAME}}", accounting/bookkeeping software for small business owners (not enterprises, not accountants themselves). Audience: solo founders and small-business owners who are intimidated by accounting terminology and often behind on their books — the product's actual value is making a stressful, avoided task feel manageable, and the marketing site's tone should acknowledge that honestly rather than assuming financial confidence.

## PRODUCT REASONING
Unlike enterprise fintech/accounting tools (which assume financial literacy), this audience needs the product surface demo to show simplification in action — real bank-transaction categorization happening automatically, not a dense general-ledger view that would intimidate rather than reassure this specific buyer.

## TECH STACK (justified)
Next.js 15; Tailwind CSS v4; Framer Motion for the transaction-categorization demo (a satisfying, clear "this got automatically sorted" interaction is a genuine, appropriate use of delight for this audience, unlike the trading-platform template's restrictions — this category's stakes and psychology are different).

## DESIGN SYSTEM
Colors: --bg:#FFFFFF · --surface:#F7F9F7 · --border:#E2E8E3 · --fg:#182019 · --muted:#5F6A61 · --accent:{{ACCENT_HEX}} (fallback #2F9E63) — approachable, calm, deliberately friendly rather than clinical-financial, matching the "we'll make this easy" positioning.
Typography: "Inter", plain language throughout — headline and section copy should avoid accounting jargon (e.g. "See where your money is going" rather than "Real-time general ledger visibility").

## SECTIONS
### 1. Hero — Bank Feed + Auto-Categorization Demo — a real-feeling list of bank transactions streaming in and auto-sorting into categories (Office Supplies, Software, Travel) with a visible, satisfying "sorted" checkmark animation per row — showing the core time-saving mechanism directly, addressing this buyer's actual pain (hours spent manually categorizing) rather than an abstract "automate your books" headline.
### 2. Tax-Time Readiness — a specific, concrete demo: a "Schedule C" or relevant tax-form-adjacent summary auto-populating from categorized transactions, with a running "estimated tax owed so far this quarter" number — addressing the specific anxiety (surprise tax bills) this audience genuinely has, not just generic "tax-ready" messaging.
### 3. Invoicing — simple invoice creation/sending demo, with clear paid/unpaid/overdue states and automatic payment-reminder emails, since chasing unpaid invoices is a specific, common small-business pain point deserving its own concrete demonstration.
### 4. Reports Made Understandable — real report examples (profit & loss, cash flow) presented with a plain-language summary sentence above each chart ("You made $12,400 more than you spent this month") rather than assuming the owner can interpret a raw financial statement unaided.
### 5. Works With Your Bank — real supported bank/card integrations ({{INTEGRATION_1..8}}) since automatic bank-feed connection reliability is a genuine, frequently-cited pain point with competing tools in this category.
### 6. Get Help When Stuck — access to real bookkeeping support (chat with a real bookkeeper, if {{SUPPORT_MODEL}} includes this) since this audience's actual failure mode is abandoning the software when they hit something confusing, not just lacking features.
### 7. Pricing — simple, flat tiers from {{PRICING_TIERS}} (this audience is put off by usage-based/complex pricing that requires them to estimate their own future volume).

## STATES, ACCESSIBILITY, PERFORMANCE
Uncategorized transactions are shown as a clear, actionable "Needs review" queue (not hidden or silently mis-categorized), since trust in the automation depends on transparent handling of the cases it can't confidently resolve. Tax-estimate figures are clearly labeled as estimates, not filed-tax-equivalent numbers, avoiding a serious category of user harm if misread as final. Report charts include the plain-language summary sentence as real text (not only implied by the visual), supporting both comprehension and accessibility.

## STRICT RULES
Never use accounting jargon in primary marketing copy without a plain-language equivalent alongside it. Never present an estimated tax figure without clearly labeling it as an estimate. Never silently auto-categorize a transaction with low confidence — surface it for review instead.
```

---

TEMPLATE 036 — Open-Source Infrastructure Project Documentation Site

```text
Act as a senior developer-relations designer and a frontend engineer who has maintained real open-source docs sites. Build the documentation and homepage for "{{PROJECT_NAME}}", an open-source {{PROJECT_TYPE}} (e.g. a distributed message queue). Audience: engineers evaluating whether to adopt the project (need to assess maturity, community health, and get a working example fast) and existing users needing fast reference lookup — distinct from the API-gateway template's commercial-product framing, since trust signals here are community/maturity-based (contributor count, release cadence, issue-response time) rather than commercial guarantees.

## PRODUCT REASONING
An open-source adoption decision hinges on perceived project health as much as features — real, current data (last release date, open issue count, contributor count) pulled live from the actual repository is more persuasive than any written claim, and a stale-looking "last updated 2 years ago" signal (even if the copy claims active maintenance) will be caught immediately by this audience.

## TECH STACK (justified)
Astro 4 (a content-heavy docs site benefits from minimal JS and fast static generation) with MDX for docs pages; Tailwind CSS v4; live GitHub API data (stars, contributors, latest release) fetched server-side with ISR caching, not client-side (avoiding a loading flash on a metric this audience checks immediately).

## DESIGN SYSTEM
Colors: --bg:#FFFFFF · --surface:#F6F7F8 · --border:#E1E4E8 · --fg:#1B1F23 · --muted:#586069 · --accent:{{ACCENT_HEX}} (fallback #2188FF, GitHub-adjacent blue, a deliberate, comfortable convention for this audience). Optional dark mode as a genuine, persisted preference (this audience disproportionately prefers dark mode for docs reading).
Typography: "Inter" for prose, "JetBrains Mono" for code, real syntax highlighting matching the project's actual primary language's conventions.

## SECTIONS
### 1. Hero — One Real Working Example (not an abstract pitch) — a single, complete, correct code snippet showing the project's most basic real use case, with a "Copy" button and a one-line install command — a working example above the fold is worth more to this audience than any amount of positioning copy.
### 2. Live Project Health Strip — real, live-fetched numbers: GitHub stars, contributor count, latest release version and date, open issue count — rendered as plain tabular-nums text, not styled as marketing "social proof," since the raw honesty of these numbers (including an unglamorous issue count) is itself the credibility signal.
### 3. Why {{PROJECT_NAME}} (honest comparison, not superiority theater) — a real, fair comparison table against 1-2 named alternative projects ({{ALTERNATIVE_1..2}}), including areas where the alternative is genuinely better suited for certain use cases — an honest comparison builds more trust with this audience than an all-green self-favoring table.
### 4. Getting Started (docs, not marketing) — a real quickstart guide with actual runnable steps, versioned per release (a version selector, since docs correctness for the exact installed version matters enormously to this audience and is a common, credibility-damaging gap in poorly maintained docs sites).
### 5. Architecture — a real, technically accurate architecture diagram (SVG) of how the project works internally, since evaluating internals (not just the API surface) is part of a serious adoption decision for infrastructure software.
### 6. Community & Contributing — links to the real Discord/Slack/mailing list, contribution guide, and a note on typical issue-response time if genuinely known — since community responsiveness is a real, often decisive adoption factor.
### 7. Used By (only if real) — logos of real, publicly-confirmed adopters if {{ADOPTER_1..N}} exist and have given permission; omitted entirely otherwise, never implied.

## STATES, ACCESSIBILITY, PERFORMANCE
Live GitHub data has a visible "as of {{TIMESTAMP}}" or is refreshed frequently enough (ISR revalidate under an hour) that staleness isn't misleading. Docs version selector clearly indicates which version is currently being viewed at all times (a persistent, visible indicator, not just in the URL) to prevent the common, damaging mistake of following docs for the wrong version. Code blocks are syntax-highlighted server-side with copy buttons, matching the code-review-agent and API-gateway templates' reasoning.

## STRICT RULES
Never present an unfair or one-sided comparison table against named alternatives — this specific audience checks comparison claims and one-sidedness is actively counterproductive. Never let project-health metrics go stale without a visible timestamp. Never fabricate adopter logos or community size.
```

---

TEMPLATE 037 — Creator Membership / Paid Community Platform

```text
Act as a senior community-product designer and a frontend engineer focused on membership-conversion and creator-tools UX. Build "{{BRAND_NAME}}", a platform letting individual creators run a paid membership community (posts, discussions, events) for their audience. Audience: two sides — creators evaluating whether this platform helps them monetize and own their audience relationship (vs. renting attention on a social platform), and prospective members deciding whether a specific creator's community is worth paying for — the marketing site must primarily speak to creators (the actual buyer/decision-maker), while each individual creator's own community page (a distinct template) speaks to prospective members.

## PRODUCT REASONING
The creator's real fear is platform risk (an algorithm change or ban wiping out their audience access) — "you own your member list and can export it anytime" is a genuine, specific trust mechanism worth demonstrating concretely (an actual visible export function), not just asserting as a value.

## TECH STACK (justified)
Next.js 15; Tailwind CSS v4; Framer Motion for the community-feed interaction demo; Stripe-adjacent payment UI patterns shown clearly for the membership/subscription flow, since payment trust (a creator trusting the platform with their revenue) is a first-order concern.

## DESIGN SYSTEM
Colors: --bg:#FFFFFF · --surface:#F8F7FB · --border:#E7E4F0 · --fg:#181620 · --muted:#6B6579 · --accent:{{ACCENT_HEX}} (fallback #7C3AED) — creator-friendly, expressive but not chaotic, since the platform's own brand should feel confident without competing visually with the diversity of creator brands that will build on top of it.
Typography: "Inter Tight" / "Inter", with the platform's own chrome kept visually quiet since, on actual creator community pages, the creator's own branding (not the platform's) should dominate.

## SECTIONS
### 1. Hero (creator-facing) — Revenue + Ownership Framing — headline around actual income/ownership (`{{HERO_HEADLINE}}`, e.g. "Turn your audience into recurring revenue you control") with a real-feeling creator earnings dashboard mock (monthly recurring revenue, member count, churn rate) as the product surface — creators evaluate this product primarily as a business tool, and the demo should reflect that.
### 2. Data Portability, Demonstrated — a real "Export your member list" button interaction (shown functioning, downloading a sample CSV-style preview) — directly demonstrating the platform-risk mitigation argument rather than asserting it in copy.
### 3. Community Feed / Discussion Demo — a real-feeling members-only feed (posts, comments, reactions) with a visible "members only" gate on a preview post, showing exactly what a non-member sees vs. a member.
### 4. Monetization Tools — tiered membership pricing setup demo (creator sets $X/month, $Y/year tiers), one-time content/course sales if supported, and a clear statement of the platform's take-rate/fees (a real, specific number, since fee structure comparison is a first-order creator decision factor, similar to the wholesale-marketplace and handmade-marketplace templates' fee transparency).
### 5. Events & Live Sessions — scheduling and hosting live sessions/AMAs for members, since many creator communities center on live interaction, not just async posts.
### 6. Example Creator Community (case study, real) — a link to or embedded preview of a real, existing creator's community built on the platform ({{CASE_STUDY_CREATOR}}), showing genuine, specific results (member count, revenue growth) if the creator has agreed to share them.
### 7. Get Started CTA — creator signup flow emphasizing fast time-to-first-member (a real, specific onboarding checklist: set up your page, invite your first members, publish your first post).

## STATES, ACCESSIBILITY, PERFORMANCE
Member-only content gating is shown with a clear, honest preview (a blurred or truncated excerpt, never fully visible content that's supposed to be gated) so the demo doesn't misrepresent the actual paywall mechanic. Export function demo is a real, working interaction pattern (even if the actual file download is a representative sample in the marketing context), not a decorative button. Feed/discussion demo content moderates realistically (a flagged/hidden comment state shown) since community moderation tools are a real evaluation criterion for creators who've had bad experiences elsewhere.

## STRICT RULES
Never claim data portability without demonstrating the actual export mechanism. Never obscure or minimize the platform's take-rate/fee structure — creators specifically compare this across platforms and hidden fees are a leading cause of creator platform distrust. Never fabricate a case-study creator's results.
```

---

TEMPLATE 038 — Museum / Cultural Institution Site

```text
Act as a senior cultural-institution designer and a frontend engineer balancing rich media with broad public accessibility. Build the site for "{{MUSEUM_NAME}}", a museum with rotating exhibitions and a permanent collection. Audience: an unusually broad public audience (families, scholars, tourists, school groups) with very different needs from the same site — a family needs ticket/hours/accessibility info fast; a scholar needs deep collection search; a tourist needs "what's on today." This breadth, more than any other template in this set, demands a genuinely tiered information architecture rather than one generic homepage serving everyone equally.

## PRODUCT REASONING
Practical visit information (hours, tickets, current exhibitions, accessibility accommodations) must be reachable within one click from any page — museums are visited by people with immediate, practical needs far more often than the collection/scholarly content is browsed, even though the latter often gets more design attention in practice. This mismatch is the actual thing to correct for.

## TECH STACK (justified)
Astro 4 with a CMS for exhibition content (updated by museum staff, not engineers); Tailwind CSS v4; a real collection-search interface (if a public collection database is part of scope) with filterable metadata (artist, period, medium).

## DESIGN SYSTEM
Colors: --bg:#FFFFFF · --fg:#141312 · --muted:#726C61 · --accent:{{ACCENT_HEX}} (chosen to reflect the museum's actual visual identity/logo, not a generic template default — a natural-history museum and a contemporary-art museum should look nothing alike). Deliberately restrained UI chrome so featured artwork/exhibition imagery carries the visual weight, similar reasoning to the architecture-portfolio template.
Typography: a distinctive display face matching the institution's actual brand identity for exhibition titles; a highly legible, accessible body face (e.g. "Inter" or the institution's own) for all practical/visit information, prioritizing clarity over character in that specific content.

## SECTIONS
### 1. Practical Visit Bar (persistent, high-priority, not buried) — today's hours, current admission price, and a prominent "Buy tickets" CTA — accessible from every page via a persistent header element, not just the homepage, addressing the actual dominant use case directly.
### 2. Current Exhibitions (homepage hero equivalent) — the actual current/upcoming exhibitions with real dates and a strong visual treatment (large imagery, matching the exhibition's own curatorial identity) — this rotates on the museum's real schedule, never a generic evergreen "welcome" hero.
### 3. Plan Your Visit — hours, location/parking/transit, accessibility accommodations (wheelchair access, sensory-friendly hours if offered, ASL tour availability) stated specifically and substantively — accessibility-of-the-physical-space information deserves the same real content investment as the digital accessibility of the site itself.
### 4. Collection Search (if in scope) — a real, filterable database interface (by artist, period, medium, department) for the scholarly/enthusiast audience, distinct in density and tone from the general-public sections — this is the one place a denser, more data-forward UI is appropriate on an otherwise visitor-friendly site.
### 5. Membership & Support — membership tiers with real benefits stated specifically (free admission, member previews) and a donation path, since museums typically rely on a mixed public/member/donor revenue model worth representing accurately.
### 6. Learn / Education Programs — school-group and family program information, a distinct audience and use case from adult general admission.
### 7. Calendar of Events — talks, workshops, member events — a real, dated, filterable calendar rather than a static list, since museums typically run a genuinely high cadence of programming.

## STATES, ACCESSIBILITY, PERFORMANCE
Today's hours/admission information is the single most time-sensitive piece of content on the site and must never be allowed to go stale (a "closed today" holiday exception must be reflected, not just default weekly hours shown blindly). Physical accessibility information is specific and substantive (not a generic "we are ADA compliant" line) given how consequential accurate accessibility information is for visitors actually planning a trip. Collection search supports proper pagination and is keyboard/screen-reader navigable, matching the academic-preprint template's reasoning for serious research use.

## STRICT RULES
Never let "today's hours" default silently to a generic weekly schedule without reflecting real holiday/special closures. Never bury practical visit information beneath curatorial/exhibition storytelling — both matter, but the practical information must be reachable in one click from anywhere.
```

---

TEMPLATE 039 — Luxury Jewelry Maison (High Fashion / Heritage)

```text
Act as a senior luxury-brand designer with maison-level heritage-brand experience and a frontend engineer who prioritizes image fidelity and restraint above all else. Build the site for "{{MAISON_NAME}}", a luxury jewelry house with a multi-generational heritage and handcrafted pieces. Audience: an audience for whom price is not a barrier but authenticity, craftsmanship, and heritage narrative are the entire purchase justification — this is closer in spirit to the private-wealth template's restraint than to any e-commerce template, and the checkout/commerce mechanics, where present at all, must be nearly invisible relative to the storytelling.

## PRODUCT REASONING
Provenance and process (where materials come from, how a piece is made, by whom) is the actual product story being sold — a jewelry maison's site succeeds or fails on whether it can make craftsmanship tangible through pacing and imagery, not through feature-rich e-commerce functionality (a fast checkout would undersell, not help, a five-figure purchase decision that typically happens through private consultation anyway).

## TECH STACK (justified)
Astro 4 (near-zero JS, imagery-led, similar reasoning to the architecture-portfolio and boutique-travel templates); Tailwind CSS v4 for minimal chrome; large, carefully color-managed imagery (jewelry photography requires exceptional color accuracy) with the framework's native image optimization tuned for high fidelity over aggressive compression.

## DESIGN SYSTEM
Colors: --bg:#0D0D0C · --fg:#F2EFE9 · --muted:#8F897C · --accent:{{ACCENT_HEX}} (fallback a restrained warm gold #A8834A, used minimally — for a single rule or monogram, never as a UI-button color at scale, since buttons/CTAs as a visual category should barely register on this site).
Typography: Display "Cinzel" or a comparable refined serif, generous tracking, used exclusively for maison name and collection titles; Body "Cormorant" at a slightly larger-than-typical size, since long-form heritage/craft narrative benefits from an unhurried reading size, similar to the literary-magazine template's reasoning.
Grid: full-bleed imagery dominant; text blocks narrow (560px max) and sparse.

## SECTIONS
### 1. Maison Entry (not a conversion-oriented hero) — a single full-viewport image of the current collection's signature piece, maison name, and nothing else — no CTA button in the first view; the visitor is meant to begin a slow scroll, not be funneled toward an action immediately.
### 2. Heritage — real, specific history (founding year, a specific formative story, generational continuity if applicable) told as genuine prose, not a marketing "our story" template — specificity (a real date, a real founder anecdote) is what separates authentic heritage narrative from generic luxury-brand copywriting.
### 3. Current Collection — each piece presented individually with full-bleed photography from multiple angles, material specification (metal purity, stone provenance/certification if applicable — e.g. a diamond's certification body and report number) stated with the same precision a serious buyer would expect, and price shown plainly without discount framing (luxury pricing psychology specifically rejects the strikethrough-discount pattern common in mass e-commerce, similar to the handmade-marketplace template's reasoning taken further).
### 4. Craftsmanship — a real, specific process narrative (which techniques, how long a piece takes to make, where it's made) with process photography if available — this is the actual substantiation of the "handcrafted" claim, and its absence (a vague "meticulously crafted" line with no specifics) is what separates a credible maison site from a generic luxury-brand-template imitation.
### 5. Private Appointment / Atelier Visit (the actual primary CTA, appearing late in the page) — a request-an-appointment flow (in-boutique or virtual consultation), not instant checkout, matching how pieces at this price point are typically actually sold — bespoke/commission inquiries handled through the same considered form.
### 6. Provenance & Certification — for pieces involving precious stones, an explicit statement of sourcing/certification standards (conflict-free sourcing certification, gemological certification) — an increasingly real purchase factor for this buyer that deserves substantive, specific treatment, not a token line.

## STATES, RESPONSIVE, PERFORMANCE
Every image on the site is treated as primary content, with responsive `srcset` tuned for genuine high fidelity (not the aggressive compression appropriate to a typical e-commerce site) since color and detail accuracy materially affect the perceived value of the actual product being sold. Mobile retains the same slow, full-bleed pacing rather than compressing the experience into a denser mobile-commerce pattern — this audience expects the same considered experience regardless of device. Appointment-request form remains genuinely simple and low-friction despite the otherwise slow, editorial pacing of the rest of the site — the one place speed is appropriate is once the visitor has decided to act.

## STRICT RULES
Never use strikethrough-discount pricing or urgency mechanics ("only 2 left") — directly contradicts luxury positioning. Never use stock imagery in place of real product photography — if real photography isn't available for a piece, that piece is not shown. Never fabricate heritage details (founding dates, provenance claims) — use only real supplied history.
```

---

TEMPLATE 040 — Fine-Dining Restaurant Group

```text
Act as a senior hospitality-brand designer and a frontend engineer focused on reservation-conversion and mobile-first practical use. Build the site for "{{RESTAURANT_NAME}}", a fine-dining restaurant (or small group of restaurants under one culinary identity). Audience: diners deciding whether to book, checked primarily on a phone, often while deciding among several options in real time — the site's job is to convey the specific culinary point of view quickly and get to a working reservation booking within seconds, not to be a slow editorial experience like the boutique-travel or jewelry templates, despite some surface visual similarity (dark, elegant, photography-led).

## PRODUCT REASONING
Unlike the jewelry maison template, speed to the actual reservation action matters here — a diner deciding "should we book this restaurant tonight" will not tolerate a slow-loading, scroll-heavy experience the way a considered luxury-jewelry purchase decision tolerates one. The tension to resolve: convey real culinary craft/atmosphere (needs some visual richness) while getting out of the way of the booking action fast (needs speed and low friction).

## TECH STACK (justified)
Astro 4 (fast static content for the imagery-led sections) with a single React island for the live reservation-availability widget (typically embedding or calling a real reservations system like {{RESERVATION_PROVIDER}}, e.g. Resy/OpenTable) — this is the one place real interactivity and live data matter on an otherwise mostly-static site.

## DESIGN SYSTEM
Colors: --bg:#141210 · --surface:#1D1A17 · --border:#2E2A25 · --fg:#F1ECE4 · --muted:#9C9385 · --accent:{{ACCENT_HEX}} (fallback a warm amber #C48A3D) — evokes candlelit dining without being a generic dark-luxury template; palette should reflect the restaurant's actual real interior/plating if known.
Typography: Display a refined serif matching the restaurant's actual brand identity for the restaurant name/menu section headers; Body "Inter" or similarly clean sans for practical information (hours, reservation flow) specifically, since practical information benefits from maximum legibility even on an otherwise atmospheric site.

## SECTIONS
### 1. Hero — Atmosphere + Immediate Reservation CTA — one strong, real interior/food photograph and the restaurant name, with the reservation widget (live available time slots for tonight, or a date picker) visible within the same first screen, not several scrolls down — resolving the speed-vs-atmosphere tension by placing both together rather than sequencing atmosphere first.
### 2. The Menu / Culinary Point of View — a real, current menu or tasting-menu structure (not a PDF scan — actual formatted text, since PDF menus are a well-known mobile-usability failure in this category) with a short, specific chef's-approach statement (real, not generic "passion for fresh ingredients" copy).
### 3. The Space — a small, curated gallery of real interior photography (not a large scrolling gallery — a handful of well-chosen images), since this content supports the booking decision but shouldn't slow down the path to reservation.
### 4. Private Dining / Events (if applicable) — a distinct inquiry path for private events, separate from the standard reservation flow, since this is a genuinely different transaction type with different lead times and requirements.
### 5. Location & Practical Info — address, parking/transit guidance, dress code if any, and hours — stated plainly and completely, since incomplete practical information is a real, common source of diner frustration in this category.
### 6. Reservation (repeated, persistent) — the same live-availability widget accessible via a persistent header CTA from anywhere on the site, since, as with the museum template's practical-info bar, the primary functional action should never require scrolling back to the top to find.

## STATES, RESPONSIVE, PERFORMANCE
Reservation widget shows a genuine "fully booked tonight, next available: {{DATE}}" state rather than a dead end, with a waitlist-join option if the reservation provider supports one. Menu content is real, semantic HTML text (never an image or PDF of the menu) so it's searchable, zoomable, and screen-reader accessible — this is a frequent, easily-avoidable accessibility and usability failure in this category. Mobile is treated as the primary experience (most reservation-decision browsing happens on a phone, often while out or deciding last-minute), with the reservation CTA persistently reachable via a sticky element, similar reasoning to the neobank template's mobile CTA placement.

## STRICT RULES
Never use a PDF or image file as the primary menu format — real text only. Never let the reservation widget dead-end without a next-available-date or waitlist alternative. Practical information (hours, address) must always be current and complete.
```

---

TEMPLATE 041 — Boutique Hotel Group

```text
Act as a senior hospitality-brand designer and a frontend engineer focused on booking-conversion across a multi-property portfolio. Build the site for "{{HOTEL_GROUP_NAME}}", a small group of individually distinct boutique hotels ({{PROPERTY_1..N}}, e.g. 3-5 properties, each with its own character/location). Audience: travelers choosing between the group's own distinct properties (needs each property's individual identity to come through clearly) and, separately, deciding whether to book direct vs. through an OTA (Expedia/Booking.com) — the direct-booking value proposition (rate parity or better, no OTA fees, direct guest-services relationship) deserves explicit, substantive treatment, since this is a real, specific commercial concern for boutique hotel groups competing with OTA-driven discovery.

## PRODUCT REASONING
Each property needs its own visual identity within a coherent group system — a single generic template stamped across all properties would undersell exactly what makes a boutique group different from a chain (each property has a distinct character). The IA must support both "compare our properties" (group-level) and "everything about this one property" (property-level) as genuinely different, well-served pages.

## TECH STACK (justified)
Astro 4 (content-heavy, multi-property, imagery-led) with a React island for the live rate/availability booking widget per property; Tailwind CSS v4 with a shared token system that each property page customizes (accent color, imagery) within a consistent structural template — systematized flexibility, not either rigid sameness or total one-off redesign per property.

## DESIGN SYSTEM
Colors: --bg:#FFFFFF · --fg:#181614 shared group-level tokens; each property page overrides --accent and a secondary imagery-derived tone to reflect its specific location/character (e.g. a coastal property might use a sea-glass green, a city property a warmer brick tone) — this per-property override is a deliberate design-system feature, not an inconsistency.
Typography: a shared display/body pairing across the group for brand coherence (e.g. "Canela" display, "Söhne" body), with only color/imagery varying per property — this balance (consistent typography, varying color/imagery) is what makes the group read as one brand with distinct properties, rather than either a generic chain or unrelated one-off sites.

## SECTIONS
### 1. Group Homepage — Property Selector — a real comparison view: each property shown with its distinct signature image, one-line character description ("A converted 1920s townhouse in {{CITY}}"), and starting nightly rate — functioning as genuine decision support for choosing between properties, not just a logo-wall list.
### 2. Property Page — Hero + Live Availability — the individual property's own strongest imagery and character statement, with a live date-picker/availability widget showing real (or realistically representative) rates and room types.
### 3. Book Direct, Explained — a specific, substantive comparison: "Book direct and get {{DIRECT_BENEFIT_1..3}}: best-rate guarantee, free early check-in when available, no OTA booking fee" — addressing the real commercial reason this page exists rather than assuming visitors already prefer direct booking.
### 4. Rooms & Suites — each room type with real photography, size, bed configuration, and view description — specific and factual, avoiding vague "cozy and elegant" copy that could describe any room anywhere.
### 5. Property Amenities & Local Character — what's unique to this specific property and its neighborhood (a real restaurant recommendation, a specific local landmark) — boutique hospitality is sold partly on local authenticity, and generic "amenities: pool, gym, wifi" framing undersells that.
### 6. Cross-Property Loyalty (if applicable) — if {{LOYALTY_PROGRAM}} spans the group, its benefits stated plainly across stays at any property.
### 7. Book Now (persistent) — the availability widget accessible via persistent header CTA on every property page, matching the restaurant template's reasoning for keeping the core functional action always reachable.

## STATES, RESPONSIVE, PERFORMANCE
Availability widget shows genuine sold-out dates distinctly from available ones (not just disabling them silently) and offers a "notify me" or suggests the nearest available dates. Each property's imagery is the majority of that page's weight and uses responsive `srcset`; the group-level comparison page uses appropriately smaller preview imagery to keep initial load fast despite covering multiple properties. Mobile booking widget uses native date-picker patterns for reliability across the wide range of devices travelers use.

## STRICT RULES
Never let all properties share identical generic template copy ("elegant accommodations in the heart of the city") — each property's specific character must come through in its own real, specific language. Never present a fabricated or non-live rate as if it were real availability.
```

---

TEMPLATE 042 — Video Editing SaaS (Creative Tool)

```text
Act as a senior creative-tools product designer and a frontend engineer experienced with timeline/media-heavy interfaces. Build "{{BRAND_NAME}}", a browser-based video editing tool for content creators and social media teams. Audience: creators and social media managers evaluating whether a browser-based editor can genuinely replace or supplement a desktop NLE (Premiere/Final Cut) for their fast-turnaround content needs — skepticism here centers on performance (can a browser really handle video editing well) and export quality, not on basic feature existence.

## PRODUCT REASONING
As with the design-tool template, the only credible demo is a real, interactive timeline the visitor can actually scrub and edit — but unlike a general design tool, this category's buyer specifically doubts browser-based video performance, so a visible, honest performance indicator (real-time playback without stutter, shown live) is the central trust-building mechanism.

## TECH STACK (justified)
Next.js 15; Tailwind CSS v4; a real, functional timeline component (even a simplified marketing-page version: draggable clips, a scrubbable playhead, a live preview panel) using the Web Video/Canvas APIs directly — WebGL/WebCodecs where genuinely beneficial for performant preview rendering, not decoratively.

## DESIGN SYSTEM
Colors: --bg:#121317 · --surface:#1B1D22 · --border:#2B2E36 · --fg:#E8E9ED · --muted:#8B8FA0 · --accent:{{ACCENT_HEX}} (fallback #FF4D6A) — a bold, creator-friendly accent, matching the energy of short-form content creation, distinct from the more restrained registers of enterprise-software templates in this set.
Typography: "Inter Tight" / "Inter", tabular-nums for all timecodes.

## SECTIONS
### 1. Hero — Real Interactive Timeline — a functional (simplified) timeline with 3-4 real video/audio clips, a draggable playhead scrubbing a live preview, and a visible "1080p · 30fps · smooth playback" indicator during scrubbing — the honest, demonstrated performance claim placed exactly where the skeptical buyer is testing it themselves.
### 2. Auto-Captions & Subtitles — a real demo: uploading (or using a sample) clip auto-generates captions with a visible, editable transcript synced to the timeline — a major, specific feature this audience cares about for short-form/social content, shown functioning rather than described.
### 3. Templates for Social Formats — real aspect-ratio/format templates (9:16 for Reels/TikTok, 1:1, 16:9) with a live preview switching between them on the same clip, showing how framing/safe-zones adjust — a concrete, format-specific feature this audience specifically needs, distinct from a generic desktop NLE's framing.
### 4. Export Quality & Speed — a real comparison: export time and resulting file quality/bitrate shown transparently (e.g. "1-minute 1080p export: ~45 seconds") — addressing the export-quality skepticism directly with specific, checkable numbers, not vague "fast, high-quality exports" claims.
### 5. Collaboration — real-time or async multi-editor collaboration on the same project (comments on specific timeline positions, version history) — a genuine differentiator from most desktop NLEs, worth its own concrete demo.
### 6. Stock Library & AI Tools — integrated stock footage/music search and any AI-assisted editing features (auto-cut silence, background removal) shown with real, honestly-labeled example results.
### 7. Pricing — from {{PRICING_TIERS}}, typically differentiated by export resolution/watermark and storage — stated with specific limits, not vague tier names alone.

## STATES, ACCESSIBILITY, PERFORMANCE
Timeline scrubbing performance is genuinely optimized (not just claimed) — frame-accurate preview rendering should not visibly stutter during the actual marketing-page demo, since a laggy demo would immediately confirm the audience's core skepticism rather than resolve it. Auto-caption demo shows a realistic accuracy level (including an occasional visible correction, not a suspiciously perfect transcript) for credibility. Timeline and its controls are keyboard-operable at a basic level (play/pause, frame-step) matching the design-tool template's accessibility reasoning for canvas-based interfaces.

## STRICT RULES
Never demo a timeline interaction that stutters or lags — this directly disproves the product's core claim to this specific skeptical audience. Never claim export speed/quality numbers without them being genuinely representative.
```

---

TEMPLATE 043 — Team Productivity / Task Management App

```text
Act as a senior productivity-software designer and a frontend engineer who understands that this category succeeds or fails on daily habitual use, not first-impression delight. Build "{{BRAND_NAME}}", a task and project management app for small, fast-moving teams (distinct from the earlier enterprise CRM/HR templates' larger-org focus). Audience: small-team leads evaluating switching from an existing tool (Trello, Asana, Linear, or a spreadsheet) — the switching-cost objection is the dominant one, since teams that already have a working system, however imperfect, are reluctant to disrupt it.

## PRODUCT REASONING
Unlike the enterprise CRM template's sales-assisted, complex-evaluation buyer, this audience self-serves and decides fast, often within a single trial session — the marketing site must get a visitor into a genuinely usable, populated demo workspace within seconds, not behind a long form, and the switching/import story needs to be concrete and specific per common competitor.

## TECH STACK (justified)
Next.js 15; Tailwind CSS v4; Framer Motion for card-drag and view-switching transitions; a real, interactive kanban/list/timeline view-switcher as the core demo (this category's real differentiator is often flexible views over the same underlying data, not any single view alone).

## DESIGN SYSTEM
Colors: --bg:#FFFFFF · --surface:#F7F7FA · --border:#E6E6EE · --fg:#181A22 · --muted:#65697A · --accent:{{ACCENT_HEX}} (fallback #5B5BF0). Clean, fast-feeling, minimal decorative chrome, since perceived speed of the interface itself is a real competitive factor in this crowded category.
Typography: "Inter", compact but legible spacing, matching the actual density of a real daily-use tool rather than an airy marketing aesthetic.

## SECTIONS
### 1. Hero — Live, Pre-Populated Workspace Demo — a genuinely interactive kanban board with realistic sample tasks (not "Task 1, Task 2" placeholders — real-feeling task names relevant to a software team's actual sprint) that a visitor can drag between columns, with a view-switcher (Board / List / Timeline) re-rendering the same data instantly — demonstrating the flexible-views differentiator directly.
### 2. Import From Your Current Tool — a specific, named migration path with a real before/after: "Import your Trello board in under a minute" showing an actual mapped-fields preview (Trello lists → this tool's board columns) — concretely resolving the dominant switching-cost objection, similar in spirit to the CRM and design-tool templates' migration sections but tuned to this audience's faster, self-serve decision style.
### 3. Automation / Recipes — simple, real automation examples ("When a task moves to Done, notify the assignee's manager in Slack") shown as an actual rule-builder interaction, not just described.
### 4. Integrations — real tool integrations ({{INTEGRATION_1..8}}: Slack, GitHub, Figma, Google Calendar) relevant to how small teams actually coordinate work across tools.
### 5. Team Visibility — a simple workload/capacity view (who has how many active tasks) addressing a real, common small-team pain point (overloaded team members going unnoticed) without the density of an enterprise resource-management tool.
### 6. Pricing — from {{PRICING_TIERS}}, typically free-tier-inclusive given this category's self-serve, bottom-up adoption motion (a team often starts free before a manager approves a paid plan), and this free tier should be genuinely usable, not crippled to the point of being a pure teaser.
### 7. Start Free CTA — genuinely one-click signup (SSO options prominent) leading directly into a populated demo workspace, not an empty blank-slate that requires setup effort before any value is felt.

## STATES, ACCESSIBILITY, PERFORMANCE
Drag-and-drop kanban interaction has a keyboard-operable alternative (matching the CRM/recruitment templates' reasoning) since this is core, frequent daily-use interaction, not an edge case. View-switching (Board/List/Timeline) preserves scroll position and selection state across switches so the interaction feels instant and coherent, not like navigating to a new page. First-run empty state (a genuinely new, empty workspace after signup) includes a lightweight guided setup (3 quick prompts: name your first project, invite a teammate, create a task) rather than a blank canvas that risks immediate abandonment.

## STRICT RULES
Never show the interactive demo pre-populated with unrealistic, obviously-fake placeholder text ("Task 1") — this undermines the credibility of an otherwise-strong interactive-demo strategy. Never claim a migration import "in under a minute" without the actual field-mapping mechanism shown.
```

---

TEMPLATE 044 — Podcast / On-Demand Audio Media Network

```text
Act as a senior media-brand designer and a frontend engineer focused on audio-first content discovery. Build the site for "{{NETWORK_NAME}}", a network of podcasts across {{GENRE_FOCUS}} (e.g. business, true crime, culture). Audience: listeners discovering new shows/episodes (often arriving from a specific episode shared on social media, not the homepage) and, separately, advertisers/sponsors evaluating the network's reach and audience demographics for ad placement — these are genuinely different audiences needing genuinely different content, similar in spirit to the creator-membership template's two-sided design.

## PRODUCT REASONING
Most traffic in this category lands on a specific episode page via a shared link, not the homepage — the episode page itself must function as a complete, standalone entry point (full show context, easy subscribe-anywhere links) rather than assuming the visitor already knows the show. The advertiser-facing content (a "media kit" style page) is a distinct, real commercial need deserving its own dedicated, credible treatment with actual audience data.

## TECH STACK (justified)
Next.js 15 App Router (server-rendered for fast episode-page loads from shared links, and for SEO discoverability of episode content); Tailwind CSS v4; a real, functional embedded audio player (not just a link out to Spotify/Apple) with proper scrubbing, playback-speed control, and persistent mini-player while browsing other pages.

## DESIGN SYSTEM
Colors: --bg:#0F0E12 · --surface:#18171C · --border:#2A2830 · --fg:#EEEDF0 · --muted:#8D899A · --accent:{{ACCENT_HEX}} (fallback #F5A623) reflecting the network's actual brand; each individual show within the network can carry its own accent color for its show-specific pages while the network shell (nav, footer) stays consistent — similar systematized-flexibility reasoning to the boutique-hotel-group template.
Typography: "Inter Tight" / "Inter", generous type for episode titles/descriptions since these are often read while also listening or multitasking, favoring scannability.

## SECTIONS
### 1. Episode Page (the real primary entry point, designed as such) — episode title, show branding, full functional audio player, complete show notes/timestamps, and prominent "Listen on Spotify / Apple / {{PLATFORM_3..5}}" links — a first-time visitor arriving from a shared link should immediately understand what show this is and be able to subscribe on their platform of choice within one click.
### 2. Show Page — full episode archive for one show (searchable/filterable by topic if the show has enough episodes to warrant it), host bios, and a subscribe CTA repeated prominently.
### 3. Network Homepage — a real, current front page across all shows in the network (latest episodes across shows, not just one flagship show), functioning as a discovery hub for visitors exploring the broader network rather than one specific show.
### 4. Persistent Mini-Player — once playback starts, a persistent, minimized player bar remains visible while the visitor navigates to other pages (show notes, other episodes) — a genuine, expected behavior for this category that many podcast sites fail to implement, and its absence is a real, noticeable UX gap.
### 5. For Advertisers (media kit) — real, specific audience data if {{AUDIENCE_DATA}} is available (download numbers, demographic breakdown, geographic distribution) presented credibly with methodology/source noted, plus a clear sponsorship-inquiry contact path — this section's tone and density should read as a legitimate media kit, distinct from the listener-facing sections.
### 6. Newsletter / Community — for shows with a companion newsletter or community (Discord, Patreon-style bonus content), a clear, non-intrusive signup path.

## STATES, ACCESSIBILITY, PERFORMANCE
Audio player has full keyboard control (play/pause, seek, speed) and is screen-reader operable with clear ARIA labeling on all controls, since audio-first products have historically underinvested in this relative to video/visual accessibility. Show notes/timestamps are real, clickable seek-points into the audio (not just a static list), a genuinely useful and expected feature for long-form episodes. Persistent mini-player state survives client-side navigation (a real technical requirement, not just a visual detail) so playback never interrupts when browsing.

## STRICT RULES
Never assume the visitor arrived at the homepage — every episode page must stand alone as a complete entry point. Never fabricate audience/download numbers for the advertiser-facing media kit page. Persistent playback across navigation must actually work, not just be implied by the UI.
```

---

TEMPLATE 045 — Niche Hobbyist Community Forum

```text
Act as a senior community-software designer and a frontend engineer who respects long-established forum UX conventions. Build "{{COMMUNITY_NAME}}", an online forum/community for enthusiasts of {{HOBBY_FOCUS}} (e.g. vintage synthesizer restoration). Audience: a passionate, often long-tenured niche community that has strong, specific opinions about forum UX (many have used old-school phpBB/vBulletin-style forums for years) — this audience specifically distrusts over-designed, social-media-style "engagement-optimized" community platforms, and rewards a fast, information-dense, genuinely useful discussion experience over visual polish.

## PRODUCT REASONING
Unlike the creator-membership platform (monetization-focused, individual creator brand) or the general SaaS-productivity tools in this set, this category's actual product-market fit signal is depth of searchable knowledge (old threads with real expertise) and fast, low-friction posting — a slow, animation-heavy, infinite-scroll "feed" would actively repel this audience's stated preferences, which the design must respect even though it cuts against typical modern web-design instinct toward heavier visual polish.

## TECH STACK (justified)
Next.js 15 App Router, server-rendered for fast thread-page loads and search-engine discoverability of years of accumulated expert content (a real, valuable asset for this category that must remain crawlable); Tailwind CSS v4, restrained; minimal client JS — this audience's stated preference for fast, simple forum software is itself a design requirement, not a technical shortcut.

## DESIGN SYSTEM
Colors: --bg:#FFFFFF · --surface:#F5F6F7 · --border:#DCDFE3 · --fg:#1B1D21 · --muted:#5E636B · --accent:{{ACCENT_HEX}} (fallback #2C6FBB) — clean and functional, deliberately unglamorous; this audience does not need or want a striking visual identity competing with the content.
Typography: "Inter" at a compact, information-dense size (15px, tighter line-height than the more spacious templates in this set) matching real forum-reading conventions, where scanning many posts efficiently matters more than generous whitespace.

## SECTIONS
### 1. Category/Subforum Index (the actual homepage) — a real, dense list of subforums (organized by the hobby's actual real sub-topics, e.g. "Synth Repair," "MIDI & DIY," "For Sale") with thread count, latest post timestamp and author — matching genuine, familiar forum-index conventions rather than a modern "feed" reimagining.
### 2. Thread List — sortable by latest activity or newest, with clear read/unread state per thread (a real, expected forum feature this audience specifically relies on to track what's new since their last visit).
### 3. Thread Page — full post history in chronological order (never algorithmically reordered), with quote-reply functionality, inline image/attachment support (relevant to a hobby likely involving physical objects/photos), and clear post-author reputation/badge conventions if the community has them (e.g. "Verified Restorer," post count) — real, substantive community-status signals, not superficial gamification.
### 4. Search (a first-class, prominent feature, not an afterthought) — full-text search across the entire archive, since a mature niche forum's accumulated expert knowledge is a real, valuable resource and findability of old threads is a primary, everyday use case.
### 5. Marketplace/Classifieds Subforum (if relevant to {{HOBBY_FOCUS}}) — many hobbyist communities include a for-sale/trade section; if present, this needs simple, clear listing conventions (item, price, condition, location) distinct in tone/density from the discussion subforums.
### 6. New Member Onboarding — a lightweight welcome/rules thread and a simple profile setup, respecting this audience's preference for getting to real content fast rather than an elaborate onboarding flow.

## STATES, ACCESSIBILITY, PERFORMANCE
Read/unread thread state persists reliably across sessions (a real, expected feature whose failure would be immediately noticed and disliked by this specific audience). Search results are fast and relevant, with proper full-text indexing rather than a naive substring match, given how central search is to this product's actual value. Pages are server-rendered and lightweight — this audience frequently accesses forums from older devices/browsers and specifically values fast load times over visual richness, and the technical approach should genuinely honor that stated preference rather than defaulting to a heavier modern SPA pattern regardless.

## STRICT RULES
Never impose an algorithmically-reordered "engagement feed" in place of genuine chronological threads — this directly contradicts this audience's explicit, well-documented preference and would be read as a hostile redesign. Never sacrifice search/archive quality for visual polish — the accumulated knowledge base is the platform's actual value.
```

---

TEMPLATE 046 — Enterprise Data Warehouse / Cloud Infrastructure Company

```text
Act as a senior infrastructure-product designer and a frontend engineer who writes technically precise content for a highly skeptical engineering audience. Build "{{BRAND_NAME}}", a cloud data warehouse platform for large-scale analytical workloads. Audience: data platform engineers and architects making a multi-year infrastructure commitment — this is among the highest-stakes, most technically scrutinized purchase decisions in this entire set, and the marketing site must hold up to genuine technical due diligence (benchmark methodology, architecture correctness) rather than impressionistic claims.

## PRODUCT REASONING
Unlike the API-gateway template's fast, code-sample-led approach (appropriate for a lower-commitment adoption decision), this category's buyer conducts extended technical evaluation (proof-of-concept benchmarks against their own workload) before committing — the marketing site's job is to earn a place in that evaluation shortlist by demonstrating architectural rigor and being scrupulously honest about tradeoffs (e.g. where a columnar architecture is worse, not just where it's better), since overclaiming here is a well-known pattern this audience specifically watches for and penalizes.

## TECH STACK (justified)
Next.js 15 with MDX for architecture/benchmark content; Tailwind CSS v4; D3 for real benchmark visualizations (query latency vs. data volume, cost vs. performance curves) with full methodology disclosure alongside every chart.

## DESIGN SYSTEM
Colors: --bg:#0B0D10 · --surface:#141821 · --border:#242B36 · --fg:#DEE3EA · --muted:#7C8595 · --accent:{{ACCENT_HEX}} (fallback #4FA6E8). Restrained, technical, similar register to the API-gateway and SOC-cybersecurity templates.
Typography: "Inter Tight" / "Inter", "IBM Plex Mono" for query examples and config, tabular-nums throughout benchmark data.

## SECTIONS
### 1. Hero — Real Benchmark, Full Methodology — a specific, falsifiable performance claim (e.g. "Median query latency of {{X}}ms across a {{DATASET_SIZE}} dataset") with a visible "View methodology" link immediately adjacent — never a bare superlative claim, matching the API-gateway template's core credibility mechanism but at even higher rigor given the stakes of this purchase decision.
### 2. Architecture Deep-Dive — a real, technically accurate diagram of the storage/compute separation, query execution engine, and caching layers — this audience will scrutinize this diagram for correctness and internal consistency, so it must reflect genuine architectural decisions, not a generic "cloud infrastructure" illustration.
### 3. Honest Tradeoffs — an explicit section naming workload types this architecture is NOT optimized for (e.g. "not designed for high-frequency single-row transactional writes — see {{ALTERNATIVE_USE_CASE}}") — this specific honesty is what separates a credible infrastructure vendor from a marketing-driven one to this audience, similar reasoning to the open-source-docs template's honest comparison section.
### 4. Cost Model, Transparent — a real, usable cost calculator (compute + storage inputs → estimated monthly cost) reflecting the actual pricing model's complexity (e.g. separate compute/storage scaling) rather than a misleadingly simplified "starting at $X" headline number.
### 5. Migration Path — concrete migration tooling/process from named common source systems ({{SOURCE_SYSTEM_1..3}}: on-prem Hadoop, a competing warehouse), since migration risk is a major, real blocker for this category's multi-year-commitment buyer.
### 6. Security & Compliance — SOC 2, data residency options, encryption specifics — substantive, not a badge wall, matching the cybersecurity template's reasoning.
### 7. Talk to an Engineer (not generic sales) — the CTA specifically frames the next step as a technical conversation/proof-of-concept setup, not a generic "book a demo," matching how this category's buyers actually expect the sales process to work.

## STATES, ACCESSIBILITY, PERFORMANCE
Every benchmark chart includes its dataset size, hardware/instance type, and query type in a visible caption, never only in a footnote or separate methodology page disconnected from the chart itself. Cost calculator handles realistic, complex usage patterns (variable compute scaling) rather than only a simple flat-rate scenario. Architecture diagrams have accessible text descriptions alongside the SVG for screen-reader users evaluating the same technical content.

## STRICT RULES
Never publish a benchmark claim without complete, adjacent methodology. Never omit real architectural tradeoffs/weaknesses — this category's buyer will discover them anyway during evaluation, and doing so first is a genuine credibility asset, not a liability.
```

---

TEMPLATE 047 — Personal Finance / Budgeting Consumer App

```text
Act as a senior consumer-fintech designer specializing in behavior-change product design and a frontend engineer focused on approachable data visualization. Build "{{BRAND_NAME}}", a personal budgeting and financial-habit app for individuals. Audience: people who feel anxious or avoidant about looking closely at their finances — distinct from the neobank template's cost-transparency-focused audience and the trading-platform's active-investor audience, this product's actual job is emotional: making financial self-awareness feel manageable rather than shameful, since shame/avoidance is the real behavior this product must overcome to be used at all.

## PRODUCT REASONING
Unlike most fintech categories in this set, the primary design risk here is not misleading claims but demotivating framing — a budgeting app that shows overspending in alarming red everywhere will get abandoned by exactly the anxious users it's meant to help. Visual and copy tone must be calm and non-judgmental even when communicating bad news (overspending, low savings).

## TECH STACK (justified)
Next.js 15; Tailwind CSS v4; Framer Motion for gentle, reassuring data-reveal animations (numbers counting up calmly, not urgently); a real spending-categorization visualization (a simple, legible chart, not an intimidating dense dashboard) as the core product demo.

## DESIGN SYSTEM
Colors: --bg:#FFFCF8 · --surface:#FFFFFF · --border:#EFE7DA · --fg:#241F16 · --muted:#867E6E · --accent:{{ACCENT_HEX}} (fallback #E0995A, warm, calm) — deliberately avoiding harsh red for "overspending" states; instead using a muted amber for attention-needed states and reserving true red for nothing in this product, since even a well-intentioned "warning red" reads as alarming/shaming to this specific anxious audience.
Typography: "Inter" or a similarly warm-adjacent humanist sans, plain-language copy throughout — no financial jargon without a plain-language equivalent, similar reasoning to the SMB-accounting template but applied to personal (not business) finance anxiety specifically.

## SECTIONS
### 1. Hero — Calm Spending Overview Demo — a real-feeling, simple visualization (a small number of clear categories, not a 20-category pie chart) of a month's spending, with a gentle, encouraging summary line ("You're on track with your dining budget this month") rather than a stark deficit/surplus framing — showing the product's actual emotional register directly.
### 2. Goal-Based Framing (not restriction-based) — real goal examples ({{GOAL_1..3}}: "Save for a trip," "Build an emergency fund," "Pay down a credit card") since this category performs better when framed around what the user is working toward, not what they should stop doing — a meaningfully different psychological frame from a pure expense-tracking tool.
### 3. Bank Connection & Security — a plain-language explanation of how bank-linking works and what data is/isn't shared, addressing the real, common anxiety about connecting financial accounts to a third-party app, similar reasoning to the neobank template's trust section but focused on linking rather than holding funds.
### 4. Automatic Categorization, Shown Working — a demo of transactions auto-sorting into categories with an easy manual-recategorize interaction for anything miscategorized (since categorization mistakes, if left uncorrectable and visible, would undermine trust quickly).
### 5. Gentle Nudges, Not Alarms — example notification copy shown directly ("Heads up — you've used most of your dining budget with a week left in the month. No pressure, just wanted you to know.") demonstrating the actual tone discipline this product requires, since notification copy tone is a first-order product decision in this specific category.
### 6. Progress Over Time — a simple, encouraging longer-term view (net worth or savings-goal progress over months) emphasizing trend and progress rather than any single bad month in isolation.
### 7. Get Started CTA — low-friction signup emphasizing "see your first insight in under 2 minutes" (a real, fast time-to-value claim appropriate to lower the activation-energy barrier this anxious audience specifically faces).

## STATES, ACCESSIBILITY, PERFORMANCE
Overspending/deficit states are always framed with actionable, non-judgmental copy alongside any negative number — never a bare red number with no supportive context. Bank-linking flow shows clear, honest error states (a failed connection) with a specific next step, since a failed financial-account connection is a moment of real anxiety for this audience and deserves a reassuring, clear resolution path, not a generic error message. All financial figures are in tabular-nums with clear, consistent currency formatting.

## STRICT RULES
Never use alarm-red or shame-based framing for overspending states — this is a specific, deliberate design constraint for this category given its emotional stakes. Never fabricate example goal-progress or spending data implying it reflects a real, specific user's account. Bank-linking security claims must be accurate and specific, not vague reassurance.
```

---

TEMPLATE 048 — DTC Fashion Brand (Contemporary, Direct-to-Consumer)

```text
Act as a senior fashion e-commerce designer and a frontend engineer focused on conversion-optimized, imagery-rich commerce. Build "{{BRAND_NAME}}", a direct-to-consumer contemporary fashion brand ({{PRODUCT_CATEGORY}}, e.g. sustainable everyday basics). Audience: online shoppers making a considered-but-fast apparel purchase decision — distinct from the luxury-jewelry template's slow, appointment-driven sales model, this category needs a genuinely fast, well-optimized commerce funnel (size selection, cart, checkout) alongside strong lifestyle photography, since both brand feeling and conversion mechanics matter roughly equally here.

## PRODUCT REASONING
The real, specific friction points in DTC apparel are sizing uncertainty (the #1 driver of returns in this category) and true-to-life color/fit representation from photography alone — the product page must address sizing uncertainty directly and substantively, not with a generic size chart link buried in a tab.

## TECH STACK (justified)
Next.js 15; Tailwind CSS v4; a real, considered product-image gallery with zoom and multiple angles/on-model views; Framer Motion for cart/size-selector micro-interactions; a genuinely fast, few-step checkout (this category's conversion rate is highly sensitive to checkout friction).

## DESIGN SYSTEM
Colors: --bg:#FFFFFF · --fg:#181614 · --muted:#7A7469 · --accent:{{ACCENT_HEX}} derived from the brand's actual identity — this varies enormously by brand positioning (a minimalist basics brand vs. a bold streetwear brand would use very different palettes), so the accent must be chosen to reflect the specific brand, not a generic "fashion e-commerce" default.
Typography: a brand-appropriate display face for campaign/editorial moments, "Inter" or similarly clean sans for all commerce-functional text (size charts, prices, cart) since functional commerce text benefits from maximum clarity regardless of the brand's editorial personality elsewhere.

## SECTIONS
### 1. Campaign Hero (editorial, brand-forward) — current campaign imagery and a strong brand statement, distinct from the commerce grid below it — this category benefits from a genuine editorial moment before transitioning into shoppable content, unlike a pure marketplace template.
### 2. Shop Grid — product cards with on-model primary image, hover-to-secondary-image (or flat-lay) interaction, price, and available-size indicator directly on the card (showing "S, M sold out, L, XL" at a glance saves a wasted click into a page for a size that isn't available) — this specific card-level sizing transparency is a real, meaningful conversion and frustration-reduction detail.
### 3. Product Page — Sizing Confidence (substantive, not a token chart link) — real garment measurements (not just S/M/L labels), a "true to size / runs small / runs large" indicator if {{FIT_DATA}} exists from real customer feedback, and, if available, a size-recommendation tool based on the customer's measurements or a similar-brand reference — this specific, substantive sizing investment directly addresses the category's #1 return driver.
### 4. Product Imagery — multiple real angles, on-model and flat-lay, with genuine zoom capability on fabric/texture close-ups, since fabric quality perception from photography alone is a real purchase-confidence factor.
### 5. Reviews (with real photo reviews if available) — genuine customer reviews, weighted toward ones that mention fit/sizing specifically, since that's the highest-value review content for this category's dominant purchase anxiety.
### 6. Cart & Checkout — a genuinely fast, few-step checkout with a persistent, visible cart summary; free-shipping-threshold messaging if applicable shown as real progress ("Add $18 more for free shipping") rather than a vague banner.
### 7. Sustainability / Sourcing (if part of brand positioning) — specific, real sourcing/material information ({{MATERIAL_1..3}}, factory/certification details) if part of {{BRAND_NAME}}'s actual positioning — substantive claims only, never vague "eco-friendly" language without specifics, matching the climate-tech template's anti-greenwashing reasoning applied here.

## STATES, ACCESSIBILITY, PERFORMANCE
Out-of-stock sizes are shown, not hidden, with a "notify me when back in stock" option, since hiding sold-out sizes silently is a common, frustrating pattern in this category. Product imagery uses responsive `srcset` with genuine attention to color accuracy in compression settings, since color misrepresentation is a real, specific return driver in apparel e-commerce. Checkout flow minimizes required fields and supports major expedited payment methods (Apple Pay/Google Pay) prominently, given how sensitive this category's conversion is to checkout friction.

## STRICT RULES
Never hide out-of-stock sizes without a clear "sold out" state and restock-notification option. Never use vague sustainability language ("eco-friendly," "conscious") without specific, real backing details. Product photography must accurately represent real color/fit — this is a genuine return-rate and trust issue, not just an aesthetic one.
```

---

TEMPLATE 049 — Beauty & Skincare DTC Brand

```text
Act as a senior beauty-industry e-commerce designer and a frontend engineer focused on ingredient-transparency and routine-building UX. Build "{{BRAND_NAME}}", a direct-to-consumer skincare brand. Audience: skincare-engaged consumers who research ingredients before buying (a specifically well-informed, ingredient-literate segment of this market) alongside a broader audience buying on trusted routine/regimen guidance — the site must serve both the ingredient-researcher (needs real INCI ingredient lists, concentration/formulation specifics where legally statable) and the routine-seeker (needs simple guidance: "what do I actually use, in what order").

## PRODUCT REASONING
Unlike the DTC-fashion template's sizing-uncertainty problem, this category's dominant real friction is product-fit uncertainty for a specific skin type/concern and ingredient interaction/compatibility confusion (e.g. "can I use this with retinol") — a genuinely useful routine-builder tool addressing compatibility is a much stronger differentiator here than generic lifestyle photography alone.

## TECH STACK (justified)
Next.js 15; Tailwind CSS v4; a real interactive routine-builder (select AM/PM, add products, get a compatibility/ordering check) as the core product-page tool, not just a shop grid; genuine, complete ingredient-list rendering per product (not summarized/hidden) for the ingredient-literate segment.

## DESIGN SYSTEM
Colors: --bg:#FFFCFA · --fg:#241D1A · --muted:#8B7E76 · --accent:{{ACCENT_HEX}} derived from actual brand identity/packaging — skincare brand palettes vary enormously by positioning (clinical/dermatological vs. clean/botanical vs. luxury), and this must be chosen deliberately per brand rather than defaulted.
Typography: a brand-appropriate display face for campaign content; "Inter" for all product/ingredient functional text, since ingredient lists and usage instructions benefit from maximum legibility regardless of brand personality elsewhere, matching the fashion template's reasoning for functional commerce text.

## SECTIONS
### 1. Hero — Brand & Hero Product — the brand's core positioning statement and hero product, similar in spirit to the fashion template's campaign hero, but typically product-led (skincare shoppers often arrive already knowing a specific concern they're solving for) rather than purely lifestyle-led.
### 2. Shop by Concern (not just by product type) — browsing organized around real skin concerns ({{CONCERN_1..6}}: acne, hyperpigmentation, sensitivity, aging) since this matches how the ingredient-literate and routine-seeking audiences alike actually think about their purchase, more than a generic "cleansers / serums / moisturizers" category structure alone (both structures can coexist, but concern-based browsing deserves genuine prominence).
### 3. Product Page — Full Ingredient Transparency — the complete, real INCI ingredient list (not summarized to "key actives" only), concentration of key actives where legally statable ({{ACTIVE_CONCENTRATION}}, e.g. "10% niacinamide"), and a plain-language explanation of what each key active does — substantive enough to satisfy the ingredient-literate segment specifically, since a summarized or vague ingredient section is a real, immediate credibility loss with this audience.
### 4. Routine Builder (interactive tool) — the visitor selects their current products (or the brand's own products) into AM/PM slots, and the tool checks for known compatibility issues (e.g. "Using retinol and this exfoliating acid together may increase irritation — consider alternating nights") — a genuinely useful, specific tool addressing the category's real ingredient-interaction confusion, not just a generic "build your routine" bundle-upsell.
### 5. Skin-Type/Concern Quiz (if used) — if {{QUIZ_TOOL}} exists, a real, specific quiz leading to genuine product recommendations with reasoning shown ("Recommended because you indicated sensitive skin and a concern with redness") rather than an opaque black-box result.
### 6. Reviews (with skin-type context) — reviews ideally tagged with the reviewer's skin type/concern if available, since "does this work for MY skin type" is the real underlying question generic star ratings don't answer.
### 7. Cart & Checkout — similar fast, low-friction checkout reasoning to the fashion template, with subscription/replenishment options shown clearly if the brand offers them (a common, real commerce pattern in consumable skincare).

## STATES, ACCESSIBILITY, PERFORMANCE
Ingredient list is always the complete, real list — never a marketing-summarized subset presented as the full list, which is both a trust issue with the ingredient-literate segment and, in many jurisdictions, a real regulatory labeling concern. Routine-builder compatibility warnings are specific and actionable (naming the actual interacting ingredients), not a vague "some products may not be compatible" non-answer. Quiz/recommendation results show their reasoning, avoiding an opaque-feeling result that reduces trust in the recommendation.

## STRICT RULES
Never summarize or truncate an ingredient list presented as complete. Never make an unsubstantiated efficacy claim ("clinically proven" without a cited study, "cures acne") — cosmetic/skincare claims face real regulatory scrutiny and must be stated within legally supportable bounds. Never give a routine-builder compatibility check that's decorative rather than genuinely informative.
```

---

TEMPLATE 050 — Enterprise Underwriting / B2B Insurance Platform

```text
Act as a senior enterprise fintech designer with insurance-industry domain knowledge and a frontend engineer experienced with complex, multi-party B2B workflows. Build "{{BRAND_NAME}}", a platform used by commercial insurance brokers and underwriters to quote and bind complex commercial policies (distinct from the earlier consumer-insurance template's simple, self-serve quote flow). Audience: brokers and underwriters managing genuinely complex risk assessment across multiple carriers — this is a professional workflow tool, not a consumer-trust-building marketing site, and the evaluation criteria center on workflow efficiency and data accuracy across a multi-party process (broker, underwriter, carrier, sometimes reinsurer).

## PRODUCT REASONING
Unlike the consumer-insurance template (fast, simple, single-party), this category's real value proposition is reducing the multi-day, multi-email, spreadsheet-heavy back-and-forth of complex commercial underwriting into a structured, auditable workflow — the demo should show that structured multi-party process directly (submission → quote comparison across carriers → bind), not a simplified consumer-style single quote.

## TECH STACK (justified)
Next.js 15; Tailwind CSS v4; a dense, real data-table-driven UI for risk data and quote comparison (similar density register to the CRE-listings and financial-terminal templates in this set, appropriate to this professional, data-heavy audience); document-upload/OCR-adjacent UI for the submission-intake flow, since commercial underwriting submissions are document-heavy (loss runs, financial statements).

## DESIGN SYSTEM
Colors: --bg:#FFFFFF · --surface:#F6F7F9 · --border:#E1E4EA · --fg:#151922 · --muted:#5C6472 · --accent:{{ACCENT_HEX}} (fallback #1D5FBF) — professional, credible, similar register to the wholesale-marketplace and CRE-listings templates.
Typography: "Inter Tight" / "Inter", tabular-nums throughout premium/limit/deductible figures.

## SECTIONS
### 1. Hero — Submission-to-Bind Workflow, Visualized — a real, concrete workflow diagram/demo showing the actual multi-step process (Submission intake → Risk data extraction → Multi-carrier quote comparison → Bind) with realistic time-savings framing ("Reduce quote turnaround from {{OLD_TIMEFRAME}} to {{NEW_TIMEFRAME}}") sourced from real data, not an isolated efficiency percentage.
### 2. Submission Intake — a real demo of document upload (loss runs, applications) with automatic data extraction into structured fields, showing a "please verify" step for extracted data rather than claiming fully-automatic, unverified accuracy — appropriately calibrated trust for a high-stakes financial workflow, similar reasoning to the legal-tech template's human-in-the-loop framing.
### 3. Multi-Carrier Quote Comparison — a real, dense comparison table (multiple carriers' quotes side by side: premium, limits, deductible, key exclusions) since this side-by-side comparison, done well, is the actual differentiating workflow value for a broker managing a complex placement.
### 4. Risk Data & Analytics — for underwriters specifically: a risk-scoring view combining submitted data with external data sources ({{DATA_SOURCE_1..3}}, e.g. property/catastrophe data, industry loss trends) shown with the specific factors driving a risk score, not an opaque single number.
### 5. Compliance & Audit Trail — a full audit log of every quote/decision/data-change in the workflow, since regulated insurance transactions require this kind of traceability, and it's a genuine differentiator over ad hoc email/spreadsheet-based processes.
### 6. Carrier & Broker Network — real integration/participation numbers if {{NETWORK_DATA}} available (number of participating carriers) since network breadth is a genuine, checkable value driver in a multi-sided platform like this.
### 7. Request a Demo — this category sells via sales-assisted demo to brokerages/MGAs, with qualifying fields (submission volume, current process) similar in spirit to the CRM and cybersecurity templates' demo-request reasoning.

## STATES, ACCESSIBILITY, PERFORMANCE
Extracted submission data always shows a clear "extracted — please verify" state distinct from confirmed/verified data, given the financial stakes of an unverified extraction error propagating into a bound policy. Multi-carrier comparison table remains usable with many columns via horizontal scroll with a frozen risk/coverage-type row label column, matching the CRE-listings and logistics templates' dense-table responsive reasoning. Audit trail entries are timestamped and attributed to a specific user/system action, never anonymous or ambiguous.

## STRICT RULES
Never present automatically-extracted submission data as verified/final without an explicit human-confirmation step shown in the workflow. Never fabricate network/carrier-participation numbers. The audit trail must be complete and tamper-evident in how it's represented — this is a real compliance requirement for this category, not a nice-to-have feature.
```

---

