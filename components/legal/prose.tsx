"use client";

import { usePreferences } from "@/components/i18n/preferences-provider";
import { LegalUpdated, MissingField } from "@/components/legal/legal-chrome";
import { LEGAL_ENTITY } from "@/lib/config";

/**
 * Briques de mise en page des documents légaux.
 *
 * Les deux pages partagent exactement la même structure : une hiérarchie de
 * titres, des listes à puces et des blocs d'avertissement. Les factoriser évite
 * qu'une correction typographique n'atterrisse que sur l'une des deux — le pire
 * défaut d'un couple CGU / politique de confidentialité étant qu'ils se
 * contredisent.
 */

export function LegalArticle({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <article className="mx-auto max-w-3xl px-5 py-20 md:px-8 md:py-28">
      <h1 className="type-h2 text-ink">{title}</h1>
      <p className="mt-3 text-[13px] text-ink-3">
        <LegalUpdated date={updated} />
      </p>
      {children}
    </article>
  );
}

export function LegalSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="mt-12">
      <h2 id={id} className="type-h3 text-ink">
        {title}
      </h2>
      <div className="mt-3 flex flex-col gap-3">{children}</div>
    </section>
  );
}

export function P({ children }: { children: React.ReactNode }) {
  return <p className="max-w-[68ch] text-ink-2">{children}</p>;
}

export function LegalList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="flex flex-col gap-2.5">
      {items.map((item, index) => (
        <li key={index} className="flex max-w-[68ch] items-start gap-2.5">
          <span
            aria-hidden="true"
            className="mt-2.5 size-1 shrink-0 rounded-full bg-volt"
          />
          <span className="text-ink-2">{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Tableau simple — un en-tête, des lignes. Défile seul s'il déborde. */
export function LegalTable({
  caption,
  head,
  rows,
}: {
  caption: string;
  head: string[];
  rows: React.ReactNode[][];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[520px] border-collapse text-left text-[14px]">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            {head.map((cell) => (
              <th
                key={cell}
                scope="col"
                className="border-b border-line pb-2 pr-4 type-label"
              >
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="border-b border-line py-3 pr-4 align-top text-ink-2"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Champ d'identité de l'éditeur.
 *
 * Rendu tel quel s'il est renseigné, **et visiblement signalé comme manquant
 * sinon**. C'est le seul traitement honnête : remplir au jugé produirait une
 * mention légale fausse, et masquer le champ ferait croire le document complet.
 */
export function EntityField({
  field,
  label,
}: {
  field: keyof typeof LEGAL_ENTITY;
  label: string;
}) {
  const { locale } = usePreferences();
  const value = LEGAL_ENTITY[field];
  const sep = locale === "fr" ? "\u00a0: " : ": ";
  if (value) {
    return (
      <>
        {label}
        {sep}
        {value}
      </>
    );
  }
  return (
    <>
      {label}
      {sep}
      <MissingField />
    </>
  );
}

/**
 * Adresse e-mail de l'éditeur, en lien `mailto:` si elle est renseignée.
 *
 * Même règle que `EntityField` : un champ vide est signalé, jamais rendu comme
 * un `mailto:` sans destinataire. Sans `label`, le lien s'insère dans une
 * phrase ; avec, il forme une ligne « Email: … » dans une liste.
 */
export function EntityEmail({ label }: { label?: string }) {
  const { locale } = usePreferences();
  const email = LEGAL_ENTITY.privacyEmail;
  const sep = locale === "fr" ? "\u00a0: " : ": ";
  const prefix = label ? `${label}${sep}` : "";
  if (email) {
    return (
      <>
        {prefix}
        <a
          href={`mailto:${email}`}
          className="text-ink underline underline-offset-4"
        >
          {email}
        </a>
      </>
    );
  }
  return (
    <>
      {prefix}
      <MissingField />
    </>
  );
}


/** Bandeau d'avertissement — filet `--warn` à gauche, jamais une couleur seule. */
export function LegalNotice({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      aria-label={title}
      className="mt-12 border border-line border-l-2 border-l-warn bg-surface p-5"
    >
      <h2 className="type-h3 text-ink">{title}</h2>
      <div className="mt-3 flex flex-col gap-3">{children}</div>
    </section>
  );
}
