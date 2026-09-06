import { YelhaaMarkLoader } from "@/components/brand/yelhaa-node-mark";

/**
 * Route-level loading state for the marketing group.
 *
 * Navigation and footer stay in place (they live in the group layout); the
 * content area shows the product's only loader — the picto drawing itself —
 * and an `aria-live` announcement, since the loader itself is `aria-hidden`.
 */
export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="mx-auto flex min-h-[60dvh] max-w-[1440px] items-center justify-center px-5 py-20 md:px-8"
    >
      <YelhaaMarkLoader size={48} />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
