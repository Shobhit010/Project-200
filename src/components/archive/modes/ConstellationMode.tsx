'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ACCENTS, CATEGORY_META } from '@/data/categories';
import { EDGES, NODE_BY_DAY, NODES, accentOfDay } from '@/data/derived';
import { BY_DAY } from '@/data/derived';
import { useArchive } from '@/state/archive';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { Mono } from '@/components/ui/primitives';

interface View {
  scale: number;
  x: number;
  y: number;
}

/**
 * 200 nodes on a deterministic, category-clustered layout, drawn to Canvas 2D.
 *
 * The layout is computed once at module load in `derived.ts`, so there is no
 * live force simulation to run — panning and zooming stay cheap, and the map
 * looks identical every visit.
 */
export function ConstellationMode() {
  const { visible, open, setHere, hereDay } = useArchive();
  const reduced = useReducedMotionSafe();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [selected, setSelected] = useState<number>(hereDay);

  const visibleDays = useMemo(() => new Set(visible.map((p) => p.day)), [visible]);
  const visibleRef = useRef(visibleDays);
  visibleRef.current = visibleDays;
  const hoverRef = useRef<number | null>(null);
  hoverRef.current = hover;
  const selectedRef = useRef(selected);
  selectedRef.current = selected;

  const viewRef = useRef<View>({ scale: 1, x: 0, y: 0 });
  const pointerRef = useRef({ down: false, moved: false, lastX: 0, lastY: 0 });

  /** Layout space (-1..1) → screen pixels. */
  const project = useCallback((nx: number, ny: number, w: number, h: number) => {
    const v = viewRef.current;
    const base = Math.min(w, h) * 0.42;
    return [w / 2 + (nx * base + v.x) * v.scale, h / 2 + (ny * base + v.y) * v.scale] as const;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    let hidden = document.hidden;
    let onScreen = true;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      w = Math.max(rect.width, 1);
      h = Math.max(rect.height, 1);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (time: number) => {
      raf = requestAnimationFrame(draw);
      if (hidden || !onScreen) return;

      ctx.clearRect(0, 0, w, h);
      const t = reduced ? 0 : time / 1000;
      const vis = visibleRef.current;
      const hoverDay = hoverRef.current;
      const sel = selectedRef.current;

      // Edges
      ctx.lineWidth = 1;
      for (const edge of EDGES) {
        const a = NODE_BY_DAY.get(edge.a);
        const b = NODE_BY_DAY.get(edge.b);
        if (!a || !b) continue;
        const lit = vis.has(edge.a) && vis.has(edge.b);
        const touched = hoverDay === edge.a || hoverDay === edge.b;
        const [ax, ay] = project(a.x, a.y, w, h);
        const [bx, by] = project(b.x, b.y, w, h);
        const c = ACCENTS[edge.accent];
        ctx.strokeStyle = `${c.hex}${touched ? '99' : lit ? '22' : '0d'}`;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.stroke();
      }

      // Nodes
      for (const node of NODES) {
        const [x, y] = project(node.x, node.y, w, h);
        if (x < -40 || y < -40 || x > w + 40 || y > h + 40) continue;
        const lit = vis.has(node.day);
        const isHover = hoverDay === node.day;
        const isSel = sel === node.day;
        const c = ACCENTS[node.accent];
        const pulse = reduced ? 1 : 1 + Math.sin(t * 1.2 + node.day) * 0.12;
        const r = (1.6 + node.z * 2 + (node.day % 50 === 0 ? 2 : 0)) * pulse;

        if (lit) {
          ctx.beginPath();
          ctx.arc(x, y, r * (isHover ? 5 : 3.4), 0, Math.PI * 2);
          ctx.fillStyle = `${c.hex}${isHover ? '33' : '14'}`;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(x, y, isHover ? r * 1.9 : r, 0, Math.PI * 2);
        ctx.fillStyle = lit ? c.hex : '#22262d';
        ctx.globalAlpha = lit ? 1 : 0.5;
        ctx.fill();
        ctx.globalAlpha = 1;

        if (isSel) {
          ctx.beginPath();
          ctx.arc(x, y, r * 3.6, 0, Math.PI * 2);
          ctx.strokeStyle = '#F2F3F5';
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.lineWidth = 1;
        }
      }
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const io = new IntersectionObserver(([e]) => (onScreen = e.isIntersecting), {
      threshold: 0.01,
    });
    io.observe(wrap);

    const onVisibility = () => (hidden = document.hidden);
    document.addEventListener('visibilitychange', onVisibility);

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [project, reduced]);

  /* ── Hit testing and interaction ── */

  const hitTest = useCallback(
    (clientX: number, clientY: number): number | null => {
      const wrap = wrapRef.current;
      if (!wrap) return null;
      const rect = wrap.getBoundingClientRect();
      const px = clientX - rect.left;
      const py = clientY - rect.top;
      let best: number | null = null;
      let bestDist = 22;
      for (const node of NODES) {
        const [x, y] = project(node.x, node.y, rect.width, rect.height);
        const d = Math.hypot(x - px, y - py);
        if (d < bestDist) {
          bestDist = d;
          best = node.day;
        }
      }
      return best;
    },
    [project],
  );

  const onPointerMove = (e: React.PointerEvent) => {
    const p = pointerRef.current;
    if (p.down) {
      const dx = e.clientX - p.lastX;
      const dy = e.clientY - p.lastY;
      if (Math.abs(dx) + Math.abs(dy) > 2) p.moved = true;
      viewRef.current.x += dx / viewRef.current.scale;
      viewRef.current.y += dy / viewRef.current.scale;
      p.lastX = e.clientX;
      p.lastY = e.clientY;
      return;
    }
    const day = hitTest(e.clientX, e.clientY);
    setHover(day);
    if (day) setHere(day);
  };

  const onWheel = (e: React.WheelEvent) => {
    const next = viewRef.current.scale * (e.deltaY > 0 ? 0.92 : 1.08);
    viewRef.current.scale = Math.min(Math.max(next, 0.6), 5);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const days = visible.map((p) => p.day);
    if (days.length === 0) return;
    const idx = days.indexOf(selected);
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      setSelected(days[(idx + 1 + days.length) % days.length] ?? days[0]);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      setSelected(days[(idx - 1 + days.length) % days.length] ?? days[0]);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      open(selected);
    }
  };

  useEffect(() => {
    setHere(selected);
  }, [selected, setHere]);

  const hovered = hover ? BY_DAY.get(hover) : null;
  const selectedProject = BY_DAY.get(selected);

  return (
    <div className="mx-auto w-full max-w-[92rem] px-5 pb-24 md:px-10">
      <div
        ref={wrapRef}
        className="relative h-[62vh] min-h-[26rem] w-full overflow-hidden border border-hairline bg-[#07080c]"
      >
        <canvas
          ref={canvasRef}
          tabIndex={0}
          role="application"
          aria-label="Constellation of all 200 builds. Use arrow keys to move between builds and Enter to open one."
          data-cursor="explore"
          className="h-full w-full touch-none outline-none focus-visible:ring-1 focus-visible:ring-white"
          onPointerDown={(e) => {
            (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
            pointerRef.current = {
              down: true,
              moved: false,
              lastX: e.clientX,
              lastY: e.clientY,
            };
          }}
          onPointerUp={(e) => {
            const p = pointerRef.current;
            p.down = false;
            if (!p.moved) {
              const day = hitTest(e.clientX, e.clientY);
              if (day) {
                setSelected(day);
                open(day);
              }
            }
          }}
          onPointerLeave={() => {
            pointerRef.current.down = false;
            setHover(null);
          }}
          onPointerMove={onPointerMove}
          onWheel={onWheel}
          onKeyDown={onKeyDown}
        />

        {/* Hover readout */}
        {hovered ? (
          <div className="pointer-events-none absolute left-4 top-4 border border-hairline u-glass px-4 py-3">
            <Mono className="u-tnum text-ink-4">
              DAY {hovered.day} <span className="text-ink-4">/ 200</span>
            </Mono>
            <div className="u-display mt-1 text-xl text-ink">{hovered.title}</div>
            <Mono className="mt-1 block" style={{ color: ACCENTS[accentOfDay(hovered.day)].hex }}>
              {CATEGORY_META[hovered.categories[0]].label.toUpperCase()}
            </Mono>
          </div>
        ) : null}

        <div className="pointer-events-none absolute bottom-4 left-4 flex flex-wrap gap-x-4 gap-y-1">
          {(['product', 'creative', 'game', 'system', 'utility', 'experiment', 'realworld'] as const).map(
            (f) => (
              <span key={f} className="u-mono flex items-center gap-1.5 text-[0.52rem] text-ink-4">
                <span className="h-1 w-1 rounded-full" style={{ background: ACCENTS[f].hex }} />
                {ACCENTS[f].label}
              </span>
            ),
          )}
        </div>

        <Mono className="pointer-events-none absolute bottom-4 right-4 text-ink-4">
          DRAG TO PAN · SCROLL TO ZOOM
        </Mono>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <Mono className="text-ink-4">
          KEYBOARD: FOCUS THE MAP, THEN ← → TO STEP, ENTER TO OPEN
        </Mono>
        {selectedProject ? (
          <Mono className="text-ink-2">
            SELECTED · DAY {selectedProject.day} · {selectedProject.title.toUpperCase()}
          </Mono>
        ) : null}
      </div>
    </div>
  );
}
