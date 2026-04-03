import { deterministicCandidate } from "@/utils/seed";

export const EPOCH_YMD = "2025-01-01";
export const WINDOW_DAYS = 30;
export const MAX_ATTEMPTS = 6;

export function daysBetween(fromYMD: string, toYMD: string): number {
  const from = new Date(`${fromYMD}T00:00:00Z`);
  const to = new Date(`${toYMD}T00:00:00Z`);
  return Math.floor((to.getTime() - from.getTime()) / 86400000);
}

export function ymdFromDayIndex(k: number): string {
  const d = new Date(`${EPOCH_YMD}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + k);
  return d.toISOString().slice(0, 10);
}

export function todayUTCKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getDayIndex(ymd: string = todayUTCKey()): number {
  return daysBetween(EPOCH_YMD, ymd);
}

export function getCanonicalList<T extends { slug?: string }>(list: T[]): T[] {
  return list.slice().sort((a, b) => {
    const aKey = String(a.slug || "").toLowerCase();
    const bKey = String(b.slug || "").toLowerCase();
    return aKey.localeCompare(bKey);
  });
}

export function getCharacterIndexForDay(
  k: number,
  N: number,
  seqCache: (number | undefined)[] = [],
): { index: number; cache: (number | undefined)[] } {
  const cache = [...seqCache];

  let lastCalculated = -1;
  for (let i = 0; i < cache.length; i++) {
    if (cache[i] !== undefined) {
      lastCalculated = i;
    }
  }

  for (let day = lastCalculated + 1; day <= k; day++) {
    const dayYMD = ymdFromDayIndex(day);
    const start = Math.max(0, day - WINDOW_DAYS);
    const recent = new Set<number>();

    for (let i = start; i < day; i++) {
      const idx = cache[i];
      if (idx != null) recent.add(idx);
    }

    let chosen: number | null = null;
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      const cand = deterministicCandidate(dayYMD, attempt, N);
      if (!recent.has(cand)) {
        chosen = cand;
        break;
      }
    }

    if (chosen == null) {
      let bestIdx = 0;
      let bestGap = -Infinity;
      for (let attempt = 0; attempt < Math.max(MAX_ATTEMPTS, 32); attempt++) {
        const cand = deterministicCandidate(dayYMD, attempt, N);
        let last = -Infinity;
        for (let i = day - 1; i >= start; i--) {
          if (cache[i] === cand) {
            last = i;
            break;
          }
        }
        const gap = last === -Infinity ? 1e9 : day - last;
        if (gap > bestGap) {
          bestGap = gap;
          bestIdx = cand;
        }
      }
      chosen = bestIdx;
    }

    cache[day] = chosen;
  }

  return { index: cache[k]!, cache };
}
