// Sessiecookies van Supabase. De app praat alleen server-side met Supabase (geen browser-client),
// dus JavaScript in de browser hoeft de sessie nooit te lezen: httpOnly beschermt tegen XSS-diefstal.
// secure in productie (alleen via https); lax blokkeert cross-site POSTs met je sessie (CSRF).
export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
} as const;
