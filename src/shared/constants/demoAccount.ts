// Vast demo-account voor de live demo. De knop op /login vult deze gegevens in.
// Bewust openbaar: er staat alleen voorbeelddata in. Aanmaken of terugzetten: npm run demo:user
export const DEMO_ACCOUNT = {
  email: 'demo@unlisted.app',
  password: 'Unlisted-demo-2026',
  name: 'Demo Student',
} as const;

// Bij elke demo-login wordt het saldo tot minstens dit aantal aangevuld, zodat zoeken nooit vastloopt
export const DEMO_MIN_CREDITS = 25;
