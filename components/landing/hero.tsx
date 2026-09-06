"use client";

import Link from "next/link";

import { useT } from "@/components/i18n/preferences-provider";
import { PromptInterface } from "@/components/landing/prompt-interface";
import { LANDING_ANCHORS, ROUTES } from "@/lib/config";

export function Hero() {
  const t = useT();

  return (
    <section
      aria-labelledby="hero-title"
      className="mx-auto grid max-w-[1440px] gap-14 px-5 pt-16 pb-20 md:px-8 md:pt-28 md:pb-28 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center lg:gap-16"
    >
      <div className="flex flex-col items-start">
        <p className="enter-up type-label">{t("hero.label")}</p>

        <h1
          id="hero-title"
          style={{ "--enter-delay": "80ms" } as React.CSSProperties}
          className="enter-up mt-6 type-h1 text-ink text-balance"
        >
          {t("hero.title")}
        </h1>

        <p
          style={{ "--enter-delay": "160ms" } as React.CSSProperties}
          className="enter-up mt-7 max-w-[52ch] text-[17px] leading-[1.6] text-ink-2 text-balance md:text-[18px]"
        >
          {t("hero.body")}
        </p>

        <div
          style={{ "--enter-delay": "240ms" } as React.CSSProperties}
          className="enter-up mt-10 flex flex-wrap items-center gap-3"
        >
          <Link
            href={ROUTES.build}
            className="inline-flex h-[46px] items-center gap-2 rounded-[6px] bg-ink px-6 text-[15px] font-semibold text-void transition-colors duration-[140ms] hover:bg-white active:bg-volt-press"
          >
            {t("hero.start")}
            <span aria-hidden="true">→</span>
          </Link>
          <Link
            href={`#${LANDING_ANCHORS.product}`}
            className="inline-flex h-[46px] items-center rounded-[6px] border border-line px-6 text-[15px] font-medium text-ink transition-colors duration-[140ms] hover:border-line-strong hover:bg-surface"
          >
            {t("hero.explore")}
          </Link>
        </div>
      </div>

      <div
        style={{ "--enter-delay": "320ms" } as React.CSSProperties}
        className="enter-up flex justify-center lg:justify-end"
      >
        <PromptInterface />
      </div>
    </section>
  );
}
