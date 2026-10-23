"use client";

import { useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { ShoppingBag, Check, Heart, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface VariantType {
  id: string;
  sku: string;
  size: string;
  colorName: string;
  colorHex: string | null;
  stockCount: number;
  reservedStock: number;
  images?: string[];
}

interface ProductCardProps {
  id: string;
  slug: string;
  title: string;
  basePrice: number;
  imageUrl: string | null;
  categoryName?: string;
  fabricTag?: string;
  variants: VariantType[];
}

export default function ProductCard({
  id,
  slug,
  title,
  basePrice,
  imageUrl,
  categoryName,
  fabricTag,
  variants = [],
}: ProductCardProps) {
  const [selectedVariant, setSelectedVariant] = useState<VariantType>(variants[0]);
  const [isHovered, setIsHovered] = useState(false);
  const [added, setAdded] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();

  const isFavorited = isInWishlist(id);

  // Extract primary & secondary hover image
  const primaryImg = imageUrl || selectedVariant?.images?.[0] || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop";
  const secondaryImg =
    selectedVariant?.images?.[1] ||
    selectedVariant?.images?.[0] ||
    "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1200&auto=format&fit=crop";

  const availableStock = selectedVariant ? selectedVariant.stockCount - selectedVariant.reservedStock : 0;
  const isOutOfStock = availableStock <= 0;

  // Realistic discount calculation (e.g. MRP 35% higher)
  const mrp = Math.round(basePrice * 1.35);
  const discountPercent = Math.round(((mrp - basePrice) / mrp) * 100);

  const handleAddToCart = () => {
    if (!selectedVariant || isOutOfStock) return;

    addItem({
      variantId: selectedVariant.id,
      productId: id,
      title: title,
      size: selectedVariant.size,
      colorName: selectedVariant.colorName,
      price: basePrice,
      imageUrl: primaryImg,
      maxStock: availableStock,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem({
      id,
      slug,
      title,
      basePrice,
      imageUrl: primaryImg,
      categoryName,
    });
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group bg-background border border-[#E5E0D8] rounded-none flex flex-col justify-between transition-all duration-300 hover:border-primary hover:shadow-xl relative"
    >
      {/* Product Image Stage: Dual-Image Hover Swap */}
      <div className="relative aspect-[3/4] bg-surface overflow-hidden">
        <Link href={`/products/${slug}`} className="block w-full h-full relative">
          {/* Primary View */}
          <img
            src={primaryImg}
            alt={title}
            className={`absolute inset-0 w-full h-full object-cover object-top transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isHovered && secondaryImg ? "opacity-0 scale-105" : "opacity-100 scale-100"
            }`}
          />
          {/* Secondary Hover / Model Look Swap */}
          {secondaryImg && (
            <img
              src={secondaryImg}
              alt={`${title} - Alternate Angle`}
              className={`absolute inset-0 w-full h-full object-cover object-top transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isHovered ? "opacity-100 scale-105" : "opacity-0 scale-100"
              }`}
            />
          )}
        </Link>

        {/* Wishlist Heart Trigger Button */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          aria-label="Add to Wishlist"
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md border border-[#E5E0D8] flex items-center justify-center text-slate-800 hover:scale-110 transition-transform shadow-sm"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorited ? "fill-rose-600 text-rose-600" : "text-slate-700 hover:text-rose-600"
            }`}
          />
        </button>

        {/* Top Badges (Category + Discount + Fabric) */}
        <div className="absolute top-3 left-3 z-10 flex flex-col items-start gap-1">
          {categoryName && (
            <span className="bg-background/90 backdrop-blur-sm text-primary text-[9px] font-mono tracking-widest uppercase px-2 py-0.5 border border-[#E5E0D8]">
              {categoryName}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-amber-600 text-white text-[9px] font-mono tracking-wider font-bold px-2 py-0.5 shadow-sm">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-10">
            <span className="px-3 py-1 bg-white text-black font-mono text-[10px] uppercase tracking-widest font-bold">
              Sold Out
            </span>
          </div>
        )}

        {/* Quick-Add Size Drawer Overlay on Desktop Hover */}
        {!isOutOfStock && variants.length > 0 && (
          <div
            className={`absolute bottom-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-md p-2.5 border-t border-[#E5E0D8] transition-all duration-300 transform ${
              isHovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[9px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                Quick Size:
              </span>
              <span className="text-[9px] font-mono text-emerald-700 font-bold">Ready to Dispatch</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {variants.map((v) => {
                const isSelected = selectedVariant?.id === v.id;
                const vStock = v.stockCount - v.reservedStock;
                return (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    disabled={vStock <= 0}
                    className={`flex-1 py-1 px-1.5 text-[10px] font-mono font-semibold transition-all ${
                      isSelected
                        ? "bg-slate-900 text-white"
                        : vStock <= 0
                        ? "bg-slate-100 text-slate-400 line-through cursor-not-allowed"
                        : "bg-slate-50 hover:bg-slate-200 text-slate-800 border border-slate-200"
                    }`}
                  >
                    {v.size === "FREE_SIZE" ? "FREE SIZE" : v.size}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Editorial Card Footer */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between border-t border-[#E5E0D8] bg-background">
        <div>
          {/* Subtle Fabric Tag */}
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#C29B38] mb-1">
            <Sparkles className="w-2.5 h-2.5" />
            <span className="uppercase tracking-wider">
              {fabricTag || "Handcrafted Pure Fabric"}
            </span>
          </div>

          <Link href={`/products/${slug}`}>
            <h3
              style={{ fontFamily: "var(--font-editorial)" }}
              className="text-lg sm:text-xl font-normal text-primary group-hover:text-accent transition-colors duration-300 line-clamp-1"
            >
              {title}
            </h3>
          </Link>

          <div className="mt-2 flex items-baseline gap-2.5">
            <span className="font-mono text-base font-bold text-primary">
              ₹{basePrice.toLocaleString("en-IN")}
            </span>
            <span className="font-mono text-xs text-muted line-through">
              ₹{mrp.toLocaleString("en-IN")}
            </span>
            <span className="font-mono text-[10px] text-emerald-700 font-semibold">
              Save ₹{(mrp - basePrice).toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-4 pt-3 border-t border-[#E5E0D8]/60">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`w-full py-2.5 px-4 font-mono text-[11px] uppercase tracking-[0.2em] font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
              added
                ? "bg-emerald-700 text-white"
                : isOutOfStock
                ? "bg-surface text-muted cursor-not-allowed border border-[#E5E0D8]"
                : "bg-primary hover:bg-[#252525] text-background border border-primary shadow-sm"
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
                <ShoppingBag className="w-3.5 h-3.5 stroke-[1.5]" /> Add to Bag
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
