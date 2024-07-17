"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { HomeType, homeSchema } from "@/lib/validations";
import { ListObjectsV2Command, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/s3";

export async function getUnfinishedHome() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User not found");
  }

  const homes = await prisma.home.findFirst({
    where: {
      ownerId: userId,
      listingFlowStep: {
        not: 12,
        gt: 0,
      },
    },
  });
  return homes;
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
  console.log("homes here:", homes);
  return homes;
}

export async function updateHome(
  homeValues: HomeType | null,
  currentPage: string,
  shouldIncreaseListingFlowStep: boolean
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
      // Update existing home
      const { id, listingFlowStep, ...homeData } = homeSchema.parse(homeValues);
      console.log("INCREMENTING LISTING FLOW STEP FROM", listingFlowStep, "to", listingFlowStep + 1);

      const newData = shouldIncreaseListingFlowStep
        ? { ...homeData, listingFlowStep: listingFlowStep + 1 }
        : { ...homeData };

      updatedHome = await prisma.home.update({
        where: { id: id },
        data: newData,
      });
    } else {
      const { id, ...homeData } = homeSchema.parse(homeValues);
      console.log("NOT INCREMENTING LISTING FLOW STEP");

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
