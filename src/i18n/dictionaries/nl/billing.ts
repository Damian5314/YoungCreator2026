import type { billing as en } from '../en/billing';

export const billing: typeof en = {
  meta: {
    title: 'Credits & betalingen',
    paymentTitle: 'Betaling',
  },
  page: {
    title: 'Credits & betalingen',
    description: 'Betaal alleen voor wat je gebruikt. Geen abonnement.',
    balance: 'Je saldo',
    unlocked: 'Automatiseringen zijn ontgrendeld.',
    locked: 'Automatiseringen worden ontgrendeld met je eerste creditpakket.',
    startSearch: 'Start een zoekopdracht',
    howItWorks: {
      title: 'Zo werken credits',
      free: 'Je eerste zoekopdracht is gratis.',
      perSearch: (cost: number) =>
        `Elke zoekopdracht kost ${cost} credit, of je hem nu zelf start of hij volgens je planning draait.`,
      automations: 'Elk creditpakket ontgrendelt automatiseringen: automatische zoekopdrachten en e-mails versturen via Unlisted.',
      noExpiry: 'Credits verlopen nooit. Mislukt een zoekopdracht, dan krijg je de credit terug.',
    },
    buyCredits: 'Credits kopen',
    payNote: 'Betaal met iDEAL, kaart of een andere methode via Mollie. Daarna kom je meteen hier terug.',
  },
  banner: {
    notAvailable: 'Credits kopen is nog niet mogelijk. Betalen kan binnenkort.',
    testMode: 'Testmodus: je ziet de testcheckout van Mollie, waar je zelf de uitkomst kiest. Er wordt geen echt geld afgeschreven.',
  },
  packs: {
    starter: {
      name: 'Starter',
      description: 'Om het een paar weken zoeken te proberen.',
    },
    plus: {
      name: 'Plus',
      description: 'Een maand lang elke dag een zoekopdracht, met automatiseringen.',
    },
    pro: {
      name: 'Pro',
      description: 'Voor je hele zoekjaar, met ruimte over.',
    },
  },
  grid: {
    included: {
      searches: 'Handmatige en automatische zoekopdrachten',
      automations: 'Automatiseringen ontgrendeld',
      noExpiry: 'Credits verlopen nooit',
    },
    mostPopular: 'Populairst',
    searchesPrice: (credits: number, price: string) => `${credits} zoekopdrachten · ${price} per zoekopdracht`,
    opening: 'Checkout openen…',
    buy: (credits: number) => `Koop ${credits} credits`,
  },
  history: {
    title: 'Betaalgeschiedenis',
    description: 'Je aankopen van credits. Betalingen worden veilig afgehandeld door Mollie.',
    empty: 'Nog geen aankopen.',
    creditPack: 'Creditpakket',
    item: (pack: string, credits: number) => `${pack} · ${credits} credits`,
    test: 'Test',
    statuses: {
      paid: 'Betaald',
      open: 'Niet afgerond',
      pending: 'In behandeling',
      authorized: 'In behandeling',
      failed: 'Mislukt',
      canceled: 'Geannuleerd',
      expired: 'Verlopen',
    },
  },
  return: {
    creditPack: 'Creditpakket',
    summary: (pack: string, credits: number, amount: string) => `${pack} · ${credits} credits · ${amount}`,
    paid: {
      title: 'Betaling ontvangen',
      body: (credits: number) => `Er zijn ${credits} credits aan je account toegevoegd. Automatiseringen zijn ontgrendeld.`,
      balance: (credits: number) => `Saldo: ${credits} ${credits === 1 ? 'credit' : 'credits'}`,
      startSearch: 'Start een zoekopdracht',
      dashboard: 'Naar dashboard',
    },
    waiting: {
      title: 'We wachten op je betaling',
      body: 'We checken het bij Mollie. Deze pagina werkt zichzelf bij. Betaalpagina gesloten? Je kunt opnieuw een pakket kiezen.',
      back: 'Terug naar credits',
    },
    failed: {
      canceled: 'Betaling geannuleerd',
      expired: 'Betaling verlopen',
      failed: 'Betaling mislukt',
      body: 'Er is niets afgeschreven. Je kunt het opnieuw proberen wanneer je wilt.',
      retry: 'Opnieuw proberen',
    },
  },
  errors: {
    pickPack: 'Kies een creditpakket.',
    startFailed: 'Er ging iets mis bij het starten van de betaling. Probeer het opnieuw.',
    notSetUp: 'Betalen is nog niet ingesteld.',
    packMissing: 'Dat creditpakket bestaat niet.',
    couldNotStart: 'We konden de betaling niet starten. Probeer het zo nog eens.',
  },
  entitlements: {
    automationsLocked: 'Automatiseringen worden ontgrendeld met elk creditpakket. Je eerste zoekopdracht is van ons.',
  },
};
