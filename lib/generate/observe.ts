/**
 * Journaux DEV du flow de génération — aucun secret.
 *
 * En production ces lignes sont muettes. En développement elles disent
 * exactement où le pipeline s'arrête, sans cookies, jetons ni clés.
 */

const SENSITIVE = /key|token|cookie|authorization|password|secret|service.?role|refresh/i;

function sanitize(detail: Record<string, unknown>): Record<string, unknown> {
  const safe: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(detail)) {
    if (SENSITIVE.test(key)) continue;
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean" || value === null) {
      safe[key] = value;
    }
  }
  return safe;
}

export function logGenerate(
  scope: "ui" | "api",
  step: string,
  detail?: Record<string, unknown>,
): void {
  if (process.env.NODE_ENV === "production") return;
  const prefix = scope === "ui" ? "[generate-ui]" : "[generate-api]";
  if (detail) {
    console.info(`${prefix} ${step}`, sanitize(detail));
    return;
  }
  console.info(`${prefix} ${step}`);
}
