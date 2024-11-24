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

interface Props {
  user: User;
  title: string;
  name: { title: string; subtitle: string };
  currency: { title: string; subtitle: string };
  language: { title: string; subtitle: string };
  submit: string;
}

export default function SettingsPage({ user, title, name, currency, language, submit }: Props) {
  const session = useSession();
  const changeLocale = useChangeLocale();
  const { defaultCurrency, defaultLanguage, setDefaultCurrency, currencyData } = useContext(LocaleContext);
  const [stripeBuyerBillingUrl, setStripeBuyerBillingUrl] = useState<string | null>(null);
  const [stripeSellerBillingUrl, setStripeSellerBillingUrl] = useState<string | null>(null);
  const [updateBuyerSubscriptionUrl, setUpdateBuyerSubscriptionUrl] = useState<string | null>(null);
  const [updateBuyerPaymentUrl, setUpdateBuyerPaymentUrl] = useState<string | null>(null);
  const [cancelBuyerSubscriptionUrl, setCancelBuyerSubscriptionUrl] = useState<string | null>(null);
  const [updateSellerSubscriptionUrl, setUpdateSellerSubscriptionUrl] = useState<string | null>(null);
  const [updateSellerPaymentUrl, setUpdateSellerPaymentUrl] = useState<string | null>(null);
  const [cancelSellerSubscriptionUrl, setCancelSellerSubscriptionUrl] = useState<string | null>(null);

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

  useEffect(() => {
    if (user.buyerSubscriptionId && user.sellerSubscriptionId) {
      getBuyerStripeBilling();
      getSellerStripeBilling();
    } else if (user.buyerSubscriptionId) {
      getBuyerStripeBilling();
    } else if (user.sellerSubscriptionId) {
      getSellerStripeBilling();
    }
  }, [user]);

  async function getSellerStripeBilling() {
    const [updateSubscriptionUrl, updatePaymentUrl, cancelUrl] = await Promise.all([
      StripeBilling(true, defaultLanguage, "subUpdate"),
      StripeBilling(true, defaultLanguage, "updatePayment"),
      StripeBilling(true, defaultLanguage, "cancel"),
    ]);

    setUpdateSellerSubscriptionUrl(updateSubscriptionUrl);
    setUpdateSellerPaymentUrl(updatePaymentUrl);
    setCancelSellerSubscriptionUrl(cancelUrl);
  }

  async function getBuyerStripeBilling() {
    const [updateSubscriptionUrl, updatePaymentUrl, cancelUrl] = await Promise.all([
      StripeBilling(true, defaultLanguage, "subUpdate"),
      StripeBilling(true, defaultLanguage, "updatePayment"),
      StripeBilling(true, defaultLanguage, "cancel"),
    ]);

    setUpdateBuyerSubscriptionUrl(updateSubscriptionUrl);
    setUpdateBuyerPaymentUrl(updatePaymentUrl);
    setCancelBuyerSubscriptionUrl(cancelUrl);
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
            <h2 className="flex text-lg lg:text-2xl font-semibold">{"Billing"}</h2>
            <div className="flex flex-col gap-12">
              <div className="flex flex-col gap-3">
                <div className="flex gap-3 items-center">
                  <h3 className="font-semibold">Buyer Subscription Plan:</h3>
                  <div className={`font-medium ${user.buyerSubscription ? "text-primary" : "text-red-500"}`}>
                    {user.buyerSubscription
                      ? user.buyerSubscription.charAt(0).toUpperCase() + user.buyerSubscription.slice(1)
                      : "Unsubscribed"}
                  </div>
                </div>
                <div>
                  {user.buyerSubscriptionId ? (
                    <Button
                      asChild
                      className="bg-amber-500 hover:bg-amber-500/90"
                      disabled={stripeBuyerBillingUrl ? false : true}
                    >
                      {stripeBuyerBillingUrl && <Link href={stripeBuyerBillingUrl}>Buyer Subscription Settings</Link>}
                    </Button>
                  ) : (
                    <div className="flex gap-3">
                      <Button className="bg-amber-500 hover:bg-amber-500/90" disabled={true}>
                        Update Subscription
                      </Button>
                      <Button className="bg-amber-500 hover:bg-amber-500/90" disabled={true}>
                        Update Payment Information
                      </Button>
                      <Button className="bg-amber-500 hover:bg-amber-500/90" disabled={true}>
                        Cancel Subscription
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex gap-3 items-center">
                  <h3 className="font-semibold">Seller Subscription Plan:</h3>
                  <div className={`font-medium ${user.sellerSubscription ? "text-primary" : "text-red-500"}`}>
                    {user.sellerSubscription
                      ? user.sellerSubscription.charAt(0).toUpperCase() + user.sellerSubscription.slice(1)
                      : "Unsubscribed"}
                  </div>
                </div>
                <div className="flex gap-3 items-center w-full justify-start">
                  {user.sellerSubscriptionId ? (
                    <div className="flex gap-3">
                      <Button
                        asChild
                        className="bg-amber-500 hover:bg-amber-500/90"
                        disabled={updateSellerSubscriptionUrl ? false : true}
                      >
                        {updateSellerSubscriptionUrl && (
                          <Link href={updateSellerSubscriptionUrl}>Update Subscription</Link>
                        )}
                      </Button>
                      <Button
                        asChild
                        className="bg-amber-500 hover:bg-amber-500/90"
                        disabled={updateSellerPaymentUrl ? false : true}
                      >
                        {updateSellerPaymentUrl && (
                          <Link href={updateSellerPaymentUrl}>Update Payment Information</Link>
                        )}
                      </Button>
                      <Button
                        asChild
                        className="bg-amber-500 hover:bg-amber-500/90"
                        disabled={cancelSellerSubscriptionUrl ? false : true}
                      >
                        {cancelSellerSubscriptionUrl && (
                          <Link href={cancelSellerSubscriptionUrl}>Cancel Subscription</Link>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <Button className="bg-amber-500 hover:bg-amber-500/90" disabled={true}>
                        Update Subscription
                      </Button>
                      <Button className="bg-amber-500 hover:bg-amber-500/90" disabled={true}>
                        Update Payment Information
                      </Button>
                      <Button className="bg-amber-500 hover:bg-amber-500/90" disabled={true}>
                        Cancel Subscription
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
