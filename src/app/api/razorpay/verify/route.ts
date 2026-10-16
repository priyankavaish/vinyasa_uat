import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { razorpayVerifySchema } from "@/lib/schemas";
import { getBooking, updateBookingStatus } from "@/lib/store";
import { capturedPaymentSchema } from "@/lib/razorpay-events";
import { confirmCapturedPayment } from "@/lib/payment-confirmation";
import { fetchRazorpayPayment, verifySignature } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = razorpayVerifySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Malformed payment confirmation." }, { status: 400 });
  }
  const { bookingId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = parsed.data;

  const booking = await getBooking(bookingId);
  if (!booking) {
    return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  }

  // The client's claim about whether this is a mock payment is never trusted —
  // whether this booking is "mock" is decided by the order id WE stored when
  // the order was created server-side, and the order id in this request must
  // match it exactly.
  if (razorpay_order_id !== booking.razorpayOrderId) {
    console.warn("[api/razorpay/verify] order id mismatch", { bookingId, got: razorpay_order_id });
    return NextResponse.json({ error: "Payment could not be verified." }, { status: 400 });
  }

  const isMockOrder = booking.razorpayOrderId?.startsWith("order_mock") ?? false;

  if (isMockOrder && process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Payment could not be verified." }, { status: 400 });
  }

  if (!isMockOrder) {
    const valid = verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    if (!valid) {
      console.warn("[api/razorpay/verify] signature verification failed", { bookingId });
      return NextResponse.json({ error: "Payment could not be verified." }, { status: 400 });
    }
  }

  if (!isMockOrder) {
    try {
      const payment = capturedPaymentSchema.safeParse(await fetchRazorpayPayment(razorpay_payment_id));
      if (!payment.success || payment.data.order_id !== booking.razorpayOrderId) return NextResponse.json({error:"Payment confirmation is pending."},{status:409});
      const paid = await confirmCapturedPayment(payment.data);
      revalidatePath("/admin/bookings");
      return NextResponse.json({booking:paid});
    } catch { return NextResponse.json({error:"Payment could not be confirmed."},{status:503}); }
  }
  // Local development only; mock orders cannot send payment confirmation emails.
  const updated = await updateBookingStatus(bookingId, "paid", { razorpayPaymentId: razorpay_payment_id });
  return NextResponse.json({booking:updated});
}
