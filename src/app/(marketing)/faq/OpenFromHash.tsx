'use client';

import { useEffect } from 'react';

// Een link als /faq#credits-missing klapt die vraag open en scrollt ernaartoe (ook bij een hash-wijziging)
export function OpenFromHash() {
  useEffect(() => {
    function open() {
      const id = decodeURIComponent(window.location.hash.slice(1));
      const target = id ? document.getElementById(id) : null;
      if (target instanceof HTMLDetailsElement) {
        target.open = true;
        target.scrollIntoView({ block: 'start' });
        target.querySelector('summary')?.focus({ preventScroll: true });
      }
    }
    open();
    window.addEventListener('hashchange', open);
    return () => window.removeEventListener('hashchange', open);
  }, []);

  return null;
}
