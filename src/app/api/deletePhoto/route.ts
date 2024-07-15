import { NextRequest, NextResponse } from "next/server";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: "us-west-2",
  credentials: {
    accessKeyId: process.env.aws_access_key_id!,
    secretAccessKey: process.env.aws_secret_access_key!,
  },
});

async function deleteFileFromS3(houseId: string, fileName: string) {
  const params = {
    Bucket: "vivaidealfinalbucket",
    Key: `${houseId}/${fileName}`,
  };

  const command = new DeleteObjectCommand(params);
  await s3Client.send(command);
}

export async function POST(req: NextRequest) {
  try {
    const { houseId, fileName } = await req.json();

    if (!fileName) {
      return NextResponse.json({ error: "File name is required" }, { status: 400 });
    }

    await deleteFileFromS3(houseId, fileName);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
