"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { CreateListingValues, createListingSchema } from "@/lib/validations";
import { auth } from "@/auth";

// Admin Page Actions

export async function createListing(values: CreateListingValues) {
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
    capacity,
    photos,
    price,
    areaSqm,
    listingFlowStep,
  } = createListingSchema.parse(values);

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
      latitude: latitude || null,
      longitude: longitude || null,
      type,
      features,
      bedrooms,
      bathrooms,
      capacity,
      photos,
      price,
      areaSqm,
      listingFlowStep,
    },
  });

  revalidatePath("/");
}
