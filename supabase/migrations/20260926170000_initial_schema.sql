-- JobHunter.nl — initiële database
-- Kern: gedeelde data (companies, opportunities) los van persoonlijke data (matches).
-- Accounts zelf staan in auth.users (beheerd door Supabase Auth).

-- =====================================================================
-- Enums (zelfde waarden als de TypeScript types in src/shared/types)
-- =====================================================================

create type public.opportunity_type as enum (
  'job', 'internship', 'traineeship', 'thesis', 'working-student', 'open-application'
);
create type public.opportunity_source as enum (
  'linkedin', 'indeed', 'company-career-page', 'glassdoor', 'radar'
);
create type public.match_status as enum ('new', 'reviewed', 'saved', 'applied', 'rejected');
create type public.search_trigger as enum ('manual', 'scheduled');
create type public.search_run_status as enum ('queued', 'running', 'completed', 'failed');
create type public.schedule_frequency as enum ('daily', 'weekly');
create type public.credit_reason as enum ('purchase', 'search', 'application', 'refund', 'bonus', 'adjustment');

-- Houdt updated_at automatisch bij
create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =====================================================================
-- profiles — "your situation" (1:1 met auth.users)
-- =====================================================================

create table public.profiles (
  id                  uuid primary key references auth.users (id) on delete cascade,
  full_name           text,
  nationality         text,
  search_year_ends_on date,
  degree              text,
  field_of_study      text,
  university          text,
  graduation_year     smallint,
  languages           text[] not null default '{}',
  skills              text[] not null default '{}',
  cv_file_path        text,  -- pad in Supabase Storage, het bestand zelf staat niet in de database
  cv_text             text,  -- ruwe tekst uit de PDF
  cv_parsed           jsonb, -- opleiding/werkervaring zoals de CVParser ze teruggeeft
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

comment on table public.profiles is
  'Situatie van de gebruiker: opleiding, einde zoekjaar, skills en CV. Input voor de match-scoring.';

create trigger set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

-- Bij registratie direct een (leeg) profiel aanmaken
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =====================================================================
-- search_profiles — "your preferences" + schema voor automatisch zoeken
-- =====================================================================

create table public.search_profiles (
  id                     uuid primary key default gen_random_uuid(),
  user_id                uuid not null references public.profiles (id) on delete cascade,
  name                   text not null default 'My search',
  desired_roles          text[] not null default '{}',
  opportunity_types      public.opportunity_type[] not null default '{}',
  locations              text[] not null default '{}',
  remote_only            boolean not null default false,
  industries             text[] not null default '{}',
  min_salary             integer check (min_salary >= 0),
  include_radar          boolean not null default true,
  include_company_hunter boolean not null default true,
  schedule_enabled       boolean not null default false,
  schedule_frequency     public.schedule_frequency not null default 'daily',
  schedule_day_of_week   smallint not null default 1 check (schedule_day_of_week between 0 and 6), -- 0 = zondag
  schedule_time          time not null default '08:00',
  timezone               text not null default 'Europe/Amsterdam',
  next_run_at            timestamptz, -- de scheduler pakt alles met next_run_at <= now()
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

comment on table public.search_profiles is
  'Wat de gebruiker zoekt (rollen, types, locaties) en wanneer er automatisch gezocht wordt. Dit gaat naar n8n.';

create index search_profiles_user_id_idx on public.search_profiles (user_id);
create index search_profiles_due_idx on public.search_profiles (next_run_at) where schedule_enabled;

create trigger set_updated_at before update on public.search_profiles
  for each row execute function public.set_updated_at();

-- =====================================================================
-- search_runs — één rij per uitgevoerde search (handmatig of gepland)
-- =====================================================================

create table public.search_runs (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references public.profiles (id) on delete cascade,
  search_profile_id uuid references public.search_profiles (id) on delete set null,
  triggered_by      public.search_trigger not null,
  status            public.search_run_status not null default 'queued',
  criteria_snapshot jsonb not null, -- voorkeuren op het moment van zoeken
  n8n_execution_id  text,
  credits_charged   integer not null default 0 check (credits_charged >= 0),
  results_found     integer not null default 0,
  new_results       integer not null default 0,
  error_message     text,
  created_at        timestamptz not null default now(),
  started_at        timestamptz,
  finished_at       timestamptz
);

comment on table public.search_runs is
  'Historie en voortgang van searches. n8n koppelt zijn resultaten via het id van de run.';

create index search_runs_user_id_created_at_idx on public.search_runs (user_id, created_at desc);
create index search_runs_search_profile_id_idx on public.search_runs (search_profile_id);

-- =====================================================================
-- companies — gedeeld tussen alle gebruikers
-- =====================================================================

create table public.companies (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  domain           text unique, -- bv. 'grachtwerk.nl', sleutel om dubbele bedrijven te voorkomen
  website          text,
  career_page_url  text,
  industry         text,
  location         text,
  is_monitored     boolean not null default false, -- Company Hunter checkt deze career page
  career_page_hash text,                           -- om te zien of de career page veranderd is
  last_checked_at  timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

comment on table public.companies is
  'Bedrijven uit alle bronnen. Company Hunter en Radar werken op deze tabel.';

create index companies_name_idx on public.companies (lower(name));
create index companies_monitored_idx on public.companies (last_checked_at) where is_monitored;

create trigger set_updated_at before update on public.companies
  for each row execute function public.set_updated_at();

-- =====================================================================
-- opportunities — gedeelde vacatures (ook Radar-suggesties)
-- =====================================================================

create table public.opportunities (
  id              uuid primary key default gen_random_uuid(),
  company_id      uuid not null references public.companies (id) on delete cascade,
  source          public.opportunity_source not null,
  external_id     text not null, -- id bij de bron (LinkedIn job id, Indeed jk, of url-hash)
  url             text not null,
  title           text not null,
  type            public.opportunity_type not null,
  location        text,
  remote          boolean not null default false,
  description     text,
  required_skills text[] not null default '{}',
  salary_min      integer,
  salary_max      integer,
  is_hidden       boolean not null default false, -- true = Radar-suggestie, geen gepubliceerde vacature
  posted_at       timestamptz,
  first_seen_at   timestamptz not null default now(),
  last_seen_at    timestamptz not null default now(), -- niet meer gezien = waarschijnlijk gesloten
  closed_at       timestamptz,
  updated_at      timestamptz not null default now(),
  unique (source, external_id),
  check (salary_min is null or salary_max is null or salary_min <= salary_max)
);

comment on table public.opportunities is
  'Elke vacature één keer, gedeeld tussen gebruikers. Opnieuw scrapen werkt de rij bij in plaats van te dupliceren.';

create index opportunities_company_id_idx on public.opportunities (company_id);

create trigger set_updated_at before update on public.opportunities
  for each row execute function public.set_updated_at();

-- =====================================================================
-- matches — persoonlijk resultaat: wat het dashboard toont
-- =====================================================================

create table public.matches (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references public.profiles (id) on delete cascade,
  opportunity_id    uuid not null references public.opportunities (id) on delete cascade,
  search_run_id     uuid references public.search_runs (id) on delete set null, -- run die hem vond
  match_score       smallint not null check (match_score between 0 and 100),
  match_reasons     text[] not null default '{}',
  status            public.match_status not null default 'new',
  status_changed_at timestamptz,
  created_at        timestamptz not null default now(),
  unique (user_id, opportunity_id)
);

comment on table public.matches is
  'Koppelt een gebruiker aan een vacature met een persoonlijke score en status.';

create index matches_user_id_score_idx on public.matches (user_id, match_score desc);
create index matches_opportunity_id_idx on public.matches (opportunity_id);
create index matches_search_run_id_idx on public.matches (search_run_id);

-- =====================================================================
-- credit_transactions — grootboek van credits (+ aankoop, - search, + refund)
-- =====================================================================

create table public.credit_transactions (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references public.profiles (id) on delete cascade,
  amount            integer not null check (amount <> 0),
  reason            public.credit_reason not null,
  search_run_id     uuid references public.search_runs (id) on delete set null,
  stripe_session_id text unique, -- voorkomt dubbel bijschrijven bij herhaalde Stripe-webhooks
  created_at        timestamptz not null default now()
);

comment on table public.credit_transactions is
  'Elke wijziging in credits. Het saldo is de som hiervan (zie view credit_balances).';

create index credit_transactions_user_id_created_at_idx on public.credit_transactions (user_id, created_at desc);
create index credit_transactions_search_run_id_idx on public.credit_transactions (search_run_id);

-- Saldo per gebruiker, altijd afgeleid van het grootboek (kan dus nooit uit de pas lopen)
create view public.credit_balances
with (security_invoker = true) as
  select user_id, sum(amount)::integer as balance
  from public.credit_transactions
  group by user_id;

-- =====================================================================
-- Toegang (Row Level Security)
-- Gebruikers lezen alleen hun eigen data en passen alleen aan wat van hen is.
-- Runs, matches, vacatures en credits worden geschreven door de server (service role).
-- =====================================================================

alter table public.profiles            enable row level security;
alter table public.search_profiles     enable row level security;
alter table public.search_runs         enable row level security;
alter table public.companies           enable row level security;
alter table public.opportunities       enable row level security;
alter table public.matches             enable row level security;
alter table public.credit_transactions enable row level security;

-- Rechten expliciet maken i.p.v. te vertrouwen op de Supabase-defaults
revoke all on all tables in schema public from anon, authenticated;

grant select, update                 on public.profiles        to authenticated;
grant select, insert, update, delete on public.search_profiles to authenticated;
grant select on public.search_runs, public.companies, public.opportunities,
                public.matches, public.credit_transactions, public.credit_balances
  to authenticated;
grant update (status, status_changed_at) on public.matches to authenticated; -- score blijft read-only

create policy "Own profile: read" on public.profiles
  for select to authenticated using ((select auth.uid()) = id);
create policy "Own profile: update" on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create policy "Own search profiles: read" on public.search_profiles
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Own search profiles: create" on public.search_profiles
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Own search profiles: update" on public.search_profiles
  for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Own search profiles: delete" on public.search_profiles
  for delete to authenticated using ((select auth.uid()) = user_id);

create policy "Own search runs: read" on public.search_runs
  for select to authenticated using ((select auth.uid()) = user_id);

create policy "Companies: readable when logged in" on public.companies
  for select to authenticated using (true);

create policy "Opportunities: only the ones matched to you" on public.opportunities
  for select to authenticated using (
    exists (
      select 1 from public.matches m
      where m.opportunity_id = opportunities.id
        and m.user_id = (select auth.uid())
    )
  );

create policy "Own matches: read" on public.matches
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Own matches: update status" on public.matches
  for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "Own credit transactions: read" on public.credit_transactions
  for select to authenticated using ((select auth.uid()) = user_id);
