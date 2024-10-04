import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_TEST_SECRET_KEY || (process.env.STRIPE_SECRET_KEY as string));

export default stripe;
