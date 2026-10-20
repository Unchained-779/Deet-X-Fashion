import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { revalidatePath } from "next/cache";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      variants: true,
    },
    orderBy: { createdAt: "desc" },
  });

  async function deleteProduct(formData: FormData) {
    "use server";
    const productId = formData.get("id") as string;
    await prisma.product.delete({ where: { id: productId } });
    revalidatePath("/admin/products");
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Garment Catalog</h1>
          <p className="text-sm text-slate-500 mt-1">Manage styles, variants, and physical inventory</p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-sm"
        >
          ＋ Add New Garment
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {products.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            No garments in inventory yet. Click "Add New Garment" to add your first style!
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-sm font-semibold border-b border-slate-100">
                <th className="p-4">Style & Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Base Price</th>
                <th className="p-4">Variants / SKUs</th>
                <th className="p-4">Origin</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {products.map((product) => {
                const totalStock = product.variants.reduce((acc, v) => acc + v.stockCount, 0);
                return (
                  <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-semibold text-slate-900">
                      <div>{product.title}</div>
                      <div className="text-xs text-slate-400 font-normal">/{product.slug}</div>
                    </td>
                    <td className="p-4">
                      <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full text-xs font-medium">
                        {product.category?.name || "General"}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-slate-900">₹{product.basePrice.toLocaleString("en-IN")}</td>
                    <td className="p-4">
                      <div className="text-sm">
                        <span className="font-semibold text-slate-900">{product.variants.length}</span> SKUs
                        <span className="text-xs text-slate-400 block">Total Units: {totalStock}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-500">{product.countryOfOrigin || "India"}</td>
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
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
