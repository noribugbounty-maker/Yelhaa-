"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils";

/**
 * Infinite horizontal marquee — CSS animation, zero extra dependency.
 *
 * `renderItems` is a function so the reduced-motion path and the duplicated
 * track each get their own React tree (no shared element identity).
 *
 * Under `prefers-reduced-motion: reduce` the strip freezes into a single
 * horizontally scrollable list with a visible focus ring.
 */

export type MarqueeProps = {
  /** Builds one copy of the item row. */
  renderItems: () => ReactNode;
  /** Accessible name for the scrolling region. */
  label: string;
  pauseOnHover?: boolean;
  reverse?: boolean;
  /** CSS duration for one full loop (maps to `--duration`). */
  duration?: string;
  className?: string;
  trackClassName?: string;
};

const REDUCE_QUERY = "(prefers-reduced-motion: reduce)";

export function Marquee({
  renderItems,
  label,
  pauseOnHover = true,
  reverse = false,
  duration = "42s",
  className,
  trackClassName,
}: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offscreen, setOffscreen] = useState(false);
  const [reduced, setReduced] = useState<boolean | null>(null);

  useEffect(() => {
    const motion = window.matchMedia(REDUCE_QUERY);
    setReduced(motion.matches);
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    motion.addEventListener("change", onChange);
    return () => motion.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => setOffscreen(!(entry?.isIntersecting ?? true)),
      { threshold: 0 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const style = {
    ["--duration" as string]: duration,
  } as CSSProperties;

  if (reduced !== false) {
    return (
      <div
        ref={containerRef}
        role="region"
        aria-label={label}
        tabIndex={0}
        className={cn(
          "overflow-x-auto overscroll-x-contain",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-volt",
          className,
        )}
      >
        <ul className={cn("flex w-max list-none items-center", trackClassName)}>
          {renderItems()}
        </ul>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label={label}
      data-pause-hover={pauseOnHover ? "true" : "false"}
      className={cn("marquee marquee-mask overflow-hidden", className)}
      style={style}
    >
      <div
        className={cn("marquee-track", trackClassName)}
        data-paused={offscreen ? "true" : "false"}
        data-reverse={reverse ? "true" : "false"}
      >
        <ul className="flex list-none shrink-0 items-center">{renderItems()}</ul>
        <ul aria-hidden="true" className="flex list-none shrink-0 items-center">
          {renderItems()}
        </ul>
      </div>
    </div>
  );
}
