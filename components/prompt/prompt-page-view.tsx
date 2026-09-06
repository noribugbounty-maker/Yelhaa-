"use client";

import Link from "next/link";

import { useT } from "@/components/i18n/preferences-provider";
import { PromptPanel } from "@/components/prompt/prompt-panel";
import { Suggestions } from "@/components/prompt/suggestions";
import { TemplatePanel, type SelectedTemplate } from "@/components/prompt/template-panel";

type Retained = { key: string; value: string };

export function PromptPageView({
  output,
  tokens,
  slug,
  idea,
  retained,
  template,
  generationId,
  conversationId,
  missing,
}: {
  output: string;
  tokens: number | null;
  slug: string;
  idea: string;
  retained: Retained[];
  template: SelectedTemplate | null;
  generationId: string;
  conversationId: string | null;
  missing: string[];
}) {
  const t = useT();

  return (
    <section
      aria-label={t("prompt.title")}
      className="mx-auto max-w-[1440px] px-5 py-12 md:px-8 md:py-16"
    >
      <h1 className="type-h2 text-ink">{t("prompt.title")}</h1>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <PromptPanel output={output} tokens={tokens} slug={slug} />

        <div className="flex flex-col gap-6">
          <section aria-label={t("prompt.ideaAria")} className="glass-panel p-5">
            <h2 className="type-label">{t("prompt.idea")}</h2>
            <p className="glass-inset mt-3 p-4 text-[14px] text-ink-2">{idea}</p>

            {retained.length > 0 ? (
              <dl className="mt-5">
                {retained.map((entry) => (
                  <div
                    key={entry.key}
                    className="flex items-baseline justify-between gap-4 border-t border-line py-2.5 first:border-t-0"
                  >
                    <dt className="type-label">{t(`prompt.${entry.key}`)}</dt>
                    <dd className="text-right text-[14px] text-ink">
                      {entry.value}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </section>

          {template ? (
            <TemplatePanel generationId={generationId} template={template} />
          ) : null}

          <Suggestions missing={missing} idea={idea} />
        </div>
      </div>

      <Link
        href={conversationId ? `/chat/${conversationId}` : `/workspace/${generationId}`}
        className="mt-8 flex h-[46px] w-full items-center justify-center rounded-[6px] bg-volt font-semibold tracking-[0.04em] text-void transition-colors duration-[140ms] hover:bg-volt-hot active:bg-volt-press"
      >
        {conversationId ? t("prompt.continueChat") : t("prompt.openWorkspace")}
      </Link>

      <div className="mt-5 flex flex-wrap items-center gap-6">
        <Link
          href="/generate"
          className="text-[14px] text-ink-2 transition-colors duration-[140ms] hover:text-ink"
        >
          {t("prompt.regenerate")}
        </Link>
        <Link
          href="/"
          className="text-[14px] text-ink-2 transition-colors duration-[140ms] hover:text-ink"
        >
          {t("prompt.refine")}
        </Link>
      </div>
    </section>
  );
}
