import { PrismaClient, Size } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding initial categories and luxury garment collection...");

  // 1. Categories
  const sareesCat = await prisma.category.upsert({
    where: { slug: "sarees" },
    update: {},
    create: {
      name: "Silk Sarees",
      slug: "sarees",
      description: "Authentic Kanjivaram, Banarasi, and Chanderi handwoven silks",
    },
  });

  const kurtisCat = await prisma.category.upsert({
    where: { slug: "kurtis" },
    update: {},
    create: {
      name: "Ethnic & Kurtis",
      slug: "kurtis",
      description: "Breathable festive anarkalis and daily chic tunics",
    },
  });

  const festiveCat = await prisma.category.upsert({
    where: { slug: "festive-wear" },
    update: {},
    create: {
      name: "Festive Occasion",
      slug: "festive-wear",
      description: "Embroidered celebratory ensembles with fine zari craftsmanship",
    },
  });

  // 2. Garment 1: Kanjivaram Pure Silk Saree
  const saree = await prisma.product.upsert({
    where: { slug: "royal-maroon-kanjivaram-silk-saree" },
    update: {},
    create: {
      title: "Royal Maroon Kanjivaram Pure Silk Saree",
      slug: "royal-maroon-kanjivaram-silk-saree",
      description: "Handwoven in pure mulberry silk with traditional temple zari border and rich pallu. Comes with unstitched blouse piece.",
      basePrice: 5999,
      categoryId: sareesCat.id,
      countryOfOrigin: "India (Tamil Nadu)",
      fabricCare: "Strictly dry clean only. Store in clean muslin cloth.",
      imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
      variants: {
        create: [
          {
            sku: "KANJI-MRN-FREE",
            size: Size.FREE_SIZE,
            colorName: "Royal Maroon & Gold",
            colorHex: "#800000",
            stockCount: 8,
            images: ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"],
          },
        ],
      },
    },
  });

  // 3. Garment 2: Chanderi Anarkali Kurta Set
  const anarkali = await prisma.product.upsert({
    where: { slug: "emerald-green-chanderi-anarkali-set" },
    update: {},
    create: {
      title: "Emerald Green Chanderi Anarkali Set",
      slug: "emerald-green-chanderi-anarkali-set",
      description: "Three-piece festive set featuring flared Chanderi silk anarkali with delicate gota patti hand embroidery, paired with cotton churidar and organza dupatta.",
      basePrice: 3499,
      categoryId: kurtisCat.id,
      countryOfOrigin: "India (Madhya Pradesh)",
      fabricCare: "Gentle dry clean recommended. Iron on reverse side.",
      imageUrl: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
      variants: {
        create: [
          {
            sku: "ANARK-GRN-S",
            size: Size.S,
            colorName: "Emerald Green",
            colorHex: "#046307",
            stockCount: 12,
            images: ["https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80"],
          },
          {
            sku: "ANARK-GRN-M",
            size: Size.M,
            colorName: "Emerald Green",
            colorHex: "#046307",
            stockCount: 15,
            images: ["https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80"],
          },
          {
            sku: "ANARK-GRN-L",
            size: Size.L,
            colorName: "Emerald Green",
            colorHex: "#046307",
            stockCount: 4,
            images: ["https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80"],
          },
        ],
      },
    },
  });

  // 4. Garment 3: Pastel Peach Embroidered Kurti
  const peachKurti = await prisma.product.upsert({
    where: { slug: "pastel-peach-chikankari-straight-kurti" },
    update: {},
    create: {
      title: "Pastel Peach Chikankari Straight Kurti",
      slug: "pastel-peach-chikankari-straight-kurti",
      description: "Hand-embroidered Lucknowi chikankari straight cut kurti crafted in lightweight modal cotton. Ideal for elegant day-wear and celebrations.",
      basePrice: 1899,
      categoryId: festiveCat.id,
      countryOfOrigin: "India (Uttar Pradesh)",
      fabricCare: "Hand wash with mild detergent in cold water.",
      imageUrl: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
      variants: {
        create: [
          {
            sku: "CHIKAN-PCH-S",
            size: Size.S,
            colorName: "Pastel Peach",
            colorHex: "#ffdab9",
            stockCount: 20,
            images: ["https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80"],
          },
          {
            sku: "CHIKAN-PCH-M",
            size: Size.M,
            colorName: "Pastel Peach",
            colorHex: "#ffdab9",
            stockCount: 18,
            images: ["https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80"],
          },
          {
            sku: "CHIKAN-PCH-XL",
            size: Size.XL,
            colorName: "Pastel Peach",
            colorHex: "#ffdab9",
            stockCount: 2, // low stock trigger
            images: ["https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80"],
          },
        ],
      },
    },
  });

  console.log("Seeding finished successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
