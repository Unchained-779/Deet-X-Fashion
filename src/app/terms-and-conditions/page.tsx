import StorefrontNavbar from "@/components/StorefrontNavbar";
import { ShieldCheck, Truck, RefreshCw, FileText, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Terms and Conditions | Deeta Fashion",
  description: "Terms of Use, intellectual property, pricing, and governing laws for Deeta Fashion.",
};

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#111] flex flex-col font-sans">
      <StorefrontNavbar />

      <main className="flex-1 max-w-4xl mx-auto px-6 py-24 sm:py-28 w-full">
        <div className="border-b border-[#E5E0D8] pb-6 mb-10">
          <span className="text-[11px] font-mono tracking-[0.25em] text-[#C29B38] uppercase block mb-1">
            Legal &amp; Regulatory Compliance
          </span>
          <h1
            style={{ fontFamily: "var(--font-editorial)" }}
            className="text-4xl sm:text-5xl font-normal text-[#111]"
          >
            Terms &amp; Conditions
          </h1>
          <p className="text-xs font-mono text-slate-500 mt-2">
            Last Updated: October 2026 | Operative for Deeta Fashion (Rakhi Chandra)
          </p>
        </div>

        <div className="space-y-8 text-sm text-slate-700 leading-relaxed font-sans">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 font-serif">1. Introduction &amp; Ownership</h2>
            <p>
              Welcome to <strong>Deeta Fashion</strong> (the &quot;Website&quot;, accessible at deetxfashion.com and related domains). This Website is owned, managed, and operated as a sole proprietorship by <strong>Rakhi Chandra</strong> (operating under the trade name &quot;Deeta Fashion&quot;), with registered operations situated at:
            </p>
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs font-mono font-semibold text-slate-900">
              A-151 , AG Colony , Ashiyana Nagar , Patna - 800025 , Bihar , India
            </div>
            <p>
              By accessing, browsing, or placing an order on this Website, you acknowledge that you have read, understood, and unequivocally agreed to be bound by these Terms and Conditions along with our Privacy Policy, Refund Policy, and Shipping Policy. If you do not accept these terms in full, you must discontinue your use of our platform immediately.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 font-serif">2. Eligibility &amp; Account Security</h2>
            <p>
              Use of the Website is available only to persons who can form legally binding contracts under the Indian Contract Act, 1872. Persons who are &quot;incompetent to contract&quot; within the meaning of the Indian Contract Act, including minors and un-discharged insolvents, are not eligible to use the Website. You are solely responsible for maintaining the confidentiality of your account credentials, login email, and security passwords.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 font-serif">3. Transparent Indian Rupee (INR) Pricing &amp; Taxes</h2>
            <p>
              All prices displayed on Deeta Fashion are strictly denominated in <strong>Indian National Rupees (₹ / INR)</strong>. Prices include all applicable statutory Goods and Services Taxes (GST) as prescribed by the Government of India (typically 5% for textiles/handlooms or 12% for luxury apparel).
            </p>
            <p>
              Prices and availability of products are subject to change without prior notice. While we strive to ensure that all product descriptions, specifications, and prices are accurate, typographical errors may occasionally occur. In the event of a pricing error, Deeta Fashion reserves the right to cancel any orders placed for items listed at an incorrect price.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 font-serif">4. Handloom Variations &amp; Product Representation</h2>
            <p>
              A substantial portion of our catalogue comprises genuine handloom, handblock, and hand-embroidered textiles (e.g. Pure Kanjivaram silk, Banarasi brocade, Lucknowi Chikankari). Subtle irregularities in weave, color density, slub, or threadwork are the natural hallmarks of authentic artisanal craftsmanship and shall not be classified as manufacturing defects.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 font-serif">5. Digital Payments &amp; Payment Gateway Security</h2>
            <p>
              All online credit card, debit card, UPI, and net banking transactions are processed through highly encrypted, PCI-DSS compliant payment gateways facilitated by our payment partner, <strong>Razorpay Software Private Limited</strong>. Deeta Fashion does not store or process your confidential financial credentials (such as CVVs or banking PINs) on its internal servers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 font-serif">6. Intellectual Property Rights</h2>
            <p>
              All content on this Website, including text, photographs, garment designs, product styling, logos, graphics, brand marks, and digital code, is the exclusive intellectual property of <strong>Deeta Fashion / Rakhi Chandra</strong> and is protected under the Indian Copyright Act, 1957, and relevant international conventions. No portion of this site may be reproduced, duplicated, copied, sold, or exploited without our express written consent.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 font-serif">7. Governing Law &amp; Jurisdiction</h2>
            <p>
              These Terms and Conditions and all transactions conducted through the Website shall be construed and governed in accordance with the substantive laws of the Republic of India. Any disputes arising directly or indirectly from transactions on this Website shall be subject to the exclusive jurisdiction of the competent courts in <strong>Patna, Bihar, India</strong>.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
