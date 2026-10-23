"use client";

import { useState, useMemo } from "react";
import ProductCard from "@/components/ProductCard";
import {
  SlidersHorizontal,
  X,
  ChevronDown,
  Filter,
  Check,
  RefreshCw,
  Sparkles,
  ArrowUpDown,
} from "lucide-react";

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

interface ProductItem {
  id: string;
  title: string;
  slug: string;
  basePrice: number;
  imageUrl: string | null;
  description: string;
  fabricCare?: string | null;
  category?: { name: string; slug: string } | null;
  variants: VariantType[];
}

interface PLPClientProps {
  initialProducts: ProductItem[];
  categoryTitle: string;
  categoryDescription?: string;
}

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "FREE_SIZE"];

const FABRICS = ["Silk", "Cotton", "Reyon", "Chanderi", "Georgette", "Linen", "Velvet", "Organza"];

const OCCASIONS = ["Wedding", "Festive", "Casual", "Party", "Workwear"];

const COLORS = [
  { name: "Red / Maroon", hex: "#9B111E" },
  { name: "Gold / Mustard", hex: "#E5C158" },
  { name: "Green / Emerald", hex: "#2E5B44" },
  { name: "Blue / Navy", hex: "#152238" },
  { name: "Pink / Peach", hex: "#FADBD8" },
  { name: "White / Ivory", hex: "#F7F5F0" },
  { name: "Black", hex: "#111111" },
];

export default function PLPClient({
  initialProducts,
  categoryTitle,
  categoryDescription,
}: PLPClientProps) {
  // Filters State
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState<"featured" | "newest" | "price-low" | "price-high">("featured");
  const [maxPrice, setMaxPrice] = useState<number>(30000);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedFabrics, setSelectedFabrics] = useState<string[]>([]);
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
  const [onlyDiscounted, setOnlyDiscounted] = useState(false);

  // Toggle filter helper
  const toggleArrayFilter = (arr: string[], setArr: (val: string[]) => void, item: string) => {
    if (arr.includes(item)) {
      setArr(arr.filter((i) => i !== item));
    } else {
      setArr([...arr, item]);
    }
  };

  const handleResetFilters = () => {
    setMaxPrice(30000);
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedFabrics([]);
    setSelectedOccasions([]);
    setOnlyDiscounted(false);
  };

  const hasActiveFilters =
    maxPrice < 30000 ||
    selectedSizes.length > 0 ||
    selectedColors.length > 0 ||
    selectedFabrics.length > 0 ||
    selectedOccasions.length > 0 ||
    onlyDiscounted;

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // Price Filter
    result = result.filter((p) => p.basePrice <= maxPrice);

    // Size Filter
    if (selectedSizes.length > 0) {
      result = result.filter((p) =>
        p.variants.some((v) => selectedSizes.includes(v.size))
      );
    }

    // Color Filter
    if (selectedColors.length > 0) {
      result = result.filter((p) =>
        p.variants.some((v) =>
          selectedColors.some((c) =>
            v.colorName.toLowerCase().includes(c.split("/")[0].trim().toLowerCase())
          )
        )
      );
    }

    // Fabric Filter (searches description & fabricCare)
    if (selectedFabrics.length > 0) {
      result = result.filter((p) => {
        const text = `${p.title} ${p.description} ${p.fabricCare || ""}`.toLowerCase();
        return selectedFabrics.some((f) => text.includes(f.toLowerCase()));
      });
    }

    // Occasion Filter
    if (selectedOccasions.length > 0) {
      result = result.filter((p) => {
        const text = `${p.title} ${p.description}`.toLowerCase();
        return selectedOccasions.some((o) => text.includes(o.toLowerCase()));
      });
    }

    // Sort Logic
    if (selectedSort === "price-low") {
      result.sort((a, b) => a.basePrice - b.basePrice);
    } else if (selectedSort === "price-high") {
      result.sort((a, b) => b.basePrice - a.basePrice);
    } else if (selectedSort === "newest") {
      // Keep natural order (created desc)
    }

    return result;
  }, [
    initialProducts,
    maxPrice,
    selectedSizes,
    selectedColors,
    selectedFabrics,
    selectedOccasions,
    selectedSort,
    onlyDiscounted,
  ]);

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12 w-full font-sans">
      {/* Category Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-baseline mb-8 pb-6 border-b border-[#E5E0D8] gap-4">
        <div>
          <span className="text-[11px] font-mono tracking-[0.25em] text-[#C29B38] uppercase block mb-1">
            Department Archive
          </span>
          <h1
            style={{ fontFamily: "var(--font-editorial)" }}
            className="text-4xl sm:text-6xl font-normal text-primary tracking-tight"
          >
            {categoryTitle}
          </h1>
          <p className="text-xs font-sans text-muted mt-2 max-w-xl leading-relaxed">
            {categoryDescription ||
              "Handcrafted garments and pure unadulterated fabrics sourced directly from India's ancient artisan weaver clusters."}
          </p>
        </div>

        {/* Action Controls: Mobile Filter Button & Sort Selector */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 border border-[#E5E0D8] bg-white text-xs font-mono font-semibold text-slate-800 rounded-lg shadow-sm"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600" />
            <span>Filters {hasActiveFilters && "(Active)"}</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-muted hidden sm:inline">Sort By:</span>
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value as any)}
              className="px-3.5 py-2 bg-white border border-[#E5E0D8] rounded-lg text-xs font-mono font-semibold text-slate-800 focus:outline-none focus:border-slate-800 cursor-pointer shadow-sm"
            >
              <option value="featured">Featured Curations</option>
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High (₹)</option>
              <option value="price-high">Price: High to Low (₹)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout (Sidebar Filters + Products Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-28 bg-white border border-[#E5E0D8] p-6 rounded-2xl shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-amber-600" />
              <h2 className="text-xs font-mono uppercase tracking-wider font-bold text-slate-900">
                Filter Collection
              </h2>
            </div>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-[10px] font-mono text-rose-600 hover:underline uppercase"
              >
                Reset All
              </button>
            )}
          </div>

          {/* 1. Price Range Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="font-semibold text-slate-700">Max Price:</span>
              <span className="font-bold text-slate-900">₹{maxPrice.toLocaleString("en-IN")}</span>
            </div>
            <input
              type="range"
              min={1500}
              max={30000}
              step={500}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-slate-900 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>₹1,500</span>
              <span>₹30,000+</span>
            </div>
          </div>

          {/* 2. Size Filter */}
          <div className="space-y-2 pt-4 border-t border-slate-100">
            <label className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold block">
              Sizes
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {SIZES.map((sz) => {
                const isSelected = selectedSizes.includes(sz);
                return (
                  <button
                    key={sz}
                    onClick={() => toggleArrayFilter(selectedSizes, setSelectedSizes, sz)}
                    className={`py-1.5 px-2 text-[10px] font-mono font-semibold transition-all border ${
                      isSelected
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-400"
                    }`}
                  >
                    {sz === "FREE_SIZE" ? "FREE SIZE" : sz}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Color Swatches */}
          <div className="space-y-2 pt-4 border-t border-slate-100">
            <label className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold block">
              Color Palette
            </label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((c) => {
                const isSelected = selectedColors.includes(c.name);
                return (
                  <button
                    key={c.name}
                    onClick={() => toggleArrayFilter(selectedColors, setSelectedColors, c.name)}
                    className={`w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center ${
                      isSelected ? "border-slate-900 ring-2 ring-amber-400 scale-110" : "border-slate-300"
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  >
                    {isSelected && (
                      <Check className={`w-3 h-3 ${c.hex === "#111111" || c.hex === "#152238" ? "text-white" : "text-slate-900"}`} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Fabric Types */}
          <div className="space-y-2 pt-4 border-t border-slate-100">
            <label className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold block">
              Pure Fabric Weave
            </label>
            <div className="space-y-1 text-xs">
              {FABRICS.map((fb) => (
                <label key={fb} className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-900">
                  <input
                    type="checkbox"
                    checked={selectedFabrics.includes(fb)}
                    onChange={() => toggleArrayFilter(selectedFabrics, setSelectedFabrics, fb)}
                    className="rounded accent-slate-900"
                  />
                  <span>{fb}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 5. Occasion */}
          <div className="space-y-2 pt-4 border-t border-slate-100">
            <label className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold block">
              Occasion
            </label>
            <div className="space-y-1 text-xs">
              {OCCASIONS.map((occ) => (
                <label key={occ} className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-900">
                  <input
                    type="checkbox"
                    checked={selectedOccasions.includes(occ)}
                    onChange={() => toggleArrayFilter(selectedOccasions, setSelectedOccasions, occ)}
                    className="rounded accent-slate-900"
                  />
                  <span>{occ}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-9">
          {/* Active Filter Chips Bar */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-white border border-[#E5E0D8] rounded-xl text-xs font-mono">
              <span className="text-slate-400 uppercase tracking-wider">Filtered:</span>
              {selectedSizes.map((sz) => (
                <span key={sz} className="px-2 py-0.5 bg-slate-100 rounded text-slate-800 flex items-center gap-1">
                  Size: {sz}
                  <button onClick={() => toggleArrayFilter(selectedSizes, setSelectedSizes, sz)}>✕</button>
                </span>
              ))}
              {selectedColors.map((c) => (
                <span key={c} className="px-2 py-0.5 bg-slate-100 rounded text-slate-800 flex items-center gap-1">
                  {c}
                  <button onClick={() => toggleArrayFilter(selectedColors, setSelectedColors, c)}>✕</button>
                </span>
              ))}
              {selectedFabrics.map((fb) => (
                <span key={fb} className="px-2 py-0.5 bg-slate-100 rounded text-slate-800 flex items-center gap-1">
                  {fb}
                  <button onClick={() => toggleArrayFilter(selectedFabrics, setSelectedFabrics, fb)}>✕</button>
                </span>
              ))}
              {selectedOccasions.map((occ) => (
                <span key={occ} className="px-2 py-0.5 bg-slate-100 rounded text-slate-800 flex items-center gap-1">
                  {occ}
                  <button onClick={() => toggleArrayFilter(selectedOccasions, setSelectedOccasions, occ)}>✕</button>
                </span>
              ))}
              <button
                onClick={handleResetFilters}
                className="text-rose-600 hover:underline ml-auto font-bold uppercase text-[10px]"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Results Count */}
          <div className="flex justify-between items-center mb-6 text-xs font-mono text-muted">
            <span>Showing {filteredProducts.length} of {initialProducts.length} handcrafted pieces</span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="p-16 text-center border border-[#E5E0D8] bg-white rounded-2xl space-y-3">
              <h3
                style={{ fontFamily: "var(--font-editorial)" }}
                className="text-2xl text-slate-900"
              >
                No garments match your filters
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto font-sans leading-relaxed">
                Try widening your price range, clearing color selections, or resetting all filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-2 px-5 py-2.5 bg-slate-900 text-white font-mono text-xs uppercase tracking-wider font-bold rounded-lg"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
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
      </div>

      {/* Mobile Filters Slide-Over Drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
          <div className="w-full max-w-xs bg-white h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="font-bold text-slate-900 text-base font-serif">Refine Garments</h3>
                <button onClick={() => setMobileDrawerOpen(false)} className="text-slate-400 hover:text-slate-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="font-semibold text-slate-700">Max Price:</span>
                  <span className="font-bold text-slate-900">₹{maxPrice.toLocaleString("en-IN")}</span>
                </div>
                <input
                  type="range"
                  min={1500}
                  max={30000}
                  step={500}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-slate-900 cursor-pointer"
                />
              </div>

              {/* Sizes */}
              <div className="space-y-2 pt-3 border-t">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold block">
                  Sizes
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {SIZES.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => toggleArrayFilter(selectedSizes, setSelectedSizes, sz)}
                      className={`py-1 px-1.5 text-xs font-mono font-semibold border ${
                        selectedSizes.includes(sz)
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-slate-50 text-slate-700 border-slate-200"
                      }`}
                    >
                      {sz === "FREE_SIZE" ? "FREE SIZE" : sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fabrics */}
              <div className="space-y-2 pt-3 border-t">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold block">
                  Fabric Weave
                </span>
                <div className="space-y-1.5 text-xs">
                  {FABRICS.map((fb) => (
                    <label key={fb} className="flex items-center gap-2 cursor-pointer text-slate-700">
                      <input
                        type="checkbox"
                        checked={selectedFabrics.includes(fb)}
                        onChange={() => toggleArrayFilter(selectedFabrics, setSelectedFabrics, fb)}
                        className="rounded accent-slate-900"
                      />
                      <span>{fb}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t mt-6 flex gap-2">
              <button
                onClick={handleResetFilters}
                className="flex-1 py-2.5 border border-slate-300 text-xs font-mono uppercase tracking-wider rounded-lg text-slate-700"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="flex-1 py-2.5 bg-slate-900 text-white text-xs font-mono uppercase tracking-wider font-bold rounded-lg"
              >
                View ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
