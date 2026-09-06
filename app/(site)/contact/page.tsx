import type { Metadata } from "next";

import { ContactPage } from "@/components/contact/contact-page";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "A question about the product, a remark, or a problem with your account — write to us and we read everything.",
  path: "/contact",
});

export default function ContactRoute() {
  return <ContactPage />;
}
