"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { AuthFormState } from "@/lib/auth/form-state";
import {
  AUTH_MESSAGES,
  looksLikeEmail,
  messageForAuthError,
} from "@/lib/auth/messages";
import { sanitizeNextPath } from "@/lib/auth/next-path";
import { isEnabledProvider } from "@/lib/auth/providers";
import { resolveSiteOrigin } from "@/lib/auth/site-origin";
import { clientIpFromHeaders } from "@/lib/http/client-ip";
import { AUTH_RATE_LIMIT, rateLimit } from "@/lib/rate-limit";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function fail(field: AuthFormState["field"], message: string): AuthFormState {
  return { status: "error", message, field };
}

function readCredentials(formData: FormData) {
  return {
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
  };
}

function validate({
  email,
  password,
}: {
  email: string;
  password: string;
}): AuthFormState | null {
  if (!email) return fail("email", AUTH_MESSAGES.emailRequired);
  if (!looksLikeEmail(email)) return fail("email", AUTH_MESSAGES.emailInvalid);
  if (!password) return fail("password", AUTH_MESSAGES.passwordRequired);
  return null;
}

async function throttleAuth(bucket: string): Promise<AuthFormState | null> {
  const ip = clientIpFromHeaders(await headers());
  const limit = rateLimit(`auth:${bucket}:${ip}`, AUTH_RATE_LIMIT);
  if (!limit.allowed) return fail("form", AUTH_MESSAGES.rateLimited);
  return null;
}

/** Connexion e-mail + mot de passe. */
export async function signInAction(
  next: string,
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const credentials = readCredentials(formData);
  const invalid = validate(credentials);
  if (invalid) return invalid;

  const throttled = await throttleAuth("signin");
  if (throttled) return throttled;

  const supabase = await createSupabaseServerClient();
  if (!supabase) return fail("form", AUTH_MESSAGES.unavailable);

  const { error } = await supabase.auth.signInWithPassword(credentials);

  if (error) {
    // Le code reste dans les journaux, jamais à l'écran.
    console.error("[auth] échec de connexion", error.code ?? error.name);
    return fail("form", messageForAuthError(error.code, "signin"));
  }

  revalidatePath("/", "layout");
  redirect(sanitizeNextPath(next));
}

/** Inscription — e-mail et mot de passe, rien d'autre (build prompt §5). */
export async function signUpAction(
  next: string,
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const credentials = readCredentials(formData);
  const invalid = validate(credentials);
  if (invalid) return invalid;

  const throttled = await throttleAuth("signup");
  if (throttled) return throttled;

  const supabase = await createSupabaseServerClient();
  if (!supabase) return fail("form", AUTH_MESSAGES.unavailable);

  const safeNext = sanitizeNextPath(next);
  const origin = await resolveSiteOrigin();
  if (!origin) return fail("form", AUTH_MESSAGES.unavailable);

  // Display name from the sign-up form (design decision document §5), stored
  // as user metadata. Optional server-side: an empty value is simply omitted.
  const name = String(formData.get("name") ?? "")
    .trim()
    .slice(0, 120);

  const { data, error } = await supabase.auth.signUp({
    ...credentials,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(safeNext)}`,
      ...(name ? { data: { full_name: name } } : {}),
    },
  });

  if (error) {
    console.error("[auth] échec d'inscription", error.code ?? error.name);
    return fail("form", messageForAuthError(error.code, "signup"));
  }

  // Confirmation d'e-mail désactivée : la session est ouverte immédiatement.
  if (data.session) {
    revalidatePath("/", "layout");
    redirect(safeNext);
  }

  // Confirmation activée : le formulaire est remplacé par la confirmation (§4).
  return {
    status: "sent",
    message: AUTH_MESSAGES.confirmEmailSent,
    field: null,
  };
}

/**
 * Départ vers un fournisseur OAuth.
 *
 * L'URL de retour est construite ici, côté serveur, et `next` y est réinjecté
 * après validation — il repassera par une seconde validation au retour dans
 * `/auth/callback`.
 */
export async function signInWithProviderAction(
  provider: string,
  next: string,
  _formData: FormData,
): Promise<void> {
  const safeNext = sanitizeNextPath(next);
  const failureUrl = `/login?error=oauth&next=${encodeURIComponent(safeNext)}`;

  /*
   * Le contrôle porte sur « activé », pas seulement sur « connu ».
   *
   * Un fournisseur reconnu mais désactivé côté Supabase produisait une URL
   * d'autorisation valide en apparence : l'erreur n'apparaissait qu'une fois le
   * navigateur arrivé sur `…supabase.co`, sous forme de JSON brut. On refuse
   * donc **avant** de quitter le site, et l'utilisateur revient sur `/login`
   * avec un message lisible.
   */
  const throttled = await throttleAuth("oauth");
  if (throttled) redirect(failureUrl);

  if (!isEnabledProvider(provider)) {
    console.error(
      `[auth] fournisseur OAuth « ${provider} » non activé. ` +
        "Activer le fournisseur dans Supabase, puis le déclarer dans " +
        "NEXT_PUBLIC_OAUTH_PROVIDERS.",
    );
    redirect(failureUrl);
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    redirect(`/login?error=unavailable&next=${encodeURIComponent(safeNext)}`);
  }

  const origin = await resolveSiteOrigin();
  if (!origin) {
    redirect(`/login?error=unavailable&next=${encodeURIComponent(safeNext)}`);
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(safeNext)}`,
      skipBrowserRedirect: true,
    },
  });

  if (error || !data.url) {
    console.error(
      "[auth] démarrage OAuth impossible",
      error?.code ?? error?.name,
    );
    redirect(failureUrl);
  }

  redirect(data.url);
}

/**
 * Déconnexion.
 *
 * `revalidatePath("/", "layout")` avant la redirection : sans elle, le layout
 * rendu côté serveur — donc la barre de navigation — resterait en cache avec
 * l'utilisateur encore affiché. C'est la même mécanique que la connexion, en
 * sens inverse, et c'est ce qui évite un `window.location.reload()`.
 *
 * `scope: "global"` révoque la session partout, pas seulement dans cet onglet :
 * se déconnecter doit fermer l'accès, pas le déplacer.
 */
export async function signOutAction(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  if (supabase) {
    const { error } = await supabase.auth.signOut({ scope: "global" });
    if (error)
      console.error("[auth] déconnexion partielle", error.code ?? error.name);
  }

  revalidatePath("/", "layout");
  redirect("/");
}
