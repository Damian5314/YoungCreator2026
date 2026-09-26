import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:px-6">
        <Logo />
        <p className="text-center">© 2026 JobHunter.nl · Built for international graduates in the Netherlands</p>
      </div>
    </footer>
  );
}
