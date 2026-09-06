"use client";

import { useState } from "react";

import { useT } from "@/components/i18n/preferences-provider";

/** Ouverture du portail client Stripe — gestion et résiliation (§6). */
export function PortalButton({
  hasSubscription,
}: {
  hasSubscription: boolean;
}) {
  const t = useT();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!hasSubscription) {
    return (
      <p className="text-[14px] text-ink-2">{t("account.noSubscription")}</p>
    );
  }

  const open = async () => {
    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/stripe/portal", { method: "POST" });
      const payload = await response.json().catch(() => null);

      if (!response.ok || typeof payload?.url !== "string") {
        setError(
          typeof payload?.error === "string"
            ? payload.error
            : t("account.portalError"),
        );
        setPending(false);
        return;
      }
      window.location.href = payload.url;
    } catch {
      setError(t("account.portalError"));
      setPending(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={open}
        disabled={pending}
        className="inline-flex h-[38px] items-center rounded-[6px] border border-line px-5 text-[14px] text-ink transition-colors duration-[140ms] hover:border-line-strong disabled:opacity-60"
      >
        {pending ? t("account.opening") : t("account.manage")}
      </button>
      <p aria-live="polite" className="mt-2 text-[13px] text-err empty:mt-0">
        {error}
      </p>
    </>
  );
}

/**
 * Suppression du compte — décisions §6.
 *
 * Action irréversible : elle exige de recopier un mot, et l'écran le dit avant
 * de proposer le bouton.
 */
export function DeleteAccount() {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remove = async () => {
    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/account/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirm }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        setError(
          typeof payload?.error === "string"
            ? payload.error
            : t("account.deleteError"),
        );
        setPending(false);
        return;
      }

      window.location.href = "/";
    } catch {
      setError(t("account.deleteError"));
      setPending(false);
    }
  };

  return (
    <div className="border border-line border-l-2 border-l-err bg-surface p-5">
      <h2 className="type-h3 text-ink">{t("account.deleteTitle")}</h2>
      <p className="mt-2 max-w-[60ch] text-[14px] text-ink-2">
        {t("account.deleteBody")}
      </p>

      {open ? (
        <div className="mt-4">
          <label
            htmlFor="delete-confirm"
            className="block text-[13px] text-ink"
          >
            {t("account.deleteType", { word: "DELETE" }).split("DELETE").map((part, index, parts) =>
              index < parts.length - 1 ? (
                <span key={index}>
                  {part}
                  <span className="font-mono text-ink">DELETE</span>
                </span>
              ) : (
                <span key={index}>{part}</span>
              ),
            )}
          </label>
          <input
            id="delete-confirm"
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
            className="mt-2 h-[42px] w-full max-w-xs rounded-[6px] border border-line bg-surface-2 px-3 font-mono text-[15px] text-ink focus:border-volt focus:outline-none"
          />

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={remove}
              disabled={confirm !== "DELETE" || pending}
              className="inline-flex h-[38px] items-center rounded-[6px] border border-err px-5 text-[14px] text-err transition-opacity duration-[140ms] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {pending ? t("account.deleting") : t("account.deletePermanently")}
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setConfirm("");
              }}
              className="text-[14px] text-ink-2 transition-colors duration-[140ms] hover:text-ink"
            >
              {t("account.cancel")}
            </button>
          </div>

          <p
            aria-live="polite"
            className="mt-2 text-[13px] text-err empty:mt-0"
          >
            {error}
          </p>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-4 inline-flex h-[38px] items-center rounded-[6px] border border-line px-5 text-[14px] text-ink-2 transition-colors duration-[140ms] hover:border-line-strong hover:text-ink"
        >
          {t("account.deleteCta")}
        </button>
      )}
    </div>
  );
}
