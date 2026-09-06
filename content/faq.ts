/**
 * Les douze articles de FAQ — build prompt §10, en anglais (design §1.0).
 *
 * Le fond de chaque réponse est celui du §10, traduit et non réécrit. Une
 * seule valeur diffère : les montants de `plans-et-quotas` suivent la grille
 * arrêtée par l'utilisateur (Pro 9,99 $, Agency 39,99 $) et non celle du §10,
 * sans quoi la FAQ contredirait la page tarifs du même site.
 */
/**
 * Correspondance des anciens slugs français vers les slugs anglais.
 *
 * Le contenu et `lang` sont anglais ; des URL françaises envoyaient un signal
 * de pertinence contradictoire. `next.config.ts` sert une 301 permanente pour
 * chaque entrée, donc aucun lien existant ne casse et aucune chaîne de
 * redirections ne se forme — chaque ancienne URL pointe directement sur sa
 * cible finale.
 */
export const FAQ_SLUG_REDIRECTS: Record<string, string> = {"quest-ce-que-yelhaa": "what-is-yelhaa", "pourquoi-un-bon-prompt-change-tout": "why-prompt-quality-matters", "comment-fonctionne-la-generation": "how-an-idea-becomes-a-prompt", "quest-ce-quun-environnement-multi-ia": "what-is-a-multi-ai-environment", "mes-idees-sont-elles-conservees": "is-my-idea-kept-during-signup", "plans-et-quotas": "plans-and-quotas", "que-se-passe-t-il-au-depassement": "what-happens-when-i-hit-my-quota", "resilier-mon-abonnement": "cancel-subscription-and-refunds", "moyens-de-paiement": "payment-methods", "que-devient-mon-idee": "what-happens-to-what-i-write", "quels-modeles-sont-utilises": "which-ai-models-are-used", "puis-je-exporter-mon-travail": "export-your-work"};

export type FaqArticle = {
  slug: string;
  category: string;
  question: string;
  answer_md: string;
  position: number;
};

export const FAQ_CATEGORIES = ["Product", "Account and pricing", "Technical and privacy"] as const;

export const FAQ_ARTICLES: FaqArticle[] = [
  {
    slug: "what-is-yelhaa",
    category: "Product",
    position: 1,
    question: "What is Yelhaa?",
    answer_md:
      "Yelhaa turns an idea written in plain language into a structured prompt, then opens that idea in a development environment where several AI models and agents work together. The point is to remove the back-and-forth between “I have an idea” and “I have something that runs”.",
  },
  {
    slug: "why-prompt-quality-matters",
    category: "Product",
    position: 2,
    question: "Why does prompt quality matter so much?",
    answer_md:
      "A vague prompt produces an approximate result that you then fix through a series of iterations. Every iteration costs time and tokens. A prompt that sets the constraints, the structure and the edge cases up front reduces that number of iterations — that is the problem Yelhaa solves.",
  },
  {
    slug: "how-an-idea-becomes-a-prompt",
    category: "Product",
    position: 3,
    question: "How does an idea become a prompt?",
    answer_md:
      "Your idea is analysed to extract its domain, its style and the concrete facts it contains. A matching template is selected from the catalogue, then the extracted information is injected into it. The result is checked before being returned: no unresolved field may remain.",
  },
  {
    slug: "what-is-a-multi-ai-environment",
    category: "Product",
    position: 4,
    question: "What does “multi-AI environment” mean?",
    answer_md:
      "After a generation you continue in a single chat with the same model that built the prompt. You can refine the brief, ask for a rewrite, or adapt a section — one assistant, the produced prompt as context. The workspace remains available if you want the original layout.",
  },
  {
    slug: "is-my-idea-kept-during-signup",
    category: "Product",
    position: 5,
    question: "Is my idea lost if I have to create an account?",
    answer_md:
      "No. The idea you typed is kept through the whole authentication step, including if the page is reloaded. On return it is restored exactly as it was and generation resumes automatically.",
  },
  {
    slug: "plans-and-quotas",
    category: "Account and pricing",
    position: 6,
    question: "What does each plan include?",
    answer_md:
      "The free plan gives you 3 generations per month. Pro raises that to 150 generations for $9.99 per month, and Agency to 500 for $39.99 per month. A generation is one complete run of the engine, whatever happens inside it.",
  },
  {
    slug: "what-happens-when-i-hit-my-quota",
    category: "Account and pricing",
    position: 7,
    question: "What happens when I reach my quota?",
    answer_md:
      "Generation stops and the interface shows the limit you reached along with the reset date. Nothing extra is billed. Counters go back to zero on the 1st of every month, automatically. Unused generations do not roll over.",
  },
  {
    slug: "cancel-subscription-and-refunds",
    category: "Account and pricing",
    position: 8,
    question: "How do I cancel, and can I get a refund?",
    answer_md:
      "You cancel from the Account page, through the customer portal, and it takes effect at the end of the period you already paid for — your access stays complete until then. No refund is granted after a purchase, except for a genuine fault on our side: a payment taken without the service being activated, a clearly incorrect charge, or a technical problem that directly prevented you from using what you bought. Each request is reviewed case by case and refunds are not guaranteed.",
  },
  {
    slug: "payment-methods",
    category: "Account and pricing",
    position: 9,
    question: "Which payment methods do you accept?",
    answer_md:
      "Payments are handled by Stripe. Yelhaa stores no card details on its servers.",
  },
  {
    slug: "what-happens-to-what-i-write",
    category: "Technical and privacy",
    position: 10,
    question: "What do you do with what I write?",
    answer_md:
      "Yelhaa applies data minimisation: only what the account and the service need is kept — account details, generation history, the ideas you type, the results produced, your plan and your counter. They are visible to you alone and are not used for advertising without consent. You can ask for your account and personal data to be deleted at any time. Exact retention periods and the list of processors are set out in the privacy policy.",
  },
  {
    slug: "which-ai-models-are-used",
    category: "Technical and privacy",
    position: 11,
    question: "Which AI models do you use?",
    answer_md:
      "The generation engine runs on OpenAI (gpt-5-nano by default). It analyses your idea, retrieves the closest template from the catalogue, injects the facts you actually stated, then opens a single chat on the result. The model name is configured by the publisher and is never chosen from the browser.",
  },
  {
    slug: "export-your-work",
    category: "Technical and privacy",
    position: 12,
    question: "Can I get back what I produced?",
    answer_md:
      "Yes. Every result can be copied directly or downloaded. Nothing is published automatically: there is no public publishing in this first version, and if it is added later it will always have to be triggered explicitly by you.",
  },
];
