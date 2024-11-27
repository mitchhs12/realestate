// pages/api/webhook.ts

import { NextApiResponse } from "next";
import Stripe from "stripe";
import prisma from "@/lib/prisma"; // Import your Prisma client
import { NextResponse } from "next/server";
import stripe from "@/lib/stripe";
import { headers } from "next/headers";
import { GetSubscription } from "@/app/[locale]/stripeServer";

export async function POST(req: Request, res: NextApiResponse) {
  const sig = headers().get("stripe-signature");

  if (!sig) {
    console.error("No stripe-signature header value was provided.");
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    // Get raw body using micro's buffer function
    const rawBody = await req.text();

    // Verify Stripe webhook signature
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_TEST_WEBHOOK_SECRET || (process.env.STRIPE_WEBHOOK_SECRET as string) // The webhook secret from the Stripe dashboard
    );

    // Handle the event based on its type
    switch (event.type) {
      // When a checkout session completes (e.g., a subscription is purchased)
      case "invoice.paid": {
        const session = event.data.object.subscription_details;
        const metadata = session?.metadata;
        const accountId = metadata?.accountId;
        const isSeller = metadata?.userType === "seller" ? true : false;
        const subscriptionId = event.data.object.subscription as string;
        const plan = await GetSubscription(subscriptionId);

        if (accountId && plan) {
          if (isSeller) {
            // Update the home listing in the database to "premium"
            await prisma.user.update({
              where: { id: accountId },
              data: { sellerSubscription: plan.name, sellerSubscriptionId: subscriptionId },
            });
          } else {
            await prisma.user.update({
              where: { id: accountId },
              data: { buyerSubscription: plan.name, buyerSubscriptionId: subscriptionId },
            });
          }
        } else {
          console.error("Missing accountId in subscription metadata.");
        }
        break;
      }
      case "customer.subscription.deleted": {
        const accountId = event.data.object.metadata.accountId;
        const isSeller = event.data.object.metadata.userType === "seller" ? true : false;

        if (accountId) {
          if (isSeller) {
            await prisma.user.update({
              where: { id: accountId },
              data: { sellerSubscription: null, sellerSubscriptionId: null }, // Revert to the default listing type
            });
          } else {
            await prisma.user.update({
              where: { id: accountId },
              data: { buyerSubscription: "free", buyerSubscriptionId: null }, // Revert to the default listing type
            });
          }
        } else {
          console.error("Missing accountId in subscription metadata.");
        }
        break;
      }
      default:
        console.log(`Unhandled Event Type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err}`);
    return NextResponse.json({ error: `Webhook Error: ${err}` }, { status: 400 });
  }
}
