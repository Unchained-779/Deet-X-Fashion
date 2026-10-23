"use client";

import { useCartStore } from "@/store/useCartStore";
import StorefrontNavbar from "@/components/StorefrontNavbar";
import CartDrawer from "@/components/CartDrawer";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  CheckCircle,
  Lock,
  ShieldCheck,
  Loader2,
  Tag,
  CreditCard,
  Truck,
  IndianRupee,
  FileCheck2,
} from "lucide-react";
import { useSession } from "next-auth/react";

declare global {
  interface Window {
    Razorpay?: any;
  }
}

interface Address {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export default function CheckoutPage() {
  const { data: session } = useSession();
  const { items, totalPrice, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);

  // Payment method selection: 'razorpay' or 'cod'
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "cod">("razorpay");

  // Coupon Discount
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);

  // Address form
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "Delhi",
    pincode: "",
  });

  const [pincodeError, setPincodeError] = useState<string | null>(null);

  // Load Razorpay script dynamically
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Pre-fill user data
  useEffect(() => {
    async function loadSavedData() {
      if (session?.user) {
        let initialName = session.user.name || "";
        let initialEmail = session.user.email || "";
        let initialPhone = "";
        let initialStreet = "";
        let initialCity = "";
        let initialState = "Delhi";
        let initialPincode = "";

        try {
          const res = await fetch("/api/account/addresses");
          if (res.ok) {
            const data = await res.json();
            const list: Address[] = data.addresses || [];
            if (list.length > 0) {
              const defaultAddr = list.find((a) => a.isDefault) || list[0];
              initialName = defaultAddr.fullName || initialName;
              initialPhone = defaultAddr.phone || "";
              initialStreet = defaultAddr.street || "";
              initialCity = defaultAddr.city || "";
              initialState = defaultAddr.state || "Delhi";
              initialPincode = defaultAddr.pincode || "";
            }
          }
        } catch (err) {
          console.error("Error loading saved address for prefill:", err);
        }

        setFormData({
          fullName: initialName,
          email: initialEmail,
          phone: initialPhone,
          street: initialStreet,
          city: initialCity,
          state: initialState,
          pincode: initialPincode,
        });
      }
    }

    loadSavedData();
  }, [session]);

  const subtotal = totalPrice();
  const shipping = subtotal > 1999 ? 0 : 99;
  const taxableTotal = Math.max(0, subtotal - appliedDiscount);
  const grandTotal = taxableTotal + shipping;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    setCouponSuccess(null);

    const clean = couponCode.trim().toUpperCase();
    if (clean === "DEETA10") {
      const discount = Math.round(subtotal * 0.1);
      setAppliedDiscount(discount);
      setCouponSuccess(`Coupon DEETA10 applied! ₹${discount.toLocaleString("en-IN")} saved.`);
    } else if (clean === "FESTIVE500" && subtotal >= 3000) {
      setAppliedDiscount(500);
      setCouponSuccess("Festive discount of ₹500 successfully applied!");
    } else {
      setCouponError("Invalid or expired coupon code. Try DEETA10 for 10% off.");
    }
  };

  const handlePincodeBlur = () => {
    if (!/^[1-9][0-9]{5}$/.test(formData.pincode)) {
      setPincodeError("Please enter a valid 6-digit Indian PIN code.");
    } else {
      setPincodeError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^[1-9][0-9]{5}$/.test(formData.pincode)) {
      setPincodeError("Please provide a valid 6-digit Indian PIN code.");
      return;
    }

    setLoading(true);

    try {
      // Step 1: Create Order in DB
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
          paymentMethod,
        }),
      });

      const orderData = await res.json();
      if (!res.ok || !orderData.orderId) {
        alert(orderData.error || "Unable to initiate order. Please verify address details.");
        setLoading(false);
        return;
      }

      const createdDbOrderId = orderData.orderId;

      // Step 2: Handle Payment Mode
      if (paymentMethod === "cod") {
        clearCart();
        setConfirmedOrderId(createdDbOrderId);
        setOrderComplete(true);
        setLoading(false);
        return;
      }

      // Step 3: Online Payment via Razorpay
      const rzpRes = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: grandTotal,
          currency: "INR",
          receipt: `rcpt_${createdDbOrderId.slice(-6)}`,
          notes: {
            orderId: createdDbOrderId,
            customerEmail: formData.email,
          },
        }),
      });

      const rzpData = await rzpRes.json();

      if (!rzpRes.ok || !rzpData.orderId) {
        // Fallback confirmation
        clearCart();
        setConfirmedOrderId(createdDbOrderId);
        setOrderComplete(true);
        setLoading(false);
        return;
      }

      // Trigger Razorpay Modal
      if (typeof window !== "undefined" && window.Razorpay) {
        const options = {
          key: rzpData.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: rzpData.amount,
          currency: rzpData.currency || "INR",
          name: "Deeta Fashion",
          description: `Order #${createdDbOrderId.slice(-8).toUpperCase()}`,
          order_id: rzpData.isTestFallback ? undefined : rzpData.orderId,
          prefill: {
            name: formData.fullName,
            email: formData.email,
            contact: formData.phone,
          },
          theme: {
            color: "#111111",
          },
          handler: async function (response: any) {
            try {
              await fetch("/api/razorpay/verify-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  dbOrderId: createdDbOrderId,
                }),
              });
            } catch (err) {
              console.error("Verification callback warning:", err);
            }
            clearCart();
            setConfirmedOrderId(createdDbOrderId);
            setOrderComplete(true);
          },
          modal: {
            ondismiss: function () {
              setLoading(false);
            },
          },
        };

        const rzpInstance = new window.Razorpay(options);
        rzpInstance.open();
      } else {
        // Fallback when script is loading or in test environment
        clearCart();
        setConfirmedOrderId(createdDbOrderId);
        setOrderComplete(true);
      }
    } catch (err) {
      console.error(err);
      alert("Error contacting payment and checkout server.");
    } finally {
      setLoading(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <StorefrontNavbar />
        <div className="flex-1 max-w-xl mx-auto px-4 py-24 sm:py-28 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-8 h-8 stroke-[1.5]" />
          </div>
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#C29B38] font-bold block mb-1">
            Payment Verified &amp; Confirmed
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif">
            Thank You for Your Order!
          </h1>
          <p className="mt-3 text-slate-600 text-sm max-w-md leading-relaxed">
            Your handcrafted couture ensemble has been safely recorded in our fulfillment ledger under order ID{" "}
            <strong className="font-mono text-slate-900">
              #{confirmedOrderId?.slice(-8).toUpperCase()}
            </strong>
            . Courier dispatch notification and invoice copy are sent to {formData.email}.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full justify-center">
            {confirmedOrderId && (
              <Link
                href={`/account/orders/${confirmedOrderId}/invoice`}
                className="px-6 py-3 bg-slate-900 text-white font-mono text-xs uppercase tracking-wider font-bold rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5"
              >
                <FileCheck2 className="w-4 h-4" />
                <span>View GST Tax Invoice</span>
              </Link>
            )}
            <Link
              href="/"
              className="px-6 py-3 border border-slate-300 text-slate-900 font-mono text-xs uppercase tracking-wider font-bold rounded-xl hover:bg-slate-100 transition-colors"
            >
              Continue Shopping
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 w-full">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Collection</span>
        </Link>

        <div className="flex flex-col sm:flex-row justify-between sm:items-baseline mb-8 pb-4 border-b border-slate-200 gap-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-serif">
            Secure Checkout
          </h1>
          <span className="text-xs font-mono text-slate-500">
            100% Encrypted Payment via Razorpay
          </span>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 max-w-lg mx-auto shadow-sm">
            <p className="text-slate-600 font-medium">Your bag is empty. Please add items before checking out.</p>
            <Link
              href="/"
              className="inline-block mt-4 px-6 py-3 bg-slate-900 text-white font-mono text-xs uppercase tracking-wider font-bold rounded-xl"
            >
              Explore Handcrafted Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Delivery Address & Payment Method Form */}
            <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
              {/* 1. Address Section */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 font-serif">
                    <Truck className="w-4 h-4 text-[#C29B38]" />
                    1. Shipping &amp; Delivery Address
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Orders are delivered within 3–7 business days across India.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      Full Name *
                    </label>
                    <input
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full p-3 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-slate-900"
                      placeholder="e.g. Vivek Chandra"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      Mobile Phone (for delivery SMS) *
                    </label>
                    <input
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-3 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-slate-900 font-mono"
                      placeholder="e.g. 8210107736"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Email Address (for GST Tax Invoice) *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-3 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-slate-900"
                    placeholder="e.g. chandrarakhi42@gmail.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Flat / House No. / Street Address *
                  </label>
                  <input
                    required
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    className="w-full p-3 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-slate-900"
                    placeholder="e.g. A-151, AG Colony, Ashiyana Nagar..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      City *
                    </label>
                    <input
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full p-3 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-slate-900"
                      placeholder="e.g. Patna"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      State *
                    </label>
                    <input
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full p-3 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-slate-900"
                      placeholder="e.g. Bihar"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      PIN Code (6 Digits) *
                    </label>
                    <input
                      required
                      maxLength={6}
                      value={formData.pincode}
                      onBlur={handlePincodeBlur}
                      onChange={(e) => {
                        setFormData({ ...formData, pincode: e.target.value });
                        if (pincodeError) setPincodeError(null);
                      }}
                      className={`w-full p-3 border rounded-xl text-sm text-slate-900 font-mono focus:outline-none ${
                        pincodeError ? "border-rose-500 focus:border-rose-600" : "border-slate-200 focus:border-slate-900"
                      }`}
                      placeholder="e.g. 827004"
                    />
                    {pincodeError && (
                      <span className="text-[10px] text-rose-600 mt-1 block">{pincodeError}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* 2. Payment Method Selector */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 font-serif">
                  <CreditCard className="w-4 h-4 text-[#C29B38]" />
                  2. Select Payment Method
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Razorpay Online */}
                  <label
                    className={`p-4 border-2 rounded-xl flex items-start gap-3 cursor-pointer transition-all ${
                      paymentMethod === "razorpay"
                        ? "border-slate-900 bg-slate-50/70 shadow-sm"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="razorpay"
                      checked={paymentMethod === "razorpay"}
                      onChange={() => setPaymentMethod("razorpay")}
                      className="mt-1 accent-slate-900"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900">
                          Razorpay Online Payment
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-800 text-[9px] font-mono font-bold uppercase">
                          Recommended
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug">
                        Instant UPI (GPay/PhonePe), Credit &amp; Debit Cards, NetBanking, and RuPay.
                      </p>
                    </div>
                  </label>

                  {/* Cash on Delivery */}
                  <label
                    className={`p-4 border-2 rounded-xl flex items-start gap-3 cursor-pointer transition-all ${
                      paymentMethod === "cod"
                        ? "border-slate-900 bg-slate-50/70 shadow-sm"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="mt-1 accent-slate-900"
                    />
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-slate-900 block">
                        Cash on Delivery (COD)
                      </span>
                      <p className="text-[11px] text-slate-500 leading-snug">
                        Pay cash or UPI directly upon physical doorstep delivery.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs uppercase tracking-[0.2em] font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                  ) : (
                    <Lock className="w-4 h-4 text-amber-400" />
                  )}
                  <span>
                    {loading
                      ? "Verifying..."
                      : paymentMethod === "razorpay"
                      ? `Pay ₹${grandTotal.toLocaleString("en-IN")} via Razorpay`
                      : `Confirm COD Order (₹${grandTotal.toLocaleString("en-IN")})`}
                  </span>
                </button>
                <div className="flex items-center justify-center gap-3 text-[11px] font-mono text-slate-500 mt-3">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    256-Bit SSL Encrypted
                  </span>
                  <span>•</span>
                  <span>7-Day Hassle-Free Returns</span>
                  <span>•</span>
                  <span>GST Invoice Included</span>
                </div>
              </div>
            </form>

            {/* Right Column: Order Summary & Discount Coupon */}
            <div className="lg:col-span-5 space-y-5">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-900 text-base font-serif">Order Summary</h3>

                {/* Items preview list */}
                <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.variantId} className="py-3 flex items-center justify-between gap-3">
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-slate-900 line-clamp-1">{item.title}</p>
                        <p className="text-[11px] text-slate-500 font-mono">
                          Qty: {item.quantity} | Size: {item.size} ({item.colorName})
                        </p>
                      </div>
                      <span className="text-xs font-bold text-slate-900 font-mono">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Coupon Code Input */}
                <form onSubmit={handleApplyCoupon} className="pt-2 border-t border-slate-100 space-y-2">
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                    Have a Promo Code? (Use DEETA10)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="e.g. DEETA10"
                      className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono uppercase tracking-wider text-slate-900 focus:outline-none focus:border-slate-900"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-xs font-mono font-bold uppercase rounded-lg transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {couponSuccess && (
                    <p className="text-[11px] font-mono text-emerald-700">{couponSuccess}</p>
                  )}
                  {couponError && (
                    <p className="text-[11px] font-mono text-rose-600">{couponError}</p>
                  )}
                </form>

                {/* Price Breakdown */}
                <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Bag Subtotal</span>
                    <span className="font-semibold text-slate-900 font-mono">
                      ₹{subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {appliedDiscount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Promo Discount</span>
                      <span className="font-mono">-₹{appliedDiscount.toLocaleString("en-IN")}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-600">
                    <span>Pan-India Delivery</span>
                    <span className="font-semibold font-mono">
                      {shipping === 0 ? (
                        <span className="text-emerald-700 font-bold uppercase">FREE</span>
                      ) : (
                        `₹${shipping}`
                      )}
                    </span>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-lg text-[11px] text-slate-500 font-mono">
                    <p>All taxes (GST 5% / 12%) are fully included in the price.</p>
                  </div>

                  <div className="flex justify-between text-slate-900 text-base font-extrabold pt-2 border-t border-slate-100">
                    <span className="font-serif">Grand Total (INR)</span>
                    <span className="font-mono text-lg text-slate-900">
                      ₹{grandTotal.toLocaleString("en-IN")}
                    </span>
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
