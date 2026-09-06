/**
 * Résolveur de l'alias `@/` pour l'exécution des scripts sous Node.
 *
 * Next.js et TypeScript lisent `paths` du tsconfig ; Node non. Ce hook permet
 * aux bancs d'essai d'importer le code applicatif tel quel, sans dupliquer les
 * modules ni convertir les imports en chemins relatifs.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

// `fileURLToPath` et non `new URL().pathname` : sous Windows, le pathname
// garde le `/` initial et les espaces encodés du chemin du projet.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const CANDIDATES = [
  "",
  ".ts",
  ".tsx",
  ".mjs",
  ".js",
  "/index.ts",
  "/index.tsx",
];

export async function resolve(specifier, context, next) {
  if (!specifier.startsWith("@/")) return next(specifier, context);

  const base = path.join(root, specifier.slice(2));
  for (const suffix of CANDIDATES) {
    const candidate = base + suffix;
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return next(pathToFileURL(candidate).href, context);
    }
  }

  return next(specifier, context);
}
