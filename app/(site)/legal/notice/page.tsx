import type { Metadata } from "next";
import { cookies } from "next/headers";

import { LegalEntityGate } from "@/components/legal/legal-entity-gate";
import { NoticeBody } from "@/components/legal/notice-body";
import { translate } from "@/lib/i18n/index";
import { LOCALE_COOKIE, parseLocale } from "@/lib/i18n/types";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = parseLocale((await cookies()).get(LOCALE_COOKIE)?.value);
  return pageMetadata({
    title: translate(locale, "legal.noticeTitle"),
    description: translate(locale, "legal.noticeDesc"),
    path: "/legal/notice",
  });
}

export default function LegalNoticePage() {
  return (
    <LegalEntityGate>
      <NoticeBody />
    </LegalEntityGate>
  );
}
