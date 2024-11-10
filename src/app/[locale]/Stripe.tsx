"use client";

import { useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { CurrencyType } from "@/lib/validations";

interface Props {
  defaultCurrency: CurrencyType;
  planId: string;
  interval: string;
  accountId: string;
}

export default function Stripe({ defaultCurrency, planId, interval, accountId }: Props) {
  const currency = defaultCurrency.symbol.toLowerCase();

  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_TEST_PUBLISHABLE_KEY || (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string)
  );

  const fetchClientSecret = useCallback(() => {
    return fetch("/api/stripe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ currency: currency, planId: planId, interval: interval, accountId: accountId }),
    })
      .then((res) => res.json())
      .then((data) => data.clientSecret);
  }, []);

  const options = { fetchClientSecret };

  return (
    <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
  );
}
