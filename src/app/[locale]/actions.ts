"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { HomeType } from "@/lib/validations";

export async function getRecommended(): Promise<HomeType[] | (HomeType & { isFavoritedByUser: boolean })[]> {
  const session = await auth();
  const userId = session?.user?.id;

  const homes = await prisma.home.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      price: "asc",
    },
    take: 6,
    include: userId
      ? {
          favoritedLists: {
            where: {
              userId,
            },
          },
        }
      : undefined,
  });
  if (!userId) {
    return homes;
  } else {
    return homes.map((home) => ({
      ...home,
      isFavoritedByUser: (home as typeof home & { favoritedLists: { id: number }[] }).favoritedLists.length > 0,
    })) as (HomeType & { isFavoritedByUser: boolean })[];
  }
}

export async function getNew(): Promise<HomeType[] | (HomeType & { isFavoritedByUser: boolean })[]> {
  const session = await auth();
  const userId = session?.user?.id;

  const homes = await prisma.home.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 6,
    include: userId
      ? {
          favoritedLists: {
            where: {
              userId,
            },
          },
        }
      : undefined,
  });

  if (!userId) {
    return homes;
  } else {
    return homes.map((home) => ({
      ...home,
      isFavoritedByUser: (home as typeof home & { favoritedLists: { id: number }[] }).favoritedLists.length > 0,
    })) as (HomeType & { isFavoritedByUser: boolean })[];
  }
}

export async function getCheapest(): Promise<HomeType[] | (HomeType & { isFavoritedByUser: boolean })[]> {
  const session = await auth();
  const userId = session?.user?.id;

  const homes = await prisma.home.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      price: "asc",
    },
    take: 6,
    include: userId
      ? {
          favoritedLists: {
            where: {
              userId,
            },
          },
        }
      : undefined,
  });

  if (!userId) {
    return homes; // HomeType[]
  } else {
    return homes.map((home) => ({
      ...home,
      isFavoritedByUser: (home as typeof home & { favoritedLists: { id: number }[] }).favoritedLists.length > 0,
    })) as (HomeType & { isFavoritedByUser: boolean })[];
  }
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
  } catch (error) {
    console.error("Error updating favorite list:", error);
    throw new Error("Failed to update favorite list.");
  }
  revalidatePath(url);
  return;
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
  } catch (error) {
    console.error("Error removing home from favorite list:", error);
    throw new Error("Failed to remove home from favorite list.");
  }
  revalidatePath(url);
  return;
}

export async function deleteFavoriteList(listId: number) {
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
  } catch (error) {
    console.error("Error deleting favorite list:", error);
    throw new Error("Failed to delete favorite list.");
  }
  revalidatePath("/");
  return;
}
