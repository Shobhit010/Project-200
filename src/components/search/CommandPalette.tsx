'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ACCENTS, CATEGORY_META } from '@/data/categories';
import { accentOfDay } from '@/data/derived';
import { PROJECTS } from '@/data/projects';
import { search, SEARCH_HINTS } from '@/lib/search';
import { useArchive } from '@/state/archive';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { Mono } from '@/components/ui/primitives';

/** Instant search over 200 pre-lowered records. No worker, no index build. */
export function CommandPalette() {
  const { paletteOpen, togglePalette, open } = useArchive();
  const reduced = useReducedMotionSafe();
  const [raw, setRaw] = useState('');
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  /* Global shortcut. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        togglePalette();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [togglePalette]);

  /* Debounce just enough to avoid re-rendering on every keystroke burst. */
  useEffect(() => {
    const id = window.setTimeout(() => setQuery(raw), 60);
    return () => clearTimeout(id);
  }, [raw]);

  useEffect(() => {
    if (paletteOpen) {
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      setRaw('');
      setQuery('');
      setActive(0);
    }
  }, [paletteOpen]);

  const results = useMemo(() => {
    if (!query.trim()) {
      return PROJECTS.filter((p) => p.featured)
        .slice(0, 8)
        .map((p) => ({ project: p, score: 0, reason: 'Featured' }));
    }
    return search(query);
  }, [query]);

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    const el = listRef.current?.children[active] as HTMLElement | undefined;
    el?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      togglePalette(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const hit = results[active];
      if (hit) open(hit.project.day);
    }
  };

  return (
    <AnimatePresence>
      {paletteOpen ? (
        <motion.div
          className="fixed inset-0 z-[130] flex items-start justify-center px-4 pt-[12vh]"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduced ? undefined : { opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <button
            className="absolute inset-0 bg-void/85 backdrop-blur-sm"
            aria-label="Close search"
            onClick={() => togglePalette(false)}
            tabIndex={-1}
          />

          <motion.div
            initial={reduced ? false : { y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduced ? undefined : { y: -8, opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl border border-hairline-strong bg-surface shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)]"
            role="dialog"
            aria-modal="true"
            aria-label="Search the archive"
          >
            <div className="flex items-center gap-3 border-b border-hairline px-5 py-4">
              <Mono className="text-ink-4">SEARCH THE ARCHIVE</Mono>
            </div>

            <div className="px-5 py-4">
              <input
                ref={inputRef}
                type="text"
                role="combobox"
                aria-expanded="true"
                aria-controls="palette-results"
                aria-activedescendant={results[active] ? `result-${results[active].project.day}` : undefined}
                aria-autocomplete="list"
                aria-label="Search projects by name, day, category or technology"
                value={raw}
                onChange={(e) => setRaw(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Try “games”, “day 150”, “three.js”, “system design”…"
                className="u-display w-full bg-transparent text-2xl text-ink placeholder:text-ink-4"
              />
            </div>

            <p className="sr-only" role="status" aria-live="polite">
              {results.length} results
            </p>

            <ul
              id="palette-results"
              ref={listRef}
              role="listbox"
              aria-label="Search results"
              className="max-h-[46vh] overflow-y-auto border-t border-hairline"
            >
              {results.length === 0 ? (
                <li className="px-5 py-8">
                  <span className="u-display text-xl text-ink">NO MATCH.</span>
                  <p className="mt-2 text-xs text-ink-3">
                    Nothing in 200 days answers to “{query}”. Try a day number, a category, or a
                    single word.
                  </p>
                </li>
              ) : (
                results.map((r, i) => {
                  const accent = ACCENTS[accentOfDay(r.project.day)];
                  return (
                    <li
                      key={r.project.day}
                      id={`result-${r.project.day}`}
                      role="option"
                      aria-selected={i === active}
                    >
                      <button
                        onMouseEnter={() => setActive(i)}
                        onClick={() => open(r.project.day)}
                        data-cursor="view"
                        className={`flex w-full items-center gap-4 px-5 py-3 text-left transition-colors ${
                          i === active ? 'bg-white/[0.06]' : 'hover:bg-white/[0.03]'
                        }`}
                      >
                        <span
                          className="h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ background: accent.hex }}
                        />
                        <span className="u-mono u-tnum w-14 shrink-0 text-ink-4">
                          {String(r.project.day).padStart(3, '0')}
                        </span>
                        <span className="u-display flex-1 truncate text-lg text-ink">
                          {r.project.title}
                        </span>
                        <span className="u-mono hidden shrink-0 text-ink-4 sm:block">
                          {CATEGORY_META[r.project.categories[0]].label.toUpperCase()}
                        </span>
                      </button>
                    </li>
                  );
                })
              )}
            </ul>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-hairline px-5 py-3">
              {!query
                ? SEARCH_HINTS.map((h) => (
                    <button
                      key={h}
                      onClick={() => setRaw(h)}
                      className="u-mono text-ink-4 transition-colors hover:text-ink"
                    >
                      {h}
                    </button>
                  ))
                : null}
              <span className="u-mono ml-auto text-ink-4">↑↓ MOVE · ↵ OPEN · ESC CLOSE</span>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
