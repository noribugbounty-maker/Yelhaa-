import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { clientIpFromHeaders } from "@/lib/http/client-ip";
import { rateLimit } from "@/lib/rate-limit";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const CONTACT_RATE_LIMIT = { limit: 5, windowMs: 60_000 } as const;

const requestSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  message: z.string().trim().min(10).max(4000),
  consent: z.literal(true),
  /**
   * Champ piège : rempli, c'est un robot. Jamais visible, jamais focusable.
   *
   * Il est volontairement accepté **rempli**. En `.max(0)`, un piège amorcé
   * faisait échouer le schéma et la route répondait 400 « could not be
   * validated » — deux défauts : la branche honeypet plus bas devenait du code
   * mort, et surtout la réponse différait de celle d'un envoi réussi, ce qui
   * révèle le piège à qui le sonde. Un honeypot ne vaut que s'il est
   * indiscernable d'un succès.
   *
   * La borne haute reste, pour ne pas accepter une charge utile arbitraire.
   */
  company: z.string().max(200).optional(),
});

/** `POST /api/contact` — build prompt §8 et §9. */
export async function POST(request: NextRequest) {
  const ip = clientIpFromHeaders(request.headers);

  const limit = rateLimit(`contact:${ip}`, CONTACT_RATE_LIMIT);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many messages in a row. Try again in a moment." },
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
      { error: "The message could not be validated. Check the fields." },
      { status: 400 },
    );
  }

  // Piège rempli : on répond comme un succès, sans rien enregistrer.
  if (parsed.data.company) {
    return NextResponse.json({ received: true });
  }

  const admin = createSupabaseAdminClient();
  if (!admin) {
    return NextResponse.json(
      { error: "Sending messages is temporarily unavailable." },
      { status: 503 },
    );
  }

  const { error } = await admin.from("contact_messages").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    message: parsed.data.message,
    consent: parsed.data.consent,
  });

  if (error) {
    console.error("[contact] enregistrement impossible", error.message);
    return NextResponse.json(
      { error: "Sending messages is temporarily unavailable." },
      { status: 503 },
    );
  }

  return NextResponse.json({ received: true });
}
