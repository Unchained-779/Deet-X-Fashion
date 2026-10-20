import { generateInvoiceHTML } from "@/lib/mailer";

export default function InvoicePreviewPage() {
  const sampleOrder = {
    orderId: "ord_deeta_894129",
    customerName: "Aditi Sharma (अदिति शर्मा)",
    customerEmail: "aditi.sharma@example.com",
    customerPhone: "9876543210",
    shippingAddress: "Flat 402, Lotus Court, MG Road, New Delhi, Delhi - 110001",
    items: [
      {
        title: "Royal Maroon Kanjivaram Pure Silk Saree",
        size: "FREE_SIZE",
        colorName: "Maroon & Gold",
        quantity: 1,
        price: 5999,
      },
      {
        title: "Pastel Peach Chikankari Straight Kurti",
        size: "M",
        colorName: "Pastel Peach",
        quantity: 2,
        price: 1899,
      },
    ],
    subtotal: 9797,
    shippingFee: 0,
    totalAmount: 9797,
    estimatedDelivery: "Friday, 24 Oct 2026 (Doorstep OTP Verified)",
  };

  const html = generateInvoiceHTML(sampleOrder);

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between">
        <div>
          <span className="font-mono text-xs uppercase text-accent tracking-widest block">
            Deeta Fashion • Mailer Preview
          </span>
          <h1 className="text-2xl font-serif text-primary mt-1">
            Customer Order Invoice Preview
          </h1>
        </div>
        <a
          href="/"
          className="px-4 py-2 border border-[#E5E0D8] bg-white text-xs font-mono uppercase tracking-wider hover:border-primary transition-colors"
        >
          Back to Store
        </a>
      </div>

      <div
        className="max-w-4xl mx-auto shadow-sm"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
