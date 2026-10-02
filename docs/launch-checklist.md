# Unlisted: launch checklist

Stand: 2 oktober 2026. Gebaseerd op [production-readiness-audit.md](production-readiness-audit.md).
Afgevinkt = gebouwd en gecontroleerd. Open = moet nog gebeuren. Bij open punten staat erachter wat er nodig is.

Legenda achter open punten:

- **(beslissing)**: jouw keuze of input nodig
- **(account)**: een dienst of abonnement op naam van TechTable
- **(bouwen)**: kan zonder input gebouwd worden
- **(testen)**: handmatig doorlopen

---

## 0. Vóór de eerste productie-deploy

- [ ] Migratie `supabase/migrations/20260929100000_production_hardening.sql` draaien op de productiedatabase (anders werkt afrekenen niet)
- [ ] Migratie `supabase/migrations/20261002100000_outreach_suppressions.sql` draaien (anders faalt versturen via Unlisted)
- [ ] `APP_URL` op het productiedomein zetten: canonical-URL's, sitemap, deellinks en afmeldlinks gebruiken hem
- [ ] Alle migraties in `supabase/migrations` op volgorde gedraaid; `GET /api/health` met `Authorization: Bearer <N8N_SECRET>` geeft overal `ok`
- [ ] Juridische review van privacybeleid en algemene voorwaarden (consumentenrecht, herroeping, aansprakelijkheid) **(beslissing)**
- [ ] Aannames bevestigen: 21% btw, minimumleeftijd 16, reactietijd support 2 werkdagen, telefonisch bereikbaar tijdens kantooruren **(beslissing)**

## 1. Infrastructuur (TechTable)

- [ ] Apify-account op naam van TechTable aanmaken en de API-token in de n8n-zoekworkflow zetten **(account)**
- [ ] Supabase-productieproject op naam van TechTable aanmaken, de migraties draaien en de keys in de productie-env zetten **(account)**
- [ ] n8n-workflows (`n8n/*.json`) importeren op de VPS, credentials instellen en `N8N_SEARCH_WEBHOOK_URL` en `N8N_SEND_EMAIL_WEBHOOK_URL` naar de VPS laten wijzen **(account)**
- [ ] Domein unlisted.nl kopen op naam van TechTable, koppelen aan Vercel en `APP_URL` bijwerken **(account)**
- [ ] Omgevingen scheiden: development, staging en productie, elk met een eigen database, keys, Mollie-key, webhook-secret en mailaccount **(account)**
- [ ] Mollie live-key aanvragen en instellen (nu test-key) **(account)**

## 2. Legal en privacy

- [x] Privacybeleid (`/privacy`)
- [x] Algemene voorwaarden (`/terms`)
- [x] Bedrijfsgegevens TechTable in de footer, op het betaalbewijs en op de contactpagina
- [x] Publieke prijzen incl. btw (`/pricing`)
- [x] Herroeping: verplicht vinkje bij het afrekenen, tijdstip opgeslagen, regels in de voorwaarden en op `/pricing`
- [x] Akkoord met voorwaarden en privacybeleid bij registratie
- [x] Cookies: alleen functioneel (sessie, taal, splash), geen banner nodig
- [x] AI- en profileringsuitleg (privacybeleid, bij elke match, onder elk e-mailconcept)
- [ ] Formele facturen met doorlopend factuurnummer, of bevestigen dat het betaalbewijs volstaat **(beslissing)**
- [ ] Verwerkersovereenkomsten afsluiten met Supabase, Vercel, OpenAI/Anthropic, Apify, n8n, Google en Mollie; controleren dat AI-providers niet trainen op de data **(account)**

## 3. Accounts

- [ ] E-mailverificatie: code is klaar; **"Confirm email" aanzetten in het Supabase-dashboard** **(account)**
- [ ] Eigen SMTP-afzender in Supabase voor bevestigings- en resetmails (bijv. noreply@unlisted.nl) **(beslissing)**
- [ ] Supabase-dashboard: minimum password length 8, leaked password protection aan (Pro-plan), Site URL en Redirect URLs op `APP_URL` **(account)**
- [x] Wachtwoord vergeten (`/forgot-password` → mail → `/reset-password`)
- [x] Wachtwoord wijzigen (minimaal 8 tekens, andere sessies worden uitgelogd)
- [x] Uitloggen
- [x] Account verwijderen (Instellingen; stopt runs, verwijdert het cv, betalingen blijven anoniem bewaard)
- [x] Persoonsgegevens exporteren (Instellingen → Je gegevens)

## 4. Product

- [x] Onboarding (introductie na de eerste login)
- [x] Zoeken, met voortgang (queued → running → completed/failed) die een refresh overleeft
- [x] Resultaten, detailpagina, bronlinks en "Why this fits you"
- [x] E-mailconcepten schrijven en versturen (niveau 1 zelf, 2 goedkeuren, 3 automatisch met toestemming en daglimiet)
- [x] Toestand bij nul resultaten
- [x] Mislukte zoekopdracht → credit automatisch terug; vastgelopen runs na 30 minuten afgebroken
- [x] Brondatum bij elk resultaat (gepubliceerd of gevonden door de agent)
- [ ] Matchscore: percentage houden of vervangen door labels als "Strong / Good / Possible match", eventueel met een betrouwbaarheid per signaal **(beslissing)**

## 5. Billing

- [x] Prijzenpagina
- [x] Checkout via Mollie
- [x] Webhooks (fetch-to-confirm, bedragcontrole)
- [x] Idempotency (credits precies één keer bijgeschreven)
- [x] Creditgrootboek (`credit_transactions`)
- [x] Betaalbewijs per betaling met btw (`/billing/receipts/[id]`)
- [x] Refunds en chargebacks trekken credits één keer in

## 6. Security

- [x] Rate limiting (inloggen, registratie, reset, zoeken, AI, versturen, afrekenen, export)
- [x] Autorisatie-audit (lek met `automation_level` gedicht, zie [security.md](security.md))
- [x] Invoervalidatie en veilige foutmeldingen
- [x] Secret-audit (werkboom en git-historie schoon)
- [x] Veilige sessies (httpOnly, Secure, SameSite=Lax)
- [x] Security-headers
- [x] Dependency-audit (`npm audit`: 0 kwetsbaarheden)
- [x] Demo-account afgeschermd (geen betalingen, geen echte mails, geen zoekkosten, niet te verwijderen of over te nemen)
- [x] Strikte Content-Security-Policy met nonces
- [ ] `npm audit` opnieuw draaien vóór elke release **(testen)**

## 7. Operations

- [x] Logs met vaste prefixes (Vercel), zie [operations.md](operations.md)
- [x] Health-endpoint voor uptime (`/api/health`, 503 bij storing)
- [x] Incidentprocedure
- [ ] Error monitoring (bijv. Sentry) **(beslissing + account)**
- [ ] Uptime monitoring op `/api/health` (bijv. Better Stack of UptimeRobot) **(beslissing + account)**
- [ ] Database-back-ups (afhankelijk van het Supabase-plan) **(account)**
- [ ] Hersteltest gedaan en vastgelegd in operations.md **(testen)**
- [ ] Back-up van de cv-opslag (Supabase Storage valt niet onder de database-back-ups), of dat verlies accepteren **(beslissing)**
- [ ] Analytics kiezen: cookieloos (Vercel Analytics of Plausible, geen banner nodig) of GA4 (cookiebanner nodig) **(beslissing)**
- [ ] Intern dashboard voor gebruikers en omzet (bijv. Metabase op de VPS en/of een wekelijks n8n-rapport) **(beslissing)**

## 8. E-mail en outreach

- [ ] Mailprovider kiezen voor transactionele mails (bijv. Resend, Postmark of Google Workspace) **(beslissing)**
- [ ] Transactionele mails: welkom, betaalbevestiging met bon, credits toegevoegd, zoekopdracht klaar of mislukt, e-mail verstuurd of mislukt, melding bij verdachte login **(bouwen, na de keuze van de provider)**
- [ ] Afzenderdomein instellen voor outreach (SPF, DKIM, DMARC) zodat mails niet in spam belanden **(account)**
- [x] Suppressielijst: afgemelde adressen krijgen via Unlisted nooit meer mail
- [x] Afmeldlink (ondertekend) onder elke mail die Unlisted verstuurt, met bevestigingspagina `/unsubscribe`
- [ ] Bounces en spamklachten verwerken (terugkoppeling vanuit de mailprovider) **(bouwen, na de keuze van de provider)**

## 9. UX

- [x] Mobiel (publieke pagina's getest op 320–1280px, NL en EN)
- [x] Toegankelijkheid (axe schoon op publieke pagina's, skip-link, focusringen, labels)
- [x] Loading states
- [x] Error states (404, foutpagina's, global error)
- [x] Empty states
- [x] Support (`/contact`)
- [x] FAQ (`/faq`)
- [ ] Ingelogde app op mobiel en met toetsenbord/screenreader testen (dashboard, zoeken, kansen, outreach, billing, instellingen) **(testen)**

## 10. Marketing en homepage

- [x] Voorbeeldkaarten in de hero gemarkeerd als "Voorbeeld"
- [ ] Claim "Trusted by students from top universities" onderbouwen of vervangen door "Built for students at universities such as…" **(beslissing)**
- [ ] Namen of logo's van universiteiten: toestemming, of weghalen **(beslissing)**
- [ ] Marketingclaims aanscherpen ("before everyone else sees them" → "early signals that may indicate…") **(beslissing)**
- [x] Demo-account zichtbaar gemarkeerd in de app (`DEMO`-label)
- [x] Demo-account ruimt bij inloggen data ouder dan 24 uur op

## 11. SEO

- [x] Paginatitels en beschrijvingen (metadata per pagina)
- [x] Favicon
- [x] Nederlandse URL's (`/nl/...`) met hreflang, zodat Google beide talen kan indexeren; de taalschakelaar wisselt de URL mee
- [x] `robots.txt` en `sitemap.xml` (beide talen, met alternates)
- [x] OpenGraph- en Twitter-afbeelding voor delen (gegenereerd)
- [x] Canonical URL's (volgen `APP_URL` automatisch)
- [x] Structured data: Organization, WebSite, SoftwareApplication met de echte prijzen, FAQPage, BreadcrumbList
- [x] `llms.txt` voor AI-assistenten
- [x] App, login en hulpschermen op `noindex`
- [ ] Google Search Console en Bing Webmaster Tools koppelen en de sitemap indienen (na het domein) **(account)**
- [ ] Kennisbank met een paar sterke artikelen voor studentenzoekvragen (zoekjaar, stage zonder Nederlands, open sollicitatie) **(beslissing: onderwerpen)**
- [ ] Een handvol landingspagina's per zoekintentie of stad (alleen met echte, unieke inhoud) **(beslissing)**

## 12. Productie-acceptatietest

Deze volledige flow moet op productie werken zonder handmatige fixes **(testen)**:

- [ ] Registreren → e-mail bevestigen → onboarding → profiel en cv
- [ ] Eerste gratis zoekopdracht → voortgang → resultaten → kans openen
- [ ] E-mail laten schrijven → aanpassen → versturen of als verstuurd markeren
- [ ] Credits op → `/billing` → checkout → betaling gelukt → credits bijgeschreven → betaalbewijs
- [ ] Tweede zoekopdracht met gekochte credit
- [ ] Wachtwoord vergeten → resetten → opnieuw inloggen
- [ ] Gegevens exporteren → account verwijderen

Faalscenario's:

- [ ] AI-timeout en n8n/Apify-timeout (run faalt, credit terug)
- [ ] Mislukte en geannuleerde betaling; dubbele Mollie-webhook
- [ ] Refund in Mollie → credits ingetrokken
- [ ] Twee zoekopdrachten tegelijk met één credit (maar één mag slagen)
- [ ] Browser verversen tijdens een zoekopdracht
- [ ] Account verwijderen terwijl er een zoekopdracht loopt
- [ ] Rate limits: te vaak inloggen of resetten geeft een nette melding
- [ ] Verlopen sessie tijdens een actie
