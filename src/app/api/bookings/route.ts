import { readStayInventory } from "@/lib/stay-inventory";
import { NextRequest, NextResponse } from "next/server";
import { bookingRequestSchema } from "@/lib/schemas";
import { getCottages, getEvents } from "@/lib/cms";
import { createBooking } from "@/lib/store";
import { createOrder } from "@/lib/razorpay";
import { requireAdminSession } from "@/lib/auth";

function nightsBetween(checkIn?: string, checkOut?: string): number {
  if (!checkIn || !checkOut) return 1;
  const ms = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
}

// Amount is always computed server-side from the price list, never trusted
// from the client — a tampered client `amount` must not be able to buy a
// ₹9,000 cottage for ₹1.
async function computeAmount(
  type: "stay" | "event",
  itemSlug: string,
  checkIn?: string,
  checkOut?: string
): Promise<number | null> {
  if (type === "stay") {
    const cottages = await getCottages();
    const cottage = cottages.find((c) => c.slug === itemSlug);
    if (!cottage) return null;
    return cottage.pricePerNight * nightsBetween(checkIn, checkOut);
  }
  const events = await getEvents();
  const event = events.find((e) => e.slug === itemSlug);
  if (!event) return null;
  return event.priceFrom;
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = bookingRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the highlighted fields.", fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  const values = parsed.data;
  if (values.type === "stay") {
    try {
      const inventory = await readStayInventory();
      if (inventory[values.itemSlug] === 0) {
        return NextResponse.json({ error: "This stay is sold out. Please choose another stay." }, { status: 409 });
      }
    } catch {
      return NextResponse.json({ error: "Could not check availability. Please try again." }, { status: 503 });
    }
  }

  const amount = await computeAmount(values.type, values.itemSlug, values.checkIn, values.checkOut);
  if (amount === null || amount <= 0) {
    return NextResponse.json({ error: "Could not price that selection." }, { status: 400 });
  }

  try {
    const order = await createOrder(amount * 100, `vinyasa-${Date.now()}`);
    const booking = await createBooking({
      type: values.type,
      itemSlug: values.itemSlug,
      checkIn: values.checkIn,
      checkOut: values.checkOut,
      eventDate: values.eventDate,
      guests: values.guests,
      guestName: values.guestName,
      guestEmail: values.guestEmail,
      guestPhone: values.guestPhone,
      amount,
      razorpayOrderId: order.id,
    });
    return NextResponse.json({ booking, order });
  } catch (err) {
    console.error("[api/bookings] failed to create booking", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const unauthorized = await requireAdminSession(req);
  if (unauthorized) return unauthorized;
  const { listBookings } = await import("@/lib/store");
  const bookings = await listBookings();
  return NextResponse.json({ bookings });
}
