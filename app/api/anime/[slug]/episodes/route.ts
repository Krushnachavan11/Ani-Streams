import { NextResponse } from "next/server";
import { getEpisodes } from "@/lib/data";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const episodes = await getEpisodes(slug);
  if (episodes.length === 0)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ episodes });
}
