-- Yelhaa — origine du domaine retenu pour une génération.
--
-- Le sélecteur de type de projet de la HOME **impose** le domaine quand une
-- pill est sélectionnée : une demande explicite de l'utilisateur prime sur
-- l'inférence du classifieur. Cette colonne enregistre laquelle des deux
-- sources a décidé, pour pouvoir mesurer l'usage réel du sélecteur.
--
--   'user'       → une pill était sélectionnée, le classifieur n'a pas tranché
--   'classifier' → aucune pill, le domaine vient de l'appel #1

alter table public.generations
  add column if not exists project_type_source text
    check (project_type_source in ('user', 'classifier'));
