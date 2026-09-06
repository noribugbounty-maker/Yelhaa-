# Moteur de génération

## Chaîne

`POST /api/generate` suit l'ordre du build prompt §4, et l'ordre compte.

| # | Étape | Fichier |
|---|---|---|
| 1 | Authentification (401 sinon) | `app/api/generate/route.ts` |
| 2 | Limitation de débit, 10/min/utilisateur (429) | `lib/rate-limit.ts` |
| 4 | Validation de l'idée, 10 à 2000 caractères (400) | `lib/ai/engine.ts` |
| 3 | Quota, lecture seule à ce stade (402) | `lib/quota.ts` |
| 5 | Appel #1 — classification, JSON strict | `lib/ai/prompts.ts` |
| 7 | Chemin d'assets, fonction pure | `lib/ai/asset-path.ts` |
| 6 | RAG sur `content/templates` puis classement | `lib/ai/rag.ts` |
| 8 | Appel #2 — injection | `lib/ai/prompts.ts` |
| 9 | Validation de sortie, une régénération | `lib/ai/validate.ts` |
| 10 | Persistance `generations`, puis décompte | `lib/quota.ts` |
| 11 | Réponse | `app/api/generate/route.ts` |

Deux écarts d'ordre, tous deux volontaires :

- **La validation de l'idée passe avant le quota.** Une idée de trois
  caractères n'a aucune raison de consommer une lecture de compteur, et elle ne
  déclenche aucun appel payant.
- **Le chemin d'assets est calculé avant la sélection.** Le troisième terme du
  score dépend des assets fournis ; c'est la même fonction pure appelée plus
  tôt, le résultat est identique.

## Le domaine : pill ou classifieur

Quand une pill de type de projet est sélectionnée sur la HOME, elle **impose**
le domaine. L'appel #1 reçoit un addendum qui lui dit de ne pas classifier et
de consacrer son effort à l'extraction et aux `art_direction_hints` ; le
domaine est ensuite réécrit depuis la pill côté serveur, sans faire confiance
au modèle. `generations.project_type_source` enregistre `'user'` ou
`'classifier'`.

Le prompt système du §4bis n'est jamais modifié : l'addendum est un second
message système, ajouté seulement quand la pill est là.

## Score de sélection

```
score = recouvrement(tags, art_direction_hints) × 3
      + correspondance(art_direction, hints)    × 5
      + adéquation(asset_paths, chemin retenu)  × 2
```

Départage déterministe par `slug` : deux exécutions sur la même entrée
retiennent toujours le même template.

## Quota

`checkAndConsumeGeneration()` renvoie l'état **et** un `consume()`. Le compteur
n'est incrémenté que par cet appel, après une validation de sortie réussie et
après la persistance. Sur tout échec — classification illisible, sortie rejetée
deux fois, insertion impossible — `consume()` n'est jamais atteint.

L'incrément passe par la fonction Postgres `consume_generation`, un seul
`insert … on conflict do update` : deux générations parallèles ne peuvent pas
écrire la même valeur.

## Banc d'essai

Le moteur s'exécute hors HTTP, sans auth, sans base, sans quota. Le catalogue
est lu directement dans `content/templates/`.

```bash
npm run engine:try -- --stub
```

Aucune requête réseau. Vérifie la sélection, le chemin d'assets, les quatre
motifs de rejet, la régénération unique, l'échec après second rejet et
l'imposition du domaine par la pill.

```bash
npm run engine:try
```

Trois idées réelles, une par domaine, avec de vrais appels à OpenAI.
Imprime la classification, le template retenu et son score, les tentatives
de validation, les jetons consommés, les durées et le prompt produit en
entier. Exige `OPENAI_API_KEY` et `OPENAI_MODEL` dans `.env.local`.

```bash
npm run bench:models
```

Rejoue un court corpus sur un ou plusieurs modèles d'injection
(`BENCH_MODELS="<model-a>,<model-b>"`) et compare taux de régénération,
longueur de sortie, blocs obligatoires présents et stabilité de la
sélection de template. C'est la mesure à refaire avant de toucher à
`OPENAI_MAX_OUTPUT_TOKENS`.

```bash
npm run test:ai-models
```

Sans réseau. Vérifie qu'un seul `OPENAI_MODEL` alimente classification,
injection et chat, et que les overrides d'étape restent optionnels.

## Chaîne produit

```
idée → gpt-5-nano (classification)
     → RAG lexical sur content/templates
     → injection des faits + demande spécifique
     → prompt validé
     → chat mono-IA (/chat/[id])
```

Le chat de suivi (`lib/ai/chat.ts`) réutilise le même client OpenAI. Il ne
consomme pas de quota de génération. `YELHAA_QWEN_MODEL` et Ollama ne font
plus partie du moteur.

## Seed du catalogue

```bash
npm run seed:templates:dry
```

Analyse les quatre fichiers et imprime le rapport de contrôle sans rien écrire.
Aucune variable d'environnement nécessaire.

```bash
npm run seed:templates
```

Idem, puis `upsert` sur `slug` et relecture en base. Exige
`NEXT_PUBLIC_SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY`.
