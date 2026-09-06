import "server-only";

import type { User } from "@supabase/supabase-js";

/**
 * Rôle administrateur — **résolu côté serveur, jamais annoncé par le client**.
 *
 * ## Pourquoi une variable d'environnement et pas une colonne
 *
 * Audit préalable : `profiles.plan` porte `check (plan in ('free','pro',
 * 'agency'))`. C'est le plan commercial, celui que Stripe écrit ; y ajouter
 * une quatrième valeur mélangerait « ce que le client paie » et « ce qu'il a
 * le droit de faire », et le webhook Stripe pourrait effacer le rôle en
 * rétrogradant un abonnement. Aucun système de rôle n'existait par ailleurs.
 *
 * Le rôle ne sert qu'à une décision prise dans du code serveur — court-circuiter
 * la réservation de quota. Aucune policy RLS n'en a besoin, donc rien n'exige
 * qu'il soit interrogeable en SQL. Une colonne imposerait une migration, un
 * GRANT borné pour empêcher l'auto-promotion, et une policy de plus à garder
 * juste : plus de surface pour la même décision.
 *
 * Une adresse e-mail n'est pas un secret. Rien de sensible n'entre donc dans la
 * configuration, et rien n'entre dans le dépôt.
 *
 * ## Deux conditions, pas une
 *
 * L'adresse doit figurer dans `ADMIN_EMAILS` **et** avoir été confirmée. Sans
 * la seconde, quiconque créerait un compte avec cette adresse avant son
 * propriétaire hériterait du rôle — l'inscription ne prouve pas la possession
 * de la boîte, la confirmation si.
 *
 * L'utilisateur vient toujours de `getCurrentUser()`, donc de `getUser()`
 * validé auprès de Supabase. Aucun champ de la requête n'est lu : ni corps, ni
 * en-tête, ni paramètre, ni cookie non signé. Il n'y a rien à falsifier parce
 * qu'il n'y a rien qui soit accepté depuis le navigateur.
 *
 * ## Fermé par défaut
 *
 * `ADMIN_EMAILS` absente ou vide : personne n'est administrateur. Une erreur de
 * configuration retire le privilège, elle ne l'accorde pas.
 */

/** Adresses déclarées, normalisées. Lues à l'appel, jamais figées à l'import. */
export function adminEmails(): readonly string[] {
  return (process.env["ADMIN_EMAILS"] ?? "")
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * L'utilisateur authentifié est-il administrateur ?
 *
 * Prend l'objet `User` rendu par Supabase, jamais une adresse fournie par
 * l'appelant : passer une chaîne inviterait un jour à y passer celle du corps
 * de la requête.
 */
export function isAdminUser(user: User | null | undefined): boolean {
  const email = user?.email?.trim().toLowerCase();
  if (!email) return false;

  // Une adresse non confirmée ne prouve pas la possession de la boîte.
  if (!user?.email_confirmed_at) return false;

  return adminEmails().includes(email);
}
