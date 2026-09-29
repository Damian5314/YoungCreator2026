# Operations — monitoring, back-ups en incidenten

## Health check

`GET /api/health`

- Zonder token krijg je `200 { ok: true }` als de app en de database werken, anders `503`. Gebruik deze URL voor uptime-monitoring.
- Met `Authorization: Bearer <N8N_SECRET>` krijg je ook de status van migraties, n8n, Mollie en AI, plus waarschuwingen over halve configuraties.

## Logs

Alle serverlogs gaan naar Vercel (Project → Logs). Elke regel begint met een vaste prefix, zodat je snel kunt filteren:

| Prefix | Wat |
| --- | --- |
| `[startRun]`, `[scheduler]`, `[n8n]`, `[ingest]` | zoekopdrachten en n8n |
| `[billing]`, `[mollie]` | betalingen en webhooks |
| `[outreach]` | e-mails schrijven en versturen |
| `[auth]`, `[account]` | inloggen, reset, accountverwijdering |
| `[rate-limit]` | een limietcheck die faalde (de app laat het verzoek dan door) |

Foutpagina's tonen een foutcode (`digest`). Zoek die code in de Vercel-logs om de bijbehorende stacktrace te vinden.

## Back-ups en herstel

Supabase maakt dagelijks back-ups: 7 dagen op het Pro-plan, met point-in-time recovery als add-on. Doe de volgende stappen vóór de lancering, en daarna elk kwartaal:

1. Controleer in Supabase → Database → Backups dat er back-ups zijn en hoe lang ze bewaard blijven.
2. **Test een herstel.** Maak een nieuw, tijdelijk Supabase-project, zet een back-up terug (of `pg_dump` van productie → `psql` in het testproject), draai de app lokaal tegen dat project en log in met een testaccount.
3. Leg de datum en uitkomst van de test hieronder vast.

Cv's staan in Supabase Storage (bucket `cvs`). Storage valt **niet** onder de database-back-ups. Accepteer dat verlies (de student kan zijn cv opnieuw uploaden), of kopieer de bucket periodiek.

| Datum | Hersteltest | Door | Uitkomst |
| --- | --- | --- | --- |
| _nog niet gedaan_ | | | |

## Incidentprocedure

**1. Vaststellen (binnen 15 minuten)**

- Check `/api/health`, de Vercel-logs, Supabase (Database → Reports) en de Mollie- en n8n-dashboards.
- Bepaal de ernst:
  - **P1**: niemand kan inloggen of betalen, er gaan e-mails verkeerd uit, of er is een datalek.
  - **P2**: een onderdeel werkt niet (zoeken, versturen).
  - **P3**: iets hapert, maar er is een omweg.

**2. Stoppen van schade**

- Er gaan verkeerde e-mails uit: zet in Vercel `N8N_SEND_EMAIL_WEBHOOK_URL` leeg en redeploy. Er wordt dan niets meer automatisch verstuurd.
- Zoekopdrachten lopen mis of kosten te veel: zet `N8N_SEARCH_WEBHOOK_URL` leeg. De app valt dan terug op demodata; zet de scheduler-workflow in n8n uit.
- Betalingen gaan mis: zet `MOLLIE_API_KEY` leeg. Kopen staat dan uit en de rest werkt door.
- Een secret is gelekt: vervang de key bij de provider, zet de nieuwe in Vercel en redeploy.

**3. Herstellen**

- Draai terug naar de vorige werkende deploy (Vercel → Deployments → Promote), of los het op en deploy opnieuw.
- Mislukte runs geven hun credits automatisch terug. Controleer bij betalingen dat `payments` en `credit_transactions` kloppen met Mollie.

**4. Communiceren**

- Bij een P1 informeer je de getroffen gebruikers per e-mail vanaf info@techtable.nl.
- **Datalek met persoonsgegevens:** meld het binnen 72 uur bij de Autoriteit Persoonsgegevens. Informeer gebruikers als het risico hoog is.

**5. Nazorg**

Schrijf binnen een week een korte evaluatie: wat gebeurde er, waarom, wat is er aangepast. Zet een link erheen in de tabel hieronder.

| Datum | Ernst | Wat | Evaluatie |
| --- | --- | --- | --- |
| | | | |
