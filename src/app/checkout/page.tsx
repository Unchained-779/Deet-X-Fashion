"use client";

import { useCartStore } from "@/store/useCartStore";
import StorefrontNavbar from "@/components/StorefrontNavbar";
import CartDrawer from "@/components/CartDrawer";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, CheckCircle, CreditCard, Lock, ShieldCheck } from "lucide-react";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "Delhi",
    pincode: "",
  });

  const subtotal = totalPrice();
  const shipping = subtotal > 1999 ? 0 : 99;
  const grandTotal = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Direct checkout simulation & order persistence trigger
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: formData,
          items: items.map((i) => ({
            variantId: i.variantId,
            quantity: i.quantity,
            price: i.price,
          })),
          totalAmount: grandTotal,
        }),
      });

      if (res.ok) {
        clearCart();
        setOrderComplete(true);
      } else {
        alert("Unable to process checkout. Please check address details.");
      }
    } catch (err) {
      console.error(err);
      alert("Error contacting checkout server.");
    } finally {
      setLoading(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <StorefrontNavbar />
        <div className="flex-1 max-w-xl mx-auto px-4 py-20 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-slate-900">Order Confirmed!</h1>
          <p className="mt-3 text-slate-600 text-sm">
            Thank you for ordering with DeeT-X Fashion. Your handcrafted garments are being prepared for dispatch with tracking updates sent to your phone.
          </p>
          <div className="mt-8 flex gap-4">
            <Link
              href="/"
              className="px-6 py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors"
            >
              Back to Collection
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <StorefrontNavbar />
      <CartDrawer />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Shopping
        </Link>

        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-8">Secure Checkout</h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-100">
            <p className="text-slate-600 font-medium">Your bag is empty. Please add items before checking out.</p>
            <Link
              href="/"
              className="inline-block mt-4 px-6 py-2.5 bg-slate-900 text-white font-semibold text-xs rounded-xl"
            >
              Browse Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Shipping Form */}
            <form onSubmit={handleSubmit} className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">1. Shipping Address</h2>
                <p className="text-xs text-slate-400 mt-0.5">Where should we deliver your handcrafted order?</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full p-3 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    placeholder="Aditi Sharma"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Phone (for delivery SMS)</label>
                  <input
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-3 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    placeholder="9876543210"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address (for Invoice)</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-3 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="aditi@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Street Address / House No.</label>
                <input
                  required
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  className="w-full p-3 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="Flat 402, Lotus Court, MG Road"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                  <input
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full p-3 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    placeholder="New Delhi"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">State</label>
                  <input
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full p-3 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">PIN Code</label>
                  <input
                    required
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full p-3 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    placeholder="110001"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  {loading ? "Processing..." : `Confirm Order (₹${grandTotal.toLocaleString("en-IN")})`}
                </button>
                <p className="text-center text-[11px] text-slate-400 mt-2 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  256-Bit SSL Encrypted Razorpay Gateway & COD Verified
                </p>
              </div>
            </form>

            {/* Order Summary */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-900 text-base">Order Summary</h3>

                <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.variantId} className="py-3 flex items-center justify-between gap-3">
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-slate-900 line-clamp-1">{item.title}</p>
                        <p className="text-[11px] text-slate-500">
                          Qty: {item.quantity} | Size: {item.size}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-slate-900">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Bag Subtotal</span>
                    <span className="font-semibold text-slate-900">₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Shipping Charges</span>
                    <span className="font-semibold text-slate-900">
                      {shipping === 0 ? <span className="text-emerald-600">FREE</span> : `₹${shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-900 text-sm font-black pt-2 border-t border-slate-100">
                    <span>Total Amount</span>
                    <span>₹{grandTotal.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
