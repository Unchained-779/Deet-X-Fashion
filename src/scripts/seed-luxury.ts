import { prisma } from "../lib/prisma";
import { LUXURY_CATALOG_SEEDS } from "../lib/catalogSeeds";
import { Size } from "@prisma/client";

async function main() {
  const currentCount = await prisma.product.count();
  console.log("Current product count before seed:", currentCount);

  const categories = [
    { name: "Silk Sarees", slug: "sarees", description: "Authentic handwoven silk sarees" },
    { name: "Ethnic & Kurtis", slug: "kurtis", description: "Festive anarkalis and daily chic tunics" },
    { name: "Festive Occasion", slug: "festive-wear", description: "Fine zari celebration ensembles" },
    { name: "Women", slug: "women", description: "Luxury women collection" },
    { name: "Men", slug: "men", description: "Royal sherwanis and kurtas" },
    { name: "Ethnic", slug: "ethnic", description: "Traditional heritage wear" },
    { name: "Western", slug: "western", description: "Linen dresses and shirts" },
    { name: "Bridal", slug: "bridal", description: "Bridal couture and lehengas" },
  ];

  const catMap: Record<string, string> = {};
  for (const c of categories) {
    const cat = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name },
      create: c,
    });
    catMap[c.slug] = cat.id;
  }

  let added = 0;
  for (const item of LUXURY_CATALOG_SEEDS) {
    const exists = await prisma.product.findUnique({
      where: { slug: item.slug },
    });

    if (!exists) {
      const catId = catMap[item.categorySlug] || catMap["sarees"];
      await prisma.product.create({
        data: {
          title: item.title,
          slug: item.slug,
          description: item.description,
          basePrice: item.basePrice,
          fabricCare: item.fabricCare,
          countryOfOrigin: item.countryOfOrigin,
          imageUrl: item.imageUrl,
          categoryId: catId,
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
      added++;
      console.log(`Added: ${item.title}`);
    }
  }

  const finalCount = await prisma.product.count();
  console.log(`Seeding complete! Added: ${added}, Total now in DB: ${finalCount}`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
