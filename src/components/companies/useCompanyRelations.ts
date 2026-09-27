'use client';

import { useCallback, useSyncExternalStore } from 'react';
import type { CompanyRelationship, CompanySummary } from '@/modules/companies/companies';

/*
 * Bedrijven opslaan en volgen.
 * TIJDELIJK: de database heeft hier nog geen tabel voor, dus de keuze staat in localStorage
 * (per apparaat). Alle opslag zit in dit bestand: vervang read/write door een tabel
 * (bv. company_relations: user_id, company_id, saved, following) en de UI blijft gelijk.
 */

export interface LocalRelation {
  saved?: boolean;
  following?: boolean;
}

type Store = Record<string, LocalRelation>;

const KEY = 'unlisted.company-relations.v1';
const CHANGE_EVENT = 'unlisted:company-relations';
const EMPTY: Store = {};

let snapshot: { raw: string | null; value: Store } = { raw: null, value: EMPTY };

function readRaw(): string | null {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null; // privévenster of geblokkeerde opslag: gewoon niets onthouden
  }
}

function getSnapshot(): Store {
  const raw = readRaw();
  if (raw !== snapshot.raw) {
    let value = EMPTY;
    try {
      value = raw ? (JSON.parse(raw) as Store) : EMPTY;
    } catch {
      value = EMPTY;
    }
    snapshot = { raw, value };
  }
  return snapshot.value;
}

function getServerSnapshot(): Store {
  return EMPTY;
}

function subscribe(onChange: () => void) {
  window.addEventListener('storage', onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener('storage', onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

export function useCompanyRelations() {
  const relations = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const set = useCallback((companyId: string, key: keyof LocalRelation, value: boolean) => {
    const current = getSnapshot();
    const next: Store = { ...current, [companyId]: { ...current[companyId], [key]: value } };
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      return;
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  return { relations, set };
}

// Opgeslagen: zelf aangevinkt, of (zolang je dat niet uitzet) omdat je een kans bij dit bedrijf bewaarde
export function isCompanySaved(company: CompanySummary, local?: LocalRelation): boolean {
  return local?.saved ?? company.relationship === 'saved';
}

// Wat je met je data hebt gedaan (benaderd) weegt zwaarder dan wat je lokaal aanvinkt
export function relationshipOf(company: CompanySummary, local?: LocalRelation): CompanyRelationship {
  if (company.relationship === 'contacted') return 'contacted';
  if (local?.following) return 'following';
  if (isCompanySaved(company, local)) return 'saved';
  return 'new';
}
