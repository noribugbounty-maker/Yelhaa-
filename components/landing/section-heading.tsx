import type { ReactNode } from "react";

import { TextBlockAnimation } from "@/components/ui/text-block-animation";
import { cn } from "@/lib/utils";

/**
 * Shared heading block for landing sections: mono label, animated title,
 * one paragraph. Alignment is a prop because the narrative alternates
 * between centred and left-aligned sections.
 */
export function SectionHeading({
  label,
  title,
  description,
  align = "center",
  className,
}: {
  label: string;
  title: string;
  description?: ReactNode;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex max-w-2xl flex-col",
        align === "center" ? "mx-auto items-center text-center" : "items-start",
        className,
      )}
    >
      <p className="type-label">{label}</p>
      <TextBlockAnimation as="h2" className="mt-4 type-h2 text-ink text-balance">
        {title}
      </TextBlockAnimation>
      {description ? (
        <p className="mt-5 max-w-[58ch] text-[16px] leading-[1.65] text-ink-2 text-balance">
          {description}
        </p>
      ) : null}
    </div>
  );
}
