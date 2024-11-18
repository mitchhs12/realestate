"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { HomeType } from "@/lib/validations";
import { s3Client } from "@/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export async function getUserData(): Promise<any> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User not found");
  }

  const user = session.user;

  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        favoritedLists: {
          include: {
            homes: true,
          },
        },
        homes: true,
      },
    });

    return {
      favoritedLists: dbUser?.favoritedLists || [],
      homes: dbUser?.homes || [],
    };
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}

export async function getRecommended(): Promise<HomeType[]> {
  const homes = await prisma.home.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      price: "asc",
    },
    take: 6,
  });
  return homes;
}

export async function getPopular(takeNumber: number): Promise<HomeType[]> {
  const homes = await prisma.home.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      favoritedLists: {
        _count: "desc",
      },
    },
    take: takeNumber,
  });
  return homes;
}

export async function getNew(takeNumber: number): Promise<HomeType[]> {
  const homes = await prisma.home.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      completedAt: "desc",
    },
    take: takeNumber,
  });
  return homes;
}

export async function getCheapest(takeNumber: number): Promise<HomeType[]> {
  const homes = await prisma.home.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      priceUsd: "asc",
    },
    take: takeNumber,
  });

  return homes;
}

export async function createFavoriteList(name: string, homeId: number, url: string) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User not found");
  }

  try {
    const favoriteList = await prisma.favoriteList.create({
      data: {
        name,
        userId,
        homes: {
          connect: {
            id: homeId,
          },
        },
      },
      select: { id: true },
    });
    revalidatePath(url);
    return favoriteList.id;
  } catch (error) {
    console.error("Error creating favorite list:", error);
    throw new Error("Failed to create favorite list.");
  }
}

export async function updateFavoriteList(listId: number, homeId: number, url: string) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User not found");
  }

  try {
    await prisma.favoriteList.update({
      where: {
        id: listId,
      },
      data: {
        homes: {
          connect: {
            id: homeId,
          },
        },
      },
    });
    revalidatePath(url);
    return true;
  } catch (error) {
    console.error("Error updating favorite list:", error);
    return false;
  }
}

export async function removeHomeFromFavoriteList(listId: number, homeId: number, url: string) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User not found");
  }

  try {
    await prisma.favoriteList.update({
      where: {
        id: listId,
      },
      data: {
        homes: {
          disconnect: {
            id: homeId,
          },
        },
      },
    });
    revalidatePath(url);
    return true;
  } catch (error) {
    console.error("Error removing home from favorite list:", error);
    return false;
  }
}

export async function deleteFavoriteList(listId: number, url: string) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User not found");
  }

  try {
    await prisma.favoriteList.delete({
      where: {
        id: listId,
      },
    });
    revalidatePath(url);
    return true;
  } catch (error) {
    console.error("Error deleting favorite list:", error);
    return false;
  }
}

async function uploadToS3(file: Buffer, filePath: string, fileName: string, fileType: string) {
  const params = {
    Bucket: "vivaidealfinalbucket",
    Key: `${filePath}/${fileName}`,
    Body: file,
    ContentType: fileType,
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);
  const fileUrl = `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`;
  return fileUrl;
}

export async function uploadAIPhoto(formData: FormData, filePath: string) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return "User not found";
    }

    const file = formData.get("file");
    const homeId = formData.get("homeId") as string;

    if (!homeId) {
      return "Home ID is required";
    }

    if (!file) {
      return "You forgot to attach a photo";
    }

    if (typeof file !== "object" || !("arrayBuffer" in file)) {
      return "Invalid file";
    }

    if (!file.type.startsWith("image/")) {
      return "File is not an image!";
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const fileName = file.name; // Keep the original file name and extension

    return await uploadToS3(buffer, filePath, fileName, file.type);
  } catch (error: any) {
    console.error("Error uploading photo:", error);
    return error.message;
  }
}
