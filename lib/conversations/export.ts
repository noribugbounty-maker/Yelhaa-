import type { ConversationWithMessages } from "@/lib/conversations/types";

/**
 * Export d'une conversation — Markdown et JSON.
 *
 * ## Ce qui ne sort jamais
 *
 * Ces fonctions ne reçoivent que `ConversationWithMessages`, une forme qui ne
 * porte **ni `user_id`, ni jeton, ni compteur, ni métadonnée interne**. Le
 * cloisonnement est structurel, pas déclaratif : il n'y a rien à filtrer parce
 * qu'il n'y a rien à cacher dans le type. Un champ sensible ajouté un jour à la
 * ligne de base ne peut pas fuir ici tant qu'il n'est pas ajouté au type, ce
 * qui se voit en revue.
 *
 * Les données proviennent toujours d'une lecture déjà filtrée par la RLS :
 * exporter la conversation d'autrui suppose d'abord de pouvoir la lire, ce que
 * la base refuse.
 */

/** Le rôle assistant s'affiche sous le nom du produit, pas « assistant ». */
const ROLE_LABEL: Record<string, string> = {
  user: "You",
  assistant: "Yelhaa",
};

function isoDay(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toISOString();
}

/**
 * Markdown lisible tel quel, et re-lisible par une machine.
 *
 * Le contenu des messages n'est **pas** échappé : c'est du markdown que
 * l'utilisateur a écrit ou reçu, et le ré-échapper produirait un document
 * illisible. Le risque d'injection n'existe pas ici — la sortie est un fichier
 * téléchargé, jamais du HTML rendu.
 */
export function toMarkdown(conversation: ConversationWithMessages): string {
  const lines: string[] = [
    `# ${conversation.title}`,
    "",
    `_Exported ${isoDay(new Date().toISOString())}_`,
    "",
  ];

  if (conversation.messages.length === 0) {
    lines.push("_No messages yet._", "");
    return lines.join("\n");
  }

  for (const message of conversation.messages) {
    lines.push(`## ${ROLE_LABEL[message.role] ?? message.role}`, "");
    lines.push(message.content.trim(), "");
  }

  return lines.join("\n");
}

/**
 * JSON stable — la forme est le contrat, pas un vidage de la ligne SQL.
 *
 * Sérialiser directement l'objet de base exporterait chaque colonne ajoutée
 * par une migration future, y compris celles qui n'ont rien à faire dans un
 * export. Les champs sont donc listés un par un.
 */
export function toJson(conversation: ConversationWithMessages): string {
  return JSON.stringify(
    {
      conversation: {
        id: conversation.id,
        title: conversation.title,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
      },
      messages: conversation.messages.map((message) => ({
        id: message.id,
        role: message.role,
        content: message.content,
        createdAt: message.createdAt,
      })),
      exportedAt: new Date().toISOString(),
    },
    null,
    2,
  );
}

/**
 * Copie en texte brut — ni titres markdown, ni horodatage.
 *
 * C'est ce qu'on colle dans un message ou un ticket : les libellés de rôle
 * suffisent à garder le fil lisible.
 */
export function toPlainText(conversation: ConversationWithMessages): string {
  return conversation.messages
    .map(
      (message) =>
        `${ROLE_LABEL[message.role] ?? message.role}:\n${message.content.trim()}`,
    )
    .join("\n\n");
}

/**
 * Nom de fichier dérivé du titre.
 *
 * Toute la ponctuation est écrasée : un titre contenant `/`, `..` ou un
 * caractère interdit par le système de fichiers produirait un téléchargement
 * refusé, voire un chemin inattendu.
 */
export function exportFilename(
  conversation: ConversationWithMessages,
  extension: "md" | "json",
): string {
  const slug =
    conversation.title
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "conversation";
  return `${slug}.${extension}`;
}
