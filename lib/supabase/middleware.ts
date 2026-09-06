import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { readSupabaseServerEnv } from "@/lib/supabase/env";
import type { Database } from "@/lib/supabase/types";

export type SessionResult = {
  /** Réponse portant les cookies de session rafraîchis. À renvoyer telle quelle. */
  response: NextResponse;
  /** `null` si personne n'est connecté, ou si Supabase n'est pas configuré. */
  userId: string | null;
  configured: boolean;
};

/**
 * Rafraîchit la session Supabase à chaque requête (build prompt §5).
 *
 * Le jeton est validé par `getUser()`, jamais déduit d'un cookie : c'est la
 * seule vérification sur laquelle une protection de route peut s'appuyer.
 *
 * Les cookies renvoyés par Supabase doivent être posés à la fois sur la
 * requête (pour la suite du traitement) et sur la réponse (pour le
 * navigateur) — d'où la reconstruction de `response` dans `setAll`.
 */
export async function updateSession(
  request: NextRequest,
): Promise<SessionResult> {
  let response = NextResponse.next({ request });

  const env = readSupabaseServerEnv();
  if (!env) {
    return { response, userId: null, configured: false };
  }

  const supabase = createServerClient<Database>(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { response, userId: user?.id ?? null, configured: true };
}
