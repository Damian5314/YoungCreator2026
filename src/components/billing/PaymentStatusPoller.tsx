'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const POLL_MS = 3000;
const MAX_POLLS = 20; // ± 1 minuut; daarna rondt de webhook het af

// Terwijl een betaling nog wordt verwerkt: de pagina opnieuw laten bevestigen bij Mollie
export function PaymentStatusPoller() {
  const router = useRouter();

  useEffect(() => {
    let polls = 0;
    const timer = setInterval(() => {
      polls += 1;
      if (polls > MAX_POLLS) {
        clearInterval(timer);
        return;
      }
      router.refresh();
    }, POLL_MS);
    return () => clearInterval(timer);
  }, [router]);

  return null;
}
