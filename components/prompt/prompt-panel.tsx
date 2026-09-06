"use client";

import { useEffect, useRef, useState } from "react";
import { Download } from "lucide-react";

import { useT } from "@/components/i18n/preferences-provider";
import { MarkTick } from "@/components/brand/marks";

/**
 * Le prompt généré — design prompt §3.4.
 *
 * Copie et téléchargement sont les deux sorties de la V1 (décisions §7), et
 * les deux sont réellement fonctionnelles. Les données exportées
 * correspondent exactement au contenu généré.
 */
export function PromptPanel({
  output,
  tokens,
  slug,
}: {
  output: string;
  tokens: number | null;
  slug: string;
}) {
  const t = useT();
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Aucun minuteur fuyant (§4).
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const lines = output.split("\n");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1600);
    } catch {
      // Presse-papiers refusé : le texte reste sélectionnable à la main.
      console.error("[prompt] copie refusée par le navigateur");
    }
  };

  const download = () => {
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${slug}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="glass-panel">
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-2.5">
        <span className="type-mono text-ink-3">
          {tokens === null ? "—" : t("prompt.tokens", { n: tokens })}
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={copy}
            className="glass-inset glass-hot inline-flex h-[30px] items-center gap-2 px-3 text-[13px] text-ink"
          >
            {copied ? (
              <>
                <MarkTick draw className="size-3.5" />
                {t("prompt.copied")}
              </>
            ) : (
              t("prompt.copy")
            )}
          </button>

          <button
            type="button"
            onClick={download}
            aria-label={t("prompt.download")}
            className="glass-inset glass-hot inline-flex size-[30px] items-center justify-center text-ink-2 hover:text-ink"
          >
            <Download size={15} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="max-h-[70vh] overflow-auto">
        <div className="flex">
          <div
            aria-hidden="true"
            className="shrink-0 border-r border-line px-3 py-4 text-right type-mono text-ink-3 select-none"
          >
            {lines.map((_, index) => (
              <div key={index}>{index + 1}</div>
            ))}
          </div>
          <pre className="min-w-0 flex-1 whitespace-pre-wrap px-4 py-4 type-mono text-ink">
            {output}
          </pre>
        </div>
      </div>
    </div>
  );
}
