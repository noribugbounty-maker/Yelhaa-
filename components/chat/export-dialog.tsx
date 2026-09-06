"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { useT } from "@/components/i18n/preferences-provider";
import {
  exportFilename,
  toJson,
  toMarkdown,
  toPlainText,
} from "@/lib/conversations/export";
import type {
  Conversation,
  ConversationWithMessages,
} from "@/lib/conversations/types";

/**
 * Export d'une conversation — copie, Markdown, JSON.
 *
 * ## Les données sont chargées, jamais devinées
 *
 * Le §33 interdit l'optimisme sur l'export, et le §11 interdit d'exporter des
 * données d'autrui. Les deux se règlent d'un coup : le dialogue **récupère la
 * conversation à l'ouverture** via une route qui passe par le client de
 * session. La RLS filtre ; un identifiant étranger rend 404, et il n'y a rien à
 * exporter.
 *
 * Les trois formats proposés sont les trois qui existent. Le §11 est explicite :
 * ne proposer que ce qui est implémenté.
 */
export function ExportConversationDialog({
  conversation,
  onClose,
}: {
  conversation: Conversation;
  onClose: () => void;
}) {
  const t = useT();
  const [data, setData] = useState<ConversationWithMessages | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus();
    };
  }, [onClose]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await fetch(
          `/api/conversations/${conversation.id}/export`,
          { cache: "no-store" },
        );
        if (!response.ok) throw new Error(String(response.status));
        const payload = (await response.json()) as ConversationWithMessages;
        if (!cancelled) setData(payload);
      } catch {
        if (!cancelled) setError(t("chat.exportLoadError"));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [conversation.id]);

  /** Le retour « Copied » est temporaire — le §12 l'exige explicitement. */
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setError(t("chat.copyUnavailable"));
    }
  };

  const download = (contents: string, extension: "md" | "json") => {
    if (!data) return;
    const blob = new Blob([contents], {
      type: extension === "md" ? "text/markdown" : "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = exportFilename(data, extension);
    link.click();
    // Sans révocation, le blob reste en mémoire jusqu'au déchargement de la page.
    URL.revokeObjectURL(url);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-void/70 p-5"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="glass-panel w-full max-w-md p-6"
      >
        <h2 id={titleId} className="type-h3 text-ink">
          {t("chat.exportTitle")}
        </h2>
        <p className="mt-2 truncate text-[13.5px] text-ink-3">
          {conversation.title}
        </p>

        {error ? (
          <p
            aria-live="polite"
            className="mt-5 border-l-2 border-l-err pl-2 text-[13px] text-err-paper"
          >
            {error}
          </p>
        ) : !data ? (
          // Squelette plutôt qu'un message d'erreur prématuré (§20).
          <div aria-live="polite" className="mt-6 flex flex-col gap-2">
            <span className="sr-only">{t("chat.loading")}</span>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                aria-hidden="true"
                className="block h-9 rounded-[6px] border border-line bg-surface-2"
              />
            ))}
          </div>
        ) : (
          <div className="mt-6 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => void copy(toPlainText(data))}
              className="rounded-[6px] border border-line px-3 py-2.5 text-left text-[14px] text-ink-2 transition-colors duration-[140ms] hover:border-line-strong hover:bg-surface-2 hover:text-ink"
            >
              {copied ? t("chat.copied") : t("chat.copyConversation")}
            </button>
            <button
              type="button"
              onClick={() => download(toMarkdown(data), "md")}
              className="rounded-[6px] border border-line px-3 py-2.5 text-left text-[14px] text-ink-2 transition-colors duration-[140ms] hover:border-line-strong hover:bg-surface-2 hover:text-ink"
            >
              {t("chat.downloadMd")}
            </button>
            <button
              type="button"
              onClick={() => download(toJson(data), "json")}
              className="rounded-[6px] border border-line px-3 py-2.5 text-left text-[14px] text-ink-2 transition-colors duration-[140ms] hover:border-line-strong hover:bg-surface-2 hover:text-ink"
            >
              {t("chat.downloadJson")}
            </button>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="rounded-[6px] border border-line px-4 py-2 text-[14px] text-ink-2 transition-colors duration-[140ms] hover:border-line-strong hover:text-ink"
          >
            {t("chat.close")}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
