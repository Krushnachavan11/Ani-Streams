import { PrismaClient } from "@prisma/client";
import { animeSeed } from "./seed-data";

const prisma = new PrismaClient();

// Placeholder test stream (Big Buck Bunny). Replace with your own HLS URL later.
const SAMPLE_HLS = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";

async function main() {
  for (const { episodeCount, ...data } of animeSeed) {
    const anime = await prisma.anime.upsert({
      where: { slug: data.slug },
      update: data,
      create: data,
    });

    for (let n = 1; n <= episodeCount; n++) {
      await prisma.episode.upsert({
        where: { animeId_number: { animeId: anime.id, number: n } },
        update: {},
        create: { animeId: anime.id, number: n, title: `Episode ${n}` },
      });
    }

    if (data.slug === "solo-leveling") {
      const eps = await prisma.episode.findMany({
        where: { animeId: anime.id, number: { lte: 3 } },
      });
      for (const ep of eps) {
        await prisma.source.deleteMany({ where: { episodeId: ep.id } });
        await prisma.source.create({
          data: {
            episodeId: ep.id,
            kind: "hls",
            url: SAMPLE_HLS,
            type: "sub",
            quality: "auto",
          },
        });
      }
    }

    console.log(`Seeded ${anime.title} (${episodeCount} episodes)`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());