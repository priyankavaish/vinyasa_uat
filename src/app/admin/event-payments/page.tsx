import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth-server";
import { getAllEvents } from "@/lib/cms";
import { loadEventPaymentSettings, loadEventPaymentLinks } from "@/lib/admin/event-payment-store";
import { gmailAccountConfigured, gmailSenderReady } from "@/lib/gmail-send";
import { getEmailConfig } from "@/lib/email-notifications";
import { razorpayKeyMode, EVENT_PAYMENT_SENDER } from "@/lib/event-payment-settings";
import EventPaymentSetup from "@/components/admin/event-payment-setup";
export const dynamic="force-dynamic";
export default async function EventPaymentsPage({searchParams}:{searchParams:Promise<{event?:string}>}) {
  if(!await getSessionUser())redirect("/admin/login");
  const links=await loadEventPaymentLinks();
  const events=await getAllEvents();const query=await searchParams;
  const settings=Object.fromEntries(await Promise.all(events.map(async event=>[event.slug,await loadEventPaymentSettings(event.slug)])));
  const fallback=gmailAccountConfigured("bookings") ? null : await getEmailConfig();
  const emailConfigured=gmailAccountConfigured("bookings")||fallback?.sender.trim().toLowerCase()===EVENT_PAYMENT_SENDER;
  const emailReady=gmailAccountConfigured("bookings") ? await gmailSenderReady("bookings") : null;
  return <EventPaymentSetup links={links} events={events.map(event=>({slug:event.slug,name:event.name,price:event.priceFrom}))} settings={settings} initialSlug={query.event} mode={razorpayKeyMode(process.env.RAZORPAY_KEY_ID)} emailConfigured={emailConfigured} emailReady={emailReady} local={process.env.NODE_ENV!=="production"} />;
}
