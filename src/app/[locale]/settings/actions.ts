"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  updateSettingsSchema,
  UpdateSettingsValues,
  updateEmailSchema,
  UpdateEmailValues,
  updatePhoneSchema,
  UpdatePhoneValues,
  UpdateLanguageValues,
  updateLanguageSchema,
} from "@/lib/validations";
import { auth } from "@/auth";

// Settings Page Actions

export async function updateSettings(values: UpdateSettingsValues) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User not found");
  }
  console.log("values", values);
  const { name, currency, language } = updateSettingsSchema.parse(values);

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name,
      currency,
      language,
    },
  });
  revalidatePath("/");
}

export async function updateLanguage(values: UpdateLanguageValues) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return;
  }
  const { language } = updateLanguageSchema.parse(values);

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      language,
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

export async function updatePhone(values: UpdatePhoneValues) {
  console.log("values", values);
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User not found");
  }
  const { phoneNumber } = updatePhoneSchema.parse(values);

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      phoneNumber,
    },
  });
}
