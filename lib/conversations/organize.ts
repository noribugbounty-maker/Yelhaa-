import type { Conversation } from "@/lib/conversations/types";

/**
 * Regroupement par date, tri et recherche — trois fonctions **pures**.
 *
 * Aucune ne touche au réseau ni à l'horloge globale : `now` est un paramètre.
 * C'est ce qui rend le regroupement testable à minuit, au changement d'heure
 * et à la frontière exacte de chaque seuil, sans attendre le lendemain.
 */

export type BucketId = "today" | "yesterday" | "last7" | "last30" | "older";

export type ConversationGroup = {
  id: BucketId;
  label: string;
  conversations: Conversation[];
};

const LABELS: Record<BucketId, string> = {
  today: "Today",
  yesterday: "Yesterday",
  last7: "Previous 7 days",
  last30: "Previous 30 days",
  older: "Older",
};

/** Ordre d'affichage. Un groupe vide n'est jamais rendu. */
const ORDER: BucketId[] = ["today", "yesterday", "last7", "last30", "older"];

/**
 * Minuit local du jour de `date`.
 *
 * **Le regroupement compare des jours calendaires, pas des durées.** Une
 * différence en millisecondes divisée par 86 400 000 classerait « hier 23h »
 * dans « aujourd'hui » quand il est 1h du matin — c'est le bug classique. En
 * ramenant les deux dates à leur minuit local, on compare ce que l'utilisateur
 * appelle un jour, dans **son** fuseau, celui du navigateur.
 */
function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * Nombre de jours calendaires entre deux instants.
 *
 * L'arrondi absorbe les heures perdues ou gagnées au passage à l'heure d'été :
 * deux minuits locaux consécutifs peuvent être séparés de 23 ou 25 heures, et
 * cela doit rester « 1 jour ».
 */
export function calendarDaysBetween(from: Date, to: Date): number {
  const a = startOfLocalDay(from).getTime();
  const b = startOfLocalDay(to).getTime();
  return Math.round((b - a) / 86_400_000);
}

export function bucketFor(updatedAt: string | Date, now: Date): BucketId {
  const date = updatedAt instanceof Date ? updatedAt : new Date(updatedAt);
  const days = calendarDaysBetween(date, now);

  // Une date future — horloge client en avance, écriture concurrente — est
  // traitée comme aujourd'hui plutôt que de tomber dans « Older ».
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days <= 7) return "last7";
  if (days <= 30) return "last30";
  return "older";
}

/** Tri de la barre latérale : la plus récemment utilisée en premier. */
export function sortByUpdatedAt(
  conversations: readonly Conversation[],
): Conversation[] {
  return [...conversations].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

/**
 * Regroupe et trie. Les groupes vides ne sont pas rendus — une section
 * « Yesterday » sans contenu ne fait qu'ajouter du bruit.
 */
export function groupConversations(
  conversations: readonly Conversation[],
  now: Date = new Date(),
): ConversationGroup[] {
  const buckets = new Map<BucketId, Conversation[]>();

  for (const conversation of sortByUpdatedAt(conversations)) {
    const id = bucketFor(conversation.updatedAt, now);
    const list = buckets.get(id);
    if (list) list.push(conversation);
    else buckets.set(id, [conversation]);
  }

  return ORDER.filter((id) => (buckets.get(id)?.length ?? 0) > 0).map((id) => ({
    id,
    label: LABELS[id],
    conversations: buckets.get(id) ?? [],
  }));
}

/**
 * Normalisation de recherche — insensible à la casse **et aux accents**.
 *
 * Sans `NFD`, chercher « resume » ne trouverait pas « résumé ». La
 * décomposition sépare la lettre de son accent, que la plage `̀-ͯ`
 * supprime ensuite.
 */
function normalize(value: string): string {
  return value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

/**
 * Filtre par titre.
 *
 * La recherche porte sur ce que la barre latérale a **déjà en mémoire** : elle
 * est donc instantanée et ne déclenche aucune requête. Chercher dans le corps
 * des messages exigerait un index plein texte côté base ; tant qu'il n'existe
 * pas, prétendre le faire produirait des résultats muets et incompréhensibles.
 */
export function searchConversations(
  conversations: readonly Conversation[],
  query: string,
): Conversation[] {
  const needle = normalize(query);
  if (!needle) return [...conversations];
  return conversations.filter((conversation) =>
    normalize(conversation.title).includes(needle),
  );
}
