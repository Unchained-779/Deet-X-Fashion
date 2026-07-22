import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-6">
        <h2 className="text-2xl font-bold mb-8 text-red-500">DeeT-X Admin</h2>
        <nav className="flex flex-col gap-4">
          <Link href="/admin" className="hover:text-red-400 transition-colors">Dashboard</Link>
          <Link href="/admin/products" className="hover:text-red-400 transition-colors">Products</Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
