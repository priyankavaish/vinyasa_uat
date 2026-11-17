import { eventForPaymentLink, loadEventPaymentSettings } from "@/lib/admin/event-payment-store";
import { eventPaymentMessages } from "@/lib/event-payment-settings";
import { NextRequest, NextResponse } from "next/server";
import { capturedPaymentSchema } from "@/lib/razorpay-events";
import { confirmCapturedPayment, isConfirmedPayment } from "@/lib/payment-confirmation";
import { fetchRazorpayPayment, verifyPaymentLinkSignature } from "@/lib/razorpay";
import { unsignedPaymentReturn } from "@/lib/payment-return";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  let eventSlug: string | null = null;
  try { eventSlug = await eventForPaymentLink(params.get("razorpay_payment_link_id") || ""); } catch { /* verification still runs if settings are unavailable */ }
  async function result(status: string) {
    const settings = eventSlug ? await loadEventPaymentSettings(eventSlug).catch(() => null) : null;
    return NextResponse.json({status,...(settings && (status === "success" || status === "failed") ? {copy:eventPaymentMessages(settings,status),showPopup:settings.showPopup} : {})},{headers:{"Cache-Control":"no-store"}});
  }
  const signed = verifyPaymentLinkSignature(params);
  let status = signed && params.get("razorpay_payment_link_status") === "paid"
    ? "success" : unsignedPaymentReturn(params);
  try {
    if (await isConfirmedPayment(params.get("razorpay_payment_id") || "")) return result("success");
  } catch { /* A delayed webhook or temporary database failure leaves confirmation pending. */ }
  if (status === "success") {
    try {
      const payment = capturedPaymentSchema.safeParse(await fetchRazorpayPayment(params.get("razorpay_payment_id") || ""));
      if (!payment.success) status="unverified";
      else await confirmCapturedPayment(payment.data, eventSlug ? {eventSlug} : undefined);
    } catch { status="unverified"; }
  }
  return result(status);
}
