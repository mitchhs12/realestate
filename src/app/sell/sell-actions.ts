"use server";

import { auth } from "@/auth";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/s3";

async function uploadToS3(file: Buffer, homeId: string, fileName: string, fileType: string) {
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

export async function uploadPhotos(formData: FormData) {
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
    return uploadToS3(buffer, homeId, file.name, file.type);
  });

  const fileUrls = await Promise.all(uploadPromises);
  return fileUrls;
}
