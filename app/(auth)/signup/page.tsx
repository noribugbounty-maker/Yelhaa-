import type { Metadata } from "next";

import { AuthScreen } from "@/components/auth/auth-screen";
import { readNextParam } from "@/lib/auth/next-path";
import { enabledOAuthProviders } from "@/lib/auth/providers";
import { ROUTES } from "@/lib/config";
import { absoluteUrl } from "@/lib/seo";
import { isSupabaseConfigured } from "@/lib/supabase/env";

/**
 * Écran hors index — même raisonnement que `login/page.tsx`.
 *
 * L'inscription se fait depuis un lien du produit, jamais depuis une requête
 * de recherche : la page n'a rien à gagner à être indexée, et sans directive
 * explicite elle héritait de la canonique du layout racine.
 */
export const metadata: Metadata = {
  title: "Create your account",
  robots: { index: false, follow: false },
  alternates: { canonical: absoluteUrl(ROUTES.signup) },
};

type SearchParams = Record<string, string | string[] | undefined>;

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const error = typeof params["error"] === "string" ? params["error"] : null;

  return (
    <AuthScreen
      mode="signup"
      next={readNextParam(params)}
      urlError={error}
      configured={isSupabaseConfigured()}
      oauthProviders={enabledOAuthProviders().map((provider) => provider.id)}
    />
  );
}
