"use client";

import { useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { ShoppingBag, ArrowRight, Check, Eye, Sparkles } from "lucide-react";

interface HotspotItem {
  id: string;
  name: string;
  category: string;
  price: number;
  x: number; // percentage from left
  y: number; // percentage from top
  slug: string;
  image: string;
}

const LOOKBOOK_ITEMS: HotspotItem[] = [
  {
    id: "hotspot-saree",
    name: "Pure Kanjivaram Brocade Saree",
    category: "Mulberry Silk",
    price: 8999,
    x: 42,
    y: 52,
    slug: "varanasi-bridal-pure-kanjivaram-silk-saree",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "hotspot-blouse",
    name: "Hand-Embroidered Zari Blouse",
    category: "Raw Silk Couture",
    price: 3499,
    x: 55,
    y: 35,
    slug: "royal-maroon-kanjivaram-pure-silk-saree",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600&auto=format&fit=crop",
  },
];

export default function ShopTheLookBanner() {
  const [activeHotspot, setActiveHotspot] = useState<HotspotItem | null>(LOOKBOOK_ITEMS[0]);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleQuickAdd = (item: HotspotItem) => {
    addItem({
      variantId: `variant-${item.id}`,
      productId: item.id,
      title: item.name,
      size: "FREE_SIZE",
      colorName: "Archival Crimson & Zari",
      price: item.price,
      imageUrl: item.image,
      maxStock: 5,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <section className="py-20 px-6 sm:px-8 max-w-7xl mx-auto w-full">
      <div className="bg-[#111111] text-[#FAF8F5] border border-[#262626] rounded-none overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-2xl">
        {/* Left: Model Photography with Interactive Pin Hotspots */}
        <div className="lg:col-span-7 relative min-h-[500px] sm:min-h-[620px] bg-black overflow-hidden group">
          <img
            src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1400&auto=format&fit=crop"
            alt="Editorial Festive Look"
            className="w-full h-full object-cover object-top transition-transform duration-1000 group-hover:scale-105 opacity-90"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

          {/* Floating Tag */}
          <div className="absolute top-6 left-6 z-10">
            <span className="px-3.5 py-1.5 bg-black/60 backdrop-blur-md text-[#FAF8F5] text-[10px] font-mono uppercase tracking-[0.2em] border border-white/20 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#C29B38]" />
              <span>Autumn Editorial Look 01</span>
            </span>
          </div>

          {/* Interactive Hotspot Pins */}
          {LOOKBOOK_ITEMS.map((item) => {
            const isActive = activeHotspot?.id === item.id;
            return (
              <div
                key={item.id}
                style={{ left: `${item.x}%`, top: `${item.y}%` }}
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
              >
                <button
                  type="button"
                  onClick={() => setActiveHotspot(item)}
                  className="relative flex items-center justify-center group/btn"
                  aria-label={`Inspect ${item.name}`}
                >
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
                      isActive
                        ? "bg-[#C29B38] text-white scale-125 ring-4 ring-white/30"
                        : "bg-white/90 text-slate-900 hover:scale-110"
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-current" />
                  </span>
                  <span className="absolute -top-7 whitespace-nowrap bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-white opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none">
                    {item.name}
                  </span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Right: Curated Outfit Inspector Card */}
        <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-[#262626] bg-[#161616]">
          <div>
            <span className="text-[10px] font-mono tracking-[0.28em] text-[#C29B38] uppercase block mb-1">
              Curated Silhouette Ensemble
            </span>
            <h2
              style={{ fontFamily: "var(--font-editorial)" }}
              className="text-3xl sm:text-4xl font-normal text-white mb-2"
            >
              Shop The Runway Look
            </h2>
            <p className="text-xs text-[#FAF8F5]/70 leading-relaxed font-sans mb-8">
              Click the interactive pins on the left to inspect and assemble this coordinated heirloom ensemble. Handwoven pure zari borders paired with artisanal silk.
            </p>

            {/* Currently Active Hotspot Item */}
            {activeHotspot && (
              <div className="bg-[#1c1c1c] border border-[#333] p-5 rounded-none flex items-center gap-4 transition-all animate-in fade-in duration-300">
                <img
                  src={activeHotspot.image}
                  alt={activeHotspot.name}
                  className="w-20 h-24 object-cover object-top border border-[#444] shrink-0"
                />
                <div className="space-y-1.5 flex-1 min-w-0">
                  <span className="text-[10px] font-mono text-[#C29B38] uppercase tracking-wider block">
                    {activeHotspot.category}
                  </span>
                  <h4 className="text-sm font-semibold text-white truncate font-sans">
                    {activeHotspot.name}
                  </h4>
                  <p className="font-mono text-base font-bold text-amber-300">
                    ₹{activeHotspot.price.toLocaleString("en-IN")}
                  </p>
                  <span className="inline-block text-[10px] font-mono text-emerald-400">
                    In Stock • Dispatches in 24h
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="pt-8 border-t border-[#262626] mt-8 space-y-3">
            {activeHotspot && (
              <button
                type="button"
                onClick={() => handleQuickAdd(activeHotspot)}
                className={`w-full py-3.5 px-6 font-mono text-xs uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 transition-all ${
                  added
                    ? "bg-emerald-700 text-white"
                    : "bg-[#FAF8F5] text-[#111] hover:bg-[#C29B38] hover:text-white"
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" /> Added to Your Bag
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" /> Add This Piece (₹{activeHotspot.price.toLocaleString("en-IN")})
                  </>
                )}
              </button>
            )}

            <Link
              href="/#catalog"
              className="w-full inline-flex items-center justify-center gap-2 py-3 text-xs font-mono uppercase tracking-wider text-[#FAF8F5]/70 hover:text-white transition-colors"
            >
              <span>Explore Complete Trousseau Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
