import { CREDIT_PACKS, formatMoney } from '@/modules/billing/plans';
import { COMPANY } from '@/shared/constants/company';
import type { FaqCategory } from '../en/support';

const cheapest = CREDIT_PACKS[0];

const categories: FaqCategory[] = [
  {
    id: 'getting-started',
    title: 'Aan de slag',
    items: [
      {
        id: 'what-is-unlisted',
        question: 'Wat is Unlisted?',
        answer: [
          'Unlisted helpt studenten in Nederland bedrijven te vinden die het waard zijn om te benaderen, nog voordat er een vacature online staat. Je agent kijkt naar openbare bedrijfssignalen zoals nieuws, investeringen, wervingsactiviteit en uitbreiding, vergelijkt die met je profiel en helpt je een persoonlijke e-mail te schrijven.',
        ],
      },
      {
        id: 'signal-vs-vacancy',
        question: 'Is elk resultaat een echte vacature?',
        answer: [
          'Nee. Unlisted toont twee soorten resultaten: gepubliceerde vacatures en kanssignalen. Een signaal betekent dat een bedrijf activiteit laat zien (bijvoorbeeld een nieuw kantoor of een investeringsronde) waardoor het een goed moment kan zijn om contact op te nemen. Het is geen bevestigde openstaande functie.',
        ],
      },
      {
        id: 'first-search-free',
        question: 'Kan ik het gratis proberen?',
        answer: [
          'Ja. Elk nieuw account krijgt één gratis credit, dus je eerste zoekopdracht kost niets. Er is geen abonnement: daarna betaal je alleen voor de zoekopdrachten die je uitvoert.',
        ],
        link: { href: '/register', label: 'Maak een gratis account' },
      },
    ],
  },
  {
    id: 'credits',
    title: 'Credits en betalen',
    items: [
      {
        id: 'how-credits-work',
        question: 'Hoe werken credits?',
        answer: [
          `Eén zoekopdracht kost één credit, of je hem nu zelf start of je agent hem volgens planning uitvoert. Je koopt credits in eenmalige pakketten, vanaf ${formatMoney(cheapest.amountCents, 'nl')} voor ${cheapest.credits} credits. Prijzen zijn inclusief btw.`,
          'Credits vervallen niet zolang je account bestaat.',
        ],
        link: { href: '/billing', label: 'Bekijk de creditpakketten' },
      },
      {
        id: 'zero-results',
        question: 'Kost een zoekopdracht zonder resultaten ook een credit?',
        answer: [
          'Ja. De agent heeft het zoekwerk gedaan, ook als er deze keer niets paste. Mislukt een zoekopdracht door een fout aan onze kant, dan krijg je de credit automatisch terug.',
        ],
      },
      {
        id: 'payment-failed',
        question: 'Mijn betaling is mislukt of geannuleerd. Wat nu?',
        answer: [
          'Als een betaling mislukt of je hem annuleert, wordt er niets afgeschreven en worden er geen credits bijgeschreven. Je kunt het gewoon opnieuw proberen via de pagina Credits & betalingen, met dezelfde of een andere betaalmethode.',
        ],
        link: { href: '/billing', label: 'Naar Credits & betalingen' },
      },
      {
        id: 'credits-missing',
        question: 'Ik heb betaald, maar mijn credits staan er niet.',
        answer: [
          'Credits worden bijgeschreven zodra onze betaalprovider de betaling bevestigt. Dat duurt meestal een paar seconden, soms een paar minuten. Ververs de pagina Credits & betalingen om de actuele status te zien.',
          `Na 15 minuten nog steeds niets? Mail naar ${COMPANY.email} met de datum en het bedrag van de betaling. Wij lossen het op.`,
        ],
      },
      {
        id: 'refund',
        question: 'Kan ik mijn geld terugkrijgen?',
        answer: [
          'Credits worden direct geleverd, dus de standaard bedenktijd van 14 dagen vervalt zodra ze op je saldo staan. Uit coulance betalen we een pakket dat je in de afgelopen 14 dagen hebt gekocht terug, zolang er nog geen enkele credit uit is gebruikt.',
        ],
        link: { href: '/terms#withdrawal', label: 'Lees de voorwaarden voor terugbetaling' },
      },
    ],
  },
  {
    id: 'searches',
    title: 'Zoekopdrachten en resultaten',
    items: [
      {
        id: 'search-duration',
        question: 'Hoe lang duurt een zoekopdracht?',
        answer: [
          'Meestal een paar minuten. Je kunt de pagina verlaten of je browser sluiten: de zoekopdracht loopt door en de resultaten verschijnen op je dashboard zodra hij klaar is.',
        ],
      },
      {
        id: 'search-stuck',
        question: 'Mijn zoekopdracht lijkt vast te zitten of is mislukt.',
        answer: [
          'Een mislukte zoekopdracht zie je op de zoekpagina, en de credit gaat automatisch terug naar je saldo. Je kunt meteen een nieuwe zoekopdracht starten.',
          `Loopt een zoekopdracht na 30 minuten nog steeds? Mail naar ${COMPANY.email} en vermeld ongeveer wanneer je hem hebt gestart.`,
        ],
        link: { href: '/search', label: 'Naar zoeken' },
      },
      {
        id: 'no-results',
        question: 'Mijn zoekopdracht vond niets. Hoe krijg ik betere resultaten?',
        answer: [
          'Maak je voorkeuren ruimer: voeg meer locaties, meer soorten kansen of verwante vakgebieden toe. Een volledig profiel met je cv helpt de agent ook om betere matches te vinden.',
        ],
        link: { href: '/search/preferences', label: 'Voorkeuren aanpassen' },
      },
      {
        id: 'wrong-result',
        question: 'Een resultaat klopt niet of is niet relevant.',
        answer: [
          'Markeer het als "Niet interessant", dan verdwijnt het uit je lijsten, en controleer of je voorkeuren nog beschrijven wat je zoekt. Matchscores en samenvattingen zijn deels door AI gemaakt en kunnen fouten bevatten.',
          `Is informatie over een bedrijf duidelijk onjuist? Laat het ons weten via ${COMPANY.email}.`,
        ],
      },
      {
        id: 'match-score',
        question: 'Hoe wordt de matchscore berekend?',
        answer: [
          'De score vergelijkt de kans met je profiel: je vaardigheden, studie, ervaring, voorkeurslocaties en het soort functie dat je zoekt, plus hoe relevant het bedrijfssignaal is. Het is een indicatie om je te helpen prioriteren, geen voorspelling dat je de baan krijgt.',
        ],
      },
    ],
  },
  {
    id: 'outreach',
    title: 'E-mails aan bedrijven',
    items: [
      {
        id: 'who-sends',
        question: 'Verstuurt Unlisted e-mails namens mij?',
        answer: [
          'Dat hangt af van het niveau dat je voor je agent kiest. Als assistent schrijft hij alleen concepten die je zelf verstuurt. Bij semi-automatisch keur je elke e-mail met één klik goed. Volledig automatisch versturen kan alleen nadat je daar uitdrukkelijk toestemming voor hebt gegeven, en blijft altijd binnen het daglimiet dat je instelt.',
        ],
        link: { href: '/settings', label: 'Kies het niveau van je agent' },
      },
      {
        id: 'replies',
        question: 'Waar komen antwoorden terecht?',
        answer: ['Antwoorden van bedrijven komen in je eigen mailbox, niet bij Unlisted.'],
      },
    ],
  },
  {
    id: 'account',
    title: 'Account en privacy',
    items: [
      {
        id: 'change-login',
        question: 'Hoe wijzig ik mijn e-mailadres of wachtwoord?',
        answer: ['Ga naar Instellingen. Daar kun je je e-mailadres aanpassen en een nieuw wachtwoord kiezen.'],
        link: { href: '/settings', label: 'Naar Instellingen' },
      },
      {
        id: 'delete-account',
        question: 'Hoe verwijder ik mijn account?',
        answer: [
          `Mail naar ${COMPANY.email} vanaf het adres waarmee je inlogt en vraag ons je account te verwijderen. We verwijderen je profiel, cv, zoekopdrachten en e-mails binnen 30 dagen. Betaalgegevens bewaren we zeven jaar, omdat de wet dat verplicht.`,
        ],
      },
      {
        id: 'my-data',
        question: 'Wat doen jullie met mijn cv en gegevens?',
        answer: [
          'We gebruiken je gegevens alleen om je zoekopdrachten uit te voeren, matches te scoren en je e-mails te schrijven. We verkopen ze nooit. In het privacybeleid staat precies wat we verwerken, welke partijen we gebruiken en hoe lang we gegevens bewaren.',
        ],
        link: { href: '/privacy', label: 'Lees het privacybeleid' },
      },
      {
        id: 'privacy-request',
        question: 'Ik wil mijn gegevens inzien, corrigeren of exporteren.',
        answer: [`Mail je verzoek naar ${COMPANY.email}. We reageren binnen vier weken.`],
      },
    ],
  },
];

export const support = {
  card: {
    title: 'Vragen?',
    body: 'Bekijk de veelgestelde vragen of neem contact op.',
    contactLink: 'Contact & support',
  },
  faq: {
    metaTitle: 'Veelgestelde vragen',
    metaDescription: 'Antwoorden op veelgestelde vragen over Unlisted: credits, betalen, zoekopdrachten, e-mails en je account.',
    eyebrow: 'Help',
    title: 'Veelgestelde vragen',
    intro: 'Snelle antwoorden over credits, zoekopdrachten, e-mails en je account.',
    onThisPage: 'Onderwerpen',
    categories,
  },
  contact: {
    metaTitle: 'Contact & support',
    metaDescription: 'Hulp bij Unlisted: betalingen, credits, zoekopdrachten, je account of privacy.',
    eyebrow: 'Support',
    title: 'Contact & support',
    intro: 'Werkt iets niet, heb je een vraag over een betaling of een privacyverzoek? We helpen je graag.',
    responseTime: 'We streven ernaar binnen twee werkdagen te reageren.',
    channels: {
      email: { title: 'E-mail', body: 'Het handigst voor de meeste vragen. Stuur hem vanaf het adres waarmee je inlogt.' },
      phone: { title: 'Telefoon', body: 'Op werkdagen, tijdens kantooruren.' },
      whatsapp: { title: 'WhatsApp', body: 'Voor een snelle vraag.' },
    },
    includeTitle: 'Zo helpen we je sneller',
    includeList: [
      'Het e-mailadres van je Unlisted-account.',
      'Wat je aan het doen was en wat er misging.',
      'Wanneer het gebeurde, en een screenshot als je die hebt.',
      'Bij betalingen: de datum en het bedrag van de betaling.',
    ],
    topicsTitle: 'Misschien al beantwoord',
    topics: [
      { href: '/faq#payment-failed', label: 'Mijn betaling is mislukt' },
      { href: '/faq#credits-missing', label: 'Mijn credits ontbreken' },
      { href: '/faq#search-stuck', label: 'Mijn zoekopdracht zit vast' },
      { href: '/faq#wrong-result', label: 'Een resultaat klopt niet' },
      { href: '/faq#delete-account', label: 'Mijn account verwijderen' },
      { href: '/faq#privacy-request', label: 'Een privacyvraag' },
    ],
    allFaq: 'Alle vragen',
  },
};
