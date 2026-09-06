import { Instagram, Linkedin, Mail, Music2 } from "lucide-react";

import { SOCIALS } from "@/lib/config";

/**
 * Réseaux sociaux — build prompt §8, décisions §9.
 *
 * « Une icône dont l'URL est vide n'est pas rendue, jamais un lien mort. »
 *
 * Ce n'est pas un état transitoire : c'est le comportement permanent. Zéro,
 * une, deux ou quatre entrées, le bloc reste cohérent — la liste est filtrée,
 * pas grisée. Aucun `href="#"`, aucun état désactivé, aucun message
 * d'explication.
 *
 * TikTok n'a pas d'icône dans lucide : on utilise un glyphe de la même famille
 * de tracé plutôt qu'une contrefaçon du logo de marque. Le nom du réseau est
 * porté par `aria-label`.
 */
const NETWORKS = [
  {
    key: "linkedin",
    label: "LinkedIn",
    Icon: Linkedin,
    href: SOCIALS.linkedin,
  },
  {
    key: "instagram",
    label: "Instagram",
    Icon: Instagram,
    href: SOCIALS.instagram,
  },
  { key: "tiktok", label: "TikTok", Icon: Music2, href: SOCIALS.tiktok },
  {
    key: "email",
    label: "E-mail",
    Icon: Mail,
    href: SOCIALS.email ? `mailto:${SOCIALS.email}` : "",
  },
] as const;

export function Socials() {
  const available = NETWORKS.filter((network) => network.href !== "");

  if (available.length === 0) return null;

  return (
    <ul className="flex flex-wrap items-center gap-3">
      {available.map((network) => (
        <li key={network.key}>
          <a
            href={network.href}
            aria-label={network.label}
            {...(network.key === "email"
              ? {}
              : { target: "_blank", rel: "noreferrer noopener" })}
            className="flex size-11 items-center justify-center rounded-[6px] border border-line text-ink-2 transition-colors duration-[140ms] hover:border-line-strong hover:text-ink"
          >
            <network.Icon size={18} strokeWidth={1.5} aria-hidden="true" />
          </a>
        </li>
      ))}
    </ul>
  );
}
