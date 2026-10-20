"use client";

import { useCartStore } from "@/store/useCartStore";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

const FREE_SHIPPING_THRESHOLD = 1999;

export default function CartDrawer() {
  const { items, isDrawerOpen, closeDrawer, removeItem, updateQuantity, totalPrice } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentTotal = totalPrice();
  const progressPercent = Math.min((currentTotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remainingForFreeShipping = Math.max(FREE_SHIPPING_THRESHOLD - currentTotal, 0);

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeDrawer}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-8 sm:pl-10">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="w-screen max-w-md bg-background border-l border-[#E5E0D8] text-primary flex flex-col justify-between shadow-2xl"
            >
              {/* Header */}
              <div>
                <div className="p-6 border-b border-[#E5E0D8] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="w-4 h-4 stroke-[1.5]" />
                    <h2
                      style={{ fontFamily: "var(--font-editorial)" }}
                      className="text-2xl font-normal tracking-tight"
                    >
                      Shopping Bag
                    </h2>
                    <span className="text-[11px] font-mono tracking-widest text-muted">
                      ({items.reduce((acc, i) => acc + i.quantity, 0)})
                    </span>
                  </div>
                  <button
                    onClick={closeDrawer}
                    className="p-1.5 text-muted hover:text-primary transition-colors"
                    aria-label="Close bag"
                  >
                    <X className="w-5 h-5 stroke-[1.5]" />
                  </button>
                </div>

                {/* Dynamic Free Shipping Progress Bar */}
                <div className="px-6 py-3.5 bg-surface border-b border-[#E5E0D8]">
                  <div className="flex items-center justify-between text-[11px] font-mono tracking-wider mb-2">
                    {remainingForFreeShipping === 0 ? (
                      <span className="text-accent flex items-center gap-1.5 font-medium">
                        <Sparkles className="w-3.5 h-3.5" />
                        COMPLIMENTARY EXPRESS SHIPPING UNLOCKED
                      </span>
                    ) : (
                      <span className="text-muted">
                        Add <span className="text-primary font-medium">₹{remainingForFreeShipping.toLocaleString("en-IN")}</span> more for Free Shipping
                      </span>
                    )}
                    <span className="text-muted">{Math.round(progressPercent)}%</span>
                  </div>
                  <div className="w-full h-1 bg-[#E5E0D8] overflow-hidden">
                    <motion.div
                      className="h-full bg-accent"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-muted">
                    <ShoppingBag className="w-10 h-10 stroke-1 mb-4 text-[#E5E0D8]" />
                    <p
                      style={{ fontFamily: "var(--font-editorial)" }}
                      className="text-2xl text-primary font-normal"
                    >
                      Your bag is empty
                    </p>
                    <p className="text-xs mt-2 text-muted max-w-xs font-sans leading-relaxed">
                      Discover heirloom handlooms and contemporary tailoring in our archival collections.
                    </p>
                  </div>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.variantId}
                      className="flex gap-4 p-4 bg-surface border border-[#E5E0D8] rounded-none"
                    >
                      <div className="w-20 aspect-[3/4] bg-stone-200 overflow-hidden relative flex-shrink-0 border border-[#E5E0D8]">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover object-top"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] font-mono text-muted">
                            DEET-X
                          </div>
                        )}
                      </div>

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <h3
                              style={{ fontFamily: "var(--font-editorial)" }}
                              className="text-lg font-normal text-primary line-clamp-1"
                            >
                              {item.title}
                            </h3>
                            <button
                              onClick={() => removeItem(item.variantId)}
                              className="text-muted hover:text-primary p-0.5"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-[11px] font-mono text-muted mt-1 uppercase tracking-wider">
                            Size: {item.size} • {item.colorName}
                          </p>
                        </div>

                        <div className="flex justify-between items-center mt-3 pt-3 border-t border-[#E5E0D8]">
                          {/* Sharp Quantity Controller */}
                          <div className="flex items-center border border-[#E5E0D8] bg-background">
                            <button
                              onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                              className="p-1 hover:bg-surface text-primary transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2.5 font-mono text-xs">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                              disabled={item.quantity >= item.maxStock}
                              className="p-1 hover:bg-surface text-primary disabled:opacity-30 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="text-right">
                            <span className="font-mono text-sm font-medium text-primary">
                              ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer / Checkout */}
              {items.length > 0 && (
                <div className="p-6 border-t border-[#E5E0D8] bg-background space-y-4">
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-muted font-sans">
                      <span>Subtotal</span>
                      <span className="font-mono text-sm font-medium text-primary">
                        ₹{currentTotal.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex justify-between text-muted text-[11px] font-mono">
                      <span>Express Courier</span>
                      <span className={remainingForFreeShipping === 0 ? "text-accent uppercase" : "text-primary"}>
                        {remainingForFreeShipping === 0 ? "Complimentary" : "₹99"}
                      </span>
                    </div>
                  </div>

                  <Link
                    href="/checkout"
                    onClick={closeDrawer}
                    className="w-full flex items-center justify-center gap-3 bg-primary hover:bg-[#252525] text-background font-mono text-xs uppercase tracking-[0.2em] py-4 rounded-none transition-colors border border-primary group"
                  >
                    <span>PROCEED TO SECURE CHECKOUT (UPI / CARDS)</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>

                  <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-muted uppercase tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                    <span>256-Bit Encrypted Razorpay Integration</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
