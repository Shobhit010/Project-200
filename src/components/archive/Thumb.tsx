'use client';

import { useEffect, useRef, useState } from 'react';
import type { AccentFamily } from '@/data/categories';
import { paintThumb } from '@/lib/thumb';
import { cn } from '@/lib/cn';

interface Props {
  day: number;
  family: AccentFamily;
  className?: string;
  /** Skip the IntersectionObserver when the thumb is already on screen. */
  eager?: boolean;
}

/**
 * A procedurally generated preview. Nothing is fetched, so there is no broken
 * image state and no layout shift — the canvas occupies its box immediately and
 * paints once it is near the viewport.
 */
export function Thumb({ day, family, className, eager = false }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [painted, setPainted] = useState(false);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    let cancelled = false;

    const paint = () => {
      if (cancelled) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(Math.round(rect.width), 1);
      const h = Math.max(Math.round(rect.height), 1);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.scale(dpr, dpr);
      paintThumb(ctx, w, h, { day, family });
      setPainted(true);
    };

    if (eager || typeof IntersectionObserver === 'undefined') {
      paint();
      return () => {
        cancelled = true;
      };
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        // Painting is cheap, but never at the cost of an interaction.
        if (typeof requestIdleCallback === 'function') {
          requestIdleCallback(paint, { timeout: 400 });
        } else {
          setTimeout(paint, 0);
        }
      },
      { rootMargin: '300px' },
    );
    io.observe(canvas);

    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, [day, family, eager]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={cn(
        'block h-full w-full bg-[#0a0c11] transition-opacity duration-500',
        painted ? 'opacity-100' : 'opacity-0',
        className,
      )}
    />
  );
}
