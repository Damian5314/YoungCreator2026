// Content-Security-Policy met een nonce per request (zie de Next.js-gids "Content Security Policy").
// Scripts: alleen met de nonce van dit verzoek, plus wat die scripts zelf laden ('strict-dynamic').
// Styles: 'unsafe-inline' is nodig voor style-attributen (animatievertragingen e.d.); een nonce kan die
// niet toestaan. Script-injectie blijft daardoor geblokkeerd, wat het belangrijkste deel is.
export const NONCE_HEADER = 'x-nonce';

export function buildCsp(nonce: string): string {
  const isDev = process.env.NODE_ENV === 'development';
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ''}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' blob: data:",
    "font-src 'self'",
    "media-src 'self'",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    // Zonder JavaScript stuurt de betaalknop door naar de Mollie-checkout
    "form-action 'self' https://*.mollie.com",
    "frame-ancestors 'none'",
  ].join('; ');
}

export function createNonce(): string {
  return btoa(crypto.randomUUID());
}
