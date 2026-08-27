'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from 'react';
import { FILTER_GROUPS, type Category } from '@/data/categories';
import { PROJECTS, TOTAL_DAYS, type Project } from '@/data/projects';
import { BY_DAY } from '@/data/derived';
import { KEYS } from '@/lib/constants';

export type Phase = 'loading' | 'hero' | 'ready';
export type ArchiveMode = 'timeline' | 'constellation' | 'grid' | 'era';

export interface ArchiveState {
  phase: Phase;
  mode: ArchiveMode;
  filter: string;
  range: [number, number];
  query: string;
  openDay: number | null;
  /** Where the visitor "is" — drives the YOU ARE HERE readout. */
  hereDay: number;
  paletteOpen: boolean;
  randomOpen: boolean;
  rewinding: boolean;
  devMode: boolean;
  /** Bumping this fires the hidden node-burst animation. */
  burst: number;
}

type Action =
  | { type: 'phase'; phase: Phase }
  | { type: 'mode'; mode: ArchiveMode }
  | { type: 'filter'; filter: string }
  | { type: 'range'; range: [number, number] }
  | { type: 'query'; query: string }
  | { type: 'open'; day: number | null }
  | { type: 'here'; day: number }
  | { type: 'palette'; open?: boolean }
  | { type: 'random'; open: boolean }
  | { type: 'rewind'; on: boolean }
  | { type: 'dev'; on?: boolean }
  | { type: 'step'; delta: number }
  | { type: 'burst' }
  | { type: 'reset-filters' };

const INITIAL: ArchiveState = {
  phase: 'loading',
  mode: 'timeline',
  filter: 'all',
  range: [1, TOTAL_DAYS],
  query: '',
  openDay: null,
  hereDay: 1,
  paletteOpen: false,
  randomOpen: false,
  rewinding: false,
  devMode: false,
  burst: 0,
};

function reducer(state: ArchiveState, action: Action): ArchiveState {
  switch (action.type) {
    case 'phase':
      return { ...state, phase: action.phase };
    case 'mode':
      return { ...state, mode: action.mode };
    case 'filter':
      return { ...state, filter: action.filter };
    case 'range':
      return { ...state, range: action.range };
    case 'query':
      return { ...state, query: action.query };
    case 'open':
      return {
        ...state,
        openDay: action.day,
        hereDay: action.day ?? state.hereDay,
        paletteOpen: false,
        randomOpen: false,
      };
    case 'here':
      return state.hereDay === action.day ? state : { ...state, hereDay: action.day };
    case 'palette':
      return { ...state, paletteOpen: action.open ?? !state.paletteOpen };
    case 'random':
      return { ...state, randomOpen: action.open };
    case 'rewind':
      return { ...state, rewinding: action.on };
    case 'dev':
      return { ...state, devMode: action.on ?? !state.devMode };
    case 'step': {
      if (state.openDay === null) return state;
      const day = Math.min(Math.max(state.openDay + action.delta, 1), TOTAL_DAYS);
      return { ...state, openDay: day, hereDay: day };
    }
    case 'burst':
      return { ...state, burst: state.burst + 1 };
    case 'reset-filters':
      return { ...state, filter: 'all', range: [1, TOTAL_DAYS], query: '' };
    default:
      return state;
  }
}

interface ArchiveContextValue extends ArchiveState {
  /** Projects surviving the current filter, range and inline query. */
  visible: Project[];
  open: (day: number | null) => void;
  next: () => void;
  prev: () => void;
  setMode: (mode: ArchiveMode) => void;
  setFilter: (filter: string) => void;
  setRange: (range: [number, number]) => void;
  setQuery: (query: string) => void;
  setPhase: (phase: Phase) => void;
  togglePalette: (open?: boolean) => void;
  setRandomOpen: (open: boolean) => void;
  setRewinding: (on: boolean) => void;
  toggleDev: () => void;
  fireBurst: () => void;
  resetFilters: () => void;
  setHere: (day: number) => void;
}

const ArchiveContext = createContext<ArchiveContextValue | null>(null);

function matchesFilter(project: Project, filterId: string): boolean {
  if (filterId === 'all') return true;
  const group = FILTER_GROUPS.find((g) => g.id === filterId);
  if (!group || group.match.length === 0) return true;
  return group.match.some((c: Category) => project.categories.includes(c));
}

export function ArchiveProvider({
  children,
  initialDay = null,
}: {
  children: ReactNode;
  initialDay?: number | null;
}) {
  const [state, dispatch] = useReducer(reducer, INITIAL, (base) =>
    initialDay
      ? { ...base, openDay: initialDay, hereDay: initialDay, phase: 'ready' as Phase }
      : base,
  );

  /** Element that had focus before a takeover opened, restored on close. */
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  const open = useCallback((day: number | null) => {
    if (day !== null) {
      restoreFocusRef.current = document.activeElement as HTMLElement | null;
    }
    dispatch({ type: 'open', day });
    if (day === null && restoreFocusRef.current) {
      const el = restoreFocusRef.current;
      restoreFocusRef.current = null;
      requestAnimationFrame(() => el.focus?.());
    }
  }, []);

  const next = useCallback(() => dispatch({ type: 'step', delta: 1 }), []);
  const prev = useCallback(() => dispatch({ type: 'step', delta: -1 }), []);

  /* URL sync — pushState only, so stepping through 200 days never re-renders a route. */
  useEffect(() => {
    const target = state.openDay ? `/day/${state.openDay}` : '/';
    if (window.location.pathname !== target) {
      window.history.pushState({ day: state.openDay }, '', target);
    }
  }, [state.openDay]);

  useEffect(() => {
    const onPop = () => {
      const m = window.location.pathname.match(/^\/day\/(\d{1,3})$/);
      const day = m ? Number(m[1]) : null;
      dispatch({ type: 'open', day: day && BY_DAY.has(day) ? day : null });
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  /* Scroll lock while any takeover is up. */
  useEffect(() => {
    const locked =
      state.openDay !== null || state.paletteOpen || state.randomOpen || state.rewinding;
    document.body.dataset.locked = locked ? 'true' : 'false';
    return () => {
      document.body.dataset.locked = 'false';
    };
  }, [state.openDay, state.paletteOpen, state.randomOpen, state.rewinding]);

  /* Persist dev mode across reloads — it is a debugging surface, not a gimmick. */
  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(KEYS.devMode) === '1') dispatch({ type: 'dev', on: true });
    } catch {
      /* storage unavailable — dev mode simply starts off */
    }
  }, []);

  useEffect(() => {
    try {
      window.sessionStorage.setItem(KEYS.devMode, state.devMode ? '1' : '0');
    } catch {
      /* ignore */
    }
  }, [state.devMode]);

  const visible = useMemo(() => {
    const q = state.query.trim().toLowerCase();
    return PROJECTS.filter((p) => {
      if (p.day < state.range[0] || p.day > state.range[1]) return false;
      if (!matchesFilter(p, state.filter)) return false;
      if (q) {
        const hay = `${p.day} ${p.title} ${p.categories.join(' ')} ${p.description}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [state.filter, state.range, state.query]);

  /**
   * Every action is a stable reference.
   *
   * This matters more than it looks: several surfaces run requestAnimationFrame
   * loops inside effects that list these callbacks as dependencies. If an
   * action changed identity on each state update, every one of those effects
   * would tear down and cancel its own animation on the first frame.
   */
  const actions = useMemo(
    () => ({
      setMode: (mode: ArchiveMode) => dispatch({ type: 'mode', mode }),
      setFilter: (filter: string) => dispatch({ type: 'filter', filter }),
      setRange: (range: [number, number]) => dispatch({ type: 'range', range }),
      setQuery: (query: string) => dispatch({ type: 'query', query }),
      setPhase: (phase: Phase) => dispatch({ type: 'phase', phase }),
      togglePalette: (openState?: boolean) => dispatch({ type: 'palette', open: openState }),
      setRandomOpen: (openState: boolean) => dispatch({ type: 'random', open: openState }),
      setRewinding: (on: boolean) => dispatch({ type: 'rewind', on }),
      toggleDev: () => dispatch({ type: 'dev' }),
      fireBurst: () => dispatch({ type: 'burst' }),
      resetFilters: () => dispatch({ type: 'reset-filters' }),
      setHere: (day: number) => dispatch({ type: 'here', day }),
    }),
    [],
  );

  const value = useMemo<ArchiveContextValue>(
    () => ({ ...state, visible, open, next, prev, ...actions }),
    [state, visible, open, next, prev, actions],
  );

  return <ArchiveContext.Provider value={value}>{children}</ArchiveContext.Provider>;
}

export function useArchive(): ArchiveContextValue {
  const ctx = useContext(ArchiveContext);
  if (!ctx) throw new Error('useArchive must be used inside <ArchiveProvider>');
  return ctx;
}
