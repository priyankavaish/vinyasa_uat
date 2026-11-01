import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { capturedPaymentSchema, validWebhookSignature } from "@/lib/razorpay-events";
import { confirmCapturedPayment } from "@/lib/payment-confirmation";
import { getBookingByOrderId, updateBookingStatus } from "@/lib/store";
import { notifyEntry } from "@/lib/email-notifications";
export const runtime = "nodejs";
export async function POST(req: NextRequest) {
  if (!process.env.RAZORPAY_WEBHOOK_SECRET) return NextResponse.json({error:"Payment webhook is not configured."},{status:503});
  const body = await req.text();
  if (!validWebhookSignature(body, req.headers.get("x-razorpay-signature") || "", process.env.RAZORPAY_WEBHOOK_SECRET)) return NextResponse.json({error:"Invalid signature."},{status:400});
  let event;
  try { event=JSON.parse(body); } catch { return NextResponse.json({error:"Invalid payload."},{status:400}); }
  if (event.event === "payment.failed") {
    // A failed attempt only fails the booking if it is still unpaid; the customer may retry inside the same order.
    const entity = event.payload?.payment?.entity;
    try {
      const booking = typeof entity?.order_id === "string" ? await getBookingByOrderId(entity.order_id) : null;
      if (booking?.status === "pending") {
        const detail = [entity.error_description, entity.error_reason].filter((part: unknown) => typeof part === "string" && part).join(" — ").slice(0, 280);
        const failed = await updateBookingStatus(booking.id, "failed", { failureReason: "Payment failed" + (detail ? ": " + detail : "") });
        revalidatePath("/admin/bookings");
        if (failed) await notifyEntry("booking-failed", failed).catch(() => {});
      }
      return NextResponse.json({received:true});
    } catch { return NextResponse.json({error:"Could not record the failed payment."},{status:500}); }
  }
  if (!["payment.captured","order.paid","payment_link.paid"].includes(event.event)) return NextResponse.json({received:true});
  const parsed = capturedPaymentSchema.safeParse(event.payload?.payment?.entity);
  if (!parsed.success) return NextResponse.json({error:"Payment is not captured or has invalid details."},{status:400});
  try {
    await confirmCapturedPayment(parsed.data);
    revalidatePath("/admin/bookings");
    return NextResponse.json({received:true});
  } catch { return NextResponse.json({error:"Could not process payment confirmation."},{status:500}); }
}
