import "server-only";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { siteContent } from "@/lib/db/schema";
import { getBookingByOrderId, getBookingByPaymentId, updateBookingStatus } from "@/lib/store";
import { notifyEntry } from "@/lib/email-notifications";
import { capturedPaymentSchema, type CapturedPayment } from "@/lib/razorpay-events";
import type { PaymentReceipt } from "@/lib/payment-email-content";

export async function confirmCapturedPayment(input: CapturedPayment) {
  const payment = capturedPaymentSchema.parse(input);
  const booking = payment.order_id ? await getBookingByOrderId(payment.order_id) : null;
  if (booking) {
    if (Math.round(booking.amount * 100) !== payment.amount) throw new Error("Payment amount does not match the booking.");
    if (booking.razorpayPaymentId && booking.razorpayPaymentId !== payment.id) throw new Error("Another payment already confirmed this booking.");
    const paid = booking.status === "paid" ? booking : await updateBookingStatus(booking.id,"paid",{razorpayPaymentId:payment.id});
    if (!paid) throw new Error("Booking no longer exists.");
    await notifyEntry("payment",paid);
    return paid;
  }
  const notes = payment.notes && !Array.isArray(payment.notes) ? payment.notes : {};
  const receipt: PaymentReceipt = { id:payment.id, guestName:typeof notes.name === "string" ? notes.name : typeof notes.guest_name === "string" ? notes.guest_name : "", guestEmail:payment.email || "", amount:payment.amount/100,currency:payment.currency,source:"razorpay",receivedAt:new Date((payment.created_at || Date.now()/1000)*1000).toISOString() };
  await getDb().insert(siteContent).values({key:"payment-receipt:"+payment.id,value:receipt}).onConflictDoNothing();
  const [saved] = await getDb().select().from(siteContent).where(eq(siteContent.key,"payment-receipt:"+payment.id)).limit(1);
  await notifyEntry("payment-receipt",saved.value as PaymentReceipt);
  return null;
}

export async function isConfirmedPayment(paymentId: string) {
  if (!/^pay_[a-zA-Z0-9]+$/.test(paymentId)) return false;
  const [receipt] = await getDb().select().from(siteContent).where(eq(siteContent.key,"payment-receipt:"+paymentId)).limit(1);
  if (receipt && (receipt.value as PaymentReceipt).source === "razorpay") return true;
  return !!await getBookingByPaymentId(paymentId);
}
