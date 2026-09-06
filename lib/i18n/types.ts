export const LOCALES = ["en", "fr"] as const;
export type Locale = (typeof LOCALES)[number];

export const THEMES = ["dark", "light"] as const;
export type Theme = (typeof THEMES)[number];

export const DEFAULT_LOCALE: Locale = "en";
export const DEFAULT_THEME: Theme = "dark";

export const LOCALE_COOKIE = "yelhaa-locale";
export const THEME_COOKIE = "yelhaa-theme";

export function parseLocale(value: string | null | undefined): Locale {
  return value === "fr" ? "fr" : "en";
}

export function parseTheme(value: string | null | undefined): Theme {
  return value === "light" ? "light" : "dark";
}
