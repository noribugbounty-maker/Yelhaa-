"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Download, FileText, MessageSquare, Users } from "lucide-react";

import { YelhaaMark } from "@/components/brand/yelhaa-node-mark";
import { useT } from "@/components/i18n/preferences-provider";
import { ThemeLanguageBar } from "@/components/site/theme-language-bar";
import {
  AgentsColumn,
  ContextColumn,
  ConversationColumn,
  type WorkspaceData,
} from "@/components/workspace/columns";

const TABS = [
  { id: "context", labelKey: "workspace.context", Icon: FileText },
  { id: "conversation", labelKey: "workspace.conversation", Icon: MessageSquare },
  { id: "agents", labelKey: "workspace.agents", Icon: Users },
] as const;

type TabId = (typeof TABS)[number]["id"];

const MIN_LEFT = 200;
const MAX_LEFT = 380;
const MIN_RIGHT = 240;
const MAX_RIGHT = 420;

/**
 * Espace de travail multi-IA — design prompt §3.5.
 *
 * « La densité **est** l'esthétique ici — on ne l'aère pas, on la structure. »
 *
 * Trois colonnes séparées par des filets, redimensionnables. En dessous de
 * `lg`, trois onglets en bas d'écran à 44px : on sépare les colonnes, on ne
 * les compresse jamais.
 *
 * **Le verre y est rationné à trois surfaces** (§5.9) : la barre supérieure,
 * la barre inférieure, et la zone de saisie collée en bas du centre. Tout le
 * reste est opaque — arborescence, messages, colonne de droite. Le fond est
 * `--void` uni plus le grain : ni champ plasma, ni lavis, l'espace de travail
 * est dense et le fond s'efface derrière lui.
 */
export function WorkspaceShell({ data }: { data: WorkspaceData }) {
  const t = useT();
  const [tab, setTab] = useState<TabId>("conversation");
  const [leftWidth, setLeftWidth] = useState(240);
  const [rightWidth, setRightWidth] = useState(280);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragging = useRef<"left" | "right" | null>(null);

  useEffect(
    () => () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
    },
    [],
  );

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      if (dragging.current === "left") {
        setLeftWidth(Math.min(MAX_LEFT, Math.max(MIN_LEFT, event.clientX)));
      } else if (dragging.current === "right") {
        setRightWidth(
          Math.min(
            MAX_RIGHT,
            Math.max(MIN_RIGHT, window.innerWidth - event.clientX),
          ),
        );
      }
    };
    const onUp = () => {
      dragging.current = null;
      document.body.style.userSelect = "";
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  const startDrag = (side: "left" | "right") => () => {
    dragging.current = side;
    document.body.style.userSelect = "none";
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(data.output);
      setCopied(true);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 1600);
    } catch {
      console.error("[workspace] copie refusée par le navigateur");
    }
  };

  const download = () => {
    const blob = new Blob([data.output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${data.projectName}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative flex h-dvh flex-col">
      {/* Barre supérieure — 44px, sorties du README §6bis à droite. */}
      <header className="glass-chrome flex h-11 shrink-0 items-center justify-between rounded-none border-x-0 border-t-0 px-3">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            aria-label={t("nav.homeAria")}
            className="flex items-center"
          >
            <YelhaaMark size={18} />
          </Link>
          <span className="type-mono text-ink-2">{data.projectName}</span>
        </div>

        <div className="flex items-center gap-2">
          <ThemeLanguageBar className="hidden sm:flex" />
          <button
            type="button"
            onClick={copy}
            aria-label={t("workspace.copy")}
            className="flex size-9 items-center justify-center text-ink-2 transition-colors duration-[140ms] hover:text-ink"
          >
            {copied ? (
              <Check
                size={16}
                strokeWidth={1.5}
                aria-hidden="true"
                className="text-volt"
              />
            ) : (
              <FileText size={16} strokeWidth={1.5} aria-hidden="true" />
            )}
          </button>
          <span aria-hidden="true" className="mx-1 h-5 w-px bg-line" />
          <button
            type="button"
            onClick={download}
            aria-label={t("workspace.download")}
            className="flex size-9 items-center justify-center text-ink-2 transition-colors duration-[140ms] hover:text-ink"
          >
            <Download size={16} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* Trois colonnes à partir de lg. */}
      <div className="hidden min-h-0 flex-1 lg:flex">
        <aside
          style={{ width: leftWidth }}
          className="min-h-0 shrink-0 overflow-auto"
        >
          <ContextColumn />
        </aside>
        <div
          role="separator"
          aria-orientation="vertical"
          aria-label={t("workspace.resizeContext")}
          onPointerDown={startDrag("left")}
          className="w-px shrink-0 cursor-col-resize bg-line hover:bg-line-strong"
        />

        <main className="min-w-0 flex-1 overflow-hidden">
          <ConversationColumn data={data} />
        </main>

        <div
          role="separator"
          aria-orientation="vertical"
          aria-label={t("workspace.resizeAgents")}
          onPointerDown={startDrag("right")}
          className="w-px shrink-0 cursor-col-resize bg-line hover:bg-line-strong"
        />
        <aside
          style={{ width: rightWidth }}
          className="min-h-0 shrink-0 overflow-auto"
        >
          <AgentsColumn data={data} />
        </aside>
      </div>

      {/* En dessous de lg : trois onglets, jamais trois colonnes compressées. */}
      <div className="flex min-h-0 flex-1 flex-col lg:hidden">
        <div className="min-h-0 flex-1 overflow-auto">
          {tab === "context" ? <ContextColumn /> : null}
          {tab === "conversation" ? <ConversationColumn data={data} /> : null}
          {tab === "agents" ? <AgentsColumn data={data} /> : null}
        </div>

        <nav aria-label={t("workspace.sections")} className="border-t border-line">
          <ul className="flex">
            {TABS.map((entry) => {
              const active = entry.id === tab;
              return (
                <li key={entry.id} className="flex-1">
                  <button
                    type="button"
                    aria-current={active ? "true" : undefined}
                    onClick={() => setTab(entry.id)}
                    className={`relative flex h-11 w-full flex-col items-center justify-center gap-0.5 text-[11px] ${
                      active ? "text-ink" : "text-ink-2"
                    }`}
                  >
                    {active ? (
                      <motion.span
                        layoutId="workspace-tab"
                        aria-hidden="true"
                        transition={{ duration: 0.22, ease: [0.2, 0, 0, 1] }}
                        className="absolute inset-x-0 top-0 h-0.5 bg-volt"
                      />
                    ) : null}
                    <entry.Icon
                      size={15}
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                    {t(entry.labelKey)}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Barre inférieure — 28px, mono 11px, un mot avec chaque pastille. */}
      <footer className="glass-chrome hidden h-7 shrink-0 items-center gap-4 rounded-none border-x-0 border-b-0 px-3 font-mono text-[11px] text-ink-3 lg:flex">
        <span>
          {data.tokens === null
            ? t("workspace.noTokens")
            : t("workspace.tokens", { n: data.tokens })}
        </span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-ok" />
          {t("workspace.connected")}
        </span>
      </footer>
    </div>
  );
}
