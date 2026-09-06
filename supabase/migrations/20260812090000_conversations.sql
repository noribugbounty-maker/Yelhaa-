-- Yelhaa — conversations et messages.
--
-- Deux tables seulement. Ce qui n'est pas ici a été écarté volontairement :
--
--   * **archivage** — le menu n'aurait gagné qu'une entrée. Tant qu'aucun
--     utilisateur ne demande à masquer sans supprimer, une colonne
--     `archived_at` serait un champ mort à maintenir dans chaque requête,
--     chaque policy et chaque test. Elle s'ajoutera en une migration le jour
--     où le besoin existe.
--   * **duplication** — se dérive entièrement des deux tables (un `insert
--     … select`). L'architecture ne l'empêche pas ; rien n'a besoin d'exister
--     en base pour la rendre possible plus tard.
--
-- `messages.user_id` est **dénormalisé** à dessein. La policy pourrait
-- remonter au propriétaire par une sous-requête sur `conversations`, mais
-- chaque lecture de message paierait alors une jointure, et une policy à
-- sous-requête est plus facile à casser lors d'une migration ultérieure.
-- Porter le propriétaire sur la ligne rend la règle lisible en une ligne et
-- indexable. La cohérence entre les deux colonnes est garantie par un trigger,
-- pas par la confiance accordée au client.

-- ---------------------------------------------------------------------------
-- conversations
-- ---------------------------------------------------------------------------
create table if not exists public.conversations (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles (id) on delete cascade,
  -- Le titre est contraint en base, pas seulement dans le formulaire : une
  -- écriture directe par PostgREST contourne toute validation côté client.
  title      text not null
             check (length(btrim(title)) between 1 and 120),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Le tri de la barre latérale est `updated_at desc` pour un utilisateur donné.
create index if not exists conversations_user_updated_idx
  on public.conversations (user_id, updated_at desc);

-- ---------------------------------------------------------------------------
-- messages
-- ---------------------------------------------------------------------------
create table if not exists public.messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null
                  references public.conversations (id) on delete cascade,
  user_id         uuid not null
                  references public.profiles (id) on delete cascade,
  role            text not null check (role in ('user', 'assistant')),
  content         text not null check (length(content) > 0),
  -- Lien facultatif vers la génération qui a produit ce message. `set null` :
  -- supprimer une génération ne doit pas effacer l'historique de discussion.
  generation_id   uuid references public.generations (id) on delete set null,
  created_at      timestamptz not null default now()
);

create index if not exists messages_conversation_created_idx
  on public.messages (conversation_id, created_at);

-- ---------------------------------------------------------------------------
-- Cohérence du propriétaire — jamais laissée au client
-- ---------------------------------------------------------------------------
--
-- `messages.user_id` est écrasé par le propriétaire réel de la conversation.
-- Un client qui poserait l'identifiant d'un tiers verrait sa valeur remplacée,
-- et un message ne peut donc pas être rattaché à quelqu'un d'autre.
create or replace function public.messages_set_owner()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  owner uuid;
begin
  select c.user_id into owner
  from public.conversations c
  where c.id = new.conversation_id;

  if owner is null then
    raise exception 'conversation introuvable';
  end if;

  new.user_id := owner;
  return new;
end;
$$;

drop trigger if exists messages_set_owner_trg on public.messages;
create trigger messages_set_owner_trg
  before insert or update of conversation_id on public.messages
  for each row execute function public.messages_set_owner();

-- ---------------------------------------------------------------------------
-- `updated_at` — remonté par toute activité de la conversation
-- ---------------------------------------------------------------------------
--
-- La barre latérale trie sur cette colonne : une conversation à laquelle on
-- vient d'écrire doit repasser dans « Today ». Le trigger la met à jour depuis
-- la base, ce qui la rend vraie même pour une écriture qui ne passe pas par
-- l'application.
create or replace function public.conversations_touch()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.conversations
     set updated_at = now()
   where id = new.conversation_id;
  return new;
end;
$$;

drop trigger if exists messages_touch_conversation_trg on public.messages;
create trigger messages_touch_conversation_trg
  after insert on public.messages
  for each row execute function public.conversations_touch();

-- Renommer met aussi la date à jour, sans quoi un renommage ferait
-- disparaître la conversation du haut de la liste.
create or replace function public.conversations_set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists conversations_updated_at_trg on public.conversations;
create trigger conversations_updated_at_trg
  before update on public.conversations
  for each row execute function public.conversations_set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS — même doctrine que le §2 : on ne lit et n'écrit que ses propres lignes
-- ---------------------------------------------------------------------------
alter table public.conversations enable row level security;
alter table public.messages      enable row level security;

revoke all on public.conversations from anon, authenticated;
grant select, insert, update, delete on public.conversations to authenticated;
grant all on public.conversations to service_role;

revoke all on public.messages from anon, authenticated;
grant select, insert, delete on public.messages to authenticated;
grant all on public.messages to service_role;

-- conversations ------------------------------------------------------------
drop policy if exists conversations_select_own on public.conversations;
create policy conversations_select_own
  on public.conversations for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists conversations_insert_own on public.conversations;
create policy conversations_insert_own
  on public.conversations for insert to authenticated
  with check ((select auth.uid()) = user_id);

-- `using` **et** `with check` : sans le second, un utilisateur pourrait
-- réassigner sa conversation à quelqu'un d'autre en modifiant `user_id`.
drop policy if exists conversations_update_own on public.conversations;
create policy conversations_update_own
  on public.conversations for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists conversations_delete_own on public.conversations;
create policy conversations_delete_own
  on public.conversations for delete to authenticated
  using ((select auth.uid()) = user_id);

-- messages -----------------------------------------------------------------
drop policy if exists messages_select_own on public.messages;
create policy messages_select_own
  on public.messages for select to authenticated
  using ((select auth.uid()) = user_id);

-- À l'insertion, `user_id` n'est pas encore fiable — le trigger le pose. La
-- policy porte donc sur la **conversation visée**, seul lien vérifiable à cet
-- instant : on ne peut écrire que dans une conversation qu'on possède.
drop policy if exists messages_insert_own on public.messages;
create policy messages_insert_own
  on public.messages for insert to authenticated
  with check (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and c.user_id = (select auth.uid())
    )
  );

drop policy if exists messages_delete_own on public.messages;
create policy messages_delete_own
  on public.messages for delete to authenticated
  using ((select auth.uid()) = user_id);

-- Aucune policy `update` sur `messages`, et aucun GRANT : un message envoyé
-- n'est pas modifiable. Réécrire l'historique d'une conversation en ferait un
-- journal auquel on ne peut plus se fier.
