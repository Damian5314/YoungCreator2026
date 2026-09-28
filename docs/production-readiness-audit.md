# Unlisted / Young Creator 2026 — Production Readiness Audit

Website: https://young-creator2026.vercel.app/  
Auditdatum: 28 september 2026

## Samenvatting

De publieke website heeft al een duidelijke propositie en ziet er qua structuur redelijk volwassen uit. De grootste risico's voor productie zitten niet meer alleen in de marketingwebsite, maar vooral in:

- authenticatie en account lifecycle;
- privacy / AVG;
- algemene voorwaarden;
- betalingen en credits;
- outreach / e-mailverzending;
- security;
- foutafhandeling;
- observability;
- betrouwbaarheid van achtergrondprocessen;
- duidelijkheid rond AI-generated opportunities.

De publieke kant is grofweg rond de 80% richting launch. De volledige production readiness ligt eerder rond de 50–60%, omdat de laatste fase vooral bestaat uit security, legal, payments, account lifecycle, monitoring en edge-cases.

> Belangrijk: de loginpagina bevat een demo-account via de knop **Use demo**. In de gebruikte browseromgeving konden JavaScript-formulieren en interactieve loginhandelingen niet volledig uitgevoerd worden. Daardoor moet het ingelogde dashboard, de daadwerkelijke betaalflow en de achterliggende backend nog apart worden getest.

---

# P0 — Moet klaar zijn vóór publieke productie

## 1. Privacybeleid / AVG

Op dit moment is geen duidelijk Privacy Policy-document zichtbaar vanuit de publieke website.

Toevoegen:

- welke persoonsgegevens worden verzameld;
- waarom deze gegevens worden verzameld;
- juridische grondslag;
- hoe lang gegevens worden bewaard;
- subprocessors;
- AI-providers;
- analytics-providers;
- payment providers;
- e-mailproviders;
- gebruikersrechten;
- dataportabiliteit;
- account/data verwijderen;
- contactgegevens;
- eventueel DPO/privacycontact;
- uitleg over profilering en matching.

Aanbevolen routes:

```text
/privacy
/terms
```

Footer:

```text
Privacy
Terms
Contact
```

## 2. Algemene voorwaarden

Er zijn geen duidelijke Terms of Service zichtbaar.

Minimaal opnemen:

- definitie van credits;
- wat een search inhoudt;
- geen garantie op vacatures of resultaten;
- AI-generated output;
- betalingsvoorwaarden;
- refundbeleid;
- credit expiry;
- accountmisbruik;
- fair use;
- aansprakelijkheid;
- intellectueel eigendom;
- beëindiging account;
- wijziging voorwaarden;
- toepasselijk recht;
- geschillenprocedure.

## 3. Bedrijfsgegevens

De footer bevat momenteel voornamelijk:

```text
© 2026 Unlisted
Made in the Netherlands
```

Voor productie ook tonen:

- juridische bedrijfsnaam;
- vestigingsadres;
- KvK-nummer;
- btw-nummer;
- support/contactmail;
- eventueel telefoonnummer.

## 4. Publieke pricing

De website communiceert:

```text
pay per search
buy credits
first search is free
```

Maar vóór aankoop moet volledig duidelijk zijn:

- prijs per creditpack;
- credits per pack;
- credits per search;
- eventuele verschillende search-types;
- prijs inclusief btw;
- geldigheidsduur credits;
- refundvoorwaarden;
- wat gebeurt als een search faalt;
- of nul resultaten ook credits kost;
- wat precies geleverd wordt.

Voorbeeld:

```text
50 credits — €4,99 incl. VAT

Standard search: 10 credits

Credits expire after X months / never expire.

A search may return 0 or more opportunity signals.
AI-generated matches are recommendations and are not guaranteed job vacancies.
```

## 5. Checkout en consumentenrecht

Voor betaling duidelijk tonen:

- totaalprijs;
- btw;
- aantal credits;
- wat gebruiker ontvangt;
- wanneer levering begint;
- refundbeleid;
- informatie over herroeping;
- factuurgegevens;
- eventuele toestemming voor directe levering digitale dienst.

Controleer juridisch ook de regels rond online ontbinding / herroeping die sinds 2026 extra relevant zijn voor online diensten.

## 6. Email verification

Registratie moet niet direct volledig vertrouwd worden.

Gewenste flow:

```text
Register
  ↓
Verification email
  ↓
Verify email
  ↓
Onboarding
  ↓
Search / outreach
```

Niet toestaan vóór verificatie:

- echte outreach;
- betaalde acties;
- gevoelige wijzigingen;
- misbruikgevoelige API-calls.

## 7. Password security

Een minimum van 6 tekens is te zwak.

Aanbevolen:

- minimum 8–12 tekens;
- support voor password managers;
- geen onnodige complexe regels;
- check op bekende gelekte passwords;
- rate limiting;
- brute-force protection;
- sessierevocation;
- secure password reset.

## 8. Forgot password

Toevoegen:

```text
Forgot password?
```

Flow:

```text
email
→ reset token
→ token expiry
→ nieuw wachtwoord
→ oude sessies optioneel intrekken
```

Beschermen tegen:

- account enumeration;
- token reuse;
- onbeperkte resetrequests.

## 9. Account verwijderen

In Settings moet gebruiker zelf zijn account kunnen verwijderen.

Bij verwijderen:

- persoonsgegevens verwijderen of anonimiseren;
- actieve sessies beëindigen;
- queued jobs stoppen;
- e-mailtokens intrekken;
- eventueel payment records bewaren indien wettelijk nodig;
- duidelijk aangeven welke data niet direct verwijderd kan worden.

## 10. Demo-account isoleren

Een publiek demo-account is handig, maar mag nooit echte productieacties kunnen uitvoeren.

Demo-account:

- geen echte e-mails sturen;
- geen echte betalingen;
- geen echte externe API-calls met kosten;
- geen echte persoonsgegevens opslaan;
- database periodiek resetten;
- volledig isoleren van echte gebruikersdata;
- duidelijke `DEMO` indicator in UI.

## 11. Outreach safety

Omdat het product outreach kan genereren of verzenden:

- gebruiker moet duidelijk zien wat wordt verstuurd;
- expliciete approval voordat echte mail wordt verzonden;
- of zeer duidelijk aangeven wanneer automatisch verzonden wordt;
- rate limiting;
- suppression list;
- unsubscribe/opt-out respecteren;
- bounced addresses verwerken;
- spamklachten verwerken;
- logging;
- preventie van bulkspam;
- domeinreputatie beschermen.

Aanbevolen eerste productieversie:

```text
AI generates draft
→ user reviews
→ user clicks Send
```

Beter dan volledig autonoom mailen in de eerste release.

---

# P1 — Belangrijk voor launchkwaliteit

## 12. Demo-data duidelijk markeren

Homepage toont voorbeeldopportunities, bijvoorbeeld een matchpercentage en tijdsaanduiding.

Als dit geen echte realtime data is:

```text
Example opportunity
Demo data
Sample match
```

erbij tonen.

Voorkom dat voorbeelddata als echte actuele vacature wordt geïnterpreteerd.

## 13. Social proof onderbouwen

Claims zoals:

```text
Trusted by students from top universities
```

moeten bewijsbaar zijn.

Alternatief:

```text
Built for students at universities such as...
```

als er nog geen echte gebruikersbasis bestaat.

Gebruik universiteitslogo's alleen als dat juridisch / merkrechtelijk toegestaan is.

## 14. Marketingclaims aanscherpen

Bijvoorbeeld:

```text
find opportunities before everyone else sees them
```

is sterk geformuleerd.

Veiliger en nauwkeuriger:

```text
identify early signals that may indicate upcoming opportunities
```

of:

```text
discover companies showing signals that they may be hiring soon
```

## 15. Akkoord met Terms en Privacy bij registratie

Onder registreren:

```text
By creating an account, you agree to our Terms of Service
and acknowledge our Privacy Policy.
```

Links klikbaar maken.

## 16. Cookiebeheer

Wanneer niet-noodzakelijke cookies worden gebruikt:

- analytics;
- marketing;
- ad pixels;
- behavioral tracking;

dan consent implementeren.

Bij alleen essentiële cookies hoeft niet altijd een grote cookiebanner.

Controleer:

- Vercel Analytics;
- Google Analytics;
- Meta Pixel;
- Hotjar;
- PostHog;
- andere trackingtools.

## 17. AI-transparantie

Maak duidelijk:

- wat AI doet;
- wat traditionele logica doet;
- welke data gebruikt wordt;
- dat AI fouten kan maken;
- dat matches indicatief zijn;
- dat opportunity signals geen bevestigde vacature hoeven te zijn;
- hoe gebruiker resultaat kan verbeteren.

Bijvoorbeeld:

```text
Why this match?
```

met:

```text
+ React experience
+ Located in the Netherlands
+ Company recently expanded its engineering team
- Dutch language preference unknown
```

## 18. Matchscore uitleggen

Wanneer de UI toont:

```text
92% match
```

moet duidelijk zijn waar dit vandaan komt.

Bijvoorbeeld:

```text
Match score is based on:
- skills
- location
- seniority
- study background
- company signal relevance
```

Vermijd schijnprecisie als het percentage niet daadwerkelijk statistisch betekenisvol is.

Alternatieven:

```text
Strong match
Good match
Possible match
```

of een transparant scoringsmodel.

## 19. Profilering / AVG

Omdat gebruikers worden gematcht met bedrijven/opportunities, vindt waarschijnlijk profilering plaats.

Documenteren:

- profieldata;
- voorkeuren;
- CV-data;
- geautomatiseerde scoring;
- doel van scoring;
- impact op gebruiker;
- mogelijkheid gegevens te wijzigen;
- mogelijkheid resultaten te verwijderen.

## 20. Accessibility

Test minimaal WCAG 2.1/2.2 AA-aspecten:

- toetsenbordnavigatie;
- focus states;
- aria-labels;
- form labels;
- contrast;
- screenreader;
- error feedback;
- modal focus trapping;
- alt text;
- heading hierarchy;
- zoom 200%;
- mobiele accessibility.

## 21. Support

Toevoegen:

```text
/help
/contact
/faq
```

Minimaal:

- supportmail;
- FAQ;
- betaling mislukt;
- credits ontbreken;
- search blijft hangen;
- resultaat incorrect;
- account verwijderen;
- privacyvraag.

## 22. Transactional emails

Minimaal:

- verify email;
- welcome;
- password reset;
- payment confirmation;
- invoice / receipt;
- credits added;
- search complete;
- search failed;
- outreach sent;
- outreach failed;
- security notification bij verdachte login.

---

# P2 — Sterk aanbevolen

## 23. How it works-pagina

Maak van de werking een expliciete flow:

```text
1. Build your profile
2. Choose what you're looking for
3. Agent searches company signals
4. Review opportunities
5. Generate personalized outreach
```

Gebruik echte screenshots.

## 24. SEO

Controleren:

- page titles;
- meta descriptions;
- OpenGraph;
- Twitter cards;
- canonical URLs;
- sitemap.xml;
- robots.txt;
- structured data;
- favicon;
- manifest;
- share images;
- 404 metadata.

## 25. Error states

Ontwerp expliciete states voor:

- 404;
- 500;
- API timeout;
- AI timeout;
- search failed;
- zero results;
- payment failed;
- webhook delayed;
- insufficient credits;
- unauthorized;
- expired session;
- rate limit;
- e-mail send failure;
- third-party service unavailable.

## 26. Loading / job states

Langlopende searches moeten een status hebben.

Bijvoorbeeld:

```text
Queued
Searching sources
Analyzing signals
Matching profile
Generating results
Completed
```

En:

```text
Failed
Retry
```

Laat browser refresh niet leiden tot verlies van status.

## 27. Mobile audit

Test minimaal:

```text
320px
375px
390px
430px
768px
```

Belangrijk voor:

- dashboard;
- opportunity cards;
- modals;
- filters;
- forms;
- pricing;
- checkout;
- outreach editor.

## 28. Observability

Productie moet minimaal hebben:

- frontend error monitoring;
- backend error monitoring;
- structured logs;
- webhook logs;
- job logs;
- API latency;
- queue monitoring;
- payment failures;
- mail failures;
- uptime monitoring.

Bijvoorbeeld:

```text
Sentry
Vercel logs
Better Stack / UptimeRobot
```

## 29. Rate limiting

Rate-limit minimaal:

```text
/login
/register
/forgot-password
/search
/outreach
/payment
/webhooks
/public API
```

Vooral beschermen tegen:

- brute-force;
- credit abuse;
- AI cost abuse;
- scraping;
- spam;
- DDoS-light abuse.

## 30. Backups

Voor database:

- automatische backups;
- retention policy;
- encrypted backups;
- restore procedure;
- restore daadwerkelijk testen.

Een backup die nooit getest is, is geen betrouwbare backup.

## 31. Environment separation

Gebruik minimaal:

```text
development
staging
production
```

Met gescheiden:

- database;
- API keys;
- payment keys;
- email accounts;
- OAuth callbacks;
- webhook secrets;
- analytics;
- logging.

Gebruik voor productie een eigen domein in plaats van alleen:

```text
young-creator2026.vercel.app
```

Bijvoorbeeld:

```text
unlisted.nl
unlisted.app
```

---

# Opportunity model duidelijk maken

Dit is een belangrijk productonderdeel.

Maak expliciet onderscheid tussen:

## Vacancy

Een echte gepubliceerde vacature.

## Hiring signal

Bijvoorbeeld:

```text
Company is hiring multiple software engineers.
```

## Opportunity signal

Bijvoorbeeld:

```text
Company opened a new R&D office.
```

## AI inference

Bijvoorbeeld:

```text
Based on recent expansion and your profile, this may be a good time to contact this company.
```

De UI moet voorkomen dat een gebruiker denkt:

```text
ASML heeft deze baan openstaan.
```

als het product eigenlijk bedoelt:

```text
ASML laat signalen zien waardoor het interessant kan zijn om contact op te nemen.
```

Voor ieder resultaat bijvoorbeeld:

```text
Type: Opportunity signal

Source:
ASML announced a new R&D facility.

Why it matters:
Expansion may create additional software engineering demand.

Why you match:
React / TypeScript / Netherlands / junior developer profile

Confidence:
Strong signal

Source date:
24 Sep 2026
```

---

# Aanbevolen productflow

Een productieklare basisflow:

```text
Landing page
  ↓
Register
  ↓
Verify email
  ↓
Onboarding
  ↓
Build profile
  ↓
Choose search criteria
  ↓
First free search
  ↓
Search progress
  ↓
Results
  ↓
Opportunity detail
  ↓
Why this match?
  ↓
Generate outreach
  ↓
Review draft
  ↓
Send
```

Wanneer credits op zijn:

```text
No credits
  ↓
Pricing
  ↓
Checkout
  ↓
Payment
  ↓
Webhook
  ↓
Credits added
  ↓
Receipt
  ↓
New search
```

Accountmanagement:

```text
Settings
├── Profile
├── Email
├── Password
├── Billing
├── Credits
├── Notifications
├── Privacy
├── Export data
└── Delete account
```

---

# Edge-case testplan

## Auth

Test:

```text
wrong password
unknown email
unverified email
expired verification token
expired reset token
reused reset token
multiple login attempts
logout
session expiry
multiple browser sessions
account deletion while logged in
```

## Search

Test:

```text
zero results
one result
100+ results
duplicate results
API timeout
Apify down
AI provider down
malformed source data
browser refresh
user closes browser
two searches simultaneously
search cancelled
search stuck
retry
```

## Credits

Test:

```text
0 credits
exactly enough credits
insufficient credits
credits deducted twice
search fails after deduction
refund credits after failure
two requests simultaneously
negative balance prevention
```

Gebruik transactionele database-updates.

## Payments

Test:

```text
payment successful
payment cancelled
payment failed
webhook delayed
webhook duplicated
webhook arrives before redirect
webhook arrives after redirect
browser closed after payment
invalid webhook signature
same Stripe event delivered twice
refund
chargeback
```

Webhooks moeten idempotent zijn.

## Outreach

Test:

```text
invalid email
bounced email
provider timeout
duplicate send
user double-clicks Send
rate limit
spam complaint
unsubscribe
draft generation failure
```

## Account deletion

Test:

```text
delete account with active job
delete account with credits
delete account after purchase
delete account with outreach history
delete account with scheduled mail
```

---

# Security checklist

## Authentication

- [ ] Email verification
- [ ] Password reset
- [ ] Strong password policy
- [ ] Rate limiting
- [ ] Session expiration
- [ ] Secure cookies
- [ ] HTTPOnly cookies
- [ ] SameSite configuration
- [ ] CSRF protection where relevant
- [ ] Account enumeration prevention

## Authorization

- [ ] User can only access own profile
- [ ] User can only access own searches
- [ ] User can only access own opportunities
- [ ] User can only access own billing data
- [ ] User can only access own outreach
- [ ] Admin routes protected
- [ ] Server-side authorization, not only frontend checks

## API

- [ ] Validate all inputs
- [ ] Schema validation
- [ ] Rate limiting
- [ ] Authentication
- [ ] Authorization
- [ ] Idempotency where required
- [ ] Safe error messages
- [ ] No stack traces in production
- [ ] Request size limits

## Secrets

- [ ] No secrets in frontend bundle
- [ ] No secrets committed to Git
- [ ] Separate dev/prod secrets
- [ ] Rotate exposed secrets
- [ ] Webhook secrets validated

## Database

- [ ] Proper row-level authorization
- [ ] Unique constraints
- [ ] Foreign keys
- [ ] Transactions around credits
- [ ] Backups
- [ ] Indexes
- [ ] PII minimized

---

# Payment / credit architecture checklist

Credits zijn gevoelig voor race conditions.

Niet:

```text
read credits
credits = credits - 10
save credits
```

Wel:

```text
transaction:
  verify balance >= cost
  deduct credits atomically
  create search
  commit
```

Maak daarnaast een ledger:

```text
credit_transactions
```

Bijvoorbeeld:

```text
id
user_id
amount
type
reference_id
description
created_at
```

Types:

```text
purchase
search
refund
bonus
admin_adjustment
```

Zo kun je altijd verklaren waarom iemand een bepaald creditsaldo heeft.

---

# Product analytics

Meet bijvoorbeeld:

```text
landing_view
signup_started
signup_completed
email_verified
onboarding_completed
first_search_started
first_search_completed
opportunity_opened
outreach_generated
outreach_sent
pricing_opened
checkout_started
purchase_completed
```

Belangrijke funnels:

```text
Visitor
→ Register
→ Verify
→ First Search
→ Result Viewed
→ Outreach
→ Purchase
```

---

# Launch checklist

## Legal

- [ ] Privacy Policy
- [ ] Terms of Service
- [ ] Company information
- [ ] Pricing disclosure
- [ ] Refund/herroeping geregeld
- [ ] Cookie compliance
- [ ] AI/profiling disclosure

## Accounts

- [ ] Email verification
- [ ] Forgot password
- [ ] Change password
- [ ] Logout
- [ ] Delete account
- [ ] Export personal data

## Product

- [ ] Onboarding
- [ ] Search
- [ ] Search progress
- [ ] Results
- [ ] Opportunity details
- [ ] Source links
- [ ] Match explanation
- [ ] Outreach drafts
- [ ] Zero-result state

## Billing

- [ ] Pricing page
- [ ] Checkout
- [ ] Webhooks
- [ ] Idempotency
- [ ] Credit ledger
- [ ] Receipts
- [ ] Refund handling

## Security

- [ ] Rate limiting
- [ ] Authorization audit
- [ ] Input validation
- [ ] Secret audit
- [ ] Secure sessions
- [ ] Production headers
- [ ] Dependency audit

## Operations

- [ ] Error monitoring
- [ ] Logs
- [ ] Uptime monitoring
- [ ] Database backups
- [ ] Restore tested
- [ ] Incident procedure

## UX

- [ ] Mobile
- [ ] Accessibility
- [ ] Loading states
- [ ] Error states
- [ ] Empty states
- [ ] Support
- [ ] FAQ

---

# Production acceptance test

De volgende volledige flow moet zonder handmatige fixes werken:

```text
register
→ verify email
→ onboarding
→ create profile
→ first free search
→ search completes
→ results shown
→ open opportunity
→ generate outreach
→ send / save outreach
→ run out of credits
→ open pricing
→ checkout
→ payment succeeds
→ webhook processes
→ credits appear
→ second search
→ receipt received
→ account settings
→ reset password
→ export data
→ delete account
```

Daarna expres de belangrijkste failure scenarios testen:

```text
AI timeout
Apify timeout
payment failure
duplicate Stripe webhook
email failure
zero results
two simultaneous searches
insufficient credits
expired session
browser refresh during search
account deletion during queued job
```

---

# Marketingpagina — aanbevolen structuur

```text
Hero
↓
Problem
↓
How it works
↓
Real product screenshot
↓
Example opportunity
↓
Why this match?
↓
Vacancy vs signal uitleg
↓
Pricing
↓
FAQ
↓
CTA
↓
Footer with legal links
```

---

# Mogelijke homepage-copy

## Hero

```text
Find opportunities before they become obvious.

Unlisted analyzes company signals such as hiring activity,
funding, expansion and news to help students discover companies
worth contacting before a traditional job listing appears.
```

## Disclaimer onder opportunity

```text
This is an opportunity signal, not a confirmed vacancy.
```

## Match uitleg

```text
Why this matches you

✓ React and TypeScript experience
✓ Based in the Netherlands
✓ Fits junior software roles
✓ Company is expanding its engineering activities
```

---

# Conclusie

De website heeft al een goede basis:

- duidelijke doelgroep;
- herkenbaar probleem;
- interessante onderscheidende propositie;
- nette visuele presentatie;
- begrijpelijke kernflow.

De grootste resterende stap is niet meer "meer pagina's bouwen", maar het product betrouwbaar maken voor onbekende betalende gebruikers.

Focus vóór launch vooral op:

1. legal en privacy;
2. authentication;
3. credits en betalingen;
4. security;
5. betrouwbare background jobs;
6. outreach safety;
7. AI-transparantie;
8. error handling;
9. monitoring;
10. account lifecycle.

Pas wanneer deze onderdelen goed getest zijn, is Unlisted echt production ready.
