import "server-only";

import type { SupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * Garantit la ligne `public.profiles` calée sur `auth.users.id`.
 *
 * `generations.user_id` (et `usage_counters.user_id`) référence
 * `public.profiles(id)`, pas `auth.users` directement. Le trigger
 * `handle_new_user` crée cette ligne à l'inscription, mais un compte Auth
 * peut exister sans profil : trigger absent au moment de la création,
 * import manuel, ou chemin administrateur qui ne passe jamais par
 * `reserve_generation`.
 *
 * L'identifiant écrit est **toujours** celui de `auth.users` — jamais un
 * UUID inventé. C'est la seule valeur que la FK `profiles.id → auth.users`
 * accepte.
 */
export async function ensureProfile(
  supabase: SupabaseAdminClient,
  user: { id: string; email?: string | null },
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const existing = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (existing.error) {
    return { ok: false, error: existing.error.message };
  }
  if (existing.data?.id === user.id) {
    return { ok: true, id: user.id };
  }

  const written = await supabase
    .from("profiles")
    .upsert(
      { id: user.id, email: user.email ?? null },
      { onConflict: "id" },
    )
    .select("id")
    .maybeSingle();

  if (written.error) {
    const raced = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();
    if (raced.data?.id === user.id) {
      return { ok: true, id: user.id };
    }
    return { ok: false, error: written.error.message };
  }

  if (written.data?.id === user.id) {
    return { ok: true, id: user.id };
  }

  const again = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();
  if (again.data?.id === user.id) {
    return { ok: true, id: user.id };
  }

  return { ok: false, error: "Profile could not be created." };
}
