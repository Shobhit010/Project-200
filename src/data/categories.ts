export const CATEGORY_IDS = [
  'product',
  'game',
  'experiment',
  'design',
  'ai',
  'system-design',
  'utility',
  'dashboard',
  'dev-tool',
  'finance',
  'health',
  'travel',
  'productivity',
  'creative-code',
  '3d',
  'simulation',
  'startup',
  'portfolio',
  'real-world',
] as const;

export type Category = (typeof CATEGORY_IDS)[number];

/**
 * Every category maps onto one of seven accent families. The families are the
 * visual signature of the archive — a node's colour is always driven by its
 * FIRST category, so ordering inside `Project.categories` is meaningful.
 */
export type AccentFamily =
  | 'product'
  | 'creative'
  | 'game'
  | 'system'
  | 'utility'
  | 'experiment'
  | 'realworld';

export const ACCENTS: Record<AccentFamily, { hex: string; rgb: string; label: string }> = {
  product: { hex: '#5B8DEF', rgb: '91 141 239', label: 'PRODUCT' },
  creative: { hex: '#A97BFF', rgb: '169 123 255', label: 'CREATIVE' },
  game: { hex: '#FF6B4A', rgb: '255 107 74', label: 'GAME' },
  system: { hex: '#4FBF8B', rgb: '79 191 139', label: 'SYSTEM' },
  utility: { hex: '#E3B341', rgb: '227 179 65', label: 'UTILITY' },
  experiment: { hex: '#F471B5', rgb: '244 113 181', label: 'EXPERIMENT' },
  realworld: { hex: '#F2F3F5', rgb: '242 243 245', label: 'REAL WORLD' },
};

export const CATEGORY_META: Record<
  Category,
  { label: string; family: AccentFamily; short: string }
> = {
  product: { label: 'Product', family: 'product', short: 'PRD' },
  game: { label: 'Game', family: 'game', short: 'GAM' },
  experiment: { label: 'Experiment', family: 'experiment', short: 'EXP' },
  design: { label: 'Design', family: 'creative', short: 'DSN' },
  ai: { label: 'AI', family: 'creative', short: 'AI_' },
  'system-design': { label: 'System Design', family: 'system', short: 'SYS' },
  utility: { label: 'Utility', family: 'utility', short: 'UTL' },
  dashboard: { label: 'Dashboard', family: 'system', short: 'DSH' },
  'dev-tool': { label: 'Developer Tool', family: 'system', short: 'DEV' },
  finance: { label: 'Finance', family: 'utility', short: 'FIN' },
  health: { label: 'Health', family: 'utility', short: 'HLT' },
  travel: { label: 'Travel', family: 'utility', short: 'TRV' },
  productivity: { label: 'Productivity', family: 'utility', short: 'PRO' },
  'creative-code': { label: 'Creative Code', family: 'creative', short: 'CRE' },
  '3d': { label: '3D', family: 'creative', short: '3D_' },
  simulation: { label: 'Simulation', family: 'system', short: 'SIM' },
  startup: { label: 'Startup', family: 'product', short: 'STP' },
  portfolio: { label: 'Portfolio', family: 'realworld', short: 'PTF' },
  'real-world': { label: 'Real World', family: 'realworld', short: 'RWL' },
};

/** The chip row shown in the archive toolbar — deliberately not all 19. */
export const FILTER_GROUPS: { id: string; label: string; match: Category[] }[] = [
  { id: 'all', label: 'ALL', match: [] },
  { id: 'games', label: 'GAMES', match: ['game'] },
  { id: 'products', label: 'PRODUCTS', match: ['product', 'startup'] },
  { id: 'experiments', label: 'EXPERIMENTS', match: ['experiment'] },
  { id: 'systems', label: 'SYSTEM DESIGN', match: ['system-design', 'simulation'] },
  { id: 'dashboards', label: 'DASHBOARDS', match: ['dashboard'] },
  { id: 'utilities', label: 'UTILITIES', match: ['utility', 'productivity', 'finance'] },
  { id: 'creative', label: 'CREATIVE', match: ['creative-code', 'design'] },
  { id: 'ai', label: 'AI', match: ['ai'] },
  { id: '3d', label: '3D', match: ['3d'] },
  { id: 'devtools', label: 'DEV TOOLS', match: ['dev-tool'] },
  { id: 'realworld', label: 'REAL WORLD', match: ['real-world', 'portfolio'] },
];

export function accentOf(categories: readonly Category[]): AccentFamily {
  return CATEGORY_META[categories[0]].family;
}
