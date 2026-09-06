import { SectionHeading } from "@/components/landing/section-heading";
import { Reveal } from "@/components/site/reveal";
import { Testimonials, type Testimonial } from "@/components/ui/testimonials";

/**
 * Testimonials — design decision document §4.7 and §D5.
 *
 * PLACEHOLDER — replace before production.
 *
 * Nothing below is a real customer quote. Names are initials, roles are
 * generic, no company is named, no result is quantified. The interface says
 * so in plain text under the rows. Swap this array for verified quotes (with
 * consent) and remove the notice.
 */
const placeholderTestimonials: readonly Testimonial[] = [
  {
    quote:
      "I stopped rewriting the same prompt five times. The first one is now the right one.",
    name: "A. R.",
    role: "Developer",
  },
  {
    quote:
      "It asks the questions I forget to ask myself — tone, constraints, audience — before the model sees anything.",
    name: "M. K.",
    role: "Designer",
  },
  {
    quote:
      "Our briefs to AI tools finally read like briefs. Everyone on the team gets the same quality.",
    name: "S. L.",
    role: "Founder",
  },
  {
    quote:
      "The structure it adds is the part I was always too impatient to write by hand.",
    name: "J. O.",
    role: "Marketer",
  },
  {
    quote:
      "Less guessing about what the model needs. The output is closer to what I meant on the first pass.",
    name: "D. N.",
    role: "Creator",
  },
  {
    quote:
      "Consistent prompts across a whole team without a shared doc nobody reads.",
    name: "T. V.",
    role: "Team lead",
  },
];

export function TestimonialsSection() {
  return (
    <section aria-label="Testimonials" className="border-t border-line">
      <div className="mx-auto max-w-[1440px] px-5 py-20 md:px-8 md:py-28">
        <Reveal>
          <SectionHeading
            label="Who it is for"
            title="Built for people who build with AI."
          />
        </Reveal>
      </div>

      <Reveal delayMs={90}>
        <Testimonials items={placeholderTestimonials} label="Testimonials" />
        <p className="mx-auto mt-6 max-w-[1440px] px-5 pb-20 text-center text-[12.5px] text-ink-3 md:px-8 md:pb-28">
          Sample quotes for illustration — not customer testimonials.
        </p>
      </Reveal>
    </section>
  );
}
