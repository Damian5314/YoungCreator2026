# n8n-koppeling

De app doet profiel, scoren, matches, e-mails schrijven, credits en planning zelf.
n8n hoeft alleen **te zoeken** (bijvoorbeeld met Apify) en **e-mails te versturen**.
Zolang n8n niet gekoppeld is draait de app in **demo-modus**: een zoekopdracht levert dan voorbeeldkansen op die tegen het echte profiel worden gescoord.

```
Student ── zoekt ──▶ App ── (1) zoek-webhook ──▶ n8n ── Apify / nieuws / events ──┐
                      ▲                                                          │
                      └──────────── (2) POST /api/n8n/results ◀──────────────────┘
n8n Schedule Trigger ── (3) POST /api/n8n/scheduler (elke 15 min) ──▶ App
App ── (4) verstuur-webhook ──▶ n8n ── Gmail / SMTP ──▶ contactpersoon
```

## Snelstart (± 30 minuten)

Alles in de app is klaar; je hoeft alleen accounts te koppelen.

1. **Database:** draai de migraties in `supabase/migrations/` (Supabase → SQL editor, in volgorde, of `supabase db push`).
2. **`.env.local`:** vul in volgens `.env.example`, minimaal `SUPABASE_SECRET_KEY`, `N8N_SECRET` en `APP_URL`. AI: `OPENAI_API_KEY` (of `ANTHROPIC_API_KEY`).
3. **Check:** open `http://localhost:3000/api/health`. Dat laat zien wat er gekoppeld is (database, migraties, n8n, AI), zonder geheimen.
4. **Eerst lokaal testen zonder n8n:** `npm run mock:n8n` in een tweede terminal (zie "Testen zonder n8n" onderaan).
5. **n8n:** importeer de drie workflows uit de map `n8n/` (Workflows → Import from File):
   - `jobhunter-search.json` — zoeken via Apify (Google Search + contactgegevens)
   - `jobhunter-send-email.json` — mail versturen via Gmail
   - `jobhunter-scheduler.json` — elke 15 minuten geplande zoekopdrachten starten
6. **Credentials in n8n** (zie hieronder) koppelen aan de nodes, workflows activeren, en de productie-webhook-URL's in `.env.local` zetten.

| n8n-credential (type **Header Auth**) | Name | Value | Gebruikt in |
|---|---|---|---|
| JobHunter → n8n | `x-jobhunter-secret` | je `N8N_SECRET` | beide Webhook-nodes |
| n8n → JobHunter | `Authorization` | `Bearer <N8N_SECRET>` | "Send results to app", "Report failure to app", "Run due searches" |
| Apify | `Authorization` | `Bearer <Apify API token>` | "Apify: Google Search", "Apify: Contact details" |
| Gmail (OAuth2) | — | inloggen met het afzendaccount | "Gmail: send" |

In `jobhunter-scheduler.json`: vervang `https://JOUW-APP-URL` door je `APP_URL`.
Liever SMTP dan Gmail? Vervang de Gmail-node door een "Send Email"-node met dezelfde velden (to, subject, text, reply-to).

Kosten Apify: de zoek-workflow gebruikt `apify/google-search-scraper` (±15 zoektermen per run) en `vdrmota/contact-info-scraper` (max. 10 bedrijfssites per run).

## AI: OpenAI of Claude

De app doet alle AI zelf (cv uitlezen, zoekresultaten opschonen, scoren, mails schrijven):

- `OPENAI_API_KEY` → OpenAI (`OPENAI_MODEL`, standaard `gpt-5-mini`; `OPENAI_BASE_URL` voor een compatibele API).
- `ANTHROPIC_API_KEY` → Claude (`ANTHROPIC_MODEL`).
- Beide ingevuld? `AI_PROVIDER=openai|anthropic` kiest. Geen van beide: alles werkt met regels en sjablonen.

## 0. Eenmalig

1. Draai de migraties in `supabase/migrations/` (Supabase dashboard → SQL editor, in volgorde, of `supabase db push`).
2. Vul `.env.local` in (zie `.env.example`): `SUPABASE_SECRET_KEY`, `APP_URL`, `N8N_SECRET` en straks de twee webhook-URL's. `ANTHROPIC_API_KEY` is optioneel.
3. Maak in n8n een credential **Header Auth** met naam `x-jobhunter-secret` en als waarde je `N8N_SECRET`.
   Gebruik die op beide Webhook-nodes (1 en 4).
4. Maak in n8n een credential **Header Auth** met naam `Authorization` en waarde `Bearer <N8N_SECRET>`.
   Gebruik die op de HTTP Request-nodes die de app aanroepen (2 en 3).

> n8n cloud kan `localhost` niet bereiken. Test lokaal met een tunnel (`ngrok http 3000`) en zet die URL in `APP_URL`, of test tegen de Vercel-deploy.

## 1. Workflow "Zoeken" — Webhook (POST) → zoeken → resultaten terugsturen

Zet de productie-URL van de Webhook-node in `N8N_SEARCH_WEBHOOK_URL`.
Laat de webhook **meteen antwoorden**. De app wacht maximaal 20 seconden en het zoeken zelf mag langer duren.
Het simpelst is "Respond: Immediately".
Wil je het execution-id bij de run zien, zet dan "Respond: Using 'Respond to Webhook' node" en plaats direct na de webhook een Respond to Webhook-node met `{ "executionId": "{{$execution.id}}" }`.

De app stuurt:

```json
{
  "runId": "5d0c7c1e-…",
  "trigger": "manual",
  "callbackUrl": "https://jouw-app.vercel.app/api/n8n/results",
  "profile": {
    "name": "Anna", "degree": "MSc", "fieldOfStudy": "Robotics", "university": "TU Delft",
    "skills": ["Python", "ROS"], "interests": ["Robotics", "AI"], "languages": ["English (C1)"],
    "ambitions": "…", "recentCuriosity": "…", "cvSummary": "…", "searchYearEndsOn": "2027-06-30",
    "preferences": {
      "desiredRoles": ["Robotics Engineer"], "opportunityTypes": ["hackathon", "internship"],
      "locations": ["Rotterdam"], "industries": ["Robotics"], "remoteOnly": false, "minSalary": null
    }
  },
  "options": { "includeHiddenOpportunities": true, "includeCompanyHunting": true, "maxResults": 30 },
  "searchQueries": ["Robotics Engineer Rotterdam", "Robotics hackathon Netherlands", "Robotics startups Rotterdam", "…"]
}
```

Er gaat geen e-mailadres of user-id mee: `runId` is genoeg.
`searchQueries` zijn kant-en-klare zoektermen, bijvoorbeeld voor Apify (Google Search, LinkedIn Jobs, Eventbrite of Meetup scrapers) of Google News RSS.
`searchPlan` bevat dezelfde zoektermen met hun soort: `[{ "query": "Robotics hackathon Netherlands", "kind": "hackathon" }, …]`.
`kind` is `job`, `internship`, `event`, `hackathon`, `startup` of `news` (bedrijfsnieuws dat op groei wijst). Stuur `kind` en `query` mee terug bij elk resultaat.

## 2. Resultaten terugsturen — `POST {callbackUrl}`

HTTP Request-node: method POST, URL `{{$json.callbackUrl}}` (uit stap 1), Header Auth `Authorization: Bearer <N8N_SECRET>`, body JSON:

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
**Ruwe zoekresultaten zijn prima:** `{ "title", "url", "description", "kind", "query" }` is genoeg. De app vult `company`, `type`, locatie, "why now"-signalen en de bron zelf aan (met AI, of met regels: bedrijf uit het domein of uit een LinkedIn/Indeed-titel). Irrelevante hits (Wikipedia, YouTube, lijstjes) vallen af.
Al het andere is optioneel. De app is ruim in wat hij accepteert:

| Veld | Waarden |
|---|---|
| `type` | `job`, `internship`, `traineeship`, `thesis`, `working-student`, `part-time`, `freelance`, `open-application`, `event`, `hackathon`, `conference`, `networking`, `project`, `research`, `startup`. Ook synoniemen zoals `vacature`, `stage`, `meetup`, `workshop`. Onbekend wordt `job`. |
| `source` | `linkedin`, `indeed`, `glassdoor`, `company-career-page`, `radar`, `news`, `event-platform`, `startup-database`, `web`. Ook `eventbrite`, `meetup`, `crunchbase`, `apify` enz. Onbekend wordt `web`. |
| `requiredSkills`, `signals` | lijst of komma-string (`"Python, ROS"`) |
| `startsAt`, `postedAt` | ISO-datum of timestamp |
| `isHidden` | `true` = nog geen vacature (radar: bedrijf groeit, maar heeft niets gepost) |
| `externalId` | id bij de bron; zonder dit veld is de url de sleutel. Opnieuw aanleveren werkt de kans bij in plaats van hem te dupliceren. |
| `contact.email` | nodig om een mail te kunnen sturen; ongeldige adressen worden genegeerd |
| `match` | optioneel `{ "score": 0-100, "reasons": ["…"] }` als je in n8n zelf al met AI scoort. Anders scoort de app (Claude, of regels zonder API-key). |

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

Runs die na 30 minuten nog geen `done: true` hebben, worden automatisch op `failed` gezet en de credit gaat terug.

## 3. Workflow "Planning" — Schedule Trigger → HTTP Request

- Schedule Trigger: elke 15 minuten.
- HTTP Request: `POST {APP_URL}/api/n8n/scheduler` met `Authorization: Bearer <N8N_SECRET>`, zonder body.

De app start een run voor elk zoekprofiel waarvan de geplande tijd voorbij is (de student stelt dat in op het dashboard) en roept daarvoor gewoon webhook 1 aan.
Antwoord: `{ "ok": true, "started": 2, "expiredRuns": 0, "results": [...] }`.

## 4. Workflow "E-mail versturen" — Webhook (POST) → Gmail/SMTP → Respond

Zet de productie-URL in `N8N_SEND_EMAIL_WEBHOOK_URL`.
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

- Verstuur als platte tekst, met `from.name` als afzendernaam en `replyTo` als Reply-To, zodat antwoorden bij de student terechtkomen.
- Antwoord **pas na het versturen**, met een "Respond to Webhook"-node en status 200. Elke andere status (of een timeout na 20 seconden) zet de mail op `failed`, met de foutmelding zichtbaar voor de student.
- De app bewaakt de limieten zelf: niveau 3 max. de ingestelde daglimiet (standaard 3), handmatig max. 25 per 24 uur.

## Testen zonder n8n

**Mock-n8n (aanrader):** test de échte koppeling (webhooks, geheim, terugsturen, mail versturen) zonder n8n of Apify.

1. Zet in `.env.local`:
   ```
   N8N_SEARCH_WEBHOOK_URL=http://localhost:5679/webhook/jobhunter-search
   N8N_SEND_EMAIL_WEBHOOK_URL=http://localhost:5679/webhook/jobhunter-send-email
   N8N_SECRET=een-lange-random-string
   APP_URL=http://localhost:3000
   ```
2. Herstart `npm run dev` en start in een tweede terminal `npm run mock:n8n`.
3. Klik in de app op **Search**. De mock stuurt ruwe resultaten terug (LinkedIn-vacature, event, bedrijfsnieuws, startup, sommige met e-mailadres). "Approve & send" logt de mail in de mock-terminal in plaats van hem te versturen.

Zonder mock:

- Laat `N8N_SEARCH_WEBHOOK_URL` leeg: zoeken werkt in demo-modus met voorbeeldkansen (`src/modules/pipeline/demoItems.ts`, ook een voorbeeld van het item-formaat hierboven).
- Resultaten-endpoint met de hand testen (vul een bestaande `runId` in met status `running`):

```bash
curl -X POST "$APP_URL/api/n8n/results" \
  -H "Authorization: Bearer $N8N_SECRET" -H "content-type: application/json" \
  -d '{"runId":"<run-id>","items":[{"title":"Test meetup","url":"https://example.com/m","company":"Acme","type":"meetup"}]}'
```
