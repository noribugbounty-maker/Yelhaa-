import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";

/**
 * Navigation, main region, footer. Flat `#050505` background — no field, no
 * wash, no grain (design decision document §D3).
 *
 * Used by the `(site)` layout and by `not-found` / `error`, which live at the
 * root of `app/` and must keep the navigation intact.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
