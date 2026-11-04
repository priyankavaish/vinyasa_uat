import "server-only";
import { and, eq, gt, inArray, lt, or } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { bookings } from "@/lib/db/schema";
import { readStayInventory } from "@/lib/stay-inventory";
import { blockedSlugs, listStayBlocks } from "@/lib/stay-blocks";
import { BOOKING_HOLD_MINUTES, ensureBookingColumns, expireStaleBookings } from "@/lib/store";

const DAY = 86_400_000;
const nightsOf = (checkIn: string, checkOut: string) => {
  const nights: string[] = [];
  for (let time = Date.parse(checkIn); time < Date.parse(checkOut); time += DAY) nights.push(new Date(time).toISOString().slice(0, 10));
  return nights;
};

/** Units of each stay already taken on every night of the range: paid bookings plus unpaid ones still inside the hold window. */
export async function bookedUnitsPerNight(slugs: string[], checkIn: string, checkOut: string) {
  await expireStaleBookings();
  await ensureBookingColumns();
  const holdCutoff = new Date(Date.now() - BOOKING_HOLD_MINUTES * 60_000);
  const rows = slugs.length ? await getDb().select().from(bookings).where(and(
    eq(bookings.type, "stay"), inArray(bookings.itemSlug, slugs),
    lt(bookings.checkIn, checkOut), gt(bookings.checkOut, checkIn),
    or(eq(bookings.status, "paid"), and(eq(bookings.status, "pending"), gt(bookings.createdAt, holdCutoff))),
  )) : [];
  const nights = nightsOf(checkIn, checkOut);
  const result: Record<string, number> = {};
  for (const slug of slugs) {
    const mine = rows.filter(row => row.itemSlug === slug);
    result[slug] = Math.max(0, ...nights.map(night => mine.filter(row => row.checkIn! <= night && night < row.checkOut!).reduce((sum, row) => sum + (row.rooms ?? 1), 0)));
  }
  return result;
}

/** Units still free for the whole stay; null means the stay has no stock limit configured.
 *  Stock is read uncached so a stale page can never oversell. */
export async function unitsLeft(stays: { slug: string }[], checkIn: string, checkOut: string) {
  const inventory = await readStayInventory();
  const limited = stays.filter(stay => typeof inventory[stay.slug] === "number");
  const booked = await bookedUnitsPerNight(limited.map(stay => stay.slug), checkIn, checkOut);
  const closed = await blockedSlugs(checkIn, checkOut);
  return Object.fromEntries(stays.map(stay => {
    if (closed.has(stay.slug)) return [stay.slug, 0];
    const total = inventory[stay.slug];
    return [stay.slug, typeof total === "number" ? Math.max(0, total - (booked[stay.slug] ?? 0)) : null];
  })) as Record<string, number | null>;
}

/** Free units per stay for each night in [from, to): number of free units, or null when the stay has no stock limit.
 *  Nights closed by the admin report 0. Used by the admin availability calendar. */
export async function nightlyAvailability(slugs: string[], from: string, to: string) {
  await expireStaleBookings();
  await ensureBookingColumns();
  const holdCutoff = new Date(Date.now() - BOOKING_HOLD_MINUTES * 60_000);
  const [inventory, blocks, rows] = await Promise.all([
    readStayInventory(),
    listStayBlocks(),
    slugs.length ? getDb().select().from(bookings).where(and(
      eq(bookings.type, "stay"), inArray(bookings.itemSlug, slugs),
      lt(bookings.checkIn, to), gt(bookings.checkOut, from),
      or(eq(bookings.status, "paid"), and(eq(bookings.status, "pending"), gt(bookings.createdAt, holdCutoff))),
    )) : [],
  ]);
  const result: Record<string, Record<string, number | null>> = {};
  for (const slug of slugs) {
    const days: Record<string, number | null> = {};
    for (const night of nightsOf(from, to)) {
      const total = inventory[slug];
      const closed = blocks.some(b => b.slug === slug && b.from <= night && night <= b.to);
      const booked = rows.filter(row => row.itemSlug === slug && row.checkIn! <= night && night < row.checkOut!).reduce((sum, row) => sum + (row.rooms ?? 1), 0);
      days[night] = closed ? 0 : typeof total === "number" ? Math.max(0, total - booked) : null;
    }
    result[slug] = days;
  }
  return result;
}
