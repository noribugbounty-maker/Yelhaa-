import { NextResponse } from "next/server";

import { resolveSiteOrigin } from "@/lib/auth/site-origin";
import { createStripeClient } from "@/lib/stripe/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/supabase/server";

export const runtime = "nodejs";

/** Portail client Stripe — gestion et résiliation (build prompt §6). */
export async function POST() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 },
    );
  }

  const stripe = createStripeClient();
  const admin = createSupabaseAdminClient();
  if (!stripe || !admin) {
    return NextResponse.json(
      { error: "Billing temporarily unavailable." },
      { status: 503 },
    );
  }

  const { data: profile } = await admin
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.stripe_customer_id) {
    return NextResponse.json(
      { error: "No subscription to manage on this account." },
      { status: 400 },
    );
  }

  try {
    const origin = await resolveSiteOrigin();
    if (!origin) {
      return NextResponse.json(
        { error: "Billing temporarily unavailable." },
        { status: 503 },
      );
    }
    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${origin}/account`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[stripe] portail indisponible", error);
    return NextResponse.json(
      { error: "Portal temporarily unavailable." },
      { status: 502 },
    );
  }
}
