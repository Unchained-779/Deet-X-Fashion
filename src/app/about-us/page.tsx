import StorefrontNavbar from "@/components/StorefrontNavbar";
import Link from "next/link";
import { Sparkles, ArrowRight, Heart, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "About Us | The Deeta Fashion Story",
  description: "Handcrafted heritage, pure silks, and artisanal integrity founded by Rakhi Chandra.",
};

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#111] flex flex-col font-sans">
      <StorefrontNavbar />

      <main className="flex-1 max-w-4xl mx-auto px-6 py-24 sm:py-28 w-full">
        <div className="border-b border-[#E5E0D8] pb-6 mb-10 text-center sm:text-left">
          <span className="text-[11px] font-mono tracking-[0.25em] text-[#C29B38] uppercase block mb-1">
            Our Provenance &amp; Passion
          </span>
          <h1
            style={{ fontFamily: "var(--font-editorial)" }}
            className="text-4xl sm:text-6xl font-normal text-[#111]"
          >
            The Deeta Fashion Story
          </h1>
          <p className="text-sm text-slate-600 mt-2 font-serif italic max-w-xl">
            &quot;True luxury in clothing is not in fast-produced uniformity, but in the patience of the loom and the memory of the weaver.&quot;
          </p>
        </div>

        <div className="space-y-10 text-sm text-slate-700 leading-relaxed font-sans">
          <section className="space-y-4">
            <h2 className="text-2xl font-normal text-slate-900 font-serif">A Legacy Born in the Fabric Heartlands</h2>
            <p>
              Founded under the leadership of <strong>Rakhi Chandra</strong>, <strong>Deeta Fashion</strong> was envisioned with a single profound conviction: that India&apos;s extraordinary textile heritage belongs on the modern stage, uncompromised by synthetic blends and mass-market shortcuts.
            </p>
            <p>
              Operating from our registered studio at <strong>A-151, AG Colony, Ashiyana Nagar, Patna - 800025, Bihar, India</strong>, Deeta Fashion has evolved into an omnichannel house of authentic Indian ethnic craftsmanship. From bridal trousseaus to featherlight everyday handblocks, each piece in our atelier is a tribute to generational artisans across Varanasi, Kanchipuram, Chanderi, and Jaipur.
            </p>
          </section>

          <section className="p-8 bg-white border border-[#E5E0D8] rounded-2xl shadow-sm space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-[#C29B38] font-bold">
              Our 3 Guiding Pillars
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600 pt-2">
              <div className="space-y-1.5">
                <p className="text-base font-bold text-slate-900 font-serif">1. 100% Pure Natural Weaves</p>
                <p>We source certified pure mulberry silks, unadulterated cotton mulmul, and European flax linen. No cheap polyester blends, ever.</p>
              </div>
              <div className="space-y-1.5">
                <p className="text-base font-bold text-slate-900 font-serif">2. Direct Karigar Fair Value</p>
                <p>We partner directly with handloom weaver co-operatives, ensuring fair living wages for the master artisans who preserve these ancient techniques.</p>
              </div>
              <div className="space-y-1.5">
                <p className="text-base font-bold text-slate-900 font-serif">3. Transparent Indian Commerce</p>
                <p>Strictly compliant with Indian e-commerce standards, GST invoicing, secure Razorpay payments, and dependable door-to-door delivery.</p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-normal text-slate-900 font-serif">Our Commitment to You</h2>
            <p>
              When you wear a Deeta Fashion piece, you wear months of skilled labor, genuine metallic zari, hand-carved teak block prints, and timeless silhouettes engineered to be passed down as family heirlooms. We welcome you to experience the tactile difference of authentic Indian handlooms.
            </p>
          </section>

          <div className="pt-6 border-t border-[#E5E0D8] flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <p className="font-bold text-slate-900 font-serif text-base">Rakhi Chandra</p>
              <p className="text-xs font-mono text-slate-500">Founder &amp; Proprietor, Deeta Fashion</p>
            </div>
            <Link
              href="/#catalog"
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs uppercase tracking-wider font-bold rounded-xl flex items-center gap-2 transition-colors"
            >
              <span>Explore Curated Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
