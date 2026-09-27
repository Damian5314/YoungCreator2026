// Detailpagina van een kans, de kaart in de resultatenlijst en de snelle acties eronder.
export const matches = {
  meta: {
    title: 'Opportunity',
  },
  detail: {
    allResults: 'All results',
    hiddenOpportunity: 'Hidden opportunity',
    company: 'Company',
    location: 'Location',
    remotePossible: 'remote possible',
    date: 'Date',
    contact: 'Contact',
    website: 'Website',
    viewOriginal: 'View original',
    whyFits: {
      title: 'Why this fits you',
      description: 'How your agent matched this to your profile.',
    },
    noReasons: 'No specific reasons were recorded for this match.',
    whyNow: 'Why now',
    foundVia: (source: string, date: string) => `Found via ${source} on ${date}`,
    reachOut: {
      title: 'Reach out',
      description: 'Take the first step. A personal email, ready in seconds.',
    },
  },
  card: {
    hiddenOpportunity: 'Hidden opportunity',
    remote: 'Remote',
    remoteSuffix: 'remote',
    whyNow: 'Why now:',
    foundVia: (source: string, date: string) => `Found via ${source} · ${date}`,
    view: 'View',
  },
  score: {
    label: 'match',
  },
  actions: {
    outreachStatus: {
      draft: 'Email ready to review',
      sending: 'Sending…',
      sent: 'Email sent',
      failed: 'Email failed, retry',
    },
    reachOut: 'Reach out',
    undo: 'Undo',
    notForMe: 'Not for me',
  },
  errors: {
    sessionExpired: 'Your session expired. Please log in again.',
    invalidStatus: 'Invalid status.',
  },
};
