# Architecture — Yelhaa

Carte du dépôt **tel qu’il tourne aujourd’hui**. Next.js 15 (App Router) + Supabase + Stripe + OpenAI.

`README.txt` est un cahier des charges historique (Qwen / Ollama). Il ne décrit plus le runtime.

## Produit

L’utilisateur décrit une idée → `/api/generate` classe, choisit un template (RAG sur `content/templates`) et injecte via OpenAI → `/prompt/[id]` → optionnellement `/workspace/[id]` ou `/chat`.

Une unité de quota : **une génération**.

## Arborescence

```
app/
  (site)/          chrome marketing — /, /build, /pricing, /faq, /contact, /account, /legal, checkout
  (auth)/          /login, /signup + actions.ts
  (chat)/          /chat, /chat/[id] + actions.ts (session requise)
  generate/        runner de progression (pas de chrome site)
  prompt/[id]      résultat d’une génération
  workspace/[id]   colonnes multi-rôles
  api/             generate, files, templates, contact, stripe, me/quota, health, account/delete
  auth/callback    retour OAuth / confirmation e-mail
lib/
  ai/              client OpenAI, moteur, RAG, prompts, chat
  auth/            admin, next-path, site-origin, messages
  conversations/   requêtes chat
  files/           ingestion texte
  http/            IP cliente (CF-Connecting-IP)
  stripe/          checkout + webhook
  supabase/        clients session / service_role
  templates/       parse + palette
  config.ts        PLANS, ROUTES — source des prix
components/        landing, build, chat, site, auth, workspace, prompt, ui
content/           faq.ts, templates/*.md (RAG + seed)
supabase/migrations/
scripts/           seed, test:security, test:ai-models, stripe:check
docs/              supabase, cloudflare, engine, typo
```

Les groupes de routes `(site)` / `(chat)` / `(auth)` portent des layouts différents. Ne pas les fusionner.

## Qui écrit quoi

| Donnée | Client session (RLS) | `service_role` |
|---|---|---|
| `profiles.plan`, quotas | lecture seule | webhook / RPC |
| `generations`, `messages` | lecture de ses lignes | insertion serveur |
| `prompt_templates.body` | **interdit** | lecture serveur (palette, injection) |
| FAQ publique | lecture des lignes actives | seed |

L’identité vient de `getUser()`, jamais d’un champ de requête.

## IA

`lib/ai/client.ts` n’expose qu’OpenAI (`OPENAI_MODEL`). `ai-training/` est un pipeline hors-ligne, **non branché** à l’app.

## Sécurité à ne pas casser

- `sanitizeNextPath` sur tout `?next=`
- middleware `getUser()` sur `/chat`, `/generate`, `/prompt`, `/workspace`, `/account`
- webhook Stripe : signature + table `stripe_events`
- `NEXT_PUBLIC_SITE_URL` obligatoire en production (pas de repli `Host`)
- `/api/health` : détail seulement en dev (ou `HEALTH_DETAIL=1`)

## Après `git pull`

Appliquer les migrations (`supabase db push`), dont `20260906120000_prompt_templates_hide_body.sql`.
