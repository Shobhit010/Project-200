'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ACCENTS } from '@/data/categories';
import { NODES } from '@/data/derived';
import { cn } from '@/lib/cn';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { useArchive } from '@/state/archive';

/**
 * The centrepiece numeral.
 *
 * Each glyph lags the pointer by a different amount, so the number appears to
 * flex rather than slide. Clicking it detonates into 200 nodes — one per build —
 * which fall into the archive below.
 */
export function GiantTwoHundred() {
  const reduced = useReducedMotionSafe();
  const { burst, fireBurst } = useArchive();
  const hostRef = useRef<HTMLDivElement>(null);
  const glyphRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [exploding, setExploding] = useState(false);

  /* Pointer lag, transform only, one rAF loop. */
  useEffect(() => {
    if (reduced) return;
    const host = hostRef.current;
    if (!host) return;

    const target = { x: 0, y: 0 };
    const current = [
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 0 },
    ];
    const factors = [1, 0.55, 1.45];
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      target.x = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
      target.y = (e.clientY - (rect.top + rect.height / 2)) / Math.max(rect.height, 1);
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      for (let i = 0; i < 3; i++) {
        const ease = 0.06 + i * 0.02;
        current[i].x += (target.x * 22 * factors[i] - current[i].x) * ease;
        current[i].y += (target.y * 12 * factors[i] - current[i].y) * ease;
        const el = glyphRefs.current[i];
        if (el) {
          el.style.transform = `translate3d(${current[i].x.toFixed(2)}px, ${current[i].y.toFixed(2)}px, 0) skewX(${(-current[i].x * 0.08).toFixed(3)}deg)`;
        }
      }
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  /* The easter-egg burst (typing "200") detonates the same way. */
  useEffect(() => {
    if (burst > 0) detonate(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [burst]);

  function detonate(scroll = true) {
    if (reduced) {
      if (scroll) document.getElementById('archive')?.scrollIntoView({ behavior: 'auto' });
      return;
    }
    setExploding(true);
    window.setTimeout(() => setExploding(false), 1900);
    if (scroll) {
      window.setTimeout(() => {
        document.getElementById('archive')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 620);
    }
  }

  const shards = useMemo(
    () =>
      NODES.map((n, i) => ({
        day: n.day,
        left: 50 + n.x * 34,
        top: 50 + n.y * 26,
        delay: (i % 40) * 9,
        color: ACCENTS[n.accent].hex,
        drift: (n.z - 0.5) * 120,
      })),
    [],
  );

  return (
    <div ref={hostRef} className="relative select-none">
      <button
        type="button"
        onClick={() => {
          fireBurst();
          detonate(true);
        }}
        aria-label="Scatter the 200 builds and jump to the archive"
        data-cursor="label"
        data-cursor-label="EXPLODE"
        className="block w-full text-left"
      >
        <span
          className={cn(
            'u-huge flex items-baseline text-[34vw] leading-[0.78] text-ink transition-opacity duration-300 md:text-[22vw]',
            exploding && 'opacity-0',
          )}
        >
          {['2', '0', '0'].map((d, i) => (
            <span
              key={i}
              ref={(el) => {
                glyphRefs.current[i] = el;
              }}
              className="inline-block will-change-transform"
            >
              {d}
            </span>
          ))}
        </span>
      </button>

      <div className="mt-5 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-t border-hairline pt-4">
        <span className="u-display text-[7vw] leading-none text-ink-2 md:text-[2.8vw]">
          WEBSITES
        </span>
        <span className="u-mono text-ink-4">CLICK THE NUMBER TO SCATTER IT</span>
      </div>

      {/* 200 shards — one per build. */}
      {exploding ? (
        <div className="pointer-events-none absolute inset-0 z-20" aria-hidden>
          {shards.map((s) => (
            <span
              key={s.day}
              className="absolute h-1 w-1 rounded-full"
              style={{
                left: `${s.left}%`,
                top: `${s.top}%`,
                background: s.color,
                boxShadow: `0 0 8px ${s.color}`,
                animation: `shard 1.6s cubic-bezier(0.16,1,0.3,1) ${s.delay}ms both`,
                ['--drift' as string]: `${s.drift}px`,
              }}
            />
          ))}
          <style>{`
            @keyframes shard {
              0%   { opacity: 0; transform: translate3d(0,0,0) scale(0.4); }
              18%  { opacity: 1; transform: translate3d(0,0,0) scale(1.4); }
              100% { opacity: 0; transform: translate3d(var(--drift), 62vh, 0) scale(0.7); }
            }
          `}</style>
        </div>
      ) : null}
    </div>
  );
}
