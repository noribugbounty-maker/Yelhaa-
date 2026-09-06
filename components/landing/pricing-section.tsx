"use client";

import Link from "next/link";

import { useT } from "@/components/i18n/preferences-provider";
import { SectionHeading } from "@/components/landing/section-heading";
import { CheckoutButton } from "@/components/pricing/checkout-button";
import { Reveal } from "@/components/site/reveal";
import { Button } from "@/components/ui/button";
import { Pricing, type PricingPlan } from "@/components/ui/pricing";
import {
  LANDING_ANCHORS,
  MAX_RESELECTS_PER_GENERATION,
  PLANS,
  ROUTES,
  formatUsd,
} from "@/lib/config";

export function PricingSection() {
  const t = useT();

  const plans: PricingPlan[] = PLANS.map((plan) => {
    const features = [
      t("pricing.landingGens", { n: plan.generationsPerMonth }),
      t("pricing.landingEvery"),
      t("pricing.landingSwaps", { n: MAX_RESELECTS_PER_GENERATION }),
      t("pricing.landingCopy"),
    ];
    if (plan.id === "free") features.push(t("pricing.landingNoCard"));
    if (plan.id === "agency") features.push(t("pricing.landingAgency"));

    const name = t(`pricing.${plan.id}Name`);
    const action =
      plan.id === "free" ? (
        <Button asChild variant="secondary" size="lg" className="w-full">
          <Link href={ROUTES.signup}>{t("pricing.startFree")}</Link>
        </Button>
      ) : (
        <CheckoutButton
          plan={plan.id}
          label={
            plan.id === "pro"
              ? t("pricing.startBuilding")
              : t("pricing.goPlan", { name })
          }
        />
      );

    return {
      id: plan.id,
      name,
      description: t(`pricing.${plan.id}Body`),
      price: formatUsd(plan.priceUsd),
      period: plan.priceUsd === 0 ? t("pricing.periodForever") : t("pricing.periodMonth"),
      features,
      highlighted: plan.recommended,
      action,
    };
  });

  return (
    <section
      id={LANDING_ANCHORS.pricing}
      aria-label={t("pricing.aria")}
      className="border-t border-line"
    >
      <div className="mx-auto max-w-[1440px] scroll-mt-20 px-5 py-20 md:px-8 md:py-28">
        <Reveal>
          <SectionHeading
            label={t("pricing.label")}
            title={t("pricing.title")}
            description={t("pricing.description")}
          />
        </Reveal>

        <Reveal delayMs={90} className="mx-auto mt-14 max-w-5xl">
          <Pricing plans={plans} highlightLabel={t("pricing.recommended")} />
        </Reveal>

        <Reveal delayMs={160}>
          <p className="mt-8 text-center text-[13px] text-ink-3">
            {t("pricing.footnote")}{" "}
            <Link
              href={ROUTES.pricing}
              className="text-ink-2 underline underline-offset-4 transition-colors duration-[140ms] hover:text-ink"
            >
              {t("pricing.fullDetails")}
            </Link>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
