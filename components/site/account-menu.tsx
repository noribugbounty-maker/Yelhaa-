"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { signOutAction } from "@/app/(auth)/actions";
import { usePreferences } from "@/components/i18n/preferences-provider";
import {
  avatarHueFromEmail,
  displayNameFromEmail,
  initialsFromEmail,
  maskEmail,
} from "@/lib/auth/identity";
import { nextPlanAbove, ROUTES } from "@/lib/config";
import { formatResetDate } from "@/lib/i18n";

/**
 * Avatar et menu de compte.
 *
 * ## Aucun quota calculé ici
 *
 * `remaining` et `limit` arrivent en props, mesurés côté serveur. Ce composant
 * n'additionne rien, ne décrémente rien et n'autorise rien : il affiche. Le
 * §8 l'exige, et c'est aussi ce qui évite qu'un compteur d'interface diverge de
 * la base.
 *
 * `quota` vaut `null` quand l'état n'a pas pu être établi. Le menu affiche
 * alors « Usage unavailable » — jamais `0`, jamais `undefined`, jamais `NaN`.
 *
 * ## Aucune photo inventée
 *
 * L'avatar est une pastille d'initiales dont la teinte est dérivée de l'e-mail,
 * donc stable. Le projet n'a pas de champ de photo de profil : en afficher une
 * supposerait d'aller la chercher chez un tiers, ce que rien n'autorise ici.
 */
export function AccountMenu({
  email,
  quota,
  unmetered = false,
  layout = "nav",
}: {
  email: string;
  quota: {
    plan: string;
    remaining: number | null;
    limit: number | null;
    resetsAt: string;
  } | null;
  /** Compte non compté : aucune réservation de quota côté serveur. */
  unmetered?: boolean;
  /** `row` : pied de la barre de chat, nom et e-mail toujours visibles. */
  layout?: "nav" | "row";
}) {
  const { t, locale } = usePreferences();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [anchor, setAnchor] = useState<{
    top?: number;
    bottom?: number;
    right: number;
  } | null>(null);
  const menuId = useId();

  const name = displayNameFromEmail(email);
  const initials = initialsFromEmail(email);
  const hue = avatarHueFromEmail(email);

  const openMenu = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setAnchor(
      layout === "row"
        ? {
            bottom: window.innerHeight - rect.top + 8,
            right: window.innerWidth - rect.right,
          }
        : { top: rect.bottom + 8, right: window.innerWidth - rect.right },
    );
    setOpen(true);
  };

  const close = (restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  };

  /*
   * La barre est `sticky` et son contenu est contraint : un menu en position
   * absolue à l'intérieur serait rogné. Il part donc dans `document.body` par
   * portail, ancré aux coordonnées du bouton — la même technique que le menu
   * mobile et que le menu de conversation.
   */
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (menuRef.current?.contains(target)) return;
      if (triggerRef.current?.contains(target)) return;
      close(false);
    };
    const reposition = () => close(false);

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, [open]);

  // Un compte non compté n'est jamais épuisé : il n'a pas de compteur.
  const exhausted = !unmetered && quota?.remaining === 0;

  /*
   * L'invitation à changer de plan n'apparaît que si un plan supérieur existe
   * réellement. Sur `agency`, `nextPlanAbove` rend `null` et le menu se tait :
   * envoyer le client le mieux servi vers une page de tarifs qui n'a rien de
   * plus à lui proposer est une impasse, pas une vente.
   */
  const upgrade = quota ? nextPlanAbove(quota.plan) : null;
  const resetDate = quota ? formatResetDate(quota.resetsAt, locale) : "";

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => (open ? close() : openMenu())}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={t("nav.accountMenu", { name })}
        className={
          layout === "row"
            ? "flex w-full items-center gap-2.5 rounded-[6px] px-1 py-1.5 text-left transition-colors duration-[140ms] hover:bg-surface-2"
            : "flex items-center gap-2 rounded-full py-0.5 pl-0.5 pr-1 transition-colors duration-[140ms] hover:bg-surface-2"
        }
      >
        <span
          aria-hidden="true"
          style={{
            // Teinte dérivée de l'e-mail : stable d'une session à l'autre.
            // Saturation et clarté sont figées pour que toutes les pastilles
            // aient le même poids visuel, quel que soit le compte.
            backgroundColor: `hsl(${hue} 45% 22%)`,
            color: `hsl(${hue} 70% 78%)`,
          }}
          className="flex size-[30px] shrink-0 items-center justify-center rounded-full border border-line text-[12px] font-semibold"
        >
          {initials}
        </span>
        {layout === "row" ? (
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13.5px] font-medium text-ink">
              {name}
            </span>
            <span className="block truncate text-[12px] text-ink-3">
              {maskEmail(email)}
            </span>
          </span>
        ) : (
          <span className="hidden max-w-[12ch] truncate text-[13px] text-ink-2 lg:block">
            {name}
          </span>
        )}
      </button>

      {open && anchor
        ? createPortal(
            <div
              ref={menuRef}
              id={menuId}
              role="menu"
              aria-label={t("nav.accountMenu", { name })}
              style={{
                top: anchor.top,
                bottom: anchor.bottom,
                right: Math.max(8, anchor.right),
              }}
              className="glass-panel fixed z-50 w-[248px] p-1.5"
            >
              <div className="border-b border-line px-3 pb-3 pt-2">
                <p className="truncate text-[14px] font-medium text-ink">
                  {name}
                </p>
                {/* E-mail masqué : reconnaissable par son propriétaire, pas
                    récupérable par quelqu'un qui regarde l'écran. */}
                <p className="mt-0.5 truncate text-[12px] text-ink-3">
                  {maskEmail(email)}
                </p>
              </div>

              <div className="border-b border-line px-3 py-3">
                <p className="type-label">{t("account.generations")}</p>
                {unmetered ? (
                  /*
                   * Ni barre, ni date de remise à zéro, ni invitation à changer
                   * de plan : aucun des trois n'a de sens sans compteur, et un
                   * seul suffirait à faire croire qu'une limite existe.
                   */
                  <p className="mt-1 font-mono text-[13.5px] text-ink">
                    {t("account.unlimited")}
                  </p>
                ) : quota === null || quota.remaining === null || quota.limit === null ? (
                  <p className="mt-1 text-[13px] text-ink-3">
                    {t("account.usageUnavailable")}
                  </p>
                ) : (
                  <>
                    <p
                      className={`mt-1 font-mono text-[13.5px] tabular-nums ${
                        exhausted ? "text-volt" : "text-ink"
                      }`}
                    >
                      {t("account.left", {
                        remaining: quota.remaining,
                        limit: quota.limit,
                      })}
                    </p>
                    {/* La barre est purement indicative : le nombre au-dessus
                        reste la valeur lisible, y compris sans couleurs. */}
                    <span
                      aria-hidden="true"
                      className="mt-2 block h-[3px] w-full overflow-hidden rounded-full bg-surface-2"
                    >
                      <span
                        className={`block h-full rounded-full ${
                          exhausted ? "bg-volt" : "bg-ink-3"
                        }`}
                        style={{
                          width: `${
                            quota.limit > 0
                              ? Math.round(
                                  (Math.min(quota.remaining, quota.limit) /
                                    quota.limit) *
                                    100,
                                )
                              : 0
                          }%`,
                        }}
                      />
                    </span>
                    {resetDate ? (
                      <p className="mt-2 text-[12px] text-ink-3">
                        {exhausted
                          ? t("account.resetsShort", { date: resetDate })
                          : t("account.renewsShort", { date: resetDate })}
                      </p>
                    ) : null}
                    {exhausted && upgrade ? (
                      <Link
                        href={ROUTES.pricing}
                        role="menuitem"
                        onClick={() => close(false)}
                        className="mt-2.5 flex h-[32px] items-center justify-center rounded-full bg-volt px-3 text-[12.5px] font-semibold text-void transition-opacity duration-[140ms] hover:opacity-90"
                      >
                        {t("account.upgrade", {
                          name: upgrade.name,
                          n: upgrade.generationsPerMonth,
                        })}
                      </Link>
                    ) : null}
                  </>
                )}
              </div>

              <Link
                href={ROUTES.account}
                role="menuitem"
                onClick={() => close(false)}
                className="block rounded-[4px] px-3 py-2 text-[13.5px] text-ink-2 transition-colors duration-[140ms] hover:bg-surface-2 hover:text-ink"
              >
                {t("account.account")}
              </Link>

              {/*
                Server Action : la session est révoquée côté serveur et le
                layout revalidé. Aucun rechargement de page forcé.
              */}
              <form action={signOutAction}>
                <button
                  type="submit"
                  role="menuitem"
                  disabled={signingOut}
                  onClick={() => setSigningOut(true)}
                  className="block w-full rounded-[4px] px-3 py-2 text-left text-[13.5px] text-ink-2 transition-colors duration-[140ms] hover:bg-surface-2 hover:text-ink disabled:opacity-60"
                >
                  {signingOut ? t("account.loggingOut") : t("account.logOut")}
                </button>
              </form>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
