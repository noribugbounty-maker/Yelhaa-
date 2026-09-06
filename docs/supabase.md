# Supabase

## Ce qui est en place

```
supabase/migrations/20260808090000_schema.sql     tables du §2 du build prompt
supabase/migrations/20260808090100_rls.sql        RLS + GRANT par colonne
supabase/migrations/20260808090200_triggers.sql   création du profil à l'inscription

lib/supabase/types.ts       types de la base, écrits à la main
lib/supabase/env.ts         lecture tolérante des variables
lib/supabase/client.ts      client navigateur
lib/supabase/server.ts      client serveur (Server Components, Actions, Route Handlers)
lib/supabase/middleware.ts  rafraîchissement de session
middleware.ts               protection de /workspace, /prompt, /account
```

## Appliquer les migrations

Avec la CLI Supabase, depuis la racine du projet :

```bash
supabase link --project-ref <ref-du-projet>
```

```bash
supabase db push
```

Sans la CLI, exécuter les trois fichiers **dans l'ordre de leur horodatage**
depuis le SQL Editor du tableau de bord.

Le trigger de `20260808090200_triggers.sql` porte sur `auth.users` : il exige
les droits du rôle `postgres`. La CLI et le SQL Editor les ont ; une
connexion applicative ne les a pas.

Les trois fichiers sont réexécutables sans effet de bord
(`if not exists`, `drop policy if exists`, `create or replace`).

## Le modèle d'autorisation — règle définitive

**Toute écriture sur les données de compte est réservée au `service_role`.
L'utilisateur ne modifie que son adresse e-mail.** Décision arrêtée, elle
remplace la formulation du §2 du build prompt.

Le §2 demandait que « chaque utilisateur lise et écrive ses propres lignes ».
Appliqué à la lettre, cela ouvrait deux trous :

| Table | Ce qu'une écriture client aurait permis |
|---|---|
| `usage_counters` | remettre son propre compteur de générations à zéro |
| `profiles.plan` | s'octroyer le plan Agency sans passer par Stripe |

Le §6 (« le plan n'est jamais mis à jour depuis le client — uniquement par
webhook ») et le §7 (« quotas vérifiés côté serveur uniquement ») priment.
Matrice appliquée :

| Table | `anon` | `authenticated` | `service_role` |
|---|---|---|---|
| `profiles` | — | `select` ses lignes, `update` de la seule colonne `email` | tout |
| `usage_counters` | — | `select` ses lignes | tout |
| `generations` | — | `select` ses lignes | tout |
| `prompt_templates` | `select` colonnes publiques si `is_active` — **pas** `body`, `variables`, `asset_paths` | idem | tout |
| `faq_articles` | `select` si `is_active` | `select` si `is_active` | tout |

La restriction de `profiles` à la colonne `email` passe par un
`grant update (email)` : une policy RLS ne distingue pas les colonnes.
Même mécanisme pour `prompt_templates.body` (`20260906120000_prompt_templates_hide_body.sql`) :
le catalogue public reste lisible, le corps du prompt ne l’est que via `service_role`.

Le `service_role` contourne RLS. Sa clé ne sort jamais du serveur.

## Routes protégées — pourquoi `/generate` en fait partie

Le §5 du build prompt liste `/workspace`, `/prompt` et `/account`. `/generate`
s'y ajoute, et c'est une décision arrêtée.

Le README §3.2 impose de vérifier l'authentification au moment du clic sur
GENERATE, et le §4bis fixe `?next=/generate` comme cible de retour. Deux
endroits pouvaient porter cet arbitrage :

- **un état client** rendu avec la page d'accueil — mais il est figé au moment
  du rendu et peut être périmé au clic (session expirée entre-temps, connexion
  ouverte dans un autre onglet) ;
- **le middleware**, qui statue à la requête, sur le jeton réellement validé
  par `getUser()`.

C'est le middleware qui tranche. Conséquence directe, et c'est celle que le
README exige : un utilisateur déjà connecté traverse `/generate` sans jamais
voir l'écran d'authentification, et un utilisateur déconnecté part sur
`/login?next=%2Fgenerate` avec son idée déjà mise de côté dans
`sessionStorage`.

## Fournisseurs OAuth

Google puis GitHub, dans cet ordre (build prompt §5, design §3.9). Les deux
s'activent dans le tableau de bord Supabase, **Authentication → Providers**.

**Un bouton n'apparaît que si le fournisseur est déclaré activé**, par
`NEXT_PUBLIC_OAUTH_PROVIDERS` (liste séparée par des virgules) :

```
NEXT_PUBLIC_OAUTH_PROVIDERS="google,github"
```

Variable absente ou vide, aucun bouton OAuth n'est rendu et seul le formulaire
e-mail est proposé. Ce n'est pas de la cosmétique : rendre un bouton vers un
fournisseur non configuré côté Supabase envoie l'utilisateur sur
`…supabase.co/auth/v1/authorize`, qui répond `Unsupported provider: provider is
not enabled` — du JSON brut, sur un domaine tiers, sans retour possible. Le
contrôle est refait dans l'action serveur avant toute redirection, donc une
valeur bricolée côté client ne suffit pas à ressusciter le lien mort.

URL de rappel à déclarer côté Supabase et côté fournisseur :

```
https://<ref-du-projet>.supabase.co/auth/v1/callback
```

Et dans **Authentication → URL Configuration**, ajouter aux *Redirect URLs* :

```
http://localhost:3000/auth/callback
https://<domaine-de-production>/auth/callback
```

Le code ne dépend d'aucun identifiant de fournisseur : tout passe par
Supabase. Aucune clé OAuth n'entre dans le dépôt.

**Logos des fournisseurs.** Ce sont des SVG **inline**, dans
`components/ui/provider-icons.tsx` : un `path` monochrome par marque, en
`currentColor`. Il n'y a donc aucun fichier à déposer — `public/providers/`
n'existe pas et ne doit pas être recréé. Deux raisons : une icône servie depuis
`public/` peut manquer et casser le bouton, et les icônes de marque de
`lucide-react` ont déjà changé de nom entre versions.

## Comportement sans configuration

`NEXT_PUBLIC_SUPABASE_URL` ou `NEXT_PUBLIC_SUPABASE_ANON_KEY` absente :

- `readSupabaseEnv()` renvoie `null` et journalise un avertissement une seule
  fois côté serveur ;
- les deux fabriques de clients renvoient `null` au lieu de lever ;
- le middleware laisse passer la requête sans session et redirige quand même
  les routes protégées vers `/login` ;
- l'application se construit, démarre et navigue normalement.

L'écran « service indisponible » qui consomme cet état arrive en phase 3, avec
les premières pages qui parlent réellement à Supabase.

## Ce qui reste ouvert

`lib/supabase/types.ts` est écrit à la main faute de projet distant à
interroger. Une fois le projet créé :

```bash
supabase gen types typescript --linked > lib/supabase/types.ts
```

Toute modification de schéma doit être répercutée dans ce fichier tant que la
génération n'est pas branchée.
