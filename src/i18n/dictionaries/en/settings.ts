// Instellingenpagina: agent, credits, introductie, account, wachtwoord, weergave en sessie.
export const settings = {
  meta: {
    title: 'Settings',
  },
  page: {
    title: 'Settings',
    description: 'Manage your agent, your account and how Unlisted looks.',
  },
  billingCard: {
    title: 'Credits & billing',
    description: (credits: number) =>
      `You have ${credits} ${credits === 1 ? 'credit' : 'credits'}. Buy more or see your payments.`,
    button: 'Credits & billing',
  },
  intro: {
    title: 'Introduction',
    description: 'See the short tour of how your agent works again.',
    button: 'Show introduction',
  },
  account: {
    title: 'Account',
    description: 'The email address you log in with.',
    emailLabel: 'Email address',
    updateEmail: 'Update email',
  },
  password: {
    title: 'Password',
    description: 'Choose a new password for your account.',
    label: 'New password',
    hint: 'At least 8 characters. A long passphrase works best.',
    update: 'Update password',
  },
  appearance: {
    title: 'Appearance',
    darkMode: 'Dark mode',
    darkModeDescription: 'Switch between a light and a dark interface.',
  },
  data: {
    title: 'Your data',
    description: 'Download everything Unlisted stores about you: profile, CV text, searches, matches, emails, credits and payments.',
    export: 'Download my data',
  },
  danger: {
    title: 'Delete account',
    description: 'Permanently delete your Unlisted account. This can’t be undone.',
    consequences: [
      'Your profile, CV, searches, matches and emails are deleted right away.',
      'Running searches are stopped and remaining credits are lost.',
      'Payment records are kept for seven years without your name, because Dutch law requires it.',
    ],
    confirmLabel: (email: string) => `Type ${email} to confirm`,
    button: 'Delete my account',
    deleting: 'Deleting…',
    confirmMismatch: 'The email address doesn’t match your account.',
    demoLocked: 'The demo account can’t be deleted.',
    failed: 'Deleting your account failed. Please try again, or contact support.',
    deletedTitle: 'Your account has been deleted',
    deletedBody: 'Your profile, CV, searches and emails are gone. Thanks for trying Unlisted, and good luck with your search.',
  },
  session: {
    title: 'Session',
    loggedInAs: (name: string) => `Logged in as ${name}.`,
    logout: 'Log out',
  },
  agent: {
    title: 'Your agent',
    description: 'Decide how much your agent may do on its own.',
    levelLegend: 'Automation level',
    levels: {
      1: {
        title: 'Assistant',
        description: 'Your agent finds opportunities and writes the emails. You review them and send them yourself.',
      },
      2: {
        title: 'Semi-automatic',
        description: 'Your agent prepares everything. You approve with one click and Unlisted sends it.',
      },
      3: {
        title: 'Fully automatic',
        description: 'Your agent searches, writes and sends emails for your strongest matches on its own, within a daily limit.',
      },
    },
    lockedLabel: 'Needs a credit pack',
    lockedHint: {
      text: 'Levels 2 and 3 come with any credit pack.',
      link: 'See credit packs',
    },
    consent:
      'I allow Unlisted to send emails on my behalf to contacts at opportunities that strongly match my profile. Replies go to my own email address.',
    dailyLimitLabel: 'Maximum emails per day',
    dailyLimitHint: 'Between 0 and 20. Your agent never sends more than this in 24 hours.',
    linkedinLabel: 'LinkedIn',
    linkedinHint: 'Added below your emails.',
    portfolioLabel: 'Portfolio or GitHub',
    portfolioHint: 'Optional.',
    save: 'Save agent settings',
    errors: {
      sessionExpired: 'Your session expired. Please log in again.',
      invalidUrl: 'Enter a full link, starting with https://',
      consentRequired: 'Give permission to send emails on your behalf to use full automation.',
      checkSettings: 'Check your settings.',
    },
  },
};
