import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo";

import { FaqIndex } from "@/components/faq/faq-index";
import type { FaqItem } from "@/components/faq/faq-accordion";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = pageMetadata({
  title: "Frequently asked questions",
  description:
    "How the engine turns an idea into a prompt, what each plan covers, and what happens to what you write.",
  path: "/faq",
});

export default async function FaqPage() {
  const supabase = await createSupabaseServerClient();

  const result = supabase
    ? await supabase
        .from("faq_articles")
        .select("slug, category, question, answer_md, position")
        .eq("is_active", true)
        .order("position")
    : null;

  if (result?.error) {
    console.error(
      `[faq] lecture de faq_articles impossible — ${result.error.code ?? "sans code"} : ` +
        `${result.error.message}${result.error.hint ? ` (${result.error.hint})` : ""}`,
    );
  }

  const unavailable = !supabase || Boolean(result?.error);

  const items: FaqItem[] = (result?.data ?? []).map((article) => ({
    slug: article.slug,
    category: article.category,
    question: article.question,
    answer: article.answer_md,
  }));

  return <FaqIndex unavailable={unavailable} items={items} />;
}
