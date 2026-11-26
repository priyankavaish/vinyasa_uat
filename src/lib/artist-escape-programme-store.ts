import "server-only";
import { eq, like } from "drizzle-orm";
import { getDb, hasDb } from "@/lib/db";
import { siteContent } from "@/lib/db/schema";
import { BOOKING_HOLD_MINUTES, listBookings } from "@/lib/store";
import { addArtistDays, artistToday, artistWeekStarts, DEFAULT_ARTIST_PROGRAMME, programmeSchema, STAY_WEEKS, type ArtistProgramme, type ArtistStay } from "./artist-escape-programme";

export const ARTIST_APPROVAL_PREFIX = "artist-escape:approval:";
const programmeKey = "artist-escape:programme";
type ProgrammeApproval = { stay?: ArtistStay; bookingId?: string; expiresAt: number };

export async function listProgrammeApprovals() {
  const rows = await getDb().select({ key: siteContent.key, value: siteContent.value })
    .from(siteContent).where(like(siteContent.key, ARTIST_APPROVAL_PREFIX + "%"));
  return rows.map(row => ({ leadId: row.key.slice(ARTIST_APPROVAL_PREFIX.length), ...row.value as ProgrammeApproval }));
}

export async function getArtistProgramme(excludeLeadId?: string) {
  const db = hasDb() ? getDb() : null;
  const [settings, approvals, bookings] = db ? await Promise.all([
    db.select({ value: siteContent.value }).from(siteContent).where(eq(siteContent.key, programmeKey)),
    listProgrammeApprovals(),
    listBookings(),
  ]) : [[], [], []] as const;
  const parsed = programmeSchema.safeParse(settings[0]?.value);
  const programme = parsed.success ? parsed.data : DEFAULT_ARTIST_PROGRAMME;
  const weeks: { arrival: string; held: number; confirmed: number }[] = [];
  for (let arrival = programme.start; arrival <= programme.lastNight; arrival = addArtistDays(arrival, 7)) {
    weeks.push({ arrival, held: 0, confirmed: 0 });
  }
  const byBooking = new Map(bookings.map(row => [row.id, row]));
  const byWeek = new Map(weeks.map(row => [row.arrival, row]));
  const now = Date.now();
  for (const approval of approvals) {
    if (approval.leadId === excludeLeadId) continue;
    if (!approval.stay) continue;
    const booking = approval.bookingId ? byBooking.get(approval.bookingId) : undefined;
    const paid = booking?.status === "paid";
    const pending = booking?.status === "pending" && Date.parse(booking.createdAt) + BOOKING_HOLD_MINUTES * 60_000 > now;
    if (!paid && !pending && approval.expiresAt <= now) continue;
    for (const arrival of artistWeekStarts(approval.stay)) {
      const week = byWeek.get(arrival);
      if (week) week[paid ? "confirmed" : "held"]++;
    }
  }
  const today = artistToday();
  const arrivals = Object.fromEntries(STAY_WEEKS.map(length => [length, weeks
    .filter(({ arrival }) => arrival > today && artistWeekStarts({ arrival, weeks: length }).every(date => {
      const week = byWeek.get(date);
      return week && week.held + week.confirmed < programme.capacity;
    }))
    .map(week => week.arrival)])) as Record<ArtistStay["weeks"], string[]>;
  return { programme, weeks, arrivals };
}

export async function saveArtistProgramme(programme: ArtistProgramme) {
  const state = await getArtistProgramme();
  const occupied = state.weeks.filter(week => week.held + week.confirmed > 0);
  if (occupied.some(week => week.arrival < programme.start || addArtistDays(week.arrival, 6) > programme.lastNight || week.held + week.confirmed > programme.capacity)) {
    throw new Error("The new window or capacity would remove spots already held or confirmed.");
  }
  await getDb().insert(siteContent).values({ key: programmeKey, value: programme })
    .onConflictDoUpdate({ target: siteContent.key, set: { value: programme, updatedAt: new Date() } });
}
