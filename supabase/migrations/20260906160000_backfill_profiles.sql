-- Yelhaa — rattrapage des profils manquants.
--
-- `generations.user_id` et `usage_counters.user_id` référencent
-- `public.profiles(id)`, calé sur `auth.users.id`. Le trigger
-- `handle_new_user` crée cette ligne à l'inscription, mais les comptes
-- Auth nés avant son application — ou hors de son chemin — n'ont pas de
-- profil. L'INSERT dans `generations` échoue alors avec
-- `generations_user_id_fkey` après que le moteur a déjà tourné.
--
-- On ne touche pas à la FK. On crée les lignes manquantes avec le même
-- identifiant que `auth.users`, et on laisse le trigger existant pour
-- les inscriptions suivantes.

insert into public.profiles (id, email)
select id, email
  from auth.users
on conflict (id) do nothing;
