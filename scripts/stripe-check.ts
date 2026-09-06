/**
 * Garde-fou anti-dérive entre `PLANS` et Stripe.
 *
 * Les montants affichés vivent dans une constante unique ; les prix réels
 * vivent chez Stripe. Ce script vérifie que les deux disent la même chose, et
 * que les deux plans payants sont bien des abonnements mensuels.
 *
 *   npm run stripe:check
 */
import { PLANS } from "@/lib/config";

const key = process.env.STRIPE_SECRET_KEY;
if (!key) {
  console.error("BLOQUÉ — STRIPE_SECRET_KEY absente de .env.local.");
  process.exit(1);
}

const priceIds: Record<string, string | undefined> = {
  pro: process.env.STRIPE_PRICE_PRO,
  agency: process.env.STRIPE_PRICE_AGENCY,
};

let failed = false;

for (const plan of PLANS) {
  if (plan.id === "free") continue;

  const priceId = priceIds[plan.id];
  if (!priceId) {
    console.error(`ÉCHEC ${plan.name} : identifiant de prix absent de l'environnement.`);
    failed = true;
    continue;
  }

  const response = await fetch(`https://api.stripe.com/v1/prices/${priceId}`, {
    headers: { Authorization: `Bearer ${key}` },
  });
  const body = (await response.json()) as {
    unit_amount?: number;
    currency?: string;
    type?: string;
    recurring?: { interval?: string; interval_count?: number } | null;
    active?: boolean;
    error?: { message?: string };
  };

  if (!response.ok) {
    console.error(`ÉCHEC ${plan.name} : ${body.error?.message ?? response.status}`);
    failed = true;
    continue;
  }

  const amount = (body.unit_amount ?? 0) / 100;
  const problems: string[] = [];

  if (Math.abs(amount - plan.priceUsd) > 0.001) {
    problems.push(`montant Stripe ${amount} ≠ constante ${plan.priceUsd}`);
  }
  if (body.currency !== "usd") problems.push(`devise ${body.currency} ≠ usd`);
  if (body.type !== "recurring") problems.push(`type ${body.type} ≠ recurring`);
  if (body.recurring?.interval !== "month" || body.recurring.interval_count !== 1) {
    problems.push("récurrence ≠ 1 mois");
  }
  if (body.active !== true) problems.push("prix inactif");

  if (problems.length > 0) {
    console.error(`ÉCHEC ${plan.name} : ${problems.join(" · ")}`);
    failed = true;
  } else {
    console.log(`ok    ${plan.name.padEnd(8)} ${amount.toFixed(2)} USD · abonnement mensuel`);
  }
}

if (failed) process.exit(1);
console.log("\nLes montants affichés et les prix Stripe concordent.");
