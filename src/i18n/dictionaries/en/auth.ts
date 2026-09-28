// Inloggen en registreren: formulier, paginatitels en meldingen uit de auth-actions.
export const auth = {
  meta: {
    loginTitle: 'Log in',
    registerTitle: 'Create account',
  },
  form: {
    registerTitle: 'Create your account',
    loginTitle: 'Welcome back',
    registerSubtitle: 'Set up your search in a few minutes. Your first search is free.',
    loginSubtitle: 'Log in to see your latest matches and new opportunities.',
    nameLabel: 'Full name',
    namePlaceholder: 'Alex Morgan',
    emailLabel: 'Email',
    emailPlaceholder: 'you@example.com',
    passwordLabel: 'Password',
    passwordHint: 'At least 6 characters.',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    submitRegister: 'Create account',
    submitLogin: 'Log in',
    haveAccount: 'Already have an account?',
    newHere: 'New to Unlisted?',
    loginLink: 'Log in',
    registerLink: 'Create an account',
    tagline: 'Real opportunities. Not just job listings.',
    pending: 'Please wait…',
    demoTitle: 'Demo account',
    useDemo: 'Use demo',
    noSubscription: 'No subscription',
    payPerUse: 'Pay only for what you use',
    // "By creating an account, you agree to our {terms} and acknowledge our {privacy}."
    consent: {
      before: 'By creating an account, you agree to our',
      terms: 'Terms of Service',
      middle: 'and acknowledge our',
      privacy: 'Privacy Policy',
      after: '.',
    },
  },
  // Nog niet gekoppeld: voor de auth-layout, AuthVisual en AuthSignalCard (vertaalt de lead)
  layout: {
    backToHome: 'Back to home',
    madeIn: 'Made in the Netherlands.',
  },
  visual: {
    photoAlt: 'International student with a laptop beside an Amsterdam canal at golden hour',
    noteLine1: 'Your next opportunity',
    noteLine2: 'could be closer than you think.',
    signalLabel: 'Company signal:',
    signalDetected: 'Company signal detected',
    signalTags: 'Signal tags',
  },
  messages: {
    confirmSignup: 'Check your inbox and click the link to confirm your account.',
    confirmNewEmail: 'Check your inbox to confirm the new address',
    passwordUpdated: 'Password updated',
  },
};
