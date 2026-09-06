import type { Metadata } from "next";

import { AuthScreen } from "@/components/auth/auth-screen";
import { readNextParam } from "@/lib/auth/next-path";
import { enabledOAuthProviders } from "@/lib/auth/providers";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = { title: "Log in" };

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
