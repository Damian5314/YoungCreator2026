import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Supabase-client voor server components, server actions en route handlers.
// Draait als de ingelogde gebruiker, dus Row Level Security bepaalt wat hij mag zien.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Vanuit een server component mogen geen cookies gezet worden; de proxy ververst de sessie al
          }
        },
      },
    },
  );
}
