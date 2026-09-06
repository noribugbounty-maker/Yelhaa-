-- Yelhaa — fichiers joints à une génération.
--
-- ## Pourquoi aucun bucket Storage
--
-- Audit préalable : `storage.listBuckets()` rend `[]`. Rien n'est configuré,
-- donc rien n'est réutilisé — ce n'est pas une architecture existante à
-- prolonger, c'est un choix à faire.
--
-- Le pipeline ne consomme jamais les octets d'un fichier. L'appel #1 reçoit du
-- texte, l'appel #2 reçoit du texte ; le modèle ne voit pas de binaire, et
-- aucun écran ne renvoie le fichier d'origine. Conserver les octets ajouterait
-- un bucket, des policies de stockage, des URL signées, une tâche de purge et
-- deux surfaces d'attaque — exécution de fichier et traversée de chemin — pour
-- garder une donnée que personne ne relit.
--
-- Le texte est donc extrait **à l'envoi**, et seul le texte est conservé. Les
-- conséquences sont directes : aucun chemin n'existe, donc aucune traversée
-- n'est possible ; aucun fichier n'est écrit, donc aucun n'est exécutable ;
-- aucun identifiant Storage n'atteint le navigateur, puisqu'aucun n'est émis.
--
-- Un type non textuel n'est pas stocké à moitié : il est refusé à l'envoi avec
-- la liste des types acceptés. Le jour où un modèle de vision entre dans le
-- produit, ce sera une migration qui ajoute un bucket, pas un rattrapage.
--
-- ## Le lien vers la génération
--
-- Un fichier est envoyé **avant** que la génération existe. `generation_id`
-- est donc nullable et rempli après coup. `on delete set null` plutôt que
-- `cascade` : supprimer une génération de l'historique ne doit pas effacer le
-- contexte que l'utilisateur avait fourni.

create table if not exists public.generation_files (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references public.profiles (id) on delete cascade,
  generation_id  uuid references public.generations (id) on delete set null,
  filename       text not null check (length(btrim(filename)) between 1 and 255),
  mime_type      text not null check (length(btrim(mime_type)) between 1 and 255),
  byte_size      integer not null check (byte_size >= 0),
  -- Texte extrait, déjà borné par le budget côté application.
  extracted_text text not null,
  -- Vrai quand le budget a coupé : l'écran doit pouvoir le dire honnêtement.
  truncated      boolean not null default false,
  created_at     timestamptz not null default now()
);

create index if not exists generation_files_user_idx
  on public.generation_files (user_id, created_at desc);

create index if not exists generation_files_generation_idx
  on public.generation_files (generation_id)
  where generation_id is not null;

alter table public.generation_files enable row level security;

revoke all on public.generation_files from anon, authenticated;
grant select, insert, delete on public.generation_files to authenticated;
grant all on public.generation_files to service_role;

-- L'attachement d'un fichier à une génération est la **seule** écriture
-- autorisée après l'envoi. Une policy RLS ne distingue pas les colonnes : sans
-- ce GRANT restreint, permettre l'attachement permettrait aussi de réécrire
-- `extracted_text`, c'est-à-dire d'injecter du contexte après validation.
grant update (generation_id) on public.generation_files to authenticated;

drop policy if exists generation_files_select_own on public.generation_files;
create policy generation_files_select_own
  on public.generation_files for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists generation_files_insert_own on public.generation_files;
create policy generation_files_insert_own
  on public.generation_files for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists generation_files_update_own on public.generation_files;
create policy generation_files_update_own
  on public.generation_files for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists generation_files_delete_own on public.generation_files;
create policy generation_files_delete_own
  on public.generation_files for delete to authenticated
  using ((select auth.uid()) = user_id);

-- Le propriétaire est réimposé par la base : un `user_id` falsifié dans la
-- requête est écrasé plutôt que refusé, ce qui rend l'attaque sans effet sans
-- rien casser pour un client honnête.
--
-- `messages_set_owner` dérive le propriétaire de la conversation parente ;
-- `generation_files` n'a pas de parent au moment de l'envoi, donc la source
-- est la session. **La réécriture n'a donc lieu que s'il y a une session** :
-- écraser inconditionnellement poserait `null` pour `service_role` et pour
-- toute migration de données, et la colonne est `not null`. Écrit autrement,
-- le premier banc PGlite échouait sur sa propre insertion de départ.
create or replace function public.generation_files_set_owner()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  claimed uuid := auth.uid();
begin
  if claimed is not null then
    new.user_id := claimed;
  end if;
  return new;
end;
$$;

drop trigger if exists generation_files_set_owner on public.generation_files;
create trigger generation_files_set_owner
  before insert on public.generation_files
  for each row execute function public.generation_files_set_owner();
