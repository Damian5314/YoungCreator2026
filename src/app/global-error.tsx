'use client';

import { useEffect } from 'react';
import { TriangleAlert } from 'lucide-react';
import { StatusPage } from '@/components/layout/StatusPage';
import { Button, ButtonLink } from '@/components/ui/Button';
import './globals.css';

/*
 * Laatste vangnet: de root-layout zelf faalde. Deze pagina vervangt de hele layout, dus er is geen
 * I18nProvider en geen taalcookie-lezer; daarom staat de tekst er in het Engels én Nederlands.
 */
export default function GlobalError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error('[root] layout failed', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <title>Something went wrong · Unlisted</title>
        <StatusPage
          icon={TriangleAlert}
          title="Something went wrong"
          body="Unlisted couldn’t load right now. Please try again in a moment. — Unlisted kon nu niet laden. Probeer het zo opnieuw."
          actions={
            <>
              <Button onClick={retry} shape="pill" size="lg">
                Try again · Opnieuw
              </Button>
              <ButtonLink href="/contact" variant="secondary" shape="pill" size="lg">
                Contact
              </ButtonLink>
            </>
          }
          footnote={error.digest ? `Error code: ${error.digest}` : undefined}
        />
      </body>
    </html>
  );
}
