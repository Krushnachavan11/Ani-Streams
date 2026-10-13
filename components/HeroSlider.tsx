"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { AnimeCard } from "@/lib/data";

export default function HeroSlider({ items }: { items: AnimeCard[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || items.length < 2) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % items.length), 6000);
    return () => clearInterval(t);
  }, [paused, items.length]);

  if (items.length === 0) return null;

  const go = (n: number) => setIndex((n + items.length) % items.length);

  return (
    <section
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative h-[72vh] min-h-[440px] w-full overflow-hidden bg-[#0b0b12]"
    >
      {items.map((a, i) => (
        <div
          key={a.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === index ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/60 to-[#0b0b12]" />
          {a.banner && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={a.banner} alt="" className="absolute inset-0 h-full w-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b12] via-[#0b0b12]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b0b12] via-[#0b0b12]/60 to-transparent" />

          <div className="relative mx-auto flex h-full max-w-6xl items-end justify-between gap-8 px-6 pb-16">
            <div className="max-w-xl">
              <span className="mb-3 inline-block rounded bg-pink-500 px-2 py-0.5 text-xs font-semibold">
                #{i + 1} Spotlight
              </span>
              <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">{a.title}</h1>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-neutral-300">
                {a.year && <span className="rounded bg-white/10 px-2 py-1">{a.year}</span>}
                <span className="rounded bg-white/10 px-2 py-1">
                  {a.status === "RELEASING" ? "Airing" : "Completed"}
                </span>
                <span className="rounded bg-white/10 px-2 py-1">{a.episodes} eps</span>
                {a.genres.slice(0, 3).map((g) => (
                  <span key={g} className="rounded bg-white/10 px-2 py-1">
                    {g}
                  </span>
                ))}
              </div>

              {a.synopsis && (
                <p className="mt-4 line-clamp-3 text-sm text-neutral-300">{a.synopsis}</p>
              )}

              <div className="mt-6 flex gap-3">
                <Link
                  href={`/watch/${a.slug}/1`}
                  className="rounded-full bg-pink-500 px-7 py-3 text-sm font-semibold hover:bg-pink-400"
                >
                  ▶ Watch Now
                </Link>
                <Link
                  href={`/anime/${a.slug}`}
                  className="rounded-full bg-white/10 px-7 py-3 text-sm font-semibold backdrop-blur hover:bg-white/20"
                >
                  Details
                </Link>
              </div>
            </div>

            {a.poster && (
              <div className="hidden w-52 shrink-0 overflow-hidden rounded-xl shadow-2xl ring-1 ring-white/10 md:block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={a.poster} alt={a.title} className="aspect-[2/3] w-full object-cover" />
              </div>
            )}
          </div>
        </div>
      ))}

      {items.length > 1 && (
        <>
          <button
            aria-label="Previous"
            onClick={() => go(index - 1)}
            className="absolute left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 rounded-full bg-black/40 text-lg hover:bg-pink-500 md:block"
          >
            ‹
          </button>
          <button
            aria-label="Next"
            onClick={() => go(index + 1)}
            className="absolute right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 rounded-full bg-black/40 text-lg hover:bg-pink-500 md:block"
          >
            ›
          </button>
          <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
            {items.map((a, i) => (
              <button
                key={a.id}
                aria-label={`Go to ${a.title}`}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-8 bg-pink-500" : "w-3 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}