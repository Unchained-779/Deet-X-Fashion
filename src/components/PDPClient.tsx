"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/useCartStore";
import {
  ShoppingBag,
  Check,
  Truck,
  ShieldCheck,
  Ruler,
  X,
  Maximize2,
  Lock,
  Sparkles,
  ArrowRight,
} from "lucide-react";

interface VariantType {
  id: string;
  sku: string;
  size: string;
  colorName: string;
  colorHex: string | null;
  stockCount: number;
  reservedStock: number;
  priceOverride?: number | null;
  images?: string[];
}

interface ProductDetailProps {
  product: {
    id: string;
    title: string;
    slug: string;
    description: string;
    fabricCare: string | null;
    countryOfOrigin: string | null;
    basePrice: number;
    imageUrl: string | null;
    category?: {
      name: string;
    } | null;
    variants: VariantType[];
  };
}

export default function PDPClient({ product }: ProductDetailProps) {
  const [selectedVariant, setSelectedVariant] = useState<VariantType>(
    product.variants[0] || {
      id: "fallback",
      sku: "DEETX-001",
      size: "FREE_SIZE",
      colorName: "Archival Ivory",
      colorHex: "#F5F2EB",
      stockCount: 10,
      reservedStock: 0,
    }
  );

  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [pincode, setPincode] = useState("");
  const [pinLoading, setPinLoading] = useState(false);
  const [pinResult, setPinResult] = useState<{
    success: boolean;
    date?: string;
    message?: string;
  } | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);

  const addItem = useCartStore((state) => state.addItem);

  // Gallery array: primary image + variant images + editorial fallback shots
  const gallery = [
    product.imageUrl || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop",
  ];

  // Unique colors and sizes
  const uniqueColors = Array.from(
    new Map(product.variants.map((v) => [v.colorName, v])).values()
  );

  const availableStock = selectedVariant.stockCount - selectedVariant.reservedStock;
  const isOutOfStock = availableStock <= 0;

  const handlePincodeCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[1-9][0-9]{5}$/.test(pincode)) {
      setPinResult({
        success: false,
        message: "Please enter a valid 6-digit Indian PIN code.",
      });
      return;
    }

    setPinLoading(true);
    setPinResult(null);

    try {
      const res = await fetch(`/api/logistics/pincode?pincode=${pincode}`);
      const data = await res.json();
      if (res.ok && data.data) {
        setPinResult({
          success: true,
          date: data.data.estimatedDeliveryDate,
          message: "Complimentary Express Courier Available",
        });
      } else {
        setPinResult({
          success: false,
          message: data.error || "Delivery unavailable to this PIN code.",
        });
      }
    } catch {
      setPinResult({
        success: false,
        message: "Unable to verify PIN code serviceability at this time.",
      });
    } finally {
      setPinLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    addItem({
      variantId: selectedVariant.id,
      productId: product.id,
      title: product.title,
      size: selectedVariant.size,
      colorName: selectedVariant.colorName,
      price: selectedVariant.priceOverride || product.basePrice,
      imageUrl: product.imageUrl || undefined,
      maxStock: availableStock,
    });

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 py-10 sm:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Left Column: 60% Width Vertical Editorial Stack */}
        <div className="lg:col-span-7 space-y-4">
          {gallery.map((imgUrl, idx) => (
            <div
              key={idx}
              className="relative group border border-[#E5E0D8] bg-surface aspect-[3/4] overflow-hidden cursor-zoom-in"
              onClick={() => setLightboxImg(imgUrl)}
            >
              <img
                src={imgUrl}
                alt={`${product.title} - View ${idx + 1}`}
                className="w-full h-full object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
              />
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="p-2 bg-background/90 backdrop-blur-sm border border-[#E5E0D8] flex items-center justify-center text-primary">
                  <Maximize2 className="w-4 h-4" />
                </span>
              </div>
              <div className="absolute bottom-4 left-4">
                <span className="font-mono text-[10px] uppercase tracking-widest text-primary bg-background/90 px-3 py-1 border border-[#E5E0D8]">
                  LOOK 0{idx + 1}
                </span>
              </div>
            </div>
          ))}

          {/* Video Loop Demonstration */}
          <div className="relative border border-[#E5E0D8] bg-black aspect-[3/4] overflow-hidden">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover object-center opacity-85"
            >
              <source
                src="https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-runway-show-41846-large.mp4"
                type="video/mp4"
              />
            </video>
            <div className="absolute bottom-4 left-4">
              <span className="font-mono text-[10px] uppercase tracking-widest text-white bg-black/80 px-3 py-1 border border-white/20">
                DRAPE MOTION • 1080P
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: 40% Width Sticky Editorial Panel */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 h-fit space-y-8 bg-background border border-[#E5E0D8] p-8 sm:p-10">
            {/* Header / Category / Title */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.2em] text-accent mb-2">
                <span>{product.category?.name || "ARCHIVAL DRAPERY"}</span>
                <span>SKU: {selectedVariant.sku}</span>
              </div>
              <h1
                style={{ fontFamily: "var(--font-editorial)" }}
                className="text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-primary leading-[1.05]"
              >
                {product.title}
              </h1>

              {/* Price Block */}
              <div className="mt-4 flex flex-col gap-1 pb-6 border-b border-[#E5E0D8]">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-2xl font-medium text-primary">
                    ₹{((selectedVariant.priceOverride || product.basePrice)).toLocaleString("en-IN")}
                  </span>
                  <span className="font-mono text-sm text-muted line-through">
                    ₹{Math.round(product.basePrice * 1.35).toLocaleString("en-IN")}
                  </span>
                </div>
                <span className="font-mono text-[11px] text-accent uppercase tracking-wider">
                  MRP INCLUSIVE OF ALL TAXES (5% GST INCLUDED)
                </span>
              </div>
            </div>

            {/* Interactive Hex Color Selector */}
            {uniqueColors.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3 text-xs font-mono uppercase tracking-wider">
                  <span className="text-muted">Color Palette:</span>
                  <span className="text-primary font-medium">{selectedVariant.colorName}</span>
                </div>
                <div className="flex items-center gap-3">
                  {uniqueColors.map((color) => {
                    const isSelected = selectedVariant.colorName === color.colorName;
                    return (
                      <button
                        key={color.id}
                        onClick={() => setSelectedVariant(color)}
                        className={`group relative p-1 rounded-none border transition-colors ${
                          isSelected ? "border-primary" : "border-[#E5E0D8] hover:border-muted"
                        }`}
                        title={color.colorName}
                      >
                        <span
                          className="block w-6 h-6 border border-black/10"
                          style={{ backgroundColor: color.colorHex || "#111111" }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Pill-Free Sharp Size Selector */}
            <div>
              <div className="flex items-center justify-between mb-3 text-xs font-mono uppercase tracking-wider">
                <span className="text-muted">Select Dimension:</span>
                <button
                  type="button"
                  onClick={() => setSizeGuideOpen(true)}
                  className="text-primary hover:text-accent flex items-center gap-1.5 transition-colors underline decoration-[#E5E0D8] underline-offset-4"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Find Your Fit</span>
                </button>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {product.variants.map((v) => {
                  const isSelected = selectedVariant.id === v.id;
                  const stock = v.stockCount - v.reservedStock;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      disabled={stock <= 0}
                      className={`py-3 text-xs font-mono uppercase tracking-wider rounded-none border transition-colors ${
                        isSelected
                          ? "bg-primary text-background border-primary"
                          : stock <= 0
                          ? "bg-surface text-muted/40 border-transparent line-through cursor-not-allowed"
                          : "bg-background text-primary border-[#E5E0D8] hover:border-primary"
                      }`}
                    >
                      {v.size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Add to Bag CTA */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`w-full py-4 px-6 rounded-none font-mono text-xs uppercase tracking-[0.25em] flex items-center justify-center gap-3 transition-colors duration-300 ${
                  addedToCart
                    ? "bg-accent text-white border border-accent"
                    : isOutOfStock
                    ? "bg-surface text-muted cursor-not-allowed border border-[#E5E0D8]"
                    : "bg-primary hover:bg-[#252525] text-background border border-primary"
                }`}
              >
                {addedToCart ? (
                  <>
                    <Check className="w-4 h-4" /> Added to Shopping Bag
                  </>
                ) : isOutOfStock ? (
                  "Archived / Out of Stock"
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 stroke-[1.5]" /> Acquire Piece
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-[10px] font-mono text-muted uppercase tracking-wider pt-2">
                <span>Free Insured Transit</span>
                <span>•</span>
                <span>7-Day Doorstep Exchange</span>
                <span>•</span>
                <span>Handloom Certified</span>
              </div>
            </div>

            {/* Live Indian PIN Code Checker */}
            <div className="p-5 bg-surface border border-[#E5E0D8] space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-primary">
                <Truck className="w-4 h-4 text-accent" />
                <span>Check Delivery & Logistics</span>
              </div>

              <form onSubmit={handlePincodeCheck} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter 6-digit Indian PIN"
                  className="flex-1 px-3 py-2 bg-background border border-[#E5E0D8] text-xs font-mono text-primary focus:outline-none focus:border-primary"
                />
                <button
                  type="submit"
                  disabled={pinLoading || pincode.length !== 6}
                  className="px-4 py-2 bg-primary text-background font-mono text-xs uppercase tracking-wider hover:bg-[#252525] disabled:opacity-50 transition-colors"
                >
                  {pinLoading ? "Checking..." : "Verify"}
                </button>
              </form>

              {pinResult && (
                <div
                  className={`text-xs p-3 font-mono border ${
                    pinResult.success
                      ? "bg-white border-accent/40 text-primary"
                      : "bg-red-50/50 border-red-200 text-red-700"
                  }`}
                >
                  {pinResult.success ? (
                    <div className="space-y-1.5">
                      <p className="font-medium text-accent">
                        Estimated Delivery By: {pinResult.date}
                      </p>
                      <div className="flex items-center gap-1.5 text-[11px] text-muted">
                        <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                        <span>Doorstep OTP Verified Delivery Active</span>
                      </div>
                    </div>
                  ) : (
                    <p>{pinResult.message}</p>
                  )}
                </div>
              )}
            </div>

            {/* Garment Details Accordion / Description */}
            <div className="space-y-4 pt-4 border-t border-[#E5E0D8] text-xs font-sans text-muted leading-relaxed">
              <h3 className="font-mono text-xs uppercase tracking-wider text-primary">
                Provenance & Description
              </h3>
              <p>{product.description}</p>
              {product.fabricCare && (
                <div className="pt-2">
                  <span className="font-mono text-[11px] text-primary uppercase block mb-1">
                    Fabric & Preservation:
                  </span>
                  <p>{product.fabricCare}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal (Framer Motion) */}
      <AnimatePresence>
        {lightboxImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 sm:p-8 cursor-zoom-out"
            onClick={() => setLightboxImg(null)}
          >
            <button
              onClick={() => setLightboxImg(null)}
              className="absolute top-6 right-6 p-2 text-white/70 hover:text-white"
              aria-label="Close Lightbox"
            >
              <X className="w-6 h-6" />
            </button>
            <motion.img
              src={lightboxImg}
              alt="High-resolution zoom"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="max-h-[90vh] max-w-[90vw] object-contain border border-white/10"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Find Your Fit Modal */}
      <AnimatePresence>
        {sizeGuideOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSizeGuideOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-xl bg-background border border-[#E5E0D8] p-8 z-10 space-y-6 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-4">
                <h3
                  style={{ fontFamily: "var(--font-editorial)" }}
                  className="text-3xl font-normal text-primary"
                >
                  Atelier Sizing Standard
                </h3>
                <button
                  onClick={() => setSizeGuideOpen(false)}
                  className="p-1 text-muted hover:text-primary"
                >
                  <X className="w-5 h-5 stroke-[1.5]" />
                </button>
              </div>

              <p className="text-xs text-muted font-sans leading-relaxed">
                All measurements are in inches. Our garments are hand-tailored with 2-inch internal seam margins for bespoke alterations.
              </p>

              <div className="border border-[#E5E0D8] overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="bg-surface border-b border-[#E5E0D8] text-muted">
                    <tr>
                      <th className="p-3">SIZE</th>
                      <th className="p-3">BUST (IN)</th>
                      <th className="p-3">WAIST (IN)</th>
                      <th className="p-3">HIP (IN)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E0D8] text-primary">
                    <tr>
                      <td className="p-3 font-semibold">XS</td>
                      <td className="p-3">32</td>
                      <td className="p-3">26</td>
                      <td className="p-3">35</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">S</td>
                      <td className="p-3">34</td>
                      <td className="p-3">28</td>
                      <td className="p-3">37</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">M</td>
                      <td className="p-3">36</td>
                      <td className="p-3">30</td>
                      <td className="p-3">39</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">L</td>
                      <td className="p-3">38</td>
                      <td className="p-3">32</td>
                      <td className="p-3">41</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">XL</td>
                      <td className="p-3">40</td>
                      <td className="p-3">34</td>
                      <td className="p-3">43</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSizeGuideOpen(false)}
                  className="px-6 py-2.5 bg-primary text-background font-mono text-xs uppercase tracking-wider"
                >
                  Close Sizing Guide
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
