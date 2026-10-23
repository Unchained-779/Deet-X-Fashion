import StorefrontNavbar from "@/components/StorefrontNavbar";
import { RefreshCw, CheckCircle2, Clock, AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Return, Refund & Cancellation Policy | Deeta Fashion",
  description: "7-day return policy, 24-hour cancellation, and 5-7 business day refund timeline at Deeta Fashion.",
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#111] flex flex-col font-sans">
      <StorefrontNavbar />

      <main className="flex-1 max-w-4xl mx-auto px-6 py-24 sm:py-28 w-full">
        <div className="border-b border-[#E5E0D8] pb-6 mb-10">
          <span className="text-[11px] font-mono tracking-[0.25em] text-[#C29B38] uppercase block mb-1">
            Consumer Satisfaction Guarantee
          </span>
          <h1
            style={{ fontFamily: "var(--font-editorial)" }}
            className="text-4xl sm:text-5xl font-normal text-[#111]"
          >
            Refund, Return &amp; Cancellation Policy
          </h1>
          <p className="text-xs font-mono text-slate-500 mt-2">
            Clear, Transparent Guidelines for Deeta Fashion Shoppers (Rakhi Chandra)
          </p>
        </div>

        {/* Quick Highlights Summary Box */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="p-4 bg-white border border-[#E5E0D8] rounded-xl space-y-1">
            <span className="text-xs font-mono uppercase tracking-wider text-[#C29B38] font-bold block">
              Return Window
            </span>
            <p className="text-xl font-bold text-slate-900 font-serif">7 Days</p>
            <p className="text-xs text-slate-500 leading-snug">
              From the exact date of package delivery to your doorstep.
            </p>
          </div>

          <div className="p-4 bg-white border border-[#E5E0D8] rounded-xl space-y-1">
            <span className="text-xs font-mono uppercase tracking-wider text-[#C29B38] font-bold block">
              Order Cancellation
            </span>
            <p className="text-xl font-bold text-slate-900 font-serif">Within 24 Hours</p>
            <p className="text-xs text-slate-500 leading-snug">
              Full 100% instant refund before order dispatch.
            </p>
          </div>

          <div className="p-4 bg-white border border-[#E5E0D8] rounded-xl space-y-1">
            <span className="text-xs font-mono uppercase tracking-wider text-[#C29B38] font-bold block">
              Refund Timeline
            </span>
            <p className="text-xl font-bold text-slate-900 font-serif">5–7 Business Days</p>
            <p className="text-xs text-slate-500 leading-snug">
              Processed directly back to your original payment method.
            </p>
          </div>
        </div>

        <div className="space-y-8 text-sm text-slate-700 leading-relaxed font-sans">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 font-serif">1. 7-Day Hassle-Free Returns &amp; Exchanges</h2>
            <p>
              At Deeta Fashion, we want you to cherish every handcrafted drape you receive. If you are not fully satisfied with your purchase, you may initiate a return or size exchange request within <strong>7 calendar days</strong> from the date of confirmed delivery.
            </p>
            <p>To be eligible for an authorized return or exchange, the garment must satisfy the following conditions:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
              <li>Item must be <strong>unworn, unwashed, and undamaged</strong>, free from any perfume, cosmetics, or alterations.</li>
              <li>Must retain all <strong>original brand tags, security ribbons, and packaging intact</strong>.</li>
              <li>Sarees with unstitched blouse pieces must have the blouse fabric intact and unsevered.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 font-serif">2. Order Cancellation Policy</h2>
            <p>
              Customers can request order cancellation within <strong>24 hours</strong> of placing an order on our website, provided the shipment has not already been handed over to our courier partner.
            </p>
            <p>
              Once cancelled within the stipulated 24-hour window, the entire order amount (including any applicable shipping fees) will be reimbursed in full without any deduction.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 font-serif">3. Explicit Refund Settlement Timeline (5–7 Business Days)</h2>
            <p>
              Upon receiving your returned parcel at our central fulfillment hub (A-151, AG Colony, Ashiyana Nagar, Patna - 800025, Bihar, India), our quality control team inspects the garment within 48 hours to ensure compliance with our return guidelines.
            </p>
            <div className="p-5 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-2">
              <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-amber-900">
                Mandatory Razorpay &amp; Banking Settlement Notice:
              </h3>
              <p className="text-xs text-slate-800 leading-relaxed">
                Once a refund is approved by our team, it is initiated immediately through <strong>Razorpay</strong> and will reflect in your bank account, credit/debit card, or original UPI handle within <strong>5 to 7 business days</strong>, depending on your issuing bank&apos;s settlement cycle.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 font-serif">4. Damaged, Defective, or Incorrect Goods</h2>
            <p>
              In the rare event that your package arrives physically damaged or an incorrect item was dispatched, please notify us within <strong>48 hours of delivery</strong> by sending an email with unboxing photographs to <strong className="text-slate-900">chandrarakhi42@gmail.com</strong> or calling/messaging support at <strong className="text-slate-900">+91 8210107736</strong>. We will arrange a complimentary door-to-door reverse pickup and expedite an immediate replacement or full refund.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 font-serif">5. Non-Returnable Merchandise</h2>
            <p>Due to customized tailoring, the following items are non-returnable unless received in a damaged state:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
              <li>Sarees with custom fall/pico or custom stitched blouses completed upon buyer request.</li>
              <li>Garments purchased during final clearance sales explicitly designated as &quot;Non-Returnable&quot;.</li>
            </ul>
          </section>

          <section className="pt-4 border-t border-[#E5E0D8] flex items-center justify-between">
            <Link
              href="/contact-us"
              className="text-xs font-mono uppercase tracking-wider text-[#C29B38] font-bold hover:underline flex items-center gap-1.5"
            >
              Have a return query? Contact Customer Care →
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}
