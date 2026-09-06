import { NextResponse } from "next/server";

import { getConversation } from "@/lib/conversations/queries";

/**
 * `GET /api/conversations/[id]/export` — la conversation et ses messages.
 *
 * **La sécurité ne tient pas à cette route.** `getConversation` passe par le
 * client de session : la RLS filtre avant que la moindre ligne remonte. Un
 * identifiant étranger rend zéro ligne, donc 404 — et le code n'a même pas de
 * quoi distinguer « inexistante » de « pas à vous », ce qui empêche la fuite
 * par message d'erreur.
 *
 * La forme rendue est celle de `ConversationWithMessages` : ni `user_id`, ni
 * métadonnée interne. Un champ sensible ajouté un jour à la table ne peut pas
 * sortir ici tant qu'il n'est pas ajouté au type.
 *
 * `force-dynamic` : la réponse dépend de la session, une mise en cache la
 * servirait à quelqu'un d'autre.
 */
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const result = await getConversation(id);

  if (result.status === "unavailable") {
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }
  if (result.status === "not-found") {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json(result.conversation, {
    headers: { "cache-control": "no-store" },
  });
}
