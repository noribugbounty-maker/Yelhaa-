import type { Metadata } from "next";
import { cookies } from "next/headers";

import { LegalEntityGate } from "@/components/legal/legal-entity-gate";
import { TermsBody } from "@/components/legal/terms-body";
import { translate } from "@/lib/i18n/index";
import { LOCALE_COOKIE, parseLocale } from "@/lib/i18n/types";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = parseLocale((await cookies()).get(LOCALE_COOKIE)?.value);
  return pageMetadata({
    title: translate(locale, "legal.termsTitle"),
    description: translate(locale, "legal.termsDesc"),
    path: "/legal/terms",
  });
}

export default function TermsPage() {
  return (
    <LegalEntityGate>
      <TermsBody />
    </LegalEntityGate>
  );
}
