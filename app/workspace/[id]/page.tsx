import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { WorkspaceShell } from "@/components/workspace/workspace-shell";
import { resolveEngineModel } from "@/lib/ai/client";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Workspace" };

/**
 * Environnement de développement multi-IA — README §5, design prompt §3.5.
 *
 * Tout ce qui est affiché est réel : l'idée de l'utilisateur, le prompt
 * assemblé, le modèle que le moteur appelle. Aucun faux fichier, aucune fausse
 * conversation, aucun nom de modèle inventé.
 */
export default async function WorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createSupabaseServerClient();
  if (!supabase) notFound();

  const { data: generation } = await supabase
    .from("generations")
    .select("id, idea, output, tokens_in, tokens_out, template_id")
    .eq("id", id)
    .maybeSingle();

  if (!generation) notFound();

  const { data: template } = generation.template_id
    ? await supabase
        .from("prompt_templates")
        .select("slug, art_direction")
        .eq("id", generation.template_id)
        .maybeSingle()
    : { data: null };

  const tokens =
    generation.tokens_in !== null || generation.tokens_out !== null
      ? (generation.tokens_in ?? 0) + (generation.tokens_out ?? 0)
      : null;

  return (
    <>
      <WorkspaceShell
        data={{
          id: generation.id,
          idea: generation.idea,
          output: generation.output,
          projectName: template?.slug ?? "yelhaa-prompt",
          artDirection: template?.art_direction ?? null,
          tokens,
          engineModel: resolveEngineModel(),
        }}
      />
    </>
  );
}
