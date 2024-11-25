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
import { StripeBilling, GetUserCurrentSubscriptionProductId } from "../stripeServer";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

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
      getBillingUrls(true);
      getBillingUrls(false);
    } else if (user.buyerSubscriptionId) {
      getBillingUrls(false);
      setUpdateSellerSubscriptionUrl("n/a");
      setUpdateSellerPaymentUrl("n/a");
      setCancelSellerSubscriptionUrl("n/a");
    } else if (user.sellerSubscriptionId) {
      getBillingUrls(true);
      setUpdateBuyerSubscriptionUrl("n/a");
      setUpdateBuyerPaymentUrl("n/a");
      setCancelBuyerSubscriptionUrl("n/a");
    }
  }, [user]);

  async function getBillingUrls(isSeller: boolean) {
    const [updateSubscription, updatePayment, cancel] = await Promise.all([
      StripeBilling(isSeller, defaultLanguage, "subUpdate"),
      StripeBilling(isSeller, defaultLanguage, "updatePayment"),
      StripeBilling(isSeller, defaultLanguage, "cancel"),
    ]);

    if (updateSubscription.url) {
      isSeller
        ? setUpdateSellerSubscriptionUrl(updateSubscription.url)
        : setUpdateBuyerSubscriptionUrl(updateSubscription.url);
    } else {
      console.log(updateSubscription.error);
    }
    if (updatePayment.url) {
      isSeller ? setUpdateSellerPaymentUrl(updatePayment.url) : setUpdateBuyerPaymentUrl(updatePayment.url);
    } else {
      console.log(updatePayment.error);
    }
    if (cancel.url) {
      isSeller ? setCancelSellerSubscriptionUrl(cancel.url) : setCancelBuyerSubscriptionUrl(cancel.url);
    } else {
      if (cancel.error.includes("canceled at period end")) {
        console.log("will cancel");
        setCancelSellerSubscriptionUrl("cancel");
      }
      console.log(cancel.error);
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
                <div className="flex flex-col gap-3 items-start w-full justify-center">
                  <Button
                    className="bg-primary hover:bg-primary/90"
                    disabled={user.buyerSubscriptionId && updateBuyerSubscriptionUrl ? false : true}
                    onClick={() => {
                      updateBuyerSubscriptionUrl && router.push(updateBuyerSubscriptionUrl);
                    }}
                  >
                    {updateBuyerSubscriptionUrl ? (
                      <span>Update Subscription</span>
                    ) : (
                      <div className="w-full">
                        <ReloadIcon className="w-5 h-5 animate-spin" />
                      </div>
                    )}
                  </Button>
                  <Button
                    className="bg-amber-500 hover:bg-amber-500/90"
                    disabled={user.buyerSubscriptionId && updateBuyerPaymentUrl ? false : true}
                    onClick={() => {
                      updateBuyerPaymentUrl && router.push(updateBuyerPaymentUrl);
                    }}
                  >
                    {updateBuyerPaymentUrl ? (
                      <span>Update Payment Information</span>
                    ) : (
                      <div className="w-full">
                        <ReloadIcon className="w-5 h-5 animate-spin" />
                      </div>
                    )}
                  </Button>
                  <Button
                    variant={"destructive"}
                    disabled={user.buyerSubscriptionId && cancelBuyerSubscriptionUrl ? false : true}
                    onClick={() => {
                      cancelBuyerSubscriptionUrl && router.push(cancelBuyerSubscriptionUrl);
                    }}
                  >
                    {cancelBuyerSubscriptionUrl ? (
                      <span>Cancel Subscription</span>
                    ) : (
                      <div className="w-full">
                        <ReloadIcon className="w-5 h-5 animate-spin" />
                      </div>
                    )}
                  </Button>
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
                <div className="flex flex-col gap-3 items-start w-full justify-center">
                  <Button
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => {
                      updateSellerSubscriptionUrl && router.push(updateSellerSubscriptionUrl);
                    }}
                    disabled={user.sellerSubscriptionId && updateSellerSubscriptionUrl ? false : true}
                  >
                    {updateSellerSubscriptionUrl ? (
                      <span>Update Subscription</span>
                    ) : (
                      <div className="w-full">
                        <ReloadIcon className="w-5 h-5 animate-spin" />
                      </div>
                    )}
                  </Button>
                  <Button
                    className="bg-amber-500 hover:bg-amber-500/90"
                    onClick={() => {
                      updateSellerPaymentUrl && router.push(updateSellerPaymentUrl);
                    }}
                    disabled={user.sellerSubscriptionId && updateSellerPaymentUrl ? false : true}
                  >
                    {updateSellerPaymentUrl ? (
                      <span>Update Payment Information</span>
                    ) : (
                      <div className="w-full">
                        <ReloadIcon className="w-5 h-5 animate-spin" />
                      </div>
                    )}
                  </Button>
                  <Button
                    variant={"destructive"}
                    onClick={() => {
                      cancelSellerSubscriptionUrl && router.push(cancelSellerSubscriptionUrl);
                    }}
                    disabled={
                      user.sellerSubscriptionId && cancelSellerSubscriptionUrl
                        ? cancelSellerSubscriptionUrl === "cancel"
                          ? true
                          : false
                        : true
                    }
                  >
                    {cancelSellerSubscriptionUrl ? (
                      <span>{cancelSellerSubscriptionUrl === "cancel" && "Subscription Ends This Month"}</span>
                    ) : (
                      <div className="w-full">
                        <ReloadIcon className="w-5 h-5 animate-spin" />
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
