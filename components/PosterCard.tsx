import Link from "next/link";
import type { AnimeCard } from "@/lib/data";

export default function PosterCard({ a }: { a: AnimeCard }) {
  return (
    <Link href={`/anime/${a.slug}`} className="group block">
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-neutral-800 ring-1 ring-white/5 transition group-hover:ring-pink-500/60">
        {a.poster ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={a.poster}
            alt={a.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center p-3 text-center text-sm text-neutral-400">
            {a.title}
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition group-hover:opacity-100">
          <span className="rounded-full bg-pink-500 px-4 py-2 text-sm font-semibold">▶ Watch</span>
        </div>

        <span className="absolute left-2 top-2 rounded bg-pink-500 px-1.5 py-0.5 text-[10px] font-bold">
          EP {a.episodes}
        </span>
        {a.status === "RELEASING" && (
          <span className="absolute right-2 top-2 rounded bg-emerald-500 px-1.5 py-0.5 text-[10px] font-bold">
            AIRING
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/80 to-transparent" />
      </div>
      <p className="mt-2 line-clamp-1 text-sm font-medium group-hover:text-pink-400">{a.title}</p>
      <p className="text-xs text-neutral-500">
        {a.year} · {a.genres[0]}
      </p>
    </Link>
  );
}