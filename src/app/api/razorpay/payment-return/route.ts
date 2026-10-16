import { NextRequest, NextResponse } from "next/server";
import { verifyPaymentLinkSignature } from "@/lib/razorpay";
import { unsignedPaymentReturn } from "@/lib/payment-return";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const signed = verifyPaymentLinkSignature(params);
  const status = signed && params.get("razorpay_payment_link_status") === "paid"
    ? "success" : unsignedPaymentReturn(params);
  return NextResponse.json({ status }, { headers: { "Cache-Control": "no-store" } });
}
