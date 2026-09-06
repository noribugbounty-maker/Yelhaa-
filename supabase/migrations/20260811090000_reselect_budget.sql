-- Yelhaa — budget de re-sélection de template (renouveau §5.5 et §7.2).
--
-- La re-sélection **ne consomme pas de génération** : c'est le même travail,
-- l'utilisateur corrige un choix que le moteur a fait pour lui. Cette règle
-- métier ne bouge pas.
--
-- Mais « hors quota » ne veut pas dire « sans limite ». Sans borne, un compte
-- gratuit à 3 générations par mois pouvait déclencher un appel au modèle
-- d'injection toutes les six secondes, indéfiniment : le coût suivait l'abus
-- et non le plan.
--
-- Le compteur est porté par la **ligne de génération**, pas par l'utilisateur
-- ni par une fenêtre de temps. C'est ce qui rend la limite incontournable :
--   - rejouer la requête sur le même `id` épuise le même budget ;
--   - passer à un autre `id` exige d'avoir créé une autre génération, ce qui
--     coûte, elle, une vraie unité de quota ;
--   - le compteur vit en base, jamais dans le client.

alter table public.generations
  add column if not exists template_reselects int not null default 0;

-- Consommation atomique d'une re-sélection.
--
-- Une seule instruction : deux requêtes concurrentes sur la même génération ne
-- peuvent pas lire le même compteur et écrire la même valeur. Le `where` porte
-- la limite, donc le dépassement se traduit par zéro ligne mise à jour et la
-- fonction renvoie `null` — il n'existe aucun chemin où l'appel au modèle part
-- sans que le compteur ait déjà été incrémenté.
--
-- `p_user_id` est dans le `where` : la propriété de la génération est vérifiée
-- par la même instruction que la consommation, pas par un contrôle séparé qui
-- pourrait diverger.
create or replace function public.consume_template_reselect(
  p_generation_id uuid,
  p_user_id uuid,
  p_max int
)
returns int
language sql
security definer
set search_path = ''
as $$
  update public.generations
     set template_reselects = template_reselects + 1
   where id = p_generation_id
     and user_id = p_user_id
     and template_reselects < p_max
  returning template_reselects;
$$;

revoke all on function public.consume_template_reselect(uuid, uuid, int)
  from public, anon, authenticated;
grant execute on function public.consume_template_reselect(uuid, uuid, int)
  to service_role;
