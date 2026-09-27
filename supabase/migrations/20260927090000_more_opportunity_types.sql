-- Meer soorten kansen dan alleen vacatures: events, hackathons, projecten, startups, ...
-- Apart bestand: nieuwe enum-waarden mogen pas gebruikt worden nadat deze transactie is gecommit.

alter type public.opportunity_type add value if not exists 'part-time';
alter type public.opportunity_type add value if not exists 'freelance';
alter type public.opportunity_type add value if not exists 'event';
alter type public.opportunity_type add value if not exists 'hackathon';
alter type public.opportunity_type add value if not exists 'conference';
alter type public.opportunity_type add value if not exists 'networking';
alter type public.opportunity_type add value if not exists 'project';
alter type public.opportunity_type add value if not exists 'research';
alter type public.opportunity_type add value if not exists 'startup';

alter type public.opportunity_source add value if not exists 'news';
alter type public.opportunity_source add value if not exists 'event-platform';
alter type public.opportunity_source add value if not exists 'startup-database';
alter type public.opportunity_source add value if not exists 'web';
alter type public.opportunity_source add value if not exists 'demo'; -- voorbeelddata zolang n8n nog niet gekoppeld is
