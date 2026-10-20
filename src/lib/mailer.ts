import { Resend } from "resend";

interface OrderEmailItem {
  title: string;
  size: string;
  colorName: string;
  quantity: number;
  price: number;
  imageUrl?: string;
}

interface OrderEmailData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  items: OrderEmailItem[];
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  paymentMethod?: string;
  estimatedDelivery?: string;
}

export function generateInvoiceHTML(order: OrderEmailData): string {
  const invoiceNumber = `DF-${order.orderId.slice(-6).toUpperCase()}`;
  const currentDate = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const gstRate = 0.05; // 5% GST for garments in India
  const gstAmount = Math.round(order.totalAmount * (gstRate / (1 + gstRate)));
  const taxableValue = order.totalAmount - gstAmount;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Deeta Fashion Invoice #${invoiceNumber}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #FAF8F5;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      color: #111111;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #FAF8F5;
      padding: 40px 0;
    }
    .main {
      background-color: #FFFFFF;
      margin: 0 auto;
      width: 100%;
      max-width: 640px;
      border: 1px solid #E5E0D8;
    }
    .header {
      padding: 40px 40px 30px;
      border-bottom: 2px solid #111111;
      text-align: left;
    }
    .brand-title {
      font-family: 'Georgia', serif;
      font-size: 26px;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      margin: 0;
      color: #111111;
      font-weight: 400;
    }
    .brand-subtitle {
      font-size: 9px;
      letter-spacing: 0.35em;
      text-transform: uppercase;
      color: #9E7B4F;
      margin-top: 4px;
      font-family: 'Courier New', monospace;
    }
    .invoice-badge {
      display: inline-block;
      padding: 4px 10px;
      background-color: #FAF8F5;
      border: 1px solid #E5E0D8;
      font-family: 'Courier New', monospace;
      font-size: 11px;
      letter-spacing: 0.15em;
      color: #111111;
      margin-top: 15px;
    }
    .section {
      padding: 30px 40px;
    }
    .two-col {
      width: 100%;
      border-collapse: collapse;
    }
    .two-col td {
      width: 50%;
      vertical-align: top;
      font-size: 12px;
      line-height: 1.6;
    }
    .col-title {
      font-family: 'Courier New', monospace;
      font-size: 10px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #9E7B4F;
      margin-bottom: 8px;
    }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }
    .items-table th {
      border-bottom: 1px solid #111111;
      border-top: 1px solid #E5E0D8;
      padding: 12px 0;
      font-family: 'Courier New', monospace;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: #6E6A64;
      text-align: left;
    }
    .items-table td {
      padding: 16px 0;
      border-bottom: 1px solid #E5E0D8;
      font-size: 12px;
      vertical-align: middle;
    }
    .item-title {
      font-weight: 500;
      color: #111111;
      font-size: 13px;
    }
    .item-meta {
      font-size: 11px;
      color: #6E6A64;
      font-family: 'Courier New', monospace;
      margin-top: 4px;
    }
    .totals-table {
      width: 100%;
      max-width: 280px;
      margin-left: auto;
      border-collapse: collapse;
      margin-top: 20px;
    }
    .totals-table td {
      padding: 6px 0;
      font-size: 12px;
    }
    .grand-total {
      border-top: 1px solid #111111;
      border-bottom: 2px solid #111111;
      font-weight: bold;
      font-size: 15px !important;
      padding: 12px 0 !important;
      color: #111111;
    }
    .footer {
      background-color: #111111;
      color: #FAF8F5;
      padding: 30px 40px;
      text-align: center;
      font-size: 11px;
      line-height: 1.8;
      letter-spacing: 0.05em;
    }
    .footer a {
      color: #9E7B4F;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="main">
      <!-- Header -->
      <div class="header">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td>
              <h1 class="brand-title">DEETA FASHION</h1>
              <div class="brand-subtitle">Atelier • Handcrafted Indian Couture</div>
            </td>
            <td style="text-align: right;">
              <div class="invoice-badge">TAX INVOICE</div>
              <div style="font-family: 'Courier New', monospace; font-size: 11px; color: #6E6A64; margin-top: 6px;">
                #${invoiceNumber}
              </div>
            </td>
          </tr>
        </table>
      </div>

      <!-- Order & Customer Details -->
      <div class="section" style="border-bottom: 1px solid #E5E0D8;">
        <table class="two-col">
          <tr>
            <td>
              <div class="col-title">BILLED TO (ग्राहक का नाम)</div>
              <strong style="font-size: 14px; color: #111111;">${order.customerName}</strong><br>
              ${order.customerEmail}<br>
              +91 ${order.customerPhone}
            </td>
            <td>
              <div class="col-title">DELIVERY DESTINATION (पता)</div>
              ${order.shippingAddress}<br>
              <span style="font-family: 'Courier New', monospace; color: #9E7B4F; font-size: 11px;">
                Estimated Delivery: ${order.estimatedDelivery || "3-4 Business Days"}
              </span>
            </td>
          </tr>
        </table>
      </div>

      <!-- Itemized Table -->
      <div class="section">
        <table class="items-table">
          <thead>
            <tr>
              <th style="width: 55%;">GARMENT DETAILS</th>
              <th style="width: 15%; text-align: center;">QTY</th>
              <th style="width: 15%; text-align: right;">PRICE</th>
              <th style="width: 15%; text-align: right;">AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            ${order.items
              .map(
                (item) => `
              <tr>
                <td>
                  <div class="item-title">${item.title}</div>
                  <div class="item-meta">Size: ${item.size} • Color: ${item.colorName}</div>
                </td>
                <td style="text-align: center; font-family: 'Courier New', monospace;">${item.quantity}</td>
                <td style="text-align: right; font-family: 'Courier New', monospace;">₹${item.price.toLocaleString("en-IN")}</td>
                <td style="text-align: right; font-family: 'Courier New', monospace; font-weight: bold;">₹${(item.price * item.quantity).toLocaleString("en-IN")}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>

        <!-- Totals Calculation -->
        <table class="totals-table">
          <tr>
            <td style="color: #6E6A64;">Taxable Subtotal:</td>
            <td style="text-align: right; font-family: 'Courier New', monospace;">₹${taxableValue.toLocaleString("en-IN")}</td>
          </tr>
          <tr>
            <td style="color: #6E6A64;">GST (5% Included):</td>
            <td style="text-align: right; font-family: 'Courier New', monospace;">₹${gstAmount.toLocaleString("en-IN")}</td>
          </tr>
          <tr>
            <td style="color: #6E6A64;">Express Delivery:</td>
            <td style="text-align: right; font-family: 'Courier New', monospace; color: ${order.shippingFee === 0 ? "#9E7B4F" : "#111111"};">
              ${order.shippingFee === 0 ? "FREE" : `₹${order.shippingFee}`}
            </td>
          </tr>
          <tr class="grand-total">
            <td>TOTAL AMOUNT:</td>
            <td style="text-align: right; font-family: 'Courier New', monospace;">₹${order.totalAmount.toLocaleString("en-IN")}</td>
          </tr>
        </table>
      </div>

      <!-- Verified Authenticity Badge -->
      <div style="background-color: #FAF8F5; border-top: 1px solid #E5E0D8; padding: 20px 40px; text-align: center;">
        <span style="font-family: 'Courier New', monospace; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: #9E7B4F;">
          100% HANDLOOM CERTIFIED • DOORSTEP OTP VERIFIED
        </span>
      </div>

      <!-- Footer -->
      <div class="footer">
        <div style="font-family: 'Georgia', serif; font-size: 16px; margin-bottom: 6px;">DEETA FASHION</div>
        <div>Shop Address: Main Garment Market, India • GSTIN: 07AAAAA0000A1Z5</div>
        <div>For inquiries, exchange, or order status: <a href="mailto:support@deetafashion.com">support@deetafashion.com</a></div>
        <div style="margin-top: 10px; font-size: 9px; color: #888888; font-family: 'Courier New', monospace;">
          This is an official computer-generated digital tax invoice.
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

export async function sendOrderConfirmationEmail(orderData: OrderEmailData) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log(
      `ℹ️ [MAILER SIMULATION] Order confirmation invoice prepared for: ${orderData.customerEmail} (Total: ₹${orderData.totalAmount}). Add RESEND_API_KEY to send real emails.`
    );
    return { success: true, simulated: true };
  }

  const resend = new Resend(apiKey);

  try {
    const htmlContent = generateInvoiceHTML(orderData);

    const { data, error } = await resend.emails.send({
      from: "Deeta Fashion <orders@deetafashion.com>",
      to: [orderData.customerEmail],
      subject: `Order Confirmed: #DF-${orderData.orderId.slice(-6).toUpperCase()} — Deeta Fashion Invoice`,
      html: htmlContent,
    });

    if (error) {
      console.error("Resend email error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Failed to send order email:", err);
    return { success: false, error: err };
  }
}
