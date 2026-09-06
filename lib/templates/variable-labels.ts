/**
 * Libellés lisibles des variables du contrat — `prompt-variable-schema.md`.
 *
 * Sert au bloc « suggestions » de l'écran YOUR PROMPT (§4bis) : le tableau
 * `missing` renvoyé par l'appel #1 contient des noms de variables, qu'on
 * n'affiche jamais bruts. Aucune variable n'est inventée ici — la liste suit
 * le core et les quatre extensions du schéma.
 */
import type { Locale } from "@/lib/i18n/types";

const EN: Record<string, string> = {
  BRAND_NAME: "the brand name",
  VERTICAL: "the industry",
  TAGLINE: "a short tagline",
  CONTACT_EMAIL: "a contact address",
  HERO_HEADLINE: "the main headline you want",
  VALUE_PROP: "the one-sentence promise",
  PRIMARY_CTA: "the primary button label",
  SECONDARY_CTA: "the secondary button label",
  ITEM: "at least three services, features or capabilities",
  DETAIL: "details on each item",
  PRICING_TIERS: "your pricing plans",
  PROOF_STAT: "proof figures, if you have any",
  ACCENT_HEX: "your accent colour",
  LOGO_ASSET: "your logo",
  HERO_ASSET: "a main visual",
  SCREEN: "screenshots or secondary visuals",
  PRODUCT_NAME: "the product name",
  PRICE: "the price",
  VARIANTS: "the available variants",
  SIZE_GUIDE: "a size guide",
  ALLERGENS: "the allergens",
  LEAD_TIME: "the production lead time",
  SUB_VERTICAL: "the financial sub-sector",
  REGULATOR: "the regulator you report to",
  ENTITY_LEGAL: "the legal name of the entity",
  RATE: "the rates you apply",
  PROTECTION_SCHEME: "the funds-protection scheme",
  PROJECT: "at least three portfolio projects",
  TEAM: "the team members",
  AWARDS: "the awards received",
  CLIENT_LOGOS: "clients to mention",
  MOCK_UI_KIND: "the kind of interface to simulate",
};

const FR: Record<string, string> = {
  BRAND_NAME: "le nom de la marque",
  VERTICAL: "le secteur d’activité",
  TAGLINE: "une accroche courte",
  CONTACT_EMAIL: "une adresse de contact",
  HERO_HEADLINE: "le titre principal souhaité",
  VALUE_PROP: "la promesse en une phrase",
  PRIMARY_CTA: "le libellé du bouton principal",
  SECONDARY_CTA: "le libellé du bouton secondaire",
  ITEM: "au moins trois services, fonctionnalités ou capacités",
  DETAIL: "des précisions sur chaque élément",
  PRICING_TIERS: "vos formules tarifaires",
  PROOF_STAT: "des chiffres de preuve, s’il en existe",
  ACCENT_HEX: "votre couleur d’accent",
  LOGO_ASSET: "votre logo",
  HERO_ASSET: "un visuel principal",
  SCREEN: "des captures ou visuels secondaires",
  PRODUCT_NAME: "le nom du produit",
  PRICE: "le prix",
  VARIANTS: "les variantes disponibles",
  SIZE_GUIDE: "un guide des tailles",
  ALLERGENS: "les allergènes",
  LEAD_TIME: "le délai de fabrication",
  SUB_VERTICAL: "le sous-secteur financier",
  REGULATOR: "le régulateur dont vous dépendez",
  ENTITY_LEGAL: "la dénomination légale de l’entité",
  RATE: "les taux pratiqués",
  PROTECTION_SCHEME: "le dispositif de protection des fonds",
  PROJECT: "au moins trois projets de votre portfolio",
  TEAM: "les membres de l’équipe",
  AWARDS: "les récompenses obtenues",
  CLIENT_LOGOS: "les clients à citer",
  MOCK_UI_KIND: "le type d’interface à simuler",
};

/** `ITEM_3` et `PROOF_STAT_2` retombent sur le libellé de leur famille. */
export function labelForVariable(
  name: string,
  locale: Locale = "en",
): string | null {
  const table = locale === "fr" ? FR : EN;
  const direct = table[name];
  if (direct) return direct;

  const family = name.replace(/_\d+$/, "");
  return table[family] ?? null;
}
