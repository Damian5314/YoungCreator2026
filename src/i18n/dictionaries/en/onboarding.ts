// Introductie na de eerste keer inloggen (WelcomeIntro).
export const onboarding = {
  welcome: {
    // Kop in twee regels: begroeting + wat de agent is
    greeting: 'Welcome!',
    greetingNamed: (firstName: string) => `Welcome, ${firstName}!`,
    tagline: 'Meet your opportunity agent.',
    body: 'Unlisted finds jobs, internships, events and hidden opportunities in the Netherlands, and tells you why each one fits you. Here’s how it works in three steps.',
    noteFree: 'Your first search is free.',
    noteCredits: (credits: number) => `You have ${credits} credits to get started.`,
  },
  // De drie kaarten op het welkomstscherm (elk met een mini-voorbeeld van de product-UI)
  overview: {
    label: 'How Unlisted works',
    profile: {
      title: 'Know me',
      text: 'Build your profile and tell Unlisted what you’re looking for.',
      previewTitle: 'Your profile',
      chips: ['Internship', 'Data', 'Amsterdam'],
    },
    hunt: {
      title: 'Find signals',
      text: 'We look beyond job boards and track what companies are doing.',
    },
    outreach: {
      title: 'Take action',
      text: 'Get matched opportunities and personalized outreach.',
    },
  },
  // Drie schermen, één verhaal: wie ben je → wat zoeken we → wat doe je ermee.
  // Bewust geen prijzen of techniek: de uitleg gaat over wat Unlisted voor je doet.
  steps: {
    profile: {
      title: 'Tell your agent who you are',
      body: 'Add your situation, skills and interests, and upload your CV. The better Unlisted knows you, the sharper your matches get.',
      where: 'Search → Preferences',
      cvUploaded: 'CV uploaded',
    },
    hunt: {
      title: 'Let Unlisted find the signals',
      body: 'Unlisted looks beyond job boards. It searches jobs, internships, events and company news for signals that could lead to your next opportunity.',
      highlight: 'Sometimes the opportunity exists before a vacancy does.',
      demoNote: 'Demo mode: see how Unlisted finds and matches opportunities using your profile.',
      where: 'Search → Dashboard',
      opportunityDetected: 'Potential opportunity detected',
    },
    outreach: {
      title: 'Turn matches into action',
      body: 'Each opportunity gets a match score and a clear reason it fits you. For strong matches, Unlisted can prepare a personal outreach message for you to review and send.',
      where: 'Dashboard → Outreach',
      matchScore: (score: number) => `${score}% match`,
      role: 'Business Analyst Intern',
      chips: ['Data', 'Strategy', 'Internship'],
      reviewMessage: 'Review message',
    },
  },
  dialog: {
    close: 'Close introduction',
    gettingStarted: 'Getting started',
    stepOf: (step: number, total: number) => `Step ${step} of ${total}`,
    whereToFind: 'Where to find it: ',
    goToStep: (step: number) => `Go to step ${step}`,
    skip: 'Skip',
    back: 'Back',
    startFinding: 'Start finding opportunities',
    showMe: 'Show me how',
    next: 'Next',
  },
};
