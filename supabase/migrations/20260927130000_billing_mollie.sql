-- JobHunter — betalen met Mollie (creditpakketten)
-- De eerste zoekopdracht is gratis (1 welkomstcredit). Daarna koopt de student credits via Mollie:
-- 1 credit = 1 zoekopdracht (handmatig of automatisch). Automations (automatisch zoeken en mails
-- laten versturen) zijn beschikbaar zodra er minstens één betaling is gelukt.
-- Bedragen altijd in centen (integer) + ISO-valuta.

-- =====================================================================
-- payments — één Mollie-betaling per gekocht creditpakket
-- =====================================================================

create type public.payment_status as enum ('open', 'pending', 'authorized', 'paid', 'failed', 'canceled', 'expired');

create table public.payments (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references public.profiles (id) on delete cascade,
  provider            text not null default 'mollie' check (provider = 'mollie'),
  provider_payment_id text unique,                          -- Mollie: tr_…
  pack_id             text not null,                        -- zie src/modules/billing/plans.ts
  credits             integer not null check (credits > 0),
  amount_cents        integer not null check (amount_cents > 0),
  currency            text not null default 'EUR' check (currency ~ '^[A-Z]{3}$'),
  status              public.payment_status not null default 'open',
  mode                text check (mode in ('test', 'live')), -- test-key of live-key
  checkout_url        text,
  paid_at             timestamptz,
  credited_at         timestamptz,                          -- credits bijgeschreven (precies één keer)
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

comment on table public.payments is
  'Aankopen van creditpakketten via Mollie. De status komt altijd van de Mollie API (fetch-to-confirm), nooit van de browser.';

create index payments_user_id_created_at_idx on public.payments (user_id, created_at desc);
create index payments_paid_user_idx on public.payments (user_id) where status = 'paid';

create trigger payments_set_updated_at
  before update on public.payments
  for each row execute function public.set_updated_at();

-- Eén creditboeking per betaling: dubbele webhooks of een webhook + terugkeerpagina kunnen nooit dubbel bijschrijven
alter table public.credit_transactions
  add column payment_id uuid unique references public.payments (id) on delete set null;

alter table public.payments enable row level security;
grant select on public.payments to authenticated;

-- Studenten zien alleen hun eigen betalingen; aanmaken en bijwerken doet alleen de server
create policy "Own payments: read" on public.payments
  for select to authenticated using ((select auth.uid()) = user_id);

-- =====================================================================
-- Status van Mollie verwerken — atomisch en idempotent
-- =====================================================================

-- Zet de status die de server bij Mollie heeft opgehaald. Bij 'paid' worden de credits precies één
-- keer bijgeschreven. Een betaalde betaling gaat nooit meer terug naar een eerdere status.
-- Geeft true terug als er bij déze aanroep credits zijn bijgeschreven.
create function public.apply_payment_status(
  p_payment_id uuid,
  p_status public.payment_status,
  p_paid_at timestamptz default null,
  p_mode text default null
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_payment public.payments;
begin
  select * into v_payment from public.payments where id = p_payment_id for update;
  if not found then
    return false;
  end if;

  update public.payments
     set status  = case when v_payment.status = 'paid' then 'paid'::public.payment_status else p_status end,
         paid_at = coalesce(v_payment.paid_at, case when p_status = 'paid' then coalesce(p_paid_at, now()) end),
         mode    = coalesce(p_mode, v_payment.mode)
   where id = p_payment_id;

  if p_status = 'paid' and v_payment.credited_at is null then
    insert into public.credit_transactions (user_id, amount, reason, payment_id)
    values (v_payment.user_id, v_payment.credits, 'purchase', v_payment.id);

    update public.payments set credited_at = now() where id = p_payment_id;
    return true;
  end if;

  return false;
end;
$$;

-- Heeft deze gebruiker ooit betaald? Dat ontgrendelt de automations.
create function public.has_paid_access(p_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.payments where user_id = p_user_id and status = 'paid');
$$;

-- =====================================================================
-- Eerste zoekopdracht gratis: nieuwe accounts krijgen 1 welkomstcredit (was 10)
-- Bestaande accounts houden hun saldo.
-- =====================================================================

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
  values (new.id, 1, 'bonus');

  return new;
end;
$$;

-- =====================================================================
-- Automatisch zoeken alleen voor betalende gebruikers met credits
-- Wie geen credits heeft wordt overgeslagen (geen mislukte runs); na het opwaarderen
-- pakt de volgende scheduler-ronde het schema meteen weer op.
-- =====================================================================

create or replace function public.claim_due_search_profiles(p_limit integer default 25)
returns setof public.search_profiles
language plpgsql
security definer
set search_path = ''
as $$
begin
  return query
  with due as (
    select sp.id
    from public.search_profiles sp
    where sp.schedule_enabled
      and sp.next_run_at <= now()
      and exists (select 1 from public.payments p where p.user_id = sp.user_id and p.status = 'paid')
      and coalesce((select sum(t.amount) from public.credit_transactions t where t.user_id = sp.user_id), 0) >= 1
    order by sp.next_run_at
    limit p_limit
    for update of sp skip locked
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

-- Systeemfuncties: alleen de server (service role / secret key)
revoke execute on function public.apply_payment_status(uuid, public.payment_status, timestamptz, text) from public, anon, authenticated;
revoke execute on function public.has_paid_access(uuid) from public, anon, authenticated;
revoke execute on function public.claim_due_search_profiles(integer) from public, anon, authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;

grant execute on function public.apply_payment_status(uuid, public.payment_status, timestamptz, text) to service_role;
grant execute on function public.has_paid_access(uuid) to service_role;
grant execute on function public.claim_due_search_profiles(integer) to service_role;
