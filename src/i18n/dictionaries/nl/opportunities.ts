import type { opportunities as en } from '../en/opportunities';

export const opportunities: typeof en = {
  meta: {
    title: 'Kansen',
  },
  page: {
    title: 'Kansen',
    description: 'Banen, stages, evenementen en verborgen kansen die bij je profiel passen.',
    searchLabel: 'Zoek kansen',
    searchPlaceholder: 'Zoek op titel, bedrijf, skill of plaats…',
    companiesMatch: (count: number, query: string) =>
      `${count} ${count === 1 ? 'bedrijf past' : 'bedrijven passen'} bij “${query}”`,
    viewCompanies: 'Bekijk bedrijven',
  },
  categories: {
    label: 'Filter op soort',
    all: 'Alles',
    jobs: 'Banen',
    internships: 'Stages',
    events: 'Evenementen',
    openApplications: 'Open sollicitaties',
    more: 'Meer',
  },
  hiddenOnly: 'Alleen verborgen',
  empty: {
    title: 'Nog geen kansen',
    description: 'Start een zoekopdracht en alles wat je agent vindt verschijnt hier, gematcht met je profiel.',
    cta: 'Naar zoeken',
  },
  noMatches: 'Geen kansen die bij deze filters passen.',
  clearFilters: 'Filters wissen',
  card: {
    remotePossible: 'Remote mogelijk',
    moreSkills: (count: number) => `+${count}`,
    whyNow: 'Waarom nu:',
    viewSource: 'Bekijk origineel',
  },
};
