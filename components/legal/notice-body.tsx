"use client";

import Link from "next/link";

import { usePreferences, useT } from "@/components/i18n/preferences-provider";
import {
  EntityEmail,
  EntityField,
  LegalArticle,
  LegalList,
  LegalSection,
  P,
} from "@/components/legal/prose";
import { COPYRIGHT, LEGAL_ENTITY, ROUTES } from "@/lib/config";

const UPDATED = "2026-08-12";

export function NoticeBody() {
  const t = useT();
  const { locale } = usePreferences();
  const fr = locale === "fr";

  return (
    <LegalArticle title={t("legal.noticeTitle")} updated={UPDATED}>
      {fr ? (
        <>
          <LegalSection id="publisher" title="1. Éditeur">
            <P>
              Le service Yelhaa est édité par {LEGAL_ENTITY.name}, société
              immatriculée en {LEGAL_ENTITY.country}.
            </P>
            <LegalList
              items={[
                <EntityField key="f" field="form" label={t("legal.form")} />,
                <EntityField key="c" field="capital" label={t("legal.capital")} />,
                <EntityField key="s" field="siren" label={t("legal.siren")} />,
                <EntityField
                  key="t"
                  field="siret"
                  label={t("legal.siret")}
                />,
                <EntityField key="v" field="vat" label={t("legal.vat")} />,
                <EntityField key="a" field="address" label={t("legal.address")} />,
              ]}
            />
          </LegalSection>

          <LegalSection id="contact" title="2. Contact">
            <LegalList
              items={[
                <EntityField key="ph" field="phone" label={t("legal.phone")} />,
                <EntityEmail key="e" label={t("legal.email")} />,
                <span key="fm">
                  {t("legal.contactForm")}
                  {"\u00a0: "}
                  <Link
                    href={ROUTES.contact}
                    className="text-ink underline underline-offset-4"
                  >
                    {t("legal.contactPage")}
                  </Link>
                </span>,
              ]}
            />
          </LegalSection>

          <LegalSection id="direction" title="3. Publication et représentation">
            <LegalList
              items={[
                <EntityField
                  key="p"
                  field="publisher"
                  label={t("legal.publicationDirector")}
                />,
                <EntityField
                  key="rp"
                  field="representative"
                  label={t("legal.representative")}
                />,
              ]}
            />
          </LegalSection>

          <LegalSection id="hosting" title="4. Hébergement">
            <P>
              L’application et sa base de données sont hébergées par les
              prestataires suivants, chacun dans sa propre infrastructure :
            </P>
            <LegalList
              items={[
                "Supabase Inc. — authentification et base de données (970 Toa Payoh North, Singapore 318992, et son infrastructure régionale).",
                "Stripe Payments Europe, Ltd. — traitement des paiements (The One Building, 1 Grand Canal Street Lower, Dublin 2, Ireland).",
                "OpenAI, L.L.C. — moteur de génération et chat (3180 18th Street, San Francisco, CA 94110, United States).",
              ]}
            />
            <P>
              Le moteur de génération et le chat de suivi tournent sur OpenAI.
              Les idées, le texte des fichiers joints et les prompts produits
              sont envoyés à ce prestataire uniquement pour générer et affiner
              votre résultat.
            </P>
          </LegalSection>

          <LegalSection id="ip" title="5. Propriété intellectuelle">
            <P>
              Le nom Yelhaa, son logo, son interface et l’ensemble de son
              contenu éditorial sont la propriété de {LEGAL_ENTITY.name}, sauf
              mention contraire. Toute reproduction ou représentation, totale ou
              partielle, sans autorisation écrite préalable est interdite.
            </P>
            <P>
              Les noms et logos de tiers affichés sur le site — les outils avec
              lesquels Yelhaa est compatible — restent la propriété de leurs
              titulaires respectifs. Ils sont montrés comme une indication de
              compatibilité, et n’impliquent aucun partenariat, parrainage ou
              endorsement.
            </P>
          </LegalSection>

          <LegalSection id="related" title="6. Documents liés">
            <P>
              Les règles du service figurent dans les{" "}
              <Link
                href={ROUTES.terms}
                className="text-ink underline underline-offset-4"
              >
                {t("legal.termsOfService")}
              </Link>
              , et le traitement des données personnelles dans la{" "}
              <Link
                href={ROUTES.privacy}
                className="text-ink underline underline-offset-4"
              >
                {t("legal.privacyPolicy")}
              </Link>
              .
            </P>
          </LegalSection>
        </>
      ) : (
        <>
          <LegalSection id="publisher" title="1. Publisher">
            <P>
              The Yelhaa service is published by {LEGAL_ENTITY.name}, a company
              incorporated in {LEGAL_ENTITY.country}.
            </P>
            <LegalList
              items={[
                <EntityField key="f" field="form" label={t("legal.form")} />,
                <EntityField key="c" field="capital" label={t("legal.capital")} />,
                <EntityField key="s" field="siren" label={t("legal.siren")} />,
                <EntityField
                  key="t"
                  field="siret"
                  label={t("legal.siret")}
                />,
                <EntityField key="v" field="vat" label={t("legal.vat")} />,
                <EntityField key="a" field="address" label={t("legal.address")} />,
              ]}
            />
          </LegalSection>

          <LegalSection id="contact" title="2. Contact">
            <LegalList
              items={[
                <EntityField key="ph" field="phone" label={t("legal.phone")} />,
                <EntityEmail key="e" label={t("legal.email")} />,
                <span key="fm">
                  {t("legal.contactForm")}:{" "}
                  <Link
                    href={ROUTES.contact}
                    className="text-ink underline underline-offset-4"
                  >
                    {t("legal.contactPage")}
                  </Link>
                </span>,
              ]}
            />
          </LegalSection>

          <LegalSection id="direction" title="3. Publication and representation">
            <LegalList
              items={[
                <EntityField
                  key="p"
                  field="publisher"
                  label={t("legal.publicationDirector")}
                />,
                <EntityField
                  key="rp"
                  field="representative"
                  label={t("legal.representative")}
                />,
              ]}
            />
          </LegalSection>

          <LegalSection id="hosting" title="4. Hosting">
            <P>
              The application and its database are hosted by the following
              providers, each acting within its own infrastructure:
            </P>
            <LegalList
              items={[
                "Supabase Inc. — authentication and database (970 Toa Payoh North, Singapore 318992, and its regional infrastructure).",
                "Stripe Payments Europe, Ltd. — payment processing (The One Building, 1 Grand Canal Street Lower, Dublin 2, Ireland).",
                "OpenAI, L.L.C. — generation engine and chat (3180 18th Street, San Francisco, CA 94110, United States).",
              ]}
            />
            <P>
              The generation engine and the follow-up chat run on OpenAI. Ideas,
              attached file text and produced prompts are sent to that provider
              solely to generate and refine your result.
            </P>
          </LegalSection>

          <LegalSection id="ip" title="5. Intellectual property">
            <P>
              The Yelhaa name, its logo, its interface and the whole of its
              editorial content are the property of {LEGAL_ENTITY.name}, unless
              stated otherwise. Reproduction or representation, in whole or in
              part, without prior written authorisation is prohibited.
            </P>
            <P>
              Third-party names and logos shown on the site — the tools Yelhaa is
              compatible with — remain the property of their respective owners.
              They are displayed as a statement of compatibility, and imply no
              partnership, sponsorship or endorsement.
            </P>
          </LegalSection>

          <LegalSection id="related" title="6. Related documents">
            <P>
              The rules of the service are set out in the{" "}
              <Link
                href={ROUTES.terms}
                className="text-ink underline underline-offset-4"
              >
                {t("legal.termsOfService")}
              </Link>
              , and the handling of personal data in the{" "}
              <Link
                href={ROUTES.privacy}
                className="text-ink underline underline-offset-4"
              >
                {t("legal.privacyPolicy")}
              </Link>
              .
            </P>
          </LegalSection>
        </>
      )}

      <p className="mt-12 text-[12px] text-ink-3">{COPYRIGHT}</p>
    </LegalArticle>
  );
}
