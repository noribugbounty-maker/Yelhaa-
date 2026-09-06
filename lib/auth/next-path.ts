/**
 * Validation du paramètre `next` — build prompt §5.
 *
 * « Le paramètre `next` est validé côté serveur : uniquement des chemins
 *   internes commençant par `/`, jamais une URL absolue — sinon redirection
 *   ouverte. »
 *
 * La validation se fait **à la consommation**, jamais seulement à la
 * production de l'URL : le paramètre transite par la barre d'adresse et par
 * le fournisseur OAuth, donc il est toujours suspect au retour.
 */

/** Chemins vers lesquels on ne renvoie jamais : ils reboucleraient. */
const NEVER_NEXT = ["/login", "/signup", "/auth"];

/** Caractères de contrôle : découpage d'en-tête, faux chemins. */
const CONTROL_CHARS = /[\u0000-\u001f\u007f]/;

export const DEFAULT_NEXT = "/";

export function sanitizeNextPath(
  value: string | null | undefined,
  fallback = DEFAULT_NEXT,
): string {
  if (!value) return fallback;

  let candidate = value;

  // La valeur peut revenir encodée une fois de plus qu'à l'aller.
  try {
    candidate = decodeURIComponent(candidate);
  } catch {
    return fallback;
  }

  // Chemin interne, et uniquement un chemin.
  if (!candidate.startsWith("/")) return fallback;

  // `//evil.com` et `/\evil.com` sont des URL protocol-relative : le
  // navigateur les traite comme externes.
  if (candidate.startsWith("//") || candidate.startsWith("/\\"))
    return fallback;
  if (candidate.includes("\\")) return fallback;

  if (CONTROL_CHARS.test(candidate)) return fallback;

  const pathname = candidate.split(/[?#]/)[0] ?? "";
  if (
    NEVER_NEXT.some(
      (blocked) => pathname === blocked || pathname.startsWith(`${blocked}/`),
    )
  ) {
    return fallback;
  }

  return candidate;
}

/** Extrait `next` d'un sac de `searchParams` Next.js, déjà validé. */
export function readNextParam(
  params: Record<string, string | string[] | undefined>,
  fallback = DEFAULT_NEXT,
): string {
  const raw = params["next"];
  return sanitizeNextPath(typeof raw === "string" ? raw : null, fallback);
}
