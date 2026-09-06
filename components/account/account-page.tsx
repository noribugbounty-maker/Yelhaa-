"use client";

import Link from "next/link";

import { usePreferences, useT } from "@/components/i18n/preferences-provider";
import {
  DeleteAccount,
  PortalButton,
} from "@/components/account/account-actions";
import { formatLongDate } from "@/lib/i18n";
import { PLANS, formatUsd } from "@/lib/config";

type HistoryEntry = {
  id: string;
  idea: string;
  created_at: string;
};

export function AccountPageView({
  email,
  plan,
  used,
  limit,
  hasSubscription,
  history,
}: {
  email: string;
  plan: string;
  used: number;
  limit: number;
  hasSubscription: boolean;
  history: HistoryEntry[];
}) {
  const t = useT();
  const { locale } = usePreferences();
  const planDetails = PLANS.find((entry) => entry.id === plan);
  const now = new Date();
  const next = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
  const resetLabel = formatLongDate(next, locale);
  const planName = planDetails
    ? t(`pricing.${planDetails.id}Name`)
    : plan;

  return (
    <section
      aria-label={t("account.title")}
      className="mx-auto max-w-3xl px-5 py-20 md:px-8 md:py-28"
    >
      <h1 className="type-h2 text-ink">{t("account.title")}</h1>
      <p className="mt-3 text-ink-2">{email}</p>

      <div className="glass-panel mt-10 p-5">
        <h2 className="type-label">{t("account.plan")}</h2>
        <p className="mt-3 flex items-baseline gap-3">
          <span className="type-h3 text-ink">{planName}</span>
          {planDetails ? (
            <span className="font-mono tabular-nums text-ink-3">
              {formatUsd(planDetails.priceUsd)}
              {planDetails.priceUsd > 0 ? ` ${t("account.perMonth")}` : ""}
            </span>
          ) : null}
        </p>

        <div className="mt-5 border-t border-line pt-5">
          <h3 className="type-label">{t("account.generations")}</h3>
          <p className="mt-2 font-mono tabular-nums text-ink">
            {used} / {limit}
          </p>
          <p className="mt-1 text-[14px] text-ink-2">
            {t("account.resets", { date: resetLabel })}
          </p>
        </div>

        <div className="mt-5 border-t border-line pt-5">
          <PortalButton hasSubscription={hasSubscription} />
        </div>
      </div>

      <div className="glass-panel mt-10 p-5">
        <h2 className="type-label">{t("account.history")}</h2>
        {history.length > 0 ? (
          <ul className="mt-4">
            {history.map((entry) => (
              <li key={entry.id} className="border-b border-line py-4">
                <Link href={`/prompt/${entry.id}`} className="group block">
                  <p className="truncate text-[15px] text-ink transition-colors duration-[140ms] group-hover:text-volt">
                    {entry.idea}
                  </p>
                  <p className="mt-1 font-mono tabular-nums text-[12px] text-ink-3">
                    {new Date(entry.created_at).toLocaleDateString(
                      locale === "fr" ? "fr-FR" : "en-GB",
                    )}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-[14px] text-ink-2">
            {t("account.emptyHistory")}{" "}
            <Link href="/" className="text-ink underline underline-offset-4">
              {t("account.firstIdea")}
            </Link>
            .
          </p>
        )}
      </div>

      <div className="mt-12">
        <DeleteAccount />
      </div>
    </section>
  );
}
