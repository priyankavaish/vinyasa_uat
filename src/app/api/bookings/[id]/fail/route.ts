import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { notifyEntry } from "@/lib/email-notifications";
import { getBooking, updateBookingStatus } from "@/lib/store";

const body = z.object({ reason: z.enum(["cancelled", "failed"]), detail: z.string().trim().max(300).optional() });
const REASONS = { cancelled: "Customer closed the payment window", failed: "Payment failed at the bank / gateway" } as const;

// Called by the checkout page when the payment window is closed or Razorpay reports a failure.
// A booking that is already paid is never touched; the stock hold is released by the status change.
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const parsed = body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  const id = (await params).id;
  if (!z.string().uuid().safeParse(id).success) return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  const booking = await getBooking(id);
  if (!booking) return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  if (booking.status !== "pending") return NextResponse.json({ booking });
  const reason = REASONS[parsed.data.reason] + (parsed.data.detail ? ": " + parsed.data.detail : "");
  const failed = await updateBookingStatus(id, "failed", { failureReason: reason });
  if (!failed) return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  revalidatePath("/admin/bookings");
  await notifyEntry("booking-failed", failed).catch(() => {});
  return NextResponse.json({ booking: failed });
}
