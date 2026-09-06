-- Yelhaa — idempotence du webhook Stripe (build prompt §6).
--
-- « Le webhook est idempotent : rejouer un événement ne double jamais un
--   changement de plan. »
--
-- L'identifiant d'événement Stripe est la clé primaire : une seconde
-- livraison du même événement échoue à l'insertion et le traitement s'arrête
-- avant toute écriture sur `profiles`.

create table if not exists public.stripe_events (
  id           text primary key,
  type         text not null,
  processed_at timestamptz not null default now()
);

alter table public.stripe_events enable row level security;

revoke all on public.stripe_events from anon, authenticated;
grant all on public.stripe_events to service_role;
