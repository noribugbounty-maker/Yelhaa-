# Agency Prompt Templates — 10 Art Directions

> **Usage:** Each template is a complete, production-grade prompt for an agency, studio or portfolio site. Variables in `{{DOUBLE_BRACES}}` are injected by the AI layer from the user's input. Everything else is fixed craft specification.

> Full variable contract, including the shared core schema and per-domain extensions: see `prompt-variable-schema.md`.

**Core variables used here:** `{{BRAND_NAME}}` `{{VERTICAL}}` `{{TAGLINE}}` `{{HERO_HEADLINE}}` `{{VALUE_PROP}}` `{{PRIMARY_CTA}}` `{{SECONDARY_CTA}}` `{{ITEM_1..6}}` (services) `{{DETAIL_1..6}}` `{{PROOF_STAT_1..4}}` `{{ACCENT_HEX}}` `{{LOGO_ASSET}}` `{{HERO_ASSET}}` `{{SCREEN_1..5}}` `{{CONTACT_EMAIL}}`

**Agency extension** — add to `prompt-variable-schema.md` under `### agency`:

| Variable | Type | Requis | Défaut si absent |
|---|---|---|---|
| `{{PROJECT_1..6}}` | `{title, category, year, blurb?, asset?}[]` | **oui** | minimum 3 ; en dessous, la galerie passe en liste éditoriale sans visuel |
| `{{TEAM_1..6}}` | `{name, role, photo?}[]` | non | supprimer la section équipe entièrement |
| `{{AWARDS}}` | `{name, year}[]` | non | supprimer la bande récompenses — **jamais inventée** |
| `{{CLIENT_LOGOS}}` | `{name, asset?}[]` | non | wordmarks typographiques en `--muted`, jamais de logos inventés |

---

## ASSET GATING — applies to every template below

No template may require an asset the user has not supplied. Every asset-dependent section has two paths; the AI layer picks one **before** emitting the prompt.

| Asset supplied | Path |
|---|---|
| Nothing but a logo | **Standard** — sections built from CSS, SVG and typography. Always works. |
| 1–2 project images | **Enhanced** — framed plates, single-project showcases. |
| 3+ project images | **Sequence** — expanding galleries, stacked decks, horizontal tracks. |
| A video | **Video** — reel hero, scroll-masked footage, knockout text. |

**Rules for the generating layer:**

1. Count assets before selecting the template body. Emit only the supported path.
2. Never emit a section referencing an empty asset slot. Delete the section entirely rather than leaving a placeholder or an empty frame.
3. The standard path must always produce a complete, finished-looking page.
4. Sections marked `[REQUIRES: …]` are droppable or swappable; unmarked sections are mandatory.
5. **Strip every `[REQUIRES: …]` marker and every unselected path from the final prompt.** The emitted prompt must read as a single unambiguous specification — if the words "path" or "fallback" survive, the generating model builds both and the page breaks.

**Agency-specific note:** this domain has the hardest asset problem of all four — an agency site is *supposed* to show work, and a user pitching a new studio often has none. Every template below therefore has a **typographic project treatment** as its standard path: the project index rendered as an editorial list with category, year and a hover state built entirely in type and rule lines. Done well this reads as deliberate restraint, and several award-winning studio sites ship exactly that. Never render an empty image frame, and never insert stock photography to fill a gap.

---

## HONESTY BASELINE — mandatory in all ten templates

Agency sites sell credibility, and credibility claims are the easiest thing for a generating model to fabricate. These rules are not stylistic:

- **No invented clients.** `{{CLIENT_LOGOS}}` renders only real supplied names. If absent, the section is removed — never filled with recognisable brand names.
- **No invented awards.** Same rule for `{{AWARDS}}`.
- **No invented metrics.** "300+ businesses", "10+ years", "150 clients" render only from `{{PROOF_STAT_*}}` with their qualifier. If absent, the band becomes qualitative with no numerals.
- **No invented case-study results.** A project blurb describes the work; a *result* figure requires a supplied number and its basis.
- **Team members are real or the section is removed.** No stock portraits standing in for staff.
- **Placeholder imagery is labelled.** If the user explicitly opts into stock or placeholder assets, the template renders a visible `--muted` caption saying so, so it is never accidentally shipped as real work.

---

## TEMPLATE 01 — Midnight Neon Glass

```
Act as an award-winning UI/UX designer and elite frontend developer. Build the site for "{{BRAND_NAME}}", a {{VERTICAL}}. Art direction: midnight neon glass — deep blue night ground, neon accent edges, glass surfaces, scroll-driven mask reveals. Premium and cinematic without going gaudy. Production-ready, 100% responsive.

## TECH STACK
- Framework: React 18+ with TypeScript (Vite), or Next.js 15 App Router if routing is needed
- Styling: Tailwind CSS
- Animation: Framer Motion (useScroll, useTransform, AnimatePresence, layout)
- Icons: lucide-react
- Language: TypeScript strict

## DESIGN SYSTEM
Colors:
  --bg: #0C1128 (deep midnight blue)
  --surface: rgba(255,255,255,0.05)
  --border: rgba(255,255,255,0.10)
  --fg: #FFFFFF
  --muted: #9CA3AF
  --dim: #4B5563
  --neon-blue: #00F0FF
  --neon-purple: #B026FF
  --accent: {{ACCENT_HEX}} (fallback --neon-blue)
  Selection: selection:bg-blue-500/30
Typography:
  Family: "Outfit", sans-serif — weights 300;400;500;600;700;800;900
  H1/H2: font-black (900), tracking-tighter, leading-[1.1]
  Body: font-light (300) or font-medium (500), leading-relaxed
  Badges: text-xs font-bold uppercase tracking-widest
  Gradients on text: from-blue-400 to-purple-500, bg-clip-text
Layout:
  App: min-h-screen w-full bg-[--bg] text-white overflow-x-hidden
  Sections: py-32 (or py-24), px-4 sm:px-6 lg:px-8
  Max widths: max-w-6xl general, max-w-[1400px] gallery, max-w-5xl navbar
Glass recipe: bg-white/5, backdrop-blur-md, border border-white/10, rounded-3xl, plus an inset highlight via box-shadow: inset 0 1px 0 rgba(255,255,255,0.08).

## SECTIONS

### 1. Navbar
- Fixed, top-6, z-50, horizontally centered, max-w-5xl, rounded-full — becomes rounded-3xl when the mobile menu opens.
- Scroll transform: as scrollY moves [0, 50], background opacity goes 0.02 → 0.08 and backdrop blur 8px → 24px, via useTransform.
- Links: {{ITEM}}-derived labels plus "Work", "Studio", "Contact". Each link has a span bottom-border animating w-0 → w-full on hover and on focus-visible.
- CTA: "{{PRIMARY_CTA}}" — white background, black text, rounded-full, hover:scale-105 active:scale-95, shadow-[0_0_20px_rgba(255,255,255,0.2)].
- Mobile: hamburger with an aria-label toggling a full-screen overlay. Body scroll locked, focus trapped, Escape closes, focus returned to the trigger.

### 2. Hero — Scroll Mask Reveal
- Section h-[300vh] with an inner sticky top-0 h-screen container.
- Two stacked layers. A clipPath circle on the top layer expands 0% → 150% across scroll progress; both layers scale 1 → 1.15 subtly.
- Base layer text: "{{HERO_HEADLINE}}" first clause. Top layer text: the second clause. The reveal is the message — write the two clauses so the transition means something.
- Bouncing Chevron scroll indicator at the bottom center, aria-hidden.

- Layer contents, VIDEO PATH [REQUIRES: video]:
    {{HERO_ASSET}} as a full-cover video on the top layer (autoPlay loop muted playsInline preload="metadata", poster required), with the poster or a still on the base layer.

- Layer contents, ENHANCED PATH [REQUIRES: 2+ images]:
    {{SCREEN_1}} on the base layer and {{SCREEN_2}} on the top layer, both object-cover with aspect reserved before load.

- Layer contents, STANDARD PATH [REQUIRES: none]:
    Base layer: a CSS wireframe cityscape — a repeating set of 1px --border rectangles at varying heights along the bottom third, over a --bg ground. Top layer: the same silhouette filled with a --neon-blue → --neon-purple gradient at 22% opacity, with a soft radial glow behind it.
    The mask reveal turns outline into light. This is a designed composition, not a gap — build it with full care.

### 3. Clients Ticker [REQUIRES: {{CLIENT_LOGOS}}]
- Header: a proof line plus a small glass pill badge.
- Infinite ticker animating x ["0%", "-50%"], duration 40s, ease linear, repeat Infinity. Duplicated node measured on mount and on debounced resize so the loop is seamless at every width.
- Edge fades: absolute gradients from-[--bg] to-transparent on both sides.
- Logos render as {{CLIENT_LOGOS}} names in uppercase tracking-widest --muted, or their supplied asset. **Never a recognisable brand name that was not supplied.**
- Pauses on hover and on focus-within.
- If {{CLIENT_LOGOS}} is absent, delete this section entirely.

### 4. Services — 2x2 Glass Grid
- Header: an H2 built from {{VALUE_PROP}}.
- Four glass cards from {{ITEM_1}}–{{ITEM_4}}, rounded-3xl.
- Each card has a lucide icon sitting inside a quarter-circle background anchored in the card's corner (a rounded-full div at 2x size, offset so only a quadrant shows, in --accent at 8% opacity).
- Hover: glass brightens to bg-white/7, border to white/20, and a radial spotlight follows the cursor inside the card (CSS vars --mx/--my, radial-gradient 200px, --accent at 12%). Mirrored on focus-within.

### 5. Work — Expanding Flex Gallery
- Header: "Work" plus a "View all" link. Container max-w-[1400px], h-[400px], flex-row on desktop, flex-col on mobile.
- Behaviour: the hovered or focused project expands to flex 4 while siblings shrink to flex 0.8. Transition ease [0.25, 1, 0.5, 1], duration 0.6s. The active panel reveals its title, category, year and a CTA.
- Keyboard: each panel is focusable; focus expands it identically to hover. Arrow keys move between panels.

- Panel contents, SEQUENCE PATH [REQUIRES: 3+ images]:
    Each project's asset as an object-cover background, scaling 1 → 1.05 over 1000ms on hover, with a black/40 → black/60 gradient for text contrast.

- Panel contents, STANDARD PATH [REQUIRES: none]:
    Each panel is a distinct CSS composition — a --neon-blue/--neon-purple gradient at a different angle per project, over a 1px --border diagonal hatch, with the project number set at 12vw in --fg at 6% opacity behind the title.
    Type and colour carry the panel. It reads as an intentional index, which is a legitimate studio-site choice.

### 6. About — Split Content
- lg:grid-cols-2. Left: a font-black headline. Right: two paragraphs plus a stat row.
- Background detail: a centered absolute bg-purple-500/5 blur-[120px] circle, pointer-events-none, aria-hidden.
- Stats render from {{PROOF_STAT_*}} with the figure in tabular-nums and its qualifier in text-xs --muted directly beneath. **If {{PROOF_STAT_*}} is absent, the row is replaced by three qualitative capability lines with no numerals.** Never invent a years-in-business or client count.

### 7. Footer
- A massive font-black CTA headline plus a "{{PRIMARY_CTA}}" rounded-full button.
- Four-column links grid: brand info, navigation, services, socials (generic lucide icons in circular hover wrappers).
- Bottom bar: copyright, {{CONTACT_EMAIL}}, privacy and terms links.

## STATES & EDGE CASES (mandatory)
- Fewer than 3 projects: the expanding gallery is replaced by an editorial project list — rows with title, category, year and an arrow, 1px --border between, hover shifting the row to bg-white/5.
- Missing clients, awards or stats: those sections are removed or rendered qualitatively. Nothing is invented.
- Loading: glass skeletons — the same glass recipe with content replaced by --border bars and a 1.6s shimmer sweep.
- Empty: a glass card, a --muted icon at 32px, one line, one CTA.
- Error: a glass card with a 2px --neon-purple left border, plain-language copy, a retry button.
- Image failure: the panel keeps its gradient composition and the title — never a broken-image glyph, never an empty frame.
- backdrop-filter unsupported: @supports fallback raising --surface to a solid 0.10 so text contrast is preserved.
- Forms: labels above fields, glass inputs, 2px --accent focus ring, validation on blur, aria-describedby, aria-live="polite", submit disabled with "Sending…", success replaces the form.
- 404 and 500 pages in the same system.

## PERFORMANCE
- backdrop-filter is expensive: cap simultaneously-visible glass surfaces, never nest glass inside glass.
- Framer Motion: transform and opacity only in scroll transforms — never width, height, top or left.
- viewport={{ once: true, margin: "-100px" }} on all whileInView entrances so heavy animations never re-trigger.
- Images: webp, loading="lazy" below the fold, explicit width and height to prevent CLS.
- Video ≤ 1080p, ≤ 3 MB, preload="metadata", paused via IntersectionObserver off-screen.
- prefers-reduced-motion: disable the 300vh mask scroll (the two layers become two stacked static sections), stop the ticker auto-scroll, replace entrances with a 200ms opacity fade.
- Target LCP < 2.3s, CLS < 0.05, INP < 200ms.

## ACCESSIBILITY
- Semantic <header>, <nav>, <main>, <section>, <footer>. Exactly one <h1>, in the hero.
- Neon on midnight: --neon-blue and --neon-purple must clear 4.5:1 at body size before use as text; if they fail, reserve them for borders and glows and set body copy in --fg or --muted.
- Every hover-driven state also fires on focus-visible — the gallery in particular must be fully keyboard operable.
- aria-labels on all icon-only buttons.
- Decorative blurs, glows and hatches: aria-hidden, pointer-events-none.
- Focus rings: 2px --accent, offset 2px, never removed without replacement.

## STRICT RULES
- No `any`. Strict TypeScript.
- Component files: Navbar, Hero, Clients, Services, Work, About, Footer in src/components, assembled in App.
- Neon is an edge treatment — borders, glows, gradients on type. Never a large flat fill.
- No invented clients, awards, metrics or case-study results.
- Fully designed at 375px, not merely stacked.
```

---

## TEMPLATE 02 — Liquid Shader Studio

```
Act as an award-winning creative developer and elite web designer. Build the site for "{{BRAND_NAME}}", a {{VERTICAL}}. Art direction: liquid shader studio — a morphing WebGL field behind stark display type, buttery Lenis scroll, dark-to-light section inversion. Technically showy, editorially calm. Production-ready, 100% responsive.

## TECH STACK
- Framework: React (Vite) with TypeScript
- Styling: Tailwind CSS v4 with theme variables
- Animation: Framer Motion (layout, micro-interactions, scroll transforms)
- 3D: Three.js with React Three Fiber — hero background only
- Scroll: Lenis (@studio-freight/react-lenis) at the root, lerp 0.1, duration 1.5
- Icons: lucide-react
- Language: TypeScript strict

## DESIGN SYSTEM
Colors:
  --dark-bg: #0D0D0D
  --dark-surface: #1A1A1A
  --light-bg: #FFFFFF
  --light-surface: #F9FAFB
  --fg-light: #FFFFFF
  --fg-dark: #0D0D0D
  --muted: #A1A1AA
  --accent: {{ACCENT_HEX}} (fallback #3B82F6)
  Shader palette: vec3(0.04,0.04,0.06) base, vec3(0.12,0.15,0.22) mid, vec3(0.35,0.35,0.40) streaks
Typography:
  Display: "Outfit" weights 500/600/700 — hero and section titles
  Body: "Inter" weights 300/400/500/600 — UI, tags, descriptions
  Hero: text-5xl md:text-[100px], leading-[1.1], tracking-tight
  Section titles: text-4xl md:text-6xl
  Body: text-sm md:text-lg. Meta: text-xs uppercase tracking-wider
Layout: max-w-[1200px] or max-w-[1400px] mx-auto; py-24 md:py-32; px-6 md:px-12 up to md:px-24.
Section inversion: the hero and footer are dark; the middle of the page is light. That contrast is the structure.

## SECTIONS

### 1. Hero (100vh)

- Background, ADVANCED PATH [REQUIRES: explicit WebGL opt-in]:
    A full-screen <Canvas dpr={[1,2]}> rendering a custom fragment shader: 2D noise with domain warping producing abstract morphing liquid streaks moving diagonally. Do not render the shader when the hero is out of view.

- Background, STANDARD PATH [REQUIRES: none] — build this by default:
    A pure-CSS liquid field: four large radial gradients in the shader palette at 300px blur, each drifting and scaling on desynced 19s / 24s / 31s / 37s ease-in-out infinite alternate loops, over --dark-bg, with a fine grain overlay (feTurbulence, opacity 0.05, mix-blend-overlay).
    Visually this lands within a hair of the shader, ships ~200 KB lighter, renders on every device, and removes the Three.js dependency entirely. It is the default build, not a lesser one.

- Navbar: absolute at top, mix-blend-difference with white text so it reads over both fields. {{LOGO_ASSET}} or a wordmark left, links right. Mobile: a hamburger toggling a full-screen black overlay via AnimatePresence with large links, body scroll locked, focus trapped, Escape closes.
- Hero content: centered. "{{HERO_HEADLINE}}" in display.
  - Micro-interaction: the final letter of the headline has a white bar extending right from it — w-[100px] md:w-[450px], h-2.5, rounded-r-full — animating scaleX 0 → 1 over 1.5s, transform-origin left.
  - Parallax: useScroll with useTransform moving y 0 → 400px over 1000px of scroll, so the content rises slower than the page.
- Circular badge: bottom right, absolute. Rotating SVG text ("{{PRIMARY_CTA}} •" repeated around a circle) wrapping a central star icon, rotating 360deg over 10s linear infinite. aria-hidden, with a real accessible link beneath it.

### 2. Services
- Background --light-bg, text --fg-dark. Four-column grid (1 on mobile, 2 on tablet).
- Each: a lucide icon, a title from {{ITEM_*}}, a description. whileInView fade-up, viewport once.

### 3. Latest Projects — Interactive Stacked Deck
- Background --light-bg. Absolute-positioned overlapping cards, container height [600px].
- Controls: ChevronLeft and ChevronRight at the section header's top right, each with an aria-label.
- Card design: left half holds an index badge in a circle, meta tags in --accent ("{{year}} • {{category}}"), a display title, a paragraph, and a pill "View case study" button. Right half holds the project visual.
- Card backgrounds cycle off-white variations: #F8F9FA, #F1F5F9, #F4F4F5.
- Motion: the front card is scale 1, y 0, z-30, draggable on x (drag="x", dragDirectionLock, dragElastic 0.15); release past a threshold advances. Background cards stack y -30px per index and scale 1 - index*0.05 with descending z-index. Clicking a background card animates it to the front. Transition ease [0.16,1,0.3,1], 0.6s.
- Keyboard: the deck is a listbox-like control — arrow keys cycle, each card focusable, aria-current on the front card.

- Right half, SEQUENCE PATH [REQUIRES: 3+ images]:
    A large rounded project image, with absolute glassmorphism shapes over it (a square and two circles, backdrop-blur-sm bg-white/90 mix-blend-overlay).

- Right half, STANDARD PATH [REQUIRES: none]:
    A large rounded --light-surface panel holding a built composition: the project's category set at 8vw in --fg-dark at 5% opacity, three overlapping geometric shapes in --accent tints with the same glassmorphism treatment, and a 1px grid underlay. Distinct shape arrangement per project so the deck never repeats.

### 4. About — Masonry Parallax [REQUIRES: 3+ images]
- Split screen: left is sticky text ("{{VALUE_PROP}}" expanded), right is a masonry grid of three images.
- useScroll on the grid ref with offset ["start end", "end start"]; image 1 y 0% → 15%, image 2 y 0% → -10%, image 3 y 0% → 20%.
- STANDARD PATH [REQUIRES: none]: replace the grid with three stacked --light-surface panels carrying pull-quotes from {{DETAIL_*}} in display type, parallaxed on the same transforms. The section keeps its rhythm and its depth without a single photograph.

### 5. Team Banner & Grid [REQUIRES: {{TEAM_*}}]
- Marquee: a full-width scrolling banner ("MEET THE TEAM — " repeated), animate x ["0%","-50%"] linear infinite, with a text-stroke treatment (transparent fill, 1px --fg-dark stroke).
- Grid: three columns of team members. Photos start grayscale and transition to grayscale-0 on hover and focus-within; an overlay with name and role slides up.
- If {{TEAM_*}} is absent, delete both the banner and the grid. Never stock portraits.

### 6. FAQ & Pricing
- FAQ: accordion expanding via Framer Motion height auto, one open at a time, aria-expanded maintained, keyboard operable.
- Pricing: three tier cards from {{PRICING_TIERS}}; the center tier inverts to --dark-bg with white text and scales slightly. If {{PRICING_TIERS}} is absent, replace with an engagement-model section (retainer / project / sprint) with no figures.

### 7. Footer — Parallax Reveal
- The footer sits at the bottom with a z-index trick: useScroll on the footer container with offset ["start end", "end end"], transforming the inner content's y from -30% to 0% so it slides up from beneath the main content.
- Content: a massive CTA, a "{{PRIMARY_CTA}}" pill, a top-right ArrowUp scroll-to-top button with an aria-label, {{CONTACT_EMAIL}}, copyright and social links.

## STATES & EDGE CASES (mandatory)
- WebGL path selected but context unavailable or lost: swap to the CSS liquid field at runtime with no layout jump.
- Fewer than 3 projects: the deck becomes a single static case-study block plus an editorial list of the rest.
- Loading: --light-surface blocks at exact final dimensions with a 1.4s shimmer; the hero field renders immediately (it is CSS) so the fold is never blank.
- Empty: a --light-surface panel, an icon, one line, one action.
- Error: a card with a 2px --accent left border, plain-language copy, a retry button. Never an error code.
- Drag on touch: dragDirectionLock so the deck never hijacks vertical page scroll.
- Forms: labels above fields, validation on blur, aria-describedby, aria-live="polite", success replaces the form.
- 404 and 500 in the same system.

## PERFORMANCE
- If the WebGL path is used: <Canvas dpr={[1,2]}>, frameloop "demand" where possible, unmount when the hero exits the viewport, dispose geometries and materials on cleanup.
- The CSS field is the default precisely because it removes this entire risk surface.
- Lenis at the root; if GSAP is ever added later, wire scrollerProxy — but this build uses Framer Motion only, so no wiring is needed.
- next/font or preloaded Google Fonts with display swap and size-adjust for Outfit and Inter.
- Images webp, lazy below the fold, explicit dimensions.
- prefers-reduced-motion: freeze the liquid field, disable parallax and the footer reveal, disable the marquee, disable drag inertia, keep opacity transitions only.
- Target LCP < 2.2s, CLS < 0.04, INP < 190ms.

## ACCESSIBILITY
- mix-blend-difference navbar must be verified legible over the brightest area of the field, not the average.
- The hero field is decorative: aria-hidden, pointer-events-none.
- The rotating badge is decorative; a real focusable link with the same destination sits alongside it.
- Deck: keyboard cycling, aria-current, focus visible on each card.
- Semantic <nav>, <main>, <section>, <footer>; one <h1>.
- Focus rings: 2px --accent, offset 2px, verified on both the dark and light halves.

## STRICT RULES
- No `any`. Strict TypeScript.
- The dark-light-dark inversion is the page structure. Do not flatten it to one background.
- Two families only. Outfit never appears at body size; Inter never at display size.
- No invented clients, awards, metrics or team members.
- Fully designed at 375px, including the deck (drag preserved, controls enlarged to 44px targets).
```

---

## TEMPLATE 03 — Concrete Brutalist

```
Act as an award-winning designer and elite frontend developer. Build the site for "{{BRAND_NAME}}", a {{VERTICAL}}. Art direction: concrete brutalist — raw structure exposed, oversized type, hard offset grid, zero softness. Confident and unpolished by design. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: Tailwind CSS v4 (@theme in globals.css)
- Animation: Framer Motion, GSAP ScrollTrigger for one pinned sequence
- Smooth scroll: none — this art direction wants native scroll. Do not add Lenis.
- Icons: lucide-react, strokeWidth 2.5
- Language: TypeScript strict

## DESIGN SYSTEM
Colors:
  --bg: #E8E6E1 (raw concrete)
  --bg-2: #D8D5CE
  --ink: #0A0A0A
  --muted: #6B6862
  --accent: {{ACCENT_HEX}} (fallback #FF3B00)
Typography:
  Display: "Archivo Expanded" or "Anton" weight 800, uppercase, tracking -0.04em, leading 0.82
  Body: "Archivo" weight 400/500, leading 1.5, 16px
  Labels: uppercase, tracking 0.14em, 11px, weight 600
  Scale: h1 clamp(3rem, 14vw, 14rem) / h2 clamp(2.25rem, 7vw, 6rem)
Structure: radius 0 everywhere, no exceptions. Borders 2px --ink. No shadows, no blur, no gradients.
Grid: a visible 12-column grid — 1px --ink at 12% opacity vertical rules running the full page height, fixed, aria-hidden. Content aligns to it visibly, and occasionally breaks it on purpose.

## SECTIONS

### 1. Shell
- Native scroll. Sections separated by 2px --ink rules that run full-bleed.
- Rhythm: py-20 mobile / py-32 desktop. Content is allowed to touch the viewport edges — full-bleed is the default, contained is the exception.

### 2. Navbar
- Static at the top, not fixed. 2px --ink bottom border, height 72px, bg --bg.
- Left: "{{BRAND_NAME}}" in display uppercase at 20px. Center: nothing. Right: label-styled links plus "{{PRIMARY_CTA}}" as a 2px --ink bordered rectangle that inverts to --ink fill with --bg text on hover and focus.
- Mobile: a full-screen --accent overlay, links in display at clamp(2.5rem,13vw,5rem) in --ink, hard 60ms cut entrances — no fades. Body scroll locked, focus trapped, Escape closes.

### 3. Hero
- min-h-screen. h1 "{{HERO_HEADLINE}}" at clamp(3rem,14vw,14rem), set flush left, allowed to overflow the right edge and be clipped. That clipping is intentional and must survive at every breakpoint.
- Entrance: SplitType by character, each character y 100% → 0 with a clip-path reveal, stagger 0.012, 0.8s power4.out.
- Beneath: {{VALUE_PROP}} in a 2-column text block constrained to columns 1–6, with an index label ("(001)") in column 12.
- No image, no video, no ornament. The type is the hero at every asset level — this template has no asset-dependent hero.

### 4. Marquee Statement
- Full-bleed, 2px --ink top and bottom borders, height clamp(80px, 12vw, 160px).
- Display uppercase text scrolling left, built from {{ITEM_*}} joined by a --accent square glyph. Duplicate node measured on mount and on debounced resize for a seamless loop.
- Scroll-velocity reactive: useScroll velocity drives a speed multiplier and skewX ±4deg, easing back on idle. Pauses on hover and focus-within.

### 5. Work — Index Table
- The project list as a raw table: 2px --ink header row with column labels (Index / Project / Category / Year), then rows with 1px --ink borders, py-8.
- Row hover and focus: the row inverts to --ink background with --bg text, instantly (0ms — no transition; the hardness is the effect).

- Row media, SEQUENCE PATH [REQUIRES: 3+ images]:
    On hover, an absolute 300x400 thumbnail appears and follows the cursor via gsap.quickTo on x and y, duration 0.45, power3. Scale 0 → 1. On touch devices, tapping a row expands an inline thumbnail instead.

- Row media, STANDARD PATH [REQUIRES: none]:
    No thumbnail. The inverted row and a --accent index numeral carry the interaction. A studio index table with no imagery is a legitimate and frequently-awarded treatment — do not add placeholder blocks to compensate.

### 6. Services — Stacked Slabs
- Each service is a full-bleed slab at min-h-[60vh], alternating --bg and --bg-2, separated by 2px --ink.
- Layout: an oversized index numeral at clamp(6rem,20vw,20rem) in --ink at 8% opacity behind, the title in display at clamp(2.25rem,7vw,6rem), and body copy constrained to 46ch.
- Title enters via SplitType by character with a clip-path reveal at 65% viewport entry.
- Services {{ITEM_1}} … {{ITEM_6}}.

### 7. Studio
- Two columns divided by a 2px --ink vertical rule. Left: {{DETAIL_*}} as a definition list with 1px --ink rows. Right: body copy at 46ch plus, if supplied, {{PROOF_STAT_*}} figures in display with their qualifiers in --muted at 11px.
- Without {{PROOF_STAT_*}}: qualitative statements only, no numerals.

### 8. Contact + Footer
- Contact: a full-bleed --accent band with 2px --ink borders. {{CONTACT_EMAIL}} in display at clamp(2rem,8vw,6rem), --ink, as a real mailto link.
- Footer: bg --ink, text --bg. Four columns, label-styled headers, 12px links, a bottom rule and copyright.

## STATES & EDGE CASES (mandatory)
- Fewer than 3 projects: the index table still renders — it is a table, it works at any length. Never pad it with invented rows.
- Missing stats, clients or awards: qualitative variants or section removal. Nothing invented.
- Loading: --bg-2 blocks with 2px --ink borders and a hard --accent bar sweeping horizontally, 0.9s. The structure never collapses.
- Empty: display-uppercase "NOTHING HERE" with a bordered link. Stay in character.
- Error: a --bg-2 slab with a 4px --accent top border, plain-language copy, a bordered retry.
- Image failure (enhanced path only): the cursor thumbnail simply does not appear — the row interaction is unaffected. Never a broken-image glyph.
- Forms: 2px --ink bordered inputs, no radius, --accent focus border 3px, errors in --accent below the field, aria-live="polite".
- 404: the word set at clamp(6rem,30vw,30rem), clipped by the viewport, with a bordered home link.

## PERFORMANCE
- No smooth-scroll library, no blur, no shadows, no gradients — this is the cheapest template in the set by a wide margin. Keep it that way.
- gsap.quickTo for the cursor thumbnail, never gsap.to in a pointer handler.
- Marquee transform-only, will-change: transform, paused via IntersectionObserver off-screen.
- One pinned sequence maximum. gsap.context revert on unmount; ScrollTrigger.refresh() after fonts load and on debounced resize.
- next/font, preload the display weight — it is the LCP element.
- prefers-reduced-motion: freeze the marquee at a designed offset, disable character reveals and cursor follow, keep the instant row inversion (it has no transition anyway).
- Target LCP < 1.8s, CLS < 0.04.

## ACCESSIBILITY
- The visible grid overlay: aria-hidden, pointer-events-none.
- Clipped hero type must not clip meaning — the full headline exists in the DOM and is read in full by screen readers; only the visual overflow is clipped.
- The index table is a semantic <table> with <caption>, <thead> and scope on <th>. Rows are focusable and activate on Enter.
- --accent on --bg and --ink on --accent both verified ≥ 4.5:1 at body size.
- Focus rings: 4px --accent, offset 0 — thick and flush, in keeping with the AD, and never removed.
- Instant (0ms) state changes are fine; they are not flashes, and nothing on the page changes state faster than once per interaction.

## STRICT RULES
- No `any`. Strict TypeScript.
- Radius 0. No shadows, no blur, no gradients. Any of these appearing is an automatic fail.
- Motion is hard-cut: 0–300ms. No easing softer than power4.out, no springs, no elastic.
- Raw is not broken: the grid is strict, the alignment is deliberate, the clipping is measured.
- No invented clients, awards, metrics or team members.
- Fully designed at 375px — the hero still clips, the table still tables, the slabs still slab.
```

---

## TEMPLATE 04 — Editorial Magazine

```
Act as an award-winning designer and elite frontend developer. Build the site for "{{BRAND_NAME}}", a {{VERTICAL}}. Art direction: editorial magazine — print column structure, serif and grotesque paired, pull quotes and figure captions, work presented as features. Reads like a publication about the studio. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: Tailwind CSS v4 (@theme)
- Animation: Framer Motion, GSAP ScrollTrigger + SplitType for one scroll-highlight
- Smooth scroll: Lenis (lerp 0.055)
- Icons: lucide-react, strokeWidth 1
- Language: TypeScript strict

## DESIGN SYSTEM
Colors:
  --paper: #FAF8F3
  --paper-2: #F0ECE3
  --ink: #16130E
  --ink-soft: #45403A
  --muted: #8A8378
  --rule: #DCD5C8
  --accent: {{ACCENT_HEX}} (fallback #A63A22)
Typography:
  Display: "Editorial New" or "Playfair Display" weight 400 + italic, tracking -0.015em, leading 0.98
  Grotesque: "Inter" weight 400/500/600 — body, labels, captions
  Body: 17px, leading 1.72, measure max 68ch
  Captions: 13px italic --muted, always beneath a 1px --rule
  Labels: uppercase, tracking 0.24em, 10.5px, --muted
  Scale: h1 clamp(3rem, 8vw, 7rem) / h2 clamp(2rem, 4vw, 3.5rem)
Structure: radius 0 on plates, 999px on buttons. Multi-column text (CSS columns) on wide viewports for lead paragraphs — 2 columns above lg, 1 below.
Texture: paper grain (feTurbulence baseFrequency 0.74, opacity 0.045, mix-blend-multiply), fixed, aria-hidden.

## SECTIONS

### 1. Shell
- Lenis provider. Sections separated by 1px --rule with an occasional --accent diamond glyph centered on the rule.
- Rhythm py-24 mobile / py-40 desktop. Every plate is followed by a --rule and an italic caption.

### 2. Masthead / Navbar
- Static, bg --paper, 1px --rule bottom, height 80px.
- Left: a stacked lockup — "{{BRAND_NAME}}" in display above a label-styled descriptor. Center: nothing. Right: label-styled links plus a "{{PRIMARY_CTA}}" pill in --ink with --paper text.
- Becomes fixed after 220px scroll with a y -100% → 0 slide-in, 420ms.
- Mobile: a --paper-2 overlay, links in display at clamp(2.25rem,9vw,3.5rem), staggered, focus trapped, Escape closes.

### 3. Cover
- The lead spread: h1 "{{HERO_HEADLINE}}" spanning columns 1–9, with a standfirst ({{VALUE_PROP}}) in columns 10–12 aligned to the h1 baseline.
- Entrance: SplitType by word, ink-bleed reveal — filter blur(13px) → blur(0), opacity 0 → 1, y 16 → 0, stagger 0.085, 1.05s power3.out.
- Beneath, the lead paragraph in 2 CSS columns above lg with a drop cap: first letter float-left, 3 lines tall, display serif, --accent. Keep the drop cap as a styled span inside the paragraph so screen-reader word flow is unbroken.

- Cover plate, ENHANCED PATH [REQUIRES: 1+ image]:
    {{HERO_ASSET}} full-bleed within the grid, 1px --rule frame, italic caption beneath.

- Cover plate, STANDARD PATH [REQUIRES: none]:
    A typographic cover plate — {{BRAND_NAME}} set at 22vw in display, letter-spaced to the frame's full width, in --paper on a --ink ground, with a 1px --rule inner border at 8px offset. An italic caption beneath reads as a colophon line.
    Magazines run type covers constantly. This is a designed cover, not a missing image.

### 4. Contents / Services
- A contents-page treatment: {{ITEM_*}} as numbered entries with leader dots (a repeating CSS dotted border) running from the title to a page-number-styled label on the right.
- Hover and focus: the entry's title shifts to --accent and the leader dots to --accent at 40%.

### 5. Feature — Scroll Highlight
- A single long statement at clamp(1.625rem,3.5vw,2.75rem) in display, --muted by default.
- GSAP ScrollTrigger scrub 0.85 with SplitType by word: each word shifts --muted → --ink as the scroll passes. Pinned for 150vh.
- prefers-reduced-motion: every word renders in --ink immediately, no pin.

### 6. Work — Feature Spreads
- Each project is a spread: alternating two-column rows with a label ("Feature 01"), a display heading, body copy in a 62ch measure, and a metadata line (category, year, role).

- Spread plate, SEQUENCE PATH [REQUIRES: 3+ images]:
    The project image in a 1px --rule frame, revealed with a GSAP clip-path inset(0 0 100% 0) → inset(0) over 1.05s, italic caption beneath.

- Spread plate, STANDARD PATH [REQUIRES: none]:
    A pull-quote plate — a line from the project's blurb set at clamp(1.5rem,3vw,2.5rem) in display italic, --ink on --paper-2, inside the same 1px --rule frame, with an oversized --accent opening quotation mark bleeding off the top-left corner. Italic caption beneath attributes it.
    One plate per project, each with a different quote, so the spreads never repeat.

### 7. Studio
- A masthead-style block: {{DETAIL_*}} as a definition list in two columns with 1px --rule rows, plus a short studio statement in a 68ch measure.
- {{PROOF_STAT_*}} render in display with their qualifiers in 12px --muted; absent, the block is qualitative with no numerals.

### 8. Team [REQUIRES: {{TEAM_*}}]
- A contributors page: portraits in 1px --rule framed plates, names in display, roles in label styling, each with an italic caption.
- Absent, delete the section. No stock portraits.

### 9. Contact + Colophon
- Contact: a two-column block — left a short paragraph and {{CONTACT_EMAIL}} as a display-italic link; right a form with transparent inputs using border-b 1px --rule only, labels above.
- Colophon footer: --paper-2, four columns, label-styled headers, --muted 13.5px, and a bottom line naming the typefaces used — a real magazine colophon detail that costs nothing and sells the register.

## STATES & EDGE CASES (mandatory)
- Fewer than 3 projects: the spreads still work at any count — one feature is a legitimate magazine. Never pad with invented work.
- Missing team, stats, clients or awards: section removal or qualitative variants. Nothing invented.
- Loading: --paper-2 blocks with a slow 2s opacity pulse (0.6 → 1). No hard shimmer — it breaks the print register.
- Empty: an italic --muted line and a text CTA.
- Error: a --paper card with a 2px --accent left rule, plain-language copy, a "Try again" text button.
- Image failure: the 1px --rule frame remains, filled --paper-2, with an italic caption "Plate unavailable". Never a broken-image glyph.
- Forms: inline validation on blur, errors in --accent 13px italic, aria-describedby, aria-live="polite", success replaces the form with a short serif confirmation.
- 404 and 500 as editorial notices with navigation intact.

## PERFORMANCE
- Two families via next/font with size-adjust — serif swap shift is the main CLS risk here.
- Preload only the display weight used above the fold.
- Grain as an inline SVG data URI, not an image request.
- CSS columns: set column-fill balance and avoid nesting them inside flex containers, which breaks fragmentation in Safari.
- One pin, one scrub. ScrollTrigger.refresh() after fonts load and on debounced resize; gsap.context revert on unmount.
- next/image with sizes and aspect-ratio containers on every plate.
- prefers-reduced-motion: disable Lenis, disable the pin and scrub, disable clip-path reveals, keep static layout.
- Target LCP < 2.1s, CLS < 0.04.

## ACCESSIBILITY
- Body copy at 17px with 1.72 line height and a 68ch measure is a hard requirement — this AD sells through reading.
- Captions are real <figcaption> inside <figure>; alt text describes the image and never duplicates the caption verbatim.
- The drop cap stays inside the paragraph node.
- Display serif at large sizes needs 3:1; body must clear 4.5:1 on --paper.
- Focus rings: 2px --accent, offset 3px. Grain aria-hidden, pointer-events-none.
- CSS multi-column text must not break tab order — keep interactive elements out of column flow.

## STRICT RULES
- No `any`. Strict TypeScript.
- Two families. The serif never appears at body size; the grotesque never at display size.
- Every plate has a caption. A plate without one is an automatic fail — it is the register.
- Motion is slow and soft: 700–1100ms, power3.out. One pin, one scrub, no more.
- No invented clients, awards, metrics or team members.
- Fully designed at 375px: columns collapse to one, spreads stack plate-first, the drop cap survives.
```

---

## TEMPLATE 05 — Reel Cinema

```
Act as an award-winning designer and elite frontend developer. Build the site for "{{BRAND_NAME}}", a {{VERTICAL}}. Art direction: reel cinema — motion studio register, filmic grade, timecode and frame counters, scrub-driven sequences, letterboxed stages. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: Tailwind CSS v4 (@theme)
- Animation: GSAP (ScrollTrigger, pin, scrub), Framer Motion for discrete UI
- Smooth scroll: Lenis (lerp 0.06), wired to ScrollTrigger via scrollerProxy with lenis.on('scroll', ScrollTrigger.update)
- Icons: lucide-react, strokeWidth 1.25
- Language: TypeScript strict

## DESIGN SYSTEM
Colors:
  --bg: #08080A
  --bg-2: #101014
  --fg: #EFEFEA
  --muted: #7C7C84
  --line: rgba(255,255,255,0.08)
  --accent: {{ACCENT_HEX}} (fallback #E8542F)
Typography:
  Display: "Archivo Expanded" weight 800, uppercase, tracking -0.02em, leading 0.86
  Body: "Inter" weight 400, leading 1.6, 16px
  Timecode: "JetBrains Mono" weight 400, tabular-nums, 12px, --muted
  Labels: uppercase, tracking 0.3em, 10.5px, --muted
  Scale: h1 clamp(3rem, 12vw, 12rem) / h2 clamp(2.25rem, 6vw, 5rem)
Grade: a fixed split-tone overlay (two radial gradients, mix-blend-soft-light, opacity 0.2) plus film grain (feTurbulence, opacity 0.045, mix-blend-overlay), both aria-hidden.
Letterboxing: the hero and pinned stages render inside a 2.39:1 frame above lg, 16:9 below.

## SECTIONS

### 1. Shell
- Lenis + ScrollTrigger scrollerProxy wiring is mandatory here — without it every pin offset is wrong. Call ScrollTrigger.refresh() after document.fonts.ready and on debounced resize.
- A fixed timecode readout in the bottom-left corner: mono, tabular-nums, showing a running position derived from scroll progress (00:00:00:00 format). aria-hidden — decorative.
- A 1px --accent scroll-progress line at the viewport top.

### 2. Navbar
- Fixed, transparent, mix-blend-difference so it reads over both dark and bright frames.
- Left "{{BRAND_NAME}}" in display, tracking 0.14em, 15px. Center: label-styled links with a center-out 1px underline on hover and focus. Right: "{{PRIMARY_CTA}}" as a 1px bordered pill.
- Mobile: a full-screen --bg overlay, links at clamp(2.5rem,11vw,4.5rem) display uppercase, entering with clip-path inset(100% 0 0 0) → inset(0), stagger 0.06, focus trapped, Escape closes.

### 3. Hero — Title Sequence
- Container 400vh with an inner sticky top-0 h-screen stage, letterboxed.
- h1 "{{HERO_HEADLINE}}" split by character, entering with clip-path inset(0 0 100% 0) → inset(0), stagger 0.02, on mount after fonts ready.
- Scroll envelope:
    0.00 → 0.20  h1 opacity 1 → 0, y 0 → -80
    0.15 → 0.45  block A ({{VALUE_PROP}}) opacity 0 → 1 → 0, y 60 → 0 → -60
    0.40 → 0.75  block B (three capability lines) same envelope
    0.70 → 1.00  the stage scales 1 → 0.82, border-radius 0 → 28px, opacity 1 → 0.4 — it recedes as the next section rises over it

- Stage background, VIDEO PATH [REQUIRES: video]:
    {{HERO_ASSET}} as a full-cover video (autoPlay loop muted playsInline preload="metadata", poster mandatory), opacity 0.55, scale tied to progress 1 → 1.18.
    A visible pause control is required for any autoplaying background video longer than 5 seconds.

- Stage background, STANDARD PATH [REQUIRES: none]:
    A CSS title-sequence stage — a --accent to --bg-2 radial wash drifting on a 26s loop, over a 1px --line perspective grid receding to a vanishing point (perspective + rotateX), with three slow-moving light bars sweeping diagonally on desynced 14s/19s/23s loops.
    The grade and grain sit above it exactly as they would above footage. The letterbox, the timecode and the scrub envelope do the cinematic work — the section reads identically without a frame of video.

### 4. Reel Strip
- A full-width band, bg --bg-2, 1px --line top and bottom.
- A horizontal track of project markers: each a mono timecode, a title in display uppercase at 14px, and a 1px --line separator.
- Auto-scrolls at 45s linear, pausing on hover and focus-within. Duplicate node measured on mount and on debounced resize.

### 5. Work — Stacked Stages
- Container 300vh with margin-top -100vh so it climbs over the receding hero.
- Left column sticky: a label and an h2. Right column: three full-bleed cards, each position: sticky at top: calc(88px + index * 36px).
- As each card pins, the cards beneath scale 1 → 0.94 → 0.88 and dim opacity 1 → 0.55 via useScroll and useTransform.
- Each card carries a display-uppercase title, a mono metadata line (year • category • role), and an index numeral at 12vw in --fg at 8% opacity.

- Card background, SEQUENCE PATH [REQUIRES: 3+ images or video]:
    The project's asset at opacity 0.28, object-cover.

- Card background, STANDARD PATH [REQUIRES: none]:
    A per-card CSS wash — a different hue rotation of --accent at opacity 0.26 over a 1px --line diagonal hatch, distinct per card so the stack reads as three surfaces.

### 6. Horizontal Gallery
- GSAP pin with x translation driven by vertical scroll (scrub 1), travel = trackWidth - viewportWidth.
- Five panels at 78vw with a 24px gap, each with a mono caption strip beneath.
- Inner counter-parallax on the panel contents (x -8% → 8%) for depth.
- Below lg: a native horizontal scroll container with scroll-snap-type x mandatory — no pin, no scrub.
- Panels use the same two paths as section 5.

### 7. Services
- A vertical list, each row 1px --line bottom, py-10: a mono index, a display-uppercase title, and body copy at 46ch.
- Hover and focus: row background → --bg-2, the title shifts to --accent, a mono duration label slides in from the right.
- Services {{ITEM_1}} … {{ITEM_6}}.

### 8. Contact — Knockout Text
- Full viewport, bg --bg.
- VIDEO PATH [REQUIRES: video]: video-in-text mask — an outer wrapper with mix-blend-screen containing a cover video, and an overlay div bg-[--bg] mix-blend-multiply text-[--fg] holding the headline at clamp(3rem,12vw,11rem). The footage plays only inside the letterforms.
- STANDARD PATH [REQUIRES: none]: the same knockout technique against a rotating conic-gradient in --accent and --bg-2 on a 12s loop. Identical letterform reveal, zero assets.
- Both: an @supports guard falling back to solid --accent text where mix-blend-mode is unsupported.
- A magnetic pill button beneath (gsap.quickTo, elastic.out return), plus {{CONTACT_EMAIL}} in label styling.

### 9. Footer
- Minimal, 1px --line top, three columns, --muted 13px, mono copyright line with a timecode-styled build stamp.

## STATES & EDGE CASES (mandatory)
- Video autoplay blocked (iOS low power): the poster carries the stage. The layout must be complete without motion.
- Video load failure: the poster, or the CSS stage from the standard path, at runtime with no layout jump.
- Fewer than 3 projects: the stacked stages become a single pinned stage plus an editorial list; the horizontal gallery is removed rather than padded.
- Missing clients, awards or metrics: removal or qualitative variants. Nothing invented.
- Loading: --bg-2 blocks with a horizontal --line sweep, 1.8s.
- Empty: a label-styled --muted line, centered, one text CTA.
- Error: a --bg-2 card with a 1px --accent left border, plain-language copy, a retry action.
- ScrollTrigger: refresh on resize and after fonts load, or every pin offset is wrong. Kill all triggers and the Lenis instance on unmount (gsap.context revert) to survive route changes.
- Forms: inline errors, aria-live="polite", disabled submit with "SENDING…".
- 404 and 500 as slate-styled cards with navigation intact.

## PERFORMANCE
- At most two pinned sequences in the whole page. More reads as a demo reel, not a studio site.
- Every scrub is transform and opacity only. A layout-triggering scrub is an automatic fail.
- Videos ≤ 1080p, ≤ 3 MB, preload="metadata", paused via IntersectionObserver off-screen.
- will-change: transform on pinned stages, removed on ScrollTrigger kill.
- next/font, preload the display weight; the poster or the h1 is the LCP element, never the video.
- prefers-reduced-motion: disable Lenis, disable every pin and scrub (stages become stacked static sections), pause videos and show posters, freeze the CSS stage, keep opacity only.
- Target LCP < 2.5s, CLS < 0.05.

## ACCESSIBILITY
- mix-blend-difference navbar verified legible over the brightest frame, not the average.
- A visible pause control for any autoplaying background video over 5 seconds.
- The horizontal gallery is keyboard navigable (arrow keys move panels) and never traps focus.
- The timecode readout is decorative: aria-hidden.
- Grade, grain and hatches: aria-hidden, pointer-events-none.
- Focus rings: 2px --accent, offset 2px, verified against --bg and --bg-2.

## STRICT RULES
- No `any`. Strict TypeScript.
- Lenis and ScrollTrigger must be wired together. Skipping scrollerProxy is the single most common failure on this template.
- Restraint: two pins maximum.
- No invented clients, awards, metrics or team members.
- Fully designed at 375px — pins become static sections, the gallery becomes snap-scroll, letterboxing drops to 16:9.
```

---

## TEMPLATE 06 — Playful Bold Studio

```
Act as an award-winning designer and elite frontend developer. Build the site for "{{BRAND_NAME}}", a {{VERTICAL}}. Art direction: playful bold studio — bright ground, oversized rounded type, cursor-reactive shapes, spring physics everywhere. Energetic and warm without being juvenile. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: Tailwind CSS v4 (@theme)
- Animation: Framer Motion (spring, drag, layout, useMotionValue), CSS keyframes
- Smooth scroll: Lenis (lerp 0.085)
- Icons: lucide-react, strokeWidth 2.25
- Language: TypeScript strict

## DESIGN SYSTEM
Colors:
  --bg: #FFFCF5
  --bg-2: #FFEFD9
  --ink: #16120E
  --muted: #7A7268
  --pop-1: #FF5A47
  --pop-2: #3D7BFF
  --pop-3: #16C79A
  --pop-4: #FFC93C
  --accent: {{ACCENT_HEX}} (fallback --pop-1)
Typography:
  Display: "Bricolage Grotesque" or "Clash Display" weight 700–800, tracking -0.035em, leading 0.88
  Body: "Satoshi" weight 400/500, leading 1.6, 17px
  Labels: weight 600, uppercase, tracking 0.16em, 11px
  Scale: h1 clamp(3rem, 11vw, 10rem) / h2 clamp(2.25rem, 5.5vw, 4.5rem)
Shape: radius 24px cards, 999px buttons, 36px large surfaces. Borders 3px --ink on interactive surfaces with a 6px 6px 0 --ink hard offset shadow; hover translates (3px,3px) and shrinks the shadow to 3px 3px 0, 140ms cubic-bezier(0.2,0,0,1). The same gesture fires on focus-visible.

## SECTIONS

### 1. Shell
- Cursor-reactive shapes: 6–8 geometric SVG forms (circles, arcs, blobs, squiggles) in the four pop colours, positioned per section. Each eases toward the cursor at a different rate (useMotionValue + useSpring, stiffness 40–90, damping 20) so the page feels physically responsive without being noisy.
- Section separators: chunky 4px --ink wave dividers.
- Rhythm py-20 mobile / py-32 desktop.

### 2. Navbar
- Floating bar, top-4, mx-4, bg --bg, 3px --ink border, 5px 5px 0 shadow, radius 999px.
- Left {{BRAND_NAME}} in display. Center links weight 500. Right: "{{PRIMARY_CTA}}" pill in --accent with --bg text.
- Link hover and focus: a --pop-4 rounded highlight scales in behind (layoutId, spring stiffness 380 damping 30).
- Mobile: the bar expands downward (layout height auto), links stacked with 3px --ink dividers, focus trapped, Escape closes.

### 3. Hero
- min-h-[92vh], centered, max-w-5xl.
- h1 "{{HERO_HEADLINE}}": each word enters rotate(-5deg → 0), y 44 → 0, spring (stiffness 210 damping 17), stagger 0.07. Two words get rounded-rect highlights in --pop-4 and --pop-3 scaling in from scaleX(0) after the text lands.
- {{VALUE_PROP}} beneath at 19px --muted, then a CTA row.
- Around the headline: three draggable cards with the full signature treatment (Framer Motion drag, dragConstraints to the hero bounds, dragElastic 0.16, dragDirectionLock, whileDrag scale 1.06 rotate 3deg).
    STANDARD PATH [REQUIRES: none]: each card holds a built micro-composition — a three-bar chart in pop colours, an avatar stack with a count, a toggle row. The flat geometric style makes built fragments read better than cropped screenshots.
    ENHANCED PATH [REQUIRES: 2+ images]: two cards hold project images cropped square, the third keeps a built fragment for contrast.

### 4. Marquee Band
- Full-bleed --pop-4 band, 4px --ink top and bottom borders.
- Display-uppercase text scrolling left, built from {{ITEM_*}} joined by --ink circle glyphs. Duplicate node measured on mount and on debounced resize. Pauses on hover and focus-within.

### 5. Services — Signature Cards
- 3-column grid (1 below md), each card with the full signature treatment and a distinct palette background — cycle --bg-2, --pop-3 at 22%, --pop-2 at 18%, never all the same.
- Each: a 52px geometric icon inside a solid-colour circle, a display heading, body copy, and an arrow link translating x on hover and focus.
- Entrance: whileInView y 32 → 0 with a spring, stagger 0.08, once.
- Services {{ITEM_1}} … {{ITEM_6}}.

### 6. Work — Playful Grid
- An irregular grid of project tiles with the signature treatment, deliberately uneven column spans.
- Hover and focus: the tile rotates 2deg, the shadow deepens, and its title slides up from the bottom edge.

- Tile contents, SEQUENCE PATH [REQUIRES: 3+ images]:
    The project image object-cover with a 3px --ink border, scaling 1.04 on hover.

- Tile contents, STANDARD PATH [REQUIRES: none]:
    A per-project solid pop colour with the project's initials set at 6vw in --ink, plus one large geometric shape offset behind them. Distinct colour and shape per tile.
    This reads as a deliberate identity system, which suits a studio pitching brand work better than placeholder photography would.

### 7. Studio + Stats
- Two columns: left a display heading and body copy; right {{DETAIL_*}} as chunky bordered rows.
- {{PROOF_STAT_*}} render in display at clamp(2.5rem,5vw,4rem) with CountUp on entry and their qualifier in 12px --muted. Absent, the block is qualitative with no numerals.

### 8. Team [REQUIRES: {{TEAM_*}}]
- A grid of signature-treatment cards, each with a portrait in a 3px --ink bordered circle, a name in display, and a role.
- Hover and focus: the card presses, the portrait rotates 3deg.
- Absent, delete the section. No stock portraits.

### 9. Contact + Footer
- Contact: a large --pop-3 rounded panel (radius 36px, 4px --ink border) with a display headline, a form with 3px --ink bordered inputs, and a --accent submit.
- Footer: bg --ink, text --bg. Four columns, display headers, socials as 3px bordered squares with --pop-4 hover fill, {{CONTACT_EMAIL}}.

## STATES & EDGE CASES (mandatory)
- Fewer than 3 projects: the irregular grid still works — it is irregular by design. Never pad with invented work.
- Missing team, stats, clients or awards: removal or qualitative variants. Nothing invented.
- Loading: signature-treatment skeletons keep their 3px border and hard shadow, contents replaced by --ink/10 bars with a 1.2s shimmer. The structure never collapses.
- Empty: a bordered card with a geometric illustration, one line, one primary button.
- Error: a bordered card with a --pop-1 22% fill, plain-language copy, a full-treatment retry button.
- Drag on touch: dragDirectionLock so cards never hijack vertical scroll; dragElastic reduced to 0.08.
- Cursor-reactive shapes: disabled entirely on (hover: none) devices — no fallback needed, the layout stands without them.
- Forms: 3px --ink bordered inputs with a 4px 4px 0 shadow, focus shifting the shadow to --pop-2, errors in --pop-1, aria-live="polite".
- 404: an oversized display "404" with scattered shapes and a home button.

## PERFORMANCE
- Hard shadows are cheap (no blur) — but cap concurrent drag listeners and animate transform only.
- Cursor-reactive shapes: one shared mousemove listener updating motion values, never one listener per shape.
- Shapes as inline SVG, aria-hidden, pointer-events-none.
- next/font for both families, preload the display weight.
- next/image with sizes and aspect ratios on every tile.
- prefers-reduced-motion: disable cursor reactivity and marquee, disable drag inertia (keep drag), replace spring entrances with a 180ms opacity fade, render CountUp finals instantly, keep the press gesture without overshoot.
- Target LCP < 2.0s, CLS < 0.05.

## ACCESSIBILITY
- Bold palette combinations must clear 4.5:1 for body text — verify --ink on --pop-4, --pop-1, --pop-2 and --pop-3 specifically, and darken the surface rather than lightening the text.
- Draggable cards are decorative: aria-hidden, with all their information available elsewhere.
- The press gesture fires on focus-visible as well as hover.
- Focus rings: 3px --pop-2, offset 3px — thick enough to read against the bold borders.
- Colour is never the sole differentiator on project tiles — the title is always present.

## STRICT RULES
- No `any`. Strict TypeScript.
- Never blur a shadow. Hard offset only — that is the signature.
- Maximum four palette colours on screen at once.
- Playful is not juvenile: the grid stays strict, the copy stays adult, the type scale stays disciplined.
- No invented clients, awards, metrics or team members.
- Fully designed at 375px, including the draggable cluster (reduce to two cards).
```

---

## TEMPLATE 07 — Terminal Dev Studio

```
Act as an award-winning designer and elite frontend developer. Build the site for "{{BRAND_NAME}}", a {{VERTICAL}}. Art direction: terminal dev studio — monospace discipline, code-object aesthetics, build logs and commit rhythm, engineering credibility over polish. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: Tailwind CSS v4 (@theme)
- Animation: Framer Motion, GSAP TextPlugin for typed sequences
- Smooth scroll: none — native scroll suits the register. Do not add Lenis.
- Icons: lucide-react, strokeWidth 1.5
- Language: TypeScript strict

## DESIGN SYSTEM
Colors:
  --bg: #0A0C0D
  --surface: #11151700
  --surface-solid: #111517
  --surface-2: #171D20
  --line: #212A2E
  --fg: #D6DEE1
  --muted: #5F6E74
  --phosphor: #3BF0A8
  --alert: #FF5C5C
  --accent: {{ACCENT_HEX}} (fallback --phosphor)
Typography:
  Everything: "IBM Plex Mono" weights 400/500/600
  Display: same family weight 600, uppercase, tracking -0.02em
  Scale: h1 clamp(2.25rem, 6vw, 5rem) / h2 clamp(1.75rem, 3.5vw, 3rem) / body 15px / data 13px
Motion: 120–200ms everywhere, cubic-bezier(0.2, 0, 0, 1). Snappy, mechanical, never silky.
Structure: radius 4px, 1px --line hairlines only. No shadows, no gradients, no blur.

## SECTIONS

### 1. Shell
- A fixed scanline overlay: repeating-linear-gradient(0deg, transparent 0 2px, rgba(255,255,255,0.016) 2px 3px), pointer-events-none, aria-hidden, z-[100].
- A 28px status strip at the top: bg --surface-solid, 1px --line bottom. Left "sys://{{BRAND_NAME}}", center a live UTC clock (one shared 1s interval, cleared on unmount, recomputed from Date.now() rather than decremented), right a --phosphor dot and "AVAILABLE" or "BOOKED" from supplied data only.
- Custom cursor: a 16px --phosphor crosshair, hidden on (hover: none) devices with the native cursor restored.

### 2. Navbar
- Below the strip, full-width, bg --bg/80 backdrop-blur-sm, 1px --line bottom.
- Left "[{{BRAND_NAME}}]" with --phosphor brackets. Center: links rendered as CLI flags — "--work", "--services", "--studio". Hover and focus: text --phosphor with a blinking block cursor appearing after the label.
- Right: "{{PRIMARY_CTA}}" as a square button, 1px --phosphor border, transparent → --phosphor/10 fill.
- Mobile: a full-screen overlay styled as a terminal session, each link on its own line prefixed by "$ ", focus trapped, Escape closes.

### 3. Hero
- min-h-screen, left-aligned in a max-w-4xl column — never centered.
- Boot sequence on mount: four mono lines typing in at 18ms/char via GSAP TextPlugin ("> initializing…", "> loading {{VERTICAL}}…", "> ready", "> _"). Then h1 hard-cuts in with a single 60ms opacity step. The abruptness is intentional.
- h1 "{{HERO_HEADLINE}}" uppercase. {{VALUE_PROP}} in --muted beneath. CTA row: a --phosphor bordered primary and a text link with a "→" translating 4px on hover and focus.
- No hero image at any asset level — this template's hero is typographic by design.

### 4. Build Log Ticker
- Full-width strip, bg --surface-solid, 1px --line top and bottom, height 40px.
- An auto-scrolling feed of short entries: a timestamp, a tag (SHIP / FIX / PUSH in --phosphor / --muted / --fg), and a message.
- Entries come from {{PROJECT_*}} and {{ITEM_*}} only. **If the feed is illustrative rather than real activity, it carries a persistent mono "SAMPLE" tag at its left edge that never scrolls out.** Never fabricate the appearance of live delivery activity.
- Array capped at 40 entries to avoid unbounded growth. Pauses on hover and focus-within.

### 5. Work — Repository Index
- The project list as a repository listing: 1px --line rows, each with a mono index, the project name, a language-dot-style category chip, the year, and a right-aligned arrow.
- Row hover and focus: background → --surface-2, name → --phosphor, arrow translates x 6.
- Expanding a row (Enter or click) reveals a mono spec block beneath (bg --surface-2, 12px, key: value pairs from the project's metadata) with a 200ms height animation. One open at a time, aria-expanded maintained.

- Expanded media, SEQUENCE PATH [REQUIRES: 3+ images]:
    The project image inside a --surface-solid frame with a mono window-chrome bar (three 9px --muted squares and a title).

- Expanded media, STANDARD PATH [REQUIRES: none]:
    A mono spec block only — stack, role, duration, outcome. In this art direction a well-set spec block outperforms a screenshot; it is what the audience actually reads.

### 6. Services — Function Signatures
- Each service rendered as a mono function signature block on --surface-solid with a 1px --line: a --phosphor function name from {{ITEM_*}}, typed parameters on the following lines, and a returns line.
- Body copy beneath each in --fg at 15px, 46ch.
- Purely typographic and completely asset-free.

### 7. Studio
- A two-column mono definition table on --surface-solid, 1px --line grid, rows py-3: labels in --muted, values in --fg with tabular-nums.
- Built from {{DETAIL_*}}. {{PROOF_STAT_*}} render with tabular-nums and a mono qualifier; absent, the table is qualitative with no numerals.

### 8. Contact + Footer
- Contact: a terminal-form treatment — inputs on --surface-2 with a 1px --line, prefixed by mono "$" glyphs, labels above in mono uppercase. Submit reads "[send]" and becomes "[sending…]" while pending.
- Footer: bg --bg, 1px --line top, four columns, mono 12px, {{CONTACT_EMAIL}}, and a build-stamp line.

## STATES & EDGE CASES (mandatory)
- Illustrative feed data is labelled "SAMPLE" persistently and visibly — not a tooltip, not alt text, not removable by scroll.
- Fewer than 3 projects: the repository index still renders. Never pad with invented entries.
- Missing clients, awards, metrics or team: removal or qualitative variants. Nothing invented.
- Loading: a blinking block cursor plus "loading…" in --muted. No spinners, no shimmer — wrong idiom for this AD.
- Empty: "// no records" in --muted, centered, with a bracketed action link.
- Error: a --surface-solid card with a 1px --alert left border, plain-language copy, a "[retry]" bracketed action.
- All intervals and rAF loops cleared in useEffect cleanup. No leaked timers.
- Forms: inline errors in --alert below the field, aria-describedby, aria-live="polite".
- 404: a terminal error dump with a "[return home]" action.

## PERFORMANCE
- No smooth-scroll library, no blur, no shadows, no gradients — a very light template. Keep it that way.
- The ticker pauses via IntersectionObserver off-screen and on visibilitychange.
- next/font for IBM Plex Mono, preload weight 400 only.
- prefers-reduced-motion: disable typing (render final text), stop the ticker auto-scroll (make it manually scrollable), keep the instant state changes.
- Target LCP < 1.7s, CLS < 0.03.

## ACCESSIBILITY
- --phosphor on --bg must clear 4.5:1 for any body-size text; use --fg for long-form copy and reserve --phosphor for accents and short labels.
- The scanline overlay and custom cursor: aria-hidden, pointer-events-none; the cursor must never hide the native focus ring.
- The ticker is aria-live="off" (decorative); genuine status uses a separate aria-live="polite" region.
- The repository index is a semantic <table> or a list with proper roles; rows are focusable and expand on Enter.
- Focus rings: 2px --phosphor, offset 2px.

## STRICT RULES
- No `any`. Strict TypeScript.
- Monospace everywhere. No sans-serif fallback in the design.
- Motion is fast and mechanical. Never bouncy, never elastic, never over 200ms.
- Density is the aesthetic: fill space with real specification, not decorative padding.
- Illustrative activity is always labelled. Simulating live delivery is an automatic fail.
- No invented clients, awards, metrics or team members.
- Fully designed at 375px — the repository index becomes a two-line row format, never a squashed table.
```

---

## TEMPLATE 08 — Soft Ceramic Light

```
Act as an award-winning designer and elite frontend developer. Build the site for "{{BRAND_NAME}}", a {{VERTICAL}}. Art direction: soft ceramic light — warm off-white ground, matte surfaces, slow breathing motion, generous air. Calm confidence, the opposite of a demo reel. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: Tailwind CSS v4 (@theme)
- Animation: Framer Motion (soft springs), CSS keyframes for ambient loops
- Smooth scroll: Lenis (lerp 0.075)
- Icons: lucide-react, strokeWidth 1.25
- Language: TypeScript strict

## DESIGN SYSTEM
Colors:
  --bg: #F8F5F0
  --surface: #FFFFFF
  --bg-2: #EFEAE1
  --ink: #24211C
  --muted: #837C72
  --line: #E4DED3
  --clay: #C08867
  --sage: #7C8F72
  --accent: {{ACCENT_HEX}} (fallback --clay)
Typography:
  Display: "Fraunces" variable (optical size on) weight 400–500, tracking -0.018em, leading 1.04
  Body: "Inter" weight 400, leading 1.72, 17px, measure max 66ch
  Labels: weight 500, uppercase, tracking 0.2em, 10.5px, --muted
  Scale: h1 clamp(2.5rem, 6.5vw, 5.5rem) / h2 clamp(1.875rem, 4vw, 3.25rem)
Shape: radius 20px cards, 999px buttons, 32px large surfaces. Shadow 0 2px 22px rgba(36,33,28,0.05) — matte, never glossy.

## SECTIONS

### 1. Shell
- Ambient: two large --clay and --sage radial washes at 9% opacity, fixed, aria-hidden, pointer-events-none, scaling 1 → 1.05 on desynced 17s and 23s ease-in-out infinite alternate loops.
- Rhythm py-24 mobile / py-40 desktop. Whitespace separates sections; rules appear only inside components.

### 2. Navbar
- Floating rounded bar, top-5, max-w-5xl, bg --surface/85 backdrop-blur-lg, 1px --line, radius 999px, matte shadow.
- Left {{BRAND_NAME}} in Fraunces. Center label-styled links. Right "{{PRIMARY_CTA}}" pill in --clay with --bg text.
- Link hover and focus: a --bg-2 pill scales in behind (layoutId, spring stiffness 320 damping 30).
- Mobile: the pill morphs into an expanding rounded card (layout height auto), links stacked with 20px gaps, focus trapped, Escape closes.

### 3. Hero
- Centered, max-w-3xl, generous py.
- An eyebrow pill in --bg-2 with a --sage dot, then h1 "{{HERO_HEADLINE}}" with words fading up on a spring (stiffness 175 damping 22), stagger 0.08, y 24 → 0. One word set in Fraunces italic --clay.
- {{VALUE_PROP}} at 18.5px --muted, then a CTA row.

- Hero plate, ENHANCED PATH [REQUIRES: 1+ image]:
    {{HERO_ASSET}} in a 32px-radius frame entering y 48 → 0, scale 0.97 → 1, delay 0.45, with a --bg-2 blob offset behind it at low z.

- Hero plate, STANDARD PATH [REQUIRES: none]:
    A ceramic composition in pure CSS — three overlapping soft forms (a large circle in --bg-2, an arc in --clay at 18%, a smaller circle in --sage at 14%), each drifting ±10px on desynced 12s/16s/21s loops, inside the same 32px-radius frame.
    It reads as a considered object, which is exactly the register. Not a placeholder.

### 4. Work — Quiet Index
- Projects as an editorial list: 1px --line between rows, py-9. Each row carries a display title, a category and year in label styling, and an arrow.
- Hover and focus: the row background eases to --bg-2 over 320ms, the title shifts to --clay, the arrow translates x 8.

- Row media, SEQUENCE PATH [REQUIRES: 3+ images]:
    A 260x340 thumbnail fades and scales in on the right of the row (opacity 0 → 1, scale 0.96 → 1, 380ms) — positioned, not cursor-following. The calm register rules out cursor chasing.

- Row media, STANDARD PATH [REQUIRES: none]:
    No thumbnail. A --clay index numeral and the row wash carry the interaction. Restraint is the whole point of this art direction.

### 5. Services — Soft Cards
- 2x2 or 3-column grid, cards bg --surface, radius 20px, 1px --line, matte shadow.
- An icon in a 48px --bg-2 circle at the top of each card.
- Hover and focus: card lifts y -4px, shadow deepens, 320ms cubic-bezier(0.34,1.56,0.64,1).
- Entrance: whileInView y 24 → 0, stagger 0.07, once.
- Services {{ITEM_1}} … {{ITEM_6}}.

### 6. Process
- Three or four steps in a row, connected by a soft dashed --line curve (SVG path) drawing in on scroll via stroke-dashoffset.
- Each: a numeral in Fraunces inside a --bg-2 circle, a title, one line of body.
- Below md: vertical connector, stacked steps.

### 7. Studio
- Two columns: left a display heading and two paragraphs at a 66ch measure; right {{DETAIL_*}} as a definition list with 1px --line rows.
- {{PROOF_STAT_*}} render in Fraunces with CountUp and their qualifier in 12px --muted; absent, qualitative with no numerals.

### 8. Team [REQUIRES: {{TEAM_*}}]
- Portrait cards on --surface with 1px --line and radius 20px: a photo in a rounded frame, a name in Fraunces, a role in label styling.
- Absent, delete the section. No stock portraits.

### 9. Contact + Footer
- Contact: a large --bg-2 rounded panel (radius 40px) with a centered Fraunces headline, {{CONTACT_EMAIL}} as a display link, and a form with rounded inputs.
- Footer: --bg, four columns, --muted 14px, socials as --bg-2 circles with --clay icon hover.

## STATES & EDGE CASES (mandatory)
- Fewer than 3 projects: the quiet index works at any length. Never pad with invented work.
- Missing team, stats, clients or awards: removal or qualitative variants. Nothing invented.
- Loading: --bg-2 blocks at 45% opacity with a gentle 2s pulse. No hard shimmer — it breaks the calm.
- Empty: a --surface card, a soft illustration circle, a warm one-line message, one --clay pill CTA.
- Error: a --surface card with a 3px --clay left border, plain-language copy, a ghost "Try again".
- Image failure: the rounded frame stays, filled --bg-2, with a --muted centered label.
- Forms: rounded inputs with 1px --line, 2px --clay focus ring with a soft glow, errors in --clay 13px, aria-live="polite", success replaces the form with a --bg-2 confirmation card.
- 404 and 500 in the same warm system.

## PERFORMANCE
- Fraunces is variable — load one variable file, not multiple static weights.
- Ambient washes are CSS-only, no canvas, no JS loop.
- next/font with display swap and size-adjust; next/image with sizes and aspect-ratio containers.
- prefers-reduced-motion: freeze the ambient washes and the ceramic drift, replace springs with a 200ms opacity fade, render CountUp finals instantly, keep hover lifts without overshoot easing.
- Target LCP < 1.9s, CLS < 0.04, INP < 190ms.

## ACCESSIBILITY
- --muted on --bg and --bg on --clay must both clear 4.5:1 — darken --clay for button surfaces rather than lightening the text.
- Body copy at 17px with a 1.72 line height and a 66ch measure is a hard requirement.
- Ambient layers and ceramic forms: aria-hidden, pointer-events-none.
- Every hover state fires on focus-visible; the quiet index is fully keyboard operable.
- Focus rings: 2px --clay, offset 2px.

## STRICT RULES
- No `any`. Strict TypeScript.
- Never sharpen a corner. Roundness and matte light are the signature.
- Motion breathes: 320–900ms, gentle springs, no overshoot above 1.02, no cursor chasing.
- --clay and --sage are accents. --bg stays dominant across every section.
- No invented clients, awards, metrics or team members.
- Fully designed at 375px with the same proportional generosity.
```

---

## TEMPLATE 09 — Archive Index

```
Act as an award-winning designer and elite frontend developer. Build the site for "{{BRAND_NAME}}", a {{VERTICAL}}. Art direction: archive index — the entire site as a filterable data table, work presented as records, near-zero chrome, information density as the aesthetic. The most asset-independent template in the set. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: Tailwind CSS v4 (@theme)
- Animation: Framer Motion (layout, AnimatePresence) — no scroll libraries
- Smooth scroll: none. Native scroll is correct here.
- Icons: lucide-react, strokeWidth 1.25
- Language: TypeScript strict

## DESIGN SYSTEM
Colors:
  --bg: #FCFCFA
  --bg-2: #F3F3F0
  --ink: #131311
  --muted: #77776F
  --line: #E0E0DA
  --accent: {{ACCENT_HEX}} (fallback #1F4FD8)
Typography:
  Single family: "Söhne", "Neue Haas Grotesk" or "Inter" — weights 400/500/600
  Display: weight 500, tracking -0.02em, leading 1.06
  Body: weight 400, 15.5px, leading 1.6
  Data: tabular-nums on every year, count and figure
  Labels: weight 500, uppercase, tracking 0.2em, 10px, --muted
  Scale: h1 clamp(1.75rem, 3vw, 2.75rem) — deliberately small. The table is the hero, not a headline.
Structure: radius 0. 1px --line hairlines only. No shadows, no gradients, no blur.

## SECTIONS

### 1. Shell
- A fixed 40px header bar, 1px --line bottom: left {{BRAND_NAME}} at 14px weight 500, center a live record count in tabular-nums ("47 records"), right {{CONTACT_EMAIL}} as a text link.
- No hero section in the conventional sense. The page opens directly into content — that is the concept.
- Everything sits in a max-w-[1600px] container with px-6.

### 2. Statement
- A single block at the top: {{VALUE_PROP}} at clamp(1.25rem,2.2vw,1.75rem), weight 400, 62ch measure, --ink.
- Beneath, a label-styled metadata line: founded year, location, focus — from {{DETAIL_*}} only.
- No entrance animation. It is simply there when the page loads. Restraint is the register.

### 3. Filter Bar
- A sticky row beneath the header, 1px --line bottom, bg --bg/95 backdrop-blur-sm.
- Filter chips derived from the categories present in {{PROJECT_*}}: "All", then each category with its count in tabular-nums.
- Active chip: --ink fill with --bg text. Others: 1px --line border.
- Filtering re-flows the table via Framer Motion layout with AnimatePresence, 240ms, ease [0.16,1,0.3,1]. Never a jarring re-mount.
- Also a sort control (Year ↓ / Year ↑ / A–Z), and a live-region announcement of the resulting count.

### 4. Index Table (the entire body of the site)
- A semantic table with a sticky header row: Index / Project / Category / Year / Role.
- Rows: 1px --line bottom, py-5, all data in tabular-nums where numeric.
- Row hover and focus: background → --bg-2, the project name → --accent, 140ms.
- Expanding a row (click or Enter) reveals a detail panel beneath with a 260ms height animation: the blurb at a 66ch measure, a metadata definition list, and any supplied link. One open at a time, aria-expanded maintained, arrow keys move between rows.

- Detail panel media, SEQUENCE PATH [REQUIRES: 3+ images]:
    A horizontal strip of up to four thumbnails at 1px --line borders, click-to-open a lightbox (focus trapped, Escape closes, arrow keys navigate, focus restored).

- Detail panel media, STANDARD PATH [REQUIRES: none]:
    No imagery. The blurb and the metadata list are the record. An archive of well-written records is a complete and frequently-admired studio site — do not add placeholder frames.

### 5. Services
- A second, smaller table: Service / Description / Typical engagement.
- Same row treatment. Built from {{ITEM_*}} and {{DETAIL_*}}.

### 6. Studio
- A three-column definition grid with 1px --line separators: {{DETAIL_*}} entries as label/value pairs.
- {{PROOF_STAT_*}} render as additional rows with tabular-nums and their qualifier in 11px --muted. Absent, they simply do not appear — this layout has no hole to fill, which is why it degrades better than any other template here.

### 7. Colophon Footer
- 1px --line top. Three columns at 13px --muted: contact, social text links, and a colophon naming the typeface and the build stack.
- A final row with the copyright and a last-updated date in tabular-nums.

## STATES & EDGE CASES (mandatory)
- Any number of projects works, including one. The record count is live and always accurate — never a rounded-up or invented figure.
- Filter returning zero results: the table body shows a single centered --muted row, "No records match this filter", plus a "Clear filters" text button. The header row remains.
- Missing categories: the filter bar renders with "All" only, or is removed if there is nothing to filter.
- Missing stats, clients, awards or team: those rows or sections simply do not render. Nothing invented, no empty shells.
- Loading: --bg-2 row skeletons at the exact final row height with a 1.2s shimmer. Zero shift on resolve — critical, since the table is the LCP element.
- Error: a full-width row with a 2px --accent left border, plain-language copy, and a "Retry" text button. Never an error code.
- Sorting and filtering must be announced via aria-live="polite" with the resulting count.
- Forms (contact): labels above fields, 1px --line inputs, 2px --accent focus ring, validation on blur, aria-describedby, aria-live="polite".
- 404: a single-row table reading "Record not found" with a home link.

## PERFORMANCE
- One font family, one variable file, next/font with display swap and size-adjust.
- No scroll library, no blur, no shadows, no canvas — the lightest template in the entire set.
- Virtualise the table only above 100 rows; below that, plain semantic markup outperforms it.
- Framer Motion layout animations on filter: use layoutId sparingly and set layout="position" where possible to avoid full re-measures.
- next/image with sizes on thumbnails, lazy, explicit aspect ratios.
- prefers-reduced-motion: replace the layout re-flow with an instant re-render, keep the 140ms colour transitions.
- Target LCP < 1.5s, CLS < 0.02, INP < 150ms.

## ACCESSIBILITY
- The table is a real <table> with <caption>, <thead>, <tbody> and scope on every <th>. This is non-negotiable — the entire site is this table.
- Rows are focusable and expand on Enter or Space; the expanded panel is associated via aria-controls.
- Filter chips are a role="group" of toggle buttons with aria-pressed, not links.
- Sort control announces the new order politely.
- Focus rings: 2px --accent, offset 2px, visible on both --bg and --bg-2.
- --muted on --bg verified ≥ 4.5:1 at 13px — this template runs small type, so verify at the actual rendered size.

## STRICT RULES
- No `any`. Strict TypeScript.
- One family, radius 0, hairlines only. No shadows, no gradients, no blur, no scroll library.
- The table is the design. Do not add a hero image, a marquee, or a decorative section to "warm it up".
- Every count on the page is derived from real data, never hardcoded.
- No invented clients, awards, metrics, records or team members.
- Fully designed at 375px: the table becomes a two-line stacked row format with the label above each value — never a horizontally squashed table.
```

---

## TEMPLATE 10 — Duotone Riso Poster

```
Act as an award-winning designer and elite frontend developer. Build the site for "{{BRAND_NAME}}", a {{VERTICAL}}. Art direction: duotone riso poster — screen-print register, halftone texture, two saturated inks with deliberate misregistration, poster-scale type. Graphic and tactile. Production-ready, 100% responsive.

## TECH STACK
- Framework: Next.js 15 (App Router)
- Styling: Tailwind CSS v4 (@theme)
- Animation: Framer Motion, GSAP ScrollTrigger for one pinned sequence
- Smooth scroll: Lenis (lerp 0.07), scrollerProxy-wired to ScrollTrigger
- Icons: lucide-react, strokeWidth 2
- Language: TypeScript strict

## DESIGN SYSTEM
Colors:
  --paper: #F4F1E8
  --paper-2: #E8E3D5
  --ink-1: {{ACCENT_HEX}} (fallback #FF4D2E — riso orange)
  --ink-2: #1B45D8 (riso blue)
  --fg: #16150F
  --muted: #7E7A6C
Typography:
  Display: "Archivo Expanded" or "Druk"-style condensed weight 800, uppercase, tracking -0.03em, leading 0.84
  Body: "Inter" weight 400/500, leading 1.58, 16px
  Labels: weight 600, uppercase, tracking 0.22em, 10.5px
  Scale: h1 clamp(3rem, 13vw, 13rem) / h2 clamp(2.25rem, 7vw, 6rem)
Print treatments (the entire identity):
  Halftone: a repeating radial-gradient dot pattern at 4px pitch, applied via mask-image over any coloured surface, opacity 0.9.
  Misregistration: coloured elements render twice — the --ink-2 copy offset 3px x and 2px y beneath the --ink-1 copy, both at mix-blend-multiply. Never perfectly aligned; the offset is the effect.
  Paper grain: feTurbulence baseFrequency 0.7, opacity 0.06, mix-blend-multiply, fixed, aria-hidden.
Structure: radius 0. Borders 2px --fg. No shadows, no blur, no gradients other than the halftone mask.

## SECTIONS

### 1. Shell
- --paper ground with the grain overlay fixed above everything at z-[90].
- Sections separated by 2px --fg rules, occasionally interrupted by a --ink-1 halftone band.
- Rhythm py-20 mobile / py-32 desktop.

### 2. Navbar
- Static, bg --paper, 2px --fg bottom border, height 68px.
- Left "{{BRAND_NAME}}" in display uppercase 19px with the misregistration treatment. Center: label-styled links. Right "{{PRIMARY_CTA}}" as a 2px --fg bordered rectangle inverting to --ink-1 fill on hover and focus.
- Mobile: a full-screen --ink-1 overlay with a halftone mask, links in display at clamp(2.5rem,12vw,5rem) in --paper, hard cut entrances, focus trapped, Escape closes.

### 3. Hero — Poster
- min-h-screen, structured as a printed poster: h1 "{{HERO_HEADLINE}}" filling the width at clamp(3rem,13vw,13rem), set flush left, with the full misregistration treatment (an --ink-2 copy offset beneath an --ink-1 copy, both multiply-blended, both halftoned).
- Entrance: the two colour layers enter separately — the --ink-2 layer first at y 20 → 0 over 0.6s, then the --ink-1 layer at y -14 → 0 over 0.6s with a 0.12s delay, so the registration visibly "lands". This is the signature moment of the template.
- {{VALUE_PROP}} beneath in a 2-column block at 46ch, with a label-styled edition line ("No. 001 — {{VERTICAL}}") in the corner.
- No image at any asset level. The poster is type and ink.

### 4. Halftone Band
- A full-bleed --ink-1 band with the halftone mask, 2px --fg top and bottom borders.
- Display-uppercase text in --paper scrolling left, built from {{ITEM_*}} joined by --paper circle glyphs. Duplicate node measured on mount and on debounced resize. Pauses on hover and focus-within.

### 5. Work — Poster Plates
- Each project is a plate: a 2px --fg bordered square panel in a 2- or 3-column grid.

- Plate contents, SEQUENCE PATH [REQUIRES: 3+ images]:
    The project image rendered duotone — a CSS filter chain (grayscale then a --ink-1/--ink-2 duotone via mix-blend-multiply layers) with the halftone mask over it, so supplied photography enters the print system rather than sitting outside it.
    Hover and focus: the halftone pitch shifts from 4px to 6px, and the misregistration offset animates from 3px to 6px over 220ms — the plate appears to shift on press.

- Plate contents, STANDARD PATH [REQUIRES: none]:
    A built poster plate per project — the project's initials set at 7vw in display with the misregistration treatment, over a large geometric form in the alternate ink at 30% with the halftone mask, plus a label-styled metadata strip along the bottom edge.
    Every plate uses a different form and a different ink dominance so the grid never repeats. This is a print series, and it is the intended design.

### 6. Services — Ink Slabs
- Each service is a full-bleed slab alternating --paper, --paper-2, and one --ink-1 halftone slab in the sequence.
- An oversized index numeral at clamp(6rem,20vw,20rem) in the alternate ink at 12% behind, the title in display, body copy at 46ch.
- Titles enter with the two-layer registration animation from the hero, scaled down.
- Services {{ITEM_1}} … {{ITEM_6}}.

### 7. Studio — Pinned Registration (the only pin)
- GSAP pin for +=900px. A single large display statement where, across scrub progress, the --ink-1 and --ink-2 layers separate from perfect alignment to a 24px offset and back — a controlled misregistration sweep.
- {{DETAIL_*}} render as a label/value list beneath.
- Mobile: no pin — the statement renders with a fixed 4px offset.

### 8. Contact + Footer
- Contact: a full-bleed --ink-2 halftone band with 2px --fg borders. {{CONTACT_EMAIL}} in display at clamp(2rem,8vw,6rem) in --paper, as a real mailto link.
- Footer: bg --fg, text --paper. Four columns, label-styled headers, 12px links, and a colophon line naming the inks and the typeface — a print detail that costs nothing and sells the register.

## STATES & EDGE CASES (mandatory)
- Fewer than 3 projects: the plate grid works at any count — a print series can be three plates or one. Never pad with invented work.
- Missing clients, awards, metrics or team: removal or qualitative variants. Nothing invented.
- Loading: --paper-2 blocks with 2px --fg borders and an --ink-1 halftone bar sweeping horizontally, 1s. The print structure never collapses.
- Empty: display-uppercase "NOTHING PRINTED YET" with a bordered link. Stay in character.
- Error: a --paper-2 slab with a 4px --ink-1 top border, plain-language copy, a bordered retry.
- Image failure (sequence path only): the plate falls back to its built poster composition at runtime — same border, same metadata strip, no layout jump. Never a broken-image glyph.
- mask-image unsupported: an @supports guard rendering the coloured surfaces flat (no halftone) rather than transparent. The duotone identity survives; only the texture is lost.
- mix-blend-multiply unsupported or forced-colors mode: render single-ink flat colour with no misregistration.
- Forms: 2px --fg bordered inputs, no radius, --ink-1 focus border 3px, errors in --ink-1, aria-live="polite".
- 404: a poster plate reading "404" with the full registration treatment and a home link.

## PERFORMANCE
- The misregistration doubles every treated element in the DOM — restrict it to display type and plate compositions only, never to body copy or repeated list items.
- mask-image and mix-blend-multiply are GPU-cheap but compositing-heavy when stacked: cap treated elements per viewport and never nest a treated element inside another.
- One pinned sequence. gsap.context revert on unmount; ScrollTrigger.refresh() after fonts load and on debounced resize.
- Halftone as a CSS repeating-radial-gradient, not an image asset.
- next/font, preload the display weight — it is the LCP element.
- prefers-reduced-motion: freeze the marquee at a designed offset, disable the registration entrance (render aligned at the final offset), disable the pinned sweep, keep the static misregistration.
- Target LCP < 2.0s, CLS < 0.04.

## ACCESSIBILITY
- Misregistered display type must remain legible: the offset never exceeds 6px at body-adjacent sizes, and body copy is never treated at all.
- The duplicated colour layer is aria-hidden so screen readers read the headline once, not twice. This is the most commonly missed detail on this technique.
- --paper on --ink-1 and --ink-2, and --fg on --paper, all verified ≥ 4.5:1 at body size.
- Halftone masks and grain: aria-hidden, pointer-events-none.
- Focus rings: 3px --ink-2, offset 0 — flush and thick, in keeping with the print register.

## STRICT RULES
- No `any`. Strict TypeScript.
- Two inks. A third saturated colour anywhere is an automatic fail.
- Radius 0, no shadows, no blur. The halftone is the only texture.
- The misregistration is always deliberate and always the same direction — random offsets read as a bug, not a print effect.
- Supplied photography is converted into the duotone system, never dropped in raw.
- No invented clients, awards, metrics or team members.
- Fully designed at 375px: the poster hero still fills the width, plates go to one column, the registration offset reduces to 2px.
```

---

## Notes d'implémentation pour ta base de données

**Champs à stocker par prompt :**

| Champ | Exemple |
|---|---|
| `id` | `agency-01-midnight-neon-glass` |
| `category` | `agency` |
| `art_direction` | `Midnight Neon Glass` |
| `template` | le corps du prompt complet |
| `variables` | `["BRAND_NAME", "PROJECT", "TEAM", "CLIENT_LOGOS", …]` |
| `asset_independence` | `high` / `medium` / `low` — voir ci-dessous |
| `stack_tags` | `["nextjs", "tailwind", "framer-motion", "gsap", "lenis"]` |
| `complexity` | `medium` / `high` |
| `target_tools` | `["lovable", "v0", "bolt", "cursor", "claude-code"]` |

**Le champ `asset_independence` est propre à ce domaine et il est important.** Sur agency, l'utilisateur type n'a souvent aucun visuel — c'est justement pour ça qu'il construit un site. Classe les templates ainsi :

| Template | Indépendance | Pourquoi |
|---|---|---|
| 09 Archive Index | **high** | aucune section ne prévoit d'image ; se dégrade sans aucun trou |
| 07 Terminal Dev Studio | **high** | hero typographique, blocs de specs, zéro visuel requis |
| 03 Concrete Brutalist | **high** | le type est le hero à tous les niveaux d'assets |
| 10 Duotone Riso | **high** | les plates construites sont la V1 prévue |
| 04 Editorial Magazine | medium | les plates deviennent des pull-quotes, très bien |
| 06 Playful Bold | medium | tuiles colorées avec initiales |
| 08 Soft Ceramic | medium | composition céramique CSS |
| 01 Midnight Neon | medium | dégradés + hachures |
| 02 Liquid Shader | medium | champ CSS par défaut |
| 05 Reel Cinema | **low** | conçu autour de la vidéo ; le chemin standard tient, mais c'est le seul qui perd vraiment quelque chose |

**Ce que ta couche IA doit faire de ce champ :** quand l'utilisateur n'a aucun asset, pondère la sélection vers les templates `high`. Ça évite de proposer Reel Cinema à quelqu'un qui n'a pas une seule seconde de rush.

**La règle la plus importante de ce domaine :** un site d'agence vend de la crédibilité, et la crédibilité est ce qu'un modèle génératif fabrique le plus volontiers. Clients, récompenses, chiffres, membres d'équipe, résultats de cas — si ça ne vient pas de l'input, ça ne sort pas. Ajoute la même validation d'émission que sur finance : si un nom de marque connu, un nom de récompense ou un chiffre apparaît dans l'output sans être dans l'input, bloque.

**Comme sur les autres sets :** aucun `{{PLACEHOLDER}}` non résolu, aucun marqueur `[REQUIRES: …]`, aucun chemin non retenu dans le prompt final.
