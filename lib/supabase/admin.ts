import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { readSupabaseServerEnv } from "@/lib/supabase/env";
import type { Database } from "@/lib/supabase/types";

export type SupabaseAdminClient = SupabaseClient<Database>;

let cached: SupabaseAdminClient | null = null;

/**
 * Client `service_role` — contourne RLS.
 *
 * Réservé aux écritures que le modèle d'autorisation interdit au client :
 * `generations`, `usage_counters`, `prompt_templates`. Voir `docs/supabase.md`.
 *
 * La clé n'est jamais préfixée `NEXT_PUBLIC_`, ce module est marqué
 * `server-only`, et la valeur n'est ni journalisée ni renvoyée.
 */
export function createSupabaseAdminClient(): SupabaseAdminClient | null {
  if (cached) return cached;

  const env = readSupabaseServerEnv();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!env || !serviceRoleKey) {
    console.warn(
      "[supabase] SUPABASE_SERVICE_ROLE_KEY absente : écritures serveur indisponibles.",
    );
    return null;
  }

  cached = createClient<Database>(env.url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return cached;
}
