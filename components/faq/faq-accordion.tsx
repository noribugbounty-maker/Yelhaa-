import Link from "next/link";

import { MarkPlus } from "@/components/brand/marks";

export type FaqItem = {
  slug: string;
  category: string;
  question: string;
  answer: string;
};

/** Longueur de l'extrait, coupée sur un mot entier. */
const EXCERPT_LENGTH = 140;

function excerpt(answer: string): string {
  const flat = answer.replace(/\s+/g, " ").trim();
  if (flat.length <= EXCERPT_LENGTH) return flat;
  const cut = flat.slice(0, EXCERPT_LENGTH);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

/**
 * Index de la FAQ — une entrée par question, extrait court, lien vers la page.
 *
 * **La réponse complète ne vit plus ici.** Elle était rendue intégralement sur
 * `/faq` *et* sur `/faq/[slug]` : le même texte à deux adresses, donc deux
 * pages qui se disputent la même requête et aucune des deux qui l'emporte.
 * L'index porte désormais un extrait, la page dédiée porte le contenu, et
 * chacune a une raison d'exister.
 *
 * Le composant n'a plus d'état : il n'y a plus rien à déplier. Il redevient un
 * composant serveur, ce qui retire son JavaScript du bundle de `/faq`.
 *
 * Le `+` ne pivote pas et n'ouvre rien — il se translate de 3px comme un
 * chevron d'entrée, exactement comme le teaser de la HOME (§5.6). Un `+` qui
 * ne déplie rien serait un mensonge d'affordance.
 *
 * Objets opaques, pas en verre : douze surfaces floutées plus la nav collante
 * dépasseraient le plafond de six par viewport du §2.4.
 */
export function FaqAccordion({ items }: { items: FaqItem[] }) {
  return (
    <ul className="mt-10 flex flex-col gap-2.5">
      {items.map((item) => (
        <li key={item.slug}>
          <Link
            href={`/faq/${item.slug}`}
            className="group flex items-start gap-4 rounded-[6px] border border-line bg-surface p-4 transition-colors duration-[140ms] focus-visible:border-line-strong focus-visible:bg-surface-2 hover:border-line-strong hover:bg-surface-2"
          >
            <span
              aria-hidden="true"
              className="mt-0.5 flex size-[34px] shrink-0 items-center justify-center rounded-[6px] border border-line transition-transform duration-[140ms] ease-[var(--ease-cut)] group-focus-visible:translate-x-[3px] group-hover:translate-x-[3px]"
            >
              <MarkPlus className="size-3.5" />
            </span>

            <span className="min-w-0 flex-1">
              <span className="flex items-baseline justify-between gap-4">
                <h3 className="type-h3 text-ink">{item.question}</h3>
                <span className="hidden shrink-0 rounded-[6px] border border-line px-2 py-1 type-label sm:block">
                  {item.category}
                </span>
              </span>
              <span className="mt-2 block max-w-[66ch] text-[14px] text-ink-2">
                {excerpt(item.answer)}
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
