"use server";

import { auth } from "@/auth";
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
