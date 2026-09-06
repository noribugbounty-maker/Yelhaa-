/**
 * Banc d'essai du moteur — build prompt §4.
 *
 * Trois idées, une par domaine, jouées de bout en bout hors HTTP : pas d'auth,
 * pas de base, pas de quota. On observe la classification, la sélection, le
 * chemin d'assets, la validation de sortie et le prompt produit en entier.
 *
 *   npm run engine:try          appels réels à OpenAI — exige
 *                               OPENAI_API_KEY et OPENAI_MODEL
 *   npm run engine:try -- --stub  client simulé, aucune requête réseau :
 *                               vérifie la mécanique de sélection, de chemin
 *                               d'assets, de validation et de régénération
 *
 * Le catalogue est lu directement dans `content/templates/`, donc le banc
 * fonctionne sans projet Supabase.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type { CompletionClient, CompletionRequest, CompletionResult } from "@/lib/ai/client";
import { GenerationError, runGeneration, type GenerationSuccess } from "@/lib/ai/engine";
import type { SelectableTemplate } from "@/lib/ai/select-template";
import { validateOutput } from "@/lib/ai/validate";
import { TEMPLATE_FILES, parseTemplateFile, type Domain } from "@/lib/templates/parse";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const templatesDir = path.join(root, "content", "templates");

/** Catalogue depuis les fichiers, à la place de la requête SQL du §4 étape 6. */
const loadTemplates = async (domain: Domain): Promise<SelectableTemplate[]> => {
  const parsed = parseTemplateFile(
    domain,
    fs.readFileSync(path.join(templatesDir, TEMPLATE_FILES[domain]), "utf8"),
  );
  return parsed.map((template) => ({
    id: template.slug,
    slug: template.slug,
    domain: template.domain,
    art_direction: template.art_direction,
    title: template.title,
    summary: template.summary,
    body: template.body,
    tags: template.tags,
    // Même source que la base : `parseTemplateFile` produit la liste normalisée.
    variables: template.variables,
    asset_paths: template.asset_paths,
  }));
};

const STUB_MODELS = { classify: 'stub-classify', inject: 'stub-inject' };

const CASES: Array<{ label: string; idea: string; projectType?: Domain }> = [
  {
    label: "saas",
    idea:
      "Je veux lancer Northwind, un outil de gestion de projet pour petites équipes techniques. " +
      "On propose un tableau de bord temps réel, des permissions par rôle et une intégration Git. " +
      "Le ton doit être sombre et technique, très épuré.",
  },
  {
    label: "product",
    idea:
      "Maison Verte vend un savon solide fait main à Marseille, à l'huile d'olive et à la lavande. " +
      "Trois parfums, fabrication artisanale, emballage papier recyclé. " +
      "Je veux une page chaleureuse, botanique, avec du papier et de la texture.",
  },
  {
    label: "finance",
    idea:
      "Atlas Patrimoine est un cabinet de conseil en gestion de patrimoine pour cadres dirigeants. " +
      "On fait de l'allocation d'actifs, de la transmission et de l'optimisation fiscale. " +
      "Je veux quelque chose de sobre, institutionnel, très suisse, plutôt clair.",
  },
];

/** Client simulé : sorties fixes, aucune requête réseau. */
type StubScenario = "clean" | "clean-no-figures" | "dirty-then-clean" | "always-dirty";

function createStubClient(scenario: StubScenario): CompletionClient {
  let injectCalls = 0;

  return {
    async complete(request: CompletionRequest): Promise<CompletionResult> {
      if (request.json) {
        const domain = request.system.join(" ").match(/selected the domain "(\w+)"/)?.[1] ?? "saas";
        return {
          text: JSON.stringify({
            domain,
            sub_type: "banc d'essai",
            art_direction_hints: ["dark", "technical", "monochrome"],
            confidence: 0.9,
            vars: {
              BRAND_NAME: "Northwind",
              VERTICAL: "gestion de projet",
              TAGLINE: null,
              HERO_HEADLINE: "Work without the noise",
              VALUE_PROP: "Un seul endroit pour livrer.",
              PRIMARY_CTA: null,
              SECONDARY_CTA: null,
              ITEM: ["Tableau de bord", "Permissions", "Intégration Git"],
              DETAIL: [],
              ACCENT_HEX: null,
              CONTACT_EMAIL: null,
            },
            domain_vars: {},
            missing: ["PRIMARY_CTA", "TAGLINE"],
          }),
          tokensIn: 1200,
          tokensOut: 180,
          durationMs: 3,
        };
      }

      injectCalls += 1;
      const dirty =
        scenario === "always-dirty" || (scenario === "dirty-then-clean" && injectCalls === 1);

      const clean =
        scenario === "clean-no-figures"
          ? "Build the site for Northwind. Grid, type, no ornament, no figure quoted."
          : "Build the site for Northwind. Grid, type, no ornament. Rendement 4,5 % garanti.";

      return {
        text: dirty
          ? "Build the site. {{BRAND_NAME}} stays unresolved.\n[REQUIRES: video]\nSTANDARD PATH\nUse the fallback when needed."
          : clean,
        tokensIn: 8000,
        tokensOut: 2400,
        durationMs: 5,
      };
    },
  };
}

function printResult(label: string, result: GenerationSuccess) {
  console.log(`\n${"=".repeat(78)}`);
  console.log(`CAS : ${label}`);
  console.log("=".repeat(78));

  console.log(`\n--- CLASSIFICATION (appel #1) ---`);
  console.log(`  domaine          ${result.domain} (source : ${result.projectTypeSource})`);
  console.log(`  hints            ${result.classification.art_direction_hints.join(", ")}`);
  console.log(`  confiance        ${result.classification.confidence ?? "—"}`);
  console.log(`  missing          ${result.classification.missing.join(", ") || "—"}`);
  console.log(`  chemin d'assets  ${result.assetPath}`);

  console.log(`\n--- SÉLECTION (étape 6) ---`);
  const { template, score, breakdown } = result.selection;
  console.log(`  retenu           ${template.slug}`);
  console.log(`  direction art.   ${template.art_direction}`);
  console.log(
    `  score            ${score}  = tags ${breakdown.tagOverlap}×3` +
      ` + D/A ${breakdown.artDirectionMatch}×5` +
      ` + assets ${breakdown.assetPathFit}×2`,
  );
  if (result.runnerUp) {
    console.log(`  second           ${result.runnerUp.template.slug} (score ${result.runnerUp.score})`);
  }

  console.log(`\n--- VALIDATION (étape 9) ---`);
  for (const attempt of result.attempts) {
    const verdict = attempt.validation.valid
      ? "conforme"
      : attempt.validation.issues.map((i) => `${i.reason} → ${i.samples.join(" ")}`).join(" | ");
    console.log(`  tentative ${attempt.attempt}      ${verdict}`);
  }
  console.log(`  régénération     ${result.regenerated ? "oui (1)" : "non"}`);

  console.log(`\n--- COÛT ---`);
  console.log(`  tokens entrée    ${result.tokensIn}`);
  console.log(`  tokens sortie    ${result.tokensOut}`);
  console.log(
    `  durées (ms)      classification ${result.durations.classify}` +
      ` · injection ${result.durations.inject}` +
      ` · total ${result.durations.total}`,
  );

  console.log(`\n--- PROMPT PRODUIT (${result.output.length} caractères) ---\n`);
  console.log(result.output);
}

async function runStubChecks() {
  console.log("=== BANC SIMULÉ — aucune requête réseau ===");

  console.log("\n[1] Sortie propre au premier essai");
  const clean = await runGeneration({
    idea: CASES[0]!.idea,
    loadTemplates,
    client: createStubClient("clean"),
    models: STUB_MODELS,
  });
  console.log(`  domaine ${clean.domain} · template ${clean.selection.template.slug} · score ${clean.selection.score}`);
  console.log(`  régénération : ${clean.regenerated ? "oui" : "non"} · tentatives : ${clean.attempts.length}`);

  console.log("\n[2] Sortie sale puis propre — la régénération unique doit rattraper");
  const recovered = await runGeneration({
    idea: CASES[0]!.idea,
    loadTemplates,
    client: createStubClient("dirty-then-clean"),
    models: STUB_MODELS,
  });
  console.log(`  tentatives : ${recovered.attempts.length} · régénération : ${recovered.regenerated ? "oui" : "non"}`);
  console.log(
    `  motifs rejetés au 1er essai : ` +
      recovered.attempts[0]!.validation.issues.map((i) => i.reason).join(", "),
  );

  console.log("\n[3] Sortie toujours sale — doit échouer sans décompter de quota");
  try {
    await runGeneration({
      idea: CASES[0]!.idea,
      loadTemplates,
      client: createStubClient("always-dirty"),
      models: STUB_MODELS,
    });
    console.log("  ÉCHEC : aucune erreur levée");
    process.exitCode = 1;
  } catch (error) {
    if (error instanceof GenerationError && error.code === "validation-failed") {
      console.log(`  ok : GenerationError("${error.code}") après ${error.attempts.length} tentatives`);
      console.log(`  le décompte de quota vit dans consume(), jamais appelé sur ce chemin`);
    } else {
      console.log(`  ÉCHEC : erreur inattendue ${String(error)}`);
      process.exitCode = 1;
    }
  }

  console.log("\n[4] Pill de type de projet — le domaine doit être imposé");
  const forced = await runGeneration({
    idea: CASES[0]!.idea,
    projectType: "finance",
    loadTemplates,
    client: createStubClient("clean-no-figures"),
    models: STUB_MODELS,
  });
  console.log(
    `  domaine ${forced.domain} · source ${forced.projectTypeSource} · template ${forced.selection.template.slug}`,
  );
  if (forced.domain !== "finance" || forced.projectTypeSource !== "user") {
    console.log("  ÉCHEC : la pill n'a pas imposé le domaine");
    process.exitCode = 1;
  }

  console.log("\n[5] Les quatre motifs de rejet, un par un");
  const samples: Array<[string, string]> = [
    ["placeholder", "Build {{BRAND_NAME}} now."],
    ["requires-marker", "Section A [REQUIRES: video] then B."],
    ["path-name", "Use the ENHANCED PATH here."],
    ["fallback", "Provide a fallback layout."],
  ];
  for (const [expected, text] of samples) {
    const result = validateOutput(text, { domain: "saas", sourceText: "" });
    const reasons = result.issues.map((i) => i.reason);
    const ok = !result.valid && reasons.includes(expected as never);
    console.log(`  ${ok ? "ok    " : "ÉCHEC "} ${expected.padEnd(16)} → ${reasons.join(", ") || "aucun"}`);
    if (!ok) process.exitCode = 1;
  }

  console.log("\n[6] Contrôle finance — un chiffre absent de l'idée doit bloquer");
  const financeIssue = validateOutput("Rendement 4,5 % garanti et 1 200 € de frais.", {
    domain: "finance",
    sourceText: "Cabinet de conseil, aucun chiffre communiqué.",
  });
  console.log(
    `  ${!financeIssue.valid ? "ok    " : "ÉCHEC "} chiffres inventés détectés : ` +
      (financeIssue.issues.find((i) => i.reason === "finance-figure")?.samples.join(" ") ?? "aucun"),
  );
  if (financeIssue.valid) process.exitCode = 1;

  const financeAllowed = validateOutput("Frais de 1,2 % par an.", {
    domain: "finance",
    sourceText: "Nos frais sont de 1,2 % par an.",
  });
  console.log(
    `  ${financeAllowed.valid ? "ok    " : "ÉCHEC "} un chiffre présent dans l'idée passe`,
  );
  if (!financeAllowed.valid) process.exitCode = 1;

  console.log("\n[7] Faux positif : les pourcentages techniques du template ne bloquent pas");
  const financeTemplates = await loadTemplates("finance");
  const financeBody = financeTemplates[0]!.body;
  const technicalOnly = validateOutput(financeBody, {
    domain: "finance",
    sourceText: `Cabinet de conseil, aucun chiffre communiqué.\n${financeBody}`,
  });
  const figureIssue = technicalOnly.issues.find((i) => i.reason === "finance-figure");
  console.log(
    `  ${figureIssue ? "ÉCHEC " : "ok    "} aucun chiffre du corps de ${financeTemplates[0]!.slug} ` +
      `n'est pris pour une invention`,
  );
  if (figureIssue) {
    console.log(`         faux positifs : ${figureIssue.samples.join(" ")}`);
    process.exitCode = 1;
  }

  const inventedInFinance = validateOutput(`${financeBody}\nRendement net de 7,4 % en 2025.`, {
    domain: "finance",
    sourceText: `Cabinet de conseil, aucun chiffre communiqué.\n${financeBody}`,
  });
  const caught = inventedInFinance.issues.find((i) => i.reason === "finance-figure");
  console.log(
    `  ${caught ? "ok    " : "ÉCHEC "} un chiffre ajouté par le modèle est toujours détecté` +
      (caught ? ` : ${caught.samples.join(" ")}` : ""),
  );
  if (!caught) process.exitCode = 1;
}

async function runRealGenerations() {
  const missing = [
    process.env.OPENAI_API_KEY ? null : "OPENAI_API_KEY",
    process.env.OPENAI_MODEL ||
    process.env.OPENAI_MODEL_CLASSIFY ||
    process.env.OPENAI_MODEL_INJECT
      ? null
      : "OPENAI_MODEL",
  ].filter(Boolean);

  if (missing.length > 0) {
    console.error(
      `\nBLOQUÉ — variable(s) manquante(s) dans .env.local : ${missing.join(", ")}.\n` +
        `Aucune génération réelle n'a été lancée. Relancer avec --stub pour vérifier\n` +
        `la mécanique sans appel réseau.`,
    );
    process.exitCode = 1;
    return;
  }

  for (const testCase of CASES) {
    try {
      const result = await runGeneration({
        idea: testCase.idea,
        projectType: testCase.projectType ?? null,
        loadTemplates,
      });
      printResult(testCase.label, result);
    } catch (error) {
      console.error(`\nCAS ${testCase.label} — échec :`, error);
      process.exitCode = 1;
    }
  }
}

if (process.argv.includes("--stub")) {
  await runStubChecks();
} else {
  await runRealGenerations();
}
