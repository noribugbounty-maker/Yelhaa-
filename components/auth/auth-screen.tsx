"use client";

import Link from "next/link";

import { signInAction, signUpAction } from "@/app/(auth)/actions";
import { AuthSeparator, OAuthButtons } from "@/components/auth/oauth-buttons";
import { CredentialsForm } from "@/components/auth/credentials-form";
import { IdeaBanner } from "@/components/auth/idea-banner";
import { useT } from "@/components/i18n/preferences-provider";
import { ServiceUnavailable } from "@/components/site/service-unavailable";
import { messageForUrlError } from "@/lib/auth/messages";
import { DEFAULT_NEXT } from "@/lib/auth/next-path";
import { ROUTES } from "@/lib/config";

export function AuthScreen({
  mode,
  next,
  urlError,
  configured,
  oauthProviders,
}: {
  mode: "login" | "signup";
  next: string;
  urlError: string | null;
  configured: boolean;
  oauthProviders: readonly ("google" | "github")[];
}) {
  const t = useT();
  const errorKey = messageForUrlError(urlError);

  const toggleHref =
    next === DEFAULT_NEXT
      ? mode === "login"
        ? ROUTES.signup
        : ROUTES.login
      : `${mode === "login" ? ROUTES.signup : ROUTES.login}?next=${encodeURIComponent(next)}`;

  return (
    <div className="enter-up">
      <IdeaBanner />

      <h1 className="type-h2 text-ink">
        {t(mode === "login" ? "auth.loginTitle" : "auth.signupTitle")}
      </h1>
      <p className="mt-3 text-[15.5px] text-ink-2">
        {t(mode === "login" ? "auth.loginBody" : "auth.signupBody")}
      </p>

      {errorKey ? (
        <p
          role="status"
          className="mt-6 border-l-2 border-l-err pl-3 text-[13.5px] text-err"
        >
          {t(errorKey)}
        </p>
      ) : null}

      <div className="mt-10">
        {configured ? (
          <>
            {oauthProviders.length > 0 ? (
              <>
                <OAuthButtons next={next} providers={oauthProviders} />
                <AuthSeparator />
              </>
            ) : null}
            <CredentialsForm
              mode={mode}
              action={(mode === "login" ? signInAction : signUpAction).bind(
                null,
                next,
              )}
            />
          </>
        ) : (
          <ServiceUnavailable
            title={t("auth.unavailableTitle")}
            description={t("auth.unavailableBody")}
          />
        )}
      </div>

      <p className="mt-8 text-[14px] text-ink-2">
        {t(mode === "login" ? "auth.loginToggleLead" : "auth.signupToggleLead")}{" "}
        <Link
          href={toggleHref}
          className="font-medium text-ink underline underline-offset-4 transition-opacity duration-[140ms] hover:opacity-70"
        >
          {t(mode === "login" ? "auth.loginToggle" : "auth.signupToggle")}
        </Link>
      </p>

      <p className="mt-10 text-[12.5px] text-ink-3">
        {t("auth.agree")}{" "}
        <Link
          href={ROUTES.terms}
          className="underline underline-offset-4 hover:text-ink-2"
        >
          {t("auth.terms")}
        </Link>{" "}
        {t("auth.and")}{" "}
        <Link
          href={ROUTES.privacy}
          className="underline underline-offset-4 hover:text-ink-2"
        >
          {t("auth.privacy")}
        </Link>
        .
      </p>
    </div>
  );
}
