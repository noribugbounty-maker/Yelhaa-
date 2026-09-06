# SaaS Prompt Templates — 10 Art Directions

> **Usage:** Each template is a complete, production-grade prompt. Variables in `{{DOUBLE_BRACES}}` are injected by the AI layer from the user's input (brand name, sector, assets, tone). Everything else is fixed craft specification.

**Variable reference (shared across all templates):**

| Variable | Example value |
|---|---|
| `{{BRAND_NAME}}` | ACME, Northwind, Vela |
| `{{PRODUCT_CATEGORY}}` | project management SaaS |
| `{{VALUE_PROP}}` | Ship faster with fewer meetings |
| `{{HERO_HEADLINE}}` | Work Without The Noise |
| `{{PRIMARY_CTA}}` | Start free trial |
| `{{SECONDARY_CTA}}` | Book a demo |
| `{{FEATURE_1..6}}` | Real-time sync, Role-based access… |
| `{{LOGO_ASSET}}` | /logo.svg (user upload) |
| `{{HERO_ASSET}}` | /hero.webp or /hero.mp4 |
| `{{ACCENT_HEX}}` | user brand color, overrides template accent |
| `{{CONTACT_EMAIL}}` | hello@brand.com |
| `{{PRICING_TIERS}}` | array of {name, price, features[]} |

> Full variable contract, including the shared core schema and per-domain extensions: see `prompt-variable-schema.md`.

---

## ASSET GATING — applies to every template below

No template may require an asset the user has not supplied. Every asset-dependent section has two paths; the AI layer picks one **before** emitting the prompt.

| Asset supplied | Path |
|---|---|
| Nothing but a logo | **Standard** — sections built from CSS, SVG and live mock UI. Always works. |
| 1–2 screenshots | **Enhanced** — framed product surfaces, single-screen showcases. |
| 3+ screenshots | **Sequence** — pinned walkthroughs, tabbed tours, gallery tracks. |
| A video | **Video** — hero footage, knockout-text masks, cinematic scrubs. |

**Rules for the generating layer:**

1. Count assets before selecting the template body. Emit only the supported path.
2. Never emit a section referencing an empty asset slot. Delete the section entirely rather than leaving a placeholder or an empty frame.
3. The standard path must always produce a complete, finished-looking page. A user with no imagery at all gets a site that looks intentional, not degraded.
4. Sections marked `[REQUIRES: …]` are droppable or swappable; unmarked sections are mandatory.
5. **Strip every `[REQUIRES: …]` marker and every unselected path from the final prompt.** The emitted prompt must read as a single unambiguous specification — if the words "path" or "fallback" survive, the generating model builds both and the page breaks.

**Marker convention:**

```
[REQUIRES: video]            → drop or swap if no video supplied
[REQUIRES: 1+ screenshot]    → swap to the standard path
[REQUIRES: 3+ screenshots]   → collapse to the single-surface variant
[REQUIRES: 3D model]         → swap to the CSS/SVG alternative given inline
[REQUIRES: none]             → always build
```

**SaaS-specific note:** this domain has an advantage the others do not — a SaaS site can always build a **live mock UI in pure CSS and React state** (a dashboard, an inbox, a chart, a settings panel). That is the default standard path for every product-surface section below, and it often looks better than a screenshot. Never treat it as a fallback.

---

## TEMPLATE 01 — Swiss Brutalist Monochrome

```
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a {{PRODUCT_CATEGORY}} marketing site. Art direction: Swiss brutalist monochrome — raw grid discipline, oversized type as the only ornament, zero decorative imagery, uncompromising whitespace. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router), React Server Components where possible
- Styling: Tailwind CSS v4 with @theme in globals.css (no tailwind.config.ts)
- Animation: Framer Motion (layout + scroll), GSAP ScrollTrigger for pinned sequences
- Smooth scroll: Lenis (lerp 0.07, wheelMultiplier 1, syncTouch false)
- Type: SplitType for character-level reveals
- Icons: Lucide React, strokeWidth 1.25 only
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS vars in globals.css @theme):
  --bg: #FFFFFF
  --bg-alt: #F2F2F0
  --fg: #0B0B0B
  --muted: #7A7A78
  --line: #DEDEDA
  --accent: {{ACCENT_HEX}} (fallback #0B0B0B)
Typography:
  Display: "Neue Haas Grotesk Display" via Fontshare — font-weight 700, tracking -0.04em, leading 0.88
  Body: same family, weight 400, leading 1.5
  Labels: weight 500, uppercase, tracking 0.24em, size 11px
  Scale: h1 clamp(3.5rem, 11vw, 11rem) / h2 clamp(2.5rem, 6vw, 5.5rem) / body 17px
Grid: 12 columns, gutter 24px, max-width 1440px, side padding 24px mobile / 48px desktop
Rules: border-radius max 2px. No shadows. No gradients. Section separators are 1px --line rules only.

## SECTIONS

### 1. Shell
- Lenis provider wrapping app. Fixed 1px scroll-progress bar at viewport top in --accent, width driven by useScroll scrollYProgress.
- Every section separated by border-top: 1px solid var(--line).
- No page-level padding — sections own their vertical rhythm (py-24 mobile / py-40 desktop).

### 2. Navbar
- Fixed, full-bleed, height 64px, bg transparent → bg-[var(--bg)]/85 backdrop-blur-md after 40px scroll (transition 400ms cubic-bezier(0.16,1,0.3,1)).
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" at weight 700 tracking -0.02em.
- Center (lg+ only): nav links, label styling. Hover: 1px underline scales from scaleX(0) origin-left over 320ms.
- Right: "{{PRIMARY_CTA}}" — square button, bg --fg, text --bg, 40px height, px-6. Hover: bg --accent.
- Mobile: Menu icon → full-screen overlay, bg --fg, links at clamp(2.5rem,10vw,4rem) in --bg, staggered entrance (Framer Motion, delay index * 0.06, y 40 → 0, opacity 0 → 1). Lock body scroll while open. Esc closes.

### 3. Hero
- min-h-screen, flex column, justify-end, pb-24. Content aligned to grid columns 1–10.
- h1: "{{HERO_HEADLINE}}" — SplitType by character, GSAP entrance: y 110% → 0, stagger 0.018, duration 1.1, ease power4.out, clip-path inset(0 0 100% 0) → inset(0 0 0% 0). Fires on mount after fonts load (document.fonts.ready).
- Below h1: two-column row — left {{VALUE_PROP}} in body size across 4 cols, right an index label "(01) — {{PRODUCT_CATEGORY}}".
- No hero image. The typography IS the hero.
- Scroll cue: 1px vertical line, 48px tall, animating scaleY 0→1→0 origin alternating, infinite 2.4s.

### 4. Marquee Statement
- Full-bleed horizontal marquee, single row, text at clamp(3rem,8vw,7rem), weight 700, uppercase.
- Content: {{FEATURE_1}} — {{FEATURE_2}} — {{FEATURE_3}} — repeated to fill 2x viewport width, duplicated node for seamless loop.
- Pure CSS keyframe translateX(0 → -50%), duration 40s linear infinite. Pause on hover.
- Direction inverts on scroll direction change (useScroll velocity → animationDirection).

### 5. Features — Numbered Editorial List
- 12-col grid. Each feature is a full-width row: border-bottom 1px --line, py-12.
- Row layout: col 1 = index "01", cols 2–5 = feature title (h3, clamp(1.75rem,3vw,3rem)), cols 7–11 = description, col 12 = arrow icon.
- Hover (desktop): row bg → --bg-alt over 300ms, arrow translates x 8px, title color → --accent.
- Scroll reveal: each row y 32 → 0, opacity 0 → 1, Framer Motion whileInView, viewport {once: true, margin: "-15%"}, stagger via delay index * 0.05.
- Features: {{FEATURE_1}} through {{FEATURE_6}}.

### 6. Product Surface (Pinned)
- GSAP ScrollTrigger pin, 250vh scroll distance. The pinned viewport holds a 1px --line bordered frame that scales 0.86 → 1 and border-radius 2px → 0 across scrub 1.
- Three caption blocks crossfade in sequence (opacity + y 20), each tied to a scroll segment (0–0.33, 0.33–0.66, 0.66–1).

- Frame contents, STANDARD PATH [REQUIRES: none]:
    A live mock UI built entirely in CSS and React state, matching the Swiss grid: a 1px --line hairline table of rows with tabular-nums values, a monochrome bar row, and a label-styled header. Two values update on a 3s interval (cleared on unmount) so the surface reads as a working product, not a picture of one.
    In this art direction the mock reads better than a screenshot — it inherits the exact grid, type scale and hairlines of the page. Build it with full care.

- Frame contents, ENHANCED PATH [REQUIRES: 1+ screenshot]:
    {{HERO_ASSET}} inside the same frame, object-fit cover, with the aspect ratio reserved before load.
    Loading: the frame renders as a --bg-alt block with a 1px animated sweep line until onLoad fires.
    Error: the frame shows --bg-alt with a centered "ASSET UNAVAILABLE" label in --muted. Never a broken-image glyph.

### 7. Pricing
- Three columns, no cards — separated by 1px vertical --line rules only (border-l on 2nd and 3rd).
- Each tier from {{PRICING_TIERS}}: name (label style), price (clamp(3rem,5vw,4.5rem), weight 700, tabular-nums), feature list (body, each row py-2 with 1px top border).
- Monthly/annual toggle: two labels with a 1px underline sliding between them (Framer Motion layoutId).
- Price change animates: outgoing number y -20 opacity 0, incoming y 20 → 0 (AnimatePresence mode="popLayout").
- Recommended tier: bg --fg, all text inverted to --bg. No badge, no glow — the inversion is the emphasis.

### 8. CTA / Contact
- Full viewport height, bg --fg, text --bg.
- Centered "{{PRIMARY_CTA}}" at clamp(3rem,10vw,9rem), weight 700.
- Magnetic hover: on mousemove within 120px, gsap.to element x/y = (mouse - center) * 0.18, duration 0.6 power3.out. On leave, return with elastic.out(1, 0.4).
- {{CONTACT_EMAIL}} below in label styling with a 1px underline.

### 9. Footer
- bg --fg, text --bg. Four columns on desktop, stacked on mobile.
- Columns: brand + one-line description / product links / company links / legal.
- Bottom bar: 1px top border in --bg at 20% opacity, © line left, socials right.

## STATES & EDGE CASES (mandatory)
- Loading: every async surface renders a skeleton in --bg-alt with a subtle 1.4s shimmer sweep. Never a spinner.
- Empty: any list that can be empty renders a centered --muted label at body size with a single text CTA. Never blank space.
- Error: user-facing copy only, never a stack trace. Include a retry action that re-invokes the fetch.
- Form validation: inline, below field, --accent text at 13px. Errors announce via aria-live="polite". Submit disables and shows label "SENDING…" while pending.
- 404 and 500 pages must exist and match the design system exactly.

## PERFORMANCE
- next/font for all fonts, display: swap, preload the display weight only.
- All below-fold images next/image with sizes set, loading="lazy", explicit width/height to prevent CLS.
- Videos: autoPlay loop muted playsInline preload="metadata", poster frame required.
- will-change: transform only on actively animating elements; remove on animation complete.
- Respect prefers-reduced-motion: disable Lenis, disable all scroll-scrub, replace entrance animations with instant opacity.
- Target: LCP < 2.0s, CLS < 0.05, no layout shift from font swap (size-adjust in @font-face).

## ACCESSIBILITY
- Semantic landmarks: nav, main, section with aria-label, footer.
- Focus visible: 2px --accent outline, offset 2px, on every interactive element. Never outline: none without replacement.
- Full keyboard operability — anything driven by hover must also respond to focus.
- Contrast minimum 4.5:1 for body, 3:1 for large display type.
- All decorative overlays pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript. No non-null assertions.
- No generic startup template layouts. This must read as a design-led product, not a landing page builder output.
- Every animation eases with power4.out / cubic-bezier(0.16, 1, 0.3, 1). No linear, no ease-in-out defaults.
- Mobile-first: every section must be fully designed at 375px, not just stacked.
```

---

## TEMPLATE 02 — Aurora Glassmorphism

```
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a {{PRODUCT_CATEGORY}} product site. Art direction: aurora glassmorphism — deep space backdrop, drifting light fields, frosted translucent surfaces, cool luminous accents. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: Tailwind CSS v4 (@theme in globals.css)
- Animation: Framer Motion, CSS @keyframes for ambient loops
- 3D/Canvas: react-three-fiber + drei for the hero light field (fallback to CSS gradients if WebGL unavailable)
- Icons: Lucide React
- Language: TypeScript strict

## DESIGN SYSTEM
Colors:
  --bg: #05060B
  --surface: rgba(255,255,255,0.04)
  --surface-hover: rgba(255,255,255,0.07)
  --border: rgba(255,255,255,0.09)
  --fg: #F4F6FB
  --muted: #8A92A6
  --aurora-1: #6E56F8 (violet)
  --aurora-2: #2FD4C4 (teal)
  --aurora-3: #F857A6 (magenta)
  --accent: {{ACCENT_HEX}} (fallback --aurora-1)
Typography:
  Display: "General Sans" (Fontshare), weight 600, tracking -0.03em, leading 1.02
  Body: "Inter", weight 400, leading 1.65
  Mono (metrics/code): "JetBrains Mono", weight 400
  Scale: h1 clamp(3rem, 7.5vw, 6.5rem) / h2 clamp(2rem, 4.5vw, 3.75rem) / body 16.5px
Glass recipe (reuse everywhere): bg var(--surface), backdrop-filter blur(24px) saturate(1.4), border 1px var(--border), border-radius 20px, inset highlight via box-shadow: inset 0 1px 0 rgba(255,255,255,0.08)

## SECTIONS

### 1. Ambient Background (global, fixed, z-0)
- Three radial-gradient blobs in --aurora-1/2/3 at 380px blur, opacity 0.32.
- Each drifts on its own CSS keyframe loop (translate + scale, 24s / 31s / 38s, ease-in-out, infinite alternate) — deliberately desynced periods so the composite never visibly repeats.
- Grain overlay above: SVG feTurbulence baseFrequency 0.9, opacity 0.035, mix-blend-overlay, fixed, pointer-events-none.
- prefers-reduced-motion: freeze blobs at their initial positions.

### 2. Navbar
- Floating pill, centered, top-5, width calc(100% - 32px), max-w-6xl, z-50.
- Unscrolled: fully transparent. After 40px: glass recipe applied, transition 500ms.
- Left {{LOGO_ASSET}} 26px / center links / right "{{PRIMARY_CTA}}" pill with --accent → --aurora-2 linear gradient background, subtle white text.
- Link hover: text --muted → --fg, and a 3px glowing dot fades in beneath (box-shadow 0 0 8px currentColor).
- Mobile: pill expands vertically (Framer Motion height auto, layout) rather than opening a separate overlay — the nav itself becomes the menu.

### 3. Hero
- min-h-screen, centered, z-10 above ambient layer.
- Eyebrow label: glass pill, 12px, uppercase tracking 0.18em, with a pulsing --aurora-2 dot.
- h1 "{{HERO_HEADLINE}}": words animate in sequentially — filter blur(12px) → blur(0), opacity 0 → 1, y 24 → 0, stagger 0.08, duration 0.9, ease [0.16,1,0.3,1].
- One phrase inside h1 receives a linear-gradient(90deg, --aurora-1, --aurora-2, --aurora-3) with bg-clip-text and a slow 8s background-position shift.
- Sub: {{VALUE_PROP}}, max-w-xl, --muted.
- CTA row: primary gradient pill + secondary glass pill "{{SECONDARY_CTA}}".
- Below: a glass-framed product surface, entering with y 60 → 0, scale 0.96 → 1, rotateX 8deg → 0, perspective 1200px, delay 0.5.
    STANDARD PATH [REQUIRES: none]: the frame holds a live mock dashboard built in CSS and React state — a glass sidebar, three metric tiles with CountUp values, and a small area chart whose series regenerates on a 4s interval (cleared on unmount). The glass recipe applies to the mock's own surfaces, so it reads as one continuous material with the page.
    ENHANCED PATH [REQUIRES: 1+ screenshot]: {{HERO_ASSET}} inside the same glass frame, with the aspect ratio reserved before load and a glass skeleton until onLoad fires.

### 4. Logo Cloud
- Single row marquee, glass card container, logos at opacity 0.45 grayscale → opacity 1 color on hover, marquee pauses on hover.
- Gradient mask on both edges (mask-image: linear-gradient(90deg, transparent, black 12%, black 88%, transparent)).

### 5. Bento Feature Grid
- Asymmetric bento: 1 large tile (col-span-2 row-span-2) + 4 standard tiles, collapsing to single column below md.
- Every tile uses the glass recipe. On hover: bg → --surface-hover, border brightens, and a radial spotlight follows the cursor inside the tile (CSS var --mx/--my updated on mousemove, radial-gradient at 200px, --accent at 12% opacity).
- Large tile contains a live animated mini-UI relevant to {{PRODUCT_CATEGORY}} — not a static screenshot. Animate its internal state on a 3s interval.
- Tiles: {{FEATURE_1}} … {{FEATURE_5}}.
- Scroll reveal: stagger 0.07, y 28 → 0, whileInView once.

### 6. Metrics Strip
- Three or four numbers in mono font at clamp(2.5rem,5vw,4rem), gradient text.
- CountUp on viewport entry, duration 1.8s, ease-out, respecting reduced-motion (render final value instantly).
- Labels below in --muted at 13px uppercase tracking 0.14em.

### 7. Pricing
- Glass cards, three tiers from {{PRICING_TIERS}}.
- Recommended tier: 1px animated gradient border (conic-gradient rotating via @property --angle, 4s linear infinite) and slight scale 1.03.
- Monthly/annual toggle: glass track with a gradient thumb, Framer Motion spring (stiffness 400, damping 32).
- Feature rows: Check icon in --aurora-2 for included, X in --muted at 40% for excluded.

### 8. CTA
- Full-width glass panel, oversized headline, gradient CTA pill.
- Panel has an inner aurora glow that intensifies on hover (box-shadow spread transition 600ms).

### 9. Footer
- Glass top border only. Four columns, --muted text, {{CONTACT_EMAIL}}, socials as glass icon squares with hover glow.

## STATES & EDGE CASES (mandatory)
- WebGL unsupported or context lost: detect and fall back to the pure-CSS gradient ambient layer. Never render a black void.
- Loading: glass skeletons — same glass recipe, content replaced by --border-colored bars with a 1.6s shimmer sweep.
- Empty states: glass card, --muted icon at 32px, one-line explanation, single CTA.
- Errors: glass card with --aurora-3 left border 2px, human-readable message, retry button.
- Backdrop-filter unsupported: @supports fallback raising --surface opacity to 0.10 solid so text contrast is preserved.
- Forms: inline validation, aria-live="polite", disabled + "Sending…" state on submit, success state replaces the form rather than alerting.

## PERFORMANCE
- backdrop-filter is expensive: cap total simultaneously-visible glass surfaces, avoid nesting glass inside glass.
- r3f canvas: dpr={[1, 1.75]}, frameloop="demand" where possible, unmount canvas when hero is out of viewport.
- next/font, next/image with sizes, lazy below the fold.
- Reduced motion: freeze aurora, disable CountUp animation, disable parallax, keep opacity transitions only.
- Target LCP < 2.5s, CLS < 0.05, INP < 200ms.

## ACCESSIBILITY
- Glass surfaces must still meet 4.5:1 body contrast — verify against the darkest and lightest aurora positions, not just the base bg.
- Focus rings: 2px --aurora-2, offset 2px, always visible.
- All ambient layers aria-hidden and pointer-events-none.
- Gradient text must have a solid-color fallback for forced-colors mode.

## STRICT RULES
- No `any`. Strict TS.
- Glass must never become opaque grey — saturation is what sells it.
- No purple-gradient-startup cliché layouts: the bento asymmetry and the live mini-UI are what make this distinct.
- Fully designed at 375px, not merely stacked.
```

---

## TEMPLATE 03 — Terminal Cyberpunk

```
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a {{PRODUCT_CATEGORY}} platform site. Art direction: terminal cyberpunk — CRT phosphor, monospace discipline, live data theatre, high-signal density. Technical, never cartoonish. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: Tailwind CSS v4 (@theme)
- Animation: GSAP (ScrollTrigger, TextPlugin), Framer Motion
- Canvas: vanilla 2D canvas for the background field
- Icons: Lucide React, strokeWidth 1.5
- Language: TypeScript strict

## DESIGN SYSTEM
Colors:
  --bg: #07090A
  --surface: #0D1113
  --surface-2: #141A1D
  --line: #1E272B
  --fg: #D7E0E3
  --muted: #5C6B70
  --phosphor: #3BF0A8
  --alert: #FF4D4D
  --warn: #FFC145
  --accent: {{ACCENT_HEX}} (fallback --phosphor)
Typography:
  Primary: "IBM Plex Mono" — everything, all weights 400/500/600
  Display: same, weight 600, tracking -0.02em, uppercase for h1/h2
  Scale: h1 clamp(2.5rem, 6.5vw, 5.5rem) / h2 clamp(1.75rem, 3.5vw, 3rem) / body 15px / data 13px
Motion: all transitions 120–200ms — this UI is snappy, not silky. Easing: cubic-bezier(0.2, 0, 0, 1).

## SECTIONS

### 1. Shell
- Fixed scanline overlay: repeating-linear-gradient(0deg, transparent 0 2px, rgba(255,255,255,0.018) 2px 3px), pointer-events-none, z-[100].
- Subtle CRT vignette: radial-gradient at viewport edges, inset shadow.
- Status strip fixed at top, 28px, bg --surface, border-bottom 1px --line: left "SYS://{{BRAND_NAME}}", center live UTC clock updating every second, right a --phosphor pulsing dot + "OPERATIONAL".
- Custom cursor: 16px --phosphor crosshair, hidden on touch devices (@media (hover: none) restore default).

### 2. Navbar
- Sits below status strip, full-width, bg --bg/80 backdrop-blur-sm, border-bottom 1px --line.
- Left: "[{{BRAND_NAME}}]" with brackets in --phosphor.
- Center: links rendered as CLI flags — "--product", "--pricing", "--docs". Hover: text --phosphor and a blinking block cursor appears after the text.
- Right: "{{PRIMARY_CTA}}" as a square button, border 1px --phosphor, text --phosphor, bg transparent → --phosphor/10 on hover.
- Mobile: full-screen overlay styled as a terminal session — each link on its own line prefixed by "$ ".

### 3. Hero
- min-h-screen, left-aligned content in a max-w-4xl column, not centered.
- Canvas background: sparse falling character rain, --phosphor at 10% opacity, column speed randomized, 24 columns max, throttled to 24fps and paused when out of viewport.
- Boot sequence on mount: 4 lines of monospace text type in sequentially at 18ms/char using GSAP TextPlugin ("> initializing…", "> loading modules…", "> {{PRODUCT_CATEGORY}} ready", "> _"). Then h1 hard-cuts in — no fade, a single 60ms opacity step. The abruptness is intentional.
- h1: "{{HERO_HEADLINE}}" uppercase.
- Sub: {{VALUE_PROP}} in --muted.
- CTA row: primary --phosphor bordered button, secondary text link with a "→" that translates 4px on hover.

### 4. Live Feed Ticker
- Full-width strip, bg --surface, border-y 1px --line, height 40px.
- Auto-scrolling single-line feed of simulated events relevant to {{PRODUCT_CATEGORY}}, each with a timestamp, a severity tag (OK/WARN/ERR in --phosphor/--warn/--alert), and a short message.
- New entries push in from the right every 2–4s (randomized). Cap the array at 40 entries to avoid unbounded memory growth.

### 5. Console Preview
- Large --surface panel, border 1px --line, with a fake window chrome bar (three 10px squares in --muted, title "{{BRAND_NAME}} — console").
- Left: file-tree-style navigation. Right: main pane showing a realistic interface for {{PRODUCT_CATEGORY}} with live-updating values on a 2s interval.
- Tab bar switching between 3 views, Framer Motion layoutId underline in --phosphor.
- Data is generated client-side. Never fetch external APIs.

### 6. Features — Expandable Rows
- Vertical accordion, each row border-bottom 1px --line.
- Collapsed: index "[01]", title uppercase, chevron right.
- Expanded: GSAP height auto animation 220ms, revealing a two-column body — left description, right a monospace spec block (bg --surface-2, 12px, key: value pairs).
- Only one row open at a time. Keyboard: Enter/Space toggles, arrow keys move between rows, aria-expanded maintained.
- Features {{FEATURE_1}} … {{FEATURE_6}}.

### 7. Metrics Grid
- 2x2 or 1x4 grid of --surface cells with 1px --line borders (use a single grid with gap 1px on a --line background for hairline separators).
- Each cell: label in --muted 11px uppercase, value in --phosphor at clamp(2rem,4vw,3.25rem), and a 32px sparkline SVG drawing in via stroke-dashoffset on viewport entry.

### 8. Pricing
- Three columns as terminal panels. Prices in tabular-nums.
- Feature lists prefixed with "[✓]" in --phosphor or "[ ]" in --muted.
- Recommended tier: --phosphor 1px border and a small corner tag "// RECOMMENDED".
- Enterprise tier shows "CONTACT" instead of a number.

### 9. CTA + Footer
- CTA: centered block, bg --surface-2, oversized uppercase headline, --phosphor bordered button.
- Footer: bg --bg, 1px --line top, four columns, 12px --muted, {{CONTACT_EMAIL}}, legal line in 11px.

## STATES & EDGE CASES (mandatory)
- Loading: terminal-style — a blinking block cursor plus "loading…" in --muted. No spinners, no shimmer (wrong idiom for this AD).
- Empty: "// no records" in --muted, centered, with a single action link.
- Error: --alert 1px left border on a --surface card, message in plain language, "retry" as a bracketed action "[retry]".
- Canvas: if 2D context is unavailable, render a static --phosphor dot grid instead. Pause rAF when document.hidden.
- Simulated feeds must clear their intervals on unmount — no leaked timers.
- Forms: inline errors in --alert below the field, aria-live="polite", submit shows "SENDING…" and disables.
- 404: styled as a terminal error dump with a "[return home]" action.

## PERFORMANCE
- Canvas capped at 24fps via a timestamp gate in the rAF loop; paused on IntersectionObserver exit and on visibilitychange.
- All intervals cleared in useEffect cleanup.
- next/font for IBM Plex Mono, preload weight 400 only.
- Reduced motion: disable rain, disable typing (render final text), stop the ticker auto-scroll (make it manually scrollable instead).
- Target LCP < 2.0s, CLS < 0.03.

## ACCESSIBILITY
- The scanline and vignette overlays: aria-hidden, pointer-events-none.
- --phosphor on --bg must be verified ≥ 4.5:1 for body text; use --fg for long-form copy and reserve --phosphor for accents and short labels.
- Custom cursor must never hide the native focus ring.
- Live regions: the ticker is aria-live="off" (decorative); real status changes use aria-live="polite".
- Full keyboard operability on the accordion and tabs, with visible 2px --phosphor focus rings.

## STRICT RULES
- No `any`. Strict TS.
- Monospace everywhere — no sans-serif fallbacks in the design.
- Motion is fast and mechanical. Never bouncy, never elastic.
- Density is the aesthetic: fill space with real information, not decorative padding.
- Fully designed at 375px — the console preview must become a horizontally scrollable pane, not a squashed one.
```

---

## TEMPLATE 04 — Warm Analog Paper

```
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a {{PRODUCT_CATEGORY}} site. Art direction: warm analog paper — letterpress editorial, serif authority, ink-bleed motion, printed-matter tactility. Calm and human, never corporate. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: Tailwind CSS v4 (@theme)
- Animation: Framer Motion, GSAP ScrollTrigger + SplitType
- Smooth scroll: Lenis (lerp 0.055)
- Icons: Lucide React, strokeWidth 1
- Language: TypeScript strict

## DESIGN SYSTEM
Colors:
  --paper: #FBF7F0
  --paper-2: #F1EADE
  --ink: #1A1714
  --ink-soft: #4A423A
  --muted: #9C9186
  --rule: #DED4C6
  --accent: {{ACCENT_HEX}} (fallback #B0562C — burnt sienna)
Typography:
  Display: "Editorial New" or "Playfair Display" — weight 400 + italic, tracking -0.015em, leading 0.98
  Body: "Inter" weight 400, leading 1.7, size 17.5px, max measure 68ch
  Labels: "Inter" weight 500, uppercase, tracking 0.22em, 11px, --muted
  Scale: h1 clamp(3rem, 8vw, 7rem) / h2 clamp(2rem, 4vw, 3.5rem)
Texture: fixed SVG feTurbulence paper grain, baseFrequency 0.72, opacity 0.05, mix-blend-multiply, pointer-events-none.
Rules: border-radius 0 on structural elements, 999px on buttons only. Hairline rules in --rule at 1px.

## SECTIONS

### 1. Shell
- Lenis provider. Paper grain overlay fixed above everything at z-[90], aria-hidden.
- Sections separated by 1px --rule.
- Generous vertical rhythm: py-28 mobile / py-44 desktop.

### 2. Navbar
- bg --paper, border-bottom 1px --rule, height 72px, static (not fixed) until 200px scroll, then becomes fixed with a slide-down entrance (y -100% → 0, 400ms).
- Left: {{LOGO_ASSET}} at 30px, or "{{BRAND_NAME}}" in display italic.
- Center: serif links. Hover: --accent underline draws left-to-right over 300ms (scaleX origin-left).
- Right: "{{PRIMARY_CTA}}" pill, bg --ink, text --paper, hover bg --accent.
- Mobile: overlay in --paper-2, links in display serif at clamp(2.25rem,9vw,3.5rem), staggered entrance.

### 3. Hero
- Asymmetric editorial layout: h1 spans columns 1–9, a small caption block sits in columns 10–12 aligned to the h1 baseline.
- h1 "{{HERO_HEADLINE}}" — SplitType by word, ink-bleed entrance: filter blur(14px) → blur(0), opacity 0 → 1, y 18 → 0, stagger 0.09, duration 1.05, ease power3.out.
- One word set in display italic and colored --accent.
- Below the h1, a full-bleed plate within the grid, in a 1px --rule frame with a small italic --muted caption underneath (like a figure caption in a book).
    STANDARD PATH [REQUIRES: none]: the plate holds a live mock editor UI in CSS — a toolbar of --rule bordered controls, a body of typeset lines in the page's own serif, a blinking --accent caret, and a word-count strip in --muted. It reads as a printed proof of the product, which suits this art direction better than a screenshot would.
    ENHANCED PATH [REQUIRES: 1+ screenshot]: {{HERO_ASSET}} inside the same framed plate, aspect ratio reserved before load.
- Drop-cap treatment on the opening paragraph: first letter float-left, 3 lines tall, display serif, --accent.

### 4. Manifesto — Scroll Highlight
- A single long statement at clamp(1.75rem, 3.5vw, 3rem), --muted by default.
- GSAP ScrollTrigger scrub 0.8, SplitType by word: each word transitions color --muted → --ink as the scroll position passes it. Pin the section for 150vh.
- Reduced motion: render all words in --ink immediately, no pin.

### 5. Features — Alternating Plates
- Each feature is a two-column row, alternating image side (even rows reversed).
- Image side [REQUIRES: 3+ screenshots]: {{HERO_ASSET}} variants inside a 1px --rule frame, entering with scale 1.06 → 1 and opacity 0 → 1 over 900ms whileInView.
- Image side, STANDARD PATH [REQUIRES: none]: each row's frame holds a distinct small mock built in CSS — a settings panel, a comparison table, a notification stack — one per feature, each in the page's own typography. Same frame, same entrance.
- Text side: label ("Chapter 01"), h3 in display serif, body copy, and a text link with an animated arrow.
- Features {{FEATURE_1}} … {{FEATURE_4}}.

### 6. Marquee Values
- Full-bleed, display serif at clamp(2.5rem,6vw,5rem), uppercase, --ink on --paper-2 band.
- CSS marquee 48s linear infinite, seamless duplicate node, edge gradient masks.
- Separator between items: a small --accent circle glyph.

### 7. Testimonials — Pull Quotes
- Large display-italic quotes at clamp(1.75rem,3vw,2.75rem), --ink, with an oversized --accent opening quotation mark positioned absolutely and partially bleeding off the text block.
- Attribution in label styling below, with a small circular avatar.
- Carousel: 3 quotes, dot navigation as 1px --rule circles filling with --ink when active, Framer Motion AnimatePresence crossfade (opacity + y 12), autoplay 7s, pausing on hover and on focus-within.

### 8. Pricing
- Three cards on --paper with 1px --rule borders, generous internal padding (p-10).
- Price in display serif at clamp(2.75rem,4vw,4rem), tabular-nums.
- Feature rows separated by 1px --rule, Check icons in --accent.
- Recommended tier: bg --paper-2 and a small hand-set label "Most chosen" in italic --accent above the card.

### 9. CTA + Footer
- CTA: bg --ink, text --paper, centered display serif headline, --accent pill button. Paper grain still applies over it.
- Footer: bg --paper-2, four columns, {{CONTACT_EMAIL}} as a display-italic link, bottom bar with 1px --rule top.

## STATES & EDGE CASES (mandatory)
- Loading: --paper-2 blocks with a slow 2s opacity pulse (0.6 → 1). No hard shimmer — it would break the analog feel.
- Empty: centered italic --muted line plus one text CTA.
- Error: --paper card with a 2px --accent left rule, plain-language message, "Try again" text button.
- Image failure: the 1px frame remains with a --paper-2 fill and an italic --muted caption "Image unavailable". Never a broken-image glyph.
- Forms: inline validation in --accent, 13px italic, aria-live="polite". Success replaces the form with a short serif confirmation, not an alert.
- Carousel: must pause on hover, on focus-within, and when prefers-reduced-motion is set.

## PERFORMANCE
- next/font with size-adjust to eliminate serif swap shift (serifs are the worst CLS offender).
- Preload only the display weight used above the fold.
- All plate images next/image with explicit sizes and aspect-ratio containers.
- Grain overlay as an inline SVG data URI, not an image request.
- Reduced motion: disable Lenis, disable the manifesto pin and scrub, disable marquee, keep static layout.
- Target LCP < 2.2s, CLS < 0.04.

## ACCESSIBILITY
- Serif display at large sizes still needs 3:1 contrast minimum; body must clear 4.5:1 against --paper.
- Drop cap must not break screen-reader word flow — keep it as a styled span inside the paragraph, not a separate node.
- Carousel: aria-roledescription="carousel", accessible previous/next controls, announce slide changes politely.
- Focus rings: 2px --accent, offset 3px.
- Grain overlay aria-hidden, pointer-events-none.

## STRICT RULES
- No `any`. Strict TS.
- Never mix more than the two defined families. No third font.
- Motion is slow and soft: 700–1100ms durations, power3.out. Nothing snappy.
- Whitespace is the luxury signal — resist filling it.
- Fully designed at 375px, including the alternating plates (they stack image-first, always).
```

---

## TEMPLATE 05 — Neo-Memphis Geometric

```
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a {{PRODUCT_CATEGORY}} site. Art direction: neo-memphis geometric — flat bold shapes, hard offset shadows, primary-adjacent palette, confident playfulness with real structural discipline. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: Tailwind CSS v4 (@theme)
- Animation: Framer Motion (drag, spring, layout), CSS keyframes
- Icons: Lucide React, strokeWidth 2.25
- Language: TypeScript strict

## DESIGN SYSTEM
Colors:
  --bg: #FFFDF7
  --bg-2: #FFE8D6
  --ink: #16130F
  --blue: #2B6DF6
  --yellow: #FFC93C
  --coral: #FF5E5B
  --mint: #2EC4A0
  --accent: {{ACCENT_HEX}} (fallback --blue)
Typography:
  Display: "Clash Display" (Fontshare), weight 700, tracking -0.03em, leading 0.92
  Body: "Satoshi", weight 400/500, leading 1.6, 17px
  Scale: h1 clamp(3rem, 9vw, 8rem) / h2 clamp(2rem, 5vw, 4rem)
Signature treatment: every card and button uses a hard offset shadow — box-shadow: 6px 6px 0 var(--ink), border: 2px solid var(--ink), border-radius 14px. On hover, translate(3px,3px) and shadow shrinks to 3px 3px 0 (the "press" gesture). Transition 140ms cubic-bezier(0.2,0,0,1).

## SECTIONS

### 1. Shell
- bg --bg. Decorative geometric shapes (circles, quarter-arcs, zigzags) positioned absolutely per section, in the four palette colors, at low z-index, pointer-events-none.
- Shapes drift subtly on scroll via Framer Motion useScroll + useTransform (y range ±60px, different per shape for parallax depth).
- Section separators: 3px solid --ink.

### 2. Navbar
- Floating bar, top-4, mx-4, bg --bg, 2px --ink border, 5px 5px 0 --ink shadow, radius 14px.
- Left: {{LOGO_ASSET}} 28px or "{{BRAND_NAME}}" in Clash Display.
- Center: links, weight 500. Hover: a --yellow rounded highlight scales in behind the text (Framer Motion layoutId, spring stiffness 380 damping 30).
- Right: "{{PRIMARY_CTA}}" button, bg --blue, text white, full shadow treatment.
- Mobile: the bar expands downward (layout animation, height auto), links stacked with a 2px --ink divider between each.

### 3. Hero
- Two-column on desktop (7/5), stacked on mobile.
- Left: h1 "{{HERO_HEADLINE}}" — each word wrapped in a span, entering with rotate(-6deg → 0), y 40 → 0, opacity 0 → 1, spring (stiffness 220, damping 18), stagger 0.07. One word gets a --coral rounded-rect highlight behind it that scales in from scaleX(0) after the text lands.
- Sub {{VALUE_PROP}}, then a CTA row: primary --blue button + secondary bordered button "{{SECONDARY_CTA}}".
- Right: a cluster of 3 draggable cards, each with the signature 2px border and hard offset shadow. Framer Motion drag with dragConstraints to the hero bounds, dragElastic 0.16, dragDirectionLock, whileDrag scale 1.04 + rotate 2deg, snapping back with a spring.
    STANDARD PATH [REQUIRES: none]: each card holds a micro-UI fragment built in CSS — a toggle row, a three-bar chart in palette colours, an avatar stack with a count. These are the intended contents; the flat geometric style makes built fragments read better than cropped screenshots.
    ENHANCED PATH [REQUIRES: 2+ screenshots]: two cards hold {{HERO_ASSET}} variants cropped square, the third keeps a built fragment for contrast.
- Below the fold edge: a full-width zigzag SVG divider in --ink.

### 4. Stat Band
- bg --yellow, 3px --ink top and bottom borders.
- Three or four stats in Clash Display at clamp(2.5rem,5vw,4.5rem), CountUp on entry.
- Each stat separated by a 3px --ink vertical rule on desktop; stacked with horizontal rules on mobile.

### 5. Feature Cards
- 3-column grid (1 column below md), each card with the full signature treatment.
- Each card has a distinct palette background (--bg-2, --mint at 25%, --coral at 20%) — cycle through, never all the same.
- Card contents: a 48px geometric icon shape in a solid color circle, h3 in Clash Display, body copy, and a text link with a → that translates on hover.
- Entrance: whileInView, y 32 → 0 with a spring, stagger 0.08.
- Features {{FEATURE_1}} … {{FEATURE_6}}.

### 6. Process — Horizontal Steps
- Four numbered steps connected by a dashed 3px --ink line.
- The connecting line draws in on scroll (SVG stroke-dashoffset tied to useScroll progress).
- Each step: a large numeral in a solid color circle with the signature border, title, one-line description.
- Below md: the line becomes vertical and steps stack.

### 7. Pricing
- Three cards, full signature treatment, middle card scaled 1.05 with bg --yellow and a rotated (-3deg) "BEST VALUE" tag pinned to its top-right corner.
- Toggle: a chunky pill switch with a 2px --ink border and a --blue thumb, spring animated.
- Feature rows with 2px --ink Check icons.
- Price transitions via AnimatePresence (y ±18, opacity).

### 8. CTA + Footer
- CTA: bg --coral, 3px --ink borders, oversized Clash Display headline in --bg, white button with --ink shadow.
- Footer: bg --ink, text --bg, four columns, socials as bordered squares with --yellow hover fill, {{CONTACT_EMAIL}}.

## STATES & EDGE CASES (mandatory)
- Loading: skeleton cards keep the 2px border and hard shadow, contents replaced by --ink/10 bars with a 1.3s shimmer. The structure must never collapse.
- Empty: a bordered card with a geometric illustration, a one-line message, and a primary button.
- Error: bordered card with a --coral fill at 20%, plain-language message, "Try again" button with full treatment.
- Drag: must be pointer-events based (works with touch). On touch devices, reduce dragElastic to 0.08 and ensure dragging never hijacks vertical page scroll (dragDirectionLock).
- Forms: inputs get the 2px --ink border + 4px 4px 0 shadow, focus state shifts shadow to --blue. Errors in --coral below the field, aria-live="polite".
- 404: oversized "404" in Clash Display with scattered geometric shapes and a home button.

## PERFORMANCE
- Hard shadows are cheap (no blur) — but cap concurrent drag listeners and use transform-only animations.
- Decorative shapes as inline SVG, aria-hidden, pointer-events-none.
- next/font for both families, preload display weight.
- next/image with sizes on all card imagery.
- Reduced motion: disable shape parallax, disable drag inertia (keep drag itself), replace spring entrances with a 200ms opacity fade, render CountUp final values instantly.
- Target LCP < 2.0s, CLS < 0.05.

## ACCESSIBILITY
- Bold color combinations must still clear 4.5:1 for body text — verify --ink on --yellow, --coral, and --mint specifically.
- Draggable cards must have a non-drag equivalent: each card's content is also reachable and readable without dragging, and drag is aria-hidden as an interaction.
- Focus rings: 3px --blue, offset 3px — thick enough to read against the bold borders.
- The "press" hover gesture must also fire on :focus-visible.

## STRICT RULES
- No `any`. Strict TS.
- Never blur a shadow. Hard offset only — that is the entire signature.
- Playful must not become childish: keep the grid strict and the copy adult.
- Maximum four palette colors on screen at once.
- Fully designed at 375px, including the draggable cluster (reduce to 2 cards).
```

---

## TEMPLATE 06 — Cinematic Depth

```
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a {{PRODUCT_CATEGORY}} site. Art direction: cinematic depth — filmic dark grade, layered parallax planes, scroll-scrubbed sequences, wide-format restraint. Feels like a title sequence. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: Tailwind CSS v4 (@theme)
- Animation: GSAP (ScrollTrigger, pin, scrub), Framer Motion for discrete UI
- Smooth scroll: Lenis (lerp 0.06), synced to ScrollTrigger via scrollerProxy
- Icons: Lucide React, strokeWidth 1.25
- Language: TypeScript strict

## DESIGN SYSTEM
Colors:
  --bg: #0A0A0C
  --bg-2: #121216
  --fg: #EFEFEA
  --muted: #7E7E86
  --line: rgba(255,255,255,0.08)
  --accent: {{ACCENT_HEX}} (fallback #E8542F — cine orange)
Typography:
  Display: "Anton" or "Archivo Expanded" — weight 700/800, uppercase, tracking -0.02em, leading 0.86
  Body: "Inter", weight 400, leading 1.6, 16.5px
  Labels: weight 500, uppercase, tracking 0.3em, 10.5px, --muted
  Scale: h1 clamp(3.5rem, 13vw, 13rem) / h2 clamp(2.5rem, 7vw, 6rem)
Grade: a fixed overlay applying a subtle warm-shadow / cool-highlight split-tone (two radial gradients, mix-blend-soft-light, opacity 0.22) plus film grain (feTurbulence, opacity 0.045, mix-blend-overlay).
Letterboxing: hero and pinned sequences render inside a 2.39:1 frame on desktop, falling back to 16:9 below lg.

## SECTIONS

### 1. Shell
- Lenis + GSAP ScrollTrigger scrollerProxy wiring (critical — ScrollTrigger must read Lenis scroll position, and lenis.on('scroll', ScrollTrigger.update) must be registered).
- Grade + grain overlays fixed, z-[95], pointer-events-none, aria-hidden.
- Thin --accent scroll progress line at viewport top.

### 2. Navbar
- Fixed, transparent, mix-blend-difference so it reads over both dark footage and bright frames.
- Left: "{{BRAND_NAME}}" in display, tracking 0.14em, 15px.
- Center: label-styled links, hover reveals a 1px underline drawn from center outward.
- Right: "{{PRIMARY_CTA}}" as a bordered pill, 1px currentColor.
- Mobile: full-screen overlay in --bg, links at clamp(2.5rem,11vw,4.5rem) display uppercase, entering with clip-path inset(100% 0 0 0) → inset(0), stagger 0.06.

### 3. Hero — Scrubbed Title Sequence
- Container height 400vh with an inner `sticky top-0 h-screen` stage.
- Background, VIDEO PATH [REQUIRES: video]: {{HERO_ASSET}} as a full-cover video (autoPlay loop muted playsInline preload="metadata", poster required), opacity 0.55, scale tied to scrollYProgress 1 → 1.18.
- Background, STANDARD PATH [REQUIRES: none]: a CSS-built filmic stage — three overlapping --accent and --bg-2 radial washes at 380px blur drifting on desynced 20s/27s loops, over a 1px --line perspective grid receding to a vanishing point (pure CSS transform: perspective + rotateX). The whole stage scales 1 → 1.18 on the same scrollYProgress.
    This is a designed composition, not an empty frame. The grade and grain overlays sit above it exactly as they would above footage, so the section reads identically cinematic without a single asset.
- h1 "{{HERO_HEADLINE}}" at clamp(3.5rem,13vw,13rem), split by character. Characters enter with clip-path inset(0 0 100% 0) → inset(0), stagger 0.02, on mount.
- Across scroll progress:
    0.00 → 0.20  h1 opacity 1 → 0, y 0 → -80
    0.15 → 0.45  block A ({{VALUE_PROP}}) opacity 0 → 1 → 0, y 60 → 0 → -60
    0.40 → 0.75  block B (three key stats) same envelope
    0.70 → 1.00  the entire sticky stage scales 1 → 0.82, border-radius 0 → 28px, opacity 1 → 0.4 — it recedes as the next section rises over it
- Scroll cue: a 1px --fg line 40px tall with a travelling --accent segment, 1.8s infinite.

### 4. Services — Stacked Cards Over the Receding Hero
- Container height 300vh with margin-top -100vh so it climbs over the shrinking hero.
- Left column (sticky): section label + h2, static.
- Right column: three full-bleed cards, each `position: sticky` at top: calc(88px + index * 36px).
- As each card pins, the cards beneath scale down (1 → 0.94 → 0.88) and dim (opacity 1 → 0.55) via useScroll + useTransform.
- Each card: a display-uppercase title, a short description, and an index numeral at 12vw in --fg at 8% opacity.
    STANDARD PATH [REQUIRES: none]: the card background is a per-card CSS gradient wash in a different hue rotation of --accent, at opacity 0.28, with a faint 1px --line diagonal hatch. Distinct per card, so the stack reads as three different surfaces.
    ENHANCED PATH [REQUIRES: 3+ screenshots or video]: a background video or image at opacity 0.28 instead of the wash.
- Cards map to {{FEATURE_1}}, {{FEATURE_2}}, {{FEATURE_3}}.

### 5. Horizontal Gallery
- GSAP pin with a horizontal x translation driven by vertical scroll (scrub 1), total travel = (trackWidth - viewportWidth).
- Five panels, each 78vw wide with a 24px gap, containing imagery and a caption.
- Panels have a slight counter-parallax on their inner image (x -8% → 8%) for depth.
- Below lg: convert to a native horizontal scroll container with scroll-snap-type x mandatory — no pin, no scrub.

### 6. Manifesto — Word Scrub
- Pinned 150vh section. A statement at clamp(1.75rem,4vw,3.25rem), words transitioning --muted → --fg on scrub 0.9 via SplitType.

### 7. Pricing
- Dark --bg-2 panels, 1px --line borders, no glass, no glow.
- Prices in display font, tabular-nums, at clamp(2.5rem,4vw,3.75rem).
- Recommended tier: --accent 1px border and a label-styled tag.
- Toggle: 1px --line track, --accent thumb, Framer Motion layout.

### 8. Contact — Knockout Text
- Full viewport, bg --bg.
- VIDEO PATH [REQUIRES: video]: video-in-text mask — outer wrapper mix-blend-screen, containing an absolutely positioned cover video, with an overlay div `bg-[var(--bg)] mix-blend-multiply text-[var(--fg)]` holding the headline at clamp(3rem,12vw,11rem) display uppercase. The footage plays only inside the letterforms. If mix-blend-mode is unsupported (@supports not), render solid --accent text over the poster.
- STANDARD PATH [REQUIRES: none]: the same knockout technique against an animated CSS gradient instead of footage — a conic-gradient in --accent and --bg-2 rotating on a 12s loop behind the mask. Identical letterform reveal, zero assets. Same @supports guard falls back to solid --accent text.
- Magnetic pill button beneath, {{CONTACT_EMAIL}} in label styling.

### 9. Footer
- Minimal, 1px --line top, three columns, --muted 13px, socials as text links.

## STATES & EDGE CASES (mandatory)
- Video: every <video> requires autoPlay loop muted playsInline and a poster. If autoplay is blocked (iOS low-power mode), the poster stands in — the layout must be complete without motion.
- If a video fails to load, render the poster or a --bg-2 block. Never an empty black frame with no content.
- Loading: --bg-2 blocks with a slow horizontal --line sweep, 1.8s.
- Empty: label-styled --muted line, centered, with one text CTA.
- Error: --bg-2 card, --accent 1px left border, plain-language copy, retry action.
- ScrollTrigger: call ScrollTrigger.refresh() on resize (debounced 200ms) and after fonts load, or every pin offset will be wrong.
- Kill all ScrollTriggers and Lenis instances on unmount (gsap.context + revert) to survive route changes.
- Forms: inline errors, aria-live="polite", disabled submit with "SENDING…" label.

## PERFORMANCE
- Videos: max 1080p, target < 3 MB each, preload="metadata" only, and pause via IntersectionObserver when out of viewport.
- Pinned sections: transform/opacity only. Never animate width, height, top, or left in a scrub.
- will-change: transform on pinned stages, removed on ScrollTrigger kill.
- next/font, preload display weight; next/image with sizes on all stills.
- Reduced motion: disable Lenis, disable every pin and scrub (sections render as normal stacked blocks), pause videos and show posters, keep only opacity transitions.
- Target LCP < 2.6s (video-heavy — use a poster as the LCP element), CLS < 0.05.

## ACCESSIBILITY
- mix-blend-difference nav must be verified legible over the brightest frame of the footage, not just the average.
- Provide a visible pause control for any autoplaying background video longer than 5 seconds.
- Horizontal gallery must be keyboard-navigable (arrow keys move panels) and not trap focus.
- Focus rings: 2px --accent, offset 2px.
- All grade/grain overlays aria-hidden, pointer-events-none.

## STRICT RULES
- No `any`. Strict TS.
- Every scrub must be transform-based. Layout-triggering scrubs are an automatic fail.
- Restraint: at most two pinned sequences in the whole page. More reads as a demo reel, not a product.
- Fully designed at 375px — pins become static sections, the gallery becomes snap-scroll.
```

---

## TEMPLATE 07 — Soft Minimal Wellness

```
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a {{PRODUCT_CATEGORY}} site. Art direction: soft minimal wellness — muted earth palette, generous roundness, breathing motion, calm density. Approachable and trustworthy. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: Tailwind CSS v4 (@theme)
- Animation: Framer Motion (spring-led), CSS keyframes for ambient breathing
- Smooth scroll: Lenis (lerp 0.08)
- Icons: Lucide React, strokeWidth 1.5
- Language: TypeScript strict

## DESIGN SYSTEM
Colors:
  --bg: #FAF8F5
  --surface: #FFFFFF
  --sage: #8FA68E
  --clay: #C98B6B
  --sand: #E8DCCB
  --fg: #2C2A27
  --muted: #857F76
  --line: #E9E3DA
  --accent: {{ACCENT_HEX}} (fallback --sage)
Typography:
  Display: "Fraunces" (variable, optical size) weight 500, tracking -0.02em, leading 1.05
  Body: "Inter", weight 400, leading 1.72, 17px
  Labels: weight 500, tracking 0.14em, uppercase, 11px
  Scale: h1 clamp(2.75rem, 6.5vw, 5.5rem) / h2 clamp(2rem, 4vw, 3.25rem)
Shape language: border-radius 24px on cards, 999px on buttons and pills, 32px on large surfaces. Shadows are soft and low: 0 2px 24px rgba(44,42,39,0.06).

## SECTIONS

### 1. Shell
- Ambient breathing gradient: two large --sage and --clay radial blobs at 12% opacity, scaling 1 → 1.06 → 1 over 14s ease-in-out infinite alternate, desynced. Fixed, z-0, aria-hidden.
- Sections use py-24 mobile / py-36 desktop, separated by whitespace rather than rules.

### 2. Navbar
- Floating rounded bar, top-5, max-w-5xl, bg --surface/85 backdrop-blur-lg, 1px --line border, radius 999px, soft shadow.
- Left {{LOGO_ASSET}} 26px / center links / right "{{PRIMARY_CTA}}" pill in --sage with white text.
- Link hover: a --sand pill background scales in behind (Framer Motion layoutId, spring stiffness 320 damping 30).
- Mobile: the pill morphs into a rounded card that expands downward (layout height auto), links stacked with 20px gaps.

### 3. Hero
- Centered, max-w-3xl, generous py.
- Eyebrow: --sand pill with a --sage dot and a short label.
- h1 "{{HERO_HEADLINE}}" — words fade up with a spring (stiffness 180, damping 22), stagger 0.08, y 24 → 0. One word set in Fraunces italic and colored --clay.
- Sub {{VALUE_PROP}} in --muted at 18px.
- CTA row: --sage pill primary + ghost secondary with an underline on hover.
- Below: a 32px-radius frame entering y 48 → 0, scale 0.97 → 1, delay 0.45, with a small --sand blob offset behind it at low z.
    STANDARD PATH [REQUIRES: none]: the frame holds a live mock built in CSS — a soft --surface card with a rounded progress ring in --sage, three habit rows with --sand pill states, and a gentle weekly bar chart. One value animates on an 8s interval (cleared on unmount) so it breathes with the rest of the page.
    ENHANCED PATH [REQUIRES: 1+ screenshot]: {{HERO_ASSET}} inside the same rounded frame, aspect ratio reserved before load, --sand fill on failure.

### 4. Trust Row
- Centered avatar stack (5 overlapping circles, 2px --bg ring each), a 5-star row in --clay, and a short line of social proof in --muted.
- Avatars enter with a stagger, scale 0.7 → 1, spring.

### 5. Features — Soft Cards
- 2x2 or 3-col grid, cards bg --surface, radius 24px, 1px --line, soft shadow.
- Icon in a 48px --sand circle at the top of each card.
- Hover: card lifts y -4px, shadow deepens to 0 8px 32px rgba(44,42,39,0.09), transition 320ms cubic-bezier(0.34,1.56,0.64,1).
- Entrance: whileInView, y 24 → 0, stagger 0.07.
- Features {{FEATURE_1}} … {{FEATURE_6}}.

### 6. How It Works
- Three steps in a horizontal row, connected by a soft dashed --line curve (SVG path) that draws in on scroll (stroke-dashoffset).
- Each step: a large numeral in Fraunces inside a --sand circle, title, one-line body.
- Below md: vertical stack with a vertical dashed connector.

### 7. Testimonials
- Three cards in a masonry-ish grid (varying heights), bg --surface, radius 24px.
- Each: quote in body size, avatar + name + role at the bottom, and a small --clay quotation glyph top-left.
- Gentle entrance stagger.

### 8. Pricing
- Three cards, radius 32px. Recommended tier: bg --sage, all text inverted to --bg, with a --sand "Most popular" pill above.
- Toggle: --sand track, --sage thumb, spring animated, with a "Save 20%" --clay label beside it.
- Feature rows with --sage Check icons, spaced py-2.5.

### 9. FAQ
- Accordion, each item bg --surface radius 20px with 12px gaps between items (not a bordered list).
- Expand: Framer Motion height auto + opacity, 280ms. Chevron rotates 180deg.
- One open at a time, keyboard operable, aria-expanded maintained.

### 10. CTA + Footer
- CTA: a large --sand rounded panel (radius 40px) with centered Fraunces headline and a --sage pill button.
- Footer: --bg, four columns, --muted 14px, {{CONTACT_EMAIL}}, socials as --sand circles with --sage icon hover.

## STATES & EDGE CASES (mandatory)
- Loading: --sand blocks at 45% opacity with a gentle 2s pulse. No aggressive shimmer.
- Empty: a --surface card with a soft illustration circle, a warm one-line message, and one --sage pill CTA.
- Error: --surface card with a --clay left border 3px, plain-language message, "Try again" ghost button.
- Forms: inputs radius 999px or 16px, 1px --line, focus ring 2px --sage with a soft glow. Errors in --clay 13px below the field, aria-live="polite". Success state replaces the form with a --sand confirmation card.
- Image failure: the rounded frame stays, filled --sand, with a --muted centered label.
- Reduced motion: freeze the breathing gradient, replace spring entrances with a 200ms opacity fade, keep hover lifts (they are instant and harmless) but remove the overshoot easing.

## PERFORMANCE
- Fraunces is variable — load a single variable file, not multiple static weights.
- next/font with display swap and size-adjust.
- Ambient blobs are CSS-only (no canvas, no JS loop).
- next/image with sizes on every card and hero asset; explicit aspect-ratio containers to prevent CLS.
- Target LCP < 2.0s, CLS < 0.04, INP < 200ms.

## ACCESSIBILITY
- --muted on --bg must clear 4.5:1 — verify and darken if it does not.
- --sage buttons with white text must clear 4.5:1; darken --sage for the button state if needed rather than lightening the text.
- FAQ accordion: full keyboard support, visible 2px --sage focus rings offset 2px.
- Ambient layer aria-hidden, pointer-events-none.
- Avatar stack: decorative, aria-hidden, with the real social proof stated in the adjacent text.

## STRICT RULES
- No `any`. Strict TS.
- Never sharpen a corner. Roundness is the entire signature.
- Motion must feel like breathing: 280–900ms, gentle springs, no hard cuts.
- Palette discipline: --sage and --clay are accents, not backgrounds. Keep --bg dominant.
- Fully designed at 375px with the same generosity of spacing, proportionally reduced.
```

---

## TEMPLATE 08 — Kinetic Maximalist

```
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a {{PRODUCT_CATEGORY}} site. Art direction: kinetic maximalist — type that never sits still, aggressive scale contrast, saturated duotone, motion as the primary content. Loud but engineered. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: Tailwind CSS v4 (@theme)
- Animation: GSAP (ScrollTrigger, SplitType, timeline), Framer Motion
- Smooth scroll: Lenis (lerp 0.065), scrollerProxy-wired to ScrollTrigger
- Icons: Lucide React, strokeWidth 2
- Language: TypeScript strict

## DESIGN SYSTEM
Colors:
  --bg: #0E0E0E
  --fg: #F5F5F0
  --duo-1: #FF3D00 (hot)
  --duo-2: #00E0FF (cold)
  --surface: #191919
  --muted: #6E6E6E
  --accent: {{ACCENT_HEX}} (fallback --duo-1)
Typography:
  Display: "Monument Extended" or "Archivo Black" — weight 800, uppercase, tracking -0.045em, leading 0.82
  Body: "Space Grotesk", weight 400/500, leading 1.55, 16px
  Scale: h1 clamp(3rem, 16vw, 16rem) / h2 clamp(2.5rem, 9vw, 8rem) / body 16px
Scale contrast is the point: display type is 8–14x the body size. Never anything in between.

## SECTIONS

### 1. Shell
- Lenis + ScrollTrigger scrollerProxy wiring, plus ScrollTrigger.update on lenis scroll.
- Fixed noise overlay, opacity 0.05, mix-blend-overlay.
- Section transitions: each section enters with a clip-path wipe (inset(100% 0 0 0) → inset(0)), scrubbed over the first 20vh of its own scroll range.

### 2. Navbar
- Fixed, full-bleed, mix-blend-difference.
- Left "{{BRAND_NAME}}" display uppercase 16px tracking 0.1em.
- Center: links. Hover: the label is replaced by a vertical roll — the current text translates y -100% while a duplicate rolls in from y 100%, 260ms, overflow hidden.
- Right: "{{PRIMARY_CTA}}" in a --duo-1 filled rectangle (no radius).
- Mobile: full-screen --duo-1 overlay, links at clamp(3rem,14vw,6rem) in --bg, entering with clip-path wipes, stagger 0.05.

### 3. Hero — Marquee Wall
- min-h-screen, no centered block. Instead: three stacked full-bleed marquee rows at clamp(3rem,16vw,16rem).
    Row 1: "{{HERO_HEADLINE}}" scrolling left, --fg
    Row 2: outline-only text (-webkit-text-stroke 1.5px --fg, color transparent) scrolling right
    Row 3: "{{HERO_HEADLINE}}" scrolling left at half speed, --duo-1
- Marquee speed is scroll-velocity reactive: useScroll velocity → skewX(±6deg) and a speed multiplier, easing back to base on idle.
- A single centered block floats over the wall: {{VALUE_PROP}} in body size on a --bg pill, plus the CTA row.
- On mount, rows enter staggered with clip-path inset(0 0 100% 0) → inset(0), 0.9s power4.out.

### 4. Scroll-Velocity Statement
- Pinned 200vh. A single word at clamp(4rem,20vw,20rem) centered.
- The word swaps through a set of terms tied to {{PRODUCT_CATEGORY}} at fixed scroll thresholds — each swap is a hard 80ms cut, not a fade.
- Background hue shifts between --duo-1 and --duo-2 across the pin (interpolate via useTransform on a CSS var).

### 5. Features — Full-Bleed Slabs
- Each feature is a 100vh slab, alternating background --bg / --surface / --duo-1.
- Layout per slab: an oversized index numeral at clamp(8rem,26vw,26rem) at 10% opacity behind, the feature title in display at clamp(2.5rem,9vw,8rem), and a short body block constrained to 42ch.
- Title enters with SplitType by character, y 100% → 0, clip-path reveal, stagger 0.015, triggered at 65% viewport entry.
- Features {{FEATURE_1}} … {{FEATURE_5}}.

### 6. Cursor-Follow Gallery
- Editorial row list (index, title, category, arrow), each row py-8 with a 1px --muted/30 bottom border.
- On row hover: an absolutely positioned 320x420 image thumbnail scales 0 → 1 and follows the cursor via gsap.quickTo on x/y with duration 0.5 ease power3 (quickTo, not gsap.to, for per-frame performance).
- Row text color shifts to --duo-2 and the arrow translates x 12px.
- Touch devices: no cursor follow — tapping a row expands an inline thumbnail instead.

### 7. Pricing
- Three full-width horizontal bars rather than cards. Each bar: tier name in display at clamp(2rem,5vw,4rem) left, price center, feature summary and CTA right.
- Hover: bar background fills --duo-1 from left (scaleX origin-left, 320ms), text inverts to --bg.
- Recommended bar is filled by default.

### 8. CTA + Footer
- CTA: full viewport, "{{PRIMARY_CTA}}" at clamp(3rem,18vw,18rem) with mix-blend-difference over a --duo-1/--duo-2 animated gradient.
- Magnetic button using gsap.quickTo.
- Footer: --bg, minimal, display-uppercase column headers, --muted links, {{CONTACT_EMAIL}}.

## STATES & EDGE CASES (mandatory)
- Loading: full-bleed --surface blocks with a --duo-1 bar sweeping horizontally, 1.1s. Keep the scale contrast even in skeletons.
- Empty: an oversized display-uppercase "NOTHING HERE" with a small CTA beneath — stay in character.
- Error: --surface slab with a --duo-1 3px top border, plain-language message, bordered retry button.
- Marquee: the duplicated node must be measured (not assumed) so the loop is seamless at every viewport width — measure on mount and on debounced resize.
- ScrollTrigger.refresh() after fonts load and on debounced resize; kill all triggers via gsap.context revert on unmount.
- Forms: bordered inputs, --duo-1 focus border, errors in --duo-1 below the field, aria-live="polite".
- 404: a marquee wall of "404" with a return link.

## PERFORMANCE
- gsap.quickTo for anything following the cursor — never gsap.to inside a mousemove handler.
- Marquees are transform-only, with will-change: transform, and paused via IntersectionObserver when off-screen.
- Cap concurrent pinned sections at two.
- next/font, preload the display weight — it is the LCP element.
- Reduced motion: this AD depends on motion, so the fallback must be a deliberate static composition — freeze marquees at a designed offset, disable all pins and scrubs, disable cursor follow, keep the type scale and color contrast. It should still look intentional, never broken.
- Target LCP < 2.4s, CLS < 0.05.

## ACCESSIBILITY
- Marquee text must not be the only source of critical information — restate it in a static, screen-reader-available element and aria-hidden the decorative duplicates.
- Provide a visible motion toggle in the footer that disables marquees and pins, persisted in localStorage.
- --duo-1 on --bg and --fg on --duo-1 must both clear 4.5:1 for any body-size text.
- Focus rings: 3px --duo-2, offset 2px.
- No flashing above 3Hz anywhere (the word-swap cuts must be throttled to a maximum of 2 per second).

## STRICT RULES
- No `any`. Strict TS.
- Loud is not sloppy: every oversized element is still aligned to the grid.
- Only two saturated colors on screen at once. The duotone is the discipline that keeps maximalism from becoming noise.
- Fully designed at 375px — marquees stay, pins become static, scale contrast is preserved.
```

---

## TEMPLATE 09 — Corporate Precision (Enterprise)

```
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", an enterprise {{PRODUCT_CATEGORY}} site. Art direction: corporate precision — institutional trust, dense but legible, restrained motion, data-forward. Reads as a decade-old category leader, not a startup. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: Tailwind CSS v4 (@theme)
- Animation: Framer Motion (subtle only), CSS transitions
- Charts: Recharts
- Icons: Lucide React, strokeWidth 1.75
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
  Display + Body: "Inter" — one family, disciplined weights (400/500/600/700)
  Numerals: "Inter" with font-variant-numeric: tabular-nums everywhere a number can change
  Scale: h1 clamp(2.5rem, 5vw, 4.25rem) / h2 clamp(1.75rem, 3vw, 2.75rem) / body 16px / small 14px
Radius: 6px on cards, 6px on buttons, 4px on inputs. Nothing rounder.
Shadows: 0 1px 2px rgba(16,20,24,0.05) only. Elevation is communicated by borders, not blur.

## SECTIONS

### 1. Shell
- Utility bar above the nav: 32px, bg --navy, text white 12px — left a short announcement, right locale selector and a "Sign in" link. Dismissible, persisted in localStorage.
- Sections separated by 1px --line, alternating --bg and --bg-2.

### 2. Navbar
- Sticky, bg --bg, border-bottom 1px --line, height 68px.
- Left: {{LOGO_ASSET}} 28px.
- Center: nav items, two of which open mega-menus — a full-width --bg panel with 1px --line bottom, containing 3–4 columns of grouped links with icons and one-line descriptions. Opens on hover (desktop, 120ms delay in, 220ms delay out) and on click/Enter (keyboard). Escape closes and returns focus to the trigger.
- Right: "{{SECONDARY_CTA}}" ghost + "{{PRIMARY_CTA}}" filled --navy.
- Mobile: full-screen panel with collapsible accordion groups mirroring the mega-menu structure.

### 3. Hero
- Two-column (6/6), left content, right a product surface.
- Eyebrow: --bg-2 pill with 1px --line, 12px, showing a compliance or launch signal.
- h1 "{{HERO_HEADLINE}}" weight 700, tracking -0.025em.
- Sub {{VALUE_PROP}}, max-w-lg, --muted at 17px.
- CTA row + a small trust line ("No credit card required · SOC 2 Type II").
- Right: a 1px --line frame with a 6px radius and the standard shadow, entering opacity 0 → 1, y 16 → 0, 500ms. Nothing more — restraint is the signal.
    STANDARD PATH [REQUIRES: none]: the frame holds a live mock enterprise view built in CSS and Recharts — a --bg-2 header strip, a data table of four rows with tabular-nums values, and a small --navy area chart from a fixed seed so it renders identically on every load. A visible 12px --muted caption beneath states it is illustrative.
    ENHANCED PATH [REQUIRES: 1+ screenshot]: {{HERO_ASSET}} inside the same frame, aspect ratio reserved before load.
- Below hero: a logo bar, grayscale at 55% opacity, static (no marquee — marquees read as small-company).

### 4. Metrics Band
- bg --navy, text white. Four metrics in a row, separated by 1px white/15 vertical rules.
- Values at clamp(2rem,3.5vw,3rem), weight 700, tabular-nums, CountUp on entry (1.4s, ease-out).
- Labels at 13px white/70.

### 5. Product Tabs
- Horizontal tab bar, 1px --line bottom, active tab marked by a 2px --navy underline animated via Framer Motion layoutId.
- Each panel: two columns — left a feature list with Check icons and short descriptions, right a Recharts visualization or product still.
- Charts: --navy series, --line grid, tabular-nums axis labels, tooltip in a --bg card with 1px --line. All data client-generated.
- Panels crossfade (opacity + y 8, 240ms). Keyboard: arrow keys move tabs, roving tabindex, aria-selected maintained.

### 6. Solutions Grid
- 3-column card grid, cards bg --bg, 1px --line, radius 6px.
- Each: icon in a --bg-2 rounded square, title, two-line description, "Learn more →" link.
- Hover: border → --navy at 35%, shadow to 0 4px 12px rgba(16,20,24,0.07), transition 200ms. No lift, no scale.
- Features {{FEATURE_1}} … {{FEATURE_6}}.

### 7. Security & Compliance
- bg --bg-2. Left: h2 plus three short assurances. Right: a grid of compliance badges (SOC 2, ISO 27001, GDPR, HIPAA) as 1px --line bordered tiles.
- A single subtle animation: a Shield icon whose check path draws in via SVG stroke-dashoffset on viewport entry.

### 8. Testimonials / Case Studies
- Two large cards: each with a client logo, a quote at 19px, attribution, and one hard metric ("−38% resolution time") in --positive with tabular-nums.
- A third card is a "Read the case study →" link tile in --navy.

### 9. Pricing
- Three tiers plus an Enterprise column showing "Custom" instead of a price.
- Cards: 1px --line, radius 6px. Recommended tier: 2px --navy border and a --navy "Recommended" tag — no scale, no glow.
- A full feature comparison table below: sticky header row, 1px --line grid, Check/Minus icons, alternating --bg-2 row backgrounds. Horizontally scrollable below md with the first column pinned.
- Monthly/annual toggle with an animated price transition (tabular-nums prevents width jitter).

### 10. CTA + Footer
- CTA: bg --navy, white text, centered h2, white filled button and a ghost white-bordered secondary.
- Footer: bg --bg-2, 1px --line top, five columns (product, solutions, resources, company, legal), locale selector, {{CONTACT_EMAIL}}, and a bottom bar with copyright and legal links at 13px --muted.

## STATES & EDGE CASES (mandatory)
- Loading: --bg-2 skeleton bars at the exact final dimensions (measure first) with a 1.4s shimmer. Zero layout shift on resolve.
- Empty: --bg-2 panel, 1px --line, an icon, one explanatory line, one primary action.
- Error: --bg card, 1px --negative border, --negative icon, plain-language message, and a "Try again" secondary button. Never expose error codes to the user; log them.
- Chart with no data: render axes and a centered --muted "No data for this period" — never a collapsed empty box.
- Forms: labels above fields (never placeholder-as-label), 1px --line inputs, 2px --navy focus ring, inline validation on blur, error text in --negative 13px with aria-describedby wiring, submit disabled with a spinner and "Submitting…" text.
- Mega-menu: must close on Escape, on outside click, and on route change.
- 404 and 500 pages matching the system, with search and primary navigation available.

## PERFORMANCE
- next/font Inter variable, single file, display swap, size-adjust.
- Recharts imported dynamically (next/dynamic, ssr: false) so it never blocks the initial bundle.
- next/image with sizes on every asset; explicit aspect ratios.
- Tables virtualized only if rows exceed 100 — otherwise plain semantic markup.
- Reduced motion: disable CountUp (render finals), disable layoutId sliding (instant switch), keep all opacity transitions under 200ms.
- Target LCP < 1.8s, CLS < 0.03, INP < 180ms.

## ACCESSIBILITY
- WCAG 2.1 AA minimum throughout; this AD's buyers frequently require a VPAT.
- Semantic tables with <caption>, <thead>, scope attributes on <th>.
- Mega-menu: correct ARIA (aria-expanded, aria-controls), full keyboard operability, focus returned to the trigger on close.
- Tabs: role="tablist"/"tab"/"tabpanel", roving tabindex, aria-selected.
- Focus rings: 2px --navy, offset 2px, on every interactive element.
- All charts have an accessible text summary adjacent or in a visually-hidden element.

## STRICT RULES
- No `any`. Strict TS.
- One font family only. Weight and size carry the whole hierarchy.
- Motion budget: nothing exceeds 320ms, nothing bounces, nothing scales on hover.
- Every changeable number uses tabular-nums. No width jitter, ever.
- Fully designed at 375px, including the comparison table (pinned first column, horizontal scroll).
```

---

## TEMPLATE 10 — Retro-Futurist Chrome

```
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a {{PRODUCT_CATEGORY}} site. Art direction: retro-futurist chrome — liquid metal type, iridescent gradients, early-CGI optimism rendered with modern precision. Nostalgic surface, contemporary engineering. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: Tailwind CSS v4 (@theme)
- Animation: Framer Motion, GSAP ScrollTrigger
- 3D: react-three-fiber + drei (MeshTransmissionMaterial / environment map) for the hero chrome object, with a static WebP fallback
- Smooth scroll: Lenis (lerp 0.07)
- Icons: Lucide React, strokeWidth 1.5
- Language: TypeScript strict

## DESIGN SYSTEM
Colors:
  --bg: #0B0D14
  --bg-2: #12151F
  --fg: #EDF0F7
  --muted: #79809A
  --chrome-hi: #FFFFFF
  --chrome-lo: #6E7A99
  --irid-1: #7DF9FF
  --irid-2: #C77DFF
  --irid-3: #FF9E7D
  --accent: {{ACCENT_HEX}} (fallback --irid-2)
Typography:
  Display: "Chillax" or "Clash Display" (Fontshare), weight 600, tracking -0.035em, leading 0.9
  Body: "Satoshi", weight 400/500, leading 1.6, 16.5px
  Labels: weight 500, uppercase, tracking 0.24em, 11px
  Scale: h1 clamp(3rem, 11vw, 10rem) / h2 clamp(2.25rem, 6vw, 5rem)
Chrome text recipe: background linear-gradient(180deg, --chrome-hi 0%, --chrome-lo 42%, #2C3450 55%, --chrome-hi 78%, --chrome-lo 100%), bg-clip-text, color transparent, plus a 1px --fg/20 text-stroke for edge definition. Animate background-position on a 6s loop for a slow liquid shimmer.
Iridescence: conic-gradient(from var(--angle), --irid-1, --irid-2, --irid-3, --irid-1) with @property --angle for smooth rotation.

## SECTIONS

### 1. Shell
- bg --bg with a fixed subtle starfield (200 CSS-positioned 1px dots at varying opacity, no JS).
- A slow iridescent aurora band across the top 40vh, opacity 0.18, blur 120px, drifting on a 22s loop.
- Grain overlay opacity 0.04, mix-blend-overlay.

### 2. Navbar
- Floating pill, top-5, max-w-6xl, bg --bg-2/70 backdrop-blur-xl, 1px border using the iridescent conic gradient at 30% opacity (border-image or a masked pseudo-element).
- Left {{LOGO_ASSET}} 26px / center links / right "{{PRIMARY_CTA}}" pill with an iridescent gradient fill and --bg text.
- Link hover: text fills with the chrome gradient (bg-clip-text transition via opacity crossfade between two stacked spans).
- Mobile: pill expands into a rounded panel, links stacked, each with a 1px iridescent divider.

### 3. Hero
- min-h-screen, centered.
- Center object, STANDARD PATH [REQUIRES: none]: a pure-CSS chrome orb — a 42vmin circle filled with the chrome gradient recipe at 140deg, an inset white highlight arc, a soft --irid-2 rim glow, and a conic-gradient sheen rotating on a 14s loop via @property --angle. On mousemove the highlight position eases toward the cursor (CSS vars --mx/--my, lerp 0.06). No WebGL, no assets, no r3f dependency at all.
    This is the default build. It ships smaller, renders everywhere, and holds the art direction completely — do not treat it as a lesser version.
- Center object, ADVANCED PATH [REQUIRES: 3D model or explicit 3D opt-in]: an r3f chrome torus or sphere with MeshTransmissionMaterial (thickness 0.4, roughness 0.05, chromaticAberration 0.06) lit by an HDRI environment. Slow autorotate; on mousemove, rotation eases toward the cursor (lerp 0.04).
    If WebGL is unavailable, the context is lost, or navigator.hardwareConcurrency < 4, swap to the CSS orb above at runtime. The layout must be identical either way.
- h1 "{{HERO_HEADLINE}}" using the chrome text recipe, sitting in front of the object at z-10, with mix-blend-mode: screen where it overlaps.
- Entrance: h1 characters clip-path inset(0 0 100% 0) → inset(0), stagger 0.025; the 3D object scales 0.7 → 1 with a spring.
- Sub {{VALUE_PROP}} in --muted, then the CTA row.
- Label strip beneath: three short capability labels separated by iridescent dots.

### 4. Iridescent Ticker
- Full-width band, bg --bg-2, 1px iridescent top and bottom borders.
- Marquee of short capability phrases in label styling, --muted, with --irid-2 diamond separators. 36s linear, seamless, pauses on hover.

### 5. Feature Panels
- Alternating two-column rows. The visual side is a --bg-2 panel with a 20px radius and an iridescent 1px border.
    STANDARD PATH [REQUIRES: none]: each panel holds a distinct live mini-UI in CSS — a command palette, a metric ring, a token grid — one per feature, each using the iridescent border and chrome-text recipes so they read as part of the same material system.
    ENHANCED PATH [REQUIRES: 3+ screenshots]: {{HERO_ASSET}} variants inside the same panels.
- Panels tilt on cursor: rotateX/rotateY up to 6deg based on pointer position within the panel, perspective 1000px, spring-eased, resetting on leave. Disabled on touch.
- Text side: label, h3 in chrome text at a smaller scale, body copy, and an arrow link.
- Features {{FEATURE_1}} … {{FEATURE_4}}.

### 6. Scroll Chrome Statement
- Pinned 180vh section. A single line at clamp(2.5rem,8vw,7rem) in chrome text.
- On scrub, the chrome gradient's background-position shifts across the full text, making the highlight sweep left-to-right as the user scrolls — the metal appears to catch the light.

### 7. Metrics
- Three iridescent-bordered cards, values in chrome text at clamp(2.25rem,4vw,3.5rem), CountUp on entry, labels in --muted.

### 8. Pricing
- Three --bg-2 panels, 20px radius, 1px --fg/10 borders. Recommended tier gets the animated iridescent conic border (rotating --angle, 5s linear infinite) and a chrome-text price.
- Toggle: --bg-2 track with an iridescent thumb, spring animated.
- Feature rows with --irid-1 Check icons.

### 9. CTA + Footer
- CTA: a large --bg-2 panel with an iridescent glow behind it (blurred conic gradient at 30% opacity), chrome-text headline, iridescent pill button with a magnetic hover.
- Footer: --bg, 1px --fg/8 top border, four columns, --muted 13px, {{CONTACT_EMAIL}}, socials as iridescent-bordered circles.

## STATES & EDGE CASES (mandatory)
- WebGL unavailable, context lost, or a low-end device (detect via a quick renderer probe): swap to the static chrome WebP immediately. Never leave an empty container.
- Loading: --bg-2 blocks with an iridescent sweep, 1.5s. The 3D canvas shows a chrome-gradient placeholder circle until the scene is ready (drei Suspense fallback).
- Empty: an iridescent-bordered card, chrome-text short heading, --muted line, one CTA.
- Error: --bg-2 card with a --irid-3 1px left border, plain-language message, bordered retry button.
- Forms: --bg-2 inputs with 1px --fg/12 borders, focus border becomes iridescent, errors in --irid-3 13px, aria-live="polite".
- @property --angle must have an @supports guard: where unsupported, fall back to a static linear-gradient border (no rotation) rather than a transparent one.
- bg-clip-text unsupported or forced-colors mode: fall back to solid --fg text.

## PERFORMANCE
- r3f: dpr={[1, 1.5]}, frameloop="demand" when idle, unmount the canvas via IntersectionObserver when the hero leaves the viewport, and dispose geometries/materials on cleanup.
- MeshTransmissionMaterial is expensive — use a single instance, keep samples low (4–6), and skip it entirely on devices reporting < 4 CPU cores (navigator.hardwareConcurrency) in favor of the static fallback.
- HDRI environment: use a small (1k) compressed .hdr or drei's preset, never a multi-MB map.
- next/font, preload the display weight; next/image with sizes on all stills.
- Reduced motion: freeze the chrome shimmer at a fixed position, stop autorotation, disable panel tilt, disable the pin/scrub, keep static iridescent borders.
- Target LCP < 2.6s (use the h1 as the LCP element, not the canvas), CLS < 0.05.

## ACCESSIBILITY
- Chrome gradient text has variable contrast by design — it is only permitted at display sizes (≥ 40px) where 3:1 applies. All body copy uses solid --fg.
- Provide a solid-color fallback for forced-colors and for print.
- The 3D canvas is decorative: aria-hidden, and it must never be the only carrier of information.
- Focus rings: 2px --irid-1, offset 2px — verified visible against both --bg and --bg-2.
- Panel tilt must not fire on focus (it would disorient keyboard users); hover only.

## STRICT RULES
- No `any`. Strict TS.
- Chrome is for display type only. The moment it touches body copy, the design fails.
- Iridescence is an accent: borders, small fills, glows. Never a full-surface background.
- The static fallback must be a designed state, not a degraded one — a visitor without WebGL should not be able to tell.
- Fully designed at 375px: the 3D object shrinks and the h1 wraps to two lines, chrome effect intact.
```

---

## Notes d'implémentation pour ta base de données

**Champs à stocker par prompt :**

| Champ | Exemple |
|---|---|
| `id` | `saas-01-swiss-brutalist` |
| `category` | `saas` |
| `art_direction` | `Swiss Brutalist Monochrome` |
| `template` | le corps du prompt complet |
| `variables` | `["BRAND_NAME", "HERO_HEADLINE", …]` |
| `stack_tags` | `["nextjs", "tailwind", "framer-motion", "gsap"]` |
| `complexity` | `medium` / `high` |
| `target_tools` | `["lovable", "v0", "bolt", "cursor", "claude-code"]` |

**Ce que ta couche IA doit faire au moment de la génération :**

1. Classifier l'input utilisateur → catégorie + sous-type
2. Choisir la direction artistique (soit l'utilisateur la nomme, soit tu la déduis du secteur et du ton)
3. Extraire les variables de l'input (nom, secteur, promesse, features, assets uploadés)
4. Remplacer chaque `{{VARIABLE}}` — et **supprimer proprement** les sections qui dépendent d'une variable absente plutôt que de laisser un placeholder vide
5. Injecter les chemins des assets uploadés dans `{{LOGO_ASSET}}` / `{{HERO_ASSET}}`
6. Retourner le prompt final en bloc copiable

**Le point le plus important :** ne jamais laisser un `{{PLACEHOLDER}}` non résolu dans l'output. C'est le seul bug qui détruit immédiatement la confiance de l'utilisateur.
