/**
 * État partagé des formulaires d'authentification.
 *
 * Séparé de `app/(auth)/actions.ts` : un module « use server » ne peut
 * exporter que des fonctions asynchrones, or le composant client a besoin du
 * type et de la valeur initiale.
 */

export type AuthFormState = {
  status: "idle" | "error" | "sent";
  message: string | null;
  /** Champ à relier au message via `aria-describedby`. */
  field: "email" | "password" | "form" | null;
};

export const AUTH_FORM_INITIAL: AuthFormState = {
  status: "idle",
  message: null,
  field: null,
};

export type AuthFormAction = (
  state: AuthFormState,
  formData: FormData,
) => Promise<AuthFormState>;
