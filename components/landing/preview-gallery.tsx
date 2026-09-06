"use client";

import dynamic from "next/dynamic";

import { useT } from "@/components/i18n/preferences-provider";
import { YelhaaMarkLoader } from "@/components/brand/yelhaa-node-mark";
import { SectionHeading } from "@/components/landing/section-heading";
import { Reveal } from "@/components/site/reveal";
import type { GalleryPreview } from "@/components/ui/preview-texture";
import { LANDING_ANCHORS } from "@/lib/config";

/**
 * Preview gallery — design decision document §4.3 (the critical section).
 *
 * The WebGL gallery is loaded client-side only, after hydration; the section
 * heading and the text alternative are server-rendered and present without
 * JavaScript. While the chunk loads, the frame holds the product's one loader:
 * the picto drawing itself.
 */
const InfiniteGallery = dynamic(
  () =>
    import("@/components/ui/infinite-gallery").then(
      (module) => module.InfiniteGallery,
    ),
  {
    ssr: false,
    loading: () => (
      <div
        aria-hidden="true"
        className="flex aspect-[16/10] w-full items-center justify-center rounded-[6px] border border-line bg-surface md:aspect-[21/9]"
      >
        <YelhaaMarkLoader size={40} />
      </div>
    ),
  },
);

/**
 * PLACEHOLDER — replace before production (§10.6).
 *
 * These are kinds of things a better prompt can produce, drawn as monochrome
 * wireframes. They are not customer work and are not presented as such.
 */
const PREVIEWS: readonly GalleryPreview[] = [
  { title: "SaaS landing page", seed: 11, layout: "landing" },
  { title: "Analytics dashboard", seed: 23, layout: "dashboard" },
  { title: "Editorial article layout", seed: 37, layout: "editorial" },
  { title: "Mobile app screens", seed: 41, layout: "mobile" },
  { title: "E-commerce catalogue", seed: 53, layout: "commerce" },
  { title: "Developer documentation", seed: 67, layout: "docs" },
  { title: "Product landing page", seed: 71, layout: "landing" },
  { title: "Admin console", seed: 83, layout: "dashboard" },
  { title: "Portfolio site", seed: 97, layout: "editorial" },
  { title: "Storefront", seed: 101, layout: "commerce" },
];

export function PreviewGallery() {
  const t = useT();

  return (
    <section
      id={LANDING_ANCHORS.product}
      aria-label={t("gallery.label")}
      className="mx-auto max-w-[1440px] scroll-mt-20 px-5 py-20 md:px-8 md:py-28"
    >
      <Reveal>
        <SectionHeading
          label={t("gallery.sectionLabel")}
          title={t("gallery.title")}
          description={t("gallery.description")}
        />
      </Reveal>

      <Reveal delayMs={90} className="mt-14">
        <InfiniteGallery
          previews={PREVIEWS}
          label={t("gallery.aria")}
          className="aspect-[16/10] md:aspect-[21/9]"
        />
      </Reveal>
    </section>
  );
}
