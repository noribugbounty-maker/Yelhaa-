"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { useT } from "@/components/i18n/preferences-provider";
import { AccountMenu } from "@/components/site/account-menu";
import { ROUTES } from "@/lib/config";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

/**
 * Bloc de compte de la barre de navigation.
 *
 * ## D'où viennent les données
 *
 * - **La session** vient du client Supabase du navigateur, déjà présent dans le
 *   projet (`lib/supabase/client.ts`). Aucun second système d'authentification :
 *   `onAuthStateChange` est la source, et elle est déjà celle des cookies que le
 *   middleware rafraîchit.
 * - **Le quota** vient de `GET /api/me/quota`, lu côté serveur sur le client de
 *   session, donc filtré par RLS. Rien n'est calculé ici : ce composant affiche
 *   un nombre, il ne le dérive pas et ne l'autorise pas.
 *
 * ## Pourquoi client et non serveur
 *
 * Lire la session dans le layout aurait fait remonter `cookies()` dans l'arbre
 * et rendu dynamique toute la partie marketing — mesuré, `/` et `/pricing`
 * passaient de `○` à `ƒ`. Le coût de ce choix est un court état de chargement,
 * traité explicitement plutôt que masqué.
 *
 * ## Quand l'état est redemandé
 *
 * 1. au montage ;
 * 2. à tout changement d'identité signalé par `onAuthStateChange` — connexion,
 *    inscription, déconnexion, y compris depuis un autre onglet ;
 * 3. à chaque changement d'URL : générer conduit à `/prompt/[id]`, donc le
 *    quota décrémenté est relu sans qu'aucun sondage ne tourne ;
 * 4. au retour sur l'onglet.
 *
 * Aucun `setInterval`, aucun `window.location.reload()`.
 */

/**
 * `remaining` et `limit` valent `null` pour un compte non compté : le serveur
 * refuse d'envoyer un nombre là où il n'y en a pas, plutôt que d'inventer une
 * borne que l'écran afficherait comme vraie.
 */
type QuotaView = {
  plan: string;
  remaining: number | null;
  limit: number | null;
  resetsAt: string;
} | null;

type State =
  | { status: "loading" }
  | { status: "anonymous" }
  | {
      status: "authenticated";
      email: string;
      unmetered: boolean;
      quota: QuotaView;
    };

export function AccountNav({
  layout = "nav",
}: {
  layout?: "nav" | "row";
}) {
  const pathname = usePathname();
  const t = useT();
  const [state, setState] = useState<State>({ status: "loading" });

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/me/quota", { cache: "no-store" });
      if (!response.ok) throw new Error(String(response.status));
      const payload = (await response.json()) as {
        authenticated: boolean;
        email?: string;
        unmetered?: boolean;
        quota?: QuotaView;
      };

      setState(
        payload.authenticated
          ? {
              status: "authenticated",
              email: payload.email ?? "",
              unmetered: payload.unmetered === true,
              quota: payload.quota ?? null,
            }
          : { status: "anonymous" },
      );
    } catch {
      /*
       * Une sonde en échec ne doit pas effacer l'utilisateur de la barre : on
       * retombe sur « anonyme » uniquement si l'on ne savait rien. Sinon on
       * garde l'état connu et le quota passe à `null`, rendu « unavailable ».
       */
      setState((current) =>
        current.status === "authenticated"
          ? { ...current, quota: null }
          : { status: "anonymous" },
      );
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load, pathname]);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;

    let lastUserId: string | null | undefined;
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      const userId = session?.user.id ?? null;
      const first = lastUserId === undefined;
      const changed = lastUserId !== userId;
      lastUserId = userId;

      // `TOKEN_REFRESHED` arrive périodiquement sans changement d'identité :
      // relire à chaque fois relancerait une requête par heure pour rien.
      if (!first && (changed || event === "SIGNED_OUT")) void load();
    });

    const onVisible = () => {
      if (document.visibilityState === "visible") void load();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      data.subscription.unsubscribe();
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [load]);

  if (state.status === "loading") {
    // Squelette de la taille exacte de l'avatar : aucun décalage à l'arrivée
    // de la réponse, et jamais `undefined` à l'écran.
    return (
      <span
        aria-hidden="true"
        className="block size-[30px] shrink-0 animate-pulse rounded-full border border-line bg-surface-2"
      />
    );
  }

  if (state.status === "anonymous") {
    return (
      <>
        <Link
          href={ROUTES.login}
          className="hidden rounded-[4px] px-2 text-[14px] text-ink-2 transition-colors duration-[140ms] hover:text-ink md:block"
        >
          {t("nav.login")}
        </Link>
        <Link
          href={ROUTES.signup}
          className="hidden h-[36px] items-center rounded-[6px] bg-ink px-4 text-[14px] font-semibold text-void transition-colors duration-[140ms] hover:bg-white active:bg-volt-press md:inline-flex"
        >
          {t("nav.getStarted")}
        </Link>
      </>
    );
  }

  return (
    <AccountMenu
      email={state.email}
      quota={state.quota}
      unmetered={state.unmetered}
      layout={layout}
    />
  );
}
