"use client";

import { Slot } from "@radix-ui/react-slot";
import { PanelLeft } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ComponentProps,
} from "react";

import { Button } from "@/components/ui/button";
import { useT } from "@/components/i18n/preferences-provider";
import { cn } from "@/lib/utils";

/**
 * Sidebar — primitive shadcn passée au filtre Yelhaa.
 *
 * On garde la mécanique : un Provider, un seul panneau, un trigger, un
 * raccourci. On jette le reste du registre — Sheet, Tooltip, Skeleton,
 * tokens `--sidebar-*`, collapse en icônes, cookie de préférence.
 *
 * ## Pourquoi pas de collapse en icônes
 *
 * Une conversation n'a pas d'icône, seulement un titre. Repliée en pastilles,
 * la liste deviendrait illisible. Le repli desktop est donc **offcanvas** :
 * la barre disparaît entièrement, le trigger la ramène.
 *
 * ## Un seul montage
 *
 * Le panneau est rendu une fois. Mobile et desktop ne sont que deux
 * présentations CSS du même arbre — l'état de recherche survit au resize.
 */

const SIDEBAR_WIDTH = "280px";
const SIDEBAR_WIDTH_MOBILE = "min(300px, 85vw)";
const SIDEBAR_SHORTCUT = "b";
const MOBILE_QUERY = "(max-width: 1023px)";

type SidebarContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  toggleSidebar: () => void;
};

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}

function isMobileViewport() {
  return window.matchMedia(MOBILE_QUERY).matches;
}

function useIsMobile() {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(MOBILE_QUERY);
    const sync = () => setMobile(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return mobile;
}

export function SidebarProvider({
  defaultOpen = true,
  className,
  style,
  children,
  ...props
}: ComponentProps<"div"> & { defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const [openMobile, setOpenMobile] = useState(false);

  const toggleSidebar = useCallback(() => {
    if (isMobileViewport()) setOpenMobile((current) => !current);
    else setOpen((current) => !current);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.key.toLowerCase() === SIDEBAR_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggleSidebar]);

  const value = useMemo<SidebarContextValue>(
    () => ({
      open,
      setOpen,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [open, openMobile, toggleSidebar],
  );

  return (
    <SidebarContext.Provider value={value}>
      <div
        data-slot="sidebar-wrapper"
        style={
          {
            "--sidebar-width": SIDEBAR_WIDTH,
            "--sidebar-width-mobile": SIDEBAR_WIDTH_MOBILE,
            ...style,
          } as CSSProperties
        }
        className={cn("flex h-[100dvh] w-full overflow-hidden", className)}
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

export function Sidebar({
  className,
  children,
  ...props
}: ComponentProps<"div">) {
  const { open, openMobile, setOpenMobile } = useSidebar();
  const isMobile = useIsMobile();
  const panelRef = useRef<HTMLElement>(null);
  const hidden = isMobile ? !openMobile : !open;

  useEffect(() => {
    if (!openMobile) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenMobile(false);
    };
    document.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current
      ?.querySelector<HTMLElement>("a, input, button")
      ?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [openMobile, setOpenMobile]);

  return (
    <>
      <div
        aria-hidden="true"
        className={cn(
          "hidden shrink-0 transition-[width] duration-[140ms] ease-[var(--ease-cut)] lg:block",
          open ? "w-[var(--sidebar-width)]" : "w-0",
        )}
      />

      {openMobile ? (
        <div
          aria-hidden="true"
          onPointerDown={() => setOpenMobile(false)}
          className="fixed inset-0 z-40 bg-void/70 lg:hidden"
        />
      ) : null}

      <aside
        ref={panelRef}
        id="chat-sidebar"
        data-slot="sidebar"
        data-mobile-open={openMobile}
        data-desktop-open={open}
        aria-hidden={hidden}
        inert={hidden || undefined}
        className={cn(
          "glass-chrome flex h-full flex-col rounded-none border-y-0 border-l-0",
          "fixed inset-y-0 left-0 z-50 w-[var(--sidebar-width-mobile)] transition-transform duration-[140ms] ease-[var(--ease-cut)]",
          "lg:z-10 lg:w-[var(--sidebar-width)]",
          openMobile ? "max-lg:translate-x-0" : "max-lg:-translate-x-full",
          open ? "lg:translate-x-0" : "lg:-translate-x-full",
          className,
        )}
        {...props}
      >
        {children}
      </aside>
    </>
  );
}

export function SidebarTrigger({
  className,
  onClick,
  ...props
}: ComponentProps<typeof Button>) {
  const t = useT();
  const { toggleSidebar, open, openMobile } = useSidebar();
  const expanded = open || openMobile;

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      data-slot="sidebar-trigger"
      aria-label={expanded ? t("nav.hideSidebar") : t("nav.showSidebar")}
      aria-expanded={expanded}
      aria-controls="chat-sidebar"
      className={cn("size-8 text-ink-2 hover:text-ink", className)}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      <PanelLeft className="size-4" aria-hidden="true" />
    </Button>
  );
}

export function SidebarInset({
  className,
  ...props
}: ComponentProps<"main">) {
  return (
    <main
      data-slot="sidebar-inset"
      className={cn("flex min-h-0 min-w-0 flex-1 flex-col", className)}
      {...props}
    />
  );
}

export function SidebarHeader({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-header"
      className={cn("flex flex-col gap-3 p-3", className)}
      {...props}
    />
  );
}

export function SidebarContent({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-content"
      className={cn("flex min-h-0 flex-1 flex-col overflow-y-auto", className)}
      {...props}
    />
  );
}

export function SidebarFooter({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-footer"
      className={cn("flex flex-col gap-2 border-t border-line p-3", className)}
      {...props}
    />
  );
}

export function SidebarGroup({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group"
      className={cn("flex min-w-0 flex-col", className)}
      {...props}
    />
  );
}

export function SidebarGroupLabel({
  className,
  ...props
}: ComponentProps<"h2">) {
  return (
    <h2
      data-slot="sidebar-group-label"
      className={cn("type-label px-3 pb-1.5 pt-4", className)}
      {...props}
    />
  );
}

export function SidebarGroupContent({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group-content"
      className={cn("w-full", className)}
      {...props}
    />
  );
}

export function SidebarMenu({
  className,
  ...props
}: ComponentProps<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu"
      className={cn("flex w-full min-w-0 flex-col gap-0.5", className)}
      {...props}
    />
  );
}

export function SidebarMenuItem({
  className,
  ...props
}: ComponentProps<"li">) {
  return (
    <li
      data-slot="sidebar-menu-item"
      className={cn("relative", className)}
      {...props}
    />
  );
}

export function SidebarMenuButton({
  className,
  asChild = false,
  isActive = false,
  ...props
}: ComponentProps<"button"> & { asChild?: boolean; isActive?: boolean }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      {...(asChild ? {} : { type: "button" as const })}
      data-slot="sidebar-menu-button"
      data-active={isActive}
      className={cn(
        "flex h-[38px] w-full items-center gap-2 rounded-[6px] px-3 text-left text-[14px] text-ink transition-colors duration-[140ms]",
        "hover:bg-surface-2 hover:text-ink",
        "data-[active=true]:border data-[active=true]:border-volt data-[active=true]:bg-surface-2",
        className,
      )}
      {...props}
    />
  );
}
