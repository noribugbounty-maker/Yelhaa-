import { ImageResponse } from "next/og";

import { brandAssetDataUri } from "@/lib/brand-assets";

/**
 * Home-screen icon — served by Next at `/apple-icon`.
 *
 * iOS masks its own corners, so this is a plain square: the void background
 * and the picto, centred, at the size the brand sheet uses for app icons.
 * `app/icon.svg` remains the browser-tab favicon.
 */
export const runtime = "nodejs";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Marque « Nœud » : viewBox carré 100 × 100, 62% de la tuile (§icône d'app). */
const PICTO_HEIGHT = Math.round(180 * 0.62);
const PICTO_WIDTH = PICTO_HEIGHT;

export default async function AppleIcon() {
  const picto = await brandAssetDataUri("node-picto-dark");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#050505",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- Satori element, not a DOM image. */}
        <img
          src={picto}
          width={PICTO_WIDTH}
          height={PICTO_HEIGHT}
          alt=""
          style={{ width: PICTO_WIDTH, height: PICTO_HEIGHT }}
        />
      </div>
    ),
    size,
  );
}
