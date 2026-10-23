import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No photo selected" }, { status: 400 });
    }

    // Validate mime type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files (JPG, PNG, WebP) are allowed" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to public/uploads directory if writable (local dev), otherwise fallback to base64 Data URL (serverless/Vercel)
    const mime = file.type || "image/jpeg";
    let publicUrl = `data:${mime};base64,${buffer.toString("base64")}`;

    try {
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadDir, { recursive: true });
      const cleanFileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const filePath = path.join(uploadDir, cleanFileName);
      await writeFile(filePath, buffer);
      publicUrl = `/uploads/${cleanFileName}`;
    } catch (fsErr) {
      // In serverless environments like Vercel with read-only root, use the compressed base64 URI
      console.warn("Local filesystem write not available, using inline data URL:", fsErr);
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
    });
  } catch (error) {
    console.error("Direct photo upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload photo. Please try again." },
      { status: 500 }
    );
  }
}
