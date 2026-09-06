"use client";

import { useEffect, useRef, type CSSProperties } from "react";

/**
 * Entrée au scroll — design prompt §3.1.
 *
 * `opacity 0 → 1` et `y -6 → 0`, 220ms, déclenchée **une seule fois** à
 * l'entrée dans le viewport, par un `IntersectionObserver` qui pose une
 * classe. Pas de `motion`, pas de `framer-motion` : la bibliothèque n'est
 * autorisée qu'à partir de la phase 7, sur `/prompt` et `/workspace`.
 *
 * L'état de repos est l'état final : si rien ne tourne, tout est visible et
 * bien placé. `prefers-reduced-motion` supprime décalage et translation.
 */
type RevealStyle = CSSProperties & { "--enter-delay"?: string };

export function Reveal({
  children,
  delayMs = 0,
  className,
}: {
  children: React.ReactNode;
  delayMs?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        element.classList.add("is-visible");
        observer.disconnect();
      },
      { threshold: 0.1 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const style: RevealStyle = { "--enter-delay": `${delayMs}ms` };

  return (
    <div ref={ref} style={style} className={`reveal ${className ?? ""}`}>
      {children}
    </div>
  );
}
