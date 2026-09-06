"use client";

import Link from "next/link";

import { useT } from "@/components/i18n/preferences-provider";
import { MarkTick } from "@/components/brand/marks";
import { CheckoutButton } from "@/components/pricing/checkout-button";
import { PricingJsonLd } from "@/components/seo/json-ld";
import { Button } from "@/components/ui/button";
import {
  MAX_RESELECTS_PER_GENERATION,
  PLANS,
  ROUTES,
  formatUsd,
} from "@/lib/config";
import { cn } from "@/lib/utils";

export function PricingPage() {
  const t = useT();

  const included = [
    { name: t("pricing.everythingArt"), description: t("pricing.everythingArtBody") },
    { name: t("pricing.everythingDomain"), description: t("pricing.everythingDomainBody") },
    {
      name: t("pricing.swaps", { n: MAX_RESELECTS_PER_GENERATION }),
      description: t("pricing.swapsBody"),
    },
    { name: t("pricing.copyDownload"), description: t("pricing.copyDownloadBody") },
    { name: t("pricing.multiAi"), description: t("pricing.multiAiBody") },
    { name: t("pricing.noCard"), description: t("pricing.noCardBody") },
  ];

  const details = [
    t("pricing.colEngine"),
    t("pricing.colSwaps", { n: MAX_RESELECTS_PER_GENERATION }),
    t("pricing.colCopy"),
  ];

  return (
    <section
      aria-label={t("pricing.aria")}
      className="mx-auto max-w-5xl px-5 py-20 md:px-8 md:py-28"
    >
      <PricingJsonLd />

      <div className="flex flex-col items-center gap-4 text-center">
        <p className="type-label">{t("pricing.label")}</p>
        <h1 className="type-h2 text-ink">{t("pricing.titlePage")}</h1>
        <p className="max-w-[60ch] text-[17px] text-ink-2">
          {t("pricing.descriptionPage")}
        </p>
      </div>

      <div className="glass-panel mt-14 p-6 md:p-8">
        <div className="flex items-center gap-3">
          <MarkTick draw className="size-5" />
          <h2 className="type-h3 text-ink">{t("pricing.includedTitle")}</h2>
        </div>
        <p className="mt-2 max-w-[66ch] text-ink-2">{t("pricing.includedBody")}</p>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {included.map((item) => (
            <div key={item.name} className="flex gap-3">
              <span
                aria-hidden="true"
                className="mt-[7px] size-1 shrink-0 bg-volt"
              />
              <div>
                <p className="text-[14px] font-medium text-ink">{item.name}</p>
                <p className="text-[14px] text-ink-2">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {PLANS.map((plan) => {
          const name = t(`pricing.${plan.id}Name`);
          return (
            <div
              key={plan.id}
              {...(plan.recommended
                ? { style: { "--glass-mix": "65%" } as React.CSSProperties }
                : {})}
              className={cn(
                "glass-panel flex flex-col",
                plan.recommended ? "border-volt" : "glass-hot",
              )}
            >
              <div className="flex-1 p-7">
                <p className="type-label">{name}</p>
                <p className="mt-2 text-[13px] text-ink-3">
                  {t(`pricing.${plan.id}Body`)}
                </p>

                <div className="mt-6 flex items-baseline gap-2">
                  <span className="font-display text-[2.75rem] font-bold leading-none tracking-[-0.03em] tabular-nums text-ink">
                    {formatUsd(plan.priceUsd)}
                  </span>
                  <span className="text-[14px] text-ink-3">
                    {plan.priceUsd === 0
                      ? t("pricing.periodForever")
                      : t("pricing.periodMonth")}
                  </span>
                </div>

                <div className="mt-6 border-t border-line pt-5">
                  <p className="font-mono text-[14px] tabular-nums text-ink">
                    {t("pricing.generationsMonth", {
                      n: plan.generationsPerMonth,
                    })}
                  </p>
                  <ul className="mt-4 flex flex-col gap-2">
                    {details.map((item) => (
                      <li key={item} className="flex gap-2.5">
                        <span
                          aria-hidden="true"
                          className="mt-[7px] size-1 shrink-0 bg-volt"
                        />
                        <span className="text-[13.5px] text-ink-2">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-7 pt-0">
                {plan.id === "free" ? (
                  <Button asChild variant="secondary" size="lg" className="w-full">
                    <Link href={ROUTES.signup}>{t("pricing.startFree")}</Link>
                  </Button>
                ) : (
                  <CheckoutButton
                    plan={plan.id}
                    label={t("pricing.goPlan", { name })}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mx-auto mt-12 max-w-3xl text-center">
        <p className="text-[14px] text-ink-2">{t("pricing.resetNote")}</p>
        <p className="mt-3 text-[13px] text-ink-3">{t("pricing.currencyNote")}</p>

        <p className="mt-6 text-[14px] text-ink-2">
          <Link
            href={`${ROUTES.faq}/what-happens-when-i-hit-my-quota`}
            className="text-ink underline underline-offset-4 transition-opacity duration-[140ms] hover:opacity-70"
          >
            {t("pricing.linkQuota")}
          </Link>
          {" · "}
          <Link
            href={`${ROUTES.faq}/cancel-subscription-and-refunds`}
            className="text-ink underline underline-offset-4 transition-opacity duration-[140ms] hover:opacity-70"
          >
            {t("pricing.linkCancel")}
          </Link>
          {" · "}
          <Link
            href={`${ROUTES.faq}/plans-and-quotas`}
            className="text-ink underline underline-offset-4 transition-opacity duration-[140ms] hover:opacity-70"
          >
            {t("pricing.linkGeneration")}
          </Link>
        </p>
      </div>
    </section>
  );
}
