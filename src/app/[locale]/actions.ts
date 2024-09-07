"use server";

import prisma from "@/lib/prisma";
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
