import "server-only";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

import { readSupabaseServerEnv } from "@/lib/supabase/env";
import type { Database } from "@/lib/supabase/types";

export type SupabaseServerClient = SupabaseClient<Database>;

/**
 * Client Supabase pour les Server Components, Server Actions et Route
 * Handlers. Renvoie `null` quand la configuration est absente — jamais
 * d'exception, jamais de page blanche (build prompt §1).
 */
export async function createSupabaseServerClient(): Promise<SupabaseServerClient | null> {
  /*
   * `cookies()` est appelé **avant** le contrôle de configuration, et l'ordre
   * n'est pas cosmétique.
   *
   * Next décide qu'une page est dynamique en observant l'usage d'une API
   * dynamique pendant le rendu. Quand la configuration manquait, cette fonction
   * sortait en `null` sans jamais toucher `cookies()` : la page n'exerçait donc
   * aucune API dynamique et Next la **prérendait en statique**, figeant
   * « service indisponible » dans le HTML livré.
   *
   * Effet observé en production : `/faq` et `/account` basculaient de `ƒ` à `○`
   * selon la seule présence des variables au moment du build. Renseigner les
   * variables ensuite ne réparait rien — la page servie était un fichier
   * statique, plus jamais réévalué.
   *
   * En appelant `cookies()` d'abord, la dynamique de la page ne dépend plus de
   * sa configuration. Une production mal configurée redevient saine dès que les
   * variables sont là, sans redéploiement.
   */
  const cookieStore = await cookies();

  const env = readSupabaseServerEnv();
  if (!env) return null;

  return createServerClient<Database>(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Appelé depuis un Server Component : l'écriture de cookies y est
          // interdite. Le rafraîchissement de session est assuré par le
          // middleware, il n'y a rien à rattraper ici.
        }
      },
    },
  });
}

/**
 * Utilisateur courant, ou `null`. Passe toujours par `getUser()`, qui valide
 * le jeton auprès de Supabase — `getSession()` se contente de lire un cookie
 * et ne doit jamais servir à autoriser quoi que ce soit.
 */
export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) return null;
  return user;
}
