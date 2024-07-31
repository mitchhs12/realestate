"use server";

import prisma from "@/lib/prisma";
import { HomeType } from "@/lib/validations";

export async function getFeatured(): Promise<HomeType[]> {
  const homes = await prisma.home.findMany({
    where: {
      isActive: true,
    },
  });

  return homes;
}

export async function getNew(): Promise<HomeType[]> {
  const homes = await prisma.home.findMany({
    where: {
      isActive: true,
    },
  });

  return homes;
}
