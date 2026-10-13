import { NextResponse } from "next/server";
import { getAnimeBySlug } from "@/lib/data";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const anime = await getAnimeBySlug(slug);
  if (!anime) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(anime);
}
