import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Brand SVGs as data URIs, for the generated images (`opengraph-image`,
 * `apple-icon`).
 *
 * `next/og` composes those images with Satori, which cannot reach `/brand/…`
 * over HTTP at build time. The files are read from `public/` and inlined, so
 * the picto rendered on a social card is byte-for-byte the one served on the
 * site — no second copy of the mark to keep in sync.
 *
 * Server-only: `node:fs` never reaches a client bundle.
 */
export type BrandAsset =
  | "node-picto-dark"
  | "node-picto-light"
  | "node-app-icon"
  | "node-app-icon-light";

export async function brandAssetDataUri(asset: BrandAsset): Promise<string> {
  const svg = await readFile(
    join(process.cwd(), "public", "brand", `${asset}.svg`),
  );
  return `data:image/svg+xml;base64,${svg.toString("base64")}`;
}
