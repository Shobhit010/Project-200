'use client';

import { STATS } from '@/data/derived';
import { TOTAL_DAYS } from '@/data/projects';
import { useCountUp } from '@/hooks/useCountUp';
import { useIntersect } from '@/hooks/useIntersect';
import { Mono, Rule } from '@/components/ui/primitives';

function Stat({ value, label, active }: { value: number | '∞'; label: string; active: boolean }) {
  const numeric = typeof value === 'number' ? value : 0;
  const counted = useCountUp(numeric, active);
  return (
    <div className="flex flex-col gap-3 border-t border-hairline pt-5">
      <span className="u-huge u-tnum text-[13vw] leading-[0.8] text-ink md:text-[5.4vw]">
        {value === '∞' ? '∞' : counted}
      </span>
      <Mono>{label}</Mono>
    </div>
  );
}

export function Stats() {
  const { ref, inView } = useIntersect<HTMLElement>({ threshold: 0.3 });

  return (
    <section
      ref={ref}
      className="relative mx-auto w-full max-w-[92rem] px-5 py-20 md:px-10 md:py-28"
      aria-label="Challenge statistics"
    >
      <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4 md:gap-x-10">
        <Stat value={STATS.totalBuilds} label="PROJECTS" active={inView} />
        <Stat value={TOTAL_DAYS} label="DAYS" active={inView} />
        <Stat value="∞" label="IDEAS" active={inView} />
        <Stat value={1} label="CHALLENGE" active={inView} />
      </div>

      <Rule className="mt-16" />

      <dl className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="flex items-baseline gap-3">
          <Mono as="dt" className="text-ink-4">
            STARTED
          </Mono>
          <Mono as="dd" className="text-ink-2">
            DAY 1
          </Mono>
        </div>
        <div className="flex items-baseline gap-3">
          <Mono as="dt" className="text-ink-4">
            COMPLETED
          </Mono>
          <Mono as="dd" className="text-ink-2">
            DAY 200
          </Mono>
        </div>
        <div className="flex items-baseline gap-3">
          <Mono as="dt" className="text-ink-4">
            STATUS
          </Mono>
          <Mono as="dd" className="text-ink">
            CHALLENGE COMPLETE
          </Mono>
        </div>
      </dl>
    </section>
  );
}
