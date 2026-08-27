'use client';

import { useEffect, useRef } from 'react';
import { FILTER_GROUPS } from '@/data/categories';
import { TOTAL_DAYS } from '@/data/projects';
import { cn } from '@/lib/cn';
import { useArchive, type ArchiveMode } from '@/state/archive';
import { Mono } from '@/components/ui/primitives';

const MODES: { id: ArchiveMode; label: string }[] = [
  { id: 'timeline', label: 'TIMELINE' },
  { id: 'constellation', label: 'CONSTELLATION' },
  { id: 'grid', label: 'GRID' },
  { id: 'era', label: 'ERA' },
];

export function Toolbar() {
  const {
    mode,
    setMode,
    filter,
    setFilter,
    range,
    setRange,
    visible,
    togglePalette,
    setRandomOpen,
  } = useArchive();
  const ref = useRef<HTMLDivElement>(null);

  /*
   * Publish the toolbar's height so era headers can stick directly beneath it.
   * It is measured rather than hard-coded because the row wraps at some widths.
   */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const set = () =>
      document.documentElement.style.setProperty('--toolbar-h', `${el.offsetHeight}px`);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={ref} className="sticky top-12 z-40 border-y border-hairline u-glass">
      <div className="mx-auto w-full max-w-[92rem] px-5 md:px-10">
        {/* Modes */}
        <div className="flex items-center justify-between gap-4 border-b border-hairline py-3">
          <div
            className="no-scrollbar -mx-1 flex items-center gap-1 overflow-x-auto"
            role="tablist"
            aria-label="Archive view"
          >
            {MODES.map((m) => (
              <button
                key={m.id}
                role="tab"
                aria-selected={mode === m.id}
                onClick={() => setMode(m.id)}
                data-cursor="link"
                className={cn(
                  'u-mono shrink-0 whitespace-nowrap px-3 py-2 transition-colors',
                  mode === m.id ? 'text-ink' : 'text-ink-4 hover:text-ink-2',
                )}
              >
                {mode === m.id ? '▸ ' : ''}
                {m.label}
              </button>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={() => setRandomOpen(true)}
              data-cursor="label"
              data-cursor-label="ROLL"
              className="u-mono hidden border border-hairline px-3 py-2 text-ink-2 transition-colors hover:border-hairline-strong hover:text-ink sm:block"
            >
              SURPRISE ME
            </button>
            <button
              onClick={() => togglePalette(true)}
              data-cursor="link"
              className="u-mono flex items-center gap-2 border border-hairline px-3 py-2 text-ink-2 transition-colors hover:border-hairline-strong hover:text-ink"
              aria-keyshortcuts="Meta+K Control+K"
            >
              SEARCH
              <kbd className="hidden text-ink-4 md:inline">⌘K</kbd>
            </button>
          </div>
        </div>

        {/* Filters + range */}
        <div className="flex flex-col gap-3 py-3 lg:flex-row lg:items-center lg:justify-between">
          <div
            className="no-scrollbar -mx-1 flex min-w-0 flex-1 items-center gap-1 overflow-x-auto"
            role="group"
            aria-label="Filter by category"
          >
            {FILTER_GROUPS.map((g) => (
              <button
                key={g.id}
                onClick={() => setFilter(g.id)}
                aria-pressed={filter === g.id}
                data-cursor="link"
                className={cn(
                  'u-mono mx-0.5 shrink-0 whitespace-nowrap border px-3 py-1.5 transition-colors',
                  filter === g.id
                    ? 'border-hairline-strong bg-white/[0.07] text-ink'
                    : 'border-white/10 text-ink-4 hover:border-hairline-strong hover:text-ink-2',
                )}
              >
                {g.label}
              </button>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-4">
            <div className="flex items-center gap-3">
              <label className="sr-only" htmlFor="range-from">
                First day shown
              </label>
              <input
                id="range-from"
                type="range"
                min={1}
                max={TOTAL_DAYS}
                value={range[0]}
                onChange={(e) =>
                  setRange([Math.min(Number(e.target.value), range[1]), range[1]])
                }
                className="w-24 accent-white md:w-32"
              />
              <Mono className="u-tnum whitespace-nowrap text-ink-2">
                {range[0]} — {range[1]}
              </Mono>
              <label className="sr-only" htmlFor="range-to">
                Last day shown
              </label>
              <input
                id="range-to"
                type="range"
                min={1}
                max={TOTAL_DAYS}
                value={range[1]}
                onChange={(e) =>
                  setRange([range[0], Math.max(Number(e.target.value), range[0])])
                }
                className="w-24 accent-white md:w-32"
              />
            </div>
            <Mono className="u-tnum whitespace-nowrap text-ink-4">
              {visible.length} / {TOTAL_DAYS}
            </Mono>
          </div>
        </div>
      </div>
    </div>
  );
}
