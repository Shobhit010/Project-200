'use client';

import { useEffect } from 'react';
import { PROJECTS } from '@/data/projects';
import { useArchive } from '@/state/archive';
import { useMediaQuery } from '@/hooks/useReducedMotionSafe';
import { Mono, SectionMarker } from '@/components/ui/primitives';
import { Toolbar } from './Toolbar';
import { TimelineMode } from './modes/TimelineMode';
import { GridMode } from './modes/GridMode';
import { EraMode } from './modes/EraMode';
import { ConstellationMode } from './modes/ConstellationMode';

export function ArchiveShell() {
  const { mode, setMode, visible, filter, range } = useArchive();
  const narrow = useMediaQuery('(max-width: 767px)');

  /* The constellation needs room to be legible; phones get the timeline. */
  useEffect(() => {
    if (narrow && mode === 'constellation') setMode('timeline');
  }, [narrow, mode, setMode]);

  return (
    <section id="archive" aria-label="The archive" className="relative scroll-mt-0">
      <div className="mx-auto w-full max-w-[92rem] px-5 pb-8 pt-16 md:px-10 md:pt-24">
        <SectionMarker index="01" label="THE ARCHIVE" />
        <h2 className="u-huge mt-8 text-[13vw] leading-[0.82] text-ink md:text-[6vw]">
          THE BUILD
          <br />
          UNIVERSE
        </h2>
        <p className="mt-6 max-w-lg text-sm leading-relaxed text-ink-2">
          Two hundred builds, arranged four different ways. Follow them in order, see them as a
          map, scan them as a grid, or read them as ten chapters.
        </p>
      </div>

      <Toolbar />

      {/* Announce filter results without stealing focus. */}
      <p className="sr-only" role="status" aria-live="polite">
        {visible.length} builds shown. View: {mode}. Filter: {filter}. Days {range[0]} to{' '}
        {range[1]}.
      </p>

      <div className="pt-8">
        {mode === 'timeline' ? <TimelineMode /> : null}
        {mode === 'grid' ? <GridMode /> : null}
        {mode === 'era' ? <EraMode /> : null}
        {mode === 'constellation' ? <ConstellationMode /> : null}
      </div>

      {/*
        A text equivalent of the entire archive. Screen readers get every build
        and every destination regardless of the active view, and crawlers can
        follow all 200 links from a single page.
      */}
      <nav aria-label="All 200 builds" className="sr-only">
        <h3>Complete index</h3>
        <ul>
          {PROJECTS.map((p) => (
            <li key={p.day}>
              {p.url ? (
                <a href={p.url} target="_blank" rel="noopener noreferrer">
                  Day {p.day} of 200 — {p.title}. {p.description} Opens in a new tab.
                </a>
              ) : (
                <span>
                  Day {p.day} of 200 — {p.title}. {p.description}
                </span>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {narrow ? (
        <div className="mx-auto max-w-[92rem] px-5 pb-16">
          <Mono className="text-ink-4">
            CONSTELLATION VIEW IS AVAILABLE ON LARGER SCREENS
          </Mono>
        </div>
      ) : null}
    </section>
  );
}
