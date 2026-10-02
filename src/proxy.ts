import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { defaultLocale, isLocale, LOCALE_COOKIE } from '@/i18n/config';
import { isPublicPath, localizeHref, LOCALE_HEADER, PREFIXED_LOCALE, splitLocale } from '@/i18n/routing';
import { buildCsp, createNonce, NONCE_HEADER } from '@/lib/csp';
import { SESSION_COOKIE_OPTIONS } from '@/lib/supabase/cookieOptions';

const PROTECTED_PATHS = [
  '/dashboard',
  '/search',
  '/opportunities',
  '/companies',
  '/settings',
  '/outreach',
  '/matches',
  '/billing',
];
const AUTH_PATHS = ['/login', '/register'];
const ONE_YEAR = 60 * 60 * 24 * 365;

/**
 * 1. Taal in de URL voor publieke pagina's: /nl/faq wordt intern /faq met de taal in een request-header.
 *    /en/... verwijst naar de Engelse URL zonder prefix. Wie Nederlands als voorkeur heeft (cookie)
 *    en een Engelse publieke URL opent, gaat naar de /nl-variant. Crawlers hebben geen cookie, dus
 *    zij zien op elke URL altijd dezelfde taal.
 * 2. Ververst bij elk verzoek de Supabase-sessie en stuurt door op basis van de inlogstatus.
 */
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname === '/en' || pathname.startsWith('/en/')) {
    return NextResponse.redirect(new URL(`${pathname.slice(3) || '/'}${search}`, request.url), 308);
  }

  const { locale: urlLocale, path } = splitLocale(pathname);
  if (urlLocale && !isPublicPath(path)) {
    // /nl/dashboard e.d. bestaan niet: gewoon naar het pad zonder prefix (de app werkt met de cookie)
    return NextResponse.redirect(new URL(`${path}${search}`, request.url), 308);
  }

  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  if (!urlLocale && isPublicPath(path) && request.method === 'GET' && cookieLocale === PREFIXED_LOCALE) {
    return NextResponse.redirect(new URL(`${localizeHref(path, PREFIXED_LOCALE)}${search}`, request.url), 307);
  }

  // Taal voor deze render: /nl-URL → nl; andere publieke URL → altijd Engels; app-pagina's → cookie
  const renderLocale = urlLocale ?? (isPublicPath(path) ? defaultLocale : null);
  const requestHeaders = new Headers(request.headers);
  if (renderLocale) requestHeaders.set(LOCALE_HEADER, renderLocale);
  else requestHeaders.delete(LOCALE_HEADER);

  // Nonce per verzoek: Next.js leest de CSP uit de request-header en zet de nonce op zijn eigen scripts
  const nonce = createNonce();
  const csp = buildCsp(nonce);
  requestHeaders.set(NONCE_HEADER, nonce);
  requestHeaders.set('content-security-policy', csp);

  const makeResponse = () => {
    const next = urlLocale
      ? NextResponse.rewrite(new URL(`${path}${search}`, request.url), { request: { headers: requestHeaders } })
      : NextResponse.next({ request: { headers: requestHeaders } });
    next.headers.set('content-security-policy', csp);
    return next;
  };

  let response = makeResponse();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookieOptions: SESSION_COOKIE_OPTIONS,
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = makeResponse();
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
          Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value));
        },
      },
    },
  );

  const { data } = await supabase.auth.getClaims();
  const loggedIn = Boolean(data?.claims);

  const isProtected = PROTECTED_PATHS.some((p) => path === p || path.startsWith(`${p}/`));
  if (!loggedIn && isProtected) return redirectTo(request, response, '/login');
  if (loggedIn && AUTH_PATHS.includes(path)) return redirectTo(request, response, '/dashboard');

  // Wie via een /nl-URL binnenkomt, houdt Nederlands ook in de app (login, registratie, dashboard)
  if (urlLocale && cookieLocale !== urlLocale && isLocale(urlLocale)) {
    response.cookies.set(LOCALE_COOKIE, urlLocale, { path: '/', maxAge: ONE_YEAR, sameSite: 'lax' });
  }

  return response;
}

// Redirect die eventueel ververste sessie-cookies meeneemt
function redirectTo(request: NextRequest, response: NextResponse, path: string) {
  const redirect = NextResponse.redirect(new URL(path, request.url));
  response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
  return redirect;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.svg|robots.txt|sitemap.xml|llms.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4)$).*)'],
};
