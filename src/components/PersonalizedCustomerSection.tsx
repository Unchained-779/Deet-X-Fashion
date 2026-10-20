import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  Package,
  MapPin,
  Heart,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
} from "lucide-react";

export default async function PersonalizedCustomerSection() {
  const session = await auth();

  // If visitor is not logged in, render an inviting VIP Club invitation banner
  if (!session?.user) {
    return (
      <section className="bg-[#111111] text-[#FAF8F5] py-14 border-y border-[#262626]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-[#D4AF37] flex items-center justify-center md:justify-start gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Exclusive Client Privilege
            </span>
            <h2
              style={{ fontFamily: "var(--font-editorial)" }}
              className="text-2xl sm:text-3xl tracking-wide font-normal"
            >
              Experience Personalized Luxury & Curated Selections
            </h2>
            <p className="text-xs text-[#999999] max-w-xl font-light">
              Sign in with your Google or Deeta Fashion account to access personalized tailored recommendations, order tracking, and private festive collections.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[11px] font-mono tracking-widest text-[#FAF8F5]/80 uppercase">
              Click &quot;Account&quot; in the navbar above
            </span>
          </div>
        </div>
      </section>
    );
  }

  // Fetch logged-in user profile, recent orders, and curated recommendations
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        take: 3,
        include: {
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
      },
      addresses: {
        where: { isDefault: true },
        take: 1,
      },
    },
  });

  // Recommended pieces for the customer
  const curatedProducts = await prisma.product.findMany({
    where: { isPublished: true },
    take: 4,
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      variants: true,
    },
  });

  const firstName = session.user.name?.split(" ")[0] || "Esteemed Guest";
  const defaultAddress = user?.addresses?.[0];
  const recentOrders = user?.orders || [];

  return (
    <section className="bg-[#FAF8F5] border-y border-[#E5E0D8] py-14 text-[#111111]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Amazon-style Luxury Personalized Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-[#E5E0D8] gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#C29B38] font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Deeta Privé • Personal Concierge
              </span>
              {defaultAddress && (
                <span className="text-[10px] font-mono text-[#777] flex items-center gap-1 border-l border-[#D5D0C8] pl-2">
                  <MapPin className="w-3 h-3 text-[#111]" />
                  Delivering to {defaultAddress.city} {defaultAddress.pincode}
                </span>
              )}
            </div>
            <h2
              style={{ fontFamily: "var(--font-editorial)" }}
              className="text-3xl sm:text-4xl tracking-tight font-normal"
            >
              Namaste, {firstName} — Curated for You
            </h2>
            <p className="text-xs text-[#666666] mt-1 font-sans">
              Welcome back to your personalized boutique. Your private orders, saved dimensions, and seasonal recommendations.
            </p>
          </div>

          {/* Quick Shortcuts */}
          <div className="flex items-center gap-3">
            <Link
              href="/account"
              className="px-4 py-2 bg-white border border-[#E5E0D8] text-[11px] font-mono uppercase tracking-wider hover:border-[#111111] transition-colors flex items-center gap-2 shadow-sm"
            >
              <span>Manage Profile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            {session.user.role === "ADMIN" && (
              <Link
                href="/admin"
                className="px-4 py-2 bg-[#111111] text-[#FAF8F5] text-[11px] font-mono uppercase tracking-wider hover:bg-[#333333] transition-colors flex items-center gap-2"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Store Portal</span>
              </Link>
            )}
          </div>
        </div>

        {/* 4-Column Feature Cards (Amazon Inspired, High-Fashion Executed) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Card 1: Your Orders & Recent Purchase */}
          <div className="bg-white border border-[#E5E0D8] p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-9 h-9 rounded-full bg-[#FAF8F5] border border-[#E5E0D8] flex items-center justify-center">
                  <Package className="w-4 h-4 stroke-[1.5]" />
                </div>
                <span className="text-[10px] font-mono tracking-widest text-[#888] uppercase">
                  Purchases
                </span>
              </div>
              <h3
                style={{ fontFamily: "var(--font-editorial)" }}
                className="text-xl tracking-wide mb-2"
              >
                Your Orders & Tracking
              </h3>
              {recentOrders.length > 0 ? (
                <div className="text-xs text-[#555] space-y-1 mt-3">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Order #{recentOrders[0].id.slice(-6).toUpperCase()}</span>
                  </div>
                  <p className="text-[11px] text-[#777]">
                    Status: <span className="uppercase font-mono font-semibold">{recentOrders[0].status}</span>
                  </p>
                  <p className="text-[11px] text-[#777]">
                    Total: ₹{recentOrders[0].totalAmount.toLocaleString("en-IN")}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-[#777] font-light mt-2 leading-relaxed">
                  No active orders yet. Your royal attire awaits in our handcrafted catalogue.
                </p>
              )}
            </div>
            <Link
              href="/account#orders"
              className="mt-6 text-[11px] font-mono uppercase tracking-wider text-[#111] hover:underline flex items-center gap-1.5 pt-4 border-t border-[#F0ECE6]"
            >
              <span>View all orders</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Card 2: Buy It Again / Quick Reorder */}
          <div className="bg-white border border-[#E5E0D8] p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-9 h-9 rounded-full bg-[#FAF8F5] border border-[#E5E0D8] flex items-center justify-center">
                  <Clock className="w-4 h-4 stroke-[1.5]" />
                </div>
                <span className="text-[10px] font-mono tracking-widest text-[#888] uppercase">
                  Reorder
                </span>
              </div>
              <h3
                style={{ fontFamily: "var(--font-editorial)" }}
                className="text-xl tracking-wide mb-2"
              >
                Buy It Again
              </h3>
              {recentOrders[0]?.orderItems?.[0] ? (
                <div className="mt-3 flex items-center gap-3">
                  <div className="w-12 h-14 bg-[#F2EDE4] overflow-hidden flex-shrink-0">
                    <img
                      src={recentOrders[0].orderItems[0].variant.images[0] || "/placeholder.jpg"}
                      alt={recentOrders[0].orderItems[0].variant.product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-medium truncate">
                      {recentOrders[0].orderItems[0].variant.product.title}
                    </p>
                    <p className="text-[11px] font-mono text-[#777]">
                      ₹{recentOrders[0].orderItems[0].priceAtPurchase.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-[#777] font-light mt-2 leading-relaxed">
                  Frequent festive essentials & matching dupattas will be pinned here.
                </p>
              )}
            </div>
            <Link
              href="/?category=ethnic#catalog"
              className="mt-6 text-[11px] font-mono uppercase tracking-wider text-[#111] hover:underline flex items-center gap-1.5 pt-4 border-t border-[#F0ECE6]"
            >
              <span>Explore Wardrobe</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Card 3: Saved Delivery Address & Fitting Details */}
          <div className="bg-white border border-[#E5E0D8] p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-9 h-9 rounded-full bg-[#FAF8F5] border border-[#E5E0D8] flex items-center justify-center">
                  <MapPin className="w-4 h-4 stroke-[1.5]" />
                </div>
                <span className="text-[10px] font-mono tracking-widest text-[#888] uppercase">
                  Logistics
                </span>
              </div>
              <h3
                style={{ fontFamily: "var(--font-editorial)" }}
                className="text-xl tracking-wide mb-2"
              >
                Your Addresses
              </h3>
              {defaultAddress ? (
                <div className="text-xs text-[#555] space-y-0.5 mt-3">
                  <p className="font-medium text-[#111]">{defaultAddress.fullName}</p>
                  <p className="text-[11px] text-[#777] truncate">{defaultAddress.street}</p>
                  <p className="text-[11px] text-[#777]">
                    {defaultAddress.city}, {defaultAddress.state} - {defaultAddress.pincode}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-[#777] font-light mt-2 leading-relaxed">
                  Save your home or boutique delivery address for 1-click expedited checkout.
                </p>
              )}
            </div>
            <Link
              href="/account#address"
              className="mt-6 text-[11px] font-mono uppercase tracking-wider text-[#111] hover:underline flex items-center gap-1.5 pt-4 border-t border-[#F0ECE6]"
            >
              <span>{defaultAddress ? "Edit addresses" : "Add address"}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Card 4: VIP Deeta Privilege Tier */}
          <div className="bg-gradient-to-br from-[#1C1A17] to-[#111111] text-[#FAF8F5] border border-[#333333] p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-[#D4AF37]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase">
                  Club Deeta
                </span>
              </div>
              <h3
                style={{ fontFamily: "var(--font-editorial)" }}
                className="text-xl tracking-wide mb-2 text-[#FAF8F5]"
              >
                Privilege Member
              </h3>
              <p className="text-xs text-[#A8A49C] font-light mt-2 leading-relaxed">
                Enjoy priority boutique tailoring, direct WhatsApp artisan access, and complimentary festive delivery.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37]">
                Active Status
              </span>
              <span className="text-xs font-mono font-medium text-emerald-400">
                VERIFIED
              </span>
            </div>
          </div>
        </div>

        {/* Tailored Recommendations Grid (Inspired by Amazon's 'Recommended for you' carousel) */}
        <div>
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#E5E0D8]">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C29B38] block">
                Inspired By Your Royal Taste
              </span>
              <h3
                style={{ fontFamily: "var(--font-editorial)" }}
                className="text-2xl tracking-wide font-normal"
              >
                Recommended For You, {firstName}
              </h3>
            </div>
            <Link
              href="/#catalog"
              className="text-[11px] font-mono uppercase tracking-widest text-[#111] hover:underline flex items-center gap-1.5"
            >
              <span>View All Recommendations</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {curatedProducts.map((prod) => {
              const displayPrice = prod.basePrice;
              const displayImage =
                prod.variants?.[0]?.images?.[0] || "/placeholder.jpg";
              return (
                <Link
                  key={prod.id}
                  href={`/products/${prod.slug}`}
                  className="group block bg-white border border-[#E5E0D8] p-3 hover:border-[#111111] transition-colors"
                >
                  <div className="aspect-[3/4] bg-[#F2EDE4] overflow-hidden mb-3 relative">
                    <img
                      src={displayImage}
                      alt={prod.title}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                    />
                    <div className="absolute top-2 left-2 bg-[#FAF8F5]/90 backdrop-blur-sm px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider">
                      {prod.category?.name}
                    </div>
                  </div>
                  <h4 className="text-xs uppercase font-sans tracking-wide truncate group-hover:underline">
                    {prod.title}
                  </h4>
                  <p className="text-xs font-mono font-semibold text-[#111111] mt-1">
                    ₹{displayPrice.toLocaleString("en-IN")}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
