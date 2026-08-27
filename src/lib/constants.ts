/**
 * Site-level configuration.
 *
 * Anything that is not verifiably true is `null` here rather than invented.
 * Buttons bound to a null link render disabled with a configuration hint —
 * the archive never ships a dead or fabricated URL.
 */

export const SITE = {
  name: 'ONE WEBSITE EVERY DAY',
  shortName: 'DAY 200',
  builder: 'SHOBHIT',
  tagline: '200 DAYS. 200 BUILDS. ONE EVOLVING MIND.',
  description:
    'An interactive archive of 200 consecutive days of building websites, games, systems and products. Day 200 is the archive itself.',
  /** Set once deployed, used for absolute OG URLs. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
} as const;

export interface ExternalLink {
  label: string;
  /** null = not configured. The UI must disable, never fake. */
  href: string | null;
  hint: string;
}

export const LINKS: Record<string, ExternalLink> = {
  /** The Day 19 build is a real, supplied URL — safe to link. */
  portfolio: {
    label: 'VISIT MY PORTFOLIO',
    href: 'https://shobhit-portfolio-two.vercel.app/',
    hint: 'Day 19 of the challenge.',
  },
  email: {
    label: 'CONNECT WITH ME',
    href: 'mailto:shobhit2004poddar@gmail.com',
    hint: 'shobhit2004poddar@gmail.com',
  },
  x: {
    label: 'X / TWITTER',
    href: 'https://x.com/shobhittt007',
    hint: '@shobhittt007',
  },
  github: {
    label: 'GITHUB',
    href: 'https://github.com/Shobhit010',
    hint: 'github.com/Shobhit010',
  },
  linkedin: {
    label: 'LINKEDIN',
    href: 'https://www.linkedin.com/in/shobhit-poddar-065001215/',
    hint: 'linkedin.com/in/shobhit-poddar-065001215',
  },
};

export const KEYS = {
  loaderSeen: 'archive:loader-seen',
  heroSeen: 'archive:hero-seen',
  devMode: 'archive:dev-mode',
} as const;
