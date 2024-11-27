"use client";

import { useSession } from "next-auth/react";
import { updateSettings } from "./actions";
import { useForm } from "react-hook-form";
import { User } from "next-auth";
import { UpdateSettingsValues, updateSettingsSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormControl, FormItem, FormLabel, FormDescription, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { locales, languages } from "@/lib/validations";
import { LocaleContext } from "@/context/LocaleContext";
import { useContext, useEffect, useState } from "react";
import { getFullLanguageName } from "@/lib/utils";
import { FlagComponent } from "@/components/ui/phone-input";
import { useChangeLocale } from "@/locales/client";
import { Country } from "react-phone-number-input";
import lookup from "country-code-lookup";
import { languageToFlagMap } from "@/lib/validations";
import Link from "next/link";
import { StripeBilling } from "../stripeServer";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { Stripe } from "stripe";

interface Props {
  user: User;
  title: string;
  name: { title: string; subtitle: string };
  currency: { title: string; subtitle: string };
  language: { title: string; subtitle: string };
  submit: string;
  buyerSubscription: Stripe.Subscription | null;
  sellerSubscription: Stripe.Subscription | null;
  billingText: {
    title: string;
    buyerSubscription: string;
    sellerSubscription: string;
    updateSub: string;
    paymentMethods: string;
    cancel: string;
  };
}

export default function SettingsPage({
  user,
  title,
  name,
  currency,
  language,
  submit,
  buyerSubscription,
  sellerSubscription,
  billingText,
}: Props) {
  const session = useSession();
  const changeLocale = useChangeLocale();
  const { defaultCurrency, defaultLanguage, setDefaultCurrency, currencyData } = useContext(LocaleContext);
  const router = useRouter();
  const [sellerCancelLoading, setSellerCancelLoading] = useState<boolean>(false);
  const [sellerPaymentLoading, setSellerPaymentLoading] = useState<boolean>(false);
  const [sellerSubscriptionLoading, setSellerSubscriptionLoading] = useState<boolean>(false);
  const [buyerCancelLoading, setBuyerCancelLoading] = useState<boolean>(false);
  const [buyerPaymentLoading, setBuyerPaymentLoading] = useState<boolean>(false);
  const [buyerSubscriptionLoading, setBuyerSubscriptionLoading] = useState<boolean>(false);

  const form = useForm<UpdateSettingsValues>({
    resolver: zodResolver(updateSettingsSchema),
    defaultValues: {
      name: user.name || "",
      currency: user.currency || defaultCurrency?.symbol,
      language: user.language || defaultLanguage,
    },
  });

  async function onSubmit(data: UpdateSettingsValues) {
    try {
      await updateSettings(data);
      const newCurrency = currencyData?.prices.find((currency) => currency.symbol === data.currency);
      if (newCurrency) {
        setDefaultCurrency({
          symbol: data.currency,
          usdPrice: newCurrency.usdPrice,
          decimalsLimit: newCurrency.decimalsLimit,
        });
      } else {
        setDefaultCurrency({ symbol: "USD", usdPrice: 1, decimalsLimit: 2 });
      }
      session.update();
      changeLocale(data.language);
    } catch (error) {
      console.log("error", error);
    }
  }

  async function getBillingUrl(isSeller: boolean, type: "subUpdate" | "updatePayment" | "cancel") {
    const result = await StripeBilling(isSeller, defaultLanguage, type);

    if (result.url) {
      router.push(result.url);
    }
  }

  return (
    <main className="flex flex-col px-10 py-10 w-full items-center">
      <div className="flex flex-col max-w-7xl w-full items-center mx-8">
        <h1 className="flex text-xl lg:text-3xl w-full space-y-8 font-bold">{title}</h1>
        <div className="flex flex-col w-full h-full py-10 gap-16">
          <div className="flex flex-col w-full h-full gap-3">
            <h2 className="flex text-lg lg:text-2xl font-semibold">{"Account"}</h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full gap-8">
                <div className="justify-start space-y-8">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{name.title}</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter a username" {...field} />
                        </FormControl>
                        <FormDescription>{name.subtitle}</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{language.title}</FormLabel>
                        <FormControl>
                          <select className="block w-full mt-1" {...field}>
                            {languages.map((lang) => (
                              <option key={`${lang}`} value={lang}>
                                {getFullLanguageName(lang)}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormDescription>{language.subtitle}</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{currency.title}</FormLabel>
                        <FormControl>
                          <select className="block w-full mt-1" {...field}>
                            {locales.map((config) => (
                              <option key={`${config.locale}${config.currency}`} value={config.currency}>
                                {config.currency}{" "}
                                {/* <FlagComponent country={languageToFlagMap[lang] as Country} countryName={lang as string} /> */}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormDescription>{currency.subtitle}</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-start">
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {submit}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
          <div className="flex flex-col w-full h-full gap-3">
            <h2 className="flex text-lg lg:text-2xl font-semibold">{billingText.title}</h2>
            <div className="flex flex-col gap-12">
              <div className="flex flex-col gap-3">
                <div className="flex gap-3 items-center">
                  <h3 className="font-semibold">
                    {billingText.buyerSubscription} |{" "}
                    <span className={`font-semibold ${user.buyerSubscription ? "text-primary" : "text-red-500"}`}>
                      {user.buyerSubscription
                        ? user.buyerSubscription.charAt(0).toUpperCase() + user.buyerSubscription.slice(1)
                        : "Unsubscribed"}
                    </span>
                  </h3>
                </div>
                {buyerSubscription && (
                  <div className="flex flex-col md:flex-row gap-6 items-start w-full justify-between">
                    <Button
                      className="bg-primary hover:bg-primary/90 w-full"
                      disabled={buyerSubscriptionLoading}
                      onClick={() => {
                        setBuyerSubscriptionLoading(true);
                        getBillingUrl(false, "subUpdate");
                      }}
                    >
                      {!buyerSubscriptionLoading ? (
                        <span>{billingText.updateSub}</span>
                      ) : (
                        <div className="flex w-full justify-center">
                          <ReloadIcon className="w-5 h-5 animate-spin" />
                        </div>
                      )}
                    </Button>
                    <Button
                      className="bg-amber-500 hover:bg-amber-500/90 w-full"
                      disabled={buyerPaymentLoading}
                      onClick={() => {
                        setBuyerPaymentLoading(true);
                        getBillingUrl(false, "updatePayment");
                      }}
                    >
                      {!buyerPaymentLoading ? (
                        <span>{billingText.paymentMethods}</span>
                      ) : (
                        <div className="flex w-full justify-center">
                          <ReloadIcon className="w-5 h-5 animate-spin" />
                        </div>
                      )}
                    </Button>
                    <Button
                      className="w-full"
                      variant={"destructive"}
                      disabled={buyerCancelLoading || buyerSubscription.cancel_at ? true : false}
                      onClick={() => {
                        setBuyerCancelLoading(true);
                        getBillingUrl(false, "cancel");
                      }}
                    >
                      {!buyerCancelLoading ? (
                        <span className="w-full">
                          {buyerSubscription.cancel_at
                            ? `Subscription Ends ${new Date(buyerSubscription.cancel_at * 1000).toLocaleString()}`
                            : billingText.cancel}
                        </span>
                      ) : (
                        <div className="flex w-full justify-center">
                          <ReloadIcon className="w-5 h-5 animate-spin" />
                        </div>
                      )}
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex gap-3 items-center">
                  <h3 className="font-semibold">
                    {billingText.sellerSubscription} |{" "}
                    <span className={`font-semibold ${user.sellerSubscription ? "text-primary" : "text-red-500"}`}>
                      {user.sellerSubscription
                        ? user.sellerSubscription.charAt(0).toUpperCase() + user.sellerSubscription.slice(1)
                        : "Unsubscribed"}
                    </span>
                  </h3>
                </div>
                {sellerSubscription && (
                  <div className="flex flex-col md:flex-row gap-6 items-start w-full justify-start">
                    <Button
                      className="bg-primary hover:bg-primary/90 w-full"
                      onClick={() => {
                        setSellerSubscriptionLoading(true);
                        getBillingUrl(true, "subUpdate");
                      }}
                      disabled={sellerSubscriptionLoading}
                    >
                      {!sellerSubscriptionLoading ? (
                        <span>{billingText.updateSub}</span>
                      ) : (
                        <div className="flex w-full justify-center">
                          <ReloadIcon className="w-5 h-5 animate-spin" />
                        </div>
                      )}
                    </Button>
                    <Button
                      className="bg-amber-500 hover:bg-amber-500/90 w-full"
                      onClick={() => {
                        setSellerPaymentLoading(true);
                        getBillingUrl(true, "updatePayment");
                      }}
                      disabled={sellerPaymentLoading}
                    >
                      {!sellerPaymentLoading ? (
                        <span>{billingText.paymentMethods}</span>
                      ) : (
                        <div className="flex w-full justify-center">
                          <ReloadIcon className="w-5 h-5 animate-spin" />
                        </div>
                      )}
                    </Button>
                    <Button
                      className="w-full"
                      variant={"destructive"}
                      onClick={() => {
                        setSellerCancelLoading(true);
                        getBillingUrl(true, "cancel");
                      }}
                      disabled={sellerCancelLoading || sellerSubscription.cancel_at ? true : false}
                    >
                      {!sellerCancelLoading ? (
                        <span className="w-full">
                          {sellerSubscription.cancel_at
                            ? `Subscription Ends ${new Date(sellerSubscription.cancel_at * 1000).toLocaleString()}`
                            : billingText.cancel}
                        </span>
                      ) : (
                        <div className="flex w-full justify-center">
                          <ReloadIcon className="w-5 h-5 animate-spin" />
                        </div>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
