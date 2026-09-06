import { NextResponse } from "next/server";

import { reportSupabaseServerEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * `GET /api/health` — pourquoi le déploiement est muet.
 *
 * Trois pages tombent ensemble quand Supabase n'est pas joignable : `/login`,
 * `/signup` et `/faq`. En développement (ou `HEALTH_DETAIL=1`), la réponse
 * nomme la cause : variables absentes, base injoignable, FAQ vide.
 *
 * En production, le détail reste dans les journaux. La réponse publique
 * n'expose que `{ status }` — pas les noms de variables manquantes, pas le
 * message PostgREST, pas le décompte FAQ.
 *
 * `force-dynamic` : une sonde mise en cache dirait l'état d'hier.
 */
export const dynamic = "force-dynamic";

function exposeDetails(): boolean {
  return (
    process.env.NODE_ENV !== "production" ||
    process.env.HEALTH_DETAIL === "1"
  );
}

export async function GET() {
  const env = reportSupabaseServerEnv();
  const detailed = exposeDetails();

  const payload: {
    status: "ok" | "degraded";
    supabase: {
      configured: boolean;
      missing: string[];
      viaRuntimeAlias: boolean;
      hint?: string;
    };
    database: {
      reachable: boolean;
      faqArticles: number | null;
      error?: string;
    };
  } = {
    status: "degraded",
    supabase: {
      configured: env.ok,
      missing: env.missing,
      viaRuntimeAlias: env.viaRuntimeAlias,
    },
    database: { reachable: false, faqArticles: null },
  };

  const publicStatus = (status: "ok" | "degraded", http: number) => {
    if (!detailed) {
      return NextResponse.json({ status }, { status: http });
    }
    return NextResponse.json(payload, { status: http });
  };

  if (!env.ok) {
    payload.supabase.hint =
      "Set these in your hosting provider, then redeploy. NEXT_PUBLIC_* variables " +
      "are inlined at build time, so adding them without a rebuild changes nothing. " +
      "SUPABASE_URL and SUPABASE_ANON_KEY are read at request time and take effect " +
      "immediately.";
    console.error(
      `[health] configuration incomplète : ${env.missing.join(", ")}`,
    );
    return publicStatus("degraded", 503);
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    payload.database.error = "client could not be created";
    console.error("[health] client Supabase impossible à créer");
    return publicStatus("degraded", 503);
  }

  /*
   * `head: true` : on veut le compte, pas les douze articles. La sonde ne doit
   * pas transférer de contenu à chaque appel.
   */
  const { count, error } = await supabase
    .from("faq_articles")
    .select("slug", { count: "exact", head: true })
    .eq("is_active", true);

  if (error) {
    payload.database.error = `${error.code ?? "no code"}: ${error.message}`;
    console.error("[health] lecture FAQ impossible", error.code, error.message);
    return publicStatus("degraded", 503);
  }

  payload.database.reachable = true;
  payload.database.faqArticles = count ?? 0;
  payload.status = (count ?? 0) > 0 ? "ok" : "degraded";

  return publicStatus(
    payload.status,
    payload.status === "ok" ? 200 : 503,
  );
}
