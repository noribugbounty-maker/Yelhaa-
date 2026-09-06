import "server-only";

/**
 * Limitation de débit applicative — build prompt §4 étape 2, §9.
 *
 * Fenêtre glissante en mémoire de processus. C'est la couche applicative
 * demandée au §9, pas la seule : le vrai plafonnement se pose au bord, dans
 * Cloudflare, en phase 11. Sur plusieurs instances serverless, chaque instance
 * tient son propre compteur — cette limite protège d'une boucle, pas d'un
 * attaquant décidé.
 */

type Window = { hits: number[] };

const WINDOWS = new Map<string, Window>();

export type RateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  /** Secondes avant qu'un nouvel essai passe. */
  retryAfterSeconds: number;
};

export function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
  now = Date.now(),
): RateLimitResult {
  const window = WINDOWS.get(key) ?? { hits: [] };
  const cutoff = now - windowMs;

  window.hits = window.hits.filter((timestamp) => timestamp > cutoff);

  if (window.hits.length >= limit) {
    WINDOWS.set(key, window);
    const oldest = window.hits[0] ?? now;
    return {
      allowed: false,
      limit,
      remaining: 0,
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((oldest + windowMs - now) / 1000),
      ),
    };
  }

  window.hits.push(now);
  WINDOWS.set(key, window);

  // Évite que la table enfle sur un processus long-lived.
  if (WINDOWS.size > 5000) {
    for (const [entryKey, entry] of WINDOWS) {
      if (entry.hits.every((timestamp) => timestamp <= cutoff))
        WINDOWS.delete(entryKey);
    }
  }

  return {
    allowed: true,
    limit,
    remaining: limit - window.hits.length,
    retryAfterSeconds: 0,
  };
}

/** 10 requêtes par minute et par utilisateur (§4 étape 2). */
export const GENERATE_RATE_LIMIT = { limit: 10, windowMs: 60_000 } as const;

/** Réponses de chat — 20 / min / utilisateur. Ne consomme pas le quota de génération. */
export const CHAT_RATE_LIMIT = { limit: 20, windowMs: 60_000 } as const;

/**
 * Catalogue public — 60 requêtes par minute et par IP.
 *
 * L'endpoint n'est pas authentifié : la clé est donc l'adresse, pas un
 * utilisateur. Le plafond est large parce qu'un sélecteur légitime pagine et
 * cherche en rafale, mais il empêche la boucle de scraping de tourner à pleine
 * vitesse. Comme les autres, c'est la couche applicative : le vrai
 * plafonnement se pose au bord.
 */
export const CATALOGUE_RATE_LIMIT = { limit: 60, windowMs: 60_000 } as const;

/** Connexion, inscription, départ OAuth — 8 essais / minute / IP. */
export const AUTH_RATE_LIMIT = { limit: 8, windowMs: 60_000 } as const;

/** Suppression de compte — 3 tentatives / heure / utilisateur. */
export const ACCOUNT_DELETE_RATE_LIMIT = {
  limit: 3,
  windowMs: 60 * 60_000,
} as const;
