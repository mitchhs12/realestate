import { CoordinatesType } from "@/lib/validations";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  const params = await req.json();

  const AWS_LOCATION_SERVICE_ENDPOINT = process.env.AWS_LOCATION_SERVICE_ENDPOINT;
  const INDEX_NAME = process.env.AWS_LOCATION_INDEX_NAME;
  const API_KEY = process.env.AWS_MAPS_API_KEY; // Replace with your API key
  const language = "en";

  let [longitude, latitude] = params.longLatArray;

  // Adjust latitude if it is out of range
  if (latitude > 90) {
    latitude = 90 - (latitude - 90);
  } else if (latitude < -90) {
    latitude = -90 - (latitude + 90);
  }

  // Adjust longitude if it is out of range
  if (longitude > 180) {
    longitude = longitude - 360;
  } else if (longitude < -180) {
    longitude = longitude + 360;
  }

  try {
    const response = await fetch(
      `${AWS_LOCATION_SERVICE_ENDPOINT}/places/v0/indexes/${INDEX_NAME}/search/position?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Position: [longitude, latitude], MaxResults: 1, language: language }),
      }
    );

    const fullResponse = await response.json();
    return NextResponse.json(
      { location: [longitude, latitude], results: fullResponse.Results[0].Place },
      { status: 200 }
    );
  } catch (error) {
    console.log("error", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
