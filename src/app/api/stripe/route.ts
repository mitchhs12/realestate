import { NextRequest, NextResponse } from "next/server";
import { formatPrice } from "@/lib/utils";
import stripe from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const { currency, planId, interval, accountId, accountEmail } = (await request.json()) as {
      currency: string;
      planId: "starter" | "pro" | "premium" | "business" | "basic" | "insight" | "max";
      interval: "year" | "month";
      accountId: string;
      accountEmail: string | null;
    };

    const map = {
      starter: {
        price: 19,
        "yearly-total-price": 99,
      },
      pro: {
        price: 39,
        "yearly-total-price": 199,
      },
      premium: {
        price: 99,
        "yearly-total-price": 499,
      },
      business: {
        price: 299,
        "yearly-total-price": 1699,
      },
      basic: {
        price: 19,
        "yearly-total-price": 99,
      },
      insight: {
        price: 49,
        "yearly-total-price": 289,
      },
      max: {
        price: 299,
        "yearly-total-price": 1699,
      },
    };

    const amount = interval === "year" ? map[planId]["yearly-total-price"] * 100 : map[planId].price * 100;

    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      payment_method_types: ["card"],
      ...(accountEmail && { customer_email: accountEmail }), // Include customer_email only if accountEmail is not null
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: planId,
            },
            unit_amount: amount, // Amount in cents
            recurring: {
              interval: interval,
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      metadata: {
        accountId: accountId,
        planId: planId,
      },
      return_url: `${request.headers.get("origin")}`,
    });

    return NextResponse.json({ id: session.id, clientSecret: session.client_secret });
  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
