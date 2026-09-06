"use client";

import Link from "next/link";

import { useT } from "@/components/i18n/preferences-provider";
import { YelhaaMark } from "@/components/brand/yelhaa-node-mark";
import { MarkBar, MarkChevron } from "@/components/brand/marks";
import { SiteChrome } from "@/components/site/site-chrome";
import { ROUTES } from "@/lib/config";

export default function NotFound() {
  const t = useT();

  return (
    <SiteChrome>
      <section
        aria-label={t("errors.notFoundTitle")}
        className="mx-auto max-w-[1440px] px-5 py-20 md:px-8 md:py-28"
      >
        <div className="mx-auto max-w-xl rounded-[4px] border border-line bg-surface p-8 md:p-10">
          <YelhaaMark size={32} />

          <MarkBar draw className="mt-8 h-2 w-10" />

          <p className="mt-6 type-label">{t("errors.notFoundLabel")}</p>
          <h1 className="mt-2 type-h2 text-ink">{t("errors.notFoundHeading")}</h1>

          <p className="mt-4 max-w-[52ch] text-ink-2">{t("errors.notFoundBody")}</p>

          <Link
            href={ROUTES.home}
            className="group mt-8 inline-flex h-[38px] items-center gap-2 rounded-[6px] bg-volt px-5 font-semibold text-void transition-colors duration-[140ms] hover:bg-volt-hot active:bg-volt-press"
          >
            {t("errors.backHome")}
            <MarkChevron
              tone="inherit"
              className="h-3.5 w-3.5 transition-transform duration-[140ms] group-hover:translate-x-[3px]"
            />
          </Link>
        </div>
      </section>
    </SiteChrome>
  );
}
