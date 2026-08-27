'use client';

import { Fragment } from 'react';
import { ACCENTS, CATEGORY_META } from '@/data/categories';
import { ERAS } from '@/data/eras';
import { accentOfDay } from '@/data/derived';
import { TOTAL_DAYS, type Project } from '@/data/projects';
import { cn } from '@/lib/cn';
import { useArchive } from '@/state/archive';
import { Mono } from '@/components/ui/primitives';
import { Thumb } from '../Thumb';

/** The chronological spine: one row per build, era headers pinned as you pass. */
export function TimelineMode() {
  const { visible, open, setHere } = useArchive();

  const grouped = ERAS.map((era) => ({
    era,
    items: visible.filter((p) => p.era === era.id),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="mx-auto w-full max-w-[92rem] px-5 pb-24 md:px-10">
      {grouped.map(({ era, items }) => (
        <Fragment key={era.id}>
          <div
            className="sticky z-20 -mx-5 border-b border-hairline bg-void px-5 py-3 md:-mx-10 md:px-10"
            style={{ top: 'calc(3rem + var(--toolbar-h, 7rem))' }}
          >
            <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
              <Mono className="text-ink-4">ERA {era.numeral}</Mono>
              <span
                className="u-display text-lg text-ink md:text-2xl"
                style={{ color: ACCENTS[era.accent].hex }}
              >
                {era.name}
              </span>
              <Mono className="u-tnum text-ink-4">
                DAY {era.from} — {era.to}
              </Mono>
              <span className="hidden flex-1 text-xs text-ink-3 lg:block">{era.tagline}</span>
            </div>
          </div>

          <ul>
            {items.map((p) => (
              <TimelineRow key={p.day} project={p} onOpen={open} onHover={setHere} />
            ))}
          </ul>
        </Fragment>
      ))}

      {visible.length === 0 ? <EmptyState /> : null}
    </div>
  );
}

function TimelineRow({
  project,
  onOpen,
  onHover,
}: {
  project: Project;
  onOpen: (day: number) => void;
  onHover: (day: number) => void;
}) {
  const family = accentOfDay(project.day);
  const accent = ACCENTS[family];

  return (
    <li className="group border-b border-hairline">
      <button
        onClick={() => onOpen(project.day)}
        onMouseEnter={() => onHover(project.day)}
        onFocus={() => onHover(project.day)}
        data-cursor="view"
        className="grid w-full grid-cols-[3.5rem_1fr] items-center gap-4 py-4 text-left transition-colors hover:bg-white/[0.02] md:grid-cols-[5rem_1.4fr_1fr_auto] md:gap-6 md:py-5"
      >
        <span className="u-mono u-tnum flex items-center gap-2 text-ink-4 transition-colors group-hover:text-ink-2">
          <span
            className="h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-300 group-hover:scale-150"
            style={{ background: accent.hex, boxShadow: `0 0 10px ${accent.hex}` }}
          />
          {String(project.day).padStart(3, '0')}
        </span>

        <span className="min-w-0">
          <span className="u-display block truncate text-lg text-ink-2 transition-colors group-hover:text-ink md:text-2xl">
            {project.title}
          </span>
          <span className="u-mono mt-1 block truncate text-ink-4 md:hidden">
            {CATEGORY_META[project.categories[0]].label}
          </span>
        </span>

        <span className="hidden truncate text-xs text-ink-3 md:block">{project.description}</span>

        <span className="hidden items-center gap-3 md:flex">
          <span className="u-mono text-ink-4">
            {project.categories.map((c) => CATEGORY_META[c].short).join(' ')}
          </span>
          <span className="relative h-11 w-16 shrink-0 overflow-hidden border border-hairline">
            <Thumb day={project.day} family={family} />
          </span>
          <span
            aria-hidden
            className="u-mono w-6 text-right text-ink-4 opacity-0 transition-opacity group-hover:opacity-100"
          >
            ↗
          </span>
        </span>
      </button>
    </li>
  );
}

export function EmptyState() {
  const { resetFilters } = useArchive();
  return (
    <div className="flex flex-col items-start gap-5 border border-dashed border-hairline px-6 py-16">
      <span className="u-display text-2xl text-ink md:text-4xl">NOTHING HERE.</span>
      <p className="max-w-sm text-sm text-ink-3">
        {TOTAL_DAYS} builds in the archive and still not the one you wanted. Widen the range or
        clear the filter.
      </p>
      <button
        onClick={resetFilters}
        data-cursor="link"
        className={cn(
          'u-mono border border-hairline px-4 py-2 text-ink-2',
          'transition-colors hover:border-hairline-strong hover:text-ink',
        )}
      >
        CLEAR FILTERS
      </button>
    </div>
  );
}
