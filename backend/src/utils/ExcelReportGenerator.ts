import ExcelJS from 'exceljs';
import { Response } from 'express';

export interface OrderReportItem {
  id: string;
  createdAt: Date;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: string;
  totalAmount: number;
  itemCount: number;
  itemsSummary: string;
  destinationCity: string;
  destinationState: string;
}

export class ExcelReportGenerator {
  static async generateOrdersExcel(orders: OrderReportItem[], res: Response): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'DeeT-X Fashion Production Core';
    workbook.created = new Date();

    const sheet = workbook.addWorksheet('Sales & Orders Report', {
      views: [{ state: 'frozen', ySplit: 1 }],
    });

    sheet.columns = [
      { header: 'Order ID', key: 'id', width: 25 },
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Customer Name', key: 'customerName', width: 20 },
      { header: 'Customer Email', key: 'customerEmail', width: 25 },
      { header: 'Customer Phone', key: 'customerPhone', width: 16 },
      { header: 'Order Status', key: 'status', width: 15 },
      { header: 'Total (INR)', key: 'totalAmount', width: 15 },
      { header: 'Items Purchased', key: 'itemsSummary', width: 35 },
      { header: 'City', key: 'city', width: 15 },
      { header: 'State', key: 'state', width: 15 },
    ];

    // Style Header Row
    const headerRow = sheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF0F172A' }, // Slate 900
    };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
    headerRow.height = 25;

    // Add Data Rows
    orders.forEach((order) => {
      sheet.addRow({
        id: order.id,
        date: new Date(order.createdAt).toISOString().split('T')[0],
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        status: order.status,
        totalAmount: order.totalAmount,
        itemsSummary: order.itemsSummary,
        city: order.destinationCity,
        state: order.destinationState,
      });
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=DeeTX-Orders-Report-${new Date().toISOString().split('T')[0]}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
  }
}
