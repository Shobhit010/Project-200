'use client';

import { BY_DAY } from '@/data/derived';
import { useArchive } from '@/state/archive';
import { Mono, Reveal } from '@/components/ui/primitives';

const STUDIO_DAYS = [190, 191, 192, 193];
const NEON = '#FF6B4A';

/**
 * Deliberately off-system. Everything else in the archive is restrained; the
 * four-day game studio is allowed to be loud, because that is what it was.
 */
export function GameStudio() {
  const { open, setHere } = useArchive();
  const games = STUDIO_DAYS.map((d) => BY_DAY.get(d)!).filter(Boolean);

  return (
    <section
      aria-label="The game studio"
      className="u-scanlines relative overflow-hidden border-y border-hairline bg-[#0a0507] py-24 md:py-32"
      style={{ ['--accent' as string]: NEON, ['--accent-rgb' as string]: '255 107 74' }}
    >
      <div
        className="u-glow left-[-10%] top-[10%] h-[36rem] w-[36rem]"
        style={{ ['--accent-rgb' as string]: '255 107 74', opacity: 0.28 }}
        aria-hidden
      />
      <div
        className="u-glow right-[-8%] bottom-[0%] h-[28rem] w-[28rem]"
        style={{ ['--accent-rgb' as string]: '169 123 255', opacity: 0.18 }}
        aria-hidden
      />

      <div className="relative mx-auto w-full max-w-[92rem] px-5 md:px-10">
        <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
          <Mono style={{ color: NEON }}>ERA 09 · DAYS 190 — 193</Mono>
          <Mono className="text-ink-4">FOUR DAYS · FOUR FINISHED GAMES</Mono>
        </div>

        <h2
          className="u-huge mt-8 text-[14vw] leading-[0.8] md:text-[7vw]"
          style={{
            color: '#fff',
            textShadow: `0 0 40px ${NEON}55, 0 0 90px ${NEON}22`,
          }}
        >
          THE GAME
          <br />
          STUDIO
        </h2>

        <p className="mt-8 max-w-xl text-sm leading-relaxed text-ink-2">
          Not prototypes this time. Menus, deaths, scores and an ending — four complete little
          games, one per night.
        </p>

        <ul className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {games.map((g, i) => (
            <li key={g.day}>
              <Reveal delay={i * 90}>
                <button
                  onClick={() => open(g.day)}
                  onMouseEnter={() => setHere(g.day)}
                  onFocus={() => setHere(g.day)}
                  data-cursor="label"
                  data-cursor-label="PLAY"
                  className="group relative flex h-full w-full flex-col justify-between gap-10 border p-5 text-left transition-all duration-300"
                  style={{ borderColor: `${NEON}33`, background: '#0d0709' }}
                >
                  <span
                    className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      background: `linear-gradient(160deg, ${NEON}18, transparent 65%)`,
                    }}
                    aria-hidden
                  />
                  <span className="relative u-mono u-tnum" style={{ color: NEON }}>
                    CABINET {String(i + 1).padStart(2, '0')} · DAY {g.day}
                  </span>
                  <span className="relative">
                    <span className="u-display block text-2xl leading-tight text-ink md:text-3xl">
                      {g.title.toUpperCase()}
                    </span>
                    <span className="mt-3 block text-xs leading-relaxed text-ink-3">
                      {g.description}
                    </span>
                  </span>
                  <span className="relative u-mono flex items-center gap-2 text-ink-4 transition-colors group-hover:text-ink">
                    INSERT COIN
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
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
