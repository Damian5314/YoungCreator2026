'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, GraduationCap, Play, Radar, RadioTower, Send } from 'lucide-react';
import { ButtonLink, Button } from '@/components/ui/Button';
import { HeroMobileVisual } from './hero/HeroMobileVisual';
import { HeroDesktopScene } from './hero/HeroDesktopScene';

const benefits = [
  { icon: RadioTower, label: 'Real-time company signals' },
  { icon: Radar, label: 'Hidden opportunities' },
  { icon: Send, label: 'Personalized outreach' },
];

export function HeroSection() {
  // Drives the staggered entrance once the component has mounted on the client.
  const [shown, setShown] = useState(false);
  useEffect(() => setShown(true), []);

  // Shared entrance classes; the per-element stagger is applied via inline style
  // because Tailwind can't compile interpolated arbitrary delay values.
  const revealClass = `transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none ${
    shown ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
  }`;
  const delay = (ms: number) => ({ transitionDelay: `${ms}ms` });

  return (
    <section className="relative isolate overflow-hidden bg-background">
      {/* ------------------------------------------------------------------ */}
      {/* Full-bleed background photograph (desktop only)                    */}
      {/* ------------------------------------------------------------------ */}
      <div className="absolute inset-0 hidden lg:block" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero-canal.png"
          alt=""
          className="h-full w-full object-cover object-[right_center]"
          loading="eager"
          decoding="async"
        />
        {/* Blend the photo's white edge into the page and guarantee text contrast. */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-transparent" />
        {/* Soft fades top & bottom so the crop melts into the page. */}
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-background to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Floating signal cards + annotations, layered over the photo (desktop). */}
      <HeroDesktopScene shown={shown} />

      {/* ------------------------------------------------------------------ */}
      {/* Content                                                            */}
      {/* ------------------------------------------------------------------ */}
      <div className="relative z-30 mx-auto grid max-w-7xl items-center gap-10 px-4 pb-20 pt-14 sm:px-6 lg:min-h-[42rem] lg:grid-cols-2 lg:gap-8 lg:pb-28 lg:pt-24">
        {/* Left: message + CTA */}
        <div className="max-w-xl">
          <span
            className={`inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary-soft-foreground ${revealClass}`}
            style={delay(0)}
          >
            <GraduationCap className="size-3.5" aria-hidden />
            For international students in the Netherlands
          </span>

          <h1
            className={`mt-6 text-4xl font-bold leading-[1.05] tracking-tight text-balance sm:text-5xl xl:text-6xl ${revealClass}`}
            style={delay(80)}
          >
            You invested in your future.{' '}
            <span className="text-primary">Now find the opportunities.</span>
          </h1>

          <p
            className={`mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground ${revealClass}`}
            style={delay(160)}
          >
            JobHunter helps international students find jobs, internships and hidden opportunities in
            the Netherlands by analyzing real-time company signals, news and hiring activity — so you
            can reach out at the right moment.
          </p>

          <div
            className={`mt-9 flex flex-col gap-3 sm:flex-row sm:items-center ${revealClass}`}
            style={delay(240)}
          >
            <ButtonLink
              href="/register"
              size="lg"
              className="shadow-lg shadow-primary/20 transition-transform hover:-translate-y-px"
            >
              Get started free
              <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
            <Button variant="secondary" size="lg">
              <Play className="size-4" aria-hidden />
              Watch our story
            </Button>
          </div>

          <p className={`mt-4 text-xs text-muted-foreground ${revealClass}`} style={delay(300)}>
            No credit card required&nbsp;&nbsp;•&nbsp;&nbsp;Free for students
          </p>

          <ul
            className={`mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-border pt-6 ${revealClass}`}
            style={delay(360)}
          >
            {benefits.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon className="size-4 text-primary" aria-hidden />
                {label}
              </li>
            ))}
          </ul>
        </div>

        {/* Right: on mobile/tablet, the contained photo + stacked cards.       */}
        {/* On desktop this column stays empty — the scene floats over the bg.  */}
        <div className="relative">
          <HeroMobileVisual shown={shown} />
        </div>
      </div>
    </section>
  );
}
