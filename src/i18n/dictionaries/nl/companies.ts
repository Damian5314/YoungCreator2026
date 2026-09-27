import type { companies as en } from '../en/companies';

export const companies: typeof en = {
  meta: {
    title: 'Bedrijven',
  },
  page: {
    title: 'Bedrijven',
    description: 'Bedrijven om te kennen, te volgen of te benaderen.',
    searchLabel: 'Zoek bedrijven',
    searchPlaceholder: 'Zoek bedrijven, branches, signalen…',
    localNote: 'Opgeslagen en gevolgde bedrijven worden voorlopig op dit apparaat bewaard.',
  },
  filters: {
    label: 'Filter bedrijven',
    forYou: 'Voor jou',
    saved: 'Opgeslagen',
    following: 'Gevolgd',
    contacted: 'Benaderd',
    growing: 'Groeiend',
    hidden: 'Verborgen kans',
    industry: 'Branche',
    allIndustries: 'Alle branches',
  },
  types: {
    startup: 'Startup',
    scaleup: 'Scale-up',
    corporate: 'Corporate',
    research: 'Onderzoek',
  },
  relationship: {
    label: 'Relatie',
    new: 'Nog niet benaderd',
    saved: 'Opgeslagen',
    following: 'Gevolgd',
    contacted: 'Benaderd',
    replied: 'Gereageerd',
  },
  fit: 'fit',
  card: {
    whyYoureSeeingThis: 'Waarom je dit ziet',
    fallbackWhy: (count: number) =>
      `Je hebt ${count} passende ${count === 1 ? 'kans' : 'kansen'} bij dit bedrijf.`,
    latestSignal: 'Laatste signaal',
    noSignals: 'Nog geen bedrijfssignalen',
    opportunities: (count: number) => `${count} ${count === 1 ? 'kans' : 'kansen'}`,
    viewCompany: 'Bekijk bedrijf',
    reachOut: 'Contact opnemen',
    save: 'Opslaan',
    saved: 'Opgeslagen',
    follow: 'Volgen',
    following: 'Gevolgd',
  },
  detail: {
    back: 'Alle bedrijven',
    website: 'Website',
    why: {
      title: 'Waarom je dit ziet',
      description: 'Hoe dit bedrijf aansluit bij je profiel.',
    },
    signals: {
      title: 'Bedrijfssignalen',
      description: 'Wat dit bedrijf doet, en waarom dat voor jou telt.',
      empty: 'Nog geen signalen. Je agent houdt dit bedrijf in volgende zoekopdrachten in de gaten.',
      viewOpportunity: 'Bekijk kans',
    },
    activity: {
      empty: 'Nog geen activiteit bij dit bedrijf.',
    },
    opportunities: {
      title: 'Kansen bij dit bedrijf',
      description: 'Waar je bij dit bedrijf op kunt reageren.',
    },
    angle: {
      title: 'Voorgestelde invalshoek',
      description: 'Een startpunt voor een persoonlijk bericht.',
      withSkillsAndSignal: (skills: string, signal: string) =>
        `Noem je ervaring met ${skills} en koppel die aan hun nieuws: “${signal}”.`,
      withSignal: (signal: string) => `Verwijs naar hun nieuws, “${signal}”, en leg uit hoe jij daarbij kunt helpen.`,
      withSkills: (skills: string) => `Begin met je ervaring in ${skills}: de skills die dit bedrijf zoekt.`,
      generic: 'Leg uit wat je aantrekt in dit bedrijf en welke van je skills bij hun werk passen.',
      cta: 'Bericht laten schrijven',
    },
  },
  empty: {
    title: 'Nog geen bedrijven',
    description: 'Bedrijven verschijnen hier zodra je agent er kansen vindt.',
    cta: 'Naar zoeken',
  },
  noMatches: 'Geen bedrijven die bij deze filters passen.',
  toWatch: {
    title: 'Bedrijven om te volgen',
    description: 'Waar je beste matches en signalen zitten.',
    viewAll: 'Bekijk alle bedrijven',
  },
};
