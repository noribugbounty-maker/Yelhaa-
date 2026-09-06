"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  deleteConversationAction,
  renameConversationAction,
} from "@/app/(chat)/actions";
import { useT } from "@/components/i18n/preferences-provider";
import { YelhaaMark } from "@/components/brand/yelhaa-node-mark";
import { ThemeLanguageBar } from "@/components/site/theme-language-bar";
import { ConversationRow } from "@/components/chat/conversation-row";
import { DeleteConversationDialog } from "@/components/chat/delete-dialog";
import { ExportConversationDialog } from "@/components/chat/export-dialog";
import { AccountNav } from "@/components/site/account-nav";
import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  groupConversations,
  searchConversations,
} from "@/lib/conversations/organize";
import type { Conversation } from "@/lib/conversations/types";

/**
 * Barre latérale des conversations.
 *
 * ## Optimisme borné
 *
 * Le §33 autorise l'optimisme sur le renommage et la suppression, à condition
 * que le retour arrière soit propre. La liste locale est modifiée
 * immédiatement, et restaurée telle quelle si le serveur refuse.
 *
 * ## Ce que la recherche ne fait pas
 *
 * Elle filtre les titres déjà en mémoire. Chercher dans le corps des messages
 * exigerait un index plein texte en base ; tant qu'il n'existe pas, prétendre
 * le faire donnerait des résultats vides et incompréhensibles.
 */
export function ConversationSidebar({
  conversations: initial,
  activeId,
}: {
  conversations: Conversation[];
  activeId: string | null;
}) {
  const t = useT();
  const router = useRouter();
  const { setOpenMobile } = useSidebar();
  const [conversations, setConversations] = useState(initial);
  const [query, setQuery] = useState("");
  const [toDelete, setToDelete] = useState<Conversation | null>(null);
  const [toExport, setToExport] = useState<Conversation | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const closeMobile = useCallback(() => setOpenMobile(false), [setOpenMobile]);

  useEffect(() => setConversations(initial), [initial]);

  /*
   * `Cmd/Ctrl + K` — le §31 impose de vérifier les conflits. Ce raccourci ne
   * touche à rien dans Chrome, Firefox ni Safari. `Cmd/Ctrl + B` bascule la
   * barre (géré par le Provider).
   */
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
        searchRef.current?.select();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const visible = useMemo(
    () => searchConversations(conversations, query),
    [conversations, query],
  );
  const groups = useMemo(() => groupConversations(visible), [visible]);

  const rename = useCallback(
    async (id: string, title: string): Promise<string | null> => {
      const previous = conversations;
      const trimmed = title.trim().replace(/\s+/g, " ");
      setConversations((list) =>
        list.map((c) => (c.id === id ? { ...c, title: trimmed } : c)),
      );

      const result = await renameConversationAction(id, title);
      if (!result.ok) {
        setConversations(previous);
        return result.message;
      }
      router.refresh();
      return null;
    },
    [conversations, router],
  );

  const confirmDelete = useCallback(
    async (conversation: Conversation): Promise<string | null> => {
      const previous = conversations;
      setConversations((list) => list.filter((c) => c.id !== conversation.id));

      const result = await deleteConversationAction(conversation.id);
      if (!result.ok) {
        setConversations(previous);
        return result.message;
      }

      setToDelete(null);
      if (conversation.id === activeId) {
        const next = previous.find((c) => c.id !== conversation.id);
        router.push(next ? `/chat/${next.id}` : "/chat");
      }
      router.refresh();
      return null;
    },
    [activeId, conversations, router],
  );

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center justify-between px-1">
          <Link href="/" aria-label={t("nav.homeAria")} onClick={closeMobile}>
            <YelhaaMark size={22} title="Yelhaa" />
          </Link>
          <SidebarTrigger className="hidden lg:inline-flex" />
        </div>

        <SidebarMenuButton
          asChild
          className="border border-line hover:border-line-strong"
        >
          <Link href="/chat" onClick={closeMobile}>
            <Plus className="size-4" aria-hidden="true" />
            {t("chat.new")}
          </Link>
        </SidebarMenuButton>

        <div>
          <label htmlFor="conversation-search" className="sr-only">
            {t("chat.searchAria")}
          </label>
          <input
            ref={searchRef}
            id="conversation-search"
            type="search"
            value={query}
            placeholder={t("chat.search")}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape" && query) {
                event.stopPropagation();
                setQuery("");
              }
            }}
            className="glass-inset h-[36px] w-full rounded-[6px] px-3 text-[13.5px] text-ink outline-none placeholder:text-ink-3 focus:border-volt"
          />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <nav aria-label={t("chat.listAria")} className="min-h-0 flex-1 pb-2">
          {conversations.length === 0 ? (
            <p className="px-4 py-6 text-[13.5px] text-ink-3">
              {t("chat.empty")}
            </p>
          ) : visible.length === 0 ? (
            <p className="px-4 py-6 text-[13.5px] text-ink-3">
              {t("chat.noneFound")}
            </p>
          ) : (
            groups.map((group) => (
              <SidebarGroup key={group.id}>
                <SidebarGroupLabel id={`group-${group.id}`}>
                  {t(`chat.${group.id}`)}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu aria-labelledby={`group-${group.id}`}>
                    {group.conversations.map((conversation) => (
                      <ConversationRow
                        key={conversation.id}
                        conversation={conversation}
                        active={conversation.id === activeId}
                        onRename={rename}
                        onDelete={setToDelete}
                        onExport={setToExport}
                        onNavigate={closeMobile}
                      />
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))
          )}
        </nav>
      </SidebarContent>

      <SidebarFooter>
        <ThemeLanguageBar className="px-1 pb-1" />
        <AccountNav layout="row" />
      </SidebarFooter>

      {toDelete ? (
        <DeleteConversationDialog
          conversation={toDelete}
          onCancel={() => setToDelete(null)}
          onConfirm={confirmDelete}
        />
      ) : null}

      {toExport ? (
        <ExportConversationDialog
          conversation={toExport}
          onClose={() => setToExport(null)}
        />
      ) : null}
    </>
  );
}
