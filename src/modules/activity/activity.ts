import type { OutreachListItem, SearchRunData } from '@/lib/data/queries';
import { classifySignal, type SignalKind } from '@/modules/signals/signals';
import type { Opportunity } from '@/shared/types/Opportunity';

/*
 * Activiteit is geen eigen pagina maar een herbruikbare tijdlijn (dashboard, bedrijfspagina,
 * meldingen). Alles wordt afgeleid uit echte data; de UI zet het om in tekst per taal.
 * Plain data (datum als ISO-string), zodat het ook naar Client Components kan.
 */

export type ActivityKind =
  | 'search_completed'
  | 'search_failed'
  | 'hidden_opportunity'
  | 'opportunity_detected'
  | 'signal_detected'
  | 'draft_created'
  | 'email_sent';

export interface ActivityItem {
  id: string;
  kind: ActivityKind;
  at: string;
  href: string;
  company?: string;
  companyId?: string;
  title?: string; // titel van de kans
  signal?: string; // tekst van het bedrijfssignaal
  signalKind?: SignalKind;
  count?: number; // nieuwe resultaten van een zoekopdracht
}

// Alleen sterke matches krijgen een eigen regel; de rest zit in "Search completed · N new"
const STRONG_MATCH = 80;

export function buildActivity({
  matches,
  outreach,
  runs,
}: {
  matches: Opportunity[];
  outreach: OutreachListItem[];
  runs: SearchRunData[];
}): ActivityItem[] {
  const items: ActivityItem[] = [];

  for (const run of runs) {
    if (run.status === 'completed') {
      items.push({
        id: `run-${run.id}`,
        kind: 'search_completed',
        at: run.finishedAt ?? run.createdAt,
        href: '/opportunities',
        count: run.newResults,
      });
    } else if (run.status === 'failed') {
      items.push({ id: `run-${run.id}`, kind: 'search_failed', at: run.finishedAt ?? run.createdAt, href: '/search' });
    }
  }

  const companiesWithSignal = new Set<string>();
  for (const o of matches) {
    const base = { company: o.company, companyId: o.companyId, title: o.title, at: o.discoveredAt.toISOString() };
    if (o.isHidden) {
      items.push({ ...base, id: `hidden-${o.id}`, kind: 'hidden_opportunity', href: `/matches/${o.id}` });
    } else if (o.matchScore >= STRONG_MATCH) {
      items.push({ ...base, id: `match-${o.id}`, kind: 'opportunity_detected', href: `/matches/${o.id}` });
    }
    // Eén signaal per bedrijf, anders overspoelt één bedrijf de tijdlijn
    const companyKey = o.companyId ?? o.company;
    if (o.signals.length > 0 && !companiesWithSignal.has(companyKey)) {
      companiesWithSignal.add(companyKey);
      items.push({
        ...base,
        id: `signal-${o.id}`,
        kind: 'signal_detected',
        href: o.companyId ? `/companies/${o.companyId}` : `/matches/${o.id}`,
        signal: o.signals[0],
        signalKind: classifySignal(o.signals[0]),
      });
    }
  }

  for (const message of outreach) {
    const base = { company: message.company, companyId: message.companyId, title: message.opportunityTitle };
    if (message.status === 'sent' && message.sentAt) {
      items.push({ ...base, id: `sent-${message.id}`, kind: 'email_sent', at: message.sentAt, href: `/matches/${message.matchId}` });
    } else if (message.createdBy === 'agent' && (message.status === 'draft' || message.status === 'failed')) {
      items.push({
        ...base,
        id: `draft-${message.id}`,
        kind: 'draft_created',
        at: message.updatedAt,
        href: `/matches/${message.matchId}`,
      });
    }
  }

  // Tijdstempels uit de database en uit JS verschillen in notatie: op echte tijd sorteren
  return items.sort((a, b) => Date.parse(b.at) - Date.parse(a.at));
}

export function activityForCompany(items: ActivityItem[], companyId: string): ActivityItem[] {
  return items.filter((item) => item.companyId === companyId);
}
