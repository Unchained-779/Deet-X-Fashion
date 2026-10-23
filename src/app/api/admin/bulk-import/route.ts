import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Size } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let items: any[] = [];

    if (contentType.includes("application/json")) {
      const body = await req.json();
      items = Array.isArray(body) ? body : body.products || [];
    } else {
      const text = await req.text();
      // Simple CSV parser
      const lines = text.trim().split("\n");
      if (lines.length < 2) {
        return NextResponse.json({ error: "CSV file is empty or missing data rows" }, { status: 400 });
      }

      const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
      for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
        if (row.length < 2) continue;

        const obj: any = {};
        headers.forEach((h, idx) => {
          obj[h] = row[idx];
        });
        items.push(obj);
      }
    }

    if (!items.length) {
      return NextResponse.json({ error: "No products found in payload" }, { status: 400 });
    }

    let importedCount = 0;
    const errors: string[] = [];

    for (const item of items) {
      try {
        const title = item.title || item.name;
        if (!title) continue;

        const slug =
          item.slug ||
          title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now().toString().slice(-4);
        const basePrice = parseFloat(item.baseprice || item.price || item.sellingprice || "1999");
        const description = item.description || `${title} from Deeta Fashion handcrafted collection.`;
        const imageUrl = item.imageurl || item.image || item.primaryimage || null;
        const fabricCare = item.fabriccare || item.care || "Dry clean only";
        const sku = item.sku || `DEETA-${Date.now().toString().slice(-6)}`;
        const size = (item.size as Size) || Size.FREE_SIZE;
        const colorName = item.colorname || item.color || "Standard";
        const colorHex = item.colorhex || "#111111";
        const stockCount = parseInt(item.stockcount || item.stock || "10", 10);

        await prisma.product.create({
          data: {
            title,
            slug,
            description,
            basePrice,
            fabricCare,
            countryOfOrigin: "India",
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
        importedCount++;
      } catch (err: any) {
        errors.push(`Row error for ${item.title || "item"}: ${err?.message}`);
      }
    }

    return NextResponse.json({
      success: true,
      importedCount,
      totalSubmitted: items.length,
      errors: errors.slice(0, 5),
    });
  } catch (error: any) {
    console.error("Bulk import error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process bulk import" },
      { status: 500 }
    );
  }
}
