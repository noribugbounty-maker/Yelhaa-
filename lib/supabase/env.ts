/**
 * Lecture des variables Supabase.
 *
 * Build prompt §1 : « Le code doit fonctionner sans planter quand une variable
 * est absente : afficher un état "service indisponible" clair côté UI et
 * journaliser côté serveur, jamais une page blanche ni une stack trace
 * visible. »
 *
 * D'où le contrat : ces fonctions ne lèvent jamais. Elles renvoient `null`, et
 * c'est à l'appelant de rendre l'état d'indisponibilité.
 *
 * ## Deux lecteurs, et pourquoi
 *
 * `process.env.NEXT_PUBLIC_*` n'est **pas** lu à l'exécution : Next remplace
 * l'expression par sa valeur littérale **au moment du build**, dans le bundle
 * navigateur comme dans le bundle serveur. Conséquence sur une plateforme comme
 * Vercel : si les variables ne sont pas présentes **pendant le build**, elles
 * sont figées à `undefined` dans le code compilé. Les ajouter ensuite dans le
 * tableau de bord ne change rien tant qu'on n'a pas **redéployé** — le site
 * continue d'afficher « indisponible » alors que les variables sont bien là.
 *
 * C'est exactement le piège qui a rendu `/login`, `/signup` et `/faq`
 * indisponibles en production : trois pages qui dépendent toutes du même client.
 *
 * D'où la séparation :
 *
 * - `readSupabaseEnv()` — navigateur. Ne peut lire que `NEXT_PUBLIC_*`, il n'y
 *   a pas d'alternative : le navigateur n'a pas d'environnement d'exécution.
 * - `readSupabaseServerEnv()` — serveur. Essaie d'abord les `NEXT_PUBLIC_*`,
 *   puis retombe sur `SUPABASE_URL` / `SUPABASE_ANON_KEY`, **non préfixées donc
 *   lues à l'exécution**. Renseigner ces deux-là suffit à réparer une
 *   production sans rebuild.
 *
 * La `SUPABASE_SERVICE_ROLE_KEY` n'est jamais lue ici — elle ne quitte pas les
 * modules `server-only` qui en ont besoin.
 */

export type SupabaseEnv = {
  url: string;
  anonKey: string;
};

/** Ce qui manque, pour le diagnostic. Jamais de valeur, uniquement des noms. */
export type SupabaseEnvReport = {
  ok: boolean;
  missing: string[];
  /** `true` quand la configuration ne tient que grâce aux alias d'exécution. */
  viaRuntimeAlias: boolean;
};

let warnedBrowser = false;
let warnedServer = false;

/**
 * Lecture navigateur — `NEXT_PUBLIC_*` uniquement.
 *
 * Les deux références sont écrites en toutes lettres : Next les remplace
 * statiquement au build, un accès dynamique renverrait `undefined`.
 */
export function readSupabaseEnv(): SupabaseEnv | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (url && anonKey) return { url, anonKey };

  if (!warnedBrowser) {
    warnedBrowser = true;
    console.warn(
      "[supabase] configuration navigateur incomplète : " +
        `${[url ? null : "NEXT_PUBLIC_SUPABASE_URL", anonKey ? null : "NEXT_PUBLIC_SUPABASE_ANON_KEY"].filter(Boolean).join(", ")} manquante(s). ` +
        "Ces variables sont figées au build : après les avoir ajoutées, il faut redéployer.",
    );
  }

  return null;
}

/**
 * Lecture serveur — `NEXT_PUBLIC_*` d'abord, alias d'exécution ensuite.
 *
 * `process.env` est bien lu à l'exécution côté serveur pour toute variable
 * **non** préfixée `NEXT_PUBLIC_` : c'est ce qui rend la reprise possible sans
 * rebuild.
 */
export function readSupabaseServerEnv(): SupabaseEnv | null {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env["SUPABASE_URL"];
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env["SUPABASE_ANON_KEY"];

  if (url && anonKey) return { url, anonKey };

  if (!warnedServer) {
    warnedServer = true;
    const missing = [
      url ? null : "NEXT_PUBLIC_SUPABASE_URL (ou SUPABASE_URL)",
      anonKey ? null : "NEXT_PUBLIC_SUPABASE_ANON_KEY (ou SUPABASE_ANON_KEY)",
    ].filter(Boolean);
    console.warn(
      `[supabase] configuration serveur incomplète : ${missing.join(", ")}. ` +
        "Compte, authentification et FAQ sont indisponibles. " +
        "Rappel : les variables NEXT_PUBLIC_* sont figées au build — sur Vercel, " +
        "les ajouter impose un redéploiement, alors que SUPABASE_URL et " +
        "SUPABASE_ANON_KEY sont relues à chaque requête.",
    );
  }

  return null;
}

/**
 * État de la configuration serveur, sans jamais exposer de valeur.
 *
 * Alimente `/api/health` : sur un déploiement muet, savoir **quelle** variable
 * manque évite de deviner. Les noms de variables ne sont pas un secret — ils
 * sont dans `.env.example` et dans la documentation de Next.
 */
export function reportSupabaseServerEnv(): SupabaseEnvReport {
  const publicUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publicKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const aliasUrl = process.env["SUPABASE_URL"];
  const aliasKey = process.env["SUPABASE_ANON_KEY"];

  const missing: string[] = [];
  if (!publicUrl && !aliasUrl) missing.push("SUPABASE_URL");
  if (!publicKey && !aliasKey) missing.push("SUPABASE_ANON_KEY");

  return {
    ok: missing.length === 0,
    missing,
    viaRuntimeAlias:
      missing.length === 0 && (!publicUrl || !publicKey) ? true : false,
  };
}

/** Vrai quand Supabase est joignable côté configuration. Aucun appel réseau. */
export function isSupabaseConfigured(): boolean {
  return readSupabaseServerEnv() !== null;
}
