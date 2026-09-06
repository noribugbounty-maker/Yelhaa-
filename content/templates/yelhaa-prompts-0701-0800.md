# Yelhaa Generated Prompt Templates 0701–0800

TEMPLATE 701 — Swiss Brutalist Monochrome — Boutique Travel / Experiential Tourism Brand

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a boutique travel / experiential tourism brand ({{PRODUCT_CATEGORY}}). Art direction: swiss brutalist monochrome — raw grid discipline, oversized type as the only ornament, zero decorative imagery. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: styled-components with a typed theme object
- Animation: Framer Motion + Lenis smooth scroll
- Extra: next/font for all typography
- Icons: lucide-react
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #FFFFFF
  --surface: #F2F2F0
  --border: #DEDEDA
  --fg: #0B0B0B
  --muted: #7A7A78
  --accent: {{ACCENT_HEX}} (fallback #0B0B0B)
Typography:
  Display: "Neue Haas Grotesk Display" — used for H1/H2, tight tracking
  Body: "Neue Haas Grotesk Text" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: max 2px, mostly 0
  Signature mechanic: full-bleed horizontal marquee statement + numbered editorial list rows
  Motion signature: power4.out / cubic-bezier(0.16,1,0.3,1), no linear

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #FFFFFF/90 with backdrop-blur(16px) after 40px scroll, transition 400ms power4.out / cubic-bezier(0.16,1,0.3,1).
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Neue Haas Grotesk Display, weight 700.
- Center/right links styled per the Swiss Brutalist Monochrome type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #0B0B0B; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Full-Bleed Hero
- Full-bleed, min-h-[100svh] composition built around full-bleed horizontal marquee statement + numbered editorial list rows.
- H1 "{{HERO_HEADLINE}}" set in Neue Haas Grotesk Display, clamp(2.75rem, 7vw, 5.5rem); entrance timed to power4.out / cubic-bezier(0.16,1,0.3,1), no linear.
- Sub-headline "{{VALUE_PROP}}" in Neue Haas Grotesk Text, max-w-xl, color #7A7A78.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #0B0B0B) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Swiss Brutalist Monochrome palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #F2F2F0 until onLoad fires.

### 3. Destination / Property Grid
- Grid of {{ITEM_1..6}} (destinations), max 2px, mostly 0 media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Framer Motion.

### 4. Experience Story
- Long-form editorial block (Neue Haas Grotesk Display pull-quote + Neue Haas Grotesk Text body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the Swiss Brutalist Monochrome media treatment -- otherwise the block stands on typography alone.

### 5. Itinerary / Booking Flow
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 6. Testimonials
- Testimonial cards from {{TESTIMONIAL_1..4}} (quote, name, role); never fabricated quotes or names.
- Carousel or masonry per Swiss Brutalist Monochrome density; autoplay (if used) pauses on hover/focus and respects prefers-reduced-motion (no autoplay at all).

### 7. CTA
- Full-width closing section, background #0B0B0B, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Neue Haas Grotesk Text, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #DEDEDA, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for travel if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #F2F2F0 with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #0B0B0B, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built boutique travel / experiential tourism brand product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 702 — Aurora Glassmorphism — Boutique Travel / Experiential Tourism Brand

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a boutique travel / experiential tourism brand ({{PRODUCT_CATEGORY}}). Art direction: aurora glassmorphism — deep space backdrop, drifting light fields, frosted translucent surfaces. Production-ready, 100% responsive.

## TECH STACK
- Framework: 11ty (static-first) with Nunjucks templates
- Styling: Tailwind CSS v4 (CLI build, no JS framework runtime)
- Animation: Alpine.js for micro-interactions + CSS scroll-driven animations (animation-timeline: view())
- Extra: Zero client JS framework — ships an HTML/CSS-first page with progressive enhancement
- Icons: inline SVG sprite
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #05060B
  --surface: rgba(255,255,255,0.04)
  --border: rgba(255,255,255,0.09)
  --fg: #F4F6FB
  --muted: #8A92A6
  --accent: {{ACCENT_HEX}} (fallback #6E56F8)
  Secondary accents (ambient/illustrative use only, never as the primary CTA color): #2FD4C4, #F857A6
Typography:
  Display: "General Sans" — used for H1/H2, tight tracking
  Body: "Inter" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 20px on glass surfaces
  Signature mechanic: three desynced radial-gradient blobs + backdrop-blur(24px) glass recipe reused everywhere
  Texture layer: SVG feTurbulence grain at 0.035 opacity, pointer-events-none, aria-hidden
  Motion signature: [0.16,1,0.3,1], slow ambient CSS keyframe loops

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #05060B/90 with backdrop-blur(16px) after 40px scroll, transition 400ms [0.16.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in General Sans, weight 700.
- Center/right links styled per the Aurora Glassmorphism type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #6E56F8; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Full-Bleed Hero
- Full-bleed, min-h-[100svh] composition built around three desynced radial-gradient blobs + backdrop-blur(24px) glass recipe reused everywhere.
- H1 "{{HERO_HEADLINE}}" set in General Sans, clamp(2.75rem, 7vw, 5.5rem); entrance timed to [0.16,1,0.3,1], slow ambient CSS keyframe loops.
- Sub-headline "{{VALUE_PROP}}" in Inter, max-w-xl, color #8A92A6.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #6E56F8) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Aurora Glassmorphism palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in rgba(255,255,255,0.04) until onLoad fires.

### 3. Destination / Property Grid
- Grid of {{ITEM_1..6}} (destinations), 20px on glass surfaces media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Alpine.js for micro-interactions.

### 4. Experience Story
- Long-form editorial block (General Sans pull-quote + Inter body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the Aurora Glassmorphism media treatment -- otherwise the block stands on typography alone.

### 5. Itinerary / Booking Flow
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 6. Testimonials
- Testimonial cards from {{TESTIMONIAL_1..4}} (quote, name, role); never fabricated quotes or names.
- Carousel or masonry per Aurora Glassmorphism density; autoplay (if used) pauses on hover/focus and respects prefers-reduced-motion (no autoplay at all).

### 7. CTA
- Full-width closing section, background #05060B, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Inter, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at rgba(255,255,255,0.09), copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for travel if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in rgba(255,255,255,0.04) with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #6E56F8, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built boutique travel / experiential tourism brand product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 703 — Neo-Brutalist Pop — Boutique Travel / Experiential Tourism Brand

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a boutique travel / experiential tourism brand ({{PRODUCT_CATEGORY}}). Art direction: neo-brutalist pop — thick black outlines, flat saturated blocks, deliberately raw hard shadows, no gradients. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: Tailwind CSS v4
- Animation: Framer Motion for DOM, Mapbox GL JS fly-to transitions for the map layer
- Extra: Mapbox GL JS with a custom muted style matching the palette
- Icons: lucide-react
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #FDF6EC
  --surface: #FFFFFF
  --border: #111111
  --fg: #111111
  --muted: #5B564E
  --accent: {{ACCENT_HEX}} (fallback #FF4D2E)
  Secondary accents (ambient/illustrative use only, never as the primary CTA color): #FFD23F, #2EC4B6
Typography:
  Display: "Archivo Black" — used for H1/H2, tight tracking
  Body: "Archivo" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 0px everywhere
  Signature mechanic: hard offset shadow (8px 8px 0 #111) that flattens to 0 0 0 on press, thick 3px borders on every block
  Motion signature: steps() and abrupt cubic-bezier(0.68,-0.55,0.27,1.55) overshoot

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #FDF6EC/90 with backdrop-blur(16px) after 40px scroll, transition 400ms steps() and abrupt cubic-bezier(0.68,-0.55,0.27,1.55) overshoot.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Archivo Black, weight 700.
- Center/right links styled per the Neo-Brutalist Pop type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #FF4D2E; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Full-Bleed Hero
- Full-bleed, min-h-[100svh] composition built around hard offset shadow (8px 8px 0 #111) that flattens to 0 0 0 on press, thick 3px borders on every block.
- H1 "{{HERO_HEADLINE}}" set in Archivo Black, clamp(2.75rem, 7vw, 5.5rem); entrance timed to steps() and abrupt cubic-bezier(0.68,-0.55,0.27,1.55) overshoot.
- Sub-headline "{{VALUE_PROP}}" in Archivo, max-w-xl, color #5B564E.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #FF4D2E) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Neo-Brutalist Pop palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #FFFFFF until onLoad fires.

### 3. Destination / Property Grid
- Grid of {{ITEM_1..6}} (destinations), 0px everywhere media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Framer Motion for DOM.

### 4. Experience Story
- Long-form editorial block (Archivo Black pull-quote + Archivo body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the Neo-Brutalist Pop media treatment -- otherwise the block stands on typography alone.

### 5. Itinerary / Booking Flow
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 6. Testimonials
- Testimonial cards from {{TESTIMONIAL_1..4}} (quote, name, role); never fabricated quotes or names.
- Carousel or masonry per Neo-Brutalist Pop density; autoplay (if used) pauses on hover/focus and respects prefers-reduced-motion (no autoplay at all).

### 7. CTA
- Full-width closing section, background #FDF6EC, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Archivo, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #111111, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for travel if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #FFFFFF with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #FF4D2E, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built boutique travel / experiential tourism brand product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 704 — Editorial Serif Luxury — Boutique Travel / Experiential Tourism Brand

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a boutique travel / experiential tourism brand ({{PRODUCT_CATEGORY}}). Art direction: editorial serif luxury — magazine-grade serif display type, generous margins, restrained color, photography-led. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: styled-components with a typed theme object
- Animation: Framer Motion + Lenis smooth scroll
- Extra: next/font for all typography
- Icons: lucide-react
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #FBF9F6
  --surface: #F1EDE6
  --border: #E3DCD0
  --fg: #1A1714
  --muted: #8A8175
  --accent: {{ACCENT_HEX}} (fallback #7A2E2E)
Typography:
  Display: "Canela / GT Sectra" — used for H1/H2, tight tracking
  Body: "Söhne" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 0px, hairline rules instead
  Signature mechanic: asymmetric editorial grid with pull-quotes and a running folio/issue number
  Motion signature: ease-out, 600-900ms, understated crossfades

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #FBF9F6/90 with backdrop-blur(16px) after 40px scroll, transition 400ms ease-out.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Canela / GT Sectra, weight 700.
- Center/right links styled per the Editorial Serif Luxury type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #7A2E2E; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Full-Bleed Hero
- Full-bleed, min-h-[100svh] composition built around asymmetric editorial grid with pull-quotes and a running folio/issue number.
- H1 "{{HERO_HEADLINE}}" set in Canela / GT Sectra, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease-out, 600-900ms, understated crossfades.
- Sub-headline "{{VALUE_PROP}}" in Söhne, max-w-xl, color #8A8175.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #7A2E2E) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Editorial Serif Luxury palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #F1EDE6 until onLoad fires.

### 3. Destination / Property Grid
- Grid of {{ITEM_1..6}} (destinations), 0px, hairline rules instead media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Framer Motion.

### 4. Experience Story
- Long-form editorial block (Canela / GT Sectra pull-quote + Söhne body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the Editorial Serif Luxury media treatment -- otherwise the block stands on typography alone.

### 5. Itinerary / Booking Flow
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 6. Testimonials
- Testimonial cards from {{TESTIMONIAL_1..4}} (quote, name, role); never fabricated quotes or names.
- Carousel or masonry per Editorial Serif Luxury density; autoplay (if used) pauses on hover/focus and respects prefers-reduced-motion (no autoplay at all).

### 7. CTA
- Full-width closing section, background #FBF9F6, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Söhne, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #E3DCD0, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for travel if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #F1EDE6 with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #7A2E2E, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built boutique travel / experiential tourism brand product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 705 — Dark Technical Console — Boutique Travel / Experiential Tourism Brand

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a boutique travel / experiential tourism brand ({{PRODUCT_CATEGORY}}). Art direction: dark technical console — near-black canvas, monospace accents, data-dense panels, engineering credibility. Production-ready, 100% responsive.

## TECH STACK
- Framework: 11ty (static-first) with Nunjucks templates
- Styling: Tailwind CSS v4 (CLI build, no JS framework runtime)
- Animation: Alpine.js for micro-interactions + CSS scroll-driven animations (animation-timeline: view())
- Extra: Zero client JS framework — ships an HTML/CSS-first page with progressive enhancement
- Icons: inline SVG sprite
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #0A0C10
  --surface: #12151B
  --border: #22262E
  --fg: #E7EAEE
  --muted: #7C838F
  --accent: {{ACCENT_HEX}} (fallback #5EEAD4)
  Secondary accents (ambient/illustrative use only, never as the primary CTA color): #818CF8
Typography:
  Display: "Inter Tight" — used for H1/H2, tight tracking
  Body: "Inter" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 8px
  Signature mechanic: live-updating metric tiles with tabular-nums CountUp and a terminal-style command block
  Texture layer: 1px scanline overlay at 3% opacity, pointer-events-none, aria-hidden
  Motion signature: 150-250ms ease, no bounce

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #0A0C10/90 with backdrop-blur(16px) after 40px scroll, transition 400ms 150-250ms ease.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Inter Tight, weight 700.
- Center/right links styled per the Dark Technical Console type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #5EEAD4; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Full-Bleed Hero
- Full-bleed, min-h-[100svh] composition built around live-updating metric tiles with tabular-nums CountUp and a terminal-style command block.
- H1 "{{HERO_HEADLINE}}" set in Inter Tight, clamp(2.75rem, 7vw, 5.5rem); entrance timed to 150-250ms ease, no bounce.
- Sub-headline "{{VALUE_PROP}}" in Inter, max-w-xl, color #7C838F.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #5EEAD4) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Dark Technical Console palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #12151B until onLoad fires.

### 3. Destination / Property Grid
- Grid of {{ITEM_1..6}} (destinations), 8px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Alpine.js for micro-interactions.

### 4. Experience Story
- Long-form editorial block (Inter Tight pull-quote + Inter body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the Dark Technical Console media treatment -- otherwise the block stands on typography alone.

### 5. Itinerary / Booking Flow
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 6. Testimonials
- Testimonial cards from {{TESTIMONIAL_1..4}} (quote, name, role); never fabricated quotes or names.
- Carousel or masonry per Dark Technical Console density; autoplay (if used) pauses on hover/focus and respects prefers-reduced-motion (no autoplay at all).

### 7. CTA
- Full-width closing section, background #0A0C10, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Inter, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #22262E, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for travel if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #12151B with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #5EEAD4, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built boutique travel / experiential tourism brand product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 706 — Cyberpunk Neon — Boutique Travel / Experiential Tourism Brand

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a boutique travel / experiential tourism brand ({{PRODUCT_CATEGORY}}). Art direction: cyberpunk neon — black canvas, saturated magenta/cyan neon, glitch accents, dense HUD framing. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: Tailwind CSS v4
- Animation: Framer Motion for DOM, Mapbox GL JS fly-to transitions for the map layer
- Extra: Mapbox GL JS with a custom muted style matching the palette
- Icons: lucide-react
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #050508
  --surface: #0E0E16
  --border: #2A2A3D
  --fg: #F5F5FF
  --muted: #8B8BA7
  --accent: {{ACCENT_HEX}} (fallback #FF2E9A)
  Secondary accents (ambient/illustrative use only, never as the primary CTA color): #00F5FF
Typography:
  Display: "Rajdhani" — used for H1/H2, tight tracking
  Body: "Space Grotesk" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 2px, corner-clipped (clip-path) panels
  Signature mechanic: scanline + chromatic-aberration text-shadow on the H1, HUD corner brackets on every panel
  Texture layer: animated scanline, 6% opacity, pointer-events-none, aria-hidden
  Motion signature: glitch keyframe (translate jitter 2px, 80ms) on hover only

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #050508/90 with backdrop-blur(16px) after 40px scroll, transition 400ms glitch keyframe (translate jitter 2px, 80ms) on hover only.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Rajdhani, weight 700.
- Center/right links styled per the Cyberpunk Neon type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #FF2E9A; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Full-Bleed Hero
- Full-bleed, min-h-[100svh] composition built around scanline + chromatic-aberration text-shadow on the H1, HUD corner brackets on every panel.
- H1 "{{HERO_HEADLINE}}" set in Rajdhani, clamp(2.75rem, 7vw, 5.5rem); entrance timed to glitch keyframe (translate jitter 2px, 80ms) on hover only.
- Sub-headline "{{VALUE_PROP}}" in Space Grotesk, max-w-xl, color #8B8BA7.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #FF2E9A) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Cyberpunk Neon palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #0E0E16 until onLoad fires.

### 3. Destination / Property Grid
- Grid of {{ITEM_1..6}} (destinations), 2px, corner-clipped (clip-path) panels media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Framer Motion for DOM.

### 4. Experience Story
- Long-form editorial block (Rajdhani pull-quote + Space Grotesk body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the Cyberpunk Neon media treatment -- otherwise the block stands on typography alone.

### 5. Itinerary / Booking Flow
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 6. Testimonials
- Testimonial cards from {{TESTIMONIAL_1..4}} (quote, name, role); never fabricated quotes or names.
- Carousel or masonry per Cyberpunk Neon density; autoplay (if used) pauses on hover/focus and respects prefers-reduced-motion (no autoplay at all).

### 7. CTA
- Full-width closing section, background #050508, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Space Grotesk, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #2A2A3D, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for travel if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #0E0E16 with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #FF2E9A, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built boutique travel / experiential tourism brand product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 707 — Industrial Utilitarian — Boutique Travel / Experiential Tourism Brand

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a boutique travel / experiential tourism brand ({{PRODUCT_CATEGORY}}). Art direction: industrial utilitarian — concrete and steel palette, exposed grid lines, stenciled labels, function over decoration. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: styled-components with a typed theme object
- Animation: Framer Motion + Lenis smooth scroll
- Extra: next/font for all typography
- Icons: lucide-react
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #EDECE8
  --surface: #DCDAD3
  --border: #B7B4AA
  --fg: #1F1E1B
  --muted: #6B675E
  --accent: {{ACCENT_HEX}} (fallback #C9491C)
Typography:
  Display: "Suisse Int'l Mono" — used for H1/H2, tight tracking
  Body: "Suisse Int'l" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 0px
  Signature mechanic: visible grid lines (1px --border) drawn across the full viewport as a permanent underlay, stenciled uppercase section labels with dot-leaders
  Texture layer: fine paper-grain at 4%, pointer-events-none, aria-hidden
  Motion signature: linear 200ms for mechanical feel on toggles only, ease-out elsewhere

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #EDECE8/90 with backdrop-blur(16px) after 40px scroll, transition 400ms linear 200ms for mechanical feel on toggles only.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Suisse Int'l Mono, weight 700.
- Center/right links styled per the Industrial Utilitarian type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #C9491C; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Full-Bleed Hero
- Full-bleed, min-h-[100svh] composition built around visible grid lines (1px --border) drawn across the full viewport as a permanent underlay, stenciled uppercase section labels with dot-leaders.
- H1 "{{HERO_HEADLINE}}" set in Suisse Int'l Mono, clamp(2.75rem, 7vw, 5.5rem); entrance timed to linear 200ms for mechanical feel on toggles only, ease-out elsewhere.
- Sub-headline "{{VALUE_PROP}}" in Suisse Int'l, max-w-xl, color #6B675E.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #C9491C) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Industrial Utilitarian palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #DCDAD3 until onLoad fires.

### 3. Destination / Property Grid
- Grid of {{ITEM_1..6}} (destinations), 0px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Framer Motion.

### 4. Experience Story
- Long-form editorial block (Suisse Int'l Mono pull-quote + Suisse Int'l body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the Industrial Utilitarian media treatment -- otherwise the block stands on typography alone.

### 5. Itinerary / Booking Flow
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 6. Testimonials
- Testimonial cards from {{TESTIMONIAL_1..4}} (quote, name, role); never fabricated quotes or names.
- Carousel or masonry per Industrial Utilitarian density; autoplay (if used) pauses on hover/focus and respects prefers-reduced-motion (no autoplay at all).

### 7. CTA
- Full-width closing section, background #EDECE8, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Suisse Int'l, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #B7B4AA, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for travel if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #DCDAD3 with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #C9491C, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built boutique travel / experiential tourism brand product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 708 — Futuristic Chrome — Boutique Travel / Experiential Tourism Brand

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a boutique travel / experiential tourism brand ({{PRODUCT_CATEGORY}}). Art direction: futuristic chrome — liquid chrome gradients, specular highlights, cool metallic palette, motion-first. Production-ready, 100% responsive.

## TECH STACK
- Framework: 11ty (static-first) with Nunjucks templates
- Styling: Tailwind CSS v4 (CLI build, no JS framework runtime)
- Animation: Alpine.js for micro-interactions + CSS scroll-driven animations (animation-timeline: view())
- Extra: Zero client JS framework — ships an HTML/CSS-first page with progressive enhancement
- Icons: inline SVG sprite
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #0B0D12
  --surface: #151821
  --border: #2B2F3A
  --fg: #F2F4F8
  --muted: #9AA1AF
  --accent: {{ACCENT_HEX}} (fallback #7DD3FC)
  Secondary accents (ambient/illustrative use only, never as the primary CTA color): #C4B5FD
Typography:
  Display: "Space Grotesk" — used for H1/H2, tight tracking
  Body: "Inter" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 28px, pill-shaped controls
  Signature mechanic: specular chrome gradient sweeping across headline on scroll (background-position tied to scrollYProgress)
  Motion signature: spring(stiffness 220, damping 26) via Framer Motion

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #0B0D12/90 with backdrop-blur(16px) after 40px scroll, transition 400ms spring(stiffness 220, damping 26) via Framer Motion.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Space Grotesk, weight 700.
- Center/right links styled per the Futuristic Chrome type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #7DD3FC; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Full-Bleed Hero
- Full-bleed, min-h-[100svh] composition built around specular chrome gradient sweeping across headline on scroll (background-position tied to scrollYProgress).
- H1 "{{HERO_HEADLINE}}" set in Space Grotesk, clamp(2.75rem, 7vw, 5.5rem); entrance timed to spring(stiffness 220, damping 26) via Framer Motion.
- Sub-headline "{{VALUE_PROP}}" in Inter, max-w-xl, color #9AA1AF.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #7DD3FC) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Futuristic Chrome palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #151821 until onLoad fires.

### 3. Destination / Property Grid
- Grid of {{ITEM_1..6}} (destinations), 28px, pill-shaped controls media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Alpine.js for micro-interactions.

### 4. Experience Story
- Long-form editorial block (Space Grotesk pull-quote + Inter body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the Futuristic Chrome media treatment -- otherwise the block stands on typography alone.

### 5. Itinerary / Booking Flow
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 6. Testimonials
- Testimonial cards from {{TESTIMONIAL_1..4}} (quote, name, role); never fabricated quotes or names.
- Carousel or masonry per Futuristic Chrome density; autoplay (if used) pauses on hover/focus and respects prefers-reduced-motion (no autoplay at all).

### 7. CTA
- Full-width closing section, background #0B0D12, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Inter, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #2B2F3A, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for travel if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #151821 with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #7DD3FC, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built boutique travel / experiential tourism brand product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 709 — Soft Minimal Warmth — Boutique Travel / Experiential Tourism Brand

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a boutique travel / experiential tourism brand ({{PRODUCT_CATEGORY}}). Art direction: soft minimal warmth — warm off-white, generous air, soft shadows, rounded forms, low-contrast restraint. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: Tailwind CSS v4
- Animation: Framer Motion for DOM, Mapbox GL JS fly-to transitions for the map layer
- Extra: Mapbox GL JS with a custom muted style matching the palette
- Icons: lucide-react
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #FAF7F2
  --surface: #FFFFFF
  --border: #ECE6DC
  --fg: #2B2620
  --muted: #928C80
  --accent: {{ACCENT_HEX}} (fallback #D97757)
Typography:
  Display: "Fraunces" — used for H1/H2, tight tracking
  Body: "Inter" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 24px
  Signature mechanic: soft double-layer drop shadow (0 1px 2px + 0 12px 24px at 6%) on every raised surface, no borders — light does the separating
  Motion signature: ease-out 400-600ms, gentle y:12→0 reveals

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #FAF7F2/90 with backdrop-blur(16px) after 40px scroll, transition 400ms ease-out 400-600ms.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Fraunces, weight 700.
- Center/right links styled per the Soft Minimal Warmth type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #D97757; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Full-Bleed Hero
- Full-bleed, min-h-[100svh] composition built around soft double-layer drop shadow (0 1px 2px + 0 12px 24px at 6%) on every raised surface, no borders — light does the separating.
- H1 "{{HERO_HEADLINE}}" set in Fraunces, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease-out 400-600ms, gentle y:12→0 reveals.
- Sub-headline "{{VALUE_PROP}}" in Inter, max-w-xl, color #928C80.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #D97757) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Soft Minimal Warmth palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #FFFFFF until onLoad fires.

### 3. Destination / Property Grid
- Grid of {{ITEM_1..6}} (destinations), 24px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Framer Motion for DOM.

### 4. Experience Story
- Long-form editorial block (Fraunces pull-quote + Inter body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the Soft Minimal Warmth media treatment -- otherwise the block stands on typography alone.

### 5. Itinerary / Booking Flow
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 6. Testimonials
- Testimonial cards from {{TESTIMONIAL_1..4}} (quote, name, role); never fabricated quotes or names.
- Carousel or masonry per Soft Minimal Warmth density; autoplay (if used) pauses on hover/focus and respects prefers-reduced-motion (no autoplay at all).

### 7. CTA
- Full-width closing section, background #FAF7F2, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Inter, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #ECE6DC, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for travel if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #FFFFFF with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #D97757, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built boutique travel / experiential tourism brand product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 710 — Art Deco Revival — Boutique Travel / Experiential Tourism Brand

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a boutique travel / experiential tourism brand ({{PRODUCT_CATEGORY}}). Art direction: art deco revival — gold on deep emerald/black, geometric fan and sunburst motifs, symmetrical ornament. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: styled-components with a typed theme object
- Animation: Framer Motion + Lenis smooth scroll
- Extra: next/font for all typography
- Icons: lucide-react
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #0D1512
  --surface: #122019
  --border: #B8935A
  --fg: #F3E9D2
  --muted: #9FB5A8
  --accent: {{ACCENT_HEX}} (fallback #C9A96A)
Typography:
  Display: "Poiret One / Cinzel" — used for H1/H2, tight tracking
  Body: "Cormorant" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 0px, chamfered corners via clip-path
  Signature mechanic: repeating SVG sunburst/fan motif as section dividers, gold 1px double-rule borders
  Texture layer: subtle metallic gradient noise, pointer-events-none, aria-hidden
  Motion signature: ease-in-out 700ms, symmetrical mirrored reveals

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #0D1512/90 with backdrop-blur(16px) after 40px scroll, transition 400ms ease-in-out 700ms.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Poiret One / Cinzel, weight 700.
- Center/right links styled per the Art Deco Revival type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #C9A96A; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Full-Bleed Hero
- Full-bleed, min-h-[100svh] composition built around repeating SVG sunburst/fan motif as section dividers, gold 1px double-rule borders.
- H1 "{{HERO_HEADLINE}}" set in Poiret One / Cinzel, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease-in-out 700ms, symmetrical mirrored reveals.
- Sub-headline "{{VALUE_PROP}}" in Cormorant, max-w-xl, color #9FB5A8.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #C9A96A) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Art Deco Revival palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #122019 until onLoad fires.

### 3. Destination / Property Grid
- Grid of {{ITEM_1..6}} (destinations), 0px, chamfered corners via clip-path media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Framer Motion.

### 4. Experience Story
- Long-form editorial block (Poiret One / Cinzel pull-quote + Cormorant body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the Art Deco Revival media treatment -- otherwise the block stands on typography alone.

### 5. Itinerary / Booking Flow
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 6. Testimonials
- Testimonial cards from {{TESTIMONIAL_1..4}} (quote, name, role); never fabricated quotes or names.
- Carousel or masonry per Art Deco Revival density; autoplay (if used) pauses on hover/focus and respects prefers-reduced-motion (no autoplay at all).

### 7. CTA
- Full-width closing section, background #0D1512, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Cormorant, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #B8935A, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for travel if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #122019 with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #C9A96A, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built boutique travel / experiential tourism brand product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 711 — Japanese Minimal (Ma) — Boutique Travel / Experiential Tourism Brand

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a boutique travel / experiential tourism brand ({{PRODUCT_CATEGORY}}). Art direction: japanese minimal (ma) — extreme negative space, single accent stroke, vertical rhythm, quiet confidence. Production-ready, 100% responsive.

## TECH STACK
- Framework: 11ty (static-first) with Nunjucks templates
- Styling: Tailwind CSS v4 (CLI build, no JS framework runtime)
- Animation: Alpine.js for micro-interactions + CSS scroll-driven animations (animation-timeline: view())
- Extra: Zero client JS framework — ships an HTML/CSS-first page with progressive enhancement
- Icons: inline SVG sprite
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #FCFCFA
  --surface: #F5F4F0
  --border: #E2E0D8
  --fg: #1C1C1A
  --muted: #8D8B84
  --accent: {{ACCENT_HEX}} (fallback #C1121F)
Typography:
  Display: "Zen Old Mincho / Shippori Mincho" — used for H1/H2, tight tracking
  Body: "Noto Sans JP fallback / Inter" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 0px
  Signature mechanic: a single vertical hairline rule tracks scroll progress along the left margin; content occupies at most 60% of viewport width
  Motion signature: ease 800ms, single elements move — never groups at once

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #FCFCFA/90 with backdrop-blur(16px) after 40px scroll, transition 400ms ease 800ms.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Zen Old Mincho / Shippori Mincho, weight 700.
- Center/right links styled per the Japanese Minimal (Ma) type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #C1121F; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Full-Bleed Hero
- Full-bleed, min-h-[100svh] composition built around a single vertical hairline rule tracks scroll progress along the left margin; content occupies at most 60% of viewport width.
- H1 "{{HERO_HEADLINE}}" set in Zen Old Mincho / Shippori Mincho, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease 800ms, single elements move — never groups at once.
- Sub-headline "{{VALUE_PROP}}" in Noto Sans JP fallback / Inter, max-w-xl, color #8D8B84.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #C1121F) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Japanese Minimal (Ma) palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #F5F4F0 until onLoad fires.

### 3. Destination / Property Grid
- Grid of {{ITEM_1..6}} (destinations), 0px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Alpine.js for micro-interactions.

### 4. Experience Story
- Long-form editorial block (Zen Old Mincho / Shippori Mincho pull-quote + Noto Sans JP fallback / Inter body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the Japanese Minimal (Ma) media treatment -- otherwise the block stands on typography alone.

### 5. Itinerary / Booking Flow
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 6. Testimonials
- Testimonial cards from {{TESTIMONIAL_1..4}} (quote, name, role); never fabricated quotes or names.
- Carousel or masonry per Japanese Minimal (Ma) density; autoplay (if used) pauses on hover/focus and respects prefers-reduced-motion (no autoplay at all).

### 7. CTA
- Full-width closing section, background #FCFCFA, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Noto Sans JP fallback / Inter, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #E2E0D8, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for travel if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #F5F4F0 with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #C1121F, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built boutique travel / experiential tourism brand product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 712 — Scandinavian Functional — Boutique Travel / Experiential Tourism Brand

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a boutique travel / experiential tourism brand ({{PRODUCT_CATEGORY}}). Art direction: scandinavian functional — light wood-neutral palette, clean sans type, function-led hierarchy, quiet confidence. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: Tailwind CSS v4
- Animation: Framer Motion for DOM, Mapbox GL JS fly-to transitions for the map layer
- Extra: Mapbox GL JS with a custom muted style matching the palette
- Icons: lucide-react
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #F7F5F2
  --surface: #FFFFFF
  --border: #E4E0D8
  --fg: #232320
  --muted: #7D7A72
  --accent: {{ACCENT_HEX}} (fallback #3E6259)
Typography:
  Display: "Söhne" — used for H1/H2, tight tracking
  Body: "Söhne" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 12px
  Signature mechanic: consistent 8pt spacing scale exposed as visible rhythm between hairline-separated blocks
  Motion signature: ease-out 300ms, no overshoot

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #F7F5F2/90 with backdrop-blur(16px) after 40px scroll, transition 400ms ease-out 300ms.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Söhne, weight 700.
- Center/right links styled per the Scandinavian Functional type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #3E6259; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Full-Bleed Hero
- Full-bleed, min-h-[100svh] composition built around consistent 8pt spacing scale exposed as visible rhythm between hairline-separated blocks.
- H1 "{{HERO_HEADLINE}}" set in Söhne, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease-out 300ms, no overshoot.
- Sub-headline "{{VALUE_PROP}}" in Söhne, max-w-xl, color #7D7A72.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #3E6259) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Scandinavian Functional palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #FFFFFF until onLoad fires.

### 3. Destination / Property Grid
- Grid of {{ITEM_1..6}} (destinations), 12px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Framer Motion for DOM.

### 4. Experience Story
- Long-form editorial block (Söhne pull-quote + Söhne body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the Scandinavian Functional media treatment -- otherwise the block stands on typography alone.

### 5. Itinerary / Booking Flow
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 6. Testimonials
- Testimonial cards from {{TESTIMONIAL_1..4}} (quote, name, role); never fabricated quotes or names.
- Carousel or masonry per Scandinavian Functional density; autoplay (if used) pauses on hover/focus and respects prefers-reduced-motion (no autoplay at all).

### 7. CTA
- Full-width closing section, background #F7F5F2, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Söhne, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #E4E0D8, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for travel if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #FFFFFF with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #3E6259, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built boutique travel / experiential tourism brand product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 713 — Retro-Futurist 80s — Boutique Travel / Experiential Tourism Brand

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a boutique travel / experiential tourism brand ({{PRODUCT_CATEGORY}}). Art direction: retro-futurist 80s — sunset gradient, chrome grid horizon, VHS scanlines, synthwave palette. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: styled-components with a typed theme object
- Animation: Framer Motion + Lenis smooth scroll
- Extra: next/font for all typography
- Icons: lucide-react
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #1A0B2E
  --surface: #26123F
  --border: #4A2472
  --fg: #FCEEFF
  --muted: #B79BD6
  --accent: {{ACCENT_HEX}} (fallback #FF6EC7)
  Secondary accents (ambient/illustrative use only, never as the primary CTA color): #00D9FF, #FFB86C
Typography:
  Display: "Righteous" — used for H1/H2, tight tracking
  Body: "Space Grotesk" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 4px
  Signature mechanic: perspective CSS grid horizon (transform: perspective(500px) rotateX(60deg)) receding beneath the hero, sun gradient circle behind it
  Texture layer: VHS scanline + chromatic aberration, pointer-events-none, aria-hidden
  Motion signature: linear scanline drift 8s infinite, ease-out for content

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #1A0B2E/90 with backdrop-blur(16px) after 40px scroll, transition 400ms linear scanline drift 8s infinite.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Righteous, weight 700.
- Center/right links styled per the Retro-Futurist 80s type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #FF6EC7; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Full-Bleed Hero
- Full-bleed, min-h-[100svh] composition built around perspective CSS grid horizon (transform: perspective(500px) rotateX(60deg)) receding beneath the hero, sun gradient circle behind it.
- H1 "{{HERO_HEADLINE}}" set in Righteous, clamp(2.75rem, 7vw, 5.5rem); entrance timed to linear scanline drift 8s infinite, ease-out for content.
- Sub-headline "{{VALUE_PROP}}" in Space Grotesk, max-w-xl, color #B79BD6.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #FF6EC7) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Retro-Futurist 80s palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #26123F until onLoad fires.

### 3. Destination / Property Grid
- Grid of {{ITEM_1..6}} (destinations), 4px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Framer Motion.

### 4. Experience Story
- Long-form editorial block (Righteous pull-quote + Space Grotesk body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the Retro-Futurist 80s media treatment -- otherwise the block stands on typography alone.

### 5. Itinerary / Booking Flow
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 6. Testimonials
- Testimonial cards from {{TESTIMONIAL_1..4}} (quote, name, role); never fabricated quotes or names.
- Carousel or masonry per Retro-Futurist 80s density; autoplay (if used) pauses on hover/focus and respects prefers-reduced-motion (no autoplay at all).

### 7. CTA
- Full-width closing section, background #1A0B2E, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Space Grotesk, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #4A2472, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for travel if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #26123F with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #FF6EC7, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built boutique travel / experiential tourism brand product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 714 — Y2K Cyber-Cute — Boutique Travel / Experiential Tourism Brand

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a boutique travel / experiential tourism brand ({{PRODUCT_CATEGORY}}). Art direction: y2k cyber-cute — chrome bubbles, gradient blobs, glossy buttons, playful maximal energy. Production-ready, 100% responsive.

## TECH STACK
- Framework: 11ty (static-first) with Nunjucks templates
- Styling: Tailwind CSS v4 (CLI build, no JS framework runtime)
- Animation: Alpine.js for micro-interactions + CSS scroll-driven animations (animation-timeline: view())
- Extra: Zero client JS framework — ships an HTML/CSS-first page with progressive enhancement
- Icons: inline SVG sprite
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #EAF2FF
  --surface: #FFFFFF
  --border: #C7DBFF
  --fg: #0E1B33
  --muted: #5C6B8C
  --accent: {{ACCENT_HEX}} (fallback #7C5CFF)
  Secondary accents (ambient/illustrative use only, never as the primary CTA color): #FF5CA8, #5CE1FF
Typography:
  Display: "Chakra Petch" — used for H1/H2, tight tracking
  Body: "Poppins" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 9999px on buttons, 32px on cards
  Signature mechanic: glossy specular-highlight gradient buttons (radial-gradient white 10% at top-left), floating blob shapes drifting on scroll parallax
  Motion signature: spring bounce (stiffness 300, damping 18)

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #EAF2FF/90 with backdrop-blur(16px) after 40px scroll, transition 400ms spring bounce (stiffness 300, damping 18).
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Chakra Petch, weight 700.
- Center/right links styled per the Y2K Cyber-Cute type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #7C5CFF; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Full-Bleed Hero
- Full-bleed, min-h-[100svh] composition built around glossy specular-highlight gradient buttons (radial-gradient white 10% at top-left), floating blob shapes drifting on scroll parallax.
- H1 "{{HERO_HEADLINE}}" set in Chakra Petch, clamp(2.75rem, 7vw, 5.5rem); entrance timed to spring bounce (stiffness 300, damping 18).
- Sub-headline "{{VALUE_PROP}}" in Poppins, max-w-xl, color #5C6B8C.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #7C5CFF) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Y2K Cyber-Cute palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #FFFFFF until onLoad fires.

### 3. Destination / Property Grid
- Grid of {{ITEM_1..6}} (destinations), 9999px on buttons, 32px on cards media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Alpine.js for micro-interactions.

### 4. Experience Story
- Long-form editorial block (Chakra Petch pull-quote + Poppins body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the Y2K Cyber-Cute media treatment -- otherwise the block stands on typography alone.

### 5. Itinerary / Booking Flow
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 6. Testimonials
- Testimonial cards from {{TESTIMONIAL_1..4}} (quote, name, role); never fabricated quotes or names.
- Carousel or masonry per Y2K Cyber-Cute density; autoplay (if used) pauses on hover/focus and respects prefers-reduced-motion (no autoplay at all).

### 7. CTA
- Full-width closing section, background #EAF2FF, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Poppins, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #C7DBFF, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for travel if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #FFFFFF with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #7C5CFF, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built boutique travel / experiential tourism brand product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 715 — Digital Laboratory — Boutique Travel / Experiential Tourism Brand

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a boutique travel / experiential tourism brand ({{PRODUCT_CATEGORY}}). Art direction: digital laboratory — clinical white/blue, precise data grids, diagrammatic annotation lines. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: Tailwind CSS v4
- Animation: Framer Motion for DOM, Mapbox GL JS fly-to transitions for the map layer
- Extra: Mapbox GL JS with a custom muted style matching the palette
- Icons: lucide-react
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #FFFFFF
  --surface: #F4F7FB
  --border: #D7E1EE
  --fg: #101828
  --muted: #667085
  --accent: {{ACCENT_HEX}} (fallback #2E6FF2)
Typography:
  Display: "IBM Plex Sans" — used for H1/H2, tight tracking
  Body: "IBM Plex Sans" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 6px
  Signature mechanic: annotation leader-lines (SVG) connecting labels to UI elements, like a lab specimen diagram
  Texture layer: 1px graph-paper grid at 3% opacity, pointer-events-none, aria-hidden
  Motion signature: ease 200ms, precise not playful

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #FFFFFF/90 with backdrop-blur(16px) after 40px scroll, transition 400ms ease 200ms.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in IBM Plex Sans, weight 700.
- Center/right links styled per the Digital Laboratory type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #2E6FF2; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Full-Bleed Hero
- Full-bleed, min-h-[100svh] composition built around annotation leader-lines (SVG) connecting labels to UI elements, like a lab specimen diagram.
- H1 "{{HERO_HEADLINE}}" set in IBM Plex Sans, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease 200ms, precise not playful.
- Sub-headline "{{VALUE_PROP}}" in IBM Plex Sans, max-w-xl, color #667085.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #2E6FF2) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Digital Laboratory palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #F4F7FB until onLoad fires.

### 3. Destination / Property Grid
- Grid of {{ITEM_1..6}} (destinations), 6px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Framer Motion for DOM.

### 4. Experience Story
- Long-form editorial block (IBM Plex Sans pull-quote + IBM Plex Sans body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the Digital Laboratory media treatment -- otherwise the block stands on typography alone.

### 5. Itinerary / Booking Flow
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 6. Testimonials
- Testimonial cards from {{TESTIMONIAL_1..4}} (quote, name, role); never fabricated quotes or names.
- Carousel or masonry per Digital Laboratory density; autoplay (if used) pauses on hover/focus and respects prefers-reduced-motion (no autoplay at all).

### 7. CTA
- Full-width closing section, background #101828, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in IBM Plex Sans, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #D7E1EE, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for travel if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #F4F7FB with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #2E6FF2, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built boutique travel / experiential tourism brand product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 716 — Terminal-Inspired CLI — Boutique Travel / Experiential Tourism Brand

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a boutique travel / experiential tourism brand ({{PRODUCT_CATEGORY}}). Art direction: terminal-inspired cli — pure monospace, green/amber phosphor accent on black, blinking cursor motifs. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: styled-components with a typed theme object
- Animation: Framer Motion + Lenis smooth scroll
- Extra: next/font for all typography
- Icons: lucide-react
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #080A08
  --surface: #0F120F
  --border: #1F261F
  --fg: #D6FFD6
  --muted: #6B8F6B
  --accent: {{ACCENT_HEX}} (fallback #39FF14)
Typography:
  Display: "JetBrains Mono" — used for H1/H2, tight tracking
  Body: "JetBrains Mono" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 0px
  Signature mechanic: hero headline types itself out character-by-character with a blinking block cursor; every panel has a fake terminal titlebar with 3 dots
  Texture layer: CRT vignette + scanline at 5%, pointer-events-none, aria-hidden
  Motion signature: typewriter reveal, step-end steps(n)

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #080A08/90 with backdrop-blur(16px) after 40px scroll, transition 400ms typewriter reveal.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in JetBrains Mono, weight 700.
- Center/right links styled per the Terminal-Inspired CLI type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #39FF14; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Full-Bleed Hero
- Full-bleed, min-h-[100svh] composition built around hero headline types itself out character-by-character with a blinking block cursor; every panel has a fake terminal titlebar with 3 dots.
- H1 "{{HERO_HEADLINE}}" set in JetBrains Mono, clamp(2.75rem, 7vw, 5.5rem); entrance timed to typewriter reveal, step-end steps(n).
- Sub-headline "{{VALUE_PROP}}" in JetBrains Mono, max-w-xl, color #6B8F6B.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #39FF14) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Terminal-Inspired CLI palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #0F120F until onLoad fires.

### 3. Destination / Property Grid
- Grid of {{ITEM_1..6}} (destinations), 0px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Framer Motion.

### 4. Experience Story
- Long-form editorial block (JetBrains Mono pull-quote + JetBrains Mono body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the Terminal-Inspired CLI media treatment -- otherwise the block stands on typography alone.

### 5. Itinerary / Booking Flow
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 6. Testimonials
- Testimonial cards from {{TESTIMONIAL_1..4}} (quote, name, role); never fabricated quotes or names.
- Carousel or masonry per Terminal-Inspired CLI density; autoplay (if used) pauses on hover/focus and respects prefers-reduced-motion (no autoplay at all).

### 7. CTA
- Full-width closing section, background #080A08, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in JetBrains Mono, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #1F261F, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for travel if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #0F120F with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #39FF14, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built boutique travel / experiential tourism brand product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 717 — Financial Terminal Dense — Boutique Travel / Experiential Tourism Brand

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a boutique travel / experiential tourism brand ({{PRODUCT_CATEGORY}}). Art direction: financial terminal dense — black/near-black, tabular-nums everywhere, ticker rows, high information density. Production-ready, 100% responsive.

## TECH STACK
- Framework: 11ty (static-first) with Nunjucks templates
- Styling: Tailwind CSS v4 (CLI build, no JS framework runtime)
- Animation: Alpine.js for micro-interactions + CSS scroll-driven animations (animation-timeline: view())
- Extra: Zero client JS framework — ships an HTML/CSS-first page with progressive enhancement
- Icons: inline SVG sprite
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #000000
  --surface: #0C0F0C
  --border: #1E231E
  --fg: #E4E9E4
  --muted: #7C867C
  --accent: {{ACCENT_HEX}} (fallback #00C853)
  Secondary accents (ambient/illustrative use only, never as the primary CTA color): #FF3B30
Typography:
  Display: "IBM Plex Mono" — used for H1/H2, tight tracking
  Body: "IBM Plex Sans" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 2px
  Signature mechanic: a live scrolling ticker row (marquee) of tabular-nums values that flash green/red on change, dense multi-column data tables
  Motion signature: ease 150ms, numeric roll via CountUp only

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #000000/90 with backdrop-blur(16px) after 40px scroll, transition 400ms ease 150ms.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in IBM Plex Mono, weight 700.
- Center/right links styled per the Financial Terminal Dense type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #00C853; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Full-Bleed Hero
- Full-bleed, min-h-[100svh] composition built around a live scrolling ticker row (marquee) of tabular-nums values that flash green/red on change, dense multi-column data tables.
- H1 "{{HERO_HEADLINE}}" set in IBM Plex Mono, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease 150ms, numeric roll via CountUp only.
- Sub-headline "{{VALUE_PROP}}" in IBM Plex Sans, max-w-xl, color #7C867C.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #00C853) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Financial Terminal Dense palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #0C0F0C until onLoad fires.

### 3. Destination / Property Grid
- Grid of {{ITEM_1..6}} (destinations), 2px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Alpine.js for micro-interactions.

### 4. Experience Story
- Long-form editorial block (IBM Plex Mono pull-quote + IBM Plex Sans body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the Financial Terminal Dense media treatment -- otherwise the block stands on typography alone.

### 5. Itinerary / Booking Flow
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 6. Testimonials
- Testimonial cards from {{TESTIMONIAL_1..4}} (quote, name, role); never fabricated quotes or names.
- Carousel or masonry per Financial Terminal Dense density; autoplay (if used) pauses on hover/focus and respects prefers-reduced-motion (no autoplay at all).

### 7. CTA
- Full-width closing section, background #000000, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in IBM Plex Sans, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #1E231E, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for travel if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #0C0F0C with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #00C853, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built boutique travel / experiential tourism brand product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 718 — Magazine Grid — Boutique Travel / Experiential Tourism Brand

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a boutique travel / experiential tourism brand ({{PRODUCT_CATEGORY}}). Art direction: magazine grid — multi-column editorial grid, drop caps, running heads, varied image sizes. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: Tailwind CSS v4
- Animation: Framer Motion for DOM, Mapbox GL JS fly-to transitions for the map layer
- Extra: Mapbox GL JS with a custom muted style matching the palette
- Icons: lucide-react
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #FFFFFF
  --surface: #F6F5F2
  --border: #DEDBD2
  --fg: #181614
  --muted: #847E71
  --accent: {{ACCENT_HEX}} (fallback #B0281C)
Typography:
  Display: "Tiempos Headline" — used for H1/H2, tight tracking
  Body: "Tiempos Text" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 0px
  Signature mechanic: a masthead running head fixed at top (issue number, section name), first paragraph after each H2 gets a 3-line drop cap
  Motion signature: ease-out 500ms crossfades between spreads

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #FFFFFF/90 with backdrop-blur(16px) after 40px scroll, transition 400ms ease-out 500ms crossfades between spreads.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Tiempos Headline, weight 700.
- Center/right links styled per the Magazine Grid type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #B0281C; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Full-Bleed Hero
- Full-bleed, min-h-[100svh] composition built around a masthead running head fixed at top (issue number, section name), first paragraph after each H2 gets a 3-line drop cap.
- H1 "{{HERO_HEADLINE}}" set in Tiempos Headline, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease-out 500ms crossfades between spreads.
- Sub-headline "{{VALUE_PROP}}" in Tiempos Text, max-w-xl, color #847E71.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #B0281C) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Magazine Grid palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #F6F5F2 until onLoad fires.

### 3. Destination / Property Grid
- Grid of {{ITEM_1..6}} (destinations), 0px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Framer Motion for DOM.

### 4. Experience Story
- Long-form editorial block (Tiempos Headline pull-quote + Tiempos Text body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the Magazine Grid media treatment -- otherwise the block stands on typography alone.

### 5. Itinerary / Booking Flow
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 6. Testimonials
- Testimonial cards from {{TESTIMONIAL_1..4}} (quote, name, role); never fabricated quotes or names.
- Carousel or masonry per Magazine Grid density; autoplay (if used) pauses on hover/focus and respects prefers-reduced-motion (no autoplay at all).

### 7. CTA
- Full-width closing section, background #181614, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Tiempos Text, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #DEDBD2, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for travel if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #F6F5F2 with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #B0281C, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built boutique travel / experiential tourism brand product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 719 — High-Fashion Editorial — Boutique Travel / Experiential Tourism Brand

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a boutique travel / experiential tourism brand ({{PRODUCT_CATEGORY}}). Art direction: high-fashion editorial — full-bleed monochrome photography, oversized condensed type, extreme minimalism. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: styled-components with a typed theme object
- Animation: Framer Motion + Lenis smooth scroll
- Extra: next/font for all typography
- Icons: lucide-react
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #111111
  --surface: #000000
  --border: #2E2E2E
  --fg: #F5F5F5
  --muted: #9A9A9A
  --accent: {{ACCENT_HEX}} (fallback #FFFFFF)
Typography:
  Display: "PP Neue Montreal Condensed" — used for H1/H2, tight tracking
  Body: "PP Neue Montreal" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 0px
  Signature mechanic: full-viewport image bleeds with condensed vertical wordmark rotated -90deg pinned to the edge
  Motion signature: ease 900ms, slow deliberate crossfades — never fast

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #111111/90 with backdrop-blur(16px) after 40px scroll, transition 400ms ease 900ms.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in PP Neue Montreal Condensed, weight 700.
- Center/right links styled per the High-Fashion Editorial type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #FFFFFF; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Full-Bleed Hero
- Full-bleed, min-h-[100svh] composition built around full-viewport image bleeds with condensed vertical wordmark rotated -90deg pinned to the edge.
- H1 "{{HERO_HEADLINE}}" set in PP Neue Montreal Condensed, clamp(2.75rem, 7vw, 6rem); entrance timed to ease 900ms, slow deliberate crossfades — never fast.
- Sub-headline "{{VALUE_PROP}}" in PP Neue Montreal, max-w-xl, color #9A9A9A.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #FFFFFF) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the High-Fashion Editorial palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #000000 until onLoad fires.

### 3. Destination / Property Grid
- Grid of {{ITEM_1..6}} (destinations), 0px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Framer Motion.

### 4. Experience Story
- Long-form editorial block (PP Neue Montreal Condensed pull-quote + PP Neue Montreal body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the High-Fashion Editorial media treatment -- otherwise the block stands on typography alone.

### 5. Itinerary / Booking Flow
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 6. Testimonials
- Testimonial cards from {{TESTIMONIAL_1..4}} (quote, name, role); never fabricated quotes or names.
- Carousel or masonry per High-Fashion Editorial density; autoplay (if used) pauses on hover/focus and respects prefers-reduced-motion (no autoplay at all).

### 7. CTA
- Full-width closing section, background #111111, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in PP Neue Montreal, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #2E2E2E, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for travel if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #000000 with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #FFFFFF, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built boutique travel / experiential tourism brand product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 720 — Architectural Blueprint — Boutique Travel / Experiential Tourism Brand

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a boutique travel / experiential tourism brand ({{PRODUCT_CATEGORY}}). Art direction: architectural blueprint — technical drawing aesthetic, thin precise lines, dimension annotations, cool blue-grey. Production-ready, 100% responsive.

## TECH STACK
- Framework: 11ty (static-first) with Nunjucks templates
- Styling: Tailwind CSS v4 (CLI build, no JS framework runtime)
- Animation: Alpine.js for micro-interactions + CSS scroll-driven animations (animation-timeline: view())
- Extra: Zero client JS framework — ships an HTML/CSS-first page with progressive enhancement
- Icons: inline SVG sprite
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #F5F6F7
  --surface: #FFFFFF
  --border: #C7CCD1
  --fg: #1B2126
  --muted: #6E7981
  --accent: {{ACCENT_HEX}} (fallback #1B4B91)
Typography:
  Display: "Neue Haas Unica" — used for H1/H2, tight tracking
  Body: "Neue Haas Unica" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 0px
  Signature mechanic: SVG dimension lines with arrow endpoints and measurement labels annotate key layout sections, as in a blueprint
  Texture layer: faint blueprint grid at 4%, pointer-events-none, aria-hidden
  Motion signature: ease 300ms, draws lines via stroke-dashoffset animation

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #F5F6F7/90 with backdrop-blur(16px) after 40px scroll, transition 400ms ease 300ms.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Neue Haas Unica, weight 700.
- Center/right links styled per the Architectural Blueprint type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #1B4B91; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Full-Bleed Hero
- Full-bleed, min-h-[100svh] composition built around SVG dimension lines with arrow endpoints and measurement labels annotate key layout sections, as in a blueprint.
- H1 "{{HERO_HEADLINE}}" set in Neue Haas Unica, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease 300ms, draws lines via stroke-dashoffset animation.
- Sub-headline "{{VALUE_PROP}}" in Neue Haas Unica, max-w-xl, color #6E7981.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #1B4B91) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Architectural Blueprint palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #FFFFFF until onLoad fires.

### 3. Destination / Property Grid
- Grid of {{ITEM_1..6}} (destinations), 0px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Alpine.js for micro-interactions.

### 4. Experience Story
- Long-form editorial block (Neue Haas Unica pull-quote + Neue Haas Unica body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the Architectural Blueprint media treatment -- otherwise the block stands on typography alone.

### 5. Itinerary / Booking Flow
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 6. Testimonials
- Testimonial cards from {{TESTIMONIAL_1..4}} (quote, name, role); never fabricated quotes or names.
- Carousel or masonry per Architectural Blueprint density; autoplay (if used) pauses on hover/focus and respects prefers-reduced-motion (no autoplay at all).

### 7. CTA
- Full-width closing section, background #F5F6F7, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Neue Haas Unica, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #C7CCD1, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for travel if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #FFFFFF with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #1B4B91, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built boutique travel / experiential tourism brand product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 721 — Experimental Typography — Boutique Travel / Experiential Tourism Brand

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a boutique travel / experiential tourism brand ({{PRODUCT_CATEGORY}}). Art direction: experimental typography — type as the primary graphic device — variable font weight/width driven by scroll or cursor. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: Tailwind CSS v4
- Animation: Framer Motion for DOM, Mapbox GL JS fly-to transitions for the map layer
- Extra: Mapbox GL JS with a custom muted style matching the palette
- Icons: lucide-react
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #111014
  --surface: #1A1820
  --border: #312E3B
  --fg: #F1EEF7
  --muted: #948FA3
  --accent: {{ACCENT_HEX}} (fallback #E8FF59)
Typography:
  Display: "Variable custom (wght/wdth axes)" — used for H1/H2, tight tracking
  Body: "Suisse Int'l" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 0px
  Signature mechanic: headline font-variation-settings 'wght' and 'wdth' interpolate live with scroll velocity and cursor proximity per character
  Motion signature: scroll-linked variable-font-variation-settings interpolation

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #111014/90 with backdrop-blur(16px) after 40px scroll, transition 400ms scroll-linked variable-font-variation-settings interpolation.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Variable custom (wght/wdth axes), weight 700.
- Center/right links styled per the Experimental Typography type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #E8FF59; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Full-Bleed Hero
- Full-bleed, min-h-[100svh] composition built around headline font-variation-settings 'wght' and 'wdth' interpolate live with scroll velocity and cursor proximity per character.
- H1 "{{HERO_HEADLINE}}" set in Variable custom (wght/wdth axes), clamp(2.75rem, 7vw, 5.5rem); entrance timed to scroll-linked variable-font-variation-settings interpolation.
- Sub-headline "{{VALUE_PROP}}" in Suisse Int'l, max-w-xl, color #948FA3.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #E8FF59) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Experimental Typography palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #1A1820 until onLoad fires.

### 3. Destination / Property Grid
- Grid of {{ITEM_1..6}} (destinations), 0px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Framer Motion for DOM.

### 4. Experience Story
- Long-form editorial block (Variable custom (wght/wdth axes) pull-quote + Suisse Int'l body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the Experimental Typography media treatment -- otherwise the block stands on typography alone.

### 5. Itinerary / Booking Flow
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 6. Testimonials
- Testimonial cards from {{TESTIMONIAL_1..4}} (quote, name, role); never fabricated quotes or names.
- Carousel or masonry per Experimental Typography density; autoplay (if used) pauses on hover/focus and respects prefers-reduced-motion (no autoplay at all).

### 7. CTA
- Full-width closing section, background #111014, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Suisse Int'l, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #312E3B, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for travel if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #1A1820 with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #E8FF59, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built boutique travel / experiential tourism brand product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 722 — Data-Dense Analytics — Boutique Travel / Experiential Tourism Brand

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a boutique travel / experiential tourism brand ({{PRODUCT_CATEGORY}}). Art direction: data-dense analytics — tight information density, small multiples, sparkline-everything, muted chart palette. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: styled-components with a typed theme object
- Animation: Framer Motion + Lenis smooth scroll
- Extra: next/font for all typography
- Icons: lucide-react
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #0E1116
  --surface: #161A21
  --border: #262C36
  --fg: #DEE3EA
  --muted: #7E8896
  --accent: {{ACCENT_HEX}} (fallback #4C9AFF)
  Secondary accents (ambient/illustrative use only, never as the primary CTA color): #F5A623
Typography:
  Display: "Inter Tight" — used for H1/H2, tight tracking
  Body: "Inter" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 10px
  Signature mechanic: a grid of small-multiple sparkline cards, each with a live-updating value and a 30-day trend line drawn in SVG
  Motion signature: ease 180ms, chart transitions via d3 interpolate

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #0E1116/90 with backdrop-blur(16px) after 40px scroll, transition 400ms ease 180ms.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Inter Tight, weight 700.
- Center/right links styled per the Data-Dense Analytics type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #4C9AFF; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Full-Bleed Hero
- Full-bleed, min-h-[100svh] composition built around a grid of small-multiple sparkline cards, each with a live-updating value and a 30-day trend line drawn in SVG.
- H1 "{{HERO_HEADLINE}}" set in Inter Tight, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease 180ms, chart transitions via d3 interpolate.
- Sub-headline "{{VALUE_PROP}}" in Inter, max-w-xl, color #7E8896.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #4C9AFF) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Data-Dense Analytics palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #161A21 until onLoad fires.

### 3. Destination / Property Grid
- Grid of {{ITEM_1..6}} (destinations), 10px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Framer Motion.

### 4. Experience Story
- Long-form editorial block (Inter Tight pull-quote + Inter body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the Data-Dense Analytics media treatment -- otherwise the block stands on typography alone.

### 5. Itinerary / Booking Flow
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 6. Testimonials
- Testimonial cards from {{TESTIMONIAL_1..4}} (quote, name, role); never fabricated quotes or names.
- Carousel or masonry per Data-Dense Analytics density; autoplay (if used) pauses on hover/focus and respects prefers-reduced-motion (no autoplay at all).

### 7. CTA
- Full-width closing section, background #0E1116, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Inter, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #262C36, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for travel if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #161A21 with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #4C9AFF, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built boutique travel / experiential tourism brand product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 723 — Corporate Premium Trust — Boutique Travel / Experiential Tourism Brand

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a boutique travel / experiential tourism brand ({{PRODUCT_CATEGORY}}). Art direction: corporate premium trust — navy and white, generous whitespace, restrained gold accent, institutional confidence. Production-ready, 100% responsive.

## TECH STACK
- Framework: 11ty (static-first) with Nunjucks templates
- Styling: Tailwind CSS v4 (CLI build, no JS framework runtime)
- Animation: Alpine.js for micro-interactions + CSS scroll-driven animations (animation-timeline: view())
- Extra: Zero client JS framework — ships an HTML/CSS-first page with progressive enhancement
- Icons: inline SVG sprite
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #FFFFFF
  --surface: #F5F7FA
  --border: #E1E6ED
  --fg: #0F1B2D
  --muted: #5B6B80
  --accent: {{ACCENT_HEX}} (fallback #0F3D6E)
  Secondary accents (ambient/illustrative use only, never as the primary CTA color): #C6A15B
Typography:
  Display: "Söhne" — used for H1/H2, tight tracking
  Body: "Söhne" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 10px
  Signature mechanic: a fixed trust-bar beneath the navbar listing certifications/regulator marks in small caps
  Motion signature: ease-out 350ms, no playful overshoot

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #FFFFFF/90 with backdrop-blur(16px) after 40px scroll, transition 400ms ease-out 350ms.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Söhne, weight 700.
- Center/right links styled per the Corporate Premium Trust type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #0F3D6E; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Full-Bleed Hero
- Full-bleed, min-h-[100svh] composition built around a fixed trust-bar beneath the navbar listing certifications/regulator marks in small caps.
- H1 "{{HERO_HEADLINE}}" set in Söhne, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease-out 350ms, no playful overshoot.
- Sub-headline "{{VALUE_PROP}}" in Söhne, max-w-xl, color #5B6B80.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #0F3D6E) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Corporate Premium Trust palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #F5F7FA until onLoad fires.

### 3. Destination / Property Grid
- Grid of {{ITEM_1..6}} (destinations), 10px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Alpine.js for micro-interactions.

### 4. Experience Story
- Long-form editorial block (Söhne pull-quote + Söhne body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the Corporate Premium Trust media treatment -- otherwise the block stands on typography alone.

### 5. Itinerary / Booking Flow
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 6. Testimonials
- Testimonial cards from {{TESTIMONIAL_1..4}} (quote, name, role); never fabricated quotes or names.
- Carousel or masonry per Corporate Premium Trust density; autoplay (if used) pauses on hover/focus and respects prefers-reduced-motion (no autoplay at all).

### 7. CTA
- Full-width closing section, background #0F1B2D, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Söhne, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #E1E6ED, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for travel if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #F5F7FA with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #0F3D6E, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built boutique travel / experiential tourism brand product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 724 — Playful Sophisticated — Boutique Travel / Experiential Tourism Brand

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a boutique travel / experiential tourism brand ({{PRODUCT_CATEGORY}}). Art direction: playful sophisticated — bold single accent on cream, hand-tuned micro-illustrations, confident restraint with warmth. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: Tailwind CSS v4
- Animation: Framer Motion for DOM, Mapbox GL JS fly-to transitions for the map layer
- Extra: Mapbox GL JS with a custom muted style matching the palette
- Icons: lucide-react
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #FFF8EF
  --surface: #FFFFFF
  --border: #F0E4D0
  --fg: #20180E
  --muted: #8C7F68
  --accent: {{ACCENT_HEX}} (fallback #FF5A36)
Typography:
  Display: "Fraunces (soft)" — used for H1/H2, tight tracking
  Body: "General Sans" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 18px
  Signature mechanic: small hand-drawn-style SVG accent marks (circles, arrows) that rotate/scale in as a section enters viewport
  Motion signature: spring(220,20), playful but never chaotic

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #FFF8EF/90 with backdrop-blur(16px) after 40px scroll, transition 400ms spring(220,20).
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Fraunces (soft), weight 700.
- Center/right links styled per the Playful Sophisticated type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #FF5A36; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Full-Bleed Hero
- Full-bleed, min-h-[100svh] composition built around small hand-drawn-style SVG accent marks (circles, arrows) that rotate/scale in as a section enters viewport.
- H1 "{{HERO_HEADLINE}}" set in Fraunces (soft), clamp(2.75rem, 7vw, 5.5rem); entrance timed to spring(220,20), playful but never chaotic.
- Sub-headline "{{VALUE_PROP}}" in General Sans, max-w-xl, color #8C7F68.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #FF5A36) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Playful Sophisticated palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #FFFFFF until onLoad fires.

### 3. Destination / Property Grid
- Grid of {{ITEM_1..6}} (destinations), 18px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Framer Motion for DOM.

### 4. Experience Story
- Long-form editorial block (Fraunces (soft) pull-quote + General Sans body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the Playful Sophisticated media treatment -- otherwise the block stands on typography alone.

### 5. Itinerary / Booking Flow
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 6. Testimonials
- Testimonial cards from {{TESTIMONIAL_1..4}} (quote, name, role); never fabricated quotes or names.
- Carousel or masonry per Playful Sophisticated density; autoplay (if used) pauses on hover/focus and respects prefers-reduced-motion (no autoplay at all).

### 7. CTA
- Full-width closing section, background #FFF8EF, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in General Sans, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #F0E4D0, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for travel if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #FFFFFF with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #FF5A36, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built boutique travel / experiential tourism brand product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 725 — Organic Earth — Boutique Travel / Experiential Tourism Brand

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a boutique travel / experiential tourism brand ({{PRODUCT_CATEGORY}}). Art direction: organic earth — clay, moss and sand tones, blob/curve shapes, natural texture, calm pacing. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: styled-components with a typed theme object
- Animation: Framer Motion + Lenis smooth scroll
- Extra: next/font for all typography
- Icons: lucide-react
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #F3EEE4
  --surface: #EAE2D0
  --border: #D8CBAE
  --fg: #2C2416
  --muted: #8A7F65
  --accent: {{ACCENT_HEX}} (fallback #5B6E4F)
Typography:
  Display: "Fraunces" — used for H1/H2, tight tracking
  Body: "Newsreader" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 40% organic blob clip-paths on media
  Signature mechanic: organic blob-shaped SVG clip-paths frame every image, morphing slightly on scroll (clip-path interpolation)
  Texture layer: subtle paper texture at 5%, pointer-events-none, aria-hidden
  Motion signature: ease-in-out 700ms, slow drift

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #F3EEE4/90 with backdrop-blur(16px) after 40px scroll, transition 400ms ease-in-out 700ms.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Fraunces, weight 700.
- Center/right links styled per the Organic Earth type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #5B6E4F; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Full-Bleed Hero
- Full-bleed, min-h-[100svh] composition built around organic blob-shaped SVG clip-paths frame every image, morphing slightly on scroll (clip-path interpolation).
- H1 "{{HERO_HEADLINE}}" set in Fraunces, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease-in-out 700ms, slow drift.
- Sub-headline "{{VALUE_PROP}}" in Newsreader, max-w-xl, color #8A7F65.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #5B6E4F) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Organic Earth palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #EAE2D0 until onLoad fires.

### 3. Destination / Property Grid
- Grid of {{ITEM_1..6}} (destinations), 40% organic blob clip-paths on media media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Framer Motion.

### 4. Experience Story
- Long-form editorial block (Fraunces pull-quote + Newsreader body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the Organic Earth media treatment -- otherwise the block stands on typography alone.

### 5. Itinerary / Booking Flow
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 6. Testimonials
- Testimonial cards from {{TESTIMONIAL_1..4}} (quote, name, role); never fabricated quotes or names.
- Carousel or masonry per Organic Earth density; autoplay (if used) pauses on hover/focus and respects prefers-reduced-motion (no autoplay at all).

### 7. CTA
- Full-width closing section, background #F3EEE4, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Newsreader, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #D8CBAE, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for travel if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #EAE2D0 with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #5B6E4F, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built boutique travel / experiential tourism brand product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 726 — Swiss Brutalist Monochrome — Hotel / Hospitality Group

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a hotel / hospitality group ({{PRODUCT_CATEGORY}}). Art direction: swiss brutalist monochrome — raw grid discipline, oversized type as the only ornament, zero decorative imagery. Production-ready, 100% responsive.

## TECH STACK
- Framework: 11ty (static-first) with Nunjucks templates
- Styling: Tailwind CSS v4 (CLI build, no JS framework runtime)
- Animation: Alpine.js for micro-interactions + CSS scroll-driven animations (animation-timeline: view())
- Extra: Zero client JS framework — ships an HTML/CSS-first page with progressive enhancement
- Icons: inline SVG sprite
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #FFFFFF
  --surface: #F2F2F0
  --border: #DEDEDA
  --fg: #0B0B0B
  --muted: #7A7A78
  --accent: {{ACCENT_HEX}} (fallback #0B0B0B)
Typography:
  Display: "Neue Haas Grotesk Display" — used for H1/H2, tight tracking
  Body: "Neue Haas Grotesk Text" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: max 2px, mostly 0
  Signature mechanic: full-bleed horizontal marquee statement + numbered editorial list rows
  Motion signature: power4.out / cubic-bezier(0.16,1,0.3,1), no linear

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #FFFFFF/90 with backdrop-blur(16px) after 40px scroll, transition 400ms power4.out / cubic-bezier(0.16,1,0.3,1).
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Neue Haas Grotesk Display, weight 700.
- Center/right links styled per the Swiss Brutalist Monochrome type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #0B0B0B; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Full-Bleed Hero
- Full-bleed, min-h-[100svh] composition built around full-bleed horizontal marquee statement + numbered editorial list rows.
- H1 "{{HERO_HEADLINE}}" set in Neue Haas Grotesk Display, clamp(2.75rem, 7vw, 5.5rem); entrance timed to power4.out / cubic-bezier(0.16,1,0.3,1), no linear.
- Sub-headline "{{VALUE_PROP}}" in Neue Haas Grotesk Text, max-w-xl, color #7A7A78.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #0B0B0B) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Swiss Brutalist Monochrome palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #F2F2F0 until onLoad fires.

### 3. Destination / Property Grid
- Grid of {{ITEM_1..6}} (properties), max 2px, mostly 0 media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Alpine.js for micro-interactions.

### 4. Experience Story
- Long-form editorial block (Neue Haas Grotesk Display pull-quote + Neue Haas Grotesk Text body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the Swiss Brutalist Monochrome media treatment -- otherwise the block stands on typography alone.

### 5. Itinerary / Booking Flow
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 6. Testimonials
- Testimonial cards from {{TESTIMONIAL_1..4}} (quote, name, role); never fabricated quotes or names.
- Carousel or masonry per Swiss Brutalist Monochrome density; autoplay (if used) pauses on hover/focus and respects prefers-reduced-motion (no autoplay at all).

### 7. CTA
- Full-width closing section, background #0B0B0B, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Neue Haas Grotesk Text, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #DEDEDA, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for travel if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #F2F2F0 with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #0B0B0B, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built hotel / hospitality group product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 727 — Aurora Glassmorphism — Hotel / Hospitality Group

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a hotel / hospitality group ({{PRODUCT_CATEGORY}}). Art direction: aurora glassmorphism — deep space backdrop, drifting light fields, frosted translucent surfaces. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: Tailwind CSS v4
- Animation: Framer Motion for DOM, Mapbox GL JS fly-to transitions for the map layer
- Extra: Mapbox GL JS with a custom muted style matching the palette
- Icons: lucide-react
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #05060B
  --surface: rgba(255,255,255,0.04)
  --border: rgba(255,255,255,0.09)
  --fg: #F4F6FB
  --muted: #8A92A6
  --accent: {{ACCENT_HEX}} (fallback #6E56F8)
  Secondary accents (ambient/illustrative use only, never as the primary CTA color): #2FD4C4, #F857A6
Typography:
  Display: "General Sans" — used for H1/H2, tight tracking
  Body: "Inter" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 20px on glass surfaces
  Signature mechanic: three desynced radial-gradient blobs + backdrop-blur(24px) glass recipe reused everywhere
  Texture layer: SVG feTurbulence grain at 0.035 opacity, pointer-events-none, aria-hidden
  Motion signature: [0.16,1,0.3,1], slow ambient CSS keyframe loops

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #05060B/90 with backdrop-blur(16px) after 40px scroll, transition 400ms [0.16.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in General Sans, weight 700.
- Center/right links styled per the Aurora Glassmorphism type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #6E56F8; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Full-Bleed Hero
- Full-bleed, min-h-[100svh] composition built around three desynced radial-gradient blobs + backdrop-blur(24px) glass recipe reused everywhere.
- H1 "{{HERO_HEADLINE}}" set in General Sans, clamp(2.75rem, 7vw, 5.5rem); entrance timed to [0.16,1,0.3,1], slow ambient CSS keyframe loops.
- Sub-headline "{{VALUE_PROP}}" in Inter, max-w-xl, color #8A92A6.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #6E56F8) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Aurora Glassmorphism palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in rgba(255,255,255,0.04) until onLoad fires.

### 3. Destination / Property Grid
- Grid of {{ITEM_1..6}} (properties), 20px on glass surfaces media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Framer Motion for DOM.

### 4. Experience Story
- Long-form editorial block (General Sans pull-quote + Inter body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the Aurora Glassmorphism media treatment -- otherwise the block stands on typography alone.

### 5. Itinerary / Booking Flow
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 6. Testimonials
- Testimonial cards from {{TESTIMONIAL_1..4}} (quote, name, role); never fabricated quotes or names.
- Carousel or masonry per Aurora Glassmorphism density; autoplay (if used) pauses on hover/focus and respects prefers-reduced-motion (no autoplay at all).

### 7. CTA
- Full-width closing section, background #05060B, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Inter, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at rgba(255,255,255,0.09), copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for travel if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in rgba(255,255,255,0.04) with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #6E56F8, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built hotel / hospitality group product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 728 — Neo-Brutalist Pop — Hotel / Hospitality Group

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a hotel / hospitality group ({{PRODUCT_CATEGORY}}). Art direction: neo-brutalist pop — thick black outlines, flat saturated blocks, deliberately raw hard shadows, no gradients. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: styled-components with a typed theme object
- Animation: Framer Motion + Lenis smooth scroll
- Extra: next/font for all typography
- Icons: lucide-react
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #FDF6EC
  --surface: #FFFFFF
  --border: #111111
  --fg: #111111
  --muted: #5B564E
  --accent: {{ACCENT_HEX}} (fallback #FF4D2E)
  Secondary accents (ambient/illustrative use only, never as the primary CTA color): #FFD23F, #2EC4B6
Typography:
  Display: "Archivo Black" — used for H1/H2, tight tracking
  Body: "Archivo" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 0px everywhere
  Signature mechanic: hard offset shadow (8px 8px 0 #111) that flattens to 0 0 0 on press, thick 3px borders on every block
  Motion signature: steps() and abrupt cubic-bezier(0.68,-0.55,0.27,1.55) overshoot

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #FDF6EC/90 with backdrop-blur(16px) after 40px scroll, transition 400ms steps() and abrupt cubic-bezier(0.68,-0.55,0.27,1.55) overshoot.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Archivo Black, weight 700.
- Center/right links styled per the Neo-Brutalist Pop type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #FF4D2E; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Full-Bleed Hero
- Full-bleed, min-h-[100svh] composition built around hard offset shadow (8px 8px 0 #111) that flattens to 0 0 0 on press, thick 3px borders on every block.
- H1 "{{HERO_HEADLINE}}" set in Archivo Black, clamp(2.75rem, 7vw, 5.5rem); entrance timed to steps() and abrupt cubic-bezier(0.68,-0.55,0.27,1.55) overshoot.
- Sub-headline "{{VALUE_PROP}}" in Archivo, max-w-xl, color #5B564E.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #FF4D2E) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Neo-Brutalist Pop palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #FFFFFF until onLoad fires.

### 3. Destination / Property Grid
- Grid of {{ITEM_1..6}} (properties), 0px everywhere media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Framer Motion.

### 4. Experience Story
- Long-form editorial block (Archivo Black pull-quote + Archivo body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the Neo-Brutalist Pop media treatment -- otherwise the block stands on typography alone.

### 5. Itinerary / Booking Flow
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 6. Testimonials
- Testimonial cards from {{TESTIMONIAL_1..4}} (quote, name, role); never fabricated quotes or names.
- Carousel or masonry per Neo-Brutalist Pop density; autoplay (if used) pauses on hover/focus and respects prefers-reduced-motion (no autoplay at all).

### 7. CTA
- Full-width closing section, background #FDF6EC, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Archivo, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #111111, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for travel if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #FFFFFF with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #FF4D2E, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built hotel / hospitality group product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 729 — Editorial Serif Luxury — Hotel / Hospitality Group

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a hotel / hospitality group ({{PRODUCT_CATEGORY}}). Art direction: editorial serif luxury — magazine-grade serif display type, generous margins, restrained color, photography-led. Production-ready, 100% responsive.

## TECH STACK
- Framework: 11ty (static-first) with Nunjucks templates
- Styling: Tailwind CSS v4 (CLI build, no JS framework runtime)
- Animation: Alpine.js for micro-interactions + CSS scroll-driven animations (animation-timeline: view())
- Extra: Zero client JS framework — ships an HTML/CSS-first page with progressive enhancement
- Icons: inline SVG sprite
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #FBF9F6
  --surface: #F1EDE6
  --border: #E3DCD0
  --fg: #1A1714
  --muted: #8A8175
  --accent: {{ACCENT_HEX}} (fallback #7A2E2E)
Typography:
  Display: "Canela / GT Sectra" — used for H1/H2, tight tracking
  Body: "Söhne" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 0px, hairline rules instead
  Signature mechanic: asymmetric editorial grid with pull-quotes and a running folio/issue number
  Motion signature: ease-out, 600-900ms, understated crossfades

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #FBF9F6/90 with backdrop-blur(16px) after 40px scroll, transition 400ms ease-out.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Canela / GT Sectra, weight 700.
- Center/right links styled per the Editorial Serif Luxury type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #7A2E2E; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Full-Bleed Hero
- Full-bleed, min-h-[100svh] composition built around asymmetric editorial grid with pull-quotes and a running folio/issue number.
- H1 "{{HERO_HEADLINE}}" set in Canela / GT Sectra, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease-out, 600-900ms, understated crossfades.
- Sub-headline "{{VALUE_PROP}}" in Söhne, max-w-xl, color #8A8175.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #7A2E2E) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Editorial Serif Luxury palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #F1EDE6 until onLoad fires.

### 3. Destination / Property Grid
- Grid of {{ITEM_1..6}} (properties), 0px, hairline rules instead media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Alpine.js for micro-interactions.

### 4. Experience Story
- Long-form editorial block (Canela / GT Sectra pull-quote + Söhne body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the Editorial Serif Luxury media treatment -- otherwise the block stands on typography alone.

### 5. Itinerary / Booking Flow
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 6. Testimonials
- Testimonial cards from {{TESTIMONIAL_1..4}} (quote, name, role); never fabricated quotes or names.
- Carousel or masonry per Editorial Serif Luxury density; autoplay (if used) pauses on hover/focus and respects prefers-reduced-motion (no autoplay at all).

### 7. CTA
- Full-width closing section, background #FBF9F6, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Söhne, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #E3DCD0, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for travel if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #F1EDE6 with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #7A2E2E, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built hotel / hospitality group product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 730 — Dark Technical Console — Hotel / Hospitality Group

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a hotel / hospitality group ({{PRODUCT_CATEGORY}}). Art direction: dark technical console — near-black canvas, monospace accents, data-dense panels, engineering credibility. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: Tailwind CSS v4
- Animation: Framer Motion for DOM, Mapbox GL JS fly-to transitions for the map layer
- Extra: Mapbox GL JS with a custom muted style matching the palette
- Icons: lucide-react
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #0A0C10
  --surface: #12151B
  --border: #22262E
  --fg: #E7EAEE
  --muted: #7C838F
  --accent: {{ACCENT_HEX}} (fallback #5EEAD4)
  Secondary accents (ambient/illustrative use only, never as the primary CTA color): #818CF8
Typography:
  Display: "Inter Tight" — used for H1/H2, tight tracking
  Body: "Inter" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 8px
  Signature mechanic: live-updating metric tiles with tabular-nums CountUp and a terminal-style command block
  Texture layer: 1px scanline overlay at 3% opacity, pointer-events-none, aria-hidden
  Motion signature: 150-250ms ease, no bounce

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #0A0C10/90 with backdrop-blur(16px) after 40px scroll, transition 400ms 150-250ms ease.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Inter Tight, weight 700.
- Center/right links styled per the Dark Technical Console type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #5EEAD4; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Full-Bleed Hero
- Full-bleed, min-h-[100svh] composition built around live-updating metric tiles with tabular-nums CountUp and a terminal-style command block.
- H1 "{{HERO_HEADLINE}}" set in Inter Tight, clamp(2.75rem, 7vw, 5.5rem); entrance timed to 150-250ms ease, no bounce.
- Sub-headline "{{VALUE_PROP}}" in Inter, max-w-xl, color #7C838F.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #5EEAD4) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Dark Technical Console palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #12151B until onLoad fires.

### 3. Destination / Property Grid
- Grid of {{ITEM_1..6}} (properties), 8px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Framer Motion for DOM.

### 4. Experience Story
- Long-form editorial block (Inter Tight pull-quote + Inter body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the Dark Technical Console media treatment -- otherwise the block stands on typography alone.

### 5. Itinerary / Booking Flow
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 6. Testimonials
- Testimonial cards from {{TESTIMONIAL_1..4}} (quote, name, role); never fabricated quotes or names.
- Carousel or masonry per Dark Technical Console density; autoplay (if used) pauses on hover/focus and respects prefers-reduced-motion (no autoplay at all).

### 7. CTA
- Full-width closing section, background #0A0C10, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Inter, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #22262E, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for travel if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #12151B with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #5EEAD4, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built hotel / hospitality group product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 731 — Cyberpunk Neon — Hotel / Hospitality Group

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a hotel / hospitality group ({{PRODUCT_CATEGORY}}). Art direction: cyberpunk neon — black canvas, saturated magenta/cyan neon, glitch accents, dense HUD framing. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: styled-components with a typed theme object
- Animation: Framer Motion + Lenis smooth scroll
- Extra: next/font for all typography
- Icons: lucide-react
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #050508
  --surface: #0E0E16
  --border: #2A2A3D
  --fg: #F5F5FF
  --muted: #8B8BA7
  --accent: {{ACCENT_HEX}} (fallback #FF2E9A)
  Secondary accents (ambient/illustrative use only, never as the primary CTA color): #00F5FF
Typography:
  Display: "Rajdhani" — used for H1/H2, tight tracking
  Body: "Space Grotesk" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 2px, corner-clipped (clip-path) panels
  Signature mechanic: scanline + chromatic-aberration text-shadow on the H1, HUD corner brackets on every panel
  Texture layer: animated scanline, 6% opacity, pointer-events-none, aria-hidden
  Motion signature: glitch keyframe (translate jitter 2px, 80ms) on hover only

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #050508/90 with backdrop-blur(16px) after 40px scroll, transition 400ms glitch keyframe (translate jitter 2px, 80ms) on hover only.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Rajdhani, weight 700.
- Center/right links styled per the Cyberpunk Neon type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #FF2E9A; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Full-Bleed Hero
- Full-bleed, min-h-[100svh] composition built around scanline + chromatic-aberration text-shadow on the H1, HUD corner brackets on every panel.
- H1 "{{HERO_HEADLINE}}" set in Rajdhani, clamp(2.75rem, 7vw, 5.5rem); entrance timed to glitch keyframe (translate jitter 2px, 80ms) on hover only.
- Sub-headline "{{VALUE_PROP}}" in Space Grotesk, max-w-xl, color #8B8BA7.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #FF2E9A) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Cyberpunk Neon palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #0E0E16 until onLoad fires.

### 3. Destination / Property Grid
- Grid of {{ITEM_1..6}} (properties), 2px, corner-clipped (clip-path) panels media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Framer Motion.

### 4. Experience Story
- Long-form editorial block (Rajdhani pull-quote + Space Grotesk body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the Cyberpunk Neon media treatment -- otherwise the block stands on typography alone.

### 5. Itinerary / Booking Flow
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 6. Testimonials
- Testimonial cards from {{TESTIMONIAL_1..4}} (quote, name, role); never fabricated quotes or names.
- Carousel or masonry per Cyberpunk Neon density; autoplay (if used) pauses on hover/focus and respects prefers-reduced-motion (no autoplay at all).

### 7. CTA
- Full-width closing section, background #050508, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Space Grotesk, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #2A2A3D, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for travel if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #0E0E16 with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #FF2E9A, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built hotel / hospitality group product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 732 — Industrial Utilitarian — Hotel / Hospitality Group

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a hotel / hospitality group ({{PRODUCT_CATEGORY}}). Art direction: industrial utilitarian — concrete and steel palette, exposed grid lines, stenciled labels, function over decoration. Production-ready, 100% responsive.

## TECH STACK
- Framework: 11ty (static-first) with Nunjucks templates
- Styling: Tailwind CSS v4 (CLI build, no JS framework runtime)
- Animation: Alpine.js for micro-interactions + CSS scroll-driven animations (animation-timeline: view())
- Extra: Zero client JS framework — ships an HTML/CSS-first page with progressive enhancement
- Icons: inline SVG sprite
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #EDECE8
  --surface: #DCDAD3
  --border: #B7B4AA
  --fg: #1F1E1B
  --muted: #6B675E
  --accent: {{ACCENT_HEX}} (fallback #C9491C)
Typography:
  Display: "Suisse Int'l Mono" — used for H1/H2, tight tracking
  Body: "Suisse Int'l" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 0px
  Signature mechanic: visible grid lines (1px --border) drawn across the full viewport as a permanent underlay, stenciled uppercase section labels with dot-leaders
  Texture layer: fine paper-grain at 4%, pointer-events-none, aria-hidden
  Motion signature: linear 200ms for mechanical feel on toggles only, ease-out elsewhere

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #EDECE8/90 with backdrop-blur(16px) after 40px scroll, transition 400ms linear 200ms for mechanical feel on toggles only.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Suisse Int'l Mono, weight 700.
- Center/right links styled per the Industrial Utilitarian type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #C9491C; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Full-Bleed Hero
- Full-bleed, min-h-[100svh] composition built around visible grid lines (1px --border) drawn across the full viewport as a permanent underlay, stenciled uppercase section labels with dot-leaders.
- H1 "{{HERO_HEADLINE}}" set in Suisse Int'l Mono, clamp(2.75rem, 7vw, 5.5rem); entrance timed to linear 200ms for mechanical feel on toggles only, ease-out elsewhere.
- Sub-headline "{{VALUE_PROP}}" in Suisse Int'l, max-w-xl, color #6B675E.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #C9491C) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Industrial Utilitarian palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #DCDAD3 until onLoad fires.

### 3. Destination / Property Grid
- Grid of {{ITEM_1..6}} (properties), 0px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Alpine.js for micro-interactions.

### 4. Experience Story
- Long-form editorial block (Suisse Int'l Mono pull-quote + Suisse Int'l body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the Industrial Utilitarian media treatment -- otherwise the block stands on typography alone.

### 5. Itinerary / Booking Flow
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 6. Testimonials
- Testimonial cards from {{TESTIMONIAL_1..4}} (quote, name, role); never fabricated quotes or names.
- Carousel or masonry per Industrial Utilitarian density; autoplay (if used) pauses on hover/focus and respects prefers-reduced-motion (no autoplay at all).

### 7. CTA
- Full-width closing section, background #EDECE8, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Suisse Int'l, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #B7B4AA, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for travel if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #DCDAD3 with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #C9491C, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built hotel / hospitality group product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 733 — Futuristic Chrome — Hotel / Hospitality Group

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a hotel / hospitality group ({{PRODUCT_CATEGORY}}). Art direction: futuristic chrome — liquid chrome gradients, specular highlights, cool metallic palette, motion-first. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: Tailwind CSS v4
- Animation: Framer Motion for DOM, Mapbox GL JS fly-to transitions for the map layer
- Extra: Mapbox GL JS with a custom muted style matching the palette
- Icons: lucide-react
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #0B0D12
  --surface: #151821
  --border: #2B2F3A
  --fg: #F2F4F8
  --muted: #9AA1AF
  --accent: {{ACCENT_HEX}} (fallback #7DD3FC)
  Secondary accents (ambient/illustrative use only, never as the primary CTA color): #C4B5FD
Typography:
  Display: "Space Grotesk" — used for H1/H2, tight tracking
  Body: "Inter" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 28px, pill-shaped controls
  Signature mechanic: specular chrome gradient sweeping across headline on scroll (background-position tied to scrollYProgress)
  Motion signature: spring(stiffness 220, damping 26) via Framer Motion

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #0B0D12/90 with backdrop-blur(16px) after 40px scroll, transition 400ms spring(stiffness 220, damping 26) via Framer Motion.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Space Grotesk, weight 700.
- Center/right links styled per the Futuristic Chrome type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #7DD3FC; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Full-Bleed Hero
- Full-bleed, min-h-[100svh] composition built around specular chrome gradient sweeping across headline on scroll (background-position tied to scrollYProgress).
- H1 "{{HERO_HEADLINE}}" set in Space Grotesk, clamp(2.75rem, 7vw, 5.5rem); entrance timed to spring(stiffness 220, damping 26) via Framer Motion.
- Sub-headline "{{VALUE_PROP}}" in Inter, max-w-xl, color #9AA1AF.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #7DD3FC) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Futuristic Chrome palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #151821 until onLoad fires.

### 3. Destination / Property Grid
- Grid of {{ITEM_1..6}} (properties), 28px, pill-shaped controls media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Framer Motion for DOM.

### 4. Experience Story
- Long-form editorial block (Space Grotesk pull-quote + Inter body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the Futuristic Chrome media treatment -- otherwise the block stands on typography alone.

### 5. Itinerary / Booking Flow
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 6. Testimonials
- Testimonial cards from {{TESTIMONIAL_1..4}} (quote, name, role); never fabricated quotes or names.
- Carousel or masonry per Futuristic Chrome density; autoplay (if used) pauses on hover/focus and respects prefers-reduced-motion (no autoplay at all).

### 7. CTA
- Full-width closing section, background #0B0D12, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Inter, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #2B2F3A, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for travel if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #151821 with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #7DD3FC, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built hotel / hospitality group product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 734 — Soft Minimal Warmth — Hotel / Hospitality Group

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a hotel / hospitality group ({{PRODUCT_CATEGORY}}). Art direction: soft minimal warmth — warm off-white, generous air, soft shadows, rounded forms, low-contrast restraint. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: styled-components with a typed theme object
- Animation: Framer Motion + Lenis smooth scroll
- Extra: next/font for all typography
- Icons: lucide-react
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #FAF7F2
  --surface: #FFFFFF
  --border: #ECE6DC
  --fg: #2B2620
  --muted: #928C80
  --accent: {{ACCENT_HEX}} (fallback #D97757)
Typography:
  Display: "Fraunces" — used for H1/H2, tight tracking
  Body: "Inter" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 24px
  Signature mechanic: soft double-layer drop shadow (0 1px 2px + 0 12px 24px at 6%) on every raised surface, no borders — light does the separating
  Motion signature: ease-out 400-600ms, gentle y:12→0 reveals

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #FAF7F2/90 with backdrop-blur(16px) after 40px scroll, transition 400ms ease-out 400-600ms.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Fraunces, weight 700.
- Center/right links styled per the Soft Minimal Warmth type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #D97757; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Full-Bleed Hero
- Full-bleed, min-h-[100svh] composition built around soft double-layer drop shadow (0 1px 2px + 0 12px 24px at 6%) on every raised surface, no borders — light does the separating.
- H1 "{{HERO_HEADLINE}}" set in Fraunces, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease-out 400-600ms, gentle y:12→0 reveals.
- Sub-headline "{{VALUE_PROP}}" in Inter, max-w-xl, color #928C80.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #D97757) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Soft Minimal Warmth palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #FFFFFF until onLoad fires.

### 3. Destination / Property Grid
- Grid of {{ITEM_1..6}} (properties), 24px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Framer Motion.

### 4. Experience Story
- Long-form editorial block (Fraunces pull-quote + Inter body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the Soft Minimal Warmth media treatment -- otherwise the block stands on typography alone.

### 5. Itinerary / Booking Flow
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 6. Testimonials
- Testimonial cards from {{TESTIMONIAL_1..4}} (quote, name, role); never fabricated quotes or names.
- Carousel or masonry per Soft Minimal Warmth density; autoplay (if used) pauses on hover/focus and respects prefers-reduced-motion (no autoplay at all).

### 7. CTA
- Full-width closing section, background #FAF7F2, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Inter, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #ECE6DC, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for travel if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #FFFFFF with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #D97757, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built hotel / hospitality group product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 735 — Art Deco Revival — Hotel / Hospitality Group

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a hotel / hospitality group ({{PRODUCT_CATEGORY}}). Art direction: art deco revival — gold on deep emerald/black, geometric fan and sunburst motifs, symmetrical ornament. Production-ready, 100% responsive.

## TECH STACK
- Framework: 11ty (static-first) with Nunjucks templates
- Styling: Tailwind CSS v4 (CLI build, no JS framework runtime)
- Animation: Alpine.js for micro-interactions + CSS scroll-driven animations (animation-timeline: view())
- Extra: Zero client JS framework — ships an HTML/CSS-first page with progressive enhancement
- Icons: inline SVG sprite
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #0D1512
  --surface: #122019
  --border: #B8935A
  --fg: #F3E9D2
  --muted: #9FB5A8
  --accent: {{ACCENT_HEX}} (fallback #C9A96A)
Typography:
  Display: "Poiret One / Cinzel" — used for H1/H2, tight tracking
  Body: "Cormorant" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 0px, chamfered corners via clip-path
  Signature mechanic: repeating SVG sunburst/fan motif as section dividers, gold 1px double-rule borders
  Texture layer: subtle metallic gradient noise, pointer-events-none, aria-hidden
  Motion signature: ease-in-out 700ms, symmetrical mirrored reveals

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #0D1512/90 with backdrop-blur(16px) after 40px scroll, transition 400ms ease-in-out 700ms.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Poiret One / Cinzel, weight 700.
- Center/right links styled per the Art Deco Revival type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #C9A96A; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Full-Bleed Hero
- Full-bleed, min-h-[100svh] composition built around repeating SVG sunburst/fan motif as section dividers, gold 1px double-rule borders.
- H1 "{{HERO_HEADLINE}}" set in Poiret One / Cinzel, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease-in-out 700ms, symmetrical mirrored reveals.
- Sub-headline "{{VALUE_PROP}}" in Cormorant, max-w-xl, color #9FB5A8.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #C9A96A) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Art Deco Revival palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #122019 until onLoad fires.

### 3. Destination / Property Grid
- Grid of {{ITEM_1..6}} (properties), 0px, chamfered corners via clip-path media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Alpine.js for micro-interactions.

### 4. Experience Story
- Long-form editorial block (Poiret One / Cinzel pull-quote + Cormorant body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the Art Deco Revival media treatment -- otherwise the block stands on typography alone.

### 5. Itinerary / Booking Flow
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 6. Testimonials
- Testimonial cards from {{TESTIMONIAL_1..4}} (quote, name, role); never fabricated quotes or names.
- Carousel or masonry per Art Deco Revival density; autoplay (if used) pauses on hover/focus and respects prefers-reduced-motion (no autoplay at all).

### 7. CTA
- Full-width closing section, background #0D1512, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Cormorant, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #B8935A, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for travel if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #122019 with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #C9A96A, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built hotel / hospitality group product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 736 — Japanese Minimal (Ma) — Hotel / Hospitality Group

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a hotel / hospitality group ({{PRODUCT_CATEGORY}}). Art direction: japanese minimal (ma) — extreme negative space, single accent stroke, vertical rhythm, quiet confidence. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: Tailwind CSS v4
- Animation: Framer Motion for DOM, Mapbox GL JS fly-to transitions for the map layer
- Extra: Mapbox GL JS with a custom muted style matching the palette
- Icons: lucide-react
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #FCFCFA
  --surface: #F5F4F0
  --border: #E2E0D8
  --fg: #1C1C1A
  --muted: #8D8B84
  --accent: {{ACCENT_HEX}} (fallback #C1121F)
Typography:
  Display: "Zen Old Mincho / Shippori Mincho" — used for H1/H2, tight tracking
  Body: "Noto Sans JP fallback / Inter" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 0px
  Signature mechanic: a single vertical hairline rule tracks scroll progress along the left margin; content occupies at most 60% of viewport width
  Motion signature: ease 800ms, single elements move — never groups at once

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #FCFCFA/90 with backdrop-blur(16px) after 40px scroll, transition 400ms ease 800ms.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Zen Old Mincho / Shippori Mincho, weight 700.
- Center/right links styled per the Japanese Minimal (Ma) type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #C1121F; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Full-Bleed Hero
- Full-bleed, min-h-[100svh] composition built around a single vertical hairline rule tracks scroll progress along the left margin; content occupies at most 60% of viewport width.
- H1 "{{HERO_HEADLINE}}" set in Zen Old Mincho / Shippori Mincho, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease 800ms, single elements move — never groups at once.
- Sub-headline "{{VALUE_PROP}}" in Noto Sans JP fallback / Inter, max-w-xl, color #8D8B84.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #C1121F) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Japanese Minimal (Ma) palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #F5F4F0 until onLoad fires.

### 3. Destination / Property Grid
- Grid of {{ITEM_1..6}} (properties), 0px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Framer Motion for DOM.

### 4. Experience Story
- Long-form editorial block (Zen Old Mincho / Shippori Mincho pull-quote + Noto Sans JP fallback / Inter body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the Japanese Minimal (Ma) media treatment -- otherwise the block stands on typography alone.

### 5. Itinerary / Booking Flow
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 6. Testimonials
- Testimonial cards from {{TESTIMONIAL_1..4}} (quote, name, role); never fabricated quotes or names.
- Carousel or masonry per Japanese Minimal (Ma) density; autoplay (if used) pauses on hover/focus and respects prefers-reduced-motion (no autoplay at all).

### 7. CTA
- Full-width closing section, background #FCFCFA, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Noto Sans JP fallback / Inter, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #E2E0D8, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for travel if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #F5F4F0 with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #C1121F, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built hotel / hospitality group product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 737 — Scandinavian Functional — Hotel / Hospitality Group

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a hotel / hospitality group ({{PRODUCT_CATEGORY}}). Art direction: scandinavian functional — light wood-neutral palette, clean sans type, function-led hierarchy, quiet confidence. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: styled-components with a typed theme object
- Animation: Framer Motion + Lenis smooth scroll
- Extra: next/font for all typography
- Icons: lucide-react
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #F7F5F2
  --surface: #FFFFFF
  --border: #E4E0D8
  --fg: #232320
  --muted: #7D7A72
  --accent: {{ACCENT_HEX}} (fallback #3E6259)
Typography:
  Display: "Söhne" — used for H1/H2, tight tracking
  Body: "Söhne" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 12px
  Signature mechanic: consistent 8pt spacing scale exposed as visible rhythm between hairline-separated blocks
  Motion signature: ease-out 300ms, no overshoot

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #F7F5F2/90 with backdrop-blur(16px) after 40px scroll, transition 400ms ease-out 300ms.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Söhne, weight 700.
- Center/right links styled per the Scandinavian Functional type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #3E6259; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Full-Bleed Hero
- Full-bleed, min-h-[100svh] composition built around consistent 8pt spacing scale exposed as visible rhythm between hairline-separated blocks.
- H1 "{{HERO_HEADLINE}}" set in Söhne, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease-out 300ms, no overshoot.
- Sub-headline "{{VALUE_PROP}}" in Söhne, max-w-xl, color #7D7A72.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #3E6259) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Scandinavian Functional palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #FFFFFF until onLoad fires.

### 3. Destination / Property Grid
- Grid of {{ITEM_1..6}} (properties), 12px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Framer Motion.

### 4. Experience Story
- Long-form editorial block (Söhne pull-quote + Söhne body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the Scandinavian Functional media treatment -- otherwise the block stands on typography alone.

### 5. Itinerary / Booking Flow
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 6. Testimonials
- Testimonial cards from {{TESTIMONIAL_1..4}} (quote, name, role); never fabricated quotes or names.
- Carousel or masonry per Scandinavian Functional density; autoplay (if used) pauses on hover/focus and respects prefers-reduced-motion (no autoplay at all).

### 7. CTA
- Full-width closing section, background #F7F5F2, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Söhne, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #E4E0D8, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for travel if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #FFFFFF with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #3E6259, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built hotel / hospitality group product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 738 — Retro-Futurist 80s — Hotel / Hospitality Group

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a hotel / hospitality group ({{PRODUCT_CATEGORY}}). Art direction: retro-futurist 80s — sunset gradient, chrome grid horizon, VHS scanlines, synthwave palette. Production-ready, 100% responsive.

## TECH STACK
- Framework: 11ty (static-first) with Nunjucks templates
- Styling: Tailwind CSS v4 (CLI build, no JS framework runtime)
- Animation: Alpine.js for micro-interactions + CSS scroll-driven animations (animation-timeline: view())
- Extra: Zero client JS framework — ships an HTML/CSS-first page with progressive enhancement
- Icons: inline SVG sprite
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #1A0B2E
  --surface: #26123F
  --border: #4A2472
  --fg: #FCEEFF
  --muted: #B79BD6
  --accent: {{ACCENT_HEX}} (fallback #FF6EC7)
  Secondary accents (ambient/illustrative use only, never as the primary CTA color): #00D9FF, #FFB86C
Typography:
  Display: "Righteous" — used for H1/H2, tight tracking
  Body: "Space Grotesk" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 4px
  Signature mechanic: perspective CSS grid horizon (transform: perspective(500px) rotateX(60deg)) receding beneath the hero, sun gradient circle behind it
  Texture layer: VHS scanline + chromatic aberration, pointer-events-none, aria-hidden
  Motion signature: linear scanline drift 8s infinite, ease-out for content

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #1A0B2E/90 with backdrop-blur(16px) after 40px scroll, transition 400ms linear scanline drift 8s infinite.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Righteous, weight 700.
- Center/right links styled per the Retro-Futurist 80s type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #FF6EC7; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Full-Bleed Hero
- Full-bleed, min-h-[100svh] composition built around perspective CSS grid horizon (transform: perspective(500px) rotateX(60deg)) receding beneath the hero, sun gradient circle behind it.
- H1 "{{HERO_HEADLINE}}" set in Righteous, clamp(2.75rem, 7vw, 5.5rem); entrance timed to linear scanline drift 8s infinite, ease-out for content.
- Sub-headline "{{VALUE_PROP}}" in Space Grotesk, max-w-xl, color #B79BD6.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #FF6EC7) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Retro-Futurist 80s palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #26123F until onLoad fires.

### 3. Destination / Property Grid
- Grid of {{ITEM_1..6}} (properties), 4px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Alpine.js for micro-interactions.

### 4. Experience Story
- Long-form editorial block (Righteous pull-quote + Space Grotesk body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the Retro-Futurist 80s media treatment -- otherwise the block stands on typography alone.

### 5. Itinerary / Booking Flow
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 6. Testimonials
- Testimonial cards from {{TESTIMONIAL_1..4}} (quote, name, role); never fabricated quotes or names.
- Carousel or masonry per Retro-Futurist 80s density; autoplay (if used) pauses on hover/focus and respects prefers-reduced-motion (no autoplay at all).

### 7. CTA
- Full-width closing section, background #1A0B2E, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Space Grotesk, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #4A2472, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for travel if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #26123F with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #FF6EC7, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built hotel / hospitality group product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 739 — Y2K Cyber-Cute — Hotel / Hospitality Group

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a hotel / hospitality group ({{PRODUCT_CATEGORY}}). Art direction: y2k cyber-cute — chrome bubbles, gradient blobs, glossy buttons, playful maximal energy. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: Tailwind CSS v4
- Animation: Framer Motion for DOM, Mapbox GL JS fly-to transitions for the map layer
- Extra: Mapbox GL JS with a custom muted style matching the palette
- Icons: lucide-react
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #EAF2FF
  --surface: #FFFFFF
  --border: #C7DBFF
  --fg: #0E1B33
  --muted: #5C6B8C
  --accent: {{ACCENT_HEX}} (fallback #7C5CFF)
  Secondary accents (ambient/illustrative use only, never as the primary CTA color): #FF5CA8, #5CE1FF
Typography:
  Display: "Chakra Petch" — used for H1/H2, tight tracking
  Body: "Poppins" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 9999px on buttons, 32px on cards
  Signature mechanic: glossy specular-highlight gradient buttons (radial-gradient white 10% at top-left), floating blob shapes drifting on scroll parallax
  Motion signature: spring bounce (stiffness 300, damping 18)

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #EAF2FF/90 with backdrop-blur(16px) after 40px scroll, transition 400ms spring bounce (stiffness 300, damping 18).
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Chakra Petch, weight 700.
- Center/right links styled per the Y2K Cyber-Cute type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #7C5CFF; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Full-Bleed Hero
- Full-bleed, min-h-[100svh] composition built around glossy specular-highlight gradient buttons (radial-gradient white 10% at top-left), floating blob shapes drifting on scroll parallax.
- H1 "{{HERO_HEADLINE}}" set in Chakra Petch, clamp(2.75rem, 7vw, 5.5rem); entrance timed to spring bounce (stiffness 300, damping 18).
- Sub-headline "{{VALUE_PROP}}" in Poppins, max-w-xl, color #5C6B8C.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #7C5CFF) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Y2K Cyber-Cute palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #FFFFFF until onLoad fires.

### 3. Destination / Property Grid
- Grid of {{ITEM_1..6}} (properties), 9999px on buttons, 32px on cards media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Framer Motion for DOM.

### 4. Experience Story
- Long-form editorial block (Chakra Petch pull-quote + Poppins body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the Y2K Cyber-Cute media treatment -- otherwise the block stands on typography alone.

### 5. Itinerary / Booking Flow
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 6. Testimonials
- Testimonial cards from {{TESTIMONIAL_1..4}} (quote, name, role); never fabricated quotes or names.
- Carousel or masonry per Y2K Cyber-Cute density; autoplay (if used) pauses on hover/focus and respects prefers-reduced-motion (no autoplay at all).

### 7. CTA
- Full-width closing section, background #EAF2FF, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Poppins, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #C7DBFF, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for travel if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #FFFFFF with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #7C5CFF, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built hotel / hospitality group product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 740 — Digital Laboratory — Hotel / Hospitality Group

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a hotel / hospitality group ({{PRODUCT_CATEGORY}}). Art direction: digital laboratory — clinical white/blue, precise data grids, diagrammatic annotation lines. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: styled-components with a typed theme object
- Animation: Framer Motion + Lenis smooth scroll
- Extra: next/font for all typography
- Icons: lucide-react
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #FFFFFF
  --surface: #F4F7FB
  --border: #D7E1EE
  --fg: #101828
  --muted: #667085
  --accent: {{ACCENT_HEX}} (fallback #2E6FF2)
Typography:
  Display: "IBM Plex Sans" — used for H1/H2, tight tracking
  Body: "IBM Plex Sans" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 6px
  Signature mechanic: annotation leader-lines (SVG) connecting labels to UI elements, like a lab specimen diagram
  Texture layer: 1px graph-paper grid at 3% opacity, pointer-events-none, aria-hidden
  Motion signature: ease 200ms, precise not playful

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #FFFFFF/90 with backdrop-blur(16px) after 40px scroll, transition 400ms ease 200ms.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in IBM Plex Sans, weight 700.
- Center/right links styled per the Digital Laboratory type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #2E6FF2; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Full-Bleed Hero
- Full-bleed, min-h-[100svh] composition built around annotation leader-lines (SVG) connecting labels to UI elements, like a lab specimen diagram.
- H1 "{{HERO_HEADLINE}}" set in IBM Plex Sans, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease 200ms, precise not playful.
- Sub-headline "{{VALUE_PROP}}" in IBM Plex Sans, max-w-xl, color #667085.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #2E6FF2) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Digital Laboratory palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #F4F7FB until onLoad fires.

### 3. Destination / Property Grid
- Grid of {{ITEM_1..6}} (properties), 6px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Framer Motion.

### 4. Experience Story
- Long-form editorial block (IBM Plex Sans pull-quote + IBM Plex Sans body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the Digital Laboratory media treatment -- otherwise the block stands on typography alone.

### 5. Itinerary / Booking Flow
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 6. Testimonials
- Testimonial cards from {{TESTIMONIAL_1..4}} (quote, name, role); never fabricated quotes or names.
- Carousel or masonry per Digital Laboratory density; autoplay (if used) pauses on hover/focus and respects prefers-reduced-motion (no autoplay at all).

### 7. CTA
- Full-width closing section, background #101828, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in IBM Plex Sans, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #D7E1EE, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for travel if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #F4F7FB with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #2E6FF2, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built hotel / hospitality group product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 741 — Terminal-Inspired CLI — Hotel / Hospitality Group

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a hotel / hospitality group ({{PRODUCT_CATEGORY}}). Art direction: terminal-inspired cli — pure monospace, green/amber phosphor accent on black, blinking cursor motifs. Production-ready, 100% responsive.

## TECH STACK
- Framework: 11ty (static-first) with Nunjucks templates
- Styling: Tailwind CSS v4 (CLI build, no JS framework runtime)
- Animation: Alpine.js for micro-interactions + CSS scroll-driven animations (animation-timeline: view())
- Extra: Zero client JS framework — ships an HTML/CSS-first page with progressive enhancement
- Icons: inline SVG sprite
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #080A08
  --surface: #0F120F
  --border: #1F261F
  --fg: #D6FFD6
  --muted: #6B8F6B
  --accent: {{ACCENT_HEX}} (fallback #39FF14)
Typography:
  Display: "JetBrains Mono" — used for H1/H2, tight tracking
  Body: "JetBrains Mono" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 0px
  Signature mechanic: hero headline types itself out character-by-character with a blinking block cursor; every panel has a fake terminal titlebar with 3 dots
  Texture layer: CRT vignette + scanline at 5%, pointer-events-none, aria-hidden
  Motion signature: typewriter reveal, step-end steps(n)

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #080A08/90 with backdrop-blur(16px) after 40px scroll, transition 400ms typewriter reveal.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in JetBrains Mono, weight 700.
- Center/right links styled per the Terminal-Inspired CLI type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #39FF14; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Full-Bleed Hero
- Full-bleed, min-h-[100svh] composition built around hero headline types itself out character-by-character with a blinking block cursor; every panel has a fake terminal titlebar with 3 dots.
- H1 "{{HERO_HEADLINE}}" set in JetBrains Mono, clamp(2.75rem, 7vw, 5.5rem); entrance timed to typewriter reveal, step-end steps(n).
- Sub-headline "{{VALUE_PROP}}" in JetBrains Mono, max-w-xl, color #6B8F6B.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #39FF14) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Terminal-Inspired CLI palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #0F120F until onLoad fires.

### 3. Destination / Property Grid
- Grid of {{ITEM_1..6}} (properties), 0px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Alpine.js for micro-interactions.

### 4. Experience Story
- Long-form editorial block (JetBrains Mono pull-quote + JetBrains Mono body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the Terminal-Inspired CLI media treatment -- otherwise the block stands on typography alone.

### 5. Itinerary / Booking Flow
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 6. Testimonials
- Testimonial cards from {{TESTIMONIAL_1..4}} (quote, name, role); never fabricated quotes or names.
- Carousel or masonry per Terminal-Inspired CLI density; autoplay (if used) pauses on hover/focus and respects prefers-reduced-motion (no autoplay at all).

### 7. CTA
- Full-width closing section, background #080A08, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in JetBrains Mono, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #1F261F, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for travel if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #0F120F with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #39FF14, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built hotel / hospitality group product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 742 — Financial Terminal Dense — Hotel / Hospitality Group

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a hotel / hospitality group ({{PRODUCT_CATEGORY}}). Art direction: financial terminal dense — black/near-black, tabular-nums everywhere, ticker rows, high information density. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: Tailwind CSS v4
- Animation: Framer Motion for DOM, Mapbox GL JS fly-to transitions for the map layer
- Extra: Mapbox GL JS with a custom muted style matching the palette
- Icons: lucide-react
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #000000
  --surface: #0C0F0C
  --border: #1E231E
  --fg: #E4E9E4
  --muted: #7C867C
  --accent: {{ACCENT_HEX}} (fallback #00C853)
  Secondary accents (ambient/illustrative use only, never as the primary CTA color): #FF3B30
Typography:
  Display: "IBM Plex Mono" — used for H1/H2, tight tracking
  Body: "IBM Plex Sans" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 2px
  Signature mechanic: a live scrolling ticker row (marquee) of tabular-nums values that flash green/red on change, dense multi-column data tables
  Motion signature: ease 150ms, numeric roll via CountUp only

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #000000/90 with backdrop-blur(16px) after 40px scroll, transition 400ms ease 150ms.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in IBM Plex Mono, weight 700.
- Center/right links styled per the Financial Terminal Dense type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #00C853; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Full-Bleed Hero
- Full-bleed, min-h-[100svh] composition built around a live scrolling ticker row (marquee) of tabular-nums values that flash green/red on change, dense multi-column data tables.
- H1 "{{HERO_HEADLINE}}" set in IBM Plex Mono, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease 150ms, numeric roll via CountUp only.
- Sub-headline "{{VALUE_PROP}}" in IBM Plex Sans, max-w-xl, color #7C867C.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #00C853) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Financial Terminal Dense palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #0C0F0C until onLoad fires.

### 3. Destination / Property Grid
- Grid of {{ITEM_1..6}} (properties), 2px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Framer Motion for DOM.

### 4. Experience Story
- Long-form editorial block (IBM Plex Mono pull-quote + IBM Plex Sans body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the Financial Terminal Dense media treatment -- otherwise the block stands on typography alone.

### 5. Itinerary / Booking Flow
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 6. Testimonials
- Testimonial cards from {{TESTIMONIAL_1..4}} (quote, name, role); never fabricated quotes or names.
- Carousel or masonry per Financial Terminal Dense density; autoplay (if used) pauses on hover/focus and respects prefers-reduced-motion (no autoplay at all).

### 7. CTA
- Full-width closing section, background #000000, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in IBM Plex Sans, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #1E231E, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for travel if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #0C0F0C with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #00C853, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built hotel / hospitality group product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 743 — Magazine Grid — Hotel / Hospitality Group

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a hotel / hospitality group ({{PRODUCT_CATEGORY}}). Art direction: magazine grid — multi-column editorial grid, drop caps, running heads, varied image sizes. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: styled-components with a typed theme object
- Animation: Framer Motion + Lenis smooth scroll
- Extra: next/font for all typography
- Icons: lucide-react
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #FFFFFF
  --surface: #F6F5F2
  --border: #DEDBD2
  --fg: #181614
  --muted: #847E71
  --accent: {{ACCENT_HEX}} (fallback #B0281C)
Typography:
  Display: "Tiempos Headline" — used for H1/H2, tight tracking
  Body: "Tiempos Text" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 0px
  Signature mechanic: a masthead running head fixed at top (issue number, section name), first paragraph after each H2 gets a 3-line drop cap
  Motion signature: ease-out 500ms crossfades between spreads

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #FFFFFF/90 with backdrop-blur(16px) after 40px scroll, transition 400ms ease-out 500ms crossfades between spreads.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Tiempos Headline, weight 700.
- Center/right links styled per the Magazine Grid type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #B0281C; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Full-Bleed Hero
- Full-bleed, min-h-[100svh] composition built around a masthead running head fixed at top (issue number, section name), first paragraph after each H2 gets a 3-line drop cap.
- H1 "{{HERO_HEADLINE}}" set in Tiempos Headline, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease-out 500ms crossfades between spreads.
- Sub-headline "{{VALUE_PROP}}" in Tiempos Text, max-w-xl, color #847E71.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #B0281C) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Magazine Grid palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #F6F5F2 until onLoad fires.

### 3. Destination / Property Grid
- Grid of {{ITEM_1..6}} (properties), 0px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Framer Motion.

### 4. Experience Story
- Long-form editorial block (Tiempos Headline pull-quote + Tiempos Text body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the Magazine Grid media treatment -- otherwise the block stands on typography alone.

### 5. Itinerary / Booking Flow
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 6. Testimonials
- Testimonial cards from {{TESTIMONIAL_1..4}} (quote, name, role); never fabricated quotes or names.
- Carousel or masonry per Magazine Grid density; autoplay (if used) pauses on hover/focus and respects prefers-reduced-motion (no autoplay at all).

### 7. CTA
- Full-width closing section, background #181614, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Tiempos Text, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #DEDBD2, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for travel if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #F6F5F2 with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #B0281C, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built hotel / hospitality group product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 744 — High-Fashion Editorial — Hotel / Hospitality Group

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a hotel / hospitality group ({{PRODUCT_CATEGORY}}). Art direction: high-fashion editorial — full-bleed monochrome photography, oversized condensed type, extreme minimalism. Production-ready, 100% responsive.

## TECH STACK
- Framework: 11ty (static-first) with Nunjucks templates
- Styling: Tailwind CSS v4 (CLI build, no JS framework runtime)
- Animation: Alpine.js for micro-interactions + CSS scroll-driven animations (animation-timeline: view())
- Extra: Zero client JS framework — ships an HTML/CSS-first page with progressive enhancement
- Icons: inline SVG sprite
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #111111
  --surface: #000000
  --border: #2E2E2E
  --fg: #F5F5F5
  --muted: #9A9A9A
  --accent: {{ACCENT_HEX}} (fallback #FFFFFF)
Typography:
  Display: "PP Neue Montreal Condensed" — used for H1/H2, tight tracking
  Body: "PP Neue Montreal" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 0px
  Signature mechanic: full-viewport image bleeds with condensed vertical wordmark rotated -90deg pinned to the edge
  Motion signature: ease 900ms, slow deliberate crossfades — never fast

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #111111/90 with backdrop-blur(16px) after 40px scroll, transition 400ms ease 900ms.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in PP Neue Montreal Condensed, weight 700.
- Center/right links styled per the High-Fashion Editorial type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #FFFFFF; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Full-Bleed Hero
- Full-bleed, min-h-[100svh] composition built around full-viewport image bleeds with condensed vertical wordmark rotated -90deg pinned to the edge.
- H1 "{{HERO_HEADLINE}}" set in PP Neue Montreal Condensed, clamp(2.75rem, 7vw, 6rem); entrance timed to ease 900ms, slow deliberate crossfades — never fast.
- Sub-headline "{{VALUE_PROP}}" in PP Neue Montreal, max-w-xl, color #9A9A9A.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #FFFFFF) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the High-Fashion Editorial palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #000000 until onLoad fires.

### 3. Destination / Property Grid
- Grid of {{ITEM_1..6}} (properties), 0px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Alpine.js for micro-interactions.

### 4. Experience Story
- Long-form editorial block (PP Neue Montreal Condensed pull-quote + PP Neue Montreal body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the High-Fashion Editorial media treatment -- otherwise the block stands on typography alone.

### 5. Itinerary / Booking Flow
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 6. Testimonials
- Testimonial cards from {{TESTIMONIAL_1..4}} (quote, name, role); never fabricated quotes or names.
- Carousel or masonry per High-Fashion Editorial density; autoplay (if used) pauses on hover/focus and respects prefers-reduced-motion (no autoplay at all).

### 7. CTA
- Full-width closing section, background #111111, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in PP Neue Montreal, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #2E2E2E, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for travel if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #000000 with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #FFFFFF, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built hotel / hospitality group product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 745 — Architectural Blueprint — Hotel / Hospitality Group

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a hotel / hospitality group ({{PRODUCT_CATEGORY}}). Art direction: architectural blueprint — technical drawing aesthetic, thin precise lines, dimension annotations, cool blue-grey. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: Tailwind CSS v4
- Animation: Framer Motion for DOM, Mapbox GL JS fly-to transitions for the map layer
- Extra: Mapbox GL JS with a custom muted style matching the palette
- Icons: lucide-react
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #F5F6F7
  --surface: #FFFFFF
  --border: #C7CCD1
  --fg: #1B2126
  --muted: #6E7981
  --accent: {{ACCENT_HEX}} (fallback #1B4B91)
Typography:
  Display: "Neue Haas Unica" — used for H1/H2, tight tracking
  Body: "Neue Haas Unica" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 0px
  Signature mechanic: SVG dimension lines with arrow endpoints and measurement labels annotate key layout sections, as in a blueprint
  Texture layer: faint blueprint grid at 4%, pointer-events-none, aria-hidden
  Motion signature: ease 300ms, draws lines via stroke-dashoffset animation

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #F5F6F7/90 with backdrop-blur(16px) after 40px scroll, transition 400ms ease 300ms.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Neue Haas Unica, weight 700.
- Center/right links styled per the Architectural Blueprint type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #1B4B91; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Full-Bleed Hero
- Full-bleed, min-h-[100svh] composition built around SVG dimension lines with arrow endpoints and measurement labels annotate key layout sections, as in a blueprint.
- H1 "{{HERO_HEADLINE}}" set in Neue Haas Unica, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease 300ms, draws lines via stroke-dashoffset animation.
- Sub-headline "{{VALUE_PROP}}" in Neue Haas Unica, max-w-xl, color #6E7981.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #1B4B91) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Architectural Blueprint palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #FFFFFF until onLoad fires.

### 3. Destination / Property Grid
- Grid of {{ITEM_1..6}} (properties), 0px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Framer Motion for DOM.

### 4. Experience Story
- Long-form editorial block (Neue Haas Unica pull-quote + Neue Haas Unica body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the Architectural Blueprint media treatment -- otherwise the block stands on typography alone.

### 5. Itinerary / Booking Flow
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 6. Testimonials
- Testimonial cards from {{TESTIMONIAL_1..4}} (quote, name, role); never fabricated quotes or names.
- Carousel or masonry per Architectural Blueprint density; autoplay (if used) pauses on hover/focus and respects prefers-reduced-motion (no autoplay at all).

### 7. CTA
- Full-width closing section, background #F5F6F7, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Neue Haas Unica, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #C7CCD1, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for travel if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #FFFFFF with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #1B4B91, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built hotel / hospitality group product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 746 — Experimental Typography — Hotel / Hospitality Group

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a hotel / hospitality group ({{PRODUCT_CATEGORY}}). Art direction: experimental typography — type as the primary graphic device — variable font weight/width driven by scroll or cursor. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: styled-components with a typed theme object
- Animation: Framer Motion + Lenis smooth scroll
- Extra: next/font for all typography
- Icons: lucide-react
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #111014
  --surface: #1A1820
  --border: #312E3B
  --fg: #F1EEF7
  --muted: #948FA3
  --accent: {{ACCENT_HEX}} (fallback #E8FF59)
Typography:
  Display: "Variable custom (wght/wdth axes)" — used for H1/H2, tight tracking
  Body: "Suisse Int'l" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 0px
  Signature mechanic: headline font-variation-settings 'wght' and 'wdth' interpolate live with scroll velocity and cursor proximity per character
  Motion signature: scroll-linked variable-font-variation-settings interpolation

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #111014/90 with backdrop-blur(16px) after 40px scroll, transition 400ms scroll-linked variable-font-variation-settings interpolation.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Variable custom (wght/wdth axes), weight 700.
- Center/right links styled per the Experimental Typography type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #E8FF59; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Full-Bleed Hero
- Full-bleed, min-h-[100svh] composition built around headline font-variation-settings 'wght' and 'wdth' interpolate live with scroll velocity and cursor proximity per character.
- H1 "{{HERO_HEADLINE}}" set in Variable custom (wght/wdth axes), clamp(2.75rem, 7vw, 5.5rem); entrance timed to scroll-linked variable-font-variation-settings interpolation.
- Sub-headline "{{VALUE_PROP}}" in Suisse Int'l, max-w-xl, color #948FA3.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #E8FF59) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Experimental Typography palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #1A1820 until onLoad fires.

### 3. Destination / Property Grid
- Grid of {{ITEM_1..6}} (properties), 0px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Framer Motion.

### 4. Experience Story
- Long-form editorial block (Variable custom (wght/wdth axes) pull-quote + Suisse Int'l body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the Experimental Typography media treatment -- otherwise the block stands on typography alone.

### 5. Itinerary / Booking Flow
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 6. Testimonials
- Testimonial cards from {{TESTIMONIAL_1..4}} (quote, name, role); never fabricated quotes or names.
- Carousel or masonry per Experimental Typography density; autoplay (if used) pauses on hover/focus and respects prefers-reduced-motion (no autoplay at all).

### 7. CTA
- Full-width closing section, background #111014, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Suisse Int'l, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #312E3B, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for travel if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #1A1820 with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #E8FF59, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built hotel / hospitality group product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 747 — Data-Dense Analytics — Hotel / Hospitality Group

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a hotel / hospitality group ({{PRODUCT_CATEGORY}}). Art direction: data-dense analytics — tight information density, small multiples, sparkline-everything, muted chart palette. Production-ready, 100% responsive.

## TECH STACK
- Framework: 11ty (static-first) with Nunjucks templates
- Styling: Tailwind CSS v4 (CLI build, no JS framework runtime)
- Animation: Alpine.js for micro-interactions + CSS scroll-driven animations (animation-timeline: view())
- Extra: Zero client JS framework — ships an HTML/CSS-first page with progressive enhancement
- Icons: inline SVG sprite
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #0E1116
  --surface: #161A21
  --border: #262C36
  --fg: #DEE3EA
  --muted: #7E8896
  --accent: {{ACCENT_HEX}} (fallback #4C9AFF)
  Secondary accents (ambient/illustrative use only, never as the primary CTA color): #F5A623
Typography:
  Display: "Inter Tight" — used for H1/H2, tight tracking
  Body: "Inter" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 10px
  Signature mechanic: a grid of small-multiple sparkline cards, each with a live-updating value and a 30-day trend line drawn in SVG
  Motion signature: ease 180ms, chart transitions via d3 interpolate

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #0E1116/90 with backdrop-blur(16px) after 40px scroll, transition 400ms ease 180ms.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Inter Tight, weight 700.
- Center/right links styled per the Data-Dense Analytics type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #4C9AFF; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Full-Bleed Hero
- Full-bleed, min-h-[100svh] composition built around a grid of small-multiple sparkline cards, each with a live-updating value and a 30-day trend line drawn in SVG.
- H1 "{{HERO_HEADLINE}}" set in Inter Tight, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease 180ms, chart transitions via d3 interpolate.
- Sub-headline "{{VALUE_PROP}}" in Inter, max-w-xl, color #7E8896.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #4C9AFF) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Data-Dense Analytics palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #161A21 until onLoad fires.

### 3. Destination / Property Grid
- Grid of {{ITEM_1..6}} (properties), 10px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Alpine.js for micro-interactions.

### 4. Experience Story
- Long-form editorial block (Inter Tight pull-quote + Inter body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the Data-Dense Analytics media treatment -- otherwise the block stands on typography alone.

### 5. Itinerary / Booking Flow
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 6. Testimonials
- Testimonial cards from {{TESTIMONIAL_1..4}} (quote, name, role); never fabricated quotes or names.
- Carousel or masonry per Data-Dense Analytics density; autoplay (if used) pauses on hover/focus and respects prefers-reduced-motion (no autoplay at all).

### 7. CTA
- Full-width closing section, background #0E1116, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Inter, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #262C36, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for travel if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #161A21 with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #4C9AFF, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built hotel / hospitality group product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 748 — Corporate Premium Trust — Hotel / Hospitality Group

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a hotel / hospitality group ({{PRODUCT_CATEGORY}}). Art direction: corporate premium trust — navy and white, generous whitespace, restrained gold accent, institutional confidence. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: Tailwind CSS v4
- Animation: Framer Motion for DOM, Mapbox GL JS fly-to transitions for the map layer
- Extra: Mapbox GL JS with a custom muted style matching the palette
- Icons: lucide-react
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #FFFFFF
  --surface: #F5F7FA
  --border: #E1E6ED
  --fg: #0F1B2D
  --muted: #5B6B80
  --accent: {{ACCENT_HEX}} (fallback #0F3D6E)
  Secondary accents (ambient/illustrative use only, never as the primary CTA color): #C6A15B
Typography:
  Display: "Söhne" — used for H1/H2, tight tracking
  Body: "Söhne" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 10px
  Signature mechanic: a fixed trust-bar beneath the navbar listing certifications/regulator marks in small caps
  Motion signature: ease-out 350ms, no playful overshoot

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #FFFFFF/90 with backdrop-blur(16px) after 40px scroll, transition 400ms ease-out 350ms.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Söhne, weight 700.
- Center/right links styled per the Corporate Premium Trust type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #0F3D6E; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Full-Bleed Hero
- Full-bleed, min-h-[100svh] composition built around a fixed trust-bar beneath the navbar listing certifications/regulator marks in small caps.
- H1 "{{HERO_HEADLINE}}" set in Söhne, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease-out 350ms, no playful overshoot.
- Sub-headline "{{VALUE_PROP}}" in Söhne, max-w-xl, color #5B6B80.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #0F3D6E) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Corporate Premium Trust palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #F5F7FA until onLoad fires.

### 3. Destination / Property Grid
- Grid of {{ITEM_1..6}} (properties), 10px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Framer Motion for DOM.

### 4. Experience Story
- Long-form editorial block (Söhne pull-quote + Söhne body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the Corporate Premium Trust media treatment -- otherwise the block stands on typography alone.

### 5. Itinerary / Booking Flow
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 6. Testimonials
- Testimonial cards from {{TESTIMONIAL_1..4}} (quote, name, role); never fabricated quotes or names.
- Carousel or masonry per Corporate Premium Trust density; autoplay (if used) pauses on hover/focus and respects prefers-reduced-motion (no autoplay at all).

### 7. CTA
- Full-width closing section, background #0F1B2D, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Söhne, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #E1E6ED, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for travel if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #F5F7FA with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #0F3D6E, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built hotel / hospitality group product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 749 — Playful Sophisticated — Hotel / Hospitality Group

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a hotel / hospitality group ({{PRODUCT_CATEGORY}}). Art direction: playful sophisticated — bold single accent on cream, hand-tuned micro-illustrations, confident restraint with warmth. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: styled-components with a typed theme object
- Animation: Framer Motion + Lenis smooth scroll
- Extra: next/font for all typography
- Icons: lucide-react
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #FFF8EF
  --surface: #FFFFFF
  --border: #F0E4D0
  --fg: #20180E
  --muted: #8C7F68
  --accent: {{ACCENT_HEX}} (fallback #FF5A36)
Typography:
  Display: "Fraunces (soft)" — used for H1/H2, tight tracking
  Body: "General Sans" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 18px
  Signature mechanic: small hand-drawn-style SVG accent marks (circles, arrows) that rotate/scale in as a section enters viewport
  Motion signature: spring(220,20), playful but never chaotic

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #FFF8EF/90 with backdrop-blur(16px) after 40px scroll, transition 400ms spring(220,20).
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Fraunces (soft), weight 700.
- Center/right links styled per the Playful Sophisticated type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #FF5A36; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Full-Bleed Hero
- Full-bleed, min-h-[100svh] composition built around small hand-drawn-style SVG accent marks (circles, arrows) that rotate/scale in as a section enters viewport.
- H1 "{{HERO_HEADLINE}}" set in Fraunces (soft), clamp(2.75rem, 7vw, 5.5rem); entrance timed to spring(220,20), playful but never chaotic.
- Sub-headline "{{VALUE_PROP}}" in General Sans, max-w-xl, color #8C7F68.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #FF5A36) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Playful Sophisticated palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #FFFFFF until onLoad fires.

### 3. Destination / Property Grid
- Grid of {{ITEM_1..6}} (properties), 18px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Framer Motion.

### 4. Experience Story
- Long-form editorial block (Fraunces (soft) pull-quote + General Sans body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the Playful Sophisticated media treatment -- otherwise the block stands on typography alone.

### 5. Itinerary / Booking Flow
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 6. Testimonials
- Testimonial cards from {{TESTIMONIAL_1..4}} (quote, name, role); never fabricated quotes or names.
- Carousel or masonry per Playful Sophisticated density; autoplay (if used) pauses on hover/focus and respects prefers-reduced-motion (no autoplay at all).

### 7. CTA
- Full-width closing section, background #FFF8EF, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in General Sans, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #F0E4D0, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for travel if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #FFFFFF with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #FF5A36, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built hotel / hospitality group product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 750 — Organic Earth — Hotel / Hospitality Group

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a hotel / hospitality group ({{PRODUCT_CATEGORY}}). Art direction: organic earth — clay, moss and sand tones, blob/curve shapes, natural texture, calm pacing. Production-ready, 100% responsive.

## TECH STACK
- Framework: 11ty (static-first) with Nunjucks templates
- Styling: Tailwind CSS v4 (CLI build, no JS framework runtime)
- Animation: Alpine.js for micro-interactions + CSS scroll-driven animations (animation-timeline: view())
- Extra: Zero client JS framework — ships an HTML/CSS-first page with progressive enhancement
- Icons: inline SVG sprite
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #F3EEE4
  --surface: #EAE2D0
  --border: #D8CBAE
  --fg: #2C2416
  --muted: #8A7F65
  --accent: {{ACCENT_HEX}} (fallback #5B6E4F)
Typography:
  Display: "Fraunces" — used for H1/H2, tight tracking
  Body: "Newsreader" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 40% organic blob clip-paths on media
  Signature mechanic: organic blob-shaped SVG clip-paths frame every image, morphing slightly on scroll (clip-path interpolation)
  Texture layer: subtle paper texture at 5%, pointer-events-none, aria-hidden
  Motion signature: ease-in-out 700ms, slow drift

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #F3EEE4/90 with backdrop-blur(16px) after 40px scroll, transition 400ms ease-in-out 700ms.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Fraunces, weight 700.
- Center/right links styled per the Organic Earth type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #5B6E4F; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Full-Bleed Hero
- Full-bleed, min-h-[100svh] composition built around organic blob-shaped SVG clip-paths frame every image, morphing slightly on scroll (clip-path interpolation).
- H1 "{{HERO_HEADLINE}}" set in Fraunces, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease-in-out 700ms, slow drift.
- Sub-headline "{{VALUE_PROP}}" in Newsreader, max-w-xl, color #8A7F65.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #5B6E4F) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Organic Earth palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #EAE2D0 until onLoad fires.

### 3. Destination / Property Grid
- Grid of {{ITEM_1..6}} (properties), 40% organic blob clip-paths on media media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Alpine.js for micro-interactions.

### 4. Experience Story
- Long-form editorial block (Fraunces pull-quote + Newsreader body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the Organic Earth media treatment -- otherwise the block stands on typography alone.

### 5. Itinerary / Booking Flow
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 6. Testimonials
- Testimonial cards from {{TESTIMONIAL_1..4}} (quote, name, role); never fabricated quotes or names.
- Carousel or masonry per Organic Earth density; autoplay (if used) pauses on hover/focus and respects prefers-reduced-motion (no autoplay at all).

### 7. CTA
- Full-width closing section, background #F3EEE4, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Newsreader, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #D8CBAE, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for travel if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #EAE2D0 with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #5B6E4F, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built hotel / hospitality group product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 751 — Swiss Brutalist Monochrome — Restaurant Group / Fine-Dining Brand

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a restaurant group / fine-dining brand ({{PRODUCT_CATEGORY}}). Art direction: swiss brutalist monochrome — raw grid discipline, oversized type as the only ornament, zero decorative imagery. Production-ready, 100% responsive.

## TECH STACK
- Framework: 11ty (static-first) with Nunjucks templates
- Styling: Tailwind CSS v4 (CLI build, no JS framework runtime)
- Animation: Alpine.js for micro-interactions + CSS scroll-driven animations (animation-timeline: view())
- Extra: Zero client JS framework — ships an HTML/CSS-first page with progressive enhancement
- Icons: inline SVG sprite
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #FFFFFF
  --surface: #F2F2F0
  --border: #DEDEDA
  --fg: #0B0B0B
  --muted: #7A7A78
  --accent: {{ACCENT_HEX}} (fallback #0B0B0B)
Typography:
  Display: "Neue Haas Grotesk Display" — used for H1/H2, tight tracking
  Body: "Neue Haas Grotesk Text" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: max 2px, mostly 0
  Signature mechanic: full-bleed horizontal marquee statement + numbered editorial list rows
  Motion signature: power4.out / cubic-bezier(0.16,1,0.3,1), no linear

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #FFFFFF/90 with backdrop-blur(16px) after 40px scroll, transition 400ms power4.out / cubic-bezier(0.16,1,0.3,1).
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Neue Haas Grotesk Display, weight 700.
- Center/right links styled per the Swiss Brutalist Monochrome type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #0B0B0B; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero
- Full-viewport, min-h-screen composition built around full-bleed horizontal marquee statement + numbered editorial list rows.
- H1 "{{HERO_HEADLINE}}" set in Neue Haas Grotesk Display, clamp(2.75rem, 7vw, 5.5rem); entrance timed to power4.out / cubic-bezier(0.16,1,0.3,1), no linear.
- Sub-headline "{{VALUE_PROP}}" in Neue Haas Grotesk Text, max-w-xl, color #7A7A78.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #0B0B0B) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Swiss Brutalist Monochrome palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #F2F2F0 until onLoad fires.

### 3. Menu Program Showcase
- Grid of {{ITEM_1..6}} (menu programs), max 2px, mostly 0 media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Alpine.js for micro-interactions.

### 4. Story / Philosophy
- Long-form editorial block (Neue Haas Grotesk Display pull-quote + Neue Haas Grotesk Text body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the Swiss Brutalist Monochrome media treatment -- otherwise the block stands on typography alone.

### 5. Locations
- List/map of {{LOCATION_1..6}} with address, hours, and a directions link; collapses to a simple list under 3 locations.

### 6. Reservation CTA
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 7. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #DEDEDA, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for foodservice if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #F2F2F0 with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #0B0B0B, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built restaurant group / fine-dining brand product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 752 — Aurora Glassmorphism — Restaurant Group / Fine-Dining Brand

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a restaurant group / fine-dining brand ({{PRODUCT_CATEGORY}}). Art direction: aurora glassmorphism — deep space backdrop, drifting light fields, frosted translucent surfaces. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: styled-components with a typed theme object
- Animation: Framer Motion + Lenis smooth scroll
- Extra: next/font for all typography
- Icons: lucide-react
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #05060B
  --surface: rgba(255,255,255,0.04)
  --border: rgba(255,255,255,0.09)
  --fg: #F4F6FB
  --muted: #8A92A6
  --accent: {{ACCENT_HEX}} (fallback #6E56F8)
  Secondary accents (ambient/illustrative use only, never as the primary CTA color): #2FD4C4, #F857A6
Typography:
  Display: "General Sans" — used for H1/H2, tight tracking
  Body: "Inter" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 20px on glass surfaces
  Signature mechanic: three desynced radial-gradient blobs + backdrop-blur(24px) glass recipe reused everywhere
  Texture layer: SVG feTurbulence grain at 0.035 opacity, pointer-events-none, aria-hidden
  Motion signature: [0.16,1,0.3,1], slow ambient CSS keyframe loops

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #05060B/90 with backdrop-blur(16px) after 40px scroll, transition 400ms [0.16.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in General Sans, weight 700.
- Center/right links styled per the Aurora Glassmorphism type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #6E56F8; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero
- Full-viewport, min-h-screen composition built around three desynced radial-gradient blobs + backdrop-blur(24px) glass recipe reused everywhere.
- H1 "{{HERO_HEADLINE}}" set in General Sans, clamp(2.75rem, 7vw, 5.5rem); entrance timed to [0.16,1,0.3,1], slow ambient CSS keyframe loops.
- Sub-headline "{{VALUE_PROP}}" in Inter, max-w-xl, color #8A92A6.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #6E56F8) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Aurora Glassmorphism palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in rgba(255,255,255,0.04) until onLoad fires.

### 3. Menu Program Showcase
- Grid of {{ITEM_1..6}} (menu programs), 20px on glass surfaces media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Framer Motion.

### 4. Story / Philosophy
- Long-form editorial block (General Sans pull-quote + Inter body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the Aurora Glassmorphism media treatment -- otherwise the block stands on typography alone.

### 5. Locations
- List/map of {{LOCATION_1..6}} with address, hours, and a directions link; collapses to a simple list under 3 locations.

### 6. Reservation CTA
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 7. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at rgba(255,255,255,0.09), copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for foodservice if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in rgba(255,255,255,0.04) with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #6E56F8, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built restaurant group / fine-dining brand product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 753 — Neo-Brutalist Pop — Restaurant Group / Fine-Dining Brand

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a restaurant group / fine-dining brand ({{PRODUCT_CATEGORY}}). Art direction: neo-brutalist pop — thick black outlines, flat saturated blocks, deliberately raw hard shadows, no gradients. Production-ready, 100% responsive.

## TECH STACK
- Framework: Astro 4 with islands (React only where interactivity is required)
- Styling: Tailwind CSS v4
- Animation: GSAP + ScrollTrigger, vanilla JS islands
- Extra: View Transitions API for page-to-page motion
- Icons: Lucide (astro-icon)
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #FDF6EC
  --surface: #FFFFFF
  --border: #111111
  --fg: #111111
  --muted: #5B564E
  --accent: {{ACCENT_HEX}} (fallback #FF4D2E)
  Secondary accents (ambient/illustrative use only, never as the primary CTA color): #FFD23F, #2EC4B6
Typography:
  Display: "Archivo Black" — used for H1/H2, tight tracking
  Body: "Archivo" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 0px everywhere
  Signature mechanic: hard offset shadow (8px 8px 0 #111) that flattens to 0 0 0 on press, thick 3px borders on every block
  Motion signature: steps() and abrupt cubic-bezier(0.68,-0.55,0.27,1.55) overshoot

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #FDF6EC/90 with backdrop-blur(16px) after 40px scroll, transition 400ms steps() and abrupt cubic-bezier(0.68,-0.55,0.27,1.55) overshoot.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Archivo Black, weight 700.
- Center/right links styled per the Neo-Brutalist Pop type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #FF4D2E; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero
- Full-viewport, min-h-screen composition built around hard offset shadow (8px 8px 0 #111) that flattens to 0 0 0 on press, thick 3px borders on every block.
- H1 "{{HERO_HEADLINE}}" set in Archivo Black, clamp(2.75rem, 7vw, 5.5rem); entrance timed to steps() and abrupt cubic-bezier(0.68,-0.55,0.27,1.55) overshoot.
- Sub-headline "{{VALUE_PROP}}" in Archivo, max-w-xl, color #5B564E.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #FF4D2E) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Neo-Brutalist Pop palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #FFFFFF until onLoad fires.

### 3. Menu Program Showcase
- Grid of {{ITEM_1..6}} (menu programs), 0px everywhere media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, GSAP.

### 4. Story / Philosophy
- Long-form editorial block (Archivo Black pull-quote + Archivo body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the Neo-Brutalist Pop media treatment -- otherwise the block stands on typography alone.

### 5. Locations
- List/map of {{LOCATION_1..6}} with address, hours, and a directions link; collapses to a simple list under 3 locations.

### 6. Reservation CTA
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 7. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #111111, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for foodservice if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #FFFFFF with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #FF4D2E, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built restaurant group / fine-dining brand product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 754 — Editorial Serif Luxury — Restaurant Group / Fine-Dining Brand

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a restaurant group / fine-dining brand ({{PRODUCT_CATEGORY}}). Art direction: editorial serif luxury — magazine-grade serif display type, generous margins, restrained color, photography-led. Production-ready, 100% responsive.

## TECH STACK
- Framework: 11ty (static-first) with Nunjucks templates
- Styling: Tailwind CSS v4 (CLI build, no JS framework runtime)
- Animation: Alpine.js for micro-interactions + CSS scroll-driven animations (animation-timeline: view())
- Extra: Zero client JS framework — ships an HTML/CSS-first page with progressive enhancement
- Icons: inline SVG sprite
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #FBF9F6
  --surface: #F1EDE6
  --border: #E3DCD0
  --fg: #1A1714
  --muted: #8A8175
  --accent: {{ACCENT_HEX}} (fallback #7A2E2E)
Typography:
  Display: "Canela / GT Sectra" — used for H1/H2, tight tracking
  Body: "Söhne" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 0px, hairline rules instead
  Signature mechanic: asymmetric editorial grid with pull-quotes and a running folio/issue number
  Motion signature: ease-out, 600-900ms, understated crossfades

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #FBF9F6/90 with backdrop-blur(16px) after 40px scroll, transition 400ms ease-out.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Canela / GT Sectra, weight 700.
- Center/right links styled per the Editorial Serif Luxury type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #7A2E2E; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero
- Full-viewport, min-h-screen composition built around asymmetric editorial grid with pull-quotes and a running folio/issue number.
- H1 "{{HERO_HEADLINE}}" set in Canela / GT Sectra, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease-out, 600-900ms, understated crossfades.
- Sub-headline "{{VALUE_PROP}}" in Söhne, max-w-xl, color #8A8175.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #7A2E2E) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Editorial Serif Luxury palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #F1EDE6 until onLoad fires.

### 3. Menu Program Showcase
- Grid of {{ITEM_1..6}} (menu programs), 0px, hairline rules instead media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Alpine.js for micro-interactions.

### 4. Story / Philosophy
- Long-form editorial block (Canela / GT Sectra pull-quote + Söhne body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the Editorial Serif Luxury media treatment -- otherwise the block stands on typography alone.

### 5. Locations
- List/map of {{LOCATION_1..6}} with address, hours, and a directions link; collapses to a simple list under 3 locations.

### 6. Reservation CTA
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 7. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #E3DCD0, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for foodservice if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #F1EDE6 with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #7A2E2E, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built restaurant group / fine-dining brand product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 755 — Dark Technical Console — Restaurant Group / Fine-Dining Brand

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a restaurant group / fine-dining brand ({{PRODUCT_CATEGORY}}). Art direction: dark technical console — near-black canvas, monospace accents, data-dense panels, engineering credibility. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: styled-components with a typed theme object
- Animation: Framer Motion + Lenis smooth scroll
- Extra: next/font for all typography
- Icons: lucide-react
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #0A0C10
  --surface: #12151B
  --border: #22262E
  --fg: #E7EAEE
  --muted: #7C838F
  --accent: {{ACCENT_HEX}} (fallback #5EEAD4)
  Secondary accents (ambient/illustrative use only, never as the primary CTA color): #818CF8
Typography:
  Display: "Inter Tight" — used for H1/H2, tight tracking
  Body: "Inter" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 8px
  Signature mechanic: live-updating metric tiles with tabular-nums CountUp and a terminal-style command block
  Texture layer: 1px scanline overlay at 3% opacity, pointer-events-none, aria-hidden
  Motion signature: 150-250ms ease, no bounce

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #0A0C10/90 with backdrop-blur(16px) after 40px scroll, transition 400ms 150-250ms ease.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Inter Tight, weight 700.
- Center/right links styled per the Dark Technical Console type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #5EEAD4; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero
- Full-viewport, min-h-screen composition built around live-updating metric tiles with tabular-nums CountUp and a terminal-style command block.
- H1 "{{HERO_HEADLINE}}" set in Inter Tight, clamp(2.75rem, 7vw, 5.5rem); entrance timed to 150-250ms ease, no bounce.
- Sub-headline "{{VALUE_PROP}}" in Inter, max-w-xl, color #7C838F.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #5EEAD4) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Dark Technical Console palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #12151B until onLoad fires.

### 3. Menu Program Showcase
- Grid of {{ITEM_1..6}} (menu programs), 8px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Framer Motion.

### 4. Story / Philosophy
- Long-form editorial block (Inter Tight pull-quote + Inter body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the Dark Technical Console media treatment -- otherwise the block stands on typography alone.

### 5. Locations
- List/map of {{LOCATION_1..6}} with address, hours, and a directions link; collapses to a simple list under 3 locations.

### 6. Reservation CTA
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 7. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #22262E, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for foodservice if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #12151B with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #5EEAD4, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built restaurant group / fine-dining brand product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 756 — Cyberpunk Neon — Restaurant Group / Fine-Dining Brand

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a restaurant group / fine-dining brand ({{PRODUCT_CATEGORY}}). Art direction: cyberpunk neon — black canvas, saturated magenta/cyan neon, glitch accents, dense HUD framing. Production-ready, 100% responsive.

## TECH STACK
- Framework: Astro 4 with islands (React only where interactivity is required)
- Styling: Tailwind CSS v4
- Animation: GSAP + ScrollTrigger, vanilla JS islands
- Extra: View Transitions API for page-to-page motion
- Icons: Lucide (astro-icon)
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #050508
  --surface: #0E0E16
  --border: #2A2A3D
  --fg: #F5F5FF
  --muted: #8B8BA7
  --accent: {{ACCENT_HEX}} (fallback #FF2E9A)
  Secondary accents (ambient/illustrative use only, never as the primary CTA color): #00F5FF
Typography:
  Display: "Rajdhani" — used for H1/H2, tight tracking
  Body: "Space Grotesk" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 2px, corner-clipped (clip-path) panels
  Signature mechanic: scanline + chromatic-aberration text-shadow on the H1, HUD corner brackets on every panel
  Texture layer: animated scanline, 6% opacity, pointer-events-none, aria-hidden
  Motion signature: glitch keyframe (translate jitter 2px, 80ms) on hover only

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #050508/90 with backdrop-blur(16px) after 40px scroll, transition 400ms glitch keyframe (translate jitter 2px, 80ms) on hover only.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Rajdhani, weight 700.
- Center/right links styled per the Cyberpunk Neon type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #FF2E9A; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero
- Full-viewport, min-h-screen composition built around scanline + chromatic-aberration text-shadow on the H1, HUD corner brackets on every panel.
- H1 "{{HERO_HEADLINE}}" set in Rajdhani, clamp(2.75rem, 7vw, 5.5rem); entrance timed to glitch keyframe (translate jitter 2px, 80ms) on hover only.
- Sub-headline "{{VALUE_PROP}}" in Space Grotesk, max-w-xl, color #8B8BA7.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #FF2E9A) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Cyberpunk Neon palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #0E0E16 until onLoad fires.

### 3. Menu Program Showcase
- Grid of {{ITEM_1..6}} (menu programs), 2px, corner-clipped (clip-path) panels media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, GSAP.

### 4. Story / Philosophy
- Long-form editorial block (Rajdhani pull-quote + Space Grotesk body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the Cyberpunk Neon media treatment -- otherwise the block stands on typography alone.

### 5. Locations
- List/map of {{LOCATION_1..6}} with address, hours, and a directions link; collapses to a simple list under 3 locations.

### 6. Reservation CTA
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 7. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #2A2A3D, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for foodservice if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #0E0E16 with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #FF2E9A, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built restaurant group / fine-dining brand product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 757 — Industrial Utilitarian — Restaurant Group / Fine-Dining Brand

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a restaurant group / fine-dining brand ({{PRODUCT_CATEGORY}}). Art direction: industrial utilitarian — concrete and steel palette, exposed grid lines, stenciled labels, function over decoration. Production-ready, 100% responsive.

## TECH STACK
- Framework: 11ty (static-first) with Nunjucks templates
- Styling: Tailwind CSS v4 (CLI build, no JS framework runtime)
- Animation: Alpine.js for micro-interactions + CSS scroll-driven animations (animation-timeline: view())
- Extra: Zero client JS framework — ships an HTML/CSS-first page with progressive enhancement
- Icons: inline SVG sprite
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #EDECE8
  --surface: #DCDAD3
  --border: #B7B4AA
  --fg: #1F1E1B
  --muted: #6B675E
  --accent: {{ACCENT_HEX}} (fallback #C9491C)
Typography:
  Display: "Suisse Int'l Mono" — used for H1/H2, tight tracking
  Body: "Suisse Int'l" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 0px
  Signature mechanic: visible grid lines (1px --border) drawn across the full viewport as a permanent underlay, stenciled uppercase section labels with dot-leaders
  Texture layer: fine paper-grain at 4%, pointer-events-none, aria-hidden
  Motion signature: linear 200ms for mechanical feel on toggles only, ease-out elsewhere

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #EDECE8/90 with backdrop-blur(16px) after 40px scroll, transition 400ms linear 200ms for mechanical feel on toggles only.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Suisse Int'l Mono, weight 700.
- Center/right links styled per the Industrial Utilitarian type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #C9491C; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero
- Full-viewport, min-h-screen composition built around visible grid lines (1px --border) drawn across the full viewport as a permanent underlay, stenciled uppercase section labels with dot-leaders.
- H1 "{{HERO_HEADLINE}}" set in Suisse Int'l Mono, clamp(2.75rem, 7vw, 5.5rem); entrance timed to linear 200ms for mechanical feel on toggles only, ease-out elsewhere.
- Sub-headline "{{VALUE_PROP}}" in Suisse Int'l, max-w-xl, color #6B675E.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #C9491C) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Industrial Utilitarian palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #DCDAD3 until onLoad fires.

### 3. Menu Program Showcase
- Grid of {{ITEM_1..6}} (menu programs), 0px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Alpine.js for micro-interactions.

### 4. Story / Philosophy
- Long-form editorial block (Suisse Int'l Mono pull-quote + Suisse Int'l body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the Industrial Utilitarian media treatment -- otherwise the block stands on typography alone.

### 5. Locations
- List/map of {{LOCATION_1..6}} with address, hours, and a directions link; collapses to a simple list under 3 locations.

### 6. Reservation CTA
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 7. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #B7B4AA, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for foodservice if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #DCDAD3 with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #C9491C, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built restaurant group / fine-dining brand product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 758 — Futuristic Chrome — Restaurant Group / Fine-Dining Brand

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a restaurant group / fine-dining brand ({{PRODUCT_CATEGORY}}). Art direction: futuristic chrome — liquid chrome gradients, specular highlights, cool metallic palette, motion-first. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: styled-components with a typed theme object
- Animation: Framer Motion + Lenis smooth scroll
- Extra: next/font for all typography
- Icons: lucide-react
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #0B0D12
  --surface: #151821
  --border: #2B2F3A
  --fg: #F2F4F8
  --muted: #9AA1AF
  --accent: {{ACCENT_HEX}} (fallback #7DD3FC)
  Secondary accents (ambient/illustrative use only, never as the primary CTA color): #C4B5FD
Typography:
  Display: "Space Grotesk" — used for H1/H2, tight tracking
  Body: "Inter" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 28px, pill-shaped controls
  Signature mechanic: specular chrome gradient sweeping across headline on scroll (background-position tied to scrollYProgress)
  Motion signature: spring(stiffness 220, damping 26) via Framer Motion

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #0B0D12/90 with backdrop-blur(16px) after 40px scroll, transition 400ms spring(stiffness 220, damping 26) via Framer Motion.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Space Grotesk, weight 700.
- Center/right links styled per the Futuristic Chrome type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #7DD3FC; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero
- Full-viewport, min-h-screen composition built around specular chrome gradient sweeping across headline on scroll (background-position tied to scrollYProgress).
- H1 "{{HERO_HEADLINE}}" set in Space Grotesk, clamp(2.75rem, 7vw, 5.5rem); entrance timed to spring(stiffness 220, damping 26) via Framer Motion.
- Sub-headline "{{VALUE_PROP}}" in Inter, max-w-xl, color #9AA1AF.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #7DD3FC) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Futuristic Chrome palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #151821 until onLoad fires.

### 3. Menu Program Showcase
- Grid of {{ITEM_1..6}} (menu programs), 28px, pill-shaped controls media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Framer Motion.

### 4. Story / Philosophy
- Long-form editorial block (Space Grotesk pull-quote + Inter body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the Futuristic Chrome media treatment -- otherwise the block stands on typography alone.

### 5. Locations
- List/map of {{LOCATION_1..6}} with address, hours, and a directions link; collapses to a simple list under 3 locations.

### 6. Reservation CTA
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 7. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #2B2F3A, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for foodservice if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #151821 with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #7DD3FC, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built restaurant group / fine-dining brand product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 759 — Soft Minimal Warmth — Restaurant Group / Fine-Dining Brand

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a restaurant group / fine-dining brand ({{PRODUCT_CATEGORY}}). Art direction: soft minimal warmth — warm off-white, generous air, soft shadows, rounded forms, low-contrast restraint. Production-ready, 100% responsive.

## TECH STACK
- Framework: Astro 4 with islands (React only where interactivity is required)
- Styling: Tailwind CSS v4
- Animation: GSAP + ScrollTrigger, vanilla JS islands
- Extra: View Transitions API for page-to-page motion
- Icons: Lucide (astro-icon)
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #FAF7F2
  --surface: #FFFFFF
  --border: #ECE6DC
  --fg: #2B2620
  --muted: #928C80
  --accent: {{ACCENT_HEX}} (fallback #D97757)
Typography:
  Display: "Fraunces" — used for H1/H2, tight tracking
  Body: "Inter" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 24px
  Signature mechanic: soft double-layer drop shadow (0 1px 2px + 0 12px 24px at 6%) on every raised surface, no borders — light does the separating
  Motion signature: ease-out 400-600ms, gentle y:12→0 reveals

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #FAF7F2/90 with backdrop-blur(16px) after 40px scroll, transition 400ms ease-out 400-600ms.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Fraunces, weight 700.
- Center/right links styled per the Soft Minimal Warmth type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #D97757; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero
- Full-viewport, min-h-screen composition built around soft double-layer drop shadow (0 1px 2px + 0 12px 24px at 6%) on every raised surface, no borders — light does the separating.
- H1 "{{HERO_HEADLINE}}" set in Fraunces, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease-out 400-600ms, gentle y:12→0 reveals.
- Sub-headline "{{VALUE_PROP}}" in Inter, max-w-xl, color #928C80.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #D97757) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Soft Minimal Warmth palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #FFFFFF until onLoad fires.

### 3. Menu Program Showcase
- Grid of {{ITEM_1..6}} (menu programs), 24px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, GSAP.

### 4. Story / Philosophy
- Long-form editorial block (Fraunces pull-quote + Inter body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the Soft Minimal Warmth media treatment -- otherwise the block stands on typography alone.

### 5. Locations
- List/map of {{LOCATION_1..6}} with address, hours, and a directions link; collapses to a simple list under 3 locations.

### 6. Reservation CTA
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 7. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #ECE6DC, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for foodservice if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #FFFFFF with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #D97757, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built restaurant group / fine-dining brand product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 760 — Art Deco Revival — Restaurant Group / Fine-Dining Brand

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a restaurant group / fine-dining brand ({{PRODUCT_CATEGORY}}). Art direction: art deco revival — gold on deep emerald/black, geometric fan and sunburst motifs, symmetrical ornament. Production-ready, 100% responsive.

## TECH STACK
- Framework: 11ty (static-first) with Nunjucks templates
- Styling: Tailwind CSS v4 (CLI build, no JS framework runtime)
- Animation: Alpine.js for micro-interactions + CSS scroll-driven animations (animation-timeline: view())
- Extra: Zero client JS framework — ships an HTML/CSS-first page with progressive enhancement
- Icons: inline SVG sprite
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #0D1512
  --surface: #122019
  --border: #B8935A
  --fg: #F3E9D2
  --muted: #9FB5A8
  --accent: {{ACCENT_HEX}} (fallback #C9A96A)
Typography:
  Display: "Poiret One / Cinzel" — used for H1/H2, tight tracking
  Body: "Cormorant" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 0px, chamfered corners via clip-path
  Signature mechanic: repeating SVG sunburst/fan motif as section dividers, gold 1px double-rule borders
  Texture layer: subtle metallic gradient noise, pointer-events-none, aria-hidden
  Motion signature: ease-in-out 700ms, symmetrical mirrored reveals

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #0D1512/90 with backdrop-blur(16px) after 40px scroll, transition 400ms ease-in-out 700ms.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Poiret One / Cinzel, weight 700.
- Center/right links styled per the Art Deco Revival type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #C9A96A; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero
- Full-viewport, min-h-screen composition built around repeating SVG sunburst/fan motif as section dividers, gold 1px double-rule borders.
- H1 "{{HERO_HEADLINE}}" set in Poiret One / Cinzel, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease-in-out 700ms, symmetrical mirrored reveals.
- Sub-headline "{{VALUE_PROP}}" in Cormorant, max-w-xl, color #9FB5A8.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #C9A96A) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Art Deco Revival palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #122019 until onLoad fires.

### 3. Menu Program Showcase
- Grid of {{ITEM_1..6}} (menu programs), 0px, chamfered corners via clip-path media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Alpine.js for micro-interactions.

### 4. Story / Philosophy
- Long-form editorial block (Poiret One / Cinzel pull-quote + Cormorant body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the Art Deco Revival media treatment -- otherwise the block stands on typography alone.

### 5. Locations
- List/map of {{LOCATION_1..6}} with address, hours, and a directions link; collapses to a simple list under 3 locations.

### 6. Reservation CTA
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 7. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #B8935A, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for foodservice if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #122019 with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #C9A96A, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built restaurant group / fine-dining brand product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 761 — Japanese Minimal (Ma) — Restaurant Group / Fine-Dining Brand

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a restaurant group / fine-dining brand ({{PRODUCT_CATEGORY}}). Art direction: japanese minimal (ma) — extreme negative space, single accent stroke, vertical rhythm, quiet confidence. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: styled-components with a typed theme object
- Animation: Framer Motion + Lenis smooth scroll
- Extra: next/font for all typography
- Icons: lucide-react
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #FCFCFA
  --surface: #F5F4F0
  --border: #E2E0D8
  --fg: #1C1C1A
  --muted: #8D8B84
  --accent: {{ACCENT_HEX}} (fallback #C1121F)
Typography:
  Display: "Zen Old Mincho / Shippori Mincho" — used for H1/H2, tight tracking
  Body: "Noto Sans JP fallback / Inter" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 0px
  Signature mechanic: a single vertical hairline rule tracks scroll progress along the left margin; content occupies at most 60% of viewport width
  Motion signature: ease 800ms, single elements move — never groups at once

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #FCFCFA/90 with backdrop-blur(16px) after 40px scroll, transition 400ms ease 800ms.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Zen Old Mincho / Shippori Mincho, weight 700.
- Center/right links styled per the Japanese Minimal (Ma) type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #C1121F; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero
- Full-viewport, min-h-screen composition built around a single vertical hairline rule tracks scroll progress along the left margin; content occupies at most 60% of viewport width.
- H1 "{{HERO_HEADLINE}}" set in Zen Old Mincho / Shippori Mincho, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease 800ms, single elements move — never groups at once.
- Sub-headline "{{VALUE_PROP}}" in Noto Sans JP fallback / Inter, max-w-xl, color #8D8B84.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #C1121F) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Japanese Minimal (Ma) palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #F5F4F0 until onLoad fires.

### 3. Menu Program Showcase
- Grid of {{ITEM_1..6}} (menu programs), 0px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Framer Motion.

### 4. Story / Philosophy
- Long-form editorial block (Zen Old Mincho / Shippori Mincho pull-quote + Noto Sans JP fallback / Inter body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the Japanese Minimal (Ma) media treatment -- otherwise the block stands on typography alone.

### 5. Locations
- List/map of {{LOCATION_1..6}} with address, hours, and a directions link; collapses to a simple list under 3 locations.

### 6. Reservation CTA
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 7. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #E2E0D8, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for foodservice if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #F5F4F0 with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #C1121F, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built restaurant group / fine-dining brand product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 762 — Scandinavian Functional — Restaurant Group / Fine-Dining Brand

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a restaurant group / fine-dining brand ({{PRODUCT_CATEGORY}}). Art direction: scandinavian functional — light wood-neutral palette, clean sans type, function-led hierarchy, quiet confidence. Production-ready, 100% responsive.

## TECH STACK
- Framework: Astro 4 with islands (React only where interactivity is required)
- Styling: Tailwind CSS v4
- Animation: GSAP + ScrollTrigger, vanilla JS islands
- Extra: View Transitions API for page-to-page motion
- Icons: Lucide (astro-icon)
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #F7F5F2
  --surface: #FFFFFF
  --border: #E4E0D8
  --fg: #232320
  --muted: #7D7A72
  --accent: {{ACCENT_HEX}} (fallback #3E6259)
Typography:
  Display: "Söhne" — used for H1/H2, tight tracking
  Body: "Söhne" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 12px
  Signature mechanic: consistent 8pt spacing scale exposed as visible rhythm between hairline-separated blocks
  Motion signature: ease-out 300ms, no overshoot

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #F7F5F2/90 with backdrop-blur(16px) after 40px scroll, transition 400ms ease-out 300ms.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Söhne, weight 700.
- Center/right links styled per the Scandinavian Functional type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #3E6259; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero
- Full-viewport, min-h-screen composition built around consistent 8pt spacing scale exposed as visible rhythm between hairline-separated blocks.
- H1 "{{HERO_HEADLINE}}" set in Söhne, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease-out 300ms, no overshoot.
- Sub-headline "{{VALUE_PROP}}" in Söhne, max-w-xl, color #7D7A72.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #3E6259) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Scandinavian Functional palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #FFFFFF until onLoad fires.

### 3. Menu Program Showcase
- Grid of {{ITEM_1..6}} (menu programs), 12px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, GSAP.

### 4. Story / Philosophy
- Long-form editorial block (Söhne pull-quote + Söhne body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the Scandinavian Functional media treatment -- otherwise the block stands on typography alone.

### 5. Locations
- List/map of {{LOCATION_1..6}} with address, hours, and a directions link; collapses to a simple list under 3 locations.

### 6. Reservation CTA
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 7. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #E4E0D8, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for foodservice if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #FFFFFF with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #3E6259, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built restaurant group / fine-dining brand product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 763 — Retro-Futurist 80s — Restaurant Group / Fine-Dining Brand

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a restaurant group / fine-dining brand ({{PRODUCT_CATEGORY}}). Art direction: retro-futurist 80s — sunset gradient, chrome grid horizon, VHS scanlines, synthwave palette. Production-ready, 100% responsive.

## TECH STACK
- Framework: 11ty (static-first) with Nunjucks templates
- Styling: Tailwind CSS v4 (CLI build, no JS framework runtime)
- Animation: Alpine.js for micro-interactions + CSS scroll-driven animations (animation-timeline: view())
- Extra: Zero client JS framework — ships an HTML/CSS-first page with progressive enhancement
- Icons: inline SVG sprite
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #1A0B2E
  --surface: #26123F
  --border: #4A2472
  --fg: #FCEEFF
  --muted: #B79BD6
  --accent: {{ACCENT_HEX}} (fallback #FF6EC7)
  Secondary accents (ambient/illustrative use only, never as the primary CTA color): #00D9FF, #FFB86C
Typography:
  Display: "Righteous" — used for H1/H2, tight tracking
  Body: "Space Grotesk" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 4px
  Signature mechanic: perspective CSS grid horizon (transform: perspective(500px) rotateX(60deg)) receding beneath the hero, sun gradient circle behind it
  Texture layer: VHS scanline + chromatic aberration, pointer-events-none, aria-hidden
  Motion signature: linear scanline drift 8s infinite, ease-out for content

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #1A0B2E/90 with backdrop-blur(16px) after 40px scroll, transition 400ms linear scanline drift 8s infinite.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Righteous, weight 700.
- Center/right links styled per the Retro-Futurist 80s type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #FF6EC7; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero
- Full-viewport, min-h-screen composition built around perspective CSS grid horizon (transform: perspective(500px) rotateX(60deg)) receding beneath the hero, sun gradient circle behind it.
- H1 "{{HERO_HEADLINE}}" set in Righteous, clamp(2.75rem, 7vw, 5.5rem); entrance timed to linear scanline drift 8s infinite, ease-out for content.
- Sub-headline "{{VALUE_PROP}}" in Space Grotesk, max-w-xl, color #B79BD6.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #FF6EC7) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Retro-Futurist 80s palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #26123F until onLoad fires.

### 3. Menu Program Showcase
- Grid of {{ITEM_1..6}} (menu programs), 4px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Alpine.js for micro-interactions.

### 4. Story / Philosophy
- Long-form editorial block (Righteous pull-quote + Space Grotesk body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the Retro-Futurist 80s media treatment -- otherwise the block stands on typography alone.

### 5. Locations
- List/map of {{LOCATION_1..6}} with address, hours, and a directions link; collapses to a simple list under 3 locations.

### 6. Reservation CTA
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 7. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #4A2472, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for foodservice if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #26123F with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #FF6EC7, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built restaurant group / fine-dining brand product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 764 — Y2K Cyber-Cute — Restaurant Group / Fine-Dining Brand

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a restaurant group / fine-dining brand ({{PRODUCT_CATEGORY}}). Art direction: y2k cyber-cute — chrome bubbles, gradient blobs, glossy buttons, playful maximal energy. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: styled-components with a typed theme object
- Animation: Framer Motion + Lenis smooth scroll
- Extra: next/font for all typography
- Icons: lucide-react
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #EAF2FF
  --surface: #FFFFFF
  --border: #C7DBFF
  --fg: #0E1B33
  --muted: #5C6B8C
  --accent: {{ACCENT_HEX}} (fallback #7C5CFF)
  Secondary accents (ambient/illustrative use only, never as the primary CTA color): #FF5CA8, #5CE1FF
Typography:
  Display: "Chakra Petch" — used for H1/H2, tight tracking
  Body: "Poppins" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 9999px on buttons, 32px on cards
  Signature mechanic: glossy specular-highlight gradient buttons (radial-gradient white 10% at top-left), floating blob shapes drifting on scroll parallax
  Motion signature: spring bounce (stiffness 300, damping 18)

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #EAF2FF/90 with backdrop-blur(16px) after 40px scroll, transition 400ms spring bounce (stiffness 300, damping 18).
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Chakra Petch, weight 700.
- Center/right links styled per the Y2K Cyber-Cute type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #7C5CFF; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero
- Full-viewport, min-h-screen composition built around glossy specular-highlight gradient buttons (radial-gradient white 10% at top-left), floating blob shapes drifting on scroll parallax.
- H1 "{{HERO_HEADLINE}}" set in Chakra Petch, clamp(2.75rem, 7vw, 5.5rem); entrance timed to spring bounce (stiffness 300, damping 18).
- Sub-headline "{{VALUE_PROP}}" in Poppins, max-w-xl, color #5C6B8C.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #7C5CFF) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Y2K Cyber-Cute palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #FFFFFF until onLoad fires.

### 3. Menu Program Showcase
- Grid of {{ITEM_1..6}} (menu programs), 9999px on buttons, 32px on cards media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Framer Motion.

### 4. Story / Philosophy
- Long-form editorial block (Chakra Petch pull-quote + Poppins body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the Y2K Cyber-Cute media treatment -- otherwise the block stands on typography alone.

### 5. Locations
- List/map of {{LOCATION_1..6}} with address, hours, and a directions link; collapses to a simple list under 3 locations.

### 6. Reservation CTA
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 7. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #C7DBFF, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for foodservice if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #FFFFFF with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #7C5CFF, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built restaurant group / fine-dining brand product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 765 — Digital Laboratory — Restaurant Group / Fine-Dining Brand

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a restaurant group / fine-dining brand ({{PRODUCT_CATEGORY}}). Art direction: digital laboratory — clinical white/blue, precise data grids, diagrammatic annotation lines. Production-ready, 100% responsive.

## TECH STACK
- Framework: Astro 4 with islands (React only where interactivity is required)
- Styling: Tailwind CSS v4
- Animation: GSAP + ScrollTrigger, vanilla JS islands
- Extra: View Transitions API for page-to-page motion
- Icons: Lucide (astro-icon)
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #FFFFFF
  --surface: #F4F7FB
  --border: #D7E1EE
  --fg: #101828
  --muted: #667085
  --accent: {{ACCENT_HEX}} (fallback #2E6FF2)
Typography:
  Display: "IBM Plex Sans" — used for H1/H2, tight tracking
  Body: "IBM Plex Sans" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 6px
  Signature mechanic: annotation leader-lines (SVG) connecting labels to UI elements, like a lab specimen diagram
  Texture layer: 1px graph-paper grid at 3% opacity, pointer-events-none, aria-hidden
  Motion signature: ease 200ms, precise not playful

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #FFFFFF/90 with backdrop-blur(16px) after 40px scroll, transition 400ms ease 200ms.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in IBM Plex Sans, weight 700.
- Center/right links styled per the Digital Laboratory type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #2E6FF2; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero
- Full-viewport, min-h-screen composition built around annotation leader-lines (SVG) connecting labels to UI elements, like a lab specimen diagram.
- H1 "{{HERO_HEADLINE}}" set in IBM Plex Sans, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease 200ms, precise not playful.
- Sub-headline "{{VALUE_PROP}}" in IBM Plex Sans, max-w-xl, color #667085.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #2E6FF2) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Digital Laboratory palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #F4F7FB until onLoad fires.

### 3. Menu Program Showcase
- Grid of {{ITEM_1..6}} (menu programs), 6px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, GSAP.

### 4. Story / Philosophy
- Long-form editorial block (IBM Plex Sans pull-quote + IBM Plex Sans body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the Digital Laboratory media treatment -- otherwise the block stands on typography alone.

### 5. Locations
- List/map of {{LOCATION_1..6}} with address, hours, and a directions link; collapses to a simple list under 3 locations.

### 6. Reservation CTA
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 7. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #D7E1EE, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for foodservice if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #F4F7FB with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #2E6FF2, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built restaurant group / fine-dining brand product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 766 — Terminal-Inspired CLI — Restaurant Group / Fine-Dining Brand

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a restaurant group / fine-dining brand ({{PRODUCT_CATEGORY}}). Art direction: terminal-inspired cli — pure monospace, green/amber phosphor accent on black, blinking cursor motifs. Production-ready, 100% responsive.

## TECH STACK
- Framework: 11ty (static-first) with Nunjucks templates
- Styling: Tailwind CSS v4 (CLI build, no JS framework runtime)
- Animation: Alpine.js for micro-interactions + CSS scroll-driven animations (animation-timeline: view())
- Extra: Zero client JS framework — ships an HTML/CSS-first page with progressive enhancement
- Icons: inline SVG sprite
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #080A08
  --surface: #0F120F
  --border: #1F261F
  --fg: #D6FFD6
  --muted: #6B8F6B
  --accent: {{ACCENT_HEX}} (fallback #39FF14)
Typography:
  Display: "JetBrains Mono" — used for H1/H2, tight tracking
  Body: "JetBrains Mono" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 0px
  Signature mechanic: hero headline types itself out character-by-character with a blinking block cursor; every panel has a fake terminal titlebar with 3 dots
  Texture layer: CRT vignette + scanline at 5%, pointer-events-none, aria-hidden
  Motion signature: typewriter reveal, step-end steps(n)

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #080A08/90 with backdrop-blur(16px) after 40px scroll, transition 400ms typewriter reveal.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in JetBrains Mono, weight 700.
- Center/right links styled per the Terminal-Inspired CLI type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #39FF14; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero
- Full-viewport, min-h-screen composition built around hero headline types itself out character-by-character with a blinking block cursor; every panel has a fake terminal titlebar with 3 dots.
- H1 "{{HERO_HEADLINE}}" set in JetBrains Mono, clamp(2.75rem, 7vw, 5.5rem); entrance timed to typewriter reveal, step-end steps(n).
- Sub-headline "{{VALUE_PROP}}" in JetBrains Mono, max-w-xl, color #6B8F6B.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #39FF14) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Terminal-Inspired CLI palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #0F120F until onLoad fires.

### 3. Menu Program Showcase
- Grid of {{ITEM_1..6}} (menu programs), 0px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Alpine.js for micro-interactions.

### 4. Story / Philosophy
- Long-form editorial block (JetBrains Mono pull-quote + JetBrains Mono body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the Terminal-Inspired CLI media treatment -- otherwise the block stands on typography alone.

### 5. Locations
- List/map of {{LOCATION_1..6}} with address, hours, and a directions link; collapses to a simple list under 3 locations.

### 6. Reservation CTA
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 7. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #1F261F, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for foodservice if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #0F120F with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #39FF14, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built restaurant group / fine-dining brand product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 767 — Financial Terminal Dense — Restaurant Group / Fine-Dining Brand

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a restaurant group / fine-dining brand ({{PRODUCT_CATEGORY}}). Art direction: financial terminal dense — black/near-black, tabular-nums everywhere, ticker rows, high information density. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: styled-components with a typed theme object
- Animation: Framer Motion + Lenis smooth scroll
- Extra: next/font for all typography
- Icons: lucide-react
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #000000
  --surface: #0C0F0C
  --border: #1E231E
  --fg: #E4E9E4
  --muted: #7C867C
  --accent: {{ACCENT_HEX}} (fallback #00C853)
  Secondary accents (ambient/illustrative use only, never as the primary CTA color): #FF3B30
Typography:
  Display: "IBM Plex Mono" — used for H1/H2, tight tracking
  Body: "IBM Plex Sans" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 2px
  Signature mechanic: a live scrolling ticker row (marquee) of tabular-nums values that flash green/red on change, dense multi-column data tables
  Motion signature: ease 150ms, numeric roll via CountUp only

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #000000/90 with backdrop-blur(16px) after 40px scroll, transition 400ms ease 150ms.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in IBM Plex Mono, weight 700.
- Center/right links styled per the Financial Terminal Dense type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #00C853; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero
- Full-viewport, min-h-screen composition built around a live scrolling ticker row (marquee) of tabular-nums values that flash green/red on change, dense multi-column data tables.
- H1 "{{HERO_HEADLINE}}" set in IBM Plex Mono, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease 150ms, numeric roll via CountUp only.
- Sub-headline "{{VALUE_PROP}}" in IBM Plex Sans, max-w-xl, color #7C867C.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #00C853) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Financial Terminal Dense palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #0C0F0C until onLoad fires.

### 3. Menu Program Showcase
- Grid of {{ITEM_1..6}} (menu programs), 2px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Framer Motion.

### 4. Story / Philosophy
- Long-form editorial block (IBM Plex Mono pull-quote + IBM Plex Sans body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the Financial Terminal Dense media treatment -- otherwise the block stands on typography alone.

### 5. Locations
- List/map of {{LOCATION_1..6}} with address, hours, and a directions link; collapses to a simple list under 3 locations.

### 6. Reservation CTA
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 7. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #1E231E, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for foodservice if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #0C0F0C with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #00C853, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built restaurant group / fine-dining brand product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 768 — Magazine Grid — Restaurant Group / Fine-Dining Brand

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a restaurant group / fine-dining brand ({{PRODUCT_CATEGORY}}). Art direction: magazine grid — multi-column editorial grid, drop caps, running heads, varied image sizes. Production-ready, 100% responsive.

## TECH STACK
- Framework: Astro 4 with islands (React only where interactivity is required)
- Styling: Tailwind CSS v4
- Animation: GSAP + ScrollTrigger, vanilla JS islands
- Extra: View Transitions API for page-to-page motion
- Icons: Lucide (astro-icon)
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #FFFFFF
  --surface: #F6F5F2
  --border: #DEDBD2
  --fg: #181614
  --muted: #847E71
  --accent: {{ACCENT_HEX}} (fallback #B0281C)
Typography:
  Display: "Tiempos Headline" — used for H1/H2, tight tracking
  Body: "Tiempos Text" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 0px
  Signature mechanic: a masthead running head fixed at top (issue number, section name), first paragraph after each H2 gets a 3-line drop cap
  Motion signature: ease-out 500ms crossfades between spreads

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #FFFFFF/90 with backdrop-blur(16px) after 40px scroll, transition 400ms ease-out 500ms crossfades between spreads.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Tiempos Headline, weight 700.
- Center/right links styled per the Magazine Grid type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #B0281C; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero
- Full-viewport, min-h-screen composition built around a masthead running head fixed at top (issue number, section name), first paragraph after each H2 gets a 3-line drop cap.
- H1 "{{HERO_HEADLINE}}" set in Tiempos Headline, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease-out 500ms crossfades between spreads.
- Sub-headline "{{VALUE_PROP}}" in Tiempos Text, max-w-xl, color #847E71.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #B0281C) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Magazine Grid palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #F6F5F2 until onLoad fires.

### 3. Menu Program Showcase
- Grid of {{ITEM_1..6}} (menu programs), 0px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, GSAP.

### 4. Story / Philosophy
- Long-form editorial block (Tiempos Headline pull-quote + Tiempos Text body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the Magazine Grid media treatment -- otherwise the block stands on typography alone.

### 5. Locations
- List/map of {{LOCATION_1..6}} with address, hours, and a directions link; collapses to a simple list under 3 locations.

### 6. Reservation CTA
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 7. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #DEDBD2, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for foodservice if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #F6F5F2 with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #B0281C, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built restaurant group / fine-dining brand product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 769 — High-Fashion Editorial — Restaurant Group / Fine-Dining Brand

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a restaurant group / fine-dining brand ({{PRODUCT_CATEGORY}}). Art direction: high-fashion editorial — full-bleed monochrome photography, oversized condensed type, extreme minimalism. Production-ready, 100% responsive.

## TECH STACK
- Framework: 11ty (static-first) with Nunjucks templates
- Styling: Tailwind CSS v4 (CLI build, no JS framework runtime)
- Animation: Alpine.js for micro-interactions + CSS scroll-driven animations (animation-timeline: view())
- Extra: Zero client JS framework — ships an HTML/CSS-first page with progressive enhancement
- Icons: inline SVG sprite
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #111111
  --surface: #000000
  --border: #2E2E2E
  --fg: #F5F5F5
  --muted: #9A9A9A
  --accent: {{ACCENT_HEX}} (fallback #FFFFFF)
Typography:
  Display: "PP Neue Montreal Condensed" — used for H1/H2, tight tracking
  Body: "PP Neue Montreal" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 0px
  Signature mechanic: full-viewport image bleeds with condensed vertical wordmark rotated -90deg pinned to the edge
  Motion signature: ease 900ms, slow deliberate crossfades — never fast

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #111111/90 with backdrop-blur(16px) after 40px scroll, transition 400ms ease 900ms.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in PP Neue Montreal Condensed, weight 700.
- Center/right links styled per the High-Fashion Editorial type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #FFFFFF; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero
- Full-viewport, min-h-screen composition built around full-viewport image bleeds with condensed vertical wordmark rotated -90deg pinned to the edge.
- H1 "{{HERO_HEADLINE}}" set in PP Neue Montreal Condensed, clamp(2.75rem, 7vw, 6rem); entrance timed to ease 900ms, slow deliberate crossfades — never fast.
- Sub-headline "{{VALUE_PROP}}" in PP Neue Montreal, max-w-xl, color #9A9A9A.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #FFFFFF) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the High-Fashion Editorial palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #000000 until onLoad fires.

### 3. Menu Program Showcase
- Grid of {{ITEM_1..6}} (menu programs), 0px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Alpine.js for micro-interactions.

### 4. Story / Philosophy
- Long-form editorial block (PP Neue Montreal Condensed pull-quote + PP Neue Montreal body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the High-Fashion Editorial media treatment -- otherwise the block stands on typography alone.

### 5. Locations
- List/map of {{LOCATION_1..6}} with address, hours, and a directions link; collapses to a simple list under 3 locations.

### 6. Reservation CTA
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 7. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #2E2E2E, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for foodservice if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #000000 with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #FFFFFF, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built restaurant group / fine-dining brand product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 770 — Architectural Blueprint — Restaurant Group / Fine-Dining Brand

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a restaurant group / fine-dining brand ({{PRODUCT_CATEGORY}}). Art direction: architectural blueprint — technical drawing aesthetic, thin precise lines, dimension annotations, cool blue-grey. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: styled-components with a typed theme object
- Animation: Framer Motion + Lenis smooth scroll
- Extra: next/font for all typography
- Icons: lucide-react
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #F5F6F7
  --surface: #FFFFFF
  --border: #C7CCD1
  --fg: #1B2126
  --muted: #6E7981
  --accent: {{ACCENT_HEX}} (fallback #1B4B91)
Typography:
  Display: "Neue Haas Unica" — used for H1/H2, tight tracking
  Body: "Neue Haas Unica" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 0px
  Signature mechanic: SVG dimension lines with arrow endpoints and measurement labels annotate key layout sections, as in a blueprint
  Texture layer: faint blueprint grid at 4%, pointer-events-none, aria-hidden
  Motion signature: ease 300ms, draws lines via stroke-dashoffset animation

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #F5F6F7/90 with backdrop-blur(16px) after 40px scroll, transition 400ms ease 300ms.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Neue Haas Unica, weight 700.
- Center/right links styled per the Architectural Blueprint type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #1B4B91; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero
- Full-viewport, min-h-screen composition built around SVG dimension lines with arrow endpoints and measurement labels annotate key layout sections, as in a blueprint.
- H1 "{{HERO_HEADLINE}}" set in Neue Haas Unica, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease 300ms, draws lines via stroke-dashoffset animation.
- Sub-headline "{{VALUE_PROP}}" in Neue Haas Unica, max-w-xl, color #6E7981.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #1B4B91) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Architectural Blueprint palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #FFFFFF until onLoad fires.

### 3. Menu Program Showcase
- Grid of {{ITEM_1..6}} (menu programs), 0px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Framer Motion.

### 4. Story / Philosophy
- Long-form editorial block (Neue Haas Unica pull-quote + Neue Haas Unica body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the Architectural Blueprint media treatment -- otherwise the block stands on typography alone.

### 5. Locations
- List/map of {{LOCATION_1..6}} with address, hours, and a directions link; collapses to a simple list under 3 locations.

### 6. Reservation CTA
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 7. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #C7CCD1, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for foodservice if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #FFFFFF with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #1B4B91, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built restaurant group / fine-dining brand product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 771 — Experimental Typography — Restaurant Group / Fine-Dining Brand

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a restaurant group / fine-dining brand ({{PRODUCT_CATEGORY}}). Art direction: experimental typography — type as the primary graphic device — variable font weight/width driven by scroll or cursor. Production-ready, 100% responsive.

## TECH STACK
- Framework: Astro 4 with islands (React only where interactivity is required)
- Styling: Tailwind CSS v4
- Animation: GSAP + ScrollTrigger, vanilla JS islands
- Extra: View Transitions API for page-to-page motion
- Icons: Lucide (astro-icon)
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #111014
  --surface: #1A1820
  --border: #312E3B
  --fg: #F1EEF7
  --muted: #948FA3
  --accent: {{ACCENT_HEX}} (fallback #E8FF59)
Typography:
  Display: "Variable custom (wght/wdth axes)" — used for H1/H2, tight tracking
  Body: "Suisse Int'l" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 0px
  Signature mechanic: headline font-variation-settings 'wght' and 'wdth' interpolate live with scroll velocity and cursor proximity per character
  Motion signature: scroll-linked variable-font-variation-settings interpolation

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #111014/90 with backdrop-blur(16px) after 40px scroll, transition 400ms scroll-linked variable-font-variation-settings interpolation.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Variable custom (wght/wdth axes), weight 700.
- Center/right links styled per the Experimental Typography type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #E8FF59; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero
- Full-viewport, min-h-screen composition built around headline font-variation-settings 'wght' and 'wdth' interpolate live with scroll velocity and cursor proximity per character.
- H1 "{{HERO_HEADLINE}}" set in Variable custom (wght/wdth axes), clamp(2.75rem, 7vw, 5.5rem); entrance timed to scroll-linked variable-font-variation-settings interpolation.
- Sub-headline "{{VALUE_PROP}}" in Suisse Int'l, max-w-xl, color #948FA3.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #E8FF59) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Experimental Typography palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #1A1820 until onLoad fires.

### 3. Menu Program Showcase
- Grid of {{ITEM_1..6}} (menu programs), 0px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, GSAP.

### 4. Story / Philosophy
- Long-form editorial block (Variable custom (wght/wdth axes) pull-quote + Suisse Int'l body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the Experimental Typography media treatment -- otherwise the block stands on typography alone.

### 5. Locations
- List/map of {{LOCATION_1..6}} with address, hours, and a directions link; collapses to a simple list under 3 locations.

### 6. Reservation CTA
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 7. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #312E3B, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for foodservice if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #1A1820 with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #E8FF59, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built restaurant group / fine-dining brand product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 772 — Data-Dense Analytics — Restaurant Group / Fine-Dining Brand

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a restaurant group / fine-dining brand ({{PRODUCT_CATEGORY}}). Art direction: data-dense analytics — tight information density, small multiples, sparkline-everything, muted chart palette. Production-ready, 100% responsive.

## TECH STACK
- Framework: 11ty (static-first) with Nunjucks templates
- Styling: Tailwind CSS v4 (CLI build, no JS framework runtime)
- Animation: Alpine.js for micro-interactions + CSS scroll-driven animations (animation-timeline: view())
- Extra: Zero client JS framework — ships an HTML/CSS-first page with progressive enhancement
- Icons: inline SVG sprite
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #0E1116
  --surface: #161A21
  --border: #262C36
  --fg: #DEE3EA
  --muted: #7E8896
  --accent: {{ACCENT_HEX}} (fallback #4C9AFF)
  Secondary accents (ambient/illustrative use only, never as the primary CTA color): #F5A623
Typography:
  Display: "Inter Tight" — used for H1/H2, tight tracking
  Body: "Inter" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 10px
  Signature mechanic: a grid of small-multiple sparkline cards, each with a live-updating value and a 30-day trend line drawn in SVG
  Motion signature: ease 180ms, chart transitions via d3 interpolate

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #0E1116/90 with backdrop-blur(16px) after 40px scroll, transition 400ms ease 180ms.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Inter Tight, weight 700.
- Center/right links styled per the Data-Dense Analytics type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #4C9AFF; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero
- Full-viewport, min-h-screen composition built around a grid of small-multiple sparkline cards, each with a live-updating value and a 30-day trend line drawn in SVG.
- H1 "{{HERO_HEADLINE}}" set in Inter Tight, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease 180ms, chart transitions via d3 interpolate.
- Sub-headline "{{VALUE_PROP}}" in Inter, max-w-xl, color #7E8896.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #4C9AFF) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Data-Dense Analytics palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #161A21 until onLoad fires.

### 3. Menu Program Showcase
- Grid of {{ITEM_1..6}} (menu programs), 10px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Alpine.js for micro-interactions.

### 4. Story / Philosophy
- Long-form editorial block (Inter Tight pull-quote + Inter body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the Data-Dense Analytics media treatment -- otherwise the block stands on typography alone.

### 5. Locations
- List/map of {{LOCATION_1..6}} with address, hours, and a directions link; collapses to a simple list under 3 locations.

### 6. Reservation CTA
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 7. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #262C36, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for foodservice if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #161A21 with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #4C9AFF, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built restaurant group / fine-dining brand product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 773 — Corporate Premium Trust — Restaurant Group / Fine-Dining Brand

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a restaurant group / fine-dining brand ({{PRODUCT_CATEGORY}}). Art direction: corporate premium trust — navy and white, generous whitespace, restrained gold accent, institutional confidence. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: styled-components with a typed theme object
- Animation: Framer Motion + Lenis smooth scroll
- Extra: next/font for all typography
- Icons: lucide-react
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #FFFFFF
  --surface: #F5F7FA
  --border: #E1E6ED
  --fg: #0F1B2D
  --muted: #5B6B80
  --accent: {{ACCENT_HEX}} (fallback #0F3D6E)
  Secondary accents (ambient/illustrative use only, never as the primary CTA color): #C6A15B
Typography:
  Display: "Söhne" — used for H1/H2, tight tracking
  Body: "Söhne" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 10px
  Signature mechanic: a fixed trust-bar beneath the navbar listing certifications/regulator marks in small caps
  Motion signature: ease-out 350ms, no playful overshoot

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #FFFFFF/90 with backdrop-blur(16px) after 40px scroll, transition 400ms ease-out 350ms.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Söhne, weight 700.
- Center/right links styled per the Corporate Premium Trust type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #0F3D6E; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero
- Full-viewport, min-h-screen composition built around a fixed trust-bar beneath the navbar listing certifications/regulator marks in small caps.
- H1 "{{HERO_HEADLINE}}" set in Söhne, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease-out 350ms, no playful overshoot.
- Sub-headline "{{VALUE_PROP}}" in Söhne, max-w-xl, color #5B6B80.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #0F3D6E) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Corporate Premium Trust palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #F5F7FA until onLoad fires.

### 3. Menu Program Showcase
- Grid of {{ITEM_1..6}} (menu programs), 10px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Framer Motion.

### 4. Story / Philosophy
- Long-form editorial block (Söhne pull-quote + Söhne body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the Corporate Premium Trust media treatment -- otherwise the block stands on typography alone.

### 5. Locations
- List/map of {{LOCATION_1..6}} with address, hours, and a directions link; collapses to a simple list under 3 locations.

### 6. Reservation CTA
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 7. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #E1E6ED, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for foodservice if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #F5F7FA with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #0F3D6E, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built restaurant group / fine-dining brand product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 774 — Playful Sophisticated — Restaurant Group / Fine-Dining Brand

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a restaurant group / fine-dining brand ({{PRODUCT_CATEGORY}}). Art direction: playful sophisticated — bold single accent on cream, hand-tuned micro-illustrations, confident restraint with warmth. Production-ready, 100% responsive.

## TECH STACK
- Framework: Astro 4 with islands (React only where interactivity is required)
- Styling: Tailwind CSS v4
- Animation: GSAP + ScrollTrigger, vanilla JS islands
- Extra: View Transitions API for page-to-page motion
- Icons: Lucide (astro-icon)
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #FFF8EF
  --surface: #FFFFFF
  --border: #F0E4D0
  --fg: #20180E
  --muted: #8C7F68
  --accent: {{ACCENT_HEX}} (fallback #FF5A36)
Typography:
  Display: "Fraunces (soft)" — used for H1/H2, tight tracking
  Body: "General Sans" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 18px
  Signature mechanic: small hand-drawn-style SVG accent marks (circles, arrows) that rotate/scale in as a section enters viewport
  Motion signature: spring(220,20), playful but never chaotic

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #FFF8EF/90 with backdrop-blur(16px) after 40px scroll, transition 400ms spring(220,20).
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Fraunces (soft), weight 700.
- Center/right links styled per the Playful Sophisticated type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #FF5A36; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero
- Full-viewport, min-h-screen composition built around small hand-drawn-style SVG accent marks (circles, arrows) that rotate/scale in as a section enters viewport.
- H1 "{{HERO_HEADLINE}}" set in Fraunces (soft), clamp(2.75rem, 7vw, 5.5rem); entrance timed to spring(220,20), playful but never chaotic.
- Sub-headline "{{VALUE_PROP}}" in General Sans, max-w-xl, color #8C7F68.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #FF5A36) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Playful Sophisticated palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #FFFFFF until onLoad fires.

### 3. Menu Program Showcase
- Grid of {{ITEM_1..6}} (menu programs), 18px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, GSAP.

### 4. Story / Philosophy
- Long-form editorial block (Fraunces (soft) pull-quote + General Sans body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the Playful Sophisticated media treatment -- otherwise the block stands on typography alone.

### 5. Locations
- List/map of {{LOCATION_1..6}} with address, hours, and a directions link; collapses to a simple list under 3 locations.

### 6. Reservation CTA
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 7. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #F0E4D0, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for foodservice if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #FFFFFF with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #FF5A36, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built restaurant group / fine-dining brand product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 775 — Organic Earth — Restaurant Group / Fine-Dining Brand

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a restaurant group / fine-dining brand ({{PRODUCT_CATEGORY}}). Art direction: organic earth — clay, moss and sand tones, blob/curve shapes, natural texture, calm pacing. Production-ready, 100% responsive.

## TECH STACK
- Framework: 11ty (static-first) with Nunjucks templates
- Styling: Tailwind CSS v4 (CLI build, no JS framework runtime)
- Animation: Alpine.js for micro-interactions + CSS scroll-driven animations (animation-timeline: view())
- Extra: Zero client JS framework — ships an HTML/CSS-first page with progressive enhancement
- Icons: inline SVG sprite
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #F3EEE4
  --surface: #EAE2D0
  --border: #D8CBAE
  --fg: #2C2416
  --muted: #8A7F65
  --accent: {{ACCENT_HEX}} (fallback #5B6E4F)
Typography:
  Display: "Fraunces" — used for H1/H2, tight tracking
  Body: "Newsreader" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 40% organic blob clip-paths on media
  Signature mechanic: organic blob-shaped SVG clip-paths frame every image, morphing slightly on scroll (clip-path interpolation)
  Texture layer: subtle paper texture at 5%, pointer-events-none, aria-hidden
  Motion signature: ease-in-out 700ms, slow drift

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #F3EEE4/90 with backdrop-blur(16px) after 40px scroll, transition 400ms ease-in-out 700ms.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Fraunces, weight 700.
- Center/right links styled per the Organic Earth type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #5B6E4F; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero
- Full-viewport, min-h-screen composition built around organic blob-shaped SVG clip-paths frame every image, morphing slightly on scroll (clip-path interpolation).
- H1 "{{HERO_HEADLINE}}" set in Fraunces, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease-in-out 700ms, slow drift.
- Sub-headline "{{VALUE_PROP}}" in Newsreader, max-w-xl, color #8A7F65.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #5B6E4F) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Organic Earth palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #EAE2D0 until onLoad fires.

### 3. Menu Program Showcase
- Grid of {{ITEM_1..6}} (menu programs), 40% organic blob clip-paths on media media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Alpine.js for micro-interactions.

### 4. Story / Philosophy
- Long-form editorial block (Fraunces pull-quote + Newsreader body) telling {{BRAND_STORY}}; imagery, if supplied via {{SCREEN_1..5}}, is framed per the Organic Earth media treatment -- otherwise the block stands on typography alone.

### 5. Locations
- List/map of {{LOCATION_1..6}} with address, hours, and a directions link; collapses to a simple list under 3 locations.

### 6. Reservation CTA
- Inline booking widget or a clear "{{PRIMARY_CTA}}" leading to {{BOOKING_URL}}; form fields validate inline, submit disables and shows a pending label while in flight.

### 7. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #D8CBAE, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for foodservice if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #EAE2D0 with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #5B6E4F, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built restaurant group / fine-dining brand product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 776 — Swiss Brutalist Monochrome — Digital Media / News Publication

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a digital media / news publication ({{PRODUCT_CATEGORY}}). Art direction: swiss brutalist monochrome — raw grid discipline, oversized type as the only ornament, zero decorative imagery. Production-ready, 100% responsive.

## TECH STACK
- Framework: Astro 4 with islands (React only where interactivity is required)
- Styling: Tailwind CSS v4
- Animation: GSAP + ScrollTrigger, vanilla JS islands
- Extra: View Transitions API for page-to-page motion
- Icons: Lucide (astro-icon)
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #FFFFFF
  --surface: #F2F2F0
  --border: #DEDEDA
  --fg: #0B0B0B
  --muted: #7A7A78
  --accent: {{ACCENT_HEX}} (fallback #0B0B0B)
Typography:
  Display: "Neue Haas Grotesk Display" — used for H1/H2, tight tracking
  Body: "Neue Haas Grotesk Text" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: max 2px, mostly 0
  Signature mechanic: full-bleed horizontal marquee statement + numbered editorial list rows
  Motion signature: power4.out / cubic-bezier(0.16,1,0.3,1), no linear

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #FFFFFF/90 with backdrop-blur(16px) after 40px scroll, transition 400ms power4.out / cubic-bezier(0.16,1,0.3,1).
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Neue Haas Grotesk Display, weight 700.
- Center/right links styled per the Swiss Brutalist Monochrome type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #0B0B0B; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero / Featured Story
- Full-viewport, min-h-screen composition built around full-bleed horizontal marquee statement + numbered editorial list rows.
- H1 "{{HERO_HEADLINE}}" set in Neue Haas Grotesk Display, clamp(2.75rem, 7vw, 5.5rem); entrance timed to power4.out / cubic-bezier(0.16,1,0.3,1), no linear.
- Sub-headline "{{VALUE_PROP}}" in Neue Haas Grotesk Text, max-w-xl, color #7A7A78.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #0B0B0B) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Swiss Brutalist Monochrome palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #F2F2F0 until onLoad fires.

### 3. Section Grid
- Grid of {{ITEM_1..6}} (sections), max 2px, mostly 0 media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, GSAP.

### 4. Latest Archive
- Reverse-chronological list of {{ARTICLE_1..12}} with date, category tag, and read-time; infinite scroll or pagination depending on {{ARTICLE_COUNT}}.

### 5. Newsletter CTA
- Inline email capture, inline validation below the field, #0B0B0B text at 13px, aria-live="polite" on error; success state replaces the form with a confirmation message, no page reload.

### 6. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #DEDEDA, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for media if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #F2F2F0 with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #0B0B0B, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built digital media / news publication product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 777 — Aurora Glassmorphism — Digital Media / News Publication

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a digital media / news publication ({{PRODUCT_CATEGORY}}). Art direction: aurora glassmorphism — deep space backdrop, drifting light fields, frosted translucent surfaces. Production-ready, 100% responsive.

## TECH STACK
- Framework: 11ty (static-first) with Nunjucks templates
- Styling: Tailwind CSS v4 (CLI build, no JS framework runtime)
- Animation: Alpine.js for micro-interactions + CSS scroll-driven animations (animation-timeline: view())
- Extra: Zero client JS framework — ships an HTML/CSS-first page with progressive enhancement
- Icons: inline SVG sprite
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #05060B
  --surface: rgba(255,255,255,0.04)
  --border: rgba(255,255,255,0.09)
  --fg: #F4F6FB
  --muted: #8A92A6
  --accent: {{ACCENT_HEX}} (fallback #6E56F8)
  Secondary accents (ambient/illustrative use only, never as the primary CTA color): #2FD4C4, #F857A6
Typography:
  Display: "General Sans" — used for H1/H2, tight tracking
  Body: "Inter" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 20px on glass surfaces
  Signature mechanic: three desynced radial-gradient blobs + backdrop-blur(24px) glass recipe reused everywhere
  Texture layer: SVG feTurbulence grain at 0.035 opacity, pointer-events-none, aria-hidden
  Motion signature: [0.16,1,0.3,1], slow ambient CSS keyframe loops

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #05060B/90 with backdrop-blur(16px) after 40px scroll, transition 400ms [0.16.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in General Sans, weight 700.
- Center/right links styled per the Aurora Glassmorphism type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #6E56F8; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero / Featured Story
- Full-viewport, min-h-screen composition built around three desynced radial-gradient blobs + backdrop-blur(24px) glass recipe reused everywhere.
- H1 "{{HERO_HEADLINE}}" set in General Sans, clamp(2.75rem, 7vw, 5.5rem); entrance timed to [0.16,1,0.3,1], slow ambient CSS keyframe loops.
- Sub-headline "{{VALUE_PROP}}" in Inter, max-w-xl, color #8A92A6.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #6E56F8) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Aurora Glassmorphism palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in rgba(255,255,255,0.04) until onLoad fires.

### 3. Section Grid
- Grid of {{ITEM_1..6}} (sections), 20px on glass surfaces media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Alpine.js for micro-interactions.

### 4. Latest Archive
- Reverse-chronological list of {{ARTICLE_1..12}} with date, category tag, and read-time; infinite scroll or pagination depending on {{ARTICLE_COUNT}}.

### 5. Newsletter CTA
- Inline email capture, inline validation below the field, #6E56F8 text at 13px, aria-live="polite" on error; success state replaces the form with a confirmation message, no page reload.

### 6. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at rgba(255,255,255,0.09), copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for media if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in rgba(255,255,255,0.04) with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #6E56F8, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built digital media / news publication product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 778 — Neo-Brutalist Pop — Digital Media / News Publication

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a digital media / news publication ({{PRODUCT_CATEGORY}}). Art direction: neo-brutalist pop — thick black outlines, flat saturated blocks, deliberately raw hard shadows, no gradients. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router) with MDX for long-form content routes
- Styling: Tailwind CSS v4 typography plugin, tuned to the design system tokens
- Animation: Framer Motion for chrome, CSS-only for in-content elements
- Extra: Reading-progress bar via scroll listener
- Icons: lucide-react
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #FDF6EC
  --surface: #FFFFFF
  --border: #111111
  --fg: #111111
  --muted: #5B564E
  --accent: {{ACCENT_HEX}} (fallback #FF4D2E)
  Secondary accents (ambient/illustrative use only, never as the primary CTA color): #FFD23F, #2EC4B6
Typography:
  Display: "Archivo Black" — used for H1/H2, tight tracking
  Body: "Archivo" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 0px everywhere
  Signature mechanic: hard offset shadow (8px 8px 0 #111) that flattens to 0 0 0 on press, thick 3px borders on every block
  Motion signature: steps() and abrupt cubic-bezier(0.68,-0.55,0.27,1.55) overshoot

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #FDF6EC/90 with backdrop-blur(16px) after 40px scroll, transition 400ms steps() and abrupt cubic-bezier(0.68,-0.55,0.27,1.55) overshoot.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Archivo Black, weight 700.
- Center/right links styled per the Neo-Brutalist Pop type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #FF4D2E; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero / Featured Story
- Full-viewport, min-h-screen composition built around hard offset shadow (8px 8px 0 #111) that flattens to 0 0 0 on press, thick 3px borders on every block.
- H1 "{{HERO_HEADLINE}}" set in Archivo Black, clamp(2.75rem, 7vw, 5.5rem); entrance timed to steps() and abrupt cubic-bezier(0.68,-0.55,0.27,1.55) overshoot.
- Sub-headline "{{VALUE_PROP}}" in Archivo, max-w-xl, color #5B564E.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #FF4D2E) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Neo-Brutalist Pop palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #FFFFFF until onLoad fires.

### 3. Section Grid
- Grid of {{ITEM_1..6}} (sections), 0px everywhere media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Framer Motion for chrome.

### 4. Latest Archive
- Reverse-chronological list of {{ARTICLE_1..12}} with date, category tag, and read-time; infinite scroll or pagination depending on {{ARTICLE_COUNT}}.

### 5. Newsletter CTA
- Inline email capture, inline validation below the field, #FF4D2E text at 13px, aria-live="polite" on error; success state replaces the form with a confirmation message, no page reload.

### 6. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #111111, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for media if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #FFFFFF with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #FF4D2E, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built digital media / news publication product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 779 — Editorial Serif Luxury — Digital Media / News Publication

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a digital media / news publication ({{PRODUCT_CATEGORY}}). Art direction: editorial serif luxury — magazine-grade serif display type, generous margins, restrained color, photography-led. Production-ready, 100% responsive.

## TECH STACK
- Framework: Astro 4 with islands (React only where interactivity is required)
- Styling: Tailwind CSS v4
- Animation: GSAP + ScrollTrigger, vanilla JS islands
- Extra: View Transitions API for page-to-page motion
- Icons: Lucide (astro-icon)
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #FBF9F6
  --surface: #F1EDE6
  --border: #E3DCD0
  --fg: #1A1714
  --muted: #8A8175
  --accent: {{ACCENT_HEX}} (fallback #7A2E2E)
Typography:
  Display: "Canela / GT Sectra" — used for H1/H2, tight tracking
  Body: "Söhne" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 0px, hairline rules instead
  Signature mechanic: asymmetric editorial grid with pull-quotes and a running folio/issue number
  Motion signature: ease-out, 600-900ms, understated crossfades

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #FBF9F6/90 with backdrop-blur(16px) after 40px scroll, transition 400ms ease-out.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Canela / GT Sectra, weight 700.
- Center/right links styled per the Editorial Serif Luxury type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #7A2E2E; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero / Featured Story
- Full-viewport, min-h-screen composition built around asymmetric editorial grid with pull-quotes and a running folio/issue number.
- H1 "{{HERO_HEADLINE}}" set in Canela / GT Sectra, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease-out, 600-900ms, understated crossfades.
- Sub-headline "{{VALUE_PROP}}" in Söhne, max-w-xl, color #8A8175.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #7A2E2E) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Editorial Serif Luxury palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #F1EDE6 until onLoad fires.

### 3. Section Grid
- Grid of {{ITEM_1..6}} (sections), 0px, hairline rules instead media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, GSAP.

### 4. Latest Archive
- Reverse-chronological list of {{ARTICLE_1..12}} with date, category tag, and read-time; infinite scroll or pagination depending on {{ARTICLE_COUNT}}.

### 5. Newsletter CTA
- Inline email capture, inline validation below the field, #7A2E2E text at 13px, aria-live="polite" on error; success state replaces the form with a confirmation message, no page reload.

### 6. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #E3DCD0, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for media if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #F1EDE6 with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #7A2E2E, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built digital media / news publication product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 780 — Dark Technical Console — Digital Media / News Publication

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a digital media / news publication ({{PRODUCT_CATEGORY}}). Art direction: dark technical console — near-black canvas, monospace accents, data-dense panels, engineering credibility. Production-ready, 100% responsive.

## TECH STACK
- Framework: 11ty (static-first) with Nunjucks templates
- Styling: Tailwind CSS v4 (CLI build, no JS framework runtime)
- Animation: Alpine.js for micro-interactions + CSS scroll-driven animations (animation-timeline: view())
- Extra: Zero client JS framework — ships an HTML/CSS-first page with progressive enhancement
- Icons: inline SVG sprite
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #0A0C10
  --surface: #12151B
  --border: #22262E
  --fg: #E7EAEE
  --muted: #7C838F
  --accent: {{ACCENT_HEX}} (fallback #5EEAD4)
  Secondary accents (ambient/illustrative use only, never as the primary CTA color): #818CF8
Typography:
  Display: "Inter Tight" — used for H1/H2, tight tracking
  Body: "Inter" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 8px
  Signature mechanic: live-updating metric tiles with tabular-nums CountUp and a terminal-style command block
  Texture layer: 1px scanline overlay at 3% opacity, pointer-events-none, aria-hidden
  Motion signature: 150-250ms ease, no bounce

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #0A0C10/90 with backdrop-blur(16px) after 40px scroll, transition 400ms 150-250ms ease.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Inter Tight, weight 700.
- Center/right links styled per the Dark Technical Console type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #5EEAD4; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero / Featured Story
- Full-viewport, min-h-screen composition built around live-updating metric tiles with tabular-nums CountUp and a terminal-style command block.
- H1 "{{HERO_HEADLINE}}" set in Inter Tight, clamp(2.75rem, 7vw, 5.5rem); entrance timed to 150-250ms ease, no bounce.
- Sub-headline "{{VALUE_PROP}}" in Inter, max-w-xl, color #7C838F.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #5EEAD4) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Dark Technical Console palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #12151B until onLoad fires.

### 3. Section Grid
- Grid of {{ITEM_1..6}} (sections), 8px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Alpine.js for micro-interactions.

### 4. Latest Archive
- Reverse-chronological list of {{ARTICLE_1..12}} with date, category tag, and read-time; infinite scroll or pagination depending on {{ARTICLE_COUNT}}.

### 5. Newsletter CTA
- Inline email capture, inline validation below the field, #5EEAD4 text at 13px, aria-live="polite" on error; success state replaces the form with a confirmation message, no page reload.

### 6. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #22262E, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for media if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #12151B with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #5EEAD4, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built digital media / news publication product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 781 — Cyberpunk Neon — Digital Media / News Publication

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a digital media / news publication ({{PRODUCT_CATEGORY}}). Art direction: cyberpunk neon — black canvas, saturated magenta/cyan neon, glitch accents, dense HUD framing. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router) with MDX for long-form content routes
- Styling: Tailwind CSS v4 typography plugin, tuned to the design system tokens
- Animation: Framer Motion for chrome, CSS-only for in-content elements
- Extra: Reading-progress bar via scroll listener
- Icons: lucide-react
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #050508
  --surface: #0E0E16
  --border: #2A2A3D
  --fg: #F5F5FF
  --muted: #8B8BA7
  --accent: {{ACCENT_HEX}} (fallback #FF2E9A)
  Secondary accents (ambient/illustrative use only, never as the primary CTA color): #00F5FF
Typography:
  Display: "Rajdhani" — used for H1/H2, tight tracking
  Body: "Space Grotesk" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 2px, corner-clipped (clip-path) panels
  Signature mechanic: scanline + chromatic-aberration text-shadow on the H1, HUD corner brackets on every panel
  Texture layer: animated scanline, 6% opacity, pointer-events-none, aria-hidden
  Motion signature: glitch keyframe (translate jitter 2px, 80ms) on hover only

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #050508/90 with backdrop-blur(16px) after 40px scroll, transition 400ms glitch keyframe (translate jitter 2px, 80ms) on hover only.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Rajdhani, weight 700.
- Center/right links styled per the Cyberpunk Neon type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #FF2E9A; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero / Featured Story
- Full-viewport, min-h-screen composition built around scanline + chromatic-aberration text-shadow on the H1, HUD corner brackets on every panel.
- H1 "{{HERO_HEADLINE}}" set in Rajdhani, clamp(2.75rem, 7vw, 5.5rem); entrance timed to glitch keyframe (translate jitter 2px, 80ms) on hover only.
- Sub-headline "{{VALUE_PROP}}" in Space Grotesk, max-w-xl, color #8B8BA7.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #FF2E9A) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Cyberpunk Neon palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #0E0E16 until onLoad fires.

### 3. Section Grid
- Grid of {{ITEM_1..6}} (sections), 2px, corner-clipped (clip-path) panels media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Framer Motion for chrome.

### 4. Latest Archive
- Reverse-chronological list of {{ARTICLE_1..12}} with date, category tag, and read-time; infinite scroll or pagination depending on {{ARTICLE_COUNT}}.

### 5. Newsletter CTA
- Inline email capture, inline validation below the field, #FF2E9A text at 13px, aria-live="polite" on error; success state replaces the form with a confirmation message, no page reload.

### 6. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #2A2A3D, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for media if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #0E0E16 with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #FF2E9A, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built digital media / news publication product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 782 — Industrial Utilitarian — Digital Media / News Publication

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a digital media / news publication ({{PRODUCT_CATEGORY}}). Art direction: industrial utilitarian — concrete and steel palette, exposed grid lines, stenciled labels, function over decoration. Production-ready, 100% responsive.

## TECH STACK
- Framework: Astro 4 with islands (React only where interactivity is required)
- Styling: Tailwind CSS v4
- Animation: GSAP + ScrollTrigger, vanilla JS islands
- Extra: View Transitions API for page-to-page motion
- Icons: Lucide (astro-icon)
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #EDECE8
  --surface: #DCDAD3
  --border: #B7B4AA
  --fg: #1F1E1B
  --muted: #6B675E
  --accent: {{ACCENT_HEX}} (fallback #C9491C)
Typography:
  Display: "Suisse Int'l Mono" — used for H1/H2, tight tracking
  Body: "Suisse Int'l" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 0px
  Signature mechanic: visible grid lines (1px --border) drawn across the full viewport as a permanent underlay, stenciled uppercase section labels with dot-leaders
  Texture layer: fine paper-grain at 4%, pointer-events-none, aria-hidden
  Motion signature: linear 200ms for mechanical feel on toggles only, ease-out elsewhere

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #EDECE8/90 with backdrop-blur(16px) after 40px scroll, transition 400ms linear 200ms for mechanical feel on toggles only.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Suisse Int'l Mono, weight 700.
- Center/right links styled per the Industrial Utilitarian type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #C9491C; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero / Featured Story
- Full-viewport, min-h-screen composition built around visible grid lines (1px --border) drawn across the full viewport as a permanent underlay, stenciled uppercase section labels with dot-leaders.
- H1 "{{HERO_HEADLINE}}" set in Suisse Int'l Mono, clamp(2.75rem, 7vw, 5.5rem); entrance timed to linear 200ms for mechanical feel on toggles only, ease-out elsewhere.
- Sub-headline "{{VALUE_PROP}}" in Suisse Int'l, max-w-xl, color #6B675E.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #C9491C) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Industrial Utilitarian palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #DCDAD3 until onLoad fires.

### 3. Section Grid
- Grid of {{ITEM_1..6}} (sections), 0px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, GSAP.

### 4. Latest Archive
- Reverse-chronological list of {{ARTICLE_1..12}} with date, category tag, and read-time; infinite scroll or pagination depending on {{ARTICLE_COUNT}}.

### 5. Newsletter CTA
- Inline email capture, inline validation below the field, #C9491C text at 13px, aria-live="polite" on error; success state replaces the form with a confirmation message, no page reload.

### 6. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #B7B4AA, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for media if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #DCDAD3 with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #C9491C, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built digital media / news publication product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 783 — Futuristic Chrome — Digital Media / News Publication

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a digital media / news publication ({{PRODUCT_CATEGORY}}). Art direction: futuristic chrome — liquid chrome gradients, specular highlights, cool metallic palette, motion-first. Production-ready, 100% responsive.

## TECH STACK
- Framework: 11ty (static-first) with Nunjucks templates
- Styling: Tailwind CSS v4 (CLI build, no JS framework runtime)
- Animation: Alpine.js for micro-interactions + CSS scroll-driven animations (animation-timeline: view())
- Extra: Zero client JS framework — ships an HTML/CSS-first page with progressive enhancement
- Icons: inline SVG sprite
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #0B0D12
  --surface: #151821
  --border: #2B2F3A
  --fg: #F2F4F8
  --muted: #9AA1AF
  --accent: {{ACCENT_HEX}} (fallback #7DD3FC)
  Secondary accents (ambient/illustrative use only, never as the primary CTA color): #C4B5FD
Typography:
  Display: "Space Grotesk" — used for H1/H2, tight tracking
  Body: "Inter" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 28px, pill-shaped controls
  Signature mechanic: specular chrome gradient sweeping across headline on scroll (background-position tied to scrollYProgress)
  Motion signature: spring(stiffness 220, damping 26) via Framer Motion

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #0B0D12/90 with backdrop-blur(16px) after 40px scroll, transition 400ms spring(stiffness 220, damping 26) via Framer Motion.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Space Grotesk, weight 700.
- Center/right links styled per the Futuristic Chrome type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #7DD3FC; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero / Featured Story
- Full-viewport, min-h-screen composition built around specular chrome gradient sweeping across headline on scroll (background-position tied to scrollYProgress).
- H1 "{{HERO_HEADLINE}}" set in Space Grotesk, clamp(2.75rem, 7vw, 5.5rem); entrance timed to spring(stiffness 220, damping 26) via Framer Motion.
- Sub-headline "{{VALUE_PROP}}" in Inter, max-w-xl, color #9AA1AF.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #7DD3FC) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Futuristic Chrome palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #151821 until onLoad fires.

### 3. Section Grid
- Grid of {{ITEM_1..6}} (sections), 28px, pill-shaped controls media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Alpine.js for micro-interactions.

### 4. Latest Archive
- Reverse-chronological list of {{ARTICLE_1..12}} with date, category tag, and read-time; infinite scroll or pagination depending on {{ARTICLE_COUNT}}.

### 5. Newsletter CTA
- Inline email capture, inline validation below the field, #7DD3FC text at 13px, aria-live="polite" on error; success state replaces the form with a confirmation message, no page reload.

### 6. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #2B2F3A, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for media if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #151821 with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #7DD3FC, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built digital media / news publication product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 784 — Soft Minimal Warmth — Digital Media / News Publication

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a digital media / news publication ({{PRODUCT_CATEGORY}}). Art direction: soft minimal warmth — warm off-white, generous air, soft shadows, rounded forms, low-contrast restraint. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router) with MDX for long-form content routes
- Styling: Tailwind CSS v4 typography plugin, tuned to the design system tokens
- Animation: Framer Motion for chrome, CSS-only for in-content elements
- Extra: Reading-progress bar via scroll listener
- Icons: lucide-react
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #FAF7F2
  --surface: #FFFFFF
  --border: #ECE6DC
  --fg: #2B2620
  --muted: #928C80
  --accent: {{ACCENT_HEX}} (fallback #D97757)
Typography:
  Display: "Fraunces" — used for H1/H2, tight tracking
  Body: "Inter" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 24px
  Signature mechanic: soft double-layer drop shadow (0 1px 2px + 0 12px 24px at 6%) on every raised surface, no borders — light does the separating
  Motion signature: ease-out 400-600ms, gentle y:12→0 reveals

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #FAF7F2/90 with backdrop-blur(16px) after 40px scroll, transition 400ms ease-out 400-600ms.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Fraunces, weight 700.
- Center/right links styled per the Soft Minimal Warmth type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #D97757; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero / Featured Story
- Full-viewport, min-h-screen composition built around soft double-layer drop shadow (0 1px 2px + 0 12px 24px at 6%) on every raised surface, no borders — light does the separating.
- H1 "{{HERO_HEADLINE}}" set in Fraunces, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease-out 400-600ms, gentle y:12→0 reveals.
- Sub-headline "{{VALUE_PROP}}" in Inter, max-w-xl, color #928C80.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #D97757) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Soft Minimal Warmth palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #FFFFFF until onLoad fires.

### 3. Section Grid
- Grid of {{ITEM_1..6}} (sections), 24px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Framer Motion for chrome.

### 4. Latest Archive
- Reverse-chronological list of {{ARTICLE_1..12}} with date, category tag, and read-time; infinite scroll or pagination depending on {{ARTICLE_COUNT}}.

### 5. Newsletter CTA
- Inline email capture, inline validation below the field, #D97757 text at 13px, aria-live="polite" on error; success state replaces the form with a confirmation message, no page reload.

### 6. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #ECE6DC, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for media if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #FFFFFF with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #D97757, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built digital media / news publication product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 785 — Art Deco Revival — Digital Media / News Publication

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a digital media / news publication ({{PRODUCT_CATEGORY}}). Art direction: art deco revival — gold on deep emerald/black, geometric fan and sunburst motifs, symmetrical ornament. Production-ready, 100% responsive.

## TECH STACK
- Framework: Astro 4 with islands (React only where interactivity is required)
- Styling: Tailwind CSS v4
- Animation: GSAP + ScrollTrigger, vanilla JS islands
- Extra: View Transitions API for page-to-page motion
- Icons: Lucide (astro-icon)
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #0D1512
  --surface: #122019
  --border: #B8935A
  --fg: #F3E9D2
  --muted: #9FB5A8
  --accent: {{ACCENT_HEX}} (fallback #C9A96A)
Typography:
  Display: "Poiret One / Cinzel" — used for H1/H2, tight tracking
  Body: "Cormorant" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 0px, chamfered corners via clip-path
  Signature mechanic: repeating SVG sunburst/fan motif as section dividers, gold 1px double-rule borders
  Texture layer: subtle metallic gradient noise, pointer-events-none, aria-hidden
  Motion signature: ease-in-out 700ms, symmetrical mirrored reveals

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #0D1512/90 with backdrop-blur(16px) after 40px scroll, transition 400ms ease-in-out 700ms.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Poiret One / Cinzel, weight 700.
- Center/right links styled per the Art Deco Revival type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #C9A96A; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero / Featured Story
- Full-viewport, min-h-screen composition built around repeating SVG sunburst/fan motif as section dividers, gold 1px double-rule borders.
- H1 "{{HERO_HEADLINE}}" set in Poiret One / Cinzel, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease-in-out 700ms, symmetrical mirrored reveals.
- Sub-headline "{{VALUE_PROP}}" in Cormorant, max-w-xl, color #9FB5A8.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #C9A96A) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Art Deco Revival palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #122019 until onLoad fires.

### 3. Section Grid
- Grid of {{ITEM_1..6}} (sections), 0px, chamfered corners via clip-path media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, GSAP.

### 4. Latest Archive
- Reverse-chronological list of {{ARTICLE_1..12}} with date, category tag, and read-time; infinite scroll or pagination depending on {{ARTICLE_COUNT}}.

### 5. Newsletter CTA
- Inline email capture, inline validation below the field, #C9A96A text at 13px, aria-live="polite" on error; success state replaces the form with a confirmation message, no page reload.

### 6. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #B8935A, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for media if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #122019 with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #C9A96A, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built digital media / news publication product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 786 — Japanese Minimal (Ma) — Digital Media / News Publication

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a digital media / news publication ({{PRODUCT_CATEGORY}}). Art direction: japanese minimal (ma) — extreme negative space, single accent stroke, vertical rhythm, quiet confidence. Production-ready, 100% responsive.

## TECH STACK
- Framework: 11ty (static-first) with Nunjucks templates
- Styling: Tailwind CSS v4 (CLI build, no JS framework runtime)
- Animation: Alpine.js for micro-interactions + CSS scroll-driven animations (animation-timeline: view())
- Extra: Zero client JS framework — ships an HTML/CSS-first page with progressive enhancement
- Icons: inline SVG sprite
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #FCFCFA
  --surface: #F5F4F0
  --border: #E2E0D8
  --fg: #1C1C1A
  --muted: #8D8B84
  --accent: {{ACCENT_HEX}} (fallback #C1121F)
Typography:
  Display: "Zen Old Mincho / Shippori Mincho" — used for H1/H2, tight tracking
  Body: "Noto Sans JP fallback / Inter" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 0px
  Signature mechanic: a single vertical hairline rule tracks scroll progress along the left margin; content occupies at most 60% of viewport width
  Motion signature: ease 800ms, single elements move — never groups at once

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #FCFCFA/90 with backdrop-blur(16px) after 40px scroll, transition 400ms ease 800ms.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Zen Old Mincho / Shippori Mincho, weight 700.
- Center/right links styled per the Japanese Minimal (Ma) type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #C1121F; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero / Featured Story
- Full-viewport, min-h-screen composition built around a single vertical hairline rule tracks scroll progress along the left margin; content occupies at most 60% of viewport width.
- H1 "{{HERO_HEADLINE}}" set in Zen Old Mincho / Shippori Mincho, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease 800ms, single elements move — never groups at once.
- Sub-headline "{{VALUE_PROP}}" in Noto Sans JP fallback / Inter, max-w-xl, color #8D8B84.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #C1121F) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Japanese Minimal (Ma) palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #F5F4F0 until onLoad fires.

### 3. Section Grid
- Grid of {{ITEM_1..6}} (sections), 0px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Alpine.js for micro-interactions.

### 4. Latest Archive
- Reverse-chronological list of {{ARTICLE_1..12}} with date, category tag, and read-time; infinite scroll or pagination depending on {{ARTICLE_COUNT}}.

### 5. Newsletter CTA
- Inline email capture, inline validation below the field, #C1121F text at 13px, aria-live="polite" on error; success state replaces the form with a confirmation message, no page reload.

### 6. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #E2E0D8, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for media if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #F5F4F0 with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #C1121F, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built digital media / news publication product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 787 — Scandinavian Functional — Digital Media / News Publication

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a digital media / news publication ({{PRODUCT_CATEGORY}}). Art direction: scandinavian functional — light wood-neutral palette, clean sans type, function-led hierarchy, quiet confidence. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router) with MDX for long-form content routes
- Styling: Tailwind CSS v4 typography plugin, tuned to the design system tokens
- Animation: Framer Motion for chrome, CSS-only for in-content elements
- Extra: Reading-progress bar via scroll listener
- Icons: lucide-react
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #F7F5F2
  --surface: #FFFFFF
  --border: #E4E0D8
  --fg: #232320
  --muted: #7D7A72
  --accent: {{ACCENT_HEX}} (fallback #3E6259)
Typography:
  Display: "Söhne" — used for H1/H2, tight tracking
  Body: "Söhne" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 12px
  Signature mechanic: consistent 8pt spacing scale exposed as visible rhythm between hairline-separated blocks
  Motion signature: ease-out 300ms, no overshoot

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #F7F5F2/90 with backdrop-blur(16px) after 40px scroll, transition 400ms ease-out 300ms.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Söhne, weight 700.
- Center/right links styled per the Scandinavian Functional type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #3E6259; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero / Featured Story
- Full-viewport, min-h-screen composition built around consistent 8pt spacing scale exposed as visible rhythm between hairline-separated blocks.
- H1 "{{HERO_HEADLINE}}" set in Söhne, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease-out 300ms, no overshoot.
- Sub-headline "{{VALUE_PROP}}" in Söhne, max-w-xl, color #7D7A72.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #3E6259) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Scandinavian Functional palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #FFFFFF until onLoad fires.

### 3. Section Grid
- Grid of {{ITEM_1..6}} (sections), 12px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Framer Motion for chrome.

### 4. Latest Archive
- Reverse-chronological list of {{ARTICLE_1..12}} with date, category tag, and read-time; infinite scroll or pagination depending on {{ARTICLE_COUNT}}.

### 5. Newsletter CTA
- Inline email capture, inline validation below the field, #3E6259 text at 13px, aria-live="polite" on error; success state replaces the form with a confirmation message, no page reload.

### 6. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #E4E0D8, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for media if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #FFFFFF with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #3E6259, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built digital media / news publication product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 788 — Retro-Futurist 80s — Digital Media / News Publication

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a digital media / news publication ({{PRODUCT_CATEGORY}}). Art direction: retro-futurist 80s — sunset gradient, chrome grid horizon, VHS scanlines, synthwave palette. Production-ready, 100% responsive.

## TECH STACK
- Framework: Astro 4 with islands (React only where interactivity is required)
- Styling: Tailwind CSS v4
- Animation: GSAP + ScrollTrigger, vanilla JS islands
- Extra: View Transitions API for page-to-page motion
- Icons: Lucide (astro-icon)
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #1A0B2E
  --surface: #26123F
  --border: #4A2472
  --fg: #FCEEFF
  --muted: #B79BD6
  --accent: {{ACCENT_HEX}} (fallback #FF6EC7)
  Secondary accents (ambient/illustrative use only, never as the primary CTA color): #00D9FF, #FFB86C
Typography:
  Display: "Righteous" — used for H1/H2, tight tracking
  Body: "Space Grotesk" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 4px
  Signature mechanic: perspective CSS grid horizon (transform: perspective(500px) rotateX(60deg)) receding beneath the hero, sun gradient circle behind it
  Texture layer: VHS scanline + chromatic aberration, pointer-events-none, aria-hidden
  Motion signature: linear scanline drift 8s infinite, ease-out for content

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #1A0B2E/90 with backdrop-blur(16px) after 40px scroll, transition 400ms linear scanline drift 8s infinite.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Righteous, weight 700.
- Center/right links styled per the Retro-Futurist 80s type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #FF6EC7; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero / Featured Story
- Full-viewport, min-h-screen composition built around perspective CSS grid horizon (transform: perspective(500px) rotateX(60deg)) receding beneath the hero, sun gradient circle behind it.
- H1 "{{HERO_HEADLINE}}" set in Righteous, clamp(2.75rem, 7vw, 5.5rem); entrance timed to linear scanline drift 8s infinite, ease-out for content.
- Sub-headline "{{VALUE_PROP}}" in Space Grotesk, max-w-xl, color #B79BD6.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #FF6EC7) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Retro-Futurist 80s palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #26123F until onLoad fires.

### 3. Section Grid
- Grid of {{ITEM_1..6}} (sections), 4px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, GSAP.

### 4. Latest Archive
- Reverse-chronological list of {{ARTICLE_1..12}} with date, category tag, and read-time; infinite scroll or pagination depending on {{ARTICLE_COUNT}}.

### 5. Newsletter CTA
- Inline email capture, inline validation below the field, #FF6EC7 text at 13px, aria-live="polite" on error; success state replaces the form with a confirmation message, no page reload.

### 6. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #4A2472, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for media if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #26123F with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #FF6EC7, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built digital media / news publication product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 789 — Y2K Cyber-Cute — Digital Media / News Publication

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a digital media / news publication ({{PRODUCT_CATEGORY}}). Art direction: y2k cyber-cute — chrome bubbles, gradient blobs, glossy buttons, playful maximal energy. Production-ready, 100% responsive.

## TECH STACK
- Framework: 11ty (static-first) with Nunjucks templates
- Styling: Tailwind CSS v4 (CLI build, no JS framework runtime)
- Animation: Alpine.js for micro-interactions + CSS scroll-driven animations (animation-timeline: view())
- Extra: Zero client JS framework — ships an HTML/CSS-first page with progressive enhancement
- Icons: inline SVG sprite
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #EAF2FF
  --surface: #FFFFFF
  --border: #C7DBFF
  --fg: #0E1B33
  --muted: #5C6B8C
  --accent: {{ACCENT_HEX}} (fallback #7C5CFF)
  Secondary accents (ambient/illustrative use only, never as the primary CTA color): #FF5CA8, #5CE1FF
Typography:
  Display: "Chakra Petch" — used for H1/H2, tight tracking
  Body: "Poppins" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 9999px on buttons, 32px on cards
  Signature mechanic: glossy specular-highlight gradient buttons (radial-gradient white 10% at top-left), floating blob shapes drifting on scroll parallax
  Motion signature: spring bounce (stiffness 300, damping 18)

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #EAF2FF/90 with backdrop-blur(16px) after 40px scroll, transition 400ms spring bounce (stiffness 300, damping 18).
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Chakra Petch, weight 700.
- Center/right links styled per the Y2K Cyber-Cute type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #7C5CFF; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero / Featured Story
- Full-viewport, min-h-screen composition built around glossy specular-highlight gradient buttons (radial-gradient white 10% at top-left), floating blob shapes drifting on scroll parallax.
- H1 "{{HERO_HEADLINE}}" set in Chakra Petch, clamp(2.75rem, 7vw, 5.5rem); entrance timed to spring bounce (stiffness 300, damping 18).
- Sub-headline "{{VALUE_PROP}}" in Poppins, max-w-xl, color #5C6B8C.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #7C5CFF) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Y2K Cyber-Cute palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #FFFFFF until onLoad fires.

### 3. Section Grid
- Grid of {{ITEM_1..6}} (sections), 9999px on buttons, 32px on cards media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Alpine.js for micro-interactions.

### 4. Latest Archive
- Reverse-chronological list of {{ARTICLE_1..12}} with date, category tag, and read-time; infinite scroll or pagination depending on {{ARTICLE_COUNT}}.

### 5. Newsletter CTA
- Inline email capture, inline validation below the field, #7C5CFF text at 13px, aria-live="polite" on error; success state replaces the form with a confirmation message, no page reload.

### 6. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #C7DBFF, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for media if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #FFFFFF with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #7C5CFF, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built digital media / news publication product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 790 — Digital Laboratory — Digital Media / News Publication

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a digital media / news publication ({{PRODUCT_CATEGORY}}). Art direction: digital laboratory — clinical white/blue, precise data grids, diagrammatic annotation lines. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router) with MDX for long-form content routes
- Styling: Tailwind CSS v4 typography plugin, tuned to the design system tokens
- Animation: Framer Motion for chrome, CSS-only for in-content elements
- Extra: Reading-progress bar via scroll listener
- Icons: lucide-react
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #FFFFFF
  --surface: #F4F7FB
  --border: #D7E1EE
  --fg: #101828
  --muted: #667085
  --accent: {{ACCENT_HEX}} (fallback #2E6FF2)
Typography:
  Display: "IBM Plex Sans" — used for H1/H2, tight tracking
  Body: "IBM Plex Sans" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 6px
  Signature mechanic: annotation leader-lines (SVG) connecting labels to UI elements, like a lab specimen diagram
  Texture layer: 1px graph-paper grid at 3% opacity, pointer-events-none, aria-hidden
  Motion signature: ease 200ms, precise not playful

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #FFFFFF/90 with backdrop-blur(16px) after 40px scroll, transition 400ms ease 200ms.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in IBM Plex Sans, weight 700.
- Center/right links styled per the Digital Laboratory type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #2E6FF2; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero / Featured Story
- Full-viewport, min-h-screen composition built around annotation leader-lines (SVG) connecting labels to UI elements, like a lab specimen diagram.
- H1 "{{HERO_HEADLINE}}" set in IBM Plex Sans, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease 200ms, precise not playful.
- Sub-headline "{{VALUE_PROP}}" in IBM Plex Sans, max-w-xl, color #667085.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #2E6FF2) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Digital Laboratory palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #F4F7FB until onLoad fires.

### 3. Section Grid
- Grid of {{ITEM_1..6}} (sections), 6px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Framer Motion for chrome.

### 4. Latest Archive
- Reverse-chronological list of {{ARTICLE_1..12}} with date, category tag, and read-time; infinite scroll or pagination depending on {{ARTICLE_COUNT}}.

### 5. Newsletter CTA
- Inline email capture, inline validation below the field, #2E6FF2 text at 13px, aria-live="polite" on error; success state replaces the form with a confirmation message, no page reload.

### 6. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #D7E1EE, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for media if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #F4F7FB with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #2E6FF2, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built digital media / news publication product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 791 — Terminal-Inspired CLI — Digital Media / News Publication

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a digital media / news publication ({{PRODUCT_CATEGORY}}). Art direction: terminal-inspired cli — pure monospace, green/amber phosphor accent on black, blinking cursor motifs. Production-ready, 100% responsive.

## TECH STACK
- Framework: Astro 4 with islands (React only where interactivity is required)
- Styling: Tailwind CSS v4
- Animation: GSAP + ScrollTrigger, vanilla JS islands
- Extra: View Transitions API for page-to-page motion
- Icons: Lucide (astro-icon)
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #080A08
  --surface: #0F120F
  --border: #1F261F
  --fg: #D6FFD6
  --muted: #6B8F6B
  --accent: {{ACCENT_HEX}} (fallback #39FF14)
Typography:
  Display: "JetBrains Mono" — used for H1/H2, tight tracking
  Body: "JetBrains Mono" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 0px
  Signature mechanic: hero headline types itself out character-by-character with a blinking block cursor; every panel has a fake terminal titlebar with 3 dots
  Texture layer: CRT vignette + scanline at 5%, pointer-events-none, aria-hidden
  Motion signature: typewriter reveal, step-end steps(n)

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #080A08/90 with backdrop-blur(16px) after 40px scroll, transition 400ms typewriter reveal.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in JetBrains Mono, weight 700.
- Center/right links styled per the Terminal-Inspired CLI type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #39FF14; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero / Featured Story
- Full-viewport, min-h-screen composition built around hero headline types itself out character-by-character with a blinking block cursor; every panel has a fake terminal titlebar with 3 dots.
- H1 "{{HERO_HEADLINE}}" set in JetBrains Mono, clamp(2.75rem, 7vw, 5.5rem); entrance timed to typewriter reveal, step-end steps(n).
- Sub-headline "{{VALUE_PROP}}" in JetBrains Mono, max-w-xl, color #6B8F6B.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #39FF14) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Terminal-Inspired CLI palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #0F120F until onLoad fires.

### 3. Section Grid
- Grid of {{ITEM_1..6}} (sections), 0px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, GSAP.

### 4. Latest Archive
- Reverse-chronological list of {{ARTICLE_1..12}} with date, category tag, and read-time; infinite scroll or pagination depending on {{ARTICLE_COUNT}}.

### 5. Newsletter CTA
- Inline email capture, inline validation below the field, #39FF14 text at 13px, aria-live="polite" on error; success state replaces the form with a confirmation message, no page reload.

### 6. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #1F261F, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for media if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #0F120F with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #39FF14, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built digital media / news publication product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 792 — Financial Terminal Dense — Digital Media / News Publication

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a digital media / news publication ({{PRODUCT_CATEGORY}}). Art direction: financial terminal dense — black/near-black, tabular-nums everywhere, ticker rows, high information density. Production-ready, 100% responsive.

## TECH STACK
- Framework: 11ty (static-first) with Nunjucks templates
- Styling: Tailwind CSS v4 (CLI build, no JS framework runtime)
- Animation: Alpine.js for micro-interactions + CSS scroll-driven animations (animation-timeline: view())
- Extra: Zero client JS framework — ships an HTML/CSS-first page with progressive enhancement
- Icons: inline SVG sprite
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #000000
  --surface: #0C0F0C
  --border: #1E231E
  --fg: #E4E9E4
  --muted: #7C867C
  --accent: {{ACCENT_HEX}} (fallback #00C853)
  Secondary accents (ambient/illustrative use only, never as the primary CTA color): #FF3B30
Typography:
  Display: "IBM Plex Mono" — used for H1/H2, tight tracking
  Body: "IBM Plex Sans" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 2px
  Signature mechanic: a live scrolling ticker row (marquee) of tabular-nums values that flash green/red on change, dense multi-column data tables
  Motion signature: ease 150ms, numeric roll via CountUp only

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #000000/90 with backdrop-blur(16px) after 40px scroll, transition 400ms ease 150ms.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in IBM Plex Mono, weight 700.
- Center/right links styled per the Financial Terminal Dense type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #00C853; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero / Featured Story
- Full-viewport, min-h-screen composition built around a live scrolling ticker row (marquee) of tabular-nums values that flash green/red on change, dense multi-column data tables.
- H1 "{{HERO_HEADLINE}}" set in IBM Plex Mono, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease 150ms, numeric roll via CountUp only.
- Sub-headline "{{VALUE_PROP}}" in IBM Plex Sans, max-w-xl, color #7C867C.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #00C853) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Financial Terminal Dense palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #0C0F0C until onLoad fires.

### 3. Section Grid
- Grid of {{ITEM_1..6}} (sections), 2px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Alpine.js for micro-interactions.

### 4. Latest Archive
- Reverse-chronological list of {{ARTICLE_1..12}} with date, category tag, and read-time; infinite scroll or pagination depending on {{ARTICLE_COUNT}}.

### 5. Newsletter CTA
- Inline email capture, inline validation below the field, #00C853 text at 13px, aria-live="polite" on error; success state replaces the form with a confirmation message, no page reload.

### 6. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #1E231E, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for media if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #0C0F0C with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #00C853, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built digital media / news publication product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 793 — Magazine Grid — Digital Media / News Publication

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a digital media / news publication ({{PRODUCT_CATEGORY}}). Art direction: magazine grid — multi-column editorial grid, drop caps, running heads, varied image sizes. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router) with MDX for long-form content routes
- Styling: Tailwind CSS v4 typography plugin, tuned to the design system tokens
- Animation: Framer Motion for chrome, CSS-only for in-content elements
- Extra: Reading-progress bar via scroll listener
- Icons: lucide-react
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #FFFFFF
  --surface: #F6F5F2
  --border: #DEDBD2
  --fg: #181614
  --muted: #847E71
  --accent: {{ACCENT_HEX}} (fallback #B0281C)
Typography:
  Display: "Tiempos Headline" — used for H1/H2, tight tracking
  Body: "Tiempos Text" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 0px
  Signature mechanic: a masthead running head fixed at top (issue number, section name), first paragraph after each H2 gets a 3-line drop cap
  Motion signature: ease-out 500ms crossfades between spreads

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #FFFFFF/90 with backdrop-blur(16px) after 40px scroll, transition 400ms ease-out 500ms crossfades between spreads.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Tiempos Headline, weight 700.
- Center/right links styled per the Magazine Grid type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #B0281C; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero / Featured Story
- Full-viewport, min-h-screen composition built around a masthead running head fixed at top (issue number, section name), first paragraph after each H2 gets a 3-line drop cap.
- H1 "{{HERO_HEADLINE}}" set in Tiempos Headline, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease-out 500ms crossfades between spreads.
- Sub-headline "{{VALUE_PROP}}" in Tiempos Text, max-w-xl, color #847E71.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #B0281C) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Magazine Grid palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #F6F5F2 until onLoad fires.

### 3. Section Grid
- Grid of {{ITEM_1..6}} (sections), 0px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Framer Motion for chrome.

### 4. Latest Archive
- Reverse-chronological list of {{ARTICLE_1..12}} with date, category tag, and read-time; infinite scroll or pagination depending on {{ARTICLE_COUNT}}.

### 5. Newsletter CTA
- Inline email capture, inline validation below the field, #B0281C text at 13px, aria-live="polite" on error; success state replaces the form with a confirmation message, no page reload.

### 6. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #DEDBD2, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for media if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #F6F5F2 with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #B0281C, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built digital media / news publication product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 794 — High-Fashion Editorial — Digital Media / News Publication

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a digital media / news publication ({{PRODUCT_CATEGORY}}). Art direction: high-fashion editorial — full-bleed monochrome photography, oversized condensed type, extreme minimalism. Production-ready, 100% responsive.

## TECH STACK
- Framework: Astro 4 with islands (React only where interactivity is required)
- Styling: Tailwind CSS v4
- Animation: GSAP + ScrollTrigger, vanilla JS islands
- Extra: View Transitions API for page-to-page motion
- Icons: Lucide (astro-icon)
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #111111
  --surface: #000000
  --border: #2E2E2E
  --fg: #F5F5F5
  --muted: #9A9A9A
  --accent: {{ACCENT_HEX}} (fallback #FFFFFF)
Typography:
  Display: "PP Neue Montreal Condensed" — used for H1/H2, tight tracking
  Body: "PP Neue Montreal" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 0px
  Signature mechanic: full-viewport image bleeds with condensed vertical wordmark rotated -90deg pinned to the edge
  Motion signature: ease 900ms, slow deliberate crossfades — never fast

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #111111/90 with backdrop-blur(16px) after 40px scroll, transition 400ms ease 900ms.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in PP Neue Montreal Condensed, weight 700.
- Center/right links styled per the High-Fashion Editorial type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #FFFFFF; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero / Featured Story
- Full-viewport, min-h-screen composition built around full-viewport image bleeds with condensed vertical wordmark rotated -90deg pinned to the edge.
- H1 "{{HERO_HEADLINE}}" set in PP Neue Montreal Condensed, clamp(2.75rem, 7vw, 6rem); entrance timed to ease 900ms, slow deliberate crossfades — never fast.
- Sub-headline "{{VALUE_PROP}}" in PP Neue Montreal, max-w-xl, color #9A9A9A.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #FFFFFF) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the High-Fashion Editorial palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #000000 until onLoad fires.

### 3. Section Grid
- Grid of {{ITEM_1..6}} (sections), 0px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, GSAP.

### 4. Latest Archive
- Reverse-chronological list of {{ARTICLE_1..12}} with date, category tag, and read-time; infinite scroll or pagination depending on {{ARTICLE_COUNT}}.

### 5. Newsletter CTA
- Inline email capture, inline validation below the field, #FFFFFF text at 13px, aria-live="polite" on error; success state replaces the form with a confirmation message, no page reload.

### 6. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #2E2E2E, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for media if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #000000 with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #FFFFFF, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built digital media / news publication product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 795 — Architectural Blueprint — Digital Media / News Publication

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a digital media / news publication ({{PRODUCT_CATEGORY}}). Art direction: architectural blueprint — technical drawing aesthetic, thin precise lines, dimension annotations, cool blue-grey. Production-ready, 100% responsive.

## TECH STACK
- Framework: 11ty (static-first) with Nunjucks templates
- Styling: Tailwind CSS v4 (CLI build, no JS framework runtime)
- Animation: Alpine.js for micro-interactions + CSS scroll-driven animations (animation-timeline: view())
- Extra: Zero client JS framework — ships an HTML/CSS-first page with progressive enhancement
- Icons: inline SVG sprite
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #F5F6F7
  --surface: #FFFFFF
  --border: #C7CCD1
  --fg: #1B2126
  --muted: #6E7981
  --accent: {{ACCENT_HEX}} (fallback #1B4B91)
Typography:
  Display: "Neue Haas Unica" — used for H1/H2, tight tracking
  Body: "Neue Haas Unica" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 0px
  Signature mechanic: SVG dimension lines with arrow endpoints and measurement labels annotate key layout sections, as in a blueprint
  Texture layer: faint blueprint grid at 4%, pointer-events-none, aria-hidden
  Motion signature: ease 300ms, draws lines via stroke-dashoffset animation

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #F5F6F7/90 with backdrop-blur(16px) after 40px scroll, transition 400ms ease 300ms.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Neue Haas Unica, weight 700.
- Center/right links styled per the Architectural Blueprint type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #1B4B91; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero / Featured Story
- Full-viewport, min-h-screen composition built around SVG dimension lines with arrow endpoints and measurement labels annotate key layout sections, as in a blueprint.
- H1 "{{HERO_HEADLINE}}" set in Neue Haas Unica, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease 300ms, draws lines via stroke-dashoffset animation.
- Sub-headline "{{VALUE_PROP}}" in Neue Haas Unica, max-w-xl, color #6E7981.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #1B4B91) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Architectural Blueprint palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #FFFFFF until onLoad fires.

### 3. Section Grid
- Grid of {{ITEM_1..6}} (sections), 0px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Alpine.js for micro-interactions.

### 4. Latest Archive
- Reverse-chronological list of {{ARTICLE_1..12}} with date, category tag, and read-time; infinite scroll or pagination depending on {{ARTICLE_COUNT}}.

### 5. Newsletter CTA
- Inline email capture, inline validation below the field, #1B4B91 text at 13px, aria-live="polite" on error; success state replaces the form with a confirmation message, no page reload.

### 6. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #C7CCD1, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for media if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #FFFFFF with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #1B4B91, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built digital media / news publication product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 796 — Experimental Typography — Digital Media / News Publication

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a digital media / news publication ({{PRODUCT_CATEGORY}}). Art direction: experimental typography — type as the primary graphic device — variable font weight/width driven by scroll or cursor. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router) with MDX for long-form content routes
- Styling: Tailwind CSS v4 typography plugin, tuned to the design system tokens
- Animation: Framer Motion for chrome, CSS-only for in-content elements
- Extra: Reading-progress bar via scroll listener
- Icons: lucide-react
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #111014
  --surface: #1A1820
  --border: #312E3B
  --fg: #F1EEF7
  --muted: #948FA3
  --accent: {{ACCENT_HEX}} (fallback #E8FF59)
Typography:
  Display: "Variable custom (wght/wdth axes)" — used for H1/H2, tight tracking
  Body: "Suisse Int'l" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 0px
  Signature mechanic: headline font-variation-settings 'wght' and 'wdth' interpolate live with scroll velocity and cursor proximity per character
  Motion signature: scroll-linked variable-font-variation-settings interpolation

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #111014/90 with backdrop-blur(16px) after 40px scroll, transition 400ms scroll-linked variable-font-variation-settings interpolation.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Variable custom (wght/wdth axes), weight 700.
- Center/right links styled per the Experimental Typography type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #E8FF59; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero / Featured Story
- Full-viewport, min-h-screen composition built around headline font-variation-settings 'wght' and 'wdth' interpolate live with scroll velocity and cursor proximity per character.
- H1 "{{HERO_HEADLINE}}" set in Variable custom (wght/wdth axes), clamp(2.75rem, 7vw, 5.5rem); entrance timed to scroll-linked variable-font-variation-settings interpolation.
- Sub-headline "{{VALUE_PROP}}" in Suisse Int'l, max-w-xl, color #948FA3.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #E8FF59) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Experimental Typography palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #1A1820 until onLoad fires.

### 3. Section Grid
- Grid of {{ITEM_1..6}} (sections), 0px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Framer Motion for chrome.

### 4. Latest Archive
- Reverse-chronological list of {{ARTICLE_1..12}} with date, category tag, and read-time; infinite scroll or pagination depending on {{ARTICLE_COUNT}}.

### 5. Newsletter CTA
- Inline email capture, inline validation below the field, #E8FF59 text at 13px, aria-live="polite" on error; success state replaces the form with a confirmation message, no page reload.

### 6. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #312E3B, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for media if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #1A1820 with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #E8FF59, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built digital media / news publication product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 797 — Data-Dense Analytics — Digital Media / News Publication

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a digital media / news publication ({{PRODUCT_CATEGORY}}). Art direction: data-dense analytics — tight information density, small multiples, sparkline-everything, muted chart palette. Production-ready, 100% responsive.

## TECH STACK
- Framework: Astro 4 with islands (React only where interactivity is required)
- Styling: Tailwind CSS v4
- Animation: GSAP + ScrollTrigger, vanilla JS islands
- Extra: View Transitions API for page-to-page motion
- Icons: Lucide (astro-icon)
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #0E1116
  --surface: #161A21
  --border: #262C36
  --fg: #DEE3EA
  --muted: #7E8896
  --accent: {{ACCENT_HEX}} (fallback #4C9AFF)
  Secondary accents (ambient/illustrative use only, never as the primary CTA color): #F5A623
Typography:
  Display: "Inter Tight" — used for H1/H2, tight tracking
  Body: "Inter" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 10px
  Signature mechanic: a grid of small-multiple sparkline cards, each with a live-updating value and a 30-day trend line drawn in SVG
  Motion signature: ease 180ms, chart transitions via d3 interpolate

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #0E1116/90 with backdrop-blur(16px) after 40px scroll, transition 400ms ease 180ms.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Inter Tight, weight 700.
- Center/right links styled per the Data-Dense Analytics type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #4C9AFF; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero / Featured Story
- Full-viewport, min-h-screen composition built around a grid of small-multiple sparkline cards, each with a live-updating value and a 30-day trend line drawn in SVG.
- H1 "{{HERO_HEADLINE}}" set in Inter Tight, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease 180ms, chart transitions via d3 interpolate.
- Sub-headline "{{VALUE_PROP}}" in Inter, max-w-xl, color #7E8896.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #4C9AFF) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Data-Dense Analytics palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #161A21 until onLoad fires.

### 3. Section Grid
- Grid of {{ITEM_1..6}} (sections), 10px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, GSAP.

### 4. Latest Archive
- Reverse-chronological list of {{ARTICLE_1..12}} with date, category tag, and read-time; infinite scroll or pagination depending on {{ARTICLE_COUNT}}.

### 5. Newsletter CTA
- Inline email capture, inline validation below the field, #4C9AFF text at 13px, aria-live="polite" on error; success state replaces the form with a confirmation message, no page reload.

### 6. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #262C36, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for media if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #161A21 with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #4C9AFF, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built digital media / news publication product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 798 — Corporate Premium Trust — Digital Media / News Publication

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a digital media / news publication ({{PRODUCT_CATEGORY}}). Art direction: corporate premium trust — navy and white, generous whitespace, restrained gold accent, institutional confidence. Production-ready, 100% responsive.

## TECH STACK
- Framework: 11ty (static-first) with Nunjucks templates
- Styling: Tailwind CSS v4 (CLI build, no JS framework runtime)
- Animation: Alpine.js for micro-interactions + CSS scroll-driven animations (animation-timeline: view())
- Extra: Zero client JS framework — ships an HTML/CSS-first page with progressive enhancement
- Icons: inline SVG sprite
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #FFFFFF
  --surface: #F5F7FA
  --border: #E1E6ED
  --fg: #0F1B2D
  --muted: #5B6B80
  --accent: {{ACCENT_HEX}} (fallback #0F3D6E)
  Secondary accents (ambient/illustrative use only, never as the primary CTA color): #C6A15B
Typography:
  Display: "Söhne" — used for H1/H2, tight tracking
  Body: "Söhne" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 10px
  Signature mechanic: a fixed trust-bar beneath the navbar listing certifications/regulator marks in small caps
  Motion signature: ease-out 350ms, no playful overshoot

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #FFFFFF/90 with backdrop-blur(16px) after 40px scroll, transition 400ms ease-out 350ms.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Söhne, weight 700.
- Center/right links styled per the Corporate Premium Trust type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #0F3D6E; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero / Featured Story
- Full-viewport, min-h-screen composition built around a fixed trust-bar beneath the navbar listing certifications/regulator marks in small caps.
- H1 "{{HERO_HEADLINE}}" set in Söhne, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease-out 350ms, no playful overshoot.
- Sub-headline "{{VALUE_PROP}}" in Söhne, max-w-xl, color #5B6B80.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #0F3D6E) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Corporate Premium Trust palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #F5F7FA until onLoad fires.

### 3. Section Grid
- Grid of {{ITEM_1..6}} (sections), 10px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Alpine.js for micro-interactions.

### 4. Latest Archive
- Reverse-chronological list of {{ARTICLE_1..12}} with date, category tag, and read-time; infinite scroll or pagination depending on {{ARTICLE_COUNT}}.

### 5. Newsletter CTA
- Inline email capture, inline validation below the field, #0F3D6E text at 13px, aria-live="polite" on error; success state replaces the form with a confirmation message, no page reload.

### 6. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #E1E6ED, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for media if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #F5F7FA with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #0F3D6E, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built digital media / news publication product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 799 — Playful Sophisticated — Digital Media / News Publication

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a digital media / news publication ({{PRODUCT_CATEGORY}}). Art direction: playful sophisticated — bold single accent on cream, hand-tuned micro-illustrations, confident restraint with warmth. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router) with MDX for long-form content routes
- Styling: Tailwind CSS v4 typography plugin, tuned to the design system tokens
- Animation: Framer Motion for chrome, CSS-only for in-content elements
- Extra: Reading-progress bar via scroll listener
- Icons: lucide-react
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #FFF8EF
  --surface: #FFFFFF
  --border: #F0E4D0
  --fg: #20180E
  --muted: #8C7F68
  --accent: {{ACCENT_HEX}} (fallback #FF5A36)
Typography:
  Display: "Fraunces (soft)" — used for H1/H2, tight tracking
  Body: "General Sans" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 18px
  Signature mechanic: small hand-drawn-style SVG accent marks (circles, arrows) that rotate/scale in as a section enters viewport
  Motion signature: spring(220,20), playful but never chaotic

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #FFF8EF/90 with backdrop-blur(16px) after 40px scroll, transition 400ms spring(220,20).
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Fraunces (soft), weight 700.
- Center/right links styled per the Playful Sophisticated type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #FF5A36; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero / Featured Story
- Full-viewport, min-h-screen composition built around small hand-drawn-style SVG accent marks (circles, arrows) that rotate/scale in as a section enters viewport.
- H1 "{{HERO_HEADLINE}}" set in Fraunces (soft), clamp(2.75rem, 7vw, 5.5rem); entrance timed to spring(220,20), playful but never chaotic.
- Sub-headline "{{VALUE_PROP}}" in General Sans, max-w-xl, color #8C7F68.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #FF5A36) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Playful Sophisticated palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #FFFFFF until onLoad fires.

### 3. Section Grid
- Grid of {{ITEM_1..6}} (sections), 18px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Framer Motion for chrome.

### 4. Latest Archive
- Reverse-chronological list of {{ARTICLE_1..12}} with date, category tag, and read-time; infinite scroll or pagination depending on {{ARTICLE_COUNT}}.

### 5. Newsletter CTA
- Inline email capture, inline validation below the field, #FF5A36 text at 13px, aria-live="polite" on error; success state replaces the form with a confirmation message, no page reload.

### 6. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #F0E4D0, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for media if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #FFFFFF with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #FF5A36, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built digital media / news publication product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 800 — Organic Earth — Digital Media / News Publication

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a digital media / news publication ({{PRODUCT_CATEGORY}}). Art direction: organic earth — clay, moss and sand tones, blob/curve shapes, natural texture, calm pacing. Production-ready, 100% responsive.

## TECH STACK
- Framework: Astro 4 with islands (React only where interactivity is required)
- Styling: Tailwind CSS v4
- Animation: GSAP + ScrollTrigger, vanilla JS islands
- Extra: View Transitions API for page-to-page motion
- Icons: Lucide (astro-icon)
- Language: TypeScript, strict mode

## DESIGN SYSTEM
Colors (define as CSS custom properties):
  --bg: #F3EEE4
  --surface: #EAE2D0
  --border: #D8CBAE
  --fg: #2C2416
  --muted: #8A7F65
  --accent: {{ACCENT_HEX}} (fallback #5B6E4F)
Typography:
  Display: "Fraunces" — used for H1/H2, tight tracking
  Body: "Newsreader" — leading 1.5-1.65
  Scale: h1 clamp(2.5rem, 6vw, 5.5rem) / h2 clamp(1.75rem, 4vw, 3rem) / body 16-17px
Layout:
  Grid: 12 columns, max-width 1440px, side padding 20px mobile / 48px desktop
  Radius system: 40% organic blob clip-paths on media
  Signature mechanic: organic blob-shaped SVG clip-paths frame every image, morphing slightly on scroll (clip-path interpolation)
  Texture layer: subtle paper texture at 5%, pointer-events-none, aria-hidden
  Motion signature: ease-in-out 700ms, slow drift

## SECTIONS

### 1. Navbar
- Fixed, height 72px, background transparent -> #F3EEE4/90 with backdrop-blur(16px) after 40px scroll, transition 400ms ease-in-out 700ms.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Fraunces, weight 700.
- Center/right links styled per the Organic Earth type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #5B6E4F; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero / Featured Story
- Full-viewport, min-h-screen composition built around organic blob-shaped SVG clip-paths frame every image, morphing slightly on scroll (clip-path interpolation).
- H1 "{{HERO_HEADLINE}}" set in Fraunces, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease-in-out 700ms, slow drift.
- Sub-headline "{{VALUE_PROP}}" in Newsreader, max-w-xl, color #8A7F65.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #5B6E4F) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Organic Earth palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #EAE2D0 until onLoad fires.

### 3. Section Grid
- Grid of {{ITEM_1..6}} (sections), 40% organic blob clip-paths on media media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, GSAP.

### 4. Latest Archive
- Reverse-chronological list of {{ARTICLE_1..12}} with date, category tag, and read-time; infinite scroll or pagination depending on {{ARTICLE_COUNT}}.

### 5. Newsletter CTA
- Inline email capture, inline validation below the field, #5B6E4F text at 13px, aria-live="polite" on error; success state replaces the form with a confirmation message, no page reload.

### 6. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #D8CBAE, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for media if applicable ({{ENTITY_LEGAL}}).

## STATES & EDGE CASES (mandatory)
- Loading: skeletons in #EAE2D0 with a 1.4s shimmer sweep. Never a bare spinner as the only feedback.
- Empty: any list that can be empty renders a centered muted label with a single text-level action, never blank space.
- Error: user-facing copy only, never a stack trace; include a retry action that re-invokes the failed operation.
- Form validation: inline, below the field, accent-colored text at 13px, errors announced via aria-live="polite"; submit disables and shows a pending label while in flight.
- 404 and 500 routes exist and match the design system exactly.

## PERFORMANCE
- Fonts loaded via the framework's native font pipeline, display: swap, preload the display weight only.
- All below-fold images lazy-loaded with explicit width/height (or aspect-ratio) to prevent layout shift.
- Any video: autoplay/loop/muted/playsinline, preload="metadata", poster frame required.
- will-change applied only to actively animating elements and removed on completion.
- Respect prefers-reduced-motion: disable ambient/scroll-scrub motion, replace entrances with an instant opacity fade.
- Target LCP < 2.2s, CLS < 0.05.

## ACCESSIBILITY
- Semantic landmarks (nav, main, section with aria-label, footer); heading order never skips a level.
- Focus-visible outline 2px #5B6E4F, offset 2px, on every interactive element — never outline: none without a replacement.
- Full keyboard operability: anything triggered by hover must also respond to focus.
- Minimum contrast 4.5:1 for body text, 3:1 for large display type.
- Decorative overlays are pointer-events-none and aria-hidden.

## STRICT RULES
- No `any` in TypeScript, no non-null assertions.
- No generic startup-template layout — this must read as a purpose-built digital media / news publication product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```

