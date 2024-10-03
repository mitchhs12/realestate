import { request } from "http";
import { Currency } from "lucide-react";
import { NextRequest, NextResponse } from "next/server";
import { Stripe } from "stripe";

export async function POST(request: NextRequest) {
  try {
    const { currency, amount, homeId } = await request.json();
    const stripe = new Stripe(process.env.STRIPE_TEST_SECRET_KEY as string);

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
      return_url: `${request.headers.get("origin")}/checkout`,
    });

    return NextResponse.json({ id: session.id, clientSecret: session.client_secret });
  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
