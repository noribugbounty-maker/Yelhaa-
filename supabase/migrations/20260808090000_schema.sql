-- Yelhaa — schéma initial (build prompt §2).
--
-- Correction appliquée depuis le §7 : `usage_counters` ne compte qu'une seule
-- unité, la génération. Les colonnes `components_used` et `automations_used`
-- n'existent pas.

-- ---------------------------------------------------------------------------
-- Catalogue de prompts
-- ---------------------------------------------------------------------------
create table if not exists public.prompt_templates (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,
  domain          text not null check (domain in ('saas', 'product', 'finance', 'agency')),
  art_direction   text not null,
  title           text not null,
  summary         text not null,                 -- 1 phrase, sert au matching et à l'affichage
  body            text not null,                 -- le corps du prompt, avec {{VARIABLES}}
  variables       jsonb not null default '[]',
  tags            text[] not null default '{}',
  asset_paths     jsonb not null default '{}',   -- standard | enhanced | sequence | video
  complexity      text not null default 'medium',
  is_active       boolean not null default true,
  created_at      timestamptz not null default now()
);

create index if not exists prompt_templates_domain_idx on public.prompt_templates (domain);
create index if not exists prompt_templates_tags_idx on public.prompt_templates using gin (tags);

-- ---------------------------------------------------------------------------
-- Profils utilisateurs
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id                     uuid primary key references auth.users on delete cascade,
  email                  text,
  plan                   text not null default 'free' check (plan in ('free', 'pro', 'agency')),
  stripe_customer_id     text unique,
  stripe_subscription_id text,
  plan_renews_at         timestamptz,
  created_at             timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Compteurs d'usage, remis à zéro le 1er de chaque mois (§7).
-- `period_start` porte toujours le premier jour du mois courant.
-- ---------------------------------------------------------------------------
create table if not exists public.usage_counters (
  user_id          uuid not null references public.profiles (id) on delete cascade,
  period_start     date not null,
  generations_used int not null default 0 check (generations_used >= 0),
  primary key (user_id, period_start)
);

-- ---------------------------------------------------------------------------
-- Historique des générations
-- ---------------------------------------------------------------------------
create table if not exists public.generations (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid references public.profiles (id) on delete cascade,
  idea           text not null,
  template_id    uuid references public.prompt_templates (id),
  domain         text,
  extracted_vars jsonb,
  asset_path     text,
  output         text not null,
  tokens_in      int,
  tokens_out     int,
  created_at     timestamptz not null default now()
);

create index if not exists generations_user_created_idx
  on public.generations (user_id, created_at desc);

-- ---------------------------------------------------------------------------
-- FAQ
-- ---------------------------------------------------------------------------
create table if not exists public.faq_articles (
  slug      text primary key,
  category  text not null,
  question  text not null,
  answer_md text not null,
  position  int not null default 0,
  is_active boolean not null default true
);
