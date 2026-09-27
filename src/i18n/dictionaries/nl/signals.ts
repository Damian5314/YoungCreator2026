import type { signals as en } from '../en/signals';

export const signals: typeof en = {
  kinds: {
    funding: { label: 'Investering', why: 'Nieuw geld leidt meestal binnen een paar maanden tot nieuwe mensen.' },
    product: { label: 'Nieuw product', why: 'Een nieuw product heeft mensen nodig om het te bouwen, verkopen en ondersteunen.' },
    team: { label: 'Teamgroei', why: 'Een groeiend team heeft vaak ruimte voordat er een vacature online staat.' },
    office: { label: 'Nieuw kantoor', why: 'Een nieuw kantoor betekent een nieuw team, vaak met lokaal talent.' },
    expansion: { label: 'Uitbreiding', why: 'Het bedrijf breidt uit en zoekt misschien talent voordat het adverteert.' },
    hiring: { label: 'Werving', why: 'Ze nemen actief mensen aan, dus een goede match valt op.' },
    leadership: { label: 'Nieuwe leiding', why: 'Nieuwe leiders bouwen vaak nieuwe teams en plannen.' },
    event: { label: 'Evenement', why: 'Een plek om het team persoonlijk te ontmoeten.' },
    rnd: { label: 'R&D-investering', why: 'Nieuw onderzoek creëert rollen voor specialisten en afgestudeerden.' },
    news: { label: 'Bedrijfsnieuws', why: 'Er gebeurt iets bij dit bedrijf dat een deur kan openen.' },
  },
  whatHappened: 'Wat er gebeurde',
  whyItMatters: 'Waarom het ertoe doet',
  whyForYou: 'Waarom het voor jou relevant is',
  spotted: (when: string) => `Gezien ${when}`,
};
