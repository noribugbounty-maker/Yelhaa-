import type { Metadata } from "next";

import { ChatShell } from "@/components/chat/chat-shell";
import { ChatUnavailable } from "@/components/chat/chat-unavailable";
import { listConversations } from "@/lib/conversations/queries";

export const metadata: Metadata = {
  // Le gabarit de `app/layout.tsx` ajoute déjà « — Yelhaa ». Le répéter ici
  // produisait « Chat — Yelhaa — Yelhaa » dans l'onglet et dans l'historique.
  title: "Chat",
  // Route privée : jamais indexée, jamais suivie.
  robots: { index: false, follow: false },
};

/**
 * Espace conversationnel.
 *
 * La liste est chargée **côté serveur**, une seule fois pour toute la section,
 * et descendue à la coque. Le middleware exige déjà une session sur `/chat` :
 * le rendu ne se produit donc jamais pour un visiteur anonyme, et la RLS filtre
 * par-dessus.
 *
 * `activeId` n'est **pas** passé d'ici. Un layout ne connaît pas les paramètres
 * de route de ses enfants ; la coque le déduit du chemin côté client, ce qui
 * garde une seule source — l'URL — et évite qu'une prop et l'adresse se
 * contredisent (§34).
 *
 * Deux états seulement à ce niveau : indisponible, ou la coque. « Aucune
 * conversation » n'est pas une panne et se rend dans la barre latérale.
 */
export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const result = await listConversations();

  if (result.status === "unavailable") {
    return <ChatUnavailable />;
  }

  return <ChatShell conversations={result.conversations}>{children}</ChatShell>;
}
