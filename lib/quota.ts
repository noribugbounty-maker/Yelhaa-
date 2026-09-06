import "server-only";

import type { SupabaseAdminClient } from "@/lib/supabase/admin";
import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, Plan } from "@/lib/supabase/types";

/**
 * Quotas — build prompt §7, décisions §4.
 *
 * Une seule unité comptée : la génération. Une génération = une exécution
 * complète du moteur. Les deux appels au modèle du §4 comptent ensemble pour
 * une seule unité.
 *
 * **Réservation d'abord, remboursement en cas d'échec.** L'ancienne forme
 * lisait le compteur, autorisait, appelait le modèle, puis incrémentait : deux
 * requêtes concurrentes lisaient la même valeur et passaient toutes les deux.
 * L'incrément est désormais atomique et **précède** tout appel payant ; la
 * règle du §7 « une génération échouée ne consomme jamais de quota » est tenue
 * par le remboursement, pas par le report de l'incrément.
 */

export const GENERATION_LIMITS: Record<Plan, number> = {
  free: 3,
  pro: 150,
  agency: 500,
};

export type QuotaState = {
  plan: Plan;
  limit: number;
  used: number;
  remaining: number;
  /** Premier jour du mois suivant, en ISO. Aucun report des non-utilisées. */
  resetsAt: string;
};

export type QuotaReservation =
  | {
      allowed: false;
      /**
       * Pourquoi la réservation est refusée.
       *
       * `limit` : l'utilisateur a réellement épuisé son quota — 402.
       * `unavailable` : la réservation n'a pas pu être évaluée (migration non
       * appliquée, base injoignable) — 503. Sans cette distinction, une panne
       * annonçait « quota atteint » à quelqu'un qui n'avait rien consommé.
       */
      reason: "limit" | "unavailable";
      state: QuotaState;
    }
  | {
      allowed: true;
      state: QuotaState;
      /**
       * Rend l'unité réservée. À appeler sur **tout** chemin d'échec après la
       * réservation — erreur moteur, persistance impossible, exception
       * inattendue.
       *
       * À usage unique : les appels suivants renvoient `null`. Un double
       * remboursement rendrait deux unités pour une seule réservation.
       *
       * Renvoie le compteur après remboursement, ou `null` si rien n'a été
       * rendu — remboursement déjà effectué, ou échec côté base. L'appelant
       * **doit** distinguer les deux : annoncer un quota restauré qui ne l'a
       * pas été est un mensonge au client.
       */
      refund: () => Promise<number | null>;
    };

/**
 * Limite affichée pour un compte non compté. `Infinity` plutôt qu'un très
 * grand nombre : un nombre géant se soustrait, se compare et finit par
 * s'afficher, alors que celui-ci force chaque écran à traiter le cas.
 */
export const UNMETERED_LIMIT = Number.POSITIVE_INFINITY;

/**
 * Réservation d'un compte non compté — **aucune écriture, aucun compteur**.
 *
 * Ce n'est pas « un quota très grand ». `reserve_generation` n'est pas appelée,
 * `usage_counters` n'est pas touchée, et `refund` ne rend rien parce que rien
 * n'a été pris. Un quota géant aurait laissé la ligne de compteur grossir, la
 * limite finir par être atteinte, et le remboursement écrire pour rien.
 *
 * La forme est celle d'une réservation autorisée, donc l'appelant n'a qu'un
 * seul chemin de succès à écrire : c'est ce qui évite qu'une branche
 * administrateur diverge en silence de la branche normale.
 */
export function unmeteredReservation(plan: Plan): QuotaReservation {
  return {
    allowed: true,
    state: {
      plan,
      limit: UNMETERED_LIMIT,
      used: 0,
      remaining: UNMETERED_LIMIT,
      resetsAt: nextPeriodStart(),
    },
    // `null` a le sens exact voulu : rien n'a été rendu, parce que rien n'était
    // à rendre.
    refund: async () => null,
  };
}

/**
 * Premier jour du mois courant, en UTC — la clé de `usage_counters`.
 *
 * Vivait en double : une copie dans `app/(site)/account/page.tsx`, et la même
 * logique dans les fonctions SQL. Deux définitions d'une période de facturation
 * finissent par diverger d'un jour, et c'est le compteur qui ment.
 */
export function currentPeriodStart(now = new Date()): string {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
    .toISOString()
    .slice(0, 10);
}

/**
 * Lecture du quota courant — **source de vérité serveur, filtrée par RLS**.
 *
 * Prend le client de session, jamais `service_role` : un utilisateur ne peut
 * donc lire que sa propre ligne, sans qu'aucune comparaison d'identifiant ne
 * soit écrite ici. C'est ce qui rend impossible l'affichage du quota d'autrui.
 *
 * Ne réserve rien, ne modifie rien : l'autorisation de générer reste
 * exclusivement l'affaire de `reserveGeneration`. Cette fonction n'existe que
 * pour **afficher** un état.
 *
 * Rend `null` quand l'état ne peut pas être établi — l'appelant montre alors un
 * état d'indisponibilité plutôt qu'un zéro faux.
 */
export async function readQuotaState(
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<QuotaState | null> {
  const profile = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", userId)
    .maybeSingle();

  if (profile.error) return null;

  const plan: Plan = profile.data?.plan ?? "free";

  const period = currentPeriodStart();
  const counter = await supabase
    .from("usage_counters")
    .select("generations_used")
    .eq("user_id", userId)
    .eq("period_start", period)
    .maybeSingle();

  // Aucune ligne de compteur = aucune génération ce mois-ci, pas une panne.
  if (counter.error) return null;

  const used = counter.data?.generations_used ?? 0;
  const limit = GENERATION_LIMITS[plan];

  return {
    plan,
    limit,
    used,
    // Bornée à zéro : un compteur au-delà de la limite — plan rétrogradé en
    // cours de mois — afficherait sinon un reste négatif.
    remaining: Math.max(0, limit - used),
    resetsAt: nextPeriodStart(),
  };
}

function nextPeriodStart(now = new Date()): string {
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1),
  ).toISOString();
}

/**
 * Réserve une génération, ou refuse.
 *
 * L'incrément et la vérification de la limite tiennent dans une seule
 * instruction SQL (`reserve_generation`) : deux requêtes simultanées ne peuvent
 * pas réserver la même unité. Un refus renvoie `allowed: false` **avant** tout
 * appel au modèle.
 */
export async function reserveGeneration(
  supabase: SupabaseAdminClient,
  userId: string,
): Promise<QuotaReservation> {
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", userId)
    .maybeSingle();

  /*
   * Pas de ligne `profiles` = pas de parent pour `usage_counters.user_id`
   * ni pour `generations.user_id`. Inventer un plan `free` et réserver
   * quand même ferait échouer l'INSERT plus tard — après l'appel payant.
   */
  if (profileError || !profile) {
    if (profileError) {
      console.error(
        `[quota] lecture du profil impossible — ${profileError.message}`,
      );
    }
    return {
      allowed: false,
      reason: "unavailable",
      state: {
        plan: "free",
        limit: GENERATION_LIMITS.free,
        used: 0,
        remaining: 0,
        resetsAt: nextPeriodStart(),
      },
    };
  }

  const plan: Plan = profile.plan ?? "free";
  const limit = GENERATION_LIMITS[plan];

  const { data: reserved, error } = await supabase.rpc("reserve_generation", {
    p_user_id: userId,
    p_limit: limit,
  });

  if (error) {
    /*
     * Échec en fermeture. Laisser passer « puisque le compteur est
     * indisponible » rouvrirait exactement la dépense non bornée que cette
     * réservation ferme. Le message nomme la migration : la cause la plus
     * probable est qu'elle n'est pas appliquée.
     */
    console.error(
      `[quota] réservation impossible — ${error.message}. ` +
        "Vérifier que supabase/migrations/20260811100000_reserve_generation.sql " +
        "est appliquée (fonctions reserve_generation et refund_generation).",
    );
    return {
      allowed: false,
      reason: "unavailable",
      state: {
        plan,
        limit,
        used: 0,
        remaining: 0,
        resetsAt: nextPeriodStart(),
      },
    };
  }

  /*
   * `null` = la limite est atteinte : aucune ligne n'a été mise à jour.
   *
   * On n'interroge pas `usage_counters` pour enjoliver le message. La requête
   * supplémentaire ne servait qu'à afficher un `used` exact ; or un refus par
   * limite signifie précisément `used >= limit`, donc `limit` est déjà la
   * bonne valeur. Elle coûtait un aller-retour sur le chemin le plus sollicité
   * par un client abusif et ouvrait une lecture non transactionnelle de plus.
   */
  if (reserved === null || typeof reserved !== "object") {
    return {
      allowed: false,
      reason: "limit",
      state: {
        plan,
        limit,
        used: limit,
        remaining: 0,
        resetsAt: nextPeriodStart(),
      },
    };
  }

  const { used, period } = reserved as { used: number; period: string };

  const state: QuotaState = {
    plan,
    limit,
    used,
    remaining: Math.max(limit - used, 0),
    resetsAt: nextPeriodStart(),
  };

  // Règlement à usage unique : la réservation ne peut être remboursée qu'une
  // fois, quel que soit le nombre de chemins d'erreur qui y mènent.
  let settled = false;

  return {
    allowed: true,
    state,
    refund: async () => {
      if (settled) return null;
      settled = true;

      /*
       * La période vient de la réservation, pas de `now()`. Une génération
       * réservée le 31 à 23h59 et remboursée le 1er à 00h01 vise ainsi la
       * ligne qu'elle a réellement incrémentée.
       */
      const { data: refunded, error: refundError } = await supabase.rpc(
        "refund_generation",
        { p_user_id: userId, p_period_start: period },
      );

      if (refundError) {
        // On ne relance pas : l'utilisateur a déjà une erreur de génération à
        // l'écran, et une exception ici la remplacerait par une pire. On
        // renvoie `null` pour que l'appelant n'annonce pas un quota restauré.
        console.error("[quota] remboursement impossible", refundError.message);
        return null;
      }

      return typeof refunded === "number" ? refunded : null;
    },
  };
}
