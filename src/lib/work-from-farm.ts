import { bookingPrice } from "./booking-pricing";
import { plainText } from "./editorial/text";

export const WORK_FROM_FARM_BOOK_PATH = "/work-from-farm/book";
export type FarmStay = { name: string; description: string; icon: string; rows: { label: string; price: string }[] };
export type FarmOffer = FarmStay & { id: string };
export const farmStayId = (name: string) => plainText(name).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
export const farmOffers = (stays: FarmStay[]): FarmOffer[] => stays.map((stay, index) => ({ ...stay, id: farmStayId(stay.name) || `stay-${index + 1}` }));
export const farmMoney = (amount: number) => "\u20b9" + amount.toLocaleString("en-IN", { maximumFractionDigits: 2 });
export function farmToday() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}
function dateTime(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return NaN;
  const time = Date.parse(value + "T00:00:00Z");
  return Number.isFinite(time) && new Date(time).toISOString().slice(0, 10) === value ? time : NaN;
}
export const farmDateValid = (value: string) => Number.isFinite(dateTime(value));
export function farmNights(checkIn: string, checkOut: string) {
  const nights = (dateTime(checkOut) - dateTime(checkIn)) / 86400000;
  return Number.isInteger(nights) && nights > 0 ? nights : 0;
}
export function farmUnit(stay: FarmStay): "person" | "cottage" | null {
  const price = plainText(stay.rows[0]?.price || "").toLowerCase();
  if (/\b(person|bed)\b/.test(price)) return "person";
  if (/\b(cottage|mudhouse|mud\s+house|room)\b/.test(price)) return "cottage";
  return null;
}
function rateForNights(stay: FarmStay, nights: number) {
  for (const row of stay.rows) {
    const label = plainText(row.label).trim();
    const range = label.match(/^(\d+)\s*[-\u2013\u2014]\s*(\d+)\s*nights?\b/i);
    const longer = label.match(/^(\d+)\s*(?:\+|nights?\s*(?:or longer|and above|or more|and more))/i);
    const matches = range ? nights >= Number(range[1]) && nights <= Number(range[2]) : longer ? nights >= Number(longer[1]) : false;
    if (!matches) continue;
    const amount = plainText(row.price).match(/(?:\u20b9|INR|Rs\.?)[\s]*([\d,]+(?:\.\d{1,2})?)/i);
    const rate = amount ? Number(amount[1].replaceAll(",", "")) : NaN;
    return Number.isFinite(rate) && rate > 0 ? { rate, label: plainText(row.label) } : null;
  }
  return null;
}

/** Rates come from the same CMS rows shown on Work from Farm, never the stays catalogue. */
export function farmQuote(stay: FarmStay, nights: number, guests: number, cottages: number) {
  if (!Number.isInteger(nights) || nights < 1 || !Number.isInteger(guests) || guests < 1 || guests > 50) return null;
  const unit = farmUnit(stay);
  if (!unit) return null;
  if (unit === "cottage" && (!Number.isInteger(cottages) || cottages < Math.ceil(guests / 2) || cottages > 50)) return null;
  const tier = rateForNights(stay, nights);
  if (!tier) return null;
  const units = unit === "person" ? guests : cottages;
  const base = tier.rate * nights * units;
  if (!Number.isSafeInteger(Math.round(base * 100))) return null;
  return { ...tier, unit, units, nights, ...bookingPrice(base) };
}
export function farmEnquiryMessage(stay: FarmOffer, details: { checkInDate: string; checkOutDate: string; guests: string; rooms: string; message?: string }) {
  const nights = farmNights(details.checkInDate, details.checkOutDate);
  const quote = farmQuote(stay, nights, Number(details.guests), Number(details.rooms));
  return [
    "Work from Farm enquiry",
    "Accommodation: " + plainText(stay.name),
    `Dates: ${details.checkInDate} to ${details.checkOutDate} (${nights} nights)`,
    "Guests: " + details.guests,
    ...(farmUnit(stay) === "cottage" ? ["Cottages: " + details.rooms] : []),
    ...(quote ? [
      `Work from Farm rate: ${farmMoney(quote.rate)} / ${quote.unit} / night (${quote.label})`,
      "Accommodation subtotal: " + farmMoney(quote.baseAmount),
      "GST (18%): " + farmMoney(quote.gstAmount),
      "Estimated total: " + farmMoney(quote.totalAmount),
    ] : ["Published Work from Farm rates:", ...stay.rows.map(row => plainText(row.label) + ": " + plainText(row.price)), "Estimate: team to confirm."]),
    "Meals are optional and charged separately.",
    "Availability and booking will be confirmed by the team.",
    ...(details.message ? ["", "Guest notes: " + details.message] : []),
  ].join("\n");
}
