import { prisma } from '../../config/prisma';
import { AppError } from '../../utils/AppError';
import { InvoiceGenerator } from '../../utils/InvoiceGenerator';
import { ExcelReportGenerator } from '../../utils/ExcelReportGenerator';

export interface CheckoutInput {
  customer: {
    fullName: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    state?: string;
    pincode: string;
  };
  items: {
    variantId: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
}

export class OrderService {
  async processCheckout(input: CheckoutInput) {
    const { customer, items, totalAmount } = input;

    // Execute atomic transaction for inventory reservation and order persistence
    return await prisma.$transaction(async (tx) => {
      // 1. Find or create user
      let user = await tx.user.findUnique({
        where: { email: customer.email },
      });

      if (!user) {
        user = await tx.user.create({
          data: {
            name: customer.fullName,
            email: customer.email,
            phone: customer.phone,
          },
        });
      }

      // 2. Create Shipping Address
      const address = await tx.address.create({
        data: {
          userId: user.id,
          fullName: customer.fullName,
          phone: customer.phone,
          street: customer.street,
          city: customer.city,
          state: customer.state || 'Delhi',
          pincode: customer.pincode,
        },
      });

      // 3. Verify stock availability for each SKU variant
      for (const item of items) {
        const variant = await tx.productVariant.findUnique({
          where: { id: item.variantId },
        });

        if (!variant) {
          throw new AppError(`Product Variant SKU not found for ID: ${item.variantId}`, 404);
        }

        const availableStock = variant.stockCount - variant.reservedStock;
        if (availableStock < item.quantity) {
          throw new AppError(
            `Insufficient stock for SKU '${variant.sku}'. Available: ${availableStock}, Requested: ${item.quantity}`,
            409
          );
        }
      }

      // 4. Create the Order with immutable priceAtPurchase snapshots
      const newOrder = await tx.order.create({
        data: {
          userId: user.id,
          addressId: address.id,
          status: 'PAID', // Confirmed transaction
          totalAmount,
          shippingAddressJson: JSON.stringify(customer),
          orderItems: {
            create: items.map((item) => ({
              variantId: item.variantId,
              quantity: item.quantity,
              priceAtPurchase: item.price,
            })),
          },
        },
        include: {
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

      // 5. Decrement inventory from variants
      for (const item of items) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: {
            stockCount: {
              decrement: item.quantity,
            },
          },
        });
      }

      return newOrder;
    });
  }

  async getAllOrders() {
    return await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
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
  }

  async getOrderById(orderId: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
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
      throw new AppError(`Order #${orderId} not found`, 404);
    }

    return order;
  }

  async streamInvoicePDF(orderId: string, res: any) {
    const order = await this.getOrderById(orderId);

    const invoiceData = {
      orderId: order.id,
      createdAt: order.createdAt,
      customerName: order.user?.name || order.address?.fullName || 'Valued Customer',
      customerEmail: order.user?.email || 'N/A',
      customerPhone: order.address?.phone || 'N/A',
      shippingAddress: order.address
        ? `${order.address.street}, ${order.address.city}, ${order.address.state} - ${order.address.pincode}`
        : 'Store Pickup',
      items: order.orderItems.map((item) => ({
        title: item.variant.product.title,
        size: item.variant.size,
        sku: item.variant.sku,
        quantity: item.quantity,
        unitPrice: item.priceAtPurchase,
        total: item.priceAtPurchase * item.quantity,
      })),
      totalAmount: order.totalAmount,
    };

    InvoiceGenerator.generateInvoicePDF(invoiceData, res);
  }

  async streamOrdersExcel(res: any) {
    const orders = await this.getAllOrders();

    const reportData = orders.map((o) => ({
      id: o.id,
      createdAt: o.createdAt,
      customerName: o.user?.name || o.address?.fullName || 'Guest',
      customerEmail: o.user?.email || 'N/A',
      customerPhone: o.address?.phone || 'N/A',
      status: o.status,
      totalAmount: o.totalAmount,
      itemCount: o.orderItems.length,
      itemsSummary: o.orderItems
        .map((i) => `${i.quantity}x ${i.variant.product.title} (${i.variant.size})`)
        .join(', '),
      destinationCity: o.address?.city || 'N/A',
      destinationState: o.address?.state || 'N/A',
    }));

    await ExcelReportGenerator.generateOrdersExcel(reportData, res);
  }
}

export const orderService = new OrderService();
