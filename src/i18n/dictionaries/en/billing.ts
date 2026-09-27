// Credits en betalen: overzichtspagina, creditpakketten, betaalgeschiedenis, terugkeerpagina en meldingen.
export const billing = {
  meta: {
    title: 'Credits & billing',
    paymentTitle: 'Payment',
  },
  page: {
    title: 'Credits & billing',
    description: 'Pay only for what you use. No subscription.',
    balance: 'Your balance',
    unlocked: 'Automations are unlocked.',
    locked: 'Automations unlock with your first credit pack.',
    startSearch: 'Start a search',
    howItWorks: {
      title: 'How credits work',
      free: 'Your first search is free.',
      perSearch: (cost: number) => `Every search costs ${cost} credit, whether you start it or it runs on a schedule.`,
      automations: 'Any credit pack unlocks automations: automatic searches and sending emails through Unlisted.',
      noExpiry: 'Credits never expire. If a search fails, you get the credit back.',
    },
    buyCredits: 'Buy credits',
    payNote: "Pay with iDEAL, card or another method via Mollie. You'll come straight back here afterwards.",
  },
  banner: {
    notAvailable: "Buying credits isn't available yet. Payments will open soon.",
    testMode: "Test mode: you'll see Mollie's test checkout, where you choose the outcome. No real money is charged.",
  },
  // Weergavetekst per pakket-id uit src/modules/billing/plans.ts
  packs: {
    starter: {
      name: 'Starter',
      description: 'Try it for a few weeks of searching.',
    },
    plus: {
      name: 'Plus',
      description: 'A daily search for a month, with automations.',
    },
    pro: {
      name: 'Pro',
      description: 'For your whole search year, with room to spare.',
    },
  },
  grid: {
    included: {
      searches: 'Manual and automatic searches',
      automations: 'Automations unlocked',
      noExpiry: 'Credits never expire',
    },
    mostPopular: 'Most popular',
    searchesPrice: (credits: number, price: string) => `${credits} searches · ${price} per search`,
    opening: 'Opening checkout…',
    buy: (credits: number) => `Buy ${credits} credits`,
  },
  history: {
    title: 'Payment history',
    description: 'Your credit purchases. Payments are handled securely by Mollie.',
    empty: 'No purchases yet.',
    creditPack: 'Credit pack',
    item: (pack: string, credits: number) => `${pack} · ${credits} credits`,
    test: 'Test',
    statuses: {
      paid: 'Paid',
      open: 'Not completed',
      pending: 'Processing',
      authorized: 'Processing',
      failed: 'Failed',
      canceled: 'Canceled',
      expired: 'Expired',
    },
  },
  return: {
    creditPack: 'Credit pack',
    summary: (pack: string, credits: number, amount: string) => `${pack} · ${credits} credits · ${amount}`,
    paid: {
      title: 'Payment received',
      body: (credits: number) => `${credits} credits were added to your account. Automations are unlocked.`,
      balance: (credits: number) => `Balance: ${credits} ${credits === 1 ? 'credit' : 'credits'}`,
      startSearch: 'Start a search',
      dashboard: 'Go to dashboard',
    },
    waiting: {
      title: 'Waiting for your payment',
      body: "We're checking with Mollie. This page updates by itself. Closed the payment page? You can pick a pack again.",
      back: 'Back to credits',
    },
    failed: {
      canceled: 'Payment canceled',
      expired: 'Payment expired',
      failed: 'Payment failed',
      body: 'Nothing was charged. You can try again whenever you like.',
      retry: 'Try again',
    },
  },
  errors: {
    pickPack: 'Pick a credit pack.',
    startFailed: 'Something went wrong while starting the payment. Please try again.',
    notSetUp: 'Payments aren’t set up yet.',
    packMissing: 'That credit pack doesn’t exist.',
    couldNotStart: 'We couldn’t start the payment. Please try again in a moment.',
  },
  entitlements: {
    automationsLocked: 'Automations unlock with any credit pack. Your first search is on us.',
  },
};
