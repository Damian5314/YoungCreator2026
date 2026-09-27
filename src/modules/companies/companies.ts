import type { OutreachListItem } from '@/lib/data/queries';
import { classifySignal, GROWTH_SIGNALS, type SignalKind } from '@/modules/signals/signals';
import type { Opportunity } from '@/shared/types/Opportunity';

/*
 * Een bedrijf is de organisatie ("wie moet ik kennen?"); een kans is iets waar je op kunt
 * reageren ("wat kan ik doen?"). Bedrijven worden hier afgeleid uit je kansen: elke kans
 * hoort bij precies één bedrijf (tabel companies).
 */

export type CompanyType = 'startup' | 'scaleup' | 'corporate' | 'research';

// Relatie met een bedrijf. new/saved/contacted volgen uit je data; saved en following kun je
// ook zelf zetten (zie useCompanyRelations). 'replied' bestaat in het model, maar antwoorden
// worden nog niet bijgehouden.
export type CompanyRelationship = 'new' | 'saved' | 'following' | 'contacted' | 'replied';

export interface CompanySignal {
  text: string; // wat er gebeurde, zoals de bron het beschrijft
  kind: SignalKind;
  spottedAt: Date; // wanneer je agent het signaal vond (niet per se wanneer het gebeurde)
  opportunityId: string; // de kans waarbij het signaal hoort
}

export interface CompanySummary {
  id: string;
  name: string;
  website?: string;
  industry?: string;
  location?: string;
  type?: CompanyType; // alleen als het uit de data volgt, nooit gegokt
  fitScore: number; // hoogste matchscore van de kansen bij dit bedrijf
  opportunities: Opportunity[]; // beste match eerst
  signals: CompanySignal[]; // nieuwste eerst, zonder dubbelen
  hasHidden: boolean; // minstens één verborgen kans (geen publieke vacature)
  isGrowing: boolean; // minstens één groeisignaal
  whyYoureSeeingThis?: string; // eerste matchreden van de beste kans
  relationship: 'new' | 'saved' | 'contacted';
  outreach: OutreachListItem[];
  lastActivityAt: Date;
}

// Zonder company-id (oude of losse data) groeperen op naam
function companyKey(opportunity: Opportunity): string {
  return opportunity.companyId ?? `name:${opportunity.company.trim().toLowerCase()}`;
}

function companyType(opportunities: Opportunity[], industry?: string): CompanyType | undefined {
  if (opportunities.some((o) => o.type === 'startup')) return 'startup';
  if (industry && /\b(university|universiteit|research institute|academ)/i.test(industry)) return 'research';
  return undefined;
}

export function buildCompanies(matches: Opportunity[], outreach: OutreachListItem[]): CompanySummary[] {
  const groups = new Map<string, Opportunity[]>();
  for (const opportunity of matches) {
    const key = companyKey(opportunity);
    groups.set(key, [...(groups.get(key) ?? []), opportunity]);
  }

  const outreachByMatch = new Map(outreach.map((message) => [message.matchId, message]));

  return [...groups.entries()]
    .map(([id, list]): CompanySummary => {
      const opportunities = [...list].sort((a, b) => b.matchScore - a.matchScore);
      const best = opportunities[0];
      const messages = opportunities.flatMap((o) => outreachByMatch.get(o.id) ?? []);

      const seen = new Set<string>();
      const signals = opportunities
        .flatMap((o) =>
          o.signals.map((text) => ({ text, kind: classifySignal(text), spottedAt: o.discoveredAt, opportunityId: o.id })),
        )
        .filter((signal) => !seen.has(signal.text) && seen.add(signal.text))
        .sort((a, b) => b.spottedAt.getTime() - a.spottedAt.getTime());

      const contacted =
        opportunities.some((o) => o.status === 'applied') ||
        messages.some((m) => m.status === 'sent' || m.status === 'sending');
      const saved = opportunities.some((o) => o.status === 'saved');
      const industry = opportunities.find((o) => o.companyIndustry)?.companyIndustry;

      return {
        id,
        name: best.company,
        website: best.companyWebsite,
        industry,
        location: opportunities.find((o) => o.companyLocation)?.companyLocation ?? (best.location || undefined),
        type: companyType(opportunities, industry),
        fitScore: best.matchScore,
        opportunities,
        signals,
        hasHidden: opportunities.some((o) => o.isHidden),
        isGrowing: signals.some((signal) => GROWTH_SIGNALS.has(signal.kind)),
        whyYoureSeeingThis: best.matchReasons[0],
        relationship: contacted ? 'contacted' : saved ? 'saved' : 'new',
        outreach: messages,
        lastActivityAt: new Date(Math.max(...opportunities.map((o) => o.discoveredAt.getTime()))),
      };
    })
    .sort((a, b) => b.fitScore - a.fitScore);
}

// Contact opnemen met een bedrijf = de beste kans openen, met het e-mailpaneel in beeld
export function reachOutHref(company: CompanySummary): string {
  return `/matches/${company.opportunities[0].id}#reach-out`;
}

// "Amsterdam · Fintech · Scale-up"
export function companyMeta(company: CompanySummary, typeLabel?: string): string {
  return [company.location, company.industry, typeLabel].filter(Boolean).join(' · ');
}

// Welke vaardigheden van de student terugkomen bij dit bedrijf (voor de voorgestelde invalshoek)
export function sharedSkills(company: CompanySummary, studentSkills: string[]): string[] {
  const mine = new Set(studentSkills.map((skill) => skill.toLowerCase()));
  const shared = new Set<string>();
  for (const opportunity of company.opportunities) {
    for (const skill of opportunity.requiredSkills) if (mine.has(skill.toLowerCase())) shared.add(skill);
  }
  return [...shared];
}
