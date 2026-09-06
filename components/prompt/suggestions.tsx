"use client";

import { useRouter } from "next/navigation";

import { usePreferences, useT } from "@/components/i18n/preferences-provider";
import { MarkBar } from "@/components/brand/marks";
import { PENDING_IDEA_KEY, ROUTES } from "@/lib/config";
import { labelForVariable } from "@/lib/templates/variable-labels";

/**
 * Bloc 3 de l'écran YOUR PROMPT — build prompt §4bis.
 *
 * « Chaque information manquante devient une ligne "ajoute X pour améliorer ce
 *   prompt", avec un bouton qui réinjecte l'idée enrichie dans le champ et
 *   relance. »
 *
 * Le bouton remet l'idée d'origine dans `sessionStorage` et ramène au champ,
 * curseur en fin de texte : c'est l'utilisateur qui enrichit, on ne complète
 * jamais son idée à sa place.
 */
export function Suggestions({
  missing,
  idea,
}: {
  missing: string[];
  idea: string;
}) {
  const t = useT();
  const { locale } = usePreferences();
  const router = useRouter();

  const entries = missing
    .map((name) => ({ name, label: labelForVariable(name, locale) }))
    .filter(
      (entry): entry is { name: string; label: string } => entry.label !== null,
    );

  if (entries.length === 0) return null;

  const refine = () => {
    try {
      window.sessionStorage.setItem(PENDING_IDEA_KEY, idea);
    } catch {
      // Sans storage, le champ repart vide : l'idée reste affichée ici.
    }
    router.push(ROUTES.build);
  };

  return (
    <section
      aria-label={t("prompt.suggestions")}
      className="border border-line bg-surface p-5"
    >
      <MarkBar draw className="h-2 w-10" />
      <h2 className="mt-4 type-h3 text-ink">{t("prompt.improve")}</h2>
      <p className="mt-2 text-[14px] text-ink-2">{t("prompt.improveBody")}</p>

      <ul className="mt-4 flex flex-col gap-2">
        {entries.map((entry) => (
          <li
            key={entry.name}
            className="flex items-start gap-2 text-[14px] text-ink-2"
          >
            <span
              aria-hidden="true"
              className="mt-2 size-1 shrink-0 rounded-full bg-ink-3"
            />
            {t("prompt.add", { label: entry.label })}
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={refine}
        className="mt-5 inline-flex h-[34px] items-center rounded-[6px] border border-line px-4 text-[13px] text-ink transition-colors duration-[140ms] hover:border-line-strong"
      >
        {t("prompt.complete")}
      </button>
    </section>
  );
}
