import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");
    const sessionToken = searchParams.get("sessionToken"); // Get session token from query parameters
    console.log("Query:", query);
    console.log("Session Token:", sessionToken);

    if (!query || !sessionToken) {
      console.log("Query and sessionToken parameters are required");
      return NextResponse.json({ error: "Query and sessionToken parameters are required" }, { status: 400 });
    }
    const url = `https://places.googleapis.com/v1/places:autocomplete`;

    const apiResponse = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": process.env.MAPS_API_KEY!,
      },
      body: JSON.stringify({
        input: query,
        sessionToken: sessionToken,
        includeQueryPredictions: false,
      }),
    });

    const response = await apiResponse.json();
    const data = response.suggestions;
    console.log("The data:", data);
    return NextResponse.json({ data }, { status: apiResponse.status });
  } catch (error) {
    console.log("Error fetching suggestions:", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
