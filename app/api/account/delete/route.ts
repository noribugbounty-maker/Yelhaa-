import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { ACCOUNT_DELETE_RATE_LIMIT, rateLimit } from "@/lib/rate-limit";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/supabase/server";

export const runtime = "nodejs";

/** Confirmation explicite : l'utilisateur recopie le mot, sinon rien ne part. */
const requestSchema = z.object({ confirm: z.literal("DELETE") });

/**
 * Suppression du compte et des données personnelles — décisions §6.
 *
 * « L'utilisateur peut demander la suppression de son compte et de ses données
 *   personnelles. Une route et une action d'interface doivent exister pour
 *   cela — pas seulement une mention dans les conditions. »
 *
 * La suppression de la ligne `auth.users` fait tomber en cascade `profiles`,
 * puis `usage_counters` et `generations` par leurs clés étrangères.
 */
export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 },
    );
  }

  const limit = rateLimit(`account-delete:${user.id}`, ACCOUNT_DELETE_RATE_LIMIT);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfterSeconds) },
      },
    );
  }

  const parsed = requestSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Confirmation missing." },
      { status: 400 },
    );
  }

  const admin = createSupabaseAdminClient();
  if (!admin) {
    return NextResponse.json(
      { error: "Deletion temporarily unavailable." },
      { status: 503 },
    );
  }

  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) {
    console.error("[account] suppression impossible", error.message);
    return NextResponse.json(
      { error: "Deletion temporarily unavailable." },
      { status: 502 },
    );
  }

  return NextResponse.json({ deleted: true });
}
