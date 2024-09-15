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
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return homes;
}

export async function deleteFavoriteList(listId: number) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User not found");
  }

  await prisma.favoriteList.delete({
    where: {
      id: listId,
      userId: userId,
    },
  });

  revalidatePath("/my-wishlists");
}
