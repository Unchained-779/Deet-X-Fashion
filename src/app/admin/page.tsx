import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  // This is the BACKEND part! 
  const totalProducts = await prisma.product.count();
  const totalUsers = await prisma.user.count();
  // This is the FRONTEND part!
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Products */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-slate-500 font-medium">Total Products</h3>
          <p className="text-4xl font-bold text-slate-900 mt-2">{totalProducts}</p>
        </div>
   
     {/* Card 2: Customers */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-slate-500 font-medium">Total Customers</h3>
          <p className="text-4xl font-bold text-slate-900 mt-2">{totalUsers}</p>
        </div>
      </div>
    </div>
  );
}
