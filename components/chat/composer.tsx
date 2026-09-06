"use client";

import { ArrowUp, Square } from "lucide-react";
import { useCallback, useLayoutEffect, useRef, useState } from "react";

import {
  Attachments,
  type Attachment,
} from "@/components/build/attachments";
import { useT } from "@/components/i18n/preferences-provider";
import { cn } from "@/lib/utils";

/**
 * Barre d'envoi du chat.
 *
 * Reprend la mécanique du PromptInputBox (autosize, disque d'envoi, trombone)
 * et la passe au filtre Yelhaa : tokens `glass` / `volt`, rayon 6px, fichiers
 * texte seulement. Pas de Search / Think / Canvas, pas de dictée fictive —
 * le produit n'a aucune de ces trois fonctions.
 *
 * ## Une seule soumission par action
 *
 * Le verrou est porté par une **ref**, pas par un état : un `useState` ne
 * change qu'au rendu suivant, donc deux clics rapprochés dans la même frame
 * liraient tous les deux `false`. La ref est écrite de façon synchrone.
 *
 * `Enter` envoie, `Shift + Enter` insère une ligne.
 */

const MIN_HEIGHT = 44;
const MAX_HEIGHT = 200;

export function Composer({
  onSend,
  placeholder,
}: {
  onSend: (content: string, fileIds?: string[]) => Promise<boolean>;
  placeholder?: string;
}) {
  const t = useT();
  const resolvedPlaceholder = placeholder ?? t("chat.describe");
  const [value, setValue] = useState("");
  const [pending, setPending] = useState(false);
  const [files, setFiles] = useState<Attachment[]>([]);
  const inFlight = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const element = textareaRef.current;
    if (!element) return;
    element.style.height = "auto";
    element.style.height = `${Math.min(
      Math.max(element.scrollHeight, MIN_HEIGHT),
      MAX_HEIGHT,
    )}px`;
  }, [value]);

  const send = async () => {
    const content = value.trim();
    if (!content || inFlight.current) return;

    inFlight.current = true;
    setPending(true);
    const fileIds = files.length > 0 ? files.map((file) => file.id) : undefined;
    let sent = false;
    try {
      sent = await onSend(content, fileIds);
    } catch {
      sent = false;
    } finally {
      setPending(false);
      inFlight.current = false;
    }

    if (sent) {
      setValue("");
      setFiles([]);
    }
  };

  const hasContent = value.trim().length > 0;
  const canSend = hasContent && !pending;

  const focusFromPanel = useCallback((event: React.MouseEvent) => {
    if ((event.target as HTMLElement).closest("button, textarea, input")) {
      return;
    }
    textareaRef.current?.focus();
  }, []);

  return (
    <div
      onClick={focusFromPanel}
      className={cn(
        "glass-panel glass-writing cursor-text p-2 transition-[border-color] duration-[140ms]",
        pending && "border-line-strong",
      )}
    >
      <label htmlFor="chat-composer" className="sr-only">
        Message
      </label>
      <textarea
        ref={textareaRef}
        id="chat-composer"
        value={value}
        rows={1}
        disabled={pending}
        placeholder={resolvedPlaceholder}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            void send();
          }
        }}
        className="block w-full resize-none bg-transparent px-3 py-2.5 text-[15.5px] leading-[1.6] text-ink caret-volt outline-none placeholder:text-ink-3 disabled:cursor-not-allowed disabled:opacity-50"
        style={{
          minHeight: MIN_HEIGHT,
          maxHeight: MAX_HEIGHT,
          overflowY: "auto",
        }}
      />

      <div className="flex items-end justify-between gap-2 px-1 pt-1">
        <div className="min-w-0 flex-1">
          <Attachments
            files={files}
            onChange={setFiles}
            disabled={pending}
            variant="compact"
          />
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <span className="hidden font-mono text-[11.5px] text-ink-3 sm:inline">
            {t("chat.send")}
          </span>
          <button
            type="button"
            onClick={() => void send()}
            disabled={!canSend}
            aria-label={pending ? t("chat.sending") : t("chat.send")}
            className={cn(
              "inline-flex size-8 items-center justify-center rounded-full transition-[background-color,opacity] duration-[140ms]",
              hasContent && !pending
                ? "bg-volt text-void hover:opacity-90"
                : "glass-inset text-ink-3",
              pending && "cursor-wait bg-volt text-void",
            )}
          >
            {pending ? (
              <Square className="size-3.5 fill-current" aria-hidden="true" />
            ) : (
              <ArrowUp className="size-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
