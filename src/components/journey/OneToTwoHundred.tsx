'use client';

import { useScrollProgress } from '@/hooks/useIntersect';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { Mono } from '@/components/ui/primitives';

const MARKS = [1, 10, 50, 100, 150, 200];

/**
 * The emotional centre of the site: one numeral, scrubbed by scroll, nothing
 * else on screen. The numbers overlap rather than cut, so the count reads as
 * one continuous thing becoming another.
 */
export function OneToTwoHundred() {
  const reduced = useReducedMotionSafe();
  const { ref, progress } = useScrollProgress<HTMLDivElement>();

  // Which mark we are on, and how far into the crossfade.
  const raw = progress * (MARKS.length - 1);
  const index = Math.min(Math.floor(raw), MARKS.length - 1);
  const frac = raw - index;

  return (
    <section aria-label="From one to two hundred" className="relative">
      <div ref={ref} className="relative h-[280vh]">
        <div className="sticky top-0 flex h-[100svh] flex-col items-center justify-center overflow-hidden px-5">
          <Mono className="absolute top-[18%] text-ink-4">FROM 1 TO 200</Mono>

          <div className="relative flex h-[46vh] w-full items-center justify-center">
            {MARKS.map((mark, i) => {
              const distance = reduced ? (i === MARKS.length - 1 ? 0 : 4) : i - (index + frac);
              const abs = Math.abs(distance);
              if (abs > 1.2) return null;
              return (
                <span
                  key={mark}
                  aria-hidden={abs > 0.5}
                  className="u-huge u-tnum absolute text-[46vw] leading-none text-ink md:text-[26vw]"
                  style={{
                    opacity: Math.max(1 - abs * 1.35, 0),
                    transform: `translateY(${distance * -14}vh) scale(${1 - abs * 0.14})`,
                    filter: abs > 0.05 ? `blur(${abs * 14}px)` : 'none',
                    willChange: 'transform, opacity, filter',
                  }}
                >
                  {mark}
                </span>
              );
            })}
          </div>

          <div className="relative mt-4 max-w-xl text-center">
            <p className="text-base leading-relaxed text-ink-2 md:text-lg">
              One idea became a habit.
              <br />
              <span className="text-ink-3">A habit became a discipline.</span>
              <br />
              <span className="text-ink">A discipline became 200 shipped projects.</span>
            </p>
          </div>

          <div className="absolute bottom-[12%] flex items-center gap-3">
            {MARKS.map((mark, i) => (
              <span
                key={mark}
                className="u-mono u-tnum text-[0.6rem] transition-colors duration-300"
                style={{ color: i <= index ? '#F2F3F5' : '#767B84' }}
              >
                {mark}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
