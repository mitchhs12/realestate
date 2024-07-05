"use client";

import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { User } from "next-auth";
import { UpdateNameValues, updateNameSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormControl, FormItem, FormLabel, FormDescription, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  user: User;
}

export default function SellFlowPage({ user }: Props) {
  const session = useSession();

  const form = useForm<UpdateNameValues>({
    resolver: zodResolver(updateNameSchema),
    defaultValues: { name: user.name || "" },
  });

  async function onSubmit(data: UpdateNameValues) {
    try {
      session.update();
    } catch (error) {
      console.log("error", error);
    }
  }

  return (
    <main className="flex flex-col px-3 pt-2 items-start mx-8">
      <h1 className="max-w-7xl text-3xl font-medium">Sell your home</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="py-10 max-w-sm space-y-2.5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Change your profile&apos;s name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter a username" {...field} />
                </FormControl>
                <FormDescription>This is how you will appear publicly</FormDescription>
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
