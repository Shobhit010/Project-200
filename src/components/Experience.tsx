'use client';

import { useEffect } from 'react';
import { useArchive } from '@/state/archive';
import { useKeySequence } from '@/hooks/useKeySequence';
import { Loader } from '@/components/boot/Loader';
import { HeroSequence } from '@/components/hero/HeroSequence';
import { Stats } from '@/components/hero/Stats';
import { ArchiveShell } from '@/components/archive/ArchiveShell';
import { Evolution } from '@/components/journey/Evolution';
import { OneToTwoHundred } from '@/components/journey/OneToTwoHundred';
import { Featured } from '@/components/features/Featured';
import { GameStudio } from '@/components/features/GameStudio';
import { ProductEra } from '@/components/features/ProductEra';
import { RealWorld } from '@/components/features/RealWorld';
import { Day200 } from '@/components/ending/Day200';
import { FinalCTA } from '@/components/ending/FinalCTA';
import { Rewind } from '@/components/ending/Rewind';
import { ProjectDetail } from '@/components/detail/ProjectDetail';
import { CommandPalette } from '@/components/search/CommandPalette';
import { RandomMachine } from '@/components/archive/RandomMachine';
import { Cursor } from '@/components/chrome/Cursor';
import { TopBar } from '@/components/chrome/TopBar';
import { MobileNav } from '@/components/chrome/MobileNav';
import { YouAreHere } from '@/components/chrome/YouAreHere';
import { DevMode } from '@/components/chrome/DevMode';

/**
 * The whole archive, assembled.
 *
 * Deep-linked days (`/day/147`) skip the loader and the intro and open straight
 * into the detail takeover, with the full page mounted behind it.
 */
export function Experience({ initialDay = null }: { initialDay?: number | null }) {
  const { open, setRandomOpen, fireBurst, setPhase, phase } = useArchive();

  /* Secret sequences. Ignored while a field has focus. */
  useKeySequence({
    '200': () => fireBurst(),
    day1: () => open(1),
    day200: () => open(200),
    rand: () => setRandomOpen(true),
  });

  /* A deep link means the archive is already live. */
  useEffect(() => {
    if (initialDay && phase !== 'ready') setPhase('ready');
  }, [initialDay, phase, setPhase]);

  return (
    <>
      <a className="skip-link" href="#archive">
        SKIP TO THE ARCHIVE
      </a>

      <Loader />
      <Cursor />
      <TopBar />
      <div className="u-noise" aria-hidden />

      <main id="main">
        <HeroSequence />
        <Stats />
        <ArchiveShell />
        <Evolution />
        <OneToTwoHundred />
        <Featured />
        <GameStudio />
        <ProductEra />
        <RealWorld />
        <Day200 />
      </main>

      <FinalCTA />

      <YouAreHere />
      <MobileNav />
      <DevMode />

      <ProjectDetail />
      <CommandPalette />
      <RandomMachine />
      <Rewind />
    </>
  );
}
