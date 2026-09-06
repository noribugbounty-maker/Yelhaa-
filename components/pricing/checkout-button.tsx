"use client";

import { useState } from "react";

import { useT } from "@/components/i18n/preferences-provider";
import { MarkChevron } from "@/components/brand/marks";
import { YelhaaMarkLoader } from "@/components/brand/yelhaa-node-mark";
import { Button } from "@/components/ui/button";

/**
 * Bouton d'achat — appelle réellement `/api/stripe/checkout` (build prompt §8).
 *
 * Aucun langage de pression, aucun compte à rebours (design §3.6).
 */
export function CheckoutButton({
  plan,
  label,
}: {
  plan: "pro" | "agency";
  label: string;
}) {
  const t = useT();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const start = async () => {
    // Garde de réentrance : `aria-disabled` ne bloque pas le clic, et deux
    // appels concurrents créeraient deux sessions Stripe pour un seul achat.
    if (pending) return;

    setPending(true);
    setError(null);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const payload = await response.json().catch(() => null);

      if (response.status === 401) {
        window.location.href = `/login?next=${encodeURIComponent("/pricing")}`;
        return;
      }

      if (!response.ok || typeof payload?.url !== "string") {
        setError(
          typeof payload?.error === "string"
            ? payload.error
            : t("pricing.checkoutError"),
        );
        setPending(false);
        return;
      }

      window.location.href = payload.url;
    } catch {
      setError(t("pricing.checkoutError"));
      setPending(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        onClick={start}
        aria-disabled={pending}
        size="lg"
        className="w-full"
      >
        {pending ? t("account.opening") : label}
        {/* Chevron manuel, jamais une icône de bibliothèque (§1.5) ; en attente, le picto qui se dessine (§4). */}
        {pending ? (
          <YelhaaMarkLoader size={16} />
        ) : (
          <MarkChevron tone="inherit" className="size-3.5" />
        )}
      </Button>
      <p aria-live="polite" className="mt-2 text-[13px] text-err empty:mt-0">
        {error}
      </p>
    </>
  );
}
