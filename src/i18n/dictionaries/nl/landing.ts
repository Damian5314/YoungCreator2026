import type { landing as en } from '../en/landing';

export const landing: typeof en = {
  nav: {
    links: {
      problem: 'Probleem',
      howItWorks: 'Hoe het werkt',
      forStudents: 'Voor studenten',
      pricing: 'Prijzen',
    },
    signIn: 'Inloggen',
    cta: 'Vind kansen',
  },

  media: {
    heroAlt: 'Lachende internationale student met een laptop aan een Amsterdamse gracht tijdens het gouden uur',
    storyAlt:
      'Een vermoeide internationale student laat op de avond aan een bureau, het hoofd op één hand, starend naar een laptop in het licht van een bureaulamp',
  },

  hero: {
    eyebrow: 'Voor internationale studenten in Nederland',
    headline: {
      lead: ['Je investeerde in', 'je toekomst.'],
      accent: ['Vind nu de', 'juiste kansen.'],
    },
    body: 'Unlisted helpt internationale studenten banen, stages en verborgen kansen in Nederland te vinden door realtime bedrijfssignalen, nieuws en wervingsactiviteit te analyseren, zodat je niet terug naar huis hoeft.',
    primaryCta: 'Vind mijn kansen',
    secondaryCta: 'Bekijk ons verhaal',
    note: ['Je eerste zoekopdracht is gratis', 'Daarna betaal je per zoekopdracht, geen abonnement'],
    benefits: {
      signals: ['Realtime', 'bedrijfssignalen'],
      hidden: ['Verborgen', 'kansen'],
      outreach: ['Persoonlijke', 'berichten'],
    },
    annotations: {
      student: ['Ander land.', 'Dezelfde ambities.'],
      cards: ['Zet bedrijfssignalen', 'om in kansen.'],
    },
  },

  heroCards: {
    exampleLabel: 'Voorbeeld',
    signal: {
      time: '2 uur geleden',
      title: 'ASML kondigt nieuw R&D-centrum in Eindhoven aan',
      tags: ['Uitbreiding', 'Eindhoven', 'R&D'],
      tagsLabel: 'Signaallabels',
    },
    opportunity: {
      label: 'Kans voor jou',
      title: 'Dit kan goed aansluiten bij jouw skills.',
      reason: 'Op basis van de bedrijfsuitbreiding en je profiel.',
      cta: 'Ontdek de kans',
    },
    outreach: {
      label: 'Voorgesteld bericht',
      greeting: 'Hoi ASML-team,',
      preview: 'Ik zag jullie aankondiging over het nieuwe R&D-centrum in Eindhoven…',
      cta: 'Bericht versturen',
    },
    match: {
      label: 'Sterke match',
      reasons: ['Je skills passen', 'Relevante locatie', 'Groeiend team'],
    },
  },

  trust: {
    label: 'Vertrouwd door studenten van topuniversiteiten',
  },

  story: {
    eyebrow: 'Het probleem',
    title: ['Je kwam niet', 'zo ver voor', 'een leven', 'zonder kansen.'],
    body: 'Een kort verhaal over de echte uitdagingen van internationale studenten — en hoe Unlisted dat verandert.',
    watch: 'Bekijk ons verhaal',
    videoPending: {
      title: 'Ons verhaal komt binnenkort.',
      text: 'We leggen de laatste hand aan de film.',
    },
    closeVideo: 'Video sluiten',
    statements: [
      { title: '200+ sollicitaties', detail: 'Geen reactie.' },
      { title: 'Maandenlang zoeken.', detail: 'Nog steeds niets.' },
      { title: 'Moet ik terug naar huis?', detail: null },
    ],
    annotation: ['Een realiteit voor veel', 'internationale studenten.'],
  },

  signals: {
    eyebrow: 'Een slimmere manier om kansen te vinden',
    title: { lead: 'Verder dan', accent: 'vacaturesites.' },
    body: 'Unlisted analyseert realtime bedrijfssignalen, nieuws en wervingsactiviteit om kansen te vinden voordat iemand anders ze ziet.',
    items: {
      news: ['Nieuws van', 'bedrijven'],
      funding: ['Nieuwe', 'investeringen'],
      hiring: ['Actieve', 'werving'],
      expansion: ['Signalen van', 'uitbreiding'],
    },
    primaryCta: 'Gratis aan de slag',
    secondaryCta: 'Bekijk ons verhaal',
    note: ['Je eerste zoekopdracht is gratis', 'Daarna koop je credits om verder te zoeken'],
    annotation: ['Echte kansen.', 'Niet alleen vacatures.'],
    dashboardAlt:
      'Het Unlisted-dashboard: de beste kansen die bij je profiel passen, live bedrijfssignalen zoals investeringen en vacatures, en de recente activiteit van je agent',
  },

  finalCta: {
    title: ['Je volgende kans', 'ontstaat misschien nu al.'],
    body: 'Vind hem met Unlisted.',
    primary: 'Vind mijn kansen',
    secondary: 'Bekijk hoe het werkt',
    trust: ['Eerste zoekopdracht gratis voor iedereen', 'Daarna betaal je per zoekopdracht met credits'],
    annotation: ['Dezelfde stad.', 'Meer kansen.'],
  },

  footer: {
    about:
      'Unlisted helpt internationale studenten in Nederland om realtime bedrijfssignalen om te zetten in banen, stages en verborgen kansen.',
    statement: 'Echte kansen. Niet alleen vacatures.',
    columns: {
      product: {
        title: 'Product',
        links: {
          howItWorks: 'Hoe het werkt',
          forStudents: 'Voor studenten',
          pricing: 'Prijzen',
        },
      },
      getStarted: {
        title: 'Aan de slag',
        links: {
          findOpportunities: 'Vind kansen',
          createAccount: 'Account aanmaken',
          signIn: 'Inloggen',
        },
      },
    },
    social: {
      title: 'Volg het signaal',
      text: 'Blijf op de hoogte en volg onze reis.',
      linkLabel: (platform: string) => `Unlisted op ${platform}`,
      annotation: ['Dezelfde stad.', 'Meer kansen.'],
    },
    tagline: 'Gemaakt in Nederland, voor internationale studenten.',
    legal: {
      label: 'Juridisch',
      privacy: 'Privacy',
      terms: 'Voorwaarden',
      faq: 'FAQ',
      contact: 'Contact',
    },
    productOf: 'Unlisted is een product van',
    kvk: 'KvK',
    vat: 'Btw-id',
  },
};
