# Hidden Opportunity Radar — Requirements

How the AI finds companies that will hire soon, before they post a vacancy, and matches them to a student. Robotics is the example sector.

**Legend:** `[x]` done · `[ ]` open. "Schema only" means the database table or column exists, but no code uses it yet.

Status checked against the `YoungCreator2026` code on 2026-09-27. The app side is complete: profile, scoring, matches, outreach, credits and scheduling work end to end. Collecting data (steps 1–3) is the job of the n8n workflows; see `docs/n8n.md` for the contract. Without n8n the app runs in demo mode with sample opportunities.

---

## Foundations

- [x] Next.js app with landing page, dashboard, search, preferences and settings pages (mock data)
- [x] Supabase database schema (`supabase/migrations/20260926170000_initial_schema.sql`)
- [x] Shared data (companies, opportunities) kept separate from personal data (matches)
- [x] `radar` exists as an opportunity source; `is_hidden` flag on opportunities
- [x] Login and registration connected to Supabase Auth
- [x] App reads real data from the database (mock data removed; demo mode uses the same pipeline as n8n)

## 1. Find the companies

- [x] `companies` table with web domain as the unique key (schema only)
- [ ] Import companies by sector from KvK industry codes
- [ ] Import companies from Dealroom or Crunchbase (tag: "robotics")
- [ ] Import from sector groups like (Holland Robotics, TechLeap)
- [ ] Scrape "Customers" / "Case studies" pages of robotics companies
- [ ] AI pulls customer names out of press releases ("X deploys robots at Y") and adds them as companies
- [x] Merge duplicate companies by domain when importing (`/api/n8n/results` upserts on domain, else on name)

## 2. Collect signals

- [ ] News sources: Google News RSS, GDELT, NewsAPI, local business press
- [ ] Press releases: company newsroom pages and RSS feeds, PR wires (ANP, Business Wire)
- [ ] Public records: new KvK branch registrations, building permits, EU and national grants
- [ ] Company website: career page, team page, "we're growing" banners, locations page
- [ ] Indirect signals: LinkedIn headcount growth, GitHub activity, new job titles on other platforms
- [ ] Keyword pre-filter ("funding", "expand", "new facility", "acquires", "opens office", "contract") before any AI call
- [ ] Scheduled job that runs the collection daily (app side done: `POST /api/n8n/scheduler`; n8n Schedule Trigger still to build)

## 3. AI turns each article into a structured signal

- [ ] Table for signals: company, type, detail, location, amount, date, implied roles, sentiment, evidence quote, source URL (for now: `opportunities.signals` holds the "why now" lines n8n sends)
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
- [ ] Mark as hidden opportunity (`is_hidden = true`) when no vacancy exists (app stores `isHidden` from n8n; the check itself is n8n's job)
- [x] Career page monitoring fields: `is_monitored`, `career_page_hash`, `last_checked_at` (schema only)
- [ ] Company Hunter watches the career page and alerts the user when the vacancy goes up

## 6. Match against the user's profile

**Hard filters (never outweighed by other scores)**

- [x] User preferences stored: locations, remote only, opportunity types, desired roles, industries, minimum salary (schema + preferences page)
- [x] User profile stored: nationality, languages, skills, interests, ambitions, recent curiosity, CV (PDF in private storage + text + parsed), end of search year
- [ ] Filter by country or city (company or its new office)
- [ ] Visa filter using the IND recognised sponsor register
- [ ] Language filter (skip companies requiring Dutch above the user's level)
- [x] Opportunity type counts in the score (soft filter); types now include events, hackathons, conferences, networking, projects, research, startups, freelance and part-time

**Relevance and ranking**

- [x] CV parsing (`CVParser.ts`: PDF text with unpdf, structured with Claude; skills/languages/interests merged into the profile)
- [ ] Embeddings (vectors) for CVs, companies and inferred roles
- [ ] Rough relevance search that narrows thousands of companies down to about 50
- [x] AI scoring with a match score and plain-language reasons (Claude; rule-based fallback without API key; n8n may also send its own score)
- [x] `matches` table with `match_score` and `match_reasons`
- [ ] Final order combines match score and radar score

## 7. What the user sees

- [x] Opportunity card with match score, reasons, type, location, date, contact, skills and "Hidden opportunity" badge
- [x] Opportunity status: new, reviewed, saved, applied, rejected (schema + UI)
- [x] "Why now" section listing the signals (without dates for now)
- [x] Links to the source on the card and detail page
- [ ] Visa sponsor indicator on the card
- [ ] Suggested role for the open application
- [x] "Reach out" → personal email draft (one AI call using the opportunity, signals and profile); editable, copy / open in mail app / send via n8n
- [ ] "Not interested" feedback stored and used to improve matching (stored as match status; not yet used for matching)

## Practical / infrastructure

- [x] Search runs and schedules stored and used (next run computed in the database, time-zone aware)
- [x] Credit ledger used: 10 welcome credits, 1 credit per search, automatic refund when a run fails
- [ ] Nightly job (n8n workflow or job queue) runs steps 1–5
- [x] Step 6 runs when the user searches and charges one credit
- [ ] Cheap/small model for article extraction (step 3); stronger model only for re-ranking and drafts
- [ ] Job queue and cache implemented (only interfaces exist)

## Hackathon demo

- [ ] Pick one sector (robotics) and one region (the Netherlands)
- [ ] Use Google News RSS plus company websites as sources
- [ ] Hand-check about 20 real companies
- [ ] Show a few real, traceable signals with a clear "why now"

## Action engine (outreach)

- [x] Automation levels 1–3 in Settings (assistant, semi-automatic, fully automatic with explicit consent and a daily limit)
- [x] After every run the agent prepares emails for the 3 strongest new matches that have a contact email (score ≥ 70)
- [x] Level 2: "Approve & send" sends through the n8n email webhook with the student as Reply-To
- [x] Level 3: sends automatically within the daily limit (max 20, default 3)
- [x] Outreach overview page (ready to review / sent), status per match ("Contacted")
- [ ] n8n workflow that sends the email (Gmail/SMTP), see `docs/n8n.md` §4
