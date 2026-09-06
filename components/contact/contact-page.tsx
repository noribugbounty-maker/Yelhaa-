"use client";

import Link from "next/link";

import { useT } from "@/components/i18n/preferences-provider";
import { ContactForm } from "@/components/contact/contact-form";
import { Socials } from "@/components/contact/socials";
import { Reveal } from "@/components/site/reveal";
import { faqCategoryLabel, faqCopy } from "@/lib/i18n";
import { usePreferences } from "@/components/i18n/preferences-provider";
import { FAQ_ARTICLES } from "@/content/faq";
import { ROUTES } from "@/lib/config";

const HELPFUL_SLUGS = [
  "plans-and-quotas",
  "what-happens-when-i-hit-my-quota",
  "cancel-subscription-and-refunds",
] as const;

export function ContactPage() {
  const t = useT();
  const { locale } = usePreferences();

  const after = [
    { step: "01", title: t("contact.step1Title"), body: t("contact.step1Body") },
    { step: "02", title: t("contact.step2Title"), body: t("contact.step2Body") },
    { step: "03", title: t("contact.step3Title"), body: t("contact.step3Body") },
  ];

  const helpful = HELPFUL_SLUGS.map((slug) => {
    const article = FAQ_ARTICLES.find((entry) => entry.slug === slug);
    if (!article) return null;
    const copy = faqCopy(locale, slug, {
      question: article.question,
      answer: article.answer_md,
    });
    return {
      slug,
      question: copy.question,
      category: faqCategoryLabel(locale, article.category),
    };
  }).filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

  return (
    <>
      <section
        aria-label={t("contact.aria")}
        className="mx-auto max-w-[1440px] px-5 py-20 md:px-8 md:py-28"
      >
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <Reveal>
              <p className="type-label">{t("contact.label")}</p>
              <h1 className="mt-3 type-h2 text-ink">{t("contact.title")}</h1>
              <p className="mt-4 max-w-[52ch] text-[17px] text-ink-2">
                {t("contact.body")}
              </p>
            </Reveal>

            <Reveal delayMs={70}>
              <ol className="mt-10 flex flex-col gap-5">
                {after.map((item) => (
                  <li key={item.step} className="flex gap-4">
                    <span
                      aria-hidden="true"
                      className="mt-[3px] shrink-0 font-mono text-[13px] text-volt"
                    >
                      {item.step}
                    </span>
                    <div>
                      <p className="font-display text-[16px] font-semibold text-ink">
                        {item.title}
                      </p>
                      <p className="mt-1 max-w-[46ch] text-[14px] text-ink-2">
                        {item.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </Reveal>

            <Reveal delayMs={140}>
              <div className="mt-10">
                <Socials />
              </div>
            </Reveal>
          </div>

          <Reveal delayMs={70}>
            <div className="glass-panel p-6 md:p-8">
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </section>

      <section
        aria-label={t("contact.beforeAria")}
        className="mx-auto max-w-3xl px-5 pb-24 md:px-8 md:pb-28"
      >
        <Reveal>
          <div className="flex flex-col items-center text-center">
            <p className="type-label">{t("contact.beforeLabel")}</p>
            <h2 className="mt-3 type-h3 text-ink">{t("contact.beforeTitle")}</h2>
          </div>
        </Reveal>

        <ul className="mt-8 flex flex-col gap-2.5">
          {helpful.map((article, index) => (
            <Reveal key={article.slug} delayMs={50 * index}>
              <li>
                <Link
                  href={`${ROUTES.faq}/${article.slug}`}
                  className="flex items-center gap-4 rounded-[6px] border border-line bg-surface p-4 transition-colors duration-[140ms] hover:border-line-strong hover:bg-surface-2 focus-visible:border-line-strong focus-visible:bg-surface-2"
                >
                  <span className="min-w-0 flex-1 text-[15.5px] text-ink">
                    {article.question}
                  </span>
                  <span className="hidden shrink-0 rounded-[6px] border border-line px-2 py-1 type-label sm:block">
                    {article.category}
                  </span>
                </Link>
              </li>
            </Reveal>
          ))}
        </ul>

        <Reveal delayMs={200}>
          <p className="mt-8 text-center">
            <Link
              href={ROUTES.faq}
              className="text-[14px] text-ink-2 transition-colors duration-[140ms] hover:text-ink"
            >
              {t("contact.readEvery")}
            </Link>
          </p>
        </Reveal>
      </section>
    </>
  );
}
