"use client";

import { useSession } from "next-auth/react";
import { createListing } from "./actions";
import { useForm } from "react-hook-form";
import { User } from "next-auth";
import { CreateListingValues, createListingSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormControl, FormItem, FormLabel, FormDescription, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  user: User;
}

export default function AdminPage({ user }: Props) {
  const session = useSession();

  const form = useForm<CreateListingValues>({
    resolver: zodResolver(createListingSchema),
    // defaultValues: {
    //   title: "Title",
    //   description: "Description",
    //   address: "Address",
    //   district: "District",
    //   city: "City",
    //   state: "State",
    //   country: "Country",
    //   latitude: 0,
    //   longitude: 0,
    //   type: ["Type"],
    //   features: ["Features"],
    //   bedrooms: 1,
    //   bathrooms: 1,
    //   capacity: 1,
    //   photos: ["Photos"],
    //   price: 100,
    //   areaSqm: 100,
    // },
  });

  async function onSubmit(data: CreateListingValues) {
    try {
      await createListing(data);
      session.update();
    } catch (error) {
      console.log("error", error);
    }
  }

  return (
    <main className="flex flex-col px-3 py-10 items-start mx-8">
      <h1 className="max-w-7xl space-y-6 text-3xl font-bold">Admin Control</h1>
      <h3 className="max-w-5xl space-y-6 text-xl font-semibold">Create a new listing</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="py-10 max-w-sm space-y-2.5">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter a title" {...field} />
                </FormControl>
                <FormDescription>The title of the listing.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="Enter a description" {...field} />
                </FormControl>
                <FormDescription>The description of the listing.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input placeholder="Enter a price" {...field} />
                </FormControl>
                <FormDescription>The price of the listing.</FormDescription>
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
