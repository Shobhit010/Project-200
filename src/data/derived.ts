import { accentOf, CATEGORY_META, type AccentFamily, type Category } from './categories';
import { ERAS, type EraId } from './eras';
import { PROJECTS, TOTAL_DAYS, type Project } from './projects';

export const BY_DAY: ReadonlyMap<number, Project> = new Map(PROJECTS.map((p) => [p.day, p]));

export function projectOf(day: number): Project | undefined {
  return BY_DAY.get(day);
}

export const BY_ERA: Record<EraId, Project[]> = ERAS.reduce(
  (acc, era) => {
    acc[era.id] = PROJECTS.filter((p) => p.era === era.id);
    return acc;
  },
  {} as Record<EraId, Project[]>,
);

export const BY_CATEGORY = (() => {
  const map = new Map<Category, Project[]>();
  for (const p of PROJECTS) {
    for (const c of p.categories) {
      const list = map.get(c);
      if (list) list.push(p);
      else map.set(c, [p]);
    }
  }
  return map as ReadonlyMap<Category, Project[]>;
})();

export const FEATURED = PROJECTS.filter((p) => p.featured);

export const ACCENT_OF_DAY: ReadonlyMap<number, AccentFamily> = new Map(
  PROJECTS.map((p) => [p.day, accentOf(p.categories)]),
);

export function accentOfDay(day: number): AccentFamily {
  return ACCENT_OF_DAY.get(day) ?? 'product';
}

/* ── Search index ─────────────────────────────────────────────────────────── */

export interface SearchEntry {
  day: number;
  project: Project;
  /** Pre-lowered haystacks, split so scoring can weight fields differently. */
  title: string;
  categories: string;
  technologies: string;
  description: string;
  era: string;
}

export const SEARCH_INDEX: SearchEntry[] = PROJECTS.map((p) => ({
  day: p.day,
  project: p,
  title: p.title.toLowerCase(),
  categories: p.categories.map((c) => `${c} ${CATEGORY_META[c].label}`).join(' ').toLowerCase(),
  technologies: p.technologies.join(' ').toLowerCase(),
  description: p.description.toLowerCase(),
  era: (ERAS.find((e) => e.id === p.era)?.name ?? '').toLowerCase(),
}));

/* ── Relationships ────────────────────────────────────────────────────────── */

function sharedCategoryCount(a: Project, b: Project): number {
  return a.categories.filter((c) => b.categories.includes(c)).length;
}

const RELATED_CACHE = new Map<number, Project[]>();

/** Same era first, then shared categories, then temporal proximity. Top 4. */
export function relatedOf(day: number, limit = 4): Project[] {
  const cached = RELATED_CACHE.get(day);
  if (cached) return cached.slice(0, limit);

  const self = BY_DAY.get(day);
  if (!self) return [];

  const scored = PROJECTS.filter((p) => p.day !== day)
    .map((p) => {
      const shared = sharedCategoryCount(self, p);
      let score = shared * 10;
      if (p.era === self.era) score += 6;
      if (p.categories[0] === self.categories[0]) score += 5;
      if (p.duplicateOf === day || self.duplicateOf === p.day) score += 100;
      score -= Math.min(Math.abs(p.day - day) / 40, 4);
      return { p, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.p.day - b.p.day)
    .map((x) => x.p);

  RELATED_CACHE.set(day, scored.slice(0, 8));
  return scored.slice(0, limit);
}

/* ── Constellation layout ─────────────────────────────────────────────────── */

/** Deterministic PRNG — same layout on server and client, every render. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface Node {
  day: number;
  /** Normalised layout space, roughly -1..1 on both axes. */
  x: number;
  y: number;
  /** Depth, 0..1 — drives size and opacity so the field reads as 3D. */
  z: number;
  accent: AccentFamily;
}

/**
 * Nodes are clustered per accent family around a fixed anchor, with the angle
 * inside a cluster driven by the day number. The result is stable, legible,
 * and needs no live force simulation.
 */
const CLUSTER_ANCHORS: Record<AccentFamily, [number, number]> = {
  product: [0.62, -0.44],
  creative: [-0.66, -0.4],
  game: [-0.6, 0.5],
  system: [0.66, 0.42],
  utility: [0.04, 0.72],
  experiment: [-0.02, -0.76],
  realworld: [0, 0],
};

/**
 * A small angular step (rather than the golden angle) so that consecutive days
 * inside a cluster land next to each other. The linking edges then read as a
 * thread running through time instead of a scribble across the cluster.
 */
const ANGLE_STEP = 0.78;

export const NODES: Node[] = (() => {
  const rand = mulberry32(2000);
  const counts = new Map<AccentFamily, number>();
  const totals = new Map<AccentFamily, number>();
  for (const p of PROJECTS) {
    const a = accentOf(p.categories);
    totals.set(a, (totals.get(a) ?? 0) + 1);
  }

  return PROJECTS.map((p) => {
    const accent = accentOf(p.categories);
    const index = counts.get(accent) ?? 0;
    counts.set(accent, index + 1);
    const total = totals.get(accent) ?? 1;
    const [ax, ay] = CLUSTER_ANCHORS[accent];

    // An unrolling spiral: radius grows with the day, so a cluster reads
    // outward from its earliest build to its latest.
    const angle = index * ANGLE_STEP + accent.length;
    const radius = 0.07 + Math.sqrt((index + 0.5) / total) * 0.3;
    const jitterX = (rand() - 0.5) * 0.025;
    const jitterY = (rand() - 0.5) * 0.025;
    const pull = accent === 'realworld' ? 0.4 : 1;
    return {
      day: p.day,
      x: (ax + Math.cos(angle) * radius + jitterX) * pull,
      y: (ay + Math.sin(angle) * radius * 0.9 + jitterY) * pull,
      z: rand(),
      accent,
    };
  });
})();

export const NODE_BY_DAY: ReadonlyMap<number, Node> = new Map(NODES.map((n) => [n.day, n]));

export interface Edge {
  a: number;
  b: number;
  accent: AccentFamily;
}

/**
 * Edges follow the same ordering the layout uses: inside each accent family the
 * builds are threaded together in date order, so a line always joins two nodes
 * that sit next to each other on the spiral. The result reads as one continuous
 * thread per family — roughly 190 short segments rather than a hairball.
 *
 * The only long edges in the map are the two revisited builds, which is exactly
 * the relationship worth seeing from across the screen.
 */
export const EDGES: Edge[] = (() => {
  const edges: Edge[] = [];
  const byFamily = new Map<AccentFamily, Project[]>();

  for (const p of PROJECTS) {
    const family = accentOf(p.categories);
    const list = byFamily.get(family);
    if (list) list.push(p);
    else byFamily.set(family, [p]);
  }

  for (const [family, list] of byFamily) {
    for (let i = 1; i < list.length; i++) {
      edges.push({ a: list[i - 1].day, b: list[i].day, accent: family });
    }
  }

  for (const p of PROJECTS) {
    if (p.duplicateOf) {
      edges.push({ a: p.duplicateOf, b: p.day, accent: 'realworld' });
    }
  }
  return edges;
})();

/* ── Aggregate stats (used by the stats band and dev mode) ────────────────── */

export const STATS = {
  totalDays: TOTAL_DAYS,
  totalBuilds: PROJECTS.length,
  eras: ERAS.length,
  edges: EDGES.length,
  liveDomains: PROJECTS.filter((p) => p.url && !p.url.includes('vercel.app')).length,
  games: PROJECTS.filter((p) => p.categories.includes('game')).length,
  perFamily: (() => {
    const map = new Map<AccentFamily, number>();
    for (const p of PROJECTS) {
      const a = accentOf(p.categories);
      map.set(a, (map.get(a) ?? 0) + 1);
    }
    return map;
  })(),
  perCategory: (() => {
    const map = new Map<Category, number>();
    for (const p of PROJECTS) for (const c of p.categories) map.set(c, (map.get(c) ?? 0) + 1);
    return map;
  })(),
} as const;

export { PROJECTS, TOTAL_DAYS };
export type { Project };
