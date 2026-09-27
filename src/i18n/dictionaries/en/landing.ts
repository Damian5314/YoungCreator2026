// Teksten van de landingspagina. Iconen, links, afbeeldingen en andere niet-tekstuele
// config staan in src/app/(marketing)/_content/landing.ts (buildLanding voegt ze samen).
// Tuples ([string, string]) zijn vaste visuele regels: de vertaling moet evenveel regels hebben.
export const landing = {
  nav: {
    links: {
      problem: 'Problem',
      howItWorks: 'How it works',
      forStudents: 'For students',
    },
    signIn: 'Sign in',
    cta: 'Find opportunities',
  },

  media: {
    heroAlt: 'International student smiling with a laptop beside an Amsterdam canal at golden hour',
    storyAlt:
      'A tired international student at a desk late at night, head resting on one hand, staring at a laptop by the light of a desk lamp',
  },

  hero: {
    eyebrow: 'For international students in the Netherlands',
    headline: {
      lead: ['You invested in', 'your future.'] as [string, string],
      accent: ['Now find the', 'opportunities.'] as [string, string],
    },
    body: 'Unlisted helps international students find jobs, internships and hidden opportunities in the Netherlands by analyzing real-time company signals, news and hiring activity, so you don’t have to go back home.',
    primaryCta: 'Find my opportunities',
    secondaryCta: 'Watch our story',
    note: ['Your first search is free', 'Then pay per search, no subscription'] as [string, string],
    benefits: {
      signals: ['Real-time', 'company signals'] as [string, string],
      hidden: ['Hidden', 'opportunities'] as [string, string],
      outreach: ['Personalized', 'outreach'] as [string, string],
    },
    annotations: {
      student: ['Different country.', 'Same ambitions.'] as [string, string],
      cards: ['Turn company signals', 'into opportunities.'] as [string, string],
    },
  },

  heroCards: {
    signal: {
      time: '2 hours ago',
      title: 'ASML announces new R&D center in Eindhoven',
      tags: ['Expansion', 'Eindhoven', 'R&D'],
      tagsLabel: 'Signal tags',
    },
    opportunity: {
      label: 'Opportunity for you',
      title: 'This could be a great fit for your skills.',
      reason: 'Based on company expansion and your profile.',
      cta: 'Explore opportunity',
    },
    outreach: {
      label: 'Suggested outreach',
      greeting: 'Hi ASML team,',
      preview: 'I saw your announcement about the new R&D center in Eindhoven…',
      cta: 'Send message',
    },
    match: {
      label: 'Strong match',
      reasons: ['Your skills match', 'Relevant location', 'Growing team'],
    },
  },

  trust: {
    label: 'Trusted by students from top universities',
  },

  story: {
    eyebrow: 'The problem',
    title: ['You didn’t come', 'all this way to', 'have no', 'opportunities.'] as [string, string, string, string],
    body: 'A short story about the real challenges international students face — and how Unlisted changes that.',
    watch: 'Watch our story',
    videoPending: {
      title: 'Our story is coming soon.',
      text: 'We’re putting the finishing touches on the film.',
    },
    closeVideo: 'Close video',
    statements: [
      { title: '200+ applications', detail: 'No response.' },
      { title: 'Months of searching.', detail: 'Still nothing.' },
      { title: 'Do I have to go back home?', detail: null },
    ] as { title: string; detail: string | null }[],
    annotation: ['A reality many', 'international students face.'] as [string, string],
  },

  signals: {
    eyebrow: 'A smarter way to find opportunities',
    title: { lead: 'We look beyond', accent: 'job boards.' },
    body: 'Unlisted analyzes real-time company signals, news and hiring activity to find opportunities before everyone else sees them.',
    items: {
      news: ['Company', 'news'] as [string, string],
      funding: ['Funding', 'rounds'] as [string, string],
      hiring: ['Hiring', 'activity'] as [string, string],
      expansion: ['Expansion', 'signals'] as [string, string],
    },
    primaryCta: 'Get started for free',
    secondaryCta: 'Watch our story',
    note: ['Your first search is free', 'After that, buy credits to keep searching'] as [string, string],
    annotation: ['Real opportunities.', 'Not just job listings.'] as [string, string],
    dashboardAlt:
      'The Unlisted dashboard: top opportunities matched to your profile, live company signals such as funding and hiring, and your agent’s recent activity',
  },

  finalCta: {
    title: ['Your next opportunity', 'might already be happening.'] as [string, string],
    body: 'Find it with Unlisted.',
    primary: 'Find my opportunities',
    secondary: 'Watch how it works',
    trust: ['First search free for everyone', 'Then pay per search with credits'] as [string, string],
    annotation: ['Same city.', 'More opportunities.'] as [string, string],
  },

  footer: {
    about:
      'Unlisted helps international students in the Netherlands turn real-time company signals into jobs, internships and hidden opportunities.',
    statement: 'Real opportunities. Not just job listings.',
    columns: {
      product: {
        title: 'Product',
        links: {
          howItWorks: 'How it works',
          forStudents: 'For students',
        },
      },
      getStarted: {
        title: 'Get started',
        links: {
          findOpportunities: 'Find opportunities',
          createAccount: 'Create account',
          signIn: 'Sign in',
        },
      },
    },
    social: {
      title: 'Follow the signal',
      text: 'Stay updated and join our journey.',
      // Toegankelijke naam van een social-tegel, bijv. "Unlisted on LinkedIn"
      linkLabel: (platform: string) => `Unlisted on ${platform}`,
      annotation: ['Same city.', 'More opportunities.'] as [string, string],
    },
    tagline: 'Made in the Netherlands, for international students.',
  },
};
