-- Masquer le corps des templates au client PostgREST.
--
-- `prompt_templates.body` (et `variables` / `asset_paths`) est la propriété
-- intellectuelle du catalogue. La RLS autorisait déjà la lecture des lignes
-- actives, et le GRANT SELECT portait sur **toutes** les colonnes : n'importe
-- quel porteur de la clé anon pouvait donc `select=body`.
--
-- `/api/templates` n'a jamais renvoyé `body` dans le JSON, mais ça ne protège
-- pas PostgREST. La restriction par colonne passe par GRANT, pas par une
-- policy : une policy ne distingue pas les colonnes.
--
-- Après cette migration, la palette se lit côté serveur via `service_role`.

revoke all on public.prompt_templates from anon, authenticated;

grant select (
  id,
  slug,
  domain,
  art_direction,
  title,
  summary,
  tags,
  complexity,
  is_active,
  created_at
) on public.prompt_templates to anon, authenticated;

grant all on public.prompt_templates to service_role;
