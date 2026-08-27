import Link from 'next/link';
import { TOTAL_DAYS } from '@/data/projects';

export default function NotFound() {
  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center gap-8 px-6 text-center">
      <p className="u-mono text-ink-4">DAY NOT FOUND</p>
      <h1 className="u-huge text-[26vw] leading-[0.8] text-ink md:text-[12vw]">404</h1>
      <p className="max-w-sm text-sm leading-relaxed text-ink-2">
        The archive runs from day 1 to day {TOTAL_DAYS}. Whatever you were looking for is not one
        of them.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="u-mono bg-ink px-5 py-3 text-void transition-colors hover:bg-white"
        >
          BACK TO THE ARCHIVE
        </Link>
        <Link
          href="/day/1"
          className="u-mono border border-hairline px-5 py-3 text-ink-2 transition-colors hover:border-hairline-strong hover:text-ink"
        >
          START AT DAY 1
        </Link>
      </div>
    </main>
  );
}
