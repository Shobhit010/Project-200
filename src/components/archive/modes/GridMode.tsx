'use client';

import { ACCENTS, CATEGORY_META } from '@/data/categories';
import { accentOfDay } from '@/data/derived';
import type { Project } from '@/data/projects';
import { useArchive } from '@/state/archive';
import { Mono } from '@/components/ui/primitives';
import { Thumb } from '../Thumb';
import { EmptyState } from './TimelineMode';

/** The efficient view. Dense, scannable, fully keyboard navigable. */
export function GridMode() {
  const { visible, open, setHere, query, setQuery } = useArchive();

  return (
    <div className="mx-auto w-full max-w-[92rem] px-5 pb-24 md:px-10">
      <div className="mb-6 flex items-center gap-3 border-b border-hairline pb-3">
        <Mono className="text-ink-4">FILTER</Mono>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type to narrow the grid…"
          aria-label="Filter the grid by name, day or category"
          className="u-mono w-full bg-transparent py-2 text-ink placeholder:text-ink-4"
        />
        {query ? (
          <button onClick={() => setQuery('')} className="u-mono text-ink-4 hover:text-ink">
            CLEAR
          </button>
        ) : null}
      </div>

      {visible.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="grid grid-cols-1 gap-px bg-hairline sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((p) => (
            <GridCard key={p.day} project={p} onOpen={open} onHover={setHere} />
          ))}
        </ul>
      )}
    </div>
  );
}

function GridCard({
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
    <li className="bg-void">
      <button
        onClick={() => onOpen(project.day)}
        onMouseEnter={() => onHover(project.day)}
        onFocus={() => onHover(project.day)}
        data-cursor="view"
        className="group flex h-full w-full flex-col p-4 text-left transition-colors hover:bg-white/[0.025]"
      >
        <div className="relative mb-4 aspect-[16/10] w-full overflow-hidden border border-hairline">
          <Thumb day={project.day} family={family} />
          <span
            className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
            style={{ background: accent.hex }}
          />
        </div>

        <div className="flex items-baseline justify-between gap-3">
          <Mono className="u-tnum text-ink-4">
            {String(project.day).padStart(3, '0')}
            <span className="text-ink-4"> / 200</span>
          </Mono>
          <span className="u-mono text-[0.55rem]" style={{ color: accent.hex }}>
            {CATEGORY_META[project.categories[0]].label.toUpperCase()}
          </span>
        </div>

        <h3 className="u-display mt-2 text-xl text-ink-2 transition-colors group-hover:text-ink">
          {project.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-ink-3">
          {project.description}
        </p>
      </button>
    </li>
  );
}
