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
import { currencyOptions } from "@/lib/validations";
import { CurrencyContext } from "@/context/CurrencyContext";
import { useContext } from "react";

interface Props {
  user: User;
}

export default function SettingsPage({ user }: Props) {
  const session = useSession();
  const { defaultCurrency, setDefaultCurrency } = useContext(CurrencyContext);

  const form = useForm<UpdateSettingsValues>({
    resolver: zodResolver(updateSettingsSchema),
    defaultValues: { name: user.name || "", currency: user.currency || defaultCurrency },
  });

  async function onSubmit(data: UpdateSettingsValues) {
    try {
      await updateSettings(data);
      setDefaultCurrency(data.currency);
      session.update();
    } catch (error) {
      console.log("error", error);
    }
  }

  return (
    <main className="flex flex-col px-3 py-10 items-start mx-8">
      <h1 className="max-w-7xl space-y-6 text-3xl font-bold">Account Settings</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="py-10 max-w-sm space-y-2.5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Change your profile name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter a username" {...field} />
                </FormControl>
                <FormDescription>This is how you will appear publicly</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Change your default currency</FormLabel>
                <FormControl>
                  <select className="block w-full mt-1" {...field}>
                    {currencyOptions.map((config) => (
                      <option key={`${config?.locale}${config?.currency}`} value={config?.currency}>
                        {config?.currency}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormDescription>Select your default currency</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={form.formState.isSubmitting}>
            Submit
          </Button>
        </form>
      </Form>
    </main>
  );
}
