import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";

import { createStripeClient, planForPriceId } from "@/lib/stripe/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Plan } from "@/lib/supabase/types";

export const runtime = "nodejs";
/** Corps brut obligatoire : aucune transformation ne doit toucher ce handler (§9). */
export const dynamic = "force-dynamic";

const HANDLED = new Set([
  "checkout.session.completed",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.payment_failed",
]);

type ProfileUpdate = {
  plan?: Plan;
  stripe_customer_id?: string;
  stripe_subscription_id?: string | null;
  plan_renews_at?: string | null;
};

/**
 * Webhook Stripe — build prompt §6.
 *
 * « Le plan n'est jamais mis à jour depuis le client — uniquement par
 *   webhook. » Et le webhook est idempotent : l'identifiant d'événement est
 *   inséré en clé primaire avant tout traitement, donc un rejeu s'arrête là.
 */
export async function POST(request: NextRequest) {
  const stripe = createStripeClient();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const admin = createSupabaseAdminClient();

  if (!stripe || !webhookSecret || !admin) {
    console.error("[stripe] webhook non configuré");
    return NextResponse.json({ error: "Not configured." }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  // Corps brut, tel qu'il est arrivé. Aucun parsing avant la vérification.
  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    console.error(
      "[stripe] signature invalide",
      error instanceof Error ? error.message : "",
    );
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (!HANDLED.has(event.type)) {
    return NextResponse.json({ received: true, ignored: event.type });
  }

  // Idempotence — avant toute écriture métier.
  const { error: duplicate } = await admin
    .from("stripe_events")
    .insert({ id: event.id, type: event.type });

  if (duplicate) {
    // Violation de clé primaire : événement déjà traité.
    return NextResponse.json({ received: true, duplicate: true });
  }

  const applyToUser = async (userId: string, update: ProfileUpdate) => {
    const { error } = await admin
      .from("profiles")
      .update(update)
      .eq("id", userId);
    if (error)
      console.error("[stripe] mise à jour du profil impossible", error.message);
  };

  const applyToCustomer = async (customerId: string, update: ProfileUpdate) => {
    const { error } = await admin
      .from("profiles")
      .update(update)
      .eq("stripe_customer_id", customerId);
    if (error)
      console.error(
        "[stripe] mise à jour par client impossible",
        error.message,
      );
  };

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const userId =
          session.client_reference_id ?? session.metadata?.["user_id"];
        if (!userId) break;

        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : null;
        const customerId =
          typeof session.customer === "string" ? session.customer : null;

        let plan: Plan = "free";
        let renewsAt: string | null = null;

        if (subscriptionId) {
          const subscription =
            await stripe.subscriptions.retrieve(subscriptionId);
          plan = planForPriceId(subscription.items.data[0]?.price.id);
          const period = subscription.items.data[0]?.current_period_end;
          renewsAt = period ? new Date(period * 1000).toISOString() : null;
        }

        await applyToUser(userId, {
          plan,
          ...(customerId ? { stripe_customer_id: customerId } : {}),
          stripe_subscription_id: subscriptionId,
          plan_renews_at: renewsAt,
        });
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : null;
        if (!customerId) break;

        // Un abonnement qui n'est plus vivant ne donne plus d'accès payant.
        const alive =
          subscription.status === "active" ||
          subscription.status === "trialing";
        const plan: Plan = alive
          ? planForPriceId(subscription.items.data[0]?.price.id)
          : "free";
        const period = subscription.items.data[0]?.current_period_end;

        await applyToCustomer(customerId, {
          plan,
          stripe_subscription_id: subscription.id,
          plan_renews_at: period ? new Date(period * 1000).toISOString() : null,
        });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : null;
        if (!customerId) break;

        await applyToCustomer(customerId, {
          plan: "free",
          stripe_subscription_id: null,
          plan_renews_at: null,
        });
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        const customerId =
          typeof invoice.customer === "string" ? invoice.customer : null;
        // Aucun changement de plan ici : Stripe réessaie, et c'est
        // `customer.subscription.updated` qui tranchera si l'abonnement meurt.
        console.warn(
          "[stripe] paiement échoué",
          customerId ?? "client inconnu",
        );
        break;
      }
    }
  } catch (error) {
    console.error("[stripe] traitement de l'événement impossible", error);
    // 500 : Stripe rejouera, et l'idempotence tient déjà la ligne.
    return NextResponse.json({ error: "Processing failed." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
