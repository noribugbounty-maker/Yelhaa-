"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useT } from "@/components/i18n/preferences-provider";
import { YelhaaLockup } from "@/components/brand/yelhaa-node-mark";
import { AccountNav } from "@/components/site/account-nav";
import { MobileMenu } from "@/components/site/mobile-menu";
import { ThemeLanguageBar } from "@/components/site/theme-language-bar";
import { NAV_LINKS, ROUTES, SITE } from "@/lib/config";

const NAV_KEYS = ["product", "features", "pricing", "resources"] as const;

function isActive(pathname: string, href: string) {
  if (href.startsWith("/#")) return false;
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

const SCROLL_THRESHOLD = 24;

export function SiteHeader() {
  const pathname = usePathname();
  const barRef = useRef<HTMLElement>(null);
  const scrolledRef = useRef(false);
  const t = useT();

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const apply = (next: boolean) => {
      if (next === scrolledRef.current) return;
      scrolledRef.current = next;
      bar.dataset["scrolled"] = next ? "true" : "false";
    };

    const onScroll = () => apply(window.scrollY > SCROLL_THRESHOLD);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      ref={barRef}
      data-scrolled="false"
      className="glass-chrome sticky top-0 z-40 rounded-none border-x-0 border-t-0 border-b-transparent transition-[background-color,border-color] duration-[240ms] ease-[var(--ease-cut)]"
    >
      <div className="mx-auto flex h-[64px] max-w-[1440px] items-center justify-between px-5 md:px-8">
        <Link
          href={ROUTES.home}
          aria-label={`${SITE.name} — ${t("nav.home")}`}
          className="flex items-center rounded-[4px]"
        >
          <YelhaaLockup height={32} />
        </Link>

        <nav aria-label={t("nav.main")} className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((link, index) => {
              const active = isActive(pathname, link.href);
              const key = NAV_KEYS[index] ?? "product";
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`block rounded-[4px] px-3 py-1.5 text-[14px] transition-colors duration-[140ms] ${
                      active ? "text-ink" : "text-ink-2 hover:text-ink"
                    }`}
                  >
                    {t(`nav.${key}`)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2.5 sm:gap-3">
          <ThemeLanguageBar className="hidden sm:flex" />
          <AccountNav />
          <MobileMenu pathname={pathname} />
        </div>
      </div>
    </header>
  );
}
