"use client";

import Link from "next/link";

import { usePreferences, useT } from "@/components/i18n/preferences-provider";
import { MarkChevron } from "@/components/brand/marks";
import { FaqBreadcrumbJsonLd } from "@/components/seo/json-ld";
import { ROUTES } from "@/lib/config";
import { faqCategoryLabel, faqCopy } from "@/lib/i18n";

const COMMERCIAL_KEYS: Record<string, string> = {
  "plans-and-quotas": "faq.commercialPlans",
  "what-happens-when-i-hit-my-quota": "faq.commercialQuota",
  "cancel-subscription-and-refunds": "faq.commercialCancel",
  "payment-methods": "faq.commercialPay",
};

export function FaqArticleView({
  slug,
  category,
  question,
  answer,
  related,
}: {
  slug: string;
  category: string;
  question: string;
  answer: string;
  related: { slug: string; question: string }[];
}) {
  const t = useT();
  const { locale } = usePreferences();
  const copy = faqCopy(locale, slug, { question, answer });
  const commercial = COMMERCIAL_KEYS[slug];

  return (
    <article className="mx-auto max-w-3xl px-5 py-20 md:px-8 md:py-28">
      <FaqBreadcrumbJsonLd question={copy.question} slug={slug} />

      <p className="type-label">{faqCategoryLabel(locale, category)}</p>
      <h1 className="mt-3 type-h2 text-ink">{copy.question}</h1>

      <div className="glass-panel mt-8 p-6 md:p-8">
        <p className="max-w-[66ch] text-[17px] text-ink-2">{copy.answer}</p>
      </div>

      {related.length > 0 ? (
        <section
          aria-label={t("faq.related")}
          className="mt-14 border-t border-line pt-8"
        >
          <h2 className="type-label">{t("faq.related")}</h2>
          <ul className="mt-4 flex flex-col gap-3">
            {related.map((entry) => (
              <li key={entry.slug}>
                <Link
                  href={`/faq/${entry.slug}`}
                  className="text-[15.5px] text-ink-2 transition-colors duration-[140ms] hover:text-ink"
                >
                  {faqCopy(locale, entry.slug, {
                    question: entry.question,
                    answer: "",
                  }).question}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {commercial ? (
        <p className="mt-8 border-t border-line pt-6 text-[15px] text-ink-2">
          {t(commercial)}{" "}
          <Link
            href={ROUTES.pricing}
            className="text-ink underline underline-offset-4 transition-opacity duration-[140ms] hover:opacity-70"
          >
            {t("faq.seePlans")}
          </Link>
          .
        </p>
      ) : null}

      <div className="mt-12 flex flex-wrap items-center gap-5">
        <Link
          href={ROUTES.faq}
          className="glass-inset glass-hot group inline-flex h-[38px] items-center gap-2 px-5 text-[14px] text-ink"
        >
          {t("faq.allQuestions")}
          <MarkChevron className="h-3.5 w-3.5 transition-transform duration-[140ms] group-hover:translate-x-[3px]" />
        </Link>

        <Link
          href={ROUTES.home}
          className="text-[14px] text-ink-2 transition-colors duration-[140ms] hover:text-ink"
        >
          {t("errors.backHome")}
        </Link>
      </div>
    </article>
  );
}
