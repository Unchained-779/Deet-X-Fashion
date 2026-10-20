import Link from "next/link";
import { LayoutDashboard, Shirt, ShoppingCart, Store, ArrowUpRight } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <span className="text-xl font-bold tracking-tight text-white font-serif">
              DEETA <span className="text-accent text-xs font-mono uppercase">Portal</span>
            </span>
            <span className="text-[10px] font-mono bg-white/10 text-slate-300 px-2 py-0.5 rounded-none uppercase tracking-wider">
              Shop Admin
            </span>
          </div>

          <nav className="flex flex-col gap-1.5 text-sm font-medium">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-slate-400" />
              Overview
            </Link>
            <Link
              href="/admin/products"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
            >
              <Shirt className="w-4 h-4 text-slate-400" />
              Garment Catalog
            </Link>
            <Link
              href="/admin/orders"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
            >
              <ShoppingCart className="w-4 h-4 text-slate-400" />
              Orders
            </Link>
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800">
          <Link
            href="/"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Store className="w-4 h-4" />
              Storefront
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
