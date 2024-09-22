import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";

async function POST(req: NextRequest) {
  const { homeid } = await req.json();

  if (!homeid) {
    return NextResponse.json({ error: "homeid is required" });
  }

  try {
    const key = `home:viewcount:${homeid}`;
    await kv.incr(key);
    const viewCount = await kv.get(key);
    NextResponse.json({ homeid, viewCount });
  } catch (error) {
    console.error("Error incrementing view count:", error);
    NextResponse.json({ error: "Failed to update view count" });
  }
}
