import { notFound } from "next/navigation";

import { ConversationView } from "@/components/chat/conversation-view";
import { ServiceUnavailable } from "@/components/site/service-unavailable";
import { getConversation } from "@/lib/conversations/queries";

/**
 * `/chat/[id]` — une conversation.
 *
 * Recharger l'URL restaure exactement la conversation : tout est lu depuis la
 * base, rien n'est gardé en mémoire côté client.
 *
 * Un identifiant appartenant à quelqu'un d'autre rend **404**, comme un
 * identifiant inexistant. La RLS ne renvoie aucune ligne dans les deux cas :
 * le code n'a pas de quoi les distinguer, donc il ne peut pas trahir
 * l'existence d'une conversation étrangère.
 */
export default async function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getConversation(id);

  if (result.status === "unavailable") {
    return (
      <div className="mx-auto max-w-md px-5 py-24">
        <ServiceUnavailable
          title="Couldn't load this conversation"
          description="Something went wrong on our side. Try again in a moment."
        />
      </div>
    );
  }
  if (result.status === "not-found") notFound();

  return <ConversationView conversation={result.conversation} />;
}
