"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { useT } from "@/components/i18n/preferences-provider";
import { Composer } from "@/components/chat/composer";
import { IDEA_MIN_LENGTH } from "@/lib/config";
import { generationDestination } from "@/lib/generate/contract";
import { logGenerate } from "@/lib/generate/observe";
import { requestGeneration } from "@/lib/generate/request";

/**
 * État de départ — aucune conversation n'existe encore en base.
 *
 * Le premier message **est** une génération : `POST /api/generate` crée la
 * conversation et les deux messages. Tant que rien n'est écrit, cette page
 * ne touche pas la base.
 */
export function NewConversation() {
  const t = useT();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="mx-auto flex min-h-0 flex-1 max-w-2xl flex-col justify-center px-5 py-10">
      <div className="text-center">
        <h1 className="type-h3 text-ink">{t("chat.startTitle")}</h1>
        <p className="mt-2 text-[14.5px] text-ink-2">{t("chat.startBody")}</p>
      </div>

      {error ? (
        <p
          aria-live="polite"
          className="mx-auto mt-6 border-l-2 border-l-err pl-2 text-[13px] text-err-paper"
        >
          {error}
        </p>
      ) : null}

      <div className="mt-8">
        <Composer
          onSend={async (content, fileIds) => {
            const idea = content.trim();
            if (idea.length < IDEA_MIN_LENGTH) {
              setError(t("build.ideaTooShort", { n: IDEA_MIN_LENGTH }));
              return false;
            }

            logGenerate("ui", "submit", {
              ideaLength: idea.length,
              fileCount: fileIds?.length ?? 0,
              source: "chat",
            });

            const result = await requestGeneration({ idea, fileIds });
            if (!result.ok) {
              setError(result.message);
              return false;
            }

            logGenerate("ui", "result inserted", {
              conversation: Boolean(result.conversationId),
              outputLength: result.output.length,
            });
            router.replace(generationDestination(result));
            return true;
          }}
        />
      </div>
    </div>
  );
}
