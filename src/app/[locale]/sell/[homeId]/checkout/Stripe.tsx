"use client";

import { useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { CurrencyType } from "@/lib/validations";

interface Props {
  amount: number;
  defaultCurrency: CurrencyType;
  homeId: number;
}

export default function CheckoutButton({ amount, defaultCurrency, homeId }: Props) {
  const currency = defaultCurrency.symbol.toLowerCase();

  if (defaultCurrency.decimalsLimit === 0) {
    amount = Math.round(amount);
  } else {
    amount = amount * 100;
  }

  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_TEST_PUBLISHABLE_KEY || (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string)
  );

  const fetchClientSecret = useCallback(() => {
    return fetch("/api/stripe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: amount, currency: currency, homeId: homeId }),
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
