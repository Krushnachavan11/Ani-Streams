import { PrismaClient } from "@prisma/client";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync } from "node:fs";
import path from "node:path";

const prisma = new PrismaClient();
const VIDEO_EXT = new Set([".mp4", ".mkv", ".webm", ".mov", ".avi", ".m4v"]);

// "ep3.mp4", "Episode 03.mkv", "S01E03.mp4", "3.mp4" -> 3
function episodeNumber(file: string): number | null {
  const name = path.parse(file).name;
  const tagged = name.match(/(?:^|[^a-z])(?:e|ep|episode)[\s._-]*(\d{1,3})(?!\d)/i);
  if (tagged) return Number(tagged[1]);
  const plain = name.match(/(?<!\d)(\d{1,3})(?!\d)/);
  return plain ? Number(plain[1]) : null;
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const skipExisting = args.includes("--skip-existing");
  const [slug, folder] = args.filter((a) => !a.startsWith("--"));

  if (!slug || !folder) {
    console.log('Usage: npx tsx scripts/add-folder.ts <slug> "<folder>" [--dry-run] [--skip-existing]');
    process.exit(1);
  }

  const anime = await prisma.anime.findUnique({ where: { slug } });
  if (!anime) {
    console.log(`Anime "${slug}" not found`);
    process.exit(1);
  }

  const items = readdirSync(folder)
    .filter((f) => VIDEO_EXT.has(path.extname(f).toLowerCase()))
    .map((file) => ({ file, number: episodeNumber(file) }));

  console.log("\nDetected episodes:");
  for (const i of items) console.log(`  ${i.number ?? "??"}  <-  ${i.file}`);

  const unknown = items.filter((i) => i.number === null);
  const numbers = items.filter((i) => i.number !== null).map((i) => i.number);
  const hasDuplicates = new Set(numbers).size !== numbers.length;

  if (unknown.length || hasDuplicates) {
    console.log("\nSome files have no episode number or two files share one.");
    console.log("Rename them like ep1.mp4, ep2.mp4 ... and run again.");
    process.exit(1);
  }
  if (dryRun) {
    console.log("\nDry run only, nothing converted.");
    return;
  }

  items.sort((a, b) => a.number! - b.number!);

  for (const { file, number } of items) {
    const episode = await prisma.episode.findFirst({
      where: { animeId: anime.id, number: number! },
    });
    if (!episode) {
      console.log(`\nSkipping ${file}: episode ${number} not in database`);
      continue;
    }

    const outDir = path.join(process.cwd(), "public", "videos", slug, `ep${number}`);
    const playlist = path.join(outDir, "index.m3u8");
    mkdirSync(outDir, { recursive: true });

    if (skipExisting && existsSync(playlist)) {
      console.log(`\nEpisode ${number}: already converted, skipping`);
    } else {
      console.log(`\nEpisode ${number}: converting ${file} ...`);
      execFileSync(
        "ffmpeg",
        [
          "-y",
          "-i", path.join(folder, file),
          "-map", "0:v:0",
          "-map", "0:a:0?",
          "-c:v", "libx264",
          "-preset", "veryfast",
          "-c:a", "aac",
          "-hls_time", "10",
          "-hls_list_size", "0",
          "-f", "hls",
          playlist,
        ],
        { stdio: "inherit" }
      );
    }

    const url = `/videos/${slug}/ep${number}/index.m3u8`;
    await prisma.source.deleteMany({ where: { episodeId: episode.id } });
    await prisma.source.create({
      data: { episodeId: episode.id, kind: "hls", url, type: "sub", quality: "auto" },
    });
    console.log(`Episode ${number}: linked -> ${url}`);
  }

  console.log("\nAll done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());