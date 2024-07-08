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
  console.log("homes here:", homes);
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

export async function updateHome(homeValues: HomeType | null) {
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
        isActive: false, // Example default value, adjust as needed
        listingFlowStep: 1, // Example default value, adjust as needed
      },
    });
  } else {
    // Update existing home
    const { id, ...homeData } = homeSchema.parse(homeValues);

    updatedHome = await prisma.home.update({
      where: { id: id },
      data: homeData,
    });
  }

  revalidatePath("/"); // Revalidate the path if necessary

  return updatedHome;
}
