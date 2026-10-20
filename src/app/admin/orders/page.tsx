import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ShoppingBag, ArrowLeft, Clock, CheckCircle2, Truck } from "lucide-react";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      address: true,
      orderItems: {
        include: {
          variant: {
            include: {
              product: true,
            },
          },
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Customer Orders</h1>
          <p className="text-sm text-slate-500 mt-1">
            Track transactions, customer addresses, and order items
          </p>
        </div>
        <Link
          href="/admin"
          className="text-xs font-semibold px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50"
        >
          Back to Overview
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-16 text-center text-slate-400">
            <ShoppingBag className="w-12 h-12 stroke-1 mx-auto mb-3 text-slate-300" />
            <p className="font-semibold text-slate-700">No orders placed yet</p>
            <p className="text-xs text-slate-500 mt-1">Orders placed on the storefront will appear here instantly.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {orders.map((order) => (
              <div key={order.id} className="p-6 space-y-4 hover:bg-slate-50/50 transition-colors">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                  <div>
                    <span className="text-xs font-mono font-bold text-slate-500">ORDER #{order.id.slice(-8).toUpperCase()}</span>
                    <h3 className="font-bold text-slate-900 text-base mt-0.5">
                      {order.user?.name || "Guest Customer"} ({order.user?.email || "No email"})
                    </h3>
                    <p className="text-xs text-slate-400">
                      Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {order.status}
                    </span>
                    <span className="text-lg font-black text-slate-900">
                      ₹{order.totalAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* Items & Shipping address breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div>
                    <h4 className="font-semibold text-slate-800 uppercase tracking-wider text-[10px] mb-2">
                      Items Ordered ({order.orderItems.length})
                    </h4>
                    <div className="space-y-1.5">
                      {order.orderItems.map((item) => (
                        <div key={item.id} className="flex justify-between text-slate-700">
                          <span>
                            {item.quantity}x {item.variant.product.title} (Size: {item.variant.size})
                          </span>
                          <span className="font-semibold">₹{(item.priceAtPurchase * item.quantity).toLocaleString("en-IN")}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {order.address && (
                    <div>
                      <h4 className="font-semibold text-slate-800 uppercase tracking-wider text-[10px] mb-2">
                        Delivery Destination
                      </h4>
                      <p className="text-slate-600 leading-relaxed">
                        {order.address.street}, {order.address.city}, {order.address.state} - {order.address.pincode}
                        <br />
                        <span className="text-slate-500">Phone: {order.address.phone}</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
