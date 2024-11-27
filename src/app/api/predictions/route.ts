import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/auth";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY,
});

const WEBHOOK_HOST = process.env.VERCEL_URL ? `https://www.vivaideal.com` : process.env.NGROK_HOST;

export async function POST(request: NextRequest) {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return NextResponse.json({ error: "User not found", accountValid: false }, { status: 404 });
  }

  const { id: userId, sellerSubscription, buyerSubscription } = user;

  console.log(sellerSubscription);
  console.log(buyerSubscription);

  if (
    !sellerSubscription ||
    !buyerSubscription ||
    (sellerSubscription && sellerSubscription !== "premium") ||
    (sellerSubscription && sellerSubscription !== "business") ||
    (buyerSubscription && buyerSubscription !== "insight") ||
    (buyerSubscription && buyerSubscription !== "max")
  ) {
    return NextResponse.json({ error: "User is not on a tier 3 plan", accountValid: false }, { status: 500 });
  }

  if (!process.env.REPLICATE_API_KEY) {
    return NextResponse.json({ error: "REPLICATE_API_KEY is not set.", accountValid: true }, { status: 500 });
  }

  const { imageUrl, isRoom, kind, style } = await request.json();
  // isRoom = "room" | "property"
  // kind = "kind of property" / "kind of room"
  // style = "style of design"

  const options: any = {
    version: "854e8727697a057c525cdb45ab037f64ecca770a1769cc52287c2e56472a247b",
    input: {
      image: imageUrl,
      prompt: `A ${kind} ${isRoom ? "room" : "property"} designed in ${style} style and with ${style} aesthetics.`,
      a_prompt: `best quality, extremely detailed, photo from Pinterest, cinematic photo, ${isRoom ? "indoor lighting accents" : "outdoor natural lighting"}, ultra-detailed, ultra-realistic, award-winning, same background`,
      n_prompt:
        "longbody, blurry, distorted edges, unrealistic proportions, bad lighting, oversaturation, overly cartoonish, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, different background",
      userId: userId,
    },
  };

  options.webhook = `${WEBHOOK_HOST}/api/webhooks/ai`;
  options.webhook_events_filter = ["start", "completed"];

  const prediction = await replicate.predictions.create(options);

  if (prediction?.error) {
    return NextResponse.json({ error: prediction.error, accountValid: true }, { status: 500 });
  }

  return NextResponse.json(prediction, { status: 201 });
}
