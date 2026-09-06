import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AccountPageView } from "@/components/account/account-page";
import { AccountUnavailable } from "@/components/account/account-unavailable";
import { GENERATION_LIMITS, currentPeriodStart } from "@/lib/quota";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Account" };

export default async function AccountPage() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return <AccountUnavailable />;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=%2Faccount");

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, stripe_subscription_id, plan_renews_at, email")
    .eq("id", user.id)
    .maybeSingle();

  const { data: counter } = await supabase
    .from("usage_counters")
    .select("generations_used")
    .eq("user_id", user.id)
    .eq("period_start", currentPeriodStart())
    .maybeSingle();

  const { data: history } = await supabase
    .from("generations")
    .select("id, idea, created_at")
    .order("created_at", { ascending: false })
    .limit(10);

  const plan = profile?.plan ?? "free";
  const used = counter?.generations_used ?? 0;
  const limit = GENERATION_LIMITS[plan];

  return (
    <AccountPageView
      email={profile?.email ?? user.email ?? ""}
      plan={plan}
      used={used}
      limit={limit}
      hasSubscription={Boolean(profile?.stripe_subscription_id)}
      history={history ?? []}
    />
  );
}
