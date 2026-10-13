export type ProgressEntry = {
  slug: string;
  title: string;
  poster: string | null;
  episode: number;
  time: number;
  duration: number;
  updatedAt: number;
};

export type WatchlistItem = {
  slug: string;
  title: string;
  poster: string | null;
  year: number | null;
};

const PROGRESS_KEY = "anistream:progress";
const LIST_KEY = "anistream:watchlist";

function read<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(key) ?? "[]");
  } catch {
    return [];
  }
}

function write<T>(key: string, value: T[]) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

// ---------- Continue Watching (one entry per anime) ----------

export function getProgressList(): ProgressEntry[] {
  return read<ProgressEntry>(PROGRESS_KEY).sort((a, b) => b.updatedAt - a.updatedAt);
}

export function saveProgress(entry: ProgressEntry) {
  const rest = read<ProgressEntry>(PROGRESS_KEY).filter((e) => e.slug !== entry.slug);
  write(PROGRESS_KEY, [entry, ...rest].slice(0, 20));
}

export function removeProgress(slug: string) {
  write(PROGRESS_KEY, read<ProgressEntry>(PROGRESS_KEY).filter((e) => e.slug !== slug));
}

export function getEpisodeTime(slug: string, episode: number): number {
  const e = read<ProgressEntry>(PROGRESS_KEY).find(
    (x) => x.slug === slug && x.episode === episode
  );
  return e?.time ?? 0;
}

// ---------- My List ----------

export function getWatchlist(): WatchlistItem[] {
  return read<WatchlistItem>(LIST_KEY);
}

export function isInWatchlist(slug: string): boolean {
  return getWatchlist().some((i) => i.slug === slug);
}

// returns the new state: true = now in list
export function toggleWatchlist(item: WatchlistItem): boolean {
  const list = getWatchlist();
  if (list.some((i) => i.slug === item.slug)) {
    write(LIST_KEY, list.filter((i) => i.slug !== item.slug));
    return false;
  }
  write(LIST_KEY, [item, ...list]);
  return true;
}