import { NextResponse } from "next/server";
import { getSources } from "@/lib/data";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return NextResponse.json({ sources: await getSources(id) });
}
