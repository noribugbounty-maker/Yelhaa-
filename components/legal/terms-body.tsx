"use client";

import Link from "next/link";

import { usePreferences, useT } from "@/components/i18n/preferences-provider";
import {
  EntityField,
  LegalArticle,
  LegalList,
  LegalSection,
  P,
} from "@/components/legal/prose";
import {
  COPYRIGHT,
  LEGAL_ENTITY,
  MAX_RESELECTS_PER_GENERATION,
  PLANS,
  ROUTES,
  formatUsd,
} from "@/lib/config";

const UPDATED = "2026-08-12";

export function TermsBody() {
  const t = useT();
  const { locale } = usePreferences();
  const paid = PLANS.filter((plan) => plan.priceUsd > 0);

  return (
    <LegalArticle title={t("legal.termsTitle")} updated={UPDATED}>
      {locale === "fr" ? (
        <TermsFr paid={paid.length} />
      ) : (
        <TermsEn paid={paid.length} />
      )}
      <p className="mt-12 text-[12px] text-ink-3">{COPYRIGHT}</p>
    </LegalArticle>
  );
}

function PlanList({ perMonth, generations }: { perMonth: string; generations: string }) {
  const t = useT();
  return (
    <ul className="flex flex-col gap-2 text-ink-2">
      {PLANS.map((plan) => (
        <li key={plan.id} className="flex items-baseline gap-3">
          <span className="w-20 shrink-0 text-ink">
            {t(`pricing.${plan.id}Name`)}
          </span>
          <span className="font-mono tabular-nums">
            {formatUsd(plan.priceUsd)}
            {plan.priceUsd > 0 ? ` ${perMonth}` : ""}
          </span>
          <span>
            · {plan.generationsPerMonth} {generations}
          </span>
        </li>
      ))}
    </ul>
  );
}

function TermsEn({ paid }: { paid: number }) {
  const t = useT();
  return (
    <>
      <LegalSection id="publisher" title="1. Publisher and purpose">
        <P>
          The Yelhaa service is published by {LEGAL_ENTITY.name}, a company
          incorporated in {LEGAL_ENTITY.country}.
        </P>
        <P>
          Its full company details — legal form, share capital, registration
          numbers, registered office, contact details and publication director —
          are set out in the{" "}
          <Link
            href={ROUTES.notice}
            className="text-ink underline underline-offset-4"
          >
            {t("legal.legalNotice")}
          </Link>
          .
        </P>
        <P>
          Yelhaa turns an idea written in plain language into a structured
          prompt, then opens that idea in a multi-AI development environment.
          These terms govern access to and use of the service. Creating an
          account constitutes acceptance.
        </P>
      </LegalSection>

      <LegalSection id="account" title="2. Account">
        <P>
          Using the service requires an account. You are responsible for the
          accuracy of the information you provide, for keeping your credentials
          confidential, and for all activity carried out from your account. An
          account is personal and must not be shared.
        </P>
        <P>The service is not intended for people under 15.</P>
      </LegalSection>

      <LegalSection id="plans" title="3. Plans and quotas">
        <P>
          One unit is counted: the generation. A generation is one complete run
          of the engine, whatever its internal complexity.{" "}
          <strong className="text-ink">
            A failed generation never counts against your quota.
          </strong>
        </P>
        <PlanList perMonth={t("legal.perMonth")} generations={t("legal.generationsMonth")} />
        <P>
          Each generation entitles you to {MAX_RESELECTS_PER_GENERATION} art
          direction changes on the result obtained, without consuming another
          generation.
        </P>
        <P>
          Counters reset on the 1st of every month, automatically. Unused
          generations do not roll over. When you reach your limit, generation
          stops and nothing extra is billed.
        </P>
        <P>
          The {paid} paid plans are monthly subscriptions. There is no one-off
          payment and no lifetime access. Prices are shown in US dollars,
          exclusive of any applicable taxes.
        </P>
      </LegalSection>

      <LegalSection id="acceptable-use" title="4. Prohibited uses">
        <P>
          The service must not be used to prepare, facilitate or commit an
          offence. The following are prohibited in particular, with their
          criminal classification under French law given for reference:
        </P>
        <LegalList
          items={[
            "Fraudulently accessing or remaining within the service or any system it gives access to, impairing its operation, or introducing, altering or deleting data — articles 323-1 to 323-3 of the Code pénal, up to five years' imprisonment and a €150,000 fine.",
            "Producing or distributing content inciting hatred, violence or discrimination, or insulting on grounds of origin, religion, sex, sexual orientation or disability — articles 24 and 33 of the law of 29 July 1881 and article R625-7 of the Code pénal.",
            "Infringing third-party intellectual property rights, in particular by counterfeiting — articles L335-2 et seq. of the Code de la propriété intellectuelle, three years' imprisonment and a €300,000 fine.",
            "Impersonating a third party or using data identifying them in order to disturb their peace or harm their honour — article 226-4-1 of the Code pénal.",
            "Processing third-party personal data in breach of the GDPR, in particular by unfair collection or repurposing — articles 226-16 to 226-22 of the Code pénal.",
            "Producing, distributing or possessing child sexual abuse material — article 227-23 of the Code pénal.",
            "Circumventing quotas, rate limits or any access control of the service, or automating its use beyond what the interface allows.",
          ]}
        />
        <P>
          Any breach may lead to immediate suspension or termination of the
          account, without refund, and where appropriate to a report to the
          competent authorities.
        </P>
      </LegalSection>

      <LegalSection id="content" title="5. Your content and the results produced">
        <P>
          You keep all rights over the ideas you submit. To the extent of the
          rights the publisher is able to assign, the prompts generated from your
          ideas belong to you and you may use them freely, including
          commercially.
        </P>
        <P>
          You warrant that you hold the necessary rights over the content you
          submit. You grant the publisher a licence limited to what is
          technically necessary to operate the service: processing your idea,
          sending it to the engine, storing the result and returning it to you.
        </P>
        <P>
          A result produced by a model is not guaranteed to be accurate, original
          or free of resemblance to pre-existing content. It is your
          responsibility to check it before any use, in particular commercial
          use.
        </P>
      </LegalSection>

      <LegalSection id="availability" title="6. Availability">
        <P>
          The service is provided as is, with no service level commitment. It
          depends on third-party providers, and interruptions — maintenance, an
          incident, a provider failure — can occur. The publisher works to keep
          them short and to inform users when their duration warrants it.
        </P>
      </LegalSection>

      <LegalSection id="cancellation" title="7. Cancellation and refunds">
        <P>
          Cancellation is done from the{" "}
          <Link href="/account" className="text-ink underline underline-offset-4">
            {t("legal.accountPage")}
          </Link>{" "}
          page, through the customer portal, and takes effect at the end of the
          period already paid for.
        </P>
        <P>
          No refund is granted after a purchase, except for a genuine error
          attributable to the service: a payment taken without the plan being
          activated, or a double charge.
        </P>
        <P>
          <strong className="text-ink">Right of withdrawal.</strong> Consumers
          normally have fourteen days to withdraw (art. L221-18 of the French{" "}
          <em>Code de la consommation</em>). By subscribing and starting to use
          the service immediately, you expressly request its performance before
          the end of that period and waive your right of withdrawal for the part
          already performed, in accordance with article L221-28, 1° and 13° of
          the same code.
        </P>
        <P>
          The publisher may terminate an account for breach of these terms, in
          particular the prohibited uses in section 4.
        </P>
      </LegalSection>

      <LegalSection id="liability" title="8. Statutory guarantees and liability">
        <P>
          The statutory guarantees of conformity and against hidden defects
          (art. L217-1 et seq. of the <em>Code de la consommation</em>, art. 1641
          et seq. of the <em>Code civil</em>) apply as of right and are not
          excluded by these terms.
        </P>
        <P>
          Beyond those guarantees, the publisher&apos;s liability is limited to
          direct and foreseeable damage, and capped at the amounts actually paid
          during the twelve months preceding the triggering event. No limitation
          applies in cases of wilful misconduct, gross negligence or personal
          injury.
        </P>
      </LegalSection>

      <LegalSection id="data" title="9. Personal data">
        <P>
          How your data is processed is described in the{" "}
          <Link
            href="/legal/privacy"
            className="text-ink underline underline-offset-4"
          >
            {t("legal.privacyPolicy")}
          </Link>
          , which forms an integral part of these terms.
        </P>
      </LegalSection>

      <LegalSection id="changes" title="10. Changes">
        <P>
          These terms may be amended. Any substantial change is brought to your
          attention before it takes effect. If you do not accept it, you may
          cancel your subscription under the conditions in section 7.
        </P>
      </LegalSection>

      <LegalSection id="law" title="11. Governing law and disputes">
        <P>
          <strong className="text-ink">
            These terms are governed by French law
          </strong>
          , the publisher being a company incorporated in France. In the event of
          a dispute, an amicable solution will be sought first.
        </P>
        <P>
          Under article L612-1 of the <em>Code de la consommation</em>, consumers
          may use, free of charge, the consumer mediator the publisher is
          registered with (
          <EntityField field="mediator" label={t("legal.mediator")} />
          ). The European online dispute resolution platform is available at{" "}
          <a
            href="https://ec.europa.eu/consumers/odr"
            target="_blank"
            rel="noreferrer noopener"
            className="text-ink underline underline-offset-4"
          >
            ec.europa.eu/consumers/odr
          </a>
          .
        </P>
        <P>
          Failing agreement, the dispute will be brought before the competent
          French courts. Consumers keep the right to bring proceedings before the
          court of their own place of residence.
        </P>
      </LegalSection>
    </>
  );
}

function TermsFr({ paid }: { paid: number }) {
  const t = useT();
  return (
    <>
      <LegalSection id="publisher" title="1. Éditeur et objet">
        <P>
          Le service Yelhaa est édité par {LEGAL_ENTITY.name}, société
          immatriculée en {LEGAL_ENTITY.country}.
        </P>
        <P>
          Son identité complète — forme juridique, capital, numéros
          d’immatriculation, siège, coordonnées et directeur de la publication —
          figure dans les{" "}
          <Link
            href={ROUTES.notice}
            className="text-ink underline underline-offset-4"
          >
            {t("legal.legalNotice")}
          </Link>
          .
        </P>
        <P>
          Yelhaa transforme une idée écrite en langage courant en prompt
          structuré, puis ouvre cette idée dans un environnement de
          développement multi-IA. Les présentes conditions régissent l’accès au
          service et son usage. La création d’un compte vaut acceptation.
        </P>
      </LegalSection>

      <LegalSection id="account" title="2. Compte">
        <P>
          L’usage du service suppose un compte. Vous êtes responsable de
          l’exactitude des informations fournies, de la confidentialité de vos
          identifiants, et de toute activité menée depuis votre compte. Un
          compte est personnel et ne doit pas être partagé.
        </P>
        <P>Le service n’est pas destiné aux personnes de moins de 15 ans.</P>
      </LegalSection>

      <LegalSection id="plans" title="3. Plans et quotas">
        <P>
          Une seule unité est comptée : la génération. Une génération est une
          passe complète du moteur, quelle que soit sa complexité interne.{" "}
          <strong className="text-ink">
            Une génération échouée n’est jamais décomptée de votre quota.
          </strong>
        </P>
        <PlanList perMonth={t("legal.perMonth")} generations={t("legal.generationsMonth")} />
        <P>
          Chaque génération vous donne droit à {MAX_RESELECTS_PER_GENERATION}{" "}
          changements de direction artistique sur le résultat obtenu, sans
          consommer une autre génération.
        </P>
        <P>
          Les compteurs se réinitialisent automatiquement le 1er de chaque mois.
          Les générations non utilisées ne sont pas reportées. Lorsque vous
          atteignez votre limite, la génération s’arrête et rien de plus n’est
          facturé.
        </P>
        <P>
          Les {paid} plans payants sont des abonnements mensuels. Il n’existe
          ni paiement unique ni accès à vie. Les prix sont indiqués en dollars
          américains, hors taxes applicables.
        </P>
      </LegalSection>

      <LegalSection id="acceptable-use" title="4. Usages interdits">
        <P>
          Le service ne doit pas servir à préparer, faciliter ou commettre une
          infraction. Sont notamment interdits, avec leur qualification pénale
          de droit français à titre de référence :
        </P>
        <LegalList
          items={[
            "Accéder ou se maintenir frauduleusement dans le service ou tout système auquel il donne accès, en entraver le fonctionnement, ou y introduire, modifier ou supprimer des données — articles 323-1 à 323-3 du Code pénal, jusqu’à cinq ans d’emprisonnement et 150 000 € d’amende.",
            "Produire ou diffuser un contenu incitant à la haine, à la violence ou à la discrimination, ou injurieux en raison de l’origine, de la religion, du sexe, de l’orientation sexuelle ou du handicap — articles 24 et 33 de la loi du 29 juillet 1881 et article R625-7 du Code pénal.",
            "Porter atteinte aux droits de propriété intellectuelle de tiers, notamment par contrefaçon — articles L335-2 et suivants du Code de la propriété intellectuelle, trois ans d’emprisonnement et 300 000 € d’amende.",
            "Usurper l’identité d’un tiers ou utiliser des données l’identifiant afin de troubler sa tranquillité ou de porter atteinte à son honneur — article 226-4-1 du Code pénal.",
            "Traiter des données personnelles de tiers en violation du RGPD, notamment par collecte déloyale ou détournement de finalité — articles 226-16 à 226-22 du Code pénal.",
            "Produire, diffuser ou détenir des contenus pédopornographiques — article 227-23 du Code pénal.",
            "Contourner les quotas, les limites de débit ou tout contrôle d’accès du service, ou automatiser son usage au-delà de ce que l’interface permet.",
          ]}
        />
        <P>
          Tout manquement peut entraîner la suspension ou la résiliation
          immédiate du compte, sans remboursement, et le cas échéant un signalement
          aux autorités compétentes.
        </P>
      </LegalSection>

      <LegalSection id="content" title="5. Votre contenu et les résultats produits">
        <P>
          Vous conservez tous les droits sur les idées que vous soumettez. Dans
          la limite des droits que l’éditeur est en mesure de céder, les prompts
          générés à partir de vos idées vous appartiennent et vous pouvez les
          utiliser librement, y compris à des fins commerciales.
        </P>
        <P>
          Vous garantissez disposer des droits nécessaires sur le contenu que
          vous soumettez. Vous concédez à l’éditeur une licence limitée à ce
          qui est techniquement nécessaire pour exploiter le service : traiter
          votre idée, l’envoyer au moteur, stocker le résultat et vous le
          restituer.
        </P>
        <P>
          Un résultat produit par un modèle n’est pas garanti exact, original
          ni exempt de ressemblance avec un contenu préexistant. Il vous
          appartient de le vérifier avant tout usage, notamment commercial.
        </P>
      </LegalSection>

      <LegalSection id="availability" title="6. Disponibilité">
        <P>
          Le service est fourni en l’état, sans engagement de niveau de service.
          Il dépend de prestataires tiers, et des interruptions — maintenance,
          incident, défaillance d’un prestataire — peuvent survenir. L’éditeur
          s’emploie à les limiter et à informer les utilisateurs lorsque leur
          durée le justifie.
        </P>
      </LegalSection>

      <LegalSection id="cancellation" title="7. Résiliation et remboursement">
        <P>
          La résiliation se fait depuis la page{" "}
          <Link href="/account" className="text-ink underline underline-offset-4">
            {t("legal.accountPage")}
          </Link>
          , via le portail client, et prend effet à la fin de la période déjà
          payée.
        </P>
        <P>
          Aucun remboursement n’est accordé après un achat, sauf erreur
          véritable imputable au service : un paiement prélevé sans activation
          du plan, ou un double débit.
        </P>
        <P>
          <strong className="text-ink">Droit de rétractation.</strong> Les
          consommateurs disposent en principe de quatorze jours pour se
          rétracter (art. L221-18 du Code de la consommation). En vous abonnant
          et en commençant à utiliser le service immédiatement, vous demandez
          expressément son exécution avant la fin de ce délai et renoncez à
          votre droit de rétractation pour la partie déjà exécutée, conformément
          à l’article L221-28, 1° et 13° du même code.
        </P>
        <P>
          L’éditeur peut résilier un compte pour manquement aux présentes
          conditions, notamment aux usages interdits du § 4.
        </P>
      </LegalSection>

      <LegalSection id="liability" title="8. Garanties légales et responsabilité">
        <P>
          Les garanties légales de conformité et des vices cachés (art. L217-1
          et suivants du Code de la consommation, art. 1641 et suivants du Code
          civil) s’appliquent de plein droit et ne sont pas écartées par les
          présentes.
        </P>
        <P>
          Au-delà de ces garanties, la responsabilité de l’éditeur est limitée
          au préjudice direct et prévisible, et plafonnée aux montants
          effectivement versés pendant les douze mois précédant le fait
          générateur. Aucune limitation ne s’applique en cas de dol, de faute
          lourde ou de préjudice corporel.
        </P>
      </LegalSection>

      <LegalSection id="data" title="9. Données personnelles">
        <P>
          Le traitement de vos données est décrit dans la{" "}
          <Link
            href="/legal/privacy"
            className="text-ink underline underline-offset-4"
          >
            {t("legal.privacyPolicy")}
          </Link>
          , qui fait partie intégrante des présentes conditions.
        </P>
      </LegalSection>

      <LegalSection id="changes" title="10. Modifications">
        <P>
          Les présentes conditions peuvent être modifiées. Toute modification
          substantielle vous est portée à connaissance avant son entrée en
          vigueur. Si vous ne l’acceptez pas, vous pouvez résilier votre
          abonnement dans les conditions du § 7.
        </P>
      </LegalSection>

      <LegalSection id="law" title="11. Droit applicable et litiges">
        <P>
          <strong className="text-ink">
            Les présentes conditions sont régies par le droit français
          </strong>
          , l’éditeur étant une société immatriculée en France. En cas de
          litige, une solution amiable sera recherchée en premier lieu.
        </P>
        <P>
          Conformément à l’article L612-1 du Code de la consommation, le
          consommateur peut recourir gratuitement au médiateur de la
          consommation auprès duquel l’éditeur est inscrit (
          <EntityField field="mediator" label={t("legal.mediator")} />
          ). La plateforme européenne de règlement en ligne des litiges est
          disponible à{" "}
          <a
            href="https://ec.europa.eu/consumers/odr"
            target="_blank"
            rel="noreferrer noopener"
            className="text-ink underline underline-offset-4"
          >
            ec.europa.eu/consumers/odr
          </a>
          .
        </P>
        <P>
          À défaut d’accord, le litige sera porté devant les juridictions
          françaises compétentes. Le consommateur conserve le droit de saisir
          le tribunal de son lieu de résidence.
        </P>
      </LegalSection>
    </>
  );
}
