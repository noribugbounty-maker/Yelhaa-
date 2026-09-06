import { FinalCta } from "@/components/landing/final-cta";
import { Hero } from "@/components/landing/hero";
import { Locations } from "@/components/landing/locations";
import { PreviewGallery } from "@/components/landing/preview-gallery";
import { PricingSection } from "@/components/landing/pricing-section";
import { PromptSection } from "@/components/landing/prompt-section";
import { OrganizationJsonLd } from "@/components/seo/json-ld";

/**
 * Landing — design decision document §4.
 *
 * Imposed order, no extra section:
 *
 *   NAVBAR → HERO → PREVIEW GALLERY → PROMPT ENGINEERING
 *   → GLOBE → PRICING → FINAL CTA → FOOTER
 *
 * Navbar and footer come from the `(site)` layout.
 */
export default function HomePage() {
  return (
    <>
      <OrganizationJsonLd />
      <Hero />
      <PreviewGallery />
      <PromptSection />
      <Locations />
      <PricingSection />
      <FinalCta />
    </>
  );
}
