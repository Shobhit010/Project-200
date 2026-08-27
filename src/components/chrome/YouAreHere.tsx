'use client';

import { useEffect, useState } from 'react';
import { ACCENTS } from '@/data/categories';
import { accentOfDay } from '@/data/derived';
import { TOTAL_DAYS } from '@/data/projects';
import { useArchive } from '@/state/archive';
import { cn } from '@/lib/cn';

/**
 * A permanent readout of where the visitor is in the 200 days.
 * Appears once the archive is reachable and hides behind takeovers.
 */
export function YouAreHere() {
  const { hereDay, phase, openDay, paletteOpen, randomOpen, rewinding, open } = useArchive();
  const [past, setPast] = useState(false);

  /* Only once the hero is behind you — it would otherwise sit on the intro. */
  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > window.innerHeight * 0.85);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const hidden =
    !past || phase !== 'ready' || paletteOpen || randomOpen || rewinding || openDay !== null;

  const accent = ACCENTS[accentOfDay(hereDay)];

  return (
    <div
      className={cn(
        'fixed bottom-5 left-5 z-[60] hidden select-none transition-all duration-500 md:block',
        hidden ? 'pointer-events-none translate-y-3 opacity-0' : 'opacity-100',
      )}
      aria-hidden={hidden}
    >
      <div className="u-glass border border-hairline px-4 py-3">
        <div className="u-mono mb-2 text-[0.55rem] text-ink-4">YOU ARE HERE</div>
        <button
          onClick={() => open(hereDay)}
          data-cursor="view"
          className="u-mono u-tnum text-sm text-ink transition-colors hover:text-white"
        >
          DAY {hereDay}
          <span className="text-ink-4"> / {TOTAL_DAYS}</span>
        </button>
        <div className="mt-3 flex h-3 items-end gap-px" aria-hidden>
          {Array.from({ length: 50 }, (_, i) => {
            const dayAt = Math.round(((i + 1) / 50) * TOTAL_DAYS);
            const passed = dayAt <= hereDay;
            return (
              <span
                key={i}
                className="w-px transition-all duration-300"
                style={{
                  height: passed ? '100%' : '35%',
                  background: passed ? accent.hex : 'rgb(255 255 255 / 0.12)',
                  opacity: passed ? 0.85 : 1,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
