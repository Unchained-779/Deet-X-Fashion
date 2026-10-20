import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || "deetx_webhook_secret_default";

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    // Cryptographic HMAC SHA256 verification
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.warn("Unauthorized webhook attempt: signature mismatch");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);

    if (payload.event === "payment.captured") {
      const payment = payload.payload.payment.entity;
      const orderId = payment.notes?.orderId || payment.order_id;

      if (orderId) {
        await prisma.order.update({
          where: { id: orderId },
          data: {
            status: "PAID",
            razorpayPaymentId: payment.id,
          },
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    console.error("Webhook processing error:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
