import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Bouton — primitive shadcn passée au filtre du renouveau §1.
 *
 * On garde du registre ce qui vaut la peine : le `Slot` de Radix pour
 * `asChild`, la structure `cva`, la gestion du `disabled` et des icônes. On
 * jette tout le style d'origine, qui arrivait avec un `rounded-lg`, un
 * `focus-visible:ring-3` flou, un `active:translate-y-px` et des variantes
 * `outline` / `destructive` / `link` que la charte ne connaît pas.
 *
 * Trois variantes, et trois seulement (§1.10) :
 *   primary   — l'action principale de l'écran, une seule par vue
 *   secondary — **verre**, recette `glass-inset` du §2.1
 *   ghost     — lien texte
 *
 * Le secondaire en verre est une dérogation explicite au §5.3 du renouveau,
 * demandée par l'utilisateur. Il ne définit aucune matière propre : il
 * compose `glass-inset` et `glass-hot`, donc il suit automatiquement les
 * trois replis opaques (`@supports`, `prefers-reduced-transparency`,
 * `data-glass="opaque"`) et il compte dans le plafond de six surfaces de
 * verre par viewport du §2.4.
 *
 * Le primaire reste un aplat `--volt` : l'interdit 4 du §0.3 écarte le jaune
 * en aplat dans une surface de verre, et c'est aussi ce qui garde le contraste
 * de 12,67:1 du texte `--void` sur le CTA.
 *
 * Aucune ombre hors l'arête `inset` portée par la recette, aucun dégradé,
 * aucun `ring` flou — l'anneau de focus `2px --volt offset 2px` vient de la
 * règle globale `:focus-visible`, donc on ne pose jamais `outline-none`.
 */
const buttonVariants = cva(
  "inline-flex shrink-0 select-none items-center justify-center gap-2 whitespace-nowrap rounded-[6px] font-sans text-[14px] font-semibold transition-[background-color,border-color,color] duration-[140ms] ease-[var(--ease-cut)] disabled:pointer-events-none aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "border-0 bg-volt text-void hover:bg-volt-hot active:bg-volt-press disabled:bg-surface-2 disabled:text-ink-3 aria-disabled:bg-surface-2 aria-disabled:text-ink-3",
        secondary:
          "glass-inset glass-hot text-ink disabled:text-ink-3 aria-disabled:text-ink-3",
        ghost:
          "border-0 bg-transparent font-normal text-ink-2 hover:text-ink disabled:text-ink-3 aria-disabled:text-ink-3",
      },
      size: {
        /** Hauteur du bouton GENERATE (§5.3). */
        default: "h-[38px] px-5",
        /** Hauteur du Sign up de la nav (§5.1). */
        sm: "h-[34px] px-4 text-[13px]",
        /** Hauteur de OPEN IN MULTI-AI ENVIRONMENT (§5.8). */
        lg: "h-[46px] px-6 text-[15px]",
        /** Cible tactile minimale conservée à 375px (§1.14). */
        icon: "size-[38px] p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    /** Rend l'enfant à la place du `<button>`, pour un lien stylé en bouton. */
    asChild?: boolean;
  };

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Component = asChild ? Slot : "button";

  return (
    <Component
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
