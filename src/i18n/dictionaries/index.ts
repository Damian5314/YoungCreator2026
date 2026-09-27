import type { Locale } from '../config';
import { en } from './en';
import { nl } from './nl';

// Engels is de bron: elke andere taal moet exact dezelfde vorm hebben,
// dus een ontbrekende of verkeerd gespelde vertaling faalt al bij `tsc`.
export type Dictionary = typeof en;

export const dictionaries: Record<Locale, Dictionary> = { en, nl };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
