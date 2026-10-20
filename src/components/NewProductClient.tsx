"use client";

import { useState } from "react";
import DirectImageUploader from "@/components/DirectImageUploader";
import Link from "next/link";
import { ArrowLeft, Check, Sparkles } from "lucide-react";

interface CategoryOption {
  id: string;
  name: string;
}

export default function NewProductClient({ categories }: { categories: CategoryOption[] }) {
  const [imageUrl, setImageUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="max-w-3xl bg-white p-8 border border-[#E5E0D8]">
      <div className="mb-8 pb-4 border-b border-[#E5E0D8] flex items-center justify-between">
        <div>
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 mb-2 font-mono"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Products
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Add New Garment to Shop</h1>
          <p className="text-xs text-slate-500 mt-1">
            दुकान में नया कपड़ा जोड़ें (Add Saree, Suit, Kurta, or Dress)
          </p>
        </div>
      </div>

      <form
        action="/api/products"
        method="POST"
        onSubmit={() => setSubmitting(true)}
        className="flex flex-col gap-8"
      >
        {/* Hidden field storing the uploaded photo URL */}
        <input type="hidden" name="imageUrl" value={imageUrl} />

        {/* 1. Direct Image Uploader for Parents */}
        <div className="p-6 bg-slate-50 border border-slate-200">
          <DirectImageUploader value={imageUrl} onChange={setImageUrl} />
        </div>

        {/* 2. Basic Garment Info */}
        <div className="space-y-4">
          <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400">
            1. Garment Details (कपड़े की जानकारी)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Garment Name (कपड़े का नाम) *
              </label>
              <input
                name="title"
                required
                className="w-full p-3 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-slate-900"
                placeholder="e.g. Pure Banarasi Silk Saree"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Category (प्रकार)
              </label>
              <select
                name="categoryId"
                className="w-full p-3 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-slate-900 bg-white"
              >
                <option value="none">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Description (कपड़े का विवरण) *
            </label>
            <textarea
              name="description"
              required
              rows={3}
              className="w-full p-3 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-slate-900"
              placeholder="e.g. Heavy zari work traditional bridal saree with matching blouse piece..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Selling Price (₹ कीमत) *
              </label>
              <input
                name="basePrice"
                type="number"
                step="1"
                required
                className="w-full p-3 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-slate-900"
                placeholder="1999"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Fabric & Care (कपड़ा धोने का निर्देश)
              </label>
              <input
                name="fabricCare"
                defaultValue="Dry clean only"
                className="w-full p-3 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-slate-900"
                placeholder="e.g. Dry clean only"
              />
            </div>
          </div>
        </div>

        {/* 3. Stock & Sizing Details */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400">
            2. Stock & Size (साइज और स्टॉक)
          </h2>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">Size (साइज)</label>
              <select
                name="size"
                defaultValue="FREE_SIZE"
                className="w-full p-3 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-slate-900 bg-white"
              >
                <option value="FREE_SIZE">Free Size (Sarees / Dupattas)</option>
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">Color (रंग)</label>
              <input
                name="colorName"
                defaultValue="Red / लाल"
                className="w-full p-3 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-slate-900"
                placeholder="e.g. Red, Royal Blue, Peach"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Available Pieces (दुकान में कितने पीस हैं)
              </label>
              <input
                name="stockCount"
                type="number"
                defaultValue="5"
                min="1"
                required
                className="w-full p-3 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-slate-900"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-4 bg-slate-900 hover:bg-neutral-800 text-white font-medium py-4 px-6 text-xs uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2"
        >
          {submitting ? "Saving to Shop..." : "Save Garment to Shop (दुकान में सेव करें)"}
        </button>
      </form>
    </div>
  );
}
