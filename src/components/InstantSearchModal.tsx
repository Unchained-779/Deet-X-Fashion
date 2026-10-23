"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, X, Sparkles, ArrowRight, Loader2, IndianRupee } from "lucide-react";

interface SearchProduct {
  id: string;
  title: string;
  slug: string;
  basePrice: number;
  imageUrl: string | null;
  category?: { name: string } | null;
}

interface InstantSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TRENDING_SEARCHES = [
  "Banarasi Silk Saree",
  "Festive Kurta Set",
  "Linen Shirts",
  "Kanjivaram Silk",
  "Anarkali Suit",
  "Chikankari Lehenga",
];

export default function InstantSearchModal({ isOpen, onClose }: InstantSearchModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      if (searchTerm.trim().length >= 2) {
        setLoading(true);
        try {
          const res = await fetch(`/api/products?q=${encodeURIComponent(searchTerm.trim())}`);
          const data = await res.json();
          if (res.ok && data.products) {
            setResults(data.products);
          }
        } catch (err) {
          console.error("Search fetch error:", err);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchTerm, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-start justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white border border-[#E5E0D8] rounded-2xl shadow-2xl overflow-hidden mt-12 sm:mt-16 text-slate-900 font-sans">
        {/* Search Input Bar */}
        <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-amber-600 shrink-0" />
          <input
            autoFocus
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search sarees, suits, kurtas, linen dresses..."
            className="w-full text-base sm:text-lg font-serif placeholder:font-sans placeholder-slate-400 focus:outline-none text-slate-900 bg-transparent"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="p-1 text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-mono font-bold uppercase rounded bg-slate-100 hover:bg-slate-200 text-slate-600"
          >
            ESC
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto">
          {/* Trending Searches Pills when query is empty */}
          {searchTerm.trim().length < 2 && (
            <div className="space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C29B38] font-bold block">
                Trending Searches in Deeta Atelier
              </span>
              <div className="flex flex-wrap gap-2">
                {TRENDING_SEARCHES.map((query) => (
                  <button
                    key={query}
                    onClick={() => setSearchTerm(query)}
                    className="px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-mono text-slate-700 flex items-center gap-1.5 transition-colors"
                  >
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>{query}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading Indicator */}
          {loading && (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400 text-xs font-mono space-y-2">
              <Loader2 className="w-6 h-6 animate-spin text-amber-600" />
              <span>Searching handcrafted inventory...</span>
            </div>
          )}

          {/* Search Results Preview List */}
          {!loading && results.length > 0 && (
            <div className="space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                Found {results.length} Handcrafted Garments
              </span>
              <div className="divide-y divide-slate-100">
                {results.map((p) => (
                  <Link
                    key={p.id}
                    href={`/products/${p.slug}`}
                    onClick={onClose}
                    className="py-3 flex items-center gap-4 hover:bg-slate-50 -mx-2 px-2 rounded-xl transition-colors group"
                  >
                    <div className="w-14 h-18 aspect-[3/4] bg-slate-100 overflow-hidden rounded-lg shrink-0 border border-slate-200">
                      {p.imageUrl ? (
                        <img
                          src={p.imageUrl}
                          alt={p.title}
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[9px] font-mono text-slate-400">
                          DEETA
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-amber-700 font-semibold block">
                        {p.category?.name || "Handcrafted Edition"}
                      </span>
                      <h4 className="text-sm font-semibold text-slate-900 group-hover:text-amber-800 transition-colors truncate font-sans">
                        {p.title}
                      </h4>
                      <p className="font-mono text-xs font-bold text-slate-900 mt-0.5">
                        ₹{p.basePrice.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-all shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* No results message */}
          {!loading && searchTerm.trim().length >= 2 && results.length === 0 && (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <p className="font-serif text-lg text-slate-700">No matching garments found</p>
              <p className="text-xs font-sans">
                Try searching for broader keywords like &quot;Silk&quot;, &quot;Saree&quot;, &quot;Kurti&quot;, or &quot;Linen&quot;.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-[10px] font-mono text-slate-400">
          Showing real-time authenticated catalogue from Deeta Fashion
        </div>
      </div>
    </div>
  );
}
