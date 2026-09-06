import type { Metadata } from "next";
import { cookies } from "next/headers";

import { LegalEntityGate } from "@/components/legal/legal-entity-gate";
import { PrivacyBody } from "@/components/legal/privacy-body";
import { translate } from "@/lib/i18n/index";
import { LOCALE_COOKIE, parseLocale } from "@/lib/i18n/types";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = parseLocale((await cookies()).get(LOCALE_COOKIE)?.value);
  return pageMetadata({
    title: translate(locale, "legal.privacyTitle"),
    description: translate(locale, "legal.privacyDesc"),
    path: "/legal/privacy",
  });
}

export default function PrivacyPage() {
  return (
    <LegalEntityGate>
      <PrivacyBody />
    </LegalEntityGate>
  );
}
