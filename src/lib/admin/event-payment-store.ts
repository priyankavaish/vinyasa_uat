import { eventLinkContextSchema } from "@/lib/event-checkout";
import "server-only";
import { eq, like, desc } from "drizzle-orm";
import { getDb, hasDb } from "@/lib/db";
import { siteContent } from "@/lib/db/schema";
import { DEFAULT_EVENT_PAYMENT_SETTINGS, eventPaymentKey, eventPaymentSettingsSchema, type EventPaymentSettings } from "@/lib/event-payment-settings";
export async function loadEventPaymentSettings(slug: string) {
  if (!hasDb()) return DEFAULT_EVENT_PAYMENT_SETTINGS;
  const [row] = await getDb().select({value:siteContent.value}).from(siteContent).where(eq(siteContent.key,eventPaymentKey(slug))).limit(1);
  const parsed = eventPaymentSettingsSchema.safeParse(row?.value);
  if(!parsed.success)return DEFAULT_EVENT_PAYMENT_SETTINGS;
  const settings=parsed.data;
  const legacy={successTitle:"Thank you, payment received.",successMessage:"Your payment was successful. The Vinyasa team will confirm your event booking details shortly.",successEmailSubject:"Vinyasa Earth: event payment received",successEmailBody:"Thank you for your payment. Our team will confirm the event booking details shortly."};
  for(const key of Object.keys(legacy) as (keyof typeof legacy)[])if(settings[key]===legacy[key])settings[key]=DEFAULT_EVENT_PAYMENT_SETTINGS[key];
  return settings;
}
export async function saveEventPaymentSettings(slug: string, settings: EventPaymentSettings) {
  const key=eventPaymentKey(slug), value=eventPaymentSettingsSchema.parse(settings);
  await getDb().insert(siteContent).values({key,value,updatedAt:new Date()}).onConflictDoUpdate({target:siteContent.key,set:{value,updatedAt:new Date()}});
}
export async function eventForPaymentLink(linkId: string) {
  if (!/^plink_[a-zA-Z0-9]+$/.test(linkId) || !hasDb()) return null;
  const [row] = await getDb().select({value:siteContent.value}).from(siteContent).where(eq(siteContent.key,"event-payment-link:"+linkId)).limit(1);
  const value=row?.value as {eventSlug?:string;url?:string} | undefined;
  return value?.eventSlug || null;
}

export async function loadEventPaymentLinks() {
  if(!hasDb()) return [];
  const rows=await getDb().select({value:siteContent.value}).from(siteContent).where(like(siteContent.key,"event-payment-link:%")).orderBy(desc(siteContent.updatedAt)).limit(20);
  return rows.map(row=>row.value as {eventSlug:string;label:string;url:string;mode:string}).filter(value=>value && typeof value.eventSlug === "string" && typeof value.url === "string" && /^https:\/\/(?:rzp\.io|(?:[a-z0-9-]+\.)?razorpay\.com)\//i.test(value.url));
}

export async function loadEventPaymentLink(id:string) {
 if(!/^plink_[a-zA-Z0-9]+$/.test(id)||!hasDb())return null;
 const [row]=await getDb().select({value:siteContent.value}).from(siteContent).where(eq(siteContent.key,"event-payment-link:"+id)).limit(1);
 const parsed=eventLinkContextSchema.safeParse(row?.value);return parsed.success?parsed.data:null;
}
export async function loadEventCheckoutLinks(slug:string) {
 if(!hasDb())return [];
 const rows=await getDb().select({key:siteContent.key,value:siteContent.value}).from(siteContent).where(like(siteContent.key,"event-payment-link:%"));
 return rows.flatMap(row=>{const parsed=eventLinkContextSchema.safeParse(row.value);return parsed.success&&parsed.data.eventSlug===slug?[{id:row.key.slice("event-payment-link:".length),...parsed.data}]:[];});
}
export async function eventForPaymentOrder(id:string) {
 if(!/^order_[a-zA-Z0-9]+$/.test(id)||!hasDb())return null;
 const [row]=await getDb().select({value:siteContent.value}).from(siteContent).where(eq(siteContent.key,"event-payment-order:"+id)).limit(1);
 return (row?.value as {eventSlug?:string}|undefined)?.eventSlug||null;
}
