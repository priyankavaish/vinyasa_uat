import { listEmailStates } from "@/lib/email-notifications";
import EmailDelivery from "@/components/admin/email-delivery";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth-server";
import { listBookings } from "@/lib/store";
import { hasDb } from "@/lib/db";
import { getCottages, getAllEvents } from "@/lib/cms";
import BookingsManager from "@/components/admin/bookings-manager";
export const dynamic = "force-dynamic";
export default async function AdminBookingsPage() {
  if (!await getSessionUser()) redirect("/admin/login");
  if (!hasDb()) return <p className="text-sm text-foreground-soft">Database not configured.</p>;
  const [bookings, cottages, events] = await Promise.all([listBookings(), getCottages(), getAllEvents()]);
  const states = await listEmailStates(["booking", "payment", "payment-customer", "payment-receipt", "payment-receipt-customer"]);
  return <><BookingsManager bookings={bookings.map(b => ({ ...b, itemName: (b.type === "stay" ? cottages : events).find(i => i.slug === b.itemSlug)?.name ?? b.itemSlug }))} /><EmailDelivery states={states} /></>;
}
