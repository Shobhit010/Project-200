'use client';

import { BY_ERA } from '@/data/derived';
import { ERA_BY_ID } from '@/data/eras';
import { useArchive } from '@/state/archive';
import { Mono, Reveal, SectionMarker } from '@/components/ui/primitives';

/** How thirty-six consecutive days turned experiments into product surfaces. */
export function ProductEra() {
  const { open, setHere } = useArchive();
  const era = ERA_BY_ID['os-era'];
  const builds = BY_ERA['os-era'];

  return (
    <section
      aria-label="The operating system era"
      className="mx-auto w-full max-w-[92rem] px-5 py-24 md:px-10 md:py-32"
    >
      <SectionMarker index="04" label="THE PRODUCT ERA" />

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div>
          <h2 className="u-huge text-[11vw] leading-[0.84] text-ink md:text-[5vw]">
            EVERYTHING
            <br />
            BECAME AN OS
          </h2>
          <Mono className="mt-6 block u-tnum text-ink-3">
            ERA {era.numeral} · DAY {era.from} — {era.to} · {builds.length} BUILDS
          </Mono>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-ink-2">{era.narrative}</p>
          <p className="mt-4 max-w-md text-xs leading-relaxed text-ink-4">
            Each of these is a design and engineering exercise built inside a single day. They are
            product concepts, presented as concepts.
          </p>
        </div>

        <ul className="grid grid-cols-2 gap-px self-start bg-hairline sm:grid-cols-3">
          {builds.map((p, i) => (
            <li key={p.day} className="bg-void">
              <Reveal delay={(i % 6) * 40} y={12}>
                <button
                  onClick={() => open(p.day)}
                  onMouseEnter={() => setHere(p.day)}
                  onFocus={() => setHere(p.day)}
                  data-cursor="view"
                  className="group flex h-full w-full flex-col justify-between gap-6 p-4 text-left transition-colors hover:bg-white/[0.035]"
                >
                  <Mono className="u-tnum text-ink-4">{String(p.day).padStart(3, '0')}</Mono>
                  <span className="u-display text-base leading-tight text-ink-2 transition-colors group-hover:text-ink">
                    {p.title}
                  </span>
                </button>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
