# Security — stand van zaken

Laatste review: 29 september 2026. Werk dit bij als er iets verandert aan auth, betalingen of de database.

## Autorisatie (wie mag wat)

Alle data loopt via Supabase met Row Level Security. Server components en actions gebruiken de sessie van de gebruiker (`src/lib/supabase/server.ts`), dus RLS bepaalt wat iemand ziet. Alleen systeemwerk gebruikt de secret key (`src/lib/supabase/admin.ts`), altijd met een `user_id` uit de sessie en nooit uit de invoer.

| Tabel | Gebruiker leest | Gebruiker schrijft | Server (secret key) |
| --- | --- | --- | --- |
| `profiles` | eigen rij | eigen rij, **behalve** `automation_level` en `auto_send_consent_at` | agentniveau na betaalcheck |
| `search_profiles` | eigen | eigen (insert/update/delete) | planning claimen |
| `search_runs` | eigen | — | aanmaken, status |
| `matches` | eigen | alleen `status`, `status_changed_at` | aanmaken, scores |
| `opportunities` | alleen die aan jou gematcht zijn | — | ingest |
| `companies` | alle (ingelogd) | — | ingest |
| `outreach_messages` | eigen | tekstvelden, alleen zolang `draft`/`failed` | versturen, status |
| `credit_transactions` | eigen | — | alleen via `spend_credits`, `apply_payment_status`, `fail_search_run`, `apply_payment_reversal` |
| `payments` | eigen | — | aanmaken, status via Mollie |
| `rate_limits` | — | — | `hit_rate_limit` |

Gevonden en opgelost (migratie `20260929100000_production_hardening.sql`): gebruikers konden via de publieke API hun eigen `automation_level` op 3 zetten en zo automatisch versturen aanzetten zonder betaald pakket. Die kolommen zijn nu alleen via de server te wijzigen.

API-routes:

- `/api/search/runs/[id]`, `/api/activity` en `/api/account/export` werken alleen met de sessie (RLS).
- `/api/n8n/*` vereist `Authorization: Bearer <N8N_SECRET>`, met een timing-safe vergelijking.
- `/api/mollie/webhook` vertrouwt de inhoud niet: de status wordt altijd bij Mollie opgehaald (fetch-to-confirm) en het bedrag wordt gecontroleerd.

## Authenticatie en sessies

- Het wachtwoord moet minimaal 8 tekens lang zijn en mag maximaal 72 tekens zijn (bcrypt). Er zijn geen verplichte tekensoorten.
- Foutmeldingen bij inloggen, registreren en wachtwoord-reset verraden niet of een e-mailadres een account heeft.
- Wachtwoord vergeten werkt via een resetlink (PKCE, één uur geldig, alleen in dezelfde browser). Na een reset of wachtwoordwijziging worden andere sessies uitgelogd.
- De sessiecookies zijn `httpOnly`, `SameSite=Lax` en in productie `Secure` (`src/lib/supabase/cookieOptions.ts`). Er is geen browser-client voor Supabase.
- Redirects in e-mails gebruiken `APP_URL`. `/auth/callback` accepteert alleen interne paden, dus er is geen open redirect.
- Het demo-account kan niet betalen, geen echte e-mails versturen en geen echte zoekkosten maken (het levert altijd voorbeelddata). Het kan ook niet worden verwijderd en e-mail en wachtwoord zijn niet te wijzigen.

**In het Supabase-dashboard (productie) zelf instellen**, omdat `supabase/config.toml` alleen lokaal geldt:

- Authentication → Sign In / Providers → Email: **Confirm email aan**.
- Authentication → Policies: minimum password length **8**. Leaked password protection aan (Pro-plan).
- Authentication → URL Configuration: Site URL = `APP_URL`, Redirect URLs = `APP_URL/auth/callback`.
- Authentication → Rate Limits: standaardwaarden laten staan of strenger zetten.
- SMTP: een eigen afzender instellen (de ingebouwde Supabase-mail is alleen voor testen).

## Rate limiting

De limieten staan in de database (`hit_rate_limit`), met vaste vensters per gebruiker of IP-adres. Ze staan ingesteld in `src/lib/rateLimit.ts`. Faalt de database, dan laat de check het verzoek door (fail open).

| Actie | Limiet |
| --- | --- |
| Inloggen | 10 per 15 min per IP én per e-mailadres |
| Registreren | 5 per uur per IP |
| Wachtwoord-reset | 5 per uur per IP én per e-mailadres |
| Zoeken | 20 per uur per gebruiker (plus credits) |
| Cv-upload (AI) | 10 per uur |
| E-mailconcept (AI) | 30 per uur |
| E-mail versturen | 30 per uur, plus de daglimiet van de agent |
| Afrekenen | 10 per uur |
| E-mail/wachtwoord wijzigen, account verwijderen | 10 per uur |
| Data-export | 5 per uur |

Supabase Auth heeft daarnaast eigen limieten op inloggen en e-mails.

## Invoer en output

- Server actions valideren invoer met zod of expliciete checks (lengtes, uuid's, enums, URL's). Cv's worden gecontroleerd op PDF-magic bytes en een maximum van 5 MB.
- Foutmeldingen naar de gebruiker zijn generiek. Details gaan naar de serverlog. In productie toont Next.js geen stacktraces; de foutpagina's tonen alleen een `digest`-code.
- Request-limiet voor server actions: 6 MB (voor de cv-upload).

## Headers

Op elke response (`next.config.ts`): HSTS (2 jaar), `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin` en een `Permissions-Policy` die camera, microfoon, locatie en payment uitzet. `X-Powered-By` staat uit.

Content-Security-Policy (`src/lib/csp.ts`, gezet in `src/proxy.ts`) met een nieuwe nonce per request:

- Scripts mogen alleen draaien met de nonce plus `'strict-dynamic'`. Geïnjecteerde scripts worden dus geblokkeerd.
- Styles gebruiken `'unsafe-inline'`, omdat de code style-attributen gebruikt (animatievertragingen); een nonce kan die niet toestaan.
- Verder: `img-src 'self' data: blob:`, `connect-src 'self'`, `object-src 'none'`, `base-uri 'self'`, `form-action 'self' https://*.mollie.com` en `frame-ancestors 'none'`.
- De nonce gaat ook naar het inline script van next-themes.
- Komt er een externe dienst bij (analytics, Sentry, een CDN), voeg die dan toe in `src/lib/csp.ts`, anders blokkeert de browser hem.

## Secrets

- Alleen `NEXT_PUBLIC_SUPABASE_URL` en `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` komen in de browserbundle. Beide zijn publiek bedoeld.
- `.env*` staat in `.gitignore`. Er is nooit een `.env` gecommit. De werkboom en de volledige git-historie zijn gescand op API-keys (OpenAI, Anthropic, Mollie, Supabase, Apify, JWT's, private keys): niets gevonden.
- Gebruik aparte keys voor development, staging en productie. Vervang een key die ooit gedeeld is.

## Afhankelijkheden

`npm audit`: 0 kwetsbaarheden (29-09-2026). Draai dit opnieuw voor elke release.
