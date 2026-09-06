-- Yelhaa — historique exploitable des générations.
--
-- La table `generations` existe depuis la migration initiale et porte déjà tout
-- ce qu'un historique doit montrer : `idea`, `output`, `domain`, `template_id`,
-- `tokens_in/out`, `created_at`, plus un index `(user_id, created_at desc)`.
-- Rien n'est recréé ici.
--
-- Il manquait deux choses, l'une mesurée et l'autre structurelle.
--
-- ## 1. La suppression était impossible
--
-- `20260808090100_rls.sql` n'accorde que `select` à `authenticated` sur
-- `generations`. Vérifié sur la base réelle : une suppression par le
-- propriétaire lui-même échoue en `42501 permission denied for table
-- generations`. Un historique dont on ne peut rien retirer n'est pas un
-- historique, c'est une archive subie.
--
-- La policy porte `using ((select auth.uid()) = user_id)` : elle ne dépend
-- d'aucune vérification écrite dans l'application, donc aucun oubli côté
-- TypeScript ne peut l'ouvrir.
--
-- ## 2. Les favoris
--
-- Une colonne booléenne plutôt qu'une table de jointure. Un favori est un
-- attribut de la génération, pas une relation : une table séparée imposerait
-- une jointure à chaque lecture de l'historique pour n'y stocker qu'un bit.
-- Elle se transformerait en table le jour où un favori porterait ses propres
-- données — un classement, une note — ce qui n'est pas le cas.
--
-- L'écriture est ouverte **uniquement sur cette colonne**, par `grant update
-- (is_favorite)`. Une policy RLS ne sait pas distinguer les colonnes : sans ce
-- GRANT restreint, autoriser le favori autoriserait aussi la réécriture de
-- `output` et de `tokens_*`. C'est la même doctrine que `profiles`, où seul
-- `email` est modifiable par le client.

alter table public.generations
  add column if not exists is_favorite boolean not null default false;

-- Les favoris se lisent filtrés, et ils sont rares : l'index partiel ne couvre
-- que les lignes concernées plutôt que toute la table.
create index if not exists generations_user_favorite_idx
  on public.generations (user_id, created_at desc)
  where is_favorite;

-- ---------------------------------------------------------------------------
-- Suppression par le propriétaire
-- ---------------------------------------------------------------------------
grant delete on public.generations to authenticated;

drop policy if exists generations_delete_own on public.generations;
create policy generations_delete_own
  on public.generations for delete to authenticated
  using ((select auth.uid()) = user_id);

-- ---------------------------------------------------------------------------
-- Bascule du favori — colonne unique, jamais le contenu
-- ---------------------------------------------------------------------------
grant update (is_favorite) on public.generations to authenticated;

-- `using` **et** `with check` sur `user_id` : sans le second, une mise à jour
-- pourrait réassigner la ligne à quelqu'un d'autre au passage.
drop policy if exists generations_update_own on public.generations;
create policy generations_update_own
  on public.generations for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
