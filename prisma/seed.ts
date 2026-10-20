import { PrismaClient, Size } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding categories and authentic garment collections for Deeta Fashion...");

  // 1. Categories matching the navbar links
  const womenCat = await prisma.category.upsert({
    where: { slug: "women" },
    update: { name: "Women Collection" },
    create: {
      name: "Women Collection",
      slug: "women",
      description: "Handcrafted traditional sarees, festive anarkalis, and bridal lehengas.",
    },
  });

  const menCat = await prisma.category.upsert({
    where: { slug: "men" },
    update: { name: "Men Ethnic & Formals" },
    create: {
      name: "Men Ethnic & Formals",
      slug: "men",
      description: "Tailored silk kurtas, Nehru jackets, sherwanis, and luxury linen shirts.",
    },
  });

  const ethnicCat = await prisma.category.upsert({
    where: { slug: "ethnic" },
    update: { name: "Ethnic & Festive Weaves" },
    create: {
      name: "Ethnic & Festive Weaves",
      slug: "ethnic",
      description: "Heritage Banarasi silks, Lucknowi chikankari, and Chanderi suits.",
    },
  });

  const westernCat = await prisma.category.upsert({
    where: { slug: "western" },
    update: { name: "Western & Contemporary" },
    create: {
      name: "Western & Contemporary",
      slug: "western",
      description: "Modern casual shirts, relaxed trousers, and chic tailored silhouettes.",
    },
  });

  // 2. Garments: Women
  await prisma.product.upsert({
    where: { slug: "royal-maroon-kanjivaram-silk-saree" },
    update: { categoryId: womenCat.id },
    create: {
      title: "Royal Maroon Kanjivaram Pure Silk Saree",
      slug: "royal-maroon-kanjivaram-silk-saree",
      description: "Handwoven in pure mulberry silk with traditional temple zari border and rich gold pallu. Comes with an unstitched blouse piece.",
      basePrice: 5999,
      categoryId: womenCat.id,
      countryOfOrigin: "India (Tamil Nadu)",
      fabricCare: "Strictly dry clean only. Store in clean muslin cloth.",
      imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
      variants: {
        create: [
          {
            sku: "KANJI-MRN-FREE",
            size: Size.FREE_SIZE,
            colorName: "Maroon & Gold",
            colorHex: "#800000",
            stockCount: 8,
            images: ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"],
          },
        ],
      },
    },
  });

  await prisma.product.upsert({
    where: { slug: "emerald-green-chanderi-anarkali-set" },
    update: { categoryId: womenCat.id },
    create: {
      title: "Emerald Green Chanderi Anarkali Set",
      slug: "emerald-green-chanderi-anarkali-set",
      description: "Three-piece festive set featuring flared Chanderi silk anarkali with delicate gota patti hand embroidery, paired with cotton churidar and organza dupatta.",
      basePrice: 3499,
      categoryId: womenCat.id,
      countryOfOrigin: "India (Madhya Pradesh)",
      fabricCare: "Gentle dry clean recommended. Iron on reverse side.",
      imageUrl: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
      variants: {
        create: [
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
            stockCount: 8,
            images: ["https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80"],
          },
        ],
      },
    },
  });

  // 3. Garments: Men
  await prisma.product.upsert({
    where: { slug: "ivory-silk-embroidered-kurta-pyjama" },
    update: { categoryId: menCat.id },
    create: {
      title: "Ivory Raw Silk Embroidered Kurta Set",
      slug: "ivory-silk-embroidered-kurta-pyjama",
      description: "Bespoke festive kurta tailored in pure handspun raw silk with delicate thread embroidery on collar and cuffs. Includes tailored churidar.",
      basePrice: 2899,
      categoryId: menCat.id,
      countryOfOrigin: "India (Rajasthan)",
      fabricCare: "Dry clean only to maintain sheen.",
      imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
      variants: {
        create: [
          {
            sku: "KURTA-IVR-M",
            size: Size.M,
            colorName: "Ivory Cream",
            colorHex: "#FFFFF0",
            stockCount: 10,
            images: ["https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80"],
          },
          {
            sku: "KURTA-IVR-L",
            size: Size.L,
            colorName: "Ivory Cream",
            colorHex: "#FFFFF0",
            stockCount: 12,
            images: ["https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80"],
          },
        ],
      },
    },
  });

  await prisma.product.upsert({
    where: { slug: "royal-blue-bandhgala-jodhpuri-jacket" },
    update: { categoryId: menCat.id },
    create: {
      title: "Midnight Blue Jodhpuri Bandhgala Jacket",
      slug: "royal-blue-bandhgala-jodhpuri-jacket",
      description: "Structured wool-blend formal jacket with classic mandarin collar, metallic brass crest buttons, and double-vent back.",
      basePrice: 4499,
      categoryId: menCat.id,
      countryOfOrigin: "India",
      fabricCare: "Professional dry clean only.",
      imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80",
      variants: {
        create: [
          {
            sku: "BANDH-BLU-40",
            size: Size.L,
            colorName: "Midnight Blue",
            colorHex: "#0B1B3D",
            stockCount: 6,
            images: ["https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80"],
          },
        ],
      },
    },
  });

  // 4. Garments: Ethnic
  await prisma.product.upsert({
    where: { slug: "pastel-peach-chikankari-straight-kurti" },
    update: { categoryId: ethnicCat.id },
    create: {
      title: "Pastel Peach Chikankari Straight Kurti",
      slug: "pastel-peach-chikankari-straight-kurti",
      description: "Hand-embroidered Lucknowi chikankari straight cut kurti crafted in lightweight modal cotton. Ideal for elegant day-wear and celebrations.",
      basePrice: 1899,
      categoryId: ethnicCat.id,
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
        ],
      },
    },
  });

  await prisma.product.upsert({
    where: { slug: "tussar-silk-banarasi-zari-dupatta" },
    update: { categoryId: ethnicCat.id },
    create: {
      title: "Pure Tussar Silk Banarasi Zari Dupatta",
      slug: "tussar-silk-banarasi-zari-dupatta",
      description: "Artisan-woven natural wild tussar silk dupatta adorned with antique gold zari jaal and ornate fringe tassels.",
      basePrice: 2199,
      categoryId: ethnicCat.id,
      countryOfOrigin: "India (Varanasi)",
      fabricCare: "Dry clean only.",
      imageUrl: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
      variants: {
        create: [
          {
            sku: "DUPAT-TUS-FREE",
            size: Size.FREE_SIZE,
            colorName: "Natural Tussar Gold",
            colorHex: "#D4AF37",
            stockCount: 14,
            images: ["https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80"],
          },
        ],
      },
    },
  });

  // 5. Garments: Western
  await prisma.product.upsert({
    where: { slug: "relaxed-linen-resort-shirt-beige" },
    update: { categoryId: westernCat.id },
    create: {
      title: "Relaxed French Linen Camp Collar Shirt",
      slug: "relaxed-linen-resort-shirt-beige",
      description: "Breathable 100% pure organic linen casual shirt tailored in a relaxed fit with a cuban open collar and pearl buttons.",
      basePrice: 1599,
      categoryId: westernCat.id,
      countryOfOrigin: "India",
      fabricCare: "Machine wash cold. Hang dry in shade.",
      imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
      variants: {
        create: [
          {
            sku: "SHIRT-LIN-M",
            size: Size.M,
            colorName: "Sand Beige",
            colorHex: "#C2B280",
            stockCount: 12,
            images: ["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80"],
          },
          {
            sku: "SHIRT-LIN-L",
            size: Size.L,
            colorName: "Sand Beige",
            colorHex: "#C2B280",
            stockCount: 10,
            images: ["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80"],
          },
        ],
      },
    },
  });

  await prisma.product.upsert({
    where: { slug: "tailored-cotton-chinos-olive" },
    update: { categoryId: westernCat.id },
    create: {
      title: "Slim-Straight Stretch Cotton Chinos",
      slug: "tailored-cotton-chinos-olive",
      description: "Everyday luxury trousers woven with high-density cotton twill and 2% elastane for seamless all-day movement.",
      basePrice: 1799,
      categoryId: westernCat.id,
      countryOfOrigin: "India",
      fabricCare: "Machine wash warm with like colors.",
      imageUrl: "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=800&q=80",
      variants: {
        create: [
          {
            sku: "CHINO-OLV-32",
            size: Size.M,
            colorName: "Olive Green",
            colorHex: "#556B2F",
            stockCount: 15,
            images: ["https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=800&q=80"],
          },
        ],
      },
    },
  });

  console.log("Seeding completed successfully with 4 complete categories and products!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
