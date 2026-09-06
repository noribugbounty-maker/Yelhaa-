"use client";

import { useEffect, useState } from "react";

import { useT } from "@/components/i18n/preferences-provider";
import { PENDING_IDEA_KEY } from "@/lib/config";

/**
 * Pending-idea banner — README §3.3.
 *
 * Visual proof that the idea typed before authentication was not lost. Read
 * from `sessionStorage`, never from the URL. Renders nothing when there is no
 * pending idea (direct arrival on `/login`).
 */
export function IdeaBanner() {
  const t = useT();
  const [idea, setIdea] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = window.sessionStorage.getItem(PENDING_IDEA_KEY);
      if (stored && stored.trim()) setIdea(stored.trim());
    } catch {
      // sessionStorage unavailable: no banner, no error.
    }
  }, []);

  if (!idea) return null;

  return (
    <div className="mb-8 rounded-[6px] border border-line border-l-2 border-l-ink bg-surface p-4">
      <p className="type-label">{t("auth.ideaSaved")}</p>
      <p className="mt-2 truncate font-mono text-[13px] text-ink-2" title={idea}>
        {idea}
      </p>
    </div>
  );
}
