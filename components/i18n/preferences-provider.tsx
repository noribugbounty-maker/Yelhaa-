"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { applyDocumentPreferences, persistLocale, persistTheme } from "@/lib/i18n/cookie";
import { translate } from "@/lib/i18n/index";
import {
  DEFAULT_LOCALE,
  DEFAULT_THEME,
  type Locale,
  type Theme,
} from "@/lib/i18n/types";

type Vars = Record<string, string | number>;

type Preferences = {
  locale: Locale;
  theme: Theme;
  setLocale: (locale: Locale) => void;
  setTheme: (theme: Theme) => void;
  t: (path: string, vars?: Vars) => string;
};

const PreferencesContext = createContext<Preferences | null>(null);

export function PreferencesProvider({
  initialLocale = DEFAULT_LOCALE,
  initialTheme = DEFAULT_THEME,
  children,
}: {
  initialLocale?: Locale;
  initialTheme?: Theme;
  children: ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [theme, setThemeState] = useState<Theme>(initialTheme);

  const setLocale = useCallback(
    (next: Locale) => {
      persistLocale(next);
      applyDocumentPreferences(theme, next);
      setLocaleState(next);
    },
    [theme],
  );

  const setTheme = useCallback(
    (next: Theme) => {
      persistTheme(next);
      applyDocumentPreferences(next, locale);
      setThemeState(next);
    },
    [locale],
  );

  const t = useCallback(
    (path: string, vars?: Vars) => translate(locale, path, vars),
    [locale],
  );

  const value = useMemo(
    () => ({ locale, theme, setLocale, setTheme, t }),
    [locale, setLocale, setTheme, t, theme],
  );

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences(): Preferences {
  const context = useContext(PreferencesContext);
  if (!context) {
    return {
      locale: DEFAULT_LOCALE,
      theme: DEFAULT_THEME,
      setLocale: () => undefined,
      setTheme: () => undefined,
      t: (path, vars) => translate(DEFAULT_LOCALE, path, vars),
    };
  }
  return context;
}

export function useT() {
  return usePreferences().t;
}
