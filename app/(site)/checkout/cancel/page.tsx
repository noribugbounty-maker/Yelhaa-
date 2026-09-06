"use client";

import Link from "next/link";

import { useT } from "@/components/i18n/preferences-provider";
import { MarkBar } from "@/components/brand/marks";

export default function CheckoutCancelPage() {
  const t = useT();

  return (
    <section
      aria-label={t("checkout.cancelAria")}
      className="mx-auto max-w-[1440px] px-5 py-20 md:px-8 md:py-28"
    >
      <div className="mx-auto max-w-xl border border-line bg-surface p-8 md:p-10">
        <MarkBar draw className="h-2 w-10" />
        <h1 className="mt-6 type-h2 text-ink">{t("checkout.cancelTitle")}</h1>
        <p className="mt-4 max-w-[52ch] text-ink-2">{t("checkout.cancelBody")}</p>

        <div className="mt-8 flex flex-wrap items-center gap-5">
          <Link
            href="/pricing"
            className="inline-flex h-[38px] items-center rounded-[6px] border border-line px-5 text-[14px] text-ink transition-colors duration-[140ms] hover:border-line-strong"
          >
            {t("checkout.backPricing")}
          </Link>
          <Link
            href="/"
            className="text-[14px] text-ink-2 transition-colors duration-[140ms] hover:text-ink"
          >
            {t("errors.backHome")}
          </Link>
        </div>
      </div>
    </section>
  );
}
