"use client";

import { useState } from "react";
import { FileText, MessageSquare } from "lucide-react";

import { MarkBar, MarkTick } from "@/components/brand/marks";
import { useT } from "@/components/i18n/preferences-provider";
import {
  AGENT_ROLES,
  DEFAULT_AGENT_ROLE,
  type AgentRoleId,
} from "@/lib/config";

export type WorkspaceData = {
  id: string;
  idea: string;
  output: string;
  projectName: string;
  artDirection: string | null;
  tokens: number | null;
  /** Modèle réellement appelé par le moteur. Vide si non configuré. */
  engineModel: string;
};

/** Panneau d'état vide — design §4 : marque manuelle, une ligne, une action au plus. */
function EmptyPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="m-3 border border-line bg-surface p-4">
      <MarkBar draw className="h-2 w-8" />
      <p className="mt-3 text-[13px] text-ink-2">{children}</p>
    </div>
  );
}

/** Colonne gauche — contexte projet. */
export function ContextColumn() {
  const t = useT();
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-line px-3 py-2.5">
        <h2 className="type-label">{t("workspace.context")}</h2>
      </div>

      <ul role="tree" aria-label={t("workspace.files")} className="p-2">
        <li role="treeitem" aria-selected="true" aria-level={1}>
          <span className="relative flex items-center gap-2 bg-surface-2 py-1.5 pl-3 pr-2 type-mono text-ink">
            <span
              aria-hidden="true"
              className="absolute left-0 top-0 h-full w-0.5 bg-volt"
            />
            <FileText
              size={13}
              strokeWidth={1.5}
              aria-hidden="true"
              className="text-ink-3"
            />
            prompt.txt
            <MarkTick draw className="ml-auto size-3" />
          </span>
        </li>
      </ul>

      <div className="mt-auto border-t border-line">
        <div className="px-3 py-2.5">
          <h2 className="type-label">{t("workspace.conversations")}</h2>
        </div>
        <EmptyPanel>{t("workspace.noConversation")}</EmptyPanel>
      </div>
    </div>
  );
}

/** Colonne centrale — conversation et travail. */
export function ConversationColumn({ data }: { data: WorkspaceData }) {
  const t = useT();
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-auto">
        <article className="border-b border-line px-4 py-5">
          <p className="type-label">{t("workspace.you")}</p>
          <p className="mt-2 text-ink">{data.idea}</p>
        </article>

        <article className="border-b border-line px-4 py-5">
          <p className="flex items-center gap-2 type-label text-volt">
            <span aria-hidden="true" className="size-1.5 bg-volt" />
            Yelhaa
          </p>
          <p className="mt-2 text-[14px] text-ink-2">
            {data.artDirection
              ? t("workspace.assembledWith", { name: data.artDirection })
              : t("workspace.assembled")}
          </p>
          <div className="mt-3 border border-line bg-surface">
            <div className="border-b border-line px-3 py-1.5 type-mono text-ink-3">
              prompt.txt
            </div>
            <pre className="max-h-[40vh] overflow-auto whitespace-pre-wrap p-3 type-mono text-ink">
              {data.output}
            </pre>
          </div>
        </article>
      </div>

      {/* Troisième et dernière surface de verre de l'écran (§5.9). */}
      <div className="glass-chrome rounded-none border-x-0 border-b-0 p-3">
        <EmptyPanel>{t("workspace.messagingClosed")}</EmptyPanel>
      </div>
    </div>
  );
}

/** Colonne droite — rôles d'agents. */
export function AgentsColumn({ data }: { data: WorkspaceData }) {
  const t = useT();
  const [role, setRole] = useState<AgentRoleId>(DEFAULT_AGENT_ROLE);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-line px-3 py-2.5">
        <h2 className="type-label">{t("workspace.role")}</h2>
      </div>

      <div
        role="radiogroup"
        aria-label={t("workspace.role")}
        className="flex flex-col gap-1 p-2"
      >
        {AGENT_ROLES.map((entry) => {
          const active = entry.id === role;
          return (
            <button
              key={entry.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setRole(entry.id)}
              className={`flex items-center justify-between border px-3 py-2 text-left type-mono transition-colors duration-[140ms] ${
                active
                  ? "border-volt bg-surface-2 text-ink"
                  : "border-transparent text-ink-2 hover:text-ink"
              }`}
            >
              {t(`workspace.${entry.id}`)}
              <span className="type-label">
                {active ? t("workspace.active") : t("workspace.ready")}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-auto border-t border-line p-3">
        <h2 className="type-label">{t("workspace.engine")}</h2>
        {data.engineModel ? (
          <p className="mt-2 type-mono text-ink-2">{data.engineModel}</p>
        ) : (
          <p className="mt-2 text-[13px] text-ink-2">{t("workspace.noEngine")}</p>
        )}
        <p className="mt-2 text-[12px] text-ink-3">{t("workspace.oneEngine")}</p>
      </div>
    </div>
  );
}

export const WORKSPACE_TABS = [
  { id: "context", label: "Context", icon: FileText },
  { id: "conversation", label: "Conversation", icon: MessageSquare },
  { id: "agents", label: "Agents", icon: MessageSquare },
] as const;
