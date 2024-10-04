import { NextRequest, NextResponse } from "next/server";
import stripe from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const { currency, amount, homeId } = await request.json();
    console.log("homeId", homeId);
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: "Premium",
            },
            unit_amount: amount, // Amount in cents
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      metadata: {
        homeId: homeId,
      },
      return_url: `${request.headers.get("origin")}/sell/checkout`,
    });

    return NextResponse.json({ id: session.id, clientSecret: session.client_secret });
  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
