import type { AssetPath } from "@/lib/templates/parse";

/**
 * Détermination du chemin d'assets — build prompt §4 étape 7.
 *
 * Fonction pure, transcrite à l'identique de `prompt-variable-schema.md` :
 *
 *   has3D → 'advanced' | video → 'video' | ≥3 images → 'sequence'
 *   | ≥1 image → 'enhanced' | sinon → 'standard'
 */
export type AssetInputs = {
  HERO_ASSET?: string | null;
  SCREEN?: string[] | null;
};

const VIDEO = /\.(mp4|webm|mov)$/i;
const MODEL_3D = /\.(glb|gltf)$/i;

export function resolveAssetPath(vars: AssetInputs): AssetPath {
  const hero = vars.HERO_ASSET ?? "";
  const screens = vars.SCREEN ?? [];

  const images = [hero, ...screens]
    .filter(Boolean)
    .filter((asset) => !VIDEO.test(asset));

  const hasVideo = VIDEO.test(hero);
  const has3D = MODEL_3D.test(hero);

  if (has3D) return "advanced";
  if (hasVideo) return "video";
  if (images.length >= 3) return "sequence";
  if (images.length >= 1) return "enhanced";
  return "standard";
}
