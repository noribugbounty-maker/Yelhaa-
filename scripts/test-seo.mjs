/**
 * Banc d'essai SEO — **HTML réellement servi**, pas le code source.
 *
 *   BASE_URL=http://localhost:3000 node scripts/test-seo.mjs
 *
 * Il vérifie ce que Google verrait : balises rendues, canoniques absolues,
 * sitemap, robots, redirections des anciens slugs, et absence de duplication
 * entre l'index de FAQ et les pages dédiées.
 *
 * Il exige un serveur en marche. `npm run build && npm run start` d'abord.
 */
const BASE = (process.env["BASE_URL"] ?? "http://localhost:3000").replace(
  /\/+$/,
  "",
);

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

const get = async (path) => {
  const res = await fetch(`${BASE}${path}`, { redirect: "manual" });
  return {
    status: res.status,
    location: res.headers.get("location"),
    body: await res.text(),
  };
};

const meta = (html, name) =>
  html.match(new RegExp(`<meta name="${name}" content="([^"]*)"`))?.[1] ?? null;
const prop = (html, property) =>
  html.match(
    new RegExp(`<meta property="${property}" content="([^"]*)"`),
  )?.[1] ?? null;
const canonical = (html) =>
  html.match(/<link rel="canonical" href="([^"]*)"/)?.[1] ?? null;
const title = (html) => html.match(/<title>([^<]*)<\/title>/)?.[1] ?? null;

const PAGES = [
  "/",
  "/pricing",
  "/faq",
  "/contact",
  "/legal/privacy",
  "/legal/terms",
];

console.log("=== 1. Canonique absolue et unique sur chaque page indexable ===");
const canonicals = new Map();
for (const path of PAGES) {
  const { body } = await get(path);
  const c = canonical(body);
  assert(`${path} porte une canonique`, c !== null, "aucune balise canonical");
  if (c) {
    assert(
      `${path} canonique absolue`,
      /^https?:\/\//.test(c),
      `obtenu « ${c} »`,
    );
    assert(
      `${path} canonique sans barre finale parasite`,
      path === "/" || !c.endsWith("/"),
      `obtenu « ${c} »`,
    );
    canonicals.set(path, c);
  }
}
assert(
  "aucune canonique dupliquée entre pages",
  new Set(canonicals.values()).size === canonicals.size,
  `${canonicals.size} pages pour ${new Set(canonicals.values()).size} canoniques distinctes`,
);

console.log("\n=== 2. Titre et description propres à chaque page ===");
const titles = new Map();
const descriptions = new Map();
for (const path of PAGES) {
  const { body } = await get(path);
  const t = title(body);
  const d = meta(body, "description");
  assert(`${path} a un titre`, Boolean(t));
  assert(`${path} a une description`, Boolean(d));
  if (d) {
    assert(
      `${path} description dans une longueur utile (50-165)`,
      d.length >= 50 && d.length <= 165,
      `${d.length} caractères`,
    );
  }
  titles.set(path, t);
  descriptions.set(path, d);
}
assert(
  "aucun titre dupliqué",
  new Set(titles.values()).size === titles.size,
  `${titles.size} pages pour ${new Set(titles.values()).size} titres distincts`,
);
assert(
  "aucune description dupliquée",
  new Set(descriptions.values()).size === descriptions.size,
  `${descriptions.size} pages pour ${new Set(descriptions.values()).size} descriptions distinctes`,
);

console.log("\n=== 3. Open Graph ===");
{
  const { body } = await get("/");
  for (const p of [
    "og:title",
    "og:description",
    "og:url",
    "og:type",
    "og:site_name",
  ]) {
    assert(`${p} présent`, prop(body, p) !== null);
  }
  assert("og:url absolue", /^https?:\/\//.test(prop(body, "og:url") ?? ""));
}

console.log("\n=== 4. Langue déclarée ===");
for (const path of ["/", "/faq", "/pricing"]) {
  const { body } = await get(path);
  check(`${path} lang=en`, body.match(/<html[^>]*lang="([^"]*)"/)?.[1], "en");
}

console.log("\n=== 5. robots.txt ===");
{
  const { status, body } = await get("/robots.txt");
  check("robots.txt répond 200", status, 200);
  assert("contient une directive User-Agent", /user-agent:/i.test(body));
  const placeholder =
    /disallow:\s*\/\s*$/im.test(body) && !/sitemap:/i.test(body);
  if (placeholder) {
    console.log(
      "        (domaine non renseigné : crawl fermé, comportement attendu)",
    );
    assert("crawl fermé tant que le domaine est absent", true);
  } else {
    assert("référence le sitemap", /sitemap:\s*https?:\/\//i.test(body));
    assert(
      "les pages publiques ne sont pas bloquées",
      !/^disallow:\s*\/$/im.test(body),
    );
    assert(
      "les assets ne sont pas bloqués",
      !/disallow:\s*\/_next/i.test(body),
    );
  }
}

console.log("\n=== 5bis. robots.txt — la branche du jour du lancement ===");
{
  /*
   * La section précédente ne peut tester que l'état courant. Tant que le
   * domaine n'est pas renseigné, la branche qui ouvrira réellement le crawl
   * n'est jamais exécutée — c'est-à-dire que le seul chemin qui comptera le
   * jour de la mise en ligne était le seul jamais vérifié.
   *
   * `SITE.url` est figée à l'import du module de configuration ; le module est
   * donc réimporté avec une adresse de cache différente après avoir posé la
   * variable, ce qui force une réévaluation.
   */
  const previous = process.env["NEXT_PUBLIC_SITE_URL"];
  process.env["NEXT_PUBLIC_SITE_URL"] = "https://yelhaa.example";
  try {
    const { default: robots } = await import(
      `../app/robots.ts?domaine=${Date.now()}`
    );
    const result = robots();
    const rule = Array.isArray(result.rules) ? result.rules[0] : result.rules;

    check("le crawl s'ouvre", rule.allow, "/");
    assert(
      "plus aucun blocage global",
      rule.disallow !== "/" &&
        (!Array.isArray(rule.disallow) || !rule.disallow.includes("/")),
      JSON.stringify(rule.disallow),
    );
    assert(
      "le sitemap est déclaré en absolu",
      typeof result.sitemap === "string" &&
        result.sitemap === "https://yelhaa.example/sitemap.xml",
      String(result.sitemap),
    );
    assert(
      "les routes privées restent fermées",
      Array.isArray(rule.disallow) && rule.disallow.length > 0,
      JSON.stringify(rule.disallow),
    );
    for (const privatePath of ["/api/", "/account", "/generate"]) {
      assert(
        `« ${privatePath} » est bloqué`,
        rule.disallow.some((entry) => entry.startsWith(privatePath)),
        JSON.stringify(rule.disallow),
      );
    }
    assert(
      "les assets restent crawlables",
      !rule.disallow.some((entry) => entry.includes("_next")),
      JSON.stringify(rule.disallow),
    );
  } finally {
    if (previous === undefined) delete process.env["NEXT_PUBLIC_SITE_URL"];
    else process.env["NEXT_PUBLIC_SITE_URL"] = previous;
  }
}

console.log("\n=== 5ter. Aperçu social et icône ===");
{
  /*
   * `twitter:card` vaut `summary_large_image` sur toutes les pages : la carte
   * **promet** une grande image. Sans `og:image`, X et LinkedIn rendent une
   * carte texte nue, et le type de carte devient une annonce non tenue.
   */
  const og = await get("/opengraph-image");
  check("l'aperçu social répond 200", og.status, 200);

  const home = await get("/");
  assert(
    "og:image est déclarée",
    /property="og:image"/.test(home.body),
    "aucune balise og:image",
  );
  assert(
    "ses dimensions sont déclarées",
    /property="og:image:width" content="1200"/.test(home.body) &&
      /property="og:image:height" content="630"/.test(home.body),
    "dimensions absentes — le rendu de la carte est alors incertain",
  );
  assert(
    "elle porte un texte alternatif",
    /property="og:image:alt" content="[^"]{10,}"/.test(home.body),
  );
  assert(
    "twitter:image suit",
    /name="twitter:image"/.test(home.body),
  );
  assert(
    "la carte large est donc tenue",
    /name="twitter:card" content="summary_large_image"/.test(home.body) &&
      /name="twitter:image"/.test(home.body),
    "carte large annoncée sans image",
  );

  const icon = await get("/icon.svg");
  check("l'icône répond 200", icon.status, 200);
  assert(
    "elle est déclarée dans le document",
    /<link[^>]*rel="icon"/.test(home.body),
    "aucun lien d'icône",
  );

  // L'aperçu doit être hérité par les autres pages indexables, pas seulement
  // par l'accueil.
  for (const path of ["/pricing", "/contact"]) {
    const page = await get(path);
    assert(
      `${path} hérite de l'aperçu social`,
      /property="og:image"/.test(page.body),
    );
  }
}

console.log("\n=== 6. sitemap.xml ===");
const sitemap = await get("/sitemap.xml");
check("sitemap.xml répond 200", sitemap.status, 200);
const urls = [...sitemap.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  (m) => m[1],
);
assert("contient des URL", urls.length > 0, `${urls.length} entrées`);
assert(
  "toutes absolues",
  urls.every((u) => /^https?:\/\//.test(u)),
);
assert("aucun doublon", new Set(urls).size === urls.length);
for (const forbidden of [
  "/api/",
  "/account",
  "/generate",
  "/workspace/",
  "/prompt/",
  "/checkout/",
]) {
  assert(
    `aucune route privée « ${forbidden} »`,
    !urls.some((u) => u.includes(forbidden)),
    urls.filter((u) => u.includes(forbidden)).join(", "),
  );
}
assert(
  "les 12 articles de FAQ sont listés",
  urls.filter((u) => /\/faq\//.test(u)).length === 12,
  `${urls.filter((u) => /\/faq\//.test(u)).length} trouvés`,
);

console.log("\n=== 7. Anciens slugs FAQ → 301/308 direct, sans chaîne ===");
{
  const { FAQ_SLUG_REDIRECTS } = await import("../content/faq.ts");
  for (const [oldSlug, newSlug] of Object.entries(FAQ_SLUG_REDIRECTS)) {
    const first = await get(`/faq/${oldSlug}`);
    const permanent = first.status === 301 || first.status === 308;
    assert(
      `/faq/${oldSlug} redirige en permanence`,
      permanent,
      `statut ${first.status}`,
    );
    assert(
      `→ /faq/${newSlug} directement`,
      (first.location ?? "").endsWith(`/faq/${newSlug}`),
      `vers ${first.location}`,
    );
    const target = await get(`/faq/${newSlug}`);
    assert(
      `/faq/${newSlug} répond 200 (aucune chaîne)`,
      target.status === 200,
      `statut ${target.status}`,
    );
  }
}

console.log("\n=== 8. Duplication : l'index ne republie plus les réponses ===");
{
  const index = await get("/faq");
  const article = await get("/faq/what-is-yelhaa");
  const strip = (h) =>
    h
      .replace(/<script[\s\S]*?<\/script>/g, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  const answer =
    strip(article.body).match(/Yelhaa turns an idea[^.]*\./)?.[0] ?? null;
  assert("la réponse existe sur la page dédiée", answer !== null);
  if (answer) {
    assert(
      "la réponse complète est absente de l'index",
      !strip(index.body).includes(answer),
      "le même paragraphe apparaît sur les deux pages",
    );
  }
  assert(
    "l'index lie les 12 articles",
    [
      ...new Set(
        [...index.body.matchAll(/href="\/faq\/([a-z0-9-]+)"/g)].map(
          (m) => m[1],
        ),
      ),
    ].length === 12,
  );
}

console.log("\n=== 9. Données structurées ===");
{
  const home = await get("/");
  const pricing = await get("/pricing");
  const article = await get("/faq/plans-and-quotas");
  const types = (html) =>
    [...html.matchAll(/"@type":"([^"]+)"/g)].map((m) => m[1]);
  assert("HOME : Organization", types(home.body).includes("Organization"));
  assert("HOME : WebSite", types(home.body).includes("WebSite"));
  assert(
    "PRICING : SoftwareApplication",
    types(pricing.body).includes("SoftwareApplication"),
  );
  assert("PRICING : Offer", types(pricing.body).includes("Offer"));
  assert(
    "ARTICLE : BreadcrumbList",
    types(article.body).includes("BreadcrumbList"),
  );
  assert(
    "aucun FAQPage (rich result retiré par Google le 7 mai 2026)",
    !types(home.body).concat(types(article.body)).includes("FAQPage"),
  );
}

console.log("\n=== 10. Routes privées hors index ===");
for (const path of ["/account", "/generate", "/workspace/x", "/prompt/x"]) {
  const { status } = await get(path);
  assert(
    `${path} n'est pas servi publiquement`,
    status === 307 || status === 308,
    `statut ${status}`,
  );
}

console.log(
  `\n${failed === 0 ? "TOUS LES TESTS PASSENT" : "ECHECS"} — ${passed} pass, ${failed} fail`,
);
process.exit(failed === 0 ? 0 : 1);
