"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useT } from "@/components/i18n/preferences-provider";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/glass-dialog";
import { YelhaaMarkLoader } from "@/components/brand/yelhaa-node-mark";
import { Button } from "@/components/ui/button";
import { DOMAINS } from "@/lib/templates/parse";
import type { PaletteEntry } from "@/lib/templates/palette";

export type CatalogueTemplate = {
  id: string;
  slug: string;
  domain: string;
  art_direction: string;
  title: string;
  summary: string;
  tags: string[];
  palette: PaletteEntry[];
};

/** Nombre de pills de filtre au maximum. Au-delà, la barre devient une liste. */
const MAX_FILTERS = 8;

/**
 * Sélecteur de template — renouveau §5.5.
 *
 * Le catalogue est **paginé**, jamais rendu en entier d'un coup : la route
 * `/api/templates` sert 24 entrées par page et le bouton « Load more » va
 * chercher la suivante.
 *
 * Les pills de filtre sont **dérivées des tags réellement chargés**, pas d'une
 * liste écrite dans le code. Les quatre noms de domaine en sont retirés : le §6
 * interdit d'énumérer les domaines dans l'UI, et une barre de filtres est un
 * endroit où cette énumération passerait inaperçue.
 *
 * Aucun chiffre de catalogue n'est affiché nulle part — ni total, ni compteur
 * de résultats. Le catalogue grandit ; toute valeur écrite deviendrait fausse.
 *
 * L'état sélectionné est porté par un `1px --volt` **et** par un libellé, jamais
 * par la couleur seule (§10, la couleur n'est jamais seule porteuse).
 */
export function TemplateSelector({
  open,
  onOpenChange,
  currentTemplateId,
  onPick,
  pending,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentTemplateId: string | null;
  onPick: (template: CatalogueTemplate) => void;
  pending: boolean;
}) {
  const t = useT();
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<string | null>(null);
  const [items, setItems] = useState<CatalogueTemplate[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  /**
   * Vocabulaire de filtres, mémorisé depuis les chargements **non filtrés**.
   *
   * Il était recalculé depuis `items`, c'est-à-dire depuis le résultat déjà
   * filtré : cliquer une pill faisait disparaître toutes les autres, et il
   * fallait deviner qu'un second clic sur la pill active permettait d'en
   * sortir. Le vocabulaire est désormais figé sur la vue complète, donc l'état
   * « un filtre actif parmi N » reste lisible.
   */
  const [vocabulary, setVocabulary] = useState<string[]>([]);

  // Identifie la requête en cours : une réponse lente ne doit jamais écraser
  // le résultat d'une frappe plus récente.
  const requestId = useRef(0);

  const load = useCallback(
    async (nextPage: number, replace: boolean) => {
      const ticket = ++requestId.current;
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({ page: String(nextPage) });
      if (query.trim()) params.set("q", query.trim());
      if (tag) params.set("tag", tag);

      try {
        const response = await fetch(`/api/templates?${params.toString()}`);
        const payload = await response.json().catch(() => null);
        if (ticket !== requestId.current) return;

        if (!response.ok || !Array.isArray(payload?.items)) {
          setError(t("prompt.libraryFailed"));
          setLoading(false);
          return;
        }

        setItems((current) =>
          replace
            ? payload.items
            : [...current, ...(payload.items as CatalogueTemplate[])],
        );
        setHasMore(Boolean(payload.has_more));
        setPage(nextPage);

        // Seule une vue sans tag décrit le catalogue entier : c'est la seule
        // qui a le droit d'élargir le vocabulaire.
        if (!tag) {
          const seen = (payload.items as CatalogueTemplate[]).flatMap(
            (item) => item.tags,
          );
          setVocabulary((current) => {
            const merged = new Set(replace ? [] : current);
            for (const entry of seen) merged.add(entry);
            return Array.from(merged);
          });
        }
      } catch {
        if (ticket !== requestId.current) return;
        setError(t("prompt.libraryFailed"));
      } finally {
        if (ticket === requestId.current) setLoading(false);
      }
    },
    [query, tag, t],
  );

  // Recherche débouncée. Le nettoyage annule le timer : fermer la modale en
  // pleine frappe ne déclenche pas une requête orpheline.
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => void load(0, true), 220);
    return () => clearTimeout(timer);
  }, [open, load]);

  // Le tag actif reste toujours visible, même s'il sort du haut de la liste :
  // sans lui, l'utilisateur ne verrait plus le filtre qu'il vient d'appliquer.
  const candidates = vocabulary.filter(
    (entry) => !(DOMAINS as readonly string[]).includes(entry),
  );
  const shown = candidates.slice(0, MAX_FILTERS);
  const filters =
    tag && !shown.includes(tag)
      ? [tag, ...shown.slice(0, MAX_FILTERS - 1)]
      : shown;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0">
        <div className="flex max-h-[80vh] flex-col">
          <div className="border-b border-line p-5">
            <DialogTitle className="type-h3 text-ink">
              {t("prompt.browse")}
            </DialogTitle>
            <p className="mt-1.5 text-[14px] text-ink-2">
              {t("prompt.browseBody")}
            </p>

            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("prompt.searchLibrary")}
              aria-label={t("prompt.searchLibraryAria")}
              className="glass-inset mt-4 h-[42px] w-full px-3 text-[15px] text-ink caret-volt outline-none placeholder:text-ink-3"
            />

            {filters.length > 0 ? (
              <div
                role="group"
                aria-label={t("prompt.filters")}
                className="mt-3 flex flex-wrap gap-2"
              >
                <button
                  type="button"
                  aria-pressed={tag === null}
                  onClick={() => setTag(null)}
                  className={`h-[28px] rounded-full px-3 text-[12.5px] transition-colors duration-[140ms] ${
                    tag === null
                      ? "bg-volt font-medium text-void"
                      : "glass-inset glass-hot rounded-full text-ink-2 hover:text-ink"
                  }`}
                >
                  {t("prompt.all")}
                </button>

                {filters.map((entry) => {
                  const active = tag === entry;
                  return (
                    <button
                      key={entry}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setTag(active ? null : entry)}
                      className={`h-[28px] rounded-full px-3 text-[12.5px] transition-colors duration-[140ms] ${
                        active
                          ? "bg-volt font-medium text-void"
                          : "glass-inset glass-hot rounded-full text-ink-2 hover:text-ink"
                      }`}
                    >
                      {entry}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-5">
            {error ? (
              <p
                role="status"
                className="border-l-2 border-l-err py-2 pl-3 text-[14px] text-err"
              >
                {error}
              </p>
            ) : null}

            <ul className="grid gap-3 sm:grid-cols-2">
              {items.map((item) => {
                const selected = item.id === currentTemplateId;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => onPick(item)}
                      className={`glass-panel flex h-full w-full flex-col p-4 text-left disabled:cursor-not-allowed ${
                        selected ? "border-volt" : "glass-hot"
                      }`}
                    >
                      <span className="flex items-start justify-between gap-3">
                        <span className="font-display text-[16px] font-semibold text-ink">
                          {item.art_direction}
                        </span>
                        {/* Libellé explicite : la bordure --volt ne porte jamais
                            l'information toute seule. */}
                        {selected ? (
                          <span className="type-label text-volt">
                            {t("prompt.selected")}
                          </span>
                        ) : null}
                      </span>

                      <span className="mt-1.5 text-[13.5px] text-ink-2">
                        {item.summary}
                      </span>

                      {item.palette.length > 0 ? (
                        <span aria-hidden="true" className="mt-3 flex gap-1.5">
                          {item.palette.map((entry) => (
                            <span
                              key={entry.name}
                              className="size-3.5 rounded-full border border-line"
                              style={{ backgroundColor: entry.hex }}
                            />
                          ))}
                        </span>
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>

            {loading ? (
              <div className="mt-4 flex items-center gap-3">
                <YelhaaMarkLoader size={20} />
                <p aria-live="polite" className="text-[14px] text-ink-3">
                  {t("prompt.loading")}
                </p>
              </div>
            ) : null}

            {hasMore && !loading ? (
              <div className="mt-5 flex justify-center">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => void load(page + 1, false)}
                >
                  {t("prompt.loadMore")}
                </Button>
              </div>
            ) : null}

            {!loading && items.length === 0 && !error ? (
              <p className="text-[14px] text-ink-2">
                {t("prompt.noMatch")}
              </p>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
