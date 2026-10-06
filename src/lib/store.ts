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
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  amount: number;
  status: "pending" | "paid" | "failed";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  createdAt: string;
};

export type Lead = {
  id: string;
  source: "contact" | "corporate" | "newsletter" | "volunteer" | "artist-escape";
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
    guestName: r.guestName,
    guestEmail: r.guestEmail,
    guestPhone: r.guestPhone,
    amount: r.amount,
    status: r.status as Booking["status"],
    razorpayOrderId: r.razorpayOrderId ?? undefined,
    razorpayPaymentId: r.razorpayPaymentId ?? undefined,
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

export async function createBooking(
  input: Omit<Booking, "id" | "createdAt" | "status">
): Promise<Booking> {
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
      guestName: input.guestName,
      guestEmail: input.guestEmail,
      guestPhone: input.guestPhone,
      amount: input.amount,
      status: "pending",
      razorpayOrderId: input.razorpayOrderId,
      razorpayPaymentId: input.razorpayPaymentId,
    })
    .returning();
  return toBooking(row);
}

export async function updateBookingStatus(
  id: string,
  status: Booking["status"],
  extra?: Partial<Pick<Booking, "razorpayOrderId" | "razorpayPaymentId">>
): Promise<Booking | null> {
  const db = getDb();
  const [row] = await db
    .update(bookingsTable)
    .set({ status, ...extra })
    .where(eq(bookingsTable.id, id))
    .returning();
  return row ? toBooking(row) : null;
}

export async function getBooking(id: string): Promise<Booking | null> {
  const db = getDb();
  const [row] = await db.select().from(bookingsTable).where(eq(bookingsTable.id, id)).limit(1);
  return row ? toBooking(row) : null;
}

export async function listBookings(): Promise<Booking[]> {
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
