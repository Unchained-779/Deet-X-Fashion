"use client";

import { motion } from "framer-motion";
import { ArrowDownRight } from "lucide-react";

export default function EditorialHero() {
  return (
    <section className="relative w-full h-[100dvh] overflow-hidden bg-black text-white">
      {/* Background HTML5 Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        poster="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-75"
      >
        {/* High performance runway / editorial video source */}
        <source
          src="https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-runway-show-41846-large.mp4"
          type="video/mp4"
        />
      </video>

      {/* Subtle Editorial Vignette & Bottom Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/30 pointer-events-none" />

      {/* Hero Bottom-Left Content */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-6 sm:px-8 flex flex-col justify-end pb-16 sm:pb-20">
        <div className="max-w-4xl space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black/85 backdrop-blur-md border border-[#E5C158] text-[#FDF8E2] text-xs uppercase tracking-[0.25em] font-mono shadow-[0_4px_20px_rgba(0,0,0,0.8)] w-fit"
          >
            <span className="w-2 h-2 rounded-full bg-[#E5C158] animate-pulse shadow-[0_0_8px_#E5C158]" />
            <span className="font-bold text-[#FDF8E2] drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">— AUTUMN / FESTIVE CHAPTER 2026</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontFamily: "var(--font-editorial)" }}
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-normal tracking-[-0.03em] leading-[0.92] text-white"
          >
            The Poetry of <br />
            <span className="italic font-light">Structure & Silk.</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="pt-4 flex flex-col sm:flex-row sm:items-center gap-6"
          >
            {/* Magnetic Hover CTA Button */}
            <motion.a
              href="#lookbook"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center justify-between gap-6 px-7 py-4 bg-white text-[#111111] text-xs font-semibold uppercase tracking-[0.2em] rounded-none hover:bg-surface border border-white transition-colors duration-300 w-fit group"
            >
              <span>EXPLORE COLLECTION</span>
              <ArrowDownRight className="w-4 h-4 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1 group-hover:translate-y-1" />
            </motion.a>

            <p className="text-xs text-white/70 tracking-wide font-sans max-w-xs leading-relaxed">
              Handpicked silk sarees, designer ethnic suits, and modern casuals made for every celebration.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
