/**
 * Rôle administrateur — **vraies routes HTTP, vraie base, vraie session**.
 *
 *   BASE_URL=http://localhost:3000 npm run test:admin:e2e
 *
 * `test:admin` couvre la logique pure. Celui-ci couvre ce qu'elle ne peut pas
 * voir : le serveur en cours d'exécution lit-il réellement `ADMIN_EMAILS`, et
 * un administrateur laisse-t-il réellement `usage_counters` intact.
 *
 * ## L'observable choisi
 *
 * Le compteur n'est pas comparé avant/après : un utilisateur normal réserve
 * puis se fait rembourser, donc la valeur revient à son point de départ et les
 * deux cas seraient indistinguables. Ce qui les sépare est l'**existence de la
 * ligne** : `reserve_generation` la crée à la première utilisation, tandis
 * qu'un administrateur ne l'appelle jamais. Aucune ligne, jamais, est une
 * affirmation vérifiable.
 *
 * ## Le cookie de session
 *
 * Il n'est pas fabriqué à la main. `createServerClient` du même paquet que le
 * serveur calcule lui-même les cookies à poser : le format vient donc de la
 * bibliothèque, pas d'une supposition qui casserait à la prochaine version.
 *
 * ## Le compte administrateur réel n'est jamais touché
 *
 * Le banc crée ses propres comptes et les supprime. L'adresse configurée en
 * production n'est ni créée, ni modifiée, ni connectée.
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

const RUN = `admin-e2e-${Date.now()}`;
const PASSWORD = `${RUN}-Aa1!`;
const created = [];

/**
 * Crée un compte confirmé et rend son en-tête `Cookie`, calculé par
 * `@supabase/ssr` lui-même.
 */
async function makeSession(email) {
  /*
   * L'adresse sonde est fixe — elle doit figurer dans `ADMIN_EMAILS` du
   * serveur, donc elle ne peut pas porter d'horodatage. Un banc interrompu
   * laisse alors le compte derrière lui ; on le retire avant de recréer,
   * plutôt que d'échouer à la première exécution suivante.
   */
  let { data, error } = await admin.auth.admin.createUser({
    email,
    password: PASSWORD,
    email_confirm: true,
  });

  if (error?.message.includes("already been registered")) {
    const { data: list } = await admin.auth.admin.listUsers({ perPage: 200 });
    const existing = (list?.users ?? []).find((user) => user.email === email);
    if (existing) {
      await admin.from("usage_counters").delete().eq("user_id", existing.id);
      await admin.from("generation_files").delete().eq("user_id", existing.id);
      await admin.auth.admin.deleteUser(existing.id);
    }
    ({ data, error } = await admin.auth.admin.createUser({
      email,
      password: PASSWORD,
      email_confirm: true,
    }));
  }

  if (error) throw new Error(`création impossible : ${error.message}`);
  created.push(data.user.id);

  const anon = createClient(url, anonKey, { auth: { persistSession: false } });
  const { data: session, error: signInError } =
    await anon.auth.signInWithPassword({ email, password: PASSWORD });
  if (signInError) throw new Error(`connexion impossible : ${signInError.message}`);

  const jar = new Map();
  const writer = createServerClient(url, anonKey, {
    cookies: {
      getAll: () =>
        [...jar.entries()].map(([name, value]) => ({ name, value })),
      setAll: (cookiesToSet) => {
        for (const { name, value } of cookiesToSet) jar.set(name, value);
      },
    },
  });
  await writer.auth.setSession({
    access_token: session.session.access_token,
    refresh_token: session.session.refresh_token,
  });

  const cookie = [...jar.entries()]
    .map(([name, value]) => `${name}=${encodeURIComponent(value)}`)
    .join("; ");

  if (!cookie) throw new Error("aucun cookie de session produit");
  return { id: data.user.id, email, cookie };
}

const call = (path, cookie, init = {}) =>
  fetch(`${BASE}${path}`, {
    ...init,
    headers: { ...(init.headers ?? {}), cookie },
  });

/** Une ligne de compteur existe-t-elle pour ce mois ? */
async function counterRow(userId) {
  const period = new Date(
    Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), 1),
  )
    .toISOString()
    .slice(0, 10);
  const { data } = await admin
    .from("usage_counters")
    .select("generations_used")
    .eq("user_id", userId)
    .eq("period_start", period)
    .maybeSingle();
  return data;
}

const IDEA =
  "Une plateforme de réservation pour des ateliers de céramique en ville.";

let probe;
let normal;

try {
  // L'adresse sonde doit figurer dans ADMIN_EMAILS du serveur pour ce banc.
  const probeEmail =
    process.env["ADMIN_PROBE_EMAIL"] ?? `${RUN}-admin@yelhaa.invalid`;
  probe = await makeSession(probeEmail);
  normal = await makeSession(`${RUN}-normal@yelhaa.invalid`);
  console.log(`Deux comptes créés (${RUN}).`);
  console.log(`Sonde admin : ${probe.email}\n`);

  console.log("=== 1. Le serveur lit réellement ADMIN_EMAILS ===");
  {
    const response = await call("/api/me/quota", probe.cookie);
    const payload = await response.json();
    check("la session est reconnue", payload.authenticated, true);

    /*
     * Ce banc exige que l'adresse sonde figure dans `ADMIN_EMAILS` **du
     * serveur en cours d'exécution**. En configuration normale elle n'y est
     * pas — seule l'adresse réelle l'est — et toutes les assertions
     * suivantes tomberaient en rouge pour une raison de configuration, pas
     * de code. Un banc rouge par défaut finit par être ignoré : il s'arrête
     * donc en BLOCKED, en disant exactement quoi faire.
     */
    if (payload.unmetered !== true) {
      console.log(
        `\nBLOCKED — ${probe.email} n'est pas administrateur côté serveur.\n\n` +
          "Ce banc pilote le serveur en cours d'exécution ; il lui faut une\n" +
          "adresse sonde déclarée. Pour l'exécuter :\n\n" +
          `  1. ajouter « ,${probe.email} » à ADMIN_EMAILS dans .env.local\n` +
          "  2. redémarrer le serveur de développement\n" +
          `  3. BASE_URL=… ADMIN_PROBE_EMAIL=${probe.email} npm run test:admin:e2e\n` +
          "  4. retirer l'adresse sonde et redémarrer\n\n" +
          "La logique de rôle sans serveur est couverte par `npm run test:admin`.",
      );
      for (const id of created) {
        await admin.from("usage_counters").delete().eq("user_id", id);
        await admin.from("generation_files").delete().eq("user_id", id);
        await admin.auth.admin.deleteUser(id).catch(() => {});
      }
      process.exit(2);
    }

    assert(
      "la sonde est vue comme non comptée",
      payload.unmetered === true,
      `unmetered=${payload.unmetered}`,
    );
    check("aucun reste chiffré n'est annoncé", payload.quota?.remaining, null);
    check("aucune limite chiffrée n'est annoncée", payload.quota?.limit, null);
    assert(
      "le plan commercial reste lisible",
      typeof payload.quota?.plan === "string",
      JSON.stringify(payload.quota),
    );
  }

  console.log("\n=== 2. Un utilisateur normal ne l'est pas ===");
  {
    const response = await call("/api/me/quota", normal.cookie);
    const payload = await response.json();
    check("la session est reconnue", payload.authenticated, true);
    check("il n'est pas non compté", payload.unmetered, false);
    assert(
      "il reçoit un reste chiffré",
      typeof payload.quota?.remaining === "number",
      JSON.stringify(payload.quota),
    );
    check("son plan est free", payload.quota?.plan, "free");
  }

  console.log("\n=== 3. Aucune escalade depuis la requête ===");
  {
    // Tout ce qu'un utilisateur normal tenterait pour se faire passer pour
    // administrateur. Le serveur ne lit que la session.
    const attempts = [
      ["en-tête x-admin", { "x-admin": "true" }, ""],
      ["en-tête x-is-admin", { "x-is-admin": "1" }, ""],
      ["en-tête x-role", { "x-role": "admin" }, ""],
    ];
    for (const [label, headers] of attempts) {
      const response = await fetch(`${BASE}/api/me/quota`, {
        headers: { cookie: normal.cookie, ...headers },
      });
      const payload = await response.json();
      check(`${label} sans effet`, payload.unmetered, false);
    }

    // Le paramètre d'URL n'existe pas, mais on vérifie qu'il ne surgit pas.
    const withQuery = await call(
      "/api/me/quota?admin=true&unmetered=true&user_id=" + probe.id,
      normal.cookie,
    );
    const queried = await withQuery.json();
    check("paramètres d'URL sans effet", queried.unmetered, false);
    assert(
      "et le quota reste le sien",
      typeof queried.quota?.remaining === "number",
      JSON.stringify(queried.quota),
    );

    // Sans session, aucun privilège.
    const anonymous = await fetch(`${BASE}/api/me/quota`, {
      headers: { "x-admin": "true" },
    });
    const anonPayload = await anonymous.json();
    check("anonyme : non authentifié", anonPayload.authenticated, false);
    assert(
      "anonyme : aucun quota exposé",
      anonPayload.quota === undefined,
      JSON.stringify(anonPayload),
    );
  }

  console.log("\n=== 4. usage_counters — l'admin ne crée jamais de ligne ===");
  {
    // Aucune ligne au départ pour ni l'un ni l'autre : comptes neufs.
    check("sonde : aucune ligne au départ", await counterRow(probe.id), null);
    check("normal : aucune ligne au départ", await counterRow(normal.id), null);

    /*
     * Trois générations de suite. L'appel au modèle peut échouer — crédit
     * insuffisant, clé absente — et cela n'affaiblit pas le test : ce qui est
     * observé est la **réservation**, qui se produit avant tout appel payant.
     */
    const statuses = [];
    for (let i = 0; i < 3; i++) {
      const response = await call("/api/generate", probe.cookie, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: IDEA }),
      });
      statuses.push(response.status);
    }
    console.log(`        statuts de génération admin : ${statuses.join(", ")}`);

    assert(
      "aucune génération admin n'est refusée pour quota",
      !statuses.includes(402),
      `statuts ${statuses.join(", ")}`,
    );
    check(
      "après trois générations, toujours aucune ligne de compteur",
      await counterRow(probe.id),
      null,
    );

    // Le contraste : un utilisateur normal, lui, fait naître la ligne.
    const normalResponse = await call("/api/generate", normal.cookie, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idea: IDEA }),
    });
    console.log(`        statut de génération normale : ${normalResponse.status}`);

    const row = await counterRow(normal.id);
    assert(
      "un utilisateur normal fait naître la ligne de compteur",
      row !== null,
      "aucune ligne créée — la réservation n'a pas eu lieu",
    );
  }

  console.log("\n=== 5. Générations admin répétées ===");
  {
    const statuses = [];
    for (let i = 0; i < 5; i++) {
      const response = await call("/api/generate", probe.cookie, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: IDEA }),
      });
      statuses.push(response.status);
    }
    assert(
      "cinq générations de plus, aucune bloquée par le quota",
      !statuses.includes(402),
      statuses.join(", "),
    );
    check(
      "et toujours aucune ligne de compteur",
      await counterRow(probe.id),
      null,
    );

    // Le quota reste annoncé comme non compté après usage.
    const after = await (await call("/api/me/quota", probe.cookie)).json();
    check("toujours non compté après usage", after.unmetered, true);
  }

  console.log("\n=== 6. Déconnexion / reconnexion ===");
  {
    // Une nouvelle session sur la même adresse doit rendre le même rôle : il
    // est recalculé à chaque requête, il n'est stocké nulle part.
    const anon = createClient(url, anonKey, { auth: { persistSession: false } });
    const { data: again, error } = await anon.auth.signInWithPassword({
      email: probe.email,
      password: PASSWORD,
    });
    assert("reconnexion réussie", !error, error?.message ?? "");

    const jar = new Map();
    const writer = createServerClient(url, anonKey, {
      cookies: {
        getAll: () =>
          [...jar.entries()].map(([name, value]) => ({ name, value })),
        setAll: (list) => {
          for (const { name, value } of list) jar.set(name, value);
        },
      },
    });
    await writer.auth.setSession({
      access_token: again.session.access_token,
      refresh_token: again.session.refresh_token,
    });
    const freshCookie = [...jar.entries()]
      .map(([name, value]) => `${name}=${encodeURIComponent(value)}`)
      .join("; ");

    const payload = await (await call("/api/me/quota", freshCookie)).json();
    check("le rôle survit à une nouvelle session", payload.unmetered, true);

    // Session détruite : plus rien.
    const revoked = await fetch(`${BASE}/api/me/quota`, {
      headers: { cookie: "sb-none=; " },
    });
    const revokedPayload = await revoked.json();
    check("sans cookie valide, non authentifié", revokedPayload.authenticated, false);
  }
} finally {
  for (const id of created) {
    // Les constructeurs PostgREST sont des « thenables », pas des promesses :
    // `.catch()` n'existe pas dessus tant qu'on ne les a pas attendus.
    await admin.from("usage_counters").delete().eq("user_id", id);
    await admin.from("generation_files").delete().eq("user_id", id);
    // La suppression du compte emporte en cascade profils et générations.
    await admin.auth.admin.deleteUser(id).catch(() => {});
  }
  console.log("\nComptes de test supprimés.");
}

console.log(
  `\n${failed === 0 ? "TOUS LES TESTS PASSENT" : "ECHECS"} — ${passed} pass, ${failed} fail`,
);
process.exit(failed === 0 ? 0 : 1);
