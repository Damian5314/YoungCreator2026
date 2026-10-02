import type { matches as en } from '../en/matches';

export const matches: typeof en = {
  meta: {
    title: 'Kans',
  },
  detail: {
    allResults: 'Alle kansen',
    aboutCompany: (company: string) => `Over ${company}`,
    hiddenOpportunity: 'Verborgen kans',
    company: 'Bedrijf',
    location: 'Locatie',
    remotePossible: 'remote mogelijk',
    date: 'Datum',
    sourceDate: 'Brondatum',
    postedOn: (date: string) => `Gepubliceerd ${date}`,
    foundOn: (date: string) => `Gevonden door je agent ${date}`,
    contact: 'Contactpersoon',
    website: 'Website',
    viewOriginal: 'Bekijk origineel',
    whyFits: {
      title: 'Waarom dit bij je past',
      description: 'Hoe je agent dit aan je profiel heeft gekoppeld.',
    },
    noReasons: 'Voor deze match zijn geen specifieke redenen vastgelegd.',
    signalNote: 'Dit is een kanssignaal, geen bevestigde vacature.',
    aiNote: 'De matchscore en redenen zijn suggesties, deels door AI gemaakt op basis van je profiel en openbare bronnen. Ze kunnen fouten bevatten, dus controleer de oorspronkelijke bron.',
    whyNow: 'Waarom nu',
    foundVia: (source: string, date: string) => `Gevonden via ${source} op ${date}`,
    reachOut: {
      title: 'Contact opnemen',
      description: 'Zet de eerste stap. Een persoonlijke e-mail, klaar in een paar seconden.',
    },
  },
  card: {
    hiddenOpportunity: 'Verborgen kans',
    remote: 'Remote',
    remoteSuffix: 'remote',
    whyNow: 'Waarom nu:',
    foundVia: (source: string, date: string) => `Gevonden via ${source} · ${date}`,
    view: 'Bekijken',
  },
  score: {
    label: 'match',
  },
  actions: {
    outreachStatus: {
      draft: 'E-mail klaar om te checken',
      sending: 'Versturen…',
      sent: 'E-mail verstuurd',
      failed: 'E-mail mislukt, probeer opnieuw',
    },
    reachOut: 'Contact opnemen',
    undo: 'Ongedaan maken',
    notForMe: 'Niet voor mij',
  },
  errors: {
    sessionExpired: 'Je sessie is verlopen. Log opnieuw in.',
    invalidStatus: 'Ongeldige status.',
  },
};
