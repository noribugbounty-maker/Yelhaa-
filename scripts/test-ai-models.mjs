/**
 * Résolution des modèles OpenAI — un modèle unique, overrides optionnels.
 *
 *   npm run test:ai-models
 *
 * Aucun appel réseau : seules les fonctions de résolution sont exercées.
 */
import { readFileSync } from "node:fs";

import {
  MissingAiConfigurationError,
  maxInjectOutputTokens,
  maxOutputTokens,
  readAiModels,
  resolveChatModel,
  resolveClassifyModel,
  resolveEngineModel,
  resolveInjectModel,
} from "../lib/ai/client.ts";

let passed = 0;
let failed = 0;

function check(label, actual, expected) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (ok) passed++;
  else failed++;
  console.log(
    `  ${ok ? "PASS" : "FAIL"}  ${label}` +
      (ok
        ? ""
        : `\n        attendu ${JSON.stringify(expected)}, obtenu ${JSON.stringify(actual)}`),
  );
}

const ENV_KEYS = [
  "OPENAI_API_KEY",
  "OPENAI_MODEL",
  "OPENAI_MODEL_CLASSIFY",
  "OPENAI_MODEL_INJECT",
  "OPENAI_MODEL_CHAT",
];

function withEnv(values, run) {
  const previous = Object.fromEntries(ENV_KEYS.map((k) => [k, process.env[k]]));
  for (const key of ENV_KEYS) delete process.env[key];
  for (const [key, value] of Object.entries(values)) process.env[key] = value;
  try {
    return run();
  } finally {
    for (const key of ENV_KEYS) {
      if (previous[key] === undefined) delete process.env[key];
      else process.env[key] = previous[key];
    }
  }
}

function throwsMissing(run) {
  try {
    run();
    return null;
  } catch (error) {
    return error instanceof MissingAiConfigurationError
      ? error.missing
      : String(error);
  }
}

const MODEL = "gpt-test-model";
const CLASSIFY = "classify-test";
const INJECT = "inject-test";
const CHAT = "chat-test";
const KEY = "sk-test-not-a-real-key";

console.log("\n1. OPENAI_MODEL unique — les trois étapes partagent le même nom");
withEnv({ OPENAI_API_KEY: KEY, OPENAI_MODEL: MODEL }, () => {
  check("readAiModels", readAiModels(), {
    classify: MODEL,
    inject: MODEL,
    chat: MODEL,
  });
  check("resolveEngineModel", resolveEngineModel(), MODEL);
  check("resolveClassifyModel", resolveClassifyModel(), MODEL);
  check("resolveInjectModel", resolveInjectModel(), MODEL);
  check("resolveChatModel", resolveChatModel(), MODEL);
});

console.log("\n2. Overrides d'étape — seules les étapes renseignées changent");
withEnv(
  {
    OPENAI_API_KEY: KEY,
    OPENAI_MODEL: MODEL,
    OPENAI_MODEL_CLASSIFY: CLASSIFY,
    OPENAI_MODEL_INJECT: INJECT,
    OPENAI_MODEL_CHAT: CHAT,
  },
  () => {
    check("readAiModels avec overrides", readAiModels(), {
      classify: CLASSIFY,
      inject: INJECT,
      chat: CHAT,
    });
  },
);

console.log("\n3. Configuration absente — erreur explicite, aucun repli");
withEnv({}, () => {
  check(
    "clé et modèle manquent",
    throwsMissing(() => readAiModels()),
    ["OPENAI_API_KEY", "OPENAI_MODEL"],
  );
});
withEnv({ OPENAI_MODEL: MODEL }, () => {
  check(
    "clé seule manquante",
    throwsMissing(() => readAiModels()),
    ["OPENAI_API_KEY"],
  );
});
withEnv({ OPENAI_API_KEY: KEY }, () => {
  check(
    "modèle seul manquant",
    throwsMissing(() => readAiModels()),
    ["OPENAI_MODEL"],
  );
});

console.log("\n4. Lecture de source");
const engineSource = readFileSync("lib/ai/engine.ts", "utf8");
check(
  "engine.ts lit les modèles via readAiModels",
  /readAiModels\(\)/.test(engineSource) &&
    !/process\.env\.OPENAI_MODEL/.test(engineSource),
  true,
);
const clientSource = readFileSync("lib/ai/client.ts", "utf8");
check(
  "aucun nom de modèle en dur dans client.ts",
  /["'`](gpt-5|gpt-4|qwen|ollama|yelhaa-qwen)/i.test(clientSource),
  false,
);
check(
  "le client importe openai, pas ollama",
  /from "openai"/.test(clientSource) && !/from "ollama"/.test(clientSource),
  true,
);

console.log("\n5. Budget d'injection — OPENAI_MAX_OUTPUT_TOKENS_INJECT");
{
  const keys = [
    "OPENAI_MAX_OUTPUT_TOKENS",
    "AI_MAX_OUTPUT_TOKENS",
    "OPENAI_MAX_OUTPUT_TOKENS_INJECT",
  ];
  const previous = Object.fromEntries(keys.map((k) => [k, process.env[k]]));
  for (const key of keys) delete process.env[key];
  process.env.OPENAI_MAX_OUTPUT_TOKENS = "6000";
  process.env.OPENAI_MAX_OUTPUT_TOKENS_INJECT = "3000";
  check("budget global", maxOutputTokens(), 6000);
  check("budget injection spécifique", maxInjectOutputTokens(), 3000);
  delete process.env.OPENAI_MAX_OUTPUT_TOKENS_INJECT;
  check("injection sans override → global", maxInjectOutputTokens(), 6000);
  for (const key of keys) {
    if (previous[key] === undefined) delete process.env[key];
    else process.env[key] = previous[key];
  }
}

console.log(
  `\n${failed === 0 ? "TOUS LES TESTS PASSENT" : "ECHECS"} — ${passed} pass, ${failed} fail`,
);
process.exit(failed === 0 ? 0 : 1);
