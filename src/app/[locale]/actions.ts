"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { HomeType } from "@/lib/validations";

export async function getRecommended(): Promise<HomeType[]> {
  const homes = await prisma.home.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      price: "asc",
    },
    take: 6,
  });
  return homes;
}

export async function getNew(): Promise<HomeType[]> {
  const homes = await prisma.home.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 6,
  });
  return homes;
}

export async function getCheapest(): Promise<HomeType[]> {
  const homes = await prisma.home.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      price: "asc",
    },
    take: 6,
  });

  return homes;
}

export async function createFavoriteList(name: string, homeId: number, url: string) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User not found");
  }

  try {
    const favoriteList = await prisma.favoriteList.create({
      data: {
        name,
        userId,
        homes: {
          connect: {
            id: homeId,
          },
        },
      },
      select: { id: true },
    });
    revalidatePath(url);
    return favoriteList.id;
  } catch (error) {
    console.error("Error creating favorite list:", error);
    throw new Error("Failed to create favorite list.");
  }
}

export async function updateFavoriteList(listId: number, homeId: number, url: string) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User not found");
  }

  try {
    await prisma.favoriteList.update({
      where: {
        id: listId,
      },
      data: {
        homes: {
          connect: {
            id: homeId,
          },
        },
      },
    });
    revalidatePath(url);
    return true;
  } catch (error) {
    console.error("Error updating favorite list:", error);
    return false;
  }
}

export async function removeHomeFromFavoriteList(listId: number, homeId: number, url: string) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User not found");
  }

  try {
    await prisma.favoriteList.update({
      where: {
        id: listId,
      },
      data: {
        homes: {
          disconnect: {
            id: homeId,
          },
        },
      },
    });
    revalidatePath(url);
    return true;
  } catch (error) {
    console.error("Error removing home from favorite list:", error);
    return false;
  }
}

export async function deleteFavoriteList(listId: number, url: string) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User not found");
  }

  try {
    await prisma.favoriteList.delete({
      where: {
        id: listId,
      },
    });
    revalidatePath(url);
    return true;
  } catch (error) {
    console.error("Error deleting favorite list:", error);
    return false;
  }
}
