import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { LUXURY_CATALOG_SEEDS } from "@/lib/catalogSeeds";
import { Size } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const mode = url.searchParams.get("mode") || "upsert"; // 'upsert' or 'reset'

    // Ensure core Categories exist
    const categoriesMap: Record<string, string> = {};

    const defaultCategories = [
      { name: "Silk Sarees", slug: "sarees", description: "Authentic Kanjivaram, Banarasi, and Chanderi handwoven silks" },
      { name: "Ethnic & Kurtis", slug: "kurtis", description: "Breathable festive anarkalis and daily chic tunics" },
      { name: "Festive Occasion", slug: "festive-wear", description: "Embroidered celebratory ensembles with fine zari craftsmanship" },
      { name: "Women", slug: "women", description: "Luxury Indian ethnic and contemporary women's collection" },
      { name: "Men", slug: "men", description: "Regal sherwanis, bandhgalas, and handspun kurtas" },
      { name: "Ethnic", slug: "ethnic", description: "Timeless traditional ensembles and bridal heritage" },
      { name: "Western", slug: "western", description: "Minimalist linen dresses, shirts, and casual co-ords" },
    ];

    for (const cat of defaultCategories) {
      const created = await prisma.category.upsert({
        where: { slug: cat.slug },
        update: { name: cat.name, description: cat.description },
        create: { name: cat.name, slug: cat.slug, description: cat.description },
      });
      categoriesMap[cat.slug] = created.id;
    }

    let seededCount = 0;

    for (const item of LUXURY_CATALOG_SEEDS) {
      const categoryId = categoriesMap[item.categorySlug] || categoriesMap["sarees"];

      // Check if product exists
      const existing = await prisma.product.findUnique({
        where: { slug: item.slug },
        include: { variants: true },
      });

      if (existing) {
        // Update product info
        await prisma.product.update({
          where: { id: existing.id },
          data: {
            title: item.title,
            description: item.description,
            basePrice: item.basePrice,
            fabricCare: item.fabricCare,
            countryOfOrigin: item.countryOfOrigin,
            imageUrl: item.imageUrl,
            categoryId,
          },
        });
      } else {
        // Create product with variants
        await prisma.product.create({
          data: {
            title: item.title,
            slug: item.slug,
            description: item.description,
            basePrice: item.basePrice,
            fabricCare: item.fabricCare,
            countryOfOrigin: item.countryOfOrigin,
            imageUrl: item.imageUrl,
            categoryId,
            variants: {
              create: item.variants.map((v) => ({
                sku: v.sku,
                size: v.size as Size,
                colorName: v.colorName,
                colorHex: v.colorHex,
                stockCount: v.stockCount,
                images: item.galleryImages,
              })),
            },
          },
        });
        seededCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Seeded ${seededCount} new products. Total catalog available: ${LUXURY_CATALOG_SEEDS.length} items.`,
      seededCount,
    });
  } catch (error: any) {
    console.error("Catalog seed error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to seed catalog" },
      { status: 500 }
    );
  }
}
