-- Yelhaa — Row Level Security (build prompt §2).
--
-- Deux règles se croisent ici, et la plus restrictive gagne :
--
--   §2 « chaque utilisateur ne lit et n'écrit que ses propres lignes »
--   §6 « le plan n'est jamais mis à jour depuis le client — uniquement par webhook »
--   §7 « les quotas sont vérifiés côté serveur uniquement »
--
-- Une politique d'écriture ouverte sur `usage_counters` permettrait à
-- n'importe quel porteur de la clé anon de remettre son propre compteur à
-- zéro, et une écriture ouverte sur `profiles.plan` de s'octroyer le plan
-- Agency. Les écritures de ces deux tables sont donc réservées au
-- `service_role`, qui contourne RLS. Le client ne garde que la lecture de ses
-- propres lignes, plus la mise à jour de son e-mail.
--
-- La restriction par colonne passe par les GRANT : une policy RLS ne sait pas
-- distinguer les colonnes.

alter table public.profiles         enable row level security;
alter table public.usage_counters   enable row level security;
alter table public.generations      enable row level security;
alter table public.prompt_templates enable row level security;
alter table public.faq_articles     enable row level security;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant update (email) on public.profiles to authenticated;
grant all on public.profiles to service_role;

drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id);

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- ---------------------------------------------------------------------------
-- usage_counters — lecture seule côté client, écriture serveur uniquement
-- ---------------------------------------------------------------------------
revoke all on public.usage_counters from anon, authenticated;
grant select on public.usage_counters to authenticated;
grant all on public.usage_counters to service_role;

drop policy if exists usage_counters_select_own on public.usage_counters;
create policy usage_counters_select_own
  on public.usage_counters for select to authenticated
  using ((select auth.uid()) = user_id);

-- ---------------------------------------------------------------------------
-- generations — lecture seule côté client. L'insertion suit la validation de
-- sortie du §4, côté serveur, jamais depuis le navigateur.
-- ---------------------------------------------------------------------------
revoke all on public.generations from anon, authenticated;
grant select on public.generations to authenticated;
grant all on public.generations to service_role;

drop policy if exists generations_select_own on public.generations;
create policy generations_select_own
  on public.generations for select to authenticated
  using ((select auth.uid()) = user_id);

-- ---------------------------------------------------------------------------
-- prompt_templates — lecture publique des lignes actives, écriture service_role
-- ---------------------------------------------------------------------------
revoke all on public.prompt_templates from anon, authenticated;
grant select on public.prompt_templates to anon, authenticated;
grant all on public.prompt_templates to service_role;

drop policy if exists prompt_templates_read_active on public.prompt_templates;
create policy prompt_templates_read_active
  on public.prompt_templates for select to anon, authenticated
  using (is_active);

-- ---------------------------------------------------------------------------
-- faq_articles — lecture publique des lignes actives, écriture service_role
-- ---------------------------------------------------------------------------
revoke all on public.faq_articles from anon, authenticated;
grant select on public.faq_articles to anon, authenticated;
grant all on public.faq_articles to service_role;

drop policy if exists faq_articles_read_active on public.faq_articles;
create policy faq_articles_read_active
  on public.faq_articles for select to anon, authenticated
  using (is_active);
