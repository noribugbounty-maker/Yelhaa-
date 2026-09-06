"use client";

import { useT } from "@/components/i18n/preferences-provider";
import { ServiceUnavailable } from "@/components/site/service-unavailable";

export function ChatUnavailable() {
  const t = useT();
  return (
    <div className="mx-auto max-w-md px-5 py-24">
      <ServiceUnavailable
        title={t("chat.unavailableTitle")}
        description={t("chat.unavailableBody")}
      />
    </div>
  );
}
