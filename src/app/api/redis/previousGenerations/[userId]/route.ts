import { kv } from "@vercel/kv";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  const { userId } = params;

  try {
    // Fetch the HSET for the given userId
    const result = await kv.hgetall(userId);

    const data = result
      ? Object.entries(result).map(([key, value]) => ({
          [key]: value,
        }))
      : [];

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error fetching HSET data:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
