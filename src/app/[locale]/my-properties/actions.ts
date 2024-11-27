"use server";

import prisma from "@/lib/prisma";
import { HomeType } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function getMyHomes(): Promise<HomeType[]> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("User not found");
  }

  const homes = await prisma.home.findMany({
    where: {
      ownerId: userId,
      isDeleted: false,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          favoritedLists: true, // Count how many favorite lists this home is in
        },
      },
    },
  });

  return homes.map((home) => ({
    ...home,
    favoritedCount: home._count.favoritedLists, // Add favorited count to each home
  }));
}

export async function changeHomeVisibility(homeId: number, currentState: boolean, url: string) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("User not found");
  }

  const home = await prisma.home.update({
    where: {
      id: Number(homeId),
      ownerId: userId,
    },
    data: {
      isActive: !currentState,
    },
  });

  revalidatePath("/[locale]/my-properties", "page");
  return home;
}

export async function deleteHome(homeId: number) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("User not found");
  }

  const home = await prisma.home.update({
    where: {
      id: Number(homeId),
      ownerId: userId,
    },
    data: {
      isDeleted: true,
      isActive: false,
    },
  });
  revalidatePath("/[locale]/my-properties", "page");
  return home;
}

export async function changeAllHomeVisibilities(currentState: boolean) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("User not found");
  }

  const homes = await prisma.home.updateMany({
    where: {
      ownerId: userId,
      isComplete: true,
      isActive: currentState,
    },
    data: {
      isActive: !currentState,
    },
  });
  revalidatePath("/[locale]/my-properties", "page");
  return homes;
}
