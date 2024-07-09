"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { HomeType, homeSchema } from "@/lib/validations";
import { auth } from "@/auth";

// Admin Page Actions

export async function createListing(values: HomeType) {
  const session = await auth();
  const user = session?.user;
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User not found");
  }
  const {
    ownerId,
    title,
    description,
    address,
    district,
    city,
    state,
    country,
    latitude,
    longitude,
    type,
    features,
    bedrooms,
    bathrooms,
    livingrooms,
    kitchens,
    capacity,
    photos,
    price,
    areaSqm,
    listingFlowStep,
  } = homeSchema.parse(values);

  await prisma.home.create({
    data: {
      ownerId,
      title,
      description,
      address: address || null,
      district: district || null,
      city: city || null,
      state: state || null,
      country,
      latitude,
      longitude,
      type,
      features,
      bedrooms,
      bathrooms,
      livingrooms,
      kitchens,
      capacity,
      photos,
      price,
      areaSqm,
      listingFlowStep,
    },
  });

  revalidatePath("/");
}
