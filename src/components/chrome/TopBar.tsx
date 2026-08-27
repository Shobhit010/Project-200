'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { useArchive } from '@/state/archive';

/**
 * Appears once the hero is behind you. The wordmark is also the way into
 * developer mode — seven clicks.
 */
export function TopBar() {
  const { togglePalette, setRandomOpen, toggleDev, devMode, openDay, rewinding } = useArchive();
  const [shown, setShown] = useState(false);
  const clicks = useRef(0);
  const resetTimer = useRef(0);

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.9);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const onLogoClick = () => {
    clicks.current += 1;
    window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => {
      clicks.current = 0;
    }, 1200);
    if (clicks.current >= 7) {
      clicks.current = 0;
      toggleDev();
    }
  };

  const hidden = !shown || openDay !== null || rewinding;

  return (
    <div
      className={cn(
        'fixed inset-x-0 top-0 z-[70] transition-all duration-500',
        hidden ? 'pointer-events-none -translate-y-full opacity-0' : 'opacity-100',
      )}
    >
      <div className="border-b border-hairline u-glass">
        {/* Fixed 3rem height: the archive toolbar sticks directly beneath it. */}
        <div className="mx-auto flex h-12 w-full max-w-[92rem] items-center justify-between gap-4 px-5 md:px-10">
          <button
            onClick={onLogoClick}
            data-cursor="link"
            aria-label="One website every day — back to top"
            className="u-mono flex items-center gap-2 text-ink transition-colors hover:text-white"
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-ink" aria-hidden />
            200 / ONE WEBSITE EVERY DAY
            {devMode ? <span className="text-ink-4">· DEV</span> : null}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setRandomOpen(true)}
              data-cursor="link"
              className="u-mono hidden px-3 py-1.5 text-ink-3 transition-colors hover:text-ink sm:block"
            >
              RANDOM
            </button>
            <button
              onClick={() => togglePalette(true)}
              data-cursor="link"
              className="u-mono border border-hairline px-3 py-1.5 text-ink-2 transition-colors hover:border-hairline-strong hover:text-ink"
            >
              SEARCH <kbd className="hidden text-ink-4 md:inline">⌘K</kbd>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
