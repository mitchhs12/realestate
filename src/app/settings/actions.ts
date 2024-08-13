"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { updateSettingsSchema, UpdateSettingsValues, updateEmailSchema, UpdateEmailValues } from "@/lib/validations";
import { auth } from "@/auth";

// Settings Page Actions

export async function updateSettings(values: UpdateSettingsValues) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User not found");
  }
  console.log("values", values);
  const { name, currency } = updateSettingsSchema.parse(values);

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name,
      currency,
    },
  });
  revalidatePath("/");
}

export async function updateEmail(values: UpdateEmailValues) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User not found");
  }
  const { email } = updateEmailSchema.parse(values);

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      email,
    },
  });

  revalidatePath("/");
}
