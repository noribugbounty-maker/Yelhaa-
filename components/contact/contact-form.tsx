"use client";

import { useId, useState } from "react";

import { useT } from "@/components/i18n/preferences-provider";
import { MarkTick } from "@/components/brand/marks";

type FieldName = "name" | "email" | "message";
type Errors = Partial<Record<FieldName | "form", string>>;

const inputClass =
  "glass-inset h-[42px] w-full px-3 text-[15.5px] text-ink " +
  "transition-[background-color,border-color] duration-[140ms] focus:border-volt focus:outline-none";

const errorClass = "mt-1.5 text-[13px] text-err empty:mt-0";

/**
 * Formulaire de contact — design prompt §3.8 et §4.
 *
 * Labels au-dessus des champs, validation au blur, `aria-describedby`,
 * `aria-live="polite"`, envoi désactivé pendant la requête, succès qui
 * **remplace** le formulaire. Jamais d'`alert()`.
 *
 * Case de consentement décochée par défaut et distincte de toute case
 * marketing (décisions §6) : le bouton reste désactivé tant qu'elle n'est pas
 * cochée.
 */
export function ContactForm() {
  const t = useT();
  const [errors, setErrors] = useState<Errors>({});
  const [consent, setConsent] = useState(false);
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);

  const nameId = useId();
  const emailId = useId();
  const messageId = useId();
  const formErrorId = useId();
  // Comme les autres champs : un id d'instance, pas une constante. Deux
  // formulaires sur une même page partageaient sinon l'id « company », et le
  // label du piège pointait vers le mauvais champ.
  const companyId = useId();

  const validate = (field: FieldName, value: string): string | undefined => {
    const trimmed = value.trim();
    if (field === "name") return trimmed ? undefined : t("contact.enterName");
    if (field === "email") {
      if (!trimmed) return t("contact.enterEmail");
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)
        ? undefined
        : t("contact.emailInvalid");
    }
    if (!trimmed) return t("contact.writeMessage");
    return trimmed.length >= 10 ? undefined : t("contact.messageShort");
  };

  if (sent) {
    return (
      <div role="status" className="glass-panel p-6">
        <MarkTick draw className="size-5" />
        <h2 className="mt-4 type-h3 text-ink">{t("contact.received")}</h2>
        <p className="mt-2 text-ink-2">{t("contact.receivedBody")}</p>
      </div>
    );
  }

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    const values = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      message: String(form.get("message") ?? ""),
    };

    const nextErrors: Errors = {};
    for (const field of ["name", "email", "message"] as const) {
      const error = validate(field, values[field]);
      if (error) nextErrors[field] = error;
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setPending(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          consent: true,
          company: String(form.get("company") ?? ""),
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        setErrors({
          form:
            typeof payload?.error === "string"
              ? payload.error
              : t("contact.sendError"),
        });
        setPending(false);
        return;
      }

      setSent(true);
    } catch {
      setErrors({ form: t("contact.sendError") });
      setPending(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4">
      <div>
        <label
          htmlFor={nameId}
          className="mb-1.5 block text-[13px] font-medium text-ink"
        >
          {t("contact.name")}
        </label>
        <input
          id={nameId}
          name="name"
          type="text"
          autoComplete="name"
          required
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={`${nameId}-error`}
          onBlur={(event) =>
            setErrors((current) => ({
              ...current,
              name: validate("name", event.target.value),
            }))
          }
          className={inputClass}
        />
        <p id={`${nameId}-error`} aria-live="polite" className={errorClass}>
          {errors.name}
        </p>
      </div>

      <div>
        <label
          htmlFor={emailId}
          className="mb-1.5 block text-[13px] font-medium text-ink"
        >
          {t("contact.email")}
        </label>
        <input
          id={emailId}
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={`${emailId}-error`}
          onBlur={(event) =>
            setErrors((current) => ({
              ...current,
              email: validate("email", event.target.value),
            }))
          }
          className={inputClass}
        />
        <p id={`${emailId}-error`} aria-live="polite" className={errorClass}>
          {errors.email}
        </p>
      </div>

      <div>
        <label
          htmlFor={messageId}
          className="mb-1.5 block text-[13px] font-medium text-ink"
        >
          {t("contact.message")}
        </label>
        <textarea
          id={messageId}
          name="message"
          rows={6}
          required
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={`${messageId}-error`}
          onBlur={(event) =>
            setErrors((current) => ({
              ...current,
              message: validate("message", event.target.value),
            }))
          }
          className="glass-inset w-full resize-y px-3 py-2.5 text-[15.5px] leading-[1.6] text-ink transition-[background-color,border-color] duration-[140ms] focus:border-volt focus:outline-none"
        />
        <p id={`${messageId}-error`} aria-live="polite" className={errorClass}>
          {errors.message}
        </p>
      </div>

      {/* Piège à robots : hors flux, hors tabulation, hors lecteur d'écran. */}
      <div
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 overflow-hidden"
      >
        <label htmlFor={companyId}>Company</label>
        <input
          id={companyId}
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <label className="flex items-start gap-3 text-[14px] text-ink-2">
        <input
          type="checkbox"
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
          className="mt-1 size-4 accent-volt"
        />
        {t("contact.consent")}
      </label>

      <p
        id={formErrorId}
        aria-live="polite"
        className="text-[13px] text-err empty:hidden"
      >
        {errors.form}
      </p>

      <button
        type="submit"
        disabled={!consent || pending}
        aria-describedby={formErrorId}
        className="mt-1 flex h-[42px] items-center justify-center rounded-[6px] bg-volt px-5 font-semibold text-void transition-colors duration-[140ms] hover:bg-volt-hot active:bg-volt-press disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-ink-3"
      >
        {pending ? t("contact.sending") : t("contact.send")}
      </button>
    </form>
  );
}
