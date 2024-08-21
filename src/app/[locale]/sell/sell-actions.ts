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

    console.log("running promise");

    const uploadPromises = files.map(async (file: any) => {
      if (typeof file !== "object" || !("arrayBuffer" in file)) {
        throw new Error("Invalid file");
      }

      if (!file.type.startsWith("image/")) {
        throw new Error("File is not an image!");
      }

      const buffer = Buffer.from(await file.arrayBuffer());

      console.log("running sharp");

      // Compress and convert to AVIF format using sharp
      const avifBuffer = await sharp(buffer)
        .resize({ width: 500, height: 500, fit: "outside" }) // Resize while maintaining aspect ratio
        .avif({ quality: 80 }) // Adjust quality as needed { quality: 80 }
        .toBuffer();

      console.log("finished running sharp");

      const avifFileName = file.name.replace(/\.[^/.]+$/, ".avif"); // Change file extension to .avif

      return uploadToS3(avifBuffer, homeId, avifFileName, "image/avif");
    });

    const fileUrls = await Promise.all(uploadPromises);
    return fileUrls;
  } catch (error) {
    console.error("Error uploading photos:", error);
    return error;
  }
}
