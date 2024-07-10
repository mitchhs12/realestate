import { NextRequest, NextResponse } from "next/server";

const AWS_LOCATION_SERVICE_ENDPOINT = "https://places.geo.us-west-2.amazonaws.com"; // Base endpoint
const INDEX_NAME = "TestIndex";
const API_KEY = process.env.AWS_MAPS_API_KEY; // Replace with your API key

export async function POST(req: NextRequest, res: NextResponse) {
  const payload = await req.json();
  const { text, latLongArray } = payload.query;
  console.log("latLongArray", latLongArray);

  try {
    const response = await fetch(
      `${AWS_LOCATION_SERVICE_ENDPOINT}/places/v0/indexes/${INDEX_NAME}/search/suggestions?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Text: text, BiasPosition: latLongArray, MaxResults: 5 }),
      }
    );

    const fixedResponse = await response.json();
    const suggestions = fixedResponse.Results;
    console.log("suggestions", suggestions);
    return NextResponse.json({ suggestions }, { status: 200 });
  } catch (error) {
    console.error(error);
    return res;
  }
}
