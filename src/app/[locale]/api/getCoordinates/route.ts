import { CoordinatesType } from "@/lib/validations";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  const params = await req.json();

  const AWS_LOCATION_SERVICE_ENDPOINT = process.env.AWS_LOCATION_SERVICE_ENDPOINT;
  const INDEX_NAME = process.env.AWS_LOCATION_INDEX_NAME;
  const API_KEY = process.env.AWS_MAPS_API_KEY; // Replace with your API key
  const language = "en";

  try {
    const response = await fetch(
      `${AWS_LOCATION_SERVICE_ENDPOINT}/places/v0/indexes/${INDEX_NAME}/places/${params.placeId}?key=${API_KEY}&language=${language}`
    );
    const fullResponse = await response.json();
    const longLatArray = fullResponse.Place.Geometry.Point;
    const coordinates: CoordinatesType = { lat: longLatArray[1], long: longLatArray[0] };
    return NextResponse.json(coordinates, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
