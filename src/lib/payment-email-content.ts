import type { Booking } from "./store";
import { bookingPrice, gstPercentFor } from "./booking-pricing";
export type PaymentReceipt = { id: string; guestName: string; guestEmail: string; amount: number; currency: string; reference?: string; receivedAt: string; source: "razorpay" };
const inr = (value: number, currency = "INR") => new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 2 }).format(value);
const nightsOf = (booking: Booking) => booking.checkIn && booking.checkOut ? Math.max(1, Math.round((Date.parse(booking.checkOut) - Date.parse(booking.checkIn)) / 86_400_000)) : 0;

function bookingLines(booking: Booking, itemName?: string) {
  const lines = [`Booking reference: ${booking.id}`, `${booking.type === "stay" ? "Stay" : "Event"}: ${itemName || booking.itemSlug}`];
  if (booking.type === "stay") lines.push(`Check-in: ${booking.checkIn || "Not supplied"}`, `Check-out: ${booking.checkOut || "Not supplied"}`, `Nights: ${nightsOf(booking) || "—"}`, `Rooms / units: ${booking.rooms}`);
  else lines.push(`Event date: ${booking.eventDate || "Not supplied"}`);
  lines.push(`Guests: ${booking.guests}`);
  return lines;
}
function amountLines(booking: Booking) {
  const gstPercent = gstPercentFor(booking.type);
  const base = booking.amount / (1 + gstPercent / 100);
  const split = bookingPrice(Math.round(base * 100) / 100, gstPercent);
  return [`Room charges (excl. GST): ${inr(split.baseAmount)}`, `GST (${gstPercent}%): ${inr(booking.amount - split.baseAmount)}`, `Total: ${inr(booking.amount)}`];
}

export function paymentEmailContent(entry: Booking | PaymentReceipt, customer: boolean, itemName?: string) {
  const booking = "type" in entry;
  const reference = booking ? entry.razorpayPaymentId || entry.id : entry.id;
  const lines = [customer ? `Hello ${entry.guestName || "there"},` : "Payment received for Vinyasa Earth", "", customer && booking ? "Your booking is confirmed and your payment has been received. Thank you!" : "Thank you, payment received.", ...(customer && booking ? [] : ["Our team will confirm the booking details shortly."]), ""];
  if (booking) lines.push(...bookingLines(entry, itemName), "", ...amountLines(entry), `Payment reference: ${reference}`);
  else lines.push(`Reference: ${entry.id}`, `Payment reference: ${reference}`, `Amount received: ${inr(entry.amount, entry.currency)}`, ...(entry.reference ? [`Payment link reference: ${entry.reference}`] : []));
  if (!customer) lines.push("", `Guest: ${entry.guestName || "Not supplied"}`, `Email: ${entry.guestEmail || "Not supplied"}`, ...(booking ? [`Phone: ${entry.guestPhone}`] : []));
  lines.push("", "For help with your booking, contact Vinyasa Earth.");
  return { subject: customer ? "Vinyasa Earth: your booking is confirmed" : "Vinyasa Earth: booking payment received", text: lines.join("\n") };
}

export function failedBookingEmailContent(booking: Booking, customer: boolean, itemName?: string) {
  const reason = booking.failureReason || "Payment was not completed";
  const lines = customer
    ? [`Hello ${booking.guestName || "there"},`, "", "Your payment for Vinyasa Earth could not be completed, so your booking is not confirmed.", "No stay has been reserved. If money was deducted from your account, it is normally refunded automatically by your bank within a few working days; contact us with the reference below if it is not.", "", ...bookingLines(booking, itemName), `Amount: ${inr(booking.amount)}`, "", "You can try again anytime from our website, or reply to this email and we will help you book."]
    : ["A booking payment did not go through.", "", `Reason: ${reason}`, ...bookingLines(booking, itemName), `Amount: ${inr(booking.amount)}`, "", `Guest: ${booking.guestName}`, `Email: ${booking.guestEmail}`, `Phone: ${booking.guestPhone}`, "", "Call or email the guest from Admin > Bookings (filter: Payment failed)."];
  return { subject: customer ? "Vinyasa Earth: your payment was not completed" : "Vinyasa Earth: failed booking payment", text: lines.join("\n") };
}
