"use client";

import Link from "next/link";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { sendMessageAction } from "@/app/(chat)/actions";
import { useT } from "@/components/i18n/preferences-provider";
import { Composer } from "@/components/chat/composer";
import type { ConversationWithMessages } from "@/lib/conversations/types";

/**
 * Une conversation ouverte — en-tête, messages, composeur.
 *
 * ## Copie à trois niveaux (§12)
 *
 * Chaque message porte sa propre copie. Un message d'assistant issu d'une
 * génération porte en plus **« Copy prompt »**, qui copie *uniquement* le
 * prompt — sans libellé de rôle, sans horodatage. Le §13 est explicite :
 * demander le prompt ne doit pas exporter la conversation.
 *
 * Le retour « Copied » est temporaire et revient à son libellé d'origine.
 */
export function ConversationView({
  conversation,
}: {
  conversation: ConversationWithMessages;
}) {
  const t = useT();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Le dernier message est amené à l'écran à l'ouverture et après chaque envoi.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [conversation.messages.length]);

  const copy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(key);
      window.setTimeout(
        () => setCopiedId((current) => (current === key ? null : current)),
        1600,
      );
    } catch {
      setError(t("chat.copyUnavailable"));
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="border-b border-line px-5 py-3.5">
        <h1 className="truncate text-[15.5px] font-medium text-ink">
          {conversation.title}
        </h1>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-5 py-6">
          {conversation.messages.length === 0 ? (
            <p className="py-10 text-center text-[14px] text-ink-3">
              {t("chat.noMessages")}
            </p>
          ) : (
            <ol className="flex flex-col gap-6">
              {conversation.messages.map((message) => {
                const isUser = message.role === "user";
                return (
                  <li key={message.id} className="group/msg">
                    <p className="type-label">{isUser ? t("chat.you") : "Yelhaa"}</p>
                    <div
                      className={
                        isUser
                          ? "mt-1.5 whitespace-pre-wrap text-[15px] text-ink"
                          : "mt-1.5 whitespace-pre-wrap rounded-[6px] border border-line bg-surface p-4 font-mono text-[13.5px] leading-[1.6] text-ink-2"
                      }
                    >
                      {message.content}
                    </div>

                    <div className="mt-2 flex gap-3 opacity-0 transition-opacity duration-[140ms] focus-within:opacity-100 group-hover/msg:opacity-100">
                      <button
                        type="button"
                        onClick={() => void copy(message.id, message.content)}
                        className="text-[12.5px] text-ink-3 transition-colors duration-[140ms] hover:text-ink"
                      >
                        {copiedId === message.id ? t("chat.copied") : t("chat.copy")}
                      </button>
                      {/*
                        « Copy prompt » n'existe que sur un message issu d'une
                        génération : ailleurs, il n'y a pas de prompt à copier,
                        et un bouton qui copierait le message en le nommant
                        autrement serait un mensonge.
                      */}
                      {!isUser && message.generationId ? (
                        <button
                          type="button"
                          onClick={() =>
                            void copy(`${message.id}-prompt`, message.content)
                          }
                          className="text-[12.5px] text-ink-3 transition-colors duration-[140ms] hover:text-ink"
                        >
                          {copiedId === `${message.id}-prompt`
                            ? t("chat.copied")
                            : t("chat.copyPrompt")}
                        </button>
                      ) : null}
                      {/*
                        Même condition, même identifiant : l'espace de travail
                        est celui de la génération. Il existait déjà depuis
                        `/prompt/[id]` mais pas depuis la conversation, ce qui
                        obligeait à retrouver le résultat à la main — exactement
                        ce que l'accès direct doit éviter. Aucune route
                        nouvelle : `/workspace/[id]` prend l'identifiant réel.
                      */}
                      {!isUser && message.generationId ? (
                        <Link
                          href={`/workspace/${message.generationId}`}
                          className="text-[12.5px] text-ink-3 transition-colors duration-[140ms] hover:text-ink"
                        >
                          {t("chat.openWorkspace")}
                        </Link>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      <div className="border-t border-line px-5 py-4">
        <div className="mx-auto max-w-3xl">
          {error ? (
            <p
              aria-live="polite"
              className="mb-3 border-l-2 border-l-err pl-2 text-[13px] text-err-paper"
            >
              {error}
            </p>
          ) : null}
          <Composer
            placeholder={t("chat.continue")}
            onSend={async (content, fileIds) => {
              const result = await sendMessageAction(
                conversation.id,
                content,
                fileIds,
              );
              if (!result.ok) {
                setError(result.message);
                return false;
              }
              setError(null);
              router.refresh();
              return true;
            }}
          />
        </div>
      </div>
    </div>
  );
}
