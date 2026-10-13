# AniStream

A full-stack anime streaming platform built with **Next.js 16**, featuring HLS video playback, resumable watching, and a database-driven catalog.

**Live demo:** https://ani-streams-vcnf.vercel.app

![Home](docs/screenshots/home.png)

| Anime detail | Watch page |
|---|---|
| ![Detail](docs/screenshots/detail.png) | ![Watch](docs/screenshots/watch.png) |

## Features

- **Home page** with an auto-rotating hero slider, a "Now Airing" row and a poster grid
- **Anime detail pages** with metadata, genres and an episode grid
- **HLS streaming** with `hls.js` (native playback on Safari) and YouTube embed support
- **Continue Watching**: playback progress is saved and resumes where you left off
- **My List**: bookmark anime, stored in the browser
- **REST API** for anime, episodes and video sources
- **Catalog tooling**: CLI scripts that import anime from the AniList API and convert/upload video to HLS

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Cache Components), React, TypeScript |
| Styling | Tailwind CSS |
| Database | PostgreSQL (Neon) with Prisma ORM |
| Video | HLS (ffmpeg), hls.js, S3-compatible object storage (Backblaze B2) |
| Data source | AniList GraphQL API (metadata and artwork) |
| Hosting | Vercel |

## Architecture

```
Browser ──► Next.js on Vercel ──► Neon Postgres (anime, episodes, sources)
   │              │
   │              └─ cached server components ("use cache", revalidated every minute)
   │
   └──► HLS stream (.m3u8 + .ts segments) from Backblaze B2 via hls.js
```

- Pages are prerendered and cached with `"use cache"`, so most requests never hit the database.
- A `Source` table stores each episode's video as a link (HLS URL or YouTube ID), so the player is independent of where the video is hosted.
- Watch progress and the watchlist live in `localStorage`, so no login is needed.

## Data model

`Anime` → has many `Episode` → has many `Source` (kind: `hls` | `youtube`, url, type, quality)

## Run locally

```bash
git clone https://github.com/YOUR-USERNAME/anime-stream.git
cd anime-stream
npm install
```

Create `.env` with your Postgres connection strings:

```
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
```

```bash
npx prisma migrate dev
npx prisma db seed
npm run dev
```

## Catalog scripts

```bash
# import anime (metadata, artwork, episodes) from AniList
npx tsx scripts/add-popular.ts --titles "Death Note, Naruto"

# convert a folder of videos to HLS and link them to episodes
npx tsx scripts/add-folder.ts <slug> "<folder>"

# upload converted HLS to object storage and update the database
npx tsx scripts/publish-hls.ts <slug> [episode]
```

## Roadmap

Search and genre browsing, subtitles and quality selection, user accounts with synced watchlists.

## Notes

This is a portfolio project. Anime metadata and artwork come from AniList. Video content is limited to trailers and sample or self-owned clips. It is not affiliated with any anime studio or streaming service.