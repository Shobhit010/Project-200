'use client';

import { useEffect, useRef, useState } from 'react';
import { useIsTouch, useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';

type CursorState = 'default' | 'link' | 'external' | 'view' | 'explore' | 'label';

const LABELS: Record<CursorState, string> = {
  default: '',
  link: '',
  external: 'OPEN ↗',
  view: 'VIEW',
  explore: 'EXPLORE',
  label: '',
};

/**
 * One fixed element, transform-driven, rAF-smoothed.
 * Disabled entirely for touch, reduced motion, and while typing.
 */
export function Cursor() {
  const reduced = useReducedMotionSafe();
  const touch = useIsTouch();
  const enabled = !reduced && !touch;

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<CursorState>('default');
  const [label, setLabel] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled) {
      document.body.dataset.cursorMode = 'off';
      return;
    }
    document.body.dataset.cursorMode = 'on';
    return () => {
      document.body.dataset.cursorMode = 'off';
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    let raf = 0;
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { x: target.x, y: target.y };

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!visible) setVisible(true);

      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-cursor]');
      const raw = el?.dataset.cursor;
      // Only known states expand the ring; anything else falls back to the dot.
      const next: CursorState = raw && raw in LABELS ? (raw as CursorState) : 'default';
      setState((prev) => (prev === next ? prev : next));
      setLabel(next === 'default' ? '' : (el?.dataset.cursorLabel ?? LABELS[next]));
    };

    const onLeave = () => setVisible(false);

    const tick = () => {
      ring.x += (target.x - ring.x) * 0.18;
      ring.y += (target.y - ring.y) * 0.18;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, [enabled, visible]);

  if (!enabled) return null;

  const expanded = state !== 'default';
  const text = label || LABELS[state];

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[120]">
      {/*
        One point, nothing around it. It swells slightly over anything
        interactive and carries its bloom with it.
      */}
      <div
        ref={dotRef}
        className="fixed left-0 top-0 h-0 w-0 transition-opacity duration-200"
        style={{ opacity: visible ? 1 : 0 }}
      >
        {/*
          The bloom blends normally, so it reads as light on the void. The core
          on top of it uses difference blending, which keeps the point visible
          even on the archive's few solid white surfaces.
        */}
        <span
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-[width,height] duration-300"
          style={{
            width: expanded ? 44 : 30,
            height: expanded ? 44 : 30,
            background: `radial-gradient(circle, rgb(255 255 255 / ${
              expanded ? 0.5 : 0.38
            }), transparent 68%)`,
          }}
        />
        <span
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-white transition-[width,height] duration-300"
          style={{
            width: expanded ? 13 : 7,
            height: expanded ? 13 : 7,
            mixBlendMode: 'difference',
          }}
        />
      </div>

      {/* The label trails the point rather than boxing it in. */}
      <div
        ref={ringRef}
        className="fixed left-0 top-0 transition-opacity duration-300"
        style={{ opacity: visible && text ? 1 : 0 }}
      >
        {text ? (
          <span
            className="u-mono absolute left-4 top-2 whitespace-nowrap text-[0.5rem] text-white"
            style={{ textShadow: '0 0 5px rgb(0 0 0 / 0.95), 0 1px 3px rgb(0 0 0 / 0.9)' }}
          >
            {text}
          </span>
        ) : null}
      </div>
    </div>
  );
}
