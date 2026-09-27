import type { auth as en } from '../en/auth';

export const auth: typeof en = {
  meta: {
    loginTitle: 'Inloggen',
    registerTitle: 'Account aanmaken',
  },
  form: {
    registerTitle: 'Maak je account aan',
    loginTitle: 'Welkom terug',
    registerSubtitle: 'Stel je zoekopdracht in een paar minuten in. Je eerste zoekopdracht is gratis.',
    loginSubtitle: 'Log in om je nieuwste matches en nieuwe kansen te zien.',
    nameLabel: 'Volledige naam',
    namePlaceholder: 'Alex Morgan',
    emailLabel: 'E-mail',
    emailPlaceholder: 'jij@voorbeeld.nl',
    passwordLabel: 'Wachtwoord',
    passwordHint: 'Minimaal 6 tekens.',
    showPassword: 'Wachtwoord tonen',
    hidePassword: 'Wachtwoord verbergen',
    submitRegister: 'Account aanmaken',
    submitLogin: 'Inloggen',
    haveAccount: 'Heb je al een account?',
    newHere: 'Nieuw bij Unlisted?',
    loginLink: 'Inloggen',
    registerLink: 'Maak een account aan',
    tagline: 'Echte kansen. Niet alleen vacatures.',
  },
  layout: {
    backToHome: 'Terug naar home',
    madeIn: 'Gemaakt in Nederland.',
  },
  visual: {
    photoAlt: 'Internationale student met een laptop aan een Amsterdamse gracht tijdens het gouden uur',
    noteLine1: 'Je volgende kans',
    noteLine2: 'is misschien dichterbij dan je denkt.',
    signalLabel: 'Bedrijfssignaal:',
    signalDetected: 'Bedrijfssignaal gedetecteerd',
    signalTags: 'Signaaltags',
  },
  messages: {
    confirmSignup: 'Check je inbox en klik op de link om je account te bevestigen.',
    confirmNewEmail: 'Check je inbox om je nieuwe adres te bevestigen',
    passwordUpdated: 'Wachtwoord bijgewerkt',
  },
};
