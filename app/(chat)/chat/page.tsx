import { NewConversation } from "@/components/chat/new-conversation";

/**
 * `/chat` — point de départ, et état vide.
 *
 * Le §16 met en garde contre la multiplication de conversations vides : cette
 * page n'en crée aucune. Elle prépare une conversation **locale**, que le
 * premier message persiste. Cliquer dix fois sur « New conversation » revient
 * donc dix fois ici, sans écrire une seule ligne en base.
 */
export default function NewChatPage() {
  return <NewConversation />;
}
