import EventPaymentMessages from "./event-payment-messages";
import { DEFAULT_EVENT_PAYMENT_SETTINGS } from "@/lib/event-payment-settings";
import { loadEventPaymentSettings } from "@/lib/admin/event-payment-store";

export default async function EventPaymentFields({ event }: { event: { slug: string } }) {
  const settings = event.slug ? await loadEventPaymentSettings(event.slug) : DEFAULT_EVENT_PAYMENT_SETTINGS;
  return <EventPaymentMessages key={event.slug} settings={settings} />;
}
