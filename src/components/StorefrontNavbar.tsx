"use client";

import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { ShoppingBag, Search, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

export default function StorefrontNavbar() {
  const { totalItems, openDrawer } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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
            href="/?category=women"
            className="hover:opacity-60 transition-opacity duration-300"
          >
            Women
          </Link>
          <Link
            href="/?category=men"
            className="hover:opacity-60 transition-opacity duration-300"
          >
            Men
          </Link>
          <Link
            href="/?category=ethnic"
            className="hover:opacity-60 transition-opacity duration-300"
          >
            Ethnic
          </Link>
          <Link
            href="/?category=western"
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

        {/* Right: Search, Admin & Zustand Cart Drawer Trigger */}
        <div className="flex items-center gap-5 sm:gap-6">
          <button
            type="button"
            aria-label="Search Collection"
            className="hover:opacity-60 transition-opacity p-1"
          >
            <Search className="w-4 h-4 stroke-[1.5]" />
          </button>

          <Link
            href="/admin"
            className="hidden md:flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] font-mono border border-current px-2.5 py-1 hover:bg-white hover:text-black transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 stroke-[1.5]" />
            <span>Portal</span>
          </Link>

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
    </header>
  );
}
