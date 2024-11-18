import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // List all keys (use a proper pattern to limit the results if needed)
    const keys: string[] = await kv.keys("*");

    for (const key of keys) {
      await kv.del(key);
    }

    return NextResponse.json({ message: "Redis datastore cleared successfully." });
  } catch (error) {
    console.error("Error fetching Redis data:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
