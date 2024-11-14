import { NextResponse, NextRequest } from "next/server";
import Replicate from "replicate";
import { kv } from "@vercel/kv";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY,
});

export async function POST(request: NextRequest) {
  if (!process.env.REPLICATE_API_KEY) {
    return NextResponse.json({ detail: "REPLICATE_API_KEY is not set." }, { status: 500 });
  }

  const { imageUrl, room, theme } = await request.json();

  const options: any = {
    version: "854e8727697a057c525cdb45ab037f64ecca770a1769cc52287c2e56472a247b",
    input: {
      image: imageUrl,
      prompt: `a ${theme.toLowerCase()} ${room.toLowerCase()}`,
      a_prompt:
        "best quality, extremely detailed, photo from Pinterest, interior, cinematic photo, ultra-detailed, ultra-realistic, award-winning",
      n_prompt:
        "longbody, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality",
    },
  };

  const prediction = await replicate.predictions.create(options);

  if (prediction?.error) {
    return NextResponse.json({ detail: prediction.error }, { status: 500 });
  }

  // Store the initial prediction status as "pending"
  await kv.set(`prediction:${prediction.id}`, { status: "pending" }, { ex: 86400 }); // 1-day expiration

  return NextResponse.json(prediction, { status: 201 });
}
