/**
 * Formes partagées du système conversationnel.
 *
 * Ces types décrivent ce que le **client** manipule, pas les lignes brutes de
 * la base. `user_id` en est volontairement absent : l'interface n'en a jamais
 * besoin — la RLS a déjà filtré — et un identifiant qui ne sert à rien finit
 * par se retrouver dans un export.
 */

export type MessageRole = "user" | "assistant";

export type ConversationMessage = {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
  /** Génération à l'origine du message, quand il y en a une. */
  generationId: string | null;
};

export type Conversation = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};

export type ConversationWithMessages = Conversation & {
  messages: ConversationMessage[];
};

/** Bornes de titre — reprises telles quelles par la contrainte SQL. */
export const TITLE_MIN_LENGTH = 1;
export const TITLE_MAX_LENGTH = 120;
