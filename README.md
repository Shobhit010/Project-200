# ONE WEBSITE EVERY DAY — Day 200

An interactive archive of 200 consecutive days of building. The site is itself Day 200: the
final build of the challenge is the thing that holds the other 199.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## What it is

Four ways to move through the same 200 builds, plus a narrative running underneath them.

| Surface | What it does |
|---|---|
| **Timeline** | The chronological spine. Era headers pin as you pass through them. |
| **Constellation** | All 200 as a canvas map, clustered by discipline, threaded in date order. Pan, zoom, hover, click; arrow keys step and Enter opens. |
| **Grid** | The efficient view — dense, filterable, keyboard navigable. |
| **Era** | Ten chapters, each stating what that stretch of days was for. |
| **⌘K / Ctrl+K** | Instant search over names, day numbers, categories, stacks and eras. |
| **Surprise me** | A slot machine across the 200 days. |
| **Rewind** | Counts 200 → 1 and lands back at the first build. |

Every build opens in a full-screen takeover with `←` `→` to step, `Esc` to close, related builds,
and a prominent **OPEN PROJECT ↗** that goes to the live site in a new tab.

## Architecture

```
src/
  data/          projects.ts (the 200 entries) · eras.ts · categories.ts · derived.ts
  state/         archive.tsx — one reducer, stable actions
  lib/           thumb.ts (procedural previews) · search.ts · constants.ts
  hooks/         intersection, scroll progress, count-up, key sequences, reduced motion
  components/    boot · hero · archive/modes · detail · journey · features · ending · chrome · ui
  app/           / and /day/[day] (200 static pages) + not-found
```

### Rules the code holds itself to

**The supplied URLs are the source of truth.** All 200 are stored verbatim in
[`src/data/projects.ts`](src/data/projects.ts). The log contains two deliberate repeats —
Day 100 = Day 196, Day 139 = Day 195 — and both entries are kept and cross-linked rather than
quietly merged.

**Nothing is claimed that was not supplied.** Technology lists are inferred from each build, so
every entry carries `stackVerified: false` and the UI labels them `STACK · INFERRED`. Outbound
links live in [`src/lib/constants.ts`](src/lib/constants.ts); any entry left `null` renders as a
disabled control that says so rather than a fabricated URL.

**Zero external requests.** The archive holds 200 external sites and loads none of them. Previews
are generated locally — a deterministic PRNG seeded on the day number drives one of seven canvas
programs, so a build always looks identical and there is no broken-image state and no layout shift.
The only outbound navigation is a link the visitor clicks.

**WebGL is optional.** The hero constellation is the one WebGL surface. It is code-split, requested
only after the loader hands off, skipped entirely under `prefers-reduced-motion`, and wrapped in an
error boundary that falls back to a static field if a context cannot be created.

## Verified

| Check | Result |
|---|---|
| URL fidelity against the source log | 200/200 exact, both duplicates preserved |
| External requests on load | none |
| Lighthouse — `/` desktop | perf **100** · a11y **100** · best practices **100** · SEO **100** |
| Lighthouse — `/day/147` desktop | 99 · 100 · 100 · 100 |
| Lighthouse — `/` mobile, throttled | 95 · 100 · 100 · 100 |
| axe-core, WCAG 2.0/2.1/2.2 A + AA | no violations on `/` or `/day/147` |
| Cumulative layout shift | 0 |
| First-paint JS | ~225 kB gzip; the 129 kB WebGL chunk loads after |

Every step of the ink scale clears 4.5:1 on the void background; anything fainter is drawn as a
hairline or a tick, never as type.

## Configuration

- `src/lib/constants.ts` — site metadata and outbound links (portfolio, email, X, GitHub,
  LinkedIn). Setting an entry's `href` to `null` disables its button instead of faking a URL.
- `NEXT_PUBLIC_SITE_URL` — set at build time so Open Graph URLs are absolute.

## Secrets

Type `200` anywhere. Type `day1` or `day200`. Click the wordmark seven times.
