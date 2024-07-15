"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { HomeType, homeSchema } from "@/lib/validations";
import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.aws_region,
  credentials: {
    accessKeyId: process.env.aws_access_key_id!,
    secretAccessKey: process.env.aws_secret_access_key!,
  },
});

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

async function uploadFileToS3(file: Buffer, homeId: string, fileName: string, fileType: string) {
  const params = {
    Bucket: "vivaidealfinalbucket",
    Key: `${homeId}/${fileName}`,
    Body: file,
    ContentType: fileType,
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);
  const fileUrl = `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`;
  return fileUrl;
}

export async function uploadFiles(formData: FormData) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User not found");
  }

  const files = formData.getAll("files");
  const homeId = formData.get("homeId") as string;

  if (!homeId) {
    throw new Error("Home ID is required");
  }

  if (files.length === 0) {
    throw new Error("You forgot to attach photos!");
  }

  const uploadPromises = files.map(async (file: any) => {
    if (typeof file !== "object" || !("arrayBuffer" in file)) {
      throw new Error("Invalid file");
    }

    if (!file.type.startsWith("image/")) {
      throw new Error("File is not an image!");
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    return uploadFileToS3(buffer, homeId, file.name, file.type);
  });

  const fileUrls = await Promise.all(uploadPromises);
  return fileUrls;
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
