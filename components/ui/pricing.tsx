import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Pricing — design decision document §4.6 and §7.4.
 *
 * The three-column structure of the shadcn reference is kept; the styling is
 * not. Hairlines, dark surfaces, one highlighted column carried by a stronger
 * border and a denser surface — no scale, no shadow, no floating badge.
 * Feature lists are plain; hover only firms the border.
 *
 * This component knows nothing about Yelhaa: plans, prices and actions are
 * injected by `components/landing/pricing-section.tsx`.
 */

export type PricingPlan = {
  id: string;
  name: string;
  description?: string;
  /** Already formatted: "$0", "$4.99", "Custom". */
  price: string;
  /** "/ month", "forever", or nothing. */
  period?: string;
  features: readonly string[];
  highlighted?: boolean;
  /** The CTA, fully formed by the caller (link, checkout button…). */
  action: ReactNode;
};

export function Pricing({
  plans,
  highlightLabel = "Recommended",
}: {
  plans: readonly PricingPlan[];
  highlightLabel?: string;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-3 md:gap-5">
      {plans.map((plan) => (
        <article
          key={plan.id}
          aria-label={plan.name}
          className={cn(
            "flex flex-col rounded-[6px] border p-6 transition-colors duration-[160ms] md:p-7",
            plan.highlighted
              ? "border-line-strong bg-surface-2"
              : "border-line bg-surface hover:border-line-strong",
          )}
        >
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-[15px] font-medium text-ink">{plan.name}</h3>
            {plan.highlighted ? (
              <span className="type-label !text-ink">{highlightLabel}</span>
            ) : null}
          </div>
          {plan.description ? (
            <p className="mt-1.5 text-[13.5px] text-ink-2">
              {plan.description}
            </p>
          ) : null}

          <div className="mt-7 flex items-baseline gap-2">
            <span className="text-[2.5rem] font-semibold leading-none tracking-[-0.04em] tabular-nums text-ink">
              {plan.price}
            </span>
            {plan.period ? (
              <span className="text-[13.5px] text-ink-2">{plan.period}</span>
            ) : null}
          </div>

          <ul className="mt-7 flex flex-1 flex-col gap-2.5 border-t border-line pt-6">
            {plan.features.map((item) => (
              <li key={item} className="flex gap-3 text-[14px] text-ink-2">
                <span
                  aria-hidden="true"
                  className="mt-[9px] h-px w-3 shrink-0 bg-ink-3"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8">{plan.action}</div>
        </article>
      ))}
    </div>
  );
}
