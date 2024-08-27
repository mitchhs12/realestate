"use server";

import prisma from "@/lib/prisma";
import { HomeType } from "@/lib/validations";

export async function getFeatured(): Promise<HomeType[]> {
  const homes = await prisma.home.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      price: "asc",
    },
    take: 5, // Limit the number of results to 4
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
    take: 5, // Limit the number of results to 4
  });

  return homes;
}
