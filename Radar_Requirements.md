# Hidden Opportunity Radar — Requirements

How the AI finds companies that will hire soon, before they post a vacancy, and matches them to a student. Robotics is the example sector.

**Legend:** `[x]` done · `[ ]` open. "Schema only" means the database table or column exists, but no code uses it yet.

Status checked against the `YoungCreator2026` code on 2026-09-26. At that point the UI runs on hardcoded mock data, and every agent and scraper is still a stub that returns an empty result.

---

## Foundations

- [x] Next.js app with landing page, dashboard, search, preferences and settings pages (mock data)
- [x] Supabase database schema (`supabase/migrations/20260926170000_initial_schema.sql`)
- [x] Shared data (companies, opportunities) kept separate from personal data (matches)
- [x] `radar` exists as an opportunity source; `is_hidden` flag on opportunities
- [ ] Login and registration connected to Supabase Auth (pages exist, not wired up)
- [ ] App reads real data from the database instead of `mockData.ts`

## 1. Find the companies

- [x] `companies` table with web domain as the unique key (schema only)
- [ ] Import companies by sector from KvK industry codes
- [ ] Import companies from Dealroom or Crunchbase (tag: "robotics")
- [ ] Import from sector groups (Holland Robotics, TechLeap)
- [ ] Scrape "Customers" / "Case studies" pages of robotics companies
- [ ] AI pulls customer names out of press releases ("X deploys robots at Y") and adds them as companies
- [ ] Merge duplicate companies by domain when importing

## 2. Collect signals

- [ ] News sources: Google News RSS, GDELT, NewsAPI, local business press
- [ ] Press releases: company newsroom pages and RSS feeds, PR wires (ANP, Business Wire)
- [ ] Public records: new KvK branch registrations, building permits, EU and national grants
- [ ] Company website: career page, team page, "we're growing" banners, locations page
- [ ] Indirect signals: LinkedIn headcount growth, GitHub activity, new job titles on other platforms
- [ ] Keyword pre-filter ("funding", "expand", "new facility", "acquires", "opens office", "contract") before any AI call
- [ ] Scheduled job that runs the collection daily

## 3. AI turns each article into a structured signal

- [ ] Table for signals: company, type, detail, location, amount, date, implied roles, sentiment, evidence quote, source URL
- [ ] AI extraction prompt that returns the fixed JSON fields
- [ ] Model must quote the article (`evidence_quote`) so signals can't be invented
- [ ] Link each signal to a company (by domain or name)
- [ ] Signal types defined:
  - [ ] Funding round (seed, Series A/B) — hiring across the board within 3–9 months
  - [ ] Capex, new factory or production line — engineers, operations, quality, maintenance
  - [ ] New office in a city — local hiring, often juniors and interns
  - [ ] Big new customer contract — delivery, integration, support engineers
  - [ ] M&A — integration roles; being acquired can be negative (hiring freeze)
  - [ ] Product launch — sales, customer success, field engineers
  - [ ] Grant or R&D subsidy — thesis projects, research interns
  - [ ] Layoffs, reorganisation, bankruptcy — negative: lower the score or exclude

## 4. Score how likely the company is to hire (radar score)

- [x] `radarScore` field in the `CompanySignal` type (type only, always 0)
- [ ] Weight by signal type (e.g. funding 30, new office 25, capex 20, new contract 15)
- [ ] Recency decay (last week counts much more than eight months ago)
- [ ] Size factor (€20M Series B > €500k seed)
- [ ] Stacking bonus for several signals at once
- [ ] Negative signals subtract points
- [ ] Plain formulas, no AI, so the score is cheap and explainable

## 5. Guess the roles and check they aren't posted yet

- [ ] AI infers likely roles from signals, website content and tech stack
- [ ] Check LinkedIn, Indeed and the career page for an existing vacancy
- [ ] Mark as hidden opportunity (`is_hidden = true`) when no vacancy exists
- [x] Career page monitoring fields: `is_monitored`, `career_page_hash`, `last_checked_at` (schema only)
- [ ] Company Hunter watches the career page and alerts the user when the vacancy goes up

## 6. Match against the user's profile

**Hard filters (never outweighed by other scores)**

- [x] User preferences stored: locations, remote only, opportunity types, desired roles, industries, minimum salary (schema + preferences page)
- [x] User profile stored: nationality, languages, skills, CV text, end of search year (schema only)
- [ ] Filter by country or city (company or its new office)
- [ ] Visa filter using the IND recognised sponsor register
- [ ] Language filter (skip companies requiring Dutch above the user's level)
- [ ] Filter by opportunity type (internship, job, thesis, …)

**Relevance and ranking**

- [ ] CV parsing (`CVParser.ts` exists as a stub)
- [ ] Embeddings (vectors) for CVs, companies and inferred roles
- [ ] Rough relevance search that narrows thousands of companies down to about 50
- [ ] AI re-ranking of the shortlist with a match score and plain-language reason
- [x] `matches` table with `match_score` and `match_reasons` (schema only)
- [ ] Final order combines match score and radar score

## 7. What the user sees

- [x] Opportunity card with match score, type, location, skills and "Hidden opportunity" badge (mock data)
- [x] Opportunity status: new, reviewed, saved, applied, rejected (schema + UI)
- [ ] "Why now" section listing the signals with dates
- [ ] Links to source articles on the card
- [ ] Visa sponsor indicator on the card
- [ ] Suggested role for the open application
- [ ] "Draft open application" button (one AI call that refers to the specific news)
- [ ] "Not interested" feedback stored and used to improve matching

## Practical / infrastructure

- [x] Search runs and schedules stored (`search_runs`, schedule fields in `search_profiles`) (schema only)
- [x] Credit ledger (`credit_transactions`, `credit_balances` view) (schema only)
- [ ] Nightly job (n8n workflow or job queue) runs steps 1–5
- [ ] Step 6 runs when the user searches and charges one credit
- [ ] Cheap/small model for article extraction (step 3); stronger model only for re-ranking and drafts
- [ ] Job queue and cache implemented (only interfaces exist)

## Hackathon demo

- [ ] Pick one sector (robotics) and one region (the Netherlands)
- [ ] Use Google News RSS plus company websites as sources
- [ ] Hand-check about 20 real companies
- [ ] Show a few real, traceable signals with a clear "why now"
