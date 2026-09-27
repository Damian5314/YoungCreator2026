// Bedrijvenpagina, bedrijfskaart en bedrijfsdetail. Een bedrijf is de organisatie ("wie moet ik kennen?"),
// een kans is waar je op reageert ("wat kan ik doen?").
export const companies = {
  meta: {
    title: 'Companies',
  },
  page: {
    title: 'Companies',
    description: 'Companies worth knowing, watching or reaching out to.',
    searchLabel: 'Search companies',
    searchPlaceholder: 'Search companies, industries, signals…',
    localNote: 'Saved and followed companies are kept on this device for now.',
  },
  filters: {
    label: 'Filter companies',
    forYou: 'For you',
    saved: 'Saved',
    following: 'Following',
    contacted: 'Contacted',
    growing: 'Growing',
    hidden: 'Hidden opportunity',
    industry: 'Industry',
    allIndustries: 'All industries',
  },
  types: {
    startup: 'Startup',
    scaleup: 'Scale-up',
    corporate: 'Corporate',
    research: 'Research',
  },
  relationship: {
    label: 'Relationship',
    new: 'Not contacted',
    saved: 'Saved',
    following: 'Following',
    contacted: 'Contacted',
    replied: 'Replied',
  },
  fit: 'fit',
  card: {
    whyYoureSeeingThis: 'Why you’re seeing this',
    fallbackWhy: (count: number) =>
      `You have ${count} matching ${count === 1 ? 'opportunity' : 'opportunities'} at this company.`,
    latestSignal: 'Latest signal',
    noSignals: 'No company signals yet',
    opportunities: (count: number) => `${count} ${count === 1 ? 'opportunity' : 'opportunities'}`,
    viewCompany: 'View company',
    reachOut: 'Reach out',
    save: 'Save',
    saved: 'Saved',
    follow: 'Follow',
    following: 'Following',
  },
  detail: {
    back: 'All companies',
    website: 'Website',
    why: {
      title: 'Why you’re seeing this',
      description: 'How this company connects to your profile.',
    },
    signals: {
      title: 'Company signals',
      description: 'What this company is doing, and why it matters for you.',
      empty: 'No signals yet. Your agent keeps an eye on this company in future searches.',
      viewOpportunity: 'View opportunity',
    },
    activity: {
      empty: 'No activity for this company yet.',
    },
    opportunities: {
      title: 'Related opportunities',
      description: 'Things you can act on at this company.',
    },
    angle: {
      title: 'Suggested outreach angle',
      description: 'A starting point for a personal message.',
      withSkillsAndSignal: (skills: string, signal: string) =>
        `Mention your experience with ${skills} and connect it to their news: “${signal}”.`,
      withSignal: (signal: string) => `Refer to their news, “${signal}”, and explain how you could help with it.`,
      withSkills: (skills: string) => `Lead with your experience in ${skills}: the skills this company looks for.`,
      generic: 'Explain what draws you to this company and which of your skills fit their work.',
      cta: 'Generate outreach',
    },
  },
  empty: {
    title: 'No companies yet',
    description: 'Companies appear here as soon as your agent finds opportunities at them.',
    cta: 'Go to search',
  },
  noMatches: 'No companies match these filters.',
  toWatch: {
    title: 'Companies to watch',
    description: 'Where your best matches and signals are.',
    viewAll: 'View all companies',
  },
};
