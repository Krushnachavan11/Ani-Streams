import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// slug -> YouTube video ID (the part after v= in the link)
const trailers: Record<string, string> = {
  "solo-leveling": "ABCDEFGHIJK",
  "kaiju-no-8": "LMNOPQRSTUV",
  "summer-time-rendering": "WXYZ1234567",
};

async function main() {
  for (const [slug, youtubeId] of Object.entries(trailers)) {
    if (!youtubeId) {
      console.log(`Skipping ${slug} (no ID filled in)`);
      continue;
    }

    const episode = await prisma.episode.findFirst({
      where: { number: 1, anime: { slug } },
    });
    if (!episode) {
      console.log(`Episode 1 of ${slug} not found`);
      continue;
    }

    await prisma.source.deleteMany({ where: { episodeId: episode.id } });
    await prisma.source.create({
      data: { episodeId: episode.id, kind: "youtube", youtubeId },
    });
    console.log(`${slug} episode 1 -> YouTube ${youtubeId}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());