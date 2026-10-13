
import { PrismaClient } from "@prisma/client";
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";

const prisma = new PrismaClient();

async function main() {
  const [slug, epArg, input] = process.argv.slice(2);
  const number = Number(epArg);

  if (!slug || !Number.isInteger(number) || !input) {
    console.log('Usage:');
    console.log('  npx tsx scripts/add-video.ts <slug> <episode> "<path-to-video>"');
    console.log("  npx tsx scripts/add-video.ts <slug> <episode> yt:<youtubeId>");
    process.exit(1);
  }

  const episode = await prisma.episode.findFirst({
    where: { number, anime: { slug } },
  });
  if (!episode) {
    console.log(`Episode ${number} of "${slug}" not found`);
    process.exit(1);
  }

  // YouTube embed (e.g. an official trailer)
  if (input.startsWith("yt:")) {
    await prisma.source.deleteMany({ where: { episodeId: episode.id } });
    await prisma.source.create({
      data: { episodeId: episode.id, kind: "youtube", youtubeId: input.slice(3) },
    });
    console.log(`Done: ${slug} episode ${number} -> YouTube ${input.slice(3)}`);
    return;
  }

  // Local video file -> HLS
  const outDir = path.join(process.cwd(), "public", "videos", slug, `ep${number}`);
  mkdirSync(outDir, { recursive: true });

  console.log("Converting to HLS (this can take a while)...");
  execFileSync(
    "ffmpeg",
    [
      "-y",
      "-i", input,
      "-c:v", "libx264",
      "-c:a", "aac",
      "-hls_time", "10",
      "-hls_list_size", "0",
      "-f", "hls",
      path.join(outDir, "index.m3u8"),
    ],
    { stdio: "inherit" }
  );

  const url = `/videos/${slug}/ep${number}/index.m3u8`;
  await prisma.source.deleteMany({ where: { episodeId: episode.id } });
  await prisma.source.create({
    data: { episodeId: episode.id, kind: "hls", url, type: "sub", quality: "auto" },
  });
  console.log(`Done: ${slug} episode ${number} -> ${url}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());