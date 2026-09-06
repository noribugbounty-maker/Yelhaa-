import { NextResponse } from "next/server";

import { isAdminUser } from "@/lib/auth/admin";
import { readQuotaState } from "@/lib/quota";
import {
  createSupabaseServerClient,
  getCurrentUser,
} from "@/lib/supabase/server";

/**
 * `GET /api/me/quota` — quota de l'utilisateur **courant**, et de lui seul.
 *
 * ## Pourquoi cet endpoint existe
 *
 * Le bloc de compte de la barre de navigation doit rester **client**, sinon
 * `cookies()` remonterait dans le layout et rendrait dynamique tout l'arbre.
 * Mesuré : avec une lecture serveur dans le layout, `/`, `/pricing` et les
 * pages légales passaient de `○` statique à `ƒ`. Déplacer la lecture hors de
 * l'arbre de rendu garde les pages publiques pré-rendues.
 *
 * ## Pourquoi aucun identifiant n'est accepté en entrée
 *
 * L'utilisateur vient de `getCurrentUser()`, donc du cookie de session validé
 * auprès de Supabase par `getUser()`. **Il n'y a rien à passer en paramètre**,
 * donc rien à falsifier : lire le quota d'un tiers supposerait de posséder son
 * cookie. La lecture passe en outre par le client de session, filtré par RLS —
 * deux barrières indépendantes.
 *
 * `force-dynamic` + `no-store` : une réponse mise en cache serait servie à un
 * autre compte.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { authenticated: false },
      { status: 200, headers: { "cache-control": "no-store" } },
    );
  }

  const supabase = await createSupabaseServerClient();
  const quota = supabase ? await readQuotaState(supabase, user.id) : null;
  const unmetered = isAdminUser(user);

  return NextResponse.json(
    {
      authenticated: true,
      // L'e-mail vient de la session que l'appelant détient déjà : le renvoyer
      // ne lui apprend rien qu'il ne puisse lire dans son propre jeton.
      email: user.email ?? "",
      /*
       * `plan` et `resetsAt` viennent du même calcul serveur que `remaining`.
       * Les renvoyer évite deux dérives : le menu affichait « resets on the
       * 1st » en dur, une phrase vraie par coïncidence mais recopiée hors de
       * `nextPeriodStart()`, et il ne pouvait pas savoir si une invitation à
       * changer de plan avait un sens pour ce compte.
       *
       * Aucun des deux n'apprend quoi que ce soit sur un tiers : ce sont les
       * données du porteur du cookie, déjà lisibles sur sa page de compte.
       */
      /*
       * `unmetered` est rendu par le **serveur**, à partir de la session
       * validée. Le navigateur ne peut pas le demander, seulement le lire ;
       * l'afficher ne donne aucun privilège, puisque la décision de
       * court-circuiter la réservation est reprise indépendamment dans
       * `/api/generate`. Un client qui mentirait à son propre écran ne
       * gagnerait pas une génération de plus.
       */
      unmetered,
      quota: quota
        ? {
            plan: quota.plan,
            // Un compte non compté n'a pas de reste : `null` force l'écran à
            // dire « unlimited » plutôt qu'à afficher un nombre faux.
            remaining: unmetered ? null : quota.remaining,
            limit: unmetered ? null : quota.limit,
            resetsAt: quota.resetsAt,
          }
        : null,
    },
    { status: 200, headers: { "cache-control": "no-store" } },
  );
}
