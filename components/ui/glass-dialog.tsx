"use client";

import {
  type ComponentProps,
  createContext,
  useId,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface DialogCtx {
  open: boolean;
  setOpen: (v: boolean) => void;
  /** Id partagé entre le panneau et son titre, pour `aria-labelledby`. */
  titleId: string;
  /** Passe à `true` dès qu'un `DialogTitle` est rendu dans ce dialog. */
  hasTitle: boolean;
  registerTitle: () => void;
}
const DialogContext = createContext<DialogCtx>({
  open: false,
  setOpen: () => undefined,
  titleId: "",
  hasTitle: false,
  registerTitle: () => undefined,
});

interface DialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (v: boolean) => void;
  children?: ReactNode;
}

export function Dialog({
  open: controlled,
  defaultOpen = false,
  onOpenChange,
  children,
}: DialogProps) {
  const [internal, setInternal] = useState(defaultOpen);
  const [hasTitle, setHasTitle] = useState(false);
  const titleId = useId();
  const open = controlled !== undefined ? controlled : internal;
  const setOpen = useCallback(
    (v: boolean) => {
      if (controlled === undefined) setInternal(v);
      onOpenChange?.(v);
    },
    [controlled, onOpenChange],
  );
  const registerTitle = useCallback(() => setHasTitle(true), []);

  return (
    <DialogContext.Provider
      value={{ open, setOpen, titleId, hasTitle, registerTitle }}
    >
      {children}
    </DialogContext.Provider>
  );
}

export function DialogTrigger({
  children,
  className,
  ...props
}: ComponentProps<"button">) {
  const { setOpen } = useContext(DialogContext);
  return (
    <button
      type="button"
      className={cn("outline-none", className)}
      onClick={() => setOpen(true)}
      {...props}
    >
      {children}
    </button>
  );
}

type DialogContentProps = ComponentProps<"div">;

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Renders the scrim + panel in a portal on <body>; closes on scrim / Escape.
 *
 * Écart avec le fichier d'origine du registre `@websiteglass` : il gérait
 * `Escape` et le verrouillage du scroll, mais **ni le piégeage du focus ni sa
 * restitution au déclencheur**. Les deux sont exigés par la PARTIE 4 du prompt
 * design et par le §5.5 ; sans eux, un utilisateur au clavier tabule derrière
 * la modale et ne retrouve jamais son point de départ en la fermant.
 */
export function DialogContent({
  children,
  className,
  ...props
}: DialogContentProps) {
  const { open, setOpen, titleId, hasTitle } = useContext(DialogContext);
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;

    const restoreTo = document.activeElement as HTMLElement | null;
    const focusables = () =>
      Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [],
      );

    focusables()[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;

      const items = focusables();
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) return;

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      restoreTo?.focus();
    };
  }, [open, setOpen]);

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 animate-in fade-in-0 duration-200"
        onClick={() => setOpen(false)}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        /*
         * Un `role="dialog"` sans nom accessible s'annonce « dialogue » et
         * rien d'autre. On pointe sur le titre visible quand il existe — c'est
         * la forme à préférer, elle lie l'annonce à ce que l'écran montre. Le
         * repli `aria-label` ne sert qu'aux dialogues sans titre visible, et
         * l'appelant peut le surcharger via `props`.
         */
        {...(hasTitle
          ? { "aria-labelledby": titleId }
          : { "aria-label": "Dialog" })}
        className={cn(
          "relative z-10 w-full max-w-md rounded-[6px] border border-line bg-[#0b0b0b] p-6 text-ink animate-in fade-in-0 zoom-in-95 duration-200",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}

export function DialogTitle({
  children,
  className,
  id,
  ...props
}: ComponentProps<"h2">) {
  const { titleId, registerTitle } = useContext(DialogContext);

  // Signale au panneau qu'il a un titre visible à référencer. Rendu au montage
  // du titre, donc avant que quiconque lise le nom accessible du dialogue.
  useEffect(() => registerTitle(), [registerTitle]);

  return (
    <h2
      id={id ?? titleId}
      className={cn("text-lg font-semibold text-ink", className)}
      {...props}
    >
      {children}
    </h2>
  );
}

export function DialogDescription({
  children,
  className,
  ...props
}: ComponentProps<"p">) {
  return (
    <p className={cn("mt-1.5 text-sm text-ink-2", className)} {...props}>
      {children}
    </p>
  );
}

export function DialogFooter({
  children,
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div className={cn("mt-6 flex justify-end gap-2", className)} {...props}>
      {children}
    </div>
  );
}

export function DialogClose({
  children,
  className,
  ...props
}: ComponentProps<"button">) {
  const { setOpen } = useContext(DialogContext);
  return (
    <button
      type="button"
      className={cn("outline-none", className)}
      onClick={() => setOpen(false)}
      {...props}
    >
      {children}
    </button>
  );
}
