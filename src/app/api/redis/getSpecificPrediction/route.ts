import { kv } from "@vercel/kv";
import { NextRequest, NextResponse } from "next/server";

// Adjusting the function to handle both userId and predictionId in the params
export async function POST(request: NextRequest) {
  const { userId, predictionId } = await request.json();

  try {
    // Fetch the HSET for the given userId
    const prediction = await kv.hget(userId, predictionId);

    if (!prediction) {
      return NextResponse.json({ error: "Prediction not found for this user" }, { status: 404 });
    } else {
      // Return the found prediction
      return NextResponse.json({ prediction });
    }
  } catch (error) {
    console.error("Error fetching prediction data:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
