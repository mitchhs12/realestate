import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: "us-west-2",
  credentials: {
    accessKeyId: process.env.aws_access_key_id!,
    secretAccessKey: process.env.aws_secret_access_key!,
  },
});

async function uploadFileToS3(file: Buffer, fileName: string) {
  const params = {
    Bucket: "vivaidealfinalbucket",
    Key: `${fileName}-${Date.now()}`,
    Body: file,
    ContentType: "image/jpg",
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);
  return fileName;
}

export async function POST(req: NextRequest) {
  console.log("running route!");
  try {
    const formData = await req.formData();
    const files = formData.getAll("files");

    if (files.length === 0) {
      return NextResponse.json({ error: "You forgot to attach photos!" }, { status: 400 });
    }

    const uploadPromises = files.map(async (file) => {
      if (!(file instanceof File)) {
        throw new Error("Invalid file");
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      return uploadFileToS3(buffer, file.name);
    });

    await Promise.all(uploadPromises);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
