import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import VideoPlayer from "@/components/VideoPlayer";
import { getAllEpisodeParams, getEpisodes, getWatchData } from "@/lib/data";

export async function generateStaticParams() {
  return getAllEpisodeParams();
}

type Params = Promise<{ slug: string; ep: string }>;

export default function WatchPage({ params }: { params: Params }) {
  return (
    <Suspense fallback={<WatchSkeleton />}>
      <WatchContent params={params} />
    </Suspense>
  );
}

function WatchSkeleton() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-6">
      <div className="aspect-video w-full animate-pulse rounded-lg bg-white/5" />
    </main>
  );
}

async function WatchContent({ params }: { params: Params }) {
  const { slug, ep } = await params;
  const number = Number(ep);
  if (!Number.isInteger(number)) notFound();

  const [data, episodes] = await Promise.all([
    getWatchData(slug, number),
    getEpisodes(slug),
  ]);
  if (!data) notFound();

  const { episode, total } = data;
  const base = `/watch/${slug}`;

  return (
    <main className="mx-auto max-w-6xl px-6 py-6">
      <Link
        href={`/anime/${slug}`}
        className="text-sm text-neutral-400 hover:text-pink-400"
      >
        ← {episode.anime.title}
      </Link>

      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_300px]">
        <div>
          <VideoPlayer
            key={episode.id}
            sources={episode.sources}
            meta={{
              slug,
              title: episode.anime.title,
              poster: episode.anime.poster,
              episode: episode.number,
            }}
          />
          <h1 className="mt-4 text-xl font-bold">
            {episode.anime.title} — Episode {episode.number}
          </h1>

          <div className="mt-4 flex gap-3">
            {number > 1 ? (
              <Link
                href={`${base}/${number - 1}`}
                className="rounded-full bg-white/10 px-5 py-2 text-sm hover:bg-white/20"
              >
                ← Prev
              </Link>
            ) : null}
            {number < total ? (
              <Link
                href={`${base}/${number + 1}`}
                className="rounded-full bg-pink-500 px-5 py-2 text-sm font-semibold hover:bg-pink-400"
              >
                Next →
              </Link>
            ) : null}
          </div>
        </div>

        <aside className="max-h-[70vh] overflow-y-auto rounded-lg bg-white/5 p-3">
          <h2 className="mb-2 text-sm font-semibold text-neutral-300">Episodes</h2>
          <div className="grid grid-cols-5 gap-2 lg:grid-cols-4">
            {episodes.map((e) => (
              <Link
                key={e.id}
                href={`${base}/${e.number}`}
                className={`rounded py-2 text-center text-sm ${e.number === number
                    ? "bg-pink-500 font-semibold"
                    : "bg-white/5 hover:bg-white/10"
                  }`}
              >
                {e.number}
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </main>
  );
}