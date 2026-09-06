"use client";

import Link from "next/link";

import { useT } from "@/components/i18n/preferences-provider";
import { Reveal } from "@/components/site/reveal";
import { TextBlockAnimation } from "@/components/ui/text-block-animation";
import { LANDING_ANCHORS, ROUTES } from "@/lib/config";

export function FinalCta() {
  const t = useT();

  return (
    <section aria-label={t("cta.aria")} className="border-t border-line">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center px-5 py-28 text-center md:px-8 md:py-40">
        <Reveal>
          <TextBlockAnimation
            as="h2"
            className="type-h1 text-ink text-balance"
          >
            {t("cta.title")}
          </TextBlockAnimation>
        </Reveal>

        <Reveal delayMs={90}>
          <p className="mt-8 text-[17px] text-ink-2 md:text-[18px]">
            {t("cta.body")}
          </p>
        </Reveal>

        <Reveal delayMs={160}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={ROUTES.build}
              className="inline-flex h-[48px] items-center gap-2 rounded-[6px] bg-ink px-7 text-[15px] font-semibold text-void transition-colors duration-[140ms] hover:bg-white active:bg-volt-press"
            >
              {t("cta.start")}
              <span aria-hidden="true">→</span>
            </Link>
            <Link
              href={`#${LANDING_ANCHORS.product}`}
              className="inline-flex h-[48px] items-center rounded-[6px] border border-line px-7 text-[15px] font-medium text-ink transition-colors duration-[140ms] hover:border-line-strong hover:bg-surface"
            >
              {t("cta.explore")}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
