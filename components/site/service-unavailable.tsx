"use client";

import { useT } from "@/components/i18n/preferences-provider";
import { MarkBar } from "@/components/brand/marks";

type ServiceUnavailableProps = {
  tone?: "dark" | "paper";
  title?: string;
  description?: string;
};

export function ServiceUnavailable({
  tone = "dark",
  title,
  description,
}: ServiceUnavailableProps) {
  const t = useT();
  const resolvedTitle = title ?? t("errors.serviceTitle");
  const resolvedDescription = description ?? t("errors.serviceBody");
  const surface =
    tone === "paper"
      ? "border-paper-line bg-paper-2 text-void"
      : "border-line bg-surface text-ink";
  const body = tone === "paper" ? "text-void/70" : "text-ink-2";

  return (
    <div
      role="status"
      className={`border border-l-2 border-l-warn p-6 md:p-8 ${surface}`}
    >
      <MarkBar
        draw
        tone={tone === "paper" ? "volt-deep" : "volt"}
        className="h-2 w-10"
      />
      <h2 className="mt-5 type-h3">{resolvedTitle}</h2>
      <p className={`mt-3 max-w-[52ch] text-[14px] ${body}`}>
        {resolvedDescription}
      </p>
    </div>
  );
}
