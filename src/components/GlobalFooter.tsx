"use client";

import Link from "next/link";
import { ShieldCheck, Lock, Truck, RefreshCw, Mail, Phone, MapPin, ArrowRight } from "lucide-react";

export default function GlobalFooter() {
  return (
    <footer className="bg-[#111111] text-[#FAF8F5] pt-16 pb-12 border-t border-[#262626] font-sans mt-auto">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Top Section: Brand + Value Proposition + Multi-Column Links */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-14 border-b border-[#262626]">
          {/* Brand Bio */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="inline-block group">
              <span
                style={{ fontFamily: "var(--font-editorial)" }}
                className="text-3xl sm:text-4xl font-normal tracking-[0.25em] uppercase text-white group-hover:opacity-80 transition-opacity"
              >
                DEETA FASHION
              </span>
              <span className="block text-[10px] tracking-[0.35em] uppercase font-mono text-[#C29B38] mt-0.5">
                Handcrafted Indian Heritage
              </span>
            </Link>
            <p className="text-xs text-[#FAF8F5]/80 leading-relaxed max-w-md font-sans">
              Handcrafted festive wear, traditional sarees, and comfortable everyday styles made with pride. Owned and operated under the legal tradename <strong className="text-white">Rakhi Chandra</strong> (Deeta Fashion), dedicated to preserving master weaver traditions across Varanasi, Chanderi, and Kanchipuram.
            </p>

            <div className="pt-2 text-xs text-[#FAF8F5]/80 space-y-2 font-mono">
              <p className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#C29B38] shrink-0 mt-0.5" />
                <span>A-151, AG Colony, Ashiyana Nagar, Patna - 800025, Bihar, India</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#C29B38] shrink-0" />
                <span>chandrarakhi42@gmail.com</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#C29B38] shrink-0" />
                <span>+91 8210107736 (Mon–Sat, 10:00 AM – 7:00 PM IST)</span>
              </p>
            </div>
          </div>

          {/* Quick Shop Links: Women Ethnic, Men Western, Bridal / Festive, Ready-to-Wear */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs uppercase font-mono tracking-[0.2em] text-[#C29B38] font-bold">
              Shop Collections
            </h4>
            <ul className="space-y-2.5 text-xs font-sans text-[#FAF8F5]/80">
              <li>
                <Link href="/shop?category=women" className="hover:text-white transition-colors">
                  Women Ethnic
                </Link>
              </li>
              <li>
                <Link href="/shop?category=men" className="hover:text-white transition-colors">
                  Men Western
                </Link>
              </li>
              <li>
                <Link href="/shop?category=bridal" className="hover:text-white transition-colors">
                  Bridal / Festive
                </Link>
              </li>
              <li>
                <Link href="/shop?category=western" className="hover:text-white transition-colors">
                  Ready-to-Wear
                </Link>
              </li>
              <li>
                <Link href="/shop?category=sarees" className="hover:text-white transition-colors">
                  Silk Sarees
                </Link>
              </li>
            </ul>
          </div>

          {/* Mandatory Razorpay Policies */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs uppercase font-mono tracking-[0.2em] text-[#C29B38] font-bold">
              Customer Policies
            </h4>
            <ul className="space-y-2.5 text-xs font-sans text-[#FAF8F5]/80">
              <li>
                <Link href="/terms-and-conditions" className="hover:text-white transition-colors">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-white transition-colors">
                  Refund &amp; Cancellation Policy
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-white transition-colors">
                  Shipping &amp; Delivery Policy
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="hover:text-white transition-colors">
                  Contact Us &amp; Grievance
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter & Atelier Circle */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs uppercase font-mono tracking-[0.2em] text-[#C29B38] font-bold">
              The Heritage Circle
            </h4>
            <p className="text-xs text-[#FAF8F5]/70 leading-relaxed font-sans">
              Subscribe to receive private previews of festive handloom drops, bridal collections, and exclusive invitations.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-2 pt-1">
              <input
                type="email"
                placeholder="Enter email address"
                className="bg-[#1c1c1c] border border-[#333] px-3.5 py-2.5 text-xs text-white placeholder-[#888] rounded-none focus:outline-none focus:border-[#C29B38] w-full font-sans"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="bg-[#FAF8F5] text-[#111] px-4 py-2.5 text-xs font-mono uppercase tracking-wider font-bold hover:bg-[#C29B38] hover:text-white transition-colors shrink-0"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Middle Section: Payment Trust Strip & Guarantees */}
        <div className="py-8 border-b border-[#262626] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-xs text-[#FAF8F5]/85 font-sans">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#C29B38]" />
              <span>All-India Insured Delivery (3–7 Days)</span>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-[#C29B38]" />
              <span>7-Day Easy Returns &amp; Exchanges</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C29B38]" />
              <span>GST Compliant • 100% Genuine Handloom</span>
            </div>
          </div>

          {/* Payment Trust Strip via Razorpay */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#1c1c1c] border border-[#333] text-[11px] font-mono text-[#FAF8F5]">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Secure Payments via <strong>Razorpay</strong></span>
            </div>
            {/* Accepted Indian Payment Methods */}
            <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase font-bold text-[#FAF8F5]/90">
              <span className="px-2 py-1 bg-[#1a1a1a] border border-[#333] rounded">UPI</span>
              <span className="px-2 py-1 bg-[#1a1a1a] border border-[#333] rounded">Cards</span>
              <span className="px-2 py-1 bg-[#1a1a1a] border border-[#333] rounded">NetBanking</span>
              <span className="px-2 py-1 bg-[#1a1a1a] border border-[#333] rounded">RuPay</span>
            </div>
          </div>
        </div>

        {/* Bottom Legal Copyright Strip with Required Legal Notice */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-[#FAF8F5]/60">
          <p>
            DEETA FASHION | GST COMPLIANT • ALL-INDIA DELIVERY • &copy; {new Date().getFullYear()} DEETA FASHION. Operative business entity of <strong>Rakhi Chandra</strong>.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/terms-and-conditions" className="hover:text-white transition-colors">
              Terms &amp; Conditions
            </Link>
            <span>•</span>
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/refund-policy" className="hover:text-white transition-colors">
              Refund &amp; Cancellation
            </Link>
            <span>•</span>
            <Link href="/shipping-policy" className="hover:text-white transition-colors">
              Shipping &amp; Delivery
            </Link>
            <span>•</span>
            <Link href="/contact-us" className="hover:text-white transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
