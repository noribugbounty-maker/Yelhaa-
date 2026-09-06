import "server-only";

/**
 * Fournisseurs OAuth — build prompt §5, design §3.9 : « Google en premier,
 * GitHub en second ».
 *
 * **Un fournisseur n'est affiché que s'il est réellement activé côté Supabase.**
 * Les deux boutons étaient rendus inconditionnellement alors qu'aucun
 * fournisseur n'est activé sur le projet : cliquer envoyait l'utilisateur sur
 * `…supabase.co/auth/v1/authorize`, qui répond
 * `{"code":400,"error_code":"validation_failed","msg":"Unsupported provider:
 * provider is not enabled"}` — du JSON brut, sur un domaine tiers, sans retour.
 *
 * Le build prompt tirait déjà cette conclusion pour GitHub : « un bouton vers
 * un fournisseur inexistant est un lien mort ». La règle vaut pour tous, et
 * elle est désormais appliquée par le code plutôt que par la mémoire.
 *
 * Activation : `NEXT_PUBLIC_OAUTH_PROVIDERS="google,github"` une fois les
 * fournisseurs configurés dans le tableau de bord Supabase. Vide ou absente,
 * seul le formulaire e-mail est proposé — ce qui fonctionne aujourd'hui.
 */
const ALL_PROVIDERS = [
  { id: "google", label: "Continue with Google" },
  { id: "github", label: "Continue with GitHub" },
] as const;

export type OAuthProviderId = (typeof ALL_PROVIDERS)[number]["id"];

export function isOAuthProviderId(value: string): value is OAuthProviderId {
  return ALL_PROVIDERS.some((provider) => provider.id === value);
}

/**
 * Fournisseurs déclarés comme activés, dans l'ordre imposé par le design.
 *
 * La lecture se fait à l'appel et non au chargement du module : une variable
 * d'environnement figée à l'import ne survit pas au rendu statique.
 */
export function enabledOAuthProviders(): readonly {
  id: OAuthProviderId;
  label: string;
}[] {
  const declared = (process.env["NEXT_PUBLIC_OAUTH_PROVIDERS"] ?? "")
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);

  return ALL_PROVIDERS.filter((provider) => declared.includes(provider.id));
}

/** `true` si au moins un fournisseur est activé. */
export function hasOAuthProviders(): boolean {
  return enabledOAuthProviders().length > 0;
}

/** Le fournisseur est-il déclaré activé ? Contrôle refait côté action. */
export function isEnabledProvider(value: string): value is OAuthProviderId {
  return enabledOAuthProviders().some((provider) => provider.id === value);
}
