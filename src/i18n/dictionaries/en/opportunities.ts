// Kansenpagina: alles waar je op kunt reageren, met filters op soort, status en zoekterm.
export const opportunities = {
  meta: {
    title: 'Opportunities',
  },
  page: {
    title: 'Opportunities',
    description: 'Jobs, internships, events and hidden opportunities matched to your profile.',
    searchLabel: 'Search opportunities',
    searchPlaceholder: 'Search by title, company, skill or place…',
    companiesMatch: (count: number, query: string) =>
      `${count} ${count === 1 ? 'company matches' : 'companies match'} “${query}”`,
    viewCompanies: 'View companies',
  },
  categories: {
    label: 'Filter by kind',
    all: 'All',
    jobs: 'Jobs',
    internships: 'Internships',
    events: 'Events',
    openApplications: 'Open applications',
    more: 'More',
  },
  hiddenOnly: 'Hidden only',
  empty: {
    title: 'No opportunities yet',
    description: 'Run a search and everything your agent finds shows up here, matched to your profile.',
    cta: 'Go to search',
  },
  noMatches: 'No opportunities match these filters.',
  clearFilters: 'Clear filters',
  // Compacte kanskaart (overal dezelfde)
  card: {
    remotePossible: 'Remote possible',
    moreSkills: (count: number) => `+${count}`,
    whyNow: 'Why now:',
    viewSource: 'View original',
  },
};
