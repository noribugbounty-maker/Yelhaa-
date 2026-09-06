"use client";

import { useT } from "@/components/i18n/preferences-provider";
import { IdeaField } from "@/components/build/idea-field";

export function BuildPage() {
  const t = useT();

  return (
    <section
      aria-label={t("build.aria")}
      className="mx-auto max-w-[1440px] px-5 pt-14 pb-24 md:px-8 md:pt-20"
    >
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <p className="type-label">{t("build.label")}</p>
        <h1 className="mt-4 type-h2 text-ink text-balance">{t("build.title")}</h1>
        <p className="mt-5 max-w-[56ch] text-[16px] text-ink-2 text-balance">
          {t("build.body")}
        </p>

        <div className="w-full text-left">
          <IdeaField />
        </div>
      </div>
    </section>
  );
}
