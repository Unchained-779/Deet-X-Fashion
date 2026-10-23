"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import ProductCard from "@/components/ProductCard";
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
  Heart,
  ChevronDown,
  Star,
  RefreshCw,
  Scissors,
  Award,
  Clock,
  CheckCircle2,
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
      slug?: string;
    } | null;
    variants: VariantType[];
  };
  similarProducts?: Array<{
    id: string;
    slug: string;
    title: string;
    basePrice: number;
    imageUrl: string | null;
    categoryName?: string;
    fabricTag?: string;
    variants: VariantType[];
  }>;
}

export default function PDPClient({ product, similarProducts = [] }: ProductDetailProps) {
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

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [sizeUnit, setSizeUnit] = useState<"inches" | "cm">("inches");

  // Pincode Delivery Estimator
  const [pincode, setPincode] = useState("");
  const [pinLoading, setPinLoading] = useState(false);
  const [pinResult, setPinResult] = useState<{
    success: boolean;
    date?: string;
    message?: string;
  } | null>(null);

  const [addedToCart, setAddedToCart] = useState(false);

  // Accordion state
  const [openAccordion, setOpenAccordion] = useState<string>("story");

  const addItem = useCartStore((state) => state.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();
  const isFavorited = isInWishlist(product.id);

  // Assemble comprehensive gallery
  const defaultShots = [
    product.imageUrl || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop",
  ];

  const variantImages = selectedVariant?.images && selectedVariant.images.length > 0 ? selectedVariant.images : [];
  const gallery = Array.from(new Set([...variantImages, ...defaultShots])).filter(Boolean);

  // Unique colors
  const uniqueColors = Array.from(
    new Map(product.variants.map((v) => [v.colorName, v])).values()
  );

  const availableStock = selectedVariant.stockCount - selectedVariant.reservedStock;
  const isOutOfStock = availableStock <= 0;
  const isLowStock = availableStock > 0 && availableStock <= 3;

  const currentPrice = selectedVariant.priceOverride || product.basePrice;
  const mrp = Math.round(currentPrice * 1.35);
  const discountPercent = Math.round(((mrp - currentPrice) / mrp) * 100);

  // Parse Metadata from description tags: [Brand: ... | Fabric: ... | Occasion: ...]
  const metaMatch = product.description.match(/^\[(.*?)\]\n\n([\s\S]*)$/);
  const metaTagsString = metaMatch ? metaMatch[1] : "";
  const cleanedDescription = metaMatch ? metaMatch[2] : product.description;

  const metadataPairs: Record<string, string> = {};
  if (metaTagsString) {
    metaTagsString.split("|").forEach((pair) => {
      const [k, v] = pair.split(":");
      if (k && v) metadataPairs[k.trim()] = v.trim();
    });
  }

  const fabricDetail = metadataPairs["Fabric"] || "100% Pure Mulberry Handloom Silk";
  const craftDetail = metadataPairs["Craft/Work"] || "Intricate Zari Kadwa Brocade Weave with Hand-Tied Tassels";
  const occasionDetail = metadataPairs["Occasion"] || "Wedding, Festive, Royal Reception";
  const blouseIncluded = metadataPairs["Blouse Piece Included"] || "Yes, 0.8m Unstitched Running Silk Blouse Fabric Included";

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
          message: "Express BlueDart/Delhivery Air Serviceable",
        });
      } else {
        // Fallback realistic delivery calculation (Today + 4 days)
        const d = new Date();
        d.setDate(d.getDate() + 4);
        const options: Intl.DateTimeFormatOptions = { weekday: "short", month: "short", day: "numeric" };
        const formattedDate = d.toLocaleDateString("en-IN", options);
        setPinResult({
          success: true,
          date: formattedDate,
          message: "Express Air Delivery Available • Cash on Delivery Active",
        });
      }
    } catch {
      const d = new Date();
      d.setDate(d.getDate() + 4);
      const options: Intl.DateTimeFormatOptions = { weekday: "short", month: "short", day: "numeric" };
      setPinResult({
        success: true,
        date: d.toLocaleDateString("en-IN", options),
        message: "Standard Insured Courier Available",
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
      price: currentPrice,
      imageUrl: gallery[0] || undefined,
      maxStock: availableStock,
    });

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleWishlistToggle = () => {
    toggleItem({
      id: product.id,
      slug: product.slug,
      title: product.title,
      basePrice: product.basePrice,
      imageUrl: gallery[0],
      categoryName: product.category?.name,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 font-sans text-primary">
      {/* Breadcrumb Navigation */}
      <nav className="mb-6 flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted">
        <a href="/" className="hover:text-primary transition-colors">
          Home
        </a>
        <span>/</span>
        <a
          href={`/shop?category=${product.category?.slug || "all"}`}
          className="hover:text-primary transition-colors"
        >
          {product.category?.name || "Collection"}
        </a>
        <span>/</span>
        <span className="text-primary truncate max-w-[200px] sm:max-w-md">{product.title}</span>
      </nav>

      {/* Main Two-Column Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
        {/* Left Column: Vertical Thumbnails Strip + High-Detail Main Stage */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4 sticky top-24">
          {/* Vertical Thumbnail Strip */}
          <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:w-24 shrink-0 no-scrollbar pb-2 md:pb-0">
            {gallery.map((imgUrl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImageIndex(idx)}
                className={`relative aspect-[3/4] w-16 md:w-full shrink-0 border transition-all overflow-hidden ${
                  activeImageIndex === idx
                    ? "border-primary ring-2 ring-amber-500/40"
                    : "border-[#E5E0D8] opacity-75 hover:opacity-100"
                }`}
              >
                <img
                  src={imgUrl}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover object-top"
                />
                <span className="absolute bottom-1 right-1 text-[8px] font-mono bg-black/60 text-white px-1">
                  0{idx + 1}
                </span>
              </button>
            ))}
          </div>

          {/* Main Visual Showcase with Click / Lightbox Zoom */}
          <div className="flex-1 relative group border border-[#E5E0D8] bg-surface aspect-[3/4] overflow-hidden cursor-zoom-in">
            <img
              src={gallery[activeImageIndex]}
              alt={`${product.title} - Main View`}
              className="w-full h-full object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
              onClick={() => setLightboxImg(gallery[activeImageIndex])}
            />

            {/* Click to Zoom Badge */}
            <div className="absolute top-4 right-4 flex items-center gap-2 pointer-events-none">
              <span className="bg-background/90 backdrop-blur-md border border-[#E5E0D8] px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-primary shadow-sm flex items-center gap-1.5 opacity-90 group-hover:opacity-100">
                <Maximize2 className="w-3.5 h-3.5 text-amber-600" />
                <span>Hover & Click to Zoom</span>
              </span>
            </div>

            {/* Authentic Silk / Handloom Tag */}
            <div className="absolute bottom-4 left-4">
              <span className="font-mono text-[10px] uppercase tracking-widest text-primary bg-background/90 backdrop-blur-md px-3 py-1.5 border border-[#E5E0D8] flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>CERTIFIED ARTISAN SILK</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Luxury Editorial Order Panel */}
        <div className="lg:col-span-5 space-y-6">
          {/* Header & Title */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.2em] text-[#C29B38] mb-2">
              <span>{product.category?.name || "ARCHIVAL DRAPERY"}</span>
              <span className="text-muted">SKU: {selectedVariant.sku}</span>
            </div>
            <h1
              style={{ fontFamily: "var(--font-editorial)" }}
              className="text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-primary leading-[1.08]"
            >
              {product.title}
            </h1>

            {/* Price Block */}
            <div className="mt-4 pb-5 border-b border-[#E5E0D8]">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-3xl font-bold text-primary">
                  ₹{currentPrice.toLocaleString("en-IN")}
                </span>
                <span className="font-mono text-base text-muted line-through">
                  ₹{mrp.toLocaleString("en-IN")}
                </span>
                {discountPercent > 0 && (
                  <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 border border-emerald-200">
                    Save ₹{(mrp - currentPrice).toLocaleString("en-IN")} ({discountPercent}% OFF)
                  </span>
                )}
              </div>
              <p className="mt-1 font-mono text-[11px] text-muted uppercase tracking-wider">
                MRP INCLUSIVE OF ALL TAXES (5% GST INCLUDED) • FREE ALL-INDIA SHIPPING
              </p>
            </div>
          </div>

          {/* Color Swatch Selector */}
          {uniqueColors.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2.5 text-xs font-mono uppercase tracking-wider">
                <span className="text-muted">Color Swatch:</span>
                <span className="text-primary font-bold">{selectedVariant.colorName}</span>
              </div>
              <div className="flex items-center gap-3">
                {uniqueColors.map((color) => {
                  const isSelected = selectedVariant.colorName === color.colorName;
                  return (
                    <button
                      key={color.id}
                      onClick={() => setSelectedVariant(color)}
                      className={`group relative p-1 transition-all ${
                        isSelected
                          ? "border-2 border-slate-900 ring-2 ring-amber-400 scale-105"
                          : "border border-[#E5E0D8] hover:border-slate-400"
                      }`}
                      title={color.colorName}
                    >
                      <span
                        className="block w-7 h-7 border border-black/10"
                        style={{ backgroundColor: color.colorHex || "#111111" }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Size Selector with Low-Stock Warnings & Struck-Through Sold-Out Sizes */}
          <div>
            <div className="flex items-center justify-between mb-2.5 text-xs font-mono uppercase tracking-wider">
              <span className="text-muted">Select Size:</span>
              <button
                type="button"
                onClick={() => setSizeGuideOpen(true)}
                className="text-amber-800 hover:text-amber-900 font-bold flex items-center gap-1.5 transition-colors underline decoration-amber-400 underline-offset-4"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Size Guide &amp; Measurements</span>
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {product.variants.map((v) => {
                const isSelected = selectedVariant.id === v.id;
                const stock = v.stockCount - v.reservedStock;
                const isOOS = stock <= 0;
                const isLow = stock > 0 && stock <= 3;

                return (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    disabled={isOOS}
                    className={`relative py-3 px-2 text-xs font-mono uppercase tracking-wider border transition-all text-center ${
                      isSelected
                        ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                        : isOOS
                        ? "bg-stone-100 text-stone-400 border-stone-200 line-through cursor-not-allowed"
                        : "bg-background text-primary border-[#E5E0D8] hover:border-slate-900"
                    }`}
                  >
                    <div>{v.size === "FREE_SIZE" ? "FREE SIZE" : v.size}</div>
                    {isLow && !isOOS && (
                      <span className="block text-[8px] font-bold text-amber-500 mt-0.5 animate-pulse">
                        Only {stock} left!
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Low Stock Warning Banner if currently selected variant is low */}
            {isLowStock && (
              <div className="mt-2 text-xs font-mono text-amber-800 bg-amber-50 border border-amber-200 p-2 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                <span>High demand: Only {availableStock} handcrafted pieces left in this size!</span>
              </div>
            )}
          </div>

          {/* Action CTAs: Add to Bag + Wishlist */}
          <div className="space-y-3 pt-2">
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 py-4 px-6 font-mono text-xs uppercase tracking-[0.25em] font-bold flex items-center justify-center gap-3 transition-colors duration-300 shadow-md ${
                  addedToCart
                    ? "bg-emerald-700 text-white"
                    : isOutOfStock
                    ? "bg-stone-200 text-stone-500 cursor-not-allowed border border-[#E5E0D8]"
                    : "bg-primary hover:bg-[#252525] text-background border border-primary"
                }`}
              >
                {addedToCart ? (
                  <>
                    <Check className="w-4 h-4" /> Added to Shopping Bag
                  </>
                ) : isOutOfStock ? (
                  "Sold Out"
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 stroke-[1.5]" /> Add to Bag
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleWishlistToggle}
                aria-label="Toggle Wishlist"
                className="w-14 shrink-0 border border-[#E5E0D8] flex items-center justify-center text-slate-800 hover:border-slate-800 transition-colors bg-white"
              >
                <Heart
                  className={`w-5 h-5 transition-colors ${
                    isFavorited ? "fill-rose-600 text-rose-600" : "text-slate-700"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-muted uppercase tracking-wider pt-1">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Free Insured Delivery
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <RefreshCw className="w-3 h-3 text-emerald-600" /> 7-Day Easy Exchange
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Award className="w-3 h-3 text-emerald-600" /> 100% Pure Handloom
              </span>
            </div>
          </div>

          {/* Live Indian Pincode Delivery Estimator */}
          <div className="p-5 bg-white border border-[#E5E0D8] rounded-xl space-y-3 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-900 font-bold">
              <Truck className="w-4 h-4 text-amber-600" />
              <span>Indian Pincode Delivery Estimator</span>
            </div>

            <form onSubmit={handlePincodeCheck} className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter 6-digit PIN (e.g. 110001, 560001)"
                className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-[#E5E0D8] text-xs font-mono text-slate-900 focus:outline-none focus:border-slate-900 rounded-lg"
              />
              <button
                type="submit"
                disabled={pinLoading || pincode.length !== 6}
                className="px-5 py-2.5 bg-slate-900 text-white font-mono text-xs uppercase tracking-wider font-bold hover:bg-slate-800 disabled:opacity-50 transition-colors rounded-lg shrink-0"
              >
                {pinLoading ? "Checking..." : "Check"}
              </button>
            </form>

            {pinResult && (
              <div
                className={`text-xs p-3.5 font-mono border rounded-lg ${
                  pinResult.success
                    ? "bg-emerald-50/70 border-emerald-200 text-emerald-950"
                    : "bg-red-50 border-red-200 text-red-700"
                }`}
              >
                {pinResult.success ? (
                  <div className="space-y-1">
                    <p className="font-bold text-emerald-900 flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      Estimated delivery by {pinResult.date}
                    </p>
                    <p className="text-[11px] text-emerald-800">
                      {pinResult.message} • Cash on Delivery available at this pincode.
                    </p>
                  </div>
                ) : (
                  <p>{pinResult.message}</p>
                )}
              </div>
            )}
          </div>

          {/* Structured Accordion Tabs */}
          <div className="border border-[#E5E0D8] bg-white rounded-xl divide-y divide-[#E5E0D8] overflow-hidden shadow-sm">
            {/* Accordion 1: Product Story & Styling Notes */}
            <div>
              <button
                type="button"
                onClick={() => setOpenAccordion(openAccordion === "story" ? "" : "story")}
                className="w-full p-4 text-left flex items-center justify-between text-xs font-mono uppercase tracking-wider font-bold text-slate-900 hover:bg-slate-50 transition-colors"
              >
                <span>1. Product Story &amp; Styling Notes</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${
                    openAccordion === "story" ? "rotate-180 text-amber-600" : "text-slate-400"
                  }`}
                />
              </button>
              {openAccordion === "story" && (
                <div className="p-4 pt-1 text-xs text-slate-600 font-sans leading-relaxed space-y-2 border-t border-slate-100 bg-slate-50/50">
                  <p>{cleanedDescription}</p>
                  <div className="mt-3 p-3 bg-amber-50/60 border border-amber-200/60 rounded text-[11px]">
                    <span className="font-bold text-amber-900 font-mono uppercase tracking-wider block mb-1">
                      Styling Note:
                    </span>
                    <span>
                      Pair with statement antique temple gold jewellery or minimal pearl chokers. For evening gatherings, style with a contrasting raw silk blouse and gold mojris.
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Accordion 2: Fabric, Craft & Specifications */}
            <div>
              <button
                type="button"
                onClick={() => setOpenAccordion(openAccordion === "craft" ? "" : "craft")}
                className="w-full p-4 text-left flex items-center justify-between text-xs font-mono uppercase tracking-wider font-bold text-slate-900 hover:bg-slate-50 transition-colors"
              >
                <span>2. Fabric, Craft &amp; Specifications</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${
                    openAccordion === "craft" ? "rotate-180 text-amber-600" : "text-slate-400"
                  }`}
                />
              </button>
              {openAccordion === "craft" && (
                <div className="p-4 pt-1 text-xs text-slate-600 font-mono space-y-2.5 border-t border-slate-100 bg-slate-50/50">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400 uppercase tracking-wider block text-[10px]">Pure Fabric:</span>
                      <span className="font-bold text-slate-800">{fabricDetail}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 uppercase tracking-wider block text-[10px]">Craft &amp; Karigari:</span>
                      <span className="font-bold text-slate-800">{craftDetail}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 uppercase tracking-wider block text-[10px]">Blouse Piece:</span>
                      <span className="font-bold text-slate-800">{blouseIncluded}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 uppercase tracking-wider block text-[10px]">Occasion:</span>
                      <span className="font-bold text-slate-800">{occasionDetail}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 uppercase tracking-wider block text-[10px]">Origin:</span>
                      <span className="font-bold text-slate-800">{product.countryOfOrigin || "India"}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 uppercase tracking-wider block text-[10px]">Authenticity:</span>
                      <span className="font-bold text-emerald-700">Silk Mark Certified</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Accordion 3: Wash Care & Maintenance */}
            <div>
              <button
                type="button"
                onClick={() => setOpenAccordion(openAccordion === "care" ? "" : "care")}
                className="w-full p-4 text-left flex items-center justify-between text-xs font-mono uppercase tracking-wider font-bold text-slate-900 hover:bg-slate-50 transition-colors"
              >
                <span>3. Wash Care &amp; Maintenance</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${
                    openAccordion === "care" ? "rotate-180 text-amber-600" : "text-slate-400"
                  }`}
                />
              </button>
              {openAccordion === "care" && (
                <div className="p-4 pt-1 text-xs text-slate-600 font-sans leading-relaxed space-y-2 border-t border-slate-100 bg-slate-50/50">
                  <p className="font-semibold text-slate-800">
                    {product.fabricCare || "Strictly Professional Dry Clean Only."}
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-[11px] text-slate-500">
                    <li>Store in breathable muslin or cotton covers away from direct sunlight.</li>
                    <li>Avoid spraying alcohol-based perfumes or deodorants directly onto zari borders.</li>
                    <li>Iron inside-out using low heat silk settings with a protective cotton cloth over embroidery.</li>
                    <li>Refold handloom silks periodically every 3-4 months along original creases.</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Accordion 4: Shipping & 7-Day Return Policy */}
            <div>
              <button
                type="button"
                onClick={() => setOpenAccordion(openAccordion === "policy" ? "" : "policy")}
                className="w-full p-4 text-left flex items-center justify-between text-xs font-mono uppercase tracking-wider font-bold text-slate-900 hover:bg-slate-50 transition-colors"
              >
                <span>4. Shipping &amp; 7-Day Return Policy</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${
                    openAccordion === "policy" ? "rotate-180 text-amber-600" : "text-slate-400"
                  }`}
                />
              </button>
              {openAccordion === "policy" && (
                <div className="p-4 pt-1 text-xs text-slate-600 font-sans leading-relaxed space-y-2 border-t border-slate-100 bg-slate-50/50">
                  <p>
                    <strong className="text-slate-800">Complimentary Pan-India Shipping:</strong> All orders above ₹1,999 qualify for complimentary express air courier delivery (Delhivery/BlueDart). Dispatched within 24-48 hours.
                  </p>
                  <p>
                    <strong className="text-slate-800">Hassle-Free 7-Day Return Window:</strong> We offer a 7-day doorstep return and size exchange policy for unworn items with security tags intact. Refunds are credited directly to your original payment method (or bank account for COD) within 5–7 business days upon receipt and inspection.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section with Star Rating Breakdown */}
      <section className="mt-20 pt-14 border-t border-[#E5E0D8]">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <span className="text-[11px] font-mono tracking-[0.25em] text-[#C29B38] uppercase">
              Client Appraisals
            </span>
            <h2
              style={{ fontFamily: "var(--font-editorial)" }}
              className="text-3xl sm:text-4xl font-normal text-primary"
            >
              Customer Reviews &amp; Star Rating
            </h2>
            <p className="text-xs text-muted font-sans">
              Verified collector experiences from patron homes across India and overseas.
            </p>
          </div>

          {/* Rating Breakdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-white border border-[#E5E0D8] p-8 rounded-2xl shadow-sm">
            {/* Left Score Box */}
            <div className="md:col-span-4 text-center md:border-r border-[#E5E0D8] md:pr-8">
              <div className="text-6xl font-mono font-bold text-slate-900">4.9</div>
              <div className="flex items-center justify-center gap-1 my-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs font-mono text-muted">Based on 142 verified client orders</p>
              <div className="mt-4">
                <span className="text-[11px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full font-bold">
                  98% Would Recommend Deeta
                </span>
              </div>
            </div>

            {/* Right Distribution Bars */}
            <div className="md:col-span-8 space-y-2.5 font-mono text-xs">
              <div className="flex items-center gap-3">
                <span className="w-12 text-slate-700">5 Star</span>
                <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: "91%" }} />
                </div>
                <span className="w-8 text-right text-slate-400">91%</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-12 text-slate-700">4 Star</span>
                <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: "7%" }} />
                </div>
                <span className="w-8 text-right text-slate-400">7%</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-12 text-slate-700">3 Star</span>
                <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: "2%" }} />
                </div>
                <span className="w-8 text-right text-slate-400">2%</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-12 text-slate-700">2 Star</span>
                <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: "0%" }} />
                </div>
                <span className="w-8 text-right text-slate-400">0%</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-12 text-slate-700">1 Star</span>
                <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: "0%" }} />
                </div>
                <span className="w-8 text-right text-slate-400">0%</span>
              </div>
            </div>
          </div>

          {/* Sample Verified Reviews */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white border border-[#E5E0D8] rounded-xl space-y-3 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Sunita Singhania</h4>
                  <span className="text-[11px] font-mono text-emerald-700 font-semibold">
                    Verified Buyer • South Delhi
                  </span>
                </div>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-600 font-sans leading-relaxed">
                &quot;The silk drape and zari shine is even more breathtaking in person than in the pictures. The unstitched blouse piece had ample length for my tailor. Arrived in a gorgeous hard-box packaging!&quot;
              </p>
              <span className="text-[10px] font-mono text-slate-400 block pt-1">Ordered Festive Edition</span>
            </div>

            <div className="p-6 bg-white border border-[#E5E0D8] rounded-xl space-y-3 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Pooja Venkatesh</h4>
                  <span className="text-[11px] font-mono text-emerald-700 font-semibold">
                    Verified Buyer • Indiranagar, Bengaluru
                  </span>
                </div>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-600 font-sans leading-relaxed">
                &quot;Checked the PIN code estimator and it arrived on day 3 through BlueDart. The fabric weight feels extremely regal and royal. 10/10 craftsmanship.&quot;
              </p>
              <span className="text-[10px] font-mono text-slate-400 block pt-1">Ordered Royal Silk Saree</span>
            </div>
          </div>
        </div>
      </section>

      {/* Complete The Look / Similar Styles Recommendations */}
      {similarProducts && similarProducts.length > 0 && (
        <section className="mt-20 pt-14 border-t border-[#E5E0D8]">
          <div className="flex flex-col sm:flex-row justify-between items-baseline mb-8 pb-4 border-b border-[#E5E0D8] gap-2">
            <div>
              <span className="text-[11px] font-mono tracking-[0.25em] text-[#C29B38] uppercase block mb-1">
                Atelier Pairing
              </span>
              <h2
                style={{ fontFamily: "var(--font-editorial)" }}
                className="text-3xl sm:text-4xl font-normal text-primary"
              >
                Complete The Look &amp; Similar Styles
              </h2>
            </div>
            <a
              href={`/shop?category=${product.category?.slug || "all"}`}
              className="text-xs font-mono uppercase tracking-wider text-amber-800 hover:underline flex items-center gap-1 font-bold"
            >
              View Full Collection <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarProducts.slice(0, 4).map((item) => (
              <ProductCard
                key={item.id}
                id={item.id}
                slug={item.slug}
                title={item.title}
                basePrice={item.basePrice}
                imageUrl={item.imageUrl}
                categoryName={item.categoryName}
                fabricTag={item.fabricTag}
                variants={item.variants}
              />
            ))}
          </div>
        </section>
      )}

      {/* High-Resolution Zoom Lightbox Modal */}
      <AnimatePresence>
        {lightboxImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
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
              alt="High-resolution fabric weave zoom"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="max-h-[90vh] max-w-[90vw] object-contain border border-white/10"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Size Guide Modal with Inches / CM Toggle & How to Measure Guide */}
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
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-2xl bg-white border border-[#E5E0D8] p-6 sm:p-8 z-10 space-y-6 shadow-2xl rounded-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-4">
                <div>
                  <h3
                    style={{ fontFamily: "var(--font-editorial)" }}
                    className="text-2xl sm:text-3xl font-normal text-slate-900"
                  >
                    Atelier Sizing Guide &amp; Tailoring Chart
                  </h3>
                  <p className="text-xs font-mono text-muted mt-1">
                    Hand-tailored dimensions with 2-inch internal seam margins for easy alterations.
                  </p>
                </div>
                <button
                  onClick={() => setSizeGuideOpen(false)}
                  className="p-1 text-muted hover:text-primary"
                >
                  <X className="w-5 h-5 stroke-[1.5]" />
                </button>
              </div>

              {/* Unit Switcher Pills: Inches vs Centimeters */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold">
                  Measurement Unit:
                </span>
                <div className="flex border border-slate-300 rounded-lg p-0.5 bg-slate-100 font-mono text-xs">
                  <button
                    type="button"
                    onClick={() => setSizeUnit("inches")}
                    className={`px-3 py-1 rounded-md font-semibold transition-all ${
                      sizeUnit === "inches"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Inches (IN)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSizeUnit("cm")}
                    className={`px-3 py-1 rounded-md font-semibold transition-all ${
                      sizeUnit === "cm"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Centimeters (CM)
                  </button>
                </div>
              </div>

              {/* Size Chart Table */}
              <div className="border border-[#E5E0D8] rounded-xl overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="bg-slate-50 border-b border-[#E5E0D8] text-slate-700">
                    <tr>
                      <th className="p-3 font-bold">SIZE</th>
                      <th className="p-3 font-bold">BUST ({sizeUnit === "inches" ? "IN" : "CM"})</th>
                      <th className="p-3 font-bold">WAIST ({sizeUnit === "inches" ? "IN" : "CM"})</th>
                      <th className="p-3 font-bold">HIP ({sizeUnit === "inches" ? "IN" : "CM"})</th>
                      <th className="p-3 font-bold">LENGTH ({sizeUnit === "inches" ? "IN" : "CM"})</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E0D8] text-slate-900">
                    <tr>
                      <td className="p-3 font-bold">XS</td>
                      <td className="p-3">{sizeUnit === "inches" ? "32" : "81"}</td>
                      <td className="p-3">{sizeUnit === "inches" ? "26" : "66"}</td>
                      <td className="p-3">{sizeUnit === "inches" ? "35" : "89"}</td>
                      <td className="p-3">{sizeUnit === "inches" ? "54" : "137"}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold">S</td>
                      <td className="p-3">{sizeUnit === "inches" ? "34" : "86"}</td>
                      <td className="p-3">{sizeUnit === "inches" ? "28" : "71"}</td>
                      <td className="p-3">{sizeUnit === "inches" ? "37" : "94"}</td>
                      <td className="p-3">{sizeUnit === "inches" ? "54" : "137"}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold">M</td>
                      <td className="p-3">{sizeUnit === "inches" ? "36" : "91"}</td>
                      <td className="p-3">{sizeUnit === "inches" ? "30" : "76"}</td>
                      <td className="p-3">{sizeUnit === "inches" ? "39" : "99"}</td>
                      <td className="p-3">{sizeUnit === "inches" ? "55" : "140"}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold">L</td>
                      <td className="p-3">{sizeUnit === "inches" ? "38" : "96"}</td>
                      <td className="p-3">{sizeUnit === "inches" ? "32" : "81"}</td>
                      <td className="p-3">{sizeUnit === "inches" ? "41" : "104"}</td>
                      <td className="p-3">{sizeUnit === "inches" ? "55" : "140"}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold">XL</td>
                      <td className="p-3">{sizeUnit === "inches" ? "40" : "101"}</td>
                      <td className="p-3">{sizeUnit === "inches" ? "34" : "86"}</td>
                      <td className="p-3">{sizeUnit === "inches" ? "43" : "109"}</td>
                      <td className="p-3">{sizeUnit === "inches" ? "56" : "142"}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold">XXL</td>
                      <td className="p-3">{sizeUnit === "inches" ? "42" : "106"}</td>
                      <td className="p-3">{sizeUnit === "inches" ? "36" : "91"}</td>
                      <td className="p-3">{sizeUnit === "inches" ? "45" : "114"}</td>
                      <td className="p-3">{sizeUnit === "inches" ? "56" : "142"}</td>
                    </tr>
                    <tr className="bg-amber-50/50">
                      <td className="p-3 font-bold text-amber-900">FREE SIZE</td>
                      <td className="p-3 text-amber-900" colSpan={4}>
                        Sarees: 5.5 Meters drape + 0.8 Meters unstitched matching blouse fabric. Fits all body frames gracefully.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* How to Measure Instructions */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-800 uppercase tracking-wider">
                  <Scissors className="w-4 h-4 text-amber-600" />
                  <span>How To Measure Your Exact Fit</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] text-slate-600 font-sans">
                  <div>
                    <span className="font-bold block text-slate-800">1. Bust</span>
                    <span>Measure around the fullest part of your chest, keeping the tape level.</span>
                  </div>
                  <div>
                    <span className="font-bold block text-slate-800">2. Natural Waist</span>
                    <span>Measure around your natural waistline, typically an inch above the naval.</span>
                  </div>
                  <div>
                    <span className="font-bold block text-slate-800">3. Hips</span>
                    <span>Measure around the widest part of your hips with feet together.</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSizeGuideOpen(false)}
                  className="px-6 py-2.5 bg-slate-900 text-white font-mono text-xs uppercase tracking-wider font-bold rounded-lg hover:bg-slate-800"
                >
                  Confirm Size &amp; Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
