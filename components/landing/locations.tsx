"use client";

import { useT } from "@/components/i18n/preferences-provider";
import { SectionHeading } from "@/components/landing/section-heading";
import { Reveal } from "@/components/site/reveal";
import { RotatingEarth, type EarthMarker } from "@/components/ui/rotating-earth";

const ILLUSTRATIVE_MARKERS: readonly EarthMarker[] = [
  { coordinates: [-74, 40.7] },
  { coordinates: [-122.4, 37.8] },
  { coordinates: [-46.6, -23.5] },
  { coordinates: [2.3, 48.8] },
  { coordinates: [13.4, 52.5] },
  { coordinates: [36.8, -1.3] },
  { coordinates: [77.2, 28.6] },
  { coordinates: [103.8, 1.35] },
  { coordinates: [139.7, 35.7] },
  { coordinates: [151.2, -33.9] },
];

const AUDIENCE_KEYS = [
  "developers",
  "designers",
  "founders",
  "marketers",
  "creators",
  "teams",
] as const;

export function Locations() {
  const t = useT();

  return (
    <section aria-label={t("locations.aria")} className="border-t border-line">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-20 md:px-8 md:py-28 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div className="order-2 lg:order-1">
          <Reveal>
            <SectionHeading
              align="left"
              label={t("locations.label")}
              title={t("locations.title")}
              description={t("locations.description")}
            />
          </Reveal>

          <Reveal delayMs={120}>
            <ul className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-[6px] border border-line bg-line sm:grid-cols-3">
              {AUDIENCE_KEYS.map((key) => (
                <li
                  key={key}
                  className="bg-void px-4 py-3.5 text-[14px] text-ink-2"
                >
                  {t(`locations.${key}`)}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="order-1 mx-auto w-full max-w-[520px] lg:order-2 lg:max-w-none">
          <Reveal delayMs={60}>
            <RotatingEarth
              markers={ILLUSTRATIVE_MARKERS}
              label={t("locations.globe")}
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
