"use server";

import prisma from "@/lib/prisma";
import { HomeType } from "@/lib/validations";

export async function getMyHomes(userId: string): Promise<HomeType[]> {
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
