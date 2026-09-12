import type { Metadata } from "next";

import { AuthScreen } from "@/components/auth/auth-screen";
import { readNextParam } from "@/lib/auth/next-path";
import { enabledOAuthProviders } from "@/lib/auth/providers";
import { ROUTES } from "@/lib/config";
import { absoluteUrl } from "@/lib/seo";
import { isSupabaseConfigured } from "@/lib/supabase/env";

/**
 * Écran hors index.
 *
 * Un formulaire de connexion n'a aucune valeur de recherche, et cette page ne
 * passe pas par `pageMetadata()` : sans directive explicite elle héritait de la
 * canonique du layout racine — `/` — et se déclarait donc être l'accueil. Les
 * deux corrections vont ensemble : `noindex` retire la page de l'index, la
 * canonique auto-référente empêche la consolidation vers l'accueil tant que
 * Google la crawle encore.
 */
export const metadata: Metadata = {
  title: "Log in",
  robots: { index: false, follow: false },
  alternates: { canonical: absoluteUrl(ROUTES.login) },
};

type SearchParams = Record<string, string | string[] | undefined>;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const error = typeof params["error"] === "string" ? params["error"] : null;

  return (
    <AuthScreen
      mode="login"
      next={readNextParam(params)}
      urlError={error}
      configured={isSupabaseConfigured()}
      oauthProviders={enabledOAuthProviders().map((provider) => provider.id)}
    />
  );
}
