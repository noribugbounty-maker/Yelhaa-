import "server-only";

/**
 * Adresse cliente pour le plafonnement de débit.
 *
 * Derrière Cloudflare, `CF-Connecting-IP` est posé par le proxy et n'est pas
 * falsifiable depuis le navigateur. `X-Forwarded-For` l'est : le premier hop
 * peut être écrit par l'appelant. On ne le lit qu'en dernier recours.
 */
export function clientIpFromHeaders(headerList: Headers): string {
  const cloudflare = headerList.get("cf-connecting-ip")?.trim();
  if (cloudflare) return cloudflare;

  const realIp = headerList.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  const forwarded = headerList.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || "unknown";
}
