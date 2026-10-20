import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Size } from "@prisma/client";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  async function createProduct(formData: FormData) {
    "use server";

    const title = formData.get("title") as string;
    const slug = (formData.get("slug") as string) || title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const description = formData.get("description") as string;
    const basePrice = parseFloat(formData.get("basePrice") as string);
    const categoryId = (formData.get("categoryId") as string) || null;
    const fabricCare = formData.get("fabricCare") as string;
    const countryOfOrigin = (formData.get("countryOfOrigin") as string) || "India";
    const imageUrl = (formData.get("imageUrl") as string) || null;

    // Initial Variant details
    const sku = (formData.get("sku") as string) || `${slug.toUpperCase()}-STD-1`;
    const size = (formData.get("size") as Size) || Size.FREE_SIZE;
    const colorName = (formData.get("colorName") as string) || "Standard";
    const colorHex = (formData.get("colorHex") as string) || "#1e293b";
    const stockCount = parseInt(formData.get("stockCount") as string, 10) || 10;

    await prisma.product.create({
      data: {
        title,
        slug,
        description,
        basePrice,
        categoryId: categoryId && categoryId !== "none" ? categoryId : null,
        fabricCare,
        countryOfOrigin,
        imageUrl,
        variants: {
          create: {
            sku,
            size,
            colorName,
            colorHex,
            stockCount,
            images: imageUrl ? [imageUrl] : [],
          },
        },
      },
    });

    redirect("/admin/products");
  }

  return (
    <div className="max-w-3xl bg-white p-8 rounded-xl shadow-sm border border-slate-100">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Add New Garment Style</h1>
        <p className="text-sm text-slate-500 mt-1">
          Create the parent garment style and its initial stock-keeping unit (SKU variant).
        </p>
      </div>

      <form action={createProduct} className="flex flex-col gap-6">
        {/* Basic Garment Info */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">1. Garment Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Garment Title</label>
              <input
                name="title"
                required
                className="w-full p-3 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                placeholder="e.g. Chanderi Silk Anarkali Kurta"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">URL Slug (Optional)</label>
              <input
                name="slug"
                className="w-full p-3 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                placeholder="e.g. chanderi-silk-anarkali-kurta"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              name="description"
              required
              rows={3}
              className="w-full p-3 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              placeholder="Handcrafted festive anarkali with zari border and matching dupatta..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Base Price (₹)</label>
              <input
                name="basePrice"
                type="number"
                step="0.01"
                required
                className="w-full p-3 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                placeholder="2499"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <select
                name="categoryId"
                className="w-full p-3 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
              >
                <option value="none">Select Category (Optional)</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Country of Origin</label>
              <input
                name="countryOfOrigin"
                defaultValue="India"
                className="w-full p-3 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Fabric Care / Washing</label>
              <input
                name="fabricCare"
                className="w-full p-3 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                placeholder="e.g. Dry clean only. Avoid direct sunlight."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
              <input
                name="imageUrl"
                className="w-full p-3 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                placeholder="https://images.unsplash.com/photo-..."
              />
            </div>
          </div>
        </div>

        {/* Initial Variant / SKU Details */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
            2. Initial Inventory SKU (Size & Color)
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">SKU Code</label>
              <input
                name="sku"
                className="w-full p-3 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                placeholder="e.g. ANAR-RED-M"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Size</label>
              <select
                name="size"
                defaultValue="M"
                className="w-full p-3 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
              >
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
                <option value="FREE_SIZE">Free Size</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Color Name</label>
              <input
                name="colorName"
                defaultValue="Ruby Red"
                className="w-full p-3 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Stock Units</label>
              <input
                name="stockCount"
                type="number"
                defaultValue="15"
                min="0"
                className="w-full p-3 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3.5 px-6 rounded-lg transition-colors shadow-sm"
        >
          Save Garment to Inventory
        </button>
      </form>
    </div>
  );
}
