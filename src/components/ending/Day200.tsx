'use client';

import { useEffect, useState } from 'react';
import { useIntersect } from '@/hooks/useIntersect';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { cn } from '@/lib/cn';
import { Mono } from '@/components/ui/primitives';

const MANIFESTO = [
  'I didn’t build one website for 200 days.',
  'I built a habit.',
  'Then a system.',
  'Then 200 experiments.',
  'And somewhere along the way,',
  'I became a better builder.',
];

/**
 * The quiet part. No particles, no parallax — the beats simply arrive, with
 * enough silence between them to be felt.
 */
export function Day200() {
  const reduced = useReducedMotionSafe();
  const { ref, inView } = useIntersect<HTMLElement>({ threshold: 0.4 });
  const [step, setStep] = useState(reduced ? 99 : -1);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setStep(99);
      return;
    }
    const marks = [0, 900, 2100, 3000, 3400, 3800, 4200, 4600, 5000, 6200];
    const timers = marks.map((ms, i) => window.setTimeout(() => setStep(i), ms));
    return () => timers.forEach(clearTimeout);
  }, [inView, reduced]);

  const at = (n: number) => step >= n;

  return (
    <section
      ref={ref}
      aria-label="Day 200"
      className="relative flex min-h-[110svh] flex-col items-center justify-center overflow-hidden bg-black px-5 py-32"
    >
      <div className="flex w-full max-w-2xl flex-col items-start gap-6">
        <Beat show={at(0)} reduced={reduced}>
          <Mono className="text-ink-3">DAY 200</Mono>
        </Beat>

        <Beat show={at(1)} reduced={reduced}>
          <span className="u-display text-3xl text-ink-2 md:text-5xl">THE LAST ONE.</span>
        </Beat>

        <Beat show={at(2)} reduced={reduced}>
          <span className="u-huge text-[16vw] leading-[0.86] text-ink md:text-[7vw]">
            NOT REALLY.
          </span>
        </Beat>

        <div className="mt-6 flex flex-col gap-2">
          {MANIFESTO.map((line, i) => (
            <Beat key={line} show={at(3 + i)} reduced={reduced}>
              <p
                className={cn(
                  'text-base leading-relaxed md:text-xl',
                  i === MANIFESTO.length - 1 ? 'text-ink' : 'text-ink-2',
                )}
              >
                {line}
              </p>
            </Beat>
          ))}
        </div>

        <Beat show={at(9)} reduced={reduced}>
          <span className="u-display mt-10 block text-2xl text-ink md:text-4xl">
            THANK YOU FOR EXPLORING.
          </span>
        </Beat>
      </div>
    </section>
  );
}

function Beat({
  show,
  reduced,
  children,
}: {
  show: boolean;
  reduced: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        opacity: show ? 1 : 0,
        transform: show ? 'none' : 'translateY(10px)',
        transition: reduced ? 'none' : 'opacity 1100ms var(--ease-out-expo), transform 1100ms var(--ease-out-expo)',
      }}
    >
      {children}
    </div>
  );
}
