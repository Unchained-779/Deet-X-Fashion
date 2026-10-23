import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import StorefrontNavbar from "@/components/StorefrontNavbar";
import CartDrawer from "@/components/CartDrawer";
import PDPClient from "@/components/PDPClient";
import GlobalFooter from "@/components/GlobalFooter";
import type { Metadata } from "next";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
  });

  if (!product) {
    return {
      title: "Product Not Found | Deeta Fashion",
    };
  }

  return {
    title: `${product.title} | Deeta Fashion`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      variants: true,
    },
  });

  if (!product) {
    notFound();
  }

  // Fetch similar products in same category or featured
  const similarProducts = await prisma.product.findMany({
    where: {
      isPublished: true,
      id: { not: product.id },
      ...(product.categoryId ? { categoryId: product.categoryId } : {}),
    },
    include: {
      category: true,
      variants: true,
    },
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  const formattedSimilar = similarProducts.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    basePrice: p.basePrice,
    imageUrl: p.imageUrl,
    categoryName: p.category?.name,
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

  return (
    <div className="min-h-screen bg-background text-primary flex flex-col font-sans selection:bg-primary selection:text-background">
      <StorefrontNavbar />
      <CartDrawer />
      <main className="flex-1 pt-24 pb-16">
        <PDPClient
          product={product}
          similarProducts={formattedSimilar}
        />
      </main>
      <GlobalFooter />
    </div>
  );
}
