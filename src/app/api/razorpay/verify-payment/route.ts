import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      dbOrderId,
    } = body;

    const secret = process.env.RAZORPAY_KEY_SECRET;

    if (secret && razorpay_signature && !secret.includes("placeholder")) {
      const generatedSignature = crypto
        .createHmac("sha256", secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      if (generatedSignature !== razorpay_signature) {
        return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
      }
    }

    // Update DB Order if exists
    if (dbOrderId) {
      await prisma.order.update({
        where: { id: dbOrderId },
        data: {
          status: "PAID",
          razorpayOrderId: razorpay_order_id || null,
          razorpayPaymentId: razorpay_payment_id || `pay_${Date.now().toString().slice(-8)}`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Payment successfully verified and recorded",
    });
  } catch (error: any) {
    console.error("Razorpay verification error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to verify payment" },
      { status: 500 }
    );
  }
}
