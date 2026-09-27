-- JobHunter — introductie na de eerste keer inloggen
-- null = de gebruiker heeft de korte uitleg nog niet gezien (of wil hem opnieuw zien)

alter table public.profiles
  add column onboarded_at timestamptz;

comment on column public.profiles.onboarded_at is
  'Moment waarop de gebruiker de introductie heeft afgerond of overgeslagen. null = introductie tonen.';

-- Bestaande accounts kennen de app al: alleen nieuwe accounts krijgen de introductie.
-- (Opnieuw bekijken kan altijd via Instellingen.)
update public.profiles set onboarded_at = created_at where onboarded_at is null;

-- Geen extra rechten of policies nodig: "Own profile: update" dekt deze kolom al.
