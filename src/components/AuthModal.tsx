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

            {/* Google Authentication Option (One-Click) */}
            <div className="mb-6">
              <button
                type="button"
                onClick={() => signIn("google", { callbackUrl: "/" })}
                className="w-full py-3 px-4 bg-white border border-[#E5E0D8] hover:border-primary text-primary text-xs font-mono tracking-wider flex items-center justify-center gap-3 transition-colors duration-300 group shadow-sm"
              >
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>{tab === "login" ? "Continue with Google (गूगल से लॉग इन)" : "Sign Up with Google (गूगल से खाता बनाएं)"}</span>
              </button>

              {/* Editorial Divider */}
              <div className="relative my-6 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E5E0D8]" />
                </div>
                <span className="relative bg-background px-4 text-[10px] font-mono text-muted uppercase tracking-widest">
                  or with email (या ईमेल द्वारा)
                </span>
              </div>
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
