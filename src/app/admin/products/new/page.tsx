import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default function NewProductPage() {
  async function createProduct(formData: FormData) {
    "use server";

    const name = formData.get("name") as string;
    const price = parseFloat(formData.get("price") as string);
    const category = formData.get("category") as string;
    const countryOfOrigin = formData.get("countryOfOrigin") as string;
    const washingInstructions = formData.get("washingInstructions") as string;
    const storageInstructions = formData.get("storageInstructions") as string;
    const imageUrl = (formData.get("imageUrl") as string) || null;

    await prisma.product.create({
      data: {
        name,
        price,
        category,
        countryOfOrigin,
        washingInstructions,
        storageInstructions,
        imageUrl,
      },
    });

    redirect("/admin");
  }

  return (
    <div className="max-w-2xl bg-white p-8 rounded-xl shadow-sm border border-slate-100">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Add New Product</h1>

      <form action={createProduct} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
          <input name="name" required className="w-full p-3 border border-slate-200 rounded-lg text-slate-900" placeholder="e.g. Silk Saree" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Price (₹)</label>
            <input name="price" type="number" step="0.01" required className="w-full p-3 border border-slate-200 rounded-lg text-slate-900" placeholder="1499" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <input name="category" required className="w-full p-3 border border-slate-200 rounded-lg text-slate-900" placeholder="e.g. Traditional" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Country of Origin</label>
          <input name="countryOfOrigin" required className="w-full p-3 border border-slate-200 rounded-lg text-slate-900" placeholder="e.g. India" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Washing Instructions</label>
          <input name="washingInstructions" required className="w-full p-3 border border-slate-200 rounded-lg text-slate-900" placeholder="e.g. Dry Clean Only" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Storage Instructions</label>
          <input name="storageInstructions" required className="w-full p-3 border border-slate-200 rounded-lg text-slate-900" placeholder="e.g. Store in cotton bag" />
        </div>

        <button type="submit" className="mt-4 bg-red-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-red-600 transition-colors">
          Save Product to Database
        </button>
      </form>
    </div>
  );
}
