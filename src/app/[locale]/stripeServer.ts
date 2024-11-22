"use server";

import stripeClient from "@/lib/stripe";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import Stripe from "stripe";
import { revalidatePath } from "next/cache";
import stripe from "@/lib/stripe";
import { getScopedI18n } from "@/locales/server";

const yearlyMap =
  process.env.NODE_ENV === "development"
    ? {
        starter: { product: "prod_RGLO3eC3u8UV4g", price: "price_1QNoi8LWTS7QT7kvotVt79Dz" },
        pro: { product: "prod_RGLPk0aTA0eQNj", price: "price_1QNoivLWTS7QT7kvNEui4mph" },
        premium: { product: "prod_RGLQnQkrHVRdNI", price: "price_1QNok7LWTS7QT7kvj5U9uJFJ" },
        business: { product: "prod_RGLR20Cw48qjAm", price: "price_1QNokoLWTS7QT7kv29YQoZZp" },
        basic: { product: "prod_RGLSfdHUPIXMQr", price: "price_1QNolVLWTS7QT7kvT07gQnTL" },
        insight: { product: "prod_RGLTYBAcedO7yK", price: "price_1QNomALWTS7QT7kvFASwmVkt" },
        max: { product: "prod_RGLTynXTLL7rso", price: "price_1QNomnLWTS7QT7kvVZHsgVfy" },
      }
    : {
        starter: { product: "prod_RGMIA7FN39OnjS", price: "price_1QNpZYLWTS7QT7kvTX5Jjf1w" },
        pro: { product: "prod_RGMIeSAl2jBW8z", price: "price_1QNpZcLWTS7QT7kvEnELu2Y2" },
        premium: { product: "prod_RGMIFuNf3D7QdR", price: "price_1QNpZfLWTS7QT7kvzdCN4gy4" },
        business: { product: "prod_RGMIX0vF11i8A6", price: "price_1QNpZiLWTS7QT7kvJXgiwS6E" },
        basic: { product: "prod_RGMIP1K2ZfnGdk", price: "price_1QNpZlLWTS7QT7kv0admI1it" },
        insight: { product: "prod_RGMIRrkMd42hHK", price: "price_1QNpZoLWTS7QT7kvzQwYsv2Z" },
        max: { product: "prod_RGMIugLIn0BoMo", price: "price_1QNpZqLWTS7QT7kv5yrECVUP" },
      };

const monthlyMap =
  process.env.NODE_ENV === "development"
    ? {
        starter: { product: "prod_RGLNV8JyUl0O08", price: "price_1QNogdLWTS7QT7kvj8ws4wOT" },
        pro: { product: "prod_RGLPUgIDaZDALY", price: "price_1QNoiZLWTS7QT7kvU3H3SPk1" },
        premium: { product: "prod_RGLQXLsK3K4DPO", price: "price_1QNojRLWTS7QT7kvut8gqGuW" },
        business: { product: "prod_RGLRJjGAvhr2Vk", price: "price_1QNokQLWTS7QT7kvqozDq7zm" },
        basic: { product: "prod_RGLS9MYuC36eCc", price: "price_1QNolBLWTS7QT7kvByIiq8bf" },
        insight: { product: "prod_RGLSF2ZUemii2K", price: "price_1QNolsLWTS7QT7kv1luL10xj" },
        max: { product: "prod_RGLTf9kzcyw8jd", price: "price_1QNomSLWTS7QT7kvJyZJjNtt" },
      }
    : {
        starter: { product: "prod_RGMIOS7SjcNKeZ", price: "price_1QNpZVLWTS7QT7kvbJLUVrWe" },
        pro: { product: "prod_RGMICT7LjP9h7z", price: "price_1QNpZaLWTS7QT7kvMmKy3cVC" },
        premium: { product: "prod_RGMIOK2OMNhwsB", price: "price_1QNpZdLWTS7QT7kvjeMCkgrA" },
        business: { product: "prod_RGMIs9MVCZTJRI", price: "price_1QNpZgLWTS7QT7kvIPA5XggW" },
        basic: { product: "prod_RGMIvCVmIzDLtd", price: "price_1QNpZkLWTS7QT7kvjEfi8SUj" },
        insight: { product: "prod_RGMIkIaWmFbKHU", price: "price_1QNpZnLWTS7QT7kvysvU1hDO" },
        max: { product: "prod_RGMIYRPt3GkORH", price: "price_1QNpZpLWTS7QT7kvDSYhRatb" },
      };

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

    let subscription;

    if (user.sellerSubscriptionId || user.buyerSubscriptionId) {
      subscription = await stripeClient.subscriptions.update(
        planId === "starter" || planId === "pro" || planId === "premium" || planId === "business"
          ? user.sellerSubscriptionId
          : (planId === "basic" || planId === "insight" || planId === "max") && user.buyerSubscriptionId,
        { metadata: { accountId: user.id, planId: planId } }
      );
    } else {
      // Create a new subscription
      subscription = await stripeClient.subscriptions.create({
        customer: user.customerId,
        items: [
          {
            price_data: {
              currency: currency,
              product: interval === "year" ? yearlyMap[planId]["product"] : monthlyMap[planId]["product"],
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
    }
    const latestInvoice = subscription.latest_invoice as Stripe.Invoice;

    const paymentIntent = latestInvoice.payment_intent as Stripe.PaymentIntent;

    const clientSecret = paymentIntent.client_secret;

    return {
      subscriptionId: subscription.id,
      clientSecret: clientSecret,
    };
  } catch (error: any) {
    console.error("Error creating Stripe subscription:", error);
    return { error: error.message };
  }
}

export async function StripeBilling(isSeller: boolean, defaultLanguage: any) {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  let user: any = session.user;

  if (!user || !user.id) {
    throw new Error("User not found");
  }

  const subscriptionId = isSeller ? user.sellerSubscriptionId : user.buyerSubscriptionId;

  const configuration = await CreatePortalConfig(isSeller, subscriptionId);

  const stripeSession = await stripeClient.billingPortal.sessions.create({
    customer: user.customerId,
    return_url:
      process.env.NODE_ENV === "development"
        ? `https://localhost:3000/settings`
        : `${process.env.NEXT_PUBLIC_BASE_URL}/${defaultLanguage}/settings`,
    locale: defaultLanguage,
    configuration: configuration.id,
  });
  return stripeSession.url;
}

export async function CreatePortalConfig(isSeller: boolean, subscriptionId: string) {
  const t = await getScopedI18n("stripe");
  const products = isSeller
    ? [
        {
          prices: [yearlyMap.starter.price],
          product: yearlyMap.starter.product,
        },
        {
          prices: [yearlyMap.pro.price],
          product: yearlyMap.pro.product,
        },
        { prices: [yearlyMap.premium.price], product: yearlyMap.premium.product },
        { prices: [yearlyMap.business.price], product: yearlyMap.business.product },
        { prices: [monthlyMap.starter.price], product: monthlyMap.starter.product },
        { prices: [monthlyMap.pro.price], product: monthlyMap.pro.product },
        { prices: [monthlyMap.premium.price], product: monthlyMap.premium.product },
        { prices: [monthlyMap.business.price], product: monthlyMap.business.product },
      ]
    : [
        {
          prices: [yearlyMap.basic.price],
          product: yearlyMap.basic.product,
        },
        {
          prices: [yearlyMap.insight.price],
          product: yearlyMap.insight.product,
        },
        {
          prices: [yearlyMap.max.price],
          product: yearlyMap.max.product,
        },
        {
          prices: [monthlyMap.basic.price],
          product: monthlyMap.basic.product,
        },
        {
          prices: [monthlyMap.insight.price],
          product: monthlyMap.insight.product,
        },
        {
          prices: [monthlyMap.max.price],
          product: monthlyMap.max.product,
        },
      ];
  const stripeSession = await stripeClient.billingPortal.configurations.create({
    features: {
      customer_update: {
        allowed_updates: ["email", "tax_id"],
        enabled: true,
      },
      invoice_history: {
        enabled: true,
      },
      payment_method_update: {
        enabled: true,
      },
      subscription_cancel: {
        enabled: true,
        cancellation_reason: {
          enabled: true,
          options: [
            "customer_service",
            "low_quality",
            "missing_features",
            "other",
            "switched_service",
            "too_complex",
            "too_expensive",
            "unused",
          ],
        },
        mode: "at_period_end",
        proration_behavior: "none",
      },
      subscription_update: {
        enabled: true,
        default_allowed_updates: ["price"],
        products: products,
        proration_behavior: "always_invoice",
      },
    },
    login_page: { enabled: false },
    business_profile: {
      headline: isSeller ? "Viva Ideal Seller Billing" : "Viva Ideal Buyer Billing",
      privacy_policy_url: "https://www.vivaideal.com/privacy-policy",
      terms_of_service_url: "https://www.vivaideal.com/terms-and-conditions",
    },
  });
  return stripeSession;
}
