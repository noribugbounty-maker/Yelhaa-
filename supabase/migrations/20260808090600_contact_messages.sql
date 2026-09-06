-- Yelhaa — messages du formulaire de contact.
--
-- Le §8 du build prompt impose que le formulaire poste vers `/api/contact`
-- avec validation serveur et anti-spam, mais aucun fournisseur d'e-mail n'est
-- au stack du §1 et aucune adresse de destination n'a été fournie. Sans
-- stockage, la confirmation affichée à l'utilisateur serait un mensonge : le
-- message n'irait nulle part.
--
-- Les messages atterrissent donc ici, lisibles par le `service_role` seul.
-- Le jour où un fournisseur d'e-mail est branché, cette table reste la trace.

create table if not exists public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  message    text not null,
  consent    boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

-- Aucune policy pour `anon` ni `authenticated` : aucune lecture, aucune
-- écriture depuis le navigateur. L'insertion passe par la route serveur.
revoke all on public.contact_messages from anon, authenticated;
grant all on public.contact_messages to service_role;
