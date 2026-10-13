"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getProgressList,
  getWatchlist,
  removeProgress,
  type ProgressEntry,
  type WatchlistItem,
} from "@/lib/storage";

export default function HomeLists() {
  const [progress, setProgress] = useState<ProgressEntry[]>([]);
  const [list, setList] = useState<WatchlistItem[]>([]);

  useEffect(() => {
    setProgress(getProgressList());
    setList(getWatchlist());
  }, []);

  if (progress.length === 0 && list.length === 0) return null;

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-6 pt-10">
      {progress.length > 0 && (
        <section>
          <h2 className="mb-4 border-l-4 border-pink-500 pl-3 text-xl font-bold">
            Continue Watching
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {progress.map((p) => (
              <div key={p.slug} className="group relative w-56 shrink-0">
                <Link href={`/watch/${p.slug}/${p.episode}`}>
                  <div className="relative aspect-video overflow-hidden rounded-lg bg-neutral-800 ring-1 ring-white/5">
                    {p.poster && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.poster}
                        alt={p.title}
                        className="h-full w-full object-cover object-top transition duration-300 group-hover:scale-105"
                      />
                    )}
                    <span className="absolute left-2 top-2 rounded bg-pink-500 px-1.5 py-0.5 text-[10px] font-bold">
                      EP {p.episode}
                    </span>
                    <div className="absolute bottom-0 left-0 h-1 w-full bg-white/20">
                      <div
                        className="h-full bg-pink-500"
                        style={{ width: `${Math.min(100, (p.time / p.duration) * 100)}%` }}
                      />
                    </div>
                  </div>
                  <p className="mt-2 line-clamp-1 text-sm font-medium group-hover:text-pink-400">
                    {p.title}
                  </p>
                </Link>
                <button
                  aria-label="Remove"
                  onClick={() => {
                    removeProgress(p.slug);
                    setProgress(getProgressList());
                  }}
                  className="absolute right-2 top-2 hidden rounded-full bg-black/70 px-2 text-xs group-hover:block"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {list.length > 0 && (
        <section>
          <h2 className="mb-4 border-l-4 border-pink-500 pl-3 text-xl font-bold">My List</h2>
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
            {list.map((a) => (
              <Link key={a.slug} href={`/anime/${a.slug}`} className="group">
                <div className="aspect-[2/3] overflow-hidden rounded-lg bg-neutral-800 ring-1 ring-white/5">
                  {a.poster && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={a.poster}
                      alt={a.title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  )}
                </div>
                <p className="mt-2 line-clamp-1 text-xs group-hover:text-pink-400">{a.title}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}