import { z } from "zod";
import { bookingPrice, STAY_GST_PERCENT } from "./booking-pricing";

export const STAY_WEEKS = [1, 2, 4] as const;
const DAY = 86_400_000;

export const programmeSchema = z.object({
  start: z.iso.date(),
  lastNight: z.iso.date(),
  capacity: z.coerce.number().int().min(1).max(10),
}).refine(({ start, lastNight }) => {
  const days = (Date.parse(lastNight) - Date.parse(start)) / DAY + 1;
  return new Date(start).getUTCDay() === 1 && days >= 7 && days <= 364 && days % 7 === 0;
}, "Start on a Monday and end on a Sunday within 52 weeks.");

export const DEFAULT_ARTIST_PROGRAMME = { start: "2026-12-14", lastNight: "2027-01-17", capacity: 10 };
export type ArtistProgramme = z.infer<typeof programmeSchema>;

export const artistStaySchema = z.object({
  weeks: z.union([z.literal(1), z.literal(2), z.literal(4)]),
  arrival: z.iso.date(),
});
export type ArtistStay = z.infer<typeof artistStaySchema>;
export const artistApplicationSchema = artistStaySchema.extend({
  name: z.string().trim().min(1).max(120),
  phone: z.string().trim().regex(/^\+[1-9][0-9 ()-]+$/, "Include your country code, starting with +.")
    .refine(value => /^\+[1-9]\d{6,14}$/.test(value.replace(/[ ()-]/g, "")), "Enter a valid WhatsApp number."),
  email: z.email().max(150),
  intent: z.string().trim().min(1).max(2000),
  portfolio: z.url({ protocol: /^https?$/ }).max(500),
});

export function addArtistDays(date: string, days: number) {
  return new Date(Date.parse(date) + days * DAY).toISOString().slice(0, 10);
}
export function artistToday() {
  return new Date(Date.now() + 19_800_000).toISOString().slice(0, 10);
}
export function artistWeekStarts(stay: ArtistStay) {
  return Array.from({ length: stay.weeks }, (_, index) => addArtistDays(stay.arrival, 7 * index));
}
export function formatArtistDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(date));
}
export function programmeQuote(stay: ArtistStay) {
  const nights = stay.weeks * 7;
  const rate = 900;
  const deposit = bookingPrice(rate, STAY_GST_PERCENT);
  const full = bookingPrice(rate * nights, STAY_GST_PERCENT);
  return {
    ...full, nights, rate, gstPercent: STAY_GST_PERCENT, planId: "programme", planName: stay.weeks + (stay.weeks === 1 ? " week" : " weeks"),
    deposit, dueOnArrival: (full.totalPaise - deposit.totalPaise) / 100,
  };
}

export function requestedArtistStay(message?: string | null) {
  const [duration = "", arrival = ""] = (message ?? "").split(/\r?\n/, 2);
  const result = artistStaySchema.safeParse({
    weeks: Number(/^Stay length: (1|2|4) weeks?$/.exec(duration)?.[1]),
    arrival: /^Arrival Monday: (\d{4}-\d{2}-\d{2})$/.exec(arrival)?.[1],
  });
  return result.success ? result.data : null;
}
