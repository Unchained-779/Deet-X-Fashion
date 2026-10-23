"use client";

import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import {
  ShoppingBag,
  Search,
  ShieldCheck,
  User,
  LogOut,
  ChevronDown,
  Package,
  MapPin,
  Heart,
  X,
  Sparkles,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import AuthModal from "@/components/AuthModal";
import InstantSearchModal from "@/components/InstantSearchModal";
import { useSession, signOut } from "next-auth/react";

export default function StorefrontNavbar() {
  const { data: session } = useSession();
  const { totalItems, openDrawer } = useCartStore();
  const { totalItems: wishlistTotal } = useWishlistStore();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [marqueeVisible, setMarqueeVisible] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const itemCount = mounted ? totalItems() : 0;
  const wishCount = mounted ? wishlistTotal() : 0;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Sleek Top Announcement Marquee */}
      {marqueeVisible && (
        <div className="bg-[#111111] text-[#F4EDE4] text-[10px] sm:text-[11px] font-mono tracking-widest py-1.5 px-4 border-b border-white/10 flex items-center justify-between relative overflow-hidden select-none">
          <div className="flex-1 text-center font-medium truncate flex items-center justify-center gap-3">
            <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-amber-300 font-bold uppercase tracking-[0.2em]">Festive Season:</span>
            <span>FREE PAN-INDIA SHIPPING ON ORDERS ABOVE ₹1,999</span>
            <span className="opacity-40">•</span>
            <span className="hidden md:inline">EASY 7-DAY RETURNS &amp; EXCHANGES</span>
            <span className="hidden md:inline opacity-40">•</span>
            <span className="hidden lg:inline text-amber-200">100% AUTHENTIC SILK &amp; DESIGNER WEAR</span>
          </div>
          <button
            type="button"
            onClick={() => setMarqueeVisible(false)}
            aria-label="Dismiss banner"
            className="text-white/60 hover:text-white ml-2 p-0.5 transition-colors shrink-0"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Main Glass Navigation Bar */}
      <div
        className={`transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isScrolled
            ? "bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E5E0D8] text-[#111111] py-3.5 shadow-[0_1px_0_0_#E5E0D8]"
            : "bg-gradient-to-b from-black/75 via-black/35 to-transparent text-white py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
          {/* Left: Category Links */}
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

          {/* Center: Editorial Serif Wordmark with Enhanced Contrast */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center group select-none"
          >
            <span
              style={{ fontFamily: "var(--font-editorial)" }}
              className="text-2xl sm:text-3xl font-normal tracking-[0.25em] uppercase text-center transition-opacity group-hover:opacity-75 drop-shadow-sm"
            >
              DEETA
            </span>
            <span className="text-[10px] tracking-[0.4em] uppercase font-mono font-bold text-amber-500 dark:text-amber-400 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] -mt-1 px-1.5 py-0.5 rounded bg-black/40">
              FASHION
            </span>
          </Link>

          {/* Right: Search, Wishlist, Account, Admin & Zustand Cart Drawer Trigger */}
          <div className="flex items-center gap-4 sm:gap-5">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search Collection"
              className="hover:opacity-60 transition-opacity p-1"
            >
              <Search className="w-4 h-4 stroke-[1.5]" />
            </button>

            {/* Wishlist Heart Icon with dynamic item counter */}
            <Link
              href="#catalog"
              aria-label="View Wishlist"
              className="hover:opacity-80 transition-opacity p-1 relative flex items-center"
            >
              <Heart className={`w-4 h-4 stroke-[1.5] ${wishCount > 0 ? "fill-rose-500 text-rose-500" : ""}`} />
              {wishCount > 0 && (
                <span className="absolute -top-1 -right-1.5 w-3.5 h-3.5 rounded-full bg-rose-600 text-white font-mono text-[9px] font-bold flex items-center justify-center animate-in zoom-in-50">
                  {wishCount}
                </span>
              )}
            </Link>

          {/* Subtle direct header badge for Admin */}
          {(session?.user?.role === "ADMIN" ||
            session?.user?.email?.toLowerCase().includes("vivek") ||
            session?.user?.email?.toLowerCase().includes("deetx")) && (
            <Link
              href="/admin"
              className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/30 transition-all shadow-sm"
            >
              <ShieldCheck className="w-3 h-3 text-amber-400" />
              <span>Admin Studio</span>
            </Link>
          )}

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
                    {/* Direct Admin Studio Entry */}
                    {(session.user.role === "ADMIN" ||
                      session.user.email?.toLowerCase().includes("vivek") ||
                      session.user.email?.toLowerCase().includes("deetx") ||
                      session.user.name?.toLowerCase().includes("vivek") ||
                      session.user.email === "chandravivek779@gmail.com" ||
                      session.user.email === "gdsc.vivekchandra@gmail.com") && (
                      <Link
                        href="/admin"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center justify-between gap-2.5 py-2 px-2.5 rounded bg-amber-500/10 border border-amber-500/30 text-[#B8860B] dark:text-amber-400 font-semibold transition-all hover:bg-amber-500/20"
                      >
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-amber-600" />
                          <span className="tracking-wide">Open Admin Portal</span>
                        </div>
                        <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-amber-600 text-white font-bold">
                          Owner
                        </span>
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
              className="hover:opacity-80 transition-opacity p-1 flex items-center gap-2 group"
            >
              <User className="w-4 h-4 stroke-[2] group-hover:scale-105 transition-transform" />
              <div className="hidden lg:flex flex-col text-left leading-tight">
                <span className="text-[10px] font-mono tracking-wider font-medium text-white/95">
                  Hello, Sign in
                </span>
                <span className="text-[11px] uppercase font-mono tracking-wider font-bold text-white drop-shadow-sm">
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
    </div>

    {/* Editorial Luxury Auth Modal & Instant Search Modal */}
    <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    <InstantSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
  </header>
  );
}
