// Vaste locale + tijdzone zodat server- en client-render dezelfde tekst opleveren
const shortDate = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  timeZone: 'Europe/Amsterdam',
});

export function formatShortDate(date: Date): string {
  return shortDate.format(date);
}
