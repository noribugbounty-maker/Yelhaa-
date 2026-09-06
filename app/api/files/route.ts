import { NextResponse, type NextRequest } from "next/server";

import {
  budgetFiles,
  FILE_REJECTION_MESSAGES,
  ingestText,
  MAX_FILE_BYTES,
  MAX_FILES,
  validateBatch,
  type IngestedFile,
} from "@/lib/files/ingest";
import { rateLimit } from "@/lib/rate-limit";
import { createSupabaseServerClient, getCurrentUser } from "@/lib/supabase/server";

export const runtime = "nodejs";

/**
 * `POST /api/files` — pièces jointes d'une génération.
 *
 * ## Rien n'est écrit sur disque
 *
 * Le fichier est décodé en mémoire, validé, réduit à son texte, puis jeté. Ce
 * qui est conservé est le texte extrait, dans une table protégée par RLS.
 * Aucun chemin n'est construit, donc aucune traversée n'est possible ; rien
 * n'est écrit, donc rien n'est exécutable ; aucun identifiant Storage n'existe,
 * donc aucun ne peut fuir.
 *
 * ## La validation du navigateur ne compte pas
 *
 * L'interface refuse tôt pour expliquer vite, mais tout est refait ici :
 * extension, cohérence du type MIME, taille unitaire, taille du lot, et le
 * seul contrôle qui ne se falsifie pas — le contenu se décode-t-il en texte.
 *
 * ## Le budget est appliqué à l'envoi
 *
 * `budgetFiles` borne le texte conservé avant toute écriture. Un fichier ne
 * peut donc pas gonfler le coût d'une génération après coup, et la troncature
 * est décidée une fois, de façon déterministe, plutôt qu'au moment de l'appel
 * au modèle.
 */
const UPLOAD_RATE_LIMIT = { limit: 20, windowMs: 60_000 } as const;

/** Borne de garde avant même de lire le corps, indépendante du champ Content-Length. */
const MAX_BODY_BYTES = MAX_FILE_BYTES * MAX_FILES;

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const limit = rateLimit(`files:${user.id}`, UPLOAD_RATE_LIMIT);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many uploads. Wait a moment." },
      { status: 429 },
    );
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Upload unavailable." }, { status: 503 });
  }

  // Un `Content-Length` annoncé au-delà de la borne est refusé sans lire le
  // corps. Ce n'est pas la garantie — le champ se falsifie — mais cela évite
  // de mettre en mémoire ce qui sera refusé de toute façon.
  const announced = Number(request.headers.get("content-length") ?? "0");
  if (announced > MAX_BODY_BYTES * 2) {
    return NextResponse.json({ error: "Payload too large." }, { status: 413 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Malformed upload." }, { status: 400 });
  }

  const uploads = form.getAll("files").filter((entry): entry is File => entry instanceof File);
  if (uploads.length === 0) {
    return NextResponse.json({ error: "No file received." }, { status: 400 });
  }

  const batchRejection = validateBatch(
    uploads.map((file) => ({
      filename: file.name,
      mimeType: file.type,
      byteSize: file.size,
    })),
  );
  if (batchRejection) {
    return NextResponse.json(
      { error: FILE_REJECTION_MESSAGES[batchRejection] },
      { status: 400 },
    );
  }

  const ingested: IngestedFile[] = [];
  for (const upload of uploads) {
    const candidate = {
      filename: upload.name,
      mimeType: upload.type,
      byteSize: upload.size,
    };

    let decoded: string;
    try {
      // `TextDecoder` sans `fatal` : un octet illisible devient un caractère de
      // remplacement, que `looksBinary` compte. Échouer ici priverait le
      // contrôle de sa mesure.
      decoded = new TextDecoder("utf-8").decode(await upload.arrayBuffer());
    } catch {
      return NextResponse.json(
        { error: FILE_REJECTION_MESSAGES.binary, filename: upload.name },
        { status: 400 },
      );
    }

    const result = ingestText(candidate, decoded);
    if ("rejection" in result) {
      return NextResponse.json(
        {
          error: FILE_REJECTION_MESSAGES[result.rejection],
          filename: result.rejection === "extension" ? upload.name : undefined,
        },
        { status: 400 },
      );
    }
    ingested.push(result.file);
  }

  const budgeted = budgetFiles(ingested);

  /*
   * Écriture avec le client de session : les policies vérifient la propriété,
   * et le trigger réimpose le propriétaire réel. `user_id` est posé parce que
   * la colonne est `not null`, pas parce qu'on lui fait confiance.
   */
  const { data, error } = await supabase
    .from("generation_files")
    .insert(
      budgeted.map((file) => ({
        user_id: user.id,
        filename: file.filename,
        mime_type: file.mimeType,
        byte_size: file.byteSize,
        extracted_text: file.text,
        truncated: file.truncated,
      })),
    )
    .select("id, filename, mime_type, byte_size, truncated");

  if (error || !data) {
    console.error(
      `[files] écriture refusée — ${error?.code ?? "sans code"} : ${error?.message ?? "inconnue"}`,
    );
    return NextResponse.json({ error: "Upload failed. Try again." }, { status: 500 });
  }

  return NextResponse.json(
    {
      files: data.map((row) => ({
        id: row.id,
        filename: row.filename,
        mime_type: row.mime_type,
        byte_size: row.byte_size,
        truncated: row.truncated,
      })),
    },
    { status: 201, headers: { "cache-control": "no-store" } },
  );
}

/**
 * `DELETE /api/files?id=…` — retirer une pièce jointe avant génération.
 *
 * Aucune comparaison de propriété n'est écrite ici : la policy de suppression
 * filtre sur `auth.uid()`, donc l'identifiant d'un tiers ne touche aucune
 * ligne. La réponse est la même dans les deux cas, pour ne pas transformer
 * l'endpoint en oracle d'existence.
 */
export async function DELETE(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const limit = rateLimit(`files-delete:${user.id}`, UPLOAD_RATE_LIMIT);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Wait a moment." },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfterSeconds) },
      },
    );
  }

  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing file id." }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Unavailable." }, { status: 503 });
  }

  const { error } = await supabase.from("generation_files").delete().eq("id", id);

  if (error) {
    // Un identifiant mal formé n'est pas une panne : c'est une demande qui ne
    // désigne rien.
    const notFound = error.code === "22P02" || error.code === "PGRST116";
    if (!notFound) {
      console.error(`[files] suppression refusée — ${error.code} : ${error.message}`);
      return NextResponse.json({ error: "Unavailable." }, { status: 503 });
    }
  }

  return NextResponse.json({ ok: true }, { headers: { "cache-control": "no-store" } });
}
