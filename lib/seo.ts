import type { Metadata } from "next";

import { SITE } from "@/lib/config";

/**
 * Source unique de vérité du SEO — URL canonique, titres, descriptions.
 *
 * Tout ce qui a besoin d'une URL absolue passe par ici : `metadataBase`, les
 * canoniques, l'Open Graph, le sitemap et le robots. Aucun domaine n'est écrit
 * en dur nulle part ailleurs.
 *
 * **Le domaine n'est pas encore arrêté.** `NEXT_PUBLIC_SITE_URL` est donc la
 * seule valeur à renseigner le jour où il l'est : rien d'autre ne bouge. En
 * attendant, le repli local garde canoniques et Open Graph valides en
 * développement plutôt que de les faire disparaître — une balise absente est
 * plus difficile à diagnostiquer qu'une balise pointant sur localhost.
 */

/** Repli de développement. Jamais servi en production : voir `siteUrl()`. */
const DEV_ORIGIN = "http://localhost:3000";

/**
 * Origine canonique, sans barre oblique finale.
 *
 * La normalisation compte : `https://x.com/` et `https://x.com` produiraient
 * deux canoniques différentes pour la même page.
 */
export function siteUrl(): string {
  const configured = SITE.url.trim().replace(/\/+$/, "");
  return configured || DEV_ORIGIN;
}

/** `true` tant que le domaine de production n'est pas renseigné. */
export function isPlaceholderOrigin(): boolean {
  return !SITE.url.trim();
}

/**
 * URL absolue d'un chemin interne.
 *
 * Les chemins sont normalisés sans barre oblique finale — Next sert
 * `/pricing`, pas `/pricing/`, et une canonique qui diverge de l'URL servie
 * annule son propre effet. La racine reste `/`.
 */
export function absoluteUrl(path: string): string {
  const clean = path === "/" ? "" : `/${path.replace(/^\/+|\/+$/g, "")}`;
  return `${siteUrl()}${clean}`;
}

/**
 * Métadonnées d'une page indexable.
 *
 * Regroupe titre, description, canonique et Open Graph en un seul appel : les
 * quatre doivent rester cohérents, et les séparer est le moyen le plus sûr de
 * les laisser diverger.
 */
export function pageMetadata({
  title,
  description,
  path,
  type = "website",
}: {
  /** Sans le suffixe de marque : le gabarit du layout racine l'ajoute. */
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
}): Metadata {
  const url = absoluteUrl(path);

  /*
   * L'aperçu social doit être **déclaré explicitement**.
   *
   * `app/opengraph-image.tsx` suffit pour l'accueil, mais Next ne le rattache
   * pas aux pages qui définissent leur propre bloc `openGraph` — et elles
   * passent toutes par ici. Mesuré : `/pricing` et `/contact` sortaient sans
   * `og:image` alors que leur `twitter:card` annonçait `summary_large_image`,
   * donc une grande image. Une carte qui promet une image et n'en fournit pas
   * se replie sur du texte nu.
   *
   * Les dimensions sont déclarées : sans elles, certains clients réservent une
   * place au jugé, puis recalent la carte une fois l'image chargée.
   */
  const image = {
    url: absoluteUrl("/opengraph-image"),
    width: 1200,
    height: 630,
    alt: `${SITE.name} — ${SITE.tagline}`,
  };

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} — ${SITE.name}`,
      description,
      url,
      siteName: SITE.name,
      type,
      locale: "en_US",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — ${SITE.name}`,
      description,
      images: [image.url],
    },
  };
}

/**
 * Routes publiques indexables — source unique du sitemap.
 *
 * Les routes protégées par le middleware (`/generate`, `/account`,
 * `/prompt/*`, `/workspace/*`) et les retours de paiement en sont absentes :
 * elles répondent par une redirection ou n'ont aucune valeur de recherche.
 */
export const INDEXABLE_ROUTES = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/build", priority: 0.9, changeFrequency: "monthly" },
  { path: "/pricing", priority: 0.9, changeFrequency: "monthly" },
  { path: "/faq", priority: 0.8, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.5, changeFrequency: "yearly" },
  { path: "/legal/notice", priority: 0.2, changeFrequency: "yearly" },
  { path: "/legal/privacy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/legal/terms", priority: 0.2, changeFrequency: "yearly" },
] as const;

/**
 * Préfixes tenus hors du crawl.
 *
 * Le middleware les redirige déjà vers l'authentification, mais une directive
 * explicite évite à Google de dépenser son budget de crawl sur des 307.
 */
export const DISALLOWED_PATHS = [
  "/api/",
  "/account",
  "/generate",
  "/prompt/",
  "/workspace/",
  "/chat",
  "/checkout/",
  "/auth/",
] as const;
