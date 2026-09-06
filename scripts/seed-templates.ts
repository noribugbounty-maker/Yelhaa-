/**
 * Seed du catalogue de prompts — build prompt §3.
 *
 * Deux modes :
 *
 *   node --env-file-if-exists=.env.local scripts/seed-templates.ts --dry-run
 *     Analyse les quatre fichiers, imprime le rapport de contrôle, ne touche
 *     à rien. Ne demande aucune variable d'environnement.
 *
 *   node --env-file-if-exists=.env.local scripts/seed-templates.ts
 *     Idem, puis `upsert` sur `slug` et relecture en base pour vérifier les
 *     comptes. Exige NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY.
 *
 * La clé de service ne sort jamais du serveur : ce script ne s'exécute pas
 * depuis le navigateur, et sa valeur n'est jamais imprimée.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { createClient } from "@supabase/supabase-js";

import {
  DOMAINS,
  TEMPLATE_FILES,
  parseTemplateFile,
  type Domain,
  type ParsedTemplate,
} from "../lib/templates/parse.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const templatesDir = path.join(root, "content", "templates");

/** Comptes attendus, énoncés au §3 du build prompt. */
const EXPECTED: Record<Domain, number> = { saas: 10, product: 10, finance: 5, agency: 10 };

function parseAll(): ParsedTemplate[] {
  return DOMAINS.flatMap((domain) => {
    const file = path.join(templatesDir, TEMPLATE_FILES[domain]);
    return parseTemplateFile(domain, fs.readFileSync(file, "utf8"));
  });
}

function report(templates: ParsedTemplate[]): boolean {
  let ok = true;
  const fail = (message: string) => {
    ok = false;
    console.log(`  ÉCHEC  ${message}`);
  };
  const pass = (message: string) => console.log(`  ok     ${message}`);

  console.log("\n=== COMPTES ===");
  const total = templates.length;
  total === 35 ? pass(`35 templates analysés`) : fail(`${total} templates au lieu de 35`);

  for (const domain of DOMAINS) {
    const count = templates.filter((t) => t.domain === domain).length;
    count === EXPECTED[domain]
      ? pass(`${domain.padEnd(8)} ${count}`)
      : fail(`${domain} : ${count} au lieu de ${EXPECTED[domain]}`);
  }

  console.log("\n=== SLUGS ===");
  const slugs = templates.map((t) => t.slug);
  const duplicates = slugs.filter((slug, index) => slugs.indexOf(slug) !== index);
  duplicates.length === 0
    ? pass("aucun doublon")
    : fail(`doublons : ${[...new Set(duplicates)].join(", ")}`);

  const malformed = slugs.filter((slug) => !/^[a-z]+-\d{2}-[a-z0-9-]+$/.test(slug));
  malformed.length === 0
    ? pass("tous au format {domain}-{nn}-{kebab}")
    : fail(`format invalide : ${malformed.join(", ")}`);

  console.log("\n=== CHAMPS OBLIGATOIRES ===");
  const emptyBody = templates.filter((t) => t.body.length < 200);
  emptyBody.length === 0
    ? pass("tous les corps sont substantiels")
    : fail(`corps trop courts : ${emptyBody.map((t) => t.slug).join(", ")}`);

  const noVars = templates.filter((t) => t.variables.length === 0);
  noVars.length === 0
    ? pass("tous les templates portent au moins une variable")
    : fail(`sans variable : ${noVars.map((t) => t.slug).join(", ")}`);

  const noSummary = templates.filter((t) => !t.summary || t.summary === t.art_direction);
  noSummary.length === 0
    ? pass("tous les résumés extraits de la ligne « Art direction: »")
    : fail(`résumé non extrait : ${noSummary.map((t) => t.slug).join(", ")}`);

  console.log("\n=== RENOMMAGES DU SCHÉMA ===");
  const legacy = templates.filter((t) =>
    t.variables.some((v) => /^(FEATURE|SERVICE|PRODUCT_SHOT)_\d$/.test(v)),
  );
  legacy.length === 0
    ? pass("FEATURE_* / SERVICE_* / PRODUCT_SHOT_* tous renommés")
    : fail(`variables héritées restantes : ${legacy.map((t) => t.slug).join(", ")}`);

  console.log("\n=== DÉTAIL PAR TEMPLATE ===");
  console.log(
    `${"slug".padEnd(38)} ${"vars".padStart(4)} ${"tags".padStart(4)}  chemins d'assets`,
  );
  for (const template of templates) {
    const paths = Object.entries(template.asset_paths)
      .filter(([, available]) => available)
      .map(([name]) => name)
      .join(" ");
    console.log(
      `${template.slug.padEnd(38)} ${String(template.variables.length).padStart(4)} ` +
        `${String(template.tags.length).padStart(4)}  ${paths}`,
    );
  }

  return ok;
}

async function pushToDatabase(templates: ParsedTemplate[]) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    console.log(
      "\n=== BASE ===\n  Ignoré : NEXT_PUBLIC_SUPABASE_URL et/ou SUPABASE_SERVICE_ROLE_KEY absentes.\n" +
        "  Relancer avec --dry-run pour ne vérifier que l'extraction.",
    );
    process.exitCode = 1;
    return;
  }

  const supabase = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  console.log("\n=== BASE ===");

  const rows = templates.map(({ markers: _markers, ...row }) => row);
  const { error } = await supabase.from("prompt_templates").upsert(rows, { onConflict: "slug" });

  if (error) {
    console.error(`  ÉCHEC  upsert : ${error.message}`);
    process.exitCode = 1;
    return;
  }
  console.log(`  ok     upsert de ${rows.length} lignes sur la clé slug`);

  const { data, error: readError } = await supabase
    .from("prompt_templates")
    .select("slug, domain, variables, asset_paths");

  if (readError || !data) {
    console.error(`  ÉCHEC  relecture : ${readError?.message ?? "aucune donnée"}`);
    process.exitCode = 1;
    return;
  }

  console.log(`  ok     ${data.length} lignes en base`);
  for (const domain of DOMAINS) {
    const count = data.filter((row) => row.domain === domain).length;
    const marker = count === EXPECTED[domain] ? "ok    " : "ÉCHEC ";
    console.log(`  ${marker} ${domain.padEnd(8)} ${count} / ${EXPECTED[domain]}`);
  }

  const slugs = data.map((row) => row.slug);
  const unique = new Set(slugs);
  console.log(
    unique.size === slugs.length
      ? "  ok     aucun slug en double en base"
      : `  ÉCHEC  ${slugs.length - unique.size} slugs en double`,
  );

  if (data.length !== 35) {
    console.log("  ÉCHEC  le total en base n'est pas 35");
    process.exitCode = 1;
  }
}

const dryRun = process.argv.includes("--dry-run");
const templates = parseAll();
const extractionOk = report(templates);

if (!extractionOk) {
  console.log("\nExtraction en échec — rien n'est écrit en base.");
  process.exitCode = 1;
} else if (dryRun) {
  console.log("\nExtraction conforme. --dry-run : aucune écriture.");
} else {
  await pushToDatabase(templates);
}
