import type { AccentFamily } from './categories';

export const ERA_IDS = [
  'origin',
  'playground',
  'physics',
  'reflex',
  'systems',
  'lifeos',
  'puzzle',
  'os-era',
  'studio',
  'realworld',
] as const;

export type EraId = (typeof ERA_IDS)[number];

export interface Era {
  id: EraId;
  index: number;
  /** Zero-padded chapter marker, e.g. "01" */
  numeral: string;
  name: string;
  from: number;
  to: number;
  accent: AccentFamily;
  /** One line shown under the era title. */
  tagline: string;
  /** The narrative paragraph used in ERA mode and the evolution scroll. */
  narrative: string;
}

export const ERAS: Era[] = [
  {
    id: 'origin',
    index: 0,
    numeral: '01',
    name: 'THE BEGINNING',
    from: 1,
    to: 20,
    accent: 'product',
    tagline: 'Learning in public. Twenty days of proving it was possible.',
    narrative:
      'Landing pages, job portals, a 3D shoe, four board games. Nothing here is subtle. The only goal was to finish something before midnight, twenty nights in a row.',
  },
  {
    id: 'playground',
    index: 1,
    numeral: '02',
    name: 'THE PLAYGROUND',
    from: 21,
    to: 50,
    accent: 'creative',
    tagline: 'Interfaces stop being useful and start being ideas.',
    narrative:
      'Thirty days spent asking what a website is allowed to be. A site that ends. A predictive hover. A spatial archive. A living ecosystem. Utility was optional; curiosity was not.',
  },
  {
    id: 'physics',
    index: 2,
    numeral: '03',
    name: 'MOTION & PHYSICS',
    from: 51,
    to: 60,
    accent: 'creative',
    tagline: 'Everything gains mass, gravity and consequence.',
    narrative:
      'Ten days of simulation. Gravity painting, orbital balance, procedural islands, evolving creatures. The first builds where the code kept running after the page loaded.',
  },
  {
    id: 'reflex',
    index: 3,
    numeral: '04',
    name: 'THE GAME LAB',
    from: 61,
    to: 79,
    accent: 'game',
    tagline: 'Nineteen games about a single decision.',
    narrative:
      'Each one strips a game down to one mechanic and one moment: jump now, or lose. Built fast, tuned obsessively. This is where feel became a design skill.',
  },
  {
    id: 'systems',
    index: 4,
    numeral: '05',
    name: 'SYSTEM THINKING',
    from: 80,
    to: 103,
    accent: 'system',
    tagline: 'From screens to architecture.',
    narrative:
      'Order books, distributed checkouts, chat fan-out, search indexing, ride dispatch, netcode. Twenty-four days of drawing the machine behind the interface — and then making the drawing run.',
  },
  {
    id: 'lifeos',
    index: 5,
    numeral: '06',
    name: 'LIFE OS',
    from: 104,
    to: 115,
    accent: 'utility',
    tagline: 'Software for the boring parts of being a person.',
    narrative:
      'Groceries, meals, documents, renewals, bookmarks, routes, income. Twelve tools built for an audience of one, which turned out to be the fastest way to learn what people actually need.',
  },
  {
    id: 'puzzle',
    index: 6,
    numeral: '07',
    name: 'THE PUZZLE LAB',
    from: 116,
    to: 153,
    accent: 'experiment',
    tagline: 'Thirty-eight games that argue with the player.',
    narrative:
      'The grid rotates. The exit moves away. Your score is your enemy. The rules lie. These stopped being reflex tests and became small psychological experiments with a start button.',
  },
  {
    id: 'os-era',
    index: 7,
    numeral: '08',
    name: 'THE OPERATING SYSTEM ERA',
    from: 154,
    to: 189,
    accent: 'product',
    tagline: 'Thirty-six product concepts, shipped daily.',
    narrative:
      'Everything became an OS. Career, finance, health, hiring, dev tooling, investing, logistics. Full product surfaces — navigation, empty states, data models — designed and built between one sunrise and the next.',
  },
  {
    id: 'studio',
    index: 8,
    numeral: '09',
    name: 'THE GAME STUDIO',
    from: 190,
    to: 193,
    accent: 'game',
    tagline: 'Four days. Four finished games.',
    narrative:
      'Neon Drift. Tiny Knight. Bomb Room. Gravity Shift. Not prototypes this time — complete little games with menus, deaths, scores and an ending.',
  },
  {
    id: 'realworld',
    index: 9,
    numeral: '10',
    name: 'THE REAL WORLD',
    from: 194,
    to: 200,
    accent: 'realworld',
    tagline: 'Where the practice stopped being practice.',
    narrative:
      'Live domains. Real products. Things other people use. And then, on the last day, the archive that holds all two hundred of them.',
  },
];

export const ERA_BY_ID: Record<EraId, Era> = ERAS.reduce(
  (acc, era) => {
    acc[era.id] = era;
    return acc;
  },
  {} as Record<EraId, Era>,
);

export function eraOfDay(day: number): Era {
  return ERAS.find((e) => day >= e.from && day <= e.to) ?? ERAS[0];
}
