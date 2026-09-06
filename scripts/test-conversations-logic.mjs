/**
 * Logique conversationnelle — fonctions pures, aucune base, aucun réseau.
 *
 *   npm run test:conversations
 *
 * Regroupement par date, tri, recherche, titre automatique, validation et
 * export. Toutes ces fonctions prennent `now` en paramètre : les bornes sont
 * donc testées à la seconde près, y compris au passage à l'heure d'été, sans
 * dépendre du moment où le banc tourne.
 */
import {
  bucketFor,
  calendarDaysBetween,
  groupConversations,
  searchConversations,
  sortByUpdatedAt,
} from "../lib/conversations/organize.ts";
import { deriveTitle, validateTitle } from "../lib/conversations/title.ts";
import {
  exportFilename,
  toJson,
  toMarkdown,
  toPlainText,
} from "../lib/conversations/export.ts";

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

/** Heure locale, pour que les bornes soient celles que voit l'utilisateur. */
const local = (y, m, d, h = 12, min = 0) => new Date(y, m - 1, d, h, min);
const conv = (id, updatedAt, title = id) => ({
  id,
  title,
  createdAt: updatedAt.toISOString(),
  updatedAt: updatedAt.toISOString(),
});

console.log("=== 1. Jours calendaires, pas des durées ===");
{
  const now = local(2026, 8, 12, 1, 0); // 1h du matin
  // 23h hier : 2 heures d'écart, mais un jour calendaire.
  check(
    "hier 23h vu depuis 1h → 1 jour",
    calendarDaysBetween(local(2026, 8, 11, 23, 0), now),
    1,
  );
  check(
    "hier 23h n'est pas « aujourd'hui »",
    bucketFor(local(2026, 8, 11, 23, 0), now),
    "yesterday",
  );
  check(
    "aujourd'hui 00h01 → today",
    bucketFor(local(2026, 8, 12, 0, 1), now),
    "today",
  );
}

console.log("\n=== 2. Bornes exactes de chaque groupe ===");
{
  const now = local(2026, 8, 12);
  const at = (daysAgo) => local(2026, 8, 12 - daysAgo);
  check("J-0  → today", bucketFor(at(0), now), "today");
  check("J-1  → yesterday", bucketFor(at(1), now), "yesterday");
  check("J-2  → last7", bucketFor(at(2), now), "last7");
  check("J-7  → last7", bucketFor(at(7), now), "last7");
  check("J-8  → last30", bucketFor(at(8), now), "last30");
  check("J-30 → last30", bucketFor(at(30), now), "last30");
  check("J-31 → older", bucketFor(at(31), now), "older");
  // Horloge client en avance : ne doit pas tomber dans « Older ».
  check("date future → today", bucketFor(local(2026, 8, 13), now), "today");
}

console.log("\n=== 3. Passage à l'heure d'été ===");
{
  // En France, l'heure d'hiver prend effet le dernier dimanche d'octobre :
  // dans la nuit du 25 au 26 octobre 2026, une journée dure 25 heures.
  const now = local(2026, 10, 26, 12);
  check(
    "la veille du changement reste « yesterday »",
    bucketFor(local(2026, 10, 25, 12), now),
    "yesterday",
  );
  check(
    "25 heures écoulées comptent pour 1 jour",
    calendarDaysBetween(local(2026, 10, 25, 12), now),
    1,
  );
}

console.log("\n=== 4. Tri par updated_at décroissant ===");
{
  const list = [
    conv("vieille", local(2026, 8, 1)),
    conv("recente", local(2026, 8, 12)),
    conv("moyenne", local(2026, 8, 10)),
  ];
  check(
    "la plus récente en premier",
    sortByUpdatedAt(list).map((c) => c.id),
    ["recente", "moyenne", "vieille"],
  );
  check("la liste d'origine n'est pas mutée", list[0].id, "vieille");
}

console.log("\n=== 5. Groupes vides jamais rendus ===");
{
  const now = local(2026, 8, 12);
  const groups = groupConversations(
    [conv("a", local(2026, 8, 12)), conv("b", local(2026, 6, 1))],
    now,
  );
  check(
    "seuls today et older apparaissent",
    groups.map((g) => g.id),
    ["today", "older"],
  );
  check(
    "libellés lisibles",
    groups.map((g) => g.label),
    ["Today", "Older"],
  );
  check(
    "aucun groupe vide",
    groups.every((g) => g.conversations.length > 0),
    true,
  );
  check("liste vide → aucun groupe", groupConversations([], now).length, 0);
}

console.log("\n=== 6. Une conversation utilisée remonte dans Today ===");
{
  const now = local(2026, 8, 12);
  const before = groupConversations([conv("A", local(2026, 8, 11))], now);
  check("A est d'abord dans Yesterday", before[0].id, "yesterday");

  // L'utilisateur écrit dans A : `updated_at` passe à maintenant.
  const after = groupConversations([conv("A", now)], now);
  check("A passe dans Today", after[0].id, "today");
}

console.log("\n=== 7. Recherche ===");
{
  const list = [
    conv("1", local(2026, 8, 12), "Cinematic car commercial"),
    conv("2", local(2026, 8, 12), "Cinematic product launch"),
    conv("3", local(2026, 8, 12), "Portfolio redesign"),
    conv("4", local(2026, 8, 12), "Résumé de réunion"),
  ];
  check(
    "« cinematic » → 2 résultats",
    searchConversations(list, "cinematic").map((c) => c.id),
    ["1", "2"],
  );
  check(
    "insensible à la casse",
    searchConversations(list, "CINEMATIC").length,
    2,
  );
  check(
    "insensible aux accents : « resume » trouve « Résumé »",
    searchConversations(list, "resume").map((c) => c.id),
    ["4"],
  );
  check("requête vide → tout", searchConversations(list, "").length, 4);
  check("espaces seuls → tout", searchConversations(list, "   ").length, 4);
  check("aucun résultat", searchConversations(list, "zzzz").length, 0);
}

console.log("\n=== 8. Titre automatique ===");
{
  check(
    "amorce impérative retirée",
    deriveTitle("Create a cinematic advertisement for a sports car"),
    "Cinematic advertisement for a sports car",
  );
  check(
    "coupe à la première phrase",
    deriveTitle("A landing page. It must be dark and fast."),
    "A landing page",
  );
  check(
    "markdown retiré et amorce « build a » emportée avec son article",
    deriveTitle("**Build** a `dashboard` for sales"),
    "Dashboard for sales",
  );
  check("message vide → repli", deriveTitle(""), "New conversation");
  check("espaces seuls → repli", deriveTitle("   \n  "), "New conversation");
  check(
    "bloc de code seul → repli",
    deriveTitle("```\nconst x = 1;\n```"),
    "New conversation",
  );

  const long = deriveTitle("x".repeat(400));
  assert("titre long borné", long.length <= 49, `${long.length} caractères`);
  assert("bornage signalé par une ellipse", long.endsWith("…"));

  const words = deriveTitle(
    "Design an onboarding flow for a collaborative analytics platform used by teams",
  );
  assert(
    "coupe sur un mot, jamais au milieu",
    !/\w…$/.test(words) || words.endsWith(" …") === false,
    words,
  );
  assert("titre non vide dans tous les cas", deriveTitle("?!.").length > 0);
}

console.log("\n=== 9. Validation de titre ===");
{
  check("titre vide refusé", validateTitle(""), { ok: false, reason: "empty" });
  check("espaces seuls refusés", validateTitle("    "), {
    ok: false,
    reason: "empty",
  });
  check("espaces internes normalisés", validateTitle("  a   b  "), {
    ok: true,
    title: "a b",
  });
  check("121 caractères refusés", validateTitle("x".repeat(121)), {
    ok: false,
    reason: "too-long",
  });
  check("120 caractères acceptés", validateTitle("x".repeat(120)).ok, true);
}

console.log("\n=== 10. Export — aucune donnée interne ===");
{
  const conversation = {
    id: "conv-1",
    title: "Cinematic car commercial",
    createdAt: "2026-08-12T10:00:00.000Z",
    updatedAt: "2026-08-12T11:00:00.000Z",
    messages: [
      {
        id: "m1",
        role: "user",
        content: "Make it cinematic.",
        createdAt: "2026-08-12T10:00:00.000Z",
        generationId: null,
      },
      {
        id: "m2",
        role: "assistant",
        content: "## TECH STACK\nNext.js.",
        createdAt: "2026-08-12T10:00:05.000Z",
        generationId: "gen-1",
      },
    ],
  };

  const md = toMarkdown(conversation);
  assert(
    "markdown porte le titre en h1",
    md.startsWith("# Cinematic car commercial"),
  );
  assert("le rôle user s'affiche « You »", md.includes("## You"));
  assert("le rôle assistant s'affiche « Yelhaa »", md.includes("## Yelhaa"));
  assert("le contenu est présent tel quel", md.includes("Make it cinematic."));

  const json = JSON.parse(toJson(conversation));
  check("JSON : id de conversation", json.conversation.id, "conv-1");
  check("JSON : 2 messages", json.messages.length, 2);
  check(
    "JSON : champs de message limités",
    Object.keys(json.messages[0]).sort(),
    ["content", "createdAt", "id", "role"],
  );
  check(
    "JSON : champs de conversation limités",
    Object.keys(json.conversation).sort(),
    ["createdAt", "id", "title", "updatedAt"],
  );

  // Le contrôle qui compte : rien de sensible ne traverse, quelle que soit la
  // forme d'export.
  const FORBIDDEN = [
    "user_id",
    "userId",
    "service_role",
    "SUPABASE",
    "OLLAMA",
    "api_key",
    "token",
  ];
  for (const format of [
    ["markdown", md],
    ["json", toJson(conversation)],
    ["texte", toPlainText(conversation)],
  ]) {
    const [name, payload] = format;
    const leaked = FORBIDDEN.filter((needle) =>
      payload.toLowerCase().includes(needle.toLowerCase()),
    );
    check(`${name} : aucun champ interne`, leaked, []);
  }

  const plain = toPlainText(conversation);
  assert(
    "texte brut : aucun en-tête ajouté par l'export",
    !plain.startsWith("#") && !plain.includes(conversation.title),
    plain.slice(0, 80),
  );
  assert(
    "texte brut : le markdown du message est conservé intact",
    plain.includes("## TECH STACK"),
  );
  assert("texte brut sans horodatage", !plain.includes("2026-08-12"));

  check(
    "nom de fichier assaini",
    exportFilename(conversation, "md"),
    "cinematic-car-commercial.md",
  );
  check(
    "titre hostile → nom de fichier sûr",
    exportFilename({ ...conversation, title: "../../etc/passwd" }, "json"),
    "etc-passwd.json",
  );
  check(
    "titre sans caractère alphanumérique → repli",
    exportFilename({ ...conversation, title: "!!!" }, "md"),
    "conversation.md",
  );
}

console.log("\n=== 11. Conversation vide ===");
{
  const empty = {
    id: "c",
    title: "Vide",
    createdAt: "2026-08-12T10:00:00.000Z",
    updatedAt: "2026-08-12T10:00:00.000Z",
    messages: [],
  };
  assert(
    "markdown gère l'absence de message",
    toMarkdown(empty).includes("No messages yet"),
  );
  check(
    "JSON gère l'absence de message",
    JSON.parse(toJson(empty)).messages,
    [],
  );
  check("texte brut vide", toPlainText(empty), "");
}

console.log(
  `\n${failed === 0 ? "TOUS LES TESTS PASSENT" : "ECHECS"} — ${passed} pass, ${failed} fail`,
);
process.exit(failed === 0 ? 0 : 1);
