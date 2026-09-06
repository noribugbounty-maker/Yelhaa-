# Yelhaa Generated Prompt Templates 0901–1000

TEMPLATE 901 — Swiss Brutalist Monochrome — Marketing Automation Platform

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a marketing automation platform ({{PRODUCT_CATEGORY}}). Art direction: swiss brutalist monochrome — raw grid discipline, oversized type as the only ornament, zero decorative imagery. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router), React Server Components where possible
- Styling: Tailwind CSS v4 with @theme in globals.css
- Animation: Framer Motion (layout + scroll) + GSAP ScrollTrigger for pinned sequences
- Extra: Lenis for smooth scroll (lerp 0.07)
- Icons: Lucide React
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

### 3. Logo Cloud / Social Proof
- Row of client/partner marks rendered from {{CLIENT_LOGOS}}, grayscale at rest -> full color on hover, 300ms.
- If {{CLIENT_LOGOS}} is empty, remove the section entirely -- never insert a recognizable brand that was not supplied.
- Proof stat strip from {{PROOF_STAT_1..4}} in tabular-nums, CountUp on viewport entry (once); absent stats render a qualitative caption with no numerals.

### 4. Product Surface (Live Mock UI)
- STANDARD PATH [REQUIRES: none]: a fully live mock UI relevant to marketing automation platform -- built in Next.js 15 state, not a static image. Two or three values update on a 3-4s interval (cleared on unmount) so the surface reads as a working product.
- Frame styled per the Swiss Brutalist Monochrome system: full-bleed horizontal marquee statement + numbered editorial list rows.
- ENHANCED PATH [REQUIRES: 1+ screenshot]: {{HERO_ASSET}} or {{SCREEN_1}} replaces the mock inside the identical frame, same loading/skeleton/error handling.
- SEQUENCE PATH [REQUIRES: 3+ screenshots]: {{SCREEN_1..5}} presented as a pinned, scroll-scrubbed sequence via Framer Motion (layout + scroll).

### 5. Workflow / How It Works
- Three to five numbered steps, each with a label, one-line description, and a small live indicator (not decorative iconography alone).
- Steps connected by a 1px rule (#DEDEDA) whose stroke-dashoffset draws in as the section scrolls into view.
- Active step highlighted via IntersectionObserver / viewport hook as the user scrolls, accent #0B0B0B applied to the active index.

### 6. Integrations
- Grid of integration marks (from {{INTEGRATION_LOGOS}}) inside max 2px, mostly 0 tiles with a 1px #DEDEDA border; hover reveals a one-line description via a 160ms fade.
- Section collapses to a simple text list if fewer than 4 integrations are supplied -- never a sparse grid with empty tiles.

### 7. Pricing
- Tiers from {{PRICING_TIERS}}, price in tabular-nums, Neue Haas Grotesk Display weight 700; monthly/annual toggle slides a 1px indicator (layoutId) between labels.
- Price swap animates: outgoing y -16/opacity 0, incoming y 16->0, power4.out / cubic-bezier(0.16,1,0.3,1), no linear.
- Recommended tier distinguished by an inversion or accent border, never a floating badge with invented superlatives.

### 8. CTA
- Full-width closing section, background #0B0B0B, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Neue Haas Grotesk Text, label style.

### 9. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #DEDEDA, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for saas if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built marketing automation platform product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 902 — Aurora Glassmorphism — Marketing Automation Platform

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a marketing automation platform ({{PRODUCT_CATEGORY}}). Art direction: aurora glassmorphism — deep space backdrop, drifting light fields, frosted translucent surfaces. Production-ready, 100% responsive.

## TECH STACK
- Framework: React 18 + TypeScript via Vite
- Styling: Tailwind CSS
- Animation: Motion One (lightweight WAAPI-backed) for entrances, native CSS for ambient loops
- Extra: React Router only if multi-route
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

### 3. Logo Cloud / Social Proof
- Row of client/partner marks rendered from {{CLIENT_LOGOS}}, grayscale at rest -> full color on hover, 300ms.
- If {{CLIENT_LOGOS}} is empty, remove the section entirely -- never insert a recognizable brand that was not supplied.
- Proof stat strip from {{PROOF_STAT_1..4}} in tabular-nums, CountUp on viewport entry (once); absent stats render a qualitative caption with no numerals.

### 4. Product Surface (Live Mock UI)
- STANDARD PATH [REQUIRES: none]: a fully live mock UI relevant to marketing automation platform -- built in React 18 + TypeScript via Vite state, not a static image. Two or three values update on a 3-4s interval (cleared on unmount) so the surface reads as a working product.
- Frame styled per the Aurora Glassmorphism system: three desynced radial-gradient blobs + backdrop-blur(24px) glass recipe reused everywhere.
- ENHANCED PATH [REQUIRES: 1+ screenshot]: {{HERO_ASSET}} or {{SCREEN_1}} replaces the mock inside the identical frame, same loading/skeleton/error handling.
- SEQUENCE PATH [REQUIRES: 3+ screenshots]: {{SCREEN_1..5}} presented as a pinned, scroll-scrubbed sequence via Motion One (lightweight WAAPI-backed) for entrances.

### 5. Workflow / How It Works
- Three to five numbered steps, each with a label, one-line description, and a small live indicator (not decorative iconography alone).
- Steps connected by a 1px rule (rgba(255,255,255,0.09)) whose stroke-dashoffset draws in as the section scrolls into view.
- Active step highlighted via IntersectionObserver / viewport hook as the user scrolls, accent #6E56F8 applied to the active index.

### 6. Integrations
- Grid of integration marks (from {{INTEGRATION_LOGOS}}) inside 20px on glass surfaces tiles with a 1px rgba(255,255,255,0.09) border; hover reveals a one-line description via a 160ms fade.
- Section collapses to a simple text list if fewer than 4 integrations are supplied -- never a sparse grid with empty tiles.

### 7. Pricing
- Tiers from {{PRICING_TIERS}}, price in tabular-nums, General Sans weight 700; monthly/annual toggle slides a 1px indicator (layoutId) between labels.
- Price swap animates: outgoing y -16/opacity 0, incoming y 16->0, [0.16,1,0.3,1], slow ambient CSS keyframe loops.
- Recommended tier distinguished by an inversion or accent border, never a floating badge with invented superlatives.

### 8. CTA
- Full-width closing section, background #05060B, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Inter, label style.

### 9. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at rgba(255,255,255,0.09), copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for saas if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built marketing automation platform product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 903 — Neo-Brutalist Pop — Marketing Automation Platform

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a marketing automation platform ({{PRODUCT_CATEGORY}}). Art direction: neo-brutalist pop — thick black outlines, flat saturated blocks, deliberately raw hard shadows, no gradients. Production-ready, 100% responsive.

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

### 2. Hero
- Full-viewport, min-h-screen composition built around hard offset shadow (8px 8px 0 #111) that flattens to 0 0 0 on press, thick 3px borders on every block.
- H1 "{{HERO_HEADLINE}}" set in Archivo Black, clamp(2.75rem, 7vw, 5.5rem); entrance timed to steps() and abrupt cubic-bezier(0.68,-0.55,0.27,1.55) overshoot.
- Sub-headline "{{VALUE_PROP}}" in Archivo, max-w-xl, color #5B564E.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #FF4D2E) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Neo-Brutalist Pop palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #FFFFFF until onLoad fires.

### 3. Logo Cloud / Social Proof
- Row of client/partner marks rendered from {{CLIENT_LOGOS}}, grayscale at rest -> full color on hover, 300ms.
- If {{CLIENT_LOGOS}} is empty, remove the section entirely -- never insert a recognizable brand that was not supplied.
- Proof stat strip from {{PROOF_STAT_1..4}} in tabular-nums, CountUp on viewport entry (once); absent stats render a qualitative caption with no numerals.

### 4. Product Surface (Live Mock UI)
- STANDARD PATH [REQUIRES: none]: a fully live mock UI relevant to marketing automation platform -- built in Next.js 15 state, not a static image. Two or three values update on a 3-4s interval (cleared on unmount) so the surface reads as a working product.
- Frame styled per the Neo-Brutalist Pop system: hard offset shadow (8px 8px 0 #111) that flattens to 0 0 0 on press, thick 3px borders on every block.
- ENHANCED PATH [REQUIRES: 1+ screenshot]: {{HERO_ASSET}} or {{SCREEN_1}} replaces the mock inside the identical frame, same loading/skeleton/error handling.
- SEQUENCE PATH [REQUIRES: 3+ screenshots]: {{SCREEN_1..5}} presented as a pinned, scroll-scrubbed sequence via Framer Motion.

### 5. Workflow / How It Works
- Three to five numbered steps, each with a label, one-line description, and a small live indicator (not decorative iconography alone).
- Steps connected by a 1px rule (#111111) whose stroke-dashoffset draws in as the section scrolls into view.
- Active step highlighted via IntersectionObserver / viewport hook as the user scrolls, accent #FF4D2E applied to the active index.

### 6. Integrations
- Grid of integration marks (from {{INTEGRATION_LOGOS}}) inside 0px everywhere tiles with a 1px #111111 border; hover reveals a one-line description via a 160ms fade.
- Section collapses to a simple text list if fewer than 4 integrations are supplied -- never a sparse grid with empty tiles.

### 7. Pricing
- Tiers from {{PRICING_TIERS}}, price in tabular-nums, Archivo Black weight 700; monthly/annual toggle slides a 1px indicator (layoutId) between labels.
- Price swap animates: outgoing y -16/opacity 0, incoming y 16->0, steps() and abrupt cubic-bezier(0.68,-0.55,0.27,1.55) overshoot.
- Recommended tier distinguished by an inversion or accent border, never a floating badge with invented superlatives.

### 8. CTA
- Full-width closing section, background #FDF6EC, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Archivo, label style.

### 9. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #111111, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for saas if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built marketing automation platform product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 904 — Editorial Serif Luxury — Marketing Automation Platform

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a marketing automation platform ({{PRODUCT_CATEGORY}}). Art direction: editorial serif luxury — magazine-grade serif display type, generous margins, restrained color, photography-led. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router), React Server Components where possible
- Styling: Tailwind CSS v4 with @theme in globals.css
- Animation: Framer Motion (layout + scroll) + GSAP ScrollTrigger for pinned sequences
- Extra: Lenis for smooth scroll (lerp 0.07)
- Icons: Lucide React
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

### 3. Logo Cloud / Social Proof
- Row of client/partner marks rendered from {{CLIENT_LOGOS}}, grayscale at rest -> full color on hover, 300ms.
- If {{CLIENT_LOGOS}} is empty, remove the section entirely -- never insert a recognizable brand that was not supplied.
- Proof stat strip from {{PROOF_STAT_1..4}} in tabular-nums, CountUp on viewport entry (once); absent stats render a qualitative caption with no numerals.

### 4. Product Surface (Live Mock UI)
- STANDARD PATH [REQUIRES: none]: a fully live mock UI relevant to marketing automation platform -- built in Next.js 15 state, not a static image. Two or three values update on a 3-4s interval (cleared on unmount) so the surface reads as a working product.
- Frame styled per the Editorial Serif Luxury system: asymmetric editorial grid with pull-quotes and a running folio/issue number.
- ENHANCED PATH [REQUIRES: 1+ screenshot]: {{HERO_ASSET}} or {{SCREEN_1}} replaces the mock inside the identical frame, same loading/skeleton/error handling.
- SEQUENCE PATH [REQUIRES: 3+ screenshots]: {{SCREEN_1..5}} presented as a pinned, scroll-scrubbed sequence via Framer Motion (layout + scroll).

### 5. Workflow / How It Works
- Three to five numbered steps, each with a label, one-line description, and a small live indicator (not decorative iconography alone).
- Steps connected by a 1px rule (#E3DCD0) whose stroke-dashoffset draws in as the section scrolls into view.
- Active step highlighted via IntersectionObserver / viewport hook as the user scrolls, accent #7A2E2E applied to the active index.

### 6. Integrations
- Grid of integration marks (from {{INTEGRATION_LOGOS}}) inside 0px, hairline rules instead tiles with a 1px #E3DCD0 border; hover reveals a one-line description via a 160ms fade.
- Section collapses to a simple text list if fewer than 4 integrations are supplied -- never a sparse grid with empty tiles.

### 7. Pricing
- Tiers from {{PRICING_TIERS}}, price in tabular-nums, Canela / GT Sectra weight 700; monthly/annual toggle slides a 1px indicator (layoutId) between labels.
- Price swap animates: outgoing y -16/opacity 0, incoming y 16->0, ease-out, 600-900ms, understated crossfades.
- Recommended tier distinguished by an inversion or accent border, never a floating badge with invented superlatives.

### 8. CTA
- Full-width closing section, background #FBF9F6, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Söhne, label style.

### 9. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #E3DCD0, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for saas if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built marketing automation platform product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 905 — Dark Technical Console — Marketing Automation Platform

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a marketing automation platform ({{PRODUCT_CATEGORY}}). Art direction: dark technical console — near-black canvas, monospace accents, data-dense panels, engineering credibility. Production-ready, 100% responsive.

## TECH STACK
- Framework: React 18 + TypeScript via Vite
- Styling: Tailwind CSS
- Animation: Motion One (lightweight WAAPI-backed) for entrances, native CSS for ambient loops
- Extra: React Router only if multi-route
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

### 3. Logo Cloud / Social Proof
- Row of client/partner marks rendered from {{CLIENT_LOGOS}}, grayscale at rest -> full color on hover, 300ms.
- If {{CLIENT_LOGOS}} is empty, remove the section entirely -- never insert a recognizable brand that was not supplied.
- Proof stat strip from {{PROOF_STAT_1..4}} in tabular-nums, CountUp on viewport entry (once); absent stats render a qualitative caption with no numerals.

### 4. Product Surface (Live Mock UI)
- STANDARD PATH [REQUIRES: none]: a fully live mock UI relevant to marketing automation platform -- built in React 18 + TypeScript via Vite state, not a static image. Two or three values update on a 3-4s interval (cleared on unmount) so the surface reads as a working product.
- Frame styled per the Dark Technical Console system: live-updating metric tiles with tabular-nums CountUp and a terminal-style command block.
- ENHANCED PATH [REQUIRES: 1+ screenshot]: {{HERO_ASSET}} or {{SCREEN_1}} replaces the mock inside the identical frame, same loading/skeleton/error handling.
- SEQUENCE PATH [REQUIRES: 3+ screenshots]: {{SCREEN_1..5}} presented as a pinned, scroll-scrubbed sequence via Motion One (lightweight WAAPI-backed) for entrances.

### 5. Workflow / How It Works
- Three to five numbered steps, each with a label, one-line description, and a small live indicator (not decorative iconography alone).
- Steps connected by a 1px rule (#22262E) whose stroke-dashoffset draws in as the section scrolls into view.
- Active step highlighted via IntersectionObserver / viewport hook as the user scrolls, accent #5EEAD4 applied to the active index.

### 6. Integrations
- Grid of integration marks (from {{INTEGRATION_LOGOS}}) inside 8px tiles with a 1px #22262E border; hover reveals a one-line description via a 160ms fade.
- Section collapses to a simple text list if fewer than 4 integrations are supplied -- never a sparse grid with empty tiles.

### 7. Pricing
- Tiers from {{PRICING_TIERS}}, price in tabular-nums, Inter Tight weight 700; monthly/annual toggle slides a 1px indicator (layoutId) between labels.
- Price swap animates: outgoing y -16/opacity 0, incoming y 16->0, 150-250ms ease, no bounce.
- Recommended tier distinguished by an inversion or accent border, never a floating badge with invented superlatives.

### 8. CTA
- Full-width closing section, background #0A0C10, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Inter, label style.

### 9. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #22262E, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for saas if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built marketing automation platform product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 906 — Cyberpunk Neon — Marketing Automation Platform

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a marketing automation platform ({{PRODUCT_CATEGORY}}). Art direction: cyberpunk neon — black canvas, saturated magenta/cyan neon, glitch accents, dense HUD framing. Production-ready, 100% responsive.

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

### 2. Hero
- Full-viewport, min-h-screen composition built around scanline + chromatic-aberration text-shadow on the H1, HUD corner brackets on every panel.
- H1 "{{HERO_HEADLINE}}" set in Rajdhani, clamp(2.75rem, 7vw, 5.5rem); entrance timed to glitch keyframe (translate jitter 2px, 80ms) on hover only.
- Sub-headline "{{VALUE_PROP}}" in Space Grotesk, max-w-xl, color #8B8BA7.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #FF2E9A) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Cyberpunk Neon palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #0E0E16 until onLoad fires.

### 3. Logo Cloud / Social Proof
- Row of client/partner marks rendered from {{CLIENT_LOGOS}}, grayscale at rest -> full color on hover, 300ms.
- If {{CLIENT_LOGOS}} is empty, remove the section entirely -- never insert a recognizable brand that was not supplied.
- Proof stat strip from {{PROOF_STAT_1..4}} in tabular-nums, CountUp on viewport entry (once); absent stats render a qualitative caption with no numerals.

### 4. Product Surface (Live Mock UI)
- STANDARD PATH [REQUIRES: none]: a fully live mock UI relevant to marketing automation platform -- built in Next.js 15 state, not a static image. Two or three values update on a 3-4s interval (cleared on unmount) so the surface reads as a working product.
- Frame styled per the Cyberpunk Neon system: scanline + chromatic-aberration text-shadow on the H1, HUD corner brackets on every panel.
- ENHANCED PATH [REQUIRES: 1+ screenshot]: {{HERO_ASSET}} or {{SCREEN_1}} replaces the mock inside the identical frame, same loading/skeleton/error handling.
- SEQUENCE PATH [REQUIRES: 3+ screenshots]: {{SCREEN_1..5}} presented as a pinned, scroll-scrubbed sequence via Framer Motion.

### 5. Workflow / How It Works
- Three to five numbered steps, each with a label, one-line description, and a small live indicator (not decorative iconography alone).
- Steps connected by a 1px rule (#2A2A3D) whose stroke-dashoffset draws in as the section scrolls into view.
- Active step highlighted via IntersectionObserver / viewport hook as the user scrolls, accent #FF2E9A applied to the active index.

### 6. Integrations
- Grid of integration marks (from {{INTEGRATION_LOGOS}}) inside 2px, corner-clipped (clip-path) panels tiles with a 1px #2A2A3D border; hover reveals a one-line description via a 160ms fade.
- Section collapses to a simple text list if fewer than 4 integrations are supplied -- never a sparse grid with empty tiles.

### 7. Pricing
- Tiers from {{PRICING_TIERS}}, price in tabular-nums, Rajdhani weight 700; monthly/annual toggle slides a 1px indicator (layoutId) between labels.
- Price swap animates: outgoing y -16/opacity 0, incoming y 16->0, glitch keyframe (translate jitter 2px, 80ms) on hover only.
- Recommended tier distinguished by an inversion or accent border, never a floating badge with invented superlatives.

### 8. CTA
- Full-width closing section, background #050508, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Space Grotesk, label style.

### 9. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #2A2A3D, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for saas if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built marketing automation platform product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 907 — Industrial Utilitarian — Marketing Automation Platform

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a marketing automation platform ({{PRODUCT_CATEGORY}}). Art direction: industrial utilitarian — concrete and steel palette, exposed grid lines, stenciled labels, function over decoration. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router), React Server Components where possible
- Styling: Tailwind CSS v4 with @theme in globals.css
- Animation: Framer Motion (layout + scroll) + GSAP ScrollTrigger for pinned sequences
- Extra: Lenis for smooth scroll (lerp 0.07)
- Icons: Lucide React
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

### 3. Logo Cloud / Social Proof
- Row of client/partner marks rendered from {{CLIENT_LOGOS}}, grayscale at rest -> full color on hover, 300ms.
- If {{CLIENT_LOGOS}} is empty, remove the section entirely -- never insert a recognizable brand that was not supplied.
- Proof stat strip from {{PROOF_STAT_1..4}} in tabular-nums, CountUp on viewport entry (once); absent stats render a qualitative caption with no numerals.

### 4. Product Surface (Live Mock UI)
- STANDARD PATH [REQUIRES: none]: a fully live mock UI relevant to marketing automation platform -- built in Next.js 15 state, not a static image. Two or three values update on a 3-4s interval (cleared on unmount) so the surface reads as a working product.
- Frame styled per the Industrial Utilitarian system: visible grid lines (1px --border) drawn across the full viewport as a permanent underlay, stenciled uppercase section labels with dot-leaders.
- ENHANCED PATH [REQUIRES: 1+ screenshot]: {{HERO_ASSET}} or {{SCREEN_1}} replaces the mock inside the identical frame, same loading/skeleton/error handling.
- SEQUENCE PATH [REQUIRES: 3+ screenshots]: {{SCREEN_1..5}} presented as a pinned, scroll-scrubbed sequence via Framer Motion (layout + scroll).

### 5. Workflow / How It Works
- Three to five numbered steps, each with a label, one-line description, and a small live indicator (not decorative iconography alone).
- Steps connected by a 1px rule (#B7B4AA) whose stroke-dashoffset draws in as the section scrolls into view.
- Active step highlighted via IntersectionObserver / viewport hook as the user scrolls, accent #C9491C applied to the active index.

### 6. Integrations
- Grid of integration marks (from {{INTEGRATION_LOGOS}}) inside 0px tiles with a 1px #B7B4AA border; hover reveals a one-line description via a 160ms fade.
- Section collapses to a simple text list if fewer than 4 integrations are supplied -- never a sparse grid with empty tiles.

### 7. Pricing
- Tiers from {{PRICING_TIERS}}, price in tabular-nums, Suisse Int'l Mono weight 700; monthly/annual toggle slides a 1px indicator (layoutId) between labels.
- Price swap animates: outgoing y -16/opacity 0, incoming y 16->0, linear 200ms for mechanical feel on toggles only, ease-out elsewhere.
- Recommended tier distinguished by an inversion or accent border, never a floating badge with invented superlatives.

### 8. CTA
- Full-width closing section, background #EDECE8, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Suisse Int'l, label style.

### 9. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #B7B4AA, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for saas if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built marketing automation platform product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 908 — Futuristic Chrome — Marketing Automation Platform

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a marketing automation platform ({{PRODUCT_CATEGORY}}). Art direction: futuristic chrome — liquid chrome gradients, specular highlights, cool metallic palette, motion-first. Production-ready, 100% responsive.

## TECH STACK
- Framework: React 18 + TypeScript via Vite
- Styling: Tailwind CSS
- Animation: Motion One (lightweight WAAPI-backed) for entrances, native CSS for ambient loops
- Extra: React Router only if multi-route
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

### 3. Logo Cloud / Social Proof
- Row of client/partner marks rendered from {{CLIENT_LOGOS}}, grayscale at rest -> full color on hover, 300ms.
- If {{CLIENT_LOGOS}} is empty, remove the section entirely -- never insert a recognizable brand that was not supplied.
- Proof stat strip from {{PROOF_STAT_1..4}} in tabular-nums, CountUp on viewport entry (once); absent stats render a qualitative caption with no numerals.

### 4. Product Surface (Live Mock UI)
- STANDARD PATH [REQUIRES: none]: a fully live mock UI relevant to marketing automation platform -- built in React 18 + TypeScript via Vite state, not a static image. Two or three values update on a 3-4s interval (cleared on unmount) so the surface reads as a working product.
- Frame styled per the Futuristic Chrome system: specular chrome gradient sweeping across headline on scroll (background-position tied to scrollYProgress).
- ENHANCED PATH [REQUIRES: 1+ screenshot]: {{HERO_ASSET}} or {{SCREEN_1}} replaces the mock inside the identical frame, same loading/skeleton/error handling.
- SEQUENCE PATH [REQUIRES: 3+ screenshots]: {{SCREEN_1..5}} presented as a pinned, scroll-scrubbed sequence via Motion One (lightweight WAAPI-backed) for entrances.

### 5. Workflow / How It Works
- Three to five numbered steps, each with a label, one-line description, and a small live indicator (not decorative iconography alone).
- Steps connected by a 1px rule (#2B2F3A) whose stroke-dashoffset draws in as the section scrolls into view.
- Active step highlighted via IntersectionObserver / viewport hook as the user scrolls, accent #7DD3FC applied to the active index.

### 6. Integrations
- Grid of integration marks (from {{INTEGRATION_LOGOS}}) inside 28px, pill-shaped controls tiles with a 1px #2B2F3A border; hover reveals a one-line description via a 160ms fade.
- Section collapses to a simple text list if fewer than 4 integrations are supplied -- never a sparse grid with empty tiles.

### 7. Pricing
- Tiers from {{PRICING_TIERS}}, price in tabular-nums, Space Grotesk weight 700; monthly/annual toggle slides a 1px indicator (layoutId) between labels.
- Price swap animates: outgoing y -16/opacity 0, incoming y 16->0, spring(stiffness 220, damping 26) via Framer Motion.
- Recommended tier distinguished by an inversion or accent border, never a floating badge with invented superlatives.

### 8. CTA
- Full-width closing section, background #0B0D12, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Inter, label style.

### 9. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #2B2F3A, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for saas if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built marketing automation platform product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 909 — Soft Minimal Warmth — Marketing Automation Platform

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a marketing automation platform ({{PRODUCT_CATEGORY}}). Art direction: soft minimal warmth — warm off-white, generous air, soft shadows, rounded forms, low-contrast restraint. Production-ready, 100% responsive.

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

### 2. Hero
- Full-viewport, min-h-screen composition built around soft double-layer drop shadow (0 1px 2px + 0 12px 24px at 6%) on every raised surface, no borders — light does the separating.
- H1 "{{HERO_HEADLINE}}" set in Fraunces, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease-out 400-600ms, gentle y:12→0 reveals.
- Sub-headline "{{VALUE_PROP}}" in Inter, max-w-xl, color #928C80.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #D97757) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Soft Minimal Warmth palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #FFFFFF until onLoad fires.

### 3. Logo Cloud / Social Proof
- Row of client/partner marks rendered from {{CLIENT_LOGOS}}, grayscale at rest -> full color on hover, 300ms.
- If {{CLIENT_LOGOS}} is empty, remove the section entirely -- never insert a recognizable brand that was not supplied.
- Proof stat strip from {{PROOF_STAT_1..4}} in tabular-nums, CountUp on viewport entry (once); absent stats render a qualitative caption with no numerals.

### 4. Product Surface (Live Mock UI)
- STANDARD PATH [REQUIRES: none]: a fully live mock UI relevant to marketing automation platform -- built in Next.js 15 state, not a static image. Two or three values update on a 3-4s interval (cleared on unmount) so the surface reads as a working product.
- Frame styled per the Soft Minimal Warmth system: soft double-layer drop shadow (0 1px 2px + 0 12px 24px at 6%) on every raised surface, no borders — light does the separating.
- ENHANCED PATH [REQUIRES: 1+ screenshot]: {{HERO_ASSET}} or {{SCREEN_1}} replaces the mock inside the identical frame, same loading/skeleton/error handling.
- SEQUENCE PATH [REQUIRES: 3+ screenshots]: {{SCREEN_1..5}} presented as a pinned, scroll-scrubbed sequence via Framer Motion.

### 5. Workflow / How It Works
- Three to five numbered steps, each with a label, one-line description, and a small live indicator (not decorative iconography alone).
- Steps connected by a 1px rule (#ECE6DC) whose stroke-dashoffset draws in as the section scrolls into view.
- Active step highlighted via IntersectionObserver / viewport hook as the user scrolls, accent #D97757 applied to the active index.

### 6. Integrations
- Grid of integration marks (from {{INTEGRATION_LOGOS}}) inside 24px tiles with a 1px #ECE6DC border; hover reveals a one-line description via a 160ms fade.
- Section collapses to a simple text list if fewer than 4 integrations are supplied -- never a sparse grid with empty tiles.

### 7. Pricing
- Tiers from {{PRICING_TIERS}}, price in tabular-nums, Fraunces weight 700; monthly/annual toggle slides a 1px indicator (layoutId) between labels.
- Price swap animates: outgoing y -16/opacity 0, incoming y 16->0, ease-out 400-600ms, gentle y:12→0 reveals.
- Recommended tier distinguished by an inversion or accent border, never a floating badge with invented superlatives.

### 8. CTA
- Full-width closing section, background #FAF7F2, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Inter, label style.

### 9. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #ECE6DC, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for saas if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built marketing automation platform product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 910 — Art Deco Revival — Marketing Automation Platform

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a marketing automation platform ({{PRODUCT_CATEGORY}}). Art direction: art deco revival — gold on deep emerald/black, geometric fan and sunburst motifs, symmetrical ornament. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router), React Server Components where possible
- Styling: Tailwind CSS v4 with @theme in globals.css
- Animation: Framer Motion (layout + scroll) + GSAP ScrollTrigger for pinned sequences
- Extra: Lenis for smooth scroll (lerp 0.07)
- Icons: Lucide React
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

### 3. Logo Cloud / Social Proof
- Row of client/partner marks rendered from {{CLIENT_LOGOS}}, grayscale at rest -> full color on hover, 300ms.
- If {{CLIENT_LOGOS}} is empty, remove the section entirely -- never insert a recognizable brand that was not supplied.
- Proof stat strip from {{PROOF_STAT_1..4}} in tabular-nums, CountUp on viewport entry (once); absent stats render a qualitative caption with no numerals.

### 4. Product Surface (Live Mock UI)
- STANDARD PATH [REQUIRES: none]: a fully live mock UI relevant to marketing automation platform -- built in Next.js 15 state, not a static image. Two or three values update on a 3-4s interval (cleared on unmount) so the surface reads as a working product.
- Frame styled per the Art Deco Revival system: repeating SVG sunburst/fan motif as section dividers, gold 1px double-rule borders.
- ENHANCED PATH [REQUIRES: 1+ screenshot]: {{HERO_ASSET}} or {{SCREEN_1}} replaces the mock inside the identical frame, same loading/skeleton/error handling.
- SEQUENCE PATH [REQUIRES: 3+ screenshots]: {{SCREEN_1..5}} presented as a pinned, scroll-scrubbed sequence via Framer Motion (layout + scroll).

### 5. Workflow / How It Works
- Three to five numbered steps, each with a label, one-line description, and a small live indicator (not decorative iconography alone).
- Steps connected by a 1px rule (#B8935A) whose stroke-dashoffset draws in as the section scrolls into view.
- Active step highlighted via IntersectionObserver / viewport hook as the user scrolls, accent #C9A96A applied to the active index.

### 6. Integrations
- Grid of integration marks (from {{INTEGRATION_LOGOS}}) inside 0px, chamfered corners via clip-path tiles with a 1px #B8935A border; hover reveals a one-line description via a 160ms fade.
- Section collapses to a simple text list if fewer than 4 integrations are supplied -- never a sparse grid with empty tiles.

### 7. Pricing
- Tiers from {{PRICING_TIERS}}, price in tabular-nums, Poiret One / Cinzel weight 700; monthly/annual toggle slides a 1px indicator (layoutId) between labels.
- Price swap animates: outgoing y -16/opacity 0, incoming y 16->0, ease-in-out 700ms, symmetrical mirrored reveals.
- Recommended tier distinguished by an inversion or accent border, never a floating badge with invented superlatives.

### 8. CTA
- Full-width closing section, background #0D1512, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Cormorant, label style.

### 9. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #B8935A, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for saas if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built marketing automation platform product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 911 — Japanese Minimal (Ma) — Marketing Automation Platform

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a marketing automation platform ({{PRODUCT_CATEGORY}}). Art direction: japanese minimal (ma) — extreme negative space, single accent stroke, vertical rhythm, quiet confidence. Production-ready, 100% responsive.

## TECH STACK
- Framework: React 18 + TypeScript via Vite
- Styling: Tailwind CSS
- Animation: Motion One (lightweight WAAPI-backed) for entrances, native CSS for ambient loops
- Extra: React Router only if multi-route
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

### 3. Logo Cloud / Social Proof
- Row of client/partner marks rendered from {{CLIENT_LOGOS}}, grayscale at rest -> full color on hover, 300ms.
- If {{CLIENT_LOGOS}} is empty, remove the section entirely -- never insert a recognizable brand that was not supplied.
- Proof stat strip from {{PROOF_STAT_1..4}} in tabular-nums, CountUp on viewport entry (once); absent stats render a qualitative caption with no numerals.

### 4. Product Surface (Live Mock UI)
- STANDARD PATH [REQUIRES: none]: a fully live mock UI relevant to marketing automation platform -- built in React 18 + TypeScript via Vite state, not a static image. Two or three values update on a 3-4s interval (cleared on unmount) so the surface reads as a working product.
- Frame styled per the Japanese Minimal (Ma) system: a single vertical hairline rule tracks scroll progress along the left margin; content occupies at most 60% of viewport width.
- ENHANCED PATH [REQUIRES: 1+ screenshot]: {{HERO_ASSET}} or {{SCREEN_1}} replaces the mock inside the identical frame, same loading/skeleton/error handling.
- SEQUENCE PATH [REQUIRES: 3+ screenshots]: {{SCREEN_1..5}} presented as a pinned, scroll-scrubbed sequence via Motion One (lightweight WAAPI-backed) for entrances.

### 5. Workflow / How It Works
- Three to five numbered steps, each with a label, one-line description, and a small live indicator (not decorative iconography alone).
- Steps connected by a 1px rule (#E2E0D8) whose stroke-dashoffset draws in as the section scrolls into view.
- Active step highlighted via IntersectionObserver / viewport hook as the user scrolls, accent #C1121F applied to the active index.

### 6. Integrations
- Grid of integration marks (from {{INTEGRATION_LOGOS}}) inside 0px tiles with a 1px #E2E0D8 border; hover reveals a one-line description via a 160ms fade.
- Section collapses to a simple text list if fewer than 4 integrations are supplied -- never a sparse grid with empty tiles.

### 7. Pricing
- Tiers from {{PRICING_TIERS}}, price in tabular-nums, Zen Old Mincho / Shippori Mincho weight 700; monthly/annual toggle slides a 1px indicator (layoutId) between labels.
- Price swap animates: outgoing y -16/opacity 0, incoming y 16->0, ease 800ms, single elements move — never groups at once.
- Recommended tier distinguished by an inversion or accent border, never a floating badge with invented superlatives.

### 8. CTA
- Full-width closing section, background #FCFCFA, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Noto Sans JP fallback / Inter, label style.

### 9. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #E2E0D8, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for saas if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built marketing automation platform product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 912 — Scandinavian Functional — Marketing Automation Platform

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a marketing automation platform ({{PRODUCT_CATEGORY}}). Art direction: scandinavian functional — light wood-neutral palette, clean sans type, function-led hierarchy, quiet confidence. Production-ready, 100% responsive.

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

### 2. Hero
- Full-viewport, min-h-screen composition built around consistent 8pt spacing scale exposed as visible rhythm between hairline-separated blocks.
- H1 "{{HERO_HEADLINE}}" set in Söhne, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease-out 300ms, no overshoot.
- Sub-headline "{{VALUE_PROP}}" in Söhne, max-w-xl, color #7D7A72.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #3E6259) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Scandinavian Functional palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #FFFFFF until onLoad fires.

### 3. Logo Cloud / Social Proof
- Row of client/partner marks rendered from {{CLIENT_LOGOS}}, grayscale at rest -> full color on hover, 300ms.
- If {{CLIENT_LOGOS}} is empty, remove the section entirely -- never insert a recognizable brand that was not supplied.
- Proof stat strip from {{PROOF_STAT_1..4}} in tabular-nums, CountUp on viewport entry (once); absent stats render a qualitative caption with no numerals.

### 4. Product Surface (Live Mock UI)
- STANDARD PATH [REQUIRES: none]: a fully live mock UI relevant to marketing automation platform -- built in Next.js 15 state, not a static image. Two or three values update on a 3-4s interval (cleared on unmount) so the surface reads as a working product.
- Frame styled per the Scandinavian Functional system: consistent 8pt spacing scale exposed as visible rhythm between hairline-separated blocks.
- ENHANCED PATH [REQUIRES: 1+ screenshot]: {{HERO_ASSET}} or {{SCREEN_1}} replaces the mock inside the identical frame, same loading/skeleton/error handling.
- SEQUENCE PATH [REQUIRES: 3+ screenshots]: {{SCREEN_1..5}} presented as a pinned, scroll-scrubbed sequence via Framer Motion.

### 5. Workflow / How It Works
- Three to five numbered steps, each with a label, one-line description, and a small live indicator (not decorative iconography alone).
- Steps connected by a 1px rule (#E4E0D8) whose stroke-dashoffset draws in as the section scrolls into view.
- Active step highlighted via IntersectionObserver / viewport hook as the user scrolls, accent #3E6259 applied to the active index.

### 6. Integrations
- Grid of integration marks (from {{INTEGRATION_LOGOS}}) inside 12px tiles with a 1px #E4E0D8 border; hover reveals a one-line description via a 160ms fade.
- Section collapses to a simple text list if fewer than 4 integrations are supplied -- never a sparse grid with empty tiles.

### 7. Pricing
- Tiers from {{PRICING_TIERS}}, price in tabular-nums, Söhne weight 700; monthly/annual toggle slides a 1px indicator (layoutId) between labels.
- Price swap animates: outgoing y -16/opacity 0, incoming y 16->0, ease-out 300ms, no overshoot.
- Recommended tier distinguished by an inversion or accent border, never a floating badge with invented superlatives.

### 8. CTA
- Full-width closing section, background #F7F5F2, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Söhne, label style.

### 9. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #E4E0D8, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for saas if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built marketing automation platform product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 913 — Retro-Futurist 80s — Marketing Automation Platform

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a marketing automation platform ({{PRODUCT_CATEGORY}}). Art direction: retro-futurist 80s — sunset gradient, chrome grid horizon, VHS scanlines, synthwave palette. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router), React Server Components where possible
- Styling: Tailwind CSS v4 with @theme in globals.css
- Animation: Framer Motion (layout + scroll) + GSAP ScrollTrigger for pinned sequences
- Extra: Lenis for smooth scroll (lerp 0.07)
- Icons: Lucide React
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

### 3. Logo Cloud / Social Proof
- Row of client/partner marks rendered from {{CLIENT_LOGOS}}, grayscale at rest -> full color on hover, 300ms.
- If {{CLIENT_LOGOS}} is empty, remove the section entirely -- never insert a recognizable brand that was not supplied.
- Proof stat strip from {{PROOF_STAT_1..4}} in tabular-nums, CountUp on viewport entry (once); absent stats render a qualitative caption with no numerals.

### 4. Product Surface (Live Mock UI)
- STANDARD PATH [REQUIRES: none]: a fully live mock UI relevant to marketing automation platform -- built in Next.js 15 state, not a static image. Two or three values update on a 3-4s interval (cleared on unmount) so the surface reads as a working product.
- Frame styled per the Retro-Futurist 80s system: perspective CSS grid horizon (transform: perspective(500px) rotateX(60deg)) receding beneath the hero, sun gradient circle behind it.
- ENHANCED PATH [REQUIRES: 1+ screenshot]: {{HERO_ASSET}} or {{SCREEN_1}} replaces the mock inside the identical frame, same loading/skeleton/error handling.
- SEQUENCE PATH [REQUIRES: 3+ screenshots]: {{SCREEN_1..5}} presented as a pinned, scroll-scrubbed sequence via Framer Motion (layout + scroll).

### 5. Workflow / How It Works
- Three to five numbered steps, each with a label, one-line description, and a small live indicator (not decorative iconography alone).
- Steps connected by a 1px rule (#4A2472) whose stroke-dashoffset draws in as the section scrolls into view.
- Active step highlighted via IntersectionObserver / viewport hook as the user scrolls, accent #FF6EC7 applied to the active index.

### 6. Integrations
- Grid of integration marks (from {{INTEGRATION_LOGOS}}) inside 4px tiles with a 1px #4A2472 border; hover reveals a one-line description via a 160ms fade.
- Section collapses to a simple text list if fewer than 4 integrations are supplied -- never a sparse grid with empty tiles.

### 7. Pricing
- Tiers from {{PRICING_TIERS}}, price in tabular-nums, Righteous weight 700; monthly/annual toggle slides a 1px indicator (layoutId) between labels.
- Price swap animates: outgoing y -16/opacity 0, incoming y 16->0, linear scanline drift 8s infinite, ease-out for content.
- Recommended tier distinguished by an inversion or accent border, never a floating badge with invented superlatives.

### 8. CTA
- Full-width closing section, background #1A0B2E, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Space Grotesk, label style.

### 9. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #4A2472, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for saas if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built marketing automation platform product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 914 — Y2K Cyber-Cute — Marketing Automation Platform

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a marketing automation platform ({{PRODUCT_CATEGORY}}). Art direction: y2k cyber-cute — chrome bubbles, gradient blobs, glossy buttons, playful maximal energy. Production-ready, 100% responsive.

## TECH STACK
- Framework: React 18 + TypeScript via Vite
- Styling: Tailwind CSS
- Animation: Motion One (lightweight WAAPI-backed) for entrances, native CSS for ambient loops
- Extra: React Router only if multi-route
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

### 3. Logo Cloud / Social Proof
- Row of client/partner marks rendered from {{CLIENT_LOGOS}}, grayscale at rest -> full color on hover, 300ms.
- If {{CLIENT_LOGOS}} is empty, remove the section entirely -- never insert a recognizable brand that was not supplied.
- Proof stat strip from {{PROOF_STAT_1..4}} in tabular-nums, CountUp on viewport entry (once); absent stats render a qualitative caption with no numerals.

### 4. Product Surface (Live Mock UI)
- STANDARD PATH [REQUIRES: none]: a fully live mock UI relevant to marketing automation platform -- built in React 18 + TypeScript via Vite state, not a static image. Two or three values update on a 3-4s interval (cleared on unmount) so the surface reads as a working product.
- Frame styled per the Y2K Cyber-Cute system: glossy specular-highlight gradient buttons (radial-gradient white 10% at top-left), floating blob shapes drifting on scroll parallax.
- ENHANCED PATH [REQUIRES: 1+ screenshot]: {{HERO_ASSET}} or {{SCREEN_1}} replaces the mock inside the identical frame, same loading/skeleton/error handling.
- SEQUENCE PATH [REQUIRES: 3+ screenshots]: {{SCREEN_1..5}} presented as a pinned, scroll-scrubbed sequence via Motion One (lightweight WAAPI-backed) for entrances.

### 5. Workflow / How It Works
- Three to five numbered steps, each with a label, one-line description, and a small live indicator (not decorative iconography alone).
- Steps connected by a 1px rule (#C7DBFF) whose stroke-dashoffset draws in as the section scrolls into view.
- Active step highlighted via IntersectionObserver / viewport hook as the user scrolls, accent #7C5CFF applied to the active index.

### 6. Integrations
- Grid of integration marks (from {{INTEGRATION_LOGOS}}) inside 9999px on buttons, 32px on cards tiles with a 1px #C7DBFF border; hover reveals a one-line description via a 160ms fade.
- Section collapses to a simple text list if fewer than 4 integrations are supplied -- never a sparse grid with empty tiles.

### 7. Pricing
- Tiers from {{PRICING_TIERS}}, price in tabular-nums, Chakra Petch weight 700; monthly/annual toggle slides a 1px indicator (layoutId) between labels.
- Price swap animates: outgoing y -16/opacity 0, incoming y 16->0, spring bounce (stiffness 300, damping 18).
- Recommended tier distinguished by an inversion or accent border, never a floating badge with invented superlatives.

### 8. CTA
- Full-width closing section, background #EAF2FF, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Poppins, label style.

### 9. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #C7DBFF, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for saas if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built marketing automation platform product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 915 — Digital Laboratory — Marketing Automation Platform

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a marketing automation platform ({{PRODUCT_CATEGORY}}). Art direction: digital laboratory — clinical white/blue, precise data grids, diagrammatic annotation lines. Production-ready, 100% responsive.

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

### 2. Hero
- Full-viewport, min-h-screen composition built around annotation leader-lines (SVG) connecting labels to UI elements, like a lab specimen diagram.
- H1 "{{HERO_HEADLINE}}" set in IBM Plex Sans, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease 200ms, precise not playful.
- Sub-headline "{{VALUE_PROP}}" in IBM Plex Sans, max-w-xl, color #667085.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #2E6FF2) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Digital Laboratory palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #F4F7FB until onLoad fires.

### 3. Logo Cloud / Social Proof
- Row of client/partner marks rendered from {{CLIENT_LOGOS}}, grayscale at rest -> full color on hover, 300ms.
- If {{CLIENT_LOGOS}} is empty, remove the section entirely -- never insert a recognizable brand that was not supplied.
- Proof stat strip from {{PROOF_STAT_1..4}} in tabular-nums, CountUp on viewport entry (once); absent stats render a qualitative caption with no numerals.

### 4. Product Surface (Live Mock UI)
- STANDARD PATH [REQUIRES: none]: a fully live mock UI relevant to marketing automation platform -- built in Next.js 15 state, not a static image. Two or three values update on a 3-4s interval (cleared on unmount) so the surface reads as a working product.
- Frame styled per the Digital Laboratory system: annotation leader-lines (SVG) connecting labels to UI elements, like a lab specimen diagram.
- ENHANCED PATH [REQUIRES: 1+ screenshot]: {{HERO_ASSET}} or {{SCREEN_1}} replaces the mock inside the identical frame, same loading/skeleton/error handling.
- SEQUENCE PATH [REQUIRES: 3+ screenshots]: {{SCREEN_1..5}} presented as a pinned, scroll-scrubbed sequence via Framer Motion.

### 5. Workflow / How It Works
- Three to five numbered steps, each with a label, one-line description, and a small live indicator (not decorative iconography alone).
- Steps connected by a 1px rule (#D7E1EE) whose stroke-dashoffset draws in as the section scrolls into view.
- Active step highlighted via IntersectionObserver / viewport hook as the user scrolls, accent #2E6FF2 applied to the active index.

### 6. Integrations
- Grid of integration marks (from {{INTEGRATION_LOGOS}}) inside 6px tiles with a 1px #D7E1EE border; hover reveals a one-line description via a 160ms fade.
- Section collapses to a simple text list if fewer than 4 integrations are supplied -- never a sparse grid with empty tiles.

### 7. Pricing
- Tiers from {{PRICING_TIERS}}, price in tabular-nums, IBM Plex Sans weight 700; monthly/annual toggle slides a 1px indicator (layoutId) between labels.
- Price swap animates: outgoing y -16/opacity 0, incoming y 16->0, ease 200ms, precise not playful.
- Recommended tier distinguished by an inversion or accent border, never a floating badge with invented superlatives.

### 8. CTA
- Full-width closing section, background #101828, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in IBM Plex Sans, label style.

### 9. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #D7E1EE, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for saas if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built marketing automation platform product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 916 — Terminal-Inspired CLI — Marketing Automation Platform

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a marketing automation platform ({{PRODUCT_CATEGORY}}). Art direction: terminal-inspired cli — pure monospace, green/amber phosphor accent on black, blinking cursor motifs. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router), React Server Components where possible
- Styling: Tailwind CSS v4 with @theme in globals.css
- Animation: Framer Motion (layout + scroll) + GSAP ScrollTrigger for pinned sequences
- Extra: Lenis for smooth scroll (lerp 0.07)
- Icons: Lucide React
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

### 3. Logo Cloud / Social Proof
- Row of client/partner marks rendered from {{CLIENT_LOGOS}}, grayscale at rest -> full color on hover, 300ms.
- If {{CLIENT_LOGOS}} is empty, remove the section entirely -- never insert a recognizable brand that was not supplied.
- Proof stat strip from {{PROOF_STAT_1..4}} in tabular-nums, CountUp on viewport entry (once); absent stats render a qualitative caption with no numerals.

### 4. Product Surface (Live Mock UI)
- STANDARD PATH [REQUIRES: none]: a fully live mock UI relevant to marketing automation platform -- built in Next.js 15 state, not a static image. Two or three values update on a 3-4s interval (cleared on unmount) so the surface reads as a working product.
- Frame styled per the Terminal-Inspired CLI system: hero headline types itself out character-by-character with a blinking block cursor; every panel has a fake terminal titlebar with 3 dots.
- ENHANCED PATH [REQUIRES: 1+ screenshot]: {{HERO_ASSET}} or {{SCREEN_1}} replaces the mock inside the identical frame, same loading/skeleton/error handling.
- SEQUENCE PATH [REQUIRES: 3+ screenshots]: {{SCREEN_1..5}} presented as a pinned, scroll-scrubbed sequence via Framer Motion (layout + scroll).

### 5. Workflow / How It Works
- Three to five numbered steps, each with a label, one-line description, and a small live indicator (not decorative iconography alone).
- Steps connected by a 1px rule (#1F261F) whose stroke-dashoffset draws in as the section scrolls into view.
- Active step highlighted via IntersectionObserver / viewport hook as the user scrolls, accent #39FF14 applied to the active index.

### 6. Integrations
- Grid of integration marks (from {{INTEGRATION_LOGOS}}) inside 0px tiles with a 1px #1F261F border; hover reveals a one-line description via a 160ms fade.
- Section collapses to a simple text list if fewer than 4 integrations are supplied -- never a sparse grid with empty tiles.

### 7. Pricing
- Tiers from {{PRICING_TIERS}}, price in tabular-nums, JetBrains Mono weight 700; monthly/annual toggle slides a 1px indicator (layoutId) between labels.
- Price swap animates: outgoing y -16/opacity 0, incoming y 16->0, typewriter reveal, step-end steps(n).
- Recommended tier distinguished by an inversion or accent border, never a floating badge with invented superlatives.

### 8. CTA
- Full-width closing section, background #080A08, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in JetBrains Mono, label style.

### 9. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #1F261F, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for saas if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built marketing automation platform product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 917 — Financial Terminal Dense — Marketing Automation Platform

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a marketing automation platform ({{PRODUCT_CATEGORY}}). Art direction: financial terminal dense — black/near-black, tabular-nums everywhere, ticker rows, high information density. Production-ready, 100% responsive.

## TECH STACK
- Framework: React 18 + TypeScript via Vite
- Styling: Tailwind CSS
- Animation: Motion One (lightweight WAAPI-backed) for entrances, native CSS for ambient loops
- Extra: React Router only if multi-route
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

### 3. Logo Cloud / Social Proof
- Row of client/partner marks rendered from {{CLIENT_LOGOS}}, grayscale at rest -> full color on hover, 300ms.
- If {{CLIENT_LOGOS}} is empty, remove the section entirely -- never insert a recognizable brand that was not supplied.
- Proof stat strip from {{PROOF_STAT_1..4}} in tabular-nums, CountUp on viewport entry (once); absent stats render a qualitative caption with no numerals.

### 4. Product Surface (Live Mock UI)
- STANDARD PATH [REQUIRES: none]: a fully live mock UI relevant to marketing automation platform -- built in React 18 + TypeScript via Vite state, not a static image. Two or three values update on a 3-4s interval (cleared on unmount) so the surface reads as a working product.
- Frame styled per the Financial Terminal Dense system: a live scrolling ticker row (marquee) of tabular-nums values that flash green/red on change, dense multi-column data tables.
- ENHANCED PATH [REQUIRES: 1+ screenshot]: {{HERO_ASSET}} or {{SCREEN_1}} replaces the mock inside the identical frame, same loading/skeleton/error handling.
- SEQUENCE PATH [REQUIRES: 3+ screenshots]: {{SCREEN_1..5}} presented as a pinned, scroll-scrubbed sequence via Motion One (lightweight WAAPI-backed) for entrances.

### 5. Workflow / How It Works
- Three to five numbered steps, each with a label, one-line description, and a small live indicator (not decorative iconography alone).
- Steps connected by a 1px rule (#1E231E) whose stroke-dashoffset draws in as the section scrolls into view.
- Active step highlighted via IntersectionObserver / viewport hook as the user scrolls, accent #00C853 applied to the active index.

### 6. Integrations
- Grid of integration marks (from {{INTEGRATION_LOGOS}}) inside 2px tiles with a 1px #1E231E border; hover reveals a one-line description via a 160ms fade.
- Section collapses to a simple text list if fewer than 4 integrations are supplied -- never a sparse grid with empty tiles.

### 7. Pricing
- Tiers from {{PRICING_TIERS}}, price in tabular-nums, IBM Plex Mono weight 700; monthly/annual toggle slides a 1px indicator (layoutId) between labels.
- Price swap animates: outgoing y -16/opacity 0, incoming y 16->0, ease 150ms, numeric roll via CountUp only.
- Recommended tier distinguished by an inversion or accent border, never a floating badge with invented superlatives.

### 8. CTA
- Full-width closing section, background #000000, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in IBM Plex Sans, label style.

### 9. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #1E231E, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for saas if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built marketing automation platform product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 918 — Magazine Grid — Marketing Automation Platform

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a marketing automation platform ({{PRODUCT_CATEGORY}}). Art direction: magazine grid — multi-column editorial grid, drop caps, running heads, varied image sizes. Production-ready, 100% responsive.

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

### 2. Hero
- Full-viewport, min-h-screen composition built around a masthead running head fixed at top (issue number, section name), first paragraph after each H2 gets a 3-line drop cap.
- H1 "{{HERO_HEADLINE}}" set in Tiempos Headline, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease-out 500ms crossfades between spreads.
- Sub-headline "{{VALUE_PROP}}" in Tiempos Text, max-w-xl, color #847E71.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #B0281C) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Magazine Grid palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #F6F5F2 until onLoad fires.

### 3. Logo Cloud / Social Proof
- Row of client/partner marks rendered from {{CLIENT_LOGOS}}, grayscale at rest -> full color on hover, 300ms.
- If {{CLIENT_LOGOS}} is empty, remove the section entirely -- never insert a recognizable brand that was not supplied.
- Proof stat strip from {{PROOF_STAT_1..4}} in tabular-nums, CountUp on viewport entry (once); absent stats render a qualitative caption with no numerals.

### 4. Product Surface (Live Mock UI)
- STANDARD PATH [REQUIRES: none]: a fully live mock UI relevant to marketing automation platform -- built in Next.js 15 state, not a static image. Two or three values update on a 3-4s interval (cleared on unmount) so the surface reads as a working product.
- Frame styled per the Magazine Grid system: a masthead running head fixed at top (issue number, section name), first paragraph after each H2 gets a 3-line drop cap.
- ENHANCED PATH [REQUIRES: 1+ screenshot]: {{HERO_ASSET}} or {{SCREEN_1}} replaces the mock inside the identical frame, same loading/skeleton/error handling.
- SEQUENCE PATH [REQUIRES: 3+ screenshots]: {{SCREEN_1..5}} presented as a pinned, scroll-scrubbed sequence via Framer Motion.

### 5. Workflow / How It Works
- Three to five numbered steps, each with a label, one-line description, and a small live indicator (not decorative iconography alone).
- Steps connected by a 1px rule (#DEDBD2) whose stroke-dashoffset draws in as the section scrolls into view.
- Active step highlighted via IntersectionObserver / viewport hook as the user scrolls, accent #B0281C applied to the active index.

### 6. Integrations
- Grid of integration marks (from {{INTEGRATION_LOGOS}}) inside 0px tiles with a 1px #DEDBD2 border; hover reveals a one-line description via a 160ms fade.
- Section collapses to a simple text list if fewer than 4 integrations are supplied -- never a sparse grid with empty tiles.

### 7. Pricing
- Tiers from {{PRICING_TIERS}}, price in tabular-nums, Tiempos Headline weight 700; monthly/annual toggle slides a 1px indicator (layoutId) between labels.
- Price swap animates: outgoing y -16/opacity 0, incoming y 16->0, ease-out 500ms crossfades between spreads.
- Recommended tier distinguished by an inversion or accent border, never a floating badge with invented superlatives.

### 8. CTA
- Full-width closing section, background #181614, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Tiempos Text, label style.

### 9. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #DEDBD2, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for saas if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built marketing automation platform product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 919 — High-Fashion Editorial — Marketing Automation Platform

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a marketing automation platform ({{PRODUCT_CATEGORY}}). Art direction: high-fashion editorial — full-bleed monochrome photography, oversized condensed type, extreme minimalism. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router), React Server Components where possible
- Styling: Tailwind CSS v4 with @theme in globals.css
- Animation: Framer Motion (layout + scroll) + GSAP ScrollTrigger for pinned sequences
- Extra: Lenis for smooth scroll (lerp 0.07)
- Icons: Lucide React
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

### 3. Logo Cloud / Social Proof
- Row of client/partner marks rendered from {{CLIENT_LOGOS}}, grayscale at rest -> full color on hover, 300ms.
- If {{CLIENT_LOGOS}} is empty, remove the section entirely -- never insert a recognizable brand that was not supplied.
- Proof stat strip from {{PROOF_STAT_1..4}} in tabular-nums, CountUp on viewport entry (once); absent stats render a qualitative caption with no numerals.

### 4. Product Surface (Live Mock UI)
- STANDARD PATH [REQUIRES: none]: a fully live mock UI relevant to marketing automation platform -- built in Next.js 15 state, not a static image. Two or three values update on a 3-4s interval (cleared on unmount) so the surface reads as a working product.
- Frame styled per the High-Fashion Editorial system: full-viewport image bleeds with condensed vertical wordmark rotated -90deg pinned to the edge.
- ENHANCED PATH [REQUIRES: 1+ screenshot]: {{HERO_ASSET}} or {{SCREEN_1}} replaces the mock inside the identical frame, same loading/skeleton/error handling.
- SEQUENCE PATH [REQUIRES: 3+ screenshots]: {{SCREEN_1..5}} presented as a pinned, scroll-scrubbed sequence via Framer Motion (layout + scroll).

### 5. Workflow / How It Works
- Three to five numbered steps, each with a label, one-line description, and a small live indicator (not decorative iconography alone).
- Steps connected by a 1px rule (#2E2E2E) whose stroke-dashoffset draws in as the section scrolls into view.
- Active step highlighted via IntersectionObserver / viewport hook as the user scrolls, accent #FFFFFF applied to the active index.

### 6. Integrations
- Grid of integration marks (from {{INTEGRATION_LOGOS}}) inside 0px tiles with a 1px #2E2E2E border; hover reveals a one-line description via a 160ms fade.
- Section collapses to a simple text list if fewer than 4 integrations are supplied -- never a sparse grid with empty tiles.

### 7. Pricing
- Tiers from {{PRICING_TIERS}}, price in tabular-nums, PP Neue Montreal Condensed weight 700; monthly/annual toggle slides a 1px indicator (layoutId) between labels.
- Price swap animates: outgoing y -16/opacity 0, incoming y 16->0, ease 900ms, slow deliberate crossfades — never fast.
- Recommended tier distinguished by an inversion or accent border, never a floating badge with invented superlatives.

### 8. CTA
- Full-width closing section, background #111111, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in PP Neue Montreal, label style.

### 9. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #2E2E2E, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for saas if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built marketing automation platform product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 920 — Architectural Blueprint — Marketing Automation Platform

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a marketing automation platform ({{PRODUCT_CATEGORY}}). Art direction: architectural blueprint — technical drawing aesthetic, thin precise lines, dimension annotations, cool blue-grey. Production-ready, 100% responsive.

## TECH STACK
- Framework: React 18 + TypeScript via Vite
- Styling: Tailwind CSS
- Animation: Motion One (lightweight WAAPI-backed) for entrances, native CSS for ambient loops
- Extra: React Router only if multi-route
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

### 3. Logo Cloud / Social Proof
- Row of client/partner marks rendered from {{CLIENT_LOGOS}}, grayscale at rest -> full color on hover, 300ms.
- If {{CLIENT_LOGOS}} is empty, remove the section entirely -- never insert a recognizable brand that was not supplied.
- Proof stat strip from {{PROOF_STAT_1..4}} in tabular-nums, CountUp on viewport entry (once); absent stats render a qualitative caption with no numerals.

### 4. Product Surface (Live Mock UI)
- STANDARD PATH [REQUIRES: none]: a fully live mock UI relevant to marketing automation platform -- built in React 18 + TypeScript via Vite state, not a static image. Two or three values update on a 3-4s interval (cleared on unmount) so the surface reads as a working product.
- Frame styled per the Architectural Blueprint system: SVG dimension lines with arrow endpoints and measurement labels annotate key layout sections, as in a blueprint.
- ENHANCED PATH [REQUIRES: 1+ screenshot]: {{HERO_ASSET}} or {{SCREEN_1}} replaces the mock inside the identical frame, same loading/skeleton/error handling.
- SEQUENCE PATH [REQUIRES: 3+ screenshots]: {{SCREEN_1..5}} presented as a pinned, scroll-scrubbed sequence via Motion One (lightweight WAAPI-backed) for entrances.

### 5. Workflow / How It Works
- Three to five numbered steps, each with a label, one-line description, and a small live indicator (not decorative iconography alone).
- Steps connected by a 1px rule (#C7CCD1) whose stroke-dashoffset draws in as the section scrolls into view.
- Active step highlighted via IntersectionObserver / viewport hook as the user scrolls, accent #1B4B91 applied to the active index.

### 6. Integrations
- Grid of integration marks (from {{INTEGRATION_LOGOS}}) inside 0px tiles with a 1px #C7CCD1 border; hover reveals a one-line description via a 160ms fade.
- Section collapses to a simple text list if fewer than 4 integrations are supplied -- never a sparse grid with empty tiles.

### 7. Pricing
- Tiers from {{PRICING_TIERS}}, price in tabular-nums, Neue Haas Unica weight 700; monthly/annual toggle slides a 1px indicator (layoutId) between labels.
- Price swap animates: outgoing y -16/opacity 0, incoming y 16->0, ease 300ms, draws lines via stroke-dashoffset animation.
- Recommended tier distinguished by an inversion or accent border, never a floating badge with invented superlatives.

### 8. CTA
- Full-width closing section, background #F5F6F7, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Neue Haas Unica, label style.

### 9. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #C7CCD1, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for saas if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built marketing automation platform product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 921 — Experimental Typography — Marketing Automation Platform

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a marketing automation platform ({{PRODUCT_CATEGORY}}). Art direction: experimental typography — type as the primary graphic device — variable font weight/width driven by scroll or cursor. Production-ready, 100% responsive.

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

### 2. Hero
- Full-viewport, min-h-screen composition built around headline font-variation-settings 'wght' and 'wdth' interpolate live with scroll velocity and cursor proximity per character.
- H1 "{{HERO_HEADLINE}}" set in Variable custom (wght/wdth axes), clamp(2.75rem, 7vw, 5.5rem); entrance timed to scroll-linked variable-font-variation-settings interpolation.
- Sub-headline "{{VALUE_PROP}}" in Suisse Int'l, max-w-xl, color #948FA3.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #E8FF59) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Experimental Typography palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #1A1820 until onLoad fires.

### 3. Logo Cloud / Social Proof
- Row of client/partner marks rendered from {{CLIENT_LOGOS}}, grayscale at rest -> full color on hover, 300ms.
- If {{CLIENT_LOGOS}} is empty, remove the section entirely -- never insert a recognizable brand that was not supplied.
- Proof stat strip from {{PROOF_STAT_1..4}} in tabular-nums, CountUp on viewport entry (once); absent stats render a qualitative caption with no numerals.

### 4. Product Surface (Live Mock UI)
- STANDARD PATH [REQUIRES: none]: a fully live mock UI relevant to marketing automation platform -- built in Next.js 15 state, not a static image. Two or three values update on a 3-4s interval (cleared on unmount) so the surface reads as a working product.
- Frame styled per the Experimental Typography system: headline font-variation-settings 'wght' and 'wdth' interpolate live with scroll velocity and cursor proximity per character.
- ENHANCED PATH [REQUIRES: 1+ screenshot]: {{HERO_ASSET}} or {{SCREEN_1}} replaces the mock inside the identical frame, same loading/skeleton/error handling.
- SEQUENCE PATH [REQUIRES: 3+ screenshots]: {{SCREEN_1..5}} presented as a pinned, scroll-scrubbed sequence via Framer Motion.

### 5. Workflow / How It Works
- Three to five numbered steps, each with a label, one-line description, and a small live indicator (not decorative iconography alone).
- Steps connected by a 1px rule (#312E3B) whose stroke-dashoffset draws in as the section scrolls into view.
- Active step highlighted via IntersectionObserver / viewport hook as the user scrolls, accent #E8FF59 applied to the active index.

### 6. Integrations
- Grid of integration marks (from {{INTEGRATION_LOGOS}}) inside 0px tiles with a 1px #312E3B border; hover reveals a one-line description via a 160ms fade.
- Section collapses to a simple text list if fewer than 4 integrations are supplied -- never a sparse grid with empty tiles.

### 7. Pricing
- Tiers from {{PRICING_TIERS}}, price in tabular-nums, Variable custom (wght/wdth axes) weight 700; monthly/annual toggle slides a 1px indicator (layoutId) between labels.
- Price swap animates: outgoing y -16/opacity 0, incoming y 16->0, scroll-linked variable-font-variation-settings interpolation.
- Recommended tier distinguished by an inversion or accent border, never a floating badge with invented superlatives.

### 8. CTA
- Full-width closing section, background #111014, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Suisse Int'l, label style.

### 9. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #312E3B, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for saas if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built marketing automation platform product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 922 — Data-Dense Analytics — Marketing Automation Platform

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a marketing automation platform ({{PRODUCT_CATEGORY}}). Art direction: data-dense analytics — tight information density, small multiples, sparkline-everything, muted chart palette. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router), React Server Components where possible
- Styling: Tailwind CSS v4 with @theme in globals.css
- Animation: Framer Motion (layout + scroll) + GSAP ScrollTrigger for pinned sequences
- Extra: Lenis for smooth scroll (lerp 0.07)
- Icons: Lucide React
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

### 3. Logo Cloud / Social Proof
- Row of client/partner marks rendered from {{CLIENT_LOGOS}}, grayscale at rest -> full color on hover, 300ms.
- If {{CLIENT_LOGOS}} is empty, remove the section entirely -- never insert a recognizable brand that was not supplied.
- Proof stat strip from {{PROOF_STAT_1..4}} in tabular-nums, CountUp on viewport entry (once); absent stats render a qualitative caption with no numerals.

### 4. Product Surface (Live Mock UI)
- STANDARD PATH [REQUIRES: none]: a fully live mock UI relevant to marketing automation platform -- built in Next.js 15 state, not a static image. Two or three values update on a 3-4s interval (cleared on unmount) so the surface reads as a working product.
- Frame styled per the Data-Dense Analytics system: a grid of small-multiple sparkline cards, each with a live-updating value and a 30-day trend line drawn in SVG.
- ENHANCED PATH [REQUIRES: 1+ screenshot]: {{HERO_ASSET}} or {{SCREEN_1}} replaces the mock inside the identical frame, same loading/skeleton/error handling.
- SEQUENCE PATH [REQUIRES: 3+ screenshots]: {{SCREEN_1..5}} presented as a pinned, scroll-scrubbed sequence via Framer Motion (layout + scroll).

### 5. Workflow / How It Works
- Three to five numbered steps, each with a label, one-line description, and a small live indicator (not decorative iconography alone).
- Steps connected by a 1px rule (#262C36) whose stroke-dashoffset draws in as the section scrolls into view.
- Active step highlighted via IntersectionObserver / viewport hook as the user scrolls, accent #4C9AFF applied to the active index.

### 6. Integrations
- Grid of integration marks (from {{INTEGRATION_LOGOS}}) inside 10px tiles with a 1px #262C36 border; hover reveals a one-line description via a 160ms fade.
- Section collapses to a simple text list if fewer than 4 integrations are supplied -- never a sparse grid with empty tiles.

### 7. Pricing
- Tiers from {{PRICING_TIERS}}, price in tabular-nums, Inter Tight weight 700; monthly/annual toggle slides a 1px indicator (layoutId) between labels.
- Price swap animates: outgoing y -16/opacity 0, incoming y 16->0, ease 180ms, chart transitions via d3 interpolate.
- Recommended tier distinguished by an inversion or accent border, never a floating badge with invented superlatives.

### 8. CTA
- Full-width closing section, background #0E1116, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Inter, label style.

### 9. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #262C36, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for saas if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built marketing automation platform product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 923 — Corporate Premium Trust — Marketing Automation Platform

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a marketing automation platform ({{PRODUCT_CATEGORY}}). Art direction: corporate premium trust — navy and white, generous whitespace, restrained gold accent, institutional confidence. Production-ready, 100% responsive.

## TECH STACK
- Framework: React 18 + TypeScript via Vite
- Styling: Tailwind CSS
- Animation: Motion One (lightweight WAAPI-backed) for entrances, native CSS for ambient loops
- Extra: React Router only if multi-route
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

### 3. Logo Cloud / Social Proof
- Row of client/partner marks rendered from {{CLIENT_LOGOS}}, grayscale at rest -> full color on hover, 300ms.
- If {{CLIENT_LOGOS}} is empty, remove the section entirely -- never insert a recognizable brand that was not supplied.
- Proof stat strip from {{PROOF_STAT_1..4}} in tabular-nums, CountUp on viewport entry (once); absent stats render a qualitative caption with no numerals.

### 4. Product Surface (Live Mock UI)
- STANDARD PATH [REQUIRES: none]: a fully live mock UI relevant to marketing automation platform -- built in React 18 + TypeScript via Vite state, not a static image. Two or three values update on a 3-4s interval (cleared on unmount) so the surface reads as a working product.
- Frame styled per the Corporate Premium Trust system: a fixed trust-bar beneath the navbar listing certifications/regulator marks in small caps.
- ENHANCED PATH [REQUIRES: 1+ screenshot]: {{HERO_ASSET}} or {{SCREEN_1}} replaces the mock inside the identical frame, same loading/skeleton/error handling.
- SEQUENCE PATH [REQUIRES: 3+ screenshots]: {{SCREEN_1..5}} presented as a pinned, scroll-scrubbed sequence via Motion One (lightweight WAAPI-backed) for entrances.

### 5. Workflow / How It Works
- Three to five numbered steps, each with a label, one-line description, and a small live indicator (not decorative iconography alone).
- Steps connected by a 1px rule (#E1E6ED) whose stroke-dashoffset draws in as the section scrolls into view.
- Active step highlighted via IntersectionObserver / viewport hook as the user scrolls, accent #0F3D6E applied to the active index.

### 6. Integrations
- Grid of integration marks (from {{INTEGRATION_LOGOS}}) inside 10px tiles with a 1px #E1E6ED border; hover reveals a one-line description via a 160ms fade.
- Section collapses to a simple text list if fewer than 4 integrations are supplied -- never a sparse grid with empty tiles.

### 7. Pricing
- Tiers from {{PRICING_TIERS}}, price in tabular-nums, Söhne weight 700; monthly/annual toggle slides a 1px indicator (layoutId) between labels.
- Price swap animates: outgoing y -16/opacity 0, incoming y 16->0, ease-out 350ms, no playful overshoot.
- Recommended tier distinguished by an inversion or accent border, never a floating badge with invented superlatives.

### 8. CTA
- Full-width closing section, background #0F1B2D, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Söhne, label style.

### 9. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #E1E6ED, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for saas if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built marketing automation platform product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 924 — Playful Sophisticated — Marketing Automation Platform

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a marketing automation platform ({{PRODUCT_CATEGORY}}). Art direction: playful sophisticated — bold single accent on cream, hand-tuned micro-illustrations, confident restraint with warmth. Production-ready, 100% responsive.

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

### 2. Hero
- Full-viewport, min-h-screen composition built around small hand-drawn-style SVG accent marks (circles, arrows) that rotate/scale in as a section enters viewport.
- H1 "{{HERO_HEADLINE}}" set in Fraunces (soft), clamp(2.75rem, 7vw, 5.5rem); entrance timed to spring(220,20), playful but never chaotic.
- Sub-headline "{{VALUE_PROP}}" in General Sans, max-w-xl, color #8C7F68.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #FF5A36) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Playful Sophisticated palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #FFFFFF until onLoad fires.

### 3. Logo Cloud / Social Proof
- Row of client/partner marks rendered from {{CLIENT_LOGOS}}, grayscale at rest -> full color on hover, 300ms.
- If {{CLIENT_LOGOS}} is empty, remove the section entirely -- never insert a recognizable brand that was not supplied.
- Proof stat strip from {{PROOF_STAT_1..4}} in tabular-nums, CountUp on viewport entry (once); absent stats render a qualitative caption with no numerals.

### 4. Product Surface (Live Mock UI)
- STANDARD PATH [REQUIRES: none]: a fully live mock UI relevant to marketing automation platform -- built in Next.js 15 state, not a static image. Two or three values update on a 3-4s interval (cleared on unmount) so the surface reads as a working product.
- Frame styled per the Playful Sophisticated system: small hand-drawn-style SVG accent marks (circles, arrows) that rotate/scale in as a section enters viewport.
- ENHANCED PATH [REQUIRES: 1+ screenshot]: {{HERO_ASSET}} or {{SCREEN_1}} replaces the mock inside the identical frame, same loading/skeleton/error handling.
- SEQUENCE PATH [REQUIRES: 3+ screenshots]: {{SCREEN_1..5}} presented as a pinned, scroll-scrubbed sequence via Framer Motion.

### 5. Workflow / How It Works
- Three to five numbered steps, each with a label, one-line description, and a small live indicator (not decorative iconography alone).
- Steps connected by a 1px rule (#F0E4D0) whose stroke-dashoffset draws in as the section scrolls into view.
- Active step highlighted via IntersectionObserver / viewport hook as the user scrolls, accent #FF5A36 applied to the active index.

### 6. Integrations
- Grid of integration marks (from {{INTEGRATION_LOGOS}}) inside 18px tiles with a 1px #F0E4D0 border; hover reveals a one-line description via a 160ms fade.
- Section collapses to a simple text list if fewer than 4 integrations are supplied -- never a sparse grid with empty tiles.

### 7. Pricing
- Tiers from {{PRICING_TIERS}}, price in tabular-nums, Fraunces (soft) weight 700; monthly/annual toggle slides a 1px indicator (layoutId) between labels.
- Price swap animates: outgoing y -16/opacity 0, incoming y 16->0, spring(220,20), playful but never chaotic.
- Recommended tier distinguished by an inversion or accent border, never a floating badge with invented superlatives.

### 8. CTA
- Full-width closing section, background #FFF8EF, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in General Sans, label style.

### 9. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #F0E4D0, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for saas if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built marketing automation platform product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 925 — Organic Earth — Marketing Automation Platform

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a marketing automation platform ({{PRODUCT_CATEGORY}}). Art direction: organic earth — clay, moss and sand tones, blob/curve shapes, natural texture, calm pacing. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router), React Server Components where possible
- Styling: Tailwind CSS v4 with @theme in globals.css
- Animation: Framer Motion (layout + scroll) + GSAP ScrollTrigger for pinned sequences
- Extra: Lenis for smooth scroll (lerp 0.07)
- Icons: Lucide React
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

### 3. Logo Cloud / Social Proof
- Row of client/partner marks rendered from {{CLIENT_LOGOS}}, grayscale at rest -> full color on hover, 300ms.
- If {{CLIENT_LOGOS}} is empty, remove the section entirely -- never insert a recognizable brand that was not supplied.
- Proof stat strip from {{PROOF_STAT_1..4}} in tabular-nums, CountUp on viewport entry (once); absent stats render a qualitative caption with no numerals.

### 4. Product Surface (Live Mock UI)
- STANDARD PATH [REQUIRES: none]: a fully live mock UI relevant to marketing automation platform -- built in Next.js 15 state, not a static image. Two or three values update on a 3-4s interval (cleared on unmount) so the surface reads as a working product.
- Frame styled per the Organic Earth system: organic blob-shaped SVG clip-paths frame every image, morphing slightly on scroll (clip-path interpolation).
- ENHANCED PATH [REQUIRES: 1+ screenshot]: {{HERO_ASSET}} or {{SCREEN_1}} replaces the mock inside the identical frame, same loading/skeleton/error handling.
- SEQUENCE PATH [REQUIRES: 3+ screenshots]: {{SCREEN_1..5}} presented as a pinned, scroll-scrubbed sequence via Framer Motion (layout + scroll).

### 5. Workflow / How It Works
- Three to five numbered steps, each with a label, one-line description, and a small live indicator (not decorative iconography alone).
- Steps connected by a 1px rule (#D8CBAE) whose stroke-dashoffset draws in as the section scrolls into view.
- Active step highlighted via IntersectionObserver / viewport hook as the user scrolls, accent #5B6E4F applied to the active index.

### 6. Integrations
- Grid of integration marks (from {{INTEGRATION_LOGOS}}) inside 40% organic blob clip-paths on media tiles with a 1px #D8CBAE border; hover reveals a one-line description via a 160ms fade.
- Section collapses to a simple text list if fewer than 4 integrations are supplied -- never a sparse grid with empty tiles.

### 7. Pricing
- Tiers from {{PRICING_TIERS}}, price in tabular-nums, Fraunces weight 700; monthly/annual toggle slides a 1px indicator (layoutId) between labels.
- Price swap animates: outgoing y -16/opacity 0, incoming y 16->0, ease-in-out 700ms, slow drift.
- Recommended tier distinguished by an inversion or accent border, never a floating badge with invented superlatives.

### 8. CTA
- Full-width closing section, background #F3EEE4, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Newsreader, label style.

### 9. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #D8CBAE, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for saas if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built marketing automation platform product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 926 — Swiss Brutalist Monochrome — Developer Documentation Site For An Open-Source Library

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a developer documentation site for an open-source library ({{PRODUCT_CATEGORY}}). Art direction: swiss brutalist monochrome — raw grid discipline, oversized type as the only ornament, zero decorative imagery. Production-ready, 100% responsive.

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

### 1. Top Nav + Sidebar
- Fixed, height 72px, background transparent -> #FFFFFF/90 with backdrop-blur(16px) after 40px scroll, transition 400ms power4.out / cubic-bezier(0.16,1,0.3,1).
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Neue Haas Grotesk Display, weight 700.
- Center/right links styled per the Swiss Brutalist Monochrome type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #0B0B0B; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero / Quickstart
- Full-viewport, min-h-screen composition built around full-bleed horizontal marquee statement + numbered editorial list rows.
- H1 "{{HERO_HEADLINE}}" set in Neue Haas Grotesk Display, clamp(2.75rem, 7vw, 5.5rem); entrance timed to power4.out / cubic-bezier(0.16,1,0.3,1), no linear.
- Sub-headline "{{VALUE_PROP}}" in Neue Haas Grotesk Text, max-w-xl, color #7A7A78.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #0B0B0B) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Swiss Brutalist Monochrome palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #F2F2F0 until onLoad fires.

### 3. API Reference Grid
- Grid of {{ITEM_1..6}} (API sections), max 2px, mostly 0 media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, GSAP.

### 4. Code Examples
- Syntax-highlighted code blocks (Shiki or Prism) matching the Swiss Brutalist Monochrome palette; copy-to-clipboard button on every block, confirms with a 1.5s checkmark swap.
- Left sidebar table of contents with active-section highlighting via scroll-spy (IntersectionObserver).

### 5. Guides
- Content driven by {{ITEM_1..6}}; layout and motion follow the Swiss Brutalist Monochrome system (full-bleed horizontal marquee statement + numbered editorial list rows).

### 6. Changelog
- Reverse-chronological version list from {{CHANGELOG_ENTRIES}}, each tagged (feature/fix/breaking) with a colored dot, never invented entries.

### 7. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #DEDEDA, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for docs if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built developer documentation site for an open-source library product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 927 — Aurora Glassmorphism — Developer Documentation Site For An Open-Source Library

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a developer documentation site for an open-source library ({{PRODUCT_CATEGORY}}). Art direction: aurora glassmorphism — deep space backdrop, drifting light fields, frosted translucent surfaces. Production-ready, 100% responsive.

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

### 1. Top Nav + Sidebar
- Fixed, height 72px, background transparent -> #05060B/90 with backdrop-blur(16px) after 40px scroll, transition 400ms [0.16.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in General Sans, weight 700.
- Center/right links styled per the Aurora Glassmorphism type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #6E56F8; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero / Quickstart
- Full-viewport, min-h-screen composition built around three desynced radial-gradient blobs + backdrop-blur(24px) glass recipe reused everywhere.
- H1 "{{HERO_HEADLINE}}" set in General Sans, clamp(2.75rem, 7vw, 5.5rem); entrance timed to [0.16,1,0.3,1], slow ambient CSS keyframe loops.
- Sub-headline "{{VALUE_PROP}}" in Inter, max-w-xl, color #8A92A6.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #6E56F8) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Aurora Glassmorphism palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in rgba(255,255,255,0.04) until onLoad fires.

### 3. API Reference Grid
- Grid of {{ITEM_1..6}} (API sections), 20px on glass surfaces media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Alpine.js for micro-interactions.

### 4. Code Examples
- Syntax-highlighted code blocks (Shiki or Prism) matching the Aurora Glassmorphism palette; copy-to-clipboard button on every block, confirms with a 1.5s checkmark swap.
- Left sidebar table of contents with active-section highlighting via scroll-spy (IntersectionObserver).

### 5. Guides
- Content driven by {{ITEM_1..6}}; layout and motion follow the Aurora Glassmorphism system (three desynced radial-gradient blobs + backdrop-blur(24px) glass recipe reused everywhere).

### 6. Changelog
- Reverse-chronological version list from {{CHANGELOG_ENTRIES}}, each tagged (feature/fix/breaking) with a colored dot, never invented entries.

### 7. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at rgba(255,255,255,0.09), copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for docs if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built developer documentation site for an open-source library product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 928 — Neo-Brutalist Pop — Developer Documentation Site For An Open-Source Library

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a developer documentation site for an open-source library ({{PRODUCT_CATEGORY}}). Art direction: neo-brutalist pop — thick black outlines, flat saturated blocks, deliberately raw hard shadows, no gradients. Production-ready, 100% responsive.

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

### 1. Top Nav + Sidebar
- Fixed, height 72px, background transparent -> #FDF6EC/90 with backdrop-blur(16px) after 40px scroll, transition 400ms steps() and abrupt cubic-bezier(0.68,-0.55,0.27,1.55) overshoot.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Archivo Black, weight 700.
- Center/right links styled per the Neo-Brutalist Pop type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #FF4D2E; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero / Quickstart
- Full-viewport, min-h-screen composition built around hard offset shadow (8px 8px 0 #111) that flattens to 0 0 0 on press, thick 3px borders on every block.
- H1 "{{HERO_HEADLINE}}" set in Archivo Black, clamp(2.75rem, 7vw, 5.5rem); entrance timed to steps() and abrupt cubic-bezier(0.68,-0.55,0.27,1.55) overshoot.
- Sub-headline "{{VALUE_PROP}}" in Archivo, max-w-xl, color #5B564E.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #FF4D2E) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Neo-Brutalist Pop palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #FFFFFF until onLoad fires.

### 3. API Reference Grid
- Grid of {{ITEM_1..6}} (API sections), 0px everywhere media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Framer Motion for chrome.

### 4. Code Examples
- Syntax-highlighted code blocks (Shiki or Prism) matching the Neo-Brutalist Pop palette; copy-to-clipboard button on every block, confirms with a 1.5s checkmark swap.
- Left sidebar table of contents with active-section highlighting via scroll-spy (IntersectionObserver).

### 5. Guides
- Content driven by {{ITEM_1..6}}; layout and motion follow the Neo-Brutalist Pop system (hard offset shadow (8px 8px 0 #111) that flattens to 0 0 0 on press, thick 3px borders on every block).

### 6. Changelog
- Reverse-chronological version list from {{CHANGELOG_ENTRIES}}, each tagged (feature/fix/breaking) with a colored dot, never invented entries.

### 7. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #111111, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for docs if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built developer documentation site for an open-source library product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 929 — Editorial Serif Luxury — Developer Documentation Site For An Open-Source Library

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a developer documentation site for an open-source library ({{PRODUCT_CATEGORY}}). Art direction: editorial serif luxury — magazine-grade serif display type, generous margins, restrained color, photography-led. Production-ready, 100% responsive.

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

### 1. Top Nav + Sidebar
- Fixed, height 72px, background transparent -> #FBF9F6/90 with backdrop-blur(16px) after 40px scroll, transition 400ms ease-out.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Canela / GT Sectra, weight 700.
- Center/right links styled per the Editorial Serif Luxury type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #7A2E2E; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero / Quickstart
- Full-viewport, min-h-screen composition built around asymmetric editorial grid with pull-quotes and a running folio/issue number.
- H1 "{{HERO_HEADLINE}}" set in Canela / GT Sectra, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease-out, 600-900ms, understated crossfades.
- Sub-headline "{{VALUE_PROP}}" in Söhne, max-w-xl, color #8A8175.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #7A2E2E) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Editorial Serif Luxury palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #F1EDE6 until onLoad fires.

### 3. API Reference Grid
- Grid of {{ITEM_1..6}} (API sections), 0px, hairline rules instead media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, GSAP.

### 4. Code Examples
- Syntax-highlighted code blocks (Shiki or Prism) matching the Editorial Serif Luxury palette; copy-to-clipboard button on every block, confirms with a 1.5s checkmark swap.
- Left sidebar table of contents with active-section highlighting via scroll-spy (IntersectionObserver).

### 5. Guides
- Content driven by {{ITEM_1..6}}; layout and motion follow the Editorial Serif Luxury system (asymmetric editorial grid with pull-quotes and a running folio/issue number).

### 6. Changelog
- Reverse-chronological version list from {{CHANGELOG_ENTRIES}}, each tagged (feature/fix/breaking) with a colored dot, never invented entries.

### 7. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #E3DCD0, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for docs if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built developer documentation site for an open-source library product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 930 — Dark Technical Console — Developer Documentation Site For An Open-Source Library

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a developer documentation site for an open-source library ({{PRODUCT_CATEGORY}}). Art direction: dark technical console — near-black canvas, monospace accents, data-dense panels, engineering credibility. Production-ready, 100% responsive.

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

### 1. Top Nav + Sidebar
- Fixed, height 72px, background transparent -> #0A0C10/90 with backdrop-blur(16px) after 40px scroll, transition 400ms 150-250ms ease.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Inter Tight, weight 700.
- Center/right links styled per the Dark Technical Console type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #5EEAD4; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero / Quickstart
- Full-viewport, min-h-screen composition built around live-updating metric tiles with tabular-nums CountUp and a terminal-style command block.
- H1 "{{HERO_HEADLINE}}" set in Inter Tight, clamp(2.75rem, 7vw, 5.5rem); entrance timed to 150-250ms ease, no bounce.
- Sub-headline "{{VALUE_PROP}}" in Inter, max-w-xl, color #7C838F.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #5EEAD4) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Dark Technical Console palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #12151B until onLoad fires.

### 3. API Reference Grid
- Grid of {{ITEM_1..6}} (API sections), 8px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Alpine.js for micro-interactions.

### 4. Code Examples
- Syntax-highlighted code blocks (Shiki or Prism) matching the Dark Technical Console palette; copy-to-clipboard button on every block, confirms with a 1.5s checkmark swap.
- Left sidebar table of contents with active-section highlighting via scroll-spy (IntersectionObserver).

### 5. Guides
- Content driven by {{ITEM_1..6}}; layout and motion follow the Dark Technical Console system (live-updating metric tiles with tabular-nums CountUp and a terminal-style command block).

### 6. Changelog
- Reverse-chronological version list from {{CHANGELOG_ENTRIES}}, each tagged (feature/fix/breaking) with a colored dot, never invented entries.

### 7. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #22262E, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for docs if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built developer documentation site for an open-source library product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 931 — Cyberpunk Neon — Developer Documentation Site For An Open-Source Library

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a developer documentation site for an open-source library ({{PRODUCT_CATEGORY}}). Art direction: cyberpunk neon — black canvas, saturated magenta/cyan neon, glitch accents, dense HUD framing. Production-ready, 100% responsive.

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

### 1. Top Nav + Sidebar
- Fixed, height 72px, background transparent -> #050508/90 with backdrop-blur(16px) after 40px scroll, transition 400ms glitch keyframe (translate jitter 2px, 80ms) on hover only.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Rajdhani, weight 700.
- Center/right links styled per the Cyberpunk Neon type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #FF2E9A; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero / Quickstart
- Full-viewport, min-h-screen composition built around scanline + chromatic-aberration text-shadow on the H1, HUD corner brackets on every panel.
- H1 "{{HERO_HEADLINE}}" set in Rajdhani, clamp(2.75rem, 7vw, 5.5rem); entrance timed to glitch keyframe (translate jitter 2px, 80ms) on hover only.
- Sub-headline "{{VALUE_PROP}}" in Space Grotesk, max-w-xl, color #8B8BA7.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #FF2E9A) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Cyberpunk Neon palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #0E0E16 until onLoad fires.

### 3. API Reference Grid
- Grid of {{ITEM_1..6}} (API sections), 2px, corner-clipped (clip-path) panels media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Framer Motion for chrome.

### 4. Code Examples
- Syntax-highlighted code blocks (Shiki or Prism) matching the Cyberpunk Neon palette; copy-to-clipboard button on every block, confirms with a 1.5s checkmark swap.
- Left sidebar table of contents with active-section highlighting via scroll-spy (IntersectionObserver).

### 5. Guides
- Content driven by {{ITEM_1..6}}; layout and motion follow the Cyberpunk Neon system (scanline + chromatic-aberration text-shadow on the H1, HUD corner brackets on every panel).

### 6. Changelog
- Reverse-chronological version list from {{CHANGELOG_ENTRIES}}, each tagged (feature/fix/breaking) with a colored dot, never invented entries.

### 7. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #2A2A3D, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for docs if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built developer documentation site for an open-source library product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 932 — Industrial Utilitarian — Developer Documentation Site For An Open-Source Library

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a developer documentation site for an open-source library ({{PRODUCT_CATEGORY}}). Art direction: industrial utilitarian — concrete and steel palette, exposed grid lines, stenciled labels, function over decoration. Production-ready, 100% responsive.

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

### 1. Top Nav + Sidebar
- Fixed, height 72px, background transparent -> #EDECE8/90 with backdrop-blur(16px) after 40px scroll, transition 400ms linear 200ms for mechanical feel on toggles only.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Suisse Int'l Mono, weight 700.
- Center/right links styled per the Industrial Utilitarian type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #C9491C; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero / Quickstart
- Full-viewport, min-h-screen composition built around visible grid lines (1px --border) drawn across the full viewport as a permanent underlay, stenciled uppercase section labels with dot-leaders.
- H1 "{{HERO_HEADLINE}}" set in Suisse Int'l Mono, clamp(2.75rem, 7vw, 5.5rem); entrance timed to linear 200ms for mechanical feel on toggles only, ease-out elsewhere.
- Sub-headline "{{VALUE_PROP}}" in Suisse Int'l, max-w-xl, color #6B675E.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #C9491C) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Industrial Utilitarian palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #DCDAD3 until onLoad fires.

### 3. API Reference Grid
- Grid of {{ITEM_1..6}} (API sections), 0px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, GSAP.

### 4. Code Examples
- Syntax-highlighted code blocks (Shiki or Prism) matching the Industrial Utilitarian palette; copy-to-clipboard button on every block, confirms with a 1.5s checkmark swap.
- Left sidebar table of contents with active-section highlighting via scroll-spy (IntersectionObserver).

### 5. Guides
- Content driven by {{ITEM_1..6}}; layout and motion follow the Industrial Utilitarian system (visible grid lines (1px --border) drawn across the full viewport as a permanent underlay, stenciled uppercase section labels with dot-leaders).

### 6. Changelog
- Reverse-chronological version list from {{CHANGELOG_ENTRIES}}, each tagged (feature/fix/breaking) with a colored dot, never invented entries.

### 7. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #B7B4AA, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for docs if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built developer documentation site for an open-source library product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 933 — Futuristic Chrome — Developer Documentation Site For An Open-Source Library

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a developer documentation site for an open-source library ({{PRODUCT_CATEGORY}}). Art direction: futuristic chrome — liquid chrome gradients, specular highlights, cool metallic palette, motion-first. Production-ready, 100% responsive.

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

### 1. Top Nav + Sidebar
- Fixed, height 72px, background transparent -> #0B0D12/90 with backdrop-blur(16px) after 40px scroll, transition 400ms spring(stiffness 220, damping 26) via Framer Motion.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Space Grotesk, weight 700.
- Center/right links styled per the Futuristic Chrome type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #7DD3FC; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero / Quickstart
- Full-viewport, min-h-screen composition built around specular chrome gradient sweeping across headline on scroll (background-position tied to scrollYProgress).
- H1 "{{HERO_HEADLINE}}" set in Space Grotesk, clamp(2.75rem, 7vw, 5.5rem); entrance timed to spring(stiffness 220, damping 26) via Framer Motion.
- Sub-headline "{{VALUE_PROP}}" in Inter, max-w-xl, color #9AA1AF.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #7DD3FC) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Futuristic Chrome palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #151821 until onLoad fires.

### 3. API Reference Grid
- Grid of {{ITEM_1..6}} (API sections), 28px, pill-shaped controls media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Alpine.js for micro-interactions.

### 4. Code Examples
- Syntax-highlighted code blocks (Shiki or Prism) matching the Futuristic Chrome palette; copy-to-clipboard button on every block, confirms with a 1.5s checkmark swap.
- Left sidebar table of contents with active-section highlighting via scroll-spy (IntersectionObserver).

### 5. Guides
- Content driven by {{ITEM_1..6}}; layout and motion follow the Futuristic Chrome system (specular chrome gradient sweeping across headline on scroll (background-position tied to scrollYProgress)).

### 6. Changelog
- Reverse-chronological version list from {{CHANGELOG_ENTRIES}}, each tagged (feature/fix/breaking) with a colored dot, never invented entries.

### 7. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #2B2F3A, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for docs if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built developer documentation site for an open-source library product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 934 — Soft Minimal Warmth — Developer Documentation Site For An Open-Source Library

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a developer documentation site for an open-source library ({{PRODUCT_CATEGORY}}). Art direction: soft minimal warmth — warm off-white, generous air, soft shadows, rounded forms, low-contrast restraint. Production-ready, 100% responsive.

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

### 1. Top Nav + Sidebar
- Fixed, height 72px, background transparent -> #FAF7F2/90 with backdrop-blur(16px) after 40px scroll, transition 400ms ease-out 400-600ms.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Fraunces, weight 700.
- Center/right links styled per the Soft Minimal Warmth type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #D97757; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero / Quickstart
- Full-viewport, min-h-screen composition built around soft double-layer drop shadow (0 1px 2px + 0 12px 24px at 6%) on every raised surface, no borders — light does the separating.
- H1 "{{HERO_HEADLINE}}" set in Fraunces, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease-out 400-600ms, gentle y:12→0 reveals.
- Sub-headline "{{VALUE_PROP}}" in Inter, max-w-xl, color #928C80.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #D97757) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Soft Minimal Warmth palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #FFFFFF until onLoad fires.

### 3. API Reference Grid
- Grid of {{ITEM_1..6}} (API sections), 24px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Framer Motion for chrome.

### 4. Code Examples
- Syntax-highlighted code blocks (Shiki or Prism) matching the Soft Minimal Warmth palette; copy-to-clipboard button on every block, confirms with a 1.5s checkmark swap.
- Left sidebar table of contents with active-section highlighting via scroll-spy (IntersectionObserver).

### 5. Guides
- Content driven by {{ITEM_1..6}}; layout and motion follow the Soft Minimal Warmth system (soft double-layer drop shadow (0 1px 2px + 0 12px 24px at 6%) on every raised surface, no borders — light does the separating).

### 6. Changelog
- Reverse-chronological version list from {{CHANGELOG_ENTRIES}}, each tagged (feature/fix/breaking) with a colored dot, never invented entries.

### 7. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #ECE6DC, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for docs if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built developer documentation site for an open-source library product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 935 — Art Deco Revival — Developer Documentation Site For An Open-Source Library

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a developer documentation site for an open-source library ({{PRODUCT_CATEGORY}}). Art direction: art deco revival — gold on deep emerald/black, geometric fan and sunburst motifs, symmetrical ornament. Production-ready, 100% responsive.

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

### 1. Top Nav + Sidebar
- Fixed, height 72px, background transparent -> #0D1512/90 with backdrop-blur(16px) after 40px scroll, transition 400ms ease-in-out 700ms.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Poiret One / Cinzel, weight 700.
- Center/right links styled per the Art Deco Revival type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #C9A96A; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero / Quickstart
- Full-viewport, min-h-screen composition built around repeating SVG sunburst/fan motif as section dividers, gold 1px double-rule borders.
- H1 "{{HERO_HEADLINE}}" set in Poiret One / Cinzel, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease-in-out 700ms, symmetrical mirrored reveals.
- Sub-headline "{{VALUE_PROP}}" in Cormorant, max-w-xl, color #9FB5A8.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #C9A96A) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Art Deco Revival palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #122019 until onLoad fires.

### 3. API Reference Grid
- Grid of {{ITEM_1..6}} (API sections), 0px, chamfered corners via clip-path media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, GSAP.

### 4. Code Examples
- Syntax-highlighted code blocks (Shiki or Prism) matching the Art Deco Revival palette; copy-to-clipboard button on every block, confirms with a 1.5s checkmark swap.
- Left sidebar table of contents with active-section highlighting via scroll-spy (IntersectionObserver).

### 5. Guides
- Content driven by {{ITEM_1..6}}; layout and motion follow the Art Deco Revival system (repeating SVG sunburst/fan motif as section dividers, gold 1px double-rule borders).

### 6. Changelog
- Reverse-chronological version list from {{CHANGELOG_ENTRIES}}, each tagged (feature/fix/breaking) with a colored dot, never invented entries.

### 7. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #B8935A, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for docs if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built developer documentation site for an open-source library product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 936 — Japanese Minimal (Ma) — Developer Documentation Site For An Open-Source Library

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a developer documentation site for an open-source library ({{PRODUCT_CATEGORY}}). Art direction: japanese minimal (ma) — extreme negative space, single accent stroke, vertical rhythm, quiet confidence. Production-ready, 100% responsive.

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

### 1. Top Nav + Sidebar
- Fixed, height 72px, background transparent -> #FCFCFA/90 with backdrop-blur(16px) after 40px scroll, transition 400ms ease 800ms.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Zen Old Mincho / Shippori Mincho, weight 700.
- Center/right links styled per the Japanese Minimal (Ma) type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #C1121F; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero / Quickstart
- Full-viewport, min-h-screen composition built around a single vertical hairline rule tracks scroll progress along the left margin; content occupies at most 60% of viewport width.
- H1 "{{HERO_HEADLINE}}" set in Zen Old Mincho / Shippori Mincho, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease 800ms, single elements move — never groups at once.
- Sub-headline "{{VALUE_PROP}}" in Noto Sans JP fallback / Inter, max-w-xl, color #8D8B84.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #C1121F) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Japanese Minimal (Ma) palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #F5F4F0 until onLoad fires.

### 3. API Reference Grid
- Grid of {{ITEM_1..6}} (API sections), 0px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Alpine.js for micro-interactions.

### 4. Code Examples
- Syntax-highlighted code blocks (Shiki or Prism) matching the Japanese Minimal (Ma) palette; copy-to-clipboard button on every block, confirms with a 1.5s checkmark swap.
- Left sidebar table of contents with active-section highlighting via scroll-spy (IntersectionObserver).

### 5. Guides
- Content driven by {{ITEM_1..6}}; layout and motion follow the Japanese Minimal (Ma) system (a single vertical hairline rule tracks scroll progress along the left margin; content occupies at most 60% of viewport width).

### 6. Changelog
- Reverse-chronological version list from {{CHANGELOG_ENTRIES}}, each tagged (feature/fix/breaking) with a colored dot, never invented entries.

### 7. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #E2E0D8, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for docs if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built developer documentation site for an open-source library product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 937 — Scandinavian Functional — Developer Documentation Site For An Open-Source Library

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a developer documentation site for an open-source library ({{PRODUCT_CATEGORY}}). Art direction: scandinavian functional — light wood-neutral palette, clean sans type, function-led hierarchy, quiet confidence. Production-ready, 100% responsive.

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

### 1. Top Nav + Sidebar
- Fixed, height 72px, background transparent -> #F7F5F2/90 with backdrop-blur(16px) after 40px scroll, transition 400ms ease-out 300ms.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Söhne, weight 700.
- Center/right links styled per the Scandinavian Functional type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #3E6259; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero / Quickstart
- Full-viewport, min-h-screen composition built around consistent 8pt spacing scale exposed as visible rhythm between hairline-separated blocks.
- H1 "{{HERO_HEADLINE}}" set in Söhne, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease-out 300ms, no overshoot.
- Sub-headline "{{VALUE_PROP}}" in Söhne, max-w-xl, color #7D7A72.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #3E6259) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Scandinavian Functional palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #FFFFFF until onLoad fires.

### 3. API Reference Grid
- Grid of {{ITEM_1..6}} (API sections), 12px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Framer Motion for chrome.

### 4. Code Examples
- Syntax-highlighted code blocks (Shiki or Prism) matching the Scandinavian Functional palette; copy-to-clipboard button on every block, confirms with a 1.5s checkmark swap.
- Left sidebar table of contents with active-section highlighting via scroll-spy (IntersectionObserver).

### 5. Guides
- Content driven by {{ITEM_1..6}}; layout and motion follow the Scandinavian Functional system (consistent 8pt spacing scale exposed as visible rhythm between hairline-separated blocks).

### 6. Changelog
- Reverse-chronological version list from {{CHANGELOG_ENTRIES}}, each tagged (feature/fix/breaking) with a colored dot, never invented entries.

### 7. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #E4E0D8, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for docs if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built developer documentation site for an open-source library product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 938 — Retro-Futurist 80s — Developer Documentation Site For An Open-Source Library

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a developer documentation site for an open-source library ({{PRODUCT_CATEGORY}}). Art direction: retro-futurist 80s — sunset gradient, chrome grid horizon, VHS scanlines, synthwave palette. Production-ready, 100% responsive.

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

### 1. Top Nav + Sidebar
- Fixed, height 72px, background transparent -> #1A0B2E/90 with backdrop-blur(16px) after 40px scroll, transition 400ms linear scanline drift 8s infinite.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Righteous, weight 700.
- Center/right links styled per the Retro-Futurist 80s type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #FF6EC7; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero / Quickstart
- Full-viewport, min-h-screen composition built around perspective CSS grid horizon (transform: perspective(500px) rotateX(60deg)) receding beneath the hero, sun gradient circle behind it.
- H1 "{{HERO_HEADLINE}}" set in Righteous, clamp(2.75rem, 7vw, 5.5rem); entrance timed to linear scanline drift 8s infinite, ease-out for content.
- Sub-headline "{{VALUE_PROP}}" in Space Grotesk, max-w-xl, color #B79BD6.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #FF6EC7) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Retro-Futurist 80s palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #26123F until onLoad fires.

### 3. API Reference Grid
- Grid of {{ITEM_1..6}} (API sections), 4px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, GSAP.

### 4. Code Examples
- Syntax-highlighted code blocks (Shiki or Prism) matching the Retro-Futurist 80s palette; copy-to-clipboard button on every block, confirms with a 1.5s checkmark swap.
- Left sidebar table of contents with active-section highlighting via scroll-spy (IntersectionObserver).

### 5. Guides
- Content driven by {{ITEM_1..6}}; layout and motion follow the Retro-Futurist 80s system (perspective CSS grid horizon (transform: perspective(500px) rotateX(60deg)) receding beneath the hero, sun gradient circle behind it).

### 6. Changelog
- Reverse-chronological version list from {{CHANGELOG_ENTRIES}}, each tagged (feature/fix/breaking) with a colored dot, never invented entries.

### 7. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #4A2472, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for docs if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built developer documentation site for an open-source library product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 939 — Y2K Cyber-Cute — Developer Documentation Site For An Open-Source Library

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a developer documentation site for an open-source library ({{PRODUCT_CATEGORY}}). Art direction: y2k cyber-cute — chrome bubbles, gradient blobs, glossy buttons, playful maximal energy. Production-ready, 100% responsive.

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

### 1. Top Nav + Sidebar
- Fixed, height 72px, background transparent -> #EAF2FF/90 with backdrop-blur(16px) after 40px scroll, transition 400ms spring bounce (stiffness 300, damping 18).
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Chakra Petch, weight 700.
- Center/right links styled per the Y2K Cyber-Cute type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #7C5CFF; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero / Quickstart
- Full-viewport, min-h-screen composition built around glossy specular-highlight gradient buttons (radial-gradient white 10% at top-left), floating blob shapes drifting on scroll parallax.
- H1 "{{HERO_HEADLINE}}" set in Chakra Petch, clamp(2.75rem, 7vw, 5.5rem); entrance timed to spring bounce (stiffness 300, damping 18).
- Sub-headline "{{VALUE_PROP}}" in Poppins, max-w-xl, color #5C6B8C.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #7C5CFF) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Y2K Cyber-Cute palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #FFFFFF until onLoad fires.

### 3. API Reference Grid
- Grid of {{ITEM_1..6}} (API sections), 9999px on buttons, 32px on cards media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Alpine.js for micro-interactions.

### 4. Code Examples
- Syntax-highlighted code blocks (Shiki or Prism) matching the Y2K Cyber-Cute palette; copy-to-clipboard button on every block, confirms with a 1.5s checkmark swap.
- Left sidebar table of contents with active-section highlighting via scroll-spy (IntersectionObserver).

### 5. Guides
- Content driven by {{ITEM_1..6}}; layout and motion follow the Y2K Cyber-Cute system (glossy specular-highlight gradient buttons (radial-gradient white 10% at top-left), floating blob shapes drifting on scroll parallax).

### 6. Changelog
- Reverse-chronological version list from {{CHANGELOG_ENTRIES}}, each tagged (feature/fix/breaking) with a colored dot, never invented entries.

### 7. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #C7DBFF, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for docs if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built developer documentation site for an open-source library product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 940 — Digital Laboratory — Developer Documentation Site For An Open-Source Library

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a developer documentation site for an open-source library ({{PRODUCT_CATEGORY}}). Art direction: digital laboratory — clinical white/blue, precise data grids, diagrammatic annotation lines. Production-ready, 100% responsive.

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

### 1. Top Nav + Sidebar
- Fixed, height 72px, background transparent -> #FFFFFF/90 with backdrop-blur(16px) after 40px scroll, transition 400ms ease 200ms.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in IBM Plex Sans, weight 700.
- Center/right links styled per the Digital Laboratory type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #2E6FF2; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero / Quickstart
- Full-viewport, min-h-screen composition built around annotation leader-lines (SVG) connecting labels to UI elements, like a lab specimen diagram.
- H1 "{{HERO_HEADLINE}}" set in IBM Plex Sans, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease 200ms, precise not playful.
- Sub-headline "{{VALUE_PROP}}" in IBM Plex Sans, max-w-xl, color #667085.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #2E6FF2) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Digital Laboratory palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #F4F7FB until onLoad fires.

### 3. API Reference Grid
- Grid of {{ITEM_1..6}} (API sections), 6px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Framer Motion for chrome.

### 4. Code Examples
- Syntax-highlighted code blocks (Shiki or Prism) matching the Digital Laboratory palette; copy-to-clipboard button on every block, confirms with a 1.5s checkmark swap.
- Left sidebar table of contents with active-section highlighting via scroll-spy (IntersectionObserver).

### 5. Guides
- Content driven by {{ITEM_1..6}}; layout and motion follow the Digital Laboratory system (annotation leader-lines (SVG) connecting labels to UI elements, like a lab specimen diagram).

### 6. Changelog
- Reverse-chronological version list from {{CHANGELOG_ENTRIES}}, each tagged (feature/fix/breaking) with a colored dot, never invented entries.

### 7. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #D7E1EE, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for docs if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built developer documentation site for an open-source library product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 941 — Terminal-Inspired CLI — Developer Documentation Site For An Open-Source Library

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a developer documentation site for an open-source library ({{PRODUCT_CATEGORY}}). Art direction: terminal-inspired cli — pure monospace, green/amber phosphor accent on black, blinking cursor motifs. Production-ready, 100% responsive.

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

### 1. Top Nav + Sidebar
- Fixed, height 72px, background transparent -> #080A08/90 with backdrop-blur(16px) after 40px scroll, transition 400ms typewriter reveal.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in JetBrains Mono, weight 700.
- Center/right links styled per the Terminal-Inspired CLI type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #39FF14; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero / Quickstart
- Full-viewport, min-h-screen composition built around hero headline types itself out character-by-character with a blinking block cursor; every panel has a fake terminal titlebar with 3 dots.
- H1 "{{HERO_HEADLINE}}" set in JetBrains Mono, clamp(2.75rem, 7vw, 5.5rem); entrance timed to typewriter reveal, step-end steps(n).
- Sub-headline "{{VALUE_PROP}}" in JetBrains Mono, max-w-xl, color #6B8F6B.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #39FF14) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Terminal-Inspired CLI palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #0F120F until onLoad fires.

### 3. API Reference Grid
- Grid of {{ITEM_1..6}} (API sections), 0px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, GSAP.

### 4. Code Examples
- Syntax-highlighted code blocks (Shiki or Prism) matching the Terminal-Inspired CLI palette; copy-to-clipboard button on every block, confirms with a 1.5s checkmark swap.
- Left sidebar table of contents with active-section highlighting via scroll-spy (IntersectionObserver).

### 5. Guides
- Content driven by {{ITEM_1..6}}; layout and motion follow the Terminal-Inspired CLI system (hero headline types itself out character-by-character with a blinking block cursor; every panel has a fake terminal titlebar with 3 dots).

### 6. Changelog
- Reverse-chronological version list from {{CHANGELOG_ENTRIES}}, each tagged (feature/fix/breaking) with a colored dot, never invented entries.

### 7. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #1F261F, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for docs if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built developer documentation site for an open-source library product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 942 — Financial Terminal Dense — Developer Documentation Site For An Open-Source Library

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a developer documentation site for an open-source library ({{PRODUCT_CATEGORY}}). Art direction: financial terminal dense — black/near-black, tabular-nums everywhere, ticker rows, high information density. Production-ready, 100% responsive.

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

### 1. Top Nav + Sidebar
- Fixed, height 72px, background transparent -> #000000/90 with backdrop-blur(16px) after 40px scroll, transition 400ms ease 150ms.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in IBM Plex Mono, weight 700.
- Center/right links styled per the Financial Terminal Dense type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #00C853; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero / Quickstart
- Full-viewport, min-h-screen composition built around a live scrolling ticker row (marquee) of tabular-nums values that flash green/red on change, dense multi-column data tables.
- H1 "{{HERO_HEADLINE}}" set in IBM Plex Mono, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease 150ms, numeric roll via CountUp only.
- Sub-headline "{{VALUE_PROP}}" in IBM Plex Sans, max-w-xl, color #7C867C.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #00C853) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Financial Terminal Dense palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #0C0F0C until onLoad fires.

### 3. API Reference Grid
- Grid of {{ITEM_1..6}} (API sections), 2px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Alpine.js for micro-interactions.

### 4. Code Examples
- Syntax-highlighted code blocks (Shiki or Prism) matching the Financial Terminal Dense palette; copy-to-clipboard button on every block, confirms with a 1.5s checkmark swap.
- Left sidebar table of contents with active-section highlighting via scroll-spy (IntersectionObserver).

### 5. Guides
- Content driven by {{ITEM_1..6}}; layout and motion follow the Financial Terminal Dense system (a live scrolling ticker row (marquee) of tabular-nums values that flash green/red on change, dense multi-column data tables).

### 6. Changelog
- Reverse-chronological version list from {{CHANGELOG_ENTRIES}}, each tagged (feature/fix/breaking) with a colored dot, never invented entries.

### 7. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #1E231E, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for docs if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built developer documentation site for an open-source library product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 943 — Magazine Grid — Developer Documentation Site For An Open-Source Library

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a developer documentation site for an open-source library ({{PRODUCT_CATEGORY}}). Art direction: magazine grid — multi-column editorial grid, drop caps, running heads, varied image sizes. Production-ready, 100% responsive.

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

### 1. Top Nav + Sidebar
- Fixed, height 72px, background transparent -> #FFFFFF/90 with backdrop-blur(16px) after 40px scroll, transition 400ms ease-out 500ms crossfades between spreads.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Tiempos Headline, weight 700.
- Center/right links styled per the Magazine Grid type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #B0281C; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero / Quickstart
- Full-viewport, min-h-screen composition built around a masthead running head fixed at top (issue number, section name), first paragraph after each H2 gets a 3-line drop cap.
- H1 "{{HERO_HEADLINE}}" set in Tiempos Headline, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease-out 500ms crossfades between spreads.
- Sub-headline "{{VALUE_PROP}}" in Tiempos Text, max-w-xl, color #847E71.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #B0281C) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Magazine Grid palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #F6F5F2 until onLoad fires.

### 3. API Reference Grid
- Grid of {{ITEM_1..6}} (API sections), 0px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Framer Motion for chrome.

### 4. Code Examples
- Syntax-highlighted code blocks (Shiki or Prism) matching the Magazine Grid palette; copy-to-clipboard button on every block, confirms with a 1.5s checkmark swap.
- Left sidebar table of contents with active-section highlighting via scroll-spy (IntersectionObserver).

### 5. Guides
- Content driven by {{ITEM_1..6}}; layout and motion follow the Magazine Grid system (a masthead running head fixed at top (issue number, section name), first paragraph after each H2 gets a 3-line drop cap).

### 6. Changelog
- Reverse-chronological version list from {{CHANGELOG_ENTRIES}}, each tagged (feature/fix/breaking) with a colored dot, never invented entries.

### 7. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #DEDBD2, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for docs if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built developer documentation site for an open-source library product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 944 — High-Fashion Editorial — Developer Documentation Site For An Open-Source Library

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a developer documentation site for an open-source library ({{PRODUCT_CATEGORY}}). Art direction: high-fashion editorial — full-bleed monochrome photography, oversized condensed type, extreme minimalism. Production-ready, 100% responsive.

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

### 1. Top Nav + Sidebar
- Fixed, height 72px, background transparent -> #111111/90 with backdrop-blur(16px) after 40px scroll, transition 400ms ease 900ms.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in PP Neue Montreal Condensed, weight 700.
- Center/right links styled per the High-Fashion Editorial type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #FFFFFF; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero / Quickstart
- Full-viewport, min-h-screen composition built around full-viewport image bleeds with condensed vertical wordmark rotated -90deg pinned to the edge.
- H1 "{{HERO_HEADLINE}}" set in PP Neue Montreal Condensed, clamp(2.75rem, 7vw, 6rem); entrance timed to ease 900ms, slow deliberate crossfades — never fast.
- Sub-headline "{{VALUE_PROP}}" in PP Neue Montreal, max-w-xl, color #9A9A9A.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #FFFFFF) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the High-Fashion Editorial palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #000000 until onLoad fires.

### 3. API Reference Grid
- Grid of {{ITEM_1..6}} (API sections), 0px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, GSAP.

### 4. Code Examples
- Syntax-highlighted code blocks (Shiki or Prism) matching the High-Fashion Editorial palette; copy-to-clipboard button on every block, confirms with a 1.5s checkmark swap.
- Left sidebar table of contents with active-section highlighting via scroll-spy (IntersectionObserver).

### 5. Guides
- Content driven by {{ITEM_1..6}}; layout and motion follow the High-Fashion Editorial system (full-viewport image bleeds with condensed vertical wordmark rotated -90deg pinned to the edge).

### 6. Changelog
- Reverse-chronological version list from {{CHANGELOG_ENTRIES}}, each tagged (feature/fix/breaking) with a colored dot, never invented entries.

### 7. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #2E2E2E, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for docs if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built developer documentation site for an open-source library product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 945 — Architectural Blueprint — Developer Documentation Site For An Open-Source Library

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a developer documentation site for an open-source library ({{PRODUCT_CATEGORY}}). Art direction: architectural blueprint — technical drawing aesthetic, thin precise lines, dimension annotations, cool blue-grey. Production-ready, 100% responsive.

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

### 1. Top Nav + Sidebar
- Fixed, height 72px, background transparent -> #F5F6F7/90 with backdrop-blur(16px) after 40px scroll, transition 400ms ease 300ms.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Neue Haas Unica, weight 700.
- Center/right links styled per the Architectural Blueprint type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #1B4B91; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero / Quickstart
- Full-viewport, min-h-screen composition built around SVG dimension lines with arrow endpoints and measurement labels annotate key layout sections, as in a blueprint.
- H1 "{{HERO_HEADLINE}}" set in Neue Haas Unica, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease 300ms, draws lines via stroke-dashoffset animation.
- Sub-headline "{{VALUE_PROP}}" in Neue Haas Unica, max-w-xl, color #6E7981.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #1B4B91) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Architectural Blueprint palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #FFFFFF until onLoad fires.

### 3. API Reference Grid
- Grid of {{ITEM_1..6}} (API sections), 0px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Alpine.js for micro-interactions.

### 4. Code Examples
- Syntax-highlighted code blocks (Shiki or Prism) matching the Architectural Blueprint palette; copy-to-clipboard button on every block, confirms with a 1.5s checkmark swap.
- Left sidebar table of contents with active-section highlighting via scroll-spy (IntersectionObserver).

### 5. Guides
- Content driven by {{ITEM_1..6}}; layout and motion follow the Architectural Blueprint system (SVG dimension lines with arrow endpoints and measurement labels annotate key layout sections, as in a blueprint).

### 6. Changelog
- Reverse-chronological version list from {{CHANGELOG_ENTRIES}}, each tagged (feature/fix/breaking) with a colored dot, never invented entries.

### 7. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #C7CCD1, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for docs if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built developer documentation site for an open-source library product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 946 — Experimental Typography — Developer Documentation Site For An Open-Source Library

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a developer documentation site for an open-source library ({{PRODUCT_CATEGORY}}). Art direction: experimental typography — type as the primary graphic device — variable font weight/width driven by scroll or cursor. Production-ready, 100% responsive.

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

### 1. Top Nav + Sidebar
- Fixed, height 72px, background transparent -> #111014/90 with backdrop-blur(16px) after 40px scroll, transition 400ms scroll-linked variable-font-variation-settings interpolation.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Variable custom (wght/wdth axes), weight 700.
- Center/right links styled per the Experimental Typography type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #E8FF59; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero / Quickstart
- Full-viewport, min-h-screen composition built around headline font-variation-settings 'wght' and 'wdth' interpolate live with scroll velocity and cursor proximity per character.
- H1 "{{HERO_HEADLINE}}" set in Variable custom (wght/wdth axes), clamp(2.75rem, 7vw, 5.5rem); entrance timed to scroll-linked variable-font-variation-settings interpolation.
- Sub-headline "{{VALUE_PROP}}" in Suisse Int'l, max-w-xl, color #948FA3.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #E8FF59) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Experimental Typography palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #1A1820 until onLoad fires.

### 3. API Reference Grid
- Grid of {{ITEM_1..6}} (API sections), 0px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Framer Motion for chrome.

### 4. Code Examples
- Syntax-highlighted code blocks (Shiki or Prism) matching the Experimental Typography palette; copy-to-clipboard button on every block, confirms with a 1.5s checkmark swap.
- Left sidebar table of contents with active-section highlighting via scroll-spy (IntersectionObserver).

### 5. Guides
- Content driven by {{ITEM_1..6}}; layout and motion follow the Experimental Typography system (headline font-variation-settings 'wght' and 'wdth' interpolate live with scroll velocity and cursor proximity per character).

### 6. Changelog
- Reverse-chronological version list from {{CHANGELOG_ENTRIES}}, each tagged (feature/fix/breaking) with a colored dot, never invented entries.

### 7. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #312E3B, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for docs if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built developer documentation site for an open-source library product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 947 — Data-Dense Analytics — Developer Documentation Site For An Open-Source Library

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a developer documentation site for an open-source library ({{PRODUCT_CATEGORY}}). Art direction: data-dense analytics — tight information density, small multiples, sparkline-everything, muted chart palette. Production-ready, 100% responsive.

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

### 1. Top Nav + Sidebar
- Fixed, height 72px, background transparent -> #0E1116/90 with backdrop-blur(16px) after 40px scroll, transition 400ms ease 180ms.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Inter Tight, weight 700.
- Center/right links styled per the Data-Dense Analytics type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #4C9AFF; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero / Quickstart
- Full-viewport, min-h-screen composition built around a grid of small-multiple sparkline cards, each with a live-updating value and a 30-day trend line drawn in SVG.
- H1 "{{HERO_HEADLINE}}" set in Inter Tight, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease 180ms, chart transitions via d3 interpolate.
- Sub-headline "{{VALUE_PROP}}" in Inter, max-w-xl, color #7E8896.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #4C9AFF) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Data-Dense Analytics palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #161A21 until onLoad fires.

### 3. API Reference Grid
- Grid of {{ITEM_1..6}} (API sections), 10px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, GSAP.

### 4. Code Examples
- Syntax-highlighted code blocks (Shiki or Prism) matching the Data-Dense Analytics palette; copy-to-clipboard button on every block, confirms with a 1.5s checkmark swap.
- Left sidebar table of contents with active-section highlighting via scroll-spy (IntersectionObserver).

### 5. Guides
- Content driven by {{ITEM_1..6}}; layout and motion follow the Data-Dense Analytics system (a grid of small-multiple sparkline cards, each with a live-updating value and a 30-day trend line drawn in SVG).

### 6. Changelog
- Reverse-chronological version list from {{CHANGELOG_ENTRIES}}, each tagged (feature/fix/breaking) with a colored dot, never invented entries.

### 7. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #262C36, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for docs if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built developer documentation site for an open-source library product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 948 — Corporate Premium Trust — Developer Documentation Site For An Open-Source Library

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a developer documentation site for an open-source library ({{PRODUCT_CATEGORY}}). Art direction: corporate premium trust — navy and white, generous whitespace, restrained gold accent, institutional confidence. Production-ready, 100% responsive.

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

### 1. Top Nav + Sidebar
- Fixed, height 72px, background transparent -> #FFFFFF/90 with backdrop-blur(16px) after 40px scroll, transition 400ms ease-out 350ms.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Söhne, weight 700.
- Center/right links styled per the Corporate Premium Trust type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #0F3D6E; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero / Quickstart
- Full-viewport, min-h-screen composition built around a fixed trust-bar beneath the navbar listing certifications/regulator marks in small caps.
- H1 "{{HERO_HEADLINE}}" set in Söhne, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease-out 350ms, no playful overshoot.
- Sub-headline "{{VALUE_PROP}}" in Söhne, max-w-xl, color #5B6B80.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #0F3D6E) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Corporate Premium Trust palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #F5F7FA until onLoad fires.

### 3. API Reference Grid
- Grid of {{ITEM_1..6}} (API sections), 10px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Alpine.js for micro-interactions.

### 4. Code Examples
- Syntax-highlighted code blocks (Shiki or Prism) matching the Corporate Premium Trust palette; copy-to-clipboard button on every block, confirms with a 1.5s checkmark swap.
- Left sidebar table of contents with active-section highlighting via scroll-spy (IntersectionObserver).

### 5. Guides
- Content driven by {{ITEM_1..6}}; layout and motion follow the Corporate Premium Trust system (a fixed trust-bar beneath the navbar listing certifications/regulator marks in small caps).

### 6. Changelog
- Reverse-chronological version list from {{CHANGELOG_ENTRIES}}, each tagged (feature/fix/breaking) with a colored dot, never invented entries.

### 7. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #E1E6ED, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for docs if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built developer documentation site for an open-source library product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 949 — Playful Sophisticated — Developer Documentation Site For An Open-Source Library

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a developer documentation site for an open-source library ({{PRODUCT_CATEGORY}}). Art direction: playful sophisticated — bold single accent on cream, hand-tuned micro-illustrations, confident restraint with warmth. Production-ready, 100% responsive.

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

### 1. Top Nav + Sidebar
- Fixed, height 72px, background transparent -> #FFF8EF/90 with backdrop-blur(16px) after 40px scroll, transition 400ms spring(220,20).
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Fraunces (soft), weight 700.
- Center/right links styled per the Playful Sophisticated type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #FF5A36; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero / Quickstart
- Full-viewport, min-h-screen composition built around small hand-drawn-style SVG accent marks (circles, arrows) that rotate/scale in as a section enters viewport.
- H1 "{{HERO_HEADLINE}}" set in Fraunces (soft), clamp(2.75rem, 7vw, 5.5rem); entrance timed to spring(220,20), playful but never chaotic.
- Sub-headline "{{VALUE_PROP}}" in General Sans, max-w-xl, color #8C7F68.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #FF5A36) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Playful Sophisticated palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #FFFFFF until onLoad fires.

### 3. API Reference Grid
- Grid of {{ITEM_1..6}} (API sections), 18px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Framer Motion for chrome.

### 4. Code Examples
- Syntax-highlighted code blocks (Shiki or Prism) matching the Playful Sophisticated palette; copy-to-clipboard button on every block, confirms with a 1.5s checkmark swap.
- Left sidebar table of contents with active-section highlighting via scroll-spy (IntersectionObserver).

### 5. Guides
- Content driven by {{ITEM_1..6}}; layout and motion follow the Playful Sophisticated system (small hand-drawn-style SVG accent marks (circles, arrows) that rotate/scale in as a section enters viewport).

### 6. Changelog
- Reverse-chronological version list from {{CHANGELOG_ENTRIES}}, each tagged (feature/fix/breaking) with a colored dot, never invented entries.

### 7. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #F0E4D0, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for docs if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built developer documentation site for an open-source library product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 950 — Organic Earth — Developer Documentation Site For An Open-Source Library

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a developer documentation site for an open-source library ({{PRODUCT_CATEGORY}}). Art direction: organic earth — clay, moss and sand tones, blob/curve shapes, natural texture, calm pacing. Production-ready, 100% responsive.

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

### 1. Top Nav + Sidebar
- Fixed, height 72px, background transparent -> #F3EEE4/90 with backdrop-blur(16px) after 40px scroll, transition 400ms ease-in-out 700ms.
- Left: {{LOGO_ASSET}} at 28px height, or wordmark "{{BRAND_NAME}}" in Fraunces, weight 700.
- Center/right links styled per the Organic Earth type system; active link underline animates scaleX(0)->1, origin-left, 260ms.
- Primary action "{{PRIMARY_CTA}}" as a button in accent #5B6E4F; mobile collapses to a full-screen overlay with staggered link entrance (each +60ms), body scroll locked, Esc closes, focus trapped and returned to the trigger on close.

### 2. Hero / Quickstart
- Full-viewport, min-h-screen composition built around organic blob-shaped SVG clip-paths frame every image, morphing slightly on scroll (clip-path interpolation).
- H1 "{{HERO_HEADLINE}}" set in Fraunces, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease-in-out 700ms, slow drift.
- Sub-headline "{{VALUE_PROP}}" in Newsreader, max-w-xl, color #8A7F65.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #5B6E4F) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Organic Earth palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #EAE2D0 until onLoad fires.

### 3. API Reference Grid
- Grid of {{ITEM_1..6}} (API sections), 40% organic blob clip-paths on media media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, GSAP.

### 4. Code Examples
- Syntax-highlighted code blocks (Shiki or Prism) matching the Organic Earth palette; copy-to-clipboard button on every block, confirms with a 1.5s checkmark swap.
- Left sidebar table of contents with active-section highlighting via scroll-spy (IntersectionObserver).

### 5. Guides
- Content driven by {{ITEM_1..6}}; layout and motion follow the Organic Earth system (organic blob-shaped SVG clip-paths frame every image, morphing slightly on scroll (clip-path interpolation)).

### 6. Changelog
- Reverse-chronological version list from {{CHANGELOG_ENTRIES}}, each tagged (feature/fix/breaking) with a colored dot, never invented entries.

### 7. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #D8CBAE, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for docs if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built developer documentation site for an open-source library product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 951 — Swiss Brutalist Monochrome — Design/Branding Agency Portfolio

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a design/branding agency portfolio ({{PRODUCT_CATEGORY}}). Art direction: swiss brutalist monochrome — raw grid discipline, oversized type as the only ornament, zero decorative imagery. Production-ready, 100% responsive.

## TECH STACK
- Framework: Qwik City (resumability, no hydration cost)
- Styling: Tailwind CSS v4
- Animation: GSAP loaded via useVisibleTask$ only for above-fold, lazy for the rest
- Extra: Qwik's built-in image optimization
- Icons: lucide-qwik equivalent via inline SVG
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

### 3. Selected Work Gallery
- Grid of {{ITEM_1..6}} (capabilities), max 2px, mostly 0 media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, GSAP loaded via useVisibleTask$ only for above-fold.

### 4. Capabilities
- Content driven by {{ITEM_1..6}}; layout and motion follow the Swiss Brutalist Monochrome system (full-bleed horizontal marquee statement + numbered editorial list rows).

### 5. Process
- Editorial numbered process list ({{PROCESS_STEP_1..5}}), each row revealing on scroll with a power4.out / cubic-bezier(0.16,1,0.3,1), no linear entrance, staggered 60ms per row.

### 6. Team
- Grid of people from {{TEAM_1..6}} (name, role, photo?); missing photos render an initials monogram in accent #0B0B0B, never a stock headshot.
- Section removed entirely if {{TEAM_1..6}} is empty.

### 7. CTA
- Full-width closing section, background #0B0B0B, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Neue Haas Grotesk Text, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #DEDEDA, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for agency if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built design/branding agency portfolio product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 952 — Aurora Glassmorphism — Design/Branding Agency Portfolio

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a design/branding agency portfolio ({{PRODUCT_CATEGORY}}). Art direction: aurora glassmorphism — deep space backdrop, drifting light fields, frosted translucent surfaces. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: Tailwind CSS v4
- Animation: react-three-fiber + drei for the hero 3D scene, Framer Motion for DOM layers
- Extra: R3F scene code-split and lazy-loaded, CSS gradient fallback if WebGL unavailable
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

### 3. Selected Work Gallery
- Grid of {{ITEM_1..6}} (capabilities), 20px on glass surfaces media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, react-three-fiber.

### 4. Capabilities
- Content driven by {{ITEM_1..6}}; layout and motion follow the Aurora Glassmorphism system (three desynced radial-gradient blobs + backdrop-blur(24px) glass recipe reused everywhere).

### 5. Process
- Editorial numbered process list ({{PROCESS_STEP_1..5}}), each row revealing on scroll with a [0.16,1,0.3,1], slow ambient CSS keyframe loops entrance, staggered 60ms per row.

### 6. Team
- Grid of people from {{TEAM_1..6}} (name, role, photo?); missing photos render an initials monogram in accent #6E56F8, never a stock headshot.
- Section removed entirely if {{TEAM_1..6}} is empty.

### 7. CTA
- Full-width closing section, background #05060B, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Inter, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at rgba(255,255,255,0.09), copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for agency if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built design/branding agency portfolio product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 953 — Neo-Brutalist Pop — Design/Branding Agency Portfolio

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a design/branding agency portfolio ({{PRODUCT_CATEGORY}}). Art direction: neo-brutalist pop — thick black outlines, flat saturated blocks, deliberately raw hard shadows, no gradients. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router), React Server Components where possible
- Styling: Tailwind CSS v4 with @theme in globals.css
- Animation: Framer Motion (layout + scroll) + GSAP ScrollTrigger for pinned sequences
- Extra: Lenis for smooth scroll (lerp 0.07)
- Icons: Lucide React
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

### 3. Selected Work Gallery
- Grid of {{ITEM_1..6}} (capabilities), 0px everywhere media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Framer Motion (layout + scroll).

### 4. Capabilities
- Content driven by {{ITEM_1..6}}; layout and motion follow the Neo-Brutalist Pop system (hard offset shadow (8px 8px 0 #111) that flattens to 0 0 0 on press, thick 3px borders on every block).

### 5. Process
- Editorial numbered process list ({{PROCESS_STEP_1..5}}), each row revealing on scroll with a steps() and abrupt cubic-bezier(0.68,-0.55,0.27,1.55) overshoot entrance, staggered 60ms per row.

### 6. Team
- Grid of people from {{TEAM_1..6}} (name, role, photo?); missing photos render an initials monogram in accent #FF4D2E, never a stock headshot.
- Section removed entirely if {{TEAM_1..6}} is empty.

### 7. CTA
- Full-width closing section, background #FDF6EC, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Archivo, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #111111, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for agency if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built design/branding agency portfolio product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 954 — Editorial Serif Luxury — Design/Branding Agency Portfolio

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a design/branding agency portfolio ({{PRODUCT_CATEGORY}}). Art direction: editorial serif luxury — magazine-grade serif display type, generous margins, restrained color, photography-led. Production-ready, 100% responsive.

## TECH STACK
- Framework: Qwik City (resumability, no hydration cost)
- Styling: Tailwind CSS v4
- Animation: GSAP loaded via useVisibleTask$ only for above-fold, lazy for the rest
- Extra: Qwik's built-in image optimization
- Icons: lucide-qwik equivalent via inline SVG
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

### 3. Selected Work Gallery
- Grid of {{ITEM_1..6}} (capabilities), 0px, hairline rules instead media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, GSAP loaded via useVisibleTask$ only for above-fold.

### 4. Capabilities
- Content driven by {{ITEM_1..6}}; layout and motion follow the Editorial Serif Luxury system (asymmetric editorial grid with pull-quotes and a running folio/issue number).

### 5. Process
- Editorial numbered process list ({{PROCESS_STEP_1..5}}), each row revealing on scroll with a ease-out, 600-900ms, understated crossfades entrance, staggered 60ms per row.

### 6. Team
- Grid of people from {{TEAM_1..6}} (name, role, photo?); missing photos render an initials monogram in accent #7A2E2E, never a stock headshot.
- Section removed entirely if {{TEAM_1..6}} is empty.

### 7. CTA
- Full-width closing section, background #FBF9F6, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Söhne, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #E3DCD0, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for agency if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built design/branding agency portfolio product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 955 — Dark Technical Console — Design/Branding Agency Portfolio

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a design/branding agency portfolio ({{PRODUCT_CATEGORY}}). Art direction: dark technical console — near-black canvas, monospace accents, data-dense panels, engineering credibility. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: Tailwind CSS v4
- Animation: react-three-fiber + drei for the hero 3D scene, Framer Motion for DOM layers
- Extra: R3F scene code-split and lazy-loaded, CSS gradient fallback if WebGL unavailable
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

### 3. Selected Work Gallery
- Grid of {{ITEM_1..6}} (capabilities), 8px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, react-three-fiber.

### 4. Capabilities
- Content driven by {{ITEM_1..6}}; layout and motion follow the Dark Technical Console system (live-updating metric tiles with tabular-nums CountUp and a terminal-style command block).

### 5. Process
- Editorial numbered process list ({{PROCESS_STEP_1..5}}), each row revealing on scroll with a 150-250ms ease, no bounce entrance, staggered 60ms per row.

### 6. Team
- Grid of people from {{TEAM_1..6}} (name, role, photo?); missing photos render an initials monogram in accent #5EEAD4, never a stock headshot.
- Section removed entirely if {{TEAM_1..6}} is empty.

### 7. CTA
- Full-width closing section, background #0A0C10, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Inter, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #22262E, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for agency if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built design/branding agency portfolio product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 956 — Cyberpunk Neon — Design/Branding Agency Portfolio

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a design/branding agency portfolio ({{PRODUCT_CATEGORY}}). Art direction: cyberpunk neon — black canvas, saturated magenta/cyan neon, glitch accents, dense HUD framing. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router), React Server Components where possible
- Styling: Tailwind CSS v4 with @theme in globals.css
- Animation: Framer Motion (layout + scroll) + GSAP ScrollTrigger for pinned sequences
- Extra: Lenis for smooth scroll (lerp 0.07)
- Icons: Lucide React
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

### 3. Selected Work Gallery
- Grid of {{ITEM_1..6}} (capabilities), 2px, corner-clipped (clip-path) panels media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Framer Motion (layout + scroll).

### 4. Capabilities
- Content driven by {{ITEM_1..6}}; layout and motion follow the Cyberpunk Neon system (scanline + chromatic-aberration text-shadow on the H1, HUD corner brackets on every panel).

### 5. Process
- Editorial numbered process list ({{PROCESS_STEP_1..5}}), each row revealing on scroll with a glitch keyframe (translate jitter 2px, 80ms) on hover only entrance, staggered 60ms per row.

### 6. Team
- Grid of people from {{TEAM_1..6}} (name, role, photo?); missing photos render an initials monogram in accent #FF2E9A, never a stock headshot.
- Section removed entirely if {{TEAM_1..6}} is empty.

### 7. CTA
- Full-width closing section, background #050508, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Space Grotesk, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #2A2A3D, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for agency if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built design/branding agency portfolio product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 957 — Industrial Utilitarian — Design/Branding Agency Portfolio

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a design/branding agency portfolio ({{PRODUCT_CATEGORY}}). Art direction: industrial utilitarian — concrete and steel palette, exposed grid lines, stenciled labels, function over decoration. Production-ready, 100% responsive.

## TECH STACK
- Framework: Qwik City (resumability, no hydration cost)
- Styling: Tailwind CSS v4
- Animation: GSAP loaded via useVisibleTask$ only for above-fold, lazy for the rest
- Extra: Qwik's built-in image optimization
- Icons: lucide-qwik equivalent via inline SVG
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

### 3. Selected Work Gallery
- Grid of {{ITEM_1..6}} (capabilities), 0px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, GSAP loaded via useVisibleTask$ only for above-fold.

### 4. Capabilities
- Content driven by {{ITEM_1..6}}; layout and motion follow the Industrial Utilitarian system (visible grid lines (1px --border) drawn across the full viewport as a permanent underlay, stenciled uppercase section labels with dot-leaders).

### 5. Process
- Editorial numbered process list ({{PROCESS_STEP_1..5}}), each row revealing on scroll with a linear 200ms for mechanical feel on toggles only, ease-out elsewhere entrance, staggered 60ms per row.

### 6. Team
- Grid of people from {{TEAM_1..6}} (name, role, photo?); missing photos render an initials monogram in accent #C9491C, never a stock headshot.
- Section removed entirely if {{TEAM_1..6}} is empty.

### 7. CTA
- Full-width closing section, background #EDECE8, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Suisse Int'l, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #B7B4AA, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for agency if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built design/branding agency portfolio product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 958 — Futuristic Chrome — Design/Branding Agency Portfolio

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a design/branding agency portfolio ({{PRODUCT_CATEGORY}}). Art direction: futuristic chrome — liquid chrome gradients, specular highlights, cool metallic palette, motion-first. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: Tailwind CSS v4
- Animation: react-three-fiber + drei for the hero 3D scene, Framer Motion for DOM layers
- Extra: R3F scene code-split and lazy-loaded, CSS gradient fallback if WebGL unavailable
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

### 3. Selected Work Gallery
- Grid of {{ITEM_1..6}} (capabilities), 28px, pill-shaped controls media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, react-three-fiber.

### 4. Capabilities
- Content driven by {{ITEM_1..6}}; layout and motion follow the Futuristic Chrome system (specular chrome gradient sweeping across headline on scroll (background-position tied to scrollYProgress)).

### 5. Process
- Editorial numbered process list ({{PROCESS_STEP_1..5}}), each row revealing on scroll with a spring(stiffness 220, damping 26) via Framer Motion entrance, staggered 60ms per row.

### 6. Team
- Grid of people from {{TEAM_1..6}} (name, role, photo?); missing photos render an initials monogram in accent #7DD3FC, never a stock headshot.
- Section removed entirely if {{TEAM_1..6}} is empty.

### 7. CTA
- Full-width closing section, background #0B0D12, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Inter, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #2B2F3A, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for agency if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built design/branding agency portfolio product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 959 — Soft Minimal Warmth — Design/Branding Agency Portfolio

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a design/branding agency portfolio ({{PRODUCT_CATEGORY}}). Art direction: soft minimal warmth — warm off-white, generous air, soft shadows, rounded forms, low-contrast restraint. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router), React Server Components where possible
- Styling: Tailwind CSS v4 with @theme in globals.css
- Animation: Framer Motion (layout + scroll) + GSAP ScrollTrigger for pinned sequences
- Extra: Lenis for smooth scroll (lerp 0.07)
- Icons: Lucide React
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

### 3. Selected Work Gallery
- Grid of {{ITEM_1..6}} (capabilities), 24px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Framer Motion (layout + scroll).

### 4. Capabilities
- Content driven by {{ITEM_1..6}}; layout and motion follow the Soft Minimal Warmth system (soft double-layer drop shadow (0 1px 2px + 0 12px 24px at 6%) on every raised surface, no borders — light does the separating).

### 5. Process
- Editorial numbered process list ({{PROCESS_STEP_1..5}}), each row revealing on scroll with a ease-out 400-600ms, gentle y:12→0 reveals entrance, staggered 60ms per row.

### 6. Team
- Grid of people from {{TEAM_1..6}} (name, role, photo?); missing photos render an initials monogram in accent #D97757, never a stock headshot.
- Section removed entirely if {{TEAM_1..6}} is empty.

### 7. CTA
- Full-width closing section, background #FAF7F2, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Inter, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #ECE6DC, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for agency if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built design/branding agency portfolio product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 960 — Art Deco Revival — Design/Branding Agency Portfolio

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a design/branding agency portfolio ({{PRODUCT_CATEGORY}}). Art direction: art deco revival — gold on deep emerald/black, geometric fan and sunburst motifs, symmetrical ornament. Production-ready, 100% responsive.

## TECH STACK
- Framework: Qwik City (resumability, no hydration cost)
- Styling: Tailwind CSS v4
- Animation: GSAP loaded via useVisibleTask$ only for above-fold, lazy for the rest
- Extra: Qwik's built-in image optimization
- Icons: lucide-qwik equivalent via inline SVG
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

### 3. Selected Work Gallery
- Grid of {{ITEM_1..6}} (capabilities), 0px, chamfered corners via clip-path media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, GSAP loaded via useVisibleTask$ only for above-fold.

### 4. Capabilities
- Content driven by {{ITEM_1..6}}; layout and motion follow the Art Deco Revival system (repeating SVG sunburst/fan motif as section dividers, gold 1px double-rule borders).

### 5. Process
- Editorial numbered process list ({{PROCESS_STEP_1..5}}), each row revealing on scroll with a ease-in-out 700ms, symmetrical mirrored reveals entrance, staggered 60ms per row.

### 6. Team
- Grid of people from {{TEAM_1..6}} (name, role, photo?); missing photos render an initials monogram in accent #C9A96A, never a stock headshot.
- Section removed entirely if {{TEAM_1..6}} is empty.

### 7. CTA
- Full-width closing section, background #0D1512, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Cormorant, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #B8935A, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for agency if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built design/branding agency portfolio product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 961 — Japanese Minimal (Ma) — Design/Branding Agency Portfolio

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a design/branding agency portfolio ({{PRODUCT_CATEGORY}}). Art direction: japanese minimal (ma) — extreme negative space, single accent stroke, vertical rhythm, quiet confidence. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: Tailwind CSS v4
- Animation: react-three-fiber + drei for the hero 3D scene, Framer Motion for DOM layers
- Extra: R3F scene code-split and lazy-loaded, CSS gradient fallback if WebGL unavailable
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

### 3. Selected Work Gallery
- Grid of {{ITEM_1..6}} (capabilities), 0px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, react-three-fiber.

### 4. Capabilities
- Content driven by {{ITEM_1..6}}; layout and motion follow the Japanese Minimal (Ma) system (a single vertical hairline rule tracks scroll progress along the left margin; content occupies at most 60% of viewport width).

### 5. Process
- Editorial numbered process list ({{PROCESS_STEP_1..5}}), each row revealing on scroll with a ease 800ms, single elements move — never groups at once entrance, staggered 60ms per row.

### 6. Team
- Grid of people from {{TEAM_1..6}} (name, role, photo?); missing photos render an initials monogram in accent #C1121F, never a stock headshot.
- Section removed entirely if {{TEAM_1..6}} is empty.

### 7. CTA
- Full-width closing section, background #FCFCFA, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Noto Sans JP fallback / Inter, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #E2E0D8, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for agency if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built design/branding agency portfolio product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 962 — Scandinavian Functional — Design/Branding Agency Portfolio

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a design/branding agency portfolio ({{PRODUCT_CATEGORY}}). Art direction: scandinavian functional — light wood-neutral palette, clean sans type, function-led hierarchy, quiet confidence. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router), React Server Components where possible
- Styling: Tailwind CSS v4 with @theme in globals.css
- Animation: Framer Motion (layout + scroll) + GSAP ScrollTrigger for pinned sequences
- Extra: Lenis for smooth scroll (lerp 0.07)
- Icons: Lucide React
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

### 3. Selected Work Gallery
- Grid of {{ITEM_1..6}} (capabilities), 12px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Framer Motion (layout + scroll).

### 4. Capabilities
- Content driven by {{ITEM_1..6}}; layout and motion follow the Scandinavian Functional system (consistent 8pt spacing scale exposed as visible rhythm between hairline-separated blocks).

### 5. Process
- Editorial numbered process list ({{PROCESS_STEP_1..5}}), each row revealing on scroll with a ease-out 300ms, no overshoot entrance, staggered 60ms per row.

### 6. Team
- Grid of people from {{TEAM_1..6}} (name, role, photo?); missing photos render an initials monogram in accent #3E6259, never a stock headshot.
- Section removed entirely if {{TEAM_1..6}} is empty.

### 7. CTA
- Full-width closing section, background #F7F5F2, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Söhne, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #E4E0D8, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for agency if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built design/branding agency portfolio product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 963 — Retro-Futurist 80s — Design/Branding Agency Portfolio

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a design/branding agency portfolio ({{PRODUCT_CATEGORY}}). Art direction: retro-futurist 80s — sunset gradient, chrome grid horizon, VHS scanlines, synthwave palette. Production-ready, 100% responsive.

## TECH STACK
- Framework: Qwik City (resumability, no hydration cost)
- Styling: Tailwind CSS v4
- Animation: GSAP loaded via useVisibleTask$ only for above-fold, lazy for the rest
- Extra: Qwik's built-in image optimization
- Icons: lucide-qwik equivalent via inline SVG
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

### 3. Selected Work Gallery
- Grid of {{ITEM_1..6}} (capabilities), 4px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, GSAP loaded via useVisibleTask$ only for above-fold.

### 4. Capabilities
- Content driven by {{ITEM_1..6}}; layout and motion follow the Retro-Futurist 80s system (perspective CSS grid horizon (transform: perspective(500px) rotateX(60deg)) receding beneath the hero, sun gradient circle behind it).

### 5. Process
- Editorial numbered process list ({{PROCESS_STEP_1..5}}), each row revealing on scroll with a linear scanline drift 8s infinite, ease-out for content entrance, staggered 60ms per row.

### 6. Team
- Grid of people from {{TEAM_1..6}} (name, role, photo?); missing photos render an initials monogram in accent #FF6EC7, never a stock headshot.
- Section removed entirely if {{TEAM_1..6}} is empty.

### 7. CTA
- Full-width closing section, background #1A0B2E, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Space Grotesk, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #4A2472, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for agency if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built design/branding agency portfolio product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 964 — Y2K Cyber-Cute — Design/Branding Agency Portfolio

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a design/branding agency portfolio ({{PRODUCT_CATEGORY}}). Art direction: y2k cyber-cute — chrome bubbles, gradient blobs, glossy buttons, playful maximal energy. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: Tailwind CSS v4
- Animation: react-three-fiber + drei for the hero 3D scene, Framer Motion for DOM layers
- Extra: R3F scene code-split and lazy-loaded, CSS gradient fallback if WebGL unavailable
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

### 3. Selected Work Gallery
- Grid of {{ITEM_1..6}} (capabilities), 9999px on buttons, 32px on cards media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, react-three-fiber.

### 4. Capabilities
- Content driven by {{ITEM_1..6}}; layout and motion follow the Y2K Cyber-Cute system (glossy specular-highlight gradient buttons (radial-gradient white 10% at top-left), floating blob shapes drifting on scroll parallax).

### 5. Process
- Editorial numbered process list ({{PROCESS_STEP_1..5}}), each row revealing on scroll with a spring bounce (stiffness 300, damping 18) entrance, staggered 60ms per row.

### 6. Team
- Grid of people from {{TEAM_1..6}} (name, role, photo?); missing photos render an initials monogram in accent #7C5CFF, never a stock headshot.
- Section removed entirely if {{TEAM_1..6}} is empty.

### 7. CTA
- Full-width closing section, background #EAF2FF, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Poppins, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #C7DBFF, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for agency if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built design/branding agency portfolio product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 965 — Digital Laboratory — Design/Branding Agency Portfolio

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a design/branding agency portfolio ({{PRODUCT_CATEGORY}}). Art direction: digital laboratory — clinical white/blue, precise data grids, diagrammatic annotation lines. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router), React Server Components where possible
- Styling: Tailwind CSS v4 with @theme in globals.css
- Animation: Framer Motion (layout + scroll) + GSAP ScrollTrigger for pinned sequences
- Extra: Lenis for smooth scroll (lerp 0.07)
- Icons: Lucide React
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

### 3. Selected Work Gallery
- Grid of {{ITEM_1..6}} (capabilities), 6px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Framer Motion (layout + scroll).

### 4. Capabilities
- Content driven by {{ITEM_1..6}}; layout and motion follow the Digital Laboratory system (annotation leader-lines (SVG) connecting labels to UI elements, like a lab specimen diagram).

### 5. Process
- Editorial numbered process list ({{PROCESS_STEP_1..5}}), each row revealing on scroll with a ease 200ms, precise not playful entrance, staggered 60ms per row.

### 6. Team
- Grid of people from {{TEAM_1..6}} (name, role, photo?); missing photos render an initials monogram in accent #2E6FF2, never a stock headshot.
- Section removed entirely if {{TEAM_1..6}} is empty.

### 7. CTA
- Full-width closing section, background #101828, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in IBM Plex Sans, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #D7E1EE, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for agency if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built design/branding agency portfolio product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 966 — Terminal-Inspired CLI — Design/Branding Agency Portfolio

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a design/branding agency portfolio ({{PRODUCT_CATEGORY}}). Art direction: terminal-inspired cli — pure monospace, green/amber phosphor accent on black, blinking cursor motifs. Production-ready, 100% responsive.

## TECH STACK
- Framework: Qwik City (resumability, no hydration cost)
- Styling: Tailwind CSS v4
- Animation: GSAP loaded via useVisibleTask$ only for above-fold, lazy for the rest
- Extra: Qwik's built-in image optimization
- Icons: lucide-qwik equivalent via inline SVG
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

### 3. Selected Work Gallery
- Grid of {{ITEM_1..6}} (capabilities), 0px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, GSAP loaded via useVisibleTask$ only for above-fold.

### 4. Capabilities
- Content driven by {{ITEM_1..6}}; layout and motion follow the Terminal-Inspired CLI system (hero headline types itself out character-by-character with a blinking block cursor; every panel has a fake terminal titlebar with 3 dots).

### 5. Process
- Editorial numbered process list ({{PROCESS_STEP_1..5}}), each row revealing on scroll with a typewriter reveal, step-end steps(n) entrance, staggered 60ms per row.

### 6. Team
- Grid of people from {{TEAM_1..6}} (name, role, photo?); missing photos render an initials monogram in accent #39FF14, never a stock headshot.
- Section removed entirely if {{TEAM_1..6}} is empty.

### 7. CTA
- Full-width closing section, background #080A08, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in JetBrains Mono, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #1F261F, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for agency if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built design/branding agency portfolio product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 967 — Financial Terminal Dense — Design/Branding Agency Portfolio

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a design/branding agency portfolio ({{PRODUCT_CATEGORY}}). Art direction: financial terminal dense — black/near-black, tabular-nums everywhere, ticker rows, high information density. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: Tailwind CSS v4
- Animation: react-three-fiber + drei for the hero 3D scene, Framer Motion for DOM layers
- Extra: R3F scene code-split and lazy-loaded, CSS gradient fallback if WebGL unavailable
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

### 3. Selected Work Gallery
- Grid of {{ITEM_1..6}} (capabilities), 2px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, react-three-fiber.

### 4. Capabilities
- Content driven by {{ITEM_1..6}}; layout and motion follow the Financial Terminal Dense system (a live scrolling ticker row (marquee) of tabular-nums values that flash green/red on change, dense multi-column data tables).

### 5. Process
- Editorial numbered process list ({{PROCESS_STEP_1..5}}), each row revealing on scroll with a ease 150ms, numeric roll via CountUp only entrance, staggered 60ms per row.

### 6. Team
- Grid of people from {{TEAM_1..6}} (name, role, photo?); missing photos render an initials monogram in accent #00C853, never a stock headshot.
- Section removed entirely if {{TEAM_1..6}} is empty.

### 7. CTA
- Full-width closing section, background #000000, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in IBM Plex Sans, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #1E231E, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for agency if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built design/branding agency portfolio product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 968 — Magazine Grid — Design/Branding Agency Portfolio

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a design/branding agency portfolio ({{PRODUCT_CATEGORY}}). Art direction: magazine grid — multi-column editorial grid, drop caps, running heads, varied image sizes. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router), React Server Components where possible
- Styling: Tailwind CSS v4 with @theme in globals.css
- Animation: Framer Motion (layout + scroll) + GSAP ScrollTrigger for pinned sequences
- Extra: Lenis for smooth scroll (lerp 0.07)
- Icons: Lucide React
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

### 3. Selected Work Gallery
- Grid of {{ITEM_1..6}} (capabilities), 0px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Framer Motion (layout + scroll).

### 4. Capabilities
- Content driven by {{ITEM_1..6}}; layout and motion follow the Magazine Grid system (a masthead running head fixed at top (issue number, section name), first paragraph after each H2 gets a 3-line drop cap).

### 5. Process
- Editorial numbered process list ({{PROCESS_STEP_1..5}}), each row revealing on scroll with a ease-out 500ms crossfades between spreads entrance, staggered 60ms per row.

### 6. Team
- Grid of people from {{TEAM_1..6}} (name, role, photo?); missing photos render an initials monogram in accent #B0281C, never a stock headshot.
- Section removed entirely if {{TEAM_1..6}} is empty.

### 7. CTA
- Full-width closing section, background #181614, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Tiempos Text, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #DEDBD2, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for agency if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built design/branding agency portfolio product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 969 — High-Fashion Editorial — Design/Branding Agency Portfolio

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a design/branding agency portfolio ({{PRODUCT_CATEGORY}}). Art direction: high-fashion editorial — full-bleed monochrome photography, oversized condensed type, extreme minimalism. Production-ready, 100% responsive.

## TECH STACK
- Framework: Qwik City (resumability, no hydration cost)
- Styling: Tailwind CSS v4
- Animation: GSAP loaded via useVisibleTask$ only for above-fold, lazy for the rest
- Extra: Qwik's built-in image optimization
- Icons: lucide-qwik equivalent via inline SVG
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

### 3. Selected Work Gallery
- Grid of {{ITEM_1..6}} (capabilities), 0px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, GSAP loaded via useVisibleTask$ only for above-fold.

### 4. Capabilities
- Content driven by {{ITEM_1..6}}; layout and motion follow the High-Fashion Editorial system (full-viewport image bleeds with condensed vertical wordmark rotated -90deg pinned to the edge).

### 5. Process
- Editorial numbered process list ({{PROCESS_STEP_1..5}}), each row revealing on scroll with a ease 900ms, slow deliberate crossfades — never fast entrance, staggered 60ms per row.

### 6. Team
- Grid of people from {{TEAM_1..6}} (name, role, photo?); missing photos render an initials monogram in accent #FFFFFF, never a stock headshot.
- Section removed entirely if {{TEAM_1..6}} is empty.

### 7. CTA
- Full-width closing section, background #111111, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in PP Neue Montreal, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #2E2E2E, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for agency if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built design/branding agency portfolio product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 970 — Architectural Blueprint — Design/Branding Agency Portfolio

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a design/branding agency portfolio ({{PRODUCT_CATEGORY}}). Art direction: architectural blueprint — technical drawing aesthetic, thin precise lines, dimension annotations, cool blue-grey. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: Tailwind CSS v4
- Animation: react-three-fiber + drei for the hero 3D scene, Framer Motion for DOM layers
- Extra: R3F scene code-split and lazy-loaded, CSS gradient fallback if WebGL unavailable
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

### 3. Selected Work Gallery
- Grid of {{ITEM_1..6}} (capabilities), 0px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, react-three-fiber.

### 4. Capabilities
- Content driven by {{ITEM_1..6}}; layout and motion follow the Architectural Blueprint system (SVG dimension lines with arrow endpoints and measurement labels annotate key layout sections, as in a blueprint).

### 5. Process
- Editorial numbered process list ({{PROCESS_STEP_1..5}}), each row revealing on scroll with a ease 300ms, draws lines via stroke-dashoffset animation entrance, staggered 60ms per row.

### 6. Team
- Grid of people from {{TEAM_1..6}} (name, role, photo?); missing photos render an initials monogram in accent #1B4B91, never a stock headshot.
- Section removed entirely if {{TEAM_1..6}} is empty.

### 7. CTA
- Full-width closing section, background #F5F6F7, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Neue Haas Unica, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #C7CCD1, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for agency if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built design/branding agency portfolio product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 971 — Experimental Typography — Design/Branding Agency Portfolio

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a design/branding agency portfolio ({{PRODUCT_CATEGORY}}). Art direction: experimental typography — type as the primary graphic device — variable font weight/width driven by scroll or cursor. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router), React Server Components where possible
- Styling: Tailwind CSS v4 with @theme in globals.css
- Animation: Framer Motion (layout + scroll) + GSAP ScrollTrigger for pinned sequences
- Extra: Lenis for smooth scroll (lerp 0.07)
- Icons: Lucide React
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

### 3. Selected Work Gallery
- Grid of {{ITEM_1..6}} (capabilities), 0px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Framer Motion (layout + scroll).

### 4. Capabilities
- Content driven by {{ITEM_1..6}}; layout and motion follow the Experimental Typography system (headline font-variation-settings 'wght' and 'wdth' interpolate live with scroll velocity and cursor proximity per character).

### 5. Process
- Editorial numbered process list ({{PROCESS_STEP_1..5}}), each row revealing on scroll with a scroll-linked variable-font-variation-settings interpolation entrance, staggered 60ms per row.

### 6. Team
- Grid of people from {{TEAM_1..6}} (name, role, photo?); missing photos render an initials monogram in accent #E8FF59, never a stock headshot.
- Section removed entirely if {{TEAM_1..6}} is empty.

### 7. CTA
- Full-width closing section, background #111014, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Suisse Int'l, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #312E3B, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for agency if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built design/branding agency portfolio product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 972 — Data-Dense Analytics — Design/Branding Agency Portfolio

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a design/branding agency portfolio ({{PRODUCT_CATEGORY}}). Art direction: data-dense analytics — tight information density, small multiples, sparkline-everything, muted chart palette. Production-ready, 100% responsive.

## TECH STACK
- Framework: Qwik City (resumability, no hydration cost)
- Styling: Tailwind CSS v4
- Animation: GSAP loaded via useVisibleTask$ only for above-fold, lazy for the rest
- Extra: Qwik's built-in image optimization
- Icons: lucide-qwik equivalent via inline SVG
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

### 3. Selected Work Gallery
- Grid of {{ITEM_1..6}} (capabilities), 10px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, GSAP loaded via useVisibleTask$ only for above-fold.

### 4. Capabilities
- Content driven by {{ITEM_1..6}}; layout and motion follow the Data-Dense Analytics system (a grid of small-multiple sparkline cards, each with a live-updating value and a 30-day trend line drawn in SVG).

### 5. Process
- Editorial numbered process list ({{PROCESS_STEP_1..5}}), each row revealing on scroll with a ease 180ms, chart transitions via d3 interpolate entrance, staggered 60ms per row.

### 6. Team
- Grid of people from {{TEAM_1..6}} (name, role, photo?); missing photos render an initials monogram in accent #4C9AFF, never a stock headshot.
- Section removed entirely if {{TEAM_1..6}} is empty.

### 7. CTA
- Full-width closing section, background #0E1116, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Inter, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #262C36, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for agency if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built design/branding agency portfolio product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 973 — Corporate Premium Trust — Design/Branding Agency Portfolio

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a design/branding agency portfolio ({{PRODUCT_CATEGORY}}). Art direction: corporate premium trust — navy and white, generous whitespace, restrained gold accent, institutional confidence. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: Tailwind CSS v4
- Animation: react-three-fiber + drei for the hero 3D scene, Framer Motion for DOM layers
- Extra: R3F scene code-split and lazy-loaded, CSS gradient fallback if WebGL unavailable
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

### 3. Selected Work Gallery
- Grid of {{ITEM_1..6}} (capabilities), 10px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, react-three-fiber.

### 4. Capabilities
- Content driven by {{ITEM_1..6}}; layout and motion follow the Corporate Premium Trust system (a fixed trust-bar beneath the navbar listing certifications/regulator marks in small caps).

### 5. Process
- Editorial numbered process list ({{PROCESS_STEP_1..5}}), each row revealing on scroll with a ease-out 350ms, no playful overshoot entrance, staggered 60ms per row.

### 6. Team
- Grid of people from {{TEAM_1..6}} (name, role, photo?); missing photos render an initials monogram in accent #0F3D6E, never a stock headshot.
- Section removed entirely if {{TEAM_1..6}} is empty.

### 7. CTA
- Full-width closing section, background #0F1B2D, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Söhne, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #E1E6ED, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for agency if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built design/branding agency portfolio product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 974 — Playful Sophisticated — Design/Branding Agency Portfolio

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a design/branding agency portfolio ({{PRODUCT_CATEGORY}}). Art direction: playful sophisticated — bold single accent on cream, hand-tuned micro-illustrations, confident restraint with warmth. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router), React Server Components where possible
- Styling: Tailwind CSS v4 with @theme in globals.css
- Animation: Framer Motion (layout + scroll) + GSAP ScrollTrigger for pinned sequences
- Extra: Lenis for smooth scroll (lerp 0.07)
- Icons: Lucide React
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

### 3. Selected Work Gallery
- Grid of {{ITEM_1..6}} (capabilities), 18px media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, Framer Motion (layout + scroll).

### 4. Capabilities
- Content driven by {{ITEM_1..6}}; layout and motion follow the Playful Sophisticated system (small hand-drawn-style SVG accent marks (circles, arrows) that rotate/scale in as a section enters viewport).

### 5. Process
- Editorial numbered process list ({{PROCESS_STEP_1..5}}), each row revealing on scroll with a spring(220,20), playful but never chaotic entrance, staggered 60ms per row.

### 6. Team
- Grid of people from {{TEAM_1..6}} (name, role, photo?); missing photos render an initials monogram in accent #FF5A36, never a stock headshot.
- Section removed entirely if {{TEAM_1..6}} is empty.

### 7. CTA
- Full-width closing section, background #FFF8EF, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in General Sans, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #F0E4D0, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for agency if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built design/branding agency portfolio product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 975 — Organic Earth — Design/Branding Agency Portfolio

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a design/branding agency portfolio ({{PRODUCT_CATEGORY}}). Art direction: organic earth — clay, moss and sand tones, blob/curve shapes, natural texture, calm pacing. Production-ready, 100% responsive.

## TECH STACK
- Framework: Qwik City (resumability, no hydration cost)
- Styling: Tailwind CSS v4
- Animation: GSAP loaded via useVisibleTask$ only for above-fold, lazy for the rest
- Extra: Qwik's built-in image optimization
- Icons: lucide-qwik equivalent via inline SVG
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

### 3. Selected Work Gallery
- Grid of {{ITEM_1..6}} (capabilities), 40% organic blob clip-paths on media media frames; if fewer than 3 items are supplied the grid collapses to a single-column editorial list rather than showing empty slots.
- Hover/focus: media scales 1.0->1.04 over 400ms ease-out, caption slides up from 8px with a 120ms delay.
- Filtering (if {{FILTER_TAXONOMY}} supplied): filter pills update the grid via a FLIP layout transition, GSAP loaded via useVisibleTask$ only for above-fold.

### 4. Capabilities
- Content driven by {{ITEM_1..6}}; layout and motion follow the Organic Earth system (organic blob-shaped SVG clip-paths frame every image, morphing slightly on scroll (clip-path interpolation)).

### 5. Process
- Editorial numbered process list ({{PROCESS_STEP_1..5}}), each row revealing on scroll with a ease-in-out 700ms, slow drift entrance, staggered 60ms per row.

### 6. Team
- Grid of people from {{TEAM_1..6}} (name, role, photo?); missing photos render an initials monogram in accent #5B6E4F, never a stock headshot.
- Section removed entirely if {{TEAM_1..6}} is empty.

### 7. CTA
- Full-width closing section, background #F3EEE4, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Newsreader, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #D8CBAE, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for agency if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built design/branding agency portfolio product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 976 — Swiss Brutalist Monochrome — Tech Conference / Industry Event

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a tech conference / industry event ({{PRODUCT_CATEGORY}}). Art direction: swiss brutalist monochrome — raw grid discipline, oversized type as the only ornament, zero decorative imagery. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router), React Server Components where possible
- Styling: Tailwind CSS v4 with @theme in globals.css
- Animation: Framer Motion (layout + scroll) + GSAP ScrollTrigger for pinned sequences
- Extra: Lenis for smooth scroll (lerp 0.07)
- Icons: Lucide React
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

### 2. Hero / Countdown
- Full-viewport, min-h-screen composition built around full-bleed horizontal marquee statement + numbered editorial list rows.
- H1 "{{HERO_HEADLINE}}" set in Neue Haas Grotesk Display, clamp(2.75rem, 7vw, 5.5rem); entrance timed to power4.out / cubic-bezier(0.16,1,0.3,1), no linear.
- Sub-headline "{{VALUE_PROP}}" in Neue Haas Grotesk Text, max-w-xl, color #7A7A78.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #0B0B0B) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Swiss Brutalist Monochrome palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #F2F2F0 until onLoad fires.
- Countdown to {{EVENT_DATE}}: tabular-nums digits with a 1s tick + digit-roll animation (outgoing y -12/opacity 0, incoming y 12->0).

### 3. Schedule / Tracks
- Tabbed/day-based schedule grid from {{SCHEDULE_ITEMS}}, each row with time, title, track tag; sticky time-rail on desktop.

### 4. Speakers
- Grid of people from {{TEAM_1..6}} (name, role, photo?); missing photos render an initials monogram in accent #0B0B0B, never a stock headshot.
- Section removed entirely if {{TEAM_1..6}} is empty.

### 5. Venue / Travel
- Venue details, embedded map, and travel logistics from {{VENUE_INFO}}; omitted gracefully if not supplied.

### 6. Ticket Tiers
- Ticket tiers from {{PRICING_TIERS}} with availability state (available/limited/sold out) reflected in both color and text label -- never color alone.

### 7. CTA
- Full-width closing section, background #0B0B0B, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Neue Haas Grotesk Text, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #DEDEDA, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for events if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built tech conference / industry event product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 977 — Aurora Glassmorphism — Tech Conference / Industry Event

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a tech conference / industry event ({{PRODUCT_CATEGORY}}). Art direction: aurora glassmorphism — deep space backdrop, drifting light fields, frosted translucent surfaces. Production-ready, 100% responsive.

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

### 2. Hero / Countdown
- Full-viewport, min-h-screen composition built around three desynced radial-gradient blobs + backdrop-blur(24px) glass recipe reused everywhere.
- H1 "{{HERO_HEADLINE}}" set in General Sans, clamp(2.75rem, 7vw, 5.5rem); entrance timed to [0.16,1,0.3,1], slow ambient CSS keyframe loops.
- Sub-headline "{{VALUE_PROP}}" in Inter, max-w-xl, color #8A92A6.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #6E56F8) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Aurora Glassmorphism palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in rgba(255,255,255,0.04) until onLoad fires.
- Countdown to {{EVENT_DATE}}: tabular-nums digits with a 1s tick + digit-roll animation (outgoing y -12/opacity 0, incoming y 12->0).

### 3. Schedule / Tracks
- Tabbed/day-based schedule grid from {{SCHEDULE_ITEMS}}, each row with time, title, track tag; sticky time-rail on desktop.

### 4. Speakers
- Grid of people from {{TEAM_1..6}} (name, role, photo?); missing photos render an initials monogram in accent #6E56F8, never a stock headshot.
- Section removed entirely if {{TEAM_1..6}} is empty.

### 5. Venue / Travel
- Venue details, embedded map, and travel logistics from {{VENUE_INFO}}; omitted gracefully if not supplied.

### 6. Ticket Tiers
- Ticket tiers from {{PRICING_TIERS}} with availability state (available/limited/sold out) reflected in both color and text label -- never color alone.

### 7. CTA
- Full-width closing section, background #05060B, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Inter, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at rgba(255,255,255,0.09), copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for events if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built tech conference / industry event product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 978 — Neo-Brutalist Pop — Tech Conference / Industry Event

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a tech conference / industry event ({{PRODUCT_CATEGORY}}). Art direction: neo-brutalist pop — thick black outlines, flat saturated blocks, deliberately raw hard shadows, no gradients. Production-ready, 100% responsive.

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

### 2. Hero / Countdown
- Full-viewport, min-h-screen composition built around hard offset shadow (8px 8px 0 #111) that flattens to 0 0 0 on press, thick 3px borders on every block.
- H1 "{{HERO_HEADLINE}}" set in Archivo Black, clamp(2.75rem, 7vw, 5.5rem); entrance timed to steps() and abrupt cubic-bezier(0.68,-0.55,0.27,1.55) overshoot.
- Sub-headline "{{VALUE_PROP}}" in Archivo, max-w-xl, color #5B564E.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #FF4D2E) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Neo-Brutalist Pop palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #FFFFFF until onLoad fires.
- Countdown to {{EVENT_DATE}}: tabular-nums digits with a 1s tick + digit-roll animation (outgoing y -12/opacity 0, incoming y 12->0).

### 3. Schedule / Tracks
- Tabbed/day-based schedule grid from {{SCHEDULE_ITEMS}}, each row with time, title, track tag; sticky time-rail on desktop.

### 4. Speakers
- Grid of people from {{TEAM_1..6}} (name, role, photo?); missing photos render an initials monogram in accent #FF4D2E, never a stock headshot.
- Section removed entirely if {{TEAM_1..6}} is empty.

### 5. Venue / Travel
- Venue details, embedded map, and travel logistics from {{VENUE_INFO}}; omitted gracefully if not supplied.

### 6. Ticket Tiers
- Ticket tiers from {{PRICING_TIERS}} with availability state (available/limited/sold out) reflected in both color and text label -- never color alone.

### 7. CTA
- Full-width closing section, background #FDF6EC, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Archivo, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #111111, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for events if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built tech conference / industry event product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 979 — Editorial Serif Luxury — Tech Conference / Industry Event

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a tech conference / industry event ({{PRODUCT_CATEGORY}}). Art direction: editorial serif luxury — magazine-grade serif display type, generous margins, restrained color, photography-led. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router), React Server Components where possible
- Styling: Tailwind CSS v4 with @theme in globals.css
- Animation: Framer Motion (layout + scroll) + GSAP ScrollTrigger for pinned sequences
- Extra: Lenis for smooth scroll (lerp 0.07)
- Icons: Lucide React
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

### 2. Hero / Countdown
- Full-viewport, min-h-screen composition built around asymmetric editorial grid with pull-quotes and a running folio/issue number.
- H1 "{{HERO_HEADLINE}}" set in Canela / GT Sectra, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease-out, 600-900ms, understated crossfades.
- Sub-headline "{{VALUE_PROP}}" in Söhne, max-w-xl, color #8A8175.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #7A2E2E) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Editorial Serif Luxury palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #F1EDE6 until onLoad fires.
- Countdown to {{EVENT_DATE}}: tabular-nums digits with a 1s tick + digit-roll animation (outgoing y -12/opacity 0, incoming y 12->0).

### 3. Schedule / Tracks
- Tabbed/day-based schedule grid from {{SCHEDULE_ITEMS}}, each row with time, title, track tag; sticky time-rail on desktop.

### 4. Speakers
- Grid of people from {{TEAM_1..6}} (name, role, photo?); missing photos render an initials monogram in accent #7A2E2E, never a stock headshot.
- Section removed entirely if {{TEAM_1..6}} is empty.

### 5. Venue / Travel
- Venue details, embedded map, and travel logistics from {{VENUE_INFO}}; omitted gracefully if not supplied.

### 6. Ticket Tiers
- Ticket tiers from {{PRICING_TIERS}} with availability state (available/limited/sold out) reflected in both color and text label -- never color alone.

### 7. CTA
- Full-width closing section, background #FBF9F6, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Söhne, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #E3DCD0, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for events if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built tech conference / industry event product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 980 — Dark Technical Console — Tech Conference / Industry Event

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a tech conference / industry event ({{PRODUCT_CATEGORY}}). Art direction: dark technical console — near-black canvas, monospace accents, data-dense panels, engineering credibility. Production-ready, 100% responsive.

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

### 2. Hero / Countdown
- Full-viewport, min-h-screen composition built around live-updating metric tiles with tabular-nums CountUp and a terminal-style command block.
- H1 "{{HERO_HEADLINE}}" set in Inter Tight, clamp(2.75rem, 7vw, 5.5rem); entrance timed to 150-250ms ease, no bounce.
- Sub-headline "{{VALUE_PROP}}" in Inter, max-w-xl, color #7C838F.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #5EEAD4) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Dark Technical Console palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #12151B until onLoad fires.
- Countdown to {{EVENT_DATE}}: tabular-nums digits with a 1s tick + digit-roll animation (outgoing y -12/opacity 0, incoming y 12->0).

### 3. Schedule / Tracks
- Tabbed/day-based schedule grid from {{SCHEDULE_ITEMS}}, each row with time, title, track tag; sticky time-rail on desktop.

### 4. Speakers
- Grid of people from {{TEAM_1..6}} (name, role, photo?); missing photos render an initials monogram in accent #5EEAD4, never a stock headshot.
- Section removed entirely if {{TEAM_1..6}} is empty.

### 5. Venue / Travel
- Venue details, embedded map, and travel logistics from {{VENUE_INFO}}; omitted gracefully if not supplied.

### 6. Ticket Tiers
- Ticket tiers from {{PRICING_TIERS}} with availability state (available/limited/sold out) reflected in both color and text label -- never color alone.

### 7. CTA
- Full-width closing section, background #0A0C10, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Inter, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #22262E, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for events if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built tech conference / industry event product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 981 — Cyberpunk Neon — Tech Conference / Industry Event

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a tech conference / industry event ({{PRODUCT_CATEGORY}}). Art direction: cyberpunk neon — black canvas, saturated magenta/cyan neon, glitch accents, dense HUD framing. Production-ready, 100% responsive.

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

### 2. Hero / Countdown
- Full-viewport, min-h-screen composition built around scanline + chromatic-aberration text-shadow on the H1, HUD corner brackets on every panel.
- H1 "{{HERO_HEADLINE}}" set in Rajdhani, clamp(2.75rem, 7vw, 5.5rem); entrance timed to glitch keyframe (translate jitter 2px, 80ms) on hover only.
- Sub-headline "{{VALUE_PROP}}" in Space Grotesk, max-w-xl, color #8B8BA7.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #FF2E9A) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Cyberpunk Neon palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #0E0E16 until onLoad fires.
- Countdown to {{EVENT_DATE}}: tabular-nums digits with a 1s tick + digit-roll animation (outgoing y -12/opacity 0, incoming y 12->0).

### 3. Schedule / Tracks
- Tabbed/day-based schedule grid from {{SCHEDULE_ITEMS}}, each row with time, title, track tag; sticky time-rail on desktop.

### 4. Speakers
- Grid of people from {{TEAM_1..6}} (name, role, photo?); missing photos render an initials monogram in accent #FF2E9A, never a stock headshot.
- Section removed entirely if {{TEAM_1..6}} is empty.

### 5. Venue / Travel
- Venue details, embedded map, and travel logistics from {{VENUE_INFO}}; omitted gracefully if not supplied.

### 6. Ticket Tiers
- Ticket tiers from {{PRICING_TIERS}} with availability state (available/limited/sold out) reflected in both color and text label -- never color alone.

### 7. CTA
- Full-width closing section, background #050508, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Space Grotesk, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #2A2A3D, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for events if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built tech conference / industry event product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 982 — Industrial Utilitarian — Tech Conference / Industry Event

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a tech conference / industry event ({{PRODUCT_CATEGORY}}). Art direction: industrial utilitarian — concrete and steel palette, exposed grid lines, stenciled labels, function over decoration. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router), React Server Components where possible
- Styling: Tailwind CSS v4 with @theme in globals.css
- Animation: Framer Motion (layout + scroll) + GSAP ScrollTrigger for pinned sequences
- Extra: Lenis for smooth scroll (lerp 0.07)
- Icons: Lucide React
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

### 2. Hero / Countdown
- Full-viewport, min-h-screen composition built around visible grid lines (1px --border) drawn across the full viewport as a permanent underlay, stenciled uppercase section labels with dot-leaders.
- H1 "{{HERO_HEADLINE}}" set in Suisse Int'l Mono, clamp(2.75rem, 7vw, 5.5rem); entrance timed to linear 200ms for mechanical feel on toggles only, ease-out elsewhere.
- Sub-headline "{{VALUE_PROP}}" in Suisse Int'l, max-w-xl, color #6B675E.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #C9491C) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Industrial Utilitarian palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #DCDAD3 until onLoad fires.
- Countdown to {{EVENT_DATE}}: tabular-nums digits with a 1s tick + digit-roll animation (outgoing y -12/opacity 0, incoming y 12->0).

### 3. Schedule / Tracks
- Tabbed/day-based schedule grid from {{SCHEDULE_ITEMS}}, each row with time, title, track tag; sticky time-rail on desktop.

### 4. Speakers
- Grid of people from {{TEAM_1..6}} (name, role, photo?); missing photos render an initials monogram in accent #C9491C, never a stock headshot.
- Section removed entirely if {{TEAM_1..6}} is empty.

### 5. Venue / Travel
- Venue details, embedded map, and travel logistics from {{VENUE_INFO}}; omitted gracefully if not supplied.

### 6. Ticket Tiers
- Ticket tiers from {{PRICING_TIERS}} with availability state (available/limited/sold out) reflected in both color and text label -- never color alone.

### 7. CTA
- Full-width closing section, background #EDECE8, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Suisse Int'l, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #B7B4AA, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for events if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built tech conference / industry event product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 983 — Futuristic Chrome — Tech Conference / Industry Event

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a tech conference / industry event ({{PRODUCT_CATEGORY}}). Art direction: futuristic chrome — liquid chrome gradients, specular highlights, cool metallic palette, motion-first. Production-ready, 100% responsive.

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

### 2. Hero / Countdown
- Full-viewport, min-h-screen composition built around specular chrome gradient sweeping across headline on scroll (background-position tied to scrollYProgress).
- H1 "{{HERO_HEADLINE}}" set in Space Grotesk, clamp(2.75rem, 7vw, 5.5rem); entrance timed to spring(stiffness 220, damping 26) via Framer Motion.
- Sub-headline "{{VALUE_PROP}}" in Inter, max-w-xl, color #9AA1AF.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #7DD3FC) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Futuristic Chrome palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #151821 until onLoad fires.
- Countdown to {{EVENT_DATE}}: tabular-nums digits with a 1s tick + digit-roll animation (outgoing y -12/opacity 0, incoming y 12->0).

### 3. Schedule / Tracks
- Tabbed/day-based schedule grid from {{SCHEDULE_ITEMS}}, each row with time, title, track tag; sticky time-rail on desktop.

### 4. Speakers
- Grid of people from {{TEAM_1..6}} (name, role, photo?); missing photos render an initials monogram in accent #7DD3FC, never a stock headshot.
- Section removed entirely if {{TEAM_1..6}} is empty.

### 5. Venue / Travel
- Venue details, embedded map, and travel logistics from {{VENUE_INFO}}; omitted gracefully if not supplied.

### 6. Ticket Tiers
- Ticket tiers from {{PRICING_TIERS}} with availability state (available/limited/sold out) reflected in both color and text label -- never color alone.

### 7. CTA
- Full-width closing section, background #0B0D12, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Inter, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #2B2F3A, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for events if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built tech conference / industry event product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 984 — Soft Minimal Warmth — Tech Conference / Industry Event

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a tech conference / industry event ({{PRODUCT_CATEGORY}}). Art direction: soft minimal warmth — warm off-white, generous air, soft shadows, rounded forms, low-contrast restraint. Production-ready, 100% responsive.

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

### 2. Hero / Countdown
- Full-viewport, min-h-screen composition built around soft double-layer drop shadow (0 1px 2px + 0 12px 24px at 6%) on every raised surface, no borders — light does the separating.
- H1 "{{HERO_HEADLINE}}" set in Fraunces, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease-out 400-600ms, gentle y:12→0 reveals.
- Sub-headline "{{VALUE_PROP}}" in Inter, max-w-xl, color #928C80.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #D97757) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Soft Minimal Warmth palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #FFFFFF until onLoad fires.
- Countdown to {{EVENT_DATE}}: tabular-nums digits with a 1s tick + digit-roll animation (outgoing y -12/opacity 0, incoming y 12->0).

### 3. Schedule / Tracks
- Tabbed/day-based schedule grid from {{SCHEDULE_ITEMS}}, each row with time, title, track tag; sticky time-rail on desktop.

### 4. Speakers
- Grid of people from {{TEAM_1..6}} (name, role, photo?); missing photos render an initials monogram in accent #D97757, never a stock headshot.
- Section removed entirely if {{TEAM_1..6}} is empty.

### 5. Venue / Travel
- Venue details, embedded map, and travel logistics from {{VENUE_INFO}}; omitted gracefully if not supplied.

### 6. Ticket Tiers
- Ticket tiers from {{PRICING_TIERS}} with availability state (available/limited/sold out) reflected in both color and text label -- never color alone.

### 7. CTA
- Full-width closing section, background #FAF7F2, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Inter, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #ECE6DC, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for events if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built tech conference / industry event product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 985 — Art Deco Revival — Tech Conference / Industry Event

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a tech conference / industry event ({{PRODUCT_CATEGORY}}). Art direction: art deco revival — gold on deep emerald/black, geometric fan and sunburst motifs, symmetrical ornament. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router), React Server Components where possible
- Styling: Tailwind CSS v4 with @theme in globals.css
- Animation: Framer Motion (layout + scroll) + GSAP ScrollTrigger for pinned sequences
- Extra: Lenis for smooth scroll (lerp 0.07)
- Icons: Lucide React
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

### 2. Hero / Countdown
- Full-viewport, min-h-screen composition built around repeating SVG sunburst/fan motif as section dividers, gold 1px double-rule borders.
- H1 "{{HERO_HEADLINE}}" set in Poiret One / Cinzel, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease-in-out 700ms, symmetrical mirrored reveals.
- Sub-headline "{{VALUE_PROP}}" in Cormorant, max-w-xl, color #9FB5A8.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #C9A96A) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Art Deco Revival palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #122019 until onLoad fires.
- Countdown to {{EVENT_DATE}}: tabular-nums digits with a 1s tick + digit-roll animation (outgoing y -12/opacity 0, incoming y 12->0).

### 3. Schedule / Tracks
- Tabbed/day-based schedule grid from {{SCHEDULE_ITEMS}}, each row with time, title, track tag; sticky time-rail on desktop.

### 4. Speakers
- Grid of people from {{TEAM_1..6}} (name, role, photo?); missing photos render an initials monogram in accent #C9A96A, never a stock headshot.
- Section removed entirely if {{TEAM_1..6}} is empty.

### 5. Venue / Travel
- Venue details, embedded map, and travel logistics from {{VENUE_INFO}}; omitted gracefully if not supplied.

### 6. Ticket Tiers
- Ticket tiers from {{PRICING_TIERS}} with availability state (available/limited/sold out) reflected in both color and text label -- never color alone.

### 7. CTA
- Full-width closing section, background #0D1512, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Cormorant, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #B8935A, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for events if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built tech conference / industry event product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 986 — Japanese Minimal (Ma) — Tech Conference / Industry Event

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a tech conference / industry event ({{PRODUCT_CATEGORY}}). Art direction: japanese minimal (ma) — extreme negative space, single accent stroke, vertical rhythm, quiet confidence. Production-ready, 100% responsive.

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

### 2. Hero / Countdown
- Full-viewport, min-h-screen composition built around a single vertical hairline rule tracks scroll progress along the left margin; content occupies at most 60% of viewport width.
- H1 "{{HERO_HEADLINE}}" set in Zen Old Mincho / Shippori Mincho, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease 800ms, single elements move — never groups at once.
- Sub-headline "{{VALUE_PROP}}" in Noto Sans JP fallback / Inter, max-w-xl, color #8D8B84.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #C1121F) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Japanese Minimal (Ma) palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #F5F4F0 until onLoad fires.
- Countdown to {{EVENT_DATE}}: tabular-nums digits with a 1s tick + digit-roll animation (outgoing y -12/opacity 0, incoming y 12->0).

### 3. Schedule / Tracks
- Tabbed/day-based schedule grid from {{SCHEDULE_ITEMS}}, each row with time, title, track tag; sticky time-rail on desktop.

### 4. Speakers
- Grid of people from {{TEAM_1..6}} (name, role, photo?); missing photos render an initials monogram in accent #C1121F, never a stock headshot.
- Section removed entirely if {{TEAM_1..6}} is empty.

### 5. Venue / Travel
- Venue details, embedded map, and travel logistics from {{VENUE_INFO}}; omitted gracefully if not supplied.

### 6. Ticket Tiers
- Ticket tiers from {{PRICING_TIERS}} with availability state (available/limited/sold out) reflected in both color and text label -- never color alone.

### 7. CTA
- Full-width closing section, background #FCFCFA, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Noto Sans JP fallback / Inter, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #E2E0D8, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for events if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built tech conference / industry event product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 987 — Scandinavian Functional — Tech Conference / Industry Event

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a tech conference / industry event ({{PRODUCT_CATEGORY}}). Art direction: scandinavian functional — light wood-neutral palette, clean sans type, function-led hierarchy, quiet confidence. Production-ready, 100% responsive.

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

### 2. Hero / Countdown
- Full-viewport, min-h-screen composition built around consistent 8pt spacing scale exposed as visible rhythm between hairline-separated blocks.
- H1 "{{HERO_HEADLINE}}" set in Söhne, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease-out 300ms, no overshoot.
- Sub-headline "{{VALUE_PROP}}" in Söhne, max-w-xl, color #7D7A72.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #3E6259) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Scandinavian Functional palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #FFFFFF until onLoad fires.
- Countdown to {{EVENT_DATE}}: tabular-nums digits with a 1s tick + digit-roll animation (outgoing y -12/opacity 0, incoming y 12->0).

### 3. Schedule / Tracks
- Tabbed/day-based schedule grid from {{SCHEDULE_ITEMS}}, each row with time, title, track tag; sticky time-rail on desktop.

### 4. Speakers
- Grid of people from {{TEAM_1..6}} (name, role, photo?); missing photos render an initials monogram in accent #3E6259, never a stock headshot.
- Section removed entirely if {{TEAM_1..6}} is empty.

### 5. Venue / Travel
- Venue details, embedded map, and travel logistics from {{VENUE_INFO}}; omitted gracefully if not supplied.

### 6. Ticket Tiers
- Ticket tiers from {{PRICING_TIERS}} with availability state (available/limited/sold out) reflected in both color and text label -- never color alone.

### 7. CTA
- Full-width closing section, background #F7F5F2, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Söhne, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #E4E0D8, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for events if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built tech conference / industry event product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 988 — Retro-Futurist 80s — Tech Conference / Industry Event

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a tech conference / industry event ({{PRODUCT_CATEGORY}}). Art direction: retro-futurist 80s — sunset gradient, chrome grid horizon, VHS scanlines, synthwave palette. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router), React Server Components where possible
- Styling: Tailwind CSS v4 with @theme in globals.css
- Animation: Framer Motion (layout + scroll) + GSAP ScrollTrigger for pinned sequences
- Extra: Lenis for smooth scroll (lerp 0.07)
- Icons: Lucide React
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

### 2. Hero / Countdown
- Full-viewport, min-h-screen composition built around perspective CSS grid horizon (transform: perspective(500px) rotateX(60deg)) receding beneath the hero, sun gradient circle behind it.
- H1 "{{HERO_HEADLINE}}" set in Righteous, clamp(2.75rem, 7vw, 5.5rem); entrance timed to linear scanline drift 8s infinite, ease-out for content.
- Sub-headline "{{VALUE_PROP}}" in Space Grotesk, max-w-xl, color #B79BD6.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #FF6EC7) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Retro-Futurist 80s palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #26123F until onLoad fires.
- Countdown to {{EVENT_DATE}}: tabular-nums digits with a 1s tick + digit-roll animation (outgoing y -12/opacity 0, incoming y 12->0).

### 3. Schedule / Tracks
- Tabbed/day-based schedule grid from {{SCHEDULE_ITEMS}}, each row with time, title, track tag; sticky time-rail on desktop.

### 4. Speakers
- Grid of people from {{TEAM_1..6}} (name, role, photo?); missing photos render an initials monogram in accent #FF6EC7, never a stock headshot.
- Section removed entirely if {{TEAM_1..6}} is empty.

### 5. Venue / Travel
- Venue details, embedded map, and travel logistics from {{VENUE_INFO}}; omitted gracefully if not supplied.

### 6. Ticket Tiers
- Ticket tiers from {{PRICING_TIERS}} with availability state (available/limited/sold out) reflected in both color and text label -- never color alone.

### 7. CTA
- Full-width closing section, background #1A0B2E, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Space Grotesk, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #4A2472, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for events if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built tech conference / industry event product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 989 — Y2K Cyber-Cute — Tech Conference / Industry Event

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a tech conference / industry event ({{PRODUCT_CATEGORY}}). Art direction: y2k cyber-cute — chrome bubbles, gradient blobs, glossy buttons, playful maximal energy. Production-ready, 100% responsive.

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

### 2. Hero / Countdown
- Full-viewport, min-h-screen composition built around glossy specular-highlight gradient buttons (radial-gradient white 10% at top-left), floating blob shapes drifting on scroll parallax.
- H1 "{{HERO_HEADLINE}}" set in Chakra Petch, clamp(2.75rem, 7vw, 5.5rem); entrance timed to spring bounce (stiffness 300, damping 18).
- Sub-headline "{{VALUE_PROP}}" in Poppins, max-w-xl, color #5C6B8C.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #7C5CFF) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Y2K Cyber-Cute palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #FFFFFF until onLoad fires.
- Countdown to {{EVENT_DATE}}: tabular-nums digits with a 1s tick + digit-roll animation (outgoing y -12/opacity 0, incoming y 12->0).

### 3. Schedule / Tracks
- Tabbed/day-based schedule grid from {{SCHEDULE_ITEMS}}, each row with time, title, track tag; sticky time-rail on desktop.

### 4. Speakers
- Grid of people from {{TEAM_1..6}} (name, role, photo?); missing photos render an initials monogram in accent #7C5CFF, never a stock headshot.
- Section removed entirely if {{TEAM_1..6}} is empty.

### 5. Venue / Travel
- Venue details, embedded map, and travel logistics from {{VENUE_INFO}}; omitted gracefully if not supplied.

### 6. Ticket Tiers
- Ticket tiers from {{PRICING_TIERS}} with availability state (available/limited/sold out) reflected in both color and text label -- never color alone.

### 7. CTA
- Full-width closing section, background #EAF2FF, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Poppins, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #C7DBFF, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for events if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built tech conference / industry event product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 990 — Digital Laboratory — Tech Conference / Industry Event

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a tech conference / industry event ({{PRODUCT_CATEGORY}}). Art direction: digital laboratory — clinical white/blue, precise data grids, diagrammatic annotation lines. Production-ready, 100% responsive.

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

### 2. Hero / Countdown
- Full-viewport, min-h-screen composition built around annotation leader-lines (SVG) connecting labels to UI elements, like a lab specimen diagram.
- H1 "{{HERO_HEADLINE}}" set in IBM Plex Sans, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease 200ms, precise not playful.
- Sub-headline "{{VALUE_PROP}}" in IBM Plex Sans, max-w-xl, color #667085.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #2E6FF2) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Digital Laboratory palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #F4F7FB until onLoad fires.
- Countdown to {{EVENT_DATE}}: tabular-nums digits with a 1s tick + digit-roll animation (outgoing y -12/opacity 0, incoming y 12->0).

### 3. Schedule / Tracks
- Tabbed/day-based schedule grid from {{SCHEDULE_ITEMS}}, each row with time, title, track tag; sticky time-rail on desktop.

### 4. Speakers
- Grid of people from {{TEAM_1..6}} (name, role, photo?); missing photos render an initials monogram in accent #2E6FF2, never a stock headshot.
- Section removed entirely if {{TEAM_1..6}} is empty.

### 5. Venue / Travel
- Venue details, embedded map, and travel logistics from {{VENUE_INFO}}; omitted gracefully if not supplied.

### 6. Ticket Tiers
- Ticket tiers from {{PRICING_TIERS}} with availability state (available/limited/sold out) reflected in both color and text label -- never color alone.

### 7. CTA
- Full-width closing section, background #101828, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in IBM Plex Sans, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #D7E1EE, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for events if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built tech conference / industry event product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 991 — Terminal-Inspired CLI — Tech Conference / Industry Event

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a tech conference / industry event ({{PRODUCT_CATEGORY}}). Art direction: terminal-inspired cli — pure monospace, green/amber phosphor accent on black, blinking cursor motifs. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router), React Server Components where possible
- Styling: Tailwind CSS v4 with @theme in globals.css
- Animation: Framer Motion (layout + scroll) + GSAP ScrollTrigger for pinned sequences
- Extra: Lenis for smooth scroll (lerp 0.07)
- Icons: Lucide React
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

### 2. Hero / Countdown
- Full-viewport, min-h-screen composition built around hero headline types itself out character-by-character with a blinking block cursor; every panel has a fake terminal titlebar with 3 dots.
- H1 "{{HERO_HEADLINE}}" set in JetBrains Mono, clamp(2.75rem, 7vw, 5.5rem); entrance timed to typewriter reveal, step-end steps(n).
- Sub-headline "{{VALUE_PROP}}" in JetBrains Mono, max-w-xl, color #6B8F6B.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #39FF14) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Terminal-Inspired CLI palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #0F120F until onLoad fires.
- Countdown to {{EVENT_DATE}}: tabular-nums digits with a 1s tick + digit-roll animation (outgoing y -12/opacity 0, incoming y 12->0).

### 3. Schedule / Tracks
- Tabbed/day-based schedule grid from {{SCHEDULE_ITEMS}}, each row with time, title, track tag; sticky time-rail on desktop.

### 4. Speakers
- Grid of people from {{TEAM_1..6}} (name, role, photo?); missing photos render an initials monogram in accent #39FF14, never a stock headshot.
- Section removed entirely if {{TEAM_1..6}} is empty.

### 5. Venue / Travel
- Venue details, embedded map, and travel logistics from {{VENUE_INFO}}; omitted gracefully if not supplied.

### 6. Ticket Tiers
- Ticket tiers from {{PRICING_TIERS}} with availability state (available/limited/sold out) reflected in both color and text label -- never color alone.

### 7. CTA
- Full-width closing section, background #080A08, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in JetBrains Mono, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #1F261F, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for events if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built tech conference / industry event product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 992 — Financial Terminal Dense — Tech Conference / Industry Event

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a tech conference / industry event ({{PRODUCT_CATEGORY}}). Art direction: financial terminal dense — black/near-black, tabular-nums everywhere, ticker rows, high information density. Production-ready, 100% responsive.

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

### 2. Hero / Countdown
- Full-viewport, min-h-screen composition built around a live scrolling ticker row (marquee) of tabular-nums values that flash green/red on change, dense multi-column data tables.
- H1 "{{HERO_HEADLINE}}" set in IBM Plex Mono, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease 150ms, numeric roll via CountUp only.
- Sub-headline "{{VALUE_PROP}}" in IBM Plex Sans, max-w-xl, color #7C867C.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #00C853) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Financial Terminal Dense palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #0C0F0C until onLoad fires.
- Countdown to {{EVENT_DATE}}: tabular-nums digits with a 1s tick + digit-roll animation (outgoing y -12/opacity 0, incoming y 12->0).

### 3. Schedule / Tracks
- Tabbed/day-based schedule grid from {{SCHEDULE_ITEMS}}, each row with time, title, track tag; sticky time-rail on desktop.

### 4. Speakers
- Grid of people from {{TEAM_1..6}} (name, role, photo?); missing photos render an initials monogram in accent #00C853, never a stock headshot.
- Section removed entirely if {{TEAM_1..6}} is empty.

### 5. Venue / Travel
- Venue details, embedded map, and travel logistics from {{VENUE_INFO}}; omitted gracefully if not supplied.

### 6. Ticket Tiers
- Ticket tiers from {{PRICING_TIERS}} with availability state (available/limited/sold out) reflected in both color and text label -- never color alone.

### 7. CTA
- Full-width closing section, background #000000, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in IBM Plex Sans, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #1E231E, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for events if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built tech conference / industry event product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 993 — Magazine Grid — Tech Conference / Industry Event

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a tech conference / industry event ({{PRODUCT_CATEGORY}}). Art direction: magazine grid — multi-column editorial grid, drop caps, running heads, varied image sizes. Production-ready, 100% responsive.

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

### 2. Hero / Countdown
- Full-viewport, min-h-screen composition built around a masthead running head fixed at top (issue number, section name), first paragraph after each H2 gets a 3-line drop cap.
- H1 "{{HERO_HEADLINE}}" set in Tiempos Headline, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease-out 500ms crossfades between spreads.
- Sub-headline "{{VALUE_PROP}}" in Tiempos Text, max-w-xl, color #847E71.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #B0281C) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Magazine Grid palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #F6F5F2 until onLoad fires.
- Countdown to {{EVENT_DATE}}: tabular-nums digits with a 1s tick + digit-roll animation (outgoing y -12/opacity 0, incoming y 12->0).

### 3. Schedule / Tracks
- Tabbed/day-based schedule grid from {{SCHEDULE_ITEMS}}, each row with time, title, track tag; sticky time-rail on desktop.

### 4. Speakers
- Grid of people from {{TEAM_1..6}} (name, role, photo?); missing photos render an initials monogram in accent #B0281C, never a stock headshot.
- Section removed entirely if {{TEAM_1..6}} is empty.

### 5. Venue / Travel
- Venue details, embedded map, and travel logistics from {{VENUE_INFO}}; omitted gracefully if not supplied.

### 6. Ticket Tiers
- Ticket tiers from {{PRICING_TIERS}} with availability state (available/limited/sold out) reflected in both color and text label -- never color alone.

### 7. CTA
- Full-width closing section, background #181614, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Tiempos Text, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #DEDBD2, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for events if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built tech conference / industry event product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 994 — High-Fashion Editorial — Tech Conference / Industry Event

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a tech conference / industry event ({{PRODUCT_CATEGORY}}). Art direction: high-fashion editorial — full-bleed monochrome photography, oversized condensed type, extreme minimalism. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router), React Server Components where possible
- Styling: Tailwind CSS v4 with @theme in globals.css
- Animation: Framer Motion (layout + scroll) + GSAP ScrollTrigger for pinned sequences
- Extra: Lenis for smooth scroll (lerp 0.07)
- Icons: Lucide React
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

### 2. Hero / Countdown
- Full-viewport, min-h-screen composition built around full-viewport image bleeds with condensed vertical wordmark rotated -90deg pinned to the edge.
- H1 "{{HERO_HEADLINE}}" set in PP Neue Montreal Condensed, clamp(2.75rem, 7vw, 6rem); entrance timed to ease 900ms, slow deliberate crossfades — never fast.
- Sub-headline "{{VALUE_PROP}}" in PP Neue Montreal, max-w-xl, color #9A9A9A.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #FFFFFF) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the High-Fashion Editorial palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #000000 until onLoad fires.
- Countdown to {{EVENT_DATE}}: tabular-nums digits with a 1s tick + digit-roll animation (outgoing y -12/opacity 0, incoming y 12->0).

### 3. Schedule / Tracks
- Tabbed/day-based schedule grid from {{SCHEDULE_ITEMS}}, each row with time, title, track tag; sticky time-rail on desktop.

### 4. Speakers
- Grid of people from {{TEAM_1..6}} (name, role, photo?); missing photos render an initials monogram in accent #FFFFFF, never a stock headshot.
- Section removed entirely if {{TEAM_1..6}} is empty.

### 5. Venue / Travel
- Venue details, embedded map, and travel logistics from {{VENUE_INFO}}; omitted gracefully if not supplied.

### 6. Ticket Tiers
- Ticket tiers from {{PRICING_TIERS}} with availability state (available/limited/sold out) reflected in both color and text label -- never color alone.

### 7. CTA
- Full-width closing section, background #111111, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in PP Neue Montreal, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #2E2E2E, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for events if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built tech conference / industry event product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 995 — Architectural Blueprint — Tech Conference / Industry Event

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a tech conference / industry event ({{PRODUCT_CATEGORY}}). Art direction: architectural blueprint — technical drawing aesthetic, thin precise lines, dimension annotations, cool blue-grey. Production-ready, 100% responsive.

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

### 2. Hero / Countdown
- Full-viewport, min-h-screen composition built around SVG dimension lines with arrow endpoints and measurement labels annotate key layout sections, as in a blueprint.
- H1 "{{HERO_HEADLINE}}" set in Neue Haas Unica, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease 300ms, draws lines via stroke-dashoffset animation.
- Sub-headline "{{VALUE_PROP}}" in Neue Haas Unica, max-w-xl, color #6E7981.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #1B4B91) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Architectural Blueprint palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #FFFFFF until onLoad fires.
- Countdown to {{EVENT_DATE}}: tabular-nums digits with a 1s tick + digit-roll animation (outgoing y -12/opacity 0, incoming y 12->0).

### 3. Schedule / Tracks
- Tabbed/day-based schedule grid from {{SCHEDULE_ITEMS}}, each row with time, title, track tag; sticky time-rail on desktop.

### 4. Speakers
- Grid of people from {{TEAM_1..6}} (name, role, photo?); missing photos render an initials monogram in accent #1B4B91, never a stock headshot.
- Section removed entirely if {{TEAM_1..6}} is empty.

### 5. Venue / Travel
- Venue details, embedded map, and travel logistics from {{VENUE_INFO}}; omitted gracefully if not supplied.

### 6. Ticket Tiers
- Ticket tiers from {{PRICING_TIERS}} with availability state (available/limited/sold out) reflected in both color and text label -- never color alone.

### 7. CTA
- Full-width closing section, background #F5F6F7, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Neue Haas Unica, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #C7CCD1, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for events if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built tech conference / industry event product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 996 — Experimental Typography — Tech Conference / Industry Event

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a tech conference / industry event ({{PRODUCT_CATEGORY}}). Art direction: experimental typography — type as the primary graphic device — variable font weight/width driven by scroll or cursor. Production-ready, 100% responsive.

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

### 2. Hero / Countdown
- Full-viewport, min-h-screen composition built around headline font-variation-settings 'wght' and 'wdth' interpolate live with scroll velocity and cursor proximity per character.
- H1 "{{HERO_HEADLINE}}" set in Variable custom (wght/wdth axes), clamp(2.75rem, 7vw, 5.5rem); entrance timed to scroll-linked variable-font-variation-settings interpolation.
- Sub-headline "{{VALUE_PROP}}" in Suisse Int'l, max-w-xl, color #948FA3.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #E8FF59) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Experimental Typography palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #1A1820 until onLoad fires.
- Countdown to {{EVENT_DATE}}: tabular-nums digits with a 1s tick + digit-roll animation (outgoing y -12/opacity 0, incoming y 12->0).

### 3. Schedule / Tracks
- Tabbed/day-based schedule grid from {{SCHEDULE_ITEMS}}, each row with time, title, track tag; sticky time-rail on desktop.

### 4. Speakers
- Grid of people from {{TEAM_1..6}} (name, role, photo?); missing photos render an initials monogram in accent #E8FF59, never a stock headshot.
- Section removed entirely if {{TEAM_1..6}} is empty.

### 5. Venue / Travel
- Venue details, embedded map, and travel logistics from {{VENUE_INFO}}; omitted gracefully if not supplied.

### 6. Ticket Tiers
- Ticket tiers from {{PRICING_TIERS}} with availability state (available/limited/sold out) reflected in both color and text label -- never color alone.

### 7. CTA
- Full-width closing section, background #111014, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Suisse Int'l, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #312E3B, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for events if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built tech conference / industry event product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 997 — Data-Dense Analytics — Tech Conference / Industry Event

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a tech conference / industry event ({{PRODUCT_CATEGORY}}). Art direction: data-dense analytics — tight information density, small multiples, sparkline-everything, muted chart palette. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router), React Server Components where possible
- Styling: Tailwind CSS v4 with @theme in globals.css
- Animation: Framer Motion (layout + scroll) + GSAP ScrollTrigger for pinned sequences
- Extra: Lenis for smooth scroll (lerp 0.07)
- Icons: Lucide React
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

### 2. Hero / Countdown
- Full-viewport, min-h-screen composition built around a grid of small-multiple sparkline cards, each with a live-updating value and a 30-day trend line drawn in SVG.
- H1 "{{HERO_HEADLINE}}" set in Inter Tight, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease 180ms, chart transitions via d3 interpolate.
- Sub-headline "{{VALUE_PROP}}" in Inter, max-w-xl, color #7E8896.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #4C9AFF) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Data-Dense Analytics palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #161A21 until onLoad fires.
- Countdown to {{EVENT_DATE}}: tabular-nums digits with a 1s tick + digit-roll animation (outgoing y -12/opacity 0, incoming y 12->0).

### 3. Schedule / Tracks
- Tabbed/day-based schedule grid from {{SCHEDULE_ITEMS}}, each row with time, title, track tag; sticky time-rail on desktop.

### 4. Speakers
- Grid of people from {{TEAM_1..6}} (name, role, photo?); missing photos render an initials monogram in accent #4C9AFF, never a stock headshot.
- Section removed entirely if {{TEAM_1..6}} is empty.

### 5. Venue / Travel
- Venue details, embedded map, and travel logistics from {{VENUE_INFO}}; omitted gracefully if not supplied.

### 6. Ticket Tiers
- Ticket tiers from {{PRICING_TIERS}} with availability state (available/limited/sold out) reflected in both color and text label -- never color alone.

### 7. CTA
- Full-width closing section, background #0E1116, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Inter, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #262C36, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for events if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built tech conference / industry event product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 998 — Corporate Premium Trust — Tech Conference / Industry Event

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a tech conference / industry event ({{PRODUCT_CATEGORY}}). Art direction: corporate premium trust — navy and white, generous whitespace, restrained gold accent, institutional confidence. Production-ready, 100% responsive.

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

### 2. Hero / Countdown
- Full-viewport, min-h-screen composition built around a fixed trust-bar beneath the navbar listing certifications/regulator marks in small caps.
- H1 "{{HERO_HEADLINE}}" set in Söhne, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease-out 350ms, no playful overshoot.
- Sub-headline "{{VALUE_PROP}}" in Söhne, max-w-xl, color #5B6B80.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #0F3D6E) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Corporate Premium Trust palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #F5F7FA until onLoad fires.
- Countdown to {{EVENT_DATE}}: tabular-nums digits with a 1s tick + digit-roll animation (outgoing y -12/opacity 0, incoming y 12->0).

### 3. Schedule / Tracks
- Tabbed/day-based schedule grid from {{SCHEDULE_ITEMS}}, each row with time, title, track tag; sticky time-rail on desktop.

### 4. Speakers
- Grid of people from {{TEAM_1..6}} (name, role, photo?); missing photos render an initials monogram in accent #0F3D6E, never a stock headshot.
- Section removed entirely if {{TEAM_1..6}} is empty.

### 5. Venue / Travel
- Venue details, embedded map, and travel logistics from {{VENUE_INFO}}; omitted gracefully if not supplied.

### 6. Ticket Tiers
- Ticket tiers from {{PRICING_TIERS}} with availability state (available/limited/sold out) reflected in both color and text label -- never color alone.

### 7. CTA
- Full-width closing section, background #0F1B2D, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Söhne, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #E1E6ED, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for events if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built tech conference / industry event product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 999 — Playful Sophisticated — Tech Conference / Industry Event

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a tech conference / industry event ({{PRODUCT_CATEGORY}}). Art direction: playful sophisticated — bold single accent on cream, hand-tuned micro-illustrations, confident restraint with warmth. Production-ready, 100% responsive.

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

### 2. Hero / Countdown
- Full-viewport, min-h-screen composition built around small hand-drawn-style SVG accent marks (circles, arrows) that rotate/scale in as a section enters viewport.
- H1 "{{HERO_HEADLINE}}" set in Fraunces (soft), clamp(2.75rem, 7vw, 5.5rem); entrance timed to spring(220,20), playful but never chaotic.
- Sub-headline "{{VALUE_PROP}}" in General Sans, max-w-xl, color #8C7F68.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #FF5A36) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Playful Sophisticated palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #FFFFFF until onLoad fires.
- Countdown to {{EVENT_DATE}}: tabular-nums digits with a 1s tick + digit-roll animation (outgoing y -12/opacity 0, incoming y 12->0).

### 3. Schedule / Tracks
- Tabbed/day-based schedule grid from {{SCHEDULE_ITEMS}}, each row with time, title, track tag; sticky time-rail on desktop.

### 4. Speakers
- Grid of people from {{TEAM_1..6}} (name, role, photo?); missing photos render an initials monogram in accent #FF5A36, never a stock headshot.
- Section removed entirely if {{TEAM_1..6}} is empty.

### 5. Venue / Travel
- Venue details, embedded map, and travel logistics from {{VENUE_INFO}}; omitted gracefully if not supplied.

### 6. Ticket Tiers
- Ticket tiers from {{PRICING_TIERS}} with availability state (available/limited/sold out) reflected in both color and text label -- never color alone.

### 7. CTA
- Full-width closing section, background #FFF8EF, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in General Sans, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #F0E4D0, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for events if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built tech conference / industry event product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```


TEMPLATE 1000 — Organic Earth — Tech Conference / Industry Event

```text
Act as an award-winning Senior UX/UI Designer and Expert Frontend Engineer. Build "{{BRAND_NAME}}", a tech conference / industry event ({{PRODUCT_CATEGORY}}). Art direction: organic earth — clay, moss and sand tones, blob/curve shapes, natural texture, calm pacing. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router), React Server Components where possible
- Styling: Tailwind CSS v4 with @theme in globals.css
- Animation: Framer Motion (layout + scroll) + GSAP ScrollTrigger for pinned sequences
- Extra: Lenis for smooth scroll (lerp 0.07)
- Icons: Lucide React
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

### 2. Hero / Countdown
- Full-viewport, min-h-screen composition built around organic blob-shaped SVG clip-paths frame every image, morphing slightly on scroll (clip-path interpolation).
- H1 "{{HERO_HEADLINE}}" set in Fraunces, clamp(2.75rem, 7vw, 5.5rem); entrance timed to ease-in-out 700ms, slow drift.
- Sub-headline "{{VALUE_PROP}}" in Newsreader, max-w-xl, color #8A7F65.
- CTA row: "{{PRIMARY_CTA}}" (filled, accent #5B6E4F) + "{{SECONDARY_CTA}}" (ghost/underline variant).
- STANDARD PATH [REQUIRES: none]: hero surface is built entirely from CSS/SVG using the Organic Earth palette -- no placeholder imagery, no stock photography. ENHANCED PATH [REQUIRES: 1+ asset]: {{HERO_ASSET}} composited into the same frame, aspect-ratio reserved before load, skeleton in #EAE2D0 until onLoad fires.
- Countdown to {{EVENT_DATE}}: tabular-nums digits with a 1s tick + digit-roll animation (outgoing y -12/opacity 0, incoming y 12->0).

### 3. Schedule / Tracks
- Tabbed/day-based schedule grid from {{SCHEDULE_ITEMS}}, each row with time, title, track tag; sticky time-rail on desktop.

### 4. Speakers
- Grid of people from {{TEAM_1..6}} (name, role, photo?); missing photos render an initials monogram in accent #5B6E4F, never a stock headshot.
- Section removed entirely if {{TEAM_1..6}} is empty.

### 5. Venue / Travel
- Venue details, embedded map, and travel logistics from {{VENUE_INFO}}; omitted gracefully if not supplied.

### 6. Ticket Tiers
- Ticket tiers from {{PRICING_TIERS}} with availability state (available/limited/sold out) reflected in both color and text label -- never color alone.

### 7. CTA
- Full-width closing section, background #F3EEE4, centered "{{PRIMARY_CTA}}" at clamp(2rem, 6vw, 4rem).
- {{CONTACT_EMAIL}} or secondary link beneath in Newsreader, label style.

### 8. Footer
- Multi-column footer: brand + one-line description, product links, company links, legal.
- Bottom bar: 1px top border at #D8CBAE, copyright left, socials right (generic icon marks only).
- Regulatory/legal entity line rendered here for events if applicable ({{ENTITY_LEGAL}}).

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
- No generic startup-template layout — this must read as a purpose-built tech conference / industry event product, not a page-builder output.
- Every value shown as fact ({{PROOF_STAT_1..4}}, {{PRICING_TIERS}}, testimonials, case-study results) must trace to a supplied placeholder — never invented.
- Strip every `[REQUIRES: …]` marker and every unselected asset path from the final emitted prompt; the output must read as a single unambiguous specification.
- Mobile-first: every section fully designed at 375px width, not merely stacked from desktop.
```

