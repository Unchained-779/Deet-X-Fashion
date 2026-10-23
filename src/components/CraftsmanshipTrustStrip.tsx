import { Sparkles, Scissors, Truck, ShieldCheck } from "lucide-react";

const TRUST_PILLARS = [
  {
    icon: Sparkles,
    title: "Authentic Handloom & Pure Fabrics",
    desc: "100% certified pure mulberry silks, handspun khadi, and European linens with zero synthetic adulteration.",
  },
  {
    icon: Scissors,
    title: "Tailored Fit & Blouse Service",
    desc: "Every festive piece includes custom sizing adjustments and unstitched matching blouse yardage.",
  },
  {
    icon: Truck,
    title: "Express Insured Delivery",
    desc: "24–48 hour dispatch with premier air courier tracking to 19,000+ PIN codes across India.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Razorpay Checkout",
    desc: "Bank-grade 256-bit SSL encryption supporting instant UPI, credit/debit cards, and transparent COD.",
  },
];

export default function CraftsmanshipTrustStrip() {
  return (
    <section className="border-y border-[#E5E0D8] bg-[#FAF8F5] py-12 px-6 sm:px-8 w-full font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
        {TRUST_PILLARS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-start gap-4 group">
              <div className="w-10 h-10 rounded-full bg-white border border-[#E5E0D8] flex items-center justify-center text-[#C29B38] shrink-0 group-hover:scale-105 group-hover:border-[#C29B38] transition-all shadow-sm">
                <Icon className="w-4 h-4 stroke-[1.5]" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs uppercase font-mono tracking-wider font-bold text-slate-900">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
