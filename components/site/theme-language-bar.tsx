"use client";

import { Moon, Sun } from "lucide-react";

import { usePreferences } from "@/components/i18n/preferences-provider";

function SegmentedBar({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex h-8 items-center rounded-[6px] border border-line p-0.5"
    >
      {children}
    </div>
  );
}

function SegmentButton({
  pressed,
  onClick,
  label,
  children,
}: {
  pressed: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      onClick={onClick}
      className={`inline-flex h-7 min-w-7 items-center justify-center rounded-[4px] px-1.5 text-[11px] font-semibold tracking-[0.04em] transition-colors duration-[140ms] ${
        pressed
          ? "bg-ink text-void"
          : "text-ink-3 hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

export function ThemeLanguageBar({ className = "" }: { className?: string }) {
  const { locale, theme, setLocale, setTheme, t } = usePreferences();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <SegmentedBar label={t("prefs.theme")}>
        <SegmentButton
          pressed={theme === "dark"}
          onClick={() => setTheme("dark")}
          label={t("prefs.dark")}
        >
          <Moon size={13} strokeWidth={1.75} aria-hidden="true" />
        </SegmentButton>
        <SegmentButton
          pressed={theme === "light"}
          onClick={() => setTheme("light")}
          label={t("prefs.light")}
        >
          <Sun size={13} strokeWidth={1.75} aria-hidden="true" />
        </SegmentButton>
      </SegmentedBar>

      <SegmentedBar label={t("prefs.language")}>
        <SegmentButton
          pressed={locale === "en"}
          onClick={() => setLocale("en")}
          label={t("prefs.english")}
        >
          EN
        </SegmentButton>
        <SegmentButton
          pressed={locale === "fr"}
          onClick={() => setLocale("fr")}
          label={t("prefs.french")}
        >
          FR
        </SegmentButton>
      </SegmentedBar>
    </div>
  );
}
