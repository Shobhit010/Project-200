import { SEARCH_INDEX, type SearchEntry } from '@/data/derived';
import type { Project } from '@/data/projects';

export interface SearchResult {
  project: Project;
  score: number;
  /** Which field produced the strongest hit — shown as the result's subtitle. */
  reason: string;
}

/**
 * 200 items, so no index structure is needed beyond pre-lowered strings.
 * Scoring is explicit and ordered: an exact day number always wins, then a
 * title prefix, then a title substring, then metadata, then description.
 */
export function search(query: string, limit = 12): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const terms = q.split(/\s+/).filter(Boolean);
  const dayMatch = q.match(/(?:^|\bday\s*)(\d{1,3})\b/);
  const wantedDay = dayMatch ? Number(dayMatch[1]) : null;

  const results: SearchResult[] = [];

  for (const entry of SEARCH_INDEX) {
    let score = 0;
    let reason = '';

    if (wantedDay !== null) {
      if (entry.day === wantedDay) {
        score += 1000;
        reason = `Day ${entry.day}`;
      } else if (String(entry.day).startsWith(String(wantedDay))) {
        score += 120;
        reason = `Day ${entry.day}`;
      }
    }

    for (const term of terms) {
      if (entry.title === term) score += 400;
      else if (entry.title.startsWith(term)) {
        score += 220;
        reason ||= 'Title';
      } else if (entry.title.includes(term)) {
        score += 130;
        reason ||= 'Title';
      }

      if (entry.categories.includes(term)) {
        score += 70;
        reason ||= 'Category';
      }
      if (entry.technologies.includes(term)) {
        score += 55;
        reason ||= 'Stack';
      }
      if (entry.era.includes(term)) {
        score += 45;
        reason ||= 'Era';
      }
      if (entry.description.includes(term)) {
        score += 22;
        reason ||= 'Description';
      }
    }

    if (score > 0) {
      results.push({ project: entry.project, score, reason: reason || 'Match' });
    }
  }

  return results
    .sort((a, b) => b.score - a.score || a.project.day - b.project.day)
    .slice(0, limit);
}

/** Suggestions shown before the user types anything. */
export const SEARCH_HINTS = [
  'games',
  'day 150',
  'three.js',
  'system design',
  'dashboard',
  'puzzle',
  'real world',
  '3d',
] as const;

export type { SearchEntry };
