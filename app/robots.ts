import type { MetadataRoute } from "next";

import { absoluteUrl, DISALLOWED_PATHS, isPlaceholderOrigin } from "@/lib/seo";

/**
 * `robots.txt` — servi par Next à `/robots.txt`.
 *
 * Les pages publiques sont ouvertes au crawl ; seules les zones réellement
 * privées ou sans valeur de recherche sont fermées. Aucun blocage d'assets :
 * couper `/_next/` empêcherait Google de rendre la page et de juger sa mise en
 * page mobile.
 *
 * Tant que `NEXT_PUBLIC_SITE_URL` n'est pas renseignée, le site entier est en
 * `disallow`. C'est délibéré : un déploiement de préproduction indexé sous une
 * URL provisoire crée des doublons qu'il faut ensuite désindexer un par un. Le
 * jour où le domaine est renseigné, la directive s'inverse d'elle-même.
 */
export default function robots(): MetadataRoute.Robots {
  if (isPlaceholderOrigin()) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [...DISALLOWED_PATHS],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
