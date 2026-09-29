import type { pricing as en } from '../en/pricing';

export const pricing: typeof en = {
  metaTitle: 'Prijzen',
  metaDescription: 'Unlisted heeft geen abonnement. Je eerste zoekopdracht is gratis; daarna koop je credits in eenmalige pakketten. Prijzen inclusief btw.',
  eyebrow: 'Prijzen',
  title: 'Betaal per zoekopdracht. Geen abonnement.',
  intro: 'Je eerste zoekopdracht is gratis. Daarna koop je credits in eenmalige pakketten, en elke zoekopdracht kost één credit.',
  inclVat: 'incl. btw',
  perSearch: (price: string) => `${price} per zoekopdracht`,
  credits: (credits: number) => `${credits} credits`,
  popular: 'Meest gekozen',
  cta: 'Begin met een gratis zoekopdracht',
  rulesTitle: 'Zo werken credits',
  rules: [
    'Eén zoekopdracht kost één credit, of je hem nu zelf start of je agent hem volgens planning uitvoert.',
    'Een zoekopdracht kan nul of meer resultaten opleveren. Ook een zoekopdracht zonder resultaten kost één credit.',
    'Mislukt een zoekopdracht door een fout aan onze kant, dan gaat de credit automatisch terug naar je saldo.',
    'Credits vervallen niet zolang je account bestaat. Er is geen abonnement en er wordt niets automatisch verlengd.',
    'Elk creditpakket ontgrendelt de automatiseringen: automatisch zoeken en e-mails laten versturen via Unlisted.',
    'Prijzen zijn in euro en inclusief 21% btw. Je betaalt via Mollie (iDEAL, creditcard en meer).',
  ],
  resultsNote:
    'Resultaten zijn kanssignalen en gepubliceerde vacatures. Een signaal is geen bevestigde vacature, en matches zijn suggesties, deels gemaakt door AI.',
  withdrawalTitle: 'Terugbetaling en herroepingsrecht',
  withdrawalBody:
    'Credits zijn digitale inhoud die direct wordt geleverd. Voor het betalen ga je akkoord met directe levering, en je herroepingsrecht van 14 dagen vervalt zodra de credits zijn bijgeschreven. Uit coulance betalen we een pakket dat je in de afgelopen 14 dagen hebt gekocht terug, zolang er nog geen enkele credit uit is gebruikt.',
  withdrawalLink: 'Lees de volledige voorwaarden',
};
