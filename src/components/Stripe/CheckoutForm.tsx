import React, { useContext } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { useScopedI18n } from "@/locales/client";
import { LocaleContext } from "@/context/LocaleContext";
import { StripePaymentElementOptions } from "@stripe/stripe-js";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useContext(LocaleContext);
  const [message, setMessage] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isPaymentReady, setIsPaymentReady] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  const t = useScopedI18n("stripe");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);
    try {
      if (!user) {
        throw new Error("User is not logged in");
      }

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          receipt_email: user.email!,
          // Make sure to change this to your payment completion page
        },
        redirect: "if_required",
      });

      // This point will only be reached if there is an immediate error when
      // confirming the payment. Otherwise, your customer will be redirected to
      // your `return_url`. For some payment methods like iDEAL, your customer will
      // be redirected to an intermediate site first to authorize the payment, then
      // redirected to the `return_url`.
      if (error) {
        if (error.type === "card_error" || error.type === "validation_error") {
          console.log(error.message);
          showErrorForLimitedTime(error.message || "An unexpected error occurred.");
        } else {
          console.log(error.message);
          showErrorForLimitedTime("An unexpected error occurred.");
        }
      } else if (paymentIntent?.status === "succeeded") {
        setMessage(t("payment_success"));
        window.location.reload();
      }
    } catch (e) {
      showErrorForLimitedTime((e as Error).message || t("payment_error"));
    } finally {
      setIsLoading(false);
    }
  };

  const showErrorForLimitedTime = (errorMsg: string) => {
    console.log(errorMsg);
    setMessage(errorMsg);
    setIsError(true);
    setTimeout(() => {
      setMessage(null);
      setIsError(false);
    }, 5000); // 5 seconds
  };

  const paymentElementOptions: StripePaymentElementOptions = {
    layout: "accordion",
    paymentMethodOrder: ["apple_pay", "google_pay", "card"],
  };

  return (
    <>
      <form id="payment-form" onSubmit={handleSubmit}>
        <PaymentElement
          className="border-none"
          options={paymentElementOptions}
          onReady={() => {
            setIsPaymentReady(true);
          }}
        />
        {isPaymentReady && ( // Conditionally render button only after PaymentElement is ready
          <Button
            className={`${isError ? "bg-red-500" : "bg-primary"} rounded-none w-full`}
            disabled={isLoading || !stripe || !elements}
            aria-live="polite"
          >
            {isLoading ? (
              <div className="flex items-center gap-3">
                <ReloadIcon className="w-6 h-6 animate-spin" />
                <span>{t("payment_loading")}</span>
              </div>
            ) : (
              message || t("pay")
            )}
          </Button>
        )}
      </form>
    </>
  );
}
