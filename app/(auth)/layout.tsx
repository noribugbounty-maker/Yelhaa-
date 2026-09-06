import Link from "next/link";

import { AuthVisual } from "@/components/auth/auth-visual";
import { YelhaaLockup } from "@/components/brand/yelhaa-node-mark";
import { ThemeLanguageBar } from "@/components/site/theme-language-bar";
import { ROUTES, SITE } from "@/lib/config";

/**
 * Auth screens — design decision document §5.
 *
 * Same visual language as the landing. Desktop: form on the left, a sober
 * product visual on the right. Mobile: visual hidden, form centred. No
 * marketing chrome; a single brand-lockup link back home.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-void text-ink">
      <header className="mx-auto flex h-[64px] w-full max-w-[1440px] items-center justify-between px-5 md:px-8">
        <Link
          href={ROUTES.home}
          aria-label={`${SITE.name} — home`}
          className="flex items-center rounded-[4px]"
        >
          <YelhaaLockup height={32} />
        </Link>
        <ThemeLanguageBar />
      </header>

      <div className="mx-auto grid w-full max-w-[1440px] flex-1 gap-12 px-5 pb-16 pt-6 md:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16 lg:pt-10">
        <div className="mx-auto flex w-full max-w-md flex-col justify-center lg:mx-0 lg:max-w-[440px]">
          {children}
        </div>
        <div className="hidden lg:block">
          <AuthVisual />
        </div>
      </div>
    </div>
  );
}
