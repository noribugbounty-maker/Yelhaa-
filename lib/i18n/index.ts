import { en, type Messages } from "@/lib/i18n/en";
import { fr } from "@/lib/i18n/fr";
import { type Locale } from "@/lib/i18n/types";

export const dictionaries: Record<Locale, Messages> = { en, fr };

type Vars = Record<string, string | number>;

function lookup(messages: Messages, path: string): string | undefined {
  const parts = path.split(".");
  let current: unknown = messages;
  for (const part of parts) {
    if (!current || typeof current !== "object" || !(part in current)) {
      return undefined;
    }
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === "string" ? current : undefined;
}

export function translate(
  locale: Locale,
  path: string,
  vars?: Vars,
): string {
  const raw =
    lookup(dictionaries[locale], path) ?? lookup(en, path) ?? path;
  if (!vars) return raw;
  return raw.replace(/\{(\w+)\}/g, (_, key: string) =>
    key in vars ? String(vars[key]) : `{${key}}`,
  );
}

export function faqCopy(
  locale: Locale,
  slug: string,
  fallback: { question: string; answer: string },
): { question: string; answer: string } {
  const q = lookup(dictionaries[locale], `faqArticles.${slug}.q`);
  const a = lookup(dictionaries[locale], `faqArticles.${slug}.a`);
  return {
    question: q ?? fallback.question,
    answer: a ?? fallback.answer,
  };
}

export function faqCategoryLabel(locale: Locale, category: string): string {
  if (category === "Product" || category === "Produit") {
    return translate(locale, "faq.catProduct");
  }
  if (
    category === "Account and pricing" ||
    category === "Compte et tarifs"
  ) {
    return translate(locale, "faq.catAccount");
  }
  if (
    category === "Technical and privacy" ||
    category === "Technique et confidentialité"
  ) {
    return translate(locale, "faq.catPrivacy");
  }
  return category;
}

export function formatResetDate(iso: string, locale: Locale): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-US", {
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function formatLongDate(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export { en, fr };
export type { Messages };
