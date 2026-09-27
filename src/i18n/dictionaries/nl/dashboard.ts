import type { dashboard as en } from '../en/dashboard';

export const dashboard: typeof en = {
  meta: {
    title: 'Dashboard',
  },
  header: {
    welcomeName: (name: string) => `Welkom terug, ${name}`,
    welcome: 'Welkom terug',
    description: 'Alles wat je zoekopdrachten tot nu toe hebben gevonden.',
    newSearch: 'Nieuwe zoekopdracht',
  },
  credits: {
    outOfCredits: 'Je credits zijn op.',
    freeSearchUsed: 'Je hebt je gratis zoekopdracht gebruikt.',
    keepSearching: 'Koop een creditpakket om verder te zoeken.',
    keepSearchingAndUnlock:
      'Koop een creditpakket om verder te zoeken en automatisch zoeken en versturen te ontgrendelen.',
    seePacks: 'Bekijk creditpakketten',
  },
  drafts: {
    prepared: (count: number) =>
      `Je agent heeft ${count} ${count === 1 ? 'e-mail' : 'e-mails'} voor je klaargezet.`,
    review: 'Bekijk en verstuur ze om de eerste stap te zetten.',
  },
  empty: {
    title: 'Nog geen resultaten',
    description: 'Start je eerste zoekopdracht en je matches verschijnen hier.',
    cta: 'Naar zoeken',
  },
  searchProfile: {
    title: 'Zoekprofiel',
    description: 'Waar we naar zoeken.',
    notSetUp: 'Je hebt je zoekopdracht nog niet ingesteld.',
    edit: 'Zoekprofiel bewerken',
    setUp: 'Stel je zoekopdracht in',
  },
  stats: {
    found: 'Kansen gevonden',
    newSinceLast: 'Nieuw sinds vorige zoekopdracht',
    hidden: 'Verborgen kansen',
    daysLeft: 'Dagen over in je zoekjaar',
  },
  results: {
    title: 'Resultaten',
    filterByStatus: 'Filter op status',
    allExceptRejected: 'Alles behalve niet interessant',
    allStatuses: 'Alle statussen',
    allTypes: 'Alle types',
    noMatches: 'Geen resultaten voor deze filters.',
  },
  schedule: {
    title: 'Automatisch zoeken',
    description: 'Laat Unlisted volgens een planning voor je zoeken.',
    locked: 'Automatisch zoeken zit bij elk creditpakket.',
    seePacks: 'Bekijk creditpakketten',
    runAutomatically: 'Automatisch uitvoeren',
    frequency: 'Frequentie',
    frequencies: {
      daily: 'Dagelijks',
      weekly: 'Wekelijks',
    },
    day: 'Dag',
    days: ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'],
    time: 'Tijd',
    paused: 'Automatisch zoeken staat op pauze.',
    pickTime: 'Kies een tijd om je zoekopdracht in te plannen.',
    nextRun: (when: string) => `Volgende zoekopdracht: ${when}`,
    nextRunPending: 'Volgende zoekopdracht: …',
    costNote: (cost: number) =>
      `Elke zoekopdracht kost ${cost} ${cost === 1 ? 'credit' : 'credits'}. Je agent bereidt ook e-mails voor de beste matches voor.`,
  },
};
