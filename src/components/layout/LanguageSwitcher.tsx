'use client';

import { useTransition } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { locales } from '@/i18n/config';
import { setLocale } from '@/i18n/actions';
import { useLocale, useT } from '@/i18n/I18nProvider';
import { isPublicPath, localizeHref, splitLocale } from '@/i18n/routing';

/**
 * EN | NL-schakelaar. Zet de taal-cookie via een Server Action; Next.js rendert de pagina daarna
 * opnieuw. Op publieke pagina's staat de taal ook in de URL (/faq ↔ /nl/faq): daar navigeren we
 * naar de andere variant, zodat URL en taal altijd bij elkaar passen.
 */
export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const locale = useLocale();
  const t = useT();
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const publicPath = splitLocale(pathname).path;

  return (
    <div
      role="group"
      aria-label={t.common.language.label}
      aria-busy={pending}
      className={`inline-flex h-9 shrink-0 items-center rounded-full bg-foreground/[0.06] p-0.5 transition-opacity ${
        pending ? 'opacity-60' : ''
      } ${className}`}
    >
      {locales.map((code) => {
        const active = code === locale;
        const name = t.common.language.names[code];
        return (
          <button
            key={code}
            type="button"
            lang={code}
            aria-pressed={active}
            aria-label={`${code.toUpperCase()}, ${name}`}
            title={name}
            disabled={pending}
            onClick={() => {
              if (active) return;
              startTransition(async () => {
                await setLocale(code);
                if (isPublicPath(publicPath)) {
                  router.replace(`${localizeHref(publicPath, code)}${window.location.search}${window.location.hash}`);
                }
              });
            }}
            className={`h-8 min-w-9 rounded-full px-2.5 text-xs font-semibold tracking-wide transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
              active
                ? 'bg-card text-foreground shadow-[0_1px_2px_rgb(16_24_32/0.12)]'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {code.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
