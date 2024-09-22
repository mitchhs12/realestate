import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";

// Handle GET request
async function GET(req: Request) {
  const { homeid } = await req.json();

  if (!homeid) {
    return NextResponse.json({ error: "homeid is required" });
  }

  try {
    const key = `home:viewcount:${homeid}`;
    const viewCount = await kv.get(key);
    NextResponse.json({ homeid, viewCount });
  } catch (error) {
    console.error("Error retrieving view count:", error);
    NextResponse.json({ error: "Failed to retrieve view count" });
  }
}
