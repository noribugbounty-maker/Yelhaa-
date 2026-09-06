"use client";

import { useCallback, useId, useRef, useState } from "react";

import { useT } from "@/components/i18n/preferences-provider";

import {
  ALLOWED_EXTENSIONS,
  MAX_FILE_BYTES,
  MAX_FILES,
  MAX_TOTAL_BYTES,
  type FileRejection,
  validateBatch,
  validateCandidate,
} from "@/lib/files/ingest";

/**
 * Pièces jointes du composer de la Home.
 *
 * ## L'envoi a lieu à la sélection, pas à la génération
 *
 * Le fichier part vers `/api/files` dès qu'il est choisi. Trois raisons, toutes
 * mesurables : l'erreur de validation arrive pendant que l'utilisateur regarde
 * encore la liste plutôt qu'après un écran de chargement ; le texte est extrait
 * une seule fois, donc la génération ne relit rien ; et `/api/generate` ne
 * reçoit que des identifiants, jamais du contenu, ce qui est la condition pour
 * qu'aucun contexte non inspecté n'entre dans un appel payant.
 *
 * ## La validation d'ici ne protège rien
 *
 * Les mêmes bornes sont réappliquées côté serveur. Celles-ci existent pour
 * expliquer vite — dire « seuls .txt, .md, .csv, .json » avant de consommer un
 * aller-retour — et pour rien d'autre. Un utilisateur qui contournerait ce
 * fichier obtiendrait exactement le même refus, avec un tour de réseau en plus.
 *
 * ## Visiteur non connecté
 *
 * `/api/files` exige une session. Un visiteur anonyme reçoit donc un message
 * explicite plutôt qu'un échec muet. Son idée reste conservée par le composer,
 * comme avant ; les fichiers, eux, ne peuvent pas l'être, puisqu'il n'existe
 * aucun endroit où déposer les octets de quelqu'un qui n'est pas identifié.
 */

export type Attachment = {
  id: string;
  filename: string;
  mimeType: string;
  byteSize: number;
  truncated: boolean;
};

/*
 * Les deux viennent de la même table que la validation serveur. Une liste
 * recopiée finirait par annoncer un format refusé, ou par taire un format
 * accepté — et c'est l'annonce fausse qui coûte le plus cher : l'utilisateur
 * choisit un fichier, attend, puis se fait refuser.
 */
const ACCEPT = ALLOWED_EXTENSIONS.join(",");
const FORMATS = ALLOWED_EXTENSIONS.join(", ");

/** Taille lisible. Les unités binaires évitent d'annoncer 0 KB pour 900 octets. */
function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function Attachments({
  files,
  onChange,
  disabled = false,
  variant = "default",
}: {
  files: Attachment[];
  onChange: (files: Attachment[]) => void;
  disabled?: boolean;
  /** `compact` : icône seule, pour la barre de chat. */
  variant?: "default" | "compact";
}) {
  const t = useT();
  const rejectMessage = useCallback(
    (code: FileRejection) =>
      t(`files.${code}`, {
        n:
          code === "too-many"
            ? MAX_FILES
            : code === "too-large"
              ? Math.round(MAX_FILE_BYTES / 1024)
              : Math.round(MAX_TOTAL_BYTES / 1024),
        formats: FORMATS,
      }),
    [t],
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const errorId = useId();
  const listId = useId();
  const formatsId = useId();

  const upload = useCallback(
    async (chosen: File[]) => {
      setError(null);
      if (chosen.length === 0) return;

      const candidates = [...files, ...chosen].map((entry) =>
        entry instanceof File
          ? {
              filename: entry.name,
              mimeType: entry.type,
              byteSize: entry.size,
            }
          : {
              filename: entry.filename,
              mimeType: entry.mimeType,
              byteSize: entry.byteSize,
            },
      );

      const batch = validateBatch(candidates);
      if (batch) {
        setError(rejectMessage(batch));
        return;
      }
      for (const file of chosen) {
        const rejection = validateCandidate({
          filename: file.name,
          mimeType: file.type,
          byteSize: file.size,
        });
        if (rejection) {
          setError(`${file.name}: ${rejectMessage(rejection)}`);
          return;
        }
      }

      setBusy(true);
      try {
        const body = new FormData();
        for (const file of chosen) body.append("files", file);

        const response = await fetch("/api/files", { method: "POST", body });
        const payload = (await response.json().catch(() => null)) as {
          files?: {
            id: string;
            filename: string;
            mime_type: string;
            byte_size: number;
            truncated: boolean;
          }[];
          error?: string;
        } | null;

        if (response.status === 401) {
          setError(t("files.signIn"));
          return;
        }
        if (!response.ok || !payload?.files) {
          setError(payload?.error ?? t("files.uploadFailed"));
          return;
        }

        onChange([
          ...files,
          ...payload.files.map((row) => ({
            id: row.id,
            filename: row.filename,
            mimeType: row.mime_type,
            byteSize: row.byte_size,
            truncated: row.truncated,
          })),
        ]);
      } catch {
        setError(t("files.connectionDropped"));
      } finally {
        setBusy(false);
        // Remet l'input à zéro : sans cela, choisir deux fois le même fichier
        // ne déclencherait pas d'événement.
        if (inputRef.current) inputRef.current.value = "";
      }
    },
    [files, onChange, rejectMessage, t],
  );

  const remove = useCallback(
    async (id: string) => {
      // L'écran se met à jour tout de suite ; la base suit. Un échec de
      // suppression ne fait rien réapparaître : le fichier ne sera simplement
      // pas joint, ce que l'utilisateur vient de demander.
      onChange(files.filter((file) => file.id !== id));
      setError(null);
      try {
        await fetch(`/api/files?id=${encodeURIComponent(id)}`, {
          method: "DELETE",
        });
      } catch {
        // Sans réseau, la ligne restera orpheline et ne sera jamais rattachée.
      }
    },
    [files, onChange],
  );

  const full = files.length >= MAX_FILES;
  const compact = variant === "compact";

  return (
    <div
      className={
        compact ? "flex min-w-0 flex-wrap items-center gap-1.5" : "w-full"
      }
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ACCEPT}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(event) => void upload(Array.from(event.target.files ?? []))}
      />

      {files.length > 0 ? (
        <ul
          id={listId}
          aria-label={t("files.attached")}
          className={compact ? "contents" : "mb-3 flex flex-wrap gap-2"}
        >
          {files.map((file) => (
            <li
              key={file.id}
              className="glass-inset flex max-w-full items-center gap-2 rounded-full py-1 pl-3 pr-1 text-[12.5px]"
            >
              <span className="min-w-0 truncate text-ink-2" title={file.filename}>
                {file.filename}
              </span>
              <span className="shrink-0 font-mono text-[11px] text-ink-3">
                {formatSize(file.byteSize)}
                {file.truncated ? " · trimmed" : ""}
              </span>
              <button
                type="button"
                onClick={() => void remove(file.id)}
                aria-label={t("files.remove", { name: file.filename })}
                className="flex size-5 shrink-0 items-center justify-center rounded-full text-ink-3 transition-colors duration-[140ms] hover:bg-surface-2 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-volt"
              >
                <span aria-hidden="true">×</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={disabled || busy || full}
        title={compact ? FORMATS : undefined}
        aria-describedby={`${formatsId}${error ? ` ${errorId}` : ""}`}
        aria-label={
          full
            ? `Attachment limit reached, ${MAX_FILES} files`
            : compact
              ? `${t("files.attach")} (${FORMATS})`
              : t("files.attach")
        }
        className={
          compact
            ? "inline-flex size-8 items-center justify-center rounded-full text-ink-3 transition-colors duration-[140ms] hover:bg-surface-2 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-volt disabled:cursor-not-allowed disabled:opacity-50"
            : "glass-inset glass-hot inline-flex h-[34px] items-center gap-2 rounded-full px-4 text-[13.5px] text-ink-2 transition-colors duration-[140ms] hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-volt disabled:cursor-not-allowed disabled:opacity-60"
        }
      >
        {/* Trombone dessiné en SVG : aucune dépendance d'icônes ajoutée. */}
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="size-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        >
          <path d="M10.5 5.5 6 10a1.75 1.75 0 0 0 2.5 2.5l4.5-4.5a3.25 3.25 0 0 0-4.6-4.6L3.5 8.4a4.75 4.75 0 0 0 6.7 6.7" />
        </svg>
        {compact ? (
          <span className="sr-only">
            {busy
              ? t("files.uploading")
              : full
                ? t("files.filesLimit", { n: MAX_FILES })
                : t("files.attach")}
          </span>
        ) : busy ? (
          t("files.uploading")
        ) : full ? (
          t("files.filesLimit", { n: MAX_FILES })
        ) : (
          t("files.attach")
        )}
      </button>

      {/*
        Les formats sont écrits avec leur point, et lus depuis la table de
        validation. Aucun format non pris en charge n'est nommé : annoncer PNG
        ou PDF ici promettrait une lecture que le moteur ne sait pas faire.
      */}
      <p
        id={formatsId}
        className={compact ? "sr-only" : "mt-2 text-[12px] text-ink-3"}
      >
        {FORMATS}
      </p>

      {error ? (
        <p
          id={errorId}
          role="alert"
          className={
            compact
              ? "basis-full text-[12.5px] text-ink-2"
              : "mt-1.5 text-[12.5px] text-ink-2"
          }
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
