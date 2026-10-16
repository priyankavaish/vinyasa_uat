import type { Booking } from "./store";
export type PaymentReceipt = { id: string; guestName: string; guestEmail: string; amount: number; currency: string; reference?: string; receivedAt: string; source: "razorpay" };
export function paymentEmailContent(entry: Booking | PaymentReceipt, customer: boolean) {
  const booking = "type" in entry;
  const reference = booking ? entry.razorpayPaymentId || entry.id : entry.id;
  const lines = [customer ? `Hello ${entry.guestName || "there"},` : "Payment received for Vinyasa Earth", "", "Thank you, payment received.", "Our team will confirm the booking details shortly.", "", `Reference: ${entry.id}`, `Payment reference: ${reference}`, `Amount received: ${new Intl.NumberFormat("en-IN", {style:"currency",currency:booking ? "INR" : entry.currency}).format(entry.amount)}`];
  if (booking) lines.push(`Stay / event: ${entry.itemSlug}`, `Guests: ${entry.guests}`, ...(entry.type === "stay" ? [`Check-in: ${entry.checkIn || "Not supplied"}`, `Check-out: ${entry.checkOut || "Not supplied"}`] : [`Event date: ${entry.eventDate || "Not supplied"}`]));
  else if (entry.reference) lines.push(`Payment link reference: ${entry.reference}`);
  if (!customer) lines.push(`Guest: ${entry.guestName || "Not supplied"}`, `Email: ${entry.guestEmail || "Not supplied"}`, ...(booking ? [`Phone: ${entry.guestPhone}`] : []));
  lines.push("", "For help with your booking, contact Vinyasa Earth.");
  return {subject: customer ? "Vinyasa Earth: your booking payment confirmation" : "Vinyasa Earth: booking payment received",text:lines.join("\n")};
}
