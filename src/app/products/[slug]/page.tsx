import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import StorefrontNavbar from "@/components/StorefrontNavbar";
import CartDrawer from "@/components/CartDrawer";
import PDPClient from "@/components/PDPClient";
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

  return (
    <div className="min-h-screen bg-background text-primary flex flex-col font-sans selection:bg-primary selection:text-background">
      <StorefrontNavbar />
      <CartDrawer />
      <main className="flex-1 pt-20">
        <PDPClient product={product} />
      </main>
    </div>
  );
}
