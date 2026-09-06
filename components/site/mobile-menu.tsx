"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { useT } from "@/components/i18n/preferences-provider";
import { YelhaaLockup } from "@/components/brand/yelhaa-node-mark";
import { ThemeLanguageBar } from "@/components/site/theme-language-bar";
import { NAV_LINKS, ROUTES } from "@/lib/config";

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

const NAV_KEYS = ["product", "features", "pricing", "resources"] as const;

type MenuEntryStyle = CSSProperties & { "--menu-delay"?: string };

export function MobileMenu({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const t = useT();

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    const trigger = triggerRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusables = () =>
      Array.from(panel?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
    focusables()[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }
      if (event.key !== "Tab") return;

      const items = focusables();
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      trigger?.focus();
    };
  }, [open]);

  const entryStyle = (index: number): MenuEntryStyle => ({
    "--menu-delay": `${index * 40}ms`,
  });

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label={t("nav.openMenu")}
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="-mr-2.5 flex size-11 items-center justify-center text-ink-2 transition-colors duration-[140ms] hover:text-ink md:hidden"
      >
        <Menu size={20} strokeWidth={1.5} aria-hidden="true" />
      </button>

      {open && mounted
        ? createPortal(
            <div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label={t("nav.navigation")}
              className="fixed inset-0 z-50 flex flex-col bg-void md:hidden"
            >
              <div className="flex h-[64px] shrink-0 items-center justify-between border-b border-line px-5">
                <YelhaaLockup height={32} />
                <button
                  type="button"
                  aria-label={t("nav.closeMenu")}
                  onClick={close}
                  className="flex size-11 items-center justify-center text-ink-2 transition-colors duration-[140ms] hover:text-ink"
                >
                  <X size={20} strokeWidth={1.5} aria-hidden="true" />
                </button>
              </div>

              <nav aria-label={t("nav.main")} className="flex flex-col gap-6 px-5 py-10">
                {NAV_LINKS.map((link, index) => {
                  const href: string = link.href;
                  const active =
                    !href.startsWith("/#") &&
                    (href === "/" ? pathname === "/" : pathname.startsWith(href));
                  const key = NAV_KEYS[index] ?? "product";
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={close}
                      aria-current={active ? "page" : undefined}
                      style={entryStyle(index)}
                      className={`menu-cut text-[32px] font-semibold leading-none tracking-[-0.04em] ${
                        active ? "text-ink" : "text-ink-2"
                      }`}
                    >
                      {t(`nav.${key}`)}
                    </Link>
                  );
                })}
              </nav>

              <div
                style={entryStyle(NAV_LINKS.length)}
                className="menu-cut mt-auto flex flex-col gap-3 border-t border-line px-5 py-6"
              >
                <ThemeLanguageBar />
                <Link
                  href={ROUTES.login}
                  className="flex h-11 items-center justify-center rounded-[6px] border border-line text-[15px] text-ink transition-colors duration-[140ms] hover:border-line-strong"
                >
                  {t("nav.login")}
                </Link>
                <Link
                  href={ROUTES.signup}
                  className="flex h-11 items-center justify-center rounded-[6px] bg-ink font-semibold text-void transition-colors duration-[140ms] hover:bg-white"
                >
                  {t("nav.getStarted")}
                </Link>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
