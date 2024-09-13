"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { HomeType } from "@/lib/validations";

export async function getRecommended(): Promise<HomeType[]> {
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
    include: {
      favoritedLists: {
        where: {
          userId,
        },
      },
    },
  });

  return homes.map((home) => ({
    ...home,
    isFavoritedByUser: home.favoritedLists.length > 0,
  }));
}

export async function getNew(): Promise<HomeType[]> {
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
    include: {
      favoritedLists: {
        where: {
          userId,
        },
      },
    },
  });

  return homes.map((home) => ({
    ...home,
    isFavoritedByUser: home.favoritedLists.length > 0,
  }));
}

export async function getCheapest(): Promise<HomeType[]> {
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
    include: {
      favoritedLists: {
        where: {
          userId,
        },
      },
    },
  });

  return homes.map((home) => ({
    ...home,
    isFavoritedByUser: home.favoritedLists.length > 0,
  }));
}

export async function createFavoriteList(name: string, homeId: number) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User not found");
  }

  try {
    await prisma.favoriteList.create({
      data: {
        name,
        userId,
        homes: {
          connect: {
            id: homeId,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error creating favorite list:", error);
    throw new Error("Failed to create favorite list.");
  }
  revalidatePath("/");
}

export async function updateFavoriteList(listId: number, homeId: number) {
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
}

export async function removeHomeFromFavoriteList(listId: number, homeId: number) {
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
}
