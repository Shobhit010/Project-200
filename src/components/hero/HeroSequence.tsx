'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';
import { TOTAL_DAYS } from '@/data/projects';
import { cn } from '@/lib/cn';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { useArchive } from '@/state/archive';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { GiantTwoHundred } from './GiantTwoHundred';

const ConstellationGL = dynamic(
  () => import('./ConstellationGL').then((m) => m.ConstellationGL),
  { ssr: false },
);

/** Each beat: the label that types in, and how much of the field it lights. */
const BEATS: { label: string; revealed: number; at: number }[] = [
  { label: 'DAY 1', revealed: 1, at: 700 },
  { label: 'DAY 50', revealed: 50, at: 1500 },
  { label: 'DAY 100', revealed: 100, at: 2300 },
  { label: 'DAY 150', revealed: 150, at: 3100 },
  { label: 'DAY 200', revealed: 200, at: 3900 },
];

const LINKS_AT = 4700;
const ZOOM_AT = 5500;

/**
 * The no-WebGL field: the same seven clusters, drawn as static coloured
 * glows. Used for reduced motion and whenever a WebGL context is unavailable.
 */
function StaticField() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      {(
        [
          ['#5B8DEF', '72%', '24%'],
          ['#A97BFF', '20%', '26%'],
          ['#FF6B4A', '24%', '70%'],
          ['#4FBF8B', '76%', '68%'],
          ['#E3B341', '52%', '84%'],
          ['#F471B5', '50%', '12%'],
          ['#F2F3F5', '50%', '50%'],
        ] as const
      ).map(([hex, left, top]) => (
        <span
          key={hex}
          className="absolute h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            left,
            top,
            background: `radial-gradient(circle, ${hex}22, transparent 70%)`,
            filter: 'blur(30px)',
          }}
        />
      ))}
    </div>
  );
}

export function HeroSequence() {
  const { phase, setPhase } = useArchive();
  const reduced = useReducedMotionSafe();
  const [beat, setBeat] = useState(-1);
  const [links, setLinks] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [visible, setVisible] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const timers = useRef<number[]>([]);

  const finish = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setBeat(BEATS.length - 1);
    setLinks(1);
    setZoomed(true);
    setPhase('ready');
  }, [setPhase]);

  useEffect(() => {
    if (phase !== 'hero') return;
    if (reduced) {
      finish();
      return;
    }
    BEATS.forEach((b, i) => {
      timers.current.push(window.setTimeout(() => setBeat(i), b.at));
    });
    timers.current.push(window.setTimeout(() => setLinks(1), LINKS_AT));
    timers.current.push(
      window.setTimeout(() => {
        setZoomed(true);
        setPhase('ready');
      }, ZOOM_AT),
    );
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [phase, reduced, finish, setPhase]);

  /* Pause the GL loop whenever the hero leaves the viewport. */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), {
      threshold: 0.02,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const revealed = beat >= 0 ? BEATS[beat].revealed : 1;
  const sequencing = !zoomed;

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-[100svh] w-full overflow-hidden"
      aria-label="Introduction"
    >
      <div className="pointer-events-none absolute inset-0 u-grid-lines opacity-[0.55]" aria-hidden />

      {/*
        WebGL is the single heaviest thing on the page, so it is not requested
        until the loader has handed off — first paint stays HTML and CSS only.
        Visitors who asked for reduced motion never load it at all and get the
        static field instead.
      */}
      {phase !== 'loading' && !reduced ? (
        <ErrorBoundary label="hero-gl" fallback={<StaticField />}>
          <ConstellationGL
            revealed={revealed}
            zoom={zoomed ? 1 : 0}
            links={links}
            active={visible}
          />
        </ErrorBoundary>
      ) : (
        <StaticField />
      )}

      {/* ── The typed beats ── */}
      <div
        className={cn(
          'pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 transition-opacity duration-700',
          sequencing ? 'opacity-100' : 'opacity-0',
        )}
        aria-hidden={!sequencing}
      >
        {beat < 0 && !reduced ? (
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ink shadow-[0_0_24px_#fff]" />
        ) : null}
        {BEATS.map((b, i) => (
          <span
            key={b.label}
            className={cn(
              'u-mono u-tnum text-sm transition-all duration-500 md:text-base',
              i === beat ? 'text-ink' : 'text-ink-4',
            )}
            style={{
              opacity: i > beat ? 0 : i === beat ? 1 : 0.35,
              transform: i > beat ? 'translateY(6px)' : 'none',
            }}
          >
            {b.label}
          </span>
        ))}
      </div>

      {/* ── The reveal ── */}
      <div
        className={cn(
          'relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[92rem] flex-col justify-between px-5 pb-24 pt-6 transition-all duration-1000 md:px-10 md:pb-8 md:pt-8',
          zoomed ? 'opacity-100' : 'pointer-events-none translate-y-4 opacity-0',
        )}
      >
        <header className="u-mono flex items-start justify-between text-ink-4">
          <span>ONE WEBSITE EVERY DAY</span>
          <span className="hidden md:inline">CHALLENGE COMPLETE</span>
        </header>

        <div className="flex flex-1 flex-col justify-center py-10">
          <GiantTwoHundred />

          <h1 className="sr-only">
            One website every day — 200 days, 200 builds, one evolving mind.
          </h1>

          <div className="mt-8 flex flex-col gap-6 md:mt-10 md:flex-row md:items-end md:justify-between">
            <p className="max-w-md text-sm leading-relaxed text-ink-2">
              <span className="text-ink">One every day.</span> 200 days of building,
              experimenting, failing, learning, and shipping — collected into a single archive.
              This page is day 200.
            </p>
            <a
              href="#archive"
              data-cursor="link"
              className="u-mono group inline-flex items-center gap-3 self-start border-b border-hairline pb-2 text-ink-2 transition-colors hover:border-ink hover:text-ink md:self-end"
            >
              EXPLORE THE JOURNEY
              <span className="transition-transform duration-300 group-hover:translate-y-1">↓</span>
            </a>
          </div>
        </div>

        <footer className="u-mono flex flex-wrap items-center gap-x-8 gap-y-2 text-ink-4">
          <span>DAY 001 → DAY {TOTAL_DAYS}</span>
          <span className="hidden sm:inline">10 ERAS</span>
          <span className="hidden md:inline">PRESS ⌘K TO SEARCH</span>
        </footer>
      </div>

      {sequencing && !reduced ? (
        <button
          onClick={finish}
          className="u-mono absolute bottom-24 right-5 z-20 md:bottom-6 md:right-6 border border-hairline px-4 py-2 text-ink-3 transition-colors hover:border-hairline-strong hover:text-ink"
          data-cursor="link"
        >
          SKIP INTRO
        </button>
      ) : null}
    </section>
  );
}
