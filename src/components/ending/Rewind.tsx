'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ACCENTS } from '@/data/categories';
import { eraOfDay } from '@/data/eras';
import { accentOfDay } from '@/data/derived';
import { TOTAL_DAYS } from '@/data/projects';
import { useArchive } from '@/state/archive';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { Mono } from '@/components/ui/primitives';

/**
 * Counts 200 → 1 with the era colour bleeding backwards, then lands on Day 1.
 * Escape cancels; reduced motion skips straight to the destination.
 */
export function Rewind() {
  const { rewinding, setRewinding, open } = useArchive();
  const reduced = useReducedMotionSafe();
  const [day, setDay] = useState(TOTAL_DAYS);
  const rafRef = useRef(0);

  useEffect(() => {
    if (!rewinding) return;

    if (reduced) {
      setRewinding(false);
      open(1);
      return;
    }

    setDay(TOTAL_DAYS);
    const DURATION = 2600;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - start) / DURATION, 1);
      // Fast at first, long settle into Day 1.
      const eased = 1 - Math.pow(1 - t, 3);
      const next = Math.max(Math.round(TOTAL_DAYS - eased * (TOTAL_DAYS - 1)), 1);
      setDay(next);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        window.setTimeout(() => {
          setRewinding(false);
          open(1);
        }, 700);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [rewinding, reduced, setRewinding, open]);

  useEffect(() => {
    if (!rewinding) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        cancelAnimationFrame(rafRef.current);
        setRewinding(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [rewinding, setRewinding]);

  const accent = ACCENTS[accentOfDay(day)];
  const era = eraOfDay(day);

  return (
    <AnimatePresence>
      {rewinding ? (
        <motion.div
          className="fixed inset-0 z-[135] flex flex-col items-center justify-center bg-void"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduced ? undefined : { opacity: 0 }}
          transition={{ duration: 0.25 }}
          role="status"
          aria-live="off"
          aria-label="Rewinding through the archive"
        >
          <div
            className="u-glow left-1/2 top-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 transition-opacity"
            style={{ ['--accent-rgb' as string]: accent.rgb }}
            aria-hidden
          />

          <Mono className="relative text-ink-4">REWINDING</Mono>

          <div
            className="u-huge u-tnum relative mt-4 text-[34vw] leading-[0.8] transition-colors duration-300 md:text-[18vw]"
            style={{ color: accent.hex }}
          >
            {day}
          </div>

          <Mono className="relative mt-4 text-ink-3">
            ERA {era.numeral} · {era.name}
          </Mono>

          <div className="relative mt-10 h-px w-[70vw] max-w-3xl bg-hairline" aria-hidden>
            <div
              className="h-px bg-ink transition-[width] duration-100 ease-linear"
              style={{ width: `${(day / TOTAL_DAYS) * 100}%` }}
            />
          </div>

          <button
            onClick={() => {
              cancelAnimationFrame(rafRef.current);
              setRewinding(false);
            }}
            className="u-mono absolute bottom-8 text-ink-4 transition-colors hover:text-ink"
          >
            CANCEL · ESC
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
