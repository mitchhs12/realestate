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
  console.log("uploading photos");
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return "User not found";
    }

    const file = formData.get("file");
    console.log("file", file);
    const homeId = formData.get("homeId") as string;
    console.log("homeId", homeId);

    console.log("attempting to upload", file);

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

    // Compress and convert to AVIF format using sharp
    const avifBuffer = await sharp(buffer)
      .resize({ width: 500, height: 500, fit: "outside" }) // Resize while maintaining aspect ratio
      .avif({ quality: 80 }) // Adjust quality as needed { quality: 80 }
      .toBuffer();

    const avifFileName = file.name.replace(/\.[^/.]+$/, ".avif"); // Change file extension to .avif

    return await uploadToS3(avifBuffer, homeId, avifFileName, "image/avif");
  } catch (error: any) {
    console.error("Error uploading photo:", error);
    return error.message;
  }
}
