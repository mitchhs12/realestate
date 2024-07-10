"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { HomeType, homeSchema } from "@/lib/validations";

// Sell Flow Page Actions

export async function getUnfinishedHome() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User not found");
  }

  const homes = await prisma.home.findFirst({
    where: {
      ownerId: userId,
      listingFlowStep: {
        not: 12,
        gt: 0,
      },
    },
  });
  return homes;
}

export async function getHomes() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User not found");
  }

  const homes = await prisma.home.findMany({
    where: {
      ownerId: userId,
    },
  });
  console.log("homes here:", homes);
  return homes;
}

export async function updateHome(
  homeValues: HomeType | null,
  currentPage: string,
  shouldIncreaseListingFlowStep: boolean
): Promise<HomeType> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User not found");
  }

  let updatedHome;

  if (homeValues === null) {
    // Create new home
    updatedHome = await prisma.home.create({
      data: {
        ownerId: userId,
        listingFlowStep: 1, // Default value
      },
    });
  } else {
    if (shouldIncreaseListingFlowStep) {
      // Update existing home
      const { id, listingFlowStep, ...homeData } = homeSchema.parse(homeValues);

      const newData = shouldIncreaseListingFlowStep
        ? { ...homeData, listingFlowStep: listingFlowStep + 1 }
        : { ...homeData };

      updatedHome = await prisma.home.update({
        where: { id: id },
        data: newData,
      });
    } else {
      const { id, ...homeData } = homeSchema.parse(homeValues);

      updatedHome = await prisma.home.update({
        where: { id: id },
        data: homeData,
      });
    }
  }

  revalidatePath(currentPage); // Revalidate the path if necessary

  return updatedHome;
}
