"use client";

import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { ShoppingBag, Search, ShieldCheck, User, LogOut, ChevronDown, Package, MapPin } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import AuthModal from "@/components/AuthModal";
import { useSession, signOut } from "next-auth/react";

export default function StorefrontNavbar() {
  const { data: session } = useSession();
  const { totalItems, openDrawer } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const itemCount = mounted ? totalItems() : 0;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isScrolled
          ? "bg-[#FAF8F5]/85 backdrop-blur-md border-b border-[#E5E0D8] text-[#111111] py-4 shadow-[0_1px_0_0_#E5E0D8]"
          : "bg-gradient-to-b from-black/60 via-black/20 to-transparent text-white py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
        {/* Left: Hierarchical Category Links */}
        <nav className="flex items-center gap-6 lg:gap-8 text-xs uppercase tracking-[0.18em] font-medium">
          <Link
            href="/?category=women#catalog"
            className="hover:opacity-60 transition-opacity duration-300"
          >
            Women
          </Link>
          <Link
            href="/?category=men#catalog"
            className="hover:opacity-60 transition-opacity duration-300"
          >
            Men
          </Link>
          <Link
            href="/?category=ethnic#catalog"
            className="hover:opacity-60 transition-opacity duration-300"
          >
            Ethnic
          </Link>
          <Link
            href="/?category=western#catalog"
            className="hidden sm:inline hover:opacity-60 transition-opacity duration-300"
          >
            Western
          </Link>
        </nav>

        {/* Center: Editorial Serif Wordmark */}
        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center group"
        >
          <span
            style={{ fontFamily: "var(--font-editorial)" }}
            className="text-2xl sm:text-3xl font-normal tracking-[0.25em] uppercase text-center transition-opacity group-hover:opacity-75"
          >
            DEETA
          </span>
          <span className="text-[9px] tracking-[0.35em] uppercase font-mono text-accent opacity-90 -mt-1">
            Fashion
          </span>
        </Link>

        {/* Right: Search, Account, Admin & Zustand Cart Drawer Trigger */}
        <div className="flex items-center gap-5 sm:gap-6">
          <button
            type="button"
            aria-label="Search Collection"
            className="hover:opacity-60 transition-opacity p-1"
          >
            <Search className="w-4 h-4 stroke-[1.5]" />
          </button>

          {/* Amazon-Style Personalized Account Menu */}
          {session?.user ? (
            <div
              className="relative"
              ref={menuRef}
              onMouseEnter={() => setMenuOpen(true)}
              onMouseLeave={() => setMenuOpen(false)}
            >
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="hover:opacity-80 transition-opacity p-1 flex items-center gap-2 text-left"
                aria-label="User Account Menu"
              >
                <div className="w-6 h-6 rounded-full bg-[#FAF8F5] text-[#111] flex items-center justify-center font-mono text-[11px] font-bold border border-current shadow-sm">
                  {session.user.name ? session.user.name[0].toUpperCase() : "U"}
                </div>
                <div className="hidden lg:flex flex-col leading-none">
                  <span className="text-[9px] font-mono tracking-wider opacity-75">
                    Hello, {session.user.name?.split(" ")[0] || "Guest"}
                  </span>
                  <span className="text-[10px] font-mono tracking-widest uppercase font-semibold flex items-center gap-0.5 mt-0.5">
                    Account &amp; Lists <ChevronDown className="w-2.5 h-2.5 opacity-60" />
                  </span>
                </div>
              </button>

              {/* Flyout Luxury Dropdown Menu */}
              {menuOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-[#FAF8F5] text-[#111] border border-[#E5E0D8] shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="border-b border-[#E5E0D8] pb-3 mb-3">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-[#999]">
                      Signed in as
                    </p>
                    <p className="text-xs font-semibold truncate font-sans text-[#111]">
                      {session.user.name || "Valued Customer"}
                    </p>
                    <p className="text-[10px] font-mono text-[#777] truncate">
                      {session.user.email}
                    </p>
                  </div>

                  <div className="space-y-1 text-xs font-sans">
                    <Link
                      href="/account#orders"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 py-1.5 px-2 hover:bg-black/5 transition-colors"
                    >
                      <Package className="w-3.5 h-3.5 text-[#555]" />
                      <span>Your Orders &amp; Invoices</span>
                    </Link>
                    <Link
                      href="/account#address"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 py-1.5 px-2 hover:bg-black/5 transition-colors"
                    >
                      <MapPin className="w-3.5 h-3.5 text-[#555]" />
                      <span>Delivery Addresses</span>
                    </Link>
                    {session.user.role === "ADMIN" && (
                      <Link
                        href="/admin"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2.5 py-1.5 px-2 hover:bg-black/5 text-[#C29B38] font-medium transition-colors"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Store Management Portal</span>
                      </Link>
                    )}
                  </div>

                  <div className="border-t border-[#E5E0D8] pt-2 mt-2">
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="w-full flex items-center gap-2 py-1.5 px-2 text-xs font-mono uppercase tracking-wider text-rose-700 hover:bg-rose-50 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setAuthOpen(true)}
              aria-label="Account Login or Register"
              className="hover:opacity-60 transition-opacity p-1 flex items-center gap-1.5"
            >
              <User className="w-4 h-4 stroke-[1.5]" />
              <div className="hidden lg:flex flex-col text-left leading-none">
                <span className="text-[9px] font-mono tracking-wider opacity-70">
                  Hello, Sign in
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider font-semibold">
                  Account &amp; Lists
                </span>
              </div>
            </button>
          )}

          {/* Cart Drawer Trigger */}
          <button
            onClick={openDrawer}
            className="flex items-center gap-2 group p-1"
            aria-label="Open Shopping Bag"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4 stroke-[1.5] group-hover:opacity-60 transition-opacity" />
            </div>
            <span className="font-mono text-xs tracking-tight">
              ({itemCount})
            </span>
          </button>
        </div>
      </div>

      {/* Editorial Luxury Auth Modal */}
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </header>
  );
}
