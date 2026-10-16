import { NextRequest, NextResponse } from "next/server";
import { capturedPaymentSchema } from "@/lib/razorpay-events";
import { confirmCapturedPayment, isConfirmedPayment } from "@/lib/payment-confirmation";
import { fetchRazorpayPayment, verifyPaymentLinkSignature } from "@/lib/razorpay";
import { unsignedPaymentReturn } from "@/lib/payment-return";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const signed = verifyPaymentLinkSignature(params);
  let status = signed && params.get("razorpay_payment_link_status") === "paid"
    ? "success" : unsignedPaymentReturn(params);
  try {
    if (await isConfirmedPayment(params.get("razorpay_payment_id") || "")) return NextResponse.json({status:"success"},{headers:{"Cache-Control":"no-store"}});
  } catch { /* A delayed webhook or temporary database failure leaves confirmation pending. */ }
  if (status === "success") {
    try {
      const payment = capturedPaymentSchema.safeParse(await fetchRazorpayPayment(params.get("razorpay_payment_id") || ""));
      if (!payment.success) status="unverified";
      else await confirmCapturedPayment(payment.data);
    } catch { status="unverified"; }
  }
  return NextResponse.json({ status }, { headers: { "Cache-Control": "no-store" } });
}
