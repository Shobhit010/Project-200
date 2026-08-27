'use client';

import { ACCENTS } from '@/data/categories';
import { ERAS } from '@/data/eras';
import { accentOfDay } from '@/data/derived';
import { useArchive } from '@/state/archive';
import { Mono } from '@/components/ui/primitives';
import { EmptyState } from './TimelineMode';

/** Ten chapters. Each one states what the era was for, then lists its builds. */
export function EraMode() {
  const { visible, open, setHere } = useArchive();

  const chapters = ERAS.map((era) => ({
    era,
    items: visible.filter((p) => p.era === era.id),
  })).filter((c) => c.items.length > 0);

  if (chapters.length === 0) {
    return (
      <div className="mx-auto w-full max-w-[92rem] px-5 pb-24 md:px-10">
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[92rem] px-5 pb-24 md:px-10">
      {chapters.map(({ era, items }) => {
        const accent = ACCENTS[era.accent];
        return (
          <section key={era.id} className="border-b border-hairline py-12 md:py-16">
            <div className="grid gap-8 lg:grid-cols-[22rem_1fr] lg:gap-14">
              <div
                className="lg:sticky lg:self-start"
                style={{ top: 'calc(4.5rem + var(--toolbar-h, 7rem))' }}
              >
                <Mono className="text-ink-4">ERA {era.numeral}</Mono>
                <h3
                  className="u-display mt-3 text-3xl leading-[0.95] md:text-5xl"
                  style={{ color: accent.hex }}
                >
                  {era.name}
                </h3>
                <Mono className="mt-4 block u-tnum text-ink-3">
                  DAY {era.from} — {era.to} · {items.length} BUILDS
                </Mono>
                <p className="mt-5 text-sm leading-relaxed text-ink-2">{era.narrative}</p>
              </div>

              <ul className="grid grid-cols-2 gap-px self-start bg-hairline sm:grid-cols-3 xl:grid-cols-4">
                {items.map((p) => {
                  const pAccent = ACCENTS[accentOfDay(p.day)];
                  return (
                    <li key={p.day} className="bg-void">
                      <button
                        onClick={() => open(p.day)}
                        onMouseEnter={() => setHere(p.day)}
                        onFocus={() => setHere(p.day)}
                        data-cursor="view"
                        className="group flex h-full w-full flex-col justify-between gap-6 p-4 text-left transition-colors hover:bg-white/[0.03]"
                      >
                        <span className="u-mono u-tnum flex items-center gap-2 text-ink-4">
                          <span
                            className="h-1 w-1 rounded-full"
                            style={{ background: pAccent.hex }}
                          />
                          {String(p.day).padStart(3, '0')}
                        </span>
                        <span className="u-display text-base leading-tight text-ink-2 transition-colors group-hover:text-ink">
                          {p.title}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        );
      })}
    </div>
  );
}
