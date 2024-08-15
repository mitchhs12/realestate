"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { HomeType, homeSchema } from "@/lib/validations";
import { ListObjectsV2Command, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/s3";
import { currencyOptions } from "@/lib/validations";
import { updatePhone } from "@/app/settings/actions";

interface ResponseObj {
  success: boolean;
  error: string;
}

const validateHome = (homeData: any) => {
  if (homeData.title && homeData.title.length > 32) {
    return { success: false, error: "Title cannot be longer than 32 characters long" };
  }
  if (homeData.description && homeData.description.length > 500) {
    return { success: false, error: "Description cannot be longer than 500 characters long" };
  }
  if (homeData.capacity === 0) {
    return { success: false, error: "Capacity cannot be 0" };
  }
  if (homeData.areaSqm === 0) {
    return { success: false, error: "Area cannot be 0" };
  }
  if (homeData.price === 0) {
    return { success: false, error: "Price cannot be 0" };
  }
  if (homeData.contactName === "") {
    return { success: false, error: "Contact name cannot be empty" };
  }
  if (homeData.contactEmail === "") {
    return { success: false, error: "Contact email cannot be empty" };
  }
  if (homeData.contactPhone === "") {
    return { success: false, error: "Contact phone cannot be empty" };
  }
  if (homeData.photos.length < 5) {
    ("You need at least 5 photos");
  }
  if (homeData.listingType === "standard") {
    if (homeData.photos.length > 5) {
      return { success: false, error: "You can only upload 5 photos with a standard listing" };
    }
  }
  return { success: true, error: "" };
};

export async function getUnfinishedHome() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    console.log("User not found");
    return null;
  }

  const homes = await prisma.home.findFirst({
    where: {
      ownerId: userId,
      isActive: { not: true },
    },
  });
  return homes;
}

export async function getCurrencies() {
  const currencySymbols = currencyOptions.map((option) => option.currency);

  const prices = await prisma.currencies.findMany({
    where: {
      symbol: {
        in: currencySymbols,
      },
    },
    select: {
      symbol: true,
      usdPrice: true,
    },
  });

  return prices;
}

export async function getHomes() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User not found");
  }

  const homes = await prisma.home.findMany({
    where: {
      ownerId: userId,
    },
  });
  return homes;
}

export async function sellHome(): Promise<ResponseObj> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("User not found");
  }
  const home = await getUnfinishedHome();
  const result = validateHome(home);

  if (result.success === false) {
    return result;
  }

  const { id, ...homeData } = homeSchema.parse(home);

  const newData = { ...homeData, isActive: true };

  await prisma.home.update({
    where: { id: id },
    data: newData,
  });

  return { success: true, error: "" };
}

export async function updateHome(
  homeValues: HomeType | null,
  currentPage: string,
  shouldIncreaseListingFlowStep: boolean,
  isMyPhone = false
): Promise<HomeType> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User not found");
  }

  let updatedHome;

  if (homeValues === null) {
    // Create new home
    updatedHome = await prisma.home.create({
      data: {
        ownerId: userId,
        listingFlowStep: 1, // Default value
      },
    });
  } else {
    if (shouldIncreaseListingFlowStep) {
      const promises: Promise<any>[] = [];

      // Check for updating phone number and add the promise to the array
      if (homeValues.contactPhone && session.user.phoneNumber !== homeValues?.contactPhone && isMyPhone) {
        promises.push(updatePhone({ phoneNumber: homeValues.contactPhone }));
      }

      // Update existing home and add the promise to the array
      const { id, listingFlowStep, ...homeData } = homeSchema.parse(homeValues);

      const newData = { ...homeData, listingFlowStep: listingFlowStep + 1 };

      promises.push(
        prisma.home.update({
          where: { id: id },
          data: newData,
        })
      );

      // Wait for all promises to resolve
      const results = await Promise.all(promises);
      updatedHome = results[results.length - 1]; // Always get the last result
    } else {
      const { id, ...homeData } = homeSchema.parse(homeValues);

      updatedHome = await prisma.home.update({
        where: { id: id },
        data: homeData,
      });
    }
  }

  revalidatePath(currentPage); // Revalidate the path if necessary

  return updatedHome;
}

export async function getPhotoUrls(homeId: number) {
  const params = {
    Bucket: "vivaidealfinalbucket",
    Prefix: `${homeId}/`,
  };

  const command = new ListObjectsV2Command(params);
  const data = await s3Client.send(command);

  if (!data.Contents) {
    return [];
  }

  const urls = data.Contents.map((item) => {
    return `https://${params.Bucket}.s3.${process.env.aws_region}.amazonaws.com/${item.Key}`;
  });

  return urls;
}

export async function deletePhoto(homeId: number, photoKey: string) {
  const params = {
    Bucket: "vivaidealfinalbucket",
    Key: `${homeId}/${photoKey}`,
  };

  const command = new DeleteObjectCommand(params);

  try {
    await s3Client.send(command);
    console.log(`Successfully deleted ${photoKey} from ${params.Bucket}`);
  } catch (error) {
    console.error("Error deleting photo:", error);
    throw new Error("Could not delete photo");
  }
}
