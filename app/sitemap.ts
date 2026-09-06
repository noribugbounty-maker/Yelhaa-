import type { MetadataRoute } from "next";

import { FAQ_ARTICLES } from "@/content/faq";
import { absoluteUrl, INDEXABLE_ROUTES } from "@/lib/seo";

/**
 * `sitemap.xml` — servi par Next à `/sitemap.xml`.
 *
 * Deux sources, et deux seulement : les routes statiques déclarées dans
 * `lib/seo.ts` et les douze articles de FAQ. Aucune route protégée, aucune
 * route d'API, aucun retour de paiement, aucun doublon.
 *
 * Les articles viennent de la constante qui alimente le seed plutôt que d'une
 * requête : le sitemap doit pouvoir être généré à la construction, sans
 * dépendre de la disponibilité de la base. Les deux sources sont le même
 * contenu — `npm run seed:faq` écrit l'une depuis l'autre.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes = INDEXABLE_ROUTES.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const faqRoutes = [...FAQ_ARTICLES]
    .sort((a, b) => a.position - b.position)
    .map((article) => ({
      url: absoluteUrl(`/faq/${article.slug}`),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  return [...staticRoutes, ...faqRoutes];
}
