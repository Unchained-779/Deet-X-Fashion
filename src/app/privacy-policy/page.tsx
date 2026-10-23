import StorefrontNavbar from "@/components/StorefrontNavbar";
import { Lock, ShieldCheck, Eye, Database, FileCheck } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | Deeta Fashion",
  description: "Privacy practices, data protection under DPDP Act, and payment security at Deeta Fashion.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#111] flex flex-col font-sans">
      <StorefrontNavbar />

      <main className="flex-1 max-w-4xl mx-auto px-6 py-24 sm:py-28 w-full">
        <div className="border-b border-[#E5E0D8] pb-6 mb-10">
          <span className="text-[11px] font-mono tracking-[0.25em] text-[#C29B38] uppercase block mb-1">
            Data Protection &amp; Confidentiality
          </span>
          <h1
            style={{ fontFamily: "var(--font-editorial)" }}
            className="text-4xl sm:text-5xl font-normal text-[#111]"
          >
            Privacy Policy
          </h1>
          <p className="text-xs font-mono text-slate-500 mt-2">
            Compliant with the Information Technology Act, 2000 and Digital Personal Data Protection (DPDP) Act, 2023
          </p>
        </div>

        <div className="space-y-8 text-sm text-slate-700 leading-relaxed font-sans">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 font-serif">1. Our Commitment to Your Privacy</h2>
            <p>
              At <strong>Deeta Fashion</strong> (owned and operated by <strong>Rakhi Chandra</strong>), we respect your personal integrity and are deeply committed to safeguarding your private information. This Privacy Policy outlines what information we gather from you when you visit our website, how we utilize it to fulfill your orders, and the robust security protocols we employ to keep your data confidential.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 font-serif">2. Information We Collect</h2>
            <p>When you interact with our platform or place an order, we may collect the following categories of personal data:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
              <li><strong>Contact Information:</strong> Full name, billing and delivery addresses, phone number, and email address.</li>
              <li><strong>Order History:</strong> Styles purchased, sizing specifications, custom alteration requests, and invoice archives.</li>
              <li><strong>Technical Data:</strong> IP address, browser type, device information, and interaction history via session cookies to ensure seamless cart persistence and personalized styling recommendations.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 font-serif">3. Payment Information Security via Razorpay</h2>
            <p>
              We take the security of financial transactions with utmost seriousness. All online card, net banking, and UPI payments on Deeta Fashion are routed through <strong>Razorpay</strong>, which adheres to the highest level of certification: <strong>PCI-DSS Level 1 Compliance</strong>.
            </p>
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs font-mono flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Important Note:</strong> Deeta Fashion does not store, capture, or retain full credit/debit card numbers, CVVs, or bank account passwords on our servers. All sensitive financial data is transmitted directly to Razorpay over end-to-end 256-bit SSL encrypted channels.
              </span>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 font-serif">4. How We Use Your Information</h2>
            <p>We process your personal information strictly for lawful business purposes, including:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
              <li>Processing, packaging, and dispatching your garment orders.</li>
              <li>Generating valid GST tax invoices in compliance with Indian commercial law.</li>
              <li>Sending live courier tracking numbers via SMS and email.</li>
              <li>Providing attentive customer support and resolving grievance requests.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 font-serif">5. Non-Disclosure &amp; Third-Party Partners</h2>
            <p>
              We do not sell, rent, or trade your personal data to external advertisers. Data is shared exclusively with verified operational partners essential for service fulfillment, namely:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
              <li><strong>Logistics Partners:</strong> BlueDart, Delhivery, DTDC, and India Post for physical delivery.</li>
              <li><strong>Payment Partners:</strong> Razorpay Software Private Limited for digital transaction settlements.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 font-serif">6. Grievance Officer &amp; Inquiries</h2>
            <p>
              In accordance with the Information Technology Act, 2000, and rules made thereunder, any concerns regarding data protection may be addressed to our designated Grievance Officer:
            </p>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono space-y-1.5 text-slate-800">
              <p><strong>Merchant Legal Name:</strong> Rakhi Chandra (Trade Name: Deeta Fashion)</p>
              <p><strong>Registered Address:</strong> A-151 , AG Colony , Ashiyana Nagar , Patna - 800025 , Bihar , India</p>
              <p><strong>Contact Email:</strong> chandrarakhi42@gmail.com</p>
              <p><strong>Contact Phone:</strong> +91 8210107736</p>
              <p><strong>Grievance Officer:</strong> Vivek Chandra</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
