"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { UpdateListingValues, updateListingSchema } from "@/lib/validations";

// Sell Flow Page Actions

export async function getHomes() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User not found");
  }

  await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      homes: true,
    },
  });
  revalidatePath("/");
}

export async function updateHome(homeData: UpdateListingValues) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User not found");
  }

  // Validate the home data
  const parsedData = updateListingSchema.safeParse(homeData);

  if (!parsedData.success) {
    throw new Error("Invalid data");
  }

  const data = parsedData.data;

  const updatedHome = await prisma.home.update({
    where: {
      id: data.id, // Ensure you have an id field in your schema
    },
    data: {
      ownerId: data.ownerId,
      title: data.title,
      description: data.description,
      address: data.address,
      district: data.district,
      city: data.city,
      state: data.state,
      country: data.country,
      latitude: data.latitude,
      longitude: data.longitude,
      type: data.type,
      features: data.features,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      capacity: data.capacity,
      photos: data.photos,
      price: data.price,
      areaSqm: data.areaSqm,
      isActive: data.isActive,
      listingFlowStep: data.listingFlowStep,
    },
  });

  revalidatePath("/"); // Revalidate the path if necessary

  return updatedHome;
}
