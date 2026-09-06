"use client";

import Link from "next/link";

import { useT } from "@/components/i18n/preferences-provider";
import { MarkTick } from "@/components/brand/marks";

export default function CheckoutSuccessPage() {
  const t = useT();

  return (
    <section
      aria-label={t("checkout.successAria")}
      className="mx-auto max-w-[1440px] px-5 py-20 md:px-8 md:py-28"
    >
      <div className="mx-auto max-w-xl border border-line bg-surface p-8 md:p-10">
        <MarkTick draw className="size-6" />
        <h1 className="mt-6 type-h2 text-ink">{t("checkout.successTitle")}</h1>
        <p className="mt-4 max-w-[52ch] text-ink-2">{t("checkout.successBody")}</p>

        <div className="mt-8 flex flex-wrap items-center gap-5">
          <Link
            href="/account"
            className="inline-flex h-[38px] items-center rounded-[6px] bg-volt px-5 font-semibold text-void transition-colors duration-[140ms] hover:bg-volt-hot active:bg-volt-press"
          >
            {t("checkout.goAccount")}
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
