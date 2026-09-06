import { NextResponse, type NextRequest } from "next/server";

import { sanitizeNextPath } from "@/lib/auth/next-path";
import { resolveSiteOrigin } from "@/lib/auth/site-origin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Retour OAuth et confirmation d'e-mail — build prompt §5.
 *
 * Le `next` reçu ici a transité par un tiers : il est revalidé avant toute
 * redirection. C'est le point exact où une redirection ouverte se glisserait.
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const configured = await resolveSiteOrigin();
  const origin = configured || requestUrl.origin;
  const next = sanitizeNextPath(requestUrl.searchParams.get("next"));

  const fail = (reason: "oauth" | "session" | "unavailable") =>
    NextResponse.redirect(
      `${origin}/login?error=${reason}&next=${encodeURIComponent(next)}`,
    );

  // Le fournisseur peut refuser avant même de nous renvoyer un code.
  if (requestUrl.searchParams.get("error")) {
    console.error(
      "[auth] retour OAuth en erreur",
      requestUrl.searchParams.get("error"),
    );
    return fail("oauth");
  }

  const code = requestUrl.searchParams.get("code");
  if (!code) return fail("oauth");

  const supabase = await createSupabaseServerClient();
  if (!supabase) return fail("unavailable");

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    console.error(
      "[auth] échange de code impossible",
      error.code ?? error.name,
    );
    return fail("session");
  }

  return NextResponse.redirect(`${origin}${next}`);
}
