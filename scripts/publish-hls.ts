import { PrismaClient } from "@prisma/client";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

try {
  (process as unknown as { loadEnvFile?: () => void }).loadEnvFile?.();
} catch {}

const {
  R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET,
  R2_PUBLIC_URL,
  S3_ENDPOINT,
  S3_REGION,
} = process.env;

const endpoint =
  S3_ENDPOINT ??
  (R2_ACCOUNT_ID ? `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com` : undefined);

if (!endpoint || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET || !R2_PUBLIC_URL) {
  console.log("Missing storage values in .env");
  process.exit(1);
}

const BUCKET: string = R2_BUCKET;
const PUBLIC_URL: string = R2_PUBLIC_URL.replace(/\/$/, "");

const prisma = new PrismaClient();

const s3 = new S3Client({
  region: S3_REGION ?? "auto",
  endpoint,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

const TYPES: Record<string, string> = {
  ".m3u8": "application/vnd.apple.mpegurl",
  ".ts": "video/mp2t",
};

async function publishEpisode(slug: string, number: number) {
  const dir = path.join(process.cwd(), "public", "videos", slug, `ep${number}`);
  if (!existsSync(path.join(dir, "index.m3u8"))) {
    console.log(`Episode ${number}: no local HLS files, skipping`);
    return;
  }

  const episode = await prisma.episode.findFirst({
    where: { number, anime: { slug } },
  });
  if (!episode) {
    console.log(`Episode ${number}: not in database, skipping`);
    return;
  }

  const files = readdirSync(dir);
  console.log(`Episode ${number}: uploading ${files.length} files...`);

  for (let i = 0; i < files.length; i += 8) {
    await Promise.all(
      files.slice(i, i + 8).map((f) => {
        const ext = path.extname(f);
        return s3.send(
          new PutObjectCommand({
            Bucket: BUCKET,
            Key: `${slug}/ep${number}/${f}`,
            Body: readFileSync(path.join(dir, f)),
            ContentType: TYPES[ext] ?? "application/octet-stream",
            CacheControl: ext === ".m3u8" ? "public, max-age=300" : "public, max-age=31536000",
          })
        );
      })
    );
  }

  const url = `${PUBLIC_URL}/${slug}/ep${number}/index.m3u8`;
  await prisma.source.deleteMany({ where: { episodeId: episode.id } });
  await prisma.source.create({
    data: { episodeId: episode.id, kind: "hls", url, type: "sub", quality: "auto" },
  });
  console.log(`Episode ${number}: live -> ${url}`);
}

async function main() {
  const [slug, epArg] = process.argv.slice(2);
  if (!slug) {
    console.log("Usage: npx tsx scripts/publish-hls.ts <slug> [episode]");
    process.exit(1);
  }

  if (epArg) {
    await publishEpisode(slug, Number(epArg));
    return;
  }

  const base = path.join(process.cwd(), "public", "videos", slug);
  if (!existsSync(base)) {
    console.log(`No local folder: ${base}`);
    process.exit(1);
  }
  const numbers = readdirSync(base)
    .map((d) => d.match(/^ep(\d+)$/)?.[1])
    .filter((n): n is string => Boolean(n))
    .map(Number)
    .sort((a, b) => a - b);

  for (const n of numbers) await publishEpisode(slug, n);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());