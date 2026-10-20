import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { generateInvoiceHTML } from "@/lib/mailer";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";
import PrintButton from "./PrintButton";

interface InvoicePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderInvoicePage({ params }: InvoicePageProps) {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: true,
      address: true,
      orderItems: {
        include: {
          variant: {
            include: {
              product: true,
            },
          },
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  // Security check: Only the customer who placed it or an ADMIN can view it
  if (order.userId !== session.user.id && session.user.role !== "ADMIN") {
    redirect("/");
  }

  // Parse shipping destination
  let shippingAddressText = "";
  let customerName = order.user?.name || "Valued Customer";
  let customerEmail = order.user?.email || "";
  let customerPhone = order.user?.phone || "";

  if (order.shippingAddressJson) {
    try {
      const parsed = JSON.parse(order.shippingAddressJson);
      customerName = parsed.fullName || customerName;
      customerEmail = parsed.email || customerEmail;
      customerPhone = parsed.phone || customerPhone;
      shippingAddressText = `${parsed.street || ""}, ${parsed.city || ""}, ${parsed.state || ""} - ${parsed.pincode || ""}`;
    } catch {
      // fallback
    }
  }

  if (!shippingAddressText && order.address) {
    customerName = order.address.fullName;
    customerPhone = order.address.phone;
    shippingAddressText = `${order.address.street}, ${order.address.city}, ${order.address.state} - ${order.address.pincode}`;
  }

  const items = order.orderItems.map((oi) => ({
    title: oi.variant.product.title,
    size: oi.variant.size,
    colorName: oi.variant.colorName,
    quantity: oi.quantity,
    price: oi.priceAtPurchase,
    imageUrl: oi.variant.images[0] || undefined,
  }));

  const invoiceHTML = generateInvoiceHTML({
    orderId: order.id,
    customerName,
    customerEmail,
    customerPhone,
    shippingAddress: shippingAddressText || "Store Pickup / Digital Dispatch",
    items,
    subtotal: order.totalAmount > 1999 ? order.totalAmount : order.totalAmount - 99,
    shippingFee: order.totalAmount > 1999 ? 0 : 99,
    totalAmount: order.totalAmount,
    estimatedDelivery: "3-4 Business Days (Doorstep Handover)",
  });

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between no-print">
        <Link
          href="/account#orders"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#111] hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Account Orders</span>
        </Link>
        <PrintButton />
      </div>

      <div
        className="max-w-4xl mx-auto shadow-md border border-[#E5E0D8] bg-white print:shadow-none print:border-none"
        dangerouslySetInnerHTML={{ __html: invoiceHTML }}
      />
    </div>
  );
}
