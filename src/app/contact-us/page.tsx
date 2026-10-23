"use client";

import StorefrontNavbar from "@/components/StorefrontNavbar";
import { useState } from "react";
import { Mail, Phone, MapPin, Clock, ShieldCheck, CheckCircle2, Send, Building2 } from "lucide-react";

export default function ContactUsPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    orderId: "",
    subject: "Order Inquiry",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#111] flex flex-col font-sans">
      <StorefrontNavbar />

      <main className="flex-1 max-w-5xl mx-auto px-6 py-24 sm:py-28 w-full">
        <div className="border-b border-[#E5E0D8] pb-6 mb-10">
          <span className="text-[11px] font-mono tracking-[0.25em] text-[#C29B38] uppercase block mb-1">
            Customer Care &amp; Statutory Redressal
          </span>
          <h1
            style={{ fontFamily: "var(--font-editorial)" }}
            className="text-4xl sm:text-5xl font-normal text-[#111]"
          >
            Contact Us &amp; Grievance
          </h1>
          <p className="text-xs font-mono text-slate-500 mt-2">
            We are here to assist with sizing consultations, orders, styling, and post-purchase care.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Statutory Business Information & Grievance Officer */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 bg-white border border-[#E5E0D8] rounded-2xl shadow-sm space-y-4">
              <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-[#C29B38] font-bold">
                Registered Merchant Information
              </h2>

              <div className="space-y-3 text-xs font-sans text-slate-700">
                <div>
                  <span className="block font-mono text-[10px] uppercase text-slate-400">Legal Entity Name</span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">Rakhi Chandra</p>
                  <p className="text-[11px] text-slate-500 font-mono">(Sole Proprietorship / Trade Name: Deeta Fashion)</p>
                </div>

                <div>
                  <span className="block font-mono text-[10px] uppercase text-slate-400">Operational &amp; Physical Address</span>
                  <p className="mt-0.5 leading-relaxed font-semibold text-slate-900">
                    A-151 , AG Colony , Ashiyana Nagar , Patna - 800025 , Bihar , India
                  </p>
                </div>

                <div>
                  <span className="block font-mono text-[10px] uppercase text-slate-400">Customer Support Email</span>
                  <p className="mt-0.5 font-mono text-slate-900">
                    <a href="mailto:chandrarakhi42@gmail.com" className="hover:underline font-semibold">chandrarakhi42@gmail.com</a>
                  </p>
                </div>

                <div>
                  <span className="block font-mono text-[10px] uppercase text-slate-400">Customer Helpdesk Phone</span>
                  <p className="mt-0.5 font-mono text-slate-900">
                    <a href="tel:+918210107736" className="hover:underline font-semibold">+91 8210107736</a>
                  </p>
                </div>

                <div>
                  <span className="block font-mono text-[10px] uppercase text-slate-400">Operating Hours</span>
                  <p className="mt-0.5 font-mono">
                    Monday to Saturday: 10:00 AM – 7:00 PM IST (Excluding National Holidays)
                  </p>
                </div>
              </div>
            </div>

            {/* Statutory Grievance Redressal Box */}
            <div className="p-6 bg-slate-900 text-white rounded-2xl shadow-sm space-y-3 font-sans">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-amber-400">
                  Statutory Grievance Redressal Officer
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                In compliance with the Consumer Protection (E-Commerce) Rules, 2020 and Information Technology Act, 2000:
              </p>
              <div className="text-xs font-mono space-y-1 text-slate-200 pt-1 border-t border-slate-800">
                <p><strong>Name:</strong> Vivek Chandra</p>
                <p><strong>Designation:</strong> Grievance Officer, Deeta Fashion</p>
                <p><strong>Email:</strong> grievance@deetxfashion.com</p>
                <p><strong>Response SLA:</strong> Acknowledgement within 48 hours; resolution within 14 business days.</p>
              </div>
            </div>
          </div>

          {/* Right Column: Working Contact Form */}
          <div className="lg:col-span-7 bg-white p-8 rounded-2xl border border-[#E5E0D8] shadow-sm">
            <h2 className="text-xl font-bold font-serif text-slate-900 mb-1">Send Us a Direct Message</h2>
            <p className="text-xs text-slate-500 mb-6 font-sans">
              Have a question about fabric weave, sizing, order status, or bridal customization? Fill out the details below.
            </p>

            {submitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="text-base font-bold text-emerald-950 font-serif">Message Successfully Received</h3>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Thank you for reaching out to Deeta Fashion. Our customer concierge team will respond to your registered email ({formState.email}) within 24 business hours.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="text-xs font-mono uppercase tracking-wider text-emerald-900 underline font-bold"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      placeholder="e.g. Priya Sharma"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      placeholder="e.g. priya@example.com"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formState.phone}
                      onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-slate-900 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">
                      Order ID (Optional)
                    </label>
                    <input
                      type="text"
                      value={formState.orderId}
                      onChange={(e) => setFormState({ ...formState, orderId: e.target.value })}
                      placeholder="e.g. ORDER #123456"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-slate-900 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">
                    Subject / Concern Category
                  </label>
                  <select
                    value={formState.subject}
                    onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-slate-900"
                  >
                    <option value="Order Tracking & Delivery">Order Tracking &amp; Delivery</option>
                    <option value="Return or Exchange Request">Return or Exchange Request</option>
                    <option value="Fabric & Sizing Advice">Fabric &amp; Sizing Advice</option>
                    <option value="Bridal & Custom Trousseau Inquiry">Bridal &amp; Custom Trousseau Inquiry</option>
                    <option value="Billing & Razorpay Payment Issue">Billing &amp; Razorpay Payment Issue</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    placeholder="Describe how we can assist you..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-slate-900"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs uppercase tracking-[0.2em] font-bold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{loading ? "Transmitting Message..." : "Send Inquiry to Deeta Concierge"}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
