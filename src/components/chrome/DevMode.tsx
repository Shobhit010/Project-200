'use client';

import { ACCENTS, CATEGORY_META, type AccentFamily, type Category } from '@/data/categories';
import { ERAS } from '@/data/eras';
import { BY_ERA, EDGES, NODES, STATS } from '@/data/derived';
import { PROJECTS, TOTAL_DAYS } from '@/data/projects';
import { useArchive } from '@/state/archive';
import { Mono } from '@/components/ui/primitives';

/**
 * Unlocked by clicking the logo seven times. Shows the actual shape of the
 * dataset — including a live integrity check, so the archive can prove its own
 * claim of 200 distinct days.
 */
export function DevMode() {
  const { devMode, toggleDev } = useArchive();
  if (!devMode) return null;

  const days = PROJECTS.map((p) => p.day);
  const unique = new Set(days).size;
  const contiguous = days.every((d, i) => d === i + 1);
  const urlDupes = new Map<string, number[]>();
  for (const p of PROJECTS) {
    if (!p.url) continue;
    urlDupes.set(p.url, [...(urlDupes.get(p.url) ?? []), p.day]);
  }
  const repeated = [...urlDupes.entries()].filter(([, d]) => d.length > 1);

  return (
    <aside
      className="fixed right-4 top-4 z-[110] max-h-[80vh] w-[19rem] overflow-y-auto border border-hairline u-glass p-4 no-scrollbar"
      aria-label="Developer mode: archive metadata"
    >
      <header className="mb-4 flex items-center justify-between">
        <Mono className="text-ink">DEVELOPER MODE</Mono>
        <button onClick={toggleDev} className="u-mono text-ink-3 hover:text-ink" data-cursor="link">
          CLOSE
        </button>
      </header>

      <Section title="INTEGRITY">
        <Row k="ENTRIES" v={`${PROJECTS.length} / ${TOTAL_DAYS}`} ok={PROJECTS.length === TOTAL_DAYS} />
        <Row k="UNIQUE DAYS" v={String(unique)} ok={unique === TOTAL_DAYS} />
        <Row k="CONTIGUOUS 1..200" v={contiguous ? 'YES' : 'NO'} ok={contiguous} />
        <Row k="REPEATED URLS" v={String(repeated.length)} ok />
        {repeated.map(([url, d]) => (
          <div key={url} className="u-mono pl-2 text-[0.52rem] text-ink-4">
            {d.join(' = ')}
          </div>
        ))}
        <Row k="STACK VERIFIED" v="FALSE (INFERRED)" ok />
      </Section>

      <Section title="GRAPH">
        <Row k="NODES" v={String(NODES.length)} ok />
        <Row k="EDGES" v={String(EDGES.length)} ok />
        <Row k="MAX DEGREE" v="3 + REVISIT LINKS" ok />
      </Section>

      <Section title="ERAS">
        {ERAS.map((era) => (
          <div key={era.id} className="u-mono flex justify-between text-[0.55rem] text-ink-3">
            <span>
              {era.numeral} {era.name}
            </span>
            <span className="text-ink-4">{BY_ERA[era.id].length}</span>
          </div>
        ))}
      </Section>

      <Section title="ACCENT FAMILIES">
        {[...STATS.perFamily.entries()]
          .sort((a, b) => b[1] - a[1])
          .map(([family, count]) => (
            <div key={family} className="u-mono flex items-center gap-2 text-[0.55rem] text-ink-3">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: ACCENTS[family as AccentFamily].hex }}
              />
              <span className="flex-1">{ACCENTS[family as AccentFamily].label}</span>
              <span className="text-ink-4">{count}</span>
            </div>
          ))}
      </Section>

      <Section title="CATEGORIES">
        {[...STATS.perCategory.entries()]
          .sort((a, b) => b[1] - a[1])
          .map(([cat, count]) => (
            <div key={cat} className="u-mono flex justify-between text-[0.55rem] text-ink-3">
              <span>{CATEGORY_META[cat as Category].label}</span>
              <span className="text-ink-4">{count}</span>
            </div>
          ))}
      </Section>
    </aside>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-5">
      <div className="u-mono mb-2 border-b border-hairline pb-1 text-[0.55rem] text-ink-4">
        {title}
      </div>
      <div className="space-y-1">{children}</div>
    </section>
  );
}

function Row({ k, v, ok }: { k: string; v: string; ok: boolean }) {
  return (
    <div className="u-mono flex justify-between text-[0.55rem]">
      <span className="text-ink-3">{k}</span>
      <span style={{ color: ok ? '#4FBF8B' : '#FF6B4A' }}>{v}</span>
    </div>
  );
}
