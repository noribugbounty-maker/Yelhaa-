import "server-only";

import Stripe from "stripe";

import type { Plan } from "@/lib/supabase/types";

/**
 * Client Stripe — build prompt §6.
 *
 * Renvoie `null` quand la configuration manque : l'interface affiche alors
 * l'état « service indisponible » au lieu de planter (§1).
 */
let cached: Stripe | null = null;

export function createStripeClient(): Stripe | null {
  if (cached) return cached;

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    console.warn("[stripe] STRIPE_SECRET_KEY absente : paiement indisponible.");
    return null;
  }

  cached = new Stripe(secretKey);
  return cached;
}

/** Identifiants de prix — jamais en dur, toujours l'environnement. */
export function readPriceIds(): Record<Exclude<Plan, "free">, string> | null {
  const pro = process.env.STRIPE_PRICE_PRO;
  const agency = process.env.STRIPE_PRICE_AGENCY;

  if (!pro || !agency) {
    console.warn(
      "[stripe] STRIPE_PRICE_PRO et/ou STRIPE_PRICE_AGENCY absentes.",
    );
    return null;
  }

  return { pro, agency };
}

/** Résout le plan porté par un abonnement, depuis l'identifiant de prix. */
export function planForPriceId(priceId: string | null | undefined): Plan {
  const prices = readPriceIds();
  if (!prices || !priceId) return "free";
  if (priceId === prices.pro) return "pro";
  if (priceId === prices.agency) return "agency";
  return "free";
}
