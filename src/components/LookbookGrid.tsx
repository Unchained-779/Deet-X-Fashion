"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface LookbookCategory {
  title: string;
  subtitle: string;
  tag: string;
  href: string;
  imageUrl: string;
  colSpan: string;
}

const CATEGORIES: LookbookCategory[] = [
  {
    title: "Women Ethnic",
    subtitle: "Raw tussar silk, hand-stitched zardozi borders, and drape-cut lehengas.",
    tag: "COLLECTION 01",
    href: "/?category=ethnic",
    imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop",
    colSpan: "col-span-12 lg:col-span-7",
  },
  {
    title: "Men Western",
    subtitle: "Unstructured Italian wool blazers, relaxed linen trousers, and modern trench coats.",
    tag: "COLLECTION 02",
    href: "/?category=men",
    imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop",
    colSpan: "col-span-12 lg:col-span-5",
  },
  {
    title: "Bridal / Festive",
    subtitle: "Deep vermilion handlooms, zari brocades, and ceremonial heirloom pieces.",
    tag: "ATELIER COUTURE",
    href: "/?category=bridal",
    imageUrl: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1200&auto=format&fit=crop",
    colSpan: "col-span-12 lg:col-span-5",
  },
  {
    title: "Ready-to-Wear",
    subtitle: "Effortless everyday silhouettes tailored from hand-spun organic cottons.",
    tag: "EVERYDAY LUXURY",
    href: "/?category=western",
    imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop",
    colSpan: "col-span-12 lg:col-span-7",
  },
];

export default function LookbookGrid() {
  return (
    <section id="lookbook" className="py-24 px-6 sm:px-8 max-w-7xl mx-auto w-full">
      {/* Editorial Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-[#E5E0D8] gap-6">
        <div>
          <span className="text-[11px] font-mono tracking-[0.25em] text-accent uppercase block mb-2">
            Vol. IV — Archival Lookbook
          </span>
          <h2
            style={{ fontFamily: "var(--font-editorial)" }}
            className="text-4xl sm:text-6xl font-normal tracking-tight text-primary"
          >
            Curated Categories
          </h2>
        </div>
        <p className="text-xs text-muted max-w-md font-sans leading-relaxed tracking-wide">
          An intentional study in tactile minimalism. Handwoven textiles paired with sharp, uncompromising geometry.
        </p>
      </div>

      {/* 12-Column Asymmetric Bento Grid */}
      <div className="grid grid-cols-12 gap-8 lg:gap-10">
        {CATEGORIES.map((cat, idx) => (
          <Link
            key={cat.title}
            href={cat.href}
            className={`${cat.colSpan} group block focus:outline-none`}
          >
            <div className="relative border border-[#E5E0D8] bg-surface rounded-none overflow-hidden flex flex-col justify-between">
              {/* Image Container with 3:4 Portrait Ratio & Framer Motion Scale */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-200">
                <motion.img
                  src={cat.imageUrl}
                  alt={cat.title}
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full h-full object-cover object-top will-change-transform"
                />

                {/* Subtle scrim overlay */}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />

                {/* SKU / Tag Indicator in JetBrains Mono */}
                <div className="absolute top-4 left-4">
                  <span className="font-mono text-[10px] tracking-[0.2em] bg-background/90 backdrop-blur-sm text-primary px-3 py-1 border border-[#E5E0D8]">
                    {cat.tag}
                  </span>
                </div>

                {/* Expand Hover Icon */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="w-8 h-8 flex items-center justify-center bg-white text-primary border border-[#E5E0D8]">
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>
              </div>

              {/* Editorial Card Footer */}
              <div className="p-6 bg-background border-t border-[#E5E0D8] flex flex-col justify-between">
                <div className="flex items-baseline justify-between">
                  <h3
                    style={{ fontFamily: "var(--font-editorial)" }}
                    className="text-2xl sm:text-3xl font-medium tracking-tight text-primary group-hover:text-accent transition-colors duration-300"
                  >
                    {cat.title}
                  </h3>
                  <span className="font-mono text-[11px] text-muted tracking-widest uppercase">
                    0{idx + 1}
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted leading-relaxed font-sans line-clamp-2">
                  {cat.subtitle}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
