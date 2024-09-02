"use client";

import { useSession } from "next-auth/react";
import { createListing } from "./actions";
import { useForm } from "react-hook-form";
import { User } from "next-auth";
import { HomeType, homeSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";

interface Props {
  user: User;
}

export default function AdminPage({ user }: Props) {
  const session = useSession();

  const form = useForm<HomeType>({
    resolver: zodResolver(homeSchema),
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

  async function onSubmit(data: HomeType) {
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
    </main>
  );
}
