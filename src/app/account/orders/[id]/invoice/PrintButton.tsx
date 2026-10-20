"use client";

import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 px-4 py-2 bg-[#111111] text-[#FAF8F5] text-xs font-mono uppercase tracking-wider hover:bg-[#333333] transition-colors shadow-sm"
    >
      <Printer className="w-3.5 h-3.5" />
      <span>Print / Save PDF</span>
    </button>
  );
}
