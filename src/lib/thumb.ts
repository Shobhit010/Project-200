import { ACCENTS, type AccentFamily } from '@/data/categories';
import { mulberry32 } from '@/data/derived';

/**
 * Procedural thumbnails.
 *
 * The archive holds 200 external sites. Screenshotting them would mean 200
 * network requests and 200 chances to render a broken image, so every preview
 * is generated locally instead — a deterministic composition seeded on the day
 * number, so a given project always looks identical.
 *
 * One of seven geometry programs is chosen by the project's accent family.
 */

export type ThumbProgram =
  | 'planes'
  | 'waveform'
  | 'burst'
  | 'web'
  | 'columns'
  | 'orbit'
  | 'slab';

const PROGRAM_BY_FAMILY: Record<AccentFamily, ThumbProgram> = {
  product: 'planes',
  creative: 'waveform',
  game: 'burst',
  system: 'web',
  utility: 'columns',
  experiment: 'orbit',
  realworld: 'slab',
};

export function programFor(family: AccentFamily): ThumbProgram {
  return PROGRAM_BY_FAMILY[family];
}

interface PaintOptions {
  day: number;
  family: AccentFamily;
  /** 0..1 — how energetically the composition is drawn. */
  intensity?: number;
}

export function paintThumb(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  { day, family, intensity = 1 }: PaintOptions,
): void {
  const rand = mulberry32(day * 9176 + 13);
  const accent = ACCENTS[family];
  const [r, g, b] = accent.rgb.split(' ').map(Number);
  const rgba = (a: number) => `rgba(${r}, ${g}, ${b}, ${a})`;

  ctx.clearRect(0, 0, width, height);

  // Ground + one soft light, positioned from the seed.
  ctx.fillStyle = '#0a0c11';
  ctx.fillRect(0, 0, width, height);

  const lx = width * (0.2 + rand() * 0.6);
  const ly = height * (0.15 + rand() * 0.5);
  const light = ctx.createRadialGradient(lx, ly, 0, lx, ly, Math.max(width, height) * 0.85);
  light.addColorStop(0, rgba(0.16 * intensity));
  light.addColorStop(0.45, rgba(0.04 * intensity));
  light.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = light;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.translate(width / 2, height / 2);
  const s = Math.min(width, height);
  const program = PROGRAM_BY_FAMILY[family];

  // Seeded rotation and scale, so two neighbouring builds in the same family
  // never read as the same picture. The type slab stays level.
  if (program !== 'slab') {
    ctx.rotate((rand() - 0.5) * 0.8);
    ctx.scale(0.82 + rand() * 0.4, 0.82 + rand() * 0.4);
  }

  switch (program) {
    case 'planes': {
      // Stacked translucent panels — the shape of a product interface.
      const n = 4 + Math.floor(rand() * 3);
      for (let i = 0; i < n; i++) {
        const t = i / (n - 1);
        const w = s * (0.72 - t * 0.22);
        const h = s * (0.13 + rand() * 0.05);
        const y = -s * 0.3 + t * s * 0.52;
        ctx.fillStyle = rgba(0.05 + t * 0.14);
        ctx.strokeStyle = rgba(0.24 + t * 0.3);
        ctx.lineWidth = 1;
        roundRect(ctx, -w / 2 + (rand() - 0.5) * s * 0.08, y, w, h, 3);
        ctx.fill();
        ctx.stroke();
      }
      break;
    }

    case 'waveform': {
      // Layered sine bands — creative code, motion, light.
      const layers = 5;
      for (let l = 0; l < layers; l++) {
        const amp = s * (0.05 + rand() * 0.11);
        const freq = 1.2 + rand() * 2.6;
        const phase = rand() * Math.PI * 2;
        const yOff = (l / (layers - 1) - 0.5) * s * 0.5;
        ctx.beginPath();
        for (let x = -s * 0.45; x <= s * 0.45; x += 3) {
          const y = yOff + Math.sin((x / s) * Math.PI * 2 * freq + phase) * amp;
          if (x === -s * 0.45) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = rgba(0.18 + (l / layers) * 0.5);
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
      break;
    }

    case 'burst': {
      // Radial rays with a hard core — arcade energy.
      const rays = 11 + Math.floor(rand() * 22);
      const sweep = rand() < 0.35 ? Math.PI * (0.6 + rand() * 0.8) : Math.PI * 2;
      const offset = rand() * Math.PI * 2;
      for (let i = 0; i < rays; i++) {
        const a = (i / rays) * sweep + offset + rand() * 0.05;
        const inner = s * (0.04 + rand() * 0.1);
        const outer = s * (0.16 + rand() * 0.34);
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * inner, Math.sin(a) * inner);
        ctx.lineTo(Math.cos(a) * outer, Math.sin(a) * outer);
        ctx.strokeStyle = rgba(0.15 + rand() * 0.55);
        ctx.lineWidth = 1 + rand() * 1.6;
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(0, 0, s * (0.03 + rand() * 0.05), 0, Math.PI * 2);
      ctx.fillStyle = rgba(0.9);
      ctx.fill();
      break;
    }

    case 'web': {
      // A small node graph — architecture, topology, dataflow.
      const count = 7 + Math.floor(rand() * 5);
      const pts: [number, number][] = [];
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2 + rand() * 0.4;
        const rr = s * (0.12 + rand() * 0.26);
        pts.push([Math.cos(a) * rr, Math.sin(a) * rr * 0.9]);
      }
      ctx.lineWidth = 1;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const d = Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]);
          if (d > s * 0.33) continue;
          ctx.beginPath();
          ctx.moveTo(pts[i][0], pts[i][1]);
          ctx.lineTo(pts[j][0], pts[j][1]);
          ctx.strokeStyle = rgba(0.1 + (1 - d / (s * 0.33)) * 0.3);
          ctx.stroke();
        }
      }
      for (const [x, y] of pts) {
        ctx.beginPath();
        ctx.arc(x, y, 1.6 + rand() * 2.4, 0, Math.PI * 2);
        ctx.fillStyle = rgba(0.55 + rand() * 0.45);
        ctx.fill();
      }
      break;
    }

    case 'columns': {
      // A measured bar field — tools, money, tracking.
      const n = 12 + Math.floor(rand() * 8);
      const gap = (s * 0.76) / n;
      for (let i = 0; i < n; i++) {
        const h = s * (0.06 + Math.pow(rand(), 1.6) * 0.42);
        const x = -s * 0.38 + i * gap;
        ctx.fillStyle = rgba(0.16 + (h / (s * 0.48)) * 0.5);
        ctx.fillRect(x, s * 0.24 - h, Math.max(gap * 0.55, 1.5), h);
      }
      ctx.strokeStyle = rgba(0.22);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-s * 0.4, s * 0.24);
      ctx.lineTo(s * 0.4, s * 0.24);
      ctx.stroke();
      break;
    }

    case 'orbit': {
      // Nested ellipses with travellers — experiments, systems that live.
      const rings = 3 + Math.floor(rand() * 3);
      for (let i = 0; i < rings; i++) {
        const rr = s * (0.1 + (i / rings) * 0.32);
        const tilt = rand() * Math.PI;
        ctx.save();
        ctx.rotate(tilt);
        ctx.beginPath();
        ctx.ellipse(0, 0, rr, rr * (0.34 + rand() * 0.5), 0, 0, Math.PI * 2);
        ctx.strokeStyle = rgba(0.14 + (i / rings) * 0.34);
        ctx.lineWidth = 1;
        ctx.stroke();
        const a = rand() * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(Math.cos(a) * rr, Math.sin(a) * rr * 0.5, 2.4, 0, Math.PI * 2);
        ctx.fillStyle = rgba(0.95);
        ctx.fill();
        ctx.restore();
      }
      break;
    }

    case 'slab': {
      // Maximum restraint: a rule, a numeral, nothing else.
      ctx.strokeStyle = rgba(0.32);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-s * 0.36, s * 0.2);
      ctx.lineTo(s * 0.36, s * 0.2);
      ctx.stroke();
      ctx.fillStyle = rgba(0.9);
      ctx.font = `500 ${s * 0.3}px "Space Grotesk", system-ui, sans-serif`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText(String(day), -s * 0.36, s * 0.12);
      ctx.fillStyle = rgba(0.28);
      ctx.font = `500 ${s * 0.1}px "IBM Plex Mono", ui-monospace, monospace`;
      ctx.fillText('/200', -s * 0.36, s * 0.34);
      break;
    }
  }

  ctx.restore();

  // Vignette keeps every thumbnail sitting on the same ground.
  const vig = ctx.createRadialGradient(
    width / 2,
    height / 2,
    Math.min(width, height) * 0.2,
    width / 2,
    height / 2,
    Math.max(width, height) * 0.75,
  );
  vig.addColorStop(0, 'rgba(0,0,0,0)');
  vig.addColorStop(1, 'rgba(0,0,0,0.55)');
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, width, height);
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
