"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Lock, Mail, Phone, CheckCircle, ArrowRight } from "lucide-react";
import { signIn } from "next-auth/react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "login" | "register";
}

export default function AuthModal({ isOpen, onClose, defaultTab = "login" }: AuthModalProps) {
  const [tab, setTab] = useState<"login" | "register">(defaultTab);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Invalid email or password. Please try again.");
      } else {
        setSuccess("Welcome back to Deeta Fashion!");
        setTimeout(() => {
          onClose();
          window.location.reload();
        }, 1200);
      }
    } catch {
      setError("An unexpected error occurred during sign in.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Account created successfully! Logging you in...");
        // Automatically sign in the user
        const loginRes = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });

        if (!loginRes?.error) {
          setTimeout(() => {
            onClose();
            window.location.reload();
          }, 1200);
        } else {
          setTab("login");
        }
      } else {
        setError(data.error || "Failed to create account");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md bg-background border border-[#E5E0D8] p-8 sm:p-10 shadow-2xl z-10 text-primary"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-1 text-muted hover:text-primary transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 stroke-[1.5]" />
            </button>

            {/* Header / Brand */}
            <div className="text-center mb-8">
              <span
                style={{ fontFamily: "var(--font-editorial)" }}
                className="text-3xl tracking-[0.25em] uppercase font-normal block"
              >
                DEETA FASHION
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent mt-1 block">
                Customer Account
              </span>
            </div>

            {/* Tab Switcher */}
            <div className="flex border-b border-[#E5E0D8] mb-6 font-mono text-xs uppercase tracking-wider">
              <button
                type="button"
                onClick={() => {
                  setTab("login");
                  setError(null);
                  setSuccess(null);
                }}
                className={`flex-1 pb-3 text-center transition-colors relative ${
                  tab === "login"
                    ? "text-primary font-medium border-b-2 border-primary"
                    : "text-muted hover:text-primary"
                }`}
              >
                Sign In (लॉग इन)
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab("register");
                  setError(null);
                  setSuccess(null);
                }}
                className={`flex-1 pb-3 text-center transition-colors relative ${
                  tab === "register"
                    ? "text-primary font-medium border-b-2 border-primary"
                    : "text-muted hover:text-primary"
                }`}
              >
                Register (नया खाता)
              </button>
            </div>

            {/* Feedback Messages */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-mono">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>{success}</span>
              </div>
            )}

            {/* Form */}
            {tab === "login" ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-muted mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="aditi@example.com"
                      className="w-full px-3 py-3 bg-surface border border-[#E5E0D8] text-xs font-sans text-primary focus:outline-none focus:border-primary"
                    />
                    <Mail className="w-4 h-4 text-muted absolute right-3 top-3.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-muted mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-3 bg-surface border border-[#E5E0D8] text-xs font-sans text-primary focus:outline-none focus:border-primary"
                    />
                    <Lock className="w-4 h-4 text-muted absolute right-3 top-3.5" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3.5 bg-primary hover:bg-neutral-800 text-background font-mono text-xs uppercase tracking-[0.2em] transition-colors border border-primary flex items-center justify-center gap-2"
                >
                  {loading ? "Signing In..." : "Sign In to Account"}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-muted mb-1">
                    Full Name (पूरा नाम) *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Aditi Sharma"
                      className="w-full px-3 py-3 bg-surface border border-[#E5E0D8] text-xs font-sans text-primary focus:outline-none focus:border-primary"
                    />
                    <User className="w-4 h-4 text-muted absolute right-3 top-3.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-muted mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="aditi@example.com"
                      className="w-full px-3 py-3 bg-surface border border-[#E5E0D8] text-xs font-sans text-primary focus:outline-none focus:border-primary"
                    />
                    <Mail className="w-4 h-4 text-muted absolute right-3 top-3.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-muted mb-1">
                    Mobile Phone (for delivery SMS)
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="9876543210"
                      className="w-full px-3 py-3 bg-surface border border-[#E5E0D8] text-xs font-sans text-primary focus:outline-none focus:border-primary"
                    />
                    <Phone className="w-4 h-4 text-muted absolute right-3 top-3.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-muted mb-1">
                    Password (at least 6 characters) *
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-3 bg-surface border border-[#E5E0D8] text-xs font-sans text-primary focus:outline-none focus:border-primary"
                    />
                    <Lock className="w-4 h-4 text-muted absolute right-3 top-3.5" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3.5 bg-primary hover:bg-neutral-800 text-background font-mono text-xs uppercase tracking-[0.2em] transition-colors border border-primary flex items-center justify-center gap-2"
                >
                  {loading ? "Creating Account..." : "Create Account (खाता बनाएं)"}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}

            <div className="mt-6 text-center text-[10px] font-mono text-muted uppercase tracking-wider">
              <span>Secure 256-Bit SSL Encrypted Account Protection</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
