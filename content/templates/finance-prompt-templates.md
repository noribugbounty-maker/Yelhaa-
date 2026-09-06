# Finance Prompt Templates — 5 Art Directions

> **Usage:** Each template is a complete, production-grade prompt for a finance-sector site (wealth management, fintech app, trading platform, neobank, insurance). Variables in `{{DOUBLE_BRACES}}` are injected by the AI layer from the user's input. Everything else is fixed craft specification.

**Variable reference (shared across all templates):**

| Variable | Example value |
|---|---|
| `{{BRAND_NAME}}` | Araise, Vault, Meridian Capital |
| `{{VERTICAL}}` | wealth management, neobank, trading platform |
| `{{HERO_HEADLINE}}` | Grow Your Wealth With Confidence |
| `{{VALUE_PROP}}` | one-sentence promise |
| `{{PRIMARY_CTA}}` | Open an account / Book a consultation |
| `{{SECONDARY_CTA}}` | Learn more |
| `{{SERVICE_1..6}}` | Strategic planning, Risk management… |
| `{{PROOF_STAT_1..4}}` | {value, label, qualifier} |
| `{{PRICING_TIERS}}` | array of {name, price, period, features[]} |
| `{{HERO_ASSET}}` | /hero.mp4 or /hero.webp |
| `{{SCREEN_1..4}}` | product/app screenshots |
| `{{ACCENT_HEX}}` | brand colour, overrides template accent |
| `{{CONTACT_EMAIL}}` | hello@brand.com |
| `{{REGULATOR}}` | FCA, AMF, SEC, BaFin… |
| `{{ENTITY_LEGAL}}` | full registered entity name and number |

> Full variable contract, including the shared core schema and per-domain extensions: see `prompt-variable-schema.md`.

---

## ASSET GATING — applies to every template below

No template may require an asset the user has not supplied. Every asset-dependent section has two paths; the AI layer picks one **before** emitting the prompt.

| Asset supplied | Path |
|---|---|
| Nothing but a logo | **Standard** — sections built from CSS, SVG and typography. Always works. |
| 1–2 screenshots | **Enhanced** — device frames, single-screen showcases. |
| 3+ screenshots | **Sequence** — pinned multi-screen walkthroughs, tabbed product tours. |
| A video | **Video** — hero footage or blended motion element. |

**Rules for the generating layer:**

1. Count assets before selecting the template body. Emit only the supported path.
2. Never emit a section referencing an empty asset slot. Delete the section entirely.
3. The standard path must always produce a complete, finished-looking page.
4. Sections marked `[REQUIRES: …]` are droppable or swappable; unmarked sections are mandatory.
5. **Strip every `[REQUIRES: …]` marker and every unselected path from the final prompt.** The emitted prompt must read as a single unambiguous specification — if the word "path" or "fallback" survives, the generating model builds both and the page breaks.

---

## COMPLIANCE BASELINE — mandatory in all five templates

Finance is a regulated vertical. These rules are not stylistic and are never dropped, regardless of art direction or user input:

- **No performance figure without its basis.** Every return, yield or growth number carries its period, its source and a past-performance disclaimer adjacent to it — not in the footer.
- **No fabricated numbers, ever.** If `{{PROOF_STAT_*}}` is absent, the section renders its qualitative variant. The generating layer must never invent AUM, client counts, returns or ratings.
- **Risk disclosure is visible, not buried.** A capital-at-risk statement appears in the hero region and again adjacent to any figure, at a legible size (minimum 13px, minimum 4.5:1 contrast). Never 9px grey in the footer.
- **Regulatory identity in the footer.** `{{ENTITY_LEGAL}}` and `{{REGULATOR}}` registration, rendered as real text. If absent from input, render the labelled placeholder row rather than omitting it — an omitted disclosure is worse than a visible gap.
- **No urgency mechanics.** No countdowns, no "3 spots left", no scarcity theatre on financial products.
- **Cost transparency.** Where fees exist, the fee is stated at the same visual weight as the headline benefit.
- **Illustrative charts are labelled illustrative** in visible text adjacent to the chart, never only in an alt attribute.

---

## TEMPLATE 01 — Dark Gold Private Wealth

> **Risque résiduel connu (ne pas « corriger » ici sans décision dédiée).**
> Le corps contient la phrase prose `verify any injected {{ACCENT_HEX}}`
> (accessibilité, pas une déclaration CSS). `prepareTemplateBody` retire le
> token ; si un modèle recopie la phrase source verbatim, `validateOutput`
> la rejette déjà (`placeholder`). Régression : `scripts/test-generate-mock.mjs`
> §16. Prochaine session qui touche ce fichier : ce cas est volontairement
> laissé visible.

```
You are an award-winning elite designer and expert web developer. Build a premium landing page for "{{BRAND_NAME}}", a {{VERTICAL}}. Art direction: dark gold private wealth — true black canvas, metallic accent, restrained luxury, discretion as the selling signal. Production-ready, 100% responsive.

## TECH STACK
- Framework: React 18+ via Vite (or Next.js 15 App Router if routing is needed)
- Styling: Tailwind CSS
- Icons: lucide-react — generic icons only (Globe, MessageCircle, Camera). Never brand icons like Twitter or LinkedIn; those imports crash on version drift.
- Language: TypeScript strict

## DESIGN SYSTEM
Colors:
  Body background: #000000 — true black, set on <body>
  Surface: #0A0A0A
  Surface raised: #141414
  Border: #1F2937 (gray-800)
  Accent: {{ACCENT_HEX}} (fallback #DBA85A — metallic gold); hover #C99849
  Text primary: #FFFFFF
  Text secondary: #9CA3AF (gray-400)
  Selection: selection:bg-[accent] selection:text-black
Typography:
  Family: 'Inter', system-ui, sans-serif
  Eyebrow: text-sm font-semibold tracking-[0.2em] uppercase text-[accent]
  H1: text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-white
  H2/H3: text-4xl lg:text-5xl font-bold text-white mb-6
  H4 (cards): text-xl font-bold text-white mb-4
  Body: text-gray-400 text-lg leading-relaxed; cards text-sm
  Nav: text-sm font-medium
  Numerals: tabular-nums on every figure that can change
Layout:
  Container max-w-7xl mx-auto px-6
  Section padding py-24; hero pt-32 pb-20 lg:pt-48 lg:pb-32
  Grids: grid-cols-1 → md:grid-cols-2 → lg:grid-cols-3 or 4
Radius: rounded-3xl on cards, rounded-md on buttons, rounded-xl on inputs.

## SECTIONS

### 1. Navbar
- absolute top-0 left-0 right-0 z-50.
- Brand: an SVG mark of three vertical accent bars at ascending heights (h-4, h-6, h-8) beside "{{BRAND_NAME}}" in text-xl font-bold tracking-tight.
- Center links; the active link carries an absolute h-0.5 w-full bg-[accent] -bottom-2. Others text-gray-400 hover:text-white transition-colors.
- Right: "{{PRIMARY_CTA}}" — bg-[accent] text-black px-6 py-2.5 rounded-md font-semibold text-sm. Hidden below lg.
- Mobile: a Menu icon opening a full-screen #000 overlay, links at text-3xl, body scroll locked, Escape closes, focus trapped, focus returned to the trigger.

### 2. Hero
- Two columns (lg:grid-cols-2), stacked below lg.
- Background: an absolute bg-[accent]/10 blur-[120px] rounded-full glow behind the content, pointer-events-none.
- Left: eyebrow, H1 "{{HERO_HEADLINE}}", {{VALUE_PROP}} paragraph, then two buttons — "{{PRIMARY_CTA}}" solid accent with an ArrowRight icon, and "{{SECONDARY_CTA}}" transparent with a 1px accent border.
- Directly beneath the buttons, in text-sm text-gray-400 (not smaller): the capital-at-risk line. This is above the fold and never collapsed.

- Right, VIDEO PATH [REQUIRES: video]:
    Container relative w-full max-w-[440px] aspect-square lg:aspect-[4/3] mix-blend-screen.
    <video autoPlay loop muted playsInline preload="metadata" poster={...} className="w-full h-full object-contain" src={{HERO_ASSET}} />
    mix-blend-screen over the true-black body makes the video's black background fully transparent. This only works if the body is genuinely #000 — verify before relying on it.
    If autoplay is blocked, the poster carries the column. The layout must be complete without motion.

- Right, STANDARD PATH [REQUIRES: none]:
    A rounded-3xl bg-[#0A0A0A] border border-gray-800 card containing a compact illustrative portfolio panel built in pure SVG and CSS: an allocation donut in accent tints, four allocation rows with tabular-nums percentages, and a small sparkline drawing in via stroke-dashoffset on mount.
    A visible text-xs text-gray-400 line beneath reads that the figures are illustrative.
    This is the intended design when no video exists — build it with full care, not as a placeholder.

### 3. Capability Row
- Sits below the hero, overlapping the fold with a negative top margin.
- Container bg-[#141414] border border-gray-800 rounded-3xl p-8.
- Grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8. Four items from {{SERVICE_1}}–{{SERVICE_4}} with lucide icons (BarChart3, ShieldCheck, PieChart, User).
- Group hover: icon scale-110, title turns accent, transition-all duration-300. The same states fire on group focus-within.

### 4. About
- lg:grid-cols-2 gap-16.
- Left: a bg-[#0A0A0A] card with three proof rows, each with a rounded bg-[#141414] icon wrapper. Behind the card, a rotated bg-gradient-to-tr from-[accent]/20 to-transparent blur-lg, pointer-events-none.
- Right: eyebrow "About", H2, two paragraphs, and a transparent accent-bordered CTA.
- If {{PROOF_STAT_*}} exists, each row shows the figure in tabular-nums with its qualifier (period and basis) in text-xs text-gray-400 directly beneath. If it does not exist, the rows are qualitative statements only — never a number without its basis, never an invented number.

### 5. Services
- Background #050505. Grid md:grid-cols-2 lg:grid-cols-3 gap-8.
- Cards bg-[#0A0A0A] border border-gray-800 rounded-3xl p-8.
- Hover: border-[accent]/50; an absolute top-right bg-[accent]/5 blur-3xl rounded-full glow rising to opacity-10; the accent icon scales and translates y -1; the "Learn more" arrow translates x 2. All transition-all duration-300, all mirrored on focus-within.
- Services {{SERVICE_1}} … {{SERVICE_6}}.

### 6. Pricing / Fees
- Three columns from {{PRICING_TIERS}}.
- Standard tiers: dark cards, price in text-4xl font-bold tabular-nums with the period in text-gray-400.
- Highlighted tier: bg-[#141414] border-2 border-[accent] -translate-y-4 shadow-2xl shadow-[accent]/10 with an absolute "Most Popular" badge, and a solid accent button.
- Feature lists use the Check icon in accent.
- Beneath the grid, a fee-transparency line at text-sm (not smaller) stating what is and is not included. If the input has no fee data, render the row with an explicit "Fee schedule available on request" rather than omitting it.

### 7. Contact
- lg:grid-cols-2.
- Left: bg-[#0A0A0A] card with {{CONTACT_EMAIL}}, phone and location, each icon inside a bg-[#141414] circle.
- Right: a form with inputs and a textarea — bg-[#141414] border border-gray-800 rounded-xl px-4 py-3 text-white, focus:border-[accent] focus:ring-1 focus:ring-[accent] outline-none.
- Labels sit above fields, never as placeholders. A consent checkbox for data processing is required and unchecked by default; the submit button is disabled until it is ticked.

### 8. Footer
- Four-column top grid plus a border-t bottom strip.
- Columns: brand and mission, company links, resources, newsletter (input plus a solid accent Subscribe button).
- Social links use generic lucide icons (Globe, MessageCircle, Camera) in circular hover wrappers.
- Bottom strip carries {{ENTITY_LEGAL}}, the {{REGULATOR}} registration line and the full risk statement at text-sm text-gray-400 — legible, never 9px, never below 4.5:1.

## STATES & EDGE CASES (mandatory)
- Missing proof data: qualitative variants render. Nothing is invented, no empty stat cards remain.
- Loading: bg-[#141414] skeleton blocks at exact final dimensions with a 1.4s shimmer. Zero shift on resolve.
- Empty: a bordered card, an accent icon, one explanatory line, one CTA.
- Error: a bg-[#0A0A0A] card with a 2px left border in a red derived from the accent hue, plain-language copy, a retry button. Never expose error codes.
- Forms: inline validation on blur, aria-describedby wiring, aria-live="polite" for errors, submit disabled with "Sending…" while pending, success replaces the form. Never a browser alert.
- Newsletter: double opt-in language ("we'll send a confirmation link"). No pre-ticked marketing consent anywhere.
- Video: if it fails or autoplay is blocked, the poster carries the column.
- 404 and 500 pages matching the system, with navigation intact.

## PERFORMANCE
- Video ≤ 1080p, ≤ 3 MB, preload="metadata", poster mandatory, paused via IntersectionObserver when off-screen.
- Inter loaded as a single variable file with display swap and size-adjust.
- Blur glows are expensive: cap them at one per section, always pointer-events-none, never animated.
- Images lazy below the fold with explicit width and height.
- prefers-reduced-motion: remove all hover scale and translate, pause the video and show the poster, keep colour transitions only.
- Target LCP < 2.0s, CLS < 0.04, INP < 200ms.

## ACCESSIBILITY
- Gold on black: #DBA85A on #000 clears AA for body text — verify any injected {{ACCENT_HEX}} and darken the surface rather than lightening the text if it fails.
- text-gray-400 on #000 is the floor; never go lighter-on-darker than that for body copy.
- Semantic <nav>, <main>, <section aria-label>, <footer>.
- Focus visible on every interactive element: 2px accent outline, offset 2px. Never outline-none without a replacement.
- Every hover-driven state also fires on focus-within.
- Risk and fee disclosures are real text, never images of text, and are inside the reading order — not visually reordered away from the figures they qualify.

## STRICT RULES
- No `any`. Strict TypeScript.
- Component structure: App.tsx plus components/Navbar, Hero, Features, About, Services, Pricing, Contact, Footer.
- No brand icons from lucide-react — generic equivalents only.
- Gold is an accent. It never becomes a background fill larger than a button or a badge.
- Every figure carries its basis. An unqualified performance number is an automatic fail.
- Fully responsive at 375px, not merely stacked.
```

---

## TEMPLATE 02 — Institutional Swiss Light

```
You are an award-winning elite designer and expert web developer. Build a landing page for "{{BRAND_NAME}}", a {{VERTICAL}}. Art direction: institutional Swiss light — white ground, navy authority, hairline structure, data presented plainly. Reads as a decade-old category leader, not a startup. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: Tailwind CSS v4 (@theme in globals.css, no tailwind.config.ts)
- Animation: Framer Motion (subtle only), CSS transitions
- Charts: Recharts, imported dynamically (next/dynamic, ssr false)
- Icons: lucide-react, strokeWidth 1.75 — generic icons only
- Language: TypeScript strict

## DESIGN SYSTEM
Colors:
  --bg: #FFFFFF
  --bg-2: #F7F8FA
  --navy: #0B2545
  --navy-2: #13315C
  --fg: #101418
  --muted: #5B6672
  --line: #E3E7EC
  --positive: #17795E
  --negative: #B42318
  --accent: {{ACCENT_HEX}} (fallback --navy)
Typography:
  Single family: "Inter" variable — weights 400/500/600/700
  H1 clamp(2.5rem, 5vw, 4.25rem), weight 700, tracking -0.025em
  H2 clamp(1.75rem, 3vw, 2.75rem) / body 16px / small 14px
  Labels: weight 500, uppercase, tracking 0.16em, 11px, --muted
  font-variant-numeric: tabular-nums on every changeable number
Radius: 6px cards and buttons, 4px inputs. Nothing rounder.
Elevation: 1px --line borders. Shadow only 0 1px 2px rgba(16,20,24,0.05) — structure comes from rules, not blur.

## SECTIONS

### 1. Shell
- A 32px utility bar above the nav: bg --navy, white 12px — an announcement left, locale selector and "Sign in" right. Dismissible, persisted in localStorage.
- Sections separated by 1px --line, alternating --bg and --bg-2.

### 2. Navbar
- Sticky, bg --bg, border-bottom 1px --line, height 68px.
- Left: the logo mark at 28px. Center: nav items, two of which open mega-menus — a full-width --bg panel with a 1px --line bottom edge, containing 3–4 columns of grouped links with icons and one-line descriptions. Opens on hover with a 120ms in / 220ms out delay, and on click or Enter for keyboard. Escape closes and returns focus to the trigger. Closes on outside click and on route change.
- Right: "{{SECONDARY_CTA}}" ghost plus "{{PRIMARY_CTA}}" filled --navy.
- Mobile: a full-screen panel with collapsible accordion groups mirroring the mega-menu.

### 3. Hero
- Two columns (6/6). Left: an eyebrow pill on --bg-2 with a 1px --line showing a regulatory or authorisation signal; H1 "{{HERO_HEADLINE}}"; {{VALUE_PROP}} at 17px --muted, max-w-lg; a CTA row; then the capital-at-risk line at 14px --muted directly beneath — above the fold, never collapsed.

- Right, SEQUENCE PATH [REQUIRES: 1+ screenshot]:
    {{SCREEN_1}} inside a 1px --line frame with 6px radius and the standard shadow, entering opacity 0 → 1, y 16 → 0, 500ms. Nothing more — restraint is the signal.

- Right, STANDARD PATH [REQUIRES: none]:
    A --bg-2 panel with a 1px --line border containing a Recharts area chart of an illustrative portfolio curve: --navy stroke, a soft --navy/8 fill, a --line grid, tabular-nums axis labels.
    The series is generated client-side from a fixed seed so it renders identically on every load.
    A visible 13px --muted caption directly beneath the chart states that it is illustrative and not a performance record. This caption is mandatory and never styled smaller than 13px.

- Below the hero: a static logo bar at 55% grayscale opacity. No marquee — motion here reads as small-company.

### 4. Metrics Band
- bg --navy, white text. Four metrics separated by 1px white/15 vertical rules.
- Values at clamp(2rem,3.5vw,3rem) weight 700 tabular-nums, CountUp on entry (1.4s ease-out).
- Each metric's label sits at 13px white/70, and its qualifier — as-of date and basis — at 12px white/60 directly beneath. A metric without a qualifier is not rendered.
- If {{PROOF_STAT_*}} is absent, the band is replaced by a four-column capability summary with no numerals at all. Never invent a figure to fill the shape.

### 5. Product Tabs
- A horizontal tab bar with a 1px --line bottom; the active tab carries a 2px --navy underline animated via Framer Motion layoutId.
- Each panel: two columns — left a feature list with Check icons and short descriptions, right a Recharts visualisation or {{SCREEN_2}}.
- Charts: --navy series, --line grid, tabular-nums axis labels, tooltips in a --bg card with a 1px --line. All data client-generated and labelled illustrative in visible text.
- Panels crossfade (opacity plus y 8, 240ms). Keyboard: role="tablist"/"tab"/"tabpanel", roving tabindex, arrow keys move, aria-selected maintained.

### 6. Solutions Grid
- Three columns, cards bg --bg with 1px --line and 6px radius.
- Each: an icon in a --bg-2 rounded square, a title, a two-line description, a "Learn more →" link.
- Hover: border → --navy at 35%, shadow to 0 4px 12px rgba(16,20,24,0.07), 200ms. No lift, no scale.
- Services {{SERVICE_1}} … {{SERVICE_6}}.

### 7. Security & Regulation
- bg --bg-2. Left: an H2 and three short assurances. Right: a grid of 1px --line bordered tiles for certifications and registrations (SOC 2, ISO 27001, deposit protection scheme, {{REGULATOR}} authorisation).
- One subtle animation only: a Shield icon whose check path draws in via stroke-dashoffset on viewport entry.
- Deposit or investor protection limits are stated with their real cap and scope. If the input lacks them, render the labelled row with "Scheme details on request" rather than omitting it.

### 8. Pricing / Fees
- Three tiers plus an Enterprise column showing "Custom" instead of a price.
- Cards 1px --line, 6px radius. Recommended tier gets a 2px --navy border and a --navy tag — no scale, no glow.
- Below, a full fee comparison table: sticky header row, 1px --line grid, Check and Minus icons, alternating --bg-2 rows, all figures tabular-nums. Horizontally scrollable below md with the first column pinned (position: sticky; left: 0).
- Any fee expressed as a percentage also shows a worked example in currency. Percentage-only fee disclosure is an automatic fail.

### 9. Resources / Insights
- Editorial rows: category label, title, date, arrow. 1px --line between rows.
- Hover: background → --bg-2, arrow translates x 8, title → --navy.

### 10. CTA + Footer
- CTA: bg --navy, white text, a centered H2, a white filled button and a ghost white-bordered secondary.
- Footer: bg --bg-2, 1px --line top, five columns (product, solutions, resources, company, legal), locale selector, {{CONTACT_EMAIL}}.
- A dedicated regulatory block above the bottom bar: {{ENTITY_LEGAL}}, {{REGULATOR}} registration number, registered address, and the full risk statement — 14px --muted, never smaller, never below 4.5:1.

## STATES & EDGE CASES (mandatory)
- Loading: --bg-2 skeleton bars at exact final dimensions with a 1.4s shimmer. Zero shift on resolve.
- Empty: a --bg-2 panel with a 1px --line, an icon, one explanatory line, one primary action.
- Chart with no data: render the axes plus a centered --muted "No data for this period". Never a collapsed empty box.
- Error: a --bg card with a 1px --negative border, a --negative icon, plain-language copy, a "Try again" secondary button. Log codes, never display them.
- Forms: labels above fields, 1px --line inputs, a 2px --navy focus ring, validation on blur, aria-describedby, aria-live="polite", submit disabled with a spinner and "Submitting…". A separate unticked consent checkbox for data processing, and a separate one for marketing — never combined into a single consent.
- Mega-menu: closes on Escape, outside click and route change.
- 404 and 500 matching the system, with search and primary navigation available.

## PERFORMANCE
- Inter variable, single file, display swap, size-adjust.
- Recharts dynamically imported so it never blocks the initial bundle.
- next/image with sizes and explicit aspect ratios everywhere.
- Tables virtualised only above 100 rows; otherwise plain semantic markup.
- prefers-reduced-motion: render CountUp finals instantly, replace layoutId sliding with an instant switch, keep opacity transitions under 200ms.
- Target LCP < 1.8s, CLS < 0.03, INP < 180ms.

## ACCESSIBILITY
- WCAG 2.1 AA minimum throughout; buyers in this vertical routinely request a VPAT.
- Semantic tables with <caption>, <thead>, and scope on <th>.
- Mega-menu: aria-expanded, aria-controls, full keyboard operability, focus returned on close.
- Tabs: correct roles, roving tabindex, aria-selected.
- Every chart has an accessible text summary adjacent or visually hidden — a chart is never the sole carrier of a figure.
- Focus rings 2px --navy, offset 2px, on every interactive element.
- Disclosures sit adjacent to what they qualify in the DOM order, not visually reordered away from it.

## STRICT RULES
- No `any`. Strict TypeScript.
- One font family. Weight and size carry the entire hierarchy.
- Motion budget: nothing exceeds 320ms, nothing bounces, nothing scales on hover.
- Every changeable number uses tabular-nums. No width jitter, ever.
- Percentage fees always carry a worked currency example.
- Fully responsive at 375px, including the fee table (pinned first column, horizontal scroll).
```

---

## TEMPLATE 03 — Neobank Soft UI

```
You are an award-winning elite designer and expert web developer. Build a landing page for "{{BRAND_NAME}}", a {{VERTICAL}}. Art direction: neobank soft UI — bright ground, rounded surfaces, card-and-phone product theatre, friendly confidence without infantilising. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: Tailwind CSS v4 (@theme)
- Animation: Framer Motion (spring-led, layout, drag)
- Icons: lucide-react, strokeWidth 1.75 — generic icons only
- Language: TypeScript strict

## DESIGN SYSTEM
Colors:
  --bg: #FBFBFD
  --surface: #FFFFFF
  --ink: #14161C
  --muted: #6C7280
  --line: #EAECF0
  --brand: {{ACCENT_HEX}} (fallback #4F46E5)
  --mint: #12B76A
  --amber: #F79009
  --rose: #F04438
Typography:
  Display: "Plus Jakarta Sans" weight 700, tracking -0.03em, leading 1.05
  Body: "Inter" weight 400/500, leading 1.6, 16.5px
  Numerals: tabular-nums everywhere
  Scale: h1 clamp(2.5rem, 6vw, 5rem) / h2 clamp(1.875rem, 4vw, 3.25rem)
Shape: radius 20px cards, 999px buttons and pills, 28px large surfaces.
Shadow: 0 1px 3px rgba(20,22,28,0.04), 0 12px 32px rgba(20,22,28,0.06) on floating product surfaces.

## SECTIONS

### 1. Shell
- --bg throughout; --surface for cards. Ambient: two --brand and --mint radial washes at 8% opacity, fixed, aria-hidden, pointer-events-none, drifting on 18s and 24s desynced ease-in-out loops.
- Rhythm py-20 mobile / py-32 desktop.

### 2. Navbar
- Floating rounded bar, top-4, max-w-6xl, bg --surface/85 backdrop-blur-lg, 1px --line, radius 999px, soft shadow.
- Left the logo, center links, right "{{SECONDARY_CTA}}" ghost plus "{{PRIMARY_CTA}}" filled --brand pill.
- Link hover: a --bg pill scales in behind (layoutId, spring stiffness 320 damping 30). Same on focus-within.
- Mobile: the pill morphs into an expanding rounded card (layout height auto), links stacked with 20px gaps, focus trapped, Escape closes.

### 3. Hero
- Two columns (6/6). Left: an eyebrow pill, h1 "{{HERO_HEADLINE}}", {{VALUE_PROP}} at 18px --muted, a CTA row, and a trust row of three small --surface pills with Check icons.
- Directly beneath the CTAs, at 14px --muted: the deposit-protection and licensing line. Above the fold, never collapsed. If {{BRAND_NAME}} is an e-money institution rather than a bank, the copy must say so explicitly — "e-money, not a bank deposit; funds are safeguarded, not protected by {{scheme}}". Never let a fintech imply deposit protection it does not have.

- Right, SEQUENCE PATH [REQUIRES: 2+ screenshots]:
    A phone frame (pure CSS: a 28px-radius --ink bezel with a --surface screen) containing {{SCREEN_1}}, plus a second smaller floating card showing {{SCREEN_2}} offset at -8% x and 12% y with a stronger shadow.
    Both enter with y 40 → 0, scale 0.96 → 1, spring (stiffness 170 damping 22), stagger 0.1. A gentle idle float (y ±6px, 5s ease-in-out infinite) on the smaller card only.

- Right, STANDARD PATH [REQUIRES: none]:
    The same CSS phone frame containing a fully built mock account screen — a balance figure in tabular-nums, a --brand gradient card, three transaction rows with merchant initials in coloured circles, amounts in --mint and --ink, and a small spending donut.
    The balance counts up once on entry; transaction rows stagger in.
    A visible 13px --muted line beneath the frame states that the screen is illustrative.
    This is the intended design when no screenshots exist — build it with full care.

### 4. Feature Bento
- Asymmetric bento: one large tile (col-span-2 row-span-2) plus four standard tiles, single column below md.
- Tiles bg --surface, 1px --line, radius 20px. Hover: y -4px, shadow deepens, 300ms cubic-bezier(0.34,1.56,0.64,1). Mirrored on focus-within.
- The large tile holds a live animated mini-UI relevant to {{VERTICAL}} — a balance updating, a category chart rebalancing — on a 3s interval, cleared on unmount.
- Features {{SERVICE_1}} … {{SERVICE_5}}.

### 5. How It Works
- Three steps in a row connected by a soft dashed --line curve (SVG path) drawing in on scroll via stroke-dashoffset.
- Each step: a numeral in a --bg circle, a title, one line of body.
- If the vertical involves an application, the step copy states what is actually required (ID, proof of address, credit check) and whether a credit check leaves a footprint. Vagueness here is a dark pattern.
- Below md: vertical with a vertical connector.

### 6. Rates & Fees
- A --surface panel with a 1px --line and radius 28px.
- Left: the headline rate or fee in display at clamp(2.5rem,5vw,4rem) tabular-nums, with its type (AER, APR, variable or fixed) at the same visual weight in the adjacent label — never smaller, never a superscript.
- Right: a representative example in a --bg block with a 1px --line: the borrowed or deposited amount, the term, the total cost or return, all tabular-nums. This block is mandatory wherever a rate appears.
- Beneath: a plain-language line on how and when the rate can change.
- If no rate data is supplied, this section is replaced by a qualitative "Transparent pricing" panel with no numerals. Never invent a rate.

### 7. Comparison
- A three-column comparison against alternatives: sticky header, 1px --line grid, Check and Minus icons, tabular-nums.
- Claims about competitors must be attributable and dated, or the column is generic ("typical high-street account") rather than named. Never an undated named comparison.
- Horizontally scrollable below md with the first column pinned.

### 8. Testimonials + Ratings
- Three --surface cards with 1px --line: a quote, an avatar, a name and role.
- An aggregate rating row shows the score, the source and the review count. If the source is absent, the rating is not rendered at all.

### 9. Pricing Tiers
- Three --surface cards from {{PRICING_TIERS}}, radius 20px. Recommended tier: bg --brand with inverted text and a --bg "Most popular" pill above.
- Monthly/annual toggle: a --bg track with a --brand thumb, spring (stiffness 400 damping 32). Price transitions via AnimatePresence with tabular-nums preventing width jitter.
- Any "free" tier states what is genuinely free and what triggers a charge, at body size.

### 10. FAQ + Footer
- FAQ: separate --surface cards with 12px gaps, height auto plus opacity 280ms, chevron rotating, one open at a time, aria-expanded maintained.
- Footer: --surface, four columns, --muted 14px, {{CONTACT_EMAIL}}, app store links if applicable.
- A regulatory block above the bottom bar: {{ENTITY_LEGAL}}, {{REGULATOR}} authorisation, the safeguarding or protection statement, and the risk line at 14px --muted.

## STATES & EDGE CASES (mandatory)
- E-money vs bank: if the entity is not a bank, no copy, icon or badge may imply deposit protection. The generating layer must not upgrade "safeguarded" to "protected".
- Missing rate data: the qualitative panel renders. No placeholder percentage, ever.
- Missing rating source: the rating is omitted entirely rather than shown unsourced.
- Loading: --bg blocks with a 1.4s shimmer at exact final dimensions.
- Empty: a --surface card, an icon, one line, one --brand pill CTA.
- Error: a --surface card with a 3px --rose left border, plain-language copy, a ghost "Try again". Never an error code.
- Forms: labels above fields, rounded inputs with 1px --line, a 2px --brand focus ring, validation on blur, aria-describedby, aria-live="polite", success replaces the form with a --bg confirmation card.
- Consent: data-processing and marketing consents are separate, both unticked, and the submit is disabled until the required one is ticked.
- Intervals in the live mini-UI cleared on unmount — no leaked timers.
- 404 and 500 in the same system.

## PERFORMANCE
- Two families maximum, both via next/font with display swap and size-adjust.
- Ambient washes are CSS-only, no canvas, no JS loop.
- next/image with sizes and aspect-ratio containers on every screenshot.
- Framer Motion: transform and opacity only.
- prefers-reduced-motion: freeze the ambient washes and the idle float, replace springs with a 200ms opacity fade, render CountUp finals instantly, keep hover lifts without overshoot easing.
- Target LCP < 1.9s, CLS < 0.04, INP < 190ms.

## ACCESSIBILITY
- --muted on --bg and white on --brand must both clear 4.5:1 — darken --brand for button surfaces rather than lightening the text.
- The mock account screen is decorative: aria-hidden, with every figure it shows also present in real text elsewhere.
- FAQ, tabs and toggles fully keyboard operable with visible 2px --brand focus rings, offset 2px.
- Rate type (AER, APR) is announced with the figure, not visually detached from it.
- Comparison table semantic with <caption> and scope attributes.

## STRICT RULES
- No `any`. Strict TypeScript.
- Friendly is not vague. Every benefit claim has its condition stated at body size.
- Rates never appear without their type and a representative example.
- No urgency mechanics, no countdowns, no scarcity language.
- Fully responsive at 375px, including the comparison table and the phone frame (which scales, never crops).
```

---

## TEMPLATE 04 — Trading Terminal Dark

```
You are an award-winning elite designer and expert web developer. Build a landing page for "{{BRAND_NAME}}", a {{VERTICAL}}. Art direction: trading terminal dark — dense instrument panel, monospace data, hairline structure, live market theatre. Technical credibility, never casino aesthetics. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: Tailwind CSS v4 (@theme)
- Animation: Framer Motion, GSAP ScrollTrigger for one pinned sequence only
- Charts: lightweight-charts or Recharts, dynamically imported
- Icons: lucide-react, strokeWidth 1.5 — generic icons only
- Language: TypeScript strict

## DESIGN SYSTEM
Colors:
  --bg: #07090C
  --bg-2: #0E1116
  --surface: #151A21
  --fg: #E4E8EE
  --muted: #6B7583
  --line: #1F262F
  --up: #22C55E
  --down: #EF4444
  --accent: {{ACCENT_HEX}} (fallback #3B82F6)
Typography:
  Display: "Archivo" weight 700, tracking -0.025em, leading 0.96
  Body: "Inter" weight 400, leading 1.55, 15px
  Data: "JetBrains Mono" weight 400/500, tabular-nums, 13px — all numerals, tickers, timestamps
  Labels: mono, uppercase, tracking 0.16em, 10.5px, --muted
  Scale: h1 clamp(2.5rem, 6vw, 5.25rem) / h2 clamp(1.875rem, 4vw, 3rem)
Radius: 4px. Structure from 1px --line hairlines only — no blurred shadows, no glows.

## SECTIONS

### 1. Shell
- A 30px status strip fixed at the top: bg --bg-2, 1px --line bottom. Left the brand mark; center a live UTC clock (a single shared 1s interval, cleared on unmount, recomputed from Date.now() rather than decremented); right a --up dot with "MARKETS OPEN" or a --muted dot with "CLOSED", derived from real session hours, not faked.
- A faint 48px technical grid overlay, --line at 25% opacity, fixed, aria-hidden, pointer-events-none.
- Sections separated by 1px --line, alternating --bg and --bg-2.

### 2. Navbar
- Sticky below the strip, height 58px, bg --bg/85 backdrop-blur-sm, 1px --line bottom.
- Left {{BRAND_NAME}} in Archivo 16px. Center: mono label-styled links. Right: a ghost "{{SECONDARY_CTA}}" and a filled --accent "{{PRIMARY_CTA}}".
- Link hover: --muted → --fg plus a 1px --accent underline, 160ms.
- Mobile: a full-screen --bg panel, links in mono at 19px with 1px --line dividers, focus trapped, Escape closes.

### 3. Hero
- Split 6/6. Left: a mono label, h1 "{{HERO_HEADLINE}}", {{VALUE_PROP}} at --muted, a CTA row.
- Directly beneath, in a --surface block with a 1px --line and 4px radius, at 14px (not smaller): the risk warning. For leveraged products this includes the loss-percentage disclosure with its source and date. This block is above the fold, inside the reading order, and never collapsed, never dismissible.

- Right, SEQUENCE PATH [REQUIRES: 1+ screenshot]:
    {{SCREEN_1}} inside a --surface frame with a 1px --line and a mono window-chrome bar (three 9px --muted squares, a title). Entering opacity 0 → 1, y 14 → 0, 460ms.

- Right, STANDARD PATH [REQUIRES: none]:
    A fully built mock terminal panel in the same frame: a left instrument list with tickers in mono and --up/--down deltas, a main candlestick or line chart rendered client-side from a fixed seed, a bottom order-book strip with mono bid/ask rows.
    Values update on a 2s interval to feel live, cleared on unmount.
    A visible mono 12px --muted line beneath reads "ILLUSTRATIVE — NOT LIVE MARKET DATA". This label is mandatory and never removed, and never styled below 12px.
    This is the intended design when no screenshots exist.

### 4. Instrument Strip
- A full-width band, bg --bg-2, 1px --line top and bottom, 40px tall.
- An auto-scrolling row of instruments: ticker in mono, price tabular-nums, delta in --up or --down with an arrow glyph.
- If the data is simulated, the strip carries a persistent mono "SIMULATED" tag at its left edge, always visible, never scrolled out.
- Colour is never the sole carrier of direction — an arrow glyph and a signed number accompany every delta.
- Paused on hover and on focus-within; the array is capped at 40 entries to avoid unbounded growth.

### 5. Platform Walkthrough (Pinned — the only pin in the page)
- GSAP pin for +=1200px. Progress maps to an activeIndex across four capabilities; guard the index update behind a ref so React re-renders only on change.
- Center: the relevant screen or mock panel. Left: the capability name in Archivo and its index ("02 / 04"). Right: two lines of body and a mono spec strip.
- Swap: crossfade with y 18 → 0 → -18, 600ms.
- Mobile: no pin — a vertical stack, or a horizontal scroll-snap rail.
- ScrollTrigger.refresh() after fonts load and on debounced resize; gsap.context revert on unmount.

### 6. Spec / Conditions Table
- A dense two-column table on --bg-2, 1px --line grid, rows py-3.
- Labels in mono --muted, values in mono --fg with tabular-nums and units: spreads, commission, margin requirements, overnight financing, minimum deposit, execution venue.
- Grouped into sections with mono headers on a --surface row.
- Every cost that varies states its range and the condition under which it varies. A single "from" figure without a ceiling is an automatic fail.
- Below md: label above value, still monospaced.

### 7. Risk & Protections
- bg --bg-2. Left: an H2 and three plain-language paragraphs on what can go wrong — not a legal wall, real explanation.
- Right: 1px --line tiles for {{REGULATOR}} authorisation, client-money segregation, negative-balance protection (state explicitly whether it applies and to whom), and any compensation scheme with its real cap.
- This section is mandatory and is never below the fold-equivalent position in the mobile order — it sits above pricing, not after it.

### 8. Pricing
- Three tiers as horizontal --surface rows with 1px --line rather than cards: name in Archivo left, headline cost center in mono tabular-nums, inclusions and CTA right.
- Every percentage or spread carries a worked example in currency.
- Hover: background → --surface, 1px --accent left border. No fills, no glows.

### 9. Reviews / Ratings
- If a rating exists, it renders with its source, date and sample size in mono. Without all three, it is omitted entirely.
- Three --surface review cards with 1px --line: a body quote, a mono date, a verified label.

### 10. Footer
- bg --bg, 1px --line top, five columns, mono 12px links, {{CONTACT_EMAIL}}.
- A dedicated regulatory block: {{ENTITY_LEGAL}}, {{REGULATOR}} registration, registered address, jurisdictional restrictions ("not available to residents of…"), and the full risk warning at 13px --muted — legible, never below 4.5:1, never collapsed behind a toggle.

## STATES & EDGE CASES (mandatory)
- Simulated data is always labelled as simulated, persistently and visibly. The label is not a tooltip, not alt text, and not removable by scroll.
- Real market data, if ever connected, requires its own attribution and delay disclosure ("delayed 15 minutes"). If the delay is unknown, the data is not rendered as live.
- Missing cost data: the row renders with "On request" rather than a placeholder figure. Never an invented spread.
- Missing rating source, date or sample size: the rating is omitted.
- Loading: --surface blocks with a 1px --accent sweep, 1.2s, at exact final dimensions.
- Chart with no data: axes plus a centered mono "NO DATA". Never a collapsed box.
- Error: a --surface card with a 1px --down left border, plain-language copy, a bordered retry. Log codes, never display them.
- Forms: --bg-2 inputs with 1px --line, a 2px --accent focus ring, validation on blur, aria-describedby, aria-live="polite". Separate unticked consents for data processing and marketing.
- All intervals cleared in useEffect cleanup.
- 404 and 500 as terminal-style notices with navigation intact.

## PERFORMANCE
- Chart library dynamically imported (ssr false) so it never blocks the initial bundle.
- The instrument strip and any live panel pause via IntersectionObserver off-screen and on visibilitychange.
- One pinned section only. gsap.context revert on unmount.
- Three families is the ceiling — next/font each, preload only above-fold weights.
- prefers-reduced-motion: stop the strip auto-scroll (make it manually scrollable), disable the pin and scrub, freeze simulated updates at their initial values, keep opacity transitions only.
- Target LCP < 2.0s, CLS < 0.03, INP < 180ms.

## ACCESSIBILITY
- --up and --down must be distinguishable without colour: always paired with an arrow glyph and a signed number.
- --accent and --fg on --bg verified ≥ 4.5:1 at body size; reserve --up/--down for data, never for body copy.
- The instrument strip is aria-live="off" (decorative and fast-updating); genuine status changes use a separate aria-live="polite" region.
- Charts have visually-hidden text summaries; a chart is never the sole carrier of a figure.
- Risk warnings are real text, inside the reading order, adjacent in the DOM to what they qualify.
- Focus rings 2px --accent, offset 2px, verified against --bg and --surface.
- Grid overlay aria-hidden, pointer-events-none.

## STRICT RULES
- No `any`. Strict TypeScript.
- Every numeral uses tabular-nums and the mono family. No width jitter.
- No casino signals: no confetti, no win animations, no green flashing on gains, no gamified progress toward deposits.
- No urgency, no countdowns, no bonus-style incentives.
- Every cost carries its variability and a worked example. Every figure carries its basis.
- Density is the aesthetic: fill space with real specification, not decorative padding.
- Fully responsive at 375px, including the spec table (pinned first column, horizontal scroll) and the terminal panel (horizontally scrollable, never squashed).
```

---

## TEMPLATE 05 — Advisory Editorial Warm

```
You are an award-winning elite designer and expert web developer. Build a landing page for "{{BRAND_NAME}}", a {{VERTICAL}}. Art direction: advisory editorial warm — paper ground, serif authority, human advisers foregrounded, plain-language guidance. Trust through clarity rather than through polish. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: Tailwind CSS v4 (@theme)
- Animation: Framer Motion (subtle), GSAP ScrollTrigger for one scroll-highlight only
- Smooth scroll: Lenis (lerp 0.06)
- Icons: lucide-react, strokeWidth 1.25 — generic icons only
- Language: TypeScript strict

## DESIGN SYSTEM
Colors:
  --paper: #FAF7F1
  --paper-2: #F0EBE0
  --ink: #211D18
  --ink-soft: #4A4238
  --muted: #857C6E
  --rule: #DED5C5
  --trust: #2F5D50
  --accent: {{ACCENT_HEX}} (fallback --trust)
Typography:
  Display: "Newsreader" or "Source Serif 4" weight 400–600, italic available, tracking -0.012em, leading 1.1
  Body: "Inter" weight 400, leading 1.75, 17px, measure max 66ch
  Labels: weight 500, uppercase, tracking 0.2em, 10.5px, --muted
  Numerals: tabular-nums
  Scale: h1 clamp(2.5rem, 6vw, 5rem) / h2 clamp(1.875rem, 3.75vw, 3rem)
Texture: a faint paper grain (SVG feTurbulence baseFrequency 0.75, opacity 0.04, mix-blend-multiply), fixed, aria-hidden.
Radius: 4px on surfaces, 999px on buttons. Hairline rules in --rule.

## SECTIONS

### 1. Shell
- Lenis provider. Sections separated by 1px --rule with generous rhythm: py-24 mobile / py-40 desktop.
- Body copy is genuinely readable: 17px, 1.75 line height, 66ch measure. This AD sells through comprehension.

### 2. Navbar
- bg --paper, 1px --rule bottom, height 74px, static until 200px scroll then fixed with a y -100% → 0 slide-in, 420ms.
- Left {{BRAND_NAME}} in display. Center: label-styled links. Right: "{{PRIMARY_CTA}}" pill in --trust with --paper text.
- Link hover: a --trust underline draws left-to-right, 300ms. Same on focus.
- Mobile: a --paper-2 overlay, links in display at clamp(2rem,9vw,3.25rem), focus trapped, Escape closes.

### 3. Hero
- Asymmetric: content in columns 1–7, an adviser portrait or illustration in 8–12.
- Left: a label, h1 "{{HERO_HEADLINE}}" with one word in display italic --trust, {{VALUE_PROP}} at 18px --muted, a CTA row, and a short "no obligation, no cost for the first conversation" line if true — only if true.
- Directly beneath, at 14px --muted: the capital-at-risk and advice-scope line. Above the fold, never collapsed. Where the service is guidance rather than regulated advice, that distinction is stated explicitly in this line — never blurred.

- Right, SEQUENCE PATH [REQUIRES: 1+ image]:
    {{SCREEN_1}} or an adviser portrait in a 1px --rule frame with a double-rule inset (a second 1px --rule at 6px offset), revealed with a GSAP clip-path inset(0 0 100% 0) → inset(0) over 1.05s. An italic --muted caption beneath.

- Right, STANDARD PATH [REQUIRES: none]:
    A --paper-2 panel with a 1px --rule containing a plain-language planning summary built in CSS and SVG: three life-stage rows with simple horizontal bars in --trust tints, a goal figure in tabular-nums, and a short italic caption.
    A visible 13px --muted line beneath states that the figures are illustrative.
    Build this with full care — it is the intended design when no imagery exists.

### 4. Approach
- Three or four steps in an editorial row, connected by a 1px --rule spine with --trust node dots that scale in as the spine draws (stroke-dashoffset on scroll).
- Each step: a numeral in display, a heading, two lines of body.
- The step copy states what actually happens, including what the client must provide and how long it takes. Vagueness here reads as evasion in this vertical.
- Below md: vertical spine, stacked steps.

### 5. Manifesto — Scroll Highlight (the only scrub in the page)
- A single statement at clamp(1.5rem,3.25vw,2.5rem) in display, --muted by default.
- GSAP ScrollTrigger scrub 0.85 with SplitType by word: each word shifts --muted → --ink as the scroll passes. Pinned for 140vh.
- prefers-reduced-motion: every word renders in --ink immediately, no pin.

### 6. Services
- A two-column list. Each service is a full-width row with a 1px --rule bottom and py-10: a display heading, a body paragraph, and a "What this costs" line stating the fee basis in plain language at body size.
- Hover: background → --paper-2, the arrow translates x 8. Mirrored on focus-within.
- Services {{SERVICE_1}} … {{SERVICE_6}}.

### 7. Advisers
- Three or four portrait cards on --paper-2 with a 1px --rule: a photo in a framed plate, a name in display, a role, qualifications, and a years-of-experience line.
- Qualifications are stated exactly as held. If the input lacks them, the field is omitted rather than generalised — never "certified expert" where a real designation is absent.

### 8. Fees
- A --paper panel with a 1px --rule and generous p-10.
- The fee structure as a definition list: 1px --rule rows, the basis in --ink-soft on the left and the figure in display tabular-nums on the right.
- A worked example in a --paper-2 block with a 1px --rule: a representative portfolio or case, the total annual cost in currency and in percentage, both tabular-nums.
- A plain-language paragraph on what is not included.
- If no fee data is supplied, the panel renders the structure with "Discussed at the first meeting, before any commitment" — never an invented figure, never silence.

### 9. Insights
- Editorial rows: category label, title in display, date, arrow. 1px --rule between rows.
- Hover: background → --paper-2, title → --trust, arrow translates x 8.

### 10. Contact + Footer
- Contact: a two-column block — left a short paragraph and {{CONTACT_EMAIL}}, phone and office address; right a form with transparent inputs using border-b 1px --rule only, labels above.
- The form asks only for what is genuinely needed. Each field states why it is needed if it is not obvious. A separate unticked consent for data processing and another for marketing; submit disabled until the required one is ticked.
- Footer: --paper-2, four columns, --muted 14px, and a regulatory block carrying {{ENTITY_LEGAL}}, {{REGULATOR}} registration, registered address, complaints procedure and ombudsman reference, and the full risk and scope statement at 14px --muted.

## STATES & EDGE CASES (mandatory)
- Advice vs guidance: if the service is not regulated advice, no copy, heading or CTA may imply that it is. The generating layer must not upgrade "guidance" to "advice".
- Missing qualifications: the field is omitted. Never generalised into an unearned credential.
- Missing fee data: the structural panel renders with the "discussed before commitment" line. No placeholder percentage.
- Missing performance data: the section renders qualitatively. No invented returns, ever.
- Loading: --paper-2 blocks at 45% opacity with a slow 2s pulse. No hard shimmer — it breaks the register.
- Empty: a --paper-2 card, an italic --muted line, one text CTA.
- Error: a --paper card with a 2px --trust left border, plain-language copy, a "Try again" text button.
- Image failure: the double-rule frame remains, filled --paper-2, with an italic --muted caption. Never a broken-image glyph.
- Forms: inline validation on blur, aria-describedby, aria-live="polite", success replaces the form with a --paper-2 confirmation card stating what happens next and when.
- 404 and 500 as quiet notices with navigation intact.

## PERFORMANCE
- Two families via next/font with size-adjust — serif swap shift is the main CLS risk here.
- Grain as an inline SVG data URI, not an image request.
- One scrub in the page. ScrollTrigger.refresh() after fonts load and on debounced resize; gsap.context revert on unmount.
- next/image with sizes and aspect-ratio containers on every portrait.
- prefers-reduced-motion: disable Lenis, disable the manifesto pin and scrub, disable the spine draw (render final state), keep static layout.
- Target LCP < 2.0s, CLS < 0.04.

## ACCESSIBILITY
- Body copy at 17px with a 1.75 line height and a 66ch measure is a hard requirement, not a suggestion — comprehension is the product here.
- --muted on --paper must clear 4.5:1; --paper on --trust must clear 4.5:1 for button text.
- Display serif at large sizes needs 3:1 minimum.
- Disclosures are real text, inside the reading order, adjacent in the DOM to what they qualify.
- Focus rings 2px --trust, offset 3px. Grain overlay aria-hidden, pointer-events-none.
- Forms: every field has a persistent visible label; error text is associated via aria-describedby, never colour-only.

## STRICT RULES
- No `any`. Strict TypeScript.
- Two families. The serif never appears at body size; body is always Inter.
- Motion is slow and soft: 600–1100ms, power3.out. One scrub, one pin, no more.
- Plain language throughout. If a sentence needs a finance degree to parse, it is rewritten.
- Every fee, every scope limit and every credential is stated exactly or omitted — never approximated upward.
- Fully responsive at 375px with the reading measure and rhythm preserved.
```

---

## Notes d'implémentation pour ta base de données

**Champs à stocker par prompt :**

| Champ | Exemple |
|---|---|
| `id` | `finance-01-dark-gold-wealth` |
| `category` | `finance` |
| `art_direction` | `Dark Gold Private Wealth` |
| `template` | le corps du prompt complet |
| `variables` | `["BRAND_NAME", "VERTICAL", "REGULATOR", "ENTITY_LEGAL", …]` |
| `compliance_blocks` | `["risk-warning", "regulatory-footer", "fee-example"]` |
| `sub_verticals` | `["wealth", "advisory"]` / `["neobank"]` / `["trading"]` |
| `stack_tags` | `["react", "vite", "tailwind", "lucide"]` |
| `complexity` | `medium` / `high` |
| `target_tools` | `["lovable", "v0", "bolt", "cursor", "claude-code"]` |

**Ce que ta couche IA doit gérer en plus, sur le domaine finance :**

0. **Le gating des assets** (identique aux autres domaines) — compte les assets, sélectionne un chemin, supprime les autres blocs **et leurs marqueurs**. Le prompt émis ne contient jamais le mot « path » ni « fallback ».

1. **Les blocs de conformité ne sont jamais supprimables.** Contrairement aux sections optionnelles, `risk-warning`, `regulatory-footer` et `fee-example` restent dans le prompt même quand l'input ne fournit pas les données — ils s'émettent alors avec leur variante « sur demande ». Un bloc absent est pire qu'un bloc visiblement incomplet.

2. **Détecter le sous-vertical avant de choisir le template.** Néobanque ≠ courtier ≠ conseiller. Chacun a des obligations différentes, et le Template 03 contient une règle spécifique que les autres n'ont pas : ne jamais laisser une fintech laisser croire qu'elle a une garantie des dépôts qu'elle n'a pas.

3. **Ne jamais inventer un chiffre financier.** C'est la règle la plus importante de tout le fichier. Rendement, encours, notation, spread, taux : si l'input ne le fournit pas, le template a une variante qualitative prévue. Un modèle génératif qui remplit un `{{PROOF_STAT}}` vide avec un chiffre plausible expose ton utilisateur à un vrai risque réglementaire.

4. **Ajoute un garde-fou côté produit.** Avant de renvoyer un prompt finance, fais passer l'output dans une vérification : si le texte contient un pourcentage, un montant ou une notation qui ne provient pas de l'input utilisateur, bloque et redemande. C'est cinq lignes de code et ça te protège autant que ça protège tes utilisateurs.

**Comme sur les autres sets :** aucun `{{PLACEHOLDER}}` non résolu, aucun marqueur `[REQUIRES: …]`, aucun chemin non retenu dans le prompt final.
