/** Search engines show roughly 60 characters of a title. */
export const TITLE_MAX = 60;

/** First non-empty candidate that fits; otherwise the shortest, trimmed at a word boundary. */
export function fitTitle(candidates: string[], max = TITLE_MAX): string {
  const list = candidates.map((c) => c.trim()).filter(Boolean);
  const hit = list.find((c) => c.length <= max);
  if (hit) return hit;
  const shortest = [...list].sort((a, b) => a.length - b.length)[0] ?? '';
  if (shortest.length <= max) return shortest;
  const cut = shortest.slice(0, max + 1);
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[\s,—:|&–-]+$/, '');
}
