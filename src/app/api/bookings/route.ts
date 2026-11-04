import { notifyEntry } from "@/lib/email-notifications";
import { revalidatePath } from "next/cache";
import { bookingPrice, gstPercentFor } from "@/lib/booking-pricing";
import { applyCoupon } from "@/lib/coupon-store";
import { unitsLeft } from "@/lib/stay-availability";
import { NextRequest, NextResponse } from "next/server";
import { bookingRequestSchema } from "@/lib/schemas";
import { getCottages, getEvents } from "@/lib/cms";
import { createBooking, ensureBookingCurrencyPrecision } from "@/lib/store";
import { createOrder } from "@/lib/razorpay";
import { requireAdminSession } from "@/lib/auth";

// Bump when the Way of Living or booking terms text changes materially, so old acceptances stay traceable.
const TERMS_VERSION = "2026-11-v1";

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
  checkOut?: string,
  rooms = 1
): Promise<number | null> {
  if (type === "stay") {
    const cottages = await getCottages();
    const cottage = cottages.find((c) => c.slug === itemSlug);
    if (!cottage) return null;
    return cottage.pricePerNight * nightsBetween(checkIn, checkOut) * rooms;
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
  // Guests must accept the Way of Living and the booking terms before paying; the acceptance is stored with the booking.
  const accepted = body && typeof body === "object" && (body as Record<string, unknown>).acceptGuidelines === true && (body as Record<string, unknown>).acceptTerms === true;
  if (!accepted) return NextResponse.json({ error: "Please accept the Vinyasa Way of Living and the booking terms and cancellation policy to continue." }, { status: 400 });
  const rooms = values.type === "stay" ? values.rooms : 1;
  if (values.type === "stay") {
    try {
      const stays = await getCottages();
      const stay = stays.find((item) => item.slug === values.itemSlug);
      if (!stay) return NextResponse.json({ error: "Could not find that stay." }, { status: 404 });
      if (stay.maxGuests && values.guests > stay.maxGuests * rooms) {
        return NextResponse.json({ error: `${stay.name} fits up to ${stay.maxGuests} guests per unit. Add more units or reduce guests.` }, { status: 400 });
      }
      const left = (await unitsLeft([stay], values.checkIn!, values.checkOut!))[stay.slug];
      if (left !== null && left < rooms) {
        return NextResponse.json({ error: left === 0 ? `${stay.name} is currently not available for these dates. Please choose other dates or another stay.` : `Only ${left} ${left === 1 ? "unit is" : "units are"} left of ${stay.name} for these dates.` }, { status: 409 });
      }
    } catch {
      return NextResponse.json({ error: "Could not check availability. Please try again." }, { status: 503 });
    }
  }

  const baseAmount = await computeAmount(values.type, values.itemSlug, values.checkIn, values.checkOut, rooms);
  if (baseAmount === null || baseAmount <= 0) {
    return NextResponse.json({ error: "Could not price that selection." }, { status: 400 });
  }

  // Coupon comes off the pre-GST amount; GST is then charged on the discounted base.
  let discountedBase = baseAmount;
  if (values.type === "stay" && values.couponCode) {
    const applied = await applyCoupon(values.couponCode, baseAmount).catch(() => null);
    if (!applied) return NextResponse.json({ error: "Could not check the coupon. Please try again." }, { status: 503 });
    if (!applied.ok) return NextResponse.json({ error: applied.error }, { status: 400 });
    discountedBase = Math.round((baseAmount - applied.discount) * 100) / 100;
  }
  const pricing = bookingPrice(discountedBase, gstPercentFor(values.type));
  const amount = pricing.totalAmount;
  try {
    await ensureBookingCurrencyPrecision();
    const order = await createOrder(pricing.totalPaise, `vinyasa-${Date.now()}`);
    const booking = await createBooking({
      type: values.type,
      itemSlug: values.itemSlug,
      checkIn: values.checkIn,
      checkOut: values.checkOut,
      eventDate: values.eventDate,
      guests: values.guests,
      rooms,
      termsAcceptedAt: new Date(),
      termsVersion: TERMS_VERSION,
      guestName: values.guestName,
      guestEmail: values.guestEmail,
      guestPhone: values.guestPhone,
      amount,
      razorpayOrderId: order.id,
    });
    revalidatePath("/admin/bookings");
    await notifyEntry("booking", booking);
    return NextResponse.json({ booking, order, pricing });
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
