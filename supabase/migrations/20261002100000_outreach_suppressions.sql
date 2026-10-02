-- JobHunter — afmelden voor outreach
-- Ontvangers die via de afmeldlink onder een e-mail aangeven geen berichten via Unlisted meer te willen.
-- Unlisted verstuurt daarna nooit meer iets naar dit adres, van geen enkele student.

create table public.outreach_suppressions (
  email      text primary key check (email = lower(email)),
  reason     text not null default 'unsubscribe' check (reason in ('unsubscribe', 'bounce', 'complaint', 'manual')),
  created_at timestamptz not null default now()
);

comment on table public.outreach_suppressions is
  'Adressen die geen e-mails via Unlisted meer willen (afmelden) of die niet bezorgd kunnen worden. Alleen de server leest en schrijft.';

alter table public.outreach_suppressions enable row level security;
revoke all on public.outreach_suppressions from anon, authenticated;
