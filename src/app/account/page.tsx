import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import StorefrontNavbar from "@/components/StorefrontNavbar";
import CartDrawer from "@/components/CartDrawer";
import AddressManager from "@/components/AddressManager";
import Link from "next/link";
import { Package, MapPin, Shield, Clock, FileText, ChevronRight, User } from "lucide-react";
import { redirect } from "next/navigation";

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
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
      addresses: true,
    },
  });

  const orders = user?.orders || [];
  const addresses = user?.addresses || [];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#111111] flex flex-col font-sans">
      <StorefrontNavbar />
      <CartDrawer />

      <main className="max-w-6xl mx-auto px-6 sm:px-8 pt-32 pb-24 w-full flex-grow">
        {/* Amazon-style "Your Account" Header */}
        <div className="mb-10 pb-6 border-b border-[#E5E0D8]">
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#C29B38] block mb-1">
            Personal Concierge • ग्राहक खाता
          </span>
          <h1
            style={{ fontFamily: "var(--font-editorial)" }}
            className="text-4xl sm:text-5xl font-normal tracking-tight"
          >
            Your Account
          </h1>
          <p className="text-xs text-[#666666] font-mono mt-2">
            Logged in as <span className="font-semibold text-[#111111]">{session.user.name}</span> ({session.user.email})
          </p>
        </div>

        {/* Amazon Grid Quick Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <a
            href="#orders"
            className="bg-white border border-[#E5E0D8] p-6 hover:border-[#111111] transition-colors flex items-start gap-4 shadow-sm group"
          >
            <div className="w-12 h-12 rounded-full bg-[#FAF8F5] border border-[#E5E0D8] flex items-center justify-center flex-shrink-0 group-hover:bg-[#111111] group-hover:text-white transition-colors">
              <Package className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div>
              <h2
                style={{ fontFamily: "var(--font-editorial)" }}
                className="text-xl tracking-wide font-normal mb-1"
              >
                Your Orders
              </h2>
              <p className="text-xs text-[#777777] font-light leading-relaxed">
                Track, return, or inspect past purchases and GST tax invoices.
              </p>
            </div>
          </a>

          <a
            href="#address"
            className="bg-white border border-[#E5E0D8] p-6 hover:border-[#111111] transition-colors flex items-start gap-4 shadow-sm group"
          >
            <div className="w-12 h-12 rounded-full bg-[#FAF8F5] border border-[#E5E0D8] flex items-center justify-center flex-shrink-0 group-hover:bg-[#111111] group-hover:text-white transition-colors">
              <MapPin className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div>
              <h2
                style={{ fontFamily: "var(--font-editorial)" }}
                className="text-xl tracking-wide font-normal mb-1"
              >
                Delivery Addresses
              </h2>
              <p className="text-xs text-[#777777] font-light leading-relaxed">
                Edit shipping destinations for rapid 1-tap checkout.
              </p>
            </div>
          </a>

          <div className="bg-white border border-[#E5E0D8] p-6 flex items-start gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-[#FAF8F5] border border-[#E5E0D8] flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div>
              <h2
                style={{ fontFamily: "var(--font-editorial)" }}
                className="text-xl tracking-wide font-normal mb-1"
              >
                Security &amp; Privilege
              </h2>
              <p className="text-xs text-[#777777] font-light leading-relaxed">
                Google OAuth 2.0 256-bit encrypted authentication.
              </p>
            </div>
          </div>
        </div>

        {/* Section 1: Orders History */}
        <section id="orders" className="mb-16 scroll-mt-28">
          <div className="flex items-baseline justify-between mb-6 pb-2 border-b border-[#E5E0D8]">
            <h2
              style={{ fontFamily: "var(--font-editorial)" }}
              className="text-3xl font-normal tracking-wide"
            >
              Order History &amp; Bills
            </h2>
            <span className="text-[11px] font-mono text-[#888888]">
              {orders.length} {orders.length === 1 ? "Order" : "Orders"} Placed
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white border border-[#E5E0D8] p-12 text-center">
              <p className="text-xs font-mono uppercase tracking-widest text-[#888888] mb-2">
                No orders discovered
              </p>
              <p
                style={{ fontFamily: "var(--font-editorial)" }}
                className="text-2xl font-light text-[#111111] mb-6"
              >
                Discover Deeta Fashion&apos;s royal heritage collection.
              </p>
              <Link
                href="/#catalog"
                className="inline-block px-6 py-3 bg-[#111111] text-[#FAF8F5] text-xs font-mono uppercase tracking-[0.2em] hover:bg-[#333333] transition-colors"
              >
                Explore Collection
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((ord) => (
                <div key={ord.id} className="bg-white border border-[#E5E0D8]">
                  {/* Order Meta Bar (Amazon Style) */}
                  <div className="bg-[#F8F5EE] border-b border-[#E5E0D8] px-6 py-4 flex flex-wrap items-center justify-between gap-4 text-xs">
                    <div className="flex flex-wrap items-center gap-6 sm:gap-10">
                      <div>
                        <span className="text-[10px] uppercase font-mono tracking-wider text-[#888] block">
                          ORDER PLACED
                        </span>
                        <span className="font-mono text-[#111]">
                          {new Date(ord.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-mono tracking-wider text-[#888] block">
                          TOTAL AMOUNT
                        </span>
                        <span className="font-mono font-semibold text-[#111]">
                          ₹{ord.totalAmount.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-mono tracking-wider text-[#888] block">
                          STATUS
                        </span>
                        <span className="inline-block px-2 py-0.5 text-[9px] font-mono uppercase tracking-widest bg-emerald-100 text-emerald-800 border border-emerald-300">
                          {ord.status}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-wider text-[#888] block text-right">
                        ORDER # {ord.id.slice(-8).toUpperCase()}
                      </span>
                      <Link
                        href={`/account/orders/${ord.id}/invoice`}
                        className="text-[11px] font-mono uppercase tracking-wider text-[#C29B38] hover:underline flex items-center justify-end gap-1 mt-0.5"
                      >
                        <FileText className="w-3 h-3" />
                        <span>View Tax Invoice</span>
                      </Link>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6 divide-y divide-[#F0ECE6]">
                    {ord.orderItems.map((item) => (
                      <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center gap-5">
                        <div className="w-16 h-20 bg-[#F2EDE4] overflow-hidden flex-shrink-0">
                          <img
                            src={item.variant?.images?.[0] || "/placeholder.jpg"}
                            alt={item.variant?.product?.title || "Garment"}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-grow">
                          <h3 className="text-sm font-medium text-[#111111]">
                            {item.variant?.product?.title}
                          </h3>
                          <p className="text-xs text-[#777] font-mono mt-0.5">
                            Size: {item.variant?.size} • Color: {item.variant?.colorName} • Qty: {item.quantity}
                          </p>
                          <p className="text-xs font-mono font-semibold text-[#111111] mt-1">
                            ₹{item.priceAtPurchase.toLocaleString("en-IN")}
                          </p>
                        </div>
                        <Link
                          href={`/products/${item.variant?.product?.slug}`}
                          className="hidden sm:inline-block px-4 py-2 border border-[#E5E0D8] text-[10px] font-mono uppercase tracking-wider hover:border-[#111111] transition-colors"
                        >
                          Buy Again
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Section 2: Addresses (Interactive AddressManager) */}
        <section id="address" className="scroll-mt-28">
          <AddressManager initialAddresses={addresses} />
        </section>
      </main>
    </div>
  );
}
