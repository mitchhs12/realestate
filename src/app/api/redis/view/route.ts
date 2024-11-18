import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // List all keys (use a proper pattern to limit the results if needed)
    const keys = await kv.keys("*");

    // Retrieve values for the keys
    const data = await Promise.all(
      keys.map(async (key) => ({
        key,
        value: await kv.get(key),
      }))
    );

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error fetching Redis data:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
