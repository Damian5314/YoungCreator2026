// Vaste locale + tijdzone zodat server- en client-render dezelfde tekst opleveren
const shortDate = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  timeZone: 'Europe/Amsterdam',
});

export function formatShortDate(date: Date): string {
  return shortDate.format(date);
}

const dateTime = new Intl.DateTimeFormat('en-GB', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Europe/Amsterdam',
});

// "Tue 6 Oct, 18:00": voor events en tijdstippen van runs/berichten
export function formatDateTime(date: Date): string {
  return dateTime.format(date);
}
