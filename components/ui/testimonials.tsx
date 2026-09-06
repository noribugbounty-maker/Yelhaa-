"use client";

import { Marquee } from "@/components/ui/marquee";

/**
 * Testimonials — design decision document §4.7 and §7.5.
 *
 * Two marquee rows, the first scrolling left, the second right, both paused
 * on hover and frozen into a scrollable list under `prefers-reduced-motion`
 * (handled by `Marquee`). Compact cards: quote, name, role. No avatars, no
 * company logos, no star ratings — nothing that would dress a placeholder
 * up as a verified customer.
 *
 * No content lives here; the caller injects the items.
 */

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

function Card({ item }: { item: Testimonial }) {
  return (
    <li className="mx-2 w-[300px] shrink-0 md:w-[340px]">
      <figure className="flex h-full flex-col justify-between rounded-[6px] border border-line bg-surface p-5">
        <blockquote className="text-[14.5px] leading-[1.55] text-ink">
          {item.quote}
        </blockquote>
        <figcaption className="mt-5 flex items-baseline justify-between gap-3">
          <span className="text-[13px] font-medium text-ink">{item.name}</span>
          <span className="type-label truncate">{item.role}</span>
        </figcaption>
      </figure>
    </li>
  );
}

export function Testimonials({
  items,
  label,
}: {
  items: readonly Testimonial[];
  label: string;
}) {
  const half = Math.ceil(items.length / 2);
  const first = items.slice(0, half);
  const second = items.slice(half);

  return (
    <div className="flex flex-col gap-4">
      <Marquee
        label={`${label} — row 1`}
        duration="56s"
        renderItems={() => (
          <>
            {first.map((item) => (
              <Card key={item.name} item={item} />
            ))}
          </>
        )}
      />
      <Marquee
        label={`${label} — row 2`}
        duration="64s"
        reverse
        renderItems={() => (
          <>
            {(second.length > 0 ? second : first).map((item) => (
              <Card key={item.name} item={item} />
            ))}
          </>
        )}
      />
    </div>
  );
}
