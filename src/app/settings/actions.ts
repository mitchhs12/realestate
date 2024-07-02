"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { UpdateProfileValues, updateProfileSchema } from "@/lib/validations";
import { auth } from "@/auth";

// Settings Page Actions

export async function updateProfile(values: UpdateProfileValues) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User not found");
  }
  const { name } = updateProfileSchema.parse(values);

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name,
    },
  });

  revalidatePath("/");
}
