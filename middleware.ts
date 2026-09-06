import { NextResponse, type NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/middleware";

/**
 * Routes exigeant une session — build prompt §5.
 *
 * `/generate` s'ajoute aux trois routes listées au §5 : le README §3.2 impose
 * de vérifier l'authentification avant la génération, et le §4bis du build
 * prompt fixe `?next=/generate` comme cible de retour. C'est donc ici que la
 * bascule « déjà connecté / à connecter » est arbitrée, à la requête, plutôt
 * que sur un état client qui peut être périmé.
 */
const PROTECTED_PREFIXES = [
  "/workspace",
  "/prompt",
  "/account",
  "/generate",
  // `/chat` porte des conversations privées : la session est exigée avant même
  // que la RLS intervienne, pour qu'un visiteur anonyme reçoive une redirection
  // plutôt qu'une page vide qui ressemblerait à une conversation supprimée.
  "/chat",
] as const;

function requiresAuth(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export async function middleware(request: NextRequest) {
  const { response, userId } = await updateSession(request);

  const { pathname, search } = request.nextUrl;
  if (!requiresAuth(pathname) || userId) return response;

  // Chemin interne construit ici même : `next` ne peut pas porter d'URL
  // absolue, donc pas de redirection ouverte (§5). La validation à la
  // consommation est refaite côté serveur en phase 3.
  const url = request.nextUrl.clone();
  url.pathname = "/login";
  url.search = "";
  url.searchParams.set("next", `${pathname}${search}`);

  const redirect = NextResponse.redirect(url);
  for (const cookie of response.cookies.getAll()) {
    redirect.cookies.set(cookie);
  }

  return redirect;
}

export const config = {
  matcher: [
    /*
     * Toutes les requêtes sauf :
     *  - les fichiers statiques et les images — la session n'a rien à
     *    rafraîchir sur un SVG de marque ;
     *  - `/api/stripe/webhook` — le §9 exige que ce handler soit exclu de
     *    toute transformation de requête. Aucun cookie n'y a de sens, et rien
     *    ne doit s'interposer avant la vérification de signature sur le corps
     *    brut.
     */
    "/((?!_next/static|_next/image|favicon.ico|brand/|geo/|api/stripe/webhook|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)",
  ],
};
