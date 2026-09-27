import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Landingsplek voor links uit Supabase-mails (account bevestigen, e-mail wijzigen)
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';
  // Alleen interne paden, anders is dit een open redirect
  const safeNext = next.startsWith('/') && !next.startsWith('//') ? next : '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      console.log('[auth/callback] session exchanged, redirecting to', safeNext);
      return NextResponse.redirect(`${origin}${safeNext}`);
    }
    console.error('[auth/callback] exchangeCodeForSession failed', error.message, error);
  } else {
    console.warn('[auth/callback] no code in query params', Object.fromEntries(searchParams.entries()));
  }

  console.log('[auth/callback] falling back to /login');
  return NextResponse.redirect(`${origin}/login`);
}
