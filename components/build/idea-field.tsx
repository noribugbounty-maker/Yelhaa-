"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { useRouter } from "next/navigation";

import { useT } from "@/components/i18n/preferences-provider";
import { MarkChevron } from "@/components/brand/marks";
import { Attachments, type Attachment } from "@/components/build/attachments";
import {
  IDEA_MAX_LENGTH,
  IDEA_MIN_LENGTH,
  PENDING_FILE_IDS_KEY,
  PENDING_IDEA_KEY,
  PENDING_PROJECT_TYPE_KEY,
  PROJECT_TYPES,
  type ProjectTypeId,
} from "@/lib/config";
import { logGenerate } from "@/lib/generate/observe";

/** 17px × leading 1.6 = 27.2px par ligne. Mini 4 lignes, maxi 11 puis scroll. */
const LINE_HEIGHT = 27.2;
const MIN_HEIGHT = LINE_HEIGHT * 4;
const MAX_HEIGHT = LINE_HEIGHT * 11;
const FADE = 32;

/** Le compteur ne se montre qu'à l'approche du plafond. */
const COUNTER_VISIBLE_FROM = IDEA_MAX_LENGTH * 0.75;

type FadeStyle = CSSProperties & {
  "--fade-top"?: string;
  "--fade-bottom"?: string;
};

/**
 * Le champ YOUR IDEA — README §3.1, design prompt §3.2.
 *
 * « C'est l'objet le plus important de tout le site. »
 *
 * **Le champ ne se replie jamais** : il est ouvert et utilisable dès le
 * chargement. Un état replié en pilule cacherait le produit, et le README §3
 * impose que le champ soit l'action principale visible sans scroll.
 *
 * ## Ce que la refonte reprend au composant « Input Bar » de 21st.dev
 *
 * Le composant de référence (21st.dev Agent Elements, port autonome) apporte
 * trois mécaniques que ce champ n'avait pas, et qui font l'essentiel de la
 * différence de qualité perçue :
 *
 * 1. **Toute la surface est cliquable.** Un clic n'importe où dans le panneau
 *    donne le focus au textarea. Auparavant seule la zone de texte le prenait,
 *    et cliquer dans la marge ne faisait rien — un panneau qui a l'air d'un
 *    champ doit se comporter comme un champ.
 * 2. **La rangée d'options s'ouvre en `grid-template-rows: 0fr → 1fr`.** C'est
 *    la seule technique qui anime une hauteur inconnue sans la mesurer en JS ni
 *    la figer en dur.
 * 3. **Le bouton d'envoi est un disque à trois états** — inerte, prêt, en
 *    cours — au lieu d'un bouton qui change seulement de libellé.
 *
 * Les **pièces jointes** existent désormais : `Attachments` envoie le fichier
 * dès sa sélection, ce qui remonte l'erreur de validation pendant que la liste
 * est encore sous les yeux, et ne transmet à la génération que des
 * identifiants — le texte extrait vit en base, derrière la RLS.
 *
 * Ce qui **n'est pas** repris du composant, et pourquoi :
 *
 * - le **sélecteur de modèle** : il est bien prévu, mais dans `/workspace/[id]`
 *   (build prompt Phase 8). Le champ d'accueil n'a qu'un travail, capter
 *   l'idée ; y ajouter un choix de modèle placerait une décision technique
 *   avant même que l'idée soit écrite ;
 * - l'habillage `ring-1 shadow-sm` en Tailwind v3 : le verre `@websiteglass` du
 *   projet tient déjà ce rôle, et en v4 `ring` vaut 1px en `currentColor`, donc
 *   un portage littéral aurait dessiné un filet de la couleur du texte.
 *
 * Conservation de l'idée (build prompt §4bis) : écrite dans `sessionStorage`
 * **avant** toute navigation, relue au retour. La bascule « déjà connecté / à
 * connecter » est arbitrée par le middleware sur `/generate`.
 */
export function IdeaField() {
  const t = useT();
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [idea, setIdea] = useState("");
  const [projectType, setProjectType] = useState<ProjectTypeId | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [fade, setFade] = useState({ top: 0, bottom: 0 });
  const inFlight = useRef(false);

  useEffect(() => {
    try {
      const storedIdea = window.sessionStorage.getItem(PENDING_IDEA_KEY);
      if (storedIdea) setIdea(storedIdea);

      const storedType = window.sessionStorage.getItem(
        PENDING_PROJECT_TYPE_KEY,
      );
      if (storedType && PROJECT_TYPES.some((type) => type.id === storedType)) {
        setProjectType(storedType as ProjectTypeId);
      }
    } catch {
      // sessionStorage indisponible : le champ démarre vide, sans erreur.
    }
  }, []);

  /**
   * Fondus de défilement — ils n'apparaissent que quand il y a réellement du
   * texte hors champ, en haut comme en bas.
   */
  const syncFades = useCallback(() => {
    const element = textareaRef.current;
    if (!element) return;

    const overflowTop = element.scrollTop;
    const overflowBottom =
      element.scrollHeight - element.clientHeight - element.scrollTop;

    setFade({
      top: Math.min(1, overflowTop / FADE),
      bottom: Math.min(1, Math.max(0, overflowBottom) / FADE),
    });
  }, []);

  // Auto-grow. Dimensionnement, pas animation : aucune transition sur height.
  useLayoutEffect(() => {
    const element = textareaRef.current;
    if (!element) return;

    element.style.height = "auto";
    element.style.height = `${Math.min(Math.max(element.scrollHeight, MIN_HEIGHT), MAX_HEIGHT)}px`;
    syncFades();
  }, [idea, syncFades]);

  const trimmed = idea.trim();
  const canGenerate = trimmed.length >= IDEA_MIN_LENGTH && !submitting;

  const generate = useCallback(() => {
    if (inFlight.current || submitting) return;
    if (!trimmed) return;
    if (trimmed.length < IDEA_MIN_LENGTH) {
      setValidationError(t("build.ideaTooShort", { n: IDEA_MIN_LENGTH }));
      return;
    }

    setValidationError(null);
    logGenerate("ui", "submit", {
      ideaLength: trimmed.length,
      hasProjectType: Boolean(projectType),
      fileCount: attachments.length,
      source: "build",
    });

    try {
      window.sessionStorage.setItem(PENDING_IDEA_KEY, trimmed);
      if (projectType)
        window.sessionStorage.setItem(PENDING_PROJECT_TYPE_KEY, projectType);
      else window.sessionStorage.removeItem(PENDING_PROJECT_TYPE_KEY);

      // Des identifiants seulement. Le texte extrait reste en base, derrière
      // la RLS : un identifiant recopié à la main n'ouvre rien.
      if (attachments.length > 0) {
        window.sessionStorage.setItem(
          PENDING_FILE_IDS_KEY,
          JSON.stringify(attachments.map((file) => file.id)),
        );
      } else window.sessionStorage.removeItem(PENDING_FILE_IDS_KEY);
    } catch (error) {
      console.error("[idea] could not preserve the idea", error);
    }

    inFlight.current = true;
    setSubmitting(true);
    router.push("/generate");
  }, [attachments, projectType, router, submitting, t, trimmed]);

  /**
   * Clic sur le panneau → focus dans le texte, sauf sur un contrôle réel.
   * Le `closest` évite de voler le focus à une pilule ou au bouton d'envoi.
   */
  const focusFromPanel = useCallback((event: React.MouseEvent) => {
    if ((event.target as HTMLElement).closest("button, textarea")) return;
    textareaRef.current?.focus();
  }, []);

  const maskStyle: FadeStyle = {
    maskImage: `linear-gradient(to bottom, rgba(0,0,0,${1 - fade.top}) 0px, black ${FADE}px, black calc(100% - ${FADE}px), rgba(0,0,0,${1 - fade.bottom}) 100%)`,
    WebkitMaskImage: `linear-gradient(to bottom, rgba(0,0,0,${1 - fade.top}) 0px, black ${FADE}px, black calc(100% - ${FADE}px), rgba(0,0,0,${1 - fade.bottom}) 100%)`,
  };

  const counterVisible = idea.length >= COUNTER_VISIBLE_FROM;
  const nearLimit = idea.length >= IDEA_MAX_LENGTH * 0.95;

  return (
    <div className="mt-8">
      {/*
        La pièce de verre maîtresse du site (§5.3). `glass-writing` porte la
        règle de focus : bordure `--volt` et verre à 70 % en 120ms, la même
        durée pour les deux — le panneau se solidifie quand on écrit dedans.
      */}
      <div
        onClick={focusFromPanel}
        className="glass-panel glass-writing cursor-text transition-[background-color,border-color] duration-[120ms] ease-[var(--ease-cut)]"
      >
        <div className="p-6" style={maskStyle}>
          <textarea
            ref={textareaRef}
            id="yelhaa-idea"
            name="idea"
            value={idea}
            onChange={(event) => setIdea(event.target.value)}
            onScroll={syncFades}
            onKeyDown={(event) => {
              if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
                event.preventDefault();
                generate();
              }
            }}
            maxLength={IDEA_MAX_LENGTH}
            aria-label={t("build.placeholder")}
            aria-describedby="yelhaa-idea-shortcut"
            placeholder={t("build.placeholder")}
            spellCheck
            className="block w-full resize-none bg-transparent text-[17px] leading-[1.6] text-ink caret-volt outline-none placeholder:text-ink-3"
            style={{
              minHeight: MIN_HEIGHT,
              maxHeight: MAX_HEIGHT,
              overflowY: "auto",
            }}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line p-4 md:px-6">
          {/*
            Les pièces jointes occupent leur propre ligne : posées à côté des
            pilules, deux ou trois noms de fichiers repoussaient le bouton
            Generate hors de vue à 375px.
          */}
          <div className="order-first w-full">
            <Attachments
              files={attachments}
              onChange={setAttachments}
              disabled={submitting}
            />
          </div>

          <div
            role="radiogroup"
            aria-label={t("build.projectType")}
            className="flex flex-wrap gap-2"
          >
            {PROJECT_TYPES.map((type) => {
              const active = projectType === type.id;
              return (
                <button
                  key={type.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setProjectType(active ? null : type.id)}
                  className={`h-[34px] rounded-full px-4 text-[14px] transition-colors duration-[140ms] ${
                    active
                      ? "bg-volt font-medium text-void"
                      : "glass-inset glass-hot rounded-full text-ink-2 hover:text-ink"
                  }`}
                >
                  {t(`build.${type.id}`)}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            {/*
              Compteur discret : il n'apparaît qu'au trois quarts du plafond.
              Afficher « 0 / 2000 » sur un champ vide annonce une limite avant
              d'avoir annoncé le produit.
            */}
            <span
              aria-hidden={!counterVisible}
              className={`type-mono tabular-nums transition-opacity duration-[240ms] ${
                counterVisible ? "opacity-100" : "opacity-0"
              } ${nearLimit ? "text-volt" : "text-ink-3"}`}
            >
              {idea.length} / {IDEA_MAX_LENGTH}
            </span>

            {/*
              Disque à trois états, repris de la mécanique du composant 21st :
              inerte tant que rien n'est écrit, plein `--volt` dès qu'il y a du
              texte, carré d'arrêt pendant l'envoi. La forme dit l'état, pas
              seulement la couleur.
            */}
            <button
              type="button"
              onClick={generate}
              disabled={!canGenerate}
              aria-disabled={!canGenerate}
              aria-label={submitting ? t("build.generating") : t("build.generate")}
              className={`group inline-flex h-[42px] items-center gap-2 rounded-full pl-5 pr-4 text-[15px] font-semibold transition-colors duration-[140ms] disabled:cursor-not-allowed ${
                trimmed.length < IDEA_MIN_LENGTH
                  ? "glass-inset text-ink-3"
                  : // `--volt-deep` est réservé au texte sur fond clair (§1.6) :
                    // en fond il donnerait de l'olive sombre sous du `--void`.
                    // Le survol passe donc par l'opacité, pas par la teinte.
                    "bg-volt text-void hover:opacity-90"
              }`}
            >
              {submitting ? t("build.generating") : t("build.generate")}
              <span aria-hidden="true" className="relative block size-4">
                <MarkChevron
                  tone="inherit"
                  className={`absolute inset-0 transition-[opacity,transform] duration-[200ms] group-hover:translate-x-[3px] ${
                    submitting ? "scale-90 opacity-0" : "scale-100 opacity-100"
                  }`}
                />
                <span
                  className={`absolute inset-0 m-auto block size-2.5 rounded-[2px] bg-current transition-[opacity,transform] duration-[200ms] ${
                    submitting ? "scale-100 opacity-100" : "scale-90 opacity-0"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </div>

      {validationError ? (
        <p
          aria-live="polite"
          className="mt-2.5 border-l-2 border-l-err pl-2 text-[13px] text-err-paper"
        >
          {validationError}
        </p>
      ) : null}

      <p
        id="yelhaa-idea-shortcut"
        className="mt-2.5 text-right font-mono text-[12px] text-ink-3"
      >
        ⌘ / Ctrl + Enter
      </p>
    </div>
  );
}
