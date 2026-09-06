"use client";

import { useT } from "@/components/i18n/preferences-provider";
import { SectionHeading } from "@/components/landing/section-heading";
import { Reveal } from "@/components/site/reveal";
import { TextBlockAnimation } from "@/components/ui/text-block-animation";
import { LANDING_ANCHORS } from "@/lib/config";

export function PromptSection() {
  const t = useT();

  const steps = [
    {
      label: t("features.step1Label"),
      title: t("features.step1Title"),
      mono: true,
      body: t("features.step1Body"),
    },
    {
      label: t("features.step2Label"),
      title: t("features.step2Title"),
      mono: false,
      body: t("features.step2Body"),
    },
    {
      label: t("features.step3Label"),
      title: t("features.step3Title"),
      mono: false,
      body: t("features.step3Body"),
    },
  ];

  return (
    <section
      id={LANDING_ANCHORS.features}
      aria-label={t("features.aria")}
      className="border-t border-line"
    >
      <div className="mx-auto max-w-[1440px] scroll-mt-20 px-5 py-20 md:px-8 md:py-28">
        <Reveal>
          <SectionHeading
            align="left"
            label={t("features.label")}
            title={t("features.title")}
            description={t("features.description")}
          />
        </Reveal>

        <ol className="mt-16 grid gap-px overflow-hidden rounded-[6px] border border-line bg-line md:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.label} className="bg-void">
              <Reveal delayMs={120 * index} className="h-full">
                <div className="flex h-full flex-col p-6 md:p-8">
                  <p className="type-label">{step.label}</p>
                  <TextBlockAnimation
                    as="h3"
                    className={
                      step.mono
                        ? "mt-6 font-mono text-[17px] leading-[1.5] text-ink-2"
                        : "mt-6 text-[22px] font-semibold leading-[1.2] tracking-[-0.02em] text-ink"
                    }
                  >
                    {step.mono ? `"${step.title}"` : step.title}
                  </TextBlockAnimation>
                  <p className="mt-5 text-[14.5px] leading-[1.6] text-ink-2">
                    {step.body}
                  </p>
                  {index < steps.length - 1 ? (
                    <span
                      aria-hidden="true"
                      className="mt-auto pt-8 text-[13px] text-ink-3"
                    >
                      ↓
                    </span>
                  ) : null}
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
