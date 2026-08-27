'use client';

import { useEffect, useState } from 'react';
import { PROJECTS, TOTAL_DAYS } from '@/data/projects';
import { KEYS } from '@/lib/constants';
import { pad } from '@/lib/cn';
import { useArchive } from '@/state/archive';

/**
 * The archive is local data, so nothing is actually being fetched — the count
 * is bound to a real rAF ramp over the dataset and lasts a fixed, short beat.
 * Seen once per session; after that the site opens straight into the hero.
 */
export function Loader() {
  const { phase, setPhase } = useArchive();
  /** A deep link (/day/147) starts in the ready phase — the loader never shows. */
  const deepLinked = phase !== 'loading';
  const [count, setCount] = useState(deepLinked ? TOTAL_DAYS : 0);
  const [ready, setReady] = useState(deepLinked);
  const [gone, setGone] = useState(deepLinked);

  useEffect(() => {
    if (deepLinked) return;

    // Read the preference directly rather than waiting for the reduced-motion
    // hook to settle, because this ramp starts on the very first frame.
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(KEYS.loaderSeen) === '1';
    } catch {
      /* storage unavailable — show the loader */
    }

    const remember = () => {
      try {
        window.sessionStorage.setItem(KEYS.loaderSeen, '1');
      } catch {
        /* ignore */
      }
    };

    if (seen || prefersReduced) {
      setCount(TOTAL_DAYS);
      setReady(true);
      setGone(true);
      setPhase('hero');
      remember();
      return;
    }

    const DURATION = 1500;
    const start = performance.now();
    let raf = 0;
    let handoff = 0;

    const tick = (now: number) => {
      const t = Math.min((now - start) / DURATION, 1);
      const eased = 1 - Math.pow(1 - t, 2.4);
      setCount(Math.round(eased * PROJECTS.length));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setReady(true);
        handoff = window.setTimeout(() => {
          setGone(true);
          setPhase('hero');
          remember();
        }, 620);
      }
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(handoff);
    };
  }, [deepLinked, setPhase]);

  if (gone && phase !== 'loading') return null;

  return (
    <div
      className="fixed inset-0 z-[150] flex flex-col justify-between bg-void px-6 py-6 transition-opacity duration-700 md:px-10 md:py-8"
      style={{ opacity: gone ? 0 : 1, pointerEvents: gone ? 'none' : 'auto' }}
      role="status"
      aria-live="polite"
      aria-label="Loading the archive"
    >
      <div className="u-mono flex justify-between text-ink-4">
        <span>ONE WEBSITE EVERY DAY</span>
        <span>ARCHIVE v1.0</span>
      </div>

      <div className="flex flex-col items-start gap-6">
        <p className="u-mono text-[0.68rem] text-ink-2">
          {ready ? 'ARCHIVE READY.' : 'BUILDING THE ARCHIVE…'}
        </p>
        <div className="u-huge u-tnum text-[18vw] leading-[0.8] text-ink md:text-[11vw]">
          {pad(count)}
          <span className="text-ink-4"> / {TOTAL_DAYS}</span>
        </div>
        <div className="h-px w-full max-w-3xl bg-hairline" aria-hidden>
          <div
            className="h-px bg-ink transition-[width] duration-150 ease-linear"
            style={{ width: `${(count / TOTAL_DAYS) * 100}%` }}
          />
        </div>
      </div>

      <div className="u-mono flex flex-wrap gap-x-8 gap-y-2 text-ink-4">
        <span>200 BUILDS</span>
        <span>10 ERAS</span>
        <span>0 EXTERNAL REQUESTS</span>
      </div>
    </div>
  );
}
