import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { resolveSiteOrigin } from "@/lib/auth/site-origin";
import { createStripeClient, readPriceIds } from "@/lib/stripe/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/supabase/server";

export const runtime = "nodejs";

const requestSchema = z.object({ plan: z.enum(["pro", "agency"]) });

/**
 * Ouverture d'une session Stripe Checkout — build prompt §6.
 *
 * Toujours `mode: 'subscription'` : les trois plans payants sont des
 * abonnements mensuels, aucun paiement unique (décisions §4).
 */
export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 },
    );
  }

  const parsed = requestSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) {
    return NextResponse.json({ error: "Unknown plan." }, { status: 400 });
  }

  const stripe = createStripeClient();
  const prices = readPriceIds();
  if (!stripe || !prices) {
    return NextResponse.json(
      { error: "Checkout temporarily unavailable." },
      { status: 503 },
    );
  }

  const origin = await resolveSiteOrigin();
  if (!origin) {
    return NextResponse.json(
      { error: "Checkout temporarily unavailable." },
      { status: 503 },
    );
  }

  // Réutilise le client Stripe existant s'il y en a un, pour ne pas multiplier
  // les fiches sur un même utilisateur.
  const admin = createSupabaseAdminClient();
  const { data: profile } = admin
    ? await admin
        .from("profiles")
        .select("stripe_customer_id, email")
        .eq("id", user.id)
        .maybeSingle()
    : { data: null };

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: prices[parsed.data.plan], quantity: 1 }],
      client_reference_id: user.id,
      ...(profile?.stripe_customer_id
        ? { customer: profile.stripe_customer_id }
        : { customer_email: user.email ?? undefined }),
      // L'identifiant utilisateur voyage dans les métadonnées : le webhook en
      // a besoin, et aucune donnée personnelle ne transite par l'URL (§9).
      subscription_data: { metadata: { user_id: user.id } },
      metadata: { user_id: user.id },
      success_url: `${origin}/checkout/success`,
      cancel_url: `${origin}/checkout/cancel`,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Invalid checkout session." },
        { status: 502 },
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[stripe] création de session impossible", error);
    return NextResponse.json(
      { error: "Checkout temporarily unavailable." },
      { status: 502 },
    );
  }
}
