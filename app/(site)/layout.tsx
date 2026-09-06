import { SiteChrome } from "@/components/site/site-chrome";

/** Chrome des écrans sombres : grille technique, navigation, footer. */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteChrome>{children}</SiteChrome>;
}
