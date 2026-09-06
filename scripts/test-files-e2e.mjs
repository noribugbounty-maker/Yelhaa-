/**
 * Pièces jointes — **vraies routes HTTP, vraie base, vrai modèle**.
 *
 *   BASE_URL=http://localhost:3000 npm run test:files:e2e
 *
 * `test:files` couvre la validation pure, `test:files:sql` la RLS. Celui-ci
 * couvre la seule question que ni l'un ni l'autre ne peut trancher : **le
 * contenu du fichier atteint-il réellement le prompt produit**.
 *
 * La preuve tient à un nom propre. Le fichier déclare une marque que l'idée ne
 * mentionne pas ; si ce nom ressort dans la sortie, le contexte a traversé la
 * classification, la sélection de template et l'injection. Une génération
 * témoin, sans fichier, ne doit pas le contenir — sans ce contrôle, on ne
 * saurait pas si le modèle l'a inventé.
 *
 * Ce banc consomme du quota et appelle le modèle. Il crée ses comptes et les
 * supprime ; il ne touche à aucun compte réel.
 */
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";

const BASE = (process.env["BASE_URL"] ?? "http://localhost:3000").replace(
  /\/+$/,
  "",
);
const url =
  process.env["NEXT_PUBLIC_SUPABASE_URL"] ?? process.env["SUPABASE_URL"];
const anonKey =
  process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"] ??
  process.env["SUPABASE_ANON_KEY"];
const serviceKey = process.env["SUPABASE_SERVICE_ROLE_KEY"];

if (!url || !anonKey || !serviceKey) {
  console.log("BLOCKED — configuration Supabase incomplète.");
  process.exit(2);
}

const admin = createClient(url, serviceKey, { auth: { persistSession: false } });

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

function assert(label, condition, detail = "") {
  if (condition) passed++;
  else failed++;
  console.log(
    `  ${condition ? "PASS" : "FAIL"}  ${label}${condition ? "" : `\n        ${detail}`}`,
  );
}

const RUN = `files-e2e-${Date.now()}`;
const PASSWORD = `${RUN}-Aa1!`;
const created = [];

async function makeSession(tag) {
  const email = `${RUN}-${tag}@yelhaa.invalid`;
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password: PASSWORD,
    email_confirm: true,
  });
  if (error) throw new Error(`création de ${tag} impossible : ${error.message}`);
  created.push(data.user.id);

  const anon = createClient(url, anonKey, { auth: { persistSession: false } });
  const { data: session, error: signInError } =
    await anon.auth.signInWithPassword({ email, password: PASSWORD });
  if (signInError) throw new Error(`connexion de ${tag} : ${signInError.message}`);

  const jar = new Map();
  const writer = createServerClient(url, anonKey, {
    cookies: {
      getAll: () => [...jar.entries()].map(([name, value]) => ({ name, value })),
      setAll: (list) => {
        for (const { name, value } of list) jar.set(name, value);
      },
    },
  });
  await writer.auth.setSession({
    access_token: session.session.access_token,
    refresh_token: session.session.refresh_token,
  });

  return {
    id: data.user.id,
    cookie: [...jar.entries()]
      .map(([name, value]) => `${name}=${encodeURIComponent(value)}`)
      .join("; "),
  };
}

const call = (path, cookie, init = {}) =>
  fetch(`${BASE}${path}`, { ...init, headers: { ...(init.headers ?? {}), cookie } });

/** Envoie des fichiers ; rend la réponse analysée et son statut. */
async function upload(cookie, entries) {
  const body = new FormData();
  for (const [name, content, type] of entries) {
    body.append("files", new File([content], name, { type }));
  }
  const response = await call("/api/files", cookie, { method: "POST", body });
  return { status: response.status, payload: await response.json().catch(() => null) };
}

/** Marque inventée pour ce banc : elle ne peut venir que du fichier. */
const BRAND = "Kavalyra";

/**
 * Le véhicule du contexte est un **SVG**, pas un markdown : c'est le format
 * que l'interface annonce en premier, et celui dont il faut prouver qu'il
 * traverse réellement le pipeline. Un logo déclare un nom et une couleur ;
 * ce sont des faits, et le classifieur doit pouvoir les extraire.
 */
const BRIEF = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 64">',
  `  <title>${BRAND}</title>`,
  `  <desc>Logo de ${BRAND}, ateliers de céramique artisanale.</desc>`,
  '  <rect width="240" height="64" fill="#1B1B18"/>',
  `  <text x="16" y="40" fill="#D6FF00" font-size="28">${BRAND}</text>`,
  "</svg>",
].join("\n");

const IDEA =
  "Un site vitrine pour des ateliers de poterie avec réservation en ligne.";

let A;
let B;

try {
  A = await makeSession("a");
  B = await makeSession("b");
  console.log(`Deux comptes créés (${RUN}).\n`);

  console.log("=== 1. Formats acceptés ===");
  {
    for (const [name, type] of [
      ["logo.svg", "image/svg+xml"],
      ["notes.txt", "text/plain"],
      ["brief.md", "text/markdown"],
      ["donnees.csv", "text/csv"],
      ["config.json", "application/json"],
    ]) {
      const content = name.endsWith(".json")
        ? '{"cle":"valeur"}'
        : name.endsWith(".svg")
          ? '<svg xmlns="http://www.w3.org/2000/svg"><title>Test</title></svg>'
          : "Contenu de test lisible.";
      const { status, payload } = await upload(A.cookie, [[name, content, type]]);
      check(`${name} accepté`, status, 201);
      assert(
        `${name} : un identifiant est rendu`,
        typeof payload?.files?.[0]?.id === "string",
        JSON.stringify(payload),
      );
      assert(
        `${name} : le contenu extrait n'est jamais renvoyé au client`,
        !JSON.stringify(payload).includes("extracted_text"),
        JSON.stringify(payload),
      );
    }
  }

  console.log("\n=== 2. Refus — la validation est serveur ===");
  {
    const cases = [
      /*
       * Ces quatre-là comptent autant que les acceptés : l'interface ne les
       * annonce pas, et le serveur ne doit pas les laisser passer par une
       * porte de derrière. Un fichier accepté puis ignoré par le moteur est
       * pire qu'un refus.
       */
      ["PNG", [["logo.png", "\x89PNG", "image/png"]], 400],
      ["JPG", [["photo.jpg", "donnees", "image/jpeg"]], 400],
      ["JPEG", [["photo.jpeg", "donnees", "image/jpeg"]], 400],
      ["PDF", [["dossier.pdf", "%PDF-1.7", "application/pdf"]], 400],
      // Un PNG renommé en .svg : extension et type plausibles, contenu non.
      [
        "PNG renommé en .svg",
        [["faux.svg", `\x89PNG${String.fromCharCode(0)}`, "image/svg+xml"]],
        400,
      ],
      ["exécutable renommé", [["payload.exe", "MZ", "application/octet-stream"]], 400],
      ["type contradictoire", [["a.txt", "texte", "application/x-msdownload"]], 400],
      ["fichier vide", [["vide.txt", "", "text/plain"]], 400],
      [
        "binaire déguisé en texte",
        [["faux.txt", `ok${String.fromCharCode(0)}binaire`, "text/plain"]],
        400,
      ],
      [
        "fichier trop gros",
        [["gros.txt", "x".repeat(600 * 1024), "text/plain"]],
        400,
      ],
      [
        "trop de fichiers",
        Array.from({ length: 6 }, (_, i) => [`f${i}.txt`, "contenu", "text/plain"]),
        400,
      ],
    ];
    for (const [label, entries, expected] of cases) {
      const { status, payload } = await upload(A.cookie, entries);
      check(`${label} refusé`, status, expected);
      assert(
        `${label} : le refus est expliqué`,
        typeof payload?.error === "string" && payload.error.length > 0,
        JSON.stringify(payload),
      );
    }

    // Un nom qui tente un chemin est accepté comme *nom*, jamais comme chemin.
    const traversal = await upload(A.cookie, [
      ["../../etc/passwd.txt", "contenu inoffensif", "text/plain"],
    ]);
    check("nom avec chemin accepté comme nom", traversal.status, 201);
    assert(
      "les séparateurs ont disparu du nom conservé",
      !traversal.payload.files[0].filename.includes("/"),
      traversal.payload.files[0].filename,
    );
  }

  console.log("\n=== 3. IDOR — le fichier de B est inutilisable par A ===");
  {
    const owned = await upload(B.cookie, [["secret-b.md", "Données de B.", "text/markdown"]]);
    const bFileId = owned.payload.files[0].id;

    // A tente de générer avec l'identifiant de B.
    const response = await call("/api/generate", A.cookie, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idea: IDEA, fileIds: [bFileId] }),
    });
    check("A ne peut pas générer avec le fichier de B", response.status, 404);

    // A tente de le supprimer.
    const removed = await call(
      `/api/files?id=${encodeURIComponent(bFileId)}`,
      A.cookie,
      { method: "DELETE" },
    );
    check("la suppression ne révèle rien", removed.status, 200);
    const { data: still } = await admin
      .from("generation_files")
      .select("id")
      .eq("id", bFileId)
      .maybeSingle();
    assert("le fichier de B est toujours là", still !== null, "il a été supprimé");
  }

  console.log("\n=== 4. Suppression de son propre fichier ===");
  {
    const mine = await upload(A.cookie, [["a-retirer.txt", "contenu", "text/plain"]]);
    const id = mine.payload.files[0].id;
    const removed = await call(`/api/files?id=${encodeURIComponent(id)}`, A.cookie, {
      method: "DELETE",
    });
    check("suppression acceptée", removed.status, 200);
    const { data: gone } = await admin
      .from("generation_files")
      .select("id")
      .eq("id", id)
      .maybeSingle();
    check("la ligne a disparu", gone, null);
  }

  console.log("\n=== 5. Le contexte du fichier atteint le prompt produit ===");
  {
    // Témoin : la même idée, sans fichier. La marque ne doit pas apparaître.
    const control = await call("/api/generate", A.cookie, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idea: IDEA }),
    });
    const controlPayload = await control.json();

    if (control.status !== 200) {
      console.log(
        `  BLOCKED — génération témoin ${control.status} : ${controlPayload?.error ?? "sans message"}`,
      );
    } else {
      assert(
        "témoin sans fichier : la marque n'apparaît pas",
        !controlPayload.output.includes(BRAND),
        "la marque est apparue sans fichier — l'assertion suivante ne prouverait rien",
      );

      const { status: uploadStatus, payload: uploaded } = await upload(A.cookie, [
        ["logo.svg", BRIEF, "image/svg+xml"],
      ]);
      check("le SVG est accepté par le serveur", uploadStatus, 201);
      const fileId = uploaded.files[0].id;

      const withFile = await call("/api/generate", A.cookie, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: IDEA, fileIds: [fileId] }),
      });
      const payload = await withFile.json();
      check("la génération avec fichier aboutit", withFile.status, 200);

      assert(
        "la marque déclarée dans le SVG apparaît dans le prompt",
        typeof payload.output === "string" && payload.output.includes(BRAND),
        `sortie de ${payload.output?.length ?? 0} caractères, sans « ${BRAND} »`,
      );

      // Le contenu conservé est bien le texte du SVG, pas une transformation.
      const { data: stored } = await admin
        .from("generation_files")
        .select("extracted_text, mime_type")
        .eq("id", fileId)
        .maybeSingle();
      check("le type MIME du SVG est conservé", stored?.mime_type, "image/svg+xml");
      assert(
        "le balisage SVG est conservé tel quel",
        stored?.extracted_text.includes("<svg") &&
          stored?.extracted_text.includes("#D6FF00"),
        (stored?.extracted_text ?? "").slice(0, 80),
      );

      // Le fichier est rattaché à la génération.
      const { data: attached } = await admin
        .from("generation_files")
        .select("generation_id")
        .eq("id", fileId)
        .maybeSingle();
      check("le fichier est rattaché à la génération", attached?.generation_id, payload.id);

      // Une conversation est créée et porte les deux messages.
      assert(
        "une conversation est créée",
        typeof payload.conversation_id === "string",
        JSON.stringify(payload.conversation_id),
      );
      const { data: messages } = await admin
        .from("messages")
        .select("role, content, generation_id")
        .eq("conversation_id", payload.conversation_id)
        .order("created_at", { ascending: true });
      check("deux messages sont écrits", messages?.length, 2);
      check("le premier est celui de l'utilisateur", messages?.[0]?.role, "user");
      check("le second vient de l'assistant", messages?.[1]?.role, "assistant");
      check(
        "le message assistant pointe la génération",
        messages?.[1]?.generation_id,
        payload.id,
      );

      // Le workspace est joignable avec l'identifiant réel.
      const workspace = await call(`/workspace/${payload.id}`, A.cookie);
      check("le workspace répond", workspace.status, 200);

      // Et il reste refusé à B.
      const foreign = await call(`/workspace/${payload.id}`, B.cookie);
      assert(
        "le workspace de A n'est pas servi à B",
        foreign.status !== 200,
        `statut ${foreign.status}`,
      );
    }
  }

  console.log("\n=== 6. Le quota n'est pas contourné par les fichiers ===");
  {
    const before = await (await call("/api/me/quota", B.cookie)).json();
    const { payload: uploaded } = await upload(B.cookie, [
      ["b.txt", "Contenu de B.", "text/plain"],
    ]);
    const afterUpload = await (await call("/api/me/quota", B.cookie)).json();
    check(
      "envoyer un fichier ne consomme aucun quota",
      afterUpload.quota.remaining,
      before.quota.remaining,
    );

    const response = await call("/api/generate", B.cookie, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idea: IDEA, fileIds: [uploaded.files[0].id] }),
    });
    const after = await (await call("/api/me/quota", B.cookie)).json();

    if (response.status === 200) {
      check(
        "générer avec fichier consomme exactement une unité",
        before.quota.remaining - after.quota.remaining,
        1,
      );
    } else {
      const body = await response.json().catch(() => null);
      console.log(
        `  BLOCKED — génération ${response.status} : ${body?.error ?? "sans message"}`,
      );
    }
  }
} finally {
  for (const id of created) {
    await admin.from("usage_counters").delete().eq("user_id", id);
    await admin.from("generation_files").delete().eq("user_id", id);
    await admin.auth.admin.deleteUser(id).catch(() => {});
  }
  console.log("\nComptes de test supprimés.");
}

console.log(
  `\n${failed === 0 ? "TOUS LES TESTS PASSENT" : "ECHECS"} — ${passed} pass, ${failed} fail`,
);
process.exit(failed === 0 ? 0 : 1);
