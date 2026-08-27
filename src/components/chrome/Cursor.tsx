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
      document.body.dataset.cursor = 'off';
      return;
    }
    document.body.dataset.cursor = 'on';
    return () => {
      document.body.dataset.cursor = 'off';
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
      const next = (el?.dataset.cursor as CursorState | undefined) ?? 'default';
      setState((prev) => (prev === next ? prev : next));
      setLabel(el?.dataset.cursorLabel ?? LABELS[next] ?? '');
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
      <div
        ref={dotRef}
        className="fixed left-0 top-0 h-1 w-1 rounded-full bg-ink transition-opacity duration-200"
        style={{ opacity: visible && !expanded ? 1 : 0 }}
      />
      <div
        ref={ringRef}
        className="fixed left-0 top-0 flex items-center justify-center rounded-full border border-hairline-strong u-glass transition-[width,height,opacity,background-color] duration-300"
        style={{
          width: expanded ? (text ? 74 : 44) : 28,
          height: expanded ? (text ? 74 : 44) : 28,
          opacity: visible ? 1 : 0,
        }}
      >
        {text ? (
          <span className="u-mono text-[0.52rem] text-ink whitespace-nowrap">{text}</span>
        ) : null}
      </div>
    </div>
  );
}
