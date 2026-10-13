import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const FIELDS = `
  id
  title { romaji english native }
  studios(isMain: true) { nodes { name } }
  seasonYear
  status
  genres
  episodes
  duration
  nextAiringEpisode { episode }
  coverImage { extraLarge }
  bannerImage
`;

const TOP_QUERY = `query ($perPage: Int) {
  Page(page: 1, perPage: $perPage) {
    media(type: ANIME, format: TV, sort: POPULARITY_DESC, isAdult: false) { ${FIELDS} }
  }
}`;

const SEARCH_QUERY = `query ($search: String) {
  Media(search: $search, type: ANIME, format: TV, sort: POPULARITY_DESC, isAdult: false) { ${FIELDS} }
}`;

const args = process.argv.slice(2);
const flag = (name: string) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};
const dryRun = args.includes("--dry-run");
const count = Math.min(Number(flag("count")) || 10, 50);
const maxEpisodes = Number(flag("max-episodes")) || 26;
const titles = flag("titles")
  ?.split(",")
  .map((t) => t.trim())
  .filter(Boolean);

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

async function anilist(query: string, variables: Record<string, unknown>) {
  const res = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  return res.json();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function save(m: any) {
  const name: string = m.title.english ?? m.title.romaji;
  const slug = slugify(name);
  const total: number =
    m.episodes || (m.nextAiringEpisode ? m.nextAiringEpisode.episode - 1 : 12);
  const episodeCount = Math.max(1, Math.min(total, maxEpisodes));

  console.log(`${name}  [${slug}]  ${episodeCount}/${total} episodes`);
  if (dryRun) return;

  const data = {
    title: name,
    titleJapanese: m.title.native ?? null,
    studio: m.studios.nodes[0]?.name ?? null,
    year: m.seasonYear ?? null,
    status: m.status === "RELEASING" ? "RELEASING" : "FINISHED",
    genres: m.genres,
    poster: m.coverImage?.extraLarge ?? null,
    banner: m.bannerImage ?? null,
    anilistId: m.id,
  };

  const anime = await prisma.anime.upsert({
    where: { slug },
    update: data,
    create: { slug, ...data },
  });

  for (let n = 1; n <= episodeCount; n++) {
    await prisma.episode.upsert({
      where: { animeId_number: { animeId: anime.id, number: n } },
      update: {},
      create: { animeId: anime.id, number: n, title: `Episode ${n}`, duration: m.duration ?? null },
    });
  }
}

async function main() {
  let media: unknown[] = [];

  if (titles?.length) {
    for (const t of titles) {
      const json = await anilist(SEARCH_QUERY, { search: t });
      if (json?.data?.Media) media.push(json.data.Media);
      else console.log(`No result for "${t}"`);
    }
  } else {
    const json = await anilist(TOP_QUERY, { perPage: count });
    media = json?.data?.Page?.media ?? [];
  }

  if (media.length === 0) {
    console.log("Nothing found.");
    process.exit(1);
  }

  console.log(`\n${dryRun ? "Preview" : "Adding"} ${media.length} anime:\n`);
  for (const m of media) await save(m);

  console.log(dryRun ? "\nDry run only, nothing saved." : "\nDone. Restart npm run dev to see them.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());