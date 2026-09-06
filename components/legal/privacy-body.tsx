"use client";

import Link from "next/link";

import { usePreferences, useT } from "@/components/i18n/preferences-provider";
import {
  EntityEmail,
  LegalArticle,
  LegalList,
  LegalSection,
  LegalTable,
  P,
} from "@/components/legal/prose";
import { COPYRIGHT, LEGAL_ENTITY, ROUTES } from "@/lib/config";

const UPDATED = "2026-08-12";

export function PrivacyBody() {
  const t = useT();
  const { locale } = usePreferences();
  const fr = locale === "fr";

  return (
    <LegalArticle title={t("legal.privacyTitle")} updated={UPDATED}>
      {fr ? <PrivacyFr /> : <PrivacyEn />}
      <p className="mt-12 text-[12px] text-ink-3">{COPYRIGHT}</p>
    </LegalArticle>
  );
}

function PrivacyEn() {
  return (
    <>
      <LegalSection id="controller" title="1. Data controller">
        <P>
          The data controller is {LEGAL_ENTITY.name}, publisher of the Yelhaa
          service, a company incorporated in {LEGAL_ENTITY.country}.
        </P>
        <P>
          Its full company details — legal form, share capital, registration
          numbers, registered office and hosting providers — are set out in the{" "}
          <Link
            href={ROUTES.notice}
            className="text-ink underline underline-offset-4"
          >
            legal notice
          </Link>
          .
        </P>
        <P>
          Any request concerning your personal data goes to <EntityEmail />.
        </P>
        <P>
          Processing is governed by Regulation (EU) 2016/679 (GDPR) and by
          French law n° 78-17 of 6 January 1978, known as the{" "}
          <em>loi Informatique et Libertés</em>. The competent supervisory
          authority is the CNIL (Commission nationale de l&apos;informatique et
          des libertés).
        </P>
      </LegalSection>

      <LegalSection id="minimisation" title="2. Data minimisation">
        <P>
          Only the data required to run your account and the service is
          collected. There is no advertising profiling, no resale of data, and no
          automated decision-making producing legal effects within the meaning of
          Article 22 GDPR.
        </P>
      </LegalSection>

      <LegalSection id="data" title="3. Data processed, purposes and legal bases">
        <P>
          The table below lists what the service actually records, as it appears
          in its database schema.
        </P>
        <LegalTable
          caption="Data processed, purpose and legal basis"
          head={["Data", "Purpose", "Legal basis (GDPR)"]}
          rows={[
            [
              "Email address, account identifier, creation date",
              "Create and maintain the account, authenticate access",
              "Performance of a contract — art. 6(1)(b)",
            ],
            [
              "Plan, Stripe customer and subscription identifiers, renewal date",
              "Manage the subscription and access to quotas",
              "Performance of a contract — art. 6(1)(b)",
            ],
            [
              "Monthly generation counter and current period",
              "Enforce the plan quota",
              "Performance of a contract — art. 6(1)(b)",
            ],
            [
              "Ideas you submit, generated prompts, chosen template and domain, number of re-selections",
              "Provide the service and give you access to your history",
              "Performance of a contract — art. 6(1)(b)",
            ],
            [
              "Name, email, message and consent from the contact form",
              "Answer your request",
              "Consent — art. 6(1)(a)",
            ],
            [
              "Technical logs and rate-limiting counters",
              "Service security, abuse prevention",
              "Legitimate interest — art. 6(1)(f)",
            ],
            [
              "Accounting records relating to payments",
              "Comply with accounting and tax obligations",
              "Legal obligation — art. 6(1)(c)",
            ],
          ]}
        />
        <P>
          <strong className="text-ink">
            No payment card data is ever received or stored by Yelhaa.
          </strong>{" "}
          Payment is handled entirely by Stripe, which collects that data as a
          controller in its own right for that operation.
        </P>
      </LegalSection>

      <LegalSection id="processors" title="4. Recipients and processors">
        <P>
          Data is shared only with the providers strictly necessary to run the
          service. Each acts on documented instructions, under a contract
          compliant with Article 28 GDPR.
        </P>
        <LegalTable
          caption="Processors and recipients"
          head={["Provider", "Role", "Data concerned"]}
          rows={[
            [
              "Supabase",
              "Authentication and database",
              "Account, generations, counters, contact messages",
            ],
            [
              "Stripe",
              "Payment and subscription management",
              "Customer and subscription identifiers, payment data",
            ],
            [
              "OpenAI",
              "Generation engine and chat",
              "The idea you type, attached file text, and the produced prompt",
            ],
          ]}
        />
        <P>
          Some of these providers may process data outside the European Union.
          Such transfers are covered by the European Commission&apos;s standard
          contractual clauses or by an adequacy decision, in accordance with
          Chapter V GDPR.
        </P>
      </LegalSection>

      <LegalSection id="engine" title="5. Processing by the generation engine">
        <P>
          The idea you type is processed by the generation engine — OpenAI, on
          infrastructure operated by that provider — in order to produce your
          prompt. Do not enter special categories of personal data within the
          meaning of Article 9 GDPR (health, political opinions, religious
          beliefs, sexual orientation, biometric data), nor trade secrets you
          would not want leaving your machine.
        </P>
        <P>
          The text you submit is treated as data, never as an instruction to the
          system: a command hidden inside an idea is not executed.
        </P>
      </LegalSection>

      <LegalSection id="retention" title="6. Retention periods">
        <LegalList
          items={[
            "Account and generations: kept for as long as the account exists, then deleted when the account is deleted.",
            "Contact form messages: kept for as long as needed to handle and follow up on the request.",
            "Accounting records: kept for ten years, in accordance with article L123-22 of the French Code de commerce.",
            "Technical security logs: kept for a limited period, proportionate to the abuse-prevention purpose.",
          ]}
        />
        <P>
          Periods not set by law are decided by the publisher and reviewed
          whenever the service changes.
        </P>
      </LegalSection>

      <LegalSection id="rights" title="7. Your rights">
        <P>You have the following rights over your personal data:</P>
        <LegalList
          items={[
            "Right of access (art. 15 GDPR) — confirm whether your data is processed and obtain a copy of it.",
            "Right to rectification (art. 16) — have inaccurate data corrected.",
            "Right to erasure (art. 17) — have your data deleted.",
            "Right to restriction of processing (art. 18).",
            "Right to data portability (art. 20) — receive your data in a structured, machine-readable format.",
            "Right to object (art. 21), in particular to processing based on legitimate interest.",
            "Right to withdraw consent at any time (art. 7(3)), without affecting the lawfulness of processing carried out before withdrawal.",
            "Right to give directions on what happens to your data after your death (art. 85 of the loi Informatique et Libertés).",
          ]}
        />
        <P>
          Deleting your account and its associated data is available directly
          from the{" "}
          <Link href="/account" className="text-ink underline underline-offset-4">
            Account
          </Link>{" "}
          page. For anything else, write to the address given in section 1.
        </P>
        <P>
          If you believe your rights are not being respected, you may lodge a
          complaint with the CNIL (3 place de Fontenoy, TSA 80715, 75334 Paris
          Cedex 07, France —{" "}
          <a
            href="https://www.cnil.fr"
            target="_blank"
            rel="noreferrer noopener"
            className="text-ink underline underline-offset-4"
          >
            www.cnil.fr
          </a>
          ).
        </P>
      </LegalSection>

      <LegalSection id="security" title="8. Security">
        <LegalList
          items={[
            "Access to data is partitioned per user at the database level (row level security): a session can only read its own rows.",
            "API keys and internal secrets are never stored in user data, nor exposed to the browser.",
            "Contact form messages can neither be read nor written from the browser: they are inserted exclusively through a server route.",
            "Sensitive endpoints are rate-limited.",
          ]}
        />
      </LegalSection>

      <LegalSection id="breach" title="9. Data breaches and applicable penalties">
        <P>
          In the event of a personal data breach likely to result in a risk to
          your rights and freedoms, the CNIL is notified within 72 hours (art. 33
          GDPR) and you are informed without undue delay where the risk is high
          (art. 34).
        </P>
        <P>
          Failure to meet these obligations is punishable. Beyond the
          administrative fines under Article 83 GDPR — up to €20 million or 4% of
          total worldwide annual turnover — the French <em>Code pénal</em>{" "}
          notably provides:
        </P>
        <LegalList
          items={[
            "Article 226-17 — failure to implement security measures protecting personal data: five years' imprisonment and a €300,000 fine.",
            "Article 226-18 — collecting data by fraudulent, unfair or unlawful means: five years' imprisonment and a €300,000 fine.",
            "Article 226-21 — using data for a purpose other than the one it was collected for: five years' imprisonment and a €300,000 fine.",
            "Article 226-22 — disclosure harming the reputation or privacy of the person concerned: five years' imprisonment and a €300,000 fine.",
          ]}
        />
      </LegalSection>

      <LegalSection id="cookies" title="10. Cookies and trackers">
        <P>
          The service sets only the cookies strictly necessary for it to work,
          notably those keeping your session authenticated. These are exempt from
          consent under article 82 of the <em>loi Informatique et Libertés</em>.
        </P>
        <P>
          No advertising cookie and no consent-requiring analytics tracker is
          set. Were that to change, a consent banner would be put in place before
          any such cookie is set, with refusing as simple as accepting.
        </P>
      </LegalSection>

      <LegalSection id="minors" title="11. Minors">
        <P>
          The service is not intended for people under 15. In France, a
          minor&apos;s consent to the processing of their data in the context of
          an online service is only valid from that age (art. 45 of the{" "}
          <em>loi Informatique et Libertés</em>); below it, the authorisation of
          the holder of parental authority is required.
        </P>
      </LegalSection>

      <LegalSection id="changes" title="12. Changes">
        <P>
          Any substantial change to this policy is brought to your attention
          before it takes effect, and the date at the top of this page is
          updated.
        </P>
      </LegalSection>
    </>
  );
}

function PrivacyFr() {
  return (
    <>
      <LegalSection id="controller" title="1. Responsable du traitement">
        <P>
          Le responsable du traitement est {LEGAL_ENTITY.name}, éditeur du
          service Yelhaa, société immatriculée en {LEGAL_ENTITY.country}.
        </P>
        <P>
          Son identité complète — forme juridique, capital, numéros
          d’immatriculation, siège et hébergeurs — figure dans les{" "}
          <Link
            href={ROUTES.notice}
            className="text-ink underline underline-offset-4"
          >
            mentions légales
          </Link>
          .
        </P>
        <P>
          Toute demande relative à vos données personnelles s’adresse à{" "}
          <EntityEmail />.
        </P>
        <P>
          Le traitement est régi par le règlement (UE) 2016/679 (RGPD) et par la
          loi n° 78-17 du 6 janvier 1978, dite loi Informatique et Libertés.
          L’autorité de contrôle compétente est la CNIL (Commission nationale de
          l’informatique et des libertés).
        </P>
      </LegalSection>

      <LegalSection id="minimisation" title="2. Minimisation des données">
        <P>
          Seules les données nécessaires au fonctionnement de votre compte et du
          service sont collectées. Il n’y a ni profilage publicitaire, ni
          revente de données, ni décision automatisée produisant des effets
          juridiques au sens de l’article 22 du RGPD.
        </P>
      </LegalSection>

      <LegalSection
        id="data"
        title="3. Données traitées, finalités et bases légales"
      >
        <P>
          Le tableau ci-dessous liste ce que le service enregistre réellement,
          tel qu’il figure dans son schéma de base.
        </P>
        <LegalTable
          caption="Données traitées, finalité et base légale"
          head={["Données", "Finalité", "Base légale (RGPD)"]}
          rows={[
            [
              "Adresse e-mail, identifiant de compte, date de création",
              "Créer et maintenir le compte, authentifier l’accès",
              "Exécution d’un contrat — art. 6(1)(b)",
            ],
            [
              "Plan, identifiants client et abonnement Stripe, date de renouvellement",
              "Gérer l’abonnement et l’accès aux quotas",
              "Exécution d’un contrat — art. 6(1)(b)",
            ],
            [
              "Compteur mensuel de générations et période en cours",
              "Appliquer le quota du plan",
              "Exécution d’un contrat — art. 6(1)(b)",
            ],
            [
              "Idées soumises, prompts générés, template et domaine retenus, nombre de re-sélections",
              "Fournir le service et vous donner accès à votre historique",
              "Exécution d’un contrat — art. 6(1)(b)",
            ],
            [
              "Nom, e-mail, message et consentement du formulaire de contact",
              "Répondre à votre demande",
              "Consentement — art. 6(1)(a)",
            ],
            [
              "Journaux techniques et compteurs de limitation",
              "Sécurité du service, prévention des abus",
              "Intérêt légitime — art. 6(1)(f)",
            ],
            [
              "Pièces comptables relatives aux paiements",
              "Respecter les obligations comptables et fiscales",
              "Obligation légale — art. 6(1)(c)",
            ],
          ]}
        />
        <P>
          <strong className="text-ink">
            Aucune donnée de carte bancaire n’est jamais reçue ni stockée par
            Yelhaa.
          </strong>{" "}
          Le paiement est entièrement géré par Stripe, qui collecte ces données
          en tant que responsable de traitement pour cette opération.
        </P>
      </LegalSection>

      <LegalSection id="processors" title="4. Destinataires et sous-traitants">
        <P>
          Les données ne sont partagées qu’avec les prestataires strictement
          nécessaires au fonctionnement du service. Chacun agit sur instruction
          documentée, dans le cadre d’un contrat conforme à l’article 28 du RGPD.
        </P>
        <LegalTable
          caption="Sous-traitants et destinataires"
          head={["Prestataire", "Rôle", "Données concernées"]}
          rows={[
            [
              "Supabase",
              "Authentification et base de données",
              "Compte, générations, compteurs, messages de contact",
            ],
            [
              "Stripe",
              "Paiement et gestion des abonnements",
              "Identifiants client et abonnement, données de paiement",
            ],
            [
              "OpenAI",
              "Moteur de génération et chat",
              "L’idée que vous tapez, le texte des fichiers joints et le prompt produit",
            ],
          ]}
        />
        <P>
          Certains de ces prestataires peuvent traiter des données hors de
          l’Union européenne. Ces transferts sont encadrés par les clauses
          contractuelles types de la Commission européenne ou par une décision
          d’adéquation, conformément au chapitre V du RGPD.
        </P>
      </LegalSection>

      <LegalSection id="engine" title="5. Traitement par le moteur de génération">
        <P>
          L’idée que vous tapez est traitée par le moteur de génération —
          OpenAI, sur une infrastructure opérée par ce prestataire — afin de
          produire votre prompt. N’y saisissez pas de catégories particulières
          de données au sens de l’article 9 du RGPD (santé, opinions politiques,
          convictions religieuses, orientation sexuelle, données biométriques),
          ni de secrets d’affaires que vous ne voudriez pas voir quitter votre
          machine.
        </P>
        <P>
          Le texte que vous soumettez est traité comme une donnée, jamais comme
          une instruction au système : une commande cachée dans une idée n’est
          pas exécutée.
        </P>
      </LegalSection>

      <LegalSection id="retention" title="6. Durées de conservation">
        <LegalList
          items={[
            "Compte et générations : conservés tant que le compte existe, puis supprimés à la suppression du compte.",
            "Messages du formulaire de contact : conservés le temps nécessaire au traitement et au suivi de la demande.",
            "Pièces comptables : conservées dix ans, conformément à l’article L123-22 du Code de commerce.",
            "Journaux techniques de sécurité : conservés pour une durée limitée, proportionnée à la prévention des abus.",
          ]}
        />
        <P>
          Les durées non fixées par la loi sont décidées par l’éditeur et
          réexaminées à chaque évolution du service.
        </P>
      </LegalSection>

      <LegalSection id="rights" title="7. Vos droits">
        <P>Vous disposez des droits suivants sur vos données personnelles :</P>
        <LegalList
          items={[
            "Droit d’accès (art. 15 RGPD) — confirmer si vos données sont traitées et en obtenir une copie.",
            "Droit de rectification (art. 16) — faire corriger des données inexactes.",
            "Droit à l’effacement (art. 17) — faire supprimer vos données.",
            "Droit à la limitation du traitement (art. 18).",
            "Droit à la portabilité (art. 20) — recevoir vos données dans un format structuré et lisible par machine.",
            "Droit d’opposition (art. 21), notamment au traitement fondé sur l’intérêt légitime.",
            "Droit de retirer votre consentement à tout moment (art. 7(3)), sans affecter la licéité du traitement antérieur.",
            "Droit de donner des directives sur le sort de vos données après votre décès (art. 85 de la loi Informatique et Libertés).",
          ]}
        />
        <P>
          La suppression de votre compte et des données associées est disponible
          directement depuis la page{" "}
          <Link href="/account" className="text-ink underline underline-offset-4">
            Compte
          </Link>
          . Pour tout le reste, écrivez à l’adresse indiquée au § 1.
        </P>
        <P>
          Si vous estimez que vos droits ne sont pas respectés, vous pouvez
          introduire une réclamation auprès de la CNIL (3 place de Fontenoy, TSA
          80715, 75334 Paris Cedex 07, France —{" "}
          <a
            href="https://www.cnil.fr"
            target="_blank"
            rel="noreferrer noopener"
            className="text-ink underline underline-offset-4"
          >
            www.cnil.fr
          </a>
          ).
        </P>
      </LegalSection>

      <LegalSection id="security" title="8. Sécurité">
        <LegalList
          items={[
            "L’accès aux données est cloisonné par utilisateur au niveau de la base (row level security) : une session ne lit que ses propres lignes.",
            "Les clés API et secrets internes ne sont jamais stockés dans les données utilisateur, ni exposés au navigateur.",
            "Les messages du formulaire de contact ne peuvent être ni lus ni écrits depuis le navigateur : ils sont insérés exclusivement par une route serveur.",
            "Les points d’entrée sensibles sont limités en débit.",
          ]}
        />
      </LegalSection>

      <LegalSection
        id="breach"
        title="9. Violations de données et sanctions applicables"
      >
        <P>
          En cas de violation de données personnelles susceptible d’engendrer un
          risque pour vos droits et libertés, la CNIL est notifiée dans les 72
          heures (art. 33 RGPD) et vous êtes informé sans délai injustifié
          lorsque le risque est élevé (art. 34).
        </P>
        <P>
          Le manquement à ces obligations est sanctionné. Outre les amendes
          administratives de l’article 83 du RGPD — jusqu’à 20 millions d’euros
          ou 4 % du chiffre d’affaires annuel mondial — le Code pénal prévoit
          notamment :
        </P>
        <LegalList
          items={[
            "Article 226-17 — défaut de mesures de sécurité protégeant les données personnelles : cinq ans d’emprisonnement et 300 000 € d’amende.",
            "Article 226-18 — collecte de données par un moyen frauduleux, déloyal ou illicite : cinq ans d’emprisonnement et 300 000 € d’amende.",
            "Article 226-21 — détournement de la finalité pour laquelle les données ont été collectées : cinq ans d’emprisonnement et 300 000 € d’amende.",
            "Article 226-22 — divulgation portant atteinte à la réputation ou à l’intimité de la personne concernée : cinq ans d’emprisonnement et 300 000 € d’amende.",
          ]}
        />
      </LegalSection>

      <LegalSection id="cookies" title="10. Cookies et traceurs">
        <P>
          Le service ne dépose que les cookies strictement nécessaires à son
          fonctionnement, notamment ceux qui maintiennent votre session
          authentifiée. Ils sont exemptés de consentement au titre de l’article
          82 de la loi Informatique et Libertés.
        </P>
        <P>
          Aucun cookie publicitaire ni traceur d’audience soumis à
          consentement n’est déposé. Si cela changeait, une bannière de
          consentement serait mise en place avant tout dépôt, le refus étant
          aussi simple que l’acceptation.
        </P>
      </LegalSection>

      <LegalSection id="minors" title="11. Mineurs">
        <P>
          Le service n’est pas destiné aux personnes de moins de 15 ans. En
          France, le consentement d’un mineur au traitement de ses données dans
          le cadre d’un service en ligne n’est valable qu’à partir de cet âge
          (art. 45 de la loi Informatique et Libertés) ; en deçà, l’autorisation
          du titulaire de l’autorité parentale est requise.
        </P>
      </LegalSection>

      <LegalSection id="changes" title="12. Modifications">
        <P>
          Toute modification substantielle de cette politique vous est
          portée à connaissance avant son entrée en vigueur, et la date en tête
          de page est mise à jour.
        </P>
      </LegalSection>
    </>
  );
}
