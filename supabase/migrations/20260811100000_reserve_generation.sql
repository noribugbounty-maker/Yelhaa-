-- Yelhaa — réservation atomique du quota de génération (build prompt §7).
--
-- Corrige une course démontrée : `checkAndConsumeGeneration` **lisait** le
-- compteur, autorisait, appelait le modèle, puis incrémentait. Deux requêtes
-- simultanées lisaient la même valeur, passaient toutes les deux et
-- consommaient deux appels payants pour une seule unité de quota. Sur un plan
-- gratuit à 3 générations par mois, une rafale au plafond du rate limit (10)
-- en obtenait jusqu'à 10.
--
-- Le nouveau flux inverse l'ordre : on **réserve d'abord**, on appelle le
-- modèle ensuite, et on rembourse si la génération échoue.
--
--   réservation atomique → quota disponible ? → oui : modèle → succès : garder
--                                             → non : refus, aucun appel
--                                                      échec : remboursement
--
-- La règle du §7 « une génération échouée ne consomme jamais de quota » est
-- préservée : elle passe du « on n'incrémente qu'après » au « on rembourse si
-- ça échoue ». Le résultat observable pour l'utilisateur est identique ; ce qui
-- change, c'est qu'il n'existe plus de fenêtre où deux requêtes se croisent.
--
-- `consume_generation` est conservée : aucune donnée n'est touchée et une
-- migration qui supprime une fonction encore référencée par un déploiement en
-- cours casserait le service pendant la bascule.

-- ---------------------------------------------------------------------------
-- Réservation
-- ---------------------------------------------------------------------------
--
-- Tout tient dans **une seule instruction**. Le `where` du `do update` est le
-- cœur du correctif : Postgres verrouille la ligne en conflit avant d'évaluer
-- la condition, donc deux transactions concurrentes s'exécutent en série et la
-- seconde voit la valeur écrite par la première. Quand la limite est atteinte,
-- l'instruction ne met à jour aucune ligne et le `returning` ne ramène rien —
-- la fonction renvoie `null`, et l'appelant n'appelle jamais le modèle.
--
-- **La période est renvoyée à l'appelant**, et ce n'est pas cosmétique : le
-- remboursement doit viser la ligne effectivement incrémentée. Une réservation
-- prise le 31 à 23h59 et remboursée le 1er à 00h01 recalculerait sinon un mois
-- différent, laissant l'unité consommée sur le mois écoulé et en créditant une
-- au mois suivant. La réservation transporte donc sa propre identité de
-- période.
create or replace function public.reserve_generation(
  p_user_id uuid,
  p_limit int
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_period date := date_trunc('month', now() at time zone 'utc')::date;
  v_used int;
begin
  -- Garde défensive : une limite absente ou nulle ne doit jamais laisser
  -- passer la branche `insert`, qui écrit 1 sans condition.
  if p_limit is null or p_limit < 1 then
    return null;
  end if;

  insert into public.usage_counters (user_id, period_start, generations_used)
  values (p_user_id, v_period, 1)
  on conflict (user_id, period_start)
  do update set generations_used = public.usage_counters.generations_used + 1
    where public.usage_counters.generations_used < p_limit
  returning generations_used into v_used;

  -- `null` quand le `do update` n'a mis à jour aucune ligne : quota atteint.
  if v_used is null then
    return null;
  end if;

  return jsonb_build_object('used', v_used, 'period', v_period);
end;
$$;

-- ---------------------------------------------------------------------------
-- Remboursement
-- ---------------------------------------------------------------------------
--
-- Rend une unité réservée quand la génération n'aboutit pas.
--
-- `p_period_start` vient de la réservation, jamais de `now()` : c'est ce qui
-- rend le remboursement correct à cheval sur un changement de mois.
--
-- Deux garde-fous contre le quota négatif et la réservation fantôme :
--   - `generations_used > 0` dans le `where` : un remboursement de trop ne
--     met à jour aucune ligne et renvoie `null` plutôt que de descendre sous
--     zéro ;
--   - `greatest(0, ...)` : même si la ligne changeait entre-temps, la valeur
--     écrite ne peut pas être négative.
--
-- Le `where` porte aussi `user_id` : un remboursement ne peut pas viser la
-- ligne d'un autre utilisateur, même si l'identifiant était forgé.
--
-- L'unicité du remboursement par réservation est portée côté appelant, par un
-- règlement à usage unique — voir `lib/quota.ts`.
create or replace function public.refund_generation(
  p_user_id uuid,
  p_period_start date
)
returns int
language sql
security definer
set search_path = ''
as $$
  update public.usage_counters
     set generations_used = greatest(0, generations_used - 1)
   where user_id = p_user_id
     and period_start = p_period_start
     and generations_used > 0
  returning generations_used;
$$;

revoke all on function public.reserve_generation(uuid, int)
  from public, anon, authenticated;
grant execute on function public.reserve_generation(uuid, int) to service_role;

revoke all on function public.refund_generation(uuid, date)
  from public, anon, authenticated;
grant execute on function public.refund_generation(uuid, date) to service_role;
