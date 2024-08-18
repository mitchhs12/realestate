"use server";

import prisma from "@/lib/prisma";
import { HomeType } from "@/lib/validations";

export async function getHomeById(homeId: string): Promise<HomeType | null> {
  const home = await prisma.home.findFirst({
    where: {
      isActive: true,
      id: Number(homeId),
    },
  });

  return home;
}
