import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmationEmail } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customer, items, totalAmount } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 });
    }

    // 1. Create or retrieve User by email
    let user = await prisma.user.findUnique({
      where: { email: customer.email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: customer.fullName,
          email: customer.email,
          phone: customer.phone,
        },
      });
    }

    // 2. Create Shipping Address
    const address = await prisma.address.create({
      data: {
        userId: user.id,
        fullName: customer.fullName,
        phone: customer.phone,
        street: customer.street,
        city: customer.city,
        state: customer.state,
        pincode: customer.pincode,
      },
    });

    // 3. Atomically persist Order & OrderItems in PostgreSQL transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create Order
      const newOrder = await tx.order.create({
        data: {
          userId: user.id,
          addressId: address.id,
          status: "PAID", // Confirmed checkout
          totalAmount: totalAmount,
          shippingAddressJson: JSON.stringify(customer),
          orderItems: {
            create: items.map((item: { variantId: string; quantity: number; price: number }) => ({
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

      // Deduct stock from each variant SKU
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

    // 4. Dispatch Luxury Invoice Email to Buyer
    const emailItems = order.orderItems.map((oi) => ({
      title: oi.variant.product.title,
      size: oi.variant.size,
      colorName: oi.variant.colorName,
      quantity: oi.quantity,
      price: oi.priceAtPurchase,
      imageUrl: oi.variant.images[0] || undefined,
    }));

    await sendOrderConfirmationEmail({
      orderId: order.id,
      customerName: customer.fullName,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      shippingAddress: `${customer.street}, ${customer.city}, ${customer.state} - ${customer.pincode}`,
      items: emailItems,
      subtotal: totalAmount > 1999 ? totalAmount : totalAmount - 99,
      shippingFee: totalAmount > 1999 ? 0 : 99,
      totalAmount: totalAmount,
      estimatedDelivery: "3-4 Business Days",
    });

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (err: unknown) {
    console.error("Checkout transaction error:", err);
    return NextResponse.json(
      { error: "Internal server error during order creation" },
      { status: 500 }
    );
  }
}
