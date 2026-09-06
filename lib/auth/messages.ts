/**
 * Messages d'authentification — clés i18n, jamais le texte final.
 *
 * Le libellé affiché vient du dictionnaire (`auth.*`). Ici on ne transporte
 * que des identifiants, pour que EN/FR basculent sans changer les actions.
 */

export const AUTH_MESSAGES = {
  emailRequired: "auth.emailRequired",
  emailInvalid: "auth.emailInvalid",
  passwordRequired: "auth.passwordRequired",
  invalidCredentials: "auth.invalidCredentials",
  emailNotConfirmed: "auth.emailNotConfirmed",
  alreadyRegistered: "auth.alreadyRegistered",
  weakPassword: "auth.weakPassword",
  rateLimited: "auth.rateLimited",
  confirmEmailSent: "auth.confirmEmailSent",
  oauthFailed: "auth.oauthFailed",
  sessionFailed: "auth.sessionFailed",
  unavailable: "auth.unavailable",
  unexpected: "auth.unexpected",
} as const;

export type AuthMessageKey = (typeof AUTH_MESSAGES)[keyof typeof AUTH_MESSAGES];

export type AuthUrlError = "oauth" | "session" | "unavailable";

export function messageForUrlError(
  value: string | null | undefined,
): AuthMessageKey | null {
  switch (value) {
    case "oauth":
      return AUTH_MESSAGES.oauthFailed;
    case "session":
      return AUTH_MESSAGES.sessionFailed;
    case "unavailable":
      return AUTH_MESSAGES.unavailable;
    default:
      return null;
  }
}

export function messageForAuthError(
  code: string | undefined,
  scope: "signin" | "signup",
): AuthMessageKey {
  if (scope === "signin") {
    if (code === "email_not_confirmed") return AUTH_MESSAGES.emailNotConfirmed;
    if (
      code === "over_request_rate_limit" ||
      code === "over_email_send_rate_limit"
    ) {
      return AUTH_MESSAGES.rateLimited;
    }
    return AUTH_MESSAGES.invalidCredentials;
  }

  switch (code) {
    case "user_already_exists":
    case "email_exists":
      return AUTH_MESSAGES.alreadyRegistered;
    case "weak_password":
      return AUTH_MESSAGES.weakPassword;
    case "over_request_rate_limit":
    case "over_email_send_rate_limit":
      return AUTH_MESSAGES.rateLimited;
    default:
      return AUTH_MESSAGES.unexpected;
  }
}

export function looksLikeEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
