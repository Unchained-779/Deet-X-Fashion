"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MultiImageManager from "@/components/MultiImageManager";
import {
  ArrowLeft,
  Sparkles,
  Percent,
  Layers,
  Palette,
  ShieldCheck,
  CheckCircle2,
  Info,
  Tag,
  IndianRupee,
  RefreshCw,
} from "lucide-react";

interface CategoryOption {
  id: string;
  name: string;
  slug?: string;
}

const AVAILABLE_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "FREE_SIZE"] as const;

const SUBCATEGORIES = [
  "Silk Sarees",
  "Designer Suits",
  "Lehengas",
  "Kurtas",
  "Shirts",
  "Dresses",
  "Co-ords",
  "Dupattas & Shawls",
];

const FABRICS = [
  "Cotton",
  "Pure Cotton",
  "Reyon",
  "Pure Kanjeevaram Silk",
  "Banarasi Katan Silk",
  "Chanderi Silk",
  "Georgette",
  "Mulmul Cotton",
  "Handloom Linen",
  "Tussar Silk",
  "Organza Tissue",
  "Raw Silk",
  "Modal Satin",
];

const CRAFTS = [
  "Zari Woven (जरी बुनाई)",
  "Handblock Print (हैंडब्लॉक)",
  "Chikankari Embroidery (चिकनकारी)",
  "Gota Patti & Dori",
  "Mirror Work (शीशा काम)",
  "Zardozi & Dabka",
  "Kalamkari Hand-Painted",
  "Bandhani Tie & Dye",
];

const OCCASIONS = [
  "Festive (त्यौहार)",
  "Wedding & Bridal (शादी / दुल्हन)",
  "Party & Reception",
  "Casual Everyday (दैनिक)",
  "Workwear (ऑफिस / फॉर्मल)",
];

export default function NewProductClient({ categories }: { categories: CategoryOption[] }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [skuPrefix, setSkuPrefix] = useState("DEETA");
  const [brand, setBrand] = useState("Deeta Fashion");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "none");
  const [subcategory, setSubcategory] = useState("Silk Sarees");

  // Pricing & Tax
  const [mrp, setMrp] = useState<number>(3999);
  const [sellingPrice, setSellingPrice] = useState<number>(2499);
  const [gstPercent, setGstPercent] = useState<number>(5);

  // Auto calculate discount percentage
  const discountPercent = useMemo(() => {
    if (mrp <= 0 || sellingPrice <= 0 || sellingPrice >= mrp) return 0;
    return Math.round(((mrp - sellingPrice) / mrp) * 100);
  }, [mrp, sellingPrice]);

  // Multi-Image Manager
  const [images, setImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop",
  ]);

  // Size & Inventory Matrix
  const [selectedSizes, setSelectedSizes] = useState<Record<string, { enabled: boolean; stock: number }>>({
    FREE_SIZE: { enabled: true, stock: 8 },
    XS: { enabled: false, stock: 0 },
    S: { enabled: false, stock: 5 },
    M: { enabled: false, stock: 10 },
    L: { enabled: false, stock: 8 },
    XL: { enabled: false, stock: 4 },
    XXL: { enabled: false, stock: 0 },
  });

  // Color & Fabric Metadata
  const [colorName, setColorName] = useState("Royal Crimson & Antique Zari");
  const [colorHex, setColorHex] = useState("#9B111E");
  const [fabricType, setFabricType] = useState("Pure Kanjeevaram Silk");
  const [craftWork, setCraftWork] = useState("Zari Woven (जरी बुनाई)");
  const [occasion, setOccasion] = useState("Festive (त्यौहार)");
  const [washCare, setWashCare] = useState("Strictly Dry Clean Only. Store wrapped in soft muslin cloth.");
  const [blouseIncluded, setBlouseIncluded] = useState(true);
  const [description, setDescription] = useState(
    "Exquisite handcrafted pure silk drape woven by master artisans, adorned with traditional temple borders and heavy metallic zari work across the pallu."
  );

  // Status Flags
  const [inStock, setInStock] = useState(true);
  const [isFeatured, setIsFeatured] = useState(true);
  const [isNewArrival, setIsNewArrival] = useState(true);
  const [isBestseller, setIsBestseller] = useState(false);

  // Auto-slug generator
  const handleTitleChange = (val: string) => {
    setTitle(val);
    const generatedSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setSlug(generatedSlug);
  };

  const toggleSize = (sizeKey: string) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [sizeKey]: {
        enabled: !prev[sizeKey]?.enabled,
        stock: prev[sizeKey]?.enabled ? 0 : 5,
      },
    }));
  };

  const updateSizeStock = (sizeKey: string, stock: number) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [sizeKey]: {
        enabled: true,
        stock: Math.max(0, stock),
      },
    }));
  };

  const totalInventoryPieces = useMemo(() => {
    return Object.values(selectedSizes).reduce((acc, curr) => (curr.enabled ? acc + curr.stock : acc), 0);
  }, [selectedSizes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg("Please enter garment title");
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    // Build active size matrix
    const matrix = Object.entries(selectedSizes)
      .filter(([_, data]) => data.enabled && data.stock > 0)
      .map(([sizeKey, data]) => ({
        size: sizeKey,
        stock: data.stock,
        sku: `${skuPrefix}-${title.slice(0, 3).toUpperCase()}-${sizeKey}-${Date.now().toString().slice(-3)}`,
      }));

    if (matrix.length === 0) {
      setErrorMsg("Please enable at least one size with stock quantity > 0");
      setSubmitting(false);
      return;
    }

    try {
      const payload = {
        title,
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        brand,
        categoryId,
        subcategory,
        mrp,
        sellingPrice,
        gstPercent,
        images,
        imageUrl: images[0] || null,
        sizeMatrix: matrix,
        colorName,
        colorHex,
        fabricType,
        craftWork,
        occasion,
        fabricCare: washCare,
        blouseIncluded,
        description,
        isFeatured,
        isNewArrival,
        isBestseller,
        countryOfOrigin: "India",
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (res.ok && resData.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/admin/products");
          router.refresh();
        }, 800);
      } else {
        setErrorMsg(resData.error || "Failed to save garment to inventory");
      }
    } catch (err: any) {
      setErrorMsg("Connection error while saving garment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-5 border-b border-slate-200 gap-3">
        <div>
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 mb-2 font-mono transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Garment Catalog
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-serif">
            Fashion Studio <span className="font-mono text-sm text-amber-600 uppercase font-bold">Uploader</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Create and curate bespoke Indian ethnic and western garments with size matrices, pricing, and high-res imagery.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-200 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Total Units in Batch: {totalInventoryPieces}
          </span>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-mono flex items-center gap-2">
          <Info className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Garment successfully added to Deeta Fashion Storefront! Redirecting...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Multi-Image Showcase */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <MultiImageManager images={images} onChange={setImages} />
        </div>

        {/* Section 2: Basic Info */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Tag className="w-4 h-4 text-amber-600" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 font-mono">
              1. Basic Garment Classification
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">
                Product Title (कपड़े का शीर्षक) *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Royal Maroon Kanjivaram Pure Silk Saree"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-slate-900 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">
                URL Slug (सर्च यूआरएल)
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs font-mono focus:outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">
                SKU Prefix / Code
              </label>
              <input
                type="text"
                value={skuPrefix}
                onChange={(e) => setSkuPrefix(e.target.value.toUpperCase())}
                placeholder="DEETA"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-mono focus:outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">
                Brand Name
              </label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-slate-900 font-serif"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">
                Primary Store Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-slate-900"
              >
                <option value="none">General / Unassigned</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">
                Fashion Subcategory
              </label>
              <select
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-slate-900"
              >
                {SUBCATEGORIES.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Pricing & Tax */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <IndianRupee className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 font-mono">
              2. Pricing, Discount &amp; GST Details
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">
                MRP (₹ Maximum Retail Price) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-slate-400 font-mono text-sm">₹</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  required
                  value={mrp}
                  onChange={(e) => setMrp(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-mono focus:outline-none focus:border-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">
                Selling Price (₹ बिक्री मूल्य) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-slate-400 font-mono text-sm">₹</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  required
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-mono font-bold text-emerald-700 focus:outline-none focus:border-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">
                GST Rate (%)
              </label>
              <select
                value={gstPercent}
                onChange={(e) => setGstPercent(Number(e.target.value))}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-slate-900"
              >
                <option value={5}>5% (Apparel ≤ ₹1,000 / Cotton & Handloom)</option>
                <option value={12}>12% (Luxury Apparel &gt; ₹1,000 / Designer Silks)</option>
              </select>
            </div>
          </div>

          {/* Discount Badge Preview */}
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Percent className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-mono font-semibold text-slate-800">
                Customer Savings &amp; Discount Badge:
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="line-through text-xs text-slate-400 font-mono">₹{mrp.toLocaleString("en-IN")}</span>
              <span className="text-sm font-bold text-emerald-700 font-mono">₹{sellingPrice.toLocaleString("en-IN")}</span>
              <span className="px-2 py-0.5 rounded bg-amber-600 text-white font-mono text-xs font-bold">
                {discountPercent}% OFF
              </span>
            </div>
          </div>
        </div>

        {/* Section 4: Size & Inventory Matrix */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 font-mono">
                3. Size &amp; Inventory Matrix (साइज और स्टॉक)
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-500">
              Select available sizes &amp; set stock per size
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
            {AVAILABLE_SIZES.map((size) => {
              const item = selectedSizes[size] || { enabled: false, stock: 0 };
              const isEnabled = item.enabled;

              return (
                <div
                  key={size}
                  className={`p-3 rounded-xl border-2 transition-all flex flex-col justify-between ${
                    isEnabled
                      ? "border-slate-900 bg-slate-50/80 shadow-sm"
                      : "border-slate-200 bg-white opacity-60 hover:opacity-100"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <button
                      type="button"
                      onClick={() => toggleSize(size)}
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded transition-colors ${
                        isEnabled ? "bg-slate-900 text-white" : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {size === "FREE_SIZE" ? "FREE SIZE" : size}
                    </button>
                    <input
                      type="checkbox"
                      checked={isEnabled}
                      onChange={() => toggleSize(size)}
                      className="rounded accent-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-500 uppercase mb-0.5">
                      Units
                    </label>
                    <input
                      type="number"
                      min="0"
                      disabled={!isEnabled}
                      value={item.stock}
                      onChange={(e) => updateSizeStock(size, Number(e.target.value))}
                      className="w-full p-1.5 text-center bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-slate-900 disabled:bg-slate-100"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 5: Color, Fabric & Craft Metadata */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Palette className="w-4 h-4 text-purple-600" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 font-mono">
              4. Color, Fabric &amp; Artisan Craftsmanship
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Color Swatch Picker */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">
                Color Name &amp; Swatch *
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colorHex}
                  onChange={(e) => setColorHex(e.target.value)}
                  className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer p-0.5 bg-white shrink-0"
                />
                <input
                  type="text"
                  required
                  value={colorName}
                  onChange={(e) => setColorName(e.target.value)}
                  placeholder="e.g. Royal Maroon"
                  className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-slate-900"
                />
              </div>
            </div>

            {/* Fabric Type */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">
                Fabric Material (कपड़ा)
              </label>
              <select
                value={fabricType}
                onChange={(e) => setFabricType(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-slate-900"
              >
                {FABRICS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            {/* Craft / Work */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">
                Craft / Karigari (कारीगरी)
              </label>
              <select
                value={craftWork}
                onChange={(e) => setCraftWork(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-slate-900"
              >
                {CRAFTS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Occasion */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">
                Occasion (अवसर)
              </label>
              <select
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-slate-900"
              >
                {OCCASIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>

            {/* Blouse Piece Included */}
            <div className="flex items-center gap-3 pt-6">
              <input
                type="checkbox"
                id="blouseIncluded"
                checked={blouseIncluded}
                onChange={(e) => setBlouseIncluded(e.target.checked)}
                className="w-4 h-4 rounded accent-slate-900 cursor-pointer"
              />
              <label htmlFor="blouseIncluded" className="text-xs font-bold text-slate-800 cursor-pointer">
                Blouse Piece Included (ब्लाउज पीस शामिल है)
              </label>
            </div>
          </div>

          {/* Wash Care */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">
              Wash Care Instructions (धुलाई निर्देश)
            </label>
            <input
              type="text"
              value={washCare}
              onChange={(e) => setWashCare(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-slate-900"
            />
          </div>

          {/* Rich Description */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">
              Garment Description &amp; Heritage Story (विवरण) *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-slate-900"
            />
          </div>
        </div>

        {/* Section 6: Status Flags */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 font-mono">
            5. Storefront Badges &amp; Status Flags
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <label className="p-3 border rounded-xl flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors">
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => setInStock(e.target.checked)}
                className="rounded accent-slate-900"
              />
              <span className="text-xs font-bold text-slate-800">In Stock</span>
            </label>

            <label className="p-3 border rounded-xl flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="rounded accent-slate-900"
              />
              <span className="text-xs font-bold text-slate-800">Featured</span>
            </label>

            <label className="p-3 border rounded-xl flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors">
              <input
                type="checkbox"
                checked={isNewArrival}
                onChange={(e) => setIsNewArrival(e.target.checked)}
                className="rounded accent-slate-900"
              />
              <span className="text-xs font-bold text-slate-800">New Arrival</span>
            </label>

            <label className="p-3 border rounded-xl flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors">
              <input
                type="checkbox"
                checked={isBestseller}
                onChange={(e) => setIsBestseller(e.target.checked)}
                className="rounded accent-slate-900"
              />
              <span className="text-xs font-bold text-slate-800">Bestseller</span>
            </label>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end gap-3 pt-4">
          <Link
            href="/admin/products"
            className="px-6 py-4 border border-slate-300 hover:bg-slate-100 rounded-xl text-xs font-mono uppercase tracking-wider text-slate-700 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-[0.2em] shadow-lg flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {submitting && <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />}
            <span>{submitting ? "Publishing Garment..." : "Publish to Deeta Fashion (स्टोर में जोड़ें)"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
