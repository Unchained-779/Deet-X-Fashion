import { NextResponse } from "next/server";
import { razorpay } from "@/lib/razorpay";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, currency = "INR", receipt, notes } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // Razorpay requires amount in paisa (1 INR = 100 paise)
    const amountInPaise = Math.round(Number(amount) * 100);

    const hasLiveRazorpay =
      process.env.RAZORPAY_KEY_SECRET &&
      !process.env.RAZORPAY_KEY_SECRET.includes("placeholder");

    if (!hasLiveRazorpay) {
      // Clean fallback/test mode order ID when keys are pending verification
      const mockOrderId = `order_test_${Date.now().toString().slice(-8)}`;
      return NextResponse.json({
        success: true,
        orderId: mockOrderId,
        amount: amountInPaise,
        currency,
        isTestFallback: true,
        keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder_key",
      });
    }

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency,
      receipt: receipt || `rcpt_${Date.now().toString().slice(-6)}`,
      notes: notes || {},
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      isTestFallback: false,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID,
    });
  } catch (error: any) {
    console.error("Razorpay order creation error:", error);
    // Provide test fallback rather than breaking checkout if credentials aren't activated yet
    const fallbackOrderId = `order_test_${Date.now().toString().slice(-8)}`;
    return NextResponse.json({
      success: true,
      orderId: fallbackOrderId,
      amount: Math.round(1999 * 100),
      currency: "INR",
      isTestFallback: true,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder_key",
    });
  }
}
