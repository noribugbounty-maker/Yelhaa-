"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

import { useT } from "@/components/i18n/preferences-provider";
import { YelhaaMark, YelhaaMarkLoader } from "@/components/brand/yelhaa-node-mark";

/**
 * Hero visual — design decision document §4.2.
 *
 * An animated prompt interface, not an illustration:
 *
 *   YOUR IDEA   "Create a premium SaaS landing page…"
 *       ↓
 *   YELHAA      Analyzing intent… / Structuring context… / Optimizing…
 *               ✓ Prompt optimized
 *
 * The typewriter writes into a DOM node through a ref — no React state per
 * character. Only the five phase transitions go through state. Under
 * `prefers-reduced-motion` the final state is rendered directly and nothing
 * moves.
 *
 * The Yelhaa block is headed by the brand picto. While the three steps run it
 * is the product's one loader — the mark drawing itself (`YelhaaMarkLoader`);
 * once the prompt is optimized it settles into the static mark.
 */

const TYPE_MS = 34;
const STEP_MS = 900;
const HOLD_MS = 2600;
const REDUCE_QUERY = "(prefers-reduced-motion: reduce)";

/** -1 = typing, 0..2 = step index running, 3 = done. */
type Phase = -1 | 0 | 1 | 2 | 3;

export function PromptInterface() {
  const t = useT();
  const idea = t("demo.idea");
  const steps = [t("demo.analyzing"), t("demo.structuring"), t("demo.optimizing")];
  const [phase, setPhase] = useState<Phase>(3);
  const [reduced, setReduced] = useState(true);
  const typedRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const motion = window.matchMedia(REDUCE_QUERY);
    setReduced(motion.matches);
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    motion.addEventListener("change", onChange);
    return () => motion.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduced) {
      if (typedRef.current) typedRef.current.textContent = idea;
      setPhase(3);
      return;
    }

    const node = typedRef.current;
    const timers: number[] = [];
    let interval = 0;
    let disposed = false;

    const schedule = (fn: () => void, ms: number) => {
      timers.push(
        window.setTimeout(() => {
          if (!disposed) fn();
        }, ms),
      );
    };

    const run = () => {
      let index = 0;
      timers.length = 0;
      if (node) node.textContent = "";
      setPhase(-1);
      interval = window.setInterval(() => {
        index += 1;
        if (node) node.textContent = idea.slice(0, index);
        if (index >= idea.length) {
          window.clearInterval(interval);
          schedule(() => setPhase(0), 500);
          schedule(() => setPhase(1), 500 + STEP_MS);
          schedule(() => setPhase(2), 500 + STEP_MS * 2);
          schedule(() => setPhase(3), 500 + STEP_MS * 3);
          schedule(run, 500 + STEP_MS * 3 + HOLD_MS);
        }
      }, TYPE_MS);
    };

    run();

    return () => {
      disposed = true;
      window.clearInterval(interval);
      for (const id of timers) window.clearTimeout(id);
    };
  }, [reduced, idea]);

  const stepState = (index: number): "idle" | "active" | "done" => {
    if (phase === 3 || phase > index) return "done";
    if (phase === index) return "active";
    return "idle";
  };

  return (
    <div
      aria-label={t("demo.label")}
      role="img"
      className="w-full max-w-[560px] rounded-[6px] border border-line bg-surface"
      style={{ "--hero-step-ms": `${STEP_MS}ms` } as CSSProperties}
    >
      <div className="flex items-center justify-between border-b border-line px-5 py-3">
        <span className="type-label">{t("demo.yourIdea")}</span>
        <span className="type-label">{t("demo.promptBuilder")}</span>
      </div>

      <div className="px-5 pt-5 pb-4">
        <p className="min-h-[3.2em] font-mono text-[14px] leading-[1.6] text-ink">
          <span aria-hidden="true">“</span>
          <span ref={typedRef}>{idea}</span>
          {phase === -1 ? (
            <span
              aria-hidden="true"
              className="hero-caret ml-px inline-block h-[15px] w-[2px] translate-y-[3px] bg-ink"
            />
          ) : (
            <span aria-hidden="true">”</span>
          )}
        </p>
      </div>

      <div className="flex items-center gap-3 px-5 py-2">
        <span aria-hidden="true" className="h-px flex-1 bg-line" />
        <span aria-hidden="true" className="text-[12px] text-ink-3">
          ↓
        </span>
        <span aria-hidden="true" className="h-px flex-1 bg-line" />
      </div>

      <div className="border-t border-line px-5 pt-4 pb-5">
        <div className="flex items-center gap-2.5">
          {phase >= 0 && phase < 3 ? (
            <YelhaaMarkLoader size={18} />
          ) : (
            <YelhaaMark size={18} />
          )}
          <p className="type-label">Yelhaa</p>
        </div>
        <ol className="mt-3 flex flex-col gap-2.5">
          {steps.map((step, index) => {
            const state = stepState(index);
            return (
              <li
                key={step}
                data-state={state}
                className="hero-step flex items-center gap-3 font-mono text-[13.5px] text-ink"
              >
                <span
                  aria-hidden="true"
                  className="relative h-px w-6 overflow-hidden bg-line"
                >
                  <span className="hero-progress absolute inset-0 bg-ink" />
                </span>
                <span>
                  {step}
                  <span aria-hidden="true">…</span>
                </span>
              </li>
            );
          })}
          <li
            data-state={phase === 3 ? "done" : "idle"}
            className="hero-step mt-1 flex items-center gap-3 font-mono text-[13.5px] text-ink"
          >
            <span
              aria-hidden="true"
              className="flex h-4 w-6 items-center justify-center text-[13px]"
            >
              ✓
            </span>
            <span>{t("demo.done")}</span>
          </li>
        </ol>
      </div>
    </div>
  );
}
