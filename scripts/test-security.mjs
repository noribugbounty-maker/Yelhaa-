/**
 * Banc d'essai offensif — frontières de confiance client → serveur.
 *
 *   node --conditions=react-server --import ./scripts/alias-hook.mjs scripts/test-security.mjs
 *
 * Ces tests attaquent les schémas de validation directement, là où les
 * requêtes HTTP ne peuvent pas aller sans session. Ils vérifient qu'aucun
 * champ envoyé par le client ne peut atteindre une décision serveur —
 * limite de quota, identité, compteur.
 */
import { readFileSync } from "node:fs";
import { z } from "zod";

import { IDEA_MAX_LENGTH, IDEA_MIN_LENGTH } from "../lib/ai/engine.ts";
import { GENERATION_LIMITS } from "../lib/quota.ts";
import { DOMAINS } from "../lib/templates/parse.ts";

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

/* Copie exacte du schéma de `app/api/generate/route.ts`. Si la route change,
   ce test doit être mis à jour — c'est voulu : le schéma est la frontière. */
const generateSchema = z.object({
  idea: z.string().min(IDEA_MIN_LENGTH).max(IDEA_MAX_LENGTH),
  projectType: z.enum(DOMAINS).nullish(),
});

console.log("=== 1. Mass assignment sur /api/generate ===");
{
  const hostile = generateSchema.safeParse({
    idea: "Une idée parfaitement valide pour un site de test.",
    projectType: "saas",
    // Tout ce qu'un attaquant tenterait de glisser :
    p_limit: 9999,
    limit: 9999,
    plan: "agency",
    user_id: "22222222-2222-2222-2222-222222222222",
    quota_remaining: 9999,
    generations_used: 0,
    template_reselects: 0,
  });
  check("requête acceptée", hostile.success, true);
  check(
    "seuls idea et projectType survivent",
    Object.keys(hostile.data).sort(),
    ["idea", "projectType"],
  );
  check("p_limit absent du résultat", "p_limit" in hostile.data, false);
  check("plan absent du résultat", "plan" in hostile.data, false);
  check("user_id absent du résultat", "user_id" in hostile.data, false);
}

console.log("\n=== 2. La limite ne vient QUE du plan serveur ===");
{
  check("free", GENERATION_LIMITS.free, 3);
  check("pro", GENERATION_LIMITS.pro, 150);
  check("agency", GENERATION_LIMITS.agency, 500);
  // Un plan inconnu n'a pas d'entrée : `reserveGeneration` retombe sur `free`.
  check(
    "plan forgé n'a pas de limite",
    GENERATION_LIMITS["unlimited"],
    undefined,
  );
}

console.log("\n=== 3. Bornes de l'idée ===");
{
  check(
    "idée trop courte refusée",
    generateSchema.safeParse({ idea: "court" }).success,
    false,
  );
  check(
    "idée trop longue refusée",
    generateSchema.safeParse({ idea: "x".repeat(IDEA_MAX_LENGTH + 1) }).success,
    false,
  );
  check(
    "domaine forgé refusé",
    generateSchema.safeParse({
      idea: "Une idée parfaitement valide pour un site de test.",
      projectType: "admin",
    }).success,
    false,
  );
}

/* Copie exacte du schéma de `app/api/contact/route.ts`. */
const contactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  message: z.string().trim().min(10).max(4000),
  consent: z.literal(true),
  company: z.string().max(200).optional(),
});

console.log("\n=== 4. Mass assignment sur /api/contact ===");
{
  const hostile = contactSchema.safeParse({
    name: "Attaquant",
    email: "a@b.co",
    message: "Un message assez long pour passer la validation serveur.",
    consent: true,
    id: "00000000-0000-0000-0000-000000000000",
    created_at: "1970-01-01T00:00:00Z",
    user_id: "22222222-2222-2222-2222-222222222222",
  });
  check("requête acceptée", hostile.success, true);
  check(
    "seuls les champs attendus survivent",
    Object.keys(hostile.data).sort(),
    ["consent", "email", "message", "name"],
  );
  check("id injecté rejeté", "id" in hostile.data, false);
  check("created_at injecté rejeté", "created_at" in hostile.data, false);
}

console.log("\n=== 5. Consentement : littéral true, jamais coercible ===");
{
  for (const value of [false, "true", 1, null, undefined, {}]) {
    check(
      `consent = ${JSON.stringify(value)} refusé`,
      contactSchema.safeParse({
        name: "X",
        email: "a@b.co",
        message: "Un message assez long pour passer la validation.",
        consent: value,
      }).success,
      false,
    );
  }
}

console.log("\n=== 6. Honeypot : accepté rempli, borné ===");
{
  check(
    "honeypot rempli passe la validation",
    contactSchema.safeParse({
      name: "Bot",
      email: "a@b.co",
      message: "Un message assez long pour passer la validation.",
      consent: true,
      company: "AcmeBot",
    }).success,
    true,
  );
  check(
    "charge utile démesurée refusée",
    contactSchema.safeParse({
      name: "Bot",
      email: "a@b.co",
      message: "Un message assez long pour passer la validation.",
      consent: true,
      company: "x".repeat(201),
    }).success,
    false,
  );
}

console.log("\n=== 7. Le client ne choisit jamais le modèle ===");
{
  /*
   * Les sections précédentes valident une **copie** du schéma. Ici on lit la
   * source elle-même : le seul contrôle qui compte est ce que la route passe
   * réellement au moteur, et un schéma recopié ne le prouve pas.
   *
   * Aujourd'hui la propriété tient par construction — `runGeneration` n'a
   * aucun paramètre de modèle dans son appel HTTP. Ce banc existe pour le jour
   * où un second fournisseur sera câblé : `models` est un point d'injection
   * réel dans `lib/ai/engine.ts`, réservé aux tests, et il ne doit jamais
   * devenir joignable depuis un corps de requête.
   */
  const routeSource = readFileSync("app/api/generate/route.ts", "utf8");

  /** Clés de premier niveau de l'objet passé à `runGeneration({ … })`. */
  function argumentKeys(source, callee) {
    const start = source.indexOf(`${callee}({`);
    if (start === -1) return null;
    let depth = 0;
    let end = -1;
    for (let i = source.indexOf("{", start); i < source.length; i++) {
      if (source[i] === "{") depth++;
      else if (source[i] === "}" && --depth === 0) {
        end = i;
        break;
      }
    }
    if (end === -1) return null;

    // Découpe sur les virgules de premier niveau, puis lit la clé de chaque
    // segment. La notation abrégée (`loadTemplates,`) n'a pas de deux-points :
    // le segment entier *est* la clé.
    const body = source.slice(source.indexOf("{", start) + 1, end);
    const segments = [];
    depth = 0;
    let token = "";
    for (const char of body) {
      if ("{[(".includes(char)) depth++;
      else if ("}])".includes(char)) depth--;
      if (depth === 0 && char === ",") {
        segments.push(token);
        token = "";
        continue;
      }
      token += char;
    }
    segments.push(token);

    return segments
      .map((segment) => {
        let inner = 0;
        for (let i = 0; i < segment.length; i++) {
          const char = segment[i];
          if ("{[(".includes(char)) inner++;
          else if ("}])".includes(char)) inner--;
          else if (char === ":" && inner === 0) return segment.slice(0, i);
        }
        return segment;
      })
      .map((key) => key.trim())
      .filter(Boolean)
      .sort();
  }

  const keys = argumentKeys(routeSource, "runGeneration");
  check(
    "runGeneration reçoit exactement les quatre entrées prévues",
    keys,
    ["files", "idea", "loadTemplates", "projectType"],
  );
  check(
    "aucune clé `models` transmise depuis la route HTTP",
    keys?.includes("models"),
    false,
  );
  check(
    "aucune clé `client` transmise depuis la route HTTP",
    keys?.includes("client"),
    false,
  );

  /*
   * `files` est légitime, mais son contenu ne doit jamais venir du corps de la
   * requête : le client envoie des identifiants, le serveur relit le texte en
   * base. Un `extracted_text` lu depuis `parsed.data` contournerait toute la
   * validation d'envoi.
   */
  check(
    "le texte des fichiers n'est jamais lu dans la requête",
    /parsed\.data\.(files|extracted_text|fileContents)/.test(routeSource),
    false,
  );
  check(
    "seuls des identifiants de fichiers sont acceptés",
    /fileIds:\s*z\.array\(z\.string\(\)\.uuid\(\)\)/.test(routeSource),
    true,
  );
  check(
    "les fichiers sont relus depuis la table, par le client de session",
    /session[\s\S]{0,80}from\("generation_files"\)[\s\S]{0,120}extracted_text/.test(
      routeSource,
    ),
    true,
  );

  // Le corps de la requête n'est lu qu'une fois, dans le schéma Zod ; aucun
  // accès direct à un champ de modèle ne doit exister ailleurs dans la route.
  for (const forbidden of ["\\.model", "\\.provider", "body.model"]) {
    check(
      `la route ne lit jamais \`${forbidden.replace("\\", "")}\` du client`,
      new RegExp(`parsed\\.data${forbidden}`).test(routeSource),
      false,
    );
  }

  /*
   * Les noms de modèles viennent de l'environnement, sans repli inventé : un
   * repli en dur ferait tourner la production sur un modèle que personne n'a
   * choisi, et l'écart serait découvert sur la qualité des sorties.
   */
  const clientSource = readFileSync("lib/ai/client.ts", "utf8");
  check(
    "aucun nom de modèle en dur dans lib/ai/client.ts",
    /["'`](qwen|llama|mistral|gemma|deepseek|phi|claude-|gemini-)/i.test(
      clientSource,
    ),
    false,
  );
  check(
    "readAiModels échoue si la configuration manque",
    /throw new MissingAiConfigurationError/.test(clientSource),
    true,
  );
}

console.log("\n=== 8. Catalogue et origine — fuites et replis ===");
{
  const templatesSource = readFileSync("app/api/templates/route.ts", "utf8");
  check(
    "/api/templates lit via le client admin",
    /createSupabaseAdminClient/.test(templatesSource),
    true,
  );
  check(
    "le JSON du catalogue n'expose pas row.body",
    /body:\s*row\.body/.test(templatesSource),
    false,
  );
  check(
    "la palette est extraite côté serveur",
    /extractPalette\(row\.body/.test(templatesSource),
    true,
  );

  const originSource = readFileSync("lib/auth/site-origin.ts", "utf8");
  check(
    "pas de repli Host en production",
    /NODE_ENV === "production"/.test(originSource) &&
      /NEXT_PUBLIC_SITE_URL/.test(originSource),
    true,
  );

  const hideBody = readFileSync(
    "supabase/migrations/20260906120000_prompt_templates_hide_body.sql",
    "utf8",
  );
  check(
    "GRANT public n'inclut pas body",
    /grant select \([^;]*body/is.test(hideBody),
    false,
  );
  check(
    "body / variables / asset_paths sont cités comme exclus",
    /body/.test(hideBody) && /variables/.test(hideBody) && /asset_paths/.test(hideBody),
    true,
  );

  const authSource = readFileSync("app/(auth)/actions.ts", "utf8");
  check(
    "connexion et inscription sont plafonnées",
    /AUTH_RATE_LIMIT/.test(authSource) && /throttleAuth\("signin"\)/.test(authSource),
    true,
  );

  const healthSource = readFileSync("app/api/health/route.ts", "utf8");
  check(
    "health de production n'expose que status",
    /exposeDetails/.test(healthSource) && /\{ status \}/.test(healthSource),
    true,
  );
}

console.log(
  `\n${failed === 0 ? "TOUS LES TESTS PASSENT" : "ECHECS"} — ${passed} pass, ${failed} fail`,
);
process.exit(failed === 0 ? 0 : 1);
