import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PromptPageView } from "@/components/prompt/prompt-page-view";
import { SiteChrome } from "@/components/site/site-chrome";
import { conversationIdForGeneration } from "@/lib/conversations/queries";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { extractPalette } from "@/lib/templates/palette";

export const metadata: Metadata = { title: "Your prompt" };

type ClassificationShape = {
  art_direction_hints?: string[];
  missing?: string[];
  vars?: Record<string, unknown>;
};

/**
 * YOUR PROMPT — README §4, design prompt §3.4, build prompt §4bis.
 *
 * Trois blocs, dans cet ordre : le prompt fonctionnel, la direction artistique
 * retenue avec sa palette, les suggestions bâties depuis `missing`.
 *
 * La notion de chemin d'assets n'apparaît nulle part : il n'y a aucun choix à
 * présenter à l'utilisateur. Le seul choix exposé est celui du §5.5 — la
 * direction artistique retenue, et la possibilité d'en changer sans consommer
 * de quota.
 */
export default async function PromptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createSupabaseServerClient();
  if (!supabase) notFound();

  // RLS : l'utilisateur ne lit que ses propres générations.
  const { data: generation } = await supabase
    .from("generations")
    .select(
      "id, idea, output, tokens_in, tokens_out, domain, template_id, extracted_vars",
    )
    .eq("id", id)
    .maybeSingle();

  if (!generation) notFound();

  /*
   * `body` n'est plus lisible via le client de session. La génération a déjà
   * été filtrée par RLS ; le catalogue se relit ensuite avec le rôle service.
   */
  const admin = generation.template_id ? createSupabaseAdminClient() : null;
  const { data: template } = generation.template_id
    ? admin
      ? await admin
          .from("prompt_templates")
          .select("id, slug, title, art_direction, summary, body")
          .eq("id", generation.template_id)
          .maybeSingle()
      : await supabase
          .from("prompt_templates")
          .select("id, slug, title, art_direction, summary")
          .eq("id", generation.template_id)
          .maybeSingle()
    : { data: null };

  const classification = (generation.extracted_vars ??
    {}) as ClassificationShape;
  const palette =
    template && "body" in template && typeof template.body === "string"
      ? extractPalette(template.body)
      : [];
  const tokens =
    generation.tokens_in !== null || generation.tokens_out !== null
      ? (generation.tokens_in ?? 0) + (generation.tokens_out ?? 0)
      : null;

  const conversationId = await conversationIdForGeneration(generation.id);

  const vars = classification.vars ?? {};
  const retained = (
    [
      { key: "brand", value: typeof vars["BRAND_NAME"] === "string" ? vars["BRAND_NAME"] : "" },
      { key: "sector", value: typeof vars["VERTICAL"] === "string" ? vars["VERTICAL"] : "" },
      { key: "domain", value: generation.domain ?? "" },
      { key: "artDirection", value: template?.art_direction ?? "" },
    ] as const
  ).filter((entry) => Boolean(entry.value));

  return (
    <SiteChrome>
      <PromptPageView
        output={generation.output}
        tokens={tokens}
        slug={template?.slug ?? "yelhaa-prompt"}
        idea={generation.idea}
        retained={retained}
        template={
          template
            ? {
                id: template.id,
                art_direction: template.art_direction,
                summary: template.summary,
                palette,
              }
            : null
        }
        missing={classification.missing ?? []}
        generationId={generation.id}
        conversationId={conversationId}
      />
    </SiteChrome>
  );
}
