"use client";

import { usePathname } from "next/navigation";

import { ConversationSidebar } from "@/components/chat/conversation-sidebar";
import { useT } from "@/components/i18n/preferences-provider";
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import type { Conversation } from "@/lib/conversations/types";

/**
 * Coque de l'espace conversationnel.
 *
 * La barre latérale est un seul arbre (`ConversationSidebar` monté une fois).
 * Mobile : tiroir. Desktop : colonne, repliable en offcanvas — jamais en
 * icônes, une conversation n'ayant pas d'icône à afficher.
 *
 * `activeId` vient uniquement de l'URL (§34).
 */
export function ChatShell({
  conversations,
  children,
}: {
  conversations: Conversation[];
  children: React.ReactNode;
}) {
  const t = useT();
  const pathname = usePathname();
  const activeId = pathname?.startsWith("/chat/")
    ? (pathname.split("/")[2] ?? null)
    : null;

  return (
    <SidebarProvider>
      <Sidebar aria-label={t("chat.listAria")}>
        <ConversationSidebar
          conversations={conversations}
          activeId={activeId}
        />
      </Sidebar>
      <SidebarInset>
        <ChatInsetBar />
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

/**
 * Chrome du volet principal : trigger toujours accessible quand la barre
 * n'est pas à l'écran (mobile, ou desktop replié).
 */
function ChatInsetBar() {
  const { open } = useSidebar();

  return (
    <div
      className={
        open
          ? "flex items-center gap-3 border-b border-line px-4 py-3 lg:hidden"
          : "flex items-center gap-3 border-b border-line px-4 py-3"
      }
    >
      <SidebarTrigger />
      <span className="font-display text-[15px] font-semibold text-ink">
        Yelhaa
      </span>
    </div>
  );
}
