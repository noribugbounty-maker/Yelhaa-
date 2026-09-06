"use client";

import {
  useLayoutEffect,
  useRef,
  type ComponentType,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";

/**
 * TextBlockAnimation — line-by-line block reveal on scroll (design decision
 * document §7.1).
 *
 * The reference used GSAP + SplitText + ScrollTrigger. What is kept is the
 * mechanism: words are laid out, grouped into visual lines by `offsetTop`,
 * and each line is wiped in by a solid block. What changes: the demo colours
 * become a single monochrome block, the wipe is driven by the Web Animations
 * API and an `IntersectionObserver` (no new dependency, `framer-motion` is
 * the only animation library the repo already has), and
 * `prefers-reduced-motion` skips the whole setup.
 *
 * Resting state is the final state: reduced motion or failed setup leaves the
 * text fully readable. All DOM wrappers are reverted on cleanup.
 */

export type TextBlockAnimationProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /**
   * Wipe block fill — a design token (`var(--color-…)`), never a bare hex
   * default. Palette lives in `app/globals.css`.
   */
  blockColor?: string;
  /** Equivalent to ScrollTrigger `start: "top 85%"`. */
  start?: `${number}%`;
  stagger?: number;
  duration?: number;
};

const REDUCE_QUERY = "(prefers-reduced-motion: reduce)";
/** Practical stand-in for GSAP `expo.inOut`. */
const EASE = "cubic-bezier(0.87, 0, 0.13, 1)";

type LinePack = {
  wrap: HTMLDivElement;
  line: HTMLSpanElement;
  block: HTMLSpanElement;
};

function buildLines(root: HTMLElement, blockColor: string): LinePack[] {
  const original = root.textContent ?? "";
  root.replaceChildren();

  const probe = document.createElement("span");
  root.appendChild(probe);

  const parts = original.split(/(\s+)/).filter((part) => part.length > 0);
  const wordSpans: HTMLSpanElement[] = [];
  for (const part of parts) {
    const span = document.createElement("span");
    span.textContent = part;
    probe.appendChild(span);
    wordSpans.push(span);
  }

  const rows: string[][] = [];
  let rowTop = Number.NaN;
  let row: string[] = [];

  for (const span of wordSpans) {
    const top = span.offsetTop;
    if (Number.isNaN(rowTop) || Math.abs(top - rowTop) <= 1) {
      row.push(span.textContent ?? "");
      rowTop = top;
    } else {
      rows.push(row);
      row = [span.textContent ?? ""];
      rowTop = top;
    }
  }
  if (row.length) rows.push(row);

  root.replaceChildren();
  const packs: LinePack[] = [];

  for (const words of rows) {
    const wrap = document.createElement("div");
    wrap.style.cssText =
      "position:relative;display:block;overflow:hidden;width:100%";

    const line = document.createElement("span");
    line.style.cssText =
      "position:relative;z-index:1;display:inline-block;opacity:0";
    line.textContent = words.join("");

    const block = document.createElement("span");
    block.setAttribute("aria-hidden", "true");
    block.style.cssText = [
      "position:absolute",
      "inset:0",
      "z-index:2",
      "transform:scaleX(0)",
      "transform-origin:left center",
      "pointer-events:none",
      `background:${blockColor}`,
    ].join(";");

    wrap.append(line, block);
    root.appendChild(wrap);
    packs.push({ wrap, line, block });
  }

  return packs;
}

function animateForward(
  packs: LinePack[],
  stagger: number,
  duration: number,
): Animation[] {
  const animations: Animation[] = [];
  const coverMs = duration * 450;
  const midMs = duration * 500;
  const uncoverMs = duration * 450;

  packs.forEach((pack, index) => {
    const delay = index * stagger * 1000;

    animations.push(
      pack.block.animate(
        [
          { transform: "scaleX(0)", transformOrigin: "left center" },
          { transform: "scaleX(1)", transformOrigin: "left center" },
        ],
        { duration: coverMs, delay, easing: EASE, fill: "forwards" },
      ),
    );

    animations.push(
      pack.line.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 16,
        delay: delay + midMs,
        fill: "forwards",
      }),
    );

    animations.push(
      pack.block.animate(
        [
          { transform: "scaleX(1)", transformOrigin: "right center" },
          { transform: "scaleX(0)", transformOrigin: "right center" },
        ],
        {
          duration: uncoverMs,
          delay: delay + midMs,
          easing: EASE,
          fill: "forwards",
        },
      ),
    );
  });

  return animations;
}

function animateReverse(packs: LinePack[], duration: number): Animation[] {
  const animations: Animation[] = [];
  const ms = duration * 350;

  packs.forEach((pack) => {
    animations.push(
      pack.block.animate(
        [
          { transform: "scaleX(0)", transformOrigin: "left center" },
          { transform: "scaleX(1)", transformOrigin: "left center" },
        ],
        { duration: ms, easing: EASE, fill: "forwards" },
      ),
    );
    animations.push(
      pack.line.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 16,
        delay: ms * 0.55,
        fill: "forwards",
      }),
    );
    animations.push(
      pack.block.animate(
        [
          { transform: "scaleX(1)", transformOrigin: "right center" },
          { transform: "scaleX(0)", transformOrigin: "right center" },
        ],
        { duration: ms, delay: ms * 0.55, easing: EASE, fill: "forwards" },
      ),
    );
  });

  return animations;
}

export function TextBlockAnimation({
  children,
  as: Tag = "h2",
  className,
  blockColor = "var(--color-ink)",
  start = "85%",
  stagger = 0.08,
  duration = 0.9,
}: TextBlockAnimationProps) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const style = {
    ["--text-reveal-block" as string]: blockColor,
  } as CSSProperties;
  // With `@react-three/fiber` augmenting the intrinsic elements, an
  // unconstrained `ElementType` collapses its props to `never`.
  const Root = Tag as unknown as ComponentType<
    React.HTMLAttributes<HTMLElement>
  >;

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const motion = window.matchMedia(REDUCE_QUERY);
    if (motion.matches) return;

    const sourceText = root.textContent ?? "";
    let packs: LinePack[] = [];
    let animations: Animation[] = [];
    let visible = false;
    let resizeTimer = 0;

    const cancel = () => {
      for (const anim of animations) anim.cancel();
      animations = [];
    };

    const revert = () => {
      cancel();
      root.replaceChildren();
      root.textContent = sourceText;
      packs = [];
    };

    const setup = () => {
      revert();
      packs = buildLines(root, blockColor);
      visible = false;
    };

    setup();

    /*
     * ScrollTrigger `start: "top 85%"` ≈ element top crossing 85% of the
     * viewport. A bottom rootMargin of -15% shrinks the IO root accordingly.
     */
    const inset = 100 - Number.parseFloat(start);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry || motion.matches) return;

        if (entry.isIntersecting && !visible) {
          cancel();
          animations = animateForward(packs, stagger, duration);
          visible = true;
        } else if (!entry.isIntersecting && visible) {
          cancel();
          animations = animateReverse(packs, duration);
          visible = false;
        }
      },
      { rootMargin: `0px 0px -${inset}% 0px`, threshold: 0 },
    );

    observer.observe(root);

    const onMotion = () => {
      if (!motion.matches) return;
      observer.disconnect();
      revert();
    };
    motion.addEventListener("change", onMotion);

    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        const wasVisible = visible;
        setup();
        if (wasVisible) {
          animations = animateForward(packs, stagger, duration);
          visible = true;
        }
      }, 140);
    };
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      observer.disconnect();
      motion.removeEventListener("change", onMotion);
      window.removeEventListener("resize", onResize);
      window.clearTimeout(resizeTimer);
      revert();
    };
  }, [blockColor, children, duration, stagger, start]);

  return (
    <Root className={className} style={style}>
      <span ref={rootRef} className="block">
        {children}
      </span>
    </Root>
  );
}
