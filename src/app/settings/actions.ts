"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { UpdateNameValues, updateNameSchema, updateEmailSchema, UpdateEmailValues } from "@/lib/validations";
import { auth } from "@/auth";

// Settings Page Actions

export async function updateName(values: UpdateNameValues) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User not found");
  }
  console.log("values", values);
  const { name } = updateNameSchema.parse(values);

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
