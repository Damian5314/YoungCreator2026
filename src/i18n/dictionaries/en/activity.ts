// Tijdlijn van je agent (dashboard, bedrijfspagina en meldingen), zie src/modules/activity/activity.ts.
export const activity = {
  title: 'Recent activity',
  description: 'What your agent did lately.',
  empty: 'No activity yet. Run a search and your agent’s work shows up here.',
  items: {
    search_completed: (count: number) =>
      count === 0 ? 'Search completed · nothing new' : `Search completed · ${count} new ${count === 1 ? 'opportunity' : 'opportunities'}`,
    search_failed: 'Search failed · your credit was refunded',
    hidden_opportunity: (company: string) => `Hidden opportunity detected at ${company}`,
    opportunity_detected: (company: string) => `Strong match found at ${company}`,
    signal_detected: (company: string) => `New company signal at ${company}`,
    draft_created: (company: string) => `Outreach draft ready for ${company}`,
    email_sent: (company: string) => `Email sent to ${company}`,
  },
};
