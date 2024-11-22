// pages/api/webhook.ts

import { NextApiResponse } from "next";
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
      case "invoice.paid": {
        const session = event.data.object.subscription_details;
        const metadata = session?.metadata;
        const accountId = metadata?.accountId;
        const planId = metadata?.planId;
        const subscriptionId = event.data.object.subscription as string;

        console.log(event.data);

        if (accountId && planId) {
          if (planId === "starter" || planId === "pro" || planId === "premium" || planId === "business") {
            // Update the home listing in the database to "premium"
            await prisma.user.update({
              where: { id: accountId },
              data: { sellerSubscription: planId, sellerSubscriptionId: subscriptionId },
            });
          } else if (planId === "basic" || planId === "insight" || planId === "max") {
            await prisma.user.update({
              where: { id: accountId },
              data: { buyerSubscription: planId, buyerSubscriptionId: subscriptionId },
            });
          }
        } else {
          console.error("Missing accountId in subscription metadata.");
        }
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const accountId = subscription.metadata?.accountId;
        const planId = subscription.metadata?.planId;

        if (accountId && planId) {
          // Update the home listing in the database back to "basic" (or another default)
          if (planId === "starter" || planId === "pro" || planId === "premium" || planId === "business") {
            await prisma.user.update({
              where: { id: accountId },
              data: { sellerSubscription: null, sellerSubscriptionId: null }, // Revert to the default listing type
            });
          } else if (planId === "basic" || planId === "insight" || planId === "max") {
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
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscription = invoice.subscription as string;

        // You might want to use the subscription ID to update related data
        const stripeSubscription = await stripe.subscriptions.retrieve(subscription);
        const accountId = stripeSubscription.metadata?.accountId;
        const planId = stripeSubscription.metadata?.planId;

        if (accountId) {
          // Handle payment failure logic (e.g., notifying the user, downgrading the listing)
          if (planId === "starter" || planId === "pro" || planId === "premium" || planId === "business") {
            await prisma.user.update({
              where: { id: accountId },
              data: { sellerSubscription: null, sellerSubscriptionId: null }, // Revert to default if payment fails
            });
          } else if (planId === "basic" || planId === "insight" || planId === "max") {
            await prisma.user.update({
              where: { id: accountId },
              data: { buyerSubscription: "free", buyerSubscriptionId: null }, // Revert to default if payment fails
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
