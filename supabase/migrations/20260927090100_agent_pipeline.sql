-- JobHunter — agent-pipeline
-- Know me (profiel) → Find opportunities (n8n levert resultaten aan) → Take action (outreach)
-- Alles wat het systeem zelf schrijft (runs, matches, credits, outreach-status) gaat via de server (secret key).

-- =====================================================================
-- profiles — "know me" + hoe zelfstandig de agent mag werken
-- =====================================================================

alter table public.profiles
  add column interests            text[] not null default '{}',
  add column ambitions            text,
  add column recent_curiosity     text,   -- "welk nieuws / welke technologie trok je aandacht?"
  add column linkedin_url         text,
  add column portfolio_url        text,
  add column automation_level     smallint not null default 1 check (automation_level between 1 and 3),
  add column auto_send_consent_at timestamptz, -- toestemming voor niveau 3 (automatisch versturen)
  add column daily_send_limit     smallint not null default 3 check (daily_send_limit between 0 and 20),
  add constraint profiles_auto_send_needs_consent
    check (automation_level < 3 or auto_send_consent_at is not null);

comment on column public.profiles.automation_level is
  '1 = assistent (agent schrijft, student verstuurt zelf), 2 = semi-automatisch (student keurt goed, systeem verstuurt), 3 = volledig automatisch.';

-- =====================================================================
-- companies / opportunities — meer context en een contactpersoon
-- =====================================================================

alter table public.companies
  add column description text;

alter table public.opportunities
  add column starts_at     timestamptz,                -- events: wanneer het plaatsvindt
  add column signals       text[] not null default '{}', -- "why now": funding, nieuw kantoor, ...
  add column contact_name  text,
  add column contact_email text,
  add column contact_role  text,
  add column contact_url   text;                        -- LinkedIn-profiel of contactpagina

-- =====================================================================
-- outreach_messages — e-mails die de agent voorbereidt (en eventueel verstuurt)
-- =====================================================================

create type public.outreach_status as enum ('draft', 'sending', 'sent', 'failed');
create type public.outreach_origin as enum ('user', 'agent');

create table public.outreach_messages (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles (id) on delete cascade,
  match_id      uuid not null unique references public.matches (id) on delete cascade, -- één bericht per kans
  to_email      text,
  to_name       text,
  subject       text not null default '',
  body          text not null default '',
  status        public.outreach_status not null default 'draft',
  created_by    public.outreach_origin not null default 'user',
  sent_via      text check (sent_via in ('n8n', 'manual')),
  sent_at       timestamptz,
  error_message text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on table public.outreach_messages is
  'Persoonlijke e-mail per match. De student past aan; versturen gaat via n8n of zijn eigen mailprogramma.';

create index outreach_messages_user_id_idx on public.outreach_messages (user_id, updated_at desc);
create index outreach_messages_sent_idx on public.outreach_messages (user_id, sent_at) where status = 'sent';

create trigger set_updated_at before update on public.outreach_messages
  for each row execute function public.set_updated_at();

alter table public.outreach_messages enable row level security;

revoke all on public.outreach_messages from anon, authenticated;
grant select on public.outreach_messages to authenticated;
grant update (to_email, to_name, subject, body) on public.outreach_messages to authenticated;

create policy "Own outreach: read" on public.outreach_messages
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Own outreach: edit drafts" on public.outreach_messages
  for update to authenticated
  using ((select auth.uid()) = user_id and status in ('draft', 'failed'))
  with check ((select auth.uid()) = user_id);

-- =====================================================================
-- Credits — atomisch afschrijven en terugboeken
-- =====================================================================

-- Schrijft credits af als het saldo toereikend is. Lock per gebruiker voorkomt dubbel uitgeven.
create function public.spend_credits(
  p_user_id uuid,
  p_amount integer,
  p_reason public.credit_reason,
  p_search_run_id uuid default null
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_balance integer;
begin
  if p_amount <= 0 then
    raise exception 'amount must be positive';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(p_user_id::text, 0));

  select coalesce(sum(amount), 0) into v_balance
  from public.credit_transactions
  where user_id = p_user_id;

  if v_balance < p_amount then
    return false;
  end if;

  insert into public.credit_transactions (user_id, amount, reason, search_run_id)
  values (p_user_id, -p_amount, p_reason, p_search_run_id);

  return true;
end;
$$;

-- Zet een run op 'failed' en boekt de credits terug (maar één keer: alleen vanuit queued/running)
create function public.fail_search_run(p_run_id uuid, p_error text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid;
  v_charged integer;
begin
  update public.search_runs
     set status = 'failed', error_message = left(p_error, 1000), finished_at = now()
   where id = p_run_id and status in ('queued', 'running')
  returning user_id, credits_charged into v_user_id, v_charged;

  if found and v_charged > 0 then
    insert into public.credit_transactions (user_id, amount, reason, search_run_id)
    values (v_user_id, v_charged, 'refund', p_run_id);
  end if;
end;
$$;

-- Telt resultaten van een (deel)levering op; done = true sluit de run af
create function public.record_search_run_results(
  p_run_id uuid,
  p_found integer,
  p_new integer,
  p_done boolean
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.search_runs
     set results_found = results_found + p_found,
         new_results   = new_results + p_new,
         status        = case when p_done then 'completed' else 'running' end::public.search_run_status,
         started_at    = coalesce(started_at, now()),
         finished_at   = case when p_done then now() else null end
   where id = p_run_id and status in ('queued', 'running');
end;
$$;

-- Runs die te lang blijven hangen (n8n crasht, callback komt nooit) → failed + credits terug
create function public.expire_stale_search_runs(p_max_age interval default interval '30 minutes')
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_run record;
  v_count integer := 0;
begin
  for v_run in
    select id from public.search_runs
    where status in ('queued', 'running') and created_at < now() - p_max_age
  loop
    perform public.fail_search_run(v_run.id, 'Timed out: no results were delivered.');
    v_count := v_count + 1;
  end loop;
  return v_count;
end;
$$;

-- Welkomstcredits bij registratie, zodat een nieuwe gebruiker direct kan zoeken
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');

  insert into public.credit_transactions (user_id, amount, reason)
  values (new.id, 10, 'bonus');

  return new;
end;
$$;

-- Bestaande accounts zonder enige transactie krijgen dezelfde welkomstcredits
insert into public.credit_transactions (user_id, amount, reason)
select p.id, 10, 'bonus'
from public.profiles p
where not exists (select 1 from public.credit_transactions t where t.user_id = p.id);

-- =====================================================================
-- Planning — next_run_at wordt in de database berekend (tijdzone-bewust)
-- =====================================================================

-- Eerstvolgende moment na p_after waarop het schema moet draaien, in de tijdzone van de gebruiker
create function public.next_schedule_run(
  p_frequency public.schedule_frequency,
  p_day_of_week smallint,
  p_time time,
  p_timezone text,
  p_after timestamptz
)
returns timestamptz
language plpgsql
stable
set search_path = ''
as $$
declare
  v_local_after timestamp := p_after at time zone p_timezone;
  v_candidate   timestamp := date_trunc('day', v_local_after) + p_time;
begin
  if p_frequency = 'daily' then
    if v_candidate <= v_local_after then
      v_candidate := v_candidate + interval '1 day';
    end if;
  else
    v_candidate := v_candidate
      + make_interval(days => ((p_day_of_week - extract(dow from v_candidate)::integer + 7) % 7));
    if v_candidate <= v_local_after then
      v_candidate := v_candidate + interval '7 days';
    end if;
  end if;

  return v_candidate at time zone p_timezone;
end;
$$;

create function public.set_next_run_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.schedule_enabled then
    new.next_run_at := public.next_schedule_run(
      new.schedule_frequency, new.schedule_day_of_week, new.schedule_time, new.timezone, now()
    );
  else
    new.next_run_at := null;
  end if;
  return new;
end;
$$;

create trigger set_next_run_at
  before insert or update of schedule_enabled, schedule_frequency, schedule_day_of_week, schedule_time, timezone
  on public.search_profiles
  for each row execute function public.set_next_run_at();

-- Bestaande schema's opnieuw laten doorrekenen door de trigger
update public.search_profiles set schedule_enabled = schedule_enabled where schedule_enabled;

-- Pakt de zoekprofielen die aan de beurt zijn en schuift hun next_run_at meteen door.
-- skip locked: twee scheduler-ticks tegelijk pakken nooit hetzelfde profiel.
create function public.claim_due_search_profiles(p_limit integer default 25)
returns setof public.search_profiles
language plpgsql
security definer
set search_path = ''
as $$
begin
  return query
  with due as (
    select id
    from public.search_profiles
    where schedule_enabled and next_run_at <= now()
    order by next_run_at
    limit p_limit
    for update skip locked
  )
  update public.search_profiles sp
     set next_run_at = public.next_schedule_run(
       sp.schedule_frequency, sp.schedule_day_of_week, sp.schedule_time, sp.timezone, now()
     )
    from due
   where sp.id = due.id
  returning sp.*;
end;
$$;

-- Systeemfuncties: alleen de server (service role / secret key) mag ze aanroepen
revoke execute on function public.spend_credits(uuid, integer, public.credit_reason, uuid) from public, anon, authenticated;
revoke execute on function public.fail_search_run(uuid, text) from public, anon, authenticated;
revoke execute on function public.record_search_run_results(uuid, integer, integer, boolean) from public, anon, authenticated;
revoke execute on function public.expire_stale_search_runs(interval) from public, anon, authenticated;
revoke execute on function public.claim_due_search_profiles(integer) from public, anon, authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;

grant execute on function public.spend_credits(uuid, integer, public.credit_reason, uuid) to service_role;
grant execute on function public.fail_search_run(uuid, text) to service_role;
grant execute on function public.record_search_run_results(uuid, integer, integer, boolean) to service_role;
grant execute on function public.expire_stale_search_runs(interval) to service_role;
grant execute on function public.claim_due_search_profiles(integer) to service_role;

-- =====================================================================
-- Storage — privé bucket voor cv's (alleen de server leest en schrijft)
-- =====================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('cvs', 'cvs', false, 5242880, array['application/pdf'])
on conflict (id) do nothing;
