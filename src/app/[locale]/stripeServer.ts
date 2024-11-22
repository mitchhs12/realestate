"use server";

import stripeClient from "@/lib/stripe";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import Stripe from "stripe";
import { revalidatePath } from "next/cache";

export async function StripeServer(
  currency: string,
  planId: "starter" | "pro" | "premium" | "business" | "basic" | "insight" | "max",
  interval: "year" | "month"
) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      throw new Error("Unauthorized");
    }
    let user: any = session.user;

    const yearlyMap = {
      starter: "prod_RGLO3eC3u8UV4g",
      pro: "prod_RGLPk0aTA0eQNj",
      premium: "prod_RGLQnQkrHVRdNI",
      business: "prod_RGLR20Cw48qjAm",
      basic: "prod_RGLSfdHUPIXMQr",
      insight: "prod_RGLTYBAcedO7yK",
      max: "prod_RGLTynXTLL7rso",
    };

    const monthlyMap = {
      starter: "prod_RGLNV8JyUl0O08",
      pro: "prod_RGLPUgIDaZDALY",
      premium: "prod_RGLQXLsK3K4DPO",
      business: "prod_RGLRJjGAvhr2Vk",
      basic: "prod_RGLS9MYuC36eCc",
      insight: "prod_RGLSF2ZUemii2K",
      max: "prod_RGLTf9kzcyw8jd",
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

    if (!user || !user.id) {
      throw new Error("User not found");
    }

    if (!user.customerId) {
      // Create a new customer
      const customer = await stripeClient.customers.create({
        email: user.email || undefined,
        metadata: {
          userId: user.id!,
        },
      });
      // Update the user with the new Stripe customer id
      user = await prisma.user.update({
        where: { id: user.id },
        data: { customerId: customer.id },
      });
    }

    if (!user.customerId) {
      throw new Error("Customer not found");
    }

    // Create Subscription
    const subscription = await stripeClient.subscriptions.create({
      customer: user.customerId,
      items: [
        {
          price_data: {
            currency: currency,
            product: interval === "year" ? yearlyMap[planId] : monthlyMap[planId],
            unit_amount: amount, // Amount in cents
            recurring: {
              interval: interval,
            },
          },
          quantity: 1,
        },
      ],
      currency: currency,
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payment_intent"],
      metadata: {
        accountId: user.id,
        planId: planId,
      },
    });

    const latestInvoice = subscription.latest_invoice as Stripe.Invoice;

    const paymentIntent = latestInvoice.payment_intent as Stripe.PaymentIntent;

    const clientSecret = paymentIntent.client_secret;

    return {
      subscriptionId: subscription.id,
      clientSecret: clientSecret,
    };

    // const session = await stripe.checkout.sessions.create({
    //   ui_mode: "embedded",
    //   payment_method_types: ["card"],
    //   ...(accountEmail && { customer_email: accountEmail }), // Include customer_email only if accountEmail is not null
    //   line_items: [
    //     {
    //       price_data: {
    //         currency: currency,
    //         product_data: {
    //           name: planId,
    //         },
    //         unit_amount: amount, // Amount in cents
    //         recurring: {
    //           interval: interval,
    //         },
    //       },
    //       quantity: 1,
    //     },
    //   ],
    //   mode: "subscription",
    //   metadata: {
    //     accountId: accountId,
    //     planId: planId,
    //   },
    //   return_url: `${request.headers.get("origin")}`,
    // });

    // return NextResponse.json({ id: session.id, clientSecret: session.client_secret });
  } catch (error: any) {
    console.error("Error creating Stripe subscription:", error);
    return { error: error.message };
  }
}
