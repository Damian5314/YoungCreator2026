// Bedrijfssignalen: per soort een label en waarom het ertoe doet (zie src/modules/signals/signals.ts).
export const signals = {
  kinds: {
    funding: { label: 'Funding', why: 'Fresh funding usually turns into new hires within months.' },
    product: { label: 'New product', why: 'A new product needs people to build, sell and support it.' },
    team: { label: 'Team expansion', why: 'A growing team often has room before a vacancy is posted.' },
    office: { label: 'New office', why: 'A new office means a new team to fill, often with local talent.' },
    expansion: { label: 'Expansion', why: 'The company is expanding and may need talent before it advertises.' },
    hiring: { label: 'Hiring activity', why: 'They are actively hiring, so a good fit gets noticed.' },
    leadership: { label: 'Leadership change', why: 'New leaders often build new teams and plans.' },
    event: { label: 'Event', why: 'A place to meet the team in person.' },
    rnd: { label: 'R&D investment', why: 'New research work creates roles for specialists and graduates.' },
    news: { label: 'Company news', why: 'Something is happening at this company that could open a door.' },
  },
  whatHappened: 'What happened',
  whyItMatters: 'Why it matters',
  whyForYou: 'Why it’s relevant to you',
  spotted: (when: string) => `Spotted ${when}`,
};
