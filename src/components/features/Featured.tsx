'use client';

import { ACCENTS, CATEGORY_META } from '@/data/categories';
import { FEATURED, accentOfDay } from '@/data/derived';
import { useArchive } from '@/state/archive';
import { Mono, Reveal, SectionMarker } from '@/components/ui/primitives';
import { Thumb } from '@/components/archive/Thumb';

/** The builds worth an evening rather than a glance. */
export function Featured() {
  const { open, setHere } = useArchive();
  const picks = FEATURED.filter((p) => p.day !== 200);

  return (
    <section
      aria-label="Builds worth getting lost in"
      className="mx-auto w-full max-w-[92rem] px-5 py-24 md:px-10 md:py-32"
    >
      <SectionMarker index="03" label="FEATURED" />
      <h2 className="u-huge mt-8 max-w-4xl text-[11vw] leading-[0.84] text-ink md:text-[5.2vw]">
        BUILDS WORTH
        <br />
        GETTING LOST IN
      </h2>

      <ul className="mt-14 grid grid-cols-1 gap-px bg-hairline sm:grid-cols-2 lg:grid-cols-3">
        {picks.map((p, i) => {
          const family = accentOfDay(p.day);
          const accent = ACCENTS[family];
          return (
            <li key={p.day} className="bg-void">
              <Reveal delay={(i % 3) * 70}>
                <button
                  onClick={() => open(p.day)}
                  onMouseEnter={() => setHere(p.day)}
                  onFocus={() => setHere(p.day)}
                  data-cursor="view"
                  className="group flex h-full w-full flex-col p-5 text-left transition-colors hover:bg-white/[0.03] md:p-6"
                >
                  <div className="relative mb-6 aspect-[3/2] w-full overflow-hidden border border-hairline">
                    <Thumb day={p.day} family={family} />
                  </div>

                  <div className="flex items-baseline justify-between gap-4">
                    <Mono className="u-tnum text-ink-4">
                      DAY {p.day} <span className="text-ink-4">/ 200</span>
                    </Mono>
                    <Mono style={{ color: accent.hex }}>
                      {CATEGORY_META[p.categories[0]].label.toUpperCase()}
                    </Mono>
                  </div>

                  <h3 className="u-display mt-3 text-2xl text-ink-2 transition-colors group-hover:text-ink md:text-3xl">
                    {p.title}
                  </h3>
                  <p className="mt-3 flex-1 text-xs leading-relaxed text-ink-3">{p.description}</p>

                  <span className="u-mono mt-6 flex items-center gap-2 text-ink-4 transition-colors group-hover:text-ink">
                    VIEW BUILD
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </button>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
