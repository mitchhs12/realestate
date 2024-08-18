"use server";

import prisma from "@/lib/prisma";
import { HomeType } from "@/lib/validations";

export async function getFeatured(): Promise<HomeType[]> {
  const homes = await prisma.home.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      createdAt: "asc", // or any other criteria for "featured"
    },
    take: 6, // Limit the number of results to 4
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
    take: 6, // Limit the number of results to 4
  });

  return homes;
}
