"use client";

import Link from "next/link";

import { useT } from "@/components/i18n/preferences-provider";
import { YelhaaLockup } from "@/components/brand/yelhaa-node-mark";
import { COPYRIGHT, ROUTES, SITE, SOCIAL_LINKS } from "@/lib/config";

const linkClass =
  "text-[14px] text-ink-2 transition-colors duration-[140ms] hover:text-ink focus-visible:text-ink";

export function SiteFooter() {
  const t = useT();
  const socials = SOCIAL_LINKS.filter((entry) => entry.href !== "");

  const columns = [
    {
      title: t("footer.product"),
      links: [
        { href: ROUTES.build, label: t("footer.promptBuilder") },
        { href: "/chat", label: t("footer.history") },
        { href: ROUTES.pricing, label: t("footer.pricing") },
      ],
    },
    {
      title: t("footer.resources"),
      links: [{ href: ROUTES.faq, label: t("footer.helpCenter") }],
    },
    {
      title: t("footer.company"),
      links: [
        { href: ROUTES.contact, label: t("footer.contact") },
        { href: ROUTES.privacy, label: t("footer.privacy") },
        { href: ROUTES.terms, label: t("footer.terms") },
        { href: ROUTES.notice, label: t("footer.notice") },
      ],
    },
  ];

  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-[1440px] px-5 pt-16 pb-8 md:px-8 md:pt-20 md:pb-10">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link
              href={ROUTES.home}
              aria-label={`${SITE.name} — ${t("nav.home")}`}
              className="inline-flex rounded-[4px]"
            >
              <YelhaaLockup height={36} />
            </Link>
            <p className="mt-5 max-w-[30ch] text-[15px] text-ink-2">
              {t("footer.tagline")}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 lg:col-span-8">
            {columns.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <h2 className="type-label">{column.title}</h2>
                <ul className="mt-5 flex flex-col gap-3">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className={linkClass}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}

            {socials.length > 0 ? (
              <nav aria-label={t("footer.social")}>
                <h2 className="type-label">{t("footer.social")}</h2>
                <ul className="mt-5 flex flex-col gap-3">
                  {socials.map((entry) => (
                    <li key={entry.label}>
                      <a
                        href={entry.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className={linkClass}
                      >
                        {entry.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : null}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-line pt-6 text-[13px] text-ink-3 sm:flex-row sm:items-center sm:justify-between">
          <p>{COPYRIGHT}</p>
          <p>{t("footer.siteTagline")}</p>
        </div>
      </div>
    </footer>
  );
}
