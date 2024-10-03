// pages/api/webhook.ts

import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import prisma from "@/lib/prisma"; // Import your Prisma client

const stripe = new Stripe(process.env.STRIPE_TEST_SECRET_KEY as string);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const sig = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string // The webhook secret from the Stripe dashboard
    );

    // Handle the event based on its type
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.metadata && session.metadata.homeId) {
        const homeId = session.metadata.homeId;

        await prisma.home.update({
          where: { id: parseInt(homeId) },
          data: { listingType: "premium" },
        });

        res.status(200).json({ received: true });
      } else {
        console.error("Metadata or homeId is missing in the session.");
        res.status(400).json({ error: "Missing homeId in metadata" });
      }
    } else {
      res.status(400).end();
    }
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err}`);
    return res.status(400).send(`Webhook Error: ${err}`);
  }
}
