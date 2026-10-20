import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Size } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const title = formData.get("title") as string;
    const slug = (formData.get("slug") as string) || title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const description = formData.get("description") as string;
    const basePrice = parseFloat(formData.get("basePrice") as string);
    const categoryId = (formData.get("categoryId") as string) || null;
    const fabricCare = (formData.get("fabricCare") as string) || "Dry clean only";
    const countryOfOrigin = (formData.get("countryOfOrigin") as string) || "India";
    const imageUrl = (formData.get("imageUrl") as string) || null;

    // Initial Variant details
    const sku = (formData.get("sku") as string) || `DEETA-${Date.now().toString().slice(-4)}`;
    const size = (formData.get("size") as Size) || Size.FREE_SIZE;
    const colorName = (formData.get("colorName") as string) || "Standard";
    const colorHex = (formData.get("colorHex") as string) || "#111111";
    const stockCount = parseInt(formData.get("stockCount") as string, 10) || 5;

    await prisma.product.create({
      data: {
        title,
        slug,
        description,
        basePrice,
        categoryId: categoryId && categoryId !== "none" ? categoryId : null,
        fabricCare,
        countryOfOrigin,
        imageUrl,
        variants: {
          create: {
            sku,
            size,
            colorName,
            colorHex,
            stockCount,
            images: imageUrl ? [imageUrl] : [],
          },
        },
      },
    });

    return NextResponse.redirect(new URL("/admin/products", req.url), 303);
  } catch (error) {
    console.error("Failed to create garment:", error);
    return NextResponse.json(
      { error: "Failed to save garment to shop inventory" },
      { status: 500 }
    );
  }
}
