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

const BY_SEARCH = `query ($search: String) {
  Media(search: $search, type: ANIME, format: TV, sort: POPULARITY_DESC) { ${FIELDS} }
}`;
const BY_ID = `query ($id: Int) {
  Media(id: $id, type: ANIME) { ${FIELDS} }
}`;

const args = process.argv.slice(2);
const flag = (name: string) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};
const dryRun = args.includes("--dry-run");
const title = args[0] && !args[0].startsWith("--") ? args[0] : undefined;
const idArg = flag("id");

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

async function main() {
  if (!title && !idArg) {
    console.log('Usage: npx tsx scripts/add-anime.ts "<title>" [--id <anilistId>] [--episodes N] [--synopsis "text"] [--dry-run]');
    process.exit(1);
  }

  const res = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(
      idArg
        ? { query: BY_ID, variables: { id: Number(idArg) } }
        : { query: BY_SEARCH, variables: { search: title } }
    ),
  });
  const json = await res.json();
  const m = json?.data?.Media;
  if (!m) {
    console.log("No result found on AniList. Try a different title or use --id.");
    process.exit(1);
  }

  const name: string = m.title.english ?? m.title.romaji;
  const slug = slugify(name);
  const episodeCount: number =
    Number(flag("episodes")) ||
    m.episodes ||
    (m.nextAiringEpisode ? m.nextAiringEpisode.episode - 1 : 12);

  console.log(`\nMatched: ${name} (AniList id ${m.id})`);
  console.log(`Slug: ${slug}`);
  console.log(`Studio: ${m.studios.nodes[0]?.name ?? "-"}  Year: ${m.seasonYear ?? "-"}  Status: ${m.status}`);
  console.log(`Genres: ${m.genres.join(", ")}`);
  console.log(`Episodes: ${episodeCount}`);
  console.log(`Poster: ${m.coverImage?.extraLarge ? "yes" : "no"}  Banner: ${m.bannerImage ? "yes" : "no"}`);

  if (dryRun) {
    console.log("\nDry run only, nothing saved.");
    return;
  }

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
    ...(flag("synopsis") ? { synopsis: flag("synopsis") } : {}),
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
      create: {
        animeId: anime.id,
        number: n,
        title: `Episode ${n}`,
        duration: m.duration ?? null,
      },
    });
  }

  console.log(`\nSaved "${name}" with ${episodeCount} episodes.`);
  console.log(`Next: add videos with  npx tsx scripts/add-folder.ts ${slug} "<folder>"`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());