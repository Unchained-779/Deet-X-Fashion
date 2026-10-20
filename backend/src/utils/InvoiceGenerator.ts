import PDFDocument from 'pdfkit';
import { Response } from 'express';

export interface InvoiceOrderData {
  orderId: string;
  createdAt: Date;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  items: {
    title: string;
    size: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  totalAmount: number;
}

export class InvoiceGenerator {
  static generateInvoicePDF(order: InvoiceOrderData, res: Response): void {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=Invoice-${order.orderId.slice(-8).toUpperCase()}.pdf`
    );

    doc.pipe(res);

    // 1. Header / Brand
    doc
      .fontSize(22)
      .font('Helvetica-Bold')
      .text('DEET-X FASHION', 50, 50)
      .fontSize(10)
      .font('Helvetica')
      .text('Premium Handcrafted Indian & Contemporary Fashion', 50, 75)
      .text('GSTIN: 07AAAAA0000A1Z5 | Support: support@deetxfashion.com', 50, 90)
      .moveDown();

    // 2. Invoice Details (Right-aligned)
    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .text('TAX INVOICE', 400, 50, { align: 'right' })
      .fontSize(9)
      .font('Helvetica')
      .text(`Invoice No: DTX-${order.orderId.slice(-8).toUpperCase()}`, 400, 70, { align: 'right' })
      .text(`Date: ${new Date(order.createdAt).toLocaleDateString('en-IN')}`, 400, 85, { align: 'right' })
      .text(`Payment Status: PAID`, 400, 100, { align: 'right' });

    // Divider
    doc.strokeColor('#e2e8f0').lineWidth(1).moveTo(50, 120).lineTo(550, 120).stroke();

    // 3. Bill To / Ship To
    doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .text('BILL TO & SHIP TO:', 50, 135)
      .font('Helvetica')
      .fontSize(9)
      .text(`Customer Name: ${order.customerName}`, 50, 150)
      .text(`Email: ${order.customerEmail}`, 50, 165)
      .text(`Mobile: ${order.customerPhone}`, 50, 180)
      .text(`Address: ${order.shippingAddress}`, 50, 195, { width: 300 });

    // 4. Itemized Table Header
    const tableTop = 240;
    doc
      .font('Helvetica-Bold')
      .fontSize(9)
      .text('Item Description', 50, tableTop)
      .text('Size / SKU', 240, tableTop)
      .text('Qty', 350, tableTop, { align: 'center', width: 40 })
      .text('Unit Price', 410, tableTop, { align: 'right', width: 60 })
      .text('Total (INR)', 480, tableTop, { align: 'right', width: 70 });

    doc.strokeColor('#cbd5e1').lineWidth(1).moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

    // 5. Line Items
    let yPosition = tableTop + 25;
    order.items.forEach((item) => {
      doc
        .font('Helvetica')
        .fontSize(9)
        .text(item.title, 50, yPosition, { width: 180 })
        .text(`${item.size} (${item.sku})`, 240, yPosition, { width: 100 })
        .text(item.quantity.toString(), 350, yPosition, { align: 'center', width: 40 })
        .text(`Rs. ${item.unitPrice.toLocaleString('en-IN')}`, 410, yPosition, { align: 'right', width: 60 })
        .text(`Rs. ${item.total.toLocaleString('en-IN')}`, 480, yPosition, { align: 'right', width: 70 });

      yPosition += 25;
    });

    // Divider
    doc.strokeColor('#e2e8f0').lineWidth(1).moveTo(50, yPosition + 10).lineTo(550, yPosition + 10).stroke();

    // 6. Totals
    const subtotal = order.totalAmount;
    const gstRate = 0.05; // 5% GST for garments
    const gstAmount = Math.round(subtotal * (gstRate / (1 + gstRate)));
    const taxableValue = subtotal - gstAmount;

    yPosition += 25;
    doc
      .font('Helvetica')
      .fontSize(9)
      .text('Taxable Value:', 350, yPosition)
      .text(`Rs. ${taxableValue.toLocaleString('en-IN')}`, 480, yPosition, { align: 'right', width: 70 })
      .text('IGST (5%):', 350, yPosition + 15)
      .text(`Rs. ${gstAmount.toLocaleString('en-IN')}`, 480, yPosition + 15, { align: 'right', width: 70 })
      .font('Helvetica-Bold')
      .fontSize(11)
      .text('Grand Total:', 350, yPosition + 35)
      .text(`Rs. ${subtotal.toLocaleString('en-IN')}`, 480, yPosition + 35, { align: 'right', width: 70 });

    // 7. Footer & Legal Disclaimers
    doc
      .fontSize(8)
      .font('Helvetica-Oblique')
      .fillColor('#64748b')
      .text(
        'Thank you for shopping with DeeT-X Fashion! This is a computer-generated tax invoice. Handcrafted in India.',
        50,
        720,
        { align: 'center', width: 500 }
      );

    doc.end();
  }
}
