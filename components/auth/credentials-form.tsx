"use client";

import { useActionState, useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { useT } from "@/components/i18n/preferences-provider";
import { YelhaaMarkLoader } from "@/components/brand/yelhaa-node-mark";
import {
  AUTH_FORM_INITIAL,
  type AuthFormAction,
  type AuthFormState,
} from "@/lib/auth/form-state";
import { AUTH_MESSAGES, looksLikeEmail } from "@/lib/auth/messages";

type FieldName = "name" | "email" | "password";
type FieldErrors = Record<FieldName, string | null>;

const NO_FIELD_ERRORS: FieldErrors = { name: null, email: null, password: null };

const labelClass = "mb-2 block text-[13px] font-medium text-ink";

const inputClass =
  "h-[46px] w-full rounded-[6px] border border-line bg-surface px-3.5 text-[15px] text-ink placeholder:text-ink-3 " +
  "transition-colors duration-[140ms] hover:border-line-strong focus:border-ink focus:outline-none " +
  "aria-[invalid=true]:border-err";

const errorClass =
  "mt-2 border-l-2 border-l-err pl-2 text-[13px] text-err empty:mt-0 empty:border-l-0 empty:pl-0";

/**
 * Email / password form — design decision document §5 and §7.7.
 *
 * Kept from the reference: the form structure. Changed: Apple removed,
 * password visibility toggle added, real pending state via `useActionState`,
 * client-side validation on blur, and a Name field on sign-up that is passed
 * to the existing Supabase action as user metadata.
 *
 * Labels are visible above the fields; errors are linked with
 * `aria-describedby` and announced with `aria-live="polite"`.
 */
export function CredentialsForm({
  action,
  mode,
}: {
  action: AuthFormAction;
  mode: "login" | "signup";
}) {
  const t = useT();
  const [state, formAction, pending] = useActionState<AuthFormState, FormData>(
    action,
    AUTH_FORM_INITIAL,
  );
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>(NO_FIELD_ERRORS);
  const [showPassword, setShowPassword] = useState(false);

  const nameId = useId();
  const emailId = useId();
  const passwordId = useId();
  const formErrorId = useId();

  if (state.status === "sent") {
    return (
      <div
        role="status"
        className="rounded-[6px] border border-line border-l-2 border-l-ink bg-surface p-6"
      >
        <p className="type-label">{t("auth.checkInbox")}</p>
        <p className="mt-3 text-[15px] text-ink">
          {state.message ? t(state.message) : null}
        </p>
      </div>
    );
  }

  const serverError = (field: FieldName | "form") =>
    state.status === "error" && state.field === field && state.message
      ? t(state.message)
      : null;

  const nameError = fieldErrors.name;
  const emailError = fieldErrors.email ?? serverError("email");
  const passwordError = fieldErrors.password ?? serverError("password");
  const formError = serverError("form");

  const validateEmail = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return t(AUTH_MESSAGES.emailRequired);
    if (!looksLikeEmail(trimmed)) return t(AUTH_MESSAGES.emailInvalid);
    return null;
  };

  const submitLabel = pending
    ? mode === "login"
      ? t("auth.signingIn")
      : t("auth.creatingAccount")
    : mode === "login"
      ? t("auth.signIn")
      : t("auth.createAccount");

  return (
    <form action={formAction} noValidate className="flex flex-col gap-5">
      {mode === "signup" ? (
        <div>
          <label htmlFor={nameId} className={labelClass}>
            {t("auth.name")}
          </label>
          <input
            id={nameId}
            name="name"
            type="text"
            autoComplete="name"
            required
            aria-invalid={nameError ? true : undefined}
            aria-describedby={`${nameId}-error`}
            onBlur={(event) =>
              setFieldErrors((current) => ({
                ...current,
                name: event.target.value.trim() ? null : t("auth.enterName"),
              }))
            }
            className={inputClass}
          />
          <p id={`${nameId}-error`} aria-live="polite" className={errorClass}>
            {nameError}
          </p>
        </div>
      ) : null}

      <div>
        <label htmlFor={emailId} className={labelClass}>
          {t("auth.email")}
        </label>
        <input
          id={emailId}
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-invalid={emailError ? true : undefined}
          aria-describedby={`${emailId}-error`}
          onBlur={(event) =>
            setFieldErrors((current) => ({
              ...current,
              email: validateEmail(event.target.value),
            }))
          }
          className={inputClass}
        />
        <p id={`${emailId}-error`} aria-live="polite" className={errorClass}>
          {emailError}
        </p>
      </div>

      <div>
        <label htmlFor={passwordId} className={labelClass}>
          {t("auth.password")}
        </label>
        <div className="relative">
          <input
            id={passwordId}
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete={
              mode === "login" ? "current-password" : "new-password"
            }
            required
            aria-invalid={passwordError ? true : undefined}
            aria-describedby={`${passwordId}-error`}
            onBlur={(event) =>
              setFieldErrors((current) => ({
                ...current,
                password: event.target.value
                  ? null
                  : t(AUTH_MESSAGES.passwordRequired),
              }))
            }
            className={`${inputClass} pr-12`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? t("auth.hidePassword") : t("auth.showPassword")}
            aria-pressed={showPassword}
            className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-[6px] text-ink-3 transition-colors duration-[140ms] hover:text-ink"
          >
            {showPassword ? (
              <EyeOff size={17} strokeWidth={1.6} aria-hidden="true" />
            ) : (
              <Eye size={17} strokeWidth={1.6} aria-hidden="true" />
            )}
          </button>
        </div>
        <p id={`${passwordId}-error`} aria-live="polite" className={errorClass}>
          {passwordError}
        </p>
      </div>

      <p id={formErrorId} aria-live="polite" className={errorClass}>
        {formError}
      </p>

      <button
        type="submit"
        disabled={pending}
        aria-describedby={formErrorId}
        className="mt-1 flex h-[48px] items-center justify-center gap-2 rounded-[6px] bg-ink px-5 text-[15px] font-semibold text-void transition-colors duration-[140ms] hover:bg-white disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-ink-3"
      >
        {submitLabel}
        {pending ? <YelhaaMarkLoader size={18} /> : <span aria-hidden="true">→</span>}
      </button>
    </form>
  );
}
