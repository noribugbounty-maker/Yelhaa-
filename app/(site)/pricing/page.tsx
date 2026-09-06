import type { Metadata } from "next";

import { PricingPage } from "@/components/pricing/pricing-page";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Pricing",
  description:
    "Free, Pro and Agency. Every plan includes every art direction and every feature — plans differ only in how many generations you get.",
  path: "/pricing",
});

export default function PricingRoute() {
  return <PricingPage />;
}
