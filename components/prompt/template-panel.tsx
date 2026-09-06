"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useT } from "@/components/i18n/preferences-provider";
import {
  TemplateSelector,
  type CatalogueTemplate,
} from "@/components/prompt/template-selector";
import type { PaletteEntry } from "@/lib/templates/palette";

export type SelectedTemplate = {
  id: string;
  art_direction: string;
  summary: string;
  palette: PaletteEntry[];
};

/**
 * Panneau de la template retenue — renouveau §5.5.
 *
 * L'UX décidée est intacte : l'IA analyse l'idée, la restructure, sélectionne
 * une template, **et l'utilisateur peut changer ce choix**. Ce panneau est la
 * forme de ce moment.
 *
 * Changer de template rejoue l'injection sur la même idée, sans
 * reclassification et **sans consommer de quota** — c'est le même travail de
 * génération, pas un nouveau. La route `/api/generate/[id]/template` en porte
 * la garantie côté serveur ; l'interface le dit en toutes lettres pour que
 * l'utilisateur n'hésite pas à s'en servir.
 *
 * Aucun chiffre, aucune énumération de domaines dans les textes (§6).
 */
export function TemplatePanel({
  generationId,
  template,
}: {
  generationId: string;
  template: SelectedTemplate;
}) {
  const t = useT();
  const router = useRouter();
  const [current, setCurrent] = useState(template);
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pick = async (picked: CatalogueTemplate) => {
    if (pending || picked.id === current.id) {
      setOpen(false);
      return;
    }

    setPending(true);
    setError(null);

    try {
      const response = await fetch(`/api/generate/${generationId}/template`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template_id: picked.id }),
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        setError(
          typeof payload?.error === "string"
            ? payload.error
            : t("prompt.changeFailed"),
        );
        setPending(false);
        return;
      }

      /*
       * La route renvoie la template qu'elle a **réellement appliquée**, avec
       * une palette extraite du corps stocké. On la préfère à la copie du
       * catalogue, dont la palette est tronquée à cinq entrées par la route de
       * listing : les afficher aurait montré un style différent de celui qui a
       * servi à construire le prompt. La copie client ne sert que de repli si
       * la réponse est incomplète.
       */
      const echoed = payload?.template as SelectedTemplate | undefined;

      setCurrent({
        id: echoed?.id ?? picked.id,
        art_direction: echoed?.art_direction ?? picked.art_direction,
        summary: echoed?.summary ?? picked.summary,
        palette: echoed?.palette ?? picked.palette,
      });
      setOpen(false);
      setPending(false);
      // Le prompt lui-même est rendu côté serveur : on recharge la donnée,
      // pas la page — l'écran ne clignote pas et le scroll est conservé.
      router.refresh();
    } catch {
      setError(t("prompt.changeFailed"));
      setPending(false);
    }
  };

  return (
    <section aria-label={t("prompt.artAria")} className="glass-panel p-5">
      <h2 className="type-label">{t("prompt.artDirection")}</h2>

      <p className="mt-3 type-h3 text-ink">{current.art_direction}</p>
      <p className="mt-2 text-[14px] text-ink-2">{current.summary}</p>

      {current.palette.length > 0 ? (
        <ul className="mt-4 flex flex-wrap gap-2">
          {current.palette.map((entry) => (
            <li
              key={entry.name}
              className="flex items-center gap-2 rounded-full border border-line px-2.5 py-1"
            >
              <span
                aria-hidden="true"
                className="size-3 rounded-full border border-line"
                style={{ backgroundColor: entry.hex }}
              />
              <span className="type-mono text-ink-3">{entry.hex}</span>
            </li>
          ))}
        </ul>
      ) : null}

      <p className="mt-5 border-t border-line pt-4 text-[13px] text-ink-3">
        {t("prompt.picked")}
      </p>

      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-disabled={pending}
        className="mt-2 text-[14px] text-ink-2 transition-colors duration-[140ms] hover:text-ink"
      >
        {pending ? t("prompt.rebuilding") : t("prompt.chooseTemplate")}
      </button>

      <p aria-live="polite" className="mt-2 text-[13px] text-err empty:mt-0">
        {error}
      </p>

      <TemplateSelector
        open={open}
        onOpenChange={setOpen}
        currentTemplateId={current.id}
        onPick={pick}
        pending={pending}
      />
    </section>
  );
}
