import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";

interface Prediction {
  createdAt: string;
  status: string;
  originalImg: string;
  generatedImg?: string;
  completedAt?: string;
  cancelUrl?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Extract necessary details from the webhook payload
    const { id, created_at, completed_at, status, output, error, input, urls } = body;

    if (!id) {
      return NextResponse.json({ detail: "Missing prediction ID in webhook payload" }, { status: 400 });
    }

    // Save the completed prediction output
    let predictionData: Prediction = {
      createdAt: created_at,
      status: status,
      originalImg: input.image,
    };

    // Handle the different events
    if (status === "starting") {
      console.log("STARTED!!!");
    } else if (status === "processing") {
      predictionData = {
        ...predictionData,
        cancelUrl: urls.cancel,
      };
      console.log("PROCESSING!!!");
    } else if (status === "succeeded") {
      console.log("COMPLETED!!!");
      predictionData = {
        ...predictionData,
        generatedImg: output[1],
        completedAt: completed_at,
      };
    } else if (status === "failed") {
      console.log("ERROR!!!");
      predictionData = {
        ...predictionData,
        completedAt: completed_at,
      };
    } else if (status === "canceled") {
      console.log("CANCELED!!!");
    }

    await kv.hset(input.userId, {
      [id]: JSON.stringify(predictionData),
    });

    await kv.expire(input.userId, 3600);

    return NextResponse.json({ detail: "Webhook processed successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json({ detail: "Internal server error" }, { status: 500 });
  }
}
