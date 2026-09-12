# Visual & Mobile — Findings

Captures in `screenshots/`: `yelhaa_info_desktop.png` (1920×1080), `yelhaa_info_mobile.png` (750×1624).

## Rendering confirmed correct

Both captures render the page fully and correctly — headless Chromium, real network, no special flags.

This matters for one reason beyond design: during the audit, two separate instrumentation runs suggested the main content was stuck behind the route loading spinner (50 s+ in the in-app browser pane, ~43 s to settle in Playwright). **Both were measurement artefacts**, and these screenshots are what confirmed it:

- The in-app browser pane reported itself *hidden* throughout. Chrome throttles timers, `requestAnimationFrame` and `IntersectionObserver` in hidden tabs, and `components/site/reveal.tsx` depends on `IntersectionObserver`.
- Playwright's ~43 s was its idle-wait strategy failing to settle on a page with perpetual animations (the loader mark, the stepped "Analyzing intent… / Structuring context… / Optimizing instructions…" sequence), not a user-visible delay.

No rendering defect exists. Those numbers are excluded from this report rather than presented as Core Web Vitals.

## Desktop (1920×1080)

Above the fold, everything essential is present: brand mark and wordmark, primary nav (Product / Features / Pricing / Resources), theme toggle, EN/FR language switch, "Log in" and a "Get started" CTA.

The hero does the job well — eyebrow ("PROMPT ENGINEERING, DONE PROPERLY"), a large two-line headline, a one-sentence explanation, and two clearly differentiated CTAs (filled "Start building", outlined "Explore Yelhaa"). To the right, an animated mock of the product turning a plain-language idea into a structured prompt.

That demo panel is the page's strongest asset: it shows the product working rather than describing it, in the space where most competitors put a stock illustration. Typography is confident, spacing is generous, and the monospace accents give the dark theme a deliberate technical character.

## Mobile (750×1624)

Cleanly responsive. The nav collapses to a hamburger, the headline reflows to two lines without overflow, CTAs stack full-width with comfortable touch targets, and the demo panel moves below the hero and reformats rather than shrinking. Body text stays readable; nothing is clipped and there is no horizontal scroll.

## Observations

**The language switch is a UI control with no SEO counterpart.** The EN/FR toggle is prominent in the desktop header, and it works — but it sets a cookie and re-renders in place. There is no French URL, no `hreflang`, and the canonical does not change. Users get a real bilingual site; search engines only ever see the English one. This is the visual surface of the finding in `findings/onpage.md`.

**Above-the-fold text is light.** The hero carries roughly 25 words. That is a reasonable design choice for a landing page and not a defect, but it does mean the first screen gives a crawler very little — worth remembering alongside the thin-content findings in `findings/content.md`.

**The theme toggle offers light mode.** Only the dark default was captured. Worth a manual pass over the light theme for contrast, particularly the muted `text-ink-2` / `text-ink-3` greys, which are tuned for a `#050505` ground.

## Not assessed

No accessibility audit was run (contrast ratios, focus order, screen-reader labels). The markup shows good signs — `aria-label` on nav landmarks, `role="status"` with `aria-live` on the loader, `aria-hidden` on decorative SVGs, an `sr-only` loading announcement — but this was not tested systematically and is out of scope for an SEO audit.
