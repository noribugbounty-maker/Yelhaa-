"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { useT } from "@/components/i18n/preferences-provider";
import type { Conversation } from "@/lib/conversations/types";
import { TITLE_MAX_LENGTH } from "@/lib/conversations/types";

/**
 * Une ligne de conversation, son menu et son mode renommage.
 *
 * ## Un état par ligne, jamais un état global
 *
 * Le §32 l'exige, et pour une raison concrète : un unique `openMenuId` au
 * niveau de la liste fait que fermer un menu re-rend toutes les lignes, et
 * qu'une suppression pendant l'ouverture laisse le menu attaché à un
 * identifiant disparu. Ici chaque ligne possède son propre état — elle est la
 * seule à savoir si son menu est ouvert.
 *
 * ## Pourquoi le menu passe par un portail
 *
 * La liste défile dans un conteneur `overflow-y: auto`. Un menu en position
 * absolue à l'intérieur serait **coupé au bord du conteneur** — le §10 l'écarte
 * explicitement. `createPortal` le sort dans `document.body` et le positionne
 * à partir des coordonnées du bouton, ce qui le rend insensible à tout
 * `overflow` ancêtre. C'est la même technique que le menu mobile du site.
 */
export function ConversationRow({
  conversation,
  active,
  onRename,
  onDelete,
  onExport,
  onNavigate,
}: {
  conversation: Conversation;
  active: boolean;
  onRename: (id: string, title: string) => Promise<string | null>;
  onDelete: (conversation: Conversation) => void;
  onExport: (conversation: Conversation) => void;
  onNavigate?: () => void;
}) {
  const t = useT();
  const [menuOpen, setMenuOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [draft, setDraft] = useState(conversation.title);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [anchor, setAnchor] = useState<{ top: number; left: number } | null>(
    null,
  );

  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const errorId = useId();

  // Le titre peut changer sous nos pieds (renommage depuis un autre onglet,
  // revalidation) : le brouillon suit tant qu'on n'est pas en train d'éditer.
  useEffect(() => {
    if (!renaming) setDraft(conversation.title);
  }, [conversation.title, renaming]);

  /** Ouvre le menu en mémorisant la position du bouton. */
  const openMenu = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setAnchor({ top: rect.bottom + 6, left: rect.right });
    setMenuOpen(true);
  };

  const closeMenu = (restoreFocus = true) => {
    setMenuOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  };

  // Fermeture au clic extérieur, à Escape, et au défilement — un menu ancré à
  // des coordonnées figées suivrait sinon la page sans son bouton.
  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        closeMenu();
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (menuRef.current?.contains(target)) return;
      if (triggerRef.current?.contains(target)) return;
      closeMenu(false);
    };
    const onScroll = () => closeMenu(false);

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (renaming) inputRef.current?.select();
  }, [renaming]);

  const startRename = () => {
    setDraft(conversation.title);
    setError(null);
    setRenaming(true);
    setMenuOpen(false);
  };

  const cancelRename = () => {
    setRenaming(false);
    setError(null);
    setDraft(conversation.title);
    triggerRef.current?.focus();
  };

  const commitRename = async () => {
    if (pending) return;
    setPending(true);
    const message = await onRename(conversation.id, draft);
    setPending(false);
    if (message) {
      setError(message);
      inputRef.current?.focus();
      return;
    }
    setRenaming(false);
    setError(null);
  };

  if (renaming) {
    return (
      <li className="px-1">
        <div className="glass-inset rounded-[6px] p-2">
          <label htmlFor={inputId} className="sr-only">
            Conversation title
          </label>
          <input
            ref={inputRef}
            id={inputId}
            value={draft}
            maxLength={TITLE_MAX_LENGTH}
            disabled={pending}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                void commitRename();
              }
              if (event.key === "Escape") {
                event.preventDefault();
                event.stopPropagation();
                cancelRename();
              }
            }}
            className="w-full bg-transparent text-[14px] text-ink outline-none"
          />
          {error ? (
            <p
              id={errorId}
              aria-live="polite"
              className="mt-1 text-[12px] text-err"
            >
              {error}
            </p>
          ) : null}
          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={cancelRename}
              className="rounded-[4px] px-2 py-1 text-[12.5px] text-ink-2 transition-colors duration-[140ms] hover:text-ink"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => void commitRename()}
              disabled={pending}
              className="rounded-[4px] bg-volt px-2.5 py-1 text-[12.5px] font-medium text-void transition-opacity duration-[140ms] disabled:opacity-60"
            >
              {pending ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </li>
    );
  }

  return (
    <li className="group/row relative px-1">
      <div
        className={`flex items-center gap-1 rounded-[6px] transition-colors duration-[140ms] ${
          active
            ? "border border-volt bg-surface-2"
            : "border border-transparent hover:bg-surface-2"
        }`}
      >
        <Link
          href={`/chat/${conversation.id}`}
          onClick={onNavigate}
          aria-current={active ? "page" : undefined}
          className="min-w-0 flex-1 truncate px-2.5 py-2 text-[14px] text-ink-2 transition-colors duration-[140ms] hover:text-ink aria-[current=page]:text-ink"
        >
          {conversation.title}
        </Link>

        <button
          ref={triggerRef}
          type="button"
          onClick={() => (menuOpen ? closeMenu() : openMenu())}
          aria-label={t("chat.actions", { title: conversation.title })}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          /*
           * Le bouton reste dans le flux même invisible : le masquer par
           * `hidden` le retirerait de l'ordre de tabulation, et le clavier
           * n'atteindrait plus jamais le menu.
           */
          className={`mr-1 shrink-0 rounded-[4px] px-1.5 py-1 text-ink-3 transition-opacity duration-[140ms] hover:text-ink focus-visible:opacity-100 ${
            menuOpen || active
              ? "opacity-100"
              : "opacity-0 group-hover/row:opacity-100"
          }`}
        >
          <span aria-hidden="true" className="block text-[15px] leading-none">
            ···
          </span>
        </button>
      </div>

      {menuOpen && anchor
        ? createPortal(
            <div
              ref={menuRef}
              role="menu"
              aria-label={t("chat.actions", { title: conversation.title })}
              style={{
                top: anchor.top,
                // Ancré à droite du bouton : le menu pousse vers la gauche et
                // ne peut donc pas déborder du bord droit de la fenêtre.
                left: Math.max(8, anchor.left - 176),
              }}
              className="glass-panel fixed z-50 w-44 overflow-hidden p-1"
            >
              {[
                { label: t("chat.rename"), action: startRename },
                {
                  label: t("chat.export"),
                  action: () => {
                    setMenuOpen(false);
                    onExport(conversation);
                  },
                },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  role="menuitem"
                  onClick={item.action}
                  className="block w-full rounded-[4px] px-3 py-2 text-left text-[13.5px] text-ink-2 transition-colors duration-[140ms] hover:bg-surface-2 hover:text-ink"
                >
                  {item.label}
                </button>
              ))}
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  onDelete(conversation);
                }}
                className="block w-full rounded-[4px] px-3 py-2 text-left text-[13.5px] text-err-paper transition-colors duration-[140ms] hover:bg-surface-2"
              >
                {t("chat.delete")}
              </button>
            </div>,
            document.body,
          )
        : null}
    </li>
  );
}
