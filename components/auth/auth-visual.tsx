"use client";

import { YelhaaMark } from "@/components/brand/yelhaa-node-mark";
import { useT } from "@/components/i18n/preferences-provider";

/**
 * Right-hand visual of the auth screens — design decision document §5.
 *
 *   YOUR IDEA → YELHAA → BETTER PROMPT
 *
 * Static, monochrome, decorative — the brand picto heads the Yelhaa stage.
 * Hidden on mobile by the layout.
 */
const STAGES = [
  { labelKey: "authVisual.idea", bodyKey: "authVisual.ideaBody", lines: [0.72, 0.4] },
  {
    labelKey: "authVisual.yelhaa",
    bodyKey: "authVisual.yelhaaBody",
    lines: [0.9, 0.66, 0.78, 0.5],
  },
  {
    labelKey: "authVisual.prompt",
    bodyKey: "authVisual.promptBody",
    lines: [0.95, 0.88, 0.92, 0.7, 0.84],
  },
] as const;

export function AuthVisual() {
  const t = useT();

  return (
    <div
      aria-hidden="true"
      className="flex h-full w-full flex-col justify-center gap-px overflow-hidden rounded-[6px] border border-line bg-line"
    >
      {STAGES.map((stage, index) => (
        <div key={stage.labelKey} className="flex flex-1 flex-col bg-void p-7">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {index === 1 ? <YelhaaMark size={18} /> : null}
              <p className="type-label">{t(stage.labelKey)}</p>
            </div>
            <span className="font-mono text-[11px] text-ink-3">
              0{index + 1}
            </span>
          </div>
          <div className="mt-6 flex flex-col gap-2.5">
            {stage.lines.map((width, i) => (
              <span
                key={i}
                style={{ width: `${width * 100}%` }}
                className={`block h-2 rounded-full ${
                  index === 2 ? "bg-ink/70" : index === 1 ? "bg-ink/35" : "bg-ink/20"
                }`}
              />
            ))}
          </div>
          <p className="mt-auto pt-6 text-[13.5px] text-ink-2">
            {t(stage.bodyKey)}
          </p>
        </div>
      ))}
    </div>
  );
}
