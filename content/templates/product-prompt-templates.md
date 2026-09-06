# Product Prompt Templates — 10 Art Directions

> **Usage:** Each template is a complete, production-grade prompt for a product-led site (single-product showcase, drop page, or small catalogue). Variables in `{{DOUBLE_BRACES}}` are injected by the AI layer from the user's input. Everything else is fixed craft specification.

**Variable reference (shared across all templates):**

| Variable | Example value |
|---|---|
| `{{BRAND_NAME}}` | Maison, Kern, Halden |
| `{{PRODUCT_NAME}}` | The Meridian Chronograph |
| `{{PRODUCT_CATEGORY}}` | mechanical watch, running shoe, serum |
| `{{TAGLINE}}` | Built for the long way round |
| `{{HERO_HEADLINE}}` | Time Is An Art |
| `{{PRICE}}` | €2,400 |
| `{{VARIANTS}}` | array of {name, hex/swatch, sku, stock} |
| `{{PRODUCT_SHOT_1..5}}` | user-uploaded product imagery |
| `{{HERO_ASSET}}` | /hero.mp4 or /hero.webp |
| `{{DETAIL_1..6}}` | material, movement, weight, origin… |
| `{{FEATURE_1..6}}` | benefit-led selling points |
| `{{ACCENT_HEX}}` | brand colour, overrides template accent |
| `{{CONTACT_EMAIL}}` | care@brand.com |
| `{{PRIMARY_CTA}}` | Add to bag / Reserve yours |

> Full variable contract, including the shared core schema and per-domain extensions: see `prompt-variable-schema.md`.

**Commerce surfaces every template must handle** (specified per-template below, never omitted): product gallery with zoom, variant selection, quantity, add-to-bag with cart drawer, stock states, size/fit guidance where relevant, shipping and returns disclosure, reviews.

---

## ASSET GATING — applies to every template below

Some sections need assets a user may not have (video, frame sequences, 3D models, archival photography). **No template may ever require an asset the user has not supplied.** Every asset-dependent section is written with two paths, and the AI layer picks one before the prompt is emitted.

| Asset the user supplied | What the section becomes |
|---|---|
| Nothing but 1 product shot | **Standard path** — the section is built from that single shot plus CSS transforms. Always works. |
| 3–5 product shots | **Enhanced path** — gallery, crossfade sequences, multi-angle views. |
| A video (`{{HERO_ASSET}}` ends in .mp4/.webm) | **Video path** — background footage, with the poster carrying the layout if autoplay is blocked. |
| A frame sequence or 3D model | **Advanced path** — turntable, exploded view, scrub sequences. |

**Rules for the generating layer:**

1. Count the assets in the user's input **before** selecting the template body. Emit only the path that the assets support.
2. Never emit a section that references an asset slot the user left empty. Delete the whole section rather than leaving a placeholder or an empty frame.
3. The standard path must always produce a complete, finished-looking page. A user with one product photo gets a site that looks intentional, not degraded.
4. Sections marked `[REQUIRES: …]` below are droppable. Sections without that marker are mandatory and must be built from whatever the user has.

**Marker convention used in the templates:**

```
[REQUIRES: video]            → drop if no video supplied
[REQUIRES: 3+ shots]         → collapse to single-shot variant
[REQUIRES: frame sequence]   → replaced by the standard-path alternative given inline
[REQUIRES: none]             → always build
```

---

## TEMPLATE 01 — Luxury Noir Editorial

```
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build the site for "{{PRODUCT_NAME}}" by {{BRAND_NAME}}, a {{PRODUCT_CATEGORY}}. Art direction: luxury noir editorial — pure black stage, high-contrast serif display, cinematic pinned sequences, the product lit like a subject. Restraint and reverence. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: Tailwind CSS v4 (@theme in globals.css)
- Animation: GSAP (ScrollTrigger, pin, scrub, quickTo), Framer Motion for discrete UI
- Smooth scroll: Lenis (duration 1.2, easing t => Math.min(1, 1.001 - Math.pow(2, -10*t)), smoothWheel true), wired into the GSAP ticker with gsap.ticker.lagSmoothing(0) and lenis.raf(time * 1000)
- Icons: Lucide React, strokeWidth 1
- Language: TypeScript strict

## DESIGN SYSTEM
Colors:
  --bg: #000000
  --bg-2: #050505
  --fg: #FFFFFF
  --muted: rgba(255,255,255,0.55)
  --line: rgba(255,255,255,0.12)
  --accent: {{ACCENT_HEX}} (fallback #C9A227 — warm gold)
Typography:
  Display: "Bodoni Moda" (serif) weights 700–900, tracking -0.02em, leading 0.92
  Body/UI: "Inter" weight 300 for copy, 500/700 for labels and buttons, leading 1.65
  Labels: uppercase, tracking 0.34em, 10.5px, --muted
  Scale: h1 clamp(3rem, 10vw, 9rem) / h2 clamp(2.25rem, 6vw, 5rem) / body 16px
Rules: radius 0 on structural surfaces, 999px on buttons. No shadows — separation comes from black-on-black value shifts and 1px --line rules.

## SECTIONS

### 1. Shell
- Lenis + GSAP ticker integration exactly as specified above. Call ScrollTrigger.refresh() after document.fonts.ready and on debounced (200ms) resize.
- Custom cursor: a 10px --fg dot plus a 34px --line ring, both driven by gsap.quickTo (never gsap.to inside mousemove). Ring scales 1.9x over interactive elements. Hidden entirely on (hover: none) devices.
- Sections separated by whitespace, not rules. Vertical rhythm py-28 mobile / py-44 desktop.

### 2. Navbar
- Fixed z-50. Transparent on load; after 50px scroll applies bg-white/5 backdrop-blur-md border-b border-[var(--line)], transition 450ms.
- Left: "{{BRAND_NAME}}" in Bodoni, tracking 0.16em, 17px.
- Center (lg+): label-styled links. Hover: 1px --accent underline draws from center outward, 320ms.
- Right: a bag icon with a count badge (--accent dot when count > 0) and a "{{PRIMARY_CTA}}" pill (1px --line border, transparent → --fg bg with --bg text on hover, scale 1.04).
- Mobile: full-screen --bg overlay, links in Bodoni at clamp(2.25rem,10vw,4rem), entering with clip-path inset(0 0 100% 0) → inset(0), stagger 0.06. Body scroll locked; Escape closes; focus trapped inside.

### 3. Hero
- h-screen, flex-centered, z-10.
- Background, video path [REQUIRES: video]: {{HERO_ASSET}} as a full-cover looping video (autoPlay loop muted playsInline preload="metadata", poster mandatory) under a linear-gradient(to bottom, black/80, black/40, black).
- Background, standard path [REQUIRES: none]: the primary product shot at 45% opacity, scaled 1.06 and slowly drifting scale 1.06 → 1.14 across the hero's scroll range, under the same gradient. On pure black this reads as intentional chiaroscuro — build this whenever no video is supplied, and never leave the hero flat black.
- Label above the title, then h1 "{{HERO_HEADLINE}}" in Bodoni, stacked flex-col so each line is its own animated unit.
- Entrance: lines y 100 → 0, opacity 0 → 1, stagger 0.12, duration 1.15, ease power4.out, after fonts ready.
- Scroll-out: ScrollTrigger scrub on the whole hero container — scale 1 → 0.85, opacity 1 → 0, y 0 → -60 across the first 80vh.
- Scroll cue: a 1px --fg/40 vertical line, 44px, with a travelling --accent segment, 2s infinite.

### 4. Product Reveal (Pinned)
- ScrollTrigger pin for +=1200px. A three-column stage:
    Left: variant index ("01 / 04"), variant name in Bodoni, one-line headline, a text CTA.
    Center: the product shot at up to 90% viewport height, absolutely centered.
    Right: description plus a 2x2 spec grid built from {{DETAIL_1}}–{{DETAIL_4}}.
- self.progress maps to activeIndex across {{VARIANTS}}. Guard the index update behind a ref comparison so React only re-renders on an actual index change, never per scroll pixel.
- Variant swap: Framer Motion AnimatePresence — outgoing shot y 0 → -8% opacity → 0; incoming y 100% → 0, opacity 0 → 1, duration 0.7, ease [0.16,1,0.3,1].
- Background morph: a full-bleed div transitions between per-variant colours (derive a triad from each variant's swatch: light / mid / dark) over 800ms, with a low-opacity particle SVG layer above it, pointer-events-none.
- Mobile: no pin. Becomes a vertical stack — shot first, then text — with a horizontal swatch selector that scroll-snaps.

### 5. Heritage / Story
- bg --bg-2. Asymmetric two-column.
- Left: a 50–80vh image container revealed with a GSAP clip-path inset(0 0 100% 0) → inset(0) over 1.1s; image is grayscale with mix-blend-luminosity, parallaxed y 0 → 20% on scrub.
- Right: --accent eyebrow, Bodoni heading, two body paragraphs, staggered y 40 → 0 reveal.

### 6. Craft Detail (Sticky Macro)
- Section height 150vh with an inner sticky top-0 h-screen stage.
- Background: a macro product shot scaling 1 → 1.18 and translating y 0 → 20% on scrub.
- A dashed 1px --line circle, 60vmin, rotating on a 120s linear infinite loop behind the copy.
- Foreground: centered Bodoni statement fading in at top 60% and out at bottom 80%, scrubbed.

### 7. Gallery (Horizontal + Modal)
- GSAP pin with x translation = -(trackWidth - viewportWidth), scrub 1.
- Velocity skew: gsap.quickSetter on each item applying skewX clamped to ±15deg from ScrollTrigger velocity, easing back to 0 on idle.
- Click opens a Framer Motion AnimatePresence fullscreen modal: borderless image, caption beneath, previous/next arrows, close button top-right. Body scroll locked; Escape closes; arrow keys navigate; focus trapped and returned to the trigger on close.
- Below lg: native horizontal scroll with scroll-snap-type: x mandatory, no pin, no skew.

### 8. Buy Section (the commerce core)
- Two columns: left a sticky gallery (thumbnail rail + main image with a hover/tap zoom that pans on pointer position, 2.2x, contained); right the purchase panel.
- Purchase panel contents, in order:
    Product name in Bodoni, {{TAGLINE}} in --muted
    {{PRICE}} in tabular-nums, with any compare-at price struck through in --muted
    Variant selector from {{VARIANTS}} — swatches as 34px circles with a 1px --line ring, selected gets a 2px --accent ring and an offset. Out-of-stock swatches get a diagonal line and aria-disabled, and remain focusable with an explanatory label.
    Quantity stepper with tabular-nums, min 1, max clamped to available stock
    "{{PRIMARY_CTA}}" full-width pill, --fg bg, --bg text
    A 1px --line divider, then three collapsible rows: Details ({{DETAIL_1}}–{{DETAIL_6}}), Shipping & Returns, Care. Accordion: one open at a time, aria-expanded, keyboard operable.
- Add to bag opens a right-side cart drawer (Framer Motion x 100% → 0, 380ms): line items with thumbnails, quantity steppers, subtotal in tabular-nums, a shipping-threshold note, and a checkout button. Drawer traps focus, closes on Escape and on backdrop click.

### 9. Reviews
- Aggregate row: an --accent star rating, the numeric average to one decimal, and the review count.
- Three review cards on --bg-2 with 1px --line: stars, title in Bodoni small, body in --muted, verified-buyer label, date.
- "Read all" text link. If there are no reviews, render an empty state (see below) — never hide the section silently.

### 10. Contact / Footer
- Form on a dark luxury treatment: transparent inputs with border-b 1px --line only, labels floating above on focus. Fields: name, email, and a boutique/location select.
- Framer Motion + useInView (threshold 0.3) driving y 30 → 0 fade-ins.
- Footer: a flex row — "{{BRAND_NAME}}", social and legal links, {{CONTACT_EMAIL}}, copyright at 12px --muted.

## STATES & EDGE CASES (mandatory)
- Out of stock: the CTA becomes "Notify me" and opens an email capture inline. Never leave a dead disabled button with no path forward.
- Low stock (< 5): a small --accent label "Only N left" beside the variant. Uses real stock from {{VARIANTS}}, never fabricated urgency.
- Variant with no image: fall back to the primary shot rather than rendering an empty frame.
- Add-to-bag failure: the drawer opens showing an error row with a plain-language message and a retry action; the item is not silently dropped.
- Loading: --bg-2 blocks with a slow 1.8s --line sweep. Gallery reserves its aspect ratio before the image resolves — zero CLS.
- Empty cart: centered --muted line, one text CTA back to the product. Empty reviews: "Be the first to review" with a link.
- Image failure: the frame remains, filled --bg-2, with a centered --muted label. Never a broken-image glyph.
- Video autoplay blocked (iOS low power): the poster carries the section. The layout must be complete without motion.
- Forms: inline validation on blur, aria-describedby wiring, aria-live="polite" for errors, submit disabled with "Sending…" while pending, success replaces the form.
- 404 and 500 pages in the same system.

## PERFORMANCE
- gsap.context() per section with revert on unmount; kill all ScrollTriggers on route change or every pin offset leaks.
- ScrollTrigger.refresh() after fonts load and on debounced resize.
- quickTo/quickSetter for cursor and skew — never gsap.to inside a pointer handler.
- Video ≤ 1080p, ≤ 3 MB, preload="metadata", paused via IntersectionObserver when off-screen.
- next/font for Bodoni Moda and Inter with size-adjust (serif swap is the worst CLS offender); preload the display weight only.
- next/image with explicit sizes and aspect-ratio containers on every product shot.
- Overlays and particles: pointer-events-none to avoid repaint churn during scroll.
- Reduced motion: disable Lenis, disable every pin and scrub (sections render as normal stacked blocks), freeze the rotating dashed ring, pause video and show posters, keep opacity transitions only.
- Target LCP < 2.4s (poster or h1 as LCP element, never the video), CLS < 0.04, INP < 200ms.

## ACCESSIBILITY
- Product images need descriptive alt text conveying the variant and view, not "product image".
- Variant swatches are radio semantics: role="radiogroup", each swatch a radio with an accessible name including colour and availability. Colour must never be the sole differentiator — always pair with a text label.
- Cart drawer and gallery modal: focus trapped, Escape closes, focus returned to the trigger, aria-modal="true".
- Price and stock changes announced via aria-live="polite".
- Focus rings: 2px --accent, offset 2px, verified visible on pure black.
- Custom cursor must never suppress the native focus indicator.
- Decorative overlays, particles and the dashed ring: aria-hidden, pointer-events-none.

## STRICT RULES
- No `any`. Strict TS.
- Serif is for display only. Body copy is always Inter — mixing them at body size destroys the register.
- The product is the only subject: no stock lifestyle photography, no decorative illustration.
- Motion is slow and weighted: 700–1200ms, power4.out. Nothing snappy, nothing bouncy.
- Fully designed at 375px — pins become static sections, the gallery becomes snap-scroll, the buy panel stacks below the gallery with a sticky bottom bar carrying price and CTA.
```

---

## TEMPLATE 02 — Studio Minimal

```
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build the site for "{{PRODUCT_NAME}}" by {{BRAND_NAME}}, a {{PRODUCT_CATEGORY}}. Art direction: studio minimal — seamless white cyclorama, the product floating in negative space, engineering-grade typography, motion so smooth it reads as inevitable. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: Tailwind CSS v4 (@theme)
- Animation: Framer Motion (useScroll, useTransform, layout), GSAP ScrollTrigger for pinned sequences
- Smooth scroll: Lenis (lerp 0.06)
- Icons: Lucide React, strokeWidth 1.5
- Language: TypeScript strict

## DESIGN SYSTEM
Colors:
  --bg: #FFFFFF
  --bg-2: #F5F5F7
  --fg: #1D1D1F
  --muted: #86868B
  --line: #E5E5E7
  --accent: {{ACCENT_HEX}} (fallback #0071E3)
Typography:
  Single family: "Inter" (or SF Pro if licensed) — weights 400/500/600/700
  Display: weight 600, tracking -0.035em, leading 1.04
  Scale: h1 clamp(2.75rem, 7vw, 6.5rem) / h2 clamp(2rem, 4.5vw, 4rem) / body 17px / small 14px
Radius: 12px cards, 999px buttons, 18px large surfaces.
Shadow: 0 4px 24px rgba(0,0,0,0.06) — used sparingly, on floating surfaces only.

## SECTIONS

### 1. Shell
- Pure white throughout; alternate --bg-2 for every second section to create rhythm without rules.
- Vertical spacing py-24 mobile / py-40 desktop.
- Sticky bottom purchase bar appears once the hero CTA scrolls out: product name, {{PRICE}}, and "{{PRIMARY_CTA}}" — backdrop-blur-xl bg-white/85, 1px --line top, entering y 100% → 0.

### 2. Navbar
- Sticky, height 52px, bg-white/80 backdrop-blur-xl, border-bottom 1px --line.
- Left {{BRAND_NAME}} at 15px weight 600. Center: compact links at 13px. Right: search and bag icons.
- Hover: link colour --muted → --fg, 180ms. No underline — the weight and colour carry it.
- Mobile: a full-screen white panel sliding down, links at 22px with 1px --line dividers.

### 3. Hero
- min-h-[92vh], centered, bg --bg.
- Small product-category label, then h1 "{{PRODUCT_NAME}}", then {{TAGLINE}} in --muted at 21px.
- Two text CTAs side by side: "{{PRIMARY_CTA}}" as a filled --accent pill, and "Learn more →" as a text link.
- Product shot below, centered, entering with scale 1.04 → 1 and opacity 0 → 1 over 900ms ease [0.16,1,0.3,1]. As the user scrolls, useTransform drives scale 1 → 1.12 and y 0 → -40 for a slow push-in.
- Everything is on white. No gradient, no shadow behind the product other than its own contact shadow.

### 4. Scroll-Scrubbed Product Sequence

**STANDARD PATH [REQUIRES: none] — build this unless the advanced path is explicitly enabled.**
- GSAP pin for +=1000px on a single product shot.
- Across scrub progress the shot scales 1 → 1.22, translates y 0 → -6%, and rotates 0 → 4deg — a slow, deliberate push-in. Transform only.
- Three caption lines fade in at progress thresholds 0.15 / 0.45 / 0.75, each a short spec statement from {{DETAIL_1}}–{{DETAIL_3}}, with a thin --line rule above each.
- This needs exactly one image and always looks finished. Do not apologise for it in the layout — the slow push-in is the intended effect, not a fallback.

**ADVANCED PATH [REQUIRES: frame sequence] — only if the user supplied a turntable frame set.**
- Same pin, but a canvas or img element cycles the pre-rendered frames, index driven by scrub progress.
- Preload all frames with a concurrency cap of 6; show a --bg-2 placeholder with a subtle pulse until ready, and do not engage the pin before every frame resolves.
- If any frame fails to load, abandon the sequence and fall back to the standard path at runtime — same pin length, same captions, no layout jump.

### 5. Feature Blocks
- Full-bleed alternating blocks, each min-h-[80vh], alternating --bg and --bg-2.
- Layout: large centered headline, one supporting paragraph at max-w-2xl, and a product detail shot below.
- Reveal: whileInView, y 32 → 0, opacity 0 → 1, duration 0.7, once, viewport margin -12%.
- Features {{FEATURE_1}} … {{FEATURE_4}}.

### 6. Spec Table
- Two-column definition list on --bg-2, 1px --line between rows, py-4 each.
- Left the label in --muted, right the value in --fg with tabular-nums.
- Built from {{DETAIL_1}}–{{DETAIL_6}}. Below lg, the label sits above the value.

### 7. Buy Section
- Two columns: left a sticky gallery (main image plus a 4-thumb rail beneath; click swaps with a 220ms crossfade; hover zoom 2x with pointer-following pan, contained).
- Right purchase panel: name, {{PRICE}} in tabular-nums, financing line if applicable, variant selector as labelled pill buttons (not bare swatches — the label is the point in this AD), quantity stepper, full-width --accent CTA, delivery estimate line with a real date range, and a free-returns note.
- Add to bag opens a cart drawer (x 100% → 0, 340ms) with line items, steppers, subtotal, and checkout.

### 8. Comparison
- If the catalogue has siblings: a three-column comparison with a sticky header row, 1px --line grid, Check/Minus icons, and tabular-nums pricing.
- Horizontally scrollable below md with the first column pinned via position: sticky; left: 0.

### 9. Reviews + FAQ
- Reviews: aggregate rating row, then three cards on --bg with 1px --line and 12px radius.
- FAQ: accordion, items separated by 1px --line, Framer Motion height auto + opacity 260ms, chevron rotating 180deg, one open at a time.

### 10. Footer
- --bg-2, five compact columns at 13px, --muted links, locale selector, {{CONTACT_EMAIL}}, legal bar at 12px.

## STATES & EDGE CASES (mandatory)
- Out of stock: CTA becomes "Notify me when available" with an inline email capture and a confirmation state.
- Back-order: CTA stays active but the delivery line changes to a --accent ship-by date. Never hide the delay.
- Turntable frames still loading: the pin does not engage; the section behaves as a normal static block until ready.
- Loading: --bg-2 skeletons at exact final dimensions, 1.4s shimmer, zero shift on resolve.
- Empty: --bg-2 panel, an icon, one line, one action.
- Error: --bg card, 1px in a red derived from --accent's hue-rotate, plain-language copy, retry button. Never surface an error code.
- Forms: labels above fields (never placeholder-as-label), 1px --line inputs, 2px --accent focus ring, validation on blur, aria-describedby, aria-live="polite", disabled submit with "Submitting…".
- Cart drawer and gallery zoom: focus trapped, Escape closes, focus restored.
- 404 and 500 matching the system.

## PERFORMANCE
- The 36-frame turntable is the main risk: serve WebP at the exact rendered size, preload with a concurrency cap of 6, and never mount the pin before all frames resolve.
- next/font Inter variable, single file, display swap, size-adjust.
- next/image with sizes and explicit aspect ratios everywhere.
- Framer Motion: transform and opacity only, never width/height/top/left in a scroll transform.
- Reduced motion: disable Lenis, disable the turntable pin (show a single frame), replace entrances with a 180ms opacity fade, disable the push-in.
- Target LCP < 1.9s, CLS < 0.03, INP < 180ms.

## ACCESSIBILITY
- The turntable is decorative: aria-hidden, with the same information available in the spec table.
- Variant pills: role="radiogroup" with accessible names including availability.
- Gallery thumbnails are buttons with accessible names describing the view.
- Focus rings: 2px --accent, offset 2px, on every interactive element.
- Contrast: --muted on --bg must clear 4.5:1 — verify and darken if not.
- Sticky purchase bar must not obscure focused elements: add scroll-margin-bottom to focusable content.

## STRICT RULES
- No `any`. Strict TS.
- One font family. Weight, size and colour carry the entire hierarchy.
- Never place a gradient or a coloured background behind the product. White is the studio.
- Motion budget: nothing exceeds 900ms, nothing bounces, nothing rotates on hover.
- Fully designed at 375px, including the comparison table and the sticky purchase bar.
```

---

## TEMPLATE 03 — Drop Culture

```
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build the drop page for "{{PRODUCT_NAME}}" by {{BRAND_NAME}}, a {{PRODUCT_CATEGORY}}. Art direction: drop culture — countdown urgency, oversized condensed type, hard cuts, sticker-sheet layering, streetwear release energy. Loud, fast, engineered. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: Tailwind CSS v4 (@theme)
- Animation: GSAP (SplitType, ScrollTrigger), Framer Motion (drag, layout)
- Smooth scroll: Lenis (lerp 0.075), scrollerProxy-wired to ScrollTrigger with lenis.on('scroll', ScrollTrigger.update)
- Icons: Lucide React, strokeWidth 2.25
- Language: TypeScript strict

## DESIGN SYSTEM
Colors:
  --bg: #0F0F0F
  --bg-2: #1A1A1A
  --fg: #FAFAFA
  --muted: #767676
  --hot: {{ACCENT_HEX}} (fallback #E8FF3A — acid)
  --alt: #FF4D2E
Typography:
  Display: "Archivo Expanded" or "Anton" — weight 800, uppercase, tracking -0.03em, leading 0.84
  Body/UI: "Space Grotesk" weight 400/500, leading 1.5, 15.5px
  Labels: mono-ish, uppercase, tracking 0.2em, 11px
  Scale: h1 clamp(3rem, 15vw, 15rem) / h2 clamp(2.25rem, 8vw, 7rem)
Radius: 0 everywhere except pills. Borders 2px --fg on sticker elements.

## SECTIONS

### 1. Shell
- Fixed drop banner at the very top, 34px, bg --hot, --bg text, uppercase 11px: the release name and a live countdown (days:hours:mins:secs, tabular-nums, updating on a single shared 1s interval — not one per digit).
- When the countdown hits zero, the banner switches to "LIVE NOW" and the page's primary CTA changes from "Notify me" to "{{PRIMARY_CTA}}" — handle this transition without a page reload.
- Grain overlay opacity 0.05, mix-blend-overlay, pointer-events-none.

### 2. Navbar
- Sticky below the banner, bg --bg/85 backdrop-blur-sm, border-bottom 2px --fg.
- Left "{{BRAND_NAME}}" in display uppercase 17px. Center links at 12px uppercase. Right: bag with a --hot count badge.
- Link hover: text roll — current label translates y -100% while a duplicate rolls in from y 100%, 240ms, overflow hidden.
- Mobile: full-screen --hot overlay, links in display at clamp(2.5rem,12vw,5rem) in --bg, hard 60ms cut entrances (no fades — the abruptness is the aesthetic).

### 3. Hero
- min-h-screen. Product shot centered and oversized, bleeding past the viewport edges by ~8%.
- Behind it: three stacked marquee rows of "{{PRODUCT_NAME}}" at clamp(3rem,15vw,15rem) — row 1 --fg scrolling left, row 2 outline-only (-webkit-text-stroke 2px --fg, transparent fill) scrolling right, row 3 --hot at half speed.
- Marquee speed reacts to scroll velocity (useScroll velocity → multiplier and skewX ±5deg, easing back on idle). Duplicate nodes must be measured on mount and on debounced resize so the loop is seamless at every width.
- Overlaid sticker elements: rotated 2px --fg bordered labels ("LIMITED", "{{PRICE}}", the drop date) at -6deg / 4deg / -3deg, each draggable within the hero bounds (Framer Motion drag, dragElastic 0.14, dragDirectionLock so vertical page scroll is never hijacked).
- CTA pill in --hot with --bg text, magnetic hover via gsap.quickTo.

### 4. Countdown Block
- Full-bleed --hot band, 2px --fg top and bottom borders.
- Four numerals in display at clamp(3rem,10vw,8rem), tabular-nums, with hard digit flips (60ms opacity cut, no rotation).
- Below: the exact release datetime in the user's local timezone, plus a "Add to calendar" text link.

### 5. Spec Slabs
- Each detail is a 70vh full-bleed slab, alternating --bg / --bg-2 / --hot.
- Oversized index numeral at clamp(8rem,24vw,24rem) at 8% opacity behind; title in display at clamp(2.25rem,8vw,7rem); body constrained to 44ch.
- Title enters via SplitType by character, y 100% → 0 with a clip-path reveal, stagger 0.014, triggered at 65% viewport entry.
- Details {{DETAIL_1}} … {{DETAIL_5}}.

### 6. Size / Variant Selector (the commerce core)
- Full-width section on --bg-2.
- Left: a large product shot that swaps per selected variant (hard 80ms cut, no crossfade).
- Right: 
    {{PRICE}} in display at clamp(2rem,5vw,3.5rem), tabular-nums
    Variant grid from {{VARIANTS}} — square 2px --fg bordered tiles, selected inverts to --hot fill with --bg text. Sold-out tiles get a diagonal strike, aria-disabled, and stay focusable with an explanatory accessible name.
    A "Size guide" text link opening a modal with a measurement table (Framer Motion, focus trapped, Escape closes).
    Quantity stepper with a max clamped to real stock.
    Full-width "{{PRIMARY_CTA}}" in --hot.
    Below: three label rows — shipping window, returns policy, authenticity note.
- Add to bag opens a cart drawer (x 100% → 0, 300ms, hard easing) with line items, steppers, subtotal, and checkout.

### 7. Lookbook Gallery
- GSAP pin with horizontal scrub. Five panels at 76vw with a 20px gap.
- Panels have counter-parallax on the inner image (x -7% → 7%).
- Click opens a fullscreen modal with arrow navigation, Escape close, focus trap.
- Below lg: native scroll-snap-type x mandatory, no pin.

### 8. Reviews + FAQ
- Reviews as bordered 2px --fg cards on --bg, stars in --hot, verified label as a small --hot pill.
- FAQ accordion: 2px --fg bordered rows, expand with a 200ms height animation, chevron rotating.

### 9. Footer
- bg --hot, --bg text. Display-uppercase column headers, 12px links, {{CONTACT_EMAIL}}, socials as 2px bordered squares.

## STATES & EDGE CASES (mandatory)
- Pre-drop (countdown > 0): the CTA reads "Notify me", opens an inline email capture, and the variant grid is visible but non-purchasable with a clear "Available {date}" label. Never a dead disabled button.
- Live: CTA becomes "{{PRIMARY_CTA}}". The transition must happen client-side on the countdown reaching zero.
- Sold out: CTA becomes "Join the waitlist". Sold-out variants strike through immediately rather than failing at add-to-bag.
- Stock is real: never fabricate scarcity counters. If stock data is absent, omit the low-stock label entirely.
- Countdown across timezones: compute from a fixed UTC release timestamp and render in the user's locale via Intl.DateTimeFormat. Never assume the visitor's offset.
- Countdown interval: one shared setInterval, cleared on unmount. Recompute from Date.now() each tick rather than decrementing (tab-throttling makes decrement drift).
- Loading: --bg-2 blocks with a --hot bar sweeping horizontally, 1s. Keep the scale contrast in skeletons.
- Empty cart: display-uppercase "BAG'S EMPTY" with a link back. Empty reviews: "NO REVIEWS YET" with a write-review link.
- Add-to-bag failure: an error row in --alt inside the drawer with plain-language copy and a retry.
- Forms: 2px bordered inputs, --hot focus border, errors in --alt below the field, aria-live="polite".
- 404: a marquee wall of "404" with a return link.

## PERFORMANCE
- Marquees are transform-only with will-change: transform, paused via IntersectionObserver off-screen.
- gsap.quickTo for magnetic and cursor-adjacent effects — never gsap.to in a pointer handler.
- Cap pinned sections at two (hero marquee wall is not pinned; only the gallery is).
- ScrollTrigger.refresh() after fonts load and on debounced resize; gsap.context revert on unmount.
- next/font, preload the display weight — it is the LCP element.
- Reduced motion: freeze marquees at a designed offset, disable pins, scrubs, drag inertia and magnetic hover. The static composition must still look intentional.
- Target LCP < 2.3s, CLS < 0.05.

## ACCESSIBILITY
- Countdown must be announced sensibly: wrap it in aria-live="off" (it updates every second) but expose the release datetime as static text nearby, and announce the switch to LIVE via a separate aria-live="assertive" region once.
- Marquee text is decorative and aria-hidden; the product name must also exist as a static heading.
- Variant tiles: role="radiogroup", accessible names including size and availability. Sold-out state must not rely on the diagonal strike alone.
- Provide a motion toggle in the footer that disables marquees and pins, persisted in localStorage.
- --hot on --bg and --bg on --hot must both clear 4.5:1 at body size; verify before shipping.
- No flashing above 3Hz — digit cuts throttled to 1 per second.
- Focus rings: 3px --hot, offset 2px.

## STRICT RULES
- No `any`. Strict TS.
- Motion is hard-cut and mechanical: 60–300ms. No elastic, no soft fades on primary transitions.
- Two saturated colours maximum on screen — --hot and --alt never share a section.
- Urgency must be true. Fake countdowns and fake stock counters are an automatic fail.
- Fully designed at 375px: marquees stay, pins become static, sticker elements reduce to two.
```

---

## TEMPLATE 04 — Botanical Apothecary

```
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build the site for "{{PRODUCT_NAME}}" by {{BRAND_NAME}}, a {{PRODUCT_CATEGORY}}. Art direction: botanical apothecary — soft daylight, herbarium detail, ingredient-led storytelling, calm clinical trust. Tactile and honest. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: Tailwind CSS v4 (@theme)
- Animation: Framer Motion (spring-led), GSAP ScrollTrigger for the ingredient sequence
- Smooth scroll: Lenis (lerp 0.08)
- Icons: Lucide React, strokeWidth 1.25
- Language: TypeScript strict

## DESIGN SYSTEM
Colors:
  --bg: #FBFAF6
  --bg-2: #F0EDE4
  --leaf: #6B7F5C
  --bark: #8A6A4F
  --fg: #26241F
  --muted: #7C766C
  --line: #E2DDD1
  --accent: {{ACCENT_HEX}} (fallback --leaf)
Typography:
  Display: "Fraunces" variable, weight 400–500, optical size on, tracking -0.015em, leading 1.06
  Body: "Inter" weight 400, leading 1.75, 16.5px, measure max 66ch
  Labels: weight 500, uppercase, tracking 0.2em, 10.5px, --muted
  Scale: h1 clamp(2.5rem, 6vw, 5rem) / h2 clamp(1.875rem, 3.75vw, 3.25rem)
Shape: radius 20px cards, 999px buttons, 28px large surfaces. Shadow 0 2px 20px rgba(38,36,31,0.05).
Texture: a faint paper grain (SVG feTurbulence, baseFrequency 0.8, opacity 0.035, mix-blend-multiply), fixed, aria-hidden.

## SECTIONS

### 1. Shell
- Ambient: two large --leaf and --bark radial washes at 10% opacity, scaling 1 → 1.05 over 16s and 21s ease-in-out infinite alternate (desynced). Fixed, z-0, aria-hidden.
- Rhythm: py-24 mobile / py-36 desktop. Whitespace separates sections; rules only inside components.

### 2. Navbar
- Floating rounded bar, top-5, max-w-5xl, bg --bg/85 backdrop-blur-lg, 1px --line, radius 999px.
- Left {{BRAND_NAME}} in Fraunces. Center links. Right: bag icon with a --leaf count dot and a "{{PRIMARY_CTA}}" --leaf pill.
- Link hover: a --bg-2 pill scales in behind (Framer Motion layoutId, spring stiffness 320 damping 30).
- Mobile: the pill morphs into an expanding rounded card (layout height auto), links stacked with 20px gaps.

### 3. Hero
- Two columns (6/6). Left: label, h1 "{{PRODUCT_NAME}}" with one word in Fraunces italic --bark, {{TAGLINE}} in --muted at 18px, {{PRICE}} in tabular-nums, and the CTA row.
- Right: the product shot on a soft --bg-2 disc, entering scale 0.96 → 1, y 32 → 0, spring (stiffness 170 damping 22). Two botanical line-drawings (SVG, --leaf at 30% opacity) sit behind at low z, drifting ±18px on scroll parallax.
- Beneath: a trust row — key claims as small --bg-2 pills (cruelty-free, dermatologist-tested, etc.), each with a Check icon.

### 4. Ingredient Sequence (Pinned)
- GSAP pin for +=1100px. Center stage: a single large ingredient illustration or macro shot.
- self.progress maps to an activeIndex across the ingredient list. Guard the index update behind a ref comparison so React re-renders only on change.
- Left column: ingredient name in Fraunces, its role in one line. Right column: a short paragraph and a concentration figure in tabular-nums.
- Swap: AnimatePresence crossfade with y 24 → 0 → -24, 620ms, ease [0.16,1,0.3,1]. Background tint shifts subtly per ingredient.
- Mobile: no pin — becomes a vertical stack with a horizontal scroll-snap ingredient rail.

### 5. Before / After or Results
- If applicable to {{PRODUCT_CATEGORY}}: a draggable comparison slider (Framer Motion drag on the x axis, clamped 0–100%, clip-path inset driven by the handle position).
- Handle is a 40px --bg circle with a 1px --line ring and a --leaf grip glyph. Keyboard: arrow keys move the handle in 2% steps; the slider is a role="slider" with aria-valuenow.
- Beneath: a results claim with the study size and duration in --muted. Never state a result without its sample size.

### 6. How To Use
- Three or four steps in a row, connected by a soft dashed --line curve (SVG path) drawing in on scroll via stroke-dashoffset.
- Each step: a numeral in Fraunces inside a --bg-2 circle, a title, one line of body.
- Below md: vertical with a vertical connector.

### 7. Buy Section (the commerce core)
- Two columns: left a sticky gallery — main image plus a 4-thumb rail, click swaps with a 240ms crossfade, hover/tap zoom 2x with pointer-following pan, contained.
- Right purchase panel:
    Name in Fraunces, {{TAGLINE}}, star rating with review count
    {{PRICE}} in tabular-nums, with a per-unit price in --muted (e.g. per 30 ml) — this AD's buyers compare unit economics
    Size/variant selector from {{VARIANTS}} as labelled pill buttons with the unit price on each
    A purchase-mode toggle: one-time vs subscribe (subscribe shows the discounted price and the delivery interval, with a "cancel anytime" note). If subscriptions do not apply, omit the toggle entirely rather than showing a disabled control.
    Quantity stepper, then a full-width --leaf CTA
    Three collapsible rows: Full ingredient list ({{DETAIL_1}}–{{DETAIL_6}}), How to use, Shipping & returns
- Add to bag opens a cart drawer (x 100% → 0, 360ms, spring) with line items, steppers, a free-shipping threshold progress bar, subtotal, and checkout.

### 8. Reviews
- Aggregate row with a --leaf star rating, average to one decimal, and count.
- A rating distribution bar chart (5→1) with --leaf fills and tabular-nums counts.
- Three review cards on --bg with 1px --line and 20px radius: stars, title, body, verified-buyer pill, skin-type or use-case label where relevant.

### 9. FAQ + Footer
- FAQ accordion: items as separate --bg cards with 12px gaps (not a bordered list), height auto + opacity 280ms, one open at a time.
- Footer: --bg-2, four columns, --muted 14px, {{CONTACT_EMAIL}}, socials as --bg-2 circles with --leaf icon hover, and a short ingredient-sourcing statement.

## STATES & EDGE CASES (mandatory)
- Out of stock: CTA becomes "Notify me" with an inline email capture and a confirmation state. Sold-out sizes strike through in the selector with an accessible name stating it.
- Subscription selected but unavailable for a variant: switch back to one-time and explain in a --muted line rather than silently failing at checkout.
- Loading: --bg-2 blocks at 45% opacity with a gentle 2s pulse — no hard shimmer, it breaks the calm.
- Empty reviews: a --bg-2 card, "No reviews yet", and a write-review link.
- Image failure: the rounded frame stays, filled --bg-2, with a --muted centered label.
- Comparison slider on touch: must not hijack vertical scroll — lock to the x axis on drag start.
- Forms: rounded inputs, 1px --line, 2px --leaf focus ring with a soft glow, errors in --bark 13px below the field, aria-live="polite", success replaces the form with a --bg-2 confirmation card.
- Any health or efficacy claim must carry its qualifier inline. If the injected copy contains an unqualified claim, render it with the qualifier slot visible rather than dropping it.
- 404 and 500 in the same system.

## PERFORMANCE
- Fraunces is variable — load one variable file, not multiple static weights.
- next/font with display swap and size-adjust; next/image with sizes and aspect-ratio containers.
- Ambient washes are CSS-only, no canvas, no JS loop.
- Guard the pinned ingredient index behind a ref so scrolling does not re-render React per pixel.
- ScrollTrigger.refresh() after fonts load and on debounced resize; gsap.context revert on unmount.
- Reduced motion: freeze the ambient wash, disable the pin (stack the ingredients), replace springs with a 200ms opacity fade, keep the comparison slider fully usable.
- Target LCP < 2.0s, CLS < 0.04, INP < 200ms.

## ACCESSIBILITY
- --muted on --bg and white on --leaf must both clear 4.5:1 — darken --leaf for button surfaces if needed rather than lightening the text.
- Comparison slider: role="slider", aria-valuemin/max/now, keyboard operable, visible focus on the handle.
- Ingredient sequence: the full ingredient information must also exist in the static collapsible list, not only inside the pinned animation.
- Variant pills: role="radiogroup" with names including size, unit price and availability.
- Cart drawer and gallery zoom: focus trapped, Escape closes, focus restored.
- Focus rings: 2px --leaf, offset 2px. Ambient layers aria-hidden, pointer-events-none.

## STRICT RULES
- No `any`. Strict TS.
- Never sharpen a corner; roundness and soft light are the signature.
- Motion breathes: 280–900ms gentle springs, no hard cuts, no overshoot above 1.02.
- --leaf and --bark are accents. --bg stays dominant across every section.
- Claims are qualified or absent. No unsupported efficacy language anywhere in the build.
- Fully designed at 375px with proportionally preserved spacing generosity.
```

---

## TEMPLATE 05 — Technical Hardware

```
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build the site for "{{PRODUCT_NAME}}" by {{BRAND_NAME}}, a {{PRODUCT_CATEGORY}}. Art direction: technical hardware — dark instrument panel, exploded-view diagrams, annotated callouts, spec density as the aesthetic. Engineered, never decorative. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: Tailwind CSS v4 (@theme)
- Animation: GSAP (ScrollTrigger, pin, scrub, DrawSVG-equivalent via stroke-dashoffset), Framer Motion for UI
- 3D (optional layer): react-three-fiber + drei for an exploded product view, with a pre-rendered frame sequence fallback
- Smooth scroll: Lenis (lerp 0.065), scrollerProxy-wired to ScrollTrigger
- Icons: Lucide React, strokeWidth 1.5
- Language: TypeScript strict

## DESIGN SYSTEM
Colors:
  --bg: #08090B
  --bg-2: #101216
  --surface: #171A20
  --fg: #E8EBF0
  --muted: #6F7783
  --line: #22262E
  --signal: {{ACCENT_HEX}} (fallback #34D399)
  --warn: #F5A524
Typography:
  Display: "Archivo" weight 700, tracking -0.025em, leading 0.95
  Body: "Inter" weight 400, leading 1.6, 15.5px
  Data/specs: "JetBrains Mono" weight 400, tabular-nums, 13px
  Labels: mono, uppercase, tracking 0.18em, 10.5px, --muted
  Scale: h1 clamp(2.75rem, 7vw, 6rem) / h2 clamp(2rem, 4.5vw, 3.5rem)
Radius: 4px. Borders 1px --line everywhere — this AD builds structure from hairlines, not shadows.

## SECTIONS

### 1. Shell
- A faint technical grid overlay: repeating-linear-gradient both axes at 48px, --line at 30% opacity, fixed, pointer-events-none, aria-hidden.
- Sections separated by 1px --line, alternating --bg and --bg-2.
- Fixed 1px --signal scroll-progress bar at viewport top.

### 2. Navbar
- Sticky, height 60px, bg --bg/85 backdrop-blur-sm, border-bottom 1px --line.
- Left {{BRAND_NAME}} in Archivo 16px. Center: links in mono label style. Right: a spec-sheet download link and a bag icon with a --signal count.
- Hover: link text --muted → --fg plus a 1px --signal underline, 160ms.
- Mobile: full-screen --bg panel, links in mono at 20px with 1px --line dividers.

### 3. Hero
- min-h-screen, split 6/6. Left: mono label with the model number, h1 "{{PRODUCT_NAME}}", {{TAGLINE}} in --muted, {{PRICE}} in mono tabular-nums, CTA row.
- Right: the product shot on --bg with a 1px --line frame and four annotated callout lines — thin --signal SVG leader lines from the product to small mono labels, each drawing in via stroke-dashoffset on mount, stagger 0.12.
- Callout labels come from {{DETAIL_1}}–{{DETAIL_4}}.
- Entrance: h1 characters clip-path inset(0 0 100% 0) → inset(0), stagger 0.018, 0.9s power4.out.

### 4. Exploded / Annotated View (Pinned)

**STANDARD PATH [REQUIRES: none] — build this unless an advanced path is explicitly enabled.**
- GSAP pin for +=1200px on a single product shot held perfectly still.
- Across scrub progress, four annotation groups reveal in sequence: each is a thin --signal SVG leader line drawing in via stroke-dashoffset (0.28 of progress each), ending at a mono label with a spec value in tabular-nums.
- The shot itself scales 1 → 1.1 only. The annotations carry the section, not the object's motion.
- A mono progress readout ("SPEC 3 / 4") in the corner, updating from scrub progress.
- This needs exactly one image and reads as a deliberate technical diagram. It is the intended design, not a degraded one.

**ADVANCED PATH [REQUIRES: 3D model or frame sequence] — only if the user supplied one.**
- 3D: an r3f scene where component groups translate outward along their own axes as scrub advances, mono labels fading in beside each part. Readout becomes "ASSEMBLY 42%".
- Frame sequence: index driven by scrub, concurrency-capped preload, --bg-2 placeholder with a 1px --signal sweep until ready, pin not engaged before frames resolve.
- If WebGL is unavailable, context is lost, or navigator.hardwareConcurrency < 4, use the frame sequence. If neither resolves, fall back to the standard path at runtime — same pin length, same readout, no layout jump.

### 5. Spec Sheet
- A dense two-column definition table on --bg-2, 1px --line grid, rows py-3.
- Left labels in mono --muted, right values in mono --fg with tabular-nums and units.
- Group into sections (Dimensions / Performance / Connectivity / Materials) with mono section headers on a --surface row.
- Below md: label above value, still monospaced, still tabular.
- Built from {{DETAIL_1}}–{{DETAIL_6}} plus any additional injected specs.

### 6. Performance Charts
- Two or three small charts (Recharts, dynamically imported with ssr false): a comparison bar chart and a line chart of a performance curve.
- --signal series on a --line grid, mono axis labels, tooltip in a --surface card with 1px --line.
- All data client-generated from injected values. Every chart has an adjacent visually-hidden text summary.

### 7. Feature Slabs
- Alternating full-bleed rows, min-h-[70vh]: one side a detail macro shot in a 1px --line frame, the other a mono label, an Archivo heading, body copy, and a small spec strip.
- Reveal: whileInView y 24 → 0, opacity 0 → 1, 520ms, once.
- Features {{FEATURE_1}} … {{FEATURE_4}}.

### 8. Buy Section (the commerce core)
- Two columns: left a sticky gallery with a thumbnail rail and a 2.5x pointer-pan zoom (this AD's buyers inspect ports, seams and finish — the zoom is functional, not decorative).
- Right purchase panel:
    Name, model number in mono, {{PRICE}} in mono tabular-nums
    Configuration selector from {{VARIANTS}} — rows rather than swatches, each showing the config name, its spec delta ("+512 GB"), and its price delta in tabular-nums. Selected row gets a 1px --signal border and a --surface fill.
    A running total that updates as configuration changes, announced via aria-live="polite"
    Quantity stepper, full-width --signal CTA with --bg text
    A mono "In stock — ships {date range}" line, or the appropriate out-of-stock state
    Three collapsible rows: What's in the box, Warranty, Shipping & returns
- Add to bag opens a cart drawer (x 100% → 0, 300ms) with line items showing the selected configuration, steppers, subtotal, and checkout.

### 9. Compatibility / Comparison
- A comparison table against sibling models: sticky header row, 1px --line grid, Check/Minus icons in --signal/--muted, mono values.
- Horizontally scrollable below md with the first column pinned (position: sticky; left: 0).

### 10. Reviews + Footer
- Reviews on --surface cards with 1px --line: --signal stars, mono date, verified label, body.
- Footer: --bg, 1px --line top, five columns, mono 12px, {{CONTACT_EMAIL}}, a documentation link, and a regulatory/compliance line.

## STATES & EDGE CASES (mandatory)
- Configuration unavailable in combination (e.g. a colour not offered at a capacity): disable that row with an accessible name explaining why, and auto-resolve to the nearest valid configuration rather than allowing an invalid add-to-bag.
- Out of stock per configuration: the row shows "Backorder — ships {date}" and remains purchasable, or "Unavailable" and is disabled with a notify link. Never a silent failure.
- Frame sequence still loading: the pin does not engage; the section renders as a static annotated shot.
- WebGL lost mid-session: swap to the frame sequence without a layout jump.
- Loading: --bg-2 blocks with a 1px --signal sweep, 1.3s, at exact final dimensions.
- Chart with no data: render axes plus a centered mono "NO DATA" — never a collapsed box.
- Error: --surface card with a 1px --warn left border, plain-language copy, a bordered retry. Log codes; never display them.
- Forms: --bg-2 inputs with 1px --line, 2px --signal focus ring, validation on blur, aria-describedby, aria-live="polite", disabled submit with "Submitting…".
- 404 and 500 rendered as instrument-panel error screens with navigation intact.

## PERFORMANCE
- r3f: dpr [1, 1.5], frameloop "demand", unmount the canvas via IntersectionObserver when the section exits, dispose geometries and materials on cleanup.
- Frame sequences: WebP at exact rendered size, concurrency-capped preload, never mount the pin before frames resolve.
- Recharts imported dynamically so it never blocks the initial bundle.
- ScrollTrigger.refresh() after fonts load and on debounced resize; gsap.context revert on unmount.
- next/font for Archivo, Inter and JetBrains Mono — preload only the weights used above the fold (three families is the ceiling; do not add a fourth).
- Reduced motion: disable the pin and scrub (show a single exploded frame), disable leader-line drawing (render final state), keep opacity transitions under 200ms.
- Target LCP < 2.2s, CLS < 0.03, INP < 180ms.

## ACCESSIBILITY
- The exploded view is decorative: aria-hidden, with every component it labels also present in the spec sheet.
- Configuration selector: role="radiogroup", accessible names including the spec delta, price delta and availability.
- Running total changes announced via aria-live="polite" — configuration UIs that update price silently are a common failure.
- Charts: visually-hidden text summaries adjacent to each.
- Comparison table: semantic <table> with <caption>, <thead>, scope on <th>.
- Focus rings: 2px --signal, offset 2px, verified against --bg and --surface.
- Grid overlay and leader lines: aria-hidden, pointer-events-none.

## STRICT RULES
- No `any`. Strict TS.
- Every number on the page uses tabular-nums. No width jitter when a value changes.
- Structure comes from 1px hairlines. No blurred shadows, no glows.
- Density is the aesthetic: fill space with real specification, not decorative padding.
- Fully designed at 375px, including the spec sheet and comparison table (pinned first column, horizontal scroll).
```

---

## TEMPLATE 06 — Heritage Label

```
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build the site for "{{PRODUCT_NAME}}" by {{BRAND_NAME}}, a {{PRODUCT_CATEGORY}}. Art direction: heritage label — letterpress packaging, engraved ornament, archival photography, provenance as the sell. Old-world credibility, modern execution. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: Tailwind CSS v4 (@theme)
- Animation: Framer Motion, GSAP ScrollTrigger + SplitType
- Smooth scroll: Lenis (lerp 0.055)
- Icons: Lucide React, strokeWidth 1
- Language: TypeScript strict

## DESIGN SYSTEM
Colors:
  --paper: #F7F2E8
  --paper-2: #EDE4D3
  --ink: #1F1A14
  --ink-soft: #4B4237
  --muted: #948A79
  --rule: #D8CDB8
  --seal: {{ACCENT_HEX}} (fallback #8C2F23 — oxblood)
Typography:
  Display: "Canela" or "Playfair Display" weight 400 + italic, tracking -0.01em, leading 1.0
  Secondary display: a condensed grotesque ("Oswald") for labels and lockups, uppercase, tracking 0.24em
  Body: "Inter" weight 400, leading 1.72, 16.5px, measure max 64ch
  Scale: h1 clamp(2.75rem, 7vw, 6rem) / h2 clamp(2rem, 4vw, 3.25rem)
Texture: paper grain SVG (feTurbulence baseFrequency 0.75, opacity 0.055, mix-blend-multiply), fixed, aria-hidden.
Ornament: thin engraved rules — a 1px --rule line with a small centered --seal diamond glyph — used as section dividers.

## SECTIONS

### 1. Shell
- Lenis provider; grain overlay fixed at z-[90].
- Sections divided by the ornamental rule, never a plain border.
- Rhythm py-28 mobile / py-44 desktop.

### 2. Navbar
- bg --paper, border-bottom 1px --rule, height 76px. Static until 200px scroll, then fixed with a y -100% → 0 slide-in, 420ms.
- Left: a stacked lockup — "{{BRAND_NAME}}" in display above "EST. {year}" in condensed uppercase 9px.
- Center: condensed-uppercase links. Hover: a --seal underline draws left-to-right, 320ms.
- Right: bag icon with a --seal count and a "{{PRIMARY_CTA}}" pill in --ink with --paper text.
- Mobile: overlay in --paper-2, links in display at clamp(2.25rem,9vw,3.5rem), staggered.

### 3. Hero
- Asymmetric: the product shot occupies columns 1–6 inside a 1px --rule frame with a thin double-rule inset (a second 1px --rule at 6px offset — the letterpress plate look).
- Columns 8–12: condensed-uppercase eyebrow, h1 "{{PRODUCT_NAME}}" in display with one word italic, {{TAGLINE}}, {{PRICE}} in tabular-nums, and a CTA row.
- Entrance: SplitType by word with an ink-bleed reveal — filter blur(13px) → blur(0), opacity 0 → 1, y 16 → 0, stagger 0.085, 1.05s power3.out.
- A wax-seal ornament (SVG, --seal) sits at the frame's corner, rotating 0 → 8deg on a slow scroll parallax.

### 4. Provenance Timeline
- A horizontal timeline on --paper-2 with a 1px --rule spine and --seal node dots.
- Each entry: a year in condensed uppercase, a display heading, two lines of body, and an archival image in a 1px --rule frame.
- The spine draws in on scroll via stroke-dashoffset; nodes scale 0 → 1 with a stagger as the line passes them.
- Below md: the spine becomes vertical and entries stack.

### 5. Manifesto — Scroll Highlight
- A single long statement at clamp(1.625rem,3.5vw,2.75rem) in display, --muted by default.
- GSAP ScrollTrigger scrub 0.85, SplitType by word: each word shifts --muted → --ink as the scroll passes it. Pin for 150vh.
- Reduced motion: render every word in --ink immediately, no pin.

### 6. Craft Detail Plates
- Alternating two-column rows. The image side is an archival or macro shot in the double-rule frame, entering with a GSAP clip-path inset(0 0 100% 0) → inset(0) over 1.05s.
- The text side has a condensed-uppercase label, a display heading, body copy, and a small italic caption in --muted underneath the plate — like a book figure caption.
- Details {{DETAIL_1}} … {{DETAIL_4}}.

### 7. Buy Section (the commerce core)
- Two columns: left a sticky gallery — main plate plus a 4-thumb rail beneath, each thumb in a 1px --rule frame; click swaps with a 260ms crossfade; hover zoom 2x with pointer-following pan.
- Right purchase panel on --paper with a 1px --rule border and generous p-10:
    Display name, condensed-uppercase category label
    {{PRICE}} in display with tabular-nums; any unit price in --muted
    Variant selector from {{VARIANTS}} — labelled rows separated by 1px --rule, selected row gets a --seal left border 2px and a --paper-2 fill. Sold-out rows strike through with an explanatory accessible name.
    Quantity stepper
    Full-width "{{PRIMARY_CTA}}" in --ink with --paper text; hover fills --seal
    An engraved rule, then three collapsible rows: Provenance & materials ({{DETAIL_1}}–{{DETAIL_6}}), Shipping & returns, Care instructions
    A short guarantee line with a small --seal seal glyph
- Add to bag opens a cart drawer (x 100% → 0, 380ms) on --paper with a 1px --rule left border: line items in framed thumbnails, steppers, subtotal in tabular-nums, gift-note option, and checkout.

### 8. Reviews
- Aggregate row: --seal stars, average to one decimal, count in condensed uppercase.
- Three review cards on --paper-2 with 1px --rule: a display-italic pull quote, attribution in condensed uppercase, a verified-purchase seal glyph, and the date.

### 9. FAQ + Footer
- FAQ: accordion rows divided by ornamental rules, height auto + opacity 280ms, one open at a time.
- Footer: --paper-2, four columns, condensed-uppercase headers, --muted 13.5px links, {{CONTACT_EMAIL}} as a display-italic link, and a bottom bar with the founding year and legal links.

## STATES & EDGE CASES (mandatory)
- Out of stock: CTA becomes "Join the list" with an inline email capture and a confirmation state in --paper-2.
- Made-to-order or long lead time: the delivery line states the real lead time prominently rather than burying it in the collapsible row.
- Loading: --paper-2 blocks with a slow 2s opacity pulse (0.6 → 1). No hard shimmer — it breaks the analog register.
- Empty cart: a display-italic --muted line and a text CTA. Empty reviews: "No reviews yet" with a write-review link.
- Image failure: the double-rule frame remains, filled --paper-2, with an italic --muted caption "Plate unavailable". Never a broken-image glyph.
- Forms: transparent inputs with border-b 1px --rule, floating labels, errors in --seal 13px italic, aria-live="polite", success replaces the form with an engraved confirmation card.
- Cart drawer and gallery zoom: focus trapped, Escape closes, focus restored.
- 404 and 500 styled as archival notices with navigation intact.

## PERFORMANCE
- Three families (display, condensed, body) is the ceiling — next/font each with size-adjust; serif and display swap shift is the main CLS risk here.
- Preload only the display weight used above the fold.
- Grain as an inline SVG data URI, not an image request.
- next/image with sizes and aspect-ratio containers on every plate.
- ScrollTrigger.refresh() after fonts load and on debounced resize; gsap.context revert on unmount.
- Reduced motion: disable Lenis, disable the manifesto pin and scrub, disable the timeline draw (render the final state), keep static layout.
- Target LCP < 2.2s, CLS < 0.04.

## ACCESSIBILITY
- Display serif at large sizes needs 3:1; body must clear 4.5:1 against --paper.
- Ornamental rules, seal glyphs and the grain overlay: aria-hidden, pointer-events-none.
- Variant rows: role="radiogroup", accessible names including the variant, price and availability.
- Timeline: semantic ordered list; the visual spine is decorative.
- Focus rings: 2px --seal, offset 3px.
- Any historical or provenance claim must be attributable — render the source line rather than dropping it.

## STRICT RULES
- No `any`. Strict TS.
- Never more than three families, and the condensed grotesque never appears at body size.
- Motion is slow and soft: 700–1100ms, power3.out. Nothing snappy.
- Ornament is structural (rules, seals, frames) — never decorative clip-art.
- Fully designed at 375px, including the timeline (vertical) and the double-rule frames (reduced inset).
```

---

## TEMPLATE 07 — Pop Confection

```
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build the site for "{{PRODUCT_NAME}}" by {{BRAND_NAME}}, a {{PRODUCT_CATEGORY}}. Art direction: pop confection — saturated candy palette, chunky rounded type, squash-and-stretch physics, packaging as hero. Joyful, appetite-led, structurally disciplined. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: Tailwind CSS v4 (@theme)
- Animation: Framer Motion (spring, drag, layout), CSS keyframes
- Smooth scroll: Lenis (lerp 0.09)
- Icons: Lucide React, strokeWidth 2.5
- Language: TypeScript strict

## DESIGN SYSTEM
Colors:
  --bg: #FFF9F0
  --bg-2: #FFE9D6
  --berry: #FF4E8A
  --citrus: #FFC531
  --mint: #3DD9A4
  --grape: #7B5CFF
  --ink: #191419
  --muted: #7A6E72
  --accent: {{ACCENT_HEX}} (fallback --berry)
Typography:
  Display: "Bricolage Grotesque" or "Clash Display" weight 700–800, tracking -0.035em, leading 0.9
  Body: "Satoshi" weight 400/500, leading 1.6, 16.5px
  Scale: h1 clamp(3rem, 10vw, 8.5rem) / h2 clamp(2.25rem, 5.5vw, 4.5rem)
Shape: radius 28px cards, 999px buttons, 40px large surfaces. Signature: a 3px --ink border plus a 6px 6px 0 --ink hard offset shadow on cards and buttons; on hover, translate(3px,3px) with the shadow shrinking to 3px 3px 0 (a "press"), 140ms cubic-bezier(0.2,0,0,1).

## SECTIONS

### 1. Shell
- Confetti shapes (circles, arcs, squiggles) in the four palette colours positioned absolutely per section, drifting ±50px on scroll parallax at differing rates. Inline SVG, aria-hidden, pointer-events-none.
- Section separators: a chunky 4px --ink wave or zigzag SVG divider.
- Rhythm py-24 mobile / py-36 desktop.

### 2. Navbar
- Floating bar, top-4, mx-4, bg --bg, 3px --ink border, 5px 5px 0 --ink shadow, radius 999px.
- Left {{BRAND_NAME}} in display. Center links weight 500. Right: bag icon with a --berry count badge and a "{{PRIMARY_CTA}}" pill in --berry with white text.
- Link hover: a --citrus rounded highlight scales in behind (layoutId, spring stiffness 380 damping 30).
- Mobile: the bar expands downward (layout height auto), links stacked with 3px --ink dividers.

### 3. Hero
- Two columns (6/6), stacked on mobile.
- Left: h1 "{{PRODUCT_NAME}}" with each word entering rotate(-5deg → 0), y 44 → 0, spring (stiffness 210 damping 17), stagger 0.07. One word gets a --citrus rounded-rect highlight scaling in from scaleX(0) after the text lands. Then {{TAGLINE}}, {{PRICE}} in tabular-nums, and the CTA row.
- Right: the packaging shot with a gentle idle float (y ±8px, 4s ease-in-out infinite) and a squash-and-stretch entrance (scaleY 1.12 → 0.94 → 1 with a spring). Two or three draggable flavour tokens orbit it (Framer Motion drag within bounds, dragElastic 0.16, dragDirectionLock, whileDrag scale 1.06 rotate 3deg).
- Beneath: a chunky claims row — three --bg-2 pills with 3px --ink borders and icons.

### 4. Flavour Selector
- Full-bleed --bg-2 band with 4px --ink top and bottom borders.
- A row of flavour tiles from {{VARIANTS}}: each a 3px --ink bordered rounded square in that flavour's colour, with the name beneath.
- Selecting a flavour: the hero packaging shot swaps (spring scale 0.92 → 1, 320ms) and the page's --accent CSS variable retints the CTA and highlights. Guard the swap so a rapid click sequence does not queue animations — cancel and restart.
- Below md: a horizontal scroll-snap rail.

### 5. Ingredient / Benefit Cards
- 3-column grid (1 below md), each card with the full signature treatment and a distinct palette background (cycle --bg-2, --mint at 25%, --citrus at 30% — never all the same).
- Each card: a 52px geometric icon in a solid-colour circle, a display heading, body copy.
- Entrance: whileInView y 32 → 0 with a spring, stagger 0.08.
- Benefits {{FEATURE_1}} … {{FEATURE_6}}.

### 6. Nutrition / Facts Panel
- A --bg card with a 3px --ink border styled as a bold facts panel: a display header bar in --ink with --bg text, then rows separated by 2px --ink rules, values in tabular-nums.
- Built from {{DETAIL_1}}–{{DETAIL_6}}. Below md the rows stay two-column (label left, value right) — never stack, it breaks the panel idiom.

### 7. Buy Section (the commerce core)
- Two columns: left a sticky gallery — main shot plus a 4-thumb rail, each thumb a 3px --ink bordered square; click swaps with a 200ms spring; tap/hover zoom 2x.
- Right purchase panel on --bg with the full signature treatment:
    Display name, {{TAGLINE}}
    {{PRICE}} in display tabular-nums, plus a per-unit price in --muted
    Flavour selector (mirrors section 4, kept in sync — one shared state, never two sources of truth)
    Pack-size selector as chunky pill buttons showing the unit price on each, with a "best value" --citrus tag on the largest
    Quantity stepper with chunky +/- buttons, max clamped to real stock
    Full-width "{{PRIMARY_CTA}}" in --berry
    Three collapsible rows: Ingredients, Allergens, Shipping & returns — Allergens must be its own row, never merged into ingredients
- Add to bag opens a cart drawer (x 100% → 0, 340ms spring) with a free-shipping threshold progress bar in --mint, line items, steppers, subtotal, and checkout.

### 8. Reviews + FAQ
- Reviews: signature-treatment cards, --citrus stars, a flavour label pill on each, verified badge.
- FAQ: accordion of separate bordered cards with 12px gaps, height auto + opacity 260ms, chevron rotating, one open at a time.

### 9. Footer
- bg --ink, text --bg. Four columns, display headers, socials as 3px bordered squares with --citrus hover fill, {{CONTACT_EMAIL}}, and an allergen/regulatory line.

## STATES & EDGE CASES (mandatory)
- Allergen information is never collapsed behind a generic label and never omitted. If allergen data is absent from the input, render the row with "Contact us for allergen information" rather than hiding it.
- Out of stock per flavour: the tile gets a --ink diagonal strike and an accessible name stating it; selecting it is blocked and the CTA explains why with a "Notify me" path.
- Rapid flavour switching: cancel in-flight animations rather than queueing; the displayed flavour must always match state.
- Loading: signature-treatment skeleton cards keep their 3px border and hard shadow, contents replaced by --ink/10 bars with a 1.2s shimmer. The structure never collapses.
- Empty cart: a bordered card with a confetti illustration, one line, and a primary button.
- Error: a bordered card with a --berry 25% fill, plain-language copy, and a full-treatment "Try again" button.
- Drag on touch: dragDirectionLock so tokens never hijack vertical scroll; reduce dragElastic to 0.08.
- Forms: 3px --ink bordered inputs with a 4px 4px 0 shadow; focus shifts the shadow to --grape; errors in --berry below the field, aria-live="polite".
- 404: an oversized display "404" with scattered confetti and a home button.

## PERFORMANCE
- Hard shadows are cheap (no blur) but cap concurrent drag listeners and animate transform only.
- Confetti as inline SVG, aria-hidden, pointer-events-none, parallax via transform.
- next/font for both families, preload the display weight.
- next/image with sizes and aspect ratios on every packaging shot.
- Reduced motion: disable confetti parallax and the idle float, disable drag inertia (keep drag), replace spring entrances with a 180ms opacity fade, keep the press-hover (it is instant) but remove overshoot easing.
- Target LCP < 2.0s, CLS < 0.05.

## ACCESSIBILITY
- Bold palette combinations must clear 4.5:1 for body text — verify --ink on --citrus, --berry, --mint and --grape specifically, and darken the surface rather than lightening the text.
- Flavour tiles: role="radiogroup", accessible names including flavour and availability. Colour must never be the sole differentiator — the name label is always present.
- Draggable tokens are decorative: aria-hidden, with all their information available in the flavour selector.
- The press-hover gesture must also fire on :focus-visible.
- Focus rings: 3px --grape, offset 3px — thick enough to read against the bold borders.
- Nutrition panel: semantic <table> with <caption> and scope attributes.

## STRICT RULES
- No `any`. Strict TS.
- Never blur a shadow. Hard offset only — that is the signature.
- Maximum four palette colours on screen at once.
- Playful must not become childish: the grid stays strict and the copy stays adult.
- Allergen and nutrition information is presented plainly and completely. Styling never obscures it.
- Fully designed at 375px, including the facts panel (two-column rows preserved) and the flavour rail.
```

---

## TEMPLATE 08 — Gallery Object

```
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build the site for "{{PRODUCT_NAME}}" by {{BRAND_NAME}}, a {{PRODUCT_CATEGORY}}. Art direction: gallery object — museum wall, generous negative space, caption-led typography, the product treated as an exhibited work. Quiet authority. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: Tailwind CSS v4 (@theme)
- Animation: Framer Motion (subtle), GSAP ScrollTrigger for one pinned sequence only
- Smooth scroll: Lenis (lerp 0.05)
- Icons: Lucide React, strokeWidth 1
- Language: TypeScript strict

## DESIGN SYSTEM
Colors:
  --wall: #EFEDE8
  --wall-2: #E4E1DA
  --fg: #14130F
  --muted: #7D7A72
  --line: #D3CFC5
  --accent: {{ACCENT_HEX}} (fallback #14130F)
Typography:
  Display: "Söhne" or "Neue Haas Grotesk" weight 500, tracking -0.025em, leading 1.0
  Caption: same family weight 400 italic, 13.5px, --muted — used for every image caption, museum-label style
  Body: same family weight 400, leading 1.7, 16.5px, measure max 62ch
  Labels: weight 500, uppercase, tracking 0.26em, 10px
  Scale: h1 clamp(2.5rem, 6vw, 5rem) / h2 clamp(1.875rem, 3.5vw, 3rem)
Rules: radius 0. No shadows. Framing is done with generous whitespace and 1px --line captions rules.

## SECTIONS

### 1. Shell
- Everything sits on --wall. Alternate --wall-2 for at most two sections in the whole page.
- Extreme vertical rhythm: py-32 mobile / py-56 desktop. Whitespace is the primary design element.
- Every image is followed by a museum-style caption: a 1px --line rule, then the caption line in italic --muted (title, material, dimensions, year).

### 2. Navbar
- Static at the top, no background, no border — it simply sits on the wall. Becomes fixed after 240px scroll with a fade-in --wall/90 backdrop-blur-sm.
- Left "{{BRAND_NAME}}" at 15px weight 500, tracking 0.12em. Center: label-styled links. Right: a bag icon with a count and a text-link CTA (no pill — a filled button would break the register).
- Link hover: colour --muted → --fg only, 200ms. No underline, no movement.
- Mobile: a full-screen --wall panel, links at 24px weight 500, no decoration.

### 3. Hero
- min-h-[88vh], the product shot centered at up to 62% viewport height with enormous surrounding space.
- Above it: a label with the collection or edition. Below it: the museum caption.
- h1 "{{PRODUCT_NAME}}" sits beneath at clamp(2.5rem,6vw,5rem), followed by {{TAGLINE}} in --muted and {{PRICE}} in tabular-nums.
- Entrance: the image opacity 0 → 1 with scale 1.02 → 1 over 1.1s ease [0.16,1,0.3,1]; text follows with y 20 → 0, stagger 0.09. Nothing else.

### 4. Views (Pinned — the only pin in the page)
- GSAP pin for +=1000px showing the object from four angles.
- Progress maps to an activeIndex; guard the update behind a ref so React re-renders only on change.
- Swap: a pure crossfade (opacity only, 600ms) — no movement. The object stays perfectly still while the view changes, like a plinth rotating.
- A caption beneath updates with each view. An index readout ("02 / 04") in label styling.
- Mobile: no pin — a horizontal scroll-snap rail with the same captions.

### 5. Material Notes
- Two columns: left a detail macro shot with its caption; right a body paragraph and a definition list of {{DETAIL_1}}–{{DETAIL_4}} with 1px --line rows.
- Reveal: opacity only, 700ms, whileInView once. No translation — movement is out of register for this AD.

### 6. Process
- Three or four archival process images in an irregular grid (deliberately uneven column spans), each with its own caption.
- Between them, short body paragraphs at max-w-md placed asymmetrically.
- No connectors, no numbers, no icons. The sequence is implied by placement.

### 7. Buy Section (the commerce core)
- Two columns: left a sticky gallery — main plate with a thumbnail rail beneath, each thumb bare (no border, no radius) with the active one at full opacity and the rest at 50%. Click swaps with a 260ms crossfade. Click-to-open a fullscreen lightbox with a 2.5x pan zoom, arrow navigation, Escape close, focus trap.
- Right purchase panel — no card, no border, just a column on the wall:
    {{PRODUCT_NAME}} at h2 scale, then a museum caption line
    {{PRICE}} in tabular-nums at 22px
    Variant selector from {{VARIANTS}} as a plain text list — each row a label with a 1px --line above, the selected one marked by a small --accent square and full-opacity text while others sit at 55%. Sold-out rows show "Sold" in italic --muted.
    Quantity stepper as bare text controls with tabular-nums
    "{{PRIMARY_CTA}}" as a full-width --fg filled rectangle with --wall text — the one solid element on the page, and that contrast is the point
    A 1px --line rule, then three collapsible rows: Materials & dimensions ({{DETAIL_1}}–{{DETAIL_6}}), Shipping & handling, Provenance
    A short line on edition size or availability where applicable
- Add to bag opens a cart drawer (x 100% → 0, 400ms, opacity-led) on --wall with a 1px --line left border: bare thumbnails, captions, steppers, subtotal in tabular-nums, checkout.

### 8. Reviews
- Deliberately restrained: no stars. Three short quotes in italic at 19px with attribution in label styling beneath, separated by 1px --line rules.
- If a star rating is required by the input, render it small and in --muted rather than --accent.

### 9. Footer
- --wall-2, three columns, label-styled headers, --muted 13px links, {{CONTACT_EMAIL}}, and a bottom line at 11px.

## STATES & EDGE CASES (mandatory)
- Sold out: the variant row reads "Sold" in italic --muted and the CTA becomes "Enquire" opening a contact form — appropriate to the register, never "Notify me for restock" on a one-of-a-kind object.
- Limited edition: state the edition size and remaining count only if the data is real. If absent, omit entirely.
- Loading: --wall-2 blocks at exact final dimensions with a slow 2s opacity pulse. No shimmer.
- Empty cart: a single italic --muted line and a text link. Empty reviews: omit the section entirely rather than showing an empty state — this AD tolerates absence.
- Image failure: the reserved space remains with a --wall-2 fill and an italic caption "Image unavailable". Never a broken-image glyph.
- Lightbox: focus trapped, Escape closes, arrow keys navigate, focus returned to the trigger.
- Forms: bare inputs with a border-b 1px --line only, labels above in label styling, errors in italic --muted with a small --accent marker, aria-live="polite".
- 404 and 500 as quiet wall notices with navigation intact.

## PERFORMANCE
- One font family, one variable file — next/font with size-adjust.
- Only one pinned section in the entire page. ScrollTrigger.refresh() after fonts load and on debounced resize; gsap.context revert on unmount.
- next/image with sizes and aspect-ratio containers; images are large and few, so prioritize the hero and lazy-load everything else.
- Reduced motion: disable Lenis, disable the pin (the four views become a static grid), replace all entrances with instant opacity.
- Target LCP < 2.0s, CLS < 0.03.

## ACCESSIBILITY
- Captions must be real <figcaption> elements inside <figure>, not styled divs — they carry the object's information.
- Alt text describes the view and the object, distinct from the caption text (never duplicate the caption verbatim into alt).
- Variant list: role="radiogroup" with accessible names including availability.
- The single filled CTA must clear 4.5:1 — verify --wall on --fg.
- Focus rings: 2px --accent, offset 2px, visible against --wall and --wall-2.
- Lightbox: aria-modal="true", focus trapped, Escape closes.

## STRICT RULES
- No `any`. Strict TS.
- One font family. One filled element per page (the CTA). One pinned section.
- Motion is opacity-led. Translation above 24px and any scale above 1.02 is out of register.
- Whitespace is the luxury signal — resist every instinct to fill it.
- Fully designed at 375px with the same proportional generosity; the pin becomes a snap rail.
```

---

## TEMPLATE 09 — Performance Athletic

```
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build the site for "{{PRODUCT_NAME}}" by {{BRAND_NAME}}, a {{PRODUCT_CATEGORY}}. Art direction: performance athletic — motion-blur energy, data overlays, diagonal cuts, high-contrast sport photography. Kinetic and evidence-led. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: Tailwind CSS v4 (@theme)
- Animation: GSAP (ScrollTrigger, SplitType, quickTo), Framer Motion
- Charts: Recharts (dynamically imported)
- Smooth scroll: Lenis (lerp 0.07), scrollerProxy-wired to ScrollTrigger
- Icons: Lucide React, strokeWidth 2
- Language: TypeScript strict

## DESIGN SYSTEM
Colors:
  --bg: #0C0D10
  --bg-2: #14161B
  --surface: #1B1E25
  --fg: #F2F4F7
  --muted: #79808D
  --line: #262A33
  --volt: {{ACCENT_HEX}} (fallback #D7FF3E)
  --heat: #FF5A1F
Typography:
  Display: "Archivo Expanded" weight 800, uppercase, tracking -0.03em, leading 0.86
  Body: "Inter" weight 400/500, leading 1.55, 15.5px
  Data: "Inter" tabular-nums, weight 600
  Labels: uppercase, tracking 0.2em, 10.5px, --muted
  Scale: h1 clamp(3rem, 12vw, 11rem) / h2 clamp(2.25rem, 6vw, 5rem)
Signature: diagonal section cuts via clip-path polygon (a 3–4deg slant on the top and bottom edges of alternating sections), and --volt data overlays pinned to product photography.

## SECTIONS

### 1. Shell
- Sections alternate --bg and --bg-2 with diagonal clip-path edges. Every clipped section needs extra vertical padding so content never lands inside the slant.
- Fixed 2px --volt scroll-progress bar at viewport top.
- Grain overlay opacity 0.04, mix-blend-overlay, aria-hidden.

### 2. Navbar
- Sticky, height 62px, bg --bg/85 backdrop-blur-sm, border-bottom 1px --line.
- Left {{BRAND_NAME}} in display uppercase 17px. Center: label-styled links. Right: bag with a --volt count badge and a "{{PRIMARY_CTA}}" rectangle in --volt with --bg text.
- Link hover: a 2px --volt underline scales from scaleX(0) origin-left, 200ms.
- Mobile: full-screen --bg panel, links in display at clamp(2.25rem,11vw,4rem), entering with clip-path inset(0 0 100% 0) → inset(0), stagger 0.05.

### 3. Hero
- min-h-screen. Background: {{HERO_ASSET}} as a full-cover video or action still at opacity 0.5, with a linear-gradient(to top, --bg, transparent 60%).
- h1 "{{HERO_HEADLINE}}" in display uppercase, SplitType by character, y 100% → 0 with a clip-path reveal, stagger 0.016, 0.95s power4.out.
- The product shot cuts in over the photography at a slight rotation (-4deg), entering scale 1.08 → 1 with a spring.
- Three --volt data overlays pinned to the shot with thin leader lines drawing in via stroke-dashoffset — each a spec figure from {{DETAIL_1}}–{{DETAIL_3}} in tabular-nums.
- CTA row: a --volt filled rectangle and a bordered secondary.
- Scroll cue: a --volt chevron with a 1.6s bounce.

### 4. Performance Data
- Full-bleed --bg-2 band with diagonal edges.
- Three or four figures in display at clamp(2.5rem,6vw,5rem), tabular-nums, CountUp on entry (1.5s ease-out), each with a label and a one-line qualifier in --muted stating the test condition.
- Beside them, a small Recharts comparison chart with a --volt series on a --line grid and a visually-hidden text summary.

### 5. Tech Slabs
- Alternating full-bleed rows with diagonal edges, min-h-[75vh].
- One side: a macro shot of the technology with a --volt callout overlay. Other side: a label, a display heading, body copy, and a small spec strip in tabular-nums.
- Heading enters via SplitType by character with a clip-path reveal at 65% viewport entry.
- Technologies {{FEATURE_1}} … {{FEATURE_4}}.

### 6. Fit / Sizing (the commerce-critical section)
- A fit scale: a horizontal --line track with a --volt marker showing where this product sits (e.g. snug ↔ relaxed), plus a short explanatory line.
- A "Find your size" tool: two or three inputs (measurement, usual size, use case) producing a recommendation. It must state its confidence and offer the size guide as a fallback — never present a recommendation as certain.
- "Size guide" opens a modal with a semantic measurement <table> including <caption> and scope attributes. Focus trapped, Escape closes.

### 7. Buy Section (the commerce core)
- Two columns: left a sticky gallery — main shot plus a 5-thumb rail (including an on-body or in-use view), click swaps with a 200ms crossfade, hover/tap zoom 2.5x with pointer-following pan.
- Right purchase panel on --surface with a 1px --line border:
    Display name, label-styled category, star rating with count
    {{PRICE}} in display tabular-nums
    Colourway selector from {{VARIANTS}} — 36px swatches with a 1px --line ring, selected gets a 2px --volt ring and offset, each with a visible colour name (never colour alone)
    Size selector as a grid of square tiles, sold-out sizes struck through with an accessible name stating it, and a "Notify me" link appearing when a sold-out size is focused or selected
    Quantity stepper, then a full-width --volt CTA with --bg text
    A shipping line with a real date range and a returns window
    Three collapsible rows: Specifications ({{DETAIL_1}}–{{DETAIL_6}}), Fit & sizing, Shipping & returns
- Add to bag opens a cart drawer (x 100% → 0, 300ms) with line items showing colourway and size, steppers, subtotal, and checkout.

### 8. Reviews
- Aggregate row with --volt stars, average to one decimal, count.
- A fit-feedback bar ("runs small ↔ runs large") aggregated from reviews, with a --volt marker and tabular-nums percentages.
- Three review cards on --surface with 1px --line: stars, body, a verified-buyer pill, and the reviewer's stated size and use case where available.

### 9. Footer
- --bg, 1px --line top, five columns, label-styled headers, --muted 12.5px, {{CONTACT_EMAIL}}, and a sizing-help link.

## STATES & EDGE CASES (mandatory)
- Size sold out: the tile is struck through with an accessible name, and selecting it surfaces a "Notify me" inline capture rather than a dead disabled state.
- Colourway sold out entirely: the swatch is struck through and the size grid updates to that colourway's real availability — never show sizes that cannot be bought in the selected colour.
- Colour + size combination invalid: resolve to the nearest valid size and announce the change via aria-live="polite". Never allow an invalid add-to-bag.
- Size recommendation tool: if inputs are insufficient, say so and link the size guide. Never output a confident recommendation from partial data.
- Every performance figure carries its test condition. If the injected data lacks one, render the figure with a "test conditions available on request" qualifier rather than dropping the qualifier slot.
- Loading: --surface blocks with a --volt bar sweep, 1.1s, at exact final dimensions.
- Empty cart: display-uppercase line and a link back. Empty reviews: "No reviews yet" with a write-review link.
- Error: --surface card with a 2px --heat left border, plain-language copy, a bordered retry.
- Forms: --bg-2 inputs with 1px --line, 2px --volt focus ring, validation on blur, aria-describedby, aria-live="polite".
- 404 and 500 in the same system.

## PERFORMANCE
- Diagonal clip-paths are cheap but they break sticky positioning if applied to a sticky ancestor — clip the inner wrapper, never the sticky container.
- Recharts imported dynamically (ssr false).
- gsap.quickTo for anything following the pointer.
- Video ≤ 1080p, ≤ 3 MB, preload="metadata", paused via IntersectionObserver off-screen, poster mandatory.
- ScrollTrigger.refresh() after fonts load and on debounced resize; gsap.context revert on unmount.
- next/font, preload the display weight — it is the LCP element.
- Reduced motion: disable Lenis, disable scrubs and character reveals, render CountUp finals instantly, pause video and show posters.
- Target LCP < 2.3s, CLS < 0.04, INP < 190ms.

## ACCESSIBILITY
- --volt on --bg and --bg on --volt must both clear 4.5:1 at body size — verify; --volt is bright and commonly fails as text on light surfaces.
- Colourway swatches: role="radiogroup", accessible names including the colour name and availability. Colour is never the sole differentiator.
- Size tiles: role="radiogroup", accessible names including size and stock state.
- Size guide modal: semantic table, focus trapped, Escape closes.
- Data overlays and leader lines are decorative: aria-hidden, with the same figures present in the specification list.
- Charts have visually-hidden text summaries.
- Focus rings: 3px --volt, offset 2px.

## STRICT RULES
- No `any`. Strict TS.
- Every performance claim carries its test condition. Unqualified figures are an automatic fail.
- Diagonal cuts are structural, not decorative — a maximum of one slant angle across the whole page.
- Two saturated colours maximum: --volt and --heat never share a section.
- Fully designed at 375px, including the size grid, the fit tool, and the diagonal cuts (reduce the angle to 2deg so slants do not eat content).
```

---

## TEMPLATE 10 — Artisan Warmth

```
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build the site for "{{PRODUCT_NAME}}" by {{BRAND_NAME}}, a {{PRODUCT_CATEGORY}}. Art direction: artisan warmth — workshop light, hand-made texture, maker-led story, honest imperfection. Tactile, slow, human. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: Tailwind CSS v4 (@theme)
- Animation: Framer Motion (soft springs), GSAP ScrollTrigger for the process sequence
- Smooth scroll: Lenis (lerp 0.06)
- Icons: Lucide React, strokeWidth 1.25
- Language: TypeScript strict

## DESIGN SYSTEM
Colors:
  --bg: #F6F1E9
  --bg-2: #EBE2D5
  --clay: #B46B4A
  --moss: #6F7A56
  --fg: #2A241D
  --muted: #857A6C
  --line: #DCD1BF
  --accent: {{ACCENT_HEX}} (fallback --clay)
Typography:
  Display: "Newsreader" or "Fraunces" weight 400–500, italic available, tracking -0.012em, leading 1.08
  Body: "Inter" weight 400, leading 1.75, 16.5px, measure max 64ch
  Labels: weight 500, uppercase, tracking 0.18em, 10.5px, --muted
  Handwritten accent (used sparingly, max twice per page): "Caveat" for a maker's note signature only
  Scale: h1 clamp(2.5rem, 6.5vw, 5.25rem) / h2 clamp(1.875rem, 4vw, 3.25rem)
Shape: radius 4px on structural surfaces, 999px on buttons. Shadow 0 2px 18px rgba(42,36,29,0.05).
Texture: a linen/paper grain (feTurbulence baseFrequency 0.68, opacity 0.05, mix-blend-multiply), fixed, aria-hidden.

## SECTIONS

### 1. Shell
- Rhythm py-24 mobile / py-40 desktop. Sections separated by whitespace and the occasional 1px --line rule.
- Images are deliberately imperfect in placement: alternate slight offsets from the grid (±16px) rather than perfect centering. This is a designed decision, not sloppiness — keep it consistent.

### 2. Navbar
- bg --bg/90 backdrop-blur-md, border-bottom 1px --line, height 72px, sticky.
- Left {{BRAND_NAME}} in display. Center: label-styled links. Right: bag icon with a --clay count and a "{{PRIMARY_CTA}}" pill in --clay with --bg text.
- Link hover: a --clay underline draws left-to-right, 300ms.
- Mobile: a --bg-2 overlay, links in display at clamp(2rem,9vw,3.25rem), staggered soft entrance.

### 3. Hero
- Two columns (7/5). Left: label, h1 "{{PRODUCT_NAME}}" with one word in display italic --clay, {{TAGLINE}} in --muted at 18px, {{PRICE}} in tabular-nums, CTA row, and a small maker's line ("Made in {place} by {n} hands") in --muted.
- Right: the product shot slightly rotated (1.5deg) in a soft frame, entering scale 0.97 → 1, y 28 → 0, spring (stiffness 160 damping 24).
- Entrance for text: SplitType by word, opacity 0 → 1, y 14 → 0, stagger 0.07, 900ms power3.out.

### 4. Maker Story
- Asymmetric two-column. Left: a workshop portrait in a soft frame with a --muted italic caption. Right: display heading, two body paragraphs, and a "Caveat"-font signature (the first of at most two uses on the page).
- Reveal: opacity and y 24 → 0, 700ms, whileInView once.

### 5. Process Sequence (Pinned)
- GSAP pin for +=1200px. Four process steps.
- Center: a large process photograph. Left: the step number in display and its name. Right: two lines of body plus a duration or technique note.
- Progress maps to activeIndex, guarded behind a ref so React re-renders only on change.
- Swap: crossfade with y 20 → 0 → -20, 640ms, ease [0.16,1,0.3,1]. A thin --clay progress line beneath advances with scrub.
- Mobile: no pin — a vertical stack with the photograph above each step's text.

### 6. Materials
- Three or four material cards on --bg-2 with 1px --line and 4px radius: a macro swatch image, the material name in display, its origin, and a one-line property note.
- Sourcing statements must name the origin. If the input lacks it, render "Origin available on request" rather than omitting the field.
- Details {{DETAIL_1}} … {{DETAIL_4}}.

### 7. Buy Section (the commerce core)
- Two columns: left a sticky gallery — main shot plus a 4-thumb rail (including a scale/in-hand reference shot, which matters disproportionately for handmade goods), click swaps with a 260ms crossfade, hover/tap zoom 2.2x with pointer-following pan.
- Right purchase panel on --bg with a 1px --line border and p-9:
    Display name, label-styled category, star rating with count
    {{PRICE}} in display tabular-nums
    Variant selector from {{VARIANTS}} as labelled rows with a small swatch and the variant name, separated by 1px --line; selected gets a --clay left border 2px and a --bg-2 fill
    A "each piece varies" note in --muted italic where applicable — set expectations before purchase, not in the returns policy
    Quantity stepper, max clamped to real stock
    Full-width "{{PRIMARY_CTA}}" in --clay
    A lead-time line stating the real make time if the item is made to order, shown prominently and never buried
    Three collapsible rows: Materials & dimensions ({{DETAIL_1}}–{{DETAIL_6}}), Care, Shipping & returns
    A gift-wrap checkbox if applicable
- Add to bag opens a cart drawer (x 100% → 0, 380ms, soft spring) on --bg with a 1px --line left border: line items, steppers, a gift-note textarea, subtotal in tabular-nums, and checkout.

### 8. Care Instructions
- A short illustrated list: four items, each a thin --clay line icon, a short heading, and one line of body. Presented as content, not hidden in an accordion — care is part of the purchase decision here.

### 9. Reviews
- Aggregate row with --clay stars, average to one decimal, count.
- Three review cards on --bg-2 with 1px --line: display-italic pull quote, attribution in label styling, a verified-purchase note, and a small photo where provided.

### 10. FAQ + Footer
- FAQ: accordion with 1px --line separated rows, height auto + opacity 280ms, one open at a time.
- Footer: --bg-2, four columns, --muted 14px, {{CONTACT_EMAIL}}, socials as --bg circles with --clay icon hover, and a short workshop-address line.

## STATES & EDGE CASES (mandatory)
- Made to order: the lead time appears in the purchase panel above the CTA, not inside a collapsible row. If lead time data is absent, render "Lead time confirmed at checkout" rather than implying immediate dispatch.
- One-of-a-kind item sold: the CTA becomes "Commission similar" opening a contact form, and the piece is marked "Sold" — appropriate to handmade goods.
- Natural variation: the "each piece varies" note must be visible before add-to-bag, never only in returns.
- Low stock: show the real remaining count only if the data is real. No fabricated scarcity.
- Loading: --bg-2 blocks at 45% opacity with a gentle 2s pulse. No hard shimmer.
- Empty cart: an italic --muted line and a text CTA. Empty reviews: "No reviews yet" with a write-review link.
- Image failure: the frame remains, filled --bg-2, with an italic --muted caption.
- Forms: inputs with 1px --line and 4px radius, 2px --clay focus ring, errors in --clay 13px italic, aria-live="polite", success replaces the form with a --bg-2 confirmation card.
- Cart drawer and gallery zoom: focus trapped, Escape closes, focus restored.
- 404 and 500 in the same warm system.

## PERFORMANCE
- Three families is the ceiling, and "Caveat" loads only if the maker's signature is actually rendered — gate it behind the component, never load it globally.
- next/font with size-adjust on the display family (serif swap shift is the main CLS risk).
- Guard the pinned process index behind a ref so scrolling does not re-render React per pixel.
- next/image with sizes and aspect-ratio containers; the in-hand scale shot should be prioritized in the gallery preload.
- ScrollTrigger.refresh() after fonts load and on debounced resize; gsap.context revert on unmount.
- Reduced motion: disable Lenis, disable the process pin (stack the steps), replace springs with a 200ms opacity fade, keep the deliberate offsets (they are static).
- Target LCP < 2.1s, CLS < 0.04.

## ACCESSIBILITY
- --muted on --bg and --bg on --clay must clear 4.5:1 — darken --clay for button surfaces rather than lightening the text.
- Variant rows: role="radiogroup", accessible names including the variant, price and availability.
- Process sequence: the full process information must also exist in static text, not only inside the pinned animation.
- Handwritten accent font is decorative — never use it for information that must be read, and ensure it is not the only carrier of the maker's name.
- Focus rings: 2px --clay, offset 2px. Grain overlay aria-hidden, pointer-events-none.
- Care instructions must be real text, never an image of text.

## STRICT RULES
- No `any`. Strict TS.
- The handwritten font appears at most twice per page, never at body size, never for critical information.
- Motion is slow and soft: 600–1000ms, gentle springs, no overshoot above 1.02.
- Lead time, natural variation and sourcing are disclosed before purchase, prominently. Burying them is an automatic fail.
- Deliberate grid offsets stay consistent — imperfection is designed, not random.
- Fully designed at 375px, including the process sequence (stacked) and the purchase panel (below the gallery, with a sticky bottom bar carrying price and CTA).
```

---

## Notes d'implémentation pour ta base de données

**Champs à stocker par prompt :**

| Champ | Exemple |
|---|---|
| `id` | `product-01-luxury-noir` |
| `category` | `product` |
| `art_direction` | `Luxury Noir Editorial` |
| `template` | le corps du prompt complet |
| `variables` | `["BRAND_NAME", "PRODUCT_NAME", "VARIANTS", …]` |
| `commerce_surfaces` | `["gallery", "variants", "cart-drawer", "reviews", "size-guide"]` |
| `stack_tags` | `["nextjs", "tailwind", "gsap", "framer-motion", "lenis"]` |
| `complexity` | `medium` / `high` |
| `target_tools` | `["lovable", "v0", "bolt", "cursor", "claude-code"]` |

**Ce que ta couche IA doit gérer en plus, sur le domaine product :**

0. **Le gating des assets, avant tout le reste.** Compte ce que l'utilisateur a fourni, puis émets uniquement le chemin correspondant (voir la section ASSET GATING en haut du fichier). Règle simple à coder :

```
nb_images = assets.filter(image).length
a_video   = assets.some(a => /\.(mp4|webm|mov)$/i.test(a))
a_3d      = assets.some(a => /\.(glb|gltf)$/i.test(a))
a_frames  = assets.frameSequence?.length >= 12

path = a_3d || a_frames ? "advanced"
     : a_video          ? "video"
     : nb_images >= 3   ? "enhanced"
     :                    "standard"
```

Puis, dans le template, garde le bloc du chemin retenu et **supprime les blocs des autres chemins ainsi que leurs marqueurs `[REQUIRES: …]`**. Le prompt final ne doit jamais contenir le mot « fallback » ni un marqueur : l'IA de génération doit lire une spécification unique et non ambiguë.

Cas par défaut : **une seule image produit suffit pour tous les templates.** C'est la garantie que ta V1 ne produit jamais de page cassée, quel que soit ce que l'utilisateur uploade.

1. **Le `{{VARIANTS}}` est un tableau, pas une chaîne.** Si l'utilisateur ne fournit qu'une variante, supprime le sélecteur entier plutôt que d'afficher un contrôle à une seule option.
2. **Les sections conditionnelles.** Guide des tailles, abonnement, comparateur avant/après, indications d'allergènes, délai de fabrication — chacune ne s'applique qu'à certaines catégories. Ta couche IA doit les retirer proprement, en supprimant la section entière plutôt qu'en laissant un titre orphelin.
3. **Le panier est toujours présent.** Même sur une page mono-produit, le tiroir panier, ses états et son piège à focus font partie du livrable — c'est la partie que les prompts publics oublient systématiquement.
4. **Ne jamais inventer de données commerciales.** Stock, notes, délais, résultats d'études : si l'input ne les fournit pas, le template doit produire le repli explicite prévu, jamais un chiffre inventé. C'est aussi ce qui protège tes utilisateurs juridiquement.

**Le point le plus important, comme sur le set SaaS :** aucun `{{PLACEHOLDER}}` non résolu ne doit sortir dans l'output final.
