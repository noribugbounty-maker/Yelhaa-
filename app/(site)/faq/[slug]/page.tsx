import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { FaqArticleView } from "@/components/faq/faq-article";
import { FaqUnavailable } from "@/components/faq/faq-unavailable";
import { pageMetadata } from "@/lib/seo";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ slug: string }> };

/**
 * Articles dont l'intention est commerciale, et la phrase qui amène le lien.
 *
 * Le texte diffère par article : une ancre identique répétée sur trois pages
 * est un signal de maillage artificiel, et la phrase doit avoir un sens là où
 * elle est lue.
 */
/**
 * Métadonnées de l'article.
 *
 * La canonique est construite depuis le **slug servi**, pas depuis une valeur
 * devinée : sur une route dynamique, une canonique approximative est pire que
 * pas de canonique du tout. La description est la réponse elle-même, tronquée
 * — c'est le résumé le plus honnête qui soit, il ne promet rien que la page ne
 * tienne.
 */
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { title: "FAQ" };

  const { data } = await supabase
    .from("faq_articles")
    .select("question, answer_md")
    .eq("slug", slug)
    .maybeSingle();

  if (!data) return { title: "FAQ" };

  const flat = data.answer_md.replace(/\s+/g, " ").trim();
  const description =
    flat.length <= 155 ? flat : `${flat.slice(0, flat.slice(0, 155).lastIndexOf(" "))}…`;

  return pageMetadata({
    title: data.question,
    description,
    path: `/faq/${slug}`,
    type: "article",
  });
}

/**
 * `/faq/[slug]` — build prompt §10 : « la question en h1, la réponse en corps
 * de texte à 66ch maximum, trois questions liées de la même catégorie, et un
 * retour vers la HOME ».
 *
 * Deux retours plutôt qu'un : « All questions » vers `/faq`, qui est le chemin
 * qu'un lecteur emprunte réellement après avoir lu une réponse, et le retour
 * vers la HOME exigé par le §10.
 *
 * Un client Supabase absent ne rend plus un 404. Une panne de configuration et
 * une question inexistante sont deux choses différentes, et répondre « cette
 * page n'existe pas » quand le service est coupé envoie le lecteur chercher une
 * erreur de sa part. `notFound()` reste réservé au cas où l'article, lui, n'existe
 * vraiment pas.
 */
export default async function FaqArticlePage({ params }: Params) {
  const { slug } = await params;

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return <FaqUnavailable />;
  }

  const { data: article, error } = await supabase
    .from("faq_articles")
    .select("slug, category, question, answer_md")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error(
      `[faq] lecture de l'article "${slug}" impossible — ` +
        `${error.code ?? "sans code"} : ${error.message}`,
    );
  }

  if (!article) notFound();

  const { data: related } = await supabase
    .from("faq_articles")
    .select("slug, question")
    .eq("category", article.category)
    .eq("is_active", true)
    .neq("slug", article.slug)
    .order("position")
    .limit(3);

  return (
    <FaqArticleView
      slug={article.slug}
      category={article.category}
      question={article.question}
      answer={article.answer_md}
      related={related ?? []}
    />
  );
}
