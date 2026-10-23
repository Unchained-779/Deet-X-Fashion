import { prisma } from "@/lib/prisma";
import StorefrontNavbar from "@/components/StorefrontNavbar";
import CartDrawer from "@/components/CartDrawer";
import PLPClient from "@/components/PLPClient";
import GlobalFooter from "@/components/GlobalFooter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Complete Handcrafted Collection | Deeta Fashion",
  description:
    "Explore pure silk sarees, royal festive sherwanis, embroidered kurtas, and contemporary bespoke luxury at Deeta Fashion.",
};

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { category } = await searchParams;

  const categoryData = category
    ? await prisma.category.findUnique({
        where: { slug: category },
      })
    : null;

  const products = await prisma.product.findMany({
    where: {
      isPublished: true,
      ...(categoryData
        ? {
            categoryId: categoryData.id,
          }
        : {}),
    },
    include: {
      category: true,
      variants: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const formattedProducts = products.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    basePrice: p.basePrice,
    imageUrl: p.imageUrl,
    description: p.description,
    fabricCare: p.fabricCare,
    category: p.category ? { name: p.category.name, slug: p.category.slug } : null,
    variants: p.variants.map((v) => ({
      id: v.id,
      sku: v.sku,
      size: v.size,
      colorName: v.colorName,
      colorHex: v.colorHex,
      stockCount: v.stockCount,
      reservedStock: v.reservedStock,
      images: v.images,
    })),
  }));

  const categoryTitle = categoryData ? `${categoryData.name} Collection` : "All Handcrafted Garments";
  const categoryDescription = categoryData
    ? `Explore our signature handloom creations and couture pieces crafted for ${categoryData.name.toLowerCase()}.`
    : "Handcrafted pure silk sarees, festive kurtas, royal sherwanis, and luxury ready-to-wear pieces.";

  return (
    <div className="min-h-screen bg-background text-primary flex flex-col font-sans selection:bg-primary selection:text-background">
      <StorefrontNavbar />
      <CartDrawer />
      <main className="flex-1 pt-24 pb-16">
        <PLPClient
          initialProducts={formattedProducts}
          categoryTitle={categoryTitle}
          categoryDescription={categoryDescription}
        />
      </main>
      <GlobalFooter />
    </div>
  );
}
