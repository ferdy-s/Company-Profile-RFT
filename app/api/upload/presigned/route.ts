import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getPresignedUploadUrl, getPublicUrl } from "@/lib/s3";
import { z } from "zod";

const requestSchema = z.object({
  fileName: z.string().min(1),
  fileType: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if user has admin role
  if (session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { fileName, fileType } = requestSchema.parse(body);

    // Generate a unique file key with timestamp and random string
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = fileName.split(".").pop() || "jpg";
    const fileKey = `uploads/${timestamp}-${randomString}.${fileExtension}`;

    // Generate presigned URL
    const presignedUrl = await getPresignedUploadUrl(fileKey, fileType, 3600); // 1 hour expiry

    // Return presigned URL and public URL
    return NextResponse.json({
      presignedUrl,
      publicUrl: getPublicUrl(fileKey),
      fileKey,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Error generating presigned URL:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
