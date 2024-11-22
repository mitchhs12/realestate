"use client";

import { useContext, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { CurrencyType } from "@/lib/validations";
import { useState } from "react";
import { useTheme } from "next-themes";
import CheckoutForm from "@/components/Stripe/CheckoutForm";
import { I18nProviderClient } from "@/locales/client";
import { LocaleContext } from "@/context/LocaleContext";
import { StripeServer } from "./stripeServer";

interface Props {
  defaultCurrency: CurrencyType;
  planId: any; //starter pro premium business basic insight max;
  interval: "year" | "month";
  accountId: string;
  accountEmail: string | null;
}

export default function Stripe({ defaultCurrency, planId, interval, accountId, accountEmail }: Props) {
  const currency = defaultCurrency.symbol.toLowerCase();

  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_TEST_PUBLISHABLE_KEY || (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string)
  );

  const { resolvedTheme: theme } = useTheme();
  const [clientSecret, setClientSecret] = useState<string>("");
  const { defaultLanguage } = useContext(LocaleContext);

  useEffect(() => {
    try {
      StripeServer(currency, planId, interval).then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        }
      });
    } catch (e) {
      console.log("Error in StripeServer", e);
    }
  }, []);

  const appearance = {
    variables: {
      colorPrimary: "#16A34A",
      colorBackground: theme === "dark" ? "#121212" : "#FAFAFA",
      colorText: theme === "dark" ? "#FFFFFF" : "#000000",
    },
  };
  const options = { clientSecret, appearance };

  return (
    <div>
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <I18nProviderClient locale={defaultLanguage}>
            <CheckoutForm />
          </I18nProviderClient>
        </Elements>
      )}
    </div>
  );
}
