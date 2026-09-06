/**
 * Seed des douze articles de FAQ — build prompt §10.
 *
 *   node --env-file-if-exists=.env.local scripts/seed-faq.ts
 *
 * `upsert` sur `slug` : rejouable sans doublon.
 */
import { createClient } from "@supabase/supabase-js";

import { FAQ_ARTICLES } from "../content/faq.ts";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error(
    "BLOQUÉ — NEXT_PUBLIC_SUPABASE_URL et/ou SUPABASE_SERVICE_ROLE_KEY absentes de .env.local.",
  );
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { error } = await supabase.from("faq_articles").upsert(FAQ_ARTICLES, { onConflict: "slug" });

if (error) {
  console.error(`ÉCHEC upsert : ${error.message}`);
  process.exit(1);
}

const { data, error: readError } = await supabase
  .from("faq_articles")
  .select("slug, category")
  .eq("is_active", true);

if (readError || !data) {
  console.error(`ÉCHEC relecture : ${readError?.message ?? "aucune donnée"}`);
  process.exit(1);
}

console.log(`ok — ${data.length} articles en base`);
for (const category of [...new Set(data.map((row) => row.category))]) {
  console.log(`  ${category.padEnd(30)} ${data.filter((r) => r.category === category).length}`);
}

if (data.length !== 12) {
  console.error("ÉCHEC — le total en base n'est pas 12");
  process.exit(1);
}
