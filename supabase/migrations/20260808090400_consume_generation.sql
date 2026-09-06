-- Yelhaa — consommation atomique d'une génération (build prompt §7).
--
-- « Une génération échouée ne consomme jamais de quota. Le compteur est
--   incrémenté après la validation de sortie réussie, jamais avant l'appel. »
--
-- L'incrément passe par une seule instruction : deux générations lancées en
-- parallèle ne peuvent pas lire le même compteur et écrire la même valeur.
--
-- `period_start` est toujours le premier jour du mois courant : la remise à
-- zéro du 1er est donc implicite, sans tâche planifiée. Aucun report — la
-- ligne du mois précédent n'est jamais consultée.

create or replace function public.consume_generation(p_user_id uuid)
returns int
language sql
security definer
set search_path = ''
as $$
  insert into public.usage_counters (user_id, period_start, generations_used)
  values (p_user_id, date_trunc('month', now() at time zone 'utc')::date, 1)
  on conflict (user_id, period_start)
  do update set generations_used = public.usage_counters.generations_used + 1
  returning generations_used;
$$;

revoke all on function public.consume_generation(uuid) from public, anon, authenticated;
grant execute on function public.consume_generation(uuid) to service_role;
