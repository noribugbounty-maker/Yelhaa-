/**
 * Constantes centralisées du site.
 *
 * Interface en anglais — design prompt §1.0. Aucune valeur n'est inventée :
 * les URL sociales sont lues depuis l'environnement et restent vides tant
 * qu'elles ne sont pas renseignées (build prompt §8, décisions §9).
 */

export const SITE = {
  name: "Yelhaa",
  /** Positioning — design decision document §1. */
  tagline: "Better prompts. Better AI outputs.",
  /**
   * Description par défaut du site — the five-second message (§1).
   *
   * Une seule copie : `app/layout.tsx`, l'Open Graph et l'aperçu social la
   * lisent tous ici.
   */
  description:
    "Yelhaa turns your ideas into better prompts, for better results with AI.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "",
} as const;

/**
 * Navigation principale — design decision document §4.1.
 *
 * Product et Features sont des ancres de la landing ; Pricing et Resources
 * pointent sur les pages qui existent réellement (`/pricing`, `/faq`).
 */
export const NAV_LINKS = [
  { href: "/#product", label: "Product" },
  { href: "/#features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/faq", label: "Resources" },
] as const;

/** Anchors of the landing sections, shared by the nav and the page. */
export const LANDING_ANCHORS = {
  product: "product",
  features: "features",
  pricing: "pricing",
} as const;

/** Routes du produit — build prompt §8. */
export const ROUTES = {
  home: "/",
  /** The prompt builder — where an idea is typed before `/generate`. */
  build: "/build",
  pricing: "/pricing",
  faq: "/faq",
  contact: "/contact",
  login: "/login",
  signup: "/signup",
  account: "/account",
  privacy: "/legal/privacy",
  terms: "/legal/terms",
  notice: "/legal/notice",
} as const;

/** Footer tagline — design decision document §4.9. */
export const FOOTER_TAGLINE = "Build better prompts. Ship faster.";

/**
 * Groupes du pied de page — design decision document §4.9, filtrés par la
 * règle « uniquement des routes qui existent ». Les entrées de la
 * spécification sans page réelle (Templates, AI Models, Documentation,
 * Guides, Changelog, About, Careers) ne sont pas rendues : un lien mort est
 * pire qu'une colonne courte.
 */
export const FOOTER_COLUMNS = [
  {
    title: "Product",
    links: [
      { href: ROUTES.build, label: "Prompt Builder" },
      { href: "/chat", label: "History" },
      { href: ROUTES.pricing, label: "Pricing" },
    ],
  },
  {
    title: "Resources",
    links: [{ href: ROUTES.faq, label: "Help Center" }],
  },
  {
    title: "Company",
    links: [
      { href: ROUTES.contact, label: "Contact" },
      { href: ROUTES.privacy, label: "Privacy" },
      { href: ROUTES.terms, label: "Terms" },
      { href: ROUTES.notice, label: "Legal notice" },
    ],
  },
] as const;

/**
 * Réseaux sociaux — en **texte**, jamais en icônes. Une entrée sans URL n'est
 * pas rendue, et la colonne disparaît si toutes sont vides.
 */
export const SOCIALS = {
  x: process.env.NEXT_PUBLIC_URL_X ?? "",
  github: process.env.NEXT_PUBLIC_URL_GITHUB ?? "",
  discord: process.env.NEXT_PUBLIC_URL_DISCORD ?? "",
  linkedin: process.env.NEXT_PUBLIC_URL_LINKEDIN ?? "",
  instagram: process.env.NEXT_PUBLIC_URL_INSTAGRAM ?? "",
  tiktok: process.env.NEXT_PUBLIC_URL_TIKTOK ?? "",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",
} as const;

/** Footer "Social" column, in the order of §4.9. */
export const SOCIAL_LINKS = [
  { label: "X", href: SOCIALS.x },
  { label: "GitHub", href: SOCIALS.github },
  { label: "Discord", href: SOCIALS.discord },
  { label: "LinkedIn", href: SOCIALS.linkedin },
] as const;

/** Ligne de copyright — §4.9. */
export const COPYRIGHT = "© 2026 Yelhaa";

/**
 * Champ d'identité lu dans l'environnement, côté serveur.
 *
 * Pas de préfixe `NEXT_PUBLIC` : ces valeurs ne sont jamais embarquées dans un
 * bundle client. Elles sont rendues par les pages légales (composants serveur,
 * générés au build) et nulle part ailleurs. Sur le client, `process.env` est
 * vide et le champ vaut `""` — aucun composant client ne le lit.
 */
function legalField(name: string): string {
  return (process.env[name] ?? "").trim();
}

/**
 * Identité juridique de l'éditeur — mentions obligatoires.
 *
 * **Aucune coordonnée dans le dépôt.** Immatriculation, capital, adresse,
 * téléphone, e-mail, noms des responsables et TVA viennent des variables
 * `LEGAL_*` : `.env.local` porte les valeurs (ignoré par git), `.env.example`
 * porte les noms. Seuls restent en dur le nom de l'éditeur, son pays et sa
 * forme sociale, dont dépend la rédaction même des textes légaux.
 *
 * Ces champs ne peuvent pas être devinés : une forme sociale, un numéro
 * d'immatriculation ou une adresse inventés rendraient les mentions légales
 * fausses, et un utilisateur qui s'y fie n'aurait aucun recours réel. Les
 * valeurs vides sont **rendues visiblement comme à compléter** sur les pages
 * légales plutôt que masquées : un vide annoncé se corrige, un vide silencieux
 * se publie.
 *
 * `country` est renseigné : il fixe la loi applicable (RGPD + loi n° 78-17 du
 * 6 janvier 1978), l'autorité de contrôle (CNIL) et le tribunal compétent.
 *
 * Notes de fond, valables quelle que soit la valeur renseignée :
 * - `LEGAL_PHONE` au format international : la page est en anglais et sera lue
 *   depuis l'étranger, où « 06 … » n'est pas composable.
 * - `LEGAL_PUBLISHER` / `LEGAL_REPRESENTATIVE` : l'article 93-2 de la loi du
 *   29 juillet 1982 désigne le représentant légal comme directeur de la
 *   publication. Publier les deux, avec leur qualité, plutôt qu'un seul choisi
 *   arbitrairement — à vérifier avec un conseil.
 * - `LEGAL_VAT` se dérive du SIREN (clé = (12 + 3 × (SIREN mod 97)) mod 97,
 *   préfixée « FR »), vérifiable sur le validateur VIES. À laisser vide si la
 *   société n'est pas assujettie : le numéro existe mathématiquement même sans
 *   assujettissement, et l'afficher serait alors inexact.
 * - `LEGAL_MEDIATOR` : l'article L616-1 du Code de la consommation impose les
 *   coordonnées du médiateur auquel l'entreprise **adhère effectivement**.
 *   Nommer un médiateur sans contrat enverrait le consommateur vers un
 *   organisme qui refusera son dossier — pire qu'une mention absente.
 */
export const LEGAL_ENTITY = {
  name: "Yelhaa AI",
  country: "France",
  /** Forme sociale française, gardée dans sa dénomination d'origine. */
  form: "Société à responsabilité limitée (SARL) — French limited liability company",
  siren: legalField("LEGAL_SIREN"),
  siret: legalField("LEGAL_SIRET"),
  capital: legalField("LEGAL_CAPITAL"),
  address: legalField("LEGAL_ADDRESS"),
  phone: legalField("LEGAL_PHONE"),
  privacyEmail: legalField("LEGAL_EMAIL"),
  publisher: legalField("LEGAL_PUBLISHER"),
  representative: legalField("LEGAL_REPRESENTATIVE"),
  vat: legalField("LEGAL_VAT"),
  mediator: legalField("LEGAL_MEDIATOR"),
} as const;

/**
 * Clé de conservation de l'idée pendant l'authentification — build prompt
 * §4bis. Écrite avant toute redirection, relue au retour.
 */
export const PENDING_IDEA_KEY = "yelhaa:pending_idea";

/** Type de projet retenu à côté de l'idée, même durée de vie. */
export const PENDING_PROJECT_TYPE_KEY = "yelhaa:pending_project_type";

/**
 * Identifiants des pièces jointes déjà envoyées, en attente de génération.
 *
 * Des **identifiants**, jamais du contenu : le texte extrait vit en base,
 * protégé par RLS. Un identifiant recopié à la main dans `sessionStorage` ne
 * donne accès à rien, puisque la relecture passe par le client de session.
 */
export const PENDING_FILE_IDS_KEY = "yelhaa:pending_file_ids";

/**
 * Types de projet du sélecteur du champ YOUR IDEA (design §3.2).
 *
 * Ce sont exactement les quatre valeurs de `prompt_templates.domain` du
 * build prompt §2 — aucune cinquième catégorie n'est inventée. La sélection
 * est facultative : sans choix, le domaine est déduit par la classification.
 */
export const PROJECT_TYPES = [
  { id: "saas", label: "SaaS" },
  { id: "product", label: "Product" },
  { id: "finance", label: "Finance" },
  { id: "agency", label: "Agency" },
] as const;

export type ProjectTypeId = (typeof PROJECT_TYPES)[number]["id"];

/** Bornes de l'idée — build prompt §4, étape de validation. */
export const IDEA_MIN_LENGTH = 10;
export const IDEA_MAX_LENGTH = 2000;

/**
 * Re-sélections de gabarit accordées par génération.
 *
 * Source unique : l'API l'applique (`consume_template_reselect`) et la page
 * tarifaire l'annonce. Les deux la lisaient séparément — une valeur produit
 * écrite à deux endroits finit par diverger, et c'est la page publique qui
 * ment en premier.
 */
export const MAX_RESELECTS_PER_GENERATION = 5;

/**
 * Bande « Works with » — §3.2. Douze outils qui consomment un prompt en
 * texte pour produire une interface web. `logo` reste optionnel : si un
 * fichier est un jour ajouté et autorisé, il remplace le texte de l'entrée
 * sans toucher au composant.
 */
export const WORKS_WITH: ReadonlyArray<{ name: string; logo: string }> = [
  { name: "Claude Code", logo: "/logos/claude.svg" },
  { name: "Cursor", logo: "/logos/cursor.svg" },
  { name: "Lovable", logo: "/logos/lovable.svg" },
  { name: "v0", logo: "/logos/v0.svg" },
  { name: "Bolt", logo: "/logos/bolt.svg" },
  { name: "Codex", logo: "/logos/chatgpt.svg" },
  { name: "ChatGPT", logo: "/logos/chatgpt.svg" },
  { name: "Claude", logo: "/logos/claude.svg" },
  { name: "Gemini", logo: "/logos/gemini.svg" },
  { name: "Windsurf", logo: "/logos/windsurf.svg" },
  { name: "Replit", logo: "/logos/replit.svg" },
  { name: "GitHub Copilot", logo: "/logos/copilot.svg" },
];

/**
 * Plans et quotas — source unique des montants affichés.
 *
 * `npm run stripe:check` compare cette table aux prix réellement configurés
 * chez Stripe et signale toute dérive.
 */
export const PLANS = [
  {
    id: "free",
    name: "Free",
    description: "Try it out. No card required.",
    priceUsd: 0,
    generationsPerMonth: 3,
    recommended: false,
  },
  {
    id: "pro",
    name: "Pro",
    description: "For solo builders shipping regularly.",
    priceUsd: 9.99,
    generationsPerMonth: 150,
    recommended: true,
  },
  {
    id: "agency",
    name: "Agency",
    description: "For studios producing at volume.",
    priceUsd: 39.99,
    generationsPerMonth: 500,
    recommended: false,
  },
] as const;

export type PlanId = (typeof PLANS)[number]["id"];

/**
 * Lignes d'inclusions communes à `/pricing` — source unique pour ne pas
 * faire diverger la page tarifaire et le copy d'accompagnement.
 */
export const PLAN_INCLUDED = [
  {
    name: "Every art direction",
    description: "The whole library, on every plan.",
  },
  { name: "Every domain", description: "Whatever your idea turns out to be." },
  {
    name: `${MAX_RESELECTS_PER_GENERATION} art-direction swaps per generation`,
    description: "Change your mind without spending another generation.",
  },
  {
    name: "Copy and download",
    description: "Take your prompt anywhere, in one click.",
  },
  {
    name: "Multi-AI environment",
    description: "Open the result in the workspace and pick a role per task.",
  },
  {
    name: "No card on the free plan",
    description: "Start generating without entering payment details.",
  },
] as const;

/** Puces sous le quota, identiques pour les trois colonnes de `/pricing`. */
export function planColumnDetails(): string[] {
  return [
    "One full engine run, whatever happens inside it",
    `Up to ${MAX_RESELECTS_PER_GENERATION} art-direction swaps on the result`,
    "Copy, download, and open in the workspace",
  ];
}

/** Puces des cartes landing — mêmes faits que `PLANS`, formulations courtes. */
export function planLandingFeatures(
  plan: (typeof PLANS)[number],
): string[] {
  const base = [
    `${plan.generationsPerMonth} prompt generations / month`,
    "Every art direction, every domain",
    `${MAX_RESELECTS_PER_GENERATION} art-direction swaps per generation`,
    "Copy, download, open in the workspace",
  ];
  if (plan.id === "free") base.push("No card required");
  if (plan.id === "agency") base.push("For studios producing at volume");
  return base;
}

/** Formatage des montants — une seule implémentation. */
export function formatUsd(amount: number): string {
  return amount === 0 ? "$0" : `$${amount.toFixed(2)}`;
}

/**
 * Date de remise à zéro du quota, telle qu'on l'affiche.
 *
 * **Forcé en UTC.** `resetsAt` est la frontière de période calculée en UTC par
 * `nextPeriodStart()` ; la formater dans le fuseau du navigateur ferait lire
 * « August 31 » à un utilisateur en UTC-5 pour une période qui redémarre le
 * 1er septembre. La date affichée doit être celle qui gouverne le compteur.
 *
 * Une entrée illisible rend une chaîne vide plutôt que « Invalid Date » :
 * l'appelant choisit alors de ne rien afficher.
 */
export function formatResetDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

/**
 * Plan immédiatement supérieur, ou `null` s'il n'y en a pas.
 *
 * `PLANS` est classé par prix croissant, et cette fonction s'appuie sur cet
 * ordre plutôt que sur une liste parallèle qui pourrait en diverger.
 *
 * Le `null` est le point important : proposer « Upgrade » à quelqu'un qui est
 * déjà sur le plan le plus élevé l'envoie sur une page qui n'a rien à lui
 * vendre. Un plan inconnu — valeur ancienne restée en base — est traité comme
 * `free`, ce qui propose une montée plutôt que d'afficher un cul-de-sac.
 */
export function nextPlanAbove(
  plan: string,
): (typeof PLANS)[number] | null {
  const index = PLANS.findIndex((entry) => entry.id === plan);
  return PLANS[index === -1 ? 1 : index + 1] ?? null;
}

/**
 * Rôles d'agents du sélecteur de l'espace de travail.
 *
 * Le sélecteur porte sur le **rôle**, et non sur un fournisseur ou un modèle,
 * pour une raison mesurable et non par principe : `lib/ai/client.ts` n'expose
 * qu'un fournisseur (OpenAI) et un modèle lu dans `OPENAI_MODEL`. Offrir un
 * choix de modèle aujourd'hui afficherait une commande sans effet.
 *
 * Le build prompt Phase 8 demande bien un « sélecteur de modèle visible » dans
 * `/workspace/[id]` ; il suppose plusieurs fournisseurs, ce que le moteur ne
 * fait pas encore. Le jour où un second fournisseur est câblé, le choix se
 * déclare côté serveur — jamais accepté depuis le corps de la requête.
 */
export const AGENT_ROLES = [
  { id: "coding", label: "Coding" },
  { id: "architecture", label: "Architecture" },
  { id: "review", label: "Review" },
  { id: "debugging", label: "Debugging" },
  { id: "testing", label: "Testing" },
  { id: "documentation", label: "Documentation" },
  { id: "research", label: "Research" },
] as const;

export type AgentRoleId = (typeof AGENT_ROLES)[number]["id"];

/** Rôle actif à l'ouverture de l'espace de travail. */
export const DEFAULT_AGENT_ROLE: AgentRoleId = "coding";
