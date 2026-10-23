import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Package, Users, ShoppingCart, AlertTriangle, TrendingUp, Plus } from "lucide-react";

import AdminCatalogToolbar from "@/components/AdminCatalogToolbar";

export default async function AdminDashboard() {
  const totalProducts = await prisma.product.count();
  const totalVariants = await prisma.productVariant.count();
  const totalUsers = await prisma.user.count();
  const totalOrders = await prisma.order.count();
  
  // Real-time Stock Metrics
  const lowStockVariants = await prisma.productVariant.findMany({
    where: {
      stockCount: { lte: 5 },
    },
    include: {
      product: true,
    },
    take: 5,
  });

  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      orderItems: {
        include: {
          variant: true,
        },
      },
    },
  });

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">E-Commerce Overview</h1>
          <p className="text-sm text-slate-500 mt-1">Live metrics across garments, inventory units, and customer orders</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <AdminCatalogToolbar />
          <Link
            href="/"
            className="px-3.5 py-2 text-xs font-mono font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Storefront
          </Link>
          <Link
            href="/admin/products/new"
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-mono font-bold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Garment
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Styles</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{totalProducts}</p>
            <span className="text-xs text-slate-500 mt-1 block">{totalVariants} distinct SKU variants</span>
          </div>
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Orders</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{totalOrders}</p>
            <span className="text-xs text-emerald-600 font-medium mt-1 block">Live transaction tracking</span>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <ShoppingCart className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Registered Users</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{totalUsers}</p>
            <span className="text-xs text-slate-500 mt-1 block">Customer database</span>
          </div>
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Inventory Status</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{lowStockVariants.length}</p>
            <span className="text-xs text-amber-600 font-medium mt-1 block">SKUs with low stock (≤ 5)</span>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Low Stock Watchlist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Low Stock SKU Watchlist
            </h2>
            <Link href="/admin/products" className="text-xs font-semibold text-slate-600 hover:text-slate-900">
              Manage All →
            </Link>
          </div>

          {lowStockVariants.length === 0 ? (
            <p className="text-sm text-slate-500 py-6 text-center">All inventory SKUs are well-stocked.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {lowStockVariants.map((v) => (
                <div key={v.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{v.product.title}</p>
                    <p className="text-xs text-slate-500">
                      SKU: <span className="font-mono">{v.sku}</span> | Size: {v.size} ({v.colorName})
                    </p>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                    {v.stockCount} units left
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions & Store Settings */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-slate-700" />
              Store Architecture & Modules
            </h2>
            <div className="space-y-3 text-sm text-slate-600">
              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                <span className="font-medium text-slate-800">Database Engine</span>
                <span className="text-xs font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                  PostgreSQL / Prisma ORM
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                <span className="font-medium text-slate-800">Cart & Session State</span>
                <span className="text-xs font-mono bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">
                  Zustand Persistent Store
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                <span className="font-medium text-slate-800">Payment Gateway</span>
                <span className="text-xs font-mono bg-slate-200 text-slate-800 px-2 py-0.5 rounded">
                  Razorpay SDK + HMAC Webhooks
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <Link
              href="/admin/products"
              className="w-full inline-flex items-center justify-center py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition-colors"
            >
              Open Full Garment Catalog & Inventory Table
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
