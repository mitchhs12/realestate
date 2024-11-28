"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { HomeType } from "@/lib/validations";
import { homeSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function getHomeById(
  homeId: string
): Promise<Omit<HomeType, "contactName" | "contactEmail" | "contactPhone"> | null> {
  const home = await prisma.home.findFirst({
    where: {
      isActive: true,
      id: Number(homeId),
    },
    select: {
      id: true,
      ownerId: true,
      title: true,
      description: true,
      address: true,
      municipality: true,
      subRegion: true,
      region: true,
      country: true,
      latitude: true,
      longitude: true,
      exactLocation: true,
      type: true,
      features: true,
      bedrooms: true,
      bathrooms: true,
      livingrooms: true,
      kitchens: true,
      capacity: true,
      photos: true,
      price: true,
      currency: true,
      language: true,
      priceUsd: true,
      priceNegotiable: true,
      listingType: true,
      areaSqm: true,
      isActive: true,
      isComplete: true,
      completedAt: true,
      listingFlowStep: true,
      // Omit the following fields:
      // contactName: false,
      // contactEmail: false,
      // contactPhone: false,
    },
  });

  return home;
}

export async function sendBuyMessage(homeId: number) {
  const session = await auth();
  const user = session?.user;
  try {
    if (user && user.email) {
      const userName = user.name;
      const userEmail = user.email;

      const payload = {
        username: "Property Bot", // The name of the bot
        content: `Someone wants to buy a property!\n${userName ? userName : "Unknown Username"}\n${userEmail}\nhttps://www.vivaideal.com/homes/${homeId}`,
      };
      const response = await fetch(
        "https://discord.com/api/webhooks/1293295558840025098/s1c1sKzTD4ub0ghGlF2gBPY6iLR_WRGUg-1zG_42YGyFyyjxbj7NP0rwzG7jK6JgLPXL",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send notification");
      }
      return { success: true, message: "Notification sent successfully" };
    } else {
      throw new Error("User not found");
    }
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function saveHome(newHome: HomeType, url: string) {
  const session = await auth();
  const user = session?.user;
  const { id, ...homeData } = homeSchema.parse(newHome);

  if (newHome.ownerId === user?.id) {
    const home = await prisma.home.update({
      where: {
        id: newHome.id,
      },
      data: homeData,
    });
    revalidatePath(url); // Revalidate the path if necessary
    return home;
  } else {
    throw new Error("Unauthorized");
  }
}
