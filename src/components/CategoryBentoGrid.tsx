"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Sparkles } from "lucide-react";

const BENTO_CARDS = [
  {
    title: "Handpicked Silk Sarees",
    hindi: "शुद्ध रेशमी साड़ियां",
    subtitle: "Pure Kanjivaram, Banarasi Zari, & Chanderi Weaves",
    tag: "Artisanal Silks",
    href: "/?category=sarees#catalog",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop",
    colSpan: "lg:col-span-7",
    rowSpan: "lg:row-span-2",
  },
  {
    title: "Festive Ethnic Suits",
    hindi: "उत्सव अनारकली और सूट",
    subtitle: "Floor-sweeping Anarkalis, Shararas, & Chikankari sets",
    tag: "Celebration Wear",
    href: "/?category=festive-wear#catalog",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1200&auto=format&fit=crop",
    colSpan: "lg:col-span-5",
    rowSpan: "lg:row-span-1",
  },
  {
    title: "Men's Royal Ethnic",
    hindi: "शाही कुर्ता और शेरवानी",
    subtitle: "Raw Tussar silk kurtas, bandhgalas, & Nehru jackets",
    tag: "Heritage Gents",
    href: "/?category=men#catalog",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop",
    colSpan: "lg:col-span-5",
    rowSpan: "lg:row-span-1",
  },
  {
    title: "Modern Western Structure",
    hindi: "आधुनिक वेस्टर्न परिधान",
    subtitle: "100% pure European linen dresses, shirts, & tailored co-ords",
    tag: "Everyday Luxury",
    href: "/?category=western#catalog",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop",
    colSpan: "lg:col-span-12",
    rowSpan: "lg:row-span-1",
  },
];

export default function CategoryBentoGrid() {
  return (
    <section className="py-20 px-6 sm:px-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row justify-between sm:items-end pb-8 mb-10 border-b border-[#E5E0D8] gap-4">
        <div>
          <span className="text-[11px] font-mono tracking-[0.25em] text-[#C29B38] uppercase block mb-1">
            Curated Department Portfolios
          </span>
          <h2
            style={{ fontFamily: "var(--font-editorial)" }}
            className="text-3xl sm:text-5xl font-normal text-primary tracking-tight"
          >
            Curated Category Bento
          </h2>
        </div>
        <p className="text-xs font-mono text-muted max-w-xs leading-relaxed">
          Explore iconic silhouettes engineered with pure organic fibers and generational Karigari.
        </p>
      </div>

      {/* Responsive Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {BENTO_CARDS.map((card, idx) => (
          <Link
            key={idx}
            href={card.href}
            className={`group relative overflow-hidden bg-surface border border-[#E5E0D8] transition-all duration-700 hover:border-primary flex flex-col justify-end p-6 sm:p-8 min-h-[380px] ${card.colSpan} ${card.rowSpan}`}
          >
            {/* Background Zoom Image */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-full object-cover object-top transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10 group-hover:via-black/25 transition-colors duration-500" />
            </div>

            {/* Floating Top Tag */}
            <div className="absolute top-6 left-6 z-10">
              <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-[#FAF8F5] text-[10px] font-mono uppercase tracking-widest border border-white/20">
                {card.tag}
              </span>
            </div>

            {/* Hover Floating Arrow */}
            <div className="absolute top-6 right-6 z-10 w-9 h-9 rounded-full bg-white text-[#111] flex items-center justify-center opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-md">
              <ArrowUpRight className="w-4 h-4" />
            </div>

            {/* Bottom Content Area */}
            <div className="relative z-10 text-white space-y-2">
              <div className="flex items-center gap-2 text-[11px] font-mono text-[#E5C158]">
                <span>{card.hindi}</span>
              </div>
              <h3
                style={{ fontFamily: "var(--font-editorial)" }}
                className="text-2xl sm:text-3xl font-normal text-white group-hover:text-amber-200 transition-colors"
              >
                {card.title}
              </h3>
              <p className="text-xs text-white/75 font-sans leading-relaxed max-w-md">
                {card.subtitle}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
