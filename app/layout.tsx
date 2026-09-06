import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { Inter, JetBrains_Mono } from "next/font/google";

import { PreferencesProvider } from "@/components/i18n/preferences-provider";
import { SITE } from "@/lib/config";
import {
  DEFAULT_LOCALE,
  DEFAULT_THEME,
  LOCALE_COOKIE,
  THEME_COOKIE,
  parseLocale,
  parseTheme,
} from "@/lib/i18n/types";
import { absoluteUrl, siteUrl } from "@/lib/seo";
import { cn } from "@/lib/utils";

import "@/app/globals.css";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans-family",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono-family",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  alternates: { canonical: absoluteUrl("/") },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: "en_US",
    url: absoluteUrl("/"),
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#050505" },
    { media: "(prefers-color-scheme: light)", color: "#f5f5f5" },
  ],
};

const BOOTSTRAP = `(function(){try{var c=document.cookie||"";function r(n){var m=c.match(new RegExp("(?:^|; )"+n+"=([^;]*)"));return m?decodeURIComponent(m[1]):""}var t=r("${THEME_COOKIE}");var l=r("${LOCALE_COOKIE}");if(t!=="light"&&t!=="dark")t="${DEFAULT_THEME}";if(l!=="fr"&&l!=="en")l="${DEFAULT_LOCALE}";document.documentElement.setAttribute("data-theme",t);document.documentElement.setAttribute("lang",l);}catch(e){}})();`;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jar = await cookies();
  const theme = parseTheme(jar.get(THEME_COOKIE)?.value);
  const locale = parseLocale(jar.get(LOCALE_COOKIE)?.value);

  return (
    <html
      lang={locale}
      data-theme={theme}
      suppressHydrationWarning
      className={cn(sans.variable, mono.variable, "font-sans")}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOTSTRAP }} />
      </head>
      <body
        data-surface={theme === "light" ? "paper" : "dark"}
        className="min-h-dvh bg-void text-ink"
      >
        <PreferencesProvider initialLocale={locale} initialTheme={theme}>
          {children}
        </PreferencesProvider>
      </body>
    </html>
  );
}
