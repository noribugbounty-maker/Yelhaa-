"use client";

import { useEffect } from "react";
import Link from "next/link";

import { useT } from "@/components/i18n/preferences-provider";
import { YelhaaMark } from "@/components/brand/yelhaa-node-mark";
import { SiteChrome } from "@/components/site/site-chrome";
import { ROUTES } from "@/lib/config";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useT();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <SiteChrome>
      <section
        aria-label={t("errors.serverHeading")}
        className="mx-auto max-w-[1440px] px-5 py-20 md:px-8 md:py-28"
      >
        <div className="mx-auto max-w-xl border border-line border-l-2 border-l-err bg-surface p-8 md:p-10">
          <YelhaaMark size={32} />

          <p className="mt-8 type-label">{t("errors.serverLabel")}</p>
          <h1 className="mt-2 type-h2 text-ink">{t("errors.serverHeading")}</h1>

          <p className="mt-4 max-w-[52ch] text-ink-2">{t("errors.serverBody")}</p>

          <div className="mt-8 flex flex-wrap items-center gap-5">
            <button
              type="button"
              onClick={reset}
              className="inline-flex h-[38px] items-center rounded-[6px] bg-volt px-5 font-semibold text-void transition-colors duration-[140ms] hover:bg-volt-hot active:bg-volt-press"
            >
              {t("errors.tryAgain")}
            </button>
            <Link
              href={ROUTES.home}
              className="text-[14px] text-ink-2 transition-colors duration-[140ms] hover:text-ink"
            >
              {t("errors.backHome")}
            </Link>
          </div>
        </div>
      </section>
    </SiteChrome>
  );
}
