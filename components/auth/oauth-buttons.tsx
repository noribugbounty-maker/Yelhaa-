"use client";

import { signInWithProviderAction } from "@/app/(auth)/actions";
import { useT } from "@/components/i18n/preferences-provider";
import { PROVIDER_ICONS } from "@/components/ui/provider-icons";
type OAuthProviderId = "google" | "github";

export function OAuthButtons({
  next,
  providers,
}: {
  next: string;
  providers: readonly OAuthProviderId[];
}) {
  const t = useT();
  if (providers.length === 0) return null;

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {providers.map((id) => {
        const Icon = PROVIDER_ICONS[id];
        const label =
          id === "google" ? t("auth.continueGoogle") : t("auth.continueGithub");
        return (
          <form
            key={id}
            action={signInWithProviderAction.bind(null, id, next)}
          >
            <button
              type="submit"
              className="flex h-[46px] w-full items-center justify-center gap-3 rounded-[6px] border border-line bg-surface px-4 text-[14.5px] font-medium text-ink transition-colors duration-[140ms] hover:border-line-strong hover:bg-surface-2"
            >
              <Icon className="size-[17px]" />
              {label}
            </button>
          </form>
        );
      })}
    </div>
  );
}

export function AuthSeparator() {
  const t = useT();
  return (
    <div aria-hidden="true" className="relative my-7">
      <div className="h-px w-full bg-line" />
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-void px-3 type-label">
        {t("auth.or")}
      </span>
    </div>
  );
}
