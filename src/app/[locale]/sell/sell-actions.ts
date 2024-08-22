"use server";

import { auth } from "@/auth";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/s3";
import sharp from "sharp";

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

    return await uploadToS3(buffer, homeId, fileName, file.type);
  } catch (error: any) {
    console.error("Error uploading photo:", error);
    return error.message;
  }
}
