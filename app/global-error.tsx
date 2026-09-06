"use client";

import { useEffect, useMemo } from "react";

import { YelhaaMark } from "@/components/brand/yelhaa-node-mark";
import { translate } from "@/lib/i18n/index";
import {
  LOCALE_COOKIE,
  THEME_COOKIE,
  parseLocale,
  parseTheme,
} from "@/lib/i18n/types";

import "./globals.css";

/**
 * Dernier filet : erreur survenue dans le layout racine lui-même. Le shell
 * n'est plus disponible, la page se rend donc seule — mais dans le même
 * système visuel, avec le picto présent.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const locale = useMemo(() => {
    if (typeof document === "undefined") return "en" as const;
    const match = document.cookie.match(
      new RegExp(`(?:^|; )${LOCALE_COOKIE}=([^;]*)`),
    );
    return parseLocale(match?.[1] ? decodeURIComponent(match[1]) : "");
  }, []);
  const theme = useMemo(() => {
    if (typeof document === "undefined") return "dark" as const;
    const match = document.cookie.match(
      new RegExp(`(?:^|; )${THEME_COOKIE}=([^;]*)`),
    );
    return parseTheme(match?.[1] ? decodeURIComponent(match[1]) : "");
  }, []);

  useEffect(() => {
    console.error(error);
  }, [error]);

  const t = (path: string) => translate(locale, path);

  return (
    <html lang={locale} data-theme={theme}>
      <body data-surface="dark" className="bg-void text-ink">
        <main className="mx-auto max-w-xl px-5 py-24">
          <div className="border border-line border-l-2 border-l-err bg-surface p-8">
            <YelhaaMark size={32} />
            <h1 className="mt-8 type-h2 text-ink">{t("errors.serverHeading")}</h1>
            <p className="mt-4 text-ink-2">{t("errors.globalBody")}</p>
            <button
              type="button"
              onClick={reset}
              className="mt-8 inline-flex h-[38px] items-center rounded-[6px] bg-volt px-5 font-semibold text-void"
            >
              {t("errors.tryAgain")}
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
