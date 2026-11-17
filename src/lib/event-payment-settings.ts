import { z } from "zod";

export const EVENT_PAYMENT_SENDER = "bookings.vinyasaearth@gmail.com";

export const eventPaymentSettingsSchema = z.object({
  showPopup: z.boolean().default(true),
  emailEnabled: z.boolean().default(true),
  successTitle: z.string().trim().min(1).max(120).default("Thank you, your booking is confirmed."),
  successMessage: z.string().trim().min(1).max(1500).default("Your payment was successful and your event booking is confirmed. Confirmation is emailed automatically to the address entered during payment."),
  failureTitle: z.string().trim().min(1).max(120).default("Payment was not completed"),
  failureMessage: z.string().trim().min(1).max(1500).default("Your payment could not be completed. Your booking is not confirmed. Please try again or contact Vinyasa with your payment reference."),
  successEmailSubject: z.string().trim().min(1).max(180).default("Vinyasa Earth: your event booking is confirmed"),
  successEmailBody: z.string().trim().min(1).max(4000).default("Your payment was successful and your event booking is confirmed. Thank you for joining us."),
  failureEmailSubject: z.string().trim().min(1).max(180).default("Vinyasa Earth: event payment not completed"),
  failureEmailBody: z.string().trim().min(1).max(4000).default("Your event payment was not completed and your booking is not confirmed. Please try again or contact Vinyasa before paying again if money was deducted."),
});
export type EventPaymentSettings = z.infer<typeof eventPaymentSettingsSchema>;
export const DEFAULT_EVENT_PAYMENT_SETTINGS = eventPaymentSettingsSchema.parse({});
export const eventPaymentKey = (slug: string) => "event-payment-settings:" + slug;
export const eventSlugSchema = z.string().regex(/^[a-z0-9][a-z0-9-]{0,100}$/);
export const paymentOutcomeSchema = z.enum(["success", "failed"]);
export type PaymentOutcome = z.infer<typeof paymentOutcomeSchema>;
export function eventPaymentMessages(settings: EventPaymentSettings, outcome: PaymentOutcome) {
  return outcome === "success" ? {title:settings.successTitle,message:settings.successMessage} : {title:settings.failureTitle,message:settings.failureMessage};
}
export function eventPaymentEmail(settings: EventPaymentSettings, outcome: PaymentOutcome, eventName: string, details: {reference?:string;amount?:number;test?:boolean} = {}) {
  const success = outcome === "success";
  const prefix = details.test ? "[TEST - NO PAYMENT] " : "";
  const subject = prefix + (success ? settings.successEmailSubject : settings.failureEmailSubject);
  const text = [details.test ? "TEST EMAIL ONLY: No payment was taken and no booking was confirmed." : "", eventName, "", success ? settings.successEmailBody : settings.failureEmailBody, "", ...(details.reference ? ["Payment reference: " + details.reference] : []), ...(details.amount !== undefined ? ["Amount: INR " + details.amount.toFixed(2)] : []), "", "For help, reply to this email."].filter((line,index) => index !== 0 || line).join("\n");
  return {subject,text};
}
export function razorpayKeyMode(key = ""): "test" | "live" | "unconfigured" {
  return key.startsWith("rzp_test_") ? "test" : key.startsWith("rzp_live_") ? "live" : "unconfigured";
}
export function configuredLinkPayload(slug: string, amount: number, label: string, origin: string) {
  eventSlugSchema.parse(slug);
  const base = new URL(origin);
  if (!['http:', 'https:'].includes(base.protocol)) throw new Error("Invalid website origin.");
  const paise = Math.round(amount * 100);
  if (Math.abs(amount * 100 - paise) > 0.00001) throw new Error("Use at most two decimal places for the amount.");
  if (!Number.isSafeInteger(paise) || paise < 100 || paise > 100000000) throw new Error("Enter an amount between INR 1 and INR 10,00,000.");
  return {amount:paise,currency:"INR",description:label,callback_url:new URL("/events/"+slug,base.origin).href,callback_method:"get",accept_partial:false,notes:{vinyasa_event:slug}};
}

export function eventPaymentTargets(slug:string) {
 const main={value:"event:"+slug,label:"Main event booking button"};
 return slug==="dhun-a-handpan-retreat" ? [{value:"event:dhun-dorm",label:"Reserve Dorm Now"},{value:"event:dhun-cottage",label:"Reserve Cottage Now"},main] : [main];
}
