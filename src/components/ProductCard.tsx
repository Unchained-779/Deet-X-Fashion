"use client";

import { useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { ShoppingBag, Check } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getCloudinaryUrl, getCloudinaryBlurPlaceholder } from "@/lib/cloudinary";

interface VariantType {
  id: string;
  sku: string;
  size: string;
  colorName: string;
  colorHex: string | null;
  stockCount: number;
  reservedStock: number;
}

interface ProductCardProps {
  id: string;
  slug: string;
  title: string;
  basePrice: number;
  imageUrl: string | null;
  categoryName?: string;
  variants: VariantType[];
}

export default function ProductCard({
  id,
  slug,
  title,
  basePrice,
  imageUrl,
  categoryName,
  variants,
}: ProductCardProps) {
  const [selectedVariant, setSelectedVariant] = useState<VariantType>(variants[0]);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const availableStock = selectedVariant ? selectedVariant.stockCount - selectedVariant.reservedStock : 0;
  const isOutOfStock = availableStock <= 0;

  const handleAddToCart = () => {
    if (!selectedVariant || isOutOfStock) return;

    addItem({
      variantId: selectedVariant.id,
      productId: id,
      title: title,
      size: selectedVariant.size,
      colorName: selectedVariant.colorName,
      price: basePrice,
      imageUrl: imageUrl || undefined,
      maxStock: availableStock,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group bg-background border border-[#E5E0D8] rounded-none flex flex-col justify-between transition-colors duration-300 hover:border-primary">
      {/* Product Image: Sharp 3:4 Aspect Ratio with link to PDP */}
      <Link href={`/products/${slug}`} className="block relative aspect-[3/4] bg-surface overflow-hidden">
        {imageUrl ? (
          <Image
            src={getCloudinaryUrl(imageUrl, { width: 800, quality: "auto" })}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            placeholder="blur"
            blurDataURL={getCloudinaryBlurPlaceholder(imageUrl)}
            className="object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-surface text-muted">
            <span
              style={{ fontFamily: "var(--font-editorial)" }}
              className="tracking-[0.25em] text-lg text-primary"
            >
              DEETA
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted mt-1">
              Handcrafted Collection
            </span>
          </div>
        )}

        {categoryName && (
          <span className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm text-primary text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 border border-[#E5E0D8] z-10">
            {categoryName}
          </span>
        )}

        {isOutOfStock ? (
          <span className="absolute top-3 right-3 bg-primary text-background text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 z-10">
            Sold Out
          </span>
        ) : (
          availableStock < 5 && (
            <span className="absolute top-3 right-3 bg-accent text-white text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 z-10">
              Only {availableStock} left
            </span>
          )
        )}
      </Link>

      {/* Editorial Content */}
      <div className="p-5 flex-1 flex flex-col justify-between border-t border-[#E5E0D8] bg-background">
        <div>
          <Link href={`/products/${slug}`}>
            <h3
              style={{ fontFamily: "var(--font-editorial)" }}
              className="text-xl font-normal text-primary group-hover:text-accent transition-colors duration-300 line-clamp-1"
            >
              {title}
            </h3>
          </Link>

          <div className="mt-2 flex items-baseline gap-3">
            <span className="font-mono text-base font-medium text-primary">
              ₹{basePrice.toLocaleString("en-IN")}
            </span>
            <span className="font-mono text-xs text-muted line-through">
              ₹{Math.round(basePrice * 1.35).toLocaleString("en-IN")}
            </span>
          </div>

          {/* Size Selectors (Sharp 1px Border) */}
          {variants.length > 0 && (
            <div className="mt-4 pt-3 border-t border-[#E5E0D8]/60">
              <label className="text-[10px] font-mono uppercase tracking-widest text-muted block mb-2">
                Select Size:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {variants.map((v) => {
                  const isSelected = selectedVariant?.id === v.id;
                  const vStock = v.stockCount - v.reservedStock;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      disabled={vStock <= 0}
                      className={`px-2.5 py-1 text-[11px] font-mono rounded-none border transition-colors ${
                        isSelected
                          ? "border-primary bg-primary text-background"
                          : vStock <= 0
                          ? "border-transparent bg-surface text-muted/40 line-through cursor-not-allowed"
                          : "border-[#E5E0D8] text-primary hover:border-primary"
                      }`}
                    >
                      {v.size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Action Button: Sharp rounded-none */}
        <div className="mt-5 pt-4 border-t border-[#E5E0D8]">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`w-full py-3 px-4 rounded-none font-medium text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-colors duration-300 ${
              added
                ? "bg-accent text-white"
                : isOutOfStock
                ? "bg-surface text-muted cursor-not-allowed border border-[#E5E0D8]"
                : "bg-primary hover:bg-[#252525] text-background border border-primary"
            }`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" /> Added to Bag
              </>
            ) : isOutOfStock ? (
              "Sold Out"
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" /> Add to Bag
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
