import { ImageResponse } from "next/og";

import { brandAssetDataUri } from "@/lib/brand-assets";
import { SITE } from "@/lib/config";

/**
 * Social preview — served by Next at `/opengraph-image`.
 *
 * Every page emits `twitter:card = summary_large_image`, a card that promises
 * a large image; without an `og:image` X, LinkedIn and Slack fall back to a
 * bare text card. This file is that image.
 *
 * Generated, not committed: composed at build time from the design tokens
 * (`#050505` background, `#F5F5F5` / `#8A8A8A` type) and the brand lockup
 * read from `public/brand/`, so a change to the name, the promise or the
 * mark never leaves a stale PNG behind.
 *
 * No web font is loaded: the render uses the face bundled with `next/og`.
 * Fetching a remote font would make the build depend on a network call.
 *
 * Next attaches this file to `og:image` and `twitter:image` for every page
 * that does not declare its own.
 */
export const runtime = "nodejs";
export const alt = `${SITE.name} — ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Le lockup n'est plus un SVG unique : c'est le picto carré (viewBox 100×100)
 * suivi du wordmark composé. Les rapports viennent de `YelhaaLockup` — mot à
 * 0,75× la hauteur du picto, écart à 0,34× — pour que la carte sociale et le
 * produit montrent exactement le même verrouillage.
 */
const PICTO_SIZE = 64;
const WORD_SIZE = Math.round(PICTO_SIZE * 0.75);
const LOCKUP_GAP = Math.round(PICTO_SIZE * 0.34);

export default async function OpenGraphImage() {
  const picto = await brandAssetDataUri("node-picto-dark");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#050505",
          padding: 72,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: LOCKUP_GAP }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- Satori element, not a DOM image. */}
          <img
            src={picto}
            width={PICTO_SIZE}
            height={PICTO_SIZE}
            alt=""
            style={{ width: PICTO_SIZE, height: PICTO_SIZE }}
          />
          <div
            style={{
              display: "flex",
              fontSize: WORD_SIZE,
              fontWeight: 600,
              lineHeight: 1,
              letterSpacing: Math.round(WORD_SIZE * -0.035 * 10) / 10,
              color: "#f5f5f5",
            }}
          >
            {SITE.name}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 76,
              lineHeight: 1.05,
              color: "#f5f5f5",
              letterSpacing: -3,
              display: "flex",
            }}
          >
            Turn ideas into better prompts.
          </div>
          <div
            style={{
              marginTop: 24,
              fontSize: 30,
              lineHeight: 1.35,
              color: "#8a8a8a",
              maxWidth: 920,
              display: "flex",
            }}
          >
            {SITE.description}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            borderTop: "1px solid rgba(255,255,255,0.10)",
            paddingTop: 24,
            fontSize: 24,
            color: "#8a8a8a",
          }}
        >
          {SITE.tagline}
        </div>
      </div>
    ),
    size,
  );
}
