// Resultaat van een server action, voor foutmeldingen en bevestigingen in formulieren
export type FormState = { error?: string; message?: string } | undefined;

export function text(formData: FormData, key: string, maxLength = 2000): string {
  const value = formData.get(key);
  return (typeof value === 'string' ? value : '').trim().slice(0, maxLength);
}

export function optionalText(formData: FormData, key: string, maxLength = 2000): string | null {
  return text(formData, key, maxLength) || null;
}

export function optionalInt(formData: FormData, key: string): number | null {
  const value = Number.parseInt(text(formData, key), 10);
  return Number.isFinite(value) ? value : null;
}

// "React, TypeScript , SQL" -> ['React', 'TypeScript', 'SQL']
export function list(formData: FormData, key: string, maxItems = 30): string[] {
  return text(formData, key, 5000)
    .split(',')
    .map((item) => item.trim().slice(0, 100))
    .filter(Boolean)
    .slice(0, maxItems);
}

// Lijsten samenvoegen zonder dubbelen (hoofdletterongevoelig), eigen invoer eerst
export function mergeUnique(first: string[], second: string[], maxItems = 30): string[] {
  const seen = new Set<string>();
  return [...first, ...second]
    .filter((item) => {
      const key = item.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, maxItems);
}
