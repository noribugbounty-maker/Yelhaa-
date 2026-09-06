"use client";

import { useT } from "@/components/i18n/preferences-provider";
import { ServiceUnavailable } from "@/components/site/service-unavailable";

export function FaqUnavailable() {
  const t = useT();
  return (
    <section
      aria-label={t("faq.aria")}
      className="mx-auto max-w-3xl px-5 py-20 md:px-8 md:py-28"
    >
      <h1 className="type-h2 text-ink">{t("faq.aria")}</h1>
      <div className="mt-8">
        <ServiceUnavailable
          title={t("faq.unavailableTitle")}
          description={t("faq.articleUnavailable")}
        />
      </div>
    </section>
  );
}
