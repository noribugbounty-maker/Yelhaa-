/**
 * Banc qualité / longueur du modèle d'injection — **appels réels à OpenAI**.
 *
 *   BENCH_MODELS="<model-a>,<model-b>" npm run bench:models
 *
 * Sans `BENCH_MODELS`, le banc mesure `OPENAI_MODEL_INJECT` ou `OPENAI_MODEL`.
 *
 * Le banc occupe l'instance pendant plusieurs minutes. Il est volontairement
 * court : quelques cas représentatifs plutôt qu'un corpus exhaustif, parce que
 * la décision qu'il éclaire — quel modèle pour l'injection — se tranche sur des
 * écarts francs, pas sur la troisième décimale.
 *
 * Il ne conserve **aucun contenu** : ni prompt, ni sortie, ni idée. Seulement
 * des compteurs, la validité, et le template retenu.
 *
 * Ce qu'il mesure et que rien d'autre ne voit :
 *
 * 1. le **taux de régénération** par modèle — un rejet de validation double la
 *    durée de l'appel le plus long du pipeline ;
 * 2. la longueur de sortie réelle, seule base honnête pour fixer le plafond
 *    `AI_MAX_OUTPUT_TOKENS` ;
 * 3. le template retenu, pour vérifier qu'un modèle plus petit ne change pas
 *    la sélection — elle est déterministe, donc tout écart serait un défaut.
 */
import { createClient } from "@supabase/supabase-js";

import { GenerationError, runGeneration } from "../lib/ai/engine.ts";

const url = process.env["NEXT_PUBLIC_SUPABASE_URL"];
const serviceKey = process.env["SUPABASE_SERVICE_ROLE_KEY"];
const classifyModel =
  process.env["OPENAI_MODEL_CLASSIFY"] || process.env["OPENAI_MODEL"];
const injectModel =
  process.env["OPENAI_MODEL_INJECT"] || process.env["OPENAI_MODEL"];

if (!url || !serviceKey || !process.env["OPENAI_API_KEY"] || !classifyModel || !injectModel) {
  console.log(
    "BLOCKED — il faut NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,\n" +
      "OPENAI_API_KEY et OPENAI_MODEL dans l'environnement.",
  );
  process.exit(2);
}

const models = (process.env["BENCH_MODELS"] ?? injectModel)
  .split(",")
  .map((m) => m.trim())
  .filter(Boolean);

const db = createClient(url, serviceKey, { auth: { persistSession: false } });

const loadTemplates = async (domain) => {
  const { data, error } = await db
    .from("prompt_templates")
    .select(
      "id, slug, domain, art_direction, title, summary, body, tags, asset_paths, variables",
    )
    .eq("domain", domain)
    .eq("is_active", true);
  if (error) throw new Error(error.message);
  return data ?? [];
};

/** Corpus représentatif. Court par conception : chaque cas coûte deux appels. */
const CASES = [
  {
    name: "landing page",
    idea: "Une landing page pour un studio de céramique artisanale qui propose des cours et de la location de four.",
  },
  {
    name: "SaaS analytics",
    idea: "Un tableau de bord analytique pour des équipes produit, avec rapports partageables et alertes en temps réel.",
  },
  {
    name: "SVG de marque",
    idea: "Un site vitrine pour une marque de café de spécialité avec vente en ligne.",
    files: [
      {
        filename: "logo.svg",
        mimeType: "image/svg+xml",
        text: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 64"><title>Brumalis</title><desc>Logo de Brumalis, torrefaction artisanale.</desc><text x="16" y="40" fill="#2E1B10">Brumalis</text></svg>',
        truncated: false,
      },
    ],
  },
];

const rows = [];

for (const model of models) {
  for (const testCase of CASES) {
    const startedAt = Date.now();
    let outcome = "ok";
    let result = null;

    try {
      result = await runGeneration({
        idea: testCase.idea,
        loadTemplates,
        models: { classify: classifyModel, inject: model },
        ...(testCase.files ? { files: testCase.files } : {}),
      });
    } catch (error) {
      outcome =
        error instanceof GenerationError ? error.code : "erreur inattendue";
      // Les tentatives sont conservées même sur échec : c'est le travail réel.
      result = { attempts: error?.attempts ?? [], tokensIn: 0, tokensOut: 0 };
    }

    const attempts = result.attempts ?? [];
    const injectIn = attempts.reduce((s, a) => s + a.tokensIn, 0);
    const injectOut = attempts.reduce((s, a) => s + a.tokensOut, 0);
    const classifyIn = Math.max(0, (result.tokensIn ?? 0) - injectIn);
    const classifyOut = Math.max(0, (result.tokensOut ?? 0) - injectOut);

    /*
     * Qualité, pas seulement validité. Le prompt système promet que quatre
     * blocs ne sont jamais rognés pour raccourcir : c'est le critère
     * vérifiable le plus proche de « la sortie reste utile ». Un modèle plus
     * petit qui les laisse tomber gagne du temps en retirant précisément ce
     * qui fait la valeur du prompt.
     */
    const MANDATORY = [
      "STATES & EDGE CASES",
      "PERFORMANCE",
      "ACCESSIBILITY",
      "STRICT RULES",
    ];
    const output = result.output ?? "";
    const blocksPresent = MANDATORY.filter((block) =>
      output.toUpperCase().includes(block),
    );

    rows.push({
      model,
      testCase: testCase.name,
      outcome,
      blocks: `${blocksPresent.length}/${MANDATORY.length}`,
      missingBlocks: MANDATORY.filter((b) => !blocksPresent.includes(b)),
      attempts: attempts.length,
      regenerated: attempts.length > 1,
      template: result.selection?.template.slug ?? "—",
      outputChars: result.output?.length ?? 0,
      classifyIn,
      classifyOut,
      injectIn,
      injectOut,
      ms: Date.now() - startedAt,
    });

    const last = rows[rows.length - 1];
    console.log(
      `${model.padEnd(20)} ${testCase.name.padEnd(16)} ` +
        `${outcome.padEnd(18)} blocs=${last.blocks} tentatives=${last.attempts} ` +
        `in=${last.injectIn} out=${last.injectOut} ` +
        `sortie=${last.outputChars}c ` +
        `${Math.round(last.ms / 1000)}s`,
    );
  }
}

console.log("\nSYNTHÈSE PAR MODÈLE");
for (const model of models) {
  const mine = rows.filter((r) => r.model === model);
  const ok = mine.filter((r) => r.outcome === "ok");
  const outputs = ok.map((r) => r.injectOut).sort((a, b) => a - b);
  const durations = mine.map((r) => r.ms);
  const averageMs = durations.length
    ? durations.reduce((s, v) => s + v, 0) / durations.length
    : null;

  console.log(`\n  ${model}`);
  console.log(`    réussites            ${ok.length}/${mine.length}`);
  console.log(`    régénérations        ${mine.filter((r) => r.regenerated).length}/${mine.length}`);
  console.log(
    `    jetons sortie inject min ${outputs[0] ?? "—"} / médiane ${outputs[Math.floor(outputs.length / 2)] ?? "—"} / max ${outputs[outputs.length - 1] ?? "—"}`,
  );
  console.log(
    `    durée moyenne        ${averageMs === null ? "—" : Math.round(averageMs / 1000) + "s"}`,
  );
  console.log(
    `    blocs obligatoires   ${ok.map((r) => r.blocks).join(" ")}${
      ok.some((r) => r.missingBlocks.length)
        ? " — manquants : " + [...new Set(ok.flatMap((r) => r.missingBlocks))].join(", ")
        : " (tous présents)"
    }`,
  );
  console.log(
    `    templates retenus    ${[...new Set(mine.map((r) => r.template))].join(", ")}`,
  );
}

// La sélection est déterministe : deux modèles d'injection différents doivent
// retenir exactement les mêmes templates. Un écart signalerait que la
// classification, elle, a dérivé.
const byCase = new Map();
for (const row of rows) {
  const list = byCase.get(row.testCase) ?? [];
  list.push(row.template);
  byCase.set(row.testCase, list);
}
const drifted = [...byCase.entries()].filter(
  ([, templates]) => new Set(templates).size > 1,
);
console.log(
  `\nSélection de template identique entre modèles : ${drifted.length === 0 ? "OUI" : "NON — " + drifted.map(([c]) => c).join(", ")}`,
);
