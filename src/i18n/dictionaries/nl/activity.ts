import type { activity as en } from '../en/activity';

export const activity: typeof en = {
  title: 'Recente activiteit',
  description: 'Wat je agent de laatste tijd deed.',
  empty: 'Nog geen activiteit. Start een zoekopdracht en het werk van je agent verschijnt hier.',
  items: {
    search_completed: (count: number) =>
      count === 0 ? 'Zoekopdracht klaar · niets nieuws' : `Zoekopdracht klaar · ${count} ${count === 1 ? 'nieuwe kans' : 'nieuwe kansen'}`,
    search_failed: 'Zoekopdracht mislukt · je credit is teruggestort',
    hidden_opportunity: (company: string) => `Verborgen kans gevonden bij ${company}`,
    opportunity_detected: (company: string) => `Sterke match gevonden bij ${company}`,
    signal_detected: (company: string) => `Nieuw bedrijfssignaal bij ${company}`,
    draft_created: (company: string) => `Conceptbericht klaar voor ${company}`,
    email_sent: (company: string) => `E-mail verstuurd naar ${company}`,
  },
};
