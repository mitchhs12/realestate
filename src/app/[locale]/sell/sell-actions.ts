"use server";

import { auth } from "@/auth";
import { PutObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { s3Client } from "@/s3"; // Assuming your S3 client is already set up

export async function getObjectCount(bucketName: string, prefix: string): Promise<number> {
  try {
    const params = {
      Bucket: bucketName,
      Prefix: prefix, // Folder path in the bucket
    };

    // List objects in the bucket with the specified prefix
    const command = new ListObjectsV2Command(params);
    const response = await s3Client.send(command);

    // Count the objects
    const count = response.Contents ? response.Contents.length : 0;

    return count;
  } catch (error) {
    console.error("Error fetching object count:", error);
    throw new Error("Unable to fetch object count from S3.");
  }
}

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
    const user = session?.user;

    if (!user) {
      return "User not found";
    }

    if (!user.sellerSubscription) {
      return "User does not have a subscription";
    }

    const uploadLimit =
      user.sellerSubscription === "starter"
        ? 5
        : user.sellerSubscription === "pro"
          ? 15
          : user.sellerSubscription === "premium"
            ? 30
            : 50;

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

    const homeExists = user.homes.some((home) => home.id === homeId);

    if (!homeExists) {
      return "You do not have permission to upload photos to this home.";
    }

    const objectCount = await getObjectCount("vivaidealfinalbucket", `${homeId}/`);

    if (objectCount >= uploadLimit) {
      return `Photo limit exceeded. Current count: ${objectCount}. Maximum allowed: ${uploadLimit}`;
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const fileName = file.name; // Keep the original file name and extension

    if (buffer.length > 4 * 1024 * 1024) {
      return "File size exceeded. File size exceeds 4MB";
    }

    return await uploadToS3(buffer, homeId, fileName, file.type);
  } catch (error: any) {
    console.error("Error uploading photo:", error);
    return error.message;
  }
}
