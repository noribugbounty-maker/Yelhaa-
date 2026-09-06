"use client";

import { usePreferences, useT } from "@/components/i18n/preferences-provider";
import { FaqAccordion, type FaqItem } from "@/components/faq/faq-accordion";
import { ServiceUnavailable } from "@/components/site/service-unavailable";
import { faqCategoryLabel, faqCopy } from "@/lib/i18n";

export function FaqIndex({
  unavailable,
  items,
}: {
  unavailable: boolean;
  items: FaqItem[];
}) {
  const t = useT();
  const { locale } = usePreferences();

  const localized = items.map((item) => {
    const copy = faqCopy(locale, item.slug, {
      question: item.question,
      answer: item.answer,
    });
    return {
      ...item,
      question: copy.question,
      answer: copy.answer,
      category: faqCategoryLabel(locale, item.category),
    };
  });

  return (
    <section aria-label={t("faq.aria")} className="mx-auto max-w-3xl px-5 py-20 md:px-8 md:py-28">
      <div className="md:flex md:items-end md:justify-between md:gap-8">
        <div>
          <p className="type-label">{t("faq.label")}</p>
          <h1 className="mt-3 type-h2 text-ink">{t("faq.title")}</h1>
          <p className="mt-4 max-w-[66ch] text-ink-2">{t("faq.body")}</p>
        </div>
      </div>

      {unavailable ? (
        <div className="mt-10">
          <ServiceUnavailable
            title={t("faq.unavailableTitle")}
            description={t("faq.unavailableBody")}
          />
        </div>
      ) : localized.length === 0 ? (
        <div className="mt-10">
          <ServiceUnavailable
            title={t("faq.emptyTitle")}
            description={t("faq.emptyBody")}
          />
        </div>
      ) : (
        <FaqAccordion items={localized} />
      )}
    </section>
  );
}
