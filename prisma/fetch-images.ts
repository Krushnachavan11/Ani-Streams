import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const QUERY = `
query ($search: String) {
  Media(search: $search, type: ANIME, format: TV, sort: POPULARITY_DESC) {
    id
    title { romaji english }
    coverImage { extraLarge }
    bannerImage
  }
}`;

async function main() {
  const animeList = await prisma.anime.findMany();

  for (const a of animeList) {
    const res = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ query: QUERY, variables: { search: a.title } }),
    });
    const json = await res.json();
    const m = json?.data?.Media;

    if (!m) {
      console.log(`No result for ${a.title}`);
      continue;
    }

    await prisma.anime.update({
      where: { id: a.id },
      data: {
        anilistId: m.id,
        poster: m.coverImage?.extraLarge ?? null,
        banner: m.bannerImage ?? null,
      },
    });

    console.log(
      `${a.title} -> ${m.title.english ?? m.title.romaji} (id ${m.id}), banner: ${m.bannerImage ? "yes" : "no"}`
    );
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());