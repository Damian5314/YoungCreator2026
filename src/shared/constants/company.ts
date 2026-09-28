// Juridische afzender van Unlisted. Unlisted is een product van TechTable (zie techtable.nl);
// footer, privacybeleid en voorwaarden lezen deze gegevens hier. Eigennamen en nummers: niet vertalen.
export const COMPANY = {
  legalName: 'TechTable',
  product: 'Unlisted',
  street: 'Ringersplaats 40',
  postalCode: '3061 BE',
  city: 'Rotterdam',
  country: { en: 'the Netherlands', nl: 'Nederland' },
  kvk: '98067826',
  vatId: 'NL868345659B01',
  email: 'info@techtable.nl',
  phone: '+31 85 212 9045',
  phoneHref: 'tel:+31852129045',
  website: 'https://techtable.nl',
} as const;

export const COMPANY_ADDRESS = `${COMPANY.street}, ${COMPANY.postalCode} ${COMPANY.city}`;
