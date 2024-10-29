"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { HomeType, homeSchema } from "@/lib/validations";
import { auth } from "@/auth";

// Admin Page Actions

export async function createListing(values: HomeType) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User not found");
  }
  const {
    ownerId,
    title,
    description,
    address,
    municipality,
    subRegion,
    region,
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
      municipality: municipality || null,
      subRegion: subRegion || null,
      region: region || null,
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

export async function getAllPropertyIds(): Promise<{ id: number; ownerId: string; address: string | null }[]> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User not found");
  }

  const homeIds = await prisma.home.findMany({
    select: {
      id: true,
      ownerId: true,
      address: true,
    },
  });

  homeIds.sort((a, b) => a.id - b.id);

  return homeIds;
}

export async function getAllUserIds(): Promise<{ id: string; email: string | null }[]> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User not found");
  }

  const user = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
    },
  });

  return user;
}

export async function transferPropertyToAnotherUser(propertyId: number, targetUserId: string) {
  const session = await auth();
  const user = session?.user;

  if (!user?.id) {
    throw new Error("User not found");
  }

  if (user.role !== "admin") {
    throw new Error("User is not an admin");
  }

  const home = await prisma.home.update({
    where: {
      id: propertyId,
    },
    data: {
      ownerId: targetUserId,
    },
  });

  revalidatePath("/admin");
}

export async function transferMultiplePropertiesToAnotherUser(propertyIds: number[], targetUserId: string) {
  const session = await auth();
  const user = session?.user;

  if (!user?.id) {
    throw new Error("User not found");
  }

  if (user.role !== "admin") {
    throw new Error("User is not an admin");
  }

  for (const id of propertyIds) {
    await prisma.home.update({
      where: {
        id,
      },
      data: {
        ownerId: targetUserId,
      },
    });
  }

  revalidatePath("/admin");
}
