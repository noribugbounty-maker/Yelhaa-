-- Yelhaa — création automatique du profil à l'inscription (build prompt §2, §5).
--
-- « À la première connexion, un trigger Postgres crée la ligne `profiles` avec
--   plan = 'free'. »
--
-- `security definer` + `set search_path = ''` : la fonction s'exécute avec les
-- droits du propriétaire et ne peut pas être détournée par un search_path
-- manipulé. Tous les objets sont donc qualifiés par leur schéma.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;

  return new;
end;
$$;

revoke all on function public.handle_new_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Maintien de l'e-mail du profil quand l'utilisateur change le sien.
create or replace function public.handle_user_email_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profiles
     set email = new.email
   where id = new.id;

  return new;
end;
$$;

revoke all on function public.handle_user_email_change() from public, anon, authenticated;

drop trigger if exists on_auth_user_email_updated on auth.users;
create trigger on_auth_user_email_updated
  after update of email on auth.users
  for each row
  when (old.email is distinct from new.email)
  execute function public.handle_user_email_change();
