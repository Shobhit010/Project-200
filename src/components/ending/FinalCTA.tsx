'use client';

import { LINKS, SITE } from '@/lib/constants';
import { FEATURED } from '@/data/derived';
import { useArchive } from '@/state/archive';
import { ConfigurableLink, Mono, Rule } from '@/components/ui/primitives';

export function FinalCTA() {
  const { open, setRandomOpen, setMode, setRewinding } = useArchive();

  const jumpToArchive = () => {
    document.getElementById('archive')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="relative overflow-hidden border-t border-hairline bg-void">
      <div className="mx-auto w-full max-w-[92rem] px-5 pb-32 pt-24 md:px-10 md:pb-32 md:pt-32">
        <h2 className="u-huge text-[12vw] leading-[0.82] text-ink md:text-[5.6vw]">
          THE CHALLENGE
          <br />
          IS COMPLETE.
        </h2>

        <div className="mt-10 flex flex-wrap items-baseline gap-x-10 gap-y-3">
          <span className="u-display text-2xl text-ink-2 md:text-4xl">200 DAYS.</span>
          <span className="u-display text-2xl text-ink-2 md:text-4xl">200 BUILDS.</span>
          <span className="u-display text-2xl text-ink md:text-4xl">1 JOURNEY.</span>
        </div>

        {/* Actions */}
        <div className="mt-14 grid grid-cols-1 gap-px bg-hairline sm:grid-cols-2 lg:grid-cols-4">
          <Action label="START AT DAY 1" hint="Where it began" onClick={() => open(1)} />
          <Action
            label="EXPLORE RANDOMLY"
            hint="Teleport somewhere"
            onClick={() => setRandomOpen(true)}
          />
          <Action
            label="VIEW MY BEST BUILDS"
            hint={`${FEATURED.filter((p) => p.day !== 200).length} featured`}
            onClick={() => {
              setMode('grid');
              jumpToArchive();
            }}
          />
          <Action
            label="REWIND 200 DAYS"
            hint="200 → 1"
            onClick={() => setRewinding(true)}
          />
        </div>

        {/* Links — nothing fabricated */}
        <div className="mt-10 flex flex-wrap gap-3">
          {(['portfolio', 'email', 'x', 'github', 'linkedin'] as const).map((key) => (
            <ConfigurableLink
              key={key}
              href={LINKS[key].href}
              label={LINKS[key].label}
              hint={LINKS[key].hint}
            />
          ))}
        </div>

        <Rule className="mt-20" />

        {/* About */}
        <section aria-label="About the builder" className="mt-10 grid gap-10 lg:grid-cols-2">
          <div>
            <Mono className="text-ink-4">ABOUT</Mono>
            <h3 className="u-display mt-4 text-4xl text-ink md:text-6xl">
              BUILT BY {SITE.builder}
            </h3>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-ink-2">
              A developer who decided to stop waiting for ideas and start shipping them.
            </p>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-3">
              One website every day.
              <br />
              For 200 days.
              <br />
              No excuses.
            </p>
          </div>

          <div className="flex flex-col justify-end">
            <span className="u-huge text-[13vw] leading-[0.82] text-ink md:text-[5vw]">
              WHAT SHOULD I
              <br />
              BUILD NEXT?
            </span>
          </div>
        </section>

        <Rule className="mt-20" />

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <Mono className="text-ink-4">{SITE.name} · ARCHIVE v1.0</Mono>
          <Mono className="text-ink-4">DAY 200 IS THIS PAGE</Mono>
        </div>
      </div>
    </footer>
  );
}

function Action({
  label,
  hint,
  onClick,
}: {
  label: string;
  hint: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      data-cursor="link"
      className="group flex flex-col justify-between gap-10 bg-void p-6 text-left transition-colors hover:bg-white/[0.035]"
    >
      <Mono className="text-ink-4">{hint}</Mono>
      <span className="u-display flex items-center justify-between gap-4 text-lg text-ink-2 transition-colors group-hover:text-ink md:text-xl">
        {label}
        <span
          aria-hidden
          className="text-ink-4 transition-transform duration-300 group-hover:translate-x-1"
        >
          →
        </span>
      </span>
    </button>
  );
}
