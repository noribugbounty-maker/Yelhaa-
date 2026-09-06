"use client";

import { useT } from "@/components/i18n/preferences-provider";
import { ServiceUnavailable } from "@/components/site/service-unavailable";

export function AccountUnavailable() {
  const t = useT();
  return (
    <section
      aria-label={t("account.title")}
      className="mx-auto max-w-3xl px-5 py-20 md:px-8 md:py-28"
    >
      <h1 className="type-h2 text-ink">{t("account.title")}</h1>
      <div className="mt-8">
        <ServiceUnavailable />
      </div>
    </section>
  );
}
