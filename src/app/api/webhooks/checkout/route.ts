// pages/api/webhook.ts

import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import prisma from "@/lib/prisma"; // Import your Prisma client
import { NextResponse } from "next/server";
import stripe from "@/lib/stripe";
import { headers } from "next/headers";

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
      case "checkout.session.completed": {
        const session = event.data.object;
        const homeId = session.metadata?.homeId;

        if (homeId) {
          // Update the home listing in the database to "premium"
          await prisma.home.update({
            where: { id: parseInt(homeId) },
            data: { listingType: "premium" },
          });
        } else {
          console.error("Missing homeId in subscription metadata.");
        }
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const homeId = subscription.metadata?.homeId;

        if (homeId) {
          // Update the home listing in the database back to "basic" (or another default)
          await prisma.home.update({
            where: { id: parseInt(homeId) },
            data: { listingType: "basic" }, // Revert to the default listing type
          });
        } else {
          console.error("Missing homeId in subscription metadata.");
        }
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscription = invoice.subscription as string;

        // You might want to use the subscription ID to update related data
        const stripeSubscription = await stripe.subscriptions.retrieve(subscription);
        const homeId = stripeSubscription.metadata?.homeId;

        if (homeId) {
          // Handle payment failure logic (e.g., notifying the user, downgrading the listing)
          await prisma.home.update({
            where: { id: parseInt(homeId) },
            data: { listingType: "basic" }, // Revert to default if payment fails
          });
        } else {
          console.error("Missing homeId in subscription metadata.");
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
