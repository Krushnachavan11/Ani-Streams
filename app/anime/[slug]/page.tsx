import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllSlugs, getAnimeBySlug, getEpisodes } from "@/lib/data";
import WatchlistButton from "@/components/WatchlistButton";

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function AnimePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [anime, episodes] = await Promise.all([getAnimeBySlug(slug), getEpisodes(slug)]);
  if (!anime) notFound();

  return (
    <main>
      <div className="relative h-64 w-full overflow-hidden bg-gradient-to-br from-purple-900/60 to-[#0b0b12]">
        {anime.banner && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={anime.banner} alt="" className="h-full w-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b12] to-transparent" />
      </div>

      <div className="relative mx-auto -mt-32 max-w-6xl px-6 pb-12">
        <div className="flex flex-col gap-6 md:flex-row">
          <div className="aspect-[2/3] w-44 shrink-0 overflow-hidden rounded-lg bg-neutral-800 ring-1 ring-white/10">
            {anime.poster && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={anime.poster} alt={anime.title} className="h-full w-full object-cover" />
            )}
          </div>

          <div className="md:pt-24">
            <h1 className="text-3xl font-extrabold">{anime.title}</h1>
            {anime.titleJapanese && (
              <p className="text-sm text-neutral-500">{anime.titleJapanese}</p>
            )}
            <p className="mt-2 text-sm text-neutral-400">
              {anime.studio} · {anime.year} · {anime.status}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {anime.genres.map((g) => (
                <span
                  key={g}
                  className="rounded-full bg-white/10 px-3 py-1 text-xs text-neutral-200"
                >
                  {g}
                </span>
              ))}
            </div>
            {anime.synopsis && (
              <p className="mt-4 max-w-2xl text-sm text-neutral-300">{anime.synopsis}</p>
            )}
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href={`/watch/${anime.slug}/1`}
                className="rounded-full bg-pink-500 px-6 py-2.5 text-sm font-semibold hover:bg-pink-400"
              >
                ▶ Watch Episode 1
              </Link>
              <WatchlistButton
                item={{
                  slug: anime.slug,
                  title: anime.title,
                  poster: anime.poster,
                  year: anime.year,
                }}
              />
            </div>
          </div>
        </div>

        <h2 className="mb-4 mt-10 border-l-4 border-pink-500 pl-3 text-lg font-bold">
          Episodes ({episodes.length})
        </h2>
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-10">
          {episodes.map((ep) => (
            <Link
              key={ep.id}
              href={`/watch/${anime.slug}/${ep.number}`}
              className="rounded bg-white/5 py-2 text-center text-sm hover:bg-pink-500"
            >
              {ep.number}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}