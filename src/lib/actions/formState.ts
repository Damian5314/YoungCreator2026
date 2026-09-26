// Resultaat van een server action, voor foutmeldingen en bevestigingen in formulieren
export type FormState = { error?: string; message?: string } | undefined;

export function text(formData: FormData, key: string): string {
  return String(formData.get(key) ?? '').trim();
}

export function optionalText(formData: FormData, key: string): string | null {
  return text(formData, key) || null;
}

export function optionalInt(formData: FormData, key: string): number | null {
  const value = text(formData, key);
  return value ? Number.parseInt(value, 10) : null;
}

// "React, TypeScript , SQL" -> ['React', 'TypeScript', 'SQL']
export function list(formData: FormData, key: string): string[] {
  return text(formData, key)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}
