'use client';

import { useMemo } from 'react';
import { ACCENTS } from '@/data/categories';
import { eraOfDay } from '@/data/eras';
import { BY_DAY, accentOfDay } from '@/data/derived';
import { cn } from '@/lib/cn';
import { useScrollProgress } from '@/hooks/useIntersect';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { useArchive } from '@/state/archive';
import { Mono, SectionMarker } from '@/components/ui/primitives';

const STOPS = [1, 25, 50, 75, 100, 125, 150, 175, 200];

/**
 * The evolution scroll.
 *
 * The panels do not describe the growth — they perform it. Early stops are
 * flat, roomy and single-weight; middle stops gain grids and data density;
 * late stops gain layered surfaces and a tighter hierarchy.
 */
export function Evolution() {
  const reduced = useReducedMotionSafe();
  const { ref, progress } = useScrollProgress<HTMLDivElement>();
  const { open } = useArchive();

  const panels = useMemo(
    () =>
      STOPS.map((day) => {
        const project = BY_DAY.get(day)!;
        const era = eraOfDay(day);
        const accent = ACCENTS[accentOfDay(day)];
        // 0 at day 1, 1 at day 200 — drives how "built up" a panel looks.
        const maturity = (day - 1) / 199;
        return { day, project, era, accent, maturity };
      }),
    [],
  );

  const shift = reduced ? 0 : progress * (panels.length - 1) * 100;

  return (
    <section aria-label="Watch the evolution" className="relative">
      <div className="mx-auto w-full max-w-[92rem] px-5 pt-24 md:px-10 md:pt-32">
        <SectionMarker index="02" label="THE JOURNEY" />
        <h2 className="u-huge mt-8 text-[13vw] leading-[0.82] text-ink md:text-[6vw]">
          WATCH THE
          <br />
          EVOLUTION
        </h2>
        <p className="mt-6 max-w-lg text-sm leading-relaxed text-ink-2">
          Nine checkpoints across two hundred days. The panels themselves change as you scroll —
          plain at the start, dense in the middle, layered by the end.
        </p>
      </div>

      {/* Tall scroll track drives a horizontal rail. */}
      <div ref={ref} className="relative h-[340vh] md:h-[420vh]">
        <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
          <div
            className="flex will-change-transform"
            style={{
              transform: `translate3d(-${shift}vw, 0, 0)`,
              transition: reduced ? 'none' : 'transform 120ms linear',
            }}
          >
            {panels.map(({ day, project, era, accent, maturity }) => (
              <article
                key={day}
                className="flex h-[64svh] w-screen shrink-0 items-center px-5 md:px-10"
                aria-label={`Day ${day}`}
              >
                <div
                  className={cn(
                    'relative flex h-full w-full max-w-[92rem] flex-col justify-between overflow-hidden p-6 md:p-10',
                    maturity > 0.25 && 'border border-hairline',
                    maturity > 0.62 && 'u-glass',
                  )}
                  style={{
                    background:
                      maturity > 0.62
                        ? `linear-gradient(160deg, rgb(${accent.rgb} / 0.07), transparent 60%)`
                        : undefined,
                  }}
                >
                  {maturity > 0.35 ? (
                    <div className="pointer-events-none absolute inset-0 u-grid-lines opacity-40" />
                  ) : null}

                  <header className="relative flex items-start justify-between gap-6">
                    <Mono className="u-tnum text-ink-4">
                      DAY {day} <span className="text-ink-4">/ 200</span>
                    </Mono>
                    <Mono style={{ color: accent.hex }}>
                      ERA {era.numeral} · {era.name}
                    </Mono>
                  </header>

                  <div className="relative">
                    <button
                      onClick={() => open(day)}
                      data-cursor="view"
                      className="text-left"
                    >
                      <span
                        className="u-huge block text-[15vw] leading-[0.82] text-ink md:text-[7vw]"
                        style={{
                          fontWeight: 400 + Math.round(maturity * 200),
                          letterSpacing: `${-0.02 - maturity * 0.025}em`,
                        }}
                      >
                        {project.title.toUpperCase()}
                      </span>
                    </button>
                    <p
                      className="mt-5 max-w-xl leading-relaxed text-ink-2"
                      style={{ fontSize: `${1 - maturity * 0.12}rem` }}
                    >
                      {project.description}
                    </p>
                  </div>

                  <footer className="relative flex flex-wrap items-end justify-between gap-4">
                    <p className="max-w-md text-xs leading-relaxed text-ink-3">{era.tagline}</p>
                    {maturity > 0.5 ? (
                      <div className="hidden gap-px sm:flex" aria-hidden>
                        {Array.from({ length: 24 }, (_, i) => (
                          <span
                            key={i}
                            className="w-1"
                            style={{
                              height: `${8 + ((i * 37) % 30)}px`,
                              background:
                                i / 24 < maturity ? accent.hex : 'rgb(255 255 255 / 0.1)',
                              opacity: 0.5,
                            }}
                          />
                        ))}
                      </div>
                    ) : null}
                  </footer>
                </div>
              </article>
            ))}
          </div>

          {/* Progress rail */}
          <div className="pointer-events-none absolute bottom-8 left-0 right-0 mx-auto w-full max-w-[92rem] px-5 md:px-10">
            <div className="flex items-center gap-3">
              <Mono className="u-tnum text-ink-4">DAY 1</Mono>
              <div className="relative h-px flex-1 bg-hairline">
                <div
                  className="absolute left-0 top-0 h-px bg-ink"
                  style={{ width: `${Math.max(progress, 0) * 100}%` }}
                />
              </div>
              <Mono className="u-tnum text-ink-4">DAY 200</Mono>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
