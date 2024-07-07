"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { UpdateTypesValues, updateTypesSchema } from "@/lib/validations";
import { auth } from "@/auth";

export async function updateTypes(values: UpdateTypesValues) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User not found");
  }

  const { types } = updateTypesSchema.parse(values);

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      types,
    },
  });

  revalidatePath("/");
}
