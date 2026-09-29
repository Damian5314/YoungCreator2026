import type { settings as en } from '../en/settings';

export const settings: typeof en = {
  meta: {
    title: 'Instellingen',
  },
  page: {
    title: 'Instellingen',
    description: 'Beheer je agent, je account en hoe Unlisted eruitziet.',
  },
  billingCard: {
    title: 'Credits & betalingen',
    description: (credits: number) =>
      `Je hebt ${credits} ${credits === 1 ? 'credit' : 'credits'}. Koop er meer of bekijk je betalingen.`,
    button: 'Credits & betalingen',
  },
  intro: {
    title: 'Introductie',
    description: 'Bekijk de korte rondleiding over hoe je agent werkt nog een keer.',
    button: 'Introductie tonen',
  },
  account: {
    title: 'Account',
    description: 'Het e-mailadres waarmee je inlogt.',
    emailLabel: 'E-mailadres',
    updateEmail: 'E-mail wijzigen',
  },
  password: {
    title: 'Wachtwoord',
    description: 'Kies een nieuw wachtwoord voor je account.',
    label: 'Nieuw wachtwoord',
    hint: 'Minimaal 8 tekens. Een lange wachtzin werkt het best.',
    update: 'Wachtwoord wijzigen',
  },
  appearance: {
    title: 'Weergave',
    darkMode: 'Donkere modus',
    darkModeDescription: 'Wissel tussen een lichte en een donkere interface.',
  },
  data: {
    title: 'Je gegevens',
    description: 'Download alles wat Unlisted over je bewaart: profiel, cv-tekst, zoekopdrachten, matches, e-mails, credits en betalingen.',
    export: 'Mijn gegevens downloaden',
  },
  danger: {
    title: 'Account verwijderen',
    description: 'Verwijder je Unlisted-account definitief. Dit kan niet ongedaan worden gemaakt.',
    consequences: [
      'Je profiel, cv, zoekopdrachten, matches en e-mails worden direct verwijderd.',
      'Lopende zoekopdrachten stoppen en resterende credits vervallen.',
      'Betaalgegevens bewaren we zeven jaar zonder je naam, omdat de wet dat verplicht.',
    ],
    confirmLabel: (email: string) => `Typ ${email} ter bevestiging`,
    button: 'Mijn account verwijderen',
    deleting: 'Verwijderen…',
    confirmMismatch: 'Het e-mailadres komt niet overeen met je account.',
    demoLocked: 'Het demo-account kan niet worden verwijderd.',
    failed: 'Je account verwijderen is mislukt. Probeer het opnieuw of neem contact op met support.',
    deletedTitle: 'Je account is verwijderd',
    deletedBody: 'Je profiel, cv, zoekopdrachten en e-mails zijn weg. Bedankt dat je Unlisted hebt geprobeerd, en veel succes met zoeken.',
  },
  session: {
    title: 'Sessie',
    loggedInAs: (name: string) => `Ingelogd als ${name}.`,
    logout: 'Uitloggen',
  },
  agent: {
    title: 'Jouw agent',
    description: 'Bepaal hoeveel je agent zelf mag doen.',
    levelLegend: 'Automatiseringsniveau',
    levels: {
      1: {
        title: 'Assistent',
        description: 'Je agent vindt kansen en schrijft de e-mails. Jij checkt ze en verstuurt ze zelf.',
      },
      2: {
        title: 'Semi-automatisch',
        description: 'Je agent bereidt alles voor. Jij keurt goed met één klik en Unlisted verstuurt het.',
      },
      3: {
        title: 'Volledig automatisch',
        description: 'Je agent zoekt, schrijft en verstuurt zelf e-mails voor je sterkste matches, binnen een daglimiet.',
      },
    },
    lockedLabel: 'Vereist een creditpakket',
    lockedHint: {
      text: 'Niveau 2 en 3 zitten bij elk creditpakket.',
      link: 'Bekijk creditpakketten',
    },
    consent:
      'Ik geef Unlisted toestemming om namens mij e-mails te versturen naar contactpersonen bij kansen die sterk bij mijn profiel passen. Antwoorden gaan naar mijn eigen e-mailadres.',
    dailyLimitLabel: 'Maximaal aantal e-mails per dag',
    dailyLimitHint: 'Tussen 0 en 20. Je agent verstuurt er nooit meer dan dit binnen 24 uur.',
    linkedinLabel: 'LinkedIn',
    linkedinHint: 'Komt onder je e-mails te staan.',
    portfolioLabel: 'Portfolio of GitHub',
    portfolioHint: 'Optioneel.',
    save: 'Agentinstellingen opslaan',
    errors: {
      sessionExpired: 'Je sessie is verlopen. Log opnieuw in.',
      invalidUrl: 'Vul een volledige link in, beginnend met https://',
      consentRequired: 'Geef toestemming om namens jou e-mails te versturen om volledige automatisering te gebruiken.',
      checkSettings: 'Controleer je instellingen.',
    },
  },
};
