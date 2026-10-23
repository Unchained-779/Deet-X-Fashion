"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, KeyRound, Sparkles, ArrowRight, UserCheck } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleBypass = async (pinValue: string) => {
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/api/admin/bypass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "pin", pin: pinValue }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatus("Access unlocked! Redirecting to Admin Studio...");
        setTimeout(() => {
          router.push("/admin");
          router.refresh();
        }, 500);
      } else {
        setStatus(data.error || "Incorrect PIN");
      }
    } catch (e: any) {
      setStatus("Failed to connect to auth service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-serif tracking-wide text-white">
              Deeta Fashion <span className="text-amber-400 text-sm font-mono">Studio</span>
            </h1>
            <p className="text-xs text-slate-400">Inventory & Store Management Access</p>
          </div>
        </div>

        <p className="text-sm text-slate-300 mb-6 leading-relaxed">
          Unlock full administrative access to upload clothing, seed realistic luxury catalog pieces, and manage storefront inventory.
        </p>

        {/* Quick Dev Switcher Buttons */}
        <div className="mb-6 space-y-2">
          <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
            Quick 1-Click Dev Unlock
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleBypass("1234")}
              disabled={loading}
              className="py-2.5 px-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-all text-amber-300"
            >
              <KeyRound className="w-3.5 h-3.5" />
              PIN: 1234
            </button>
            <button
              type="button"
              onClick={() => handleBypass("vivek")}
              disabled={loading}
              className="py-2.5 px-3 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 rounded-xl text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-all text-amber-300"
            >
              <UserCheck className="w-3.5 h-3.5" />
              Owner Vivek
            </button>
          </div>
        </div>

        {/* Manual PIN input form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (pin) handleBypass(pin);
          }}
          className="space-y-4"
        >
          <div>
            <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
              Enter Admin Security PIN
            </label>
            <div className="relative">
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="e.g. 1234"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 font-mono focus:outline-none focus:border-amber-400 transition-colors"
              />
              <button
                type="submit"
                disabled={loading || !pin}
                className="absolute right-2 top-2 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs font-mono flex items-center gap-1 transition-all disabled:opacity-50"
              >
                <span>Unlock</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </form>

        {status && (
          <div
            className={`mt-4 p-3 rounded-xl text-xs font-mono ${
              status.includes("Access unlocked")
                ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300"
                : "bg-rose-500/20 border border-rose-500/40 text-rose-300"
            }`}
          >
            {status}
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400 font-mono">
          <Link href="/" className="hover:text-white transition-colors">
            ← Return to Storefront
          </Link>
          <span className="text-slate-500">Deeta Studio v2.0</span>
        </div>
      </div>
    </div>
  );
}
