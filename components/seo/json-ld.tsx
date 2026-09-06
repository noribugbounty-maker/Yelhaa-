import { PLANS, SITE } from "@/lib/config";
import { absoluteUrl } from "@/lib/seo";

/**
 * Données structurées — uniquement ce que la page montre réellement.
 *
 * Rien ici n'affirme quoi que ce soit d'absent de l'écran : les prix et les
 * quotas viennent de la même constante que la grille tarifaire, le nom et
 * l'accroche de `lib/config.ts`. Un balisage qui décrit une page imaginaire est
 * une cause de pénalité, pas un gain.
 *
 * **Pas de `FAQPage`.** Google a retiré les rich results FAQ pour tous les
 * sites le 7 mai 2026 : la fonctionnalité SERP n'existe plus, et rien ne
 * démontre de bénéfice de citation par les moteurs de réponse. En ajouter
 * reviendrait à empiler du balisage sans contrepartie.
 *
 * Le JSON est sérialisé avec `JSON.stringify`, qui échappe les guillemets ;
 * aucune donnée utilisateur n'entre dans ces objets, uniquement des constantes
 * du produit.
 */
function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Contenu statique issu de constantes, jamais d'entrée utilisateur.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** Identité de la marque et du site — HOME uniquement. */
export function OrganizationJsonLd() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: SITE.name,
          url: absoluteUrl("/"),
          slogan: SITE.tagline,
          logo: absoluteUrl("/brand/picto.svg"),
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE.name,
          url: absoluteUrl("/"),
        }}
      />
    </>
  );
}

/**
 * Le produit et ses trois offres — `/pricing` uniquement.
 *
 * Les trois prix, la devise et les quotas sont visibles sur la page : le
 * balisage ne fait que les rendre lisibles par machine.
 */
export function PricingJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: SITE.name,
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Web",
        url: absoluteUrl("/pricing"),
        offers: PLANS.map((plan) => ({
          "@type": "Offer",
          name: plan.name,
          price: String(plan.priceUsd),
          priceCurrency: "USD",
          url: absoluteUrl("/pricing"),
          category: plan.priceUsd === 0 ? "Free" : "Subscription",
        })),
      }}
    />
  );
}

/** Fil d'Ariane d'un article de FAQ — reflète la navigation réelle. */
export function FaqBreadcrumbJsonLd({
  question,
  slug,
}: {
  question: string;
  slug: string;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: absoluteUrl("/"),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "FAQ",
            item: absoluteUrl("/faq"),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: question,
            item: absoluteUrl(`/faq/${slug}`),
          },
        ],
      }}
    />
  );
}
