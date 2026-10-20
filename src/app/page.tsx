import { prisma } from "@/lib/prisma";
import StorefrontNavbar from "@/components/StorefrontNavbar";
import CartDrawer from "@/components/CartDrawer";
import ProductCard from "@/components/ProductCard";
import EditorialHero from "@/components/EditorialHero";
import LookbookGrid from "@/components/LookbookGrid";
import Link from "next/link";
import { Sparkles, ShieldCheck, ArrowRight } from "lucide-react";

export default async function Home() {
  const products = await prisma.product.findMany({
    where: { isPublished: true },
    include: {
      category: true,
      variants: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-background text-primary flex flex-col font-sans selection:bg-primary selection:text-background">
      <StorefrontNavbar />
      <CartDrawer />

      {/* 1. Full-Bleed Runway Hero (100dvh) */}
      <EditorialHero />

      {/* 2. Asymmetric 12-Column Lookbook Grid */}
      <LookbookGrid />

      {/* 3. Editorial Archival Catalog */}
      <main id="catalog" className="max-w-7xl mx-auto px-6 sm:px-8 py-20 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-baseline mb-12 pb-6 border-b border-[#E5E0D8] gap-4">
          <div>
            <span className="text-[11px] font-mono tracking-[0.25em] text-accent uppercase block mb-1">
              Handcrafted Catalogue
            </span>
            <h2
              style={{ fontFamily: "var(--font-editorial)" }}
              className="text-4xl sm:text-5xl font-normal text-primary"
            >
              Archival Garments
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-muted">
              Showing {products.length} {products.length === 1 ? "edition" : "editions"}
            </span>
            <Link
              href="/admin/products/new"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-accent hover:underline"
            >
              Curate Piece <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="border border-[#E5E0D8] bg-surface p-16 text-center">
            <h3
              style={{ fontFamily: "var(--font-editorial)" }}
              className="text-2xl font-normal text-primary"
            >
              No Editions Published Yet
            </h3>
            <p className="text-muted mt-2 text-xs max-w-md mx-auto font-sans leading-relaxed">
              Open the Atelier Management Portal to induct handcrafted silk sarees, kurtis, and couture into the live showcase.
            </p>
            <Link
              href="/admin/products/new"
              className="inline-block mt-8 px-8 py-3.5 bg-primary text-background font-mono text-xs uppercase tracking-[0.2em] rounded-none hover:bg-neutral-800 transition-colors"
            >
              Induct Garment
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                slug={product.slug}
                title={product.title}
                basePrice={product.basePrice}
                imageUrl={product.imageUrl}
                categoryName={product.category?.name}
                variants={product.variants}
              />
            ))}
          </div>
        )}
      </main>

      {/* 4. Atelier Values / Manifesto Bar */}
      <section className="border-y border-[#E5E0D8] bg-surface py-16 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">
          <div className="space-y-2">
            <span className="font-mono text-xs text-accent uppercase tracking-widest">01 / Craft</span>
            <h4
              style={{ fontFamily: "var(--font-editorial)" }}
              className="text-2xl font-normal text-primary"
            >
              Artisanal Provenance
            </h4>
            <p className="text-xs text-muted font-sans leading-relaxed">
              Every drape is sourced directly from master weaver clusters across Varanasi, Chanderi, and Kanchipuram.
            </p>
          </div>
          <div className="space-y-2">
            <span className="font-mono text-xs text-accent uppercase tracking-widest">02 / Integrity</span>
            <h4
              style={{ fontFamily: "var(--font-editorial)" }}
              className="text-2xl font-normal text-primary"
            >
              Uncompromising Geometry
            </h4>
            <p className="text-xs text-muted font-sans leading-relaxed">
              Tailoring rooted in razor-sharp silhouettes, pure organic yardage, and zero wasteful synthetic blends.
            </p>
          </div>
          <div className="space-y-2">
            <span className="font-mono text-xs text-accent uppercase tracking-widest">03 / Care</span>
            <h4
              style={{ fontFamily: "var(--font-editorial)" }}
              className="text-2xl font-normal text-primary"
            >
              Doorstep Preservation
            </h4>
            <p className="text-xs text-muted font-sans leading-relaxed">
              Delivered across India in museum-grade archival boxes with climate-controlled doorstep courier dispatch.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Minimalist Editorial Footer */}
      <footer className="bg-primary text-background mt-auto py-16 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
          <div>
            <span
              style={{ fontFamily: "var(--font-editorial)" }}
              className="text-3xl tracking-[0.25em] uppercase font-normal block"
            >
              DEETA FASHION
            </span>
            <p className="text-xs text-[#FAF8F5]/60 mt-2 max-w-sm font-sans leading-relaxed">
              Handcrafted festive wear, traditional sarees, and comfortable everyday styles made with pride.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-6 font-mono text-[11px] text-[#FAF8F5]/60 tracking-wider">
            <span>GST COMPLIANT</span>
            <span className="hidden sm:inline">•</span>
            <span>ALL-INDIA DELIVERY</span>
            <span className="hidden sm:inline">•</span>
            <span>© 2026 DEETA FASHION</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
