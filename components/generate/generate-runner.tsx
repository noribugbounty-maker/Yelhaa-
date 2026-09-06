"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { useT } from "@/components/i18n/preferences-provider";
import { YelhaaMarkLoader } from "@/components/brand/yelhaa-node-mark";
import {
  PENDING_FILE_IDS_KEY,
  PENDING_IDEA_KEY,
  PENDING_PROJECT_TYPE_KEY,
  ROUTES,
} from "@/lib/config";
import { generationDestination } from "@/lib/generate/contract";
import { logGenerate } from "@/lib/generate/observe";
import { requestGeneration } from "@/lib/generate/request";

/**
 * Écran de génération — design prompt §3.3.
 *
 * **La barre ne ment jamais.** Elle est entièrement contrôlée par l'état réel,
 * avance au seuil de l'étape atteinte et s'y arrête. Pas de rampe, pas de mode
 * balayage automatique, jamais 100 % avant que la réponse ne soit là.
 *
 * **Deux paliers, pas quatre** (§5.8). `/api/generate` n'offre que deux
 * transitions réellement observables depuis le navigateur : requête partie,
 * réponse arrivée. Un palier intermédiaire supplémentaire ne serait jamais
 * atteint — une barre qui affiche un état qu'elle n'atteint pas est exactement
 * le mensonge que cette section interdit. Les deux appels IA ne rapportent
 * aucune progression interne sans streaming, et on n'en invente pas.
 */
const STEP_VALUES = [0, 40, 100] as const;

type StepIndex = 0 | 1 | 2;

type FailureState = { message: string; idea: string };

export function GenerateRunner() {
  const t = useT();
  const router = useRouter();
  const [step, setStep] = useState<StepIndex>(0);
  const [failure, setFailure] = useState<FailureState | null>(null);
  const started = useRef(false);

  const run = useCallback(async () => {
    let idea = "";
    let projectType: string | null = null;
    let fileIds: string[] = [];

    try {
      idea = window.sessionStorage.getItem(PENDING_IDEA_KEY)?.trim() ?? "";
      projectType = window.sessionStorage.getItem(PENDING_PROJECT_TYPE_KEY);

      /*
       * Les identifiants sont relus tels quels et envoyés sans contenu. Une
       * valeur bricolée dans `sessionStorage` ne donne rien : le serveur relit
       * le texte par le client de session, donc un identifiant qui n'appartient
       * pas à l'appelant ne remonte aucune ligne et la génération est refusée.
       */
      const storedIds = window.sessionStorage.getItem(PENDING_FILE_IDS_KEY);
      if (storedIds) {
        const parsed: unknown = JSON.parse(storedIds);
        if (Array.isArray(parsed)) {
          fileIds = parsed.filter(
            (entry): entry is string => typeof entry === "string",
          );
        }
      }
    } catch {
      idea = "";
    }

    if (!idea) {
      router.replace(ROUTES.build);
      return;
    }

    setStep(1);
    logGenerate("ui", "submit", {
      source: "generate-runner",
      ideaLength: idea.length,
    });

    const result = await requestGeneration({
      idea,
      projectType,
      fileIds,
    });

    if (!result.ok) {
      setFailure({
        message: result.message || t("generate.failedFallback"),
        idea,
      });
      return;
    }

    setStep(2);
    logGenerate("ui", "result inserted", {
      conversation: Boolean(result.conversationId),
      outputLength: result.output.length,
    });

    try {
      window.sessionStorage.removeItem(PENDING_IDEA_KEY);
      window.sessionStorage.removeItem(PENDING_PROJECT_TYPE_KEY);
      window.sessionStorage.removeItem(PENDING_FILE_IDS_KEY);
    } catch {
      // Sans storage il n'y a rien à nettoyer.
    }

    router.replace(generationDestination(result));
  }, [router, t]);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void run();
  }, [run]);

  if (failure) {
    return (
      <section
        aria-label={t("generate.failedAria")}
        className="glass-panel w-full max-w-xl border-l-2 border-l-err p-8"
      >
        <h1 className="type-h3 text-ink">{t("generate.failedTitle")}</h1>
        <p className="mt-3 text-ink-2">{failure.message}</p>

        <div className="glass-inset mt-6 p-4">
          <p className="type-label">{t("generate.yourIdea")}</p>
          <p className="mt-2 text-[14px] text-ink-2">{failure.idea}</p>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-5">
          <button
            type="button"
            onClick={() => {
              setFailure(null);
              setStep(0);
              started.current = false;
              void run();
            }}
            className="btn btn-primary h-[38px] px-5"
          >
            {t("generate.tryAgain")}
          </button>
          <a href={ROUTES.build} className="btn-ghost text-[14px]">
            {t("generate.editIdea")}
          </a>
        </div>
      </section>
    );
  }

  const labels = [
    t("generate.sending"),
    t("generate.building"),
    t("generate.done"),
  ];
  const current = {
    value: STEP_VALUES[step] ?? 0,
    label: labels[step] ?? labels[0],
  };

  return (
    <section aria-label={t("generate.aria")} className="flex flex-col items-center">
      <YelhaaMarkLoader size={48} />

      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={current.value}
        aria-valuetext={`${current.value}% — ${current.label}`}
        className="glass-inset mt-10 h-1.5 w-full max-w-md overflow-hidden rounded-full"
      >
        <div
          className="h-full rounded-full bg-volt transition-[width] duration-[280ms] ease-[cubic-bezier(0.2,0,0,1)]"
          style={{ width: `${current.value}%` }}
        />
      </div>

      {/* Coupe de 60ms sur le label, jamais un fondu. La barre porte l'information. */}
      <p
        key={current.label}
        aria-hidden="true"
        className="menu-cut mt-4 type-mono text-ink-2"
      >
        {current.label}
      </p>
    </section>
  );
}
