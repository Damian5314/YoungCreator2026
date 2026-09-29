# n8n-koppeling

De app doet profiel, scoren, matches, e-mails schrijven, credits en planning zelf.
n8n hoeft alleen **te zoeken** (met Apify) en **e-mails te versturen**.
Zolang n8n niet gekoppeld is draait de app in **demo-modus**: een zoekopdracht levert dan voorbeeldkansen op die tegen het echte profiel worden gescoord.

```
Student ── zoekt ──▶ App ── (1) zoek-webhook ──▶ n8n ── Apify: Google Search + contactgegevens ──┐
                      ▲                                                                         │
                      └──────────────────── (2) POST /api/n8n/results ◀─────────────────────────┘
n8n Schedule Trigger ── (3) POST /api/n8n/scheduler (elke 30 min) ──▶ App
App ── (4) verstuur-webhook ──▶ n8n ── Gmail ──▶ contactpersoon
```

## Demo-checklist: wat vul je waar in

De workflows in `n8n/` zijn kant-en-klaar. Je hoeft alleen accounts, keys en credentials te koppelen.

| Wat | Waar haal je het | Waar vul je het in |
|---|---|---|
| Supabase URL, publishable key, secret key | Supabase → Project Settings → API Keys | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY` |
| `N8N_SECRET` | zelf maken: `openssl rand -hex 32` | env van de app + twee n8n-credentials (zie stap 5) |
| `APP_URL` | je Vercel-URL (of een ngrok-tunnel naar `localhost:3000`) | env van de app + URL in de workflow "Planning" |
| Apify API token | Apify Console → Settings → API & Integrations | n8n-credential "Apify" |
| Gmail-account (afzender) | — | n8n-credential Gmail OAuth2 |
| Webhook-URL's | n8n, na het publiceren (Production URL) | `N8N_SEARCH_WEBHOOK_URL`, `N8N_SEND_EMAIL_WEBHOOK_URL` |
| AI-key (optioneel) | OpenAI of Anthropic | `OPENAI_API_KEY` of `ANTHROPIC_API_KEY` |

"Env van de app" = `.env.local` (lokaal) of Vercel → Settings → Environment Variables (deploy). Zie `.env.example`.

1. **Database:** draai de migraties in `supabase/migrations/` (Supabase → SQL editor, in volgorde, of `supabase db push`).
2. **Env van de app:** vul alles uit de tabel in behalve de webhook-URL's (die komen in stap 7).
3. **Eerst lokaal testen zonder n8n:** `npm run mock:n8n` (zie "Testen zonder n8n" onderaan).
4. **n8n → Workflows → Import from File**, drie keer:
   - `jobhunter-search.json` — zoeken via Apify (Google Search + contactgegevens)
   - `jobhunter-send-email.json` — mail versturen via Gmail
   - `jobhunter-scheduler.json` — elke 30 minuten geplande zoekopdrachten starten
5. **Credentials** aanmaken en op de nodes selecteren (elke workflow heeft ook een notitie met deze lijst):

   | n8n-credential | Type | Name | Value | Nodes |
   |---|---|---|---|---|
   | JobHunter → n8n | Header Auth | `x-jobhunter-secret` | je `N8N_SECRET` | "Webhook: search request", "Webhook: send email" |
   | n8n → JobHunter | Header Auth | `Authorization` | `Bearer <N8N_SECRET>` | "Send results to app", "Report failure to app", "Run due searches" |
   | Apify | Header Auth | `Authorization` | `Bearer <Apify API token>` | "Apify: Google Search", "Apify: Contact details" |
   | Gmail | Gmail OAuth2 | — | inloggen met het afzendaccount | "Gmail: send" |

   Op n8n cloud is Gmail één klik ("Sign in with Google"). Self-hosted heb je een eigen Google Cloud OAuth-client nodig (Gmail API aan, redirect-URL uit n8n).
6. **Planning:** vervang in de node "Run due searches" `https://JOUW-APP-URL` door je `APP_URL`.
7. **Publiceren:** publiceer alle drie de workflows (**Publish**; in n8n-versies vóór 2.0 heet dit **Active**). Pas daarna bestaat de Production URL. Kopieer de **Production URL** van beide webhooks (`…/webhook/jobhunter-search` en `…/webhook/jobhunter-send-email`, niet `/webhook-test/`) naar `N8N_SEARCH_WEBHOOK_URL` en `N8N_SEND_EMAIL_WEBHOOK_URL`. Herstart de dev-server of redeploy.
8. **Check:** vraag `{APP_URL}/api/health` op met de header `Authorization: Bearer <N8N_SECRET>` (bijv. `curl -H "Authorization: Bearer …" {APP_URL}/api/health`). `mode` moet `n8n` zijn, zonder waarschuwingen. Klik daarna in de app op **Search** en volg de run in n8n → Executions.

> n8n cloud kan `localhost` niet bereiken. Test lokaal met een tunnel (`ngrok http 3000`) en zet die URL in `APP_URL`, of test tegen de Vercel-deploy.
> Ook een zelf-gehoste n8n kan callbacks naar `localhost`/privé-adressen blokkeren (SSRF-bescherming, strenger vanaf n8n 3.0). Gebruik dus altijd een publieke `APP_URL`.

> **n8n Cloud-limieten:**
> - Een **trial** stopt executions na 180 seconden. De zoek-workflow wacht op twee Apify-runs (max. 240 s + 180 s) en kan daar dus op afbreken; de app zet de run dan na 30 minuten op failed en geeft de credit terug. Test op een betaald plan, zelf-gehost, of met de mock.
> - **Starter** heeft 2.500 executions per maand. Daarom draait de planning elke 30 minuten (elke 15 min ≈ 2.900 per maand).

> **Let op bij de demo:** de contact-scraper vindt echte adressen van echte bedrijven. Op niveau 3 verstuurt de agent zelf mails. Gebruik in de demo niveau 2 (goedkeuren) en zet bij "Approve & send" zo nodig je eigen adres als ontvanger.

## AI: OpenAI of Claude

De app doet alle AI zelf (cv uitlezen, zoekresultaten opschonen, scoren, mails schrijven):

- `OPENAI_API_KEY` → OpenAI (`OPENAI_MODEL`, standaard `gpt-5-mini`; `OPENAI_BASE_URL` voor een compatibele API).
- `ANTHROPIC_API_KEY` → Claude (`ANTHROPIC_MODEL`).
- Beide ingevuld? `AI_PROVIDER=openai|anthropic` kiest. Geen van beide: alles werkt met regels en sjablonen.

## Apify in de zoek-workflow

Beide stappen gebruiken `POST https://api.apify.com/v2/actors/<gebruiker>~<actor>/run-sync-get-dataset-items` met `Authorization: Bearer <token>`.
Zo'n synchrone aanroep wacht maximaal 300 seconden (daarna `408`). Daarom krijgt elke run een eigen `?timeout=` in seconden (240 en 180).

1. **`apify/google-search-scraper`**: alle zoektermen uit `searchPlan` als één tekst (één per regel), met `countryCode: "nl"`, `languageCode: "en"` en `maxPagesPerQuery: 1` (± 10 resultaten per zoekterm).
   Apify geeft één record per resultatenpagina: `searchQuery.term` + `organicResults[]` met `title`, `url` en `description`.
   De workflow neemt om en om resultaten per zoekterm (max. 60, zonder dubbele url's) en zet `kind` en `query` erbij.
2. **`vdrmota/contact-info-scraper`**: max. 10 eigen bedrijfssites uit die resultaten (geen jobboards, eventplatforms, social media of nieuwssites).
   Invoer: `maxDepth: 1`, `maxRequestsPerStartUrl: 4`, `maxRequests: 40`, `mergeContacts: true` en `proxyConfig` (verplicht veld).
   Output: per site één rij met `emails[]`. Het beste adres (jobs@/careers@ vóór info@, eigen domein eerst) komt in `contact.email`.
   Mislukt deze stap, dan gaan de resultaten zonder contactgegevens naar de app.

Mislukt de Google-stap (bijvoorbeeld `401` token fout, `402` tegoed op, `408` timeout), dan stuurt "Report failure to app" een `error` naar de app. De run faalt en de credit gaat terug.

**Kosten** (pay-per-event, Apify-prijzen september 2026 op het Free-plan; check de pricing-tab van beide actors):

- Google: ± $0,0045 per resultatenpagina + $0,001 per start → ± $0,07 per zoekopdracht (15 zoektermen).
- Contactgegevens: ± $0,002 per gescande pagina → max. ± $0,09 per zoekopdracht (40 pagina's).
- Samen max. ± $0,16 per zoekopdracht. Met het gratis tegoed van $5 zijn dat ± 30 zoekopdrachten.

## 1. Workflow "Zoeken" — Webhook (POST) → zoeken → resultaten terugsturen

De Webhook-node (Header Auth) antwoordt **meteen** via de node "Respond: accepted" met `{ "executionId": "…" }`. De app wacht maximaal 20 seconden, het zoeken zelf mag langer duren.

De app stuurt:

```json
{
  "runId": "5d0c7c1e-…",
  "trigger": "manual",
  "callbackUrl": "https://jouw-app.vercel.app/api/n8n/results",
  "profile": {
    "name": "Anna", "nationality": "Polish", "degree": "MSc", "fieldOfStudy": "Robotics", "university": "TU Delft",
    "graduationYear": 2027, "skills": ["Python", "ROS"], "interests": ["Robotics", "AI"], "languages": ["English (C1)"],
    "ambitions": "…", "recentCuriosity": "…", "cvSummary": "…", "searchYearEndsOn": "2027-06-30",
    "preferences": {
      "desiredRoles": ["Robotics Engineer"], "opportunityTypes": ["hackathon", "internship"],
      "locations": ["Rotterdam"], "industries": ["Robotics"], "remoteOnly": false, "minSalary": null
    }
  },
  "options": { "includeHiddenOpportunities": true, "includeCompanyHunting": true, "maxResults": 30 },
  "searchQueries": ["site:nordwind.nl (careers OR jobs OR vacatures OR internship)", "Robotics Engineer Rotterdam", "…"],
  "searchPlan": [
    { "query": "site:nordwind.nl (careers OR jobs OR vacatures OR internship)", "kind": "job" },
    { "query": "Robotics Engineer Rotterdam", "kind": "job" },
    { "query": "Robotics hackathon Netherlands", "kind": "hackathon" }
  ],
  "watchCompanies": [{ "name": "Nordwind Robotics", "domain": "nordwind.nl", "careerPageUrl": null }]
}
```

- Er gaat geen e-mailadres of user-id mee: `runId` is genoeg.
- `searchPlan` (max. 15) bevat de zoektermen met hun soort; `searchQueries` zijn dezelfde termen zonder soort.
  `kind` is `job`, `internship`, `event`, `hackathon`, `startup` of `news` (bedrijfsnieuws dat op groei wijst). Stuur `kind` en `query` mee terug bij elk resultaat.
- **Company Hunter:** `watchCompanies` zijn bedrijven die de student volgt (opgeslagen of benaderd, max. 5). Hun zoektermen (`site:<domein> (careers OR …)`) staan al vooraan in `searchPlan`. De workflow hoeft `watchCompanies` dus niet apart te gebruiken.

## 2. Resultaten terugsturen — `POST {callbackUrl}`

HTTP Request-node: method POST, URL `{{ $json.callbackUrl }}`, Header Auth `Authorization: Bearer <N8N_SECRET>`, body JSON.
De meegeleverde workflow stuurt ruwe resultaten: `{ "title", "url", "description", "kind", "query", "source": "web", "contact": { "email" } }` (contact alleen als gevonden).
Een volledig item mag ook:

```json
{
  "runId": "5d0c7c1e-…",
  "done": true,
  "items": [
    {
      "title": "Warehouse Robotics Hackathon",
      "url": "https://example.com/hackathon",
      "company": { "name": "Nordwind Robotics", "website": "https://nordwind.example", "industry": "Robotics", "location": "Rotterdam" },
      "type": "hackathon",
      "source": "event-platform",
      "location": "Rotterdam",
      "startsAt": "2026-10-09T16:00:00Z",
      "description": "24-hour hackathon on path planning…",
      "requiredSkills": ["Python", "ROS"],
      "signals": ["Opening a second test facility in Rotterdam"],
      "isHidden": false,
      "contact": { "name": "Sanne de Wit", "role": "Engineering Manager", "email": "sanne@nordwind.example", "url": "https://linkedin.com/in/…" }
    }
  ]
}
```

**Verplicht per item:** alleen `title` en `url` (http/https).
Bij ruwe resultaten vult de app `company`, `type`, locatie, "why now"-signalen en de bron zelf aan (met AI, of met regels: bedrijf uit het domein of uit een LinkedIn/Indeed-titel). Irrelevante hits (Wikipedia, YouTube, lijstjes) vallen af.
Al het andere is optioneel. De app is ruim in wat hij accepteert:

| Veld | Waarden |
|---|---|
| `type` | `job`, `internship`, `traineeship`, `thesis`, `working-student`, `part-time`, `freelance`, `open-application`, `event`, `hackathon`, `conference`, `networking`, `project`, `research`, `startup`. Ook synoniemen zoals `vacature`, `stage`, `meetup`, `workshop`. Onbekend of leeg: de app bepaalt het type (AI, of `kind`). |
| `source` | `linkedin`, `indeed`, `glassdoor`, `company-career-page`, `radar`, `news`, `event-platform`, `startup-database`, `web`. Ook `eventbrite`, `meetup`, `crunchbase`, `apify` enz. Onbekend wordt `web`; bij `web` leidt de app de bron af uit de url. |
| `requiredSkills`, `signals` | lijst of komma-string (`"Python, ROS"`) |
| `startsAt`, `postedAt` | ISO-datum of timestamp |
| `isHidden` | `true` = nog geen vacature (radar: bedrijf groeit, maar heeft niets gepost) |
| `externalId` | id bij de bron; zonder dit veld is de url de sleutel. Opnieuw aanleveren werkt de kans bij in plaats van hem te dupliceren. |
| `contact.email` | nodig om een mail te kunnen sturen; ongeldige adressen worden genegeerd |
| `match` | optioneel `{ "score": 0-100, "reasons": ["…"] }` als je in n8n zelf al scoort. Anders scoort de app (AI, of regels zonder API-key). |

- **In delen aanleveren?** Stuur `"done": false` bij tussenleveringen en `"done": true` bij de laatste.
- **Mislukt?** Stuur `{ "runId": "…", "items": [], "error": "Apify quota exceeded" }`. De run faalt en de credit gaat terug.

De app antwoordt meteen met `202`:

```json
{ "ok": true, "accepted": 11, "rejected": [{ "index": 3, "issues": ["url: url must be an http(s) URL"] }] }
```

Daarna, op de achtergrond, doet de app het volgende:

1. Kansen en bedrijven opslaan (zonder dubbelen).
2. Scoren tegen het profiel.
3. Matches aanmaken.
4. Voor de sterkste nieuwe matches (score ≥ 70, met e-mailadres) mails voorbereiden.
5. Op niveau 3 die mails ook versturen, binnen de daglimiet.

Runs die na 30 minuten nog geen `done: true` hebben, zet de app op `failed` en de credit gaat terug. Dat opruimen gebeurt bij elke aanroep van de planning (stap 3), dus alleen als die workflow actief is.

## 3. Workflow "Planning" — Schedule Trigger → HTTP Request

- Schedule Trigger: elke 30 minuten (15 mag op een eigen server of hoger plan).
- HTTP Request: `POST {APP_URL}/api/n8n/scheduler` met `Authorization: Bearer <N8N_SECRET>`, zonder body (timeout 120 s).

De app start een run voor elk zoekprofiel waarvan de geplande tijd voorbij is (de student stelt dat in op het dashboard) en roept daarvoor gewoon webhook 1 aan.
Antwoord: `{ "ok": true, "started": 2, "expiredRuns": 0, "results": [...] }`.

## 4. Workflow "E-mail versturen" — Webhook (POST) → Gmail → Respond

De app roept dit aan als de student op "Approve & send" klikt (niveau 2), of automatisch bij niveau 3:

```json
{
  "messageId": "…",
  "to": { "email": "sanne@nordwind.example", "name": "Sanne de Wit" },
  "subject": "Joining your robotics hackathon",
  "body": "Hi Sanne,\n\n…",
  "from": { "name": "Anna Kowalski" },
  "replyTo": { "email": "anna@student.nl", "name": "Anna Kowalski" },
  "sentBy": "user"
}
```

- De Gmail-node verstuurt platte tekst vanaf het gekoppelde Gmail-account, met `from.name` als afzendernaam en `replyTo` als Reply-To (in de Gmail-node heet die optie "Send Replies To"), zodat antwoorden bij de student terechtkomen.
- De workflow antwoordt **pas na het versturen**: `200` bij succes, `500` met de foutmelding als Gmail faalt. Elke andere status dan 2xx (of een timeout na 20 seconden) zet de mail op `failed`, met de foutmelding zichtbaar voor de student.
- Liever SMTP? Vervang de Gmail-node door een "Send Email"-node met dezelfde velden (to, subject, text, reply-to) en zet op die node ook "On Error → Continue (using error output)".
- De app bewaakt de limieten zelf: niveau 3 max. de ingestelde daglimiet (standaard 3), handmatig max. 25 per 24 uur.

## Testen zonder n8n

**Mock-n8n (aanrader):** test de echte koppeling (webhooks, geheim, terugsturen, mail versturen) zonder n8n of Apify.
De mock stuurt hetzelfde formaat terug als de echte workflow.

1. Zet in `.env.local`:
   ```
   N8N_SEARCH_WEBHOOK_URL=http://localhost:5679/webhook/jobhunter-search
   N8N_SEND_EMAIL_WEBHOOK_URL=http://localhost:5679/webhook/jobhunter-send-email
   N8N_SECRET=een-lange-random-string
   APP_URL=http://localhost:3000
   ```
2. Herstart `npm run dev` en start in een tweede terminal `npm run mock:n8n`.
3. Klik in de app op **Search**. De mock stuurt één ruw resultaat per zoekterm terug: LinkedIn-vacature, event, bedrijfsnieuws, startup (sommige met e-mailadres) en een career page voor elke `site:`-zoekterm (Company Hunter). "Approve & send" logt de mail in de mock-terminal in plaats van hem te versturen.
4. Foutpad: start de mock met `MOCK_N8N_FAIL=search npm run mock:n8n` (run faalt, credit terug) of `MOCK_N8N_FAIL=email npm run mock:n8n` (versturen geeft `500`, mail op `failed`).

Zonder mock:

- Laat `N8N_SEARCH_WEBHOOK_URL` leeg: zoeken werkt in demo-modus met voorbeeldkansen (`src/modules/pipeline/demoItems.ts`, ook een voorbeeld van het item-formaat hierboven).
- Resultaten-endpoint met de hand testen (vul een bestaande `runId` in met status `running`):

```bash
curl -X POST "$APP_URL/api/n8n/results" \
  -H "Authorization: Bearer $N8N_SECRET" -H "content-type: application/json" \
  -d '{"runId":"<run-id>","items":[{"title":"Test meetup","url":"https://example.com/m","company":"Acme","type":"meetup"}]}'
```
