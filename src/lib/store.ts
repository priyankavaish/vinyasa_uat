import { and, desc, eq, lt, inArray, sql } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { bookings as bookingsTable, leads as leadsTable } from "@/lib/db/schema";

// Bookings + leads persistence. Backed by Neon Postgres (Drizzle). The
// function surface is unchanged from the old JSONL store so the API routes
// and admin pages did not need to change.

export type Booking = {
  id: string;
  type: "stay" | "event";
  itemSlug: string;
  checkIn?: string;
  checkOut?: string;
  eventDate?: string;
  guests: number;
  rooms: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  amount: number;
  status: "pending" | "paid" | "failed";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  failureReason?: string;
  termsAcceptedAt?: string;
  termsVersion?: string;
  createdAt: string;
};

export type Lead = {
  id: string;
  source: "contact" | "corporate" | "newsletter" | "volunteer" | "artist-escape" | "artist-residence" | "artist-unite" | "organizer" | "stay-enquiry" | "work-from-farm";
  name: string;
  email: string;
  phone?: string;
  message?: string;
  createdAt: string;
};

type BookingRow = typeof bookingsTable.$inferSelect;
type LeadRow = typeof leadsTable.$inferSelect;

function toBooking(r: BookingRow): Booking {
  return {
    id: r.id,
    type: r.type as Booking["type"],
    itemSlug: r.itemSlug,
    checkIn: r.checkIn ?? undefined,
    checkOut: r.checkOut ?? undefined,
    eventDate: r.eventDate ?? undefined,
    guests: r.guests,
    rooms: r.rooms ?? 1,
    guestName: r.guestName,
    guestEmail: r.guestEmail,
    guestPhone: r.guestPhone,
    amount: r.amount,
    status: r.status as Booking["status"],
    razorpayOrderId: r.razorpayOrderId ?? undefined,
    razorpayPaymentId: r.razorpayPaymentId ?? undefined,
    failureReason: r.failureReason ?? undefined,
    termsAcceptedAt: r.termsAcceptedAt?.toISOString(),
    termsVersion: r.termsVersion ?? undefined,
    createdAt: r.createdAt.toISOString(),
  };
}

function toLead(r: LeadRow): Lead {
  return {
    id: r.id,
    source: r.source as Lead["source"],
    name: r.name,
    email: r.email,
    phone: r.phone ?? undefined,
    message: r.message ?? undefined,
    createdAt: r.createdAt.toISOString(),
  };
}

/** How long an unpaid booking holds its stock before the unit is released. */
export const BOOKING_HOLD_MINUTES = 20;

// Older databases predate multi-unit stay bookings and failure reasons; add the
// columns once per connection (idempotent) before any bookings query runs.
const bookingColumns = new WeakMap<object, Promise<void>>();
export async function ensureBookingColumns() {
  const db = getDb();
  let ready = bookingColumns.get(db);
  if (!ready) {
    ready = db.execute(sql.raw("ALTER TABLE bookings ADD COLUMN IF NOT EXISTS rooms integer NOT NULL DEFAULT 1"))
      .then(() => db.execute(sql.raw("ALTER TABLE bookings ADD COLUMN IF NOT EXISTS failure_reason text")))
      .then(() => db.execute(sql.raw("ALTER TABLE bookings ADD COLUMN IF NOT EXISTS terms_accepted_at timestamptz")))
      .then(() => db.execute(sql.raw("ALTER TABLE bookings ADD COLUMN IF NOT EXISTS terms_version text")))
      .then(() => {});
    bookingColumns.set(db, ready);
    ready.catch(() => bookingColumns.delete(db));
  }
  await ready;
}

/** Unpaid bookings past the hold window become "failed" so the dashboard shows them and stock frees up. */
export async function expireStaleBookings() {
  await ensureBookingColumns();
  const cutoff = new Date(Date.now() - BOOKING_HOLD_MINUTES * 60_000);
  await getDb().update(bookingsTable)
    .set({ status: "failed", failureReason: "Payment was not completed" })
    .where(and(eq(bookingsTable.status, "pending"), lt(bookingsTable.createdAt, cutoff)));
}

export async function createBooking(
  input: Omit<Booking, "id" | "createdAt" | "status" | "failureReason" | "termsAcceptedAt" | "termsVersion"> & { termsAcceptedAt?: Date; termsVersion?: string }
): Promise<Booking> {
  await ensureBookingColumns();
  const db = getDb();
  const [row] = await db
    .insert(bookingsTable)
    .values({
      type: input.type,
      itemSlug: input.itemSlug,
      checkIn: input.checkIn,
      checkOut: input.checkOut,
      eventDate: input.eventDate,
      guests: input.guests,
      rooms: input.rooms,
      guestName: input.guestName,
      guestEmail: input.guestEmail,
      guestPhone: input.guestPhone,
      amount: input.amount,
      status: "pending",
      razorpayOrderId: input.razorpayOrderId,
      razorpayPaymentId: input.razorpayPaymentId,
      termsAcceptedAt: input.termsAcceptedAt,
      termsVersion: input.termsVersion,
    })
    .returning();
  return toBooking(row);
}

export async function updateBookingStatus(
  id: string,
  status: Booking["status"],
  extra?: Partial<Pick<Booking, "razorpayOrderId" | "razorpayPaymentId" | "failureReason">>
): Promise<Booking | null> {
  await ensureBookingColumns();
  const db = getDb();
  const [row] = await db
    .update(bookingsTable)
    .set({ status, ...(status === "paid" ? { failureReason: null } : {}), ...extra })
    .where(eq(bookingsTable.id, id))
    .returning();
  return row ? toBooking(row) : null;
}

export async function getBooking(id: string): Promise<Booking | null> {
  await ensureBookingColumns();
  const db = getDb();
  const [row] = await db.select().from(bookingsTable).where(eq(bookingsTable.id, id)).limit(1);
  return row ? toBooking(row) : null;
}

export async function listBookings(): Promise<Booking[]> {
  await expireStaleBookings();
  const db = getDb();
  const rows = await db.select().from(bookingsTable).orderBy(desc(bookingsTable.createdAt));
  return rows.map(toBooking);
}

/** Bookings that were created but never paid (widget closed, tab abandoned).
 *  `olderThanMinutes` avoids counting a payment that is still in flight. */
export async function countAbandonedBookings(olderThanMinutes = 15): Promise<number> {
  const db = getDb();
  const cutoff = new Date(Date.now() - olderThanMinutes * 60_000);
  const [row] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(bookingsTable)
    .where(
      and(
        inArray(bookingsTable.status, ["pending", "failed"]),
        lt(bookingsTable.createdAt, cutoff)
      )
    );
  return row?.n ?? 0;
}

export async function createLead(input: Omit<Lead, "id" | "createdAt">): Promise<Lead> {
  const db = getDb();
  const [row] = await db
    .insert(leadsTable)
    .values({
      source: input.source,
      name: input.name,
      email: input.email,
      phone: input.phone,
      message: input.message,
    })
    .returning();
  return toLead(row);
}

export async function listLeads(): Promise<Lead[]> {
  const db = getDb();
  const rows = await db.select().from(leadsTable).orderBy(desc(leadsTable.createdAt));
  return rows.map(toLead);
}

// Older installations stored whole rupees. Preserve their existing values while
// allowing exact GST totals in paise; run this idempotent upgrade once per connection.
const precisionUpgrades = new WeakMap<object, Promise<void>>();
export async function ensureBookingCurrencyPrecision() {
  const db = getDb();
  let upgrade = precisionUpgrades.get(db);
  if (!upgrade) {
    upgrade = db.execute(sql.raw("DO $$\nBEGIN\n  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = current_schema() AND table_name = 'bookings' AND column_name = 'amount' AND data_type <> 'numeric') THEN\n    ALTER TABLE bookings ALTER COLUMN amount TYPE numeric(12,2) USING amount::numeric(12,2);\n  END IF;\nEND $$;\n")).then(() => {});
    precisionUpgrades.set(db, upgrade);
    upgrade.catch(() => precisionUpgrades.delete(db));
  }
  await upgrade;
}

export async function getBookingByOrderId(orderId: string): Promise<Booking | null> {
  await ensureBookingColumns();
  const [row] = await getDb().select().from(bookingsTable).where(eq(bookingsTable.razorpayOrderId, orderId)).limit(1);
  return row ? toBooking(row) : null;
}

export async function getBookingByPaymentId(paymentId: string): Promise<Booking | null> {
  await ensureBookingColumns();
  const [row] = await getDb().select().from(bookingsTable).where(and(eq(bookingsTable.razorpayPaymentId, paymentId),eq(bookingsTable.status,"paid"))).limit(1);
  return row ? toBooking(row) : null;
}
