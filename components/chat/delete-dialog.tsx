"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { useT } from "@/components/i18n/preferences-provider";
import type { Conversation } from "@/lib/conversations/types";

/**
 * Confirmation de suppression.
 *
 * Le §6 demande une protection contre le clic accidentel : la suppression est
 * irréversible et emporte les messages. Le dialogue est **modal** — piège à
 * focus, `aria-modal`, retour du focus au déclencheur — parce qu'une
 * confirmation qu'on peut contourner à la tabulation n'en est pas une.
 *
 * Le focus initial va sur **Cancel**, jamais sur Delete : une frappe sur Entrée
 * juste après l'ouverture ne doit pas détruire une conversation.
 */
export function DeleteConversationDialog({
  conversation,
  onCancel,
  onConfirm,
}: {
  conversation: Conversation;
  onCancel: () => void;
  onConfirm: (conversation: Conversation) => Promise<string | null>;
}) {
  const t = useT();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    cancelRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onCancel();
        return;
      }
      if (event.key !== "Tab") return;

      // Piège à focus : la tabulation boucle sur les contrôles du dialogue.
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        "button:not([disabled])",
      );
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus();
    };
  }, [onCancel]);

  const confirm = async () => {
    if (pending) return; // double-clic : une seule suppression part
    setPending(true);
    const message = await onConfirm(conversation);
    setPending(false);
    if (message) setError(message);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-void/70 p-5"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <div
        ref={panelRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="glass-panel w-full max-w-md p-6"
      >
        <h2 id={titleId} className="type-h3 text-ink">
          {t("chat.deleteTitle")}
        </h2>
        <p id={descriptionId} className="mt-3 text-[14.5px] text-ink-2">
          {t("chat.deleteBody", { title: conversation.title })}
        </p>

        {error ? (
          <p
            aria-live="polite"
            className="mt-4 border-l-2 border-l-err pl-2 text-[13px] text-err-paper"
          >
            {error}
          </p>
        ) : null}

        <div className="mt-6 flex justify-end gap-3">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            className="rounded-[6px] border border-line px-4 py-2 text-[14px] text-ink-2 transition-colors duration-[140ms] hover:border-line-strong hover:text-ink"
          >
            {t("chat.cancel")}
          </button>
          <button
            type="button"
            onClick={() => void confirm()}
            disabled={pending}
            className="rounded-[6px] border border-err bg-transparent px-4 py-2 text-[14px] font-medium text-err-paper transition-opacity duration-[140ms] hover:bg-err/10 disabled:opacity-60"
          >
            {pending ? t("chat.deleting") : t("chat.delete")}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
