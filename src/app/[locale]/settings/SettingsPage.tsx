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
import { useContext } from "react";
import { getFlagEmoji, getFullLanguageName } from "@/lib/utils";
import { useChangeLocale } from "@/locales/client";

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
        setDefaultCurrency({ symbol: data.currency, usdPrice: newCurrency.usdPrice });
      } else {
        setDefaultCurrency({ symbol: "USD", usdPrice: 1 });
      }
      session.update();
      changeLocale(data.language);
    } catch (error) {
      console.log("error", error);
    }
  }

  return (
    <main className="flex flex-col px-10 py-10 w-full items-center">
      <div className="flex flex-col max-w-7xl w-full items-center mx-8">
        <h1 className="flex text-xl lg:text-3xl w-full space-y-8 font-bold">{title}</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col py-10 w-full gap-8">
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
                            {config.currency} {getFlagEmoji(config.locale.split("-")[1])}
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

            <div className="flex justify-end">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {submit}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </main>
  );
}
