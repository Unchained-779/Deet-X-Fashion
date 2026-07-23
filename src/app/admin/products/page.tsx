import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { revalidatePath } from "next/cache";

export default async function ProductsPage() {
  // 1. BACKEND: Fetch all products from Supabase PostgreSQL
  const products = await prisma.product.findMany();

  // 2. SERVER ACTION: Delete a product
  async function deleteProduct(formData: FormData) {
    "use server";
    const productId = formData.get("id") as string;
    await prisma.product.delete({ where: { id: productId } });
    revalidatePath("/admin/products");
  }

  return (
    <div className="space-y-6">
      {/* Header with Title and Add Button */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Garment Inventory</h1>
        <Link
          href="/admin/products/new"
          className="bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors"
        >
          ＋ Add New Garment
        </Link>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {products.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            No garments in inventory yet. Click "Add New Garment" to add your first piece!
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-sm font-semibold border-b border-slate-100">
                <th className="p-4">Product Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Origin</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-semibold text-slate-900">{product.name}</td>
                  <td className="p-4">
                    <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full text-xs font-medium">
                      {product.category}
                    </span>
                  </td>
                  <td className="p-4 font-medium text-slate-900">₹{product.price}</td>
                  <td className="p-4 text-sm text-slate-500">{product.countryOfOrigin}</td>
                  <td className="p-4 text-right">
                    <form action={deleteProduct} className="inline">
                      <input type="hidden" name="id" value={product.id} />
                      <button
                        type="submit"
                        className="text-red-500 hover:text-red-700 font-medium text-sm transition-colors"
                      >
                        Delete
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
