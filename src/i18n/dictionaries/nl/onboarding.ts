import type { onboarding as en } from '../en/onboarding';

export const onboarding: typeof en = {
  welcome: {
    greeting: 'Welkom!',
    greetingNamed: (firstName: string) => `Welkom, ${firstName}!`,
    tagline: 'Maak kennis met je kansenagent.',
    body: 'Unlisted vindt banen, stages, evenementen en verborgen kansen in Nederland, en vertelt je waarom elke kans bij je past. Zo werkt het, in drie stappen.',
    noteFree: 'Je eerste zoekopdracht is gratis.',
    noteCredits: (credits: number) => `Je hebt ${credits} credits om mee te beginnen.`,
  },
  overview: {
    label: 'Zo werkt Unlisted',
    profile: {
      title: 'Leer mij kennen',
      text: 'Bouw je profiel en vertel Unlisted wat je zoekt.',
      previewTitle: 'Jouw profiel',
      chips: ['Stage', 'Data', 'Amsterdam'],
    },
    hunt: {
      title: 'Vind signalen',
      text: 'We kijken verder dan vacaturesites en volgen wat bedrijven doen.',
    },
    outreach: {
      title: 'Kom in actie',
      text: 'Ontvang passende kansen en persoonlijke berichten.',
    },
  },
  steps: {
    profile: {
      title: 'Vertel je agent wie je bent',
      body: 'Vul je situatie, skills en interesses in en upload je cv. Hoe beter Unlisted je kent, hoe scherper je matches worden.',
      where: 'Zoeken → Voorkeuren',
      cvUploaded: 'Cv geüpload',
    },
    hunt: {
      title: 'Laat Unlisted de signalen vinden',
      body: 'Unlisted kijkt verder dan vacaturesites. Het doorzoekt banen, stages, evenementen en bedrijfsnieuws op signalen die tot je volgende kans kunnen leiden.',
      highlight: 'Soms bestaat de kans al voordat er een vacature is.',
      demoNote: 'Demomodus: zie hoe Unlisted kansen vindt en matcht met jouw profiel.',
      where: 'Zoeken → Dashboard',
      opportunityDetected: 'Mogelijke kans gevonden',
    },
    outreach: {
      title: 'Zet je matches om in actie',
      body: 'Elke kans krijgt een matchscore en een duidelijke reden waarom hij bij je past. Voor sterke matches kan Unlisted een persoonlijk bericht voorbereiden, dat jij bekijkt en verstuurt.',
      where: 'Dashboard → Berichten',
      matchScore: (score: number) => `${score}% match`,
      role: 'Stagiair Business Analyst',
      chips: ['Data', 'Strategie', 'Stage'],
      reviewMessage: 'Bericht bekijken',
    },
  },
  dialog: {
    close: 'Introductie sluiten',
    gettingStarted: 'Aan de slag',
    stepOf: (step: number, total: number) => `Stap ${step} van ${total}`,
    whereToFind: 'Waar je het vindt: ',
    goToStep: (step: number) => `Naar stap ${step}`,
    skip: 'Overslaan',
    back: 'Terug',
    startFinding: 'Start met kansen vinden',
    showMe: 'Laat zien hoe',
    next: 'Volgende',
  },
};
