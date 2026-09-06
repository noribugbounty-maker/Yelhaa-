import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { clientIpFromHeaders } from "@/lib/http/client-ip";
import { CATALOGUE_RATE_LIMIT, rateLimit } from "@/lib/rate-limit";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { extractPalette } from "@/lib/templates/palette";
import { DOMAINS } from "@/lib/templates/parse";

export const runtime = "nodejs";

/** Taille de page du sélecteur — le catalogue n'est jamais rendu d'un coup. */
const PAGE_SIZE = 24;
const MAX_PAGE_SIZE = 48;

const querySchema = z.object({
  q: z.string().trim().max(120).optional(),
  domain: z.enum(DOMAINS).optional(),
  tag: z.string().trim().max(60).optional(),
  page: z.coerce.number().int().min(0).max(400).default(0),
  size: z.coerce.number().int().min(1).max(MAX_PAGE_SIZE).default(PAGE_SIZE),
});

/**
 * `GET /api/templates` — renouveau §7.3.
 *
 * Lecture paginée de `prompt_templates` (`is_active = true`), filtrable par
 * domaine, par tag et par recherche texte. Elle sert le sélecteur du §5.5, qui
 * ne rend **jamais** le catalogue entier d'un coup.
 *
 * La lecture passe par le client `service_role` : `body` n'est plus accordé
 * à `anon` / `authenticated` (migration `prompt_templates_hide_body`). Le
 * JSON ne contient toujours pas le corps — seule la palette en est extraite.
 *
 * **Aucun total n'est renvoyé, et aucun n'est calculé.** La route demandait un
 * `count: "exact"`, qui force Postgres à compter toutes les lignes
 * correspondantes en plus de servir la page — un coût payé à chaque requête
 * pour une valeur que le §6 interdit d'afficher. `has_more` se déduit en
 * demandant **une ligne de plus** que la page et en la retirant avant de
 * répondre : même information de pagination, une seule lecture bornée.
 *
 * `body` n'est jamais renvoyé : c'est la propriété intellectuelle du produit.
 * Seule la palette en est extraite, parce que l'utilisateur doit voir le style
 * qu'il choisit.
 */
export async function GET(request: NextRequest) {
  /*
   * Limitation de débit à l'adresse : l'endpoint est public et non
   * authentifié, il n'y a pas d'utilisateur à qui rattacher un compteur. Le §9
   * l'imposait déjà pour `/api/generate` et `/api/contact` ; cette route est
   * arrivée après et ne l'avait pas héritée, alors qu'elle est la plus exposée
   * des trois.
   */
  const ip = clientIpFromHeaders(request.headers);

  const limit = rateLimit(`templates:${ip}`, CATALOGUE_RATE_LIMIT);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Try again in a moment." },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfterSeconds) },
      },
    );
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Template library unavailable." },
      { status: 503 },
    );
  }

  const parsed = querySchema.safeParse(
    Object.fromEntries(request.nextUrl.searchParams),
  );
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid filters." }, { status: 400 });
  }

  const { q, domain, tag, page, size } = parsed.data;
  const from = page * size;

  let query = supabase
    .from("prompt_templates")
    .select("id, slug, domain, art_direction, title, summary, tags, body")
    .eq("is_active", true);

  if (domain) query = query.eq("domain", domain);
  if (tag) query = query.contains("tags", [tag]);
  if (q) {
    /*
     * La valeur est **citée**, pas filtrée par liste noire.
     *
     * `.or()` prend une grammaire — `colonne.opérateur.valeur`, séparés par
     * des virgules. L'assembler par interpolation en retirant quelques
     * caractères revient à énumérer les fragments dangereux, ce qui rate
     * toujours un cas : `*` restait, et c'est le joker `ilike` de PostgREST,
     * donc une recherche sur `*` renvoyait le catalogue entier.
     *
     * PostgREST accepte une valeur entre guillemets doubles, où seuls `\` et
     * `"` doivent être échappés. Les jokers `%` et `*` sont neutralisés pour
     * rester littéraux — l'utilisateur cherche un texte, pas un motif.
     */
    const literal = q.replace(/[%*]/g, " ").trim();
    if (literal) {
      const quoted = literal
        .replace(/\\/g, String.raw`\\`)
        .replace(/"/g, String.raw`\"`);
      query = query.or(
        [
          `title.ilike."%${quoted}%"`,
          `art_direction.ilike."%${quoted}%"`,
          `summary.ilike."%${quoted}%"`,
        ].join(","),
      );
    }
  }

  // Une ligne de plus que la page : sa présence dit `has_more`, sans COUNT.
  const { data, error } = await query
    .order("domain")
    .order("art_direction")
    .range(from, from + size);

  if (error) {
    console.error("[templates] lecture impossible", error.message);
    return NextResponse.json(
      { error: "Template library unavailable." },
      { status: 503 },
    );
  }

  const rows = data ?? [];
  const hasMore = rows.length > size;

  const items = rows.slice(0, size).map((row) => ({
    id: row.id,
    slug: row.slug,
    domain: row.domain,
    art_direction: row.art_direction,
    title: row.title,
    summary: row.summary,
    tags: row.tags,
    palette: extractPalette(row.body, 5),
  }));

  return NextResponse.json({ items, page, size, has_more: hasMore });
}
