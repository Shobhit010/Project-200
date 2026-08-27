'use client';

import { PROJECTS } from '@/data/projects';
import { useArchive } from '@/state/archive';
import { Mono, Reveal, SectionMarker } from '@/components/ui/primitives';

/**
 * Maximum restraint. These entries are presented as part of the archive and
 * nothing more — no ownership, client relationships, or results are claimed,
 * because none were supplied.
 */
export function RealWorld() {
  const { open, setHere } = useArchive();
  const builds = PROJECTS.filter(
    (p) => p.categories.includes('real-world') && p.day !== 200,
  ).sort((a, b) => a.day - b.day);

  return (
    <section
      aria-label="From experiments to real products"
      className="border-y border-hairline bg-surface/40"
    >
      <div className="mx-auto w-full max-w-[92rem] px-5 py-24 md:px-10 md:py-32">
        <SectionMarker index="05" label="REAL WORLD" />

        <h2 className="u-huge mt-8 max-w-4xl text-[11vw] leading-[0.84] text-ink md:text-[5.2vw]">
          FROM EXPERIMENTS
          <br />
          TO REAL PRODUCTS
        </h2>

        <p className="mt-8 max-w-xl text-sm leading-relaxed text-ink-2">
          Builds from the challenge that live on their own domains. They are listed here as
          archive entries — the links are the claim, and the only claim.
        </p>

        <ul className="mt-14 divide-y divide-hairline border-y border-hairline">
          {builds.map((p, i) => (
            <li key={`${p.day}-${p.title}`}>
              <Reveal delay={i * 45} y={10}>
                <div className="group grid grid-cols-[3.5rem_1fr_auto] items-center gap-4 py-5 md:grid-cols-[5rem_1fr_1fr_auto] md:gap-8">
                  <Mono className="u-tnum text-ink-4">{String(p.day).padStart(3, '0')}</Mono>

                  <button
                    onClick={() => open(p.day)}
                    onMouseEnter={() => setHere(p.day)}
                    onFocus={() => setHere(p.day)}
                    data-cursor="view"
                    className="min-w-0 text-left"
                  >
                    <span className="u-display block truncate text-2xl text-ink-2 transition-colors group-hover:text-ink md:text-4xl">
                      {p.title}
                    </span>
                  </button>

                  <span className="hidden truncate text-xs text-ink-3 md:block">
                    {p.description}
                  </span>

                  {p.url ? (
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="external"
                      className="u-mono shrink-0 border border-hairline px-3 py-2 text-ink-3 transition-colors hover:border-hairline-strong hover:text-ink"
                    >
                      OPEN ↗
                    </a>
                  ) : null}
                </div>
              </Reveal>
            </li>
          ))}
        </ul>

        <p className="mt-8 max-w-xl text-xs leading-relaxed text-ink-4">
          Two of these appear twice in the log — Day 100 and Day 196 are the same build, as are
          Day 139 and Day 195. The archive keeps both entries rather than quietly editing the
          record.
        </p>
      </div>
    </section>
  );
}
