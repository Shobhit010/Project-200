'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ACCENTS, CATEGORY_META } from '@/data/categories';
import { BY_DAY, accentOfDay } from '@/data/derived';
import { PROJECTS, TOTAL_DAYS } from '@/data/projects';
import { useArchive } from '@/state/archive';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { Mono } from '@/components/ui/primitives';

/**
 * A slot machine for 200 days. The reel decelerates on an easing curve rather
 * than a timer, so the landing feels earned instead of scripted.
 */
export function RandomMachine() {
  const { randomOpen, setRandomOpen, open } = useArchive();
  const reduced = useReducedMotionSafe();
  const [display, setDisplay] = useState(1);
  const [landed, setLanded] = useState<number | null>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    if (!randomOpen) {
      setLanded(null);
      return;
    }

    const target = PROJECTS[Math.floor(Math.random() * PROJECTS.length)].day;

    if (reduced) {
      setDisplay(target);
      setLanded(target);
      return;
    }

    const DURATION = 2100;
    const start = performance.now();
    let lastSwap = 0;

    const tick = (now: number) => {
      const t = Math.min((now - start) / DURATION, 1);
      // Interval grows from 30ms to ~260ms as the reel slows.
      const interval = 30 + Math.pow(t, 3) * 420;
      if (now - lastSwap > interval) {
        lastSwap = now;
        setDisplay(1 + Math.floor(Math.random() * TOTAL_DAYS));
      }
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDisplay(target);
        setLanded(target);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [randomOpen, reduced]);

  useEffect(() => {
    if (!randomOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setRandomOpen(false);
      if (e.key === 'Enter' && landed) open(landed);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [randomOpen, landed, open, setRandomOpen]);

  const project = landed ? BY_DAY.get(landed) : null;
  const accent = ACCENTS[accentOfDay(landed ?? display)];

  return (
    <AnimatePresence>
      {randomOpen ? (
        <motion.div
          className="fixed inset-0 z-[125] flex flex-col items-center justify-center bg-void px-6"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduced ? undefined : { opacity: 0 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-label="Random build"
        >
          <div
            className="u-glow left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2"
            style={{ ['--accent-rgb' as string]: accent.rgb }}
            aria-hidden
          />

          <Mono className="relative text-ink-4">
            {landed ? 'YOU GOT' : 'SPINNING THE ARCHIVE…'}
          </Mono>

          <div
            className="u-huge u-tnum relative mt-6 text-[28vw] leading-[0.8] text-ink md:text-[16vw]"
            style={{ color: landed ? accent.hex : undefined }}
            aria-live="polite"
          >
            {String(display).padStart(3, '0')}
          </div>

          <div className="relative mt-6 flex min-h-[6rem] flex-col items-center gap-5">
            {project ? (
              <motion.div
                initial={reduced ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-4"
              >
                <span className="u-display text-3xl text-ink md:text-5xl">
                  {project.title.toUpperCase()}
                </span>
                <Mono className="text-ink-3">
                  {project.categories.map((c) => CATEGORY_META[c].label.toUpperCase()).join(' · ')}
                </Mono>
                <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => open(project.day)}
                    data-cursor="view"
                    className="u-mono bg-ink px-6 py-4 text-void transition-colors hover:bg-white"
                  >
                    ENTER PROJECT
                  </button>
                  <button
                    onClick={() => {
                      setLanded(null);
                      setRandomOpen(false);
                      requestAnimationFrame(() => setRandomOpen(true));
                    }}
                    data-cursor="link"
                    className="u-mono border border-hairline px-6 py-4 text-ink-2 transition-colors hover:border-hairline-strong hover:text-ink"
                  >
                    ROLL AGAIN
                  </button>
                </div>
              </motion.div>
            ) : null}
          </div>

          <button
            onClick={() => setRandomOpen(false)}
            data-cursor="link"
            className="u-mono absolute bottom-8 text-ink-4 transition-colors hover:text-ink"
          >
            CLOSE · ESC
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
