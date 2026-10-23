"use client";

import { useState } from "react";
import { Star, Quote, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";

const REVIEWS = [
  {
    name: "Sunita Aggarwal",
    city: "New Delhi",
    garment: "Royal Maroon Kanjivaram Pure Silk Saree",
    rating: 5,
    date: "Festive Season 2026",
    comment:
      "The zari work on the pallu is breathtaking. You can instantly feel the genuine weight and purity of the mulberry silk. Received endless compliments at my daughter's reception!",
  },
  {
    name: "Dr. Ananya Sen",
    city: "Kolkata",
    garment: "Awadhi Chikankari Hand-Embroidered Lehenga",
    rating: 5,
    date: "Durga Puja 2026",
    comment:
      "Ordered this online with slight hesitation, but Deeta Fashion exceeded every expectation. The delicate mukaish work and pure georgette fall were perfection. Safe Razorpay checkout too.",
  },
  {
    name: "Vikramaditya Rathore",
    city: "Jaipur",
    garment: "Rajputana Raw Silk Embroidered Men's Kurta",
    rating: 5,
    date: "Diwali 2026",
    comment:
      "Superb tailoring and structure. The natural raw tussar silk texture breathes well and feels extremely regal. Dispatch was done within 24 hours.",
  },
  {
    name: "Meenakshi Iyer",
    city: "Bengaluru",
    garment: "Noor Organza Banarasi Tissue Silk Saree",
    rating: 5,
    date: "Wedding Guest 2026",
    comment:
      "Featherlight yet shimmering beautifully under evening lights. The museum-grade archival packaging kept the saree immaculate. Truly Sabyasachi-tier aesthetic at honest Indian pricing.",
  },
];

export default function CustomerStoriesCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () => {
    setCurrentIndex((curr) => (curr === 0 ? REVIEWS.length - 1 : curr - 1));
  };

  const next = () => {
    setCurrentIndex((curr) => (curr === REVIEWS.length - 1 ? 0 : curr + 1));
  };

  const current = REVIEWS[currentIndex];

  return (
    <section className="py-20 px-6 sm:px-8 max-w-7xl mx-auto w-full font-sans">
      <div className="flex flex-col sm:flex-row justify-between sm:items-end pb-8 mb-10 border-b border-[#E5E0D8] gap-4">
        <div>
          <span className="text-[11px] font-mono tracking-[0.25em] text-[#C29B38] uppercase block mb-1">
            Verified Patron Testimonials
          </span>
          <h2
            style={{ fontFamily: "var(--font-editorial)" }}
            className="text-3xl sm:text-5xl font-normal text-primary tracking-tight"
          >
            Customer Stories
          </h2>
        </div>

        {/* Carousel Arrow Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous review"
            className="w-10 h-10 rounded-full border border-[#E5E0D8] bg-white hover:bg-slate-100 flex items-center justify-center text-slate-800 transition-colors shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next review"
            className="w-10 h-10 rounded-full border border-[#E5E0D8] bg-white hover:bg-slate-100 flex items-center justify-center text-slate-800 transition-colors shadow-sm"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Featured Testimonial Spotlight Card */}
      <div className="bg-white border border-[#E5E0D8] p-8 sm:p-12 rounded-none relative overflow-hidden shadow-sm">
        <div className="max-w-3xl space-y-6">
          {/* Star Rating */}
          <div className="flex items-center gap-1 text-amber-500">
            {[...Array(current.rating)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
            <span className="ml-2 font-mono text-xs text-slate-400 font-semibold">
              5.0 Verified Purchase
            </span>
          </div>

          {/* Quote text */}
          <p
            style={{ fontFamily: "var(--font-editorial)" }}
            className="text-2xl sm:text-3xl md:text-4xl font-normal text-slate-900 leading-snug italic"
          >
            &quot;{current.comment}&quot;
          </p>

          {/* Patron Credentials */}
          <div className="pt-4 border-t border-[#E5E0D8] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
            <div>
              <p className="font-bold text-slate-900 text-sm font-sans flex items-center gap-1.5">
                <span>{current.name}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              </p>
              <p className="text-slate-500">{current.city}, India</p>
            </div>
            <div className="text-slate-400 sm:text-right">
              <span className="text-amber-800 font-semibold">{current.garment}</span>
              <p className="text-[10px] text-slate-400">{current.date}</p>
            </div>
          </div>
        </div>

        {/* Subtle Watermark Quote Mark */}
        <Quote className="absolute right-6 bottom-6 w-28 h-28 text-slate-100 -rotate-12 pointer-events-none" />
      </div>
    </section>
  );
}
