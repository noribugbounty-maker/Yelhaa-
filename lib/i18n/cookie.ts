import {
  LOCALE_COOKIE,
  THEME_COOKIE,
  type Locale,
  type Theme,
} from "@/lib/i18n/types";

const YEAR = 60 * 60 * 24 * 365;

export function persistPreference(name: string, value: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${YEAR}; samesite=lax`;
}

export function persistLocale(locale: Locale) {
  persistPreference(LOCALE_COOKIE, locale);
}

export function persistTheme(theme: Theme) {
  persistPreference(THEME_COOKIE, theme);
}

export function applyDocumentPreferences(theme: Theme, locale: Locale) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = locale;
  document.documentElement.dataset["theme"] = theme;
  document.body.dataset["surface"] = theme === "light" ? "paper" : "dark";
}
