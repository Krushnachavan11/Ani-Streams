import { cacheLife } from "next/cache";
import { prisma } from "./prisma";

export type AnimeCard = {
  id: string;
  slug: string;
  title: string;
  year: number | null;
  status: string;
  poster: string | null;
  banner: string | null;
  synopsis: string | null;
  episodes: number;
  genres: string[];
};

const toGenres = (g: unknown): string[] => (Array.isArray(g) ? (g as string[]) : []);

export async function getHomeAnime(): Promise<AnimeCard[]> {
  "use cache";
  cacheLife("minutes");

  const rows = await prisma.anime.findMany({
    orderBy: { createdAt: "asc" },
    include: { _count: { select: { episodes: true } } },
  });
  return rows.map((a) => ({
    id: a.id,
    slug: a.slug,
    title: a.title,
    year: a.year,
    status: a.status,
    poster: a.poster,
    banner: a.banner,
    synopsis: a.synopsis,
    episodes: a._count.episodes,
    genres: toGenres(a.genres),
  }));
}

export async function getAllSlugs(): Promise<string[]> {
  "use cache";
  cacheLife("minutes");

  const rows = await prisma.anime.findMany({ select: { slug: true } });
  return rows.map((r) => r.slug);
}

export async function getAllEpisodeParams() {
  "use cache";
  cacheLife("minutes");

  const rows = await prisma.episode.findMany({
    select: { number: true, anime: { select: { slug: true } } },
  });
  return rows.map((r) => ({ slug: r.anime.slug, ep: String(r.number) }));
}

export async function getAnimeBySlug(slug: string) {
  "use cache";
  cacheLife("minutes");

  const a = await prisma.anime.findUnique({ where: { slug } });
  if (!a) return null;
  return { ...a, genres: toGenres(a.genres) };
}

export async function getEpisodes(slug: string) {
  "use cache";
  cacheLife("minutes");

  return prisma.episode.findMany({
    where: { anime: { slug } },
    orderBy: { number: "asc" },
    select: { id: true, number: true, title: true, duration: true, thumbnail: true },
  });
}

export async function getSources(episodeId: string) {
  "use cache";
  cacheLife("minutes");

  return prisma.source.findMany({ where: { episodeId } });
}

export async function getWatchData(slug: string, number: number) {
  "use cache";
  cacheLife("minutes");

  const episode = await prisma.episode.findFirst({
    where: { number, anime: { slug } },
    include: {
      sources: true,
      anime: { select: { title: true, slug: true, poster: true } },
    },
  });
  if (!episode) return null;
  const total = await prisma.episode.count({ where: { animeId: episode.animeId } });
  return { episode, total };
}