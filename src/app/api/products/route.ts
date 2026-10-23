import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Size } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim() || "";
    const categorySlug = searchParams.get("category")?.trim() || "";
    const sort = searchParams.get("sort") || "newest";
    const minPrice = parseFloat(searchParams.get("minPrice") || "0");
    const maxPrice = parseFloat(searchParams.get("maxPrice") || "1000000");

    let orderBy: any = { createdAt: "desc" };
    if (sort === "price-low") orderBy = { basePrice: "asc" };
    if (sort === "price-high") orderBy = { basePrice: "desc" };
    if (sort === "featured") orderBy = { createdAt: "desc" };

    const products = await prisma.product.findMany({
      where: {
        isPublished: true,
        basePrice: { gte: minPrice, lte: maxPrice },
        ...(query
          ? {
              OR: [
                { title: { contains: query, mode: "insensitive" } },
                { description: { contains: query, mode: "insensitive" } },
                { slug: { contains: query, mode: "insensitive" } },
              ],
            }
          : {}),
        ...(categorySlug
          ? {
              category: {
                slug: categorySlug,
              },
            }
          : {}),
      },
      include: {
        category: true,
        variants: true,
      },
      orderBy,
      take: 24,
    });

    return NextResponse.json({
      success: true,
      products,
      total: products.length,
    });
  } catch (error: any) {
    console.error("Failed to query products:", error);
    return NextResponse.json({ error: "Failed to search garments" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let data: any = {};

    if (contentType.includes("application/json")) {
      data = await req.json();
    } else {
      const formData = await req.formData();
      formData.forEach((val, key) => {
        data[key] = val;
      });
    }

    const title = data.title as string;
    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const brand = data.brand || "Deeta Fashion";
    const subcategory = data.subcategory || "";
    const fabricType = data.fabricType || "";
    const craftWork = data.craftWork || "";
    const occasion = data.occasion || "";
    const blouseIncluded = data.blouseIncluded === "true" || data.blouseIncluded === true;
    const isNewArrival = data.isNewArrival === "true" || data.isNewArrival === true;
    const isBestseller = data.isBestseller === "true" || data.isBestseller === true;
    const isFeatured = data.isFeatured === "true" || data.isFeatured === true;

    // Build rich formatted description
    const metadataParts = [];
    if (brand) metadataParts.push(`Brand: ${brand}`);
    if (subcategory) metadataParts.push(`Subcategory: ${subcategory}`);
    if (fabricType) metadataParts.push(`Fabric: ${fabricType}`);
    if (craftWork) metadataParts.push(`Craft/Work: ${craftWork}`);
    if (occasion) metadataParts.push(`Occasion: ${occasion}`);
    if (blouseIncluded) metadataParts.push(`Blouse Piece Included: Yes`);
    if (data.mrp) metadataParts.push(`MRP: ₹${data.mrp}`);
    if (data.gstPercent) metadataParts.push(`GST: ${data.gstPercent}%`);

    const metaPrefix = metadataParts.length > 0 ? `[${metadataParts.join(" | ")}]\n\n` : "";
    const rawDescription = (data.description as string) || `${title} from Deeta Fashion handcrafted collection.`;
    const fullDescription = `${metaPrefix}${rawDescription}`;

    const basePrice = parseFloat(String(data.sellingPrice || data.basePrice || "1999"));
    const slug =
      (data.slug as string) ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") +
        "-" +
        Date.now().toString().slice(-4);

    const categoryId = data.categoryId && data.categoryId !== "none" ? (data.categoryId as string) : null;
    const fabricCare = (data.fabricCare as string) || "Dry clean only";
    const countryOfOrigin = (data.countryOfOrigin as string) || "India";

    // Parse image list
    let images: string[] = [];
    if (Array.isArray(data.images)) {
      images = data.images.filter(Boolean);
    } else if (typeof data.images === "string") {
      try {
        images = JSON.parse(data.images);
      } catch {
        images = data.images.split(",").map((s: string) => s.trim()).filter(Boolean);
      }
    }

    const primaryImageUrl = (data.imageUrl as string) || images[0] || null;

    // Parse Size & Inventory Matrix
    let sizeStockMap: { size: Size; stock: number; sku: string; priceOverride?: number }[] = [];

    if (data.sizeMatrix) {
      try {
        const matrix = typeof data.sizeMatrix === "string" ? JSON.parse(data.sizeMatrix) : data.sizeMatrix;
        if (Array.isArray(matrix)) {
          sizeStockMap = matrix.map((m: any) => ({
            size: m.size as Size,
            stock: parseInt(m.stock || "0", 10),
            sku: m.sku || `DEETA-${title.slice(0, 3).toUpperCase()}-${m.size}-${Date.now().toString().slice(-3)}`,
            priceOverride: m.price ? parseFloat(m.price) : undefined,
          }));
        }
      } catch (err) {
        console.warn("Could not parse sizeMatrix:", err);
      }
    }

    const colorName = (data.colorName as string) || "Standard";
    const colorHex = (data.colorHex as string) || "#111111";

    // Fallback if no sizeMatrix provided
    if (sizeStockMap.length === 0) {
      const defaultSize = (data.size as Size) || Size.FREE_SIZE;
      const defaultStock = parseInt(String(data.stockCount || "5"), 10);
      const defaultSku = (data.sku as string) || `DEETA-${Date.now().toString().slice(-6)}`;
      sizeStockMap = [{ size: defaultSize, stock: defaultStock, sku: defaultSku }];
    }

    const createdProduct = await prisma.product.create({
      data: {
        title,
        slug,
        description: fullDescription,
        basePrice,
        categoryId,
        fabricCare,
        countryOfOrigin,
        imageUrl: primaryImageUrl,
        variants: {
          create: sizeStockMap.map((sm) => ({
            sku: sm.sku,
            size: sm.size,
            colorName,
            colorHex,
            stockCount: sm.stock,
            priceOverride: sm.priceOverride,
            images: images.length > 0 ? images : primaryImageUrl ? [primaryImageUrl] : [],
          })),
        },
      },
      include: {
        variants: true,
      },
    });

    if (contentType.includes("application/json")) {
      return NextResponse.json({
        success: true,
        product: createdProduct,
      });
    }

    return NextResponse.redirect(new URL("/admin/products", req.url), 303);
  } catch (error: any) {
    console.error("Failed to create garment:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to save garment to shop inventory" },
      { status: 500 }
    );
  }
}
