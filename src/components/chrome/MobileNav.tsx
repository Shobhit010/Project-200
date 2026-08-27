'use client';

import { Home, LayoutList, Search, Shuffle, Sparkles } from 'lucide-react';
import { useArchive } from '@/state/archive';
import { cn } from '@/lib/cn';

/**
 * Phones get their own navigation rather than a shrunken desktop toolbar:
 * five destinations, thumb-height, always reachable.
 */
export function MobileNav() {
  const { togglePalette, setRandomOpen, setMode, openDay, paletteOpen, randomOpen, rewinding } =
    useArchive();

  const hidden = openDay !== null || paletteOpen || randomOpen || rewinding;

  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const items = [
    { label: 'HOME', icon: Home, action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
    {
      label: 'ARCHIVE',
      icon: LayoutList,
      action: () => {
        setMode('grid');
        go('archive');
      },
    },
    { label: 'SEARCH', icon: Search, action: () => togglePalette(true) },
    {
      label: 'TIMELINE',
      icon: Sparkles,
      action: () => {
        setMode('timeline');
        go('archive');
      },
    },
    { label: 'RANDOM', icon: Shuffle, action: () => setRandomOpen(true) },
  ];

  return (
    <nav
      aria-label="Primary"
      className={cn(
        'fixed inset-x-0 bottom-0 z-[70] border-t border-hairline u-glass transition-transform duration-300 md:hidden',
        hidden ? 'translate-y-full' : 'translate-y-0',
      )}
    >
      <ul className="grid grid-cols-5">
        {items.map(({ label, icon: Icon, action }) => (
          <li key={label}>
            <button
              onClick={action}
              className="flex w-full flex-col items-center gap-1.5 py-3 text-ink-3 transition-colors active:text-ink"
            >
              <Icon size={16} strokeWidth={1.5} aria-hidden />
              <span className="u-mono text-[0.5rem]">{label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
