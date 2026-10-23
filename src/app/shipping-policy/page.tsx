import StorefrontNavbar from "@/components/StorefrontNavbar";
import { Truck, Clock, ShieldCheck, MapPin, IndianRupee, BellRing } from "lucide-react";

export const metadata = {
  title: "Shipping & Delivery Policy | Deeta Fashion",
  description: "Dispatch within 24-48 hours, pan-India delivery in 3-7 business days, free shipping threshold.",
};

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#111] flex flex-col font-sans">
      <StorefrontNavbar />

      <main className="flex-1 max-w-4xl mx-auto px-6 py-24 sm:py-28 w-full">
        <div className="border-b border-[#E5E0D8] pb-6 mb-10">
          <span className="text-[11px] font-mono tracking-[0.25em] text-[#C29B38] uppercase block mb-1">
            Logistics &amp; Courier Fulfillment
          </span>
          <h1
            style={{ fontFamily: "var(--font-editorial)" }}
            className="text-4xl sm:text-5xl font-normal text-[#111]"
          >
            Shipping &amp; Delivery Policy
          </h1>
          <p className="text-xs font-mono text-slate-500 mt-2">
            Insured Doorstep Delivery Across India (Operated by Rakhi Chandra)
          </p>
        </div>

        {/* Highlight Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="p-4 bg-white border border-[#E5E0D8] rounded-xl space-y-1">
            <span className="text-xs font-mono uppercase tracking-wider text-[#C29B38] font-bold block">
              Dispatch Timeline
            </span>
            <p className="text-xl font-bold text-slate-900 font-serif">24–48 Hours</p>
            <p className="text-xs text-slate-500 leading-snug">
              Every garment undergoes individual fabric inspection before packing.
            </p>
          </div>

          <div className="p-4 bg-white border border-[#E5E0D8] rounded-xl space-y-1">
            <span className="text-xs font-mono uppercase tracking-wider text-[#C29B38] font-bold block">
              Estimated Delivery
            </span>
            <p className="text-xl font-bold text-slate-900 font-serif">3–7 Business Days</p>
            <p className="text-xs text-slate-500 leading-snug">
              Expedited courier delivery to over 19,000 Indian PIN codes.
            </p>
          </div>

          <div className="p-4 bg-white border border-[#E5E0D8] rounded-xl space-y-1">
            <span className="text-xs font-mono uppercase tracking-wider text-[#C29B38] font-bold block">
              Complimentary Shipping
            </span>
            <p className="text-xl font-bold text-slate-900 font-serif">Orders Over ₹1,999</p>
            <p className="text-xs text-slate-500 leading-snug">
              Free all-India delivery. Flat ₹99 for smaller accessory orders.
            </p>
          </div>
        </div>

        <div className="space-y-8 text-sm text-slate-700 leading-relaxed font-sans">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 font-serif">1. Order Processing &amp; Dispatch Timeline</h2>
            <p>
              We pride ourselves on prompt order fulfillment. All standard in-stock garment orders are inspected, steam-pressed, carefully folded into protective garment sleeves, and dispatched within <strong>24 to 48 hours</strong> of order confirmation (excluding national holidays and Sundays).
            </p>
            <p>
              Customized garments requiring blouse stitching or custom falls/pico may require an additional 2–3 business days prior to dispatch.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 font-serif">2. Domestic Delivery Timelines &amp; Courier Partners</h2>
            <p>
              Deeta Fashion partners with premier Indian logistics providers—including <strong>BlueDart, Delhivery, DTDC, and India Post Speed Post</strong>—to ensure your orders reach you safely:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
              <li><strong>Metro Cities (Delhi NCR, Mumbai, Bengaluru, Kolkata, Chennai, Hyderabad):</strong> 3 to 5 business days.</li>
              <li><strong>Tier 2 &amp; Tier 3 Cities (State Capitals &amp; District Hubs):</strong> 4 to 6 business days.</li>
              <li><strong>Regional &amp; Remote Locations (Northeast, J&amp;K, Islands):</strong> 5 to 7 business days.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 font-serif">3. Shipping Fees &amp; Thresholds</h2>
            <p>
              We believe in honest, transparent pricing with no hidden charges at checkout:
            </p>
            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2 text-xs font-mono">
              <p className="flex justify-between border-b pb-1.5">
                <span>Orders ₹1,999 and above:</span>
                <strong className="text-emerald-700 font-bold uppercase">FREE Pan-India Shipping</strong>
              </p>
              <p className="flex justify-between pt-0.5">
                <span>Orders below ₹1,999:</span>
                <strong>Flat ₹99 standard insured courier fee</strong>
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 font-serif">4. Real-Time Tracking &amp; Notifications</h2>
            <p>
              The moment your package is handed over to our logistics partner, an automated confirmation is dispatched via <strong>Email and SMS</strong> containing:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
              <li>Air Waybill (AWB) Tracking Number.</li>
              <li>Direct link to track the real-time live transit updates of your consignment.</li>
              <li>Estimated delivery date.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 font-serif">5. Address Accuracy &amp; Delivery Attempts</h2>
            <p>
              Please ensure your complete delivery address, contact phone number, and 6-digit Indian PIN code are accurately entered during checkout. Our courier partners will make up to three delivery attempts before returning the shipment to our central warehouse.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
