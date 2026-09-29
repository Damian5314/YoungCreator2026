-- JobHunter — productie-hardening
-- 1. Profielkolommen die geld of rechten raken alleen via de server
-- 2. Betalingen blijven bewaard als een account wordt verwijderd (wettelijke bewaarplicht)
-- 3. Terugbetalingen en chargebacks van Mollie trekken de gekochte credits weer in (precies één keer)
-- 4. Rate limiting in de database (geen extra dienst nodig)

-- =====================================================================
-- 1. profiles — kolomrechten
-- Tot nu toe mocht een ingelogde gebruiker via de publieke API élke kolom van zijn eigen profiel
-- bijwerken, dus ook automation_level. Daarmee kon je automatisch versturen aanzetten zonder te
-- betalen. De server (secret key) zet die kolommen nu na zijn eigen controles.
-- =====================================================================

revoke update on public.profiles from authenticated;
grant update (
  full_name, nationality, search_year_ends_on, degree, field_of_study, university, graduation_year,
  languages, skills, interests, ambitions, recent_curiosity,
  cv_file_path, cv_text, cv_parsed,
  linkedin_url, portfolio_url, daily_send_limit,
  onboarded_at
) on public.profiles to authenticated;

-- =====================================================================
-- 2. payments — bewaren na het verwijderen van een account
-- De regel blijft (bedrag, datum, Mollie-id) maar verliest de koppeling met de persoon.
-- =====================================================================

alter table public.payments alter column user_id drop not null;
alter table public.payments drop constraint payments_user_id_fkey;
alter table public.payments
  add constraint payments_user_id_fkey foreign key (user_id) references public.profiles (id) on delete set null;

comment on column public.payments.user_id is
  'null = account verwijderd; de betaling zelf blijft 7 jaar bewaard voor de administratie.';

-- Moment waarop de koper akkoord gaf met directe levering en het vervallen van het herroepingsrecht
-- (digitale inhoud, art. 6:230p BW). Wordt bij het starten van de checkout gezet.
alter table public.payments
  add column withdrawal_waiver_at timestamptz;

-- =====================================================================
-- 3. Terugbetalingen en chargebacks
-- =====================================================================

alter table public.payments
  add column refunded_cents     integer not null default 0 check (refunded_cents >= 0),
  add column charged_back_cents integer not null default 0 check (charged_back_cents >= 0),
  add column reversed_at        timestamptz; -- credits ingetrokken (precies één keer)

-- Eén intrekking per betaling
alter table public.credit_transactions
  add column reversal_of_payment_id uuid unique references public.payments (id) on delete set null;

-- Verwerkt de bedragen die de server bij Mollie heeft opgehaald. Is (een deel van) de betaling
-- terugbetaald of teruggeboekt, dan worden de credits van dat pakket één keer ingetrokken. Het
-- saldo kan daardoor negatief worden; spend_credits laat dan geen nieuwe zoekopdrachten meer toe.
-- Geeft true terug als er bij déze aanroep credits zijn ingetrokken.
create function public.apply_payment_reversal(
  p_payment_id uuid,
  p_refunded_cents integer,
  p_charged_back_cents integer
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
     set refunded_cents     = greatest(refunded_cents, coalesce(p_refunded_cents, 0)),
         charged_back_cents = greatest(charged_back_cents, coalesce(p_charged_back_cents, 0))
   where id = p_payment_id;

  if (coalesce(p_refunded_cents, 0) > 0 or coalesce(p_charged_back_cents, 0) > 0)
     and v_payment.credited_at is not null
     and v_payment.reversed_at is null
     and v_payment.user_id is not null then
    insert into public.credit_transactions (user_id, amount, reason, reversal_of_payment_id)
    values (v_payment.user_id, -v_payment.credits, 'refund', v_payment.id);

    update public.payments set reversed_at = now() where id = p_payment_id;
    return true;
  end if;

  return false;
end;
$$;

-- =====================================================================
-- 4. Rate limiting
-- Vaste vensters per sleutel (bijv. "login:ip:1.2.3.4" of "search:user:<uuid>").
-- =====================================================================

create table public.rate_limits (
  key          text not null,
  window_start timestamptz not null,
  hits         integer not null default 0,
  primary key (key, window_start)
);

comment on table public.rate_limits is
  'Tellers voor rate limiting. Alleen de server schrijft hierin; oude vensters worden opgeruimd.';

alter table public.rate_limits enable row level security;
revoke all on public.rate_limits from anon, authenticated;

-- Telt één verzoek mee en geeft true terug zolang de limiet niet is overschreden
create function public.hit_rate_limit(p_key text, p_max integer, p_window_seconds integer)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_window timestamptz := to_timestamp(floor(extract(epoch from now()) / p_window_seconds) * p_window_seconds);
  v_hits integer;
begin
  insert into public.rate_limits (key, window_start, hits)
  values (left(p_key, 200), v_window, 1)
  on conflict (key, window_start) do update set hits = public.rate_limits.hits + 1
  returning hits into v_hits;

  -- Af en toe opruimen, zodat de tabel klein blijft
  if random() < 0.01 then
    delete from public.rate_limits where window_start < now() - interval '1 day';
  end if;

  return v_hits <= p_max;
end;
$$;

-- Systeemfuncties: alleen de server (service role / secret key)
revoke execute on function public.apply_payment_reversal(uuid, integer, integer) from public, anon, authenticated;
revoke execute on function public.hit_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.apply_payment_reversal(uuid, integer, integer) to service_role;
grant execute on function public.hit_rate_limit(text, integer, integer) to service_role;
