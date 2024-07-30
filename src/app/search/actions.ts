"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { BoundsType } from "@/lib/validations";

export async function getSearchResults(page: string, bounds: BoundsType) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User not found");
  }

  const homes = await prisma.home.findMany({
    where: {
      isActive: true,
      latitude: {
        gte: bounds.south,
        lte: bounds.north,
      },
      longitude: {
        gte: bounds.west,
        lte: bounds.east,
      },
    },
  });

  revalidatePath(page); // Revalidate the path if necessary
  return homes;
}

export async function getAllHomes() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User not found");
  }

  const homes = await prisma.home.findMany({
    where: {
      isActive: true,
    },
  });

  return homes;
}
