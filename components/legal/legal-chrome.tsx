"use client";

import { usePreferences, useT } from "@/components/i18n/preferences-provider";
import { formatLongDate } from "@/lib/i18n/index";

export function LegalUpdated({ date }: { date: string }) {
  const t = useT();
  const { locale } = usePreferences();
  const parsed = new Date(date);
  const formatted = Number.isNaN(parsed.getTime())
    ? date
    : formatLongDate(parsed, locale);
  return <>{t("legal.lastUpdated", { date: formatted })}</>;
}

export function MissingField() {
  const t = useT();
  return (
    <span className="border-b-2 border-b-warn px-1 font-mono text-[13px] text-ink">
      {t("legal.missing")}
    </span>
  );
}
