'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

// Uitklapmenu in de bovenbalk: sluit bij klikken ernaast, Escape (focus terug op de knop) en navigeren
export function usePopover() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const [openedOn, setOpenedOn] = useState(pathname);

  // Naar een andere pagina: menu dicht (tijdens renderen, zonder extra effect)
  if (open && openedOn !== pathname) setOpen(false);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  function toggle() {
    setOpenedOn(pathname);
    setOpen((value) => !value);
  }

  return { open, toggle, close: () => setOpen(false), rootRef, buttonRef };
}
