import "server-only";

import { headers } from "next/headers";

/**
 * Origine absolue du site, pour les URL de retour OAuth et de confirmation
 * d'e-mail — les seules qui doivent quitter l'application.
 *
 * `NEXT_PUBLIC_SITE_URL` fait foi. En production, son absence refuse le
 * repli sur `Host` / `X-Forwarded-Host` : ces en-têtes sont contrôlés par
 * l'appelant et ouvriraient une redirection OAuth vers un hôte forgé.
 *
 * En développement seulement, un hôte local (localhost / loopback) peut
 * servir de repli pour `next dev` sans variable renseignée.
 */
export async function resolveSiteOrigin(): Promise<string> {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/+$/, "");

  if (process.env.NODE_ENV === "production") {
    console.error(
      "[auth] NEXT_PUBLIC_SITE_URL absente : repli sur l'en-tête Host refusé.",
    );
    return "";
  }

  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");
  if (!host) return "";

  const hostname = host.split(":")[0]?.toLowerCase() ?? "";
  const isLoopback =
    hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]";
  if (!isLoopback) return "";

  const protocol = headerList.get("x-forwarded-proto") ?? "http";
  return `${protocol}://${host}`;
}
