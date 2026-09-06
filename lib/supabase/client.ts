"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

import { readSupabaseEnv } from "@/lib/supabase/env";
import type { Database } from "@/lib/supabase/types";

export type SupabaseBrowserClient = SupabaseClient<Database>;

let cached: SupabaseBrowserClient | null = null;

/**
 * Client Supabase du navigateur, mémoïsé pour le temps de vie de l'onglet.
 *
 * Renvoie `null` quand la configuration est absente : l'appelant rend alors
 * l'état « service indisponible » au lieu de planter (build prompt §1).
 */
export function createSupabaseBrowserClient(): SupabaseBrowserClient | null {
  if (cached) return cached;

  const env = readSupabaseEnv();
  if (!env) return null;

  cached = createBrowserClient<Database>(env.url, env.anonKey);
  return cached;
}
