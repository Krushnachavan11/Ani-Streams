import { NextResponse } from "next/server";
import { getHomeAnime } from "@/lib/data";

export async function GET() {
  return NextResponse.json({ anime: await getHomeAnime() });
}
