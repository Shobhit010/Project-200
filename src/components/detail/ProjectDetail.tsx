'use client';

import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ACCENTS, CATEGORY_META } from '@/data/categories';
import { ERA_BY_ID } from '@/data/eras';
import { BY_DAY, accentOfDay, relatedOf } from '@/data/derived';
import { TOTAL_DAYS } from '@/data/projects';
import { useArchive } from '@/state/archive';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { Mono } from '@/components/ui/primitives';
import { Thumb } from '@/components/archive/Thumb';

export function ProjectDetail() {
  const { openDay, open, next, prev, setRewinding } = useArchive();
  const reduced = useReducedMotionSafe();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const project = openDay ? BY_DAY.get(openDay) : null;

  /* Keyboard: ← → step, Esc closes, Enter opens the live build. */
  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing =
        target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA');
      if (typing) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        open(null);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        next();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prev();
      } else if (e.key === 'Enter' && project.url && document.activeElement === panelRef.current) {
        e.preventDefault();
        window.open(project.url, '_blank', 'noopener,noreferrer');
      } else if (e.key === 'Tab') {
        // Focus trap
        const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [project, open, next, prev]);

  useEffect(() => {
    if (project) requestAnimationFrame(() => closeRef.current?.focus());
  }, [project?.day, project]);

  const family = project ? accentOfDay(project.day) : 'product';
  const accent = ACCENTS[family];
  const era = project ? ERA_BY_ID[project.era] : null;
  const related = project ? relatedOf(project.day) : [];
  const prevProject = project && project.day > 1 ? BY_DAY.get(project.day - 1) : null;
  const nextProject = project && project.day < TOTAL_DAYS ? BY_DAY.get(project.day + 1) : null;
  const duplicate = project?.duplicateOf ? BY_DAY.get(project.duplicateOf) : null;

  return (
    <AnimatePresence>
      {project ? (
        <motion.div
          key="detail"
          className="fixed inset-0 z-[100] overflow-y-auto bg-void"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduced ? undefined : { opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          role="dialog"
          aria-modal="true"
          aria-label={`Day ${project.day} of 200 — ${project.title}`}
          style={{ ['--accent' as string]: accent.hex, ['--accent-rgb' as string]: accent.rgb }}
        >
          <div
            ref={panelRef}
            tabIndex={-1}
            className="relative mx-auto min-h-full w-full max-w-[92rem] px-5 pb-16 pt-5 md:px-10 md:pt-8"
          >
            <div
              className="u-glow left-[10%] top-[6%] h-[26rem] w-[26rem]"
              style={{ ['--accent-rgb' as string]: accent.rgb }}
              aria-hidden
            />

            {/* Header */}
            <header className="relative flex items-start justify-between gap-4 border-b border-hairline pb-4">
              <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
                <Mono className="u-tnum text-ink-2">
                  DAY {project.day} <span className="text-ink-4">/ {TOTAL_DAYS}</span>
                </Mono>
                {era ? (
                  <Mono className="text-ink-4">
                    ERA {era.numeral} · {era.name}
                  </Mono>
                ) : null}
              </div>
              <button
                ref={closeRef}
                onClick={() => open(null)}
                data-cursor="link"
                className="u-mono shrink-0 border border-hairline px-3 py-2 text-ink-2 transition-colors hover:border-hairline-strong hover:text-ink"
              >
                CLOSE <span className="text-ink-4">ESC</span>
              </button>
            </header>

            {/* Title block */}
            <div className="relative grid gap-10 pt-10 lg:grid-cols-[1.35fr_1fr] lg:gap-16 lg:pt-16">
              <div>
                {project.day === 1 ? (
                  <motion.p
                    initial={reduced ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="u-mono mb-6 text-ink-2"
                  >
                    EVERYTHING STARTED HERE.
                  </motion.p>
                ) : null}
                {project.day === TOTAL_DAYS ? (
                  <p className="u-mono mb-6" style={{ color: accent.hex }}>
                    YOU MADE IT.
                  </p>
                ) : null}

                <motion.h2
                  initial={reduced ? false : { opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="u-huge text-[13vw] leading-[0.84] text-ink md:text-[6.4vw]"
                >
                  {project.title.toUpperCase()}
                </motion.h2>

                <p className="mt-8 max-w-xl text-base leading-relaxed text-ink-2">
                  {project.description}
                </p>

                {project.note ? (
                  <p className="mt-4 max-w-xl text-sm text-ink-3">{project.note}</p>
                ) : null}

                {duplicate ? (
                  <button
                    onClick={() => open(duplicate.day)}
                    data-cursor="view"
                    className="u-mono mt-4 border-b border-hairline pb-1 text-ink-2 hover:border-ink hover:text-ink"
                  >
                    SAME BUILD AS DAY {duplicate.day} →
                  </button>
                ) : null}

                <div className="mt-10 flex flex-wrap items-center gap-3">
                  {project.url ? (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      /* Already reads "OPEN PROJECT ↗" — the cursor does not
                         repeat the label on this solid surface. */
                      data-cursor="link"
                      className="u-mono inline-flex items-center gap-2 bg-ink px-6 py-4 text-void transition-colors hover:bg-white"
                    >
                      OPEN PROJECT <span aria-hidden>↗</span>
                    </a>
                  ) : (
                    <span className="u-mono inline-flex items-center gap-2 border border-hairline px-6 py-4 text-ink-3">
                      YOU ARE LOOKING AT IT
                    </span>
                  )}

                  {project.day === TOTAL_DAYS ? (
                    <button
                      onClick={() => {
                        open(null);
                        setRewinding(true);
                      }}
                      data-cursor="label"
                      data-cursor-label="REWIND"
                      className="u-mono border border-hairline px-6 py-4 text-ink-2 transition-colors hover:border-hairline-strong hover:text-ink"
                    >
                      START OVER ↺
                    </button>
                  ) : null}
                </div>

                {project.url ? (
                  <Mono className="mt-4 block break-all text-ink-4">{project.url}</Mono>
                ) : null}
              </div>

              {/* Metadata column */}
              <div className="lg:pt-4">
                <div className="relative aspect-[16/10] w-full overflow-hidden border border-hairline">
                  <Thumb day={project.day} family={family} eager />
                </div>

                <dl className="mt-8 divide-y divide-hairline border-y border-hairline">
                  <Meta label="CATEGORY">
                    <span className="flex flex-wrap gap-2">
                      {project.categories.map((c) => (
                        <span
                          key={c}
                          className="u-mono border border-hairline px-2 py-1 text-ink-2"
                        >
                          {CATEGORY_META[c].label.toUpperCase()}
                        </span>
                      ))}
                    </span>
                  </Meta>
                  <Meta label="STACK · INFERRED">
                    <span className="flex flex-wrap gap-2">
                      {project.technologies.map((t) => (
                        <span key={t} className="u-mono text-ink-2">
                          {t}
                        </span>
                      ))}
                    </span>
                  </Meta>
                  <Meta label="STATUS">
                    <span className="u-mono" style={{ color: accent.hex }}>
                      SHIPPED
                    </span>
                  </Meta>
                  <Meta label="POSITION">
                    <span className="u-mono u-tnum text-ink-2">
                      {project.day} OF {TOTAL_DAYS}
                    </span>
                  </Meta>
                </dl>

                <p className="mt-4 text-[0.7rem] leading-relaxed text-ink-4">
                  Stack is inferred from the build, not read from its source. Treat it as a
                  description of the archive, not a claim about the repository.
                </p>
              </div>
            </div>

            {/* Related */}
            {related.length > 0 ? (
              <section className="relative mt-16 border-t border-hairline pt-8">
                <Mono className="text-ink-4">RELATED BUILDS</Mono>
                <ul className="mt-5 grid grid-cols-2 gap-px bg-hairline lg:grid-cols-4">
                  {related.map((r) => (
                    <li key={r.day} className="bg-void">
                      <button
                        onClick={() => open(r.day)}
                        data-cursor="view"
                        className="group flex h-full w-full flex-col gap-4 p-4 text-left transition-colors hover:bg-white/[0.03]"
                      >
                        <Mono className="u-tnum text-ink-4">
                          {String(r.day).padStart(3, '0')}
                        </Mono>
                        <span className="u-display text-base text-ink-2 group-hover:text-ink">
                          {r.title}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {/* Prev / next rails */}
            <nav
              className="relative mt-12 grid grid-cols-2 gap-px border-t border-hairline bg-hairline"
              aria-label="Move through the archive"
            >
              <RailButton
                side="prev"
                project={prevProject}
                onClick={() => prev()}
                disabled={!prevProject}
              />
              <RailButton
                side="next"
                project={nextProject}
                onClick={() => next()}
                disabled={!nextProject}
              />
            </nav>

            <div className="relative mt-6 flex items-center justify-between">
              <button
                onClick={() => open(null)}
                data-cursor="link"
                className="u-mono text-ink-3 hover:text-ink"
              >
                ← BACK TO ARCHIVE
              </button>
              <Mono className="hidden text-ink-4 md:block">← → TO STEP · ESC TO CLOSE</Mono>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function Meta({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[8rem_1fr] items-start gap-4 py-4">
      <dt className="u-mono text-ink-4">{label}</dt>
      <dd className="text-sm">{children}</dd>
    </div>
  );
}

function RailButton({
  side,
  project,
  onClick,
  disabled,
}: {
  side: 'prev' | 'next';
  project: ReturnType<typeof BY_DAY.get> | null;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      data-cursor="view"
      className={`group flex flex-col gap-2 bg-void p-6 transition-colors hover:bg-white/[0.03] disabled:opacity-30 ${
        side === 'next' ? 'items-end text-right' : 'items-start text-left'
      }`}
    >
      <Mono className="text-ink-4">
        {side === 'prev' ? '← PREVIOUS BUILD' : 'NEXT BUILD →'}
      </Mono>
      <span className="u-display text-lg text-ink-2 group-hover:text-ink md:text-2xl">
        {project ? `DAY ${project.day} · ${project.title}` : '—'}
      </span>
    </button>
  );
}
